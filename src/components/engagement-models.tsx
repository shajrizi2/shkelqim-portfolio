import { ArrowUpRight } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { SectionHeading } from "./ui";

export function EngagementModels() {
  return (
    <section className="section shell">
      <SectionHeading eyebrow="Ways to work together" title="Flexible support, aligned with how your team delivers." body="Ongoing capacity is the priority, with focused project work available when it makes sense." />
      <div className="engagement-grid">
        {portfolio.engagements.map((item) => <article key={item.number}><span>{item.number}</span><ArrowUpRight /><h3>{item.title}</h3><p>{item.text}</p></article>)}
      </div>
      <div className="agency-cta"><div><small>FOR AGENCY OWNERS</small><h3>More client work than your team can comfortably handle?</h3><p>Add development capacity across WordPress, WooCommerce, Shopify, custom applications and automation.</p></div><a className="button button--secondary" href="#contact">Let&apos;s talk <ArrowUpRight size={17} /></a></div>
    </section>
  );
}
