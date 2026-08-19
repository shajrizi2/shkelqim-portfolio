import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { SelectedWork } from "@/components/selected-work";
import { Capabilities } from "@/components/capabilities";
import { AgencySupport } from "@/components/agency-support";
import { AutomationWorkflow } from "@/components/automation-workflow";
import { About } from "@/components/about";
import { ContactCta } from "@/components/contact-cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SelectedWork />
        <Capabilities />
        <AgencySupport />
        <AutomationWorkflow />
        <About />
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
