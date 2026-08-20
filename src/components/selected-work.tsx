import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/portfolio";
import { SectionHeading } from "./ui";

export function SelectedWork() {
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <section className="section shell" id="work">
      <SectionHeading eyebrow="Project proof" title="Selected work." body="Production work across custom software, AI products, public-sector WordPress engineering and Shopify commerce." />
      <div className="project-grid">
        {featuredProjects.map((project, index) => (
          <article className={`project-card project-card--${index + 1}`} key={project.id}>
            <Link href={project.caseStudyUrl} className="project-image" aria-label={`View ${project.name} case study`}>
              <Image
                src={project.thumbnail}
                alt={project.thumbnailAlt}
                fill
                priority={index === 0}
                sizes={index === 0 ? "(max-width: 800px) 100vw, 1200px" : index === 3 ? "(max-width: 800px) 100vw, 680px" : "(max-width: 800px) 100vw, 586px"}
              />
            </Link>
            <div className="project-meta"><span>{project.category}</span><span>{project.projectType}</span></div>
            <div className="project-title-row">
              <div>
                <h3>{project.name}</h3>
                <h4>{project.headline}</h4>
                <p className="project-role"><span>Role</span><strong>{project.myRole}</strong></p>
                {project.leadership ? <p className="project-leadership">{project.leadership}</p> : null}
                <p className="project-description">{project.shortDescription}</p>
              </div>
              <div className="project-links">
                <Link href={project.caseStudyUrl}>View case study <ArrowUpRight aria-hidden="true" /></Link>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.liveLabel}: ${project.name}`}>{project.liveLabel} <ArrowUpRight aria-hidden="true" /></a>
              </div>
            </div>
            <div className="tag-list">{project.cardTechnologies.map((tech) => <span key={tech}>{tech}</span>)}</div>
          </article>
        ))}
      </div>
      <div className="all-work-cta">
        <Link href="/work/">View All Work <ArrowUpRight aria-hidden="true" /></Link>
      </div>
    </section>
  );
}
