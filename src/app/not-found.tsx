import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page not found | Shkelqim Hajrizi", alternates: { canonical: null }, robots: { index: false, follow: false } };

export default function NotFound() {
  return <main className="not-found" id="main-content" tabIndex={-1}><span>404</span><h1>That page isn&apos;t here.</h1><p>The project may have moved, or the link may be incomplete.</p><Link className="button button--primary" href="/">Return home</Link></main>;
}
