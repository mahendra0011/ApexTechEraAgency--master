#!/usr/bin/env node
/**
 * Local preview server for the static export in `out/`.
 *
 * `python -m http.server` speaks HTTP/1.0 and never compresses: the 466 KB
 * HTML shell shipped as 466 KB, every JS chunk as raw text, plus a new TCP
 * connection per file and no Range support for <video>. That made the
 * production build feel as slow as `next dev`. This serves the same files the
 * way a real host does:
 *   - gzip / brotli negotiation (466 KB HTML -> ~35 KB)
 *   - keep-alive and immutable caching for hashed `/_next/static` assets
 *   - Range requests (206) so videos can stream and seek while playing
 *
 * Usage: npm run preview          (http://localhost:4100)
 *        npm run preview -- 4200  (custom port)
 */
import { createServer } from "node:http";
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize, sep } from "node:path";
import { gzipSync, brotliCompressSync, constants } from "node:zlib";

const ROOT = join(process.cwd(), "out");
const PORT = Number(process.argv[2]) || Number(process.env.PORT) || 4100;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".wasm": "application/wasm",
  ".hdr": "application/octet-stream",
  ".glb": "model/gltf-binary",
  ".gltf": "model/gltf+json",
  ".map": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

const COMPRESSIBLE = /^(text\/|application\/(javascript|json|xml|manifest|wasm)|image\/svg|font\/)/;

if (!existsSync(ROOT)) {
  console.error("out/ not found — run `npm run build` first.");
  process.exit(1);
}

// Compressed variants are cached per file+encoding: compressing the 600 KB JS
// chunks on every request made the "fast" preview slower than production.
const compressedCache = new Map();

function compressed(file, stat, encoding) {
  const key = `${file}|${stat.mtimeMs}|${encoding}`;
  let hit = compressedCache.get(key);
  if (!hit) {
    const raw = readFileSync(file);
    hit =
      encoding === "br"
        ? brotliCompressSync(raw, {
            params: { [constants.BROTLI_PARAM_QUALITY]: 5 },
          })
        : gzipSync(raw, { level: 6 });
    compressedCache.set(key, hit);
  }
  return hit;
}

function resolveFile(urlPath) {
  let p = decodeURIComponent(urlPath.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  let full = normalize(join(ROOT, p));
  if (full !== ROOT && !full.startsWith(ROOT + sep)) return null; // no traversal
  if (existsSync(full) && statSync(full).isDirectory()) full = join(full, "index.html");
  if (!existsSync(full) && existsSync(full + ".html")) full = full + ".html";
  if (!existsSync(full) || !statSync(full).isFile()) return null;
  return full;
}

createServer((req, res) => {
  const file = resolveFile(req.url || "/");
  if (!file) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404");
    return;
  }

  const stat = statSync(file);
  const type = MIME[extname(file).toLowerCase()] || "application/octet-stream";
  const headers = {
    "Content-Type": type,
    "Last-Modified": stat.mtime.toUTCString(),
    "Accept-Ranges": "bytes",
    // Hashed build output can be cached forever; HTML must always revalidate.
    "Cache-Control": file.includes(`${sep}_next${sep}static${sep}`)
      ? "public, max-age=31536000, immutable"
      : "public, max-age=0, must-revalidate",
  };

  // Range support: without it the browser cannot seek/stream the mp4s.
  const range = req.headers.range;
  let start = 0;
  let end = stat.size - 1;
  let status = 200;
  if (range) {
    const m = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (m) {
      if (m[1] !== "") start = Number(m[1]);
      if (m[2] !== "") end = Number(m[2]);
      if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= stat.size) {
        res.writeHead(416, { "Content-Range": `bytes */${stat.size}` });
        res.end();
        return;
      }
      end = Math.min(end, stat.size - 1);
      status = 206;
      headers["Content-Range"] = `bytes ${start}-${end}/${stat.size}`;
    }
  }
  const length = end - start + 1;

  // Compression for full responses only — a Range reply must stay raw so the
  // browser can seek/stream the videos.
  let payload = null;
  if (!range && length > 1400 && COMPRESSIBLE.test(type)) {
    const accept = String(req.headers["accept-encoding"] || "");
    if (accept.includes("br")) {
      payload = compressed(file, stat, "br");
      headers["Content-Encoding"] = "br";
    } else if (accept.includes("gzip")) {
      payload = compressed(file, stat, "gzip");
      headers["Content-Encoding"] = "gzip";
    }
    if (payload) {
      // Compressed and raw variants must not be swapped around by a cache.
      headers["Vary"] = "Accept-Encoding";
    }
  }

  headers["Content-Length"] = payload ? payload.length : length;

  res.writeHead(status, headers);
  if (req.method === "HEAD") {
    res.end();
    return;
  }
  if (payload) {
    res.end(payload);
    return;
  }
  createReadStream(file, { start, end }).pipe(res);
}).listen(PORT, () => {
  console.log(`▲ static preview (gzip/brotli + range) → http://localhost:${PORT}`);
});
