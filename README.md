# Artham

The website for **Artham** — a handmade brand celebrating the joy of
handmaking and the imperfections. Experimenting with material combinations,
inspired by everyday colours and patterns.

It's built as a storyboard. You scroll through it like a book: a memory first,
then the small objects that belong to that memory. Sticky notes with fun facts
sit on top of the pages, and you can drag them wherever you like — the site
remembers where you left them. Between the chapters, a drawing of the work
itself stands on a run of stitching: a thumbprint pressed into a clay tag, a
lino block mid-cut beside its finished print, a mat half woven on the loom.

---

## Where things are

```
index.html                 the page itself
content/content.js         ← everything the site says lives here
content/images/            story cards and product photos
assets/css/artham.css      the design system
assets/css/fonts.css       self-hosted type
assets/fonts/              Caveat, Karla, Lora (SIL Open Font License)
assets/js/artham.js        builds the chapters from content.js
assets/js/notes.js         the sticky notes
assets/js/sketches.js      the line drawings between the chapters
tools/build-preview.mjs    makes a one-file copy for sharing a preview
CONTENT-GUIDE.md           how to add a chapter, a product, a note
```

**To change any text or add a product, you only ever open
`content/content.js`.** [CONTENT-GUIDE.md](CONTENT-GUIDE.md) walks through it
step by step, with blocks you can copy and paste.

---

## Seeing it on your own computer

Download the folder and **double-click `index.html`**. It opens in your
browser and works completely — no internet, no installing, nothing to run.
Edit `content.js`, save, refresh the page.

If you'd rather serve it properly:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

---

## Sending someone a preview

```sh
node tools/build-preview.mjs
```

That writes `dist/artham-preview.html` — the entire site squashed into one
file, with the fonts and pictures carried inside it. Nothing else is needed to
open it: no server, no internet, no other files. Good for mailing to someone,
or publishing as a private link before the site goes public.

**The site itself still has no build step.** Nothing in `index.html`,
`content.js` or the stylesheets depends on this script ever being run — it only
makes a copy. Edit your content, run it again, and the preview catches up.

---

## Putting it online

The site is plain HTML, CSS and JavaScript with no build step, so GitHub Pages
can host it as-is and for free:

1. Repository → **Settings** → **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `main`, folder `/ (root)` → **Save**

A minute later it's live. Every commit to `main` republishes it automatically.

To use your own domain, add it under **Settings → Pages → Custom domain**.

---

## What's still to come

The two chapters marked `SAMPLE` in `content.js` are filler, so the design
could be seen working before the real stories arrived. They're wrapped in
`DELETE FROM HERE` / `DELETE TO HERE` markers — delete everything between them
and the samples are gone.

Still to add:

- [ ] Prashantini's own note at the top (`maker.paragraphs`)
- [ ] The real story chapters and their illustrations
- [ ] Product photos and descriptions under each chapter
- [ ] Fun facts for the sticky notes — craft facts (`tone: "fact"`) and
      personal memories (`tone: "memory"`)

---

## Notes for anyone maintaining it

- **No build step, on purpose.** The brand owner edits `content.js` in the
  GitHub web editor without installing anything. Keep it that way.
- `content.js` sets `window.ARTHAM` rather than being JSON fetched at runtime,
  so opening `index.html` from the filesystem works with no local server.
- Chapters are rendered client-side, which is a little weaker for search
  engines than static markup. The trade is deliberate — traffic comes from
  Instagram, and the owner being able to edit her own site matters more.
  `index.html` carries real meta, Open Graph and JSON-LD tags, plus a
  `<noscript>` fallback with the contact details.
- Type is self-hosted (`assets/fonts/`), so there's no third-party request and
  the site renders identically offline.
- Everything respects `prefers-reduced-motion` and `prefers-color-scheme`.
- Sticky notes are keyboard-operable: `Tab` to one, arrow keys to move it,
  `Shift` + arrow to move it further.

---

## Oru Naal — Collection One (preview)

`oru-naal/` is a standalone page for the first bag collection: korai paai
from Pathamadai, finished in leather. It reads as one day in one house —
Veyil (midday), Nizhal (afternoon), Malai (evening), Vizha (festival night) —
then the craft, an Instagram strip, and a short shop with a bag that sends the
order on WhatsApp.

Open `oru-naal/index.html`. Photos, weave swatches and drawings come from the
lookbook and the Pathamadai story cards. **Placeholders still to replace:**
prices (in `oru-naal/oru-naal.js` and the `.price` lines in the page), the
"hands stitching the leather edge" photo, and two Instagram tiles (the woven
`<canvas>` squares).
