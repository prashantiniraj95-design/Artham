/* ============================================================================
   Artham — build a shareable preview
   ----------------------------------------------------------------------------
   Squashes the whole site into ONE self-contained HTML file, with the fonts
   and images carried inside it as data URIs. That file can be published as a
   private link, mailed to someone, or opened on a phone with no server.

       node tools/build-preview.mjs

   The website itself still needs no build step. This script exists only to
   make a preview — nothing in index.html, content.js or the stylesheets
   depends on it ever having been run.
   ========================================================================== */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve, basename, extname, relative, sep } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "dist", "artham-preview.html");

const read = (path) => readFileSync(join(ROOT, path), "utf8");

const dataUri = (path, mime) =>
  `data:${mime};base64,` + readFileSync(join(ROOT, path)).toString("base64");

/* ── the assets that have to travel inside the file ───────────────────────── */

/* Found on disk, never listed by hand. A hardcoded list goes stale the moment
   a photograph is added or a typeface swapped, and the failure is silent — a
   missing picture in the published page, with nothing in the console. */
function walk(dir, exts) {
  const here = join(ROOT, dir);
  let entries;
  try { entries = readdirSync(here); } catch { return []; }
  return entries.flatMap((name) => {
    const rel = dir + "/" + name;
    if (statSync(join(ROOT, rel)).isDirectory()) return walk(rel, exts);
    return exts.includes(extname(name).toLowerCase()) ? [rel.split(sep).join("/")] : [];
  });
}

const FONTS  = walk("assets/fonts", [".woff2"]);
const IMAGES = [...walk("assets/img", [".svg", ".png", ".jpg", ".jpeg"]),
                ...walk("content/images", [".svg", ".png", ".jpg", ".jpeg"])];

const MIME = { ".svg": "image/svg+xml", ".png": "image/png",
               ".jpg": "image/jpeg", ".jpeg": "image/jpeg" };

/* taken from index.html in the order it loads them, so a script added to the
   page can never be quietly left out of the preview */
const SCRIPTS = [...readFileSync(join(ROOT, "index.html"), "utf8")
  .matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);

/* ── the pieces ───────────────────────────────────────────────────────────── */

/* fonts.css points at ../fonts/*.woff2; each becomes the font itself */
function fontCss() {
  let css = read("assets/css/fonts.css");
  for (const path of FONTS) {
    css = css.split(`../fonts/${basename(path)}`).join(dataUri(path, "font/woff2"));
  }
  return css.trim();
}

/* An artifact supplies its own <!doctype>, <html>, <head> and <body>, so only
   what lives inside <body> may be kept. The <head> goes, and with it the font
   preloads and the icon link — they point at files that no longer exist
   separately, and a strict CSP would block them anyway. */
function bodyMarkup() {
  const html = read("index.html");
  const open = html.indexOf("<body>");
  const close = html.lastIndexOf("</body>");
  if (open === -1 || close === -1) {
    throw new Error("index.html: could not find <body>…</body>");
  }
  return html
    .slice(open + "<body>".length, close)
    .replace(/^[ \t]*<script src="[^"]+"><\/script>[ \t]*\r?\n?/gm, "")
    .trim();
}

/* a closing tag hiding inside a JavaScript string would end the block early */
const guard = (js) => js.split("</script").join("<\\/script");

/* ── keep it to plain ASCII ───────────────────────────────────────────────
   index.html declares <meta charset="utf-8"> in a <head> this file doesn't
   get to keep, and a browser that isn't told the encoding falls back to
   Latin-1 — which turns every em dash into "â€". Rather than depend on
   whatever wraps the page to declare UTF-8, the em dashes and arrows are
   written as escapes, so the file is pure ASCII and reads the same way
   everywhere: published, mailed, or opened straight off a disk.          */

const hex = (n) => n.toString(16).toUpperCase();

/* &#xNNNN; — the u flag matters here, so an astral character stays whole */
const asciiHtml = (s) =>
  s.replace(/[^\x00-\x7F]/gu, (c) => `&#x${hex(c.codePointAt(0))};`);

/* \NNNN followed by a space, the CSS form */
const asciiCss = (s) =>
  s.replace(/[^\x00-\x7F]/gu, (c) => `\\${hex(c.codePointAt(0))} `);

/* \uNNNN — and here the u flag must stay OFF: without it each half of a
   surrogate pair is escaped separately, which is exactly what JavaScript
   wants, whereas codePointAt would emit one escape JavaScript can't read */
const asciiJs = (s) =>
  s.replace(/[^\x00-\x7F]/g, (c) => "\\u" + hex(c.charCodeAt(0)).padStart(4, "0"));

/* Every reference to a picture becomes the picture. Done as a plain text swap
   across markup, stylesheets and scripts together, because these paths turn up
   in more places than you'd guess: the logo is named in index.html AND in
   artham.js, and the sample photographs are named as ordinary strings inside
   content.js. */
const replaced = new Set();

function inlineImages(text) {
  /* longest path first, so "…/boat.jpg" can never be swallowed by a shorter
     name that happens to be a prefix of it */
  for (const path of [...IMAGES].sort((a, b) => b.length - a.length)) {
    if (!text.includes(path)) continue;
    text = text.split(path).join(dataUri(path, MIME[extname(path).toLowerCase()]));
    replaced.add(path);
  }
  return text;
}

/* Some paths are never written down whole — doodles.js builds them as
   DIR + name + ".png", and the footer mark picks its file by theme. A text
   swap cannot see those, and the page then asks the network for a file that
   isn't there. So whatever the swap didn't catch gets handed to the page as a
   lookup table, which the two places that build paths consult. */
function inlineTable() {
  /* Only assets/img — those are the ones a script assembles by hand (the
     doodles, the themed mark). Anything under content/images is always named
     in full inside content.js, so if the swap didn't catch it, no chapter
     references it and it has no business in the bundle. */
  const left = IMAGES.filter((p) => !replaced.has(p) && p.startsWith("assets/img/"));
  if (!left.length) return "";
  const pairs = left.map((p) =>
    JSON.stringify(p) + ":" + JSON.stringify(dataUri(p, MIME[extname(p).toLowerCase()])));
  return "<script>window.ARTHAM_INLINE={" + pairs.join(",") + "};<\/script>\n";
}

/* ── assemble ─────────────────────────────────────────────────────────────── */

const core = inlineImages([
  "<title>Artham</title>",
  "",
  "<style>", asciiCss(fontCss()), "</style>",
  "",
  "<style>", asciiCss(read("assets/css/artham.css").trim()), "</style>",
  "",
  asciiHtml(bodyMarkup()),
  "",
  ...SCRIPTS.flatMap((path) => [
    `<script>/* ${basename(path)} */`,
    asciiJs(guard(read(path)).trim()),
    "</script>",
    ""
  ])
].join("\n"));

/* the table has to be built AFTER the swap, or it carries every picture that
   the swap already inlined and the file comes out twice the size */
const table = inlineTable();
const marker = `<script>/* ${basename(SCRIPTS[0])} */`;
const bundle = table ? core.replace(marker, table + marker) : core;

/* ── refuse to ship a broken one ──────────────────────────────────────────── */

/* A reference that survived shows up in the published page as a silently
   missing image or an unstyled paragraph — no error, nothing in the console.
   Cheaper to fail here. */
const problems = [];

/* Check the page without the lookup table, since the table quite legitimately
   contains every one of these paths as a key. */
const withoutTable = table ? bundle.replace(table, "") : bundle;
for (const path of IMAGES) {
  if (withoutTable.includes(path)) problems.push(`image not inlined: ${path}`);
}
if (!FONTS.length) problems.push("no fonts found under assets/fonts");
if (bundle.includes("../fonts/")) {
  problems.push("a font is still loaded from ../fonts/");
}

const ALLOWED = /^(data:|#|mailto:|https:\/\/wa\.me\/|https:\/\/instagram\.com\/)/;
for (const [, value] of bundle.matchAll(/(?:src|href)="([^"]*)"/g)) {
  if (!ALLOWED.test(value)) problems.push(`link points off the page: ${value.slice(0, 70)}`);
}
/* url(#id) — or url(%23id) once it's inside a data URI — points at something
   in the page itself, like the grain filter. Only a network path is a fault. */
const SELF_REF = /^(data:|#|%23)/;
for (const [, value] of bundle.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
  if (!SELF_REF.test(value)) problems.push(`stylesheet fetches: ${value.slice(0, 70)}`);
}

const nonAscii = bundle.match(/[^\x00-\x7F]/u);
if (nonAscii) {
  const line = bundle.slice(0, bundle.indexOf(nonAscii[0])).split("\n").length;
  problems.push(`not plain ASCII: ${JSON.stringify(nonAscii[0])} at line ${line}`);
}

for (const tag of ["<!doctype", "<html", "<head", "<body"]) {
  if (bundle.toLowerCase().includes(tag)) {
    problems.push(`contains ${tag}…>, which the artifact wrapper supplies itself`);
  }
}

if (problems.length) {
  console.error("Preview NOT written:\n  - " + problems.join("\n  - "));
  process.exit(1);
}

/* ── write ────────────────────────────────────────────────────────────────── */

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, bundle + "\n");

console.log(
  `dist/artham-preview.html — ${(Buffer.byteLength(bundle) / 1024).toFixed(0)} KB, ` +
  `self-contained (${FONTS.length} fonts, ${IMAGES.length} images, ${SCRIPTS.length} scripts inside)`
);
