import { isPublicPath, sanitizedLocation } from "./events";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
export const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";
export const consentKey = "hajrizi-analytics-consent-v1";
const host = process.env.NEXT_PUBLIC_ANALYTICS_HOSTNAME || "hajrizi.dev";
let configured = false;
let previousLocation = "";

export function canCollect() {
  return process.env.NODE_ENV === "production" && /^G-[A-Z0-9]+$/.test(measurementId)
    && window.location.hostname === host && isPublicPath(window.location.pathname)
    && !navigator.doNotTrack?.includes("1")
    && !(navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl
    && !document.cookie.includes("analytics_exclude=1")
    && localStorage.getItem("analytics-exclude") !== "true";
}

export function consentSnapshot(): "accepted" | "rejected" | "unknown" | "disabled" {
  try {
    if (!canCollect()) return "disabled";
    const value = JSON.parse(localStorage.getItem(consentKey) || "null");
    if (value && Date.now() - value.at < 180 * 86400_000 && ["accepted", "rejected"].includes(value.choice)) return value.choice;
    return "unknown";
  } catch { return "disabled"; }
}

export function subscribeConsent(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("analytics-consent", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("analytics-consent", callback);
  };
}

export function setConsent(choice: "accepted" | "rejected") {
  try { localStorage.setItem(consentKey, JSON.stringify({ choice, at: Date.now() })); } catch { return; }
  if (choice === "rejected" && configured) stopAnalytics();
  window.dispatchEvent(new Event("analytics-consent"));
}

function stopAnalytics() {
    Object.assign(window, { [`ga-disable-${measurementId}`]: true });
    window.gtag?.("consent", "update", { analytics_storage: "denied" });
    for (const name of document.cookie.split(";").map((cookie) => cookie.trim().split("=")[0]).filter((name) => /^_ga($|_)/.test(name))) {
      document.cookie = `${name}=; Max-Age=0; Path=/; Secure; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${host}; Secure; SameSite=Lax`;
    }
    window.location.reload();
}

export function synchronizeConsent() {
  if (configured && consentSnapshot() !== "accepted") stopAnalytics();
}

export function enableAnalytics() {
  if (configured || consentSnapshot() !== "accepted") return;
  configured = true;
  window.dataLayer ??= [];
  // Google's official gtag command queue uses an Arguments object.
  // eslint-disable-next-line prefer-rest-params
  window.gtag = function () { window.dataLayer!.push(arguments); };
  window.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  window.gtag("consent", "update", { analytics_storage: "granted" });
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
    cookie_flags: "SameSite=Lax;Secure", cookie_expires: 15552000,
    page_location: sanitizedLocation(window.location.href), page_referrer: cleanReferrer(),
  });
  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  script.id = "google-analytics";
  document.head.append(script);
}

function cleanReferrer() {
  try { return document.referrer ? new URL(document.referrer).origin + "/" : ""; } catch { return ""; }
}

export function trackPage() {
  if (consentSnapshot() !== "accepted") return;
  enableAnalytics();
  const location = sanitizedLocation(window.location.href);
  if (previousLocation === location) return;
  window.gtag?.("event", "page_view", {
    page_location: location, page_path: new URL(location).pathname,
    page_title: document.title, page_referrer: previousLocation || cleanReferrer(),
  });
  previousLocation = location;
}
