import type { MetadataRoute } from "next";
import { isConfigured, portfolio } from "@/data/portfolio";

export default function robots(): MetadataRoute.Robots {
  const base = isConfigured(portfolio.person.domain)
    ? portfolio.person.domain.startsWith("http") ? portfolio.person.domain : `https://${portfolio.person.domain}`
    : "http://localhost:3000";
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${base}/sitemap.xml` };
}
