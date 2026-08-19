import { Check } from "lucide-react";
import { ButtonLink, SectionHeading } from "./ui";

const agencyTasks = ["WordPress / Elementor / Divi", "WooCommerce / Shopify", "Landing pages and responsive fixes", "Custom React / Next.js frontend", "Backend APIs and integrations", "Automation and maintenance"];

export function AgencySupport() {
  return (
    <section className="section shell" id="agency">
      <div className="agency-panel">
        <div className="agency-copy">
          <SectionHeading eyebrow="For digital agencies" title="Extra development capacity for your agency." />
          <p>Hand off the development work your team does not have capacity for—from WordPress and e-commerce client work to custom applications, integrations and automation.</p>
          <p>I can plug into your workflow as an embedded developer, overflow partner or ongoing technical support.</p>
          <ButtonLink href="#contact">Discuss agency support</ButtonLink>
        </div>
        <div className="agency-task-list" aria-label="Agency work I can take on">
          {agencyTasks.map((task) => <div key={task}><span><Check size={17} /></span><p>{task}</p></div>)}
        </div>
      </div>
    </section>
  );
}
