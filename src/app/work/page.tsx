import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WorkCollection } from "@/components/work-collection";

export const metadata: Metadata = {
  title: "Selected Work",
  description: "Software products, websites, mobile applications, e-commerce projects and automation systems built or contributed to by Shkelqim Hajrizi.",
  alternates: { canonical: "/work/" },
  openGraph: {
    title: "Selected Work — Shkelqim Hajrizi",
    description: "Software products, websites, mobile applications, e-commerce projects and automation systems built or contributed to by Shkelqim Hajrizi.",
    url: "/work/",
  },
};

export default function WorkIndexPage() {
  return (
    <>
      <Navbar homeNavigation />
      <main className="work-index" id="top">
        <header className="work-index-hero shell">
          <p className="eyebrow"><span />Selected project archive</p>
          <h1>Selected Projects <em>&amp; Work</em></h1>
          <p>A broader selection of software products, websites, mobile applications, e-commerce projects and systems I&apos;ve built or contributed to.</p>
        </header>
        <div className="work-index-content shell">
          <WorkCollection />
        </div>
      </main>
      <Footer />
    </>
  );
}
