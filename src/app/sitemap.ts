import type { MetadataRoute } from "next";
import { isConfigured, portfolio, projects } from "@/data/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = isConfigured(portfolio.person.domain)
    ? portfolio.person.domain.startsWith("http") ? portfolio.person.domain : `https://${portfolio.person.domain}`
    : "http://localhost:3000";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    ...projects.map((project) => ({
      url: `${base}/work/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: project.featured ? 0.8 : 0.6,
    })),
  ];
}
