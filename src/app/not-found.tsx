import Link from "next/link";

export default function NotFound() {
  return <main className="not-found"><span>404</span><h1>That page isn&apos;t here.</h1><p>The project may have moved, or the link may be incomplete.</p><Link className="button button--primary" href="/">Return home</Link></main>;
}
