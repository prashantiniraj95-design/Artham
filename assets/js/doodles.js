/* ============================================================================
   Artham — the doodles
   One small drawing per chapter, for the four chapters it makes sense for: a
   paper boat, a kite, a fish, a terracotta pot. Drawn as inline SVG, in the
   same pen-and-wash language as the chapter-break sketches in sketches.js
   (sk-ink, sk-warm, sk-leaf, sk-tint…), so they read as one hand with the
   rest of the page's linework.

   An earlier version of this scattered a much larger set — raster cut-outs
   from Prashantini's own sheet, mixed with painted crops lifted from the
   catalogue plates — at random across every chapter. Both didn't work: the
   painted crops read as a different illustrator entirely, and scattering
   them everywhere meant a fish could turn up beside a stationery chapter it
   had nothing to do with. This version keeps only what she asked for, and
   only where it belongs.

   They're decoration. They sit behind the writing, take no clicks, and carry
   no alt text, so a screen reader walks straight past them.

   To add one: draw it in SVG_MOTIFS below, and give its chapter id an entry
   in CHAPTER_MOTIFS.
   ========================================================================== */

window.ArthamDoodles = (function () {
  "use strict";

  var SVG_MOTIFS = {
    "paper-boat-sketch":
      '<svg viewBox="0 0 160 110" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">' +
        '<path class="sk-tint" d="M18 64 C40 76 120 76 142 64 L118 40 L42 40 Z"/>' +
        '<path class="sk-ink" d="M18 64 C40 76 120 76 142 64 L118 40 L42 40 Z"/>' +
        '<path class="sk-ink" d="M42 40 L80 10 L118 40"/>' +
        '<path class="sk-thin sk-ink" d="M80 10 L80 40"/>' +
        '<path class="sk-warm sk-thin" d="M8 92 Q28 84 48 92 T88 92 T128 92 T152 92"/>' +
      '</svg>',

    "kite-sketch":
      '<svg viewBox="0 0 120 150" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">' +
        '<path class="sk-tint" d="M60 8 Q100 30 104 58 Q100 86 60 108 Q20 86 16 58 Q20 30 60 8 Z"/>' +
        '<path class="sk-ink" d="M60 8 Q100 30 104 58 Q100 86 60 108 Q20 86 16 58 Q20 30 60 8 Z"/>' +
        '<path class="sk-thin sk-ink" d="M60 8 Q58 58 60 108"/>' +
        '<path class="sk-thin sk-ink" d="M16 58 Q60 54 104 58"/>' +
        '<path class="sk-warm sk-thin" d="M60 108 C56 116 64 120 60 128 C56 136 64 140 60 148"/>' +
        '<path class="sk-warm" d="M56 118 L64 118 L60 126 Z"/>' +
        '<path class="sk-ink" d="M56 134 L64 134 L60 142 Z"/>' +
      '</svg>',

    "fish-sketch":
      '<svg viewBox="0 0 130 70" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">' +
        '<path class="sk-tint" d="M14 35 C14 20 40 12 62 16 C80 19 92 27 100 35 C92 43 80 51 62 54 C40 58 14 50 14 35 Z"/>' +
        '<path class="sk-warm" d="M14 35 C14 20 40 12 62 16 C80 19 92 27 100 35 C92 43 80 51 62 54 C40 58 14 50 14 35 Z"/>' +
        '<path class="sk-warm" d="M100 35 L120 20 L112 35 L120 50 Z"/>' +
        '<circle class="sk-dot" cx="34" cy="30" r="2.6"/>' +
      '</svg>',

    "pot-sketch":
      '<svg viewBox="0 0 110 140" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">' +
        '<path class="sk-tint" d="M40 10 H70 L74 26 C96 34 100 64 92 90 C86 112 70 128 55 128 C40 128 24 112 18 90 C10 64 14 34 36 26 Z"/>' +
        '<path class="sk-warm" d="M40 10 H70 L74 26 C96 34 100 64 92 90 C86 112 70 128 55 128 C40 128 24 112 18 90 C10 64 14 34 36 26 Z"/>' +
        '<path class="sk-thin sk-warm" d="M36 26 C50 30 60 30 74 26"/>' +
        '<path class="sk-ink sk-hair" d="M28 96 L20 108"/>' +
        '<circle class="sk-dot" cx="19" cy="112" r="3"/>' +
        '<path class="sk-ink sk-hair" d="M84 90 L93 100"/>' +
        '<circle class="sk-dot" cx="95" cy="104" r="3"/>' +
      '</svg>'
  };

  /* chapter id → [motif name, width in px] */
  var CHAPTER_MOTIFS = {
    "kites":        ["kite-sketch",       100],
    "paper-boats":  ["paper-boat-sketch", 130],
    "fish":         ["fish-sketch",       100],
    "terracotta":   ["pot-sketch",         90]
  };

  function make(name, width, rot) {
    var holder = document.createElement("div");
    holder.innerHTML = SVG_MOTIFS[name];
    var el = holder.firstElementChild;

    /* setAttribute rather than el.className — className on a native <svg>
       element is a legacy SVGAnimatedString in some engines, not a plain
       string, so a straight assignment can silently fail to set it */
    el.setAttribute("class", "doodle doodle--gap reveal-doodle");
    el.setAttribute("aria-hidden", "true");
    el.style.setProperty("--dw", width + "px");
    el.style.setProperty("--dr", rot + "deg");
    return el;
  }

  function watch(nodes) {
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (n) { n.classList.add("is-in"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -5% 0px", threshold: 0.05 });
    nodes.forEach(function (n) { observer.observe(n); });
  }

  /* `sections` are every chapter, plus the maker and care panels — only the
     four chapters named in CHAPTER_MOTIFS get a drawing; everything else is
     left alone rather than filled with something unrelated. Placed low in
     the story block (the --dopacity/--dx/--dy for .doodle--gap in artham.css
     already handle sitting under the writing and flipping side with the
     chapter's own illustration), so it shows at every width, not just wide
     ones. */
  function init(sections) {
    var placed = [];

    sections.forEach(function (section, i) {
      var motif = CHAPTER_MOTIFS[section.id];
      if (!motif) return;

      var doodle = make(motif[0], motif[1], i % 2 ? 6 : -5);
      (section.querySelector(".chapter__story") || section).appendChild(doodle);
      placed.push(doodle);
    });

    watch(placed);
  }

  return { init: init, count: Object.keys(CHAPTER_MOTIFS).length };
})();
