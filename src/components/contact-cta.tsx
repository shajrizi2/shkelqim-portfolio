import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { portfolio } from "@/data/portfolio";

export function ContactCta() {
  const { calendly, email, linkedin, github, phone } = portfolio.person;

  return (
    <section className="contact-section" id="contact">
      <div className="contact-inner shell">
        <p className="eyebrow"><span />Start a conversation</p>
        <h2>Something technical your team <em>can&apos;t take on?</em></h2>
        <p>Book a 30-minute call or send a short email about the project. I usually reply within one business day.</p>
        <div className="contact-actions">
          <a className="button button--light" href={calendly} target="_blank" rel="noopener noreferrer">Book a Call <ArrowUpRight aria-hidden="true" size={17} /></a>
          <a className="button button--dark" href={`mailto:${email}`}><Mail aria-hidden="true" size={17} />Email Me</a>
          <div className="contact-secondary">
            <a href={linkedin} target="_blank" rel="noopener noreferrer"><Linkedin aria-hidden="true" size={16} />LinkedIn <ArrowUpRight aria-hidden="true" size={14} /></a>
          </div>
        </div>
        <div className="contact-supporting">
          <a className="contact-phone" href={phone.href}>Phone · {phone.display}</a>
          <a className="contact-github" href={github} target="_blank" rel="noopener noreferrer"><Github aria-hidden="true" size={14} />GitHub <ArrowUpRight aria-hidden="true" size={12} /></a>
        </div>
      </div>
    </section>
  );
}
