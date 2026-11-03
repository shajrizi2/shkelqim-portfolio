const fallbackSiteUrl = "https://hajrizi.dev";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

const candidate = (
  configuredSiteUrl
    ? configuredSiteUrl.startsWith("http://") || configuredSiteUrl.startsWith("https://")
      ? configuredSiteUrl
      : `https://${configuredSiteUrl}`
    : fallbackSiteUrl
).replace(/\/+$/, "");

const parsed = new URL(candidate);
if (parsed.protocol !== "https:" && parsed.hostname !== "localhost" && parsed.hostname !== "127.0.0.1") {
  throw new Error("NEXT_PUBLIC_SITE_URL must use HTTPS");
}
if (parsed.username || parsed.password || parsed.pathname !== "/" || parsed.search || parsed.hash) {
  throw new Error("NEXT_PUBLIC_SITE_URL must be an origin without credentials, a path, query or fragment");
}
export const siteUrl = parsed.origin;

export const absoluteUrl = (pathname: string) =>
  new URL(pathname, `${siteUrl}/`).toString();
