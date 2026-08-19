import Link from "next/link";
import { ArrowRight, BrainCircuit, Braces, Inbox, MessageCircle, Route, Webhook } from "lucide-react";
import { SectionHeading } from "./ui";

const nodes = [
  { label: "Messages", icon: MessageCircle },
  { label: "Chatwoot", icon: Inbox },
  { label: "Webhook", icon: Webhook },
  { label: "AI Extraction", icon: BrainCircuit },
  { label: "Structured Order", icon: Braces },
  { label: "Order Workflow", icon: Route },
];

export function OrderWorkflowDiagram({ caseStudy = false }: { caseStudy?: boolean }) {
  return (
    <div className={`workflow-visual${caseStudy ? " workflow-visual--case" : ""}`} role="img" aria-label="Simplified internal workflow: messages enter Chatwoot, trigger a webhook and AI extraction, then become structured order data for the client order workflow">
      <div className="workflow-canvas">
        {nodes.map((node, index) => {
          const Icon = node.icon;
          return <div className="workflow-step" key={node.label}>
            <div className="workflow-node"><span><Icon aria-hidden="true" /></span><strong>{node.label}</strong></div>
            {index < nodes.length - 1 ? <div className="workflow-line" aria-hidden="true"><i /><ArrowRight /></div> : null}
          </div>;
        })}
      </div>
      <p className="workflow-caption">Internal workflow · architecture simplified for portfolio</p>
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
          <p>Built an automated order-processing workflow for a social-commerce operation. Chatwoot webhooks trigger AI processing that identifies relevant messages, extracts structured order details and passes them into the client&apos;s order workflow.</p>
          <p>The system significantly reduced repetitive manual order-entry work while keeping the client&apos;s internal workflow private.</p>
          <Link className="automation-link" href="/work/order-extraction">View case study <ArrowRight aria-hidden="true" /></Link>
        </div>
        <OrderWorkflowDiagram />
      </div>
    </section>
  );
}
