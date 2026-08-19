import { Boxes, Braces, ShoppingBag, Workflow } from "lucide-react";
import { portfolio, isConfigured } from "@/data/portfolio";
import { ButtonLink } from "./ui";

export function Hero() {
  const emailHref = isConfigured(portfolio.person.email) ? `mailto:${portfolio.person.email}` : "#contact";
  return (
    <section className="hero shell" id="top">
      <div className="hero-content">
        <div className="availability"><span aria-hidden="true" />{portfolio.person.availability}</div>
        <p className="hero-kicker">{portfolio.person.title}</p>
        <h1>Development capacity for <em>web, e-commerce</em> and automation.</h1>
        <p className="hero-lede">I help agencies and product teams build and maintain WordPress websites, Shopify and WooCommerce stores, custom web applications, backend systems and workflow automations.</p>
        <p className="hero-stack" aria-label="Core technologies">WordPress <span>·</span> WooCommerce <span>·</span> Shopify <span>·</span> React <span>·</span> Next.js <span>·</span> Node.js <span>·</span> n8n</p>
        <div className="hero-actions">
          <ButtonLink href="#work">View my work</ButtonLink>
          <ButtonLink href={emailHref} variant="secondary">Let&apos;s talk</ButtonLink>
        </div>
      </div>
      <div className="hero-visual" aria-label="A visual overview of connected development capabilities">
        <div className="visual-glow" />
        <div className="workspace-window">
          <div className="window-bar"><span /><span /><span /><p>delivery-stack / overview</p></div>
          <div className="workspace-main">
            <div className="workspace-top"><div><small>DELIVERY OVERVIEW</small><strong>From client websites to custom systems.</strong></div><span>AVAILABLE</span></div>
            <div className="workspace-cards">
              <div><Braces /><small>Agency websites</small><b>WordPress · Elementor · Divi</b></div>
              <div><ShoppingBag /><small>E-commerce</small><b>WooCommerce · Shopify</b></div>
              <div><Boxes /><small>Custom software</small><b>React · Next.js · APIs</b></div>
            </div>
            <div className="workspace-flow">
              <Workflow />
              <div><small>AUTOMATION</small><strong>Connect tools and remove repetitive work.</strong></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
