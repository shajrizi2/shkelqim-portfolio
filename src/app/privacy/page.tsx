import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { pageMetadata } from "@/lib/seo";
import { AnalyticsPreferencesButton } from "@/components/analytics-consent";

export const metadata = pageMetadata("Privacy & Analytics | Shkelqim Hajrizi", "How hajrizi.dev handles optional Google Analytics, consent preferences, contact links and private dashboard access.", "/privacy/");

export default function PrivacyPage() {
  return <>
    <Navbar homeNavigation />
    <main className="privacy-page shell" id="main-content" tabIndex={-1}>
      <p className="eyebrow">hajrizi.dev</p><h1>Privacy &amp; analytics</h1>
      <p>This portfolio is operated by Shkelqim Hajrizi in Kosovo, Europe. For privacy questions or requests, <a href="mailto:shajrizi2@gmail.com">email Shkelqim</a>.</p>
      <h2>Optional website analytics</h2>
      <p>When Google Analytics 4 is configured, it loads only after you accept optional analytics. It records page visits, general device and country information, acquisition channels and clicks on portfolio, email, booking and professional-profile links. Link clicks are interest signals; a booking-link click is not a confirmed booking.</p>
      <p>Analytics events do not include email or phone destinations, message contents, form values or account identities. Page URLs are stripped of fragments and unrelated query parameters. Use campaign links without names, emails or other personal information.</p>
      <h2>Your choices</h2>
      <p>Accepting and rejecting are equally available. Your choice is stored locally for up to 180 days. You can change it below; rejecting stops this site&apos;s optional tracking and clears its Google Analytics cookies. Browser Do Not Track and Global Privacy Control signals disable optional analytics.</p>
      <AnalyticsPreferencesButton />
      <h2>Google and data retention</h2>
      <p>Accepted analytics are processed by Google and may be processed outside your country. Storage and retention follow the Google Analytics property settings. Read <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google&apos;s privacy policy</a> and <a href="https://support.google.com/analytics/answer/6004245" target="_blank" rel="noopener noreferrer">how Google Analytics handles data</a>. Blocking analytics does not limit access to this portfolio.</p>
      <h2>Contact and external services</h2>
      <p>Email opens your email application; booking, social and project links open the named third-party service. Their privacy policies apply there. This site has no contact form or message-storage backend. Hosting providers may process request information needed to deliver and secure the site.</p>
      <h2>Private dashboard</h2>
      <p>The owner-only analytics dashboard uses Google sign-in and secure session cookies for access. It does not load website analytics. Google Search Console reports Google Search performance separately from website traffic.</p>
      <p><Link href="/">Return to the portfolio →</Link></p>
    </main>
    <Footer />
  </>;
}
