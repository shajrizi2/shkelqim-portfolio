import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Shkelqim Hajrizi — Full-Stack Developer & Automation Engineer", template: "%s — Shkelqim Hajrizi" },
  description: "Full-stack developer helping agencies and product teams build WordPress websites, e-commerce stores, modern web applications, backend systems and workflow automations.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", locale: "en_US", url: "/", siteName: "Shkelqim Hajrizi",
    title: "Shkelqim Hajrizi — Full-Stack Developer & Automation Engineer",
    description: "Web, e-commerce, software and automation development for agencies and product teams.",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Shkelqim Hajrizi — Full-Stack Developer & Automation Engineer" }],
  },
  twitter: {
    card: "summary_large_image", title: "Shkelqim Hajrizi — Full-Stack Developer & Automation Engineer",
    description: "Web, e-commerce, software and automation development for agencies and product teams.", images: ["/opengraph-image.png"],
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
