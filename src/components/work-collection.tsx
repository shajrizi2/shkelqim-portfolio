"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { projects, supportingWork, workFilters, type WorkCategory } from "@/data/portfolio";

type ActiveFilter = (typeof workFilters)[number];

function matchesFilter(categories: WorkCategory[], activeFilter: ActiveFilter) {
  return activeFilter === "All" || categories.includes(activeFilter);
}

function TechnicalVisual({ name, type }: { name: string; type: string }) {
  const initials = name
    .split(/\s|\//)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

  return (
    <div className="work-technical-visual" aria-hidden="true">
      <span className="work-visual-code">{initials}</span>
      <span className="work-visual-type">{type}</span>
      <i className="work-visual-node work-visual-node--one" />
      <i className="work-visual-node work-visual-node--two" />
      <i className="work-visual-line" />
    </div>
  );
}

export function WorkCollection() {
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("All");
  const featuredProjects = projects.filter((project) => matchesFilter(project.workCategories, activeFilter));
  const supportingProjects = supportingWork.filter((project) => matchesFilter(project.categories, activeFilter));
  const resultCount = featuredProjects.length + supportingProjects.length;

  return (
    <>
      <div className="work-filter-bar" aria-label="Filter work by category">
        <div className="work-filters">
          {workFilters.map((filter) => (
            <button
              className={activeFilter === filter ? "is-active" : ""}
              type="button"
              aria-pressed={activeFilter === filter}
              key={filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <p aria-live="polite">{resultCount.toString().padStart(2, "0")} projects</p>
      </div>

      {featuredProjects.length ? (
        <section className="work-page-section" aria-labelledby="featured-work-title">
          <div className="work-section-heading">
            <div>
              <p className="eyebrow"><span />Detailed project proof</p>
              <h2 id="featured-work-title">Featured case studies.</h2>
            </div>
            <p>Deeper context on product decisions, engineering contributions and production delivery.</p>
          </div>
          <div className="work-featured-grid">
            {featuredProjects.map((project, index) => (
              <article className={`work-featured-card${index === 0 && activeFilter === "All" ? " work-featured-card--lead" : ""}`} key={project.id}>
                <Link className="work-featured-media" href={`${project.caseStudyUrl}/`} aria-label={`View ${project.name} case study`}>
                  {project.thumbnail ? (
                    <Image src={project.thumbnail} alt={project.thumbnailAlt} fill priority={index === 0} sizes="(max-width: 800px) 100vw, 600px" />
                  ) : (
                    <TechnicalVisual name={project.name} type={project.projectType} />
                  )}
                </Link>
                <div className="work-card-body">
                  <div className="work-card-kicker"><span>{project.category}</span><span>{project.projectType}</span></div>
                  <h3>{project.name}</h3>
                  <h4>{project.headline}</h4>
                  <p className="work-featured-role">{project.myRole}</p>
                  {project.leadership ? <p className="work-featured-leadership">{project.leadership}</p> : null}
                  <p className="work-card-description">{project.shortDescription}</p>
                  <div className="work-tags">{project.cardTechnologies.map((tech) => <span key={tech}>{tech}</span>)}</div>
                  <div className="work-card-action-row">
                    <Link href={`${project.caseStudyUrl}/`}>View case study <ArrowUpRight aria-hidden="true" /></Link>
                    {project.liveUrl ? (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.liveLabel}: ${project.name} (opens in a new tab)`}>
                        {project.liveLabel} <ArrowUpRight aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="work-status">{project.status}</span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {supportingProjects.length ? (
        <section className="work-page-section work-page-section--supporting" aria-labelledby="broader-work-title">
          <div className="work-section-heading">
            <div>
              <p className="eyebrow"><span />Broader experience</p>
              <h2 id="broader-work-title">Additional work.</h2>
            </div>
            <p>Selected product contributions, mobile and IoT systems, backend work and commercial website delivery.</p>
          </div>
          <div className="supporting-work-grid">
            {supportingProjects.map((project) => (
              <article className="supporting-work-card" key={project.id}>
                <div className="supporting-card-top">
                  <span>{project.type}</span>
                  <span>{project.categories.join(" · ")}</span>
                </div>
                <TechnicalVisual name={project.name} type={project.type} />
                <div className="supporting-card-content">
                  <h3>{project.name}</h3>
                  <h4>{project.headline}</h4>
                  <p>{project.description}</p>
                  <div className="work-tags">{project.technologies.slice(0, 6).map((tech) => <span key={tech}>{tech}</span>)}</div>
                </div>
                <div className="supporting-card-footer">
                  {project.liveUrl ? (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.liveLabel}: ${project.name} (opens in a new tab)`}>
                      {project.liveLabel} <ArrowUpRight aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="work-status">{project.status}</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
