import Link from "next/link";
import type { AwsArchitecture } from "@/data/portfolio";

export function AwsArchitecturePreview({ architecture }: { architecture: AwsArchitecture }) {
  return (
    <div className="aws-preview">
      <p className="aws-label">Proposed AWS architecture</p>
      <p>{architecture.summary}</p>
      <p className="aws-services">{architecture.services.join(" · ")}</p>
    </div>
  );
}

export function AwsArchitectureDetail({ architecture }: { architecture: AwsArchitecture }) {
  return (
    <section className="aws-detail" id="aws-architecture">
      <small>ARCHITECTURE EXPLORATION / PROPOSED</small>
      <h2>How this project maps to AWS</h2>
      <p>This is a proposed extension of the existing project. The AWS services below are not part of the delivered technology stack.</p>
      <p>{architecture.summary}</p>
      <div className="work-tags" aria-label="Proposed AWS services">
        {architecture.services.map((service) => <span key={service}>{service}</span>)}
      </div>
      {architecture.flow ? (
        <ol className="aws-flow" aria-label="Proposed processing flow">
          {architecture.flow.map((step) => <li key={step}>{step}</li>)}
        </ol>
      ) : null}
      <ul>{architecture.considerations.map((item) => <li key={item}>{item}</li>)}</ul>
    </section>
  );
}

export function AwsPortfolioPlan() {
  return (
    <section className="work-page-section aws-plan" aria-labelledby="aws-plan-title">
      <div className="work-section-heading">
        <div>
          <p className="eyebrow"><span />AWS architecture exploration</p>
          <h2 id="aws-plan-title">From production patterns to AWS.</h2>
        </div>
        <p>My production background spans NestJS, PostgreSQL, Prisma, webhook-driven AI automation, MQTT, Docker and Linux deployments. It provides a foundation for AWS architecture; it does not represent direct production ownership of these AWS services.</p>
      </div>
      <div className="aws-plan-grid">
        <article>
          <p className="aws-label">01 / Planned serverless demonstration</p>
          <h3>AI Order Extraction on AWS</h3>
          <p>Build an isolated Lambda, SQS, S3, SNS and DynamoDB implementation with infrastructure as code, least-privilege IAM, CloudWatch, retries, dead-letter queues, idempotency and tests.</p>
          <Link href="/work/order-extraction/#aws-architecture">Explore the proposed architecture →</Link>
        </article>
        <article>
          <p className="aws-label">02 / Planned container demonstration</p>
          <h3>HyrjeDalje-inspired NestJS service on EKS</h3>
          <p>Deploy a representative API in an isolated demonstration environment with readiness/liveness probes, AWS networking, secret handling, scaling and CI/CD. Keep PostgreSQL as the business source of truth.</p>
          <Link href="/work/hyrjedalje/#aws-architecture">Explore the proposed architecture →</Link>
        </article>
      </div>
      <p className="aws-learning-order"><strong>Learning priority:</strong> Lambda → SQS → S3 → SNS → DynamoDB → EKS. Start with webhooks, queues and assets, then move into Kubernetes operations.</p>
    </section>
  );
}
