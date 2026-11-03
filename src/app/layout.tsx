import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteUrl } from "@/lib/site-url";
import { homeSeo, pageMetadata, identityGraph } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { AnalyticsConsent } from "@/components/analytics-consent";

export const metadata: Metadata = {
  ...pageMetadata(homeSeo.title, homeSeo.description, "/"),
  metadataBase: new URL(siteUrl),
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, colorScheme: "dark", themeColor: "#0b0d0f" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <JsonLd data={identityGraph} />
        {children}
        <AnalyticsConsent />
      </body>
    </html>
  );
}
