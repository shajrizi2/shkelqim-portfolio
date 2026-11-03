import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { SelectedWork } from "@/components/selected-work";
import { Capabilities } from "@/components/capabilities";
import { AgencySupport } from "@/components/agency-support";
import { EngagementModels } from "@/components/engagement-models";
import { AutomationWorkflow } from "@/components/automation-workflow";
import { About } from "@/components/about";
import { ContactCta } from "@/components/contact-cta";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { personId, websiteId, homeSeo } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site-url";

export default function Home() {
  return (
    <>
      <Navbar />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "ProfilePage", "@id": absoluteUrl("/#webpage"), url: absoluteUrl("/"), name: homeSeo.title, mainEntity: { "@id": personId }, isPartOf: { "@id": websiteId } }} />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <SelectedWork />
        <Capabilities />
        <AgencySupport />
        <EngagementModels />
        <AutomationWorkflow />
        <About />
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
