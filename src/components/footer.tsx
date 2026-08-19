import Link from "next/link";
import { portfolio } from "@/data/portfolio";

export function Footer() {
  const { email, linkedin, github, phone } = portfolio.person;
  const contacts = [
    { label: "Email", href: `mailto:${email}`, external: false },
    { label: "LinkedIn", href: linkedin, external: true },
    { label: "GitHub", href: github, external: true },
    { label: phone.display, href: phone.href, external: false },
  ];
  return (
    <footer className="footer shell">
      <div><Link className="brand" href="#top"><span className="brand-mark">SH</span><span><strong>{portfolio.person.name}</strong><small>{portfolio.person.title}</small></span></Link></div>
      <div className="footer-links">{contacts.map((item) => <a key={item.label} href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noopener noreferrer" : undefined}>{item.label}</a>)}</div>
      <p>© {new Date().getFullYear()} {portfolio.person.name}</p>
    </footer>
  );
}
