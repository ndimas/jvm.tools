import { join } from "node:path";

// Serve the deploy output directory (what Cloudflare Pages publishes).
const ROOT = join(process.cwd(), "site-public");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js":  "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg":"image/jpeg",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".json":"application/json; charset=utf-8",
};
function typeFrom(p){
  const ext = p.slice(p.lastIndexOf(".")).toLowerCase();
  return MIME[ext] || "application/octet-stream";
}

const server = Bun.serve({
  port: Number(process.env.PORT || 3000),
  async fetch(req) {
    const url = new URL(req.url);
    const path = decodeURIComponent(url.pathname);

    if (path === "/" || path === "/index.html") {
      const f = Bun.file(join(ROOT, "index.html"));
      if (await f.exists()) return new Response(f, { headers: { "content-type": MIME[".html"] } });
    }
    if (path.endsWith("/")) {
      const f = Bun.file(join(ROOT, path, "index.html"));
      if (await f.exists()) return new Response(f, { headers: { "content-type": MIME[".html"] } });
    }
    const rel = path.startsWith("/") ? path.slice(1) : path;
    const file = Bun.file(join(ROOT, rel));
    if (await file.exists()) {
      return new Response(file, { headers: { "content-type": typeFrom(path) } });
    }
    return new Response("Not found: " + path, { status: 404 });
  }
});

console.log("Preview server at http://localhost:" + server.port);
console.log("Serving: " + ROOT);
console.log("Ctrl+C to stop. Try: /  /tools/jvm-cli/jcmd/  /guides/jvm-flags/");
