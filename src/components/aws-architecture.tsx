import type { AwsArchitecture } from "@/data/portfolio";

export function AwsArchitecturePreview({ architecture }: { architecture: AwsArchitecture }) {
  return (
    <div className="aws-preview">
      <p className="aws-label">AWS infrastructure</p>
      <p>{architecture.summary}</p>
      <p className="aws-services">{architecture.services.join(" · ")}</p>
    </div>
  );
}

export function AwsArchitectureDetail({ architecture }: { architecture: AwsArchitecture }) {
  return (
    <section className="aws-detail" id="aws-architecture">
      <small>ENGINEERING / AWS INFRASTRUCTURE</small>
      <h2>AWS architecture</h2>
      <p>{architecture.summary}</p>
      <div className="work-tags" aria-label="AWS services">
        {architecture.services.map((service) => <span key={service}>{service}</span>)}
      </div>
      {architecture.flow ? (
        <ol className="aws-flow" aria-label="Processing flow">
          {architecture.flow.map((step) => <li key={step}>{step}</li>)}
        </ol>
      ) : null}
      {architecture.considerations.length ? <ul>{architecture.considerations.map((item) => <li key={item}>{item}</li>)}</ul> : null}
    </section>
  );
}
