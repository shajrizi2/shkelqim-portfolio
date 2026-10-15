import { CheckCircle2 } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { SectionHeading } from "./ui";

const deliveryPath = ["Frontend", "Backend", "Database", "Deployment", "Maintenance", "Automation"];

export function About() {
  return (
    <section className="section production-section" id="about">
      <div className="shell">
        <SectionHeading eyebrow="About + technical range" title="From build to production." body="6+ years shipping production software for international teams, from multi-tenant SaaS to AI products and real-time device control." />
        <div className="delivery-path" aria-label="Delivery capability from frontend through automation">
          {deliveryPath.map((step, index) => <div key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></div>)}
        </div>
        <div className="production-intro">
          <div>
            <p>I&apos;m a senior full-stack engineer based in Europe. I&apos;ve led a small development team as architect, built AI products and AI-driven automations, modernized legacy applications, and shipped everything from WordPress sites to Electron apps controlling smart-home hardware.</p>
            <p>That range is the point: your agency gets one person who can pick up whatever lands on the table, join existing codebases quickly, and own the work through to production.</p>
          </div>
          <div className="about-checks"><span><CheckCircle2 /> Existing codebases</span><span><CheckCircle2 /> Independent ownership</span><span><CheckCircle2 /> Long-term collaboration</span><span><CheckCircle2 /> Production support</span></div>
        </div>
        <div className="stack-heading" id="stack"><span>Technology coverage</span><p>The tools are organized here for quick technical verification.</p></div>
        <div className="stack-grid">
          {portfolio.stack.map((group) => <article key={group.name}><h3>{group.name}</h3><p>{group.items.join(" · ")}</p></article>)}
        </div>
      </div>
    </section>
  );
}
