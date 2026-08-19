const fallbackSiteUrl = "http://localhost:3000";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteUrl = (
  configuredSiteUrl
    ? configuredSiteUrl.startsWith("http://") || configuredSiteUrl.startsWith("https://")
      ? configuredSiteUrl
      : `https://${configuredSiteUrl}`
    : fallbackSiteUrl
).replace(/\/+$/, "");

export const absoluteUrl = (pathname: string) =>
  new URL(pathname, `${siteUrl}/`).toString();
