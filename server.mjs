/**
 * server.mjs — Production Node.js HTTP server for Matachakra.
 *
 * TanStack Start (with cloudflare: false) emits a dist/server/server.js
 * that exports a Web-standard fetch handler: { default: { fetch(Request) } }
 *
 * This file wraps that handler in a Node.js http server, which is what
 * Google Cloud Run needs.
 *
 * Port is read from process.env.PORT (Cloud Run injects this automatically).
 */

import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Import the TanStack Start SSR handler ─────────────────────────────────────
const { default: app } = await import("./dist/server/server.js");
const fetchHandler = app.fetch;

// ── Static asset MIME types ───────────────────────────────────────────────────
const MIME = {
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".txt": "text/plain; charset=utf-8",
};

// ── Node http server ──────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT ?? "8080", 10);
const HOST = "0.0.0.0";
const clientRoot = path.join(__dirname, "dist", "client");

// ── Security headers (applied to every response) ─────────────────────────────
const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(self), geolocation=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-DNS-Prefetch-Control": "off",
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

  // ── 1. Serve static assets from dist/client ────────────────────────────────
  const staticPath = path.join(clientRoot, url.pathname);
  const ext = path.extname(url.pathname);

  if (ext && MIME[ext]) {
    try {
      const file = await readFile(staticPath);
      const mime = MIME[ext] ?? "application/octet-stream";
      // Immutable cache for hashed assets, short-lived for others
      const isHashed = /\.[0-9a-f]{8,}\./.test(url.pathname);
      res.writeHead(200, {
        ...SECURITY_HEADERS,
        "Content-Type": mime,
        "Cache-Control": isHashed ? "public, max-age=31536000, immutable" : "public, max-age=3600",
      });
      res.end(file);
      return;
    } catch {
      // File not found — fall through to SSR handler
    }
  }

  // ── 2. All other requests → TanStack Start SSR fetch handler ──────────────
  try {
    // Reconstruct the full request headers
    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) {
      if (v) {
        if (Array.isArray(v)) v.forEach((val) => headers.append(k, val));
        else headers.set(k, v);
      }
    }

    // Buffer the request body (for POST /api/* server functions)
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = chunks.length > 0 ? Buffer.concat(chunks) : undefined;

    const webRequest = new Request(url.toString(), {
      method: req.method ?? "GET",
      headers,
      body: body?.length ? body : undefined,
      duplex: "half",
    });

    const response = await fetchHandler(webRequest);

    // Stream the response back with security headers
    const responseHeaders = Object.fromEntries(response.headers.entries());
    res.writeHead(response.status, { ...SECURITY_HEADERS, ...responseHeaders });
    if (response.body) {
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    res.end();
  } catch (err) {
    console.error("[Matachakra] Request error:", err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`\n🗳️  Matachakra running → http://${HOST}:${PORT}`);
});

server.on("error", (err) => {
  console.error("[Matachakra] Server error:", err);
  process.exit(1);
});
