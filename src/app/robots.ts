import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (["deploy-preview", "branch-deploy"].includes(process.env.CONTEXT || "")) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: ["/dashboard", "/api/", "/.netlify/"] }, sitemap: absoluteUrl("/sitemap.xml"), host: absoluteUrl("/") };
}
