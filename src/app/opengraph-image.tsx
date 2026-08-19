import { ImageResponse } from "next/og";

export const alt = "Shkelqim Hajrizi — Full-Stack Developer & Automation Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", color: "#f3f5f4", background: "#0b0d0f", padding: "68px 76px", fontFamily: "sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 560, height: 560, borderRadius: 560, background: "#b7f12a", filter: "blur(170px)", opacity: .12, right: -120, top: -180 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}><div style={{ display: "flex", width: 50, height: 50, border: "1px solid #b7f12a", alignItems: "center", justifyContent: "center", color: "#b7f12a", fontSize: 19 }}>SH</div><span style={{ fontSize: 21, color: "#a2aaa5" }}>Full-Stack Developer & Automation Engineer</span></div>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 920 }}><div style={{ display: "flex", color: "#b7f12a", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", marginBottom: 24 }}>REMOTE DEVELOPMENT CAPACITY</div><div style={{ display: "flex", fontSize: 72, lineHeight: 1.03, letterSpacing: -4 }}>Web, e-commerce, software and automation.</div></div>
      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #2b302d", paddingTop: 26, fontSize: 21 }}><span>Shkelqim Hajrizi</span><span style={{ color: "#838b86" }}>Agencies · Product teams</span></div>
    </div>, size,
  );
}
