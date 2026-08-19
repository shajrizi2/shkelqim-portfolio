import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { portfolio } from "@/data/portfolio";

export function ContactCta() {
  const { email, linkedin, github, phone } = portfolio.person;

  return (
    <section className="contact-section" id="contact">
      <div className="contact-inner shell">
        <p className="eyebrow"><span />Start a conversation</p>
        <h2>Need extra development <em>capacity?</em></h2>
        <p>Let&apos;s talk about your projects and where I can help.</p>
        <div className="contact-actions">
          <a className="button button--light" href={`mailto:${email}`}><Mail aria-hidden="true" size={17} />Email Me</a>
          <div className="contact-secondary">
            <a href={linkedin} target="_blank" rel="noopener noreferrer"><Linkedin aria-hidden="true" size={16} />LinkedIn <ArrowUpRight aria-hidden="true" size={14} /></a>
            <a href={github} target="_blank" rel="noopener noreferrer"><Github aria-hidden="true" size={16} />GitHub <ArrowUpRight aria-hidden="true" size={14} /></a>
          </div>
        </div>
        <a className="contact-phone" href={phone.href}>Phone · {phone.display}</a>
      </div>
    </section>
  );
}
