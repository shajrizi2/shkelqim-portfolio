import { portfolio } from "@/data/portfolio";
import { SectionHeading } from "./ui";

export function HowIWork() {
  return (
    <section className="section shell">
      <SectionHeading eyebrow="How I work" title="Clear ownership from context to production." body="A straightforward delivery process that works for a defined project or ongoing collaboration." />
      <div className="process-grid">
        {portfolio.process.map((item) => <article key={item.number}><span>{item.number}</span><div className="process-line" /><h3>{item.title}</h3><p>{item.text}</p></article>)}
      </div>
    </section>
  );
}
