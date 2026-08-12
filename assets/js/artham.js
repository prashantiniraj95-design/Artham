/* ============================================================================
   Artham — the storyboard
   Reads content/content.js and lays the book out: cover, the maker's note,
   one chapter after another, care, contact. Nothing in here needs editing to
   add a chapter or a product — that all lives in content/content.js.
   ========================================================================== */

(function () {
  "use strict";

  var data = window.ARTHAM;
  if (!data) {
    console.error("Artham: content/content.js did not load, or has a syntax error in it.");
    return;
  }

  var NUMBER_WORDS = ["one", "two", "three", "four", "five", "six", "seven", "eight",
                      "nine", "ten", "eleven", "twelve", "thirteen", "fourteen",
                      "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];

  /* ── small helpers ────────────────────────────────────────────────────── */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function slug(value, fallback) {
    var s = String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return s || fallback;
  }

  /* ── sketches ─────────────────────────────────────────────────────────
     Line drawings of the making itself, dropped between the chapters and
     into the quieter corners of the page. Decorative, so they carry their
     own label and are skipped by screen readers.                         */

  function sketch(nameOrIndex, modifier) {
    if (!window.ArthamSketches) return null;
    var markup = typeof nameOrIndex === "number"
      ? window.ArthamSketches.nth(nameOrIndex)
      : window.ArthamSketches.get(nameOrIndex);
    if (!markup) return null;

    var holder = el("span", "sketch" + (modifier ? " sketch--" + modifier : ""));
    holder.setAttribute("aria-hidden", "true");
    holder.innerHTML = markup;
    return holder;
  }

  /* a run of stitching across the page with a drawing resting in the middle */
  function sketchBreak(chapter, index) {
    var art = sketch(chapter && chapter.sketch ? chapter.sketch : index, "break");
    if (!art) return null;

    var breakEl = el("div", "sketch-break reveal");
    breakEl.setAttribute("aria-hidden", "true");
    breakEl.appendChild(el("span", "sketch-break__stitch"));
    breakEl.appendChild(art);
    breakEl.appendChild(el("span", "sketch-break__stitch"));
    return breakEl;
  }

  function squiggle() {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "chapter__rule");
    svg.setAttribute("viewBox", "0 0 92 8");
    svg.setAttribute("aria-hidden", "true");
    var path = document.createElementNS(ns, "path");
    path.setAttribute("d", "M1 5 q11 -5 22 0 t22 0 t22 0 t22 0");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "1.7");
    path.setAttribute("stroke-linecap", "round");
    svg.appendChild(path);
    return svg;
  }

  function pictureFrame(image, alt, eager) {
    var frame = el("div", "object__frame");
    ["tl", "tr", "bl", "br"].forEach(function (corner) {
      var mount = el("i", "mount mount--" + corner);
      mount.setAttribute("aria-hidden", "true");
      frame.appendChild(mount);
    });

    if (image) {
      var img = el("img");
      img.src = image;
      img.alt = alt || "";
      /* A frame with no photograph in it yet is only a few pixels tall, and the
         sticky note beside it is placed against that row — so the note settles
         a second time when the picture lands. Everything below the fold has
         long since loaded by the time it's scrolled to, but the first chapter
         is close enough to watch, so its photographs are fetched up front. */
      img.loading = eager ? "eager" : "lazy";
      img.decoding = "async";
      frame.appendChild(img);
    } else {
      frame.appendChild(el("div", "object__pending", "photo coming soon"));
    }
    return frame;
  }

  /* ── enquiry links ────────────────────────────────────────────────────── */

  function whatsappHref(productName, chapterTitle) {
    var brand = data.brand || {};
    if (!brand.whatsapp) return null;
    var message = "Hi Artham! I'd love to know more about the " + productName +
                  (chapterTitle ? " from " + chapterTitle : "") + ".";
    return "https://wa.me/" + brand.whatsapp + "?text=" + encodeURIComponent(message);
  }

  function instagramHref() {
    var brand = data.brand || {};
    return brand.instagram ? "https://instagram.com/" + brand.instagram : null;
  }

  function askRow(productName, chapterTitle) {
    var row = el("div", "object__actions");

    var wa = whatsappHref(productName, chapterTitle);
    if (wa) {
      var ask = el("a", "object__ask", "Ask about this");
      ask.href = wa;
      ask.target = "_blank";
      ask.rel = "noopener";
      ask.setAttribute("aria-label", "Ask about " + productName + " on WhatsApp");
      ask.appendChild(el("span", null, "→"));
      row.appendChild(ask);
    }

    var ig = instagramHref();
    if (ig) {
      var alt = el("a", "object__ask-alt", "or DM on Instagram");
      alt.href = ig;
      alt.target = "_blank";
      alt.rel = "noopener";
      alt.setAttribute("aria-label", "Message Artham on Instagram about " + productName);
      row.appendChild(alt);
    }

    return row.childNodes.length ? row : null;
  }

  /* ── the practical facts, folded away ─────────────────────────────────────
     Sizes, "made to order", "ships in 7–10 days". A real <details> element, so
     it opens with a tap, opens with the keyboard, is announced properly, and
     still prints and searches open — none of which is true of a div and a
     click handler.                                                          */

  function detailsBlock(product) {
    var list = product.details || [];
    if (!list.length) return null;

    var box = el("details", "object__details");
    var summary = el("summary", "object__details-summary", "the details");
    box.appendChild(summary);

    var ul = el("ul", "object__details-list");
    list.forEach(function (line) { ul.appendChild(el("li", null, line)); });
    box.appendChild(ul);
    return box;
  }

  /* The collaboration credit is not fine print, so it stays out of the fold. */
  function madeWith(product) {
    if (!product.madeWith) return null;
    return el("p", "object__made-with", "with " + product.madeWith);
  }

  /* ── the cover ────────────────────────────────────────────────────────── */

  function renderCover() {
    var brand = data.brand || {};
    var name = document.querySelector("[data-brand-name]");
    var tagline = document.querySelector("[data-brand-tagline]");
    var blurb = document.querySelector("[data-brand-blurb]");
    if (name && brand.name) name.textContent = brand.name;
    if (tagline) tagline.textContent = brand.tagline || "";
    if (blurb) blurb.textContent = brand.blurb || "";
    if (brand.name) document.title = brand.name + " — " + (brand.tagline || "handmade memories");
  }

  /* ── the maker's note ─────────────────────────────────────────────────── */

  function renderMaker() {
    var maker = data.maker;
    var section = document.getElementById("maker");
    if (!section || !maker) return;

    var inner = el("div", "maker__inner reveal");
    if (maker.portrait) inner.classList.add("maker__inner--with-portrait");

    if (maker.portrait) {
      var figure = el("figure", "maker__portrait");
      var img = el("img");
      img.src = maker.portrait;
      img.alt = maker.portraitAlt || "";
      img.loading = "lazy";
      figure.appendChild(img);
      inner.appendChild(figure);
    }

    var body = el("div", "maker__body");
    var heading = el("h2", "maker__heading", maker.heading || "");
    heading.id = "makerHeading";
    body.appendChild(heading);
    if (maker.subheading) body.appendChild(el("p", "maker__sub", maker.subheading));
    (maker.paragraphs || []).forEach(function (text) {
      body.appendChild(el("p", null, text));
    });

    var table = sketch("table", "aside");
    if (table) body.appendChild(table);

    inner.appendChild(body);
    section.appendChild(inner);
  }

  /* ── one chapter ──────────────────────────────────────────────────────── */

  function renderChapter(chapter, index) {
    var section = el("section", "chapter");
    section.id = chapter.id || slug(chapter.title, "chapter-" + (index + 1));
    section.setAttribute("aria-labelledby", section.id + "-title");

    /* the story */
    var story = el("div", "chapter__story reveal");

    if (chapter.card && chapter.card.src) {
      var art = el("figure", "chapter__art");
      var img = el("img");
      img.src = chapter.card.src;
      img.alt = (chapter.card && chapter.card.alt) || "";
      img.loading = index < 1 ? "eager" : "lazy";
      img.decoding = "async";
      art.appendChild(img);
      story.appendChild(art);
    }

    var text = el("div", "chapter__text");
    var word = NUMBER_WORDS[index] || String(index + 1);
    text.appendChild(el("p", "chapter__eyebrow", "Chapter " + word));

    var title = el("h2", "chapter__title", chapter.title || "");
    title.id = section.id + "-title";
    if (chapter.subtitle) title.appendChild(el("em", null, chapter.subtitle));
    text.appendChild(title);

    var underline = el("span", "pen-underline");
    underline.setAttribute("aria-hidden", "true");
    text.appendChild(underline);
    text.appendChild(squiggle());
    if (chapter.story) text.appendChild(el("p", "chapter__story-text", chapter.story));

    /* said once, at the first chapter, and then never again */
    if (index === 0) {
      text.appendChild(el("p", "chapter__hint", "the sticky notes can be moved around ↓"));
    }

    story.appendChild(text);
    section.appendChild(story);

    /* the objects */
    var products = chapter.products || [];
    if (products.length) {
      var list = el("div", "objects");
      products.forEach(function (product) {
        var object = el("article", "object reveal");
        object.appendChild(pictureFrame(product.image, product.alt, index === 0));

        var body = el("div", "object__body");
        body.appendChild(el("h3", "object__name", product.name || ""));
        if (product.description) body.appendChild(el("p", "object__desc", product.description));
        if (product.size) body.appendChild(el("p", "object__size", product.size));

        var credit = madeWith(product);
        if (credit) body.appendChild(credit);

        var row = askRow(product.name || "this piece", chapter.title);
        if (row) body.appendChild(row);

        var folded = detailsBlock(product);
        if (folded) body.appendChild(folded);

        object.appendChild(body);
        list.appendChild(object);
      });
      section.appendChild(list);
    }

    return section;
  }

  function renderChapters() {
    var mount = document.getElementById("chapters");
    if (!mount) return [];

    var chapters = data.chapters || [];

    if (!chapters.length) {
      var empty = el("div", "awaiting");
      empty.appendChild(el("h2", null, "The chapters are still being written"));
      var p = el("p", null, "Add your first story to ");
      p.appendChild(el("code", null, "content/content.js"));
      p.appendChild(document.createTextNode(" and it will appear right here."));
      empty.appendChild(p);
      mount.appendChild(empty);
      return [];
    }

    var groups = [];
    chapters.forEach(function (chapter, index) {
      /* a sketch sits in the seam between one chapter and the next */
      if (index > 0) {
        var seam = sketchBreak(chapters[index - 1], index - 1);
        if (seam) mount.appendChild(seam);
      }

      var section = renderChapter(chapter, index);
      mount.appendChild(section);
      groups.push({
        id: section.id,
        anchor: section,
        /* notes are positioned against the story block, and scattered on the
           illustration side — which alternates with the chapter, matching the
           :nth-of-type(even) rule in the stylesheet */
        ref: section.querySelector(".chapter__story"),
        side: index % 2 === 1 ? "right" : "left",
        notes: chapter.notes || []
      });
    });
    return groups;
  }

  /* ── care ─────────────────────────────────────────────────────────────── */

  function renderCare() {
    var care = data.care;
    var section = document.getElementById("care");
    if (!section || !care) return;

    var inner = el("div", "care__inner reveal");

    /* three goes at the same pot, none of them alike — the care note is
       exactly where that belongs */
    var three = sketch("three", "centred");
    if (three) inner.appendChild(three);

    var heading = el("h2", "care__heading", care.heading || "");
    heading.id = "careHeading";
    inner.appendChild(heading);

    if (care.intro) inner.appendChild(el("p", "care__intro", care.intro));

    if ((care.points || []).length) {
      var list = el("ul", "care__list");
      care.points.forEach(function (point) { list.appendChild(el("li", null, point)); });
      inner.appendChild(list);
    }

    if (care.closing) inner.appendChild(el("p", "care__closing", care.closing));
    section.appendChild(inner);
  }

  /* ── contact ──────────────────────────────────────────────────────────── */

  function renderContact() {
    var brand = data.brand || {};
    var contact = data.contact || {};
    var footer = document.getElementById("contact");
    if (!footer) return;

    var bloom = sketch("bloom", "centred");
    if (bloom) footer.appendChild(bloom);

    var heading = el("h2", "contact__heading", contact.heading || "Say hello");
    heading.id = "contactHeading";
    footer.appendChild(heading);

    var list = el("ul", "contact__links");

    function link(label, href) {
      var li = el("li");
      var a = el("a", null, label);
      a.href = href;
      if (href.indexOf("http") === 0) { a.target = "_blank"; a.rel = "noopener"; }
      li.appendChild(a);
      list.appendChild(li);
    }

    if (brand.whatsapp) {
      link("WhatsApp", "https://wa.me/" + brand.whatsapp);
    }
    if (brand.instagram) {
      link("@" + brand.instagram, "https://instagram.com/" + brand.instagram);
    }
    if (brand.email) {
      link(brand.email, "mailto:" + brand.email);
    }
    footer.appendChild(list);

    if (contact.closing) footer.appendChild(el("p", "contact__closing", contact.closing));

    var mark = el("img", "contact__mark");
    var markFile = "assets/img/mark.png";
    mark.src = (window.ARTHAM_INLINE && window.ARTHAM_INLINE[markFile]) || markFile;
    mark.alt = "";
    mark.loading = "lazy";
    footer.appendChild(mark);
  }

  /* ── the contents bookmark ────────────────────────────────────────────── */

  function renderContents() {
    var tab = document.getElementById("contentsTab");
    var panel = document.getElementById("contentsPanel");
    var list = document.getElementById("contentsList");
    var chapters = data.chapters || [];

    if (!tab || !panel || !list) return;

    if (!chapters.length) {
      tab.parentNode.hidden = true;
      return;
    }

    chapters.forEach(function (chapter, index) {
      var li = el("li");
      var a = el("a", null, chapter.title || "Chapter " + (index + 1));
      a.href = "#" + (chapter.id || slug(chapter.title, "chapter-" + (index + 1)));
      if (chapter.subtitle) a.appendChild(el("small", null, chapter.subtitle));
      li.appendChild(a);
      list.appendChild(li);
    });

    function close() {
      panel.hidden = true;
      tab.setAttribute("aria-expanded", "false");
    }

    tab.addEventListener("click", function () {
      var open = tab.getAttribute("aria-expanded") === "true";
      panel.hidden = open;
      tab.setAttribute("aria-expanded", String(!open));
    });

    list.addEventListener("click", function (event) {
      if (event.target.closest("a")) close();
    });

    document.addEventListener("click", function (event) {
      if (!panel.hidden && !event.target.closest(".contents")) close();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !panel.hidden) { close(); tab.focus(); }
    });
  }

  /* ── reveal on scroll ─────────────────────────────────────────────────── */

  function watchReveals() {
    var targets = document.querySelectorAll(".reveal:not(.note)");

    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(targets, function (t) { t.classList.add("is-in"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });

    Array.prototype.forEach.call(targets, function (t) { observer.observe(t); });
  }

  /* ── the writing sits on the ruling ───────────────────────────────────────
     The paper is ruled every --rule-gap pixels and the running text is set to
     exactly that line-height, so once a block's FIRST line lands on a rule,
     every line below it lands on one too. All that's left is to find that
     first baseline and nudge the block by at most half a rule.

     The nudge is `top:` on a relatively-positioned block, not padding, and
     that is the whole trick. These blocks sit in vertically-centred grid rows
     — pad one and the row grows, the centring lifts it by half of what you
     just added, and you chase the error forever. A relative offset moves the
     writing and nothing else on the page.                                   */

  var SNAP = ".chapter__story-text, .chapter__hint, " +
             ".maker__body p, .care__intro, .care__closing, .care__list, " +
             ".object__desc, .object__details-list, .contact__closing";

  /* Where the block's first baseline falls, in page coordinates.

     Two things get in the way of a straight measurement. Transforms move a
     rect without moving the layout — the reveal slides each block in, and two
     of the panels are deliberately tilted — so they're lifted for the length
     of the measurement and put straight back. Nothing repaints in between,
     and `transition: none` while they're off stops the swap animating.

     (The obvious alternative, walking offsetTop up the tree, is transform-free
     but rounds to whole pixels at every step, which is what put the care panel
     three quarters of a pixel off the line.)                                */
  function firstBaseline(block) {
    var lifted = [];
    var node = block;
    while (node && node !== document.body) {
      var cs = getComputedStyle(node);
      /* both of them: the reveal slides with `translate`, the panels are
         tilted with `transform`, and either one moves a rect */
      if (cs.transform !== "none" || cs.translate !== "none") {
        lifted.push([node, node.style.transform, node.style.translate, node.style.transition]);
        node.style.transition = "none";
        node.style.transform = "none";
        node.style.translate = "none";
      }
      node = node.parentElement;
    }

    /* a zero-height inline-block sits with its bottom edge on the baseline,
       so this reads the first baseline exactly, whatever the font does */
    var probe = document.createElement("span");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText =
      "display:inline-block;width:0;height:0;vertical-align:baseline";
    block.insertBefore(probe, block.firstChild);
    var top = probe.getBoundingClientRect().top + window.scrollY;
    block.removeChild(probe);

    lifted.forEach(function (entry) {
      entry[0].style.transform = entry[1];
      entry[0].style.translate = entry[2];
      entry[0].style.transition = entry[3];
    });
    return top;
  }

  function snapToRules() {
    var rule = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--rule-gap"));
    if (!rule || rule < 4) return;

    var blocks = document.querySelectorAll(SNAP);
    Array.prototype.forEach.call(blocks, function (block) {
      block.style.position = "relative";
      block.style.top = "0px";              // measure it where it truly sits

      /* the ruling is drawn from the top of the page, one line every --rule-gap */
      var past = firstBaseline(block) % rule;
      var shift = past > rule / 2 ? rule - past : -past;
      block.style.top = shift.toFixed(2) + "px";
    });
  }

  function watchRules() {
    var timer;
    function again() { clearTimeout(timer); timer = setTimeout(snapToRules, 140); }

    snapToRules();
    /* the metrics change under it: a webfont swapping in moves every baseline,
       and the text is sized in vw so a resize changes the line height too */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(snapToRules);
    window.addEventListener("load", again);
    window.addEventListener("resize", again);

    /* and anything that changes the height of the page moves every block below
       it off the ruling again — a photograph arriving, "the details" being
       unfolded, or the sticky notes re-seating and resizing their spacer.
       A relative offset costs no height, so this can't feed itself. */
    if ("ResizeObserver" in window) new ResizeObserver(again).observe(document.body);
  }

  /* ── go ───────────────────────────────────────────────────────────────── */

  renderCover();
  renderMaker();
  var noteGroups = renderChapters();
  renderCare();
  renderContact();
  renderContents();

  if (window.ArthamDoodles) {
    window.ArthamDoodles.init(
      Array.prototype.slice.call(document.querySelectorAll(".chapter, .maker, .care")));
  }

  if (window.ArthamNotes && noteGroups.length) {
    window.ArthamNotes.init({
      tidyButton: document.getElementById("tidyBtn"),
      groups: noteGroups
    });
  }

  watchReveals();
  watchRules();
})();
