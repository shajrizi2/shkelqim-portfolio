import type { Metadata } from "next";
import { portfolio, projects, type Project } from "@/data/portfolio";
import { absoluteUrl, siteUrl } from "./site-url";

export const homeSeo = {
  title: "Shkelqim Hajrizi | Senior Full-Stack & AI Engineer",
  description: "Senior full-stack developer and AI automation engineer in Kosovo, Europe. Next.js, React, NestJS and n8n for remote teams and digital agencies, with US-hours overlap.",
};
export const workSeo = {
  title: "Software & AI Automation Projects | Shkelqim Hajrizi",
  description: "Explore Shkelqim Hajrizi's SaaS, AI automation, WordPress and Shopify projects, with architecture, integrations and engineering decisions for each case study.",
};
const projectTitles: Record<string, string> = {
  hyrjedalje: "HyrjeDalje: NestJS Workforce SaaS | Shkelqim Hajrizi",
  wondertales: "WonderTales: Next.js AI Story Platform | Shkelqim Hajrizi",
  "kosovo-police": "Kosovo Police: WordPress Engineering | Shkelqim Hajrizi",
  "menmin-made": "Menmin Made: Shopify & AI Integration | Shkelqim Hajrizi",
  "order-extraction": "AI Order Extraction & Automation | Shkelqim Hajrizi",
};

export function pageMetadata(title: string, description: string, pathname: string, image = "portfolio"): Metadata {
  const url = absoluteUrl(pathname);
  const shareImage = absoluteUrl(`/social/${image}.png`);
  const index = !["deploy-preview", "branch-deploy"].includes(process.env.CONTEXT || "");
  return {
    title: { absolute: title }, description,
    alternates: { canonical: url },
    robots: { index, follow: true, googleBot: { index, follow: true, "max-image-preview": "large" } },
    openGraph: {
      type: "website", locale: "en_US", url, siteName: portfolio.person.name,
      title, description,
      images: [{ url: shareImage, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [{ url: shareImage, alt: title }] },
  };
}

export const projectMetadata = (project: Project) => pageMetadata(
  projectTitles[project.slug] ?? project.seoTitle,
  project.seoDescription,
  `/work/${project.slug}/`, project.slug,
);

export const personId = `${siteUrl}/#person`;
export const websiteId = `${siteUrl}/#website`;
export const identityGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person", "@id": personId, name: portfolio.person.name,
      url: `${siteUrl}/`, jobTitle: "Senior Full-Stack Developer and AI Automation Engineer",
      homeLocation: { "@type": "Place", name: "Kosovo, Europe" },
      sameAs: [portfolio.person.linkedin, portfolio.person.github],
      knowsAbout: ["React", "Next.js", "TypeScript", "Node.js", "NestJS", "PostgreSQL", "AI integration", "n8n automation", "WordPress", "Shopify", "API integration"],
    },
    { "@type": "WebSite", "@id": websiteId, url: `${siteUrl}/`, name: portfolio.person.name, publisher: { "@id": personId }, inLanguage: "en" },
  ],
};

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: absoluteUrl(item.path) })),
  };
}

export function projectGraph(project: Project) {
  const url = absoluteUrl(`/work/${project.slug}/`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage", "@id": `${url}#webpage`, url, name: project.seoTitle,
        description: project.seoDescription, isPartOf: { "@id": websiteId },
        mainEntity: { "@id": `${url}#case-study` },
      },
      {
        "@type": "CreativeWork", "@id": `${url}#case-study`, url,
        name: project.name, headline: project.headline, description: project.shortDescription,
        author: { "@id": personId }, inLanguage: "en", keywords: project.technologies,
        ...(project.thumbnail ? { image: absoluteUrl(project.thumbnail) } : {}),
        mainEntityOfPage: { "@id": `${url}#webpage` },
      },
      breadcrumbs([{ name: "Home", path: "/" }, { name: "Work", path: "/work/" }, { name: project.name, path: `/work/${project.slug}/` }]),
    ],
  };
}

export const collectionGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage", "@id": absoluteUrl("/work/#webpage"), url: absoluteUrl("/work/"),
      name: workSeo.title, description: workSeo.description, isPartOf: { "@id": websiteId },
      mainEntity: { "@type": "ItemList", itemListElement: projects.map((project, i) => ({ "@type": "ListItem", position: i + 1, name: project.name, url: absoluteUrl(`/work/${project.slug}/`) })) },
    },
    breadcrumbs([{ name: "Home", path: "/" }, { name: "Work", path: "/work/" }]),
  ],
};
