import { Check } from "lucide-react";
import { ButtonLink, SectionHeading } from "./ui";

const agencyTasks = ["AI features clients are asking for", "Automation for clients or your own ops", "Custom apps, portals and dashboards", "Backend, APIs and integrations", "WordPress / WooCommerce / Shopify", "Legacy code and production issues"];

export function AgencySupport() {
  return (
    <section className="section shell" id="agency">
      <div className="agency-panel">
        <div className="agency-copy">
          <SectionHeading eyebrow="For digital agencies" title="Senior capacity without a US hire." />
          <p>Sold an AI project with no one to build it? Developer left mid-project? Client asking for an integration outside your team&apos;s stack? Hand it to me. One senior engineer who covers what would otherwise take several specialists.</p>
          <p>I work white-label inside your tools and process, overlap with US working hours, and cost far less than adding an equivalent senior engineer in the US, so the work stays profitable for you.</p>
          <ButtonLink href="#contact">Discuss agency support</ButtonLink>
        </div>
        <div className="agency-task-list" aria-label="Agency work I can take on">
          {agencyTasks.map((task) => <div key={task}><span><Check size={17} /></span><p>{task}</p></div>)}
        </div>
      </div>
    </section>
  );
}
