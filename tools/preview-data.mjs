/* ============================================================================
   Stand-in store data for the theme preview (tools/shopify-preview.mjs).
   The real store's products, prices and text come from Shopify — nothing here
   is uploaded anywhere. PRICES ARE PLACEHOLDERS.
   ========================================================================== */
const img = (file, alt, width = 1000, height = 1250) => ({ src: `assets/${file}`, alt, width, height });

function product({ handle, title, type, price, description, images }) {
  const variant = { id: handle.length * 1000 + 1, title: 'Default Title', price, compare_at_price: null, available: true, options: ['Default Title'] };
  return {
    id: handle.length * 1000, handle, title, type, price, description,
    url: `/products/${handle}`, available: true,
    images, featured_image: images[0],
    has_only_default_variant: true, variants: [variant],
    selected_or_first_available_variant: variant, options_with_values: [],
  };
}

export const products = [
  product({
    handle: 'veyil', title: 'Veyil', type: 'Circle-handle hand bag', price: 680000,
    description: '<p>Every household keeps a katta pai by the door, the one grabbed without thinking, on the way out for a market run in the sun.</p><p>Veyil carries that same instinct into a hand bag people would actually want seen: the same brightness, the same readiness, made to be carried in the open sun. A circle cut clean through leather, the weave burning through the opening.</p>',
    images: [img('bag-veyil.jpg', 'Veyil hand bag held by its circular cut-out handle', 992, 1058), img('weave-veyil.jpg', 'Crimson and natural striped paai, close', 840, 587)],
  }),
  product({
    handle: 'nizhal', title: 'Nizhal', type: 'Shoulder baguette', price: 590000,
    description: '<p>There’s a particular kind of afternoon, too warm to be outside, quiet enough that the tiles hold the light in patches. Nizhal is that pause.</p><p>A shoulder bag built for the hours when the sun has moved off you and everything slows down — structured, close, unhurried, the shape of an afternoon slow.</p>',
    images: [img('bag-nizhal.jpg', 'Nizhal shoulder baguette tucked under an arm', 864, 1038), img('weave-nizhal.jpg', 'Navy, rust and natural chequered paai, close', 500, 180)],
  }),
  product({
    handle: 'maalai', title: 'Maalai', type: 'Domed tote', price: 740000,
    description: '<p>A paai, laid out flat, holds an entire gathering, from food and conversation to people settling in around it.</p><p>Maalai carries that same instinct into a tote: beige and black striped, wide and unfussy, made to hold whatever a day brings into it. Not only evenings, but just everything.</p>',
    images: [img('bag-maalai.jpg', 'Maalai domed tote in black and natural stripes', 846, 778), img('weave-maalai.jpg', 'Black and natural striped paai, close', 602, 688)],
  }),
  product({
    handle: 'vizha-long-clutch', title: 'Vizha — Long Clutch', type: 'Long clutch sling', price: 420000,
    description: '<p>Some nights aren’t ordinary, and the bag shouldn’t be either. Vizha is the colour saved for those: gem-toned, worn only when there’s a reason — a wedding, a festival, a night worth dressing for.</p><p>One length of paai runs unbroken across the back, over the flap and down the front — a single piece, folded rather than joined.</p>',
    images: [img('bag-vizha-clutch.jpg', 'Vizha long clutch held against the hip', 858, 890), img('weave-vizha-clutch.jpg', 'Wine and natural paai, close', 600, 420)],
  }),
  product({
    handle: 'vizha-half-moon', title: 'Vizha — Half Moon', type: 'Half-moon clutch', price: 480000,
    description: '<p>Some colours are kept back. They are not for the floor or the afternoon; they come out of the cupboard for weddings, for temple nights, for the days a house fills up.</p><p>The weave rises on both sides of a leather handle and meets at the top: a mat folded once, and carried by the fold.</p>',
    images: [img('bag-vizha-halfmoon.jpg', 'Vizha half-moon clutch on a ledge', 769, 944), img('weave-vizha.jpg', 'Magenta and emerald paai, close', 380, 230)],
  }),
];

export const collections = {
  naal: {
    handle: 'naal', title: 'Naal', url: '/collections/naal', description: '', products, products_count: products.length,
    featured_image: null,
  },
};

export const shop = {
  name: 'Artham',
  url: 'https://artham.example',
  description: 'Bags woven from korai paai in Pathamadai, Tamil Nadu. Collection One — Naal: one day, through one house.',
  money_format: '₹ {{amount}}',
  policies: [],
  password_message: '',
};

export const pages = { story: { title: 'Our story', content: '' } };

export const settings = { instagram: 'artham.made', whatsapp: '919952062202', email: '' };
