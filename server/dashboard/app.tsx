import { StrictMode, useEffect, useId, useState } from "react";
import { createRoot } from "react-dom/client";
import { CHANNELS, type DashboardReport, type GaReport, type SearchReport, type SourceResult, type TableRow, type SeriesPoint, type ReportFilters } from "../../src/lib/analytics/contracts";
import { PUBLIC_PATHS } from "../../src/lib/analytics/events";
import "./styles.css";

type Tab = "Overview" | "Traffic" | "Google Search" | "Actions";
const tabs: Tab[] = ["Overview", "Traffic", "Google Search", "Actions"];
const number = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
const compact = new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 });
const date = (value: string) => new Date(`${value}T12:00:00Z`).toLocaleDateString(undefined, { month: "short", day: "numeric", timeZone: "UTC" });
const format = (value: number, type: "number" | "percent" | "position" | "seconds" = "number") => type === "percent" ? `${(value * 100).toFixed(2)}%` : type === "position" ? value.toFixed(1) : type === "seconds" ? `${Math.round(value)}s` : number.format(value);
const asNumber = (value: unknown) => typeof value === "number" ? value : 0;

function presetRange(days: number) {
  const end = new Date(); end.setUTCDate(end.getUTCDate() - 1);
  const start = new Date(end); start.setUTCDate(end.getUTCDate() - days + 1);
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
}
function connected<T>(source?: SourceResult<T>): T | null {
  return source && (source.status === "ready" || source.status === "empty") ? source.data : null;
}

function Metric({ label, value, previous, type = "number", source, lower = false, unavailableLabel = "Connect this data source" }: { label: string; value: number | null | undefined; previous?: number | null; type?: "number" | "percent" | "position" | "seconds"; source: string; lower?: boolean; unavailableLabel?: string }) {
  let trend = "No previous data";
  let direction = "neutral";
  if (value != null && previous != null) {
    const delta = value - previous;
    trend = delta === 0 ? "No change" : previous === 0 ? "No prior baseline" : type === "position" ? `${delta < 0 ? "↓" : "↑"} ${Math.abs(delta).toFixed(1)} positions` : `${delta > 0 ? "↑" : "↓"} ${Math.abs(delta / previous * 100).toFixed(1)}%`;
    direction = !delta || !previous ? "neutral" : (lower ? delta < 0 : delta > 0) ? "positive" : "negative";
  }
  return <article className="metric"><div className="metric-heading"><h3>{label}</h3><span>{source}</span></div><strong>{value == null ? "—" : format(value, type)}</strong><p className={`trend ${direction}`}>{value == null ? unavailableLabel : trend}<span> vs previous period</span></p></article>;
}

function SourceStatus<T>({ name, source }: { name: string; source?: SourceResult<T> }) {
  if (!source) return null;
  if (source.status === "setup" || source.status === "error") return <div className={`source-state ${source.status}`} role={source.status === "error" ? "alert" : "status"}><strong>{name} · {source.status === "setup" ? "Setup required" : "Connection error"}</strong><p>{source.message}</p></div>;
  return <div className="source-connected"><span className="status-dot" /><strong>{name}</strong><span>{source.status === "empty" ? "Connected · no data in this range" : "Connected"}</span><small>Synced {source.syncedAt ? new Date(source.syncedAt).toLocaleString() : "—"}</small></div>;
}

function Panel({ title, subtitle, children, wide = false }: { title: string; subtitle?: string; children: React.ReactNode; wide?: boolean }) {
  return <section className={`panel${wide ? " panel-wide" : ""}`}><header><h2>{title}</h2>{subtitle ? <p>{subtitle}</p> : null}</header>{children}</section>;
}
function Empty({ message = "No data in the selected period." }: { message?: string }) { return <div className="empty-state"><span aria-hidden="true">↗</span><p>{message}</p></div>; }

function Chart({ title, points, series }: { title: string; points: SeriesPoint[]; series: { key: string; label: string; color: string }[] }) {
  const id = useId().replaceAll(":", "");
  if (!points.length) return <Empty />;
  const width = 760, height = 230, left = 50, right = 16, top = 20, bottom = 30;
  const max = Math.max(1, ...points.flatMap(point => series.map(item => asNumber(point[item.key]))));
  const x = (index: number) => left + (points.length === 1 ? (width - left - right) / 2 : index / (points.length - 1) * (width - left - right));
  const y = (value: number) => height - bottom - value / max * (height - top - bottom);
  return <figure className="chart">
    <div className="chart-legend">{series.map((item, i) => <span key={item.key}><i className={`legend-mark tone-${i}`} />{item.label}</span>)}</div>
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${id}-title ${id}-description`}>
      <title id={`${id}-title`}>{title}</title><desc id={`${id}-description`}>{points.length} daily observations. The exact values are available in the data table below.</desc>
      <defs>{series.map(item => <linearGradient id={`${id}-${item.key}`} key={item.key} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={item.color} stopOpacity=".2" /><stop offset="100%" stopColor={item.color} stopOpacity="0" /></linearGradient>)}</defs>
      {[0, .25, .5, .75, 1].map(fraction => <g key={fraction}><line x1={left} x2={width - right} y1={y(max * fraction)} y2={y(max * fraction)} stroke="#2a322d" /><text x={left - 10} y={y(max * fraction) + 4} textAnchor="end" fill="#a0ada4" fontSize="11">{compact.format(max * fraction)}</text></g>)}
      {series.map(item => {
        const coordinates = points.map((point, i) => `${x(i)},${y(asNumber(point[item.key]))}`);
        return <g key={item.key}>
          <polygon points={`${x(0)},${height - bottom} ${coordinates.join(" ")} ${x(points.length - 1)},${height - bottom}`} fill={`url(#${id}-${item.key})`} />
          <polyline points={coordinates.join(" ")} fill="none" stroke={item.color} strokeWidth="2.5" strokeLinejoin="round" />
          {points.map((point, i) => <circle key={`${point.date}-${i}`} cx={x(i)} cy={y(asNumber(point[item.key]))} r="3" fill={item.color}><title>{date(point.date)}: {item.label} {number.format(asNumber(point[item.key]))}</title></circle>)}
        </g>;
      })}
      {[0, Math.floor((points.length - 1) / 2), points.length - 1].filter((index, i, values) => values.indexOf(index) === i).map(index => <text key={index} x={x(index)} y={height - 6} textAnchor="middle" fill="#a0ada4" fontSize="11">{date(points[index].date)}</text>)}
    </svg>
    <details className="chart-data"><summary>View daily data</summary><div className="table-scroll"><table><caption>{title}: daily values</caption><thead><tr><th scope="col">Date</th>{series.map(item => <th scope="col" key={item.key}>{item.label}</th>)}</tr></thead><tbody>{points.map((point, i) => <tr key={`${point.date}-${i}`}><th scope="row">{point.date}</th>{series.map(item => <td key={item.key}>{format(asNumber(point[item.key]))}</td>)}</tr>)}</tbody></table></div></details>
  </figure>;
}

type Column = { key: string; label: string; type?: "percent" | "position" | "seconds" | "number" };
function DataTable({ rows, columns, title, limit = 10 }: { rows: TableRow[]; columns: Column[]; title: string; limit?: number }) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const filtered = rows.filter(row => row.label.toLowerCase().includes(query.toLowerCase()));
  const shown = filtered.slice(0, expanded ? 1000 : limit);
  if (!rows.length) return <Empty />;
  return <>
    {rows.length > limit ? <label className="table-search" htmlFor={id}>Filter {title.toLowerCase()}<input id={id} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search rows…" /></label> : null}
    <div className="table-scroll"><table><caption>{title}</caption><thead><tr><th scope="col">{title}</th>{columns.map(column => <th scope="col" key={column.key}>{column.label}</th>)}</tr></thead><tbody>{shown.map((row, index) => <tr key={`${row.label}-${index}`}><th scope="row" title={row.label}>{row.label}</th>{columns.map(column => <td key={column.key}>{row[column.key] == null ? "—" : typeof row[column.key] === "number" ? format(row[column.key] as number, column.type) : String(row[column.key])}</td>)}</tr>)}</tbody></table></div>
    {!shown.length ? <p className="no-matches">No matching rows.</p> : null}
    {filtered.length > limit ? <button type="button" className="table-more" onClick={() => setExpanded(!expanded)}>{expanded ? "Show fewer" : `Show ${Math.min(filtered.length, 1000)} rows`}</button> : null}
    <p className="table-count">{shown.length} of {filtered.length} returned rows</p>
  </>;
}

function Breakdown({ rows, metric, label }: { rows: TableRow[]; metric: string; label: string }) {
  if (!rows.length) return <Empty />;
  const total = rows.reduce((sum, row) => sum + asNumber(row[metric]), 0);
  return <ul className="breakdown">{rows.slice(0, 10).map((row, i) => <li key={`${row.label}-${i}`}><div><span>{row.label}</span><strong>{number.format(asNumber(row[metric]))}<small> {label}</small></strong></div><meter min="0" max={Math.max(total, 1)} value={asNumber(row[metric])} aria-label={`${row.label}: ${number.format(asNumber(row[metric]))} ${label}`} /></li>)}</ul>;
}

const sessionColumns: Column[] = [{ key: "sessions", label: "Sessions" }, { key: "activeUsers", label: "Active users" }];
const searchColumns: Column[] = [{ key: "clicks", label: "Clicks" }, { key: "impressions", label: "Impressions" }, { key: "ctr", label: "CTR", type: "percent" }, { key: "position", label: "Position", type: "position" }];
const seriesColors = ["#b7f12a", "#8ab7ff"];

function Traffic({ ga }: { ga: GaReport | null }) {
  return <div className="report-grid">
    <Panel title="Visitors & sessions" subtitle="GA4 · Daily active users and sessions; daily users must not be summed as unique period users." wide><Chart title="Visitors and sessions" points={ga?.daily || []} series={[{ key: "activeUsers", label: "Active users", color: seriesColors[0] }, { key: "sessions", label: "Sessions", color: seriesColors[1] }]} /></Panel>
    <Panel title="Acquisition channels" subtitle="GA4 · Session default channel group"><Breakdown rows={ga?.channels || []} metric="sessions" label="sessions" /></Panel>
    <Panel title="Referring sources & media" subtitle="GA4 · Session source / medium, including direct and search"><DataTable title="Source / medium" rows={ga?.referrers || []} columns={sessionColumns} /></Panel>
    <Panel title="Referring domains" subtitle="GA4 · Page views grouped by referrer hostname; internal referrers excluded. These are not unique sessions." wide><DataTable title="Referrer domain" rows={ga?.referringDomains || []} columns={[{ key: "screenPageViews", label: "Page views" }]} /></Panel>
    <Panel title="Countries" subtitle="GA4 · Approximate visitor geography"><DataTable title="Country" rows={ga?.countries || []} columns={[{ key: "activeUsers", label: "Active users" }, { key: "sessions", label: "Sessions" }]} /></Panel>
    <Panel title="Device distribution" subtitle="GA4 · Session device category"><Breakdown rows={ga?.devices || []} metric="sessions" label="sessions" /></Panel>
    <Panel title="Top visited pages" subtitle="GA4 · Engagement is total recorded engagement time, not average dwell time." wide><DataTable title="Page path" rows={ga?.pages || []} columns={[{ key: "screenPageViews", label: "Views" }, { key: "activeUsers", label: "Active users" }, { key: "userEngagementDuration", label: "Engagement", type: "seconds" }]} /></Panel>
    <Panel title="Landing pages" subtitle="GA4 · Pages where measured sessions started" wide><DataTable title="Landing page" rows={ga?.landingPages || []} columns={[...sessionColumns, { key: "engagedSessions", label: "Engaged sessions" }]} /></Panel>
  </div>;
}

function Search({ search }: { search: SearchReport | null }) {
  return <div className="report-grid">
    <Panel title="Organic search clicks" subtitle="Google Search Console · Web search, finalized data"><Chart title="Google organic search clicks" points={search?.daily || []} series={[{ key: "clicks", label: "Clicks", color: seriesColors[0] }]} /></Panel>
    <Panel title="Search impressions" subtitle="Google Search Console · Search-result appearances"><Chart title="Google Search impressions" points={search?.daily || []} series={[{ key: "impressions", label: "Impressions", color: seriesColors[1] }]} /></Panel>
    <Panel title="Top Google search queries" subtitle="Google Search Console · Top returned queries; anonymized queries may be withheld." wide><DataTable title="Query" rows={search?.queries || []} columns={searchColumns} /></Panel>
    <Panel title="Search landing pages" subtitle="Google Search Console · Organic performance by canonical URL" wide><DataTable title="Page URL" rows={search?.pages || []} columns={searchColumns} /></Panel>
    <Panel title="High impressions, low CTR" subtitle="Among returned queries: at least 20 impressions and CTR below 2%." wide><DataTable title="Query" rows={search?.lowCtr || []} columns={searchColumns} /></Panel>
    <Panel title="Pages gaining or losing visibility" subtitle="Current minus previous period. Missing rows may be limited by privacy or top-row reporting." wide><DataTable title="Page URL" rows={search?.visibility || []} columns={[{ key: "clicksDelta", label: "Δ Clicks" }, { key: "impressionsDelta", label: "Δ Impressions" }, { key: "previousImpressions", label: "Prior impressions" }, { key: "impressions", label: "Impressions" }]} /></Panel>
    <Panel title="Search countries" subtitle="Google Search Console · Country codes"><DataTable title="Country" rows={search?.countries || []} columns={[{ key: "clicks", label: "Clicks" }, { key: "impressions", label: "Impressions" }]} /></Panel>
    <Panel title="Search devices" subtitle="Google Search Console"><Breakdown rows={search?.devices || []} metric="clicks" label="clicks" /></Panel>
    <Panel title="CTR & position by day" subtitle="CTR is clicks / impressions. Position is Google's average result position; lower is better." wide><DataTable title="Date" rows={(search?.daily || []).map(point => ({ ...point, label: point.date }))} columns={searchColumns} /></Panel>
  </div>;
}

function Actions({ ga }: { ga: GaReport | null }) {
  return <>
    <div className="definition"><strong>Actions express interest, not confirmed leads.</strong><p>Contact, email, phone and Calendly clicks count as contact actions. Repeated clicks are included. No completed-booking or form-success integration exists on this site; confirmed conversions are not measured. GA4 configured key events follow your property settings and may include clicks.</p></div>
    <div className="report-grid">
      <Panel title="Contact-action trend" subtitle="GA4 · Contact CTA, email, phone and Calendly click events" wide><Chart title="Contact actions over time" points={ga?.contactTrend || []} series={[{ key: "contactActions", label: "Contact actions", color: seriesColors[0] }]} /></Panel>
      <Panel title="Tracked engagement events" subtitle="GA4 · Event counts and your property's configured key events" wide><DataTable title="Event name" rows={ga?.events || []} columns={[{ key: "eventCount", label: "Actions" }, { key: "keyEvents", label: "Configured key events" }]} /></Panel>
    </div>
  </>;
}

function App() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [preset, setPreset] = useState("30");
  const [draft, setDraft] = useState(presetRange(30));
  const [filters, setFilters] = useState<ReportFilters>({ channel: "all", device: "all", page: "all" });
  const [selection, setSelection] = useState({ range: draft, filters });
  const [refresh, setRefresh] = useState(0);
  const [report, setReport] = useState<DashboardReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ ...selection.range, ...selection.filters });
    fetch(`/api/private/analytics?${params}`, { credentials: "same-origin", cache: "no-store", signal: controller.signal })
      .then(async response => {
        if (response.status === 401) { window.location.assign("/dashboard/login"); throw new Error("Session expired. Sign in again."); }
        const body = await response.json();
        if (!response.ok) throw new Error(typeof body.error === "string" ? body.error : "Could not load this report.");
        return body as DashboardReport;
      })
      .then(body => { setReport(body); setError(""); setLoading(false); })
      .catch((cause: Error) => { if (!controller.signal.aborted) { setError(cause.message); setLoading(false); } });
    return () => controller.abort();
  }, [selection, refresh]);

  const ga = connected(report?.ga4), search = connected(report?.searchConsole);
  function apply(event: React.FormEvent) {
    event.preventDefault(); setLoading(true); setReport(null); setError("");
    setSelection({ range: { ...draft }, filters: { ...filters } });
  }
  return <div className="dashboard-layout">
    <a className="skip-link" href="#content">Skip to analytics</a>
    <aside className="sidebar">
      <a className="brand" href="/"><b>SH</b><span>Shkelqim Hajrizi<small>hajrizi.dev</small></span></a>
      <p className="nav-label">PRIVATE WORKSPACE</p>
      <nav aria-label="Analytics sections">{tabs.map((item, i) => <button key={item} type="button" aria-current={tab === item ? "page" : undefined} onClick={() => setTab(item)}><span aria-hidden="true">{["◫", "↗", "⌕", "◎"][i]}</span>{item}</button>)}</nav>
      <div className="sidebar-bottom"><span className="status-dot" />Owner-only access<p>GA4 + Google Search Console<br />No visitor tracking here.</p><a href="/">← Public portfolio</a><form action="/dashboard/logout" method="post"><button type="submit">Sign out</button></form></div>
    </aside>
    <main className="dashboard-main" id="content" tabIndex={-1}>
      <header className="dashboard-header"><div><p className="eyebrow">PERFORMANCE / {tab.toUpperCase()}</p><h1>{tab === "Overview" ? "Your portfolio, in focus." : tab === "Traffic" ? "Website traffic." : tab === "Google Search" ? "Search visibility." : "Engagement & contact actions."}</h1><p>Real measurements. Separate sources. Clear signals.</p></div><button className="refresh" type="button" disabled={loading} onClick={() => { setLoading(true); setReport(null); setError(""); setRefresh(value => value + 1); }}>↻ Reload report</button></header>
      <form className="filters" onSubmit={apply}>
        <label>Period<select value={preset} onChange={event => { setPreset(event.target.value); if (event.target.value !== "custom") setDraft(presetRange(Number(event.target.value))); }}><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="custom">Custom range</option></select></label>
        <label>From<input type="date" required value={draft.start} max={draft.end} onChange={event => { setPreset("custom"); setDraft({ ...draft, start: event.target.value }); }} /></label>
        <label>Through<input type="date" required value={draft.end} min={draft.start} max={presetRange(1).end} onChange={event => { setPreset("custom"); setDraft({ ...draft, end: event.target.value }); }} /></label>
        <label>Device · both sources<select value={filters.device} onChange={event => setFilters({ ...filters, device: event.target.value })}><option value="all">All devices</option>{["desktop", "mobile", "tablet"].map(value => <option key={value}>{value}</option>)}</select></label>
        <label>Channel · GA4 only<select value={filters.channel} onChange={event => setFilters({ ...filters, channel: event.target.value })}><option value="all">All channels</option>{CHANNELS.map(value => <option key={value}>{value}</option>)}</select></label>
        <label>Page · both sources<select value={filters.page} onChange={event => setFilters({ ...filters, page: event.target.value })}><option value="all">All public pages</option>{PUBLIC_PATHS.map(value => <option key={value}>{value}</option>)}</select></label>
        <button className="primary" type="submit" disabled={loading}>Apply filters →</button>
      </form>
      {report ? <p className="period-note">{report.range.start} – {report.range.end} · compared with {report.range.previousStart} – {report.range.previousEnd}{report.cached ? " · Server cache (up to 5 minutes)" : ""}</p> : null}
      {error ? <div className="source-state error" role="alert"><strong>Report unavailable</strong><p>{error}</p><button type="button" onClick={() => { setLoading(true); setError(""); setRefresh(value => value + 1); }}>Try again</button></div> : null}
      {loading ? <div className="loading" role="status" aria-live="polite"><span className="spinner" /> Loading authorized reports…</div> : report ? <>
        <div className="sources"><SourceStatus name="Google Analytics 4" source={report.ga4} /><SourceStatus name="Google Search Console" source={report.searchConsole} /></div>
        <div className="metrics-grid">
          {tab !== "Google Search" ? <>
            <Metric label="Active users" value={ga?.totals.activeUsers} previous={ga?.previous.activeUsers} source="GA4" />
            <Metric label="New users" value={ga?.totals.newUsers} previous={ga?.previous.newUsers} source="GA4" />
            <Metric label="Sessions" value={ga?.totals.sessions} previous={ga?.previous.sessions} source="GA4" />
            <Metric label="Page views" value={ga?.totals.screenPageViews} previous={ga?.previous.screenPageViews} source="GA4" />
          </> : null}
          {tab === "Overview" || tab === "Google Search" ? <>
            <Metric label="Organic search clicks" value={search?.totals.clicks} previous={search?.previous.clicks} source="GSC" />
            <Metric label="Search impressions" value={search?.totals.impressions} previous={search?.previous.impressions} source="GSC" />
            <Metric label="Search CTR" value={search?.totals.ctr} previous={search?.previous.ctr} source="GSC" type="percent" />
            <Metric label="Average position" value={search?.totals.position} previous={search?.previous.position} source="GSC" type="position" lower unavailableLabel={search ? "No impressions in this range" : undefined} />
          </> : null}
          {tab !== "Google Search" ? <>
            <Metric label="Contact actions" value={ga?.totals.contactActions} previous={ga?.previous.contactActions} source="GA4" />
            <Metric label="Engagement rate" value={ga?.totals.engagementRate} previous={ga?.previous.engagementRate} source="GA4" type="percent" />
            <Metric label="Engaged sessions" value={ga?.totals.engagedSessions} previous={ga?.previous.engagedSessions} source="GA4" />
            <Metric label="Configured key events" value={ga?.totals.keyEvents} previous={ga?.previous.keyEvents} source="GA4" />
          </> : null}
        </div>
        {ga?.thresholded || ga?.truncated ? <p className="data-note">GA4 reports privacy thresholding or row limits for this selection. Some breakdowns may be incomplete.</p> : null}
        <p className="data-note">GA4: {ga?.timezone || "property timezone"}, reporting may take 24–48 hours. Search Console: Google Web Search only, Pacific dates, finalized data with reporting delay. Source totals can differ. Up to 1,000 rows per breakdown; search queries may be anonymized. Channel filters affect GA4 only.</p>
        {tab === "Traffic" ? <Traffic ga={ga} /> : tab === "Google Search" ? <Search search={search} /> : tab === "Actions" ? <Actions ga={ga} /> : <>
          <div className="report-grid">
            <Panel title="Visitors & sessions" subtitle="GA4 · Daily active users and sessions"><Chart title="Visitors and sessions" points={ga?.daily || []} series={[{ key: "activeUsers", label: "Active users", color: seriesColors[0] }, { key: "sessions", label: "Sessions", color: seriesColors[1] }]} /></Panel>
            <Panel title="Google organic clicks" subtitle="Google Search Console · Separate from overall site traffic"><Chart title="Google organic search clicks" points={search?.daily || []} series={[{ key: "clicks", label: "Clicks", color: seriesColors[1] }]} /></Panel>
            <Panel title="Where visits come from" subtitle="GA4 · Acquisition channels"><Breakdown rows={ga?.channels || []} metric="sessions" label="sessions" /></Panel>
            <Panel title="Contact interest" subtitle="GA4 · Click events, not confirmed bookings or leads"><Chart title="Contact actions" points={ga?.contactTrend || []} series={[{ key: "contactActions", label: "Contact actions", color: seriesColors[0] }]} /></Panel>
          </div>
          <p className="definition">Confirmed bookings and lead submissions are not measured. Use Actions for recorded click events and GA4 configured key-event counts.</p>
        </>}
      </> : null}
      <footer className="dashboard-footer">Shkelqim Hajrizi · Private analytics workspace <span>Read-only Google reporting</span></footer>
    </main>
  </div>;
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
