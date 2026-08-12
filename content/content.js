/* ============================================================================
   ARTHAM — the only file you need to edit.
   ----------------------------------------------------------------------------
   Everything the website says lives in this one file. Change the words here,
   save, and the site changes. Nothing else needs touching.

   Three rules, and only three:
     1. Text goes inside "quote marks".
     2. Every line inside a { } block ends with a comma.
     3. An apostrophe is fine inside "double quotes" — "Amma's kitchen".

   A full walkthrough with copy-paste blocks is in CONTENT-GUIDE.md.
   ========================================================================== */

window.ARTHAM = {

  /* ── The brand ─────────────────────────────────────────────────────────── */
  brand: {
    name: "Artham",
    tagline: "crafted by hand, carried by memories",
    blurb: "Everyday memories, reimagined through craft.",

    // Used by the "Ask about this" tag on every product.
    // Country code, no plus sign, no spaces.
    whatsapp: "919952062202",
    instagram: "artham.made"
  },

  /* ── The introduction ──────────────────────────────────────────────────── */
  maker: {
    heading: "Hi, this is Prashantini Raj",
    subheading: "the heart behind Artham",

    paragraphs: [
      "Artham is a handmade brand built around the little things that stay with us.",
      "A pattern we've seen a hundred times. A game we played as children. A meal we sat down to together. A bird, a kite, a flower, a familiar object.",
      "We take these everyday things and reimagine them through craft — using simple, familiar techniques and bringing together materials like clay, fabric, thread, paper and more.",
      "Because sometimes, a tiny object can take you back to a whole memory.",
      "That's what Artham makes: everyday memories, reimagined through craft."
    ],

    portrait: "content/images/prashantini.jpg",
    portraitAlt: "Prashantini Raj sitting in the shade of a curved concrete arch, smiling, in a printed shirt"
  },

  /* ── The chapters ──────────────────────────────────────────────────────────
     The illustrations and the stories come from the Artham catalogue. Each
     chapter holds the pieces that belong to that memory, whatever they happen
     to be made of.
     ------------------------------------------------------------------------ */
  chapters: [

    {
      id: "kites",
      title: "Skies We Owned",
      subtitle: "Kite Collection",
      sketch: "kolam",
      story: "The days when rooftops turned into battlefields of flying colors, " +
             "when every kite was stitched with pride, and every spool of manja " +
             "told a story. These little kites are reminders of the skies we once " +
             "owned and the joy of watching paper dance in the wind.",
      card: {
        src: "content/images/chapters/kites.jpg",
        alt: "An illustration of two kites climbing a pale watercolour sky, one trailing a tasselled tail"
      },
      notes: [
        { text: "We paint these with the window open, so a paintbrush kite and a real one are sometimes airborne at the same moment.", tone: "memory" },
        { text: "Manja is thread rolled in rice glue and crushed glass — yes, glass, yes, on purpose. Every spool this small survived being wound by someone very patient.", tone: "fact" }
      ],
      products: [
        {
          name: "Kite Keychain",
          description: "A dangling reminder of colors we once chased.",
          image: "content/images/kites/kite-keychain.jpg",
          alt: "A ceramic kite keychain in yellow, red, blue and green with a knotted thread tail, hanging from a door bolt",
          details: ["Hand-built ceramic, hand-painted"],
          tag: "trinket"
        },
        {
          name: "Kite Charm",
          description: "A slice of the sky that clips where you need it.",
          image: "content/images/kites/kite-charm.jpg",
          alt: "A small ceramic kite charm with a red and green tassel, resting on an Artham card",
          details: ["Hand-built ceramic, hand-painted"],
          tag: "trinket"
        }
      ]
    },

    {
      id: "paper-boats",
      title: "Boats That Never Sank",
      subtitle: "Paper Boat Collection",
      sketch: "lino",
      story: "The first drops of rain meant only one thing, tearing a sheet from " +
             "the back of our notebook, folding it quickly, and running out. " +
             "Streets turned into rivers, and we were sailors of paper dreams. " +
             "Our boats never sank in our eyes, they only sailed farther than we " +
             "could chase.",
      card: {
        src: "content/images/chapters/paper-boats.jpg",
        alt: "An illustration of four orange paper boats sailing across pencilled ripples"
      },
      notes: [
        { text: "We carve these with old film songs playing on loop. Cut one line wrong and the block starts over, so the songs get very familiar.", tone: "memory" },
        { text: "Those waves aren't printed — they're sewn, one bead at a time, over a hand-carved linocut. A linocut is carved backwards, so most of the hour goes into removing everything that isn't the picture.", tone: "fact" }
      ],
      products: [
        {
          name: "Paper Boat Pins & Magnets",
          description: "A tiny folded dream to carry with you — as a pin, or as a magnet.",
          image: "content/images/paper-boats/boat-pins.jpg",
          alt: "Two ceramic paper boats, one red and one yellow, on striped Artham cards",
          details: ["Hand-built ceramic, hand-painted", "Available as a pin or a magnet"],
          tag: "trinket"
        },
        {
          name: "Paper Boat Postcard",
          description: "A paper boat, and a little bit of us, from before…",
          image: "content/images/paper-boats/boat-postcard.jpg",
          alt: "An embroidered paper-boat postcard beside the gold carved lino block it was printed from, and an ink pad",
          madeWith: "And Alt Foundation",
          details: [
            "Hand-carved linocut on premium art paper",
            "Hand-embroidered details",
            "Sold as a set of 2 — choose any two designs, subject to availability",
            "Made to order · ships in 7–10 days"
          ]
        }
      ]
    },

    {
      id: "fish",
      title: "Ripples in Tanks",
      subtitle: "Fish Collection",
      sketch: "beads",
      story: "Orange flashes under green water. We sat on temple steps tossing " +
             "puffed rice, watching ripples spread. At home, guppies swam in glass " +
             "jars by the window, and at thresholds, kolams danced as fish.",
      card: {
        src: "content/images/chapters/fish.jpg",
        alt: "An illustration of three orange fish swimming through pencilled ripples in pale green water"
      },
      notes: [
        { text: "We still glaze these the way we used to feed puffed rice to the fish in temple tanks as kids — a little at a time, watching the ripples before doing the next bit.", tone: "memory" },
        { text: "Clay, thread and beads on one small fish — three materials that had never met before, now sharing a fridge. The bead holes get poked before firing, or you end up with a very pretty fish with no plans.", tone: "fact" }
      ],
      products: [
        {
          name: "Fish Magnets",
          description: "A temple tank ripple held still on your fridge.",
          image: "content/images/fish/fish-brooches.jpg",
          alt: "Three ceramic fish magnets in white with red and yellow painted patterns and coloured bead stitching",
          details: ["Hand-built ceramic, hand-painted, with bead-stitched detailing"],
          tag: "trinket"
        }
      ]
    },

    {
      id: "drishti",
      title: "Eyes That Watched Over Us",
      subtitle: "Drishti Collection",
      story: "Every doorway had one, a fierce black face staring back at the world. " +
             "Buses carried them boldly, grandmothers drew a dot on our cheeks. We " +
             "never knew if it worked, but the safety of that ritual never left us.",
      card: {
        src: "content/images/chapters/drishti.jpg",
        alt: "An illustration of a drishti face and a hanging chilli-and-lemon string against a pale sky"
      },
      notes: [
        { text: "The eyes go on last, always. Until then he's just a very committed lump of clay, watching nothing in particular — we like leaving him like that for a day before we finish him.", tone: "memory" },
        { text: "Chilli and lemon at the door: the original subscription service. Expires fortnightly, renews automatically.", tone: "fact" }
      ],
      products: [
        {
          name: "Mr. Drishti Brooch",
          description: "The guardian of the doorway, shrunk down to pin on a collar. Horns, moustache, tongue and all.",
          image: "content/images/drishti/drishti-brooch.jpg",
          alt: "A ceramic Mr. Drishti brooch with blue horns and a red tongue, on a card printed with a house door",
          details: ["Hand-built ceramic, hand-painted"],
          tag: "trinket"
        },
        {
          name: "Drishti Keychain",
          description: "The face, with a chilli and a lemon hanging below — the way they're strung at a doorway.",
          image: "content/images/drishti/drishti-keychain.jpg",
          alt: "A round ceramic drishti face keychain with a chilli and lemon charm, hanging from a brass door bolt",
          details: ["Hand-built ceramic, hand-painted"],
          tag: "trinket"
        },
        {
          name: "Drishti Charm",
          description: "The smallest of them, on a clasp, for a bag or a set of keys.",
          image: "content/images/drishti/drishti-charm.jpg",
          alt: "A small round ceramic drishti charm on a lobster clasp, resting on an Artham card",
          details: ["Hand-built ceramic, hand-painted"],
          tag: "trinket"
        },
        {
          name: "Mr. Drishti Embroidery Art Frame",
          description: "A playful interpretation of the iconic Drishti Bommai, reimagined through illustration, embroidery and beadwork. Where illustration, embroidery and tradition come together in a story you can hang on your wall.",
          size: "4 × 8 inches",
          image: "content/images/drishti/drishti-frame.jpg",
          alt: "The framed Mr. Drishti artwork, embroidered and beaded, standing beside a beaded basket",
          madeWith: "And Alt Foundation",
          details: [
            "Digital illustration printed on premium art paper",
            "Hand-embroidered with bead embellishments",
            "Framed with wall-mounting hook",
            "Size: 4 × 8 inches",
            "Made to order · ships in 7–10 days"
          ]
        }
      ]
    },

    {
      id: "athangudi",
      title: "Floors That Spoke",
      subtitle: "Athangudi Collection",
      sketch: "thumbprint",
      story: "Walking barefoot on cool tile floors, tracing flowers and stars with " +
             "our toes. Sunlight filtered through jaali windows, making the patterns " +
             "dance. Athangudi tiles were more than design, they were rhythm under " +
             "every step.",
      card: {
        src: "content/images/chapters/athangudi.jpg",
        alt: "An illustration of two Athangudi tiles, one red and yellow, one yellow with a green flower"
      },
      notes: [
        { text: "We trace the patterns the way we used to trace real Athangudi tiles with our toes, barefoot, half-listening to whatever was playing in the next room.", tone: "memory" },
        { text: "Real Athangudi tiles are poured by hand, one at a time. Ours are ceramic, hand-painted, and finished with a little bead stitching of their own.", tone: "fact" }
      ],
      products: [
        {
          name: "Athangudi Tile Magnets",
          description: "A tiny piece of Chettinad heritage to carry.",
          image: "content/images/athangudi/athangudi-pins.jpg",
          alt: "Three square ceramic magnets painted with Athangudi tile patterns in yellow, green and red, stitched with beads",
          details: ["Hand-built ceramic, hand-painted, with bead-stitched detailing"],
          tag: "trinket"
        }
      ]
    },

    {
      id: "food",
      title: "Feasts & Fights",
      subtitle: "Food Collection",
      sketch: "weave",
      story: "Banana leaves spread on the floor, cousins counting vadais, someone " +
             "sneaking a sweet before it was served. Corner shops with mittai jars, " +
             "sticky orange tongues after fights of \"mine vs yours.\" Food was never " +
             "just food, it was family theatre.",
      card: {
        src: "content/images/chapters/food.jpg",
        alt: "An illustration of a banana leaf laid out with a full meal, small dishes drawn around it"
      },
      notes: [
        { text: "We still argue about whose favourite dish gets pride of place in the middle of the leaf.", tone: "memory" },
        { text: "Every dosa and idli is sculpted one at a time by hand, which is also why the idlis always look a little smug about it.", tone: "fact" },
        { text: "We dye the tic-tac-toe boards and pouches ourselves, with whatever's on hand that week — turmeric, onion skins, tea. No two ever come out quite the same, and we like it that way.", tone: "memory" },
        { text: "The leaf tip goes to your left, always. We still hear a grandmother's voice if we lay one down the wrong way.", tone: "memory" }
      ],
      products: [
        {
          name: "Ela Saapadu Postcard",
          description: "A leaf filled to the edges, and a kind of happiness that stayed.",
          image: "content/images/the-meal/ela-saapadu-postcard.jpg",
          alt: "An embroidered postcard of a traditional banana-leaf meal, each dish stitched by hand in thread and beads",
          madeWith: "And Alt Foundation",
          details: [
            "Digital illustration printed on premium art paper",
            "Hand-embroidered details",
            "Sold as a set of 2 — choose any two designs, subject to availability",
            "Made to order · ships in 7–10 days"
          ]
        },
        {
          name: "Dosa–Idli Tic-Tac-Toe",
          description: "A playful twist on a classic game, where dosas and idlis become your game pieces. Because the best games are the ones that bring people together — especially over dosa and idli.",
          image: "content/images/the-meal/tic-tac-toe.jpg",
          alt: "A naturally dyed and embroidered tic-tac-toe board with ceramic dosa and idli playing pieces",
          madeWith: "And Alt Foundation",
          details: [
            "Ceramic dosa and idli playing pieces",
            "Naturally dyed fabric game board and drawstring pouch",
            "Hand-embroidered details",
            "Fabric colour and shade may vary, subject to availability",
            "Made to order · ships in 7–10 days"
          ]
        },
        {
          name: "Jalebi–Kaju Katli Tic-Tac-Toe",
          description: "A sweet spin on a timeless game, where crispy jalebis take on rich kaju katlis in a playful battle of noughts and crosses. Designed to spark conversations, laughter, and a little friendly rivalry.",
          image: "content/images/the-meal/tic-tac-toe-pouch.jpg",
          alt: "A pink naturally dyed tic-tac-toe board and drawstring pouch with ceramic jalebi and kaju katli pieces",
          madeWith: "And Alt Foundation",
          details: [
            "Ceramic jalebi and kaju katli playing pieces",
            "Naturally dyed fabric game board and drawstring pouch",
            "Hand-embroidered details",
            "Fabric colour and shade may vary, subject to availability",
            "Made to order · ships in 7–10 days"
          ]
        },
        {
          name: "Ela Saapadu Keychain",
          description: "A whole banana-leaf meal, small enough to hang off your keys.",
          image: "content/images/pookadai/pookadai-keychain.jpg",
          alt: "A banana-leaf keychain painted with a full ela saapadu spread, hanging from a brass door bolt",
          details: ["Handmade with polymer clay, hand-painted"]
        },
        {
          name: "Mood Chai Pins",
          description: "Positivi-TEA, Anxie-TEA, Curiosi-TEA. What's your mood today?",
          image: "content/images/chai/chai-pins.jpg",
          alt: "A card of four ceramic chai-glass pins with hand-drawn faces, captioned what's your mood today",
          details: ["Hand-built ceramic, hand-painted"],
          tag: "trinket"
        }
      ]
    },

    {
      id: "stationery",
      title: "Pages That Smelled of Ink",
      subtitle: "Stationery Collection",
      sketch: "lino",
      story: "The joy of brown-paper covers, the thrill of scribbling our names on " +
             "the first page. Doodles in margins, love notes folded into triangles. " +
             "Paper carried our mischief, our dreams, our apologies.",
      card: {
        src: "content/images/chapters/stationery.jpg",
        alt: "An illustration of notebooks stacked with a pencil, one wrapped in brown paper"
      },
      notes: [
        { text: "The telephone's cord is the only part not printed — it's looped in thread, one coil at a time, still a little tangled. Historically accurate, and also just easier that way.", tone: "fact" },
        { text: "We stitch the jamakkalam stripes with actual jamakkalam memories running through our heads — who sat where, whose turn it was to fight over the corner spot.", tone: "memory" }
      ],
      products: [
        {
          name: "Telephone Postcard",
          description: "Once upon a time, fingers coiling the cord, lost in conversation.",
          image: "content/images/telephone/telephone-postcard.jpg",
          alt: "A red linocut rotary telephone postcard with a hand-stitched coiled cord, beside its carved block and ink pad",
          madeWith: "And Alt Foundation",
          details: [
            "Hand-carved linocut on premium art paper",
            "Hand-embroidered details",
            "Sold as a set of 2 — choose any two designs, subject to availability",
            "Made to order · ships in 7–10 days"
          ]
        },
        {
          name: "Jamakkalam Postcard",
          description: "A jamakkalam, where stories, food, and all of us came together.",
          image: "content/images/the-meal/jamakkalam-postcard.jpg",
          alt: "An embroidered postcard of a striped jamakkalam mat in red, green and yellow, the stripes stitched in thread",
          madeWith: "And Alt Foundation",
          details: [
            "Digital illustration printed on premium art paper",
            "Hand-embroidered details",
            "Sold as a set of 2 — choose any two designs, subject to availability",
            "Made to order · ships in 7–10 days"
          ]
        }
      ]
    },

    {
      id: "desk-whispers",
      title: "Desk Whispers",
      subtitle: "The Friendly Collection",
      story: "Clay pandas and ducks sat quietly on desks, carrying scribbled notes " +
             "like school friends slipping paper under the bench. Some friends were " +
             "made of clay, but they kept us company anyway.",
      card: {
        src: "content/images/chapters/desk-whispers.jpg",
        alt: "An illustration of a wooden showcase cabinet filled with framed photographs, figurines and little treasures"
      },
      notes: [
        { text: "We keep music on low while painting these collars — they always seem to come out a little more cheerful on days with a good song stuck in our heads.", tone: "memory" },
        { text: "Emotional support, in figurine form. Doesn't talk back. Does keep score.", tone: "fact" }
      ],
      products: [
        {
          name: "Desk Buddy",
          description: "The loyal little figurines we grew up seeing in home showcases — always present, always quietly keeping company. This one takes its job seriously! With an Athangudi-inspired collar, it has three daily reminders: You are loved. Go workout. Drink your water.",
          image: "content/images/showcase/desk-buddies.jpg",
          alt: "Three ceramic figures on a windowsill — a panda holding drink your water, a duck holding go workout, a dog holding you are loved",
          details: [
            "Handmade collectible inspired by nostalgic showcase dolls, South Indian patterns, and the enduring joy of handmaking",
            "Finished with an Athangudi-inspired collar",
            "Each piece carries its own tiny quirks and imperfections",
            "Perches on a desk, bedside or bookshelf",
            "Made to order · ships in 7–10 days"
          ],
          tag: "trinket"
        }
      ]
    },

    {
      id: "stitched",
      title: "Buzzing Photograph",
      subtitle: "Stitched Illustrations",
      story: "A drawing on paper, stitched back to life. Pencil lines meet needlework, " +
             "where every thread lingers a little longer on the details the heart " +
             "remembers. Half illustrated, half embroidered, these sheets remind us " +
             "that art is not just seen, it is felt.",
      card: {
        src: "content/images/chapters/stitched.jpg",
        alt: "An illustration of an open album of photographs, drawn in warm pencil and wash"
      },
      notes: [
        { text: "The needle goes through the print itself, so one wrong hole means the whole sheet starts its life over — we've learned to hold our breath through the last few stitches.", tone: "fact" },
        { text: "We've walked to a pookadai at 6am and still missed the good flowers. The best ones are gone before most of us are even awake — we stitch these a little slower, so at least this version stays.", tone: "memory" }
      ],
      products: [
        {
          name: "Pookadai Embroidery Art Frame",
          description: "Inspired by the vibrant flower markets that fill our streets with colour, fragrance, and everyday conversations. Inspired by everyday blooms, stitched with care.",
          size: "8 × 8 inches",
          image: "content/images/pookadai/pookadai-frame.jpg",
          alt: "The framed Pookadai artwork — a flower seller stringing garlands, surrounded by heaped blooms, embroidered over the print — standing beside a beaded koodai",
          madeWith: "And Alt Foundation",
          details: [
            "Digital illustration printed on premium art paper",
            "Hand-embroidered details",
            "Framed with wall-mounting hook",
            "Size: 8 × 8 inches",
            "Made to order · ships in 7–10 days"
          ]
        },
        {
          name: "Raatnam Embroidery Art Frame",
          description: "Inspired by the colourful Raatnam — the four-seater giant wheel found at beaches, temple festivals and local exhibitions. An ode to colourful rides, joyful memories, and the magic of handmade.",
          size: "4 × 8 inches",
          image: "content/images/raatnam/raatnam-frame.jpg",
          alt: "A framed embroidered artwork of a Raatnam giant wheel, stitched in red, blue and yellow thread",
          madeWith: "And Alt Foundation",
          details: [
            "Digital illustration printed on premium art paper",
            "Hand-embroidered details",
            "Framed with wall-mounting hook",
            "Size: 4 × 8 inches",
            "Made to order · ships in 7–10 days"
          ]
        }
      ]
    },

    {
      id: "terracotta",
      title: "Terracotta, Reimagined",
      subtitle: "For the Home",
      sketch: "coil",
      story: "Created through Artham's material explorations, this piece brings " +
             "together clay, thread, beads, and hand-building techniques to reimagine " +
             "terracotta in unexpected ways. Every piece is an invitation to look " +
             "closer, find meaning in the details, and rediscover the joy of handmade " +
             "objects.",
      card: {
        src: "content/images/terracotta/lamp-lit.jpg",
        alt: "A hand-built terracotta vessel lit from within as a lamp, held up against green leaves"
      },
      notes: [
        { text: "Hand-built, not thrown on a wheel — the walls are uneven because hands are, and we've decided that's exactly the point.", tone: "fact" },
        { text: "The charms go on last, so they sway when you walk past. We still turn around sometimes when we hear one catch a breeze.", tone: "memory" }
      ],
      products: [
        {
          name: "Terracotta Charm Vase",
          description: "Hand-built in terracotta and adorned with an assortment of miniature ceramic charms that gently sway with every movement. An everyday vessel filled with little stories.",
          image: "content/images/terracotta/vase-charms.jpg",
          alt: "A hand-built terracotta vase hung with tiny ceramic charms, held in a hand against greenery",
          details: [
            "Hand-built terracotta, kiln-fired for durability",
            "Adorned with handcrafted miniature ceramic charms",
            "Charm designs and arrangement vary — every vase is one of a kind",
            "Suitable for dried flowers and decorative display",
            "Made to order · ships in 7–10 days"
          ],
          tag: "terracotta"
        },
        {
          name: "Terracotta Table Lamp",
          description: "The same vessel, lit from the inside, so the charms throw their shadows on the wall.",
          image: "content/images/terracotta/lamp-lit.jpg",
          alt: "The terracotta vessel glowing as a table lamp, held up against leaves",
          details: [
            "Hand-built terracotta, kiln-fired",
            "Every piece carries the natural textures of the making process",
            "Made to order · ships in 7–10 days"
          ],
          tag: "terracotta"
        },
        {
          name: "Terracotta Lattice Vase",
          description: "A net of beaded thread laid over the clay like a second skin, knotted off in a small tassel at the base.",
          image: "content/images/terracotta/vase-lattice.jpg",
          alt: "A hand-built terracotta vessel wrapped in a diamond lattice of green beaded thread, held in a hand against greenery",
          details: [
            "Hand-built terracotta, kiln-fired",
            "Wrapped in a hand-knotted bead lattice",
            "Made to order · ships in 7–10 days"
          ],
          tag: "terracotta"
        },
        {
          name: "Terracotta Ridged Vase",
          description: "Carved in a run of wave-like ridges, with a scatter of beads set right into the grooves.",
          image: "content/images/terracotta/vase-ridged.jpg",
          alt: "A hand-built terracotta vessel carved with parallel ridges and small clusters of coloured beads, held in a hand against greenery",
          details: [
            "Hand-built terracotta, kiln-fired",
            "Bead clusters set into the carved surface",
            "Made to order · ships in 7–10 days"
          ],
          tag: "terracotta"
        },
        {
          name: "Terracotta Palm Lamp",
          description: "Palm fronds carved into the clay, banded in jute, lit from the inside so the carving throws its own shadow.",
          image: "content/images/terracotta/lamp-palm.jpg",
          alt: "A hand-built terracotta lamp carved with palm fronds and wound with a jute band, glowing from a bulb inside",
          details: [
            "Hand-built terracotta, kiln-fired",
            "Wound with a jute band and bead detailing",
            "Made to order · ships in 7–10 days"
          ],
          tag: "terracotta"
        }
      ]
    }

  ],

  /* ── Care ──────────────────────────────────────────────────────────────── */
  care: {
    heading: "A little care goes a long way",
    intro: "Every piece is handmade — hand-rolled, hand-stitched, hand-painted — " +
           "shaped slowly at a table that's always a little messy with clay, beads " +
           "and threads. No two are identical, because memories aren't identical either.",
    points: [
      "Keep your pieces away from water and perfumes.",
      "Store them in a cool, dry spot, tucked safely like treasures.",
      "Handle gently — they're sturdy enough for everyday love, but fragile in spirit.",
      "If it's fabric or weave, a soft wipe keeps it fresh.",
      "Naturally dyed fabric softens in colour over time. That's the dye being honest."
    ],
    closing: "Because these aren't just things you own — they're little fragments of story you carry."
  },

  /* ── Contact ───────────────────────────────────────────────────────────── */
  contact: {
    heading: "To know more, or just to say hi",
    closing: "Thank you for walking down this lane with me. May you always find a memory to hold on to."
  }

};
