# Adding your stories and products

Everything the website says lives in **one file**: `content/content.js`.
You never need to touch anything else. No installing, no coding.

---

## The three rules

1. Text goes inside `"quote marks"`.
2. Every line inside a `{ }` block ends with a **comma**.
3. Apostrophes are fine inside double quotes — `"Amma's kitchen"` works.

If the site ever goes blank after an edit, it's almost always a missing comma
or a missing quote mark. Undo your last change and try again.

---

## How to edit without installing anything

1. Go to the repository on github.com.
2. Open `content/content.js`.
3. Click the **pencil** icon (top right of the file).
4. Make your change.
5. Scroll down, click **Commit changes**.
6. Wait about a minute. The live site updates itself.

---

## Adding a chapter

A chapter is one story plus the objects that belong to it. Copy this whole
block and paste it inside the `chapters: [ ... ]` list — right after the `{`
of an existing chapter's closing `},`.

```js
{
  id: "kites",
  title: "Skies We Owned",
  subtitle: "Kite Collection",
  story: "The days when rooftops turned into battlefields of flying colours...",
  card: {
    src: "content/images/kites/story.jpg",
    alt: "Two paper kites climbing a pale blue sky"
  },
  notes: [
    { text: "Manja was cotton thread rolled in rice glue and glass powder.", tone: "fact" },
    { text: "Write a memory of your own here.", tone: "memory" }
  ],
  products: [
    {
      name: "Kite Magnet",
      description: "A slice of the sky that sticks where you need it.",
      image: "content/images/kites/magnet.jpg",
      alt: "A small painted kite magnet on a lined card"
    },
    {
      name: "Kite Brooch",
      description: "Pin on the rooftop laughter of childhood evenings.",
      image: "content/images/kites/brooch.jpg",
      alt: "A kite-shaped brooch with a beaded tail"
    }
  ]
},
```

**What each line means**

| Line | What it does |
|---|---|
| `id` | The short web address for the chapter — lowercase, no spaces. `artham.com/#kites` |
| `title` | The big maroon heading |
| `subtitle` | The green line under it. Leave it out if you don't want one |
| `story` | The paragraph. Write it however you'd say it out loud |
| `card` | The illustration for the chapter — its file, and a short description for people using screen readers |
| `notes` | The sticky notes for this chapter (see below) |
| `products` | The objects, in the order you want them shown |
| `sketch` | Optional — picks the little drawing that follows this chapter (see below) |

Chapters appear on the site in the same order they appear in the file. To move
a chapter earlier, move its block earlier.

---

## Adding a product to a chapter

Inside that chapter's `products: [ ... ]` list, paste:

```js
{
  name: "Kite Keychain",
  description: "A dangling reminder of colours we once chased.",
  size: "4.1\" x 5.8\" (A6)",
  image: "content/images/kites/keychain.jpg",
  alt: "A pair of small kite keychains"
},
```

`size` is optional — include it only when the size matters, like for
notebooks and cards. Leave the whole line out otherwise.

Every product automatically gets an **"Ask about this →"** tag that opens
WhatsApp with the product name already typed in, and a small Instagram link
beside it. You don't have to add those.

---

## Sticky notes

The little paper squares people can drag around. Two kinds:

```js
notes: [
  { text: "Athangudi tiles are still poured by hand, one tile at a time.", tone: "fact" },
  { text: "Appa always got the knots out of my manja.", tone: "memory" }
]
```

- `tone: "fact"` → yellow. Craft facts, materials, how a thing is made.
- `tone: "memory"` → pink. Your own memories.

Two or three notes per chapter is plenty. Each one lands in the empty margin
beside a product — the first note beside the first piece, the second beside the
second, and so on — so a fact sits next to the thing it's about. If a chapter
has more notes than pieces they share a margin, stacked one under the other.

If you want a note in a very specific spot, add `x` and `y` — fractions of the
story block, where `0` is the left/top edge and `1` is the right/bottom:

```js
{ text: "…", tone: "fact", x: 0.1, y: 0.6 }
```

On a phone there's no margin to sit in, so the notes line up under the story
instead — still draggable, and still never covering a photograph.

---

## The little sketches

Between every two chapters there's a run of stitching with a drawing standing
on it — a thumbprint pressed into a clay tag, a lino block mid-cut beside its
finished print, a beading tray. They appear on their own, in order, and you
don't have to do anything to get them.

If you'd like a particular one after a particular chapter, add a `sketch` line
to that chapter:

```js
{
  id: "athangudi",
  title: "Floors That Spoke",
  sketch: "lino",
  ...
}
```

The ones available:

| Name | What it draws |
|---|---|
| `thumbprint` | A clay tag on a twine loop, thumbprint pressed in, rib set down beside it |
| `stitchedclay` | A clay tile worked three ways — running stitch through drilled holes, a row of crosses, a line of French knots |
| `lino` | A block mid-cut, gouge in hand, the finished print pinned up behind |
| `beads` | The beading tray — loose beads in the dish, a strand coming off it |
| `weave` | A mat half woven on the loom, shuttle set down mid-row |
| `coil` | A rolling pin, a rolled slab, and the coil wound from it |
| `bloom` | A flower being embroidered in a hoop, needle still in the cloth |
| `kolam` | A kolam laid out round its dots, the flour bowl to hand |
| `three` | Three pots that were meant to match |
| `table` | The craft table — brushes in a jar, a palette, scissors, a spool |

They're drawn in the brand's own colours and follow the page into dark mode by
themselves.

---

## Adding pictures

1. Make a folder for the chapter: `content/images/kites/`
2. Put the pictures in it.
3. Write the path in `content.js` exactly as it appears, including the folder:
   `"content/images/kites/magnet.jpg"`

**On github.com:** open the `content/images` folder → **Add file** → **Upload
files** → drag them in → **Commit changes**.

Naming: use lowercase, no spaces. `paper-boat-charm.jpg`, not
`Paper Boat Charm (1).JPG`.

Size: photos around **1200–1600 pixels wide** and under **400 KB** keep the
site quick. Anything straight off a phone camera is far bigger than it needs
to be — resize before uploading.

The `alt` line is a short description for people who can't see the image, and
for Google. Describe what's in the photo: `"A yellow paper boat charm resting
in an open palm"`.

---

## Your own note at the top

Near the top of `content.js`:

```js
maker: {
  heading: "Hi, I'm Prashantini",
  subheading: "Creative mind behind Artham",
  paragraphs: [
    "First paragraph.",
    "Second paragraph."
  ],
  portrait: "content/images/prashantini.jpg",
  portraitAlt: "Prashantini at her craft table"
}
```

One line per paragraph. Add as many as you like. Leave `portrait: ""` if you
don't want a photo.

---

## Care and contact

Also in `content.js`, at the bottom — `care` (the "little care goes a long
way" panel) and `contact` (your links). Your WhatsApp number and Instagram
handle live in the `brand` block at the very top, and every enquiry link on
the site uses them, so you only change them in that one place. (There's an
`email` field too, if you ever want one — leave it out and the site simply
doesn't show one.)

---

## Deleting the samples

The two chapters marked `SAMPLE` are filler so you could see the design before
your own words arrived. In `content.js` you'll find:

```
/* ▼▼▼ SAMPLE — DELETE FROM HERE ▼▼▼ */
   ...
/* ▲▲▲ SAMPLE — DELETE TO HERE ▲▲▲ */
```

Delete everything between those two markers, including the markers, and put
your own chapters there instead. You can also delete the
`content/images/_sample/` folder once they're gone.

---

## Checking your work before it goes live

Download the folder and double-click `index.html` — it opens in your browser
and shows the real site, no internet needed. Edit `content.js` in any text
editor, save, refresh the page.
