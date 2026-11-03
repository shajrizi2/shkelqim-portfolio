"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { consentSnapshot, subscribeConsent, setConsent, trackPage, synchronizeConsent } from "@/lib/analytics/client";
import { classifyLink, normalizePath } from "@/lib/analytics/events";

const serverSnapshot = () => "disabled" as const;

export function AnalyticsConsent() {
  const pathname = usePathname();
  const consent = useSyncExternalStore(subscribeConsent, consentSnapshot, serverSnapshot);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const preferences = () => setOpen(true);
    window.addEventListener("analytics-preferences", preferences);
    return () => window.removeEventListener("analytics-preferences", preferences);
  }, []);

  useEffect(() => {
    synchronizeConsent();
    if (consent !== "accepted") return;
    trackPage();
    const clicked = (event: MouseEvent) => {
      if (!(event.target instanceof Element) || consentSnapshot() !== "accepted") return;
      const anchor = event.target.closest("a");
      const href = anchor?.getAttribute("href");
      if (!href) return;
      const action = classifyLink(href, window.location.origin);
      if (action) window.gtag?.("event", action.name, { ...action.params, page_path: normalizePath(window.location.pathname) });
    };
    document.addEventListener("click", clicked);
    return () => document.removeEventListener("click", clicked);
  }, [pathname, consent]);

  if (!open && consent !== "unknown") return null;
  return (
    <section className="consent-panel" role="region" aria-label="Analytics privacy preferences">
      <div>
        <h2>Analytics preferences</h2>
        <p>{consent === "disabled" ? "Optional analytics are not enabled for this visit." : "With your permission, Google Analytics helps me understand which pages and channels are useful. Optional analytics stay off until you accept. No message or form contents are collected."} <Link href="/privacy/">Privacy details</Link></p>
      </div>
      <div className="consent-actions">
        {consent !== "disabled" ? <>
          <button type="button" onClick={() => { setConsent("rejected"); setOpen(false); }}>Reject analytics</button>
          <button type="button" onClick={() => { setConsent("accepted"); setOpen(false); }}>Accept analytics</button>
        </> : null}
        {open ? <button type="button" onClick={() => setOpen(false)}>Close</button> : null}
      </div>
    </section>
  );
}

export function AnalyticsPreferencesButton() {
  return <button type="button" className="privacy-settings" onClick={() => window.dispatchEvent(new Event("analytics-preferences"))}>Analytics preferences</button>;
}
