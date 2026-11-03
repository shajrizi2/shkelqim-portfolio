import { GoogleAuth } from "google-auth-library";

export class GoogleApiError extends Error {
  constructor(public readonly status: number) { super(`Google API request failed (${status}).`); }
}
export interface GoogleTransport { post<T>(url: string, body: unknown): Promise<T> }

export function googleTransport(credentialsJson: string): GoogleTransport {
  const credentials = JSON.parse(credentialsJson);
  if (credentials.type !== "service_account" || typeof credentials.private_key !== "string" || !credentials.client_email?.endsWith(".gserviceaccount.com")) throw new Error("Invalid server service-account configuration.");
  const auth = new GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/analytics.readonly", "https://www.googleapis.com/auth/webmasters.readonly"],
  });
  return {
    async post<T>(url: string, body: unknown): Promise<T> {
      // Endpoints are constructed by server report code, never accepted from requests.
      const client = await auth.getClient();
      const token = await client.getAccessToken();
      if (!token.token) throw new Error("Google access token unavailable.");
      const response = await fetch(url, {
        method: "POST", headers: { Authorization: `Bearer ${token.token}`, "Content-Type": "application/json" },
        body: JSON.stringify(body), signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok) throw new GoogleApiError(response.status);
      return response.json() as Promise<T>;
    },
  };
}
