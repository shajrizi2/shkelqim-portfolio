import { BrainCircuit, CodeXml, LayoutTemplate, ServerCog, ShoppingCart, Wrench, Workflow } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { SectionHeading } from "./ui";

const icons = { ai: BrainCircuit, layout: LayoutTemplate, cart: ShoppingCart, window: CodeXml, server: ServerCog, workflow: Workflow, wrench: Wrench };

export function Capabilities() {
  return (
    <section className="section shell" id="services">
      <SectionHeading eyebrow="What I can handle" title="Work you can hand off to me." body="If it involves software, AI, automation, integrations or web systems, there's a good chance I can take it off your plate." />
      <div className="capability-grid">
        {portfolio.capabilities.map((item) => {
          const Icon = icons[item.icon];
          return <article className="capability-card" key={item.number}>
            <div className="capability-top"><span><Icon aria-hidden="true" /></span><small>{item.number}</small></div>
            <h3>{item.title}</h3><p>{item.text}</p>
          </article>;
        })}
      </div>
    </section>
  );
}
