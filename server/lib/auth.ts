import { createHmac, createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { OAuth2Client } from "google-auth-library";

export const SESSION_COOKIE = "__Host-analytics_session";
export const FLOW_COOKIE = "__Host-analytics_oauth";
export const SESSION_SECONDS = 3600;
export type AuthConfig = { origin: string; clientId: string; clientSecret: string; secret: string; owners: string[] };
type SignedValue = { kind: "session" | "oauth"; exp: number; iat: number; [key: string]: unknown };
export type Identity = { email: string; verified: boolean; nonce: string; subject: string };
export interface IdentityProvider {
  authorizationUrl: (params: { state: string; nonce: string; challenge: string }) => string;
  exchange: (code: string, verifier: string) => Promise<Identity>;
}

export function authConfig(env: Record<string, string | undefined>): AuthConfig | null {
  if (env.DASHBOARD_AUTH_ENABLED !== "true" || !env.GOOGLE_OAUTH_CLIENT_ID || !env.GOOGLE_OAUTH_CLIENT_SECRET || !env.DASHBOARD_SESSION_SECRET || env.DASHBOARD_SESSION_SECRET.length < 43 || !env.DASHBOARD_ALLOWED_EMAILS || !env.DASHBOARD_ORIGIN) return null;
  try {
    const url = new URL(env.DASHBOARD_ORIGIN);
    if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) return null;
    const owners = env.DASHBOARD_ALLOWED_EMAILS.split(",").map(email => email.trim().toLowerCase()).filter(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    if (!owners.length) return null;
    return { origin: url.origin, clientId: env.GOOGLE_OAUTH_CLIENT_ID, clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET, secret: env.DASHBOARD_SESSION_SECRET, owners };
  } catch { return null; }
}

export function signValue(value: SignedValue, config: AuthConfig) {
  const payload = Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${payload}.${createHmac("sha256", config.secret).update(payload).digest("base64url")}`;
}
export function readValue(token: string | undefined, kind: SignedValue["kind"], config: AuthConfig, now = Date.now()): SignedValue | null {
  if (!token || token.length > 4096) return null;
  try {
    const [payload, signature, extra] = token.split(".");
    if (!payload || !signature || extra) return null;
    const expected = createHmac("sha256", config.secret).update(payload).digest();
    const actual = Buffer.from(signature, "base64url");
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
    const value: SignedValue = JSON.parse(Buffer.from(payload, "base64url").toString());
    const seconds = Math.floor(now / 1000);
    if (value.kind !== kind || !Number.isInteger(value.exp) || !Number.isInteger(value.iat) || value.exp <= seconds || value.iat > seconds + 30 || value.exp - value.iat > (kind === "session" ? SESSION_SECONDS : 600)) return null;
    return value;
  } catch { return null; }
}
export function readCookies(request: Request) {
  return Object.fromEntries((request.headers.get("cookie") || "").split(";").map(cookie => cookie.trim().split(/=(.*)/).slice(0, 2)).filter(([name, value]) => name && value !== undefined));
}
export function cookie(name: string, value: string, seconds: number, sameSite = "Strict", httpOnly = true) {
  return `${name}=${value}; Path=/; Max-Age=${seconds}; Secure; SameSite=${sameSite}${httpOnly ? "; HttpOnly" : ""}`;
}
export function authorized(request: Request, config: AuthConfig) {
  const value = readValue(readCookies(request)[SESSION_COOKIE], "session", config);
  return value && typeof value.email === "string" && config.owners.includes(value.email) && typeof value.sub === "string" ? value : null;
}
export function newSession(identity: Identity, config: AuthConfig) {
  const iat = Math.floor(Date.now() / 1000);
  return signValue({ kind: "session", email: identity.email.toLowerCase(), sub: identity.subject, iat, exp: iat + SESSION_SECONDS }, config);
}
export function newFlow(config: AuthConfig) {
  const iat = Math.floor(Date.now() / 1000);
  const state = randomBytes(32).toString("base64url");
  const nonce = randomBytes(32).toString("base64url");
  const verifier = randomBytes(48).toString("base64url");
  return {
    state, nonce, verifier, challenge: createHash("sha256").update(verifier).digest("base64url"),
    signed: signValue({ kind: "oauth", state, nonce, verifier, iat, exp: iat + 600 }, config),
  };
}
export function googleIdentityProvider(config: AuthConfig): IdentityProvider {
  const callback = `${config.origin}/dashboard/auth/callback`;
  const client = new OAuth2Client(config.clientId, config.clientSecret, callback);
  return {
    authorizationUrl: ({ state, nonce, challenge }) => {
      const url = new URL(client.generateAuthUrl({
        scope: ["openid", "email"], state, prompt: "select_account", access_type: "online",
      }));
      url.searchParams.set("nonce", nonce);
      url.searchParams.set("code_challenge", challenge);
      url.searchParams.set("code_challenge_method", "S256");
      return url.toString();
    },
    async exchange(code, verifier) {
      const { tokens } = await client.getToken({ code, codeVerifier: verifier, redirect_uri: callback });
      if (!tokens.id_token) throw new Error("Missing Google identity token.");
      const ticket = await client.verifyIdToken({ idToken: tokens.id_token, audience: config.clientId });
      const identity = ticket.getPayload();
      if (!identity?.email || !identity.sub) throw new Error("Invalid Google identity.");
      return { email: identity.email, verified: identity.email_verified === true, subject: identity.sub, nonce: String((identity as unknown as Record<string, unknown>).nonce || "") };
    },
  };
}
