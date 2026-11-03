import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WorkCollection } from "@/components/work-collection";
import { collectionGraph, pageMetadata, workSeo } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = pageMetadata(workSeo.title, workSeo.description, "/work/", "work");

export default function WorkIndexPage() {
  return (
    <>
      <Navbar homeNavigation />
      <JsonLd data={collectionGraph} />
      <main className="work-index" id="main-content" tabIndex={-1}>
        <span id="top" />
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
