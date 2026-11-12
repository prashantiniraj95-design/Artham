# Artham — Naal · the Shopify theme

`/shopify` is a complete Online Store 2.0 theme. Everything on it can be edited
in Shopify's theme editor — text, photographs, the film — without touching code.

## The idea

**Naal is one day in one house, so the site is one day.** You land on the film,
then scroll through the four hours. The whole page changes its light as you go:
paper at dawn, sun-yellow for **Veyil**, cool shade for **Nizhal**, dusk for
**Maalai**, wine-dark night for **Vizha** — then back to paper for Pathamadai,
the pieces and the founders. A product page opens in the light of its own hour.

## Putting it on your store

1. Zip the **contents** of `/shopify` (the `assets`, `config`, `layout`… folders
   themselves, not the folder that holds them).
2. Shopify admin → **Online Store → Themes → Add theme → Upload zip file**.
3. **Products → Import** → `shopify-setup/products-import.csv`. It creates the
   five pieces as **drafts with a price of 0** — set real prices, add
   photographs, then make them active.
4. **Products → Collections → Create collection**, titled `Naal` (so its handle
   is `naal`), and add the five pieces.
5. **Customize** the theme and look through the homepage. The chapters link
   themselves to the products by handle (`veyil`, `nizhal`, `maalai`,
   `vizha-long-clutch`, `vizha-half-moon`).

The theme decides which hour a product belongs to from its handle, so keep
`veyil`, `nizhal`, `maalai` or `vizha` somewhere in it.

## Before launch — what is a stand-in

| What | Now | Replace with |
|---|---|---|
| **Hero film** | A 20-second film cut from four still photographs | Real footage, uploaded in *Customize → Hero film*. Four equal cuts — morning, afternoon, evening, night — line up with the four markers under the film |
| **Mood photographs** | Licensed stand-ins from Wikimedia Commons (`IMAGE-CREDITS.md`) | Your shoot — see the shot list below |
| **Product photographs** | Lifted from the lookbook PDF, about 900px wide | The original high-resolution files (2000px or wider) |
| **Dhiraj's portrait** | A woven tile with his initial | A portrait, 4:5, in *Customize → Founders* |
| **Prices** | 0 in the import file; placeholders in the preview | Yours |
| **Care text** | A general note for grass and leather | Your own wording, in *Customize → Product* |

## Shot list — each bag in its own hour

Once these exist, switch off *“Lay the hour's light over the product
photograph”* in each chapter: the real light will already be in the picture.

- **Veyil · morning sun** — the bag hanging on a hook by a sunlit doorway; in a
  hand on the way to market, long morning shadows on the road; on a kolam
  threshold with the sun raking across it. Hard, warm, direct light.
- **Nizhal · shade** — the bag on a tiled floor with window-grill shadows
  falling across it; on a cane chair under leaf shadow; against a wall where
  only its shadow is in the sun. Cool, still, mostly shadow.
- **Maalai · evening gathering** — the tote on a paai laid out for people: tea
  tumblers, playing cards, hands, bare feet at the edges. Shot from above and
  from the floor. Low golden light, then lamplight.
- **Vizha · festival** — the clutches against silk, bangles, flower garlands,
  oil lamps; in a hand at a wedding; with lights out of focus behind. Colour
  and glow, dark background.

## Previewing without a store

```sh
npm install
npm run preview:serve     # http://localhost:8080
```

`tools/shopify-preview.mjs` renders the real theme files with sample products.
