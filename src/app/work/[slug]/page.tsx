import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { projects } from "@/data/portfolio";
import { OrderWorkflowDiagram } from "@/components/automation-workflow";

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return project ? {
    title: project.seoTitle,
    description: project.seoDescription,
    alternates: { canonical: `/work/${project.slug}` },
  } : {};
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  return (
    <main className="case-study shell">
      <Link className="back-link" href="/#work"><ArrowLeft size={16} /> Back to selected work</Link>
      <header className="case-hero">
        <div>
          <p className="eyebrow"><span />{project.category} · {project.projectType}</p>
          <h1>{project.name}</h1>
          <h2>{project.headline}</h2>
          <p>{project.shortDescription}</p>
          {project.liveUrl ? <a className="case-live-link" href={project.liveUrl} target="_blank" rel="noopener noreferrer">{project.liveLabel} <ArrowUpRight aria-hidden="true" size={16} /></a> : null}
        </div>
        <div className="tag-list">{project.cardTechnologies.map((tech) => <span key={tech}>{tech}</span>)}</div>
      </header>
      {project.kind === "workflow" ? (
        <div className="case-workflow"><OrderWorkflowDiagram caseStudy /></div>
      ) : (
        <figure className="case-image">
          <Image src={project.screenshots[0].src} alt={project.screenshots[0].alt} fill priority sizes="(max-width: 1248px) 100vw, 1200px" />
          <figcaption>{project.screenshots[0].caption}</figcaption>
        </figure>
      )}
      <div className="case-layout">
        <aside>
          <span>PROJECT TYPE</span><strong>{project.projectType}</strong>
          <span>CLIENT TYPE</span><strong>{project.clientType}</strong>
          <span>MY ROLE</span><strong>{project.myRole}</strong>
          {project.leadership ? <><span>LEADERSHIP</span><strong>{project.leadership}</strong></> : null}
          <span>TECHNOLOGIES</span><strong>{project.technologies.join(" · ")}</strong>
          {project.liveUrl ? <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">{project.liveLabel} <ArrowUpRight aria-hidden="true" size={14} /></a> : null}
        </aside>
        <div className="case-content">
          {project.sections.map((section) => (
            <section key={section.label}>
              <small>{section.label}</small>
              <h2>{section.title}</h2>
              {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets ? <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul> : null}
            </section>
          ))}
        </div>
      </div>
      {project.screenshots.length > 1 ? (
        <section className="case-gallery" aria-labelledby="selected-screens-title">
          <div className="case-gallery-heading"><p className="eyebrow"><span />Product evidence</p><h2 id="selected-screens-title">Selected screens.</h2></div>
          <div className="case-gallery-grid">
            {project.screenshots.slice(1).map((screenshot) => (
              <figure key={screenshot.src}>
                <div><Image src={screenshot.src} alt={screenshot.alt} fill sizes="(max-width: 800px) 100vw, 586px" /></div>
                <figcaption>{screenshot.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}
      <div className="case-end"><p>Looking for similar development capacity?</p><Link className="button button--primary" href="/#contact">Start a conversation <ArrowUpRight size={17} /></Link></div>
    </main>
  );
}
