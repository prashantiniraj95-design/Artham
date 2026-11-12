#!/usr/bin/env node
/* ============================================================================
   Renders the Shopify theme in /shopify to plain HTML, so the design can be
   looked at (and sent to someone) without a Shopify store.

     npm install
     npm run preview            → dist/naal-preview/
     npm run preview:serve      → the same, served at http://localhost:8080

   It reads the theme's own Liquid, section schemas and JSON templates — nothing
   is duplicated — and stands in for Shopify with a handful of sample products
   (tools/preview-data.mjs). Prices there are placeholders.

   This is a preview tool, not a Shopify emulator: it implements only the tags
   and filters this theme uses.
   ========================================================================== */
import { Liquid, Tokenizer } from 'liquidjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { shop, products, collections, pages, settings } from './preview-data.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const THEME = path.join(ROOT, 'shopify');
const OUT = path.join(ROOT, 'dist', 'naal-preview');

const read = (...p) => fs.readFileSync(path.join(THEME, ...p), 'utf8');
const readJSON = (...p) => JSON.parse(read(...p));

/* ── where each Shopify URL lands in the preview ─────────────────────────── */
const urlMap = new Map([
  ['/', 'index.html'],
  ['/collections/naal', 'collection.html'],
  ['/collections', 'collection.html'],
  ['/collections/all', 'collection.html'],
  ['/cart', 'cart.html'],
  ['/search', 'collection.html'],
  ['/pages/our-story', 'story.html'],
  ...products.map((p) => [p.url, `product-${p.handle}.html`]),
]);
function rewriteLinks(html) {
  return html.replace(/(href|action)="(\/[^"#?]*)(\?[^"#]*)?(#[^"]*)?"/g, (m, attr, p, q, hash) => {
    const clean = p.length > 1 ? p.replace(/\/$/, '') : p;
    const file = urlMap.get(clean);
    return file ? `${attr}="${file}${hash || ''}"` : `${attr}="#"`;
  });
}

/* ── the engine ──────────────────────────────────────────────────────────── */
const engine = new Liquid({
  root: [path.join(THEME, 'snippets')],
  partials: [path.join(THEME, 'snippets')],
  extname: '.liquid',
  jsTruthy: false,
  strictFilters: true,
  ownPropertyOnly: false,
});

const money = (cents, trailing = true) => {
  const n = Number(cents || 0) / 100;
  const s = n.toLocaleString('en-IN', { minimumFractionDigits: trailing || n % 1 ? 2 : 0, maximumFractionDigits: 2 });
  return shop.money_format.replace(/\{\{\s*amount[a-z_]*\s*\}\}/, s);
};
engine.registerFilter('asset_url', (f) => `assets/${f}`);
engine.registerFilter('image_url', (img) => (img && img.src) || '');
engine.registerFilter('stylesheet_tag', (u) => `<link rel="stylesheet" href="${u}">`);
engine.registerFilter('script_tag', (u) => `<script src="${u}"></script>`);
engine.registerFilter('money', (c) => money(c));
engine.registerFilter('money_without_trailing_zeros', (c) => money(c, false));
engine.registerFilter('payment_button', () => '');
engine.registerFilter('video_tag', (v) => `<video autoplay muted loop playsinline src="${(v && v.src) || ''}"></video>`);
engine.registerFilter('handleize', (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));

// {% schema %} … {% endschema %} — read separately; prints nothing
const swallow = {
  parse(token, remaining) {
    const end = `end${token.name}`;
    this.body = [];
    const stream = this.liquid.parser.parseStream(remaining)
      .on(`tag:${end}`, () => stream.stop())
      .on('template', (tpl) => this.body.push(tpl))
      .on('end', () => { throw new Error(`{% ${token.name} %} not closed`); });
    stream.start();
  },
};
engine.registerTag('schema', { ...swallow, render() { return ''; } });
engine.registerTag('style', {
  ...swallow,
  *render(ctx, emitter) {
    emitter.write('<style>');
    yield this.liquid.renderer.renderTemplates(this.body, ctx, emitter);
    emitter.write('</style>');
  },
});
engine.registerTag('paginate', {
  ...swallow,
  *render(ctx, emitter) {
    ctx.push({ paginate: { pages: 1, previous: null, next: null } });
    yield this.liquid.renderer.renderTemplates(this.body, ctx, emitter);
    ctx.pop();
  },
});
// {% form 'product', product, class: 'x', data-foo: '' %}
engine.registerTag('form', {
  parse(token, remaining) {
    this.args = token.args;
    swallow.parse.call(this, token, remaining);
  },
  *render(ctx, emitter) {
    const type = (this.args.match(/^['"]([a-z_]+)['"]/) || [])[1] || '';
    const attrs = [...this.args.matchAll(/([a-z][a-z-]*)\s*:\s*'([^']*)'/g)]
      .map(([, k, v]) => (v === '' ? k : `${k}="${v}"`)).join(' ');
    emitter.write(`<form method="post" action="/cart" data-form-type="${type}" ${attrs}>`);
    ctx.push({ form: { 'posted_successfully?': false, errors: null } });
    yield this.liquid.renderer.renderTemplates(this.body, ctx, emitter);
    ctx.pop();
    emitter.write('</form>');
  },
});

/* ── sections ────────────────────────────────────────────────────────────── */
const schemaCache = new Map();
function sectionSchema(type) {
  if (!schemaCache.has(type)) {
    const src = read('sections', `${type}.liquid`);
    const m = src.match(/{%-?\s*schema\s*-?%}([\s\S]*?){%-?\s*endschema\s*-?%}/);
    schemaCache.set(type, m ? JSON.parse(m[1]) : {});
  }
  return schemaCache.get(type);
}
const defaultsOf = (defs = []) => Object.fromEntries(defs.filter((d) => d.id).map((d) => [d.id, d.default ?? '']));

// a `product` / `collection` setting holds a handle in JSON and an object in Liquid
function resolve(defs = [], values) {
  for (const d of defs) {
    if (d.type === 'product') values[d.id] = products.find((p) => p.handle === values[d.id]) || '';
    if (d.type === 'collection') values[d.id] = collections[values[d.id]] || '';
    if (d.type === 'image_picker' || d.type === 'video' || d.type === 'link_list' || d.type === 'url') values[d.id] = values[d.id] || '';
  }
  return values;
}

async function renderSection(id, conf, globals) {
  const schema = sectionSchema(conf.type);
  const section = {
    id,
    settings: resolve(schema.settings, { ...defaultsOf(schema.settings), ...(conf.settings || {}) }),
    blocks: (conf.block_order || []).map((bid) => {
      const b = conf.blocks[bid];
      const def = (schema.blocks || []).find((x) => x.type === b.type) || {};
      return {
        id: bid, type: b.type, shopify_attributes: '',
        settings: resolve(def.settings, { ...defaultsOf(def.settings), ...(b.settings || {}) }),
      };
    }),
  };
  const html = await engine.parseAndRender(read('sections', `${conf.type}.liquid`), { ...globals, section });
  return `<div id="shopify-section-${id}" class="shopify-section">${html}</div>`;
}

async function renderGroup(name, globals) {
  const group = readJSON('sections', `${name}.json`);
  const parts = [];
  for (const id of group.order) parts.push(await renderSection(id, group.sections[id], globals));
  return parts.join('\n');
}

/* ── a page ──────────────────────────────────────────────────────────────── */
async function renderPage(file, templateName, extra = {}) {
  const [name, suffix] = templateName.split('.');
  const template = readJSON('templates', `${templateName}.json`);
  const cart = extra.cart || { item_count: 0, items: [], total_price: 0, note: '', currency: { iso_code: 'INR' } };
  const globals = {
    shop, settings, cart, collections, all_products: Object.fromEntries(products.map((p) => [p.handle, p])),
    routes: { root_url: '/', cart_url: '/cart', cart_add_url: '/cart/add', cart_change_url: '/cart/change', collections_url: '/collections', search_url: '/search', all_products_collection_url: '/collections/all' },
    request: { locale: { iso_code: 'en' } },
    template: { name, suffix: suffix || null },
    canonical_url: `${shop.url}/`,
    page_title: extra.title || shop.name,
    page_description: extra.description || shop.description,
    content_for_header: '',
    ...extra,
  };

  const body = [];
  for (const id of template.order) body.push(await renderSection(id, template.sections[id], globals));

  // {% sections %} and {% section %} need the page's globals, so they are bound per page
  engine.registerTag('sections', {
    parse(token) { this.group = token.args.replace(/['"\s]/g, ''); },
    *render() { return yield renderGroup(this.group, globals); },
  });
  engine.registerTag('section', {
    parse(token) { this.type = token.args.replace(/['"\s]/g, ''); },
    *render() { return yield renderSection(this.type, { type: this.type }, globals); },
  });

  const layout = template.layout === 'password' ? 'password' : 'theme';
  let html = await engine.parseAndRender(read('layout', `${layout}.liquid`), { ...globals, content_for_layout: body.join('\n') });
  html = rewriteLinks(html).replace('</body>', `<script src="preview.js"></script>\n</body>`);
  fs.writeFileSync(path.join(OUT, file), html);
  console.log('  ', file);
}

/* ── build ───────────────────────────────────────────────────────────────── */
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
for (const f of fs.readdirSync(path.join(THEME, 'assets'))) {
  fs.copyFileSync(path.join(THEME, 'assets', f), path.join(OUT, 'assets', f));
}
fs.copyFileSync(path.join(ROOT, 'tools', 'preview-cart.js'), path.join(OUT, 'preview.js'));

console.log('Rendering the Naal theme →', path.relative(ROOT, OUT));
await renderPage('index.html', 'index', { title: 'Artham — Naal, Collection One' });
await renderPage('collection.html', 'collection', { collection: collections.naal, title: 'Naal' });
for (const product of products) {
  await renderPage(`product-${product.handle}.html`, 'product', { product, title: product.title });
}
const line = (p, quantity) => ({ product: p, variant: p.variants[0], url: p.url, image: p.featured_image, quantity, final_line_price: p.price * quantity });
const items = [line(products[0], 1), line(products[2], 1)];
await renderPage('cart.html', 'cart', {
  title: 'Your bag',
  cart: { item_count: 2, items, total_price: items.reduce((s, i) => s + i.final_line_price, 0), note: '', currency: { iso_code: 'INR' } },
});
await renderPage('story.html', 'page.story', { page: pages.story, title: 'Our story' });
await renderPage('404.html', '404', { title: 'Not here' });

// a copy of the homepage without its own <html>/<head>/<body>, for hosts that wrap the page themselves
const home = fs.readFileSync(path.join(OUT, 'index.html'), 'utf8');
const head = home.match(/<head>([\s\S]*?)<\/head>/)[1]
  .replace(/<title>[\s\S]*?<\/title>/, '<title>Artham Naal</title>')
  .replace(/<link rel="(canonical|preload)"[^>]*>\n?/g, '');
const bodyHtml = home.match(/<body[^>]*>([\s\S]*?)<\/body>/)[1];
fs.writeFileSync(path.join(OUT, 'embed.html'), head + bodyHtml);
console.log('Done.');
