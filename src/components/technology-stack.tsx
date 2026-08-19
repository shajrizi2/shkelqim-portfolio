import { Braces, Database, PanelsTopLeft, Server, ShoppingBag, Sparkles } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { SectionHeading } from "./ui";

const icons = [PanelsTopLeft, ShoppingBag, Database, Server, Sparkles];

export function TechnologyStack() {
  return (
    <section className="section stack-section" id="stack">
      <div className="shell">
        <SectionHeading eyebrow="Technology stack" title="A practical stack for modern products and everyday client work." body="Technologies are tools, not the pitch. This range lets me move between CMS work, custom software, production systems and connected workflows." />
        <div className="stack-list">
          {portfolio.stack.map((group, index) => {
            const Icon = icons[index] ?? Braces;
            return <article key={group.name}>
              <div className="stack-name"><span><Icon /></span><h3>{group.name}</h3></div>
              <div className="stack-items">{group.items.map((item) => <span key={item}>{item}</span>)}</div>
            </article>;
          })}
        </div>
        <div className="ai-note"><span>AI-assisted engineering</span><p>I use tools such as Codex CLI and Claude Code to accelerate implementation, testing, debugging and repetitive tasks. Architecture, review, quality and delivery remain my responsibility.</p></div>
      </div>
    </section>
  );
}
