import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Shkelqim Hajrizi — Senior Full-Stack & AI Engineer for Agencies", template: "%s — Shkelqim Hajrizi" },
  description: "Senior technical partner for agencies: AI integrations, automation, custom software, integrations and client websites, white-label, with US hours overlap.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", locale: "en_US", url: "/", siteName: "Shkelqim Hajrizi",
    title: "Shkelqim Hajrizi — Senior Full-Stack & AI Engineer for Agencies",
    description: "AI, automation, custom software and web delivery for agencies.",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Shkelqim Hajrizi — Senior Full-Stack & AI Engineer for Agencies" }],
  },
  twitter: {
    card: "summary_large_image", title: "Shkelqim Hajrizi — Senior Full-Stack & AI Engineer for Agencies",
    description: "AI, automation, custom software and web delivery for agencies.", images: ["/opengraph-image.png"],
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, colorScheme: "dark", themeColor: "#0b0d0f" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
