import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { brotliCompress, gzip } from "node:zlib";
import { promisify } from "node:util";
import { createApp } from "../server/app";

// Local preview of exported pages and the same Function handler. There is no auth bypass.
const root = path.resolve("out");
const port = Number(process.env.PREVIEW_PORT || 4317);
const handler = createApp();
const brotli = promisify(brotliCompress), compressGzip = promisify(gzip);
const mime: Record<string, string> = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".ico": "image/x-icon", ".woff2": "font/woff2" };
createServer(async (incoming, outgoing) => {
  const url = new URL(incoming.url || "/", `http://127.0.0.1:${port}`);
  try {
    if (url.pathname === "/dashboard" || url.pathname.startsWith("/dashboard/") || url.pathname.startsWith("/api/private/")) {
      const headers = new Headers();
      for (const [key, value] of Object.entries(incoming.headers)) if (value) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
      const result = await handler(new Request(url, { method: incoming.method, headers }));
      outgoing.statusCode = result.status;
      result.headers.forEach((value, key) => { if (key !== "set-cookie") outgoing.setHeader(key, value); });
      if (result.headers.getSetCookie().length) outgoing.setHeader("set-cookie", result.headers.getSetCookie());
      outgoing.end(Buffer.from(await result.arrayBuffer()));
      return;
    }
    let pathname: string;
    try { pathname = decodeURIComponent(url.pathname); } catch { outgoing.writeHead(400).end(); return; }
    const candidate = path.resolve(root, "." + pathname);
    if (candidate !== root && !candidate.startsWith(root + path.sep)) { outgoing.writeHead(403).end(); return; }
    let file = candidate;
    let status = 200;
    try {
      if ((await stat(file)).isDirectory()) {
        if (!url.pathname.endsWith("/")) { outgoing.writeHead(301, { Location: url.pathname + "/" + url.search }).end(); return; }
        file = path.join(file, "index.html");
      }
      await stat(file);
    } catch { file = path.join(root, "404.html"); status = 404; }
    const contentType = mime[path.extname(file)] || "application/octet-stream";
    const headers: Record<string, string> = { "Content-Type": contentType, "X-Content-Type-Options": "nosniff", Vary: "Accept-Encoding" };
    let body = await readFile(file);
    // Netlify's live response was verified as Brotli. Mirror that normal delivery,
    // rather than benchmarking an uncompressed development server as production.
    const encoding = incoming.headers["accept-encoding"] || "";
    if (/^(text\/|application\/(javascript|json|xml))/.test(contentType)) {
      if (encoding.includes("br")) { body = await brotli(body); headers["Content-Encoding"] = "br"; }
      else if (encoding.includes("gzip")) { body = await compressGzip(body); headers["Content-Encoding"] = "gzip"; }
    }
    if (url.pathname.startsWith("/_next/static/")) headers["Cache-Control"] = "public, max-age=31536000, immutable";
    else if (file.endsWith(".webp")) headers["Cache-Control"] = "public, max-age=86400, stale-while-revalidate=604800";
    headers["Content-Length"] = String(body.length);
    outgoing.writeHead(status, headers);
    outgoing.end(incoming.method === "HEAD" ? undefined : body);
  } catch { outgoing.writeHead(500).end("Local preview error"); }
}).listen(port, "127.0.0.1", () => console.log(`Portfolio preview: http://127.0.0.1:${port} (private access remains protected)`));
