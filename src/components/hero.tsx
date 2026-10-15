import { Boxes, BrainCircuit, LayoutTemplate, Wrench } from "lucide-react";
import { portfolio, isConfigured } from "@/data/portfolio";
import { ButtonLink } from "./ui";

export function Hero() {
  const emailHref = isConfigured(portfolio.person.email) ? `mailto:${portfolio.person.email}` : "#contact";
  return (
    <section className="hero shell" id="top">
      <div className="hero-content">
        <div className="availability"><span aria-hidden="true" />{portfolio.person.availability}</div>
        <p className="hero-kicker">{portfolio.person.title}</p>
        <h1>The senior engineer your agency calls <em>when it gets technical.</em></h1>
        <p className="hero-lede">I help agencies deliver the work their team can&apos;t take on: AI integrations, automation, custom software, complex integrations and client sites. White-label or under my name, with daily overlap on US working hours.</p>
        <p className="hero-stack" aria-label="Core capabilities">AI &amp; LLMs <span>·</span> Automation <span>·</span> Custom software <span>·</span> APIs &amp; integrations <span>·</span> WordPress &amp; Shopify</p>
        <div className="hero-actions">
          <ButtonLink href="#work">View my work</ButtonLink>
          <ButtonLink href={portfolio.person.calendly} variant="secondary" external>Book a Call</ButtonLink>
        </div>
        <a className="hero-email-link" href={emailHref}>Email me instead</a>
      </div>
      <div className="hero-visual" aria-label="A visual overview of connected technical capabilities">
        <div className="visual-glow" />
        <div className="workspace-window">
          <div className="window-bar"><span /><span /><span /><p>delivery-stack / overview</p></div>
          <div className="workspace-main">
            <div className="workspace-top"><div><small>ONE TECHNICAL PARTNER</small><strong>From AI features to client sites.</strong></div><span>AVAILABLE</span></div>
            <div className="workspace-cards">
              <div><BrainCircuit /><small>AI &amp; automation</small><b>OpenAI · Claude · n8n</b></div>
              <div><Boxes /><small>Custom software</small><b>Next.js · NestJS · Python</b></div>
              <div><LayoutTemplate /><small>Sites &amp; stores</small><b>WordPress · Shopify</b></div>
            </div>
            <div className="workspace-flow">
              <Wrench />
              <div><small>HARD PROBLEMS</small><strong>Legacy code, integrations and real-time systems.</strong></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
