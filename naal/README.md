# Naal — by Artham

The website for **Naal**, Artham's first collection: four bags made from korai
paai hand-woven in Pathamadai, finished in leather.

It's one day through one house. As you scroll, the page moves from morning to
night: the background changes colour with the hour, and a small tear-off
calendar sheet in the corner keeps the time.

1. **The loom.** The hero is a paai being woven row by row, cycling through the four weaves of the collection.
2. **The paai.** A mat unrolls as you scroll, with memories pinned to it.
3. **Artham.** What the name means, and where the bags came from.
4. **Pathamadai.** The place, the weaver, and the six steps from the riverbank to your hand.
5. **Naal.** The day as a sun dial. The sun moves along it as you scroll, and each hour links to its chapter.
6. **Veyil · Nizhal · Malai · Vizha.** Each chapter opens on a scene, then its story card, then the bag. Each bag is revealed in its own shape: a circle for Veyil, tiles for Nizhal, stripes for Malai, a rising moon for the Half Moon. Tap the + marks for craft details. Three ways to wear each one follow.
7. **Made by hand**, care notes, **the founders**, **the story cards**, then **Choose your hour**.

## Ordering

"Add to your day" collects bags in a drawer. **Order on WhatsApp** opens
WhatsApp with the order already written out, including the buyer's name and city.

## Things to edit

At the very top of `assets/js/naal.js`:

```js
whatsapp: "919952062202",
instagram: "artham.made",
bags: [ { id: "veyil", ..., price: "" }, ... ]
```

Prices are blank. Write one as `price: "₹ 6,500"` and it shows under the bag,
in the order grid and in the WhatsApp message.

Concept photographs for the four scenes go in `images/concepts/`. See the README there.

## Files

```
index.html            the page (all the words are here)
assets/css/naal.css   design
assets/js/naal.js     behaviour + the bag/price list
assets/css/fonts.css  self-hosted Cormorant Garamond, Lora, Jost, Noto Serif Tamil (SIL OFL)
assets/img/           logo traced from ARTHAM_LOGO-FINAL-LOGO.pdf as clean SVG
images/bags/          the five bag photographs
images/story/         the Pathamadai story cards, whole and as illustrations
images/place/         the rolled paai and the loom, from the lookbook
images/weave/         close-ups of each weave, cropped from the bag photos
images/founders/      Prashantini & Dhiraj
images/concepts/      drop-in photos for the chapter scenes
```

There's no build step. Open `index.html`, or serve the repository root and visit `/naal/`.
