import type { MetadataRoute } from "next";
import { projects } from "@/data/portfolio";
import { absoluteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/work/"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    ...projects.map((project) => ({
      url: absoluteUrl(`/work/${project.slug}/`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: project.featured ? 0.8 : 0.6,
    })),
  ];
}
