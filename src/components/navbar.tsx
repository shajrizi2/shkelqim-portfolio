import Link from "next/link";
import { Menu } from "lucide-react";
import { portfolio } from "@/data/portfolio";

export function Navbar() {
  return (
    <header className="site-header">
      <nav className="navbar shell" aria-label="Primary navigation">
        <Link className="brand" href="#top" aria-label="Shkelqim Hajrizi, home">
          <span className="brand-mark">SH</span>
          <span className="brand-name">Shkelqim Hajrizi</span>
        </Link>
        <div className="nav-links">
          {portfolio.navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </div>
        <Link className="nav-cta" href="#contact">Let&apos;s work together <span aria-hidden="true">↗</span></Link>
        <details className="mobile-nav">
          <summary aria-label="Open navigation menu"><Menu aria-hidden="true" size={21} /></summary>
          <div className="mobile-nav-panel">
            {portfolio.navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
            <Link className="nav-cta" href="#contact">Let&apos;s work together <span aria-hidden="true">↗</span></Link>
          </div>
        </details>
      </nav>
    </header>
  );
}
