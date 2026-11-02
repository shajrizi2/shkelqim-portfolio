import Link from "next/link";
import { ArrowRight, BrainCircuit, Braces, Inbox, Route, Webhook } from "lucide-react";
import { SectionHeading } from "./ui";

const nodes = [
  { label: "Chatwoot", icon: Inbox },
  { label: "Lambda Validation", icon: Webhook },
  { label: "SQS Queue", icon: Inbox },
  { label: "Lambda AI Extraction", icon: BrainCircuit },
  { label: "Structured Order", icon: Braces },
  { label: "API / CRM", icon: Route },
];

export function OrderWorkflowDiagram({ caseStudy = false }: { caseStudy?: boolean }) {
  return (
    <div className={`workflow-visual${caseStudy ? " workflow-visual--case" : ""}`} role="img" aria-label="AWS order-processing workflow: Chatwoot webhooks invoke Lambda validation, SQS queues messages for Lambda AI extraction, and structured orders are delivered to the operational API or CRM">
      <div className="workflow-canvas">
        {nodes.map((node, index) => {
          const Icon = node.icon;
          return <div className="workflow-step" key={node.label}>
            <div className="workflow-node"><span><Icon aria-hidden="true" /></span><strong>{node.label}</strong></div>
            {index < nodes.length - 1 ? <div className="workflow-line" aria-hidden="true"><i /><ArrowRight /></div> : null}
          </div>;
        })}
      </div>
      <p className="workflow-caption">AWS order processing · architecture simplified for portfolio</p>
    </div>
  );
}

export function AutomationWorkflow() {
  return (
    <section className="section shell" id="automation">
      <div className="automation-panel">
        <div className="automation-copy">
          <SectionHeading eyebrow="Real-world automation" title="Development plus automation." />
          <h3>AI Order Extraction System</h3>
          <p>Built an AWS-backed order-processing workflow for a social-commerce operation. Chatwoot webhooks invoke Lambda validation, SQS queues extraction jobs, and a Lambda AI worker turns relevant messages into structured orders for the client&apos;s operational API or CRM.</p>
          <p>The system significantly reduced repetitive manual order-entry work while keeping the client&apos;s internal workflow private.</p>
          <Link className="automation-link" href="/work/order-extraction">View case study <ArrowRight aria-hidden="true" /></Link>
        </div>
        <OrderWorkflowDiagram />
      </div>
    </section>
  );
}
