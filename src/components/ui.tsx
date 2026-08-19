import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function SectionHeading({ eyebrow, title, body, align = "left" }: { eyebrow: string; title: string; body?: string; align?: "left" | "center" }) {
  return (
    <div className={`section-heading ${align === "center" ? "section-heading--center" : ""}`}>
      <p className="eyebrow"><span />{eyebrow}</p>
      <h2>{title}</h2>
      {body ? <p className="section-copy">{body}</p> : null}
    </div>
  );
}

export function ButtonLink({ href, children, variant = "primary", external = false }: { href: string; children: ReactNode; variant?: "primary" | "secondary" | "text"; external?: boolean }) {
  const className = `button button--${variant}`;
  const content = <>{children}<ArrowUpRight aria-hidden="true" size={17} /></>;
  return external
    ? <a className={className} href={href} target="_blank" rel="noreferrer">{content}</a>
    : <Link className={className} href={href}>{content}</Link>;
}
