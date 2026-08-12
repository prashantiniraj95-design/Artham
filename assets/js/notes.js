/* ============================================================================
   Artham — sticky notes
   Little paper squares with fun facts on them. Drag them anywhere; the page
   remembers where you left them — on a phone as much as on a laptop.

   Each one starts in the empty margin beside the product it talks about —
   never on top of a photograph. Move it onto one if you want to; that's the
   point.

   Each note lives in the DOM inside the chapter it belongs to, and is placed
   against that chapter — so the reading order and the tab order both stay
   sensible, and the page needs no separate overlay.
   ========================================================================== */

window.ArthamNotes = (function () {
  "use strict";

  var STORE_KEY = "artham.notes.v1";
  var NARROW    = 760;   // px — below this the notes start stacked, not scattered
  var NOTE_W    = 176;   // matches .notes-strip > .note width
  var EDGE      = 12;    // keep this much clear of the window edges
  var NUDGE     = 8;     // px per arrow key
  var NUDGE_BIG = 32;    // …with shift held
  var BASE_Z    = 40;

  var groups  = [];
  var tidyBtn = null;
  var topZ    = BASE_Z;

  /* ── storage ───────────────────────────────────────────────────────────
     Offsets are kept relative to the chapter's story block, so they survive
     a resize, a new chapter being added above, or a photo swapped out.    */

  function readStore() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (e) { return {}; }
  }

  function writeStore(data) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); }
    catch (e) { /* private browsing — the notes simply won't persist */ }
  }

  function saveOffset(id, dx, dy) {
    var data = readStore();
    data[id] = { dx: Math.round(dx), dy: Math.round(dy) };
    writeStore(data);
    if (tidyBtn) tidyBtn.hidden = false;
  }

  function hasSavedPositions() {
    return Object.keys(readStore()).length > 0;
  }

  /* ── geometry ─────────────────────────────────────────────────────────
     Deliberately offsetTop/offsetLeft rather than getBoundingClientRect:
     a chapter carries a reveal transform on the way in, and a rect would
     include it — so a note measured mid-animation would land 20px out and
     drift again on the next load. Offsets are layout-only.               */

  function docOffset(el) {
    var left = 0, top = 0, node = el;
    while (node) {
      left += node.offsetLeft;
      top += node.offsetTop;
      node = node.offsetParent;
    }
    return { left: left, top: top };
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  var GAP_TOP   = 18;  // clear of the story block
  var LANE_PAD  = 14;  // between a note and the photograph it belongs to
  var LANE_EDGE = 10;  // and between a note and the edge of the page
  var STACK_GAP = 16;  // between two notes sharing one margin

  function isNarrow() {
    return !window.matchMedia("(min-width: " + NARROW + "px)").matches;
  }

  /* ── the margin beside a product ───────────────────────────────────────
     A product row hugs one side of the page and leaves the other side empty
     — the sides alternate, which is the :nth-child(even) rule in the
     stylesheet. That empty side is where the note about that product goes.

     Measured rather than assumed: the row's own children say where the
     photograph and the writing actually end, so this keeps working if the
     column widths are ever changed. Returns null when neither side has room
     for a note, and the caller falls back to the old band.                */

  function laneBeside(chapter, row) {
    var list = row.parentNode;               // .objects — the positioned parent
    var kids = [].slice.call(row.children);
    if (!kids.length) return null;

    var used = { left: Infinity, right: -Infinity };
    kids.forEach(function (kid) {
      used.left = Math.min(used.left, kid.offsetLeft);
      used.right = Math.max(used.right, kid.offsetLeft + kid.offsetWidth);
    });

    /* into chapter coordinates, which is what a note's left/top are measured in */
    var contentLeft = list.offsetLeft + used.left;
    var contentRight = list.offsetLeft + used.right;

    /* a note may sit out in the chapter's gutter, so the whole padding box
       is fair game — not just the column the objects are laid out in */
    var right = {
      x: contentRight + LANE_PAD,
      w: chapter.clientWidth - contentRight - LANE_PAD - LANE_EDGE
    };
    var left = {
      x: LANE_EDGE,
      w: contentLeft - LANE_PAD - LANE_EDGE
    };

    var lane = right.w >= left.w ? right : left;
    if (lane.w < NOTE_W) return null;

    return {
      x: lane.x + (lane.w - NOTE_W) / 2,
      top: list.offsetTop + row.offsetTop,
      height: row.offsetHeight
    };
  }

  function productRows(chapter) {
    var list = chapter.querySelector(".objects");
    return list ? [].slice.call(list.children) : [];
  }

  /* Where a note sits before anyone touches it — beside the product it talks
     about, in that empty margin. Where a chapter has more notes than products
     they share a margin, stacked; where there is no room at all they fall back
     to the band under the story, which is what a phone gets.

     `x` and `y` in content.js still override, as fractions of the story block,
     for anyone placing a note by hand. */
  function seatGroup(group) {
    var records = group.notes;
    var ref = records[0].ref;
    var chapter = group.anchor;
    var rows = isNarrow() ? [] : productRows(chapter);

    /* note i belongs to product i; past that they wrap back round */
    var perProduct = [];
    var banded = [];

    records.forEach(function (record, index) {
      var note = record.source;
      if (typeof note.x === "number" && typeof note.y === "number") {
        record.dx = note.x * ref.offsetWidth;
        record.dy = note.y * ref.offsetHeight;
        record.seated = true;
        return;
      }
      record.seated = false;
      if (!rows.length) { banded.push(record); return; }
      var slot = index % rows.length;
      (perProduct[slot] = perProduct[slot] || []).push(record);
    });

    perProduct.forEach(function (sharing, slot) {
      var lane = laneBeside(chapter, rows[slot]);
      if (!lane) { sharing.forEach(function (r) { banded.push(r); }); return; }

      var heights = sharing.map(function (r) { return r.el.offsetHeight || 130; });
      var stack = heights.reduce(function (a, b) { return a + b; }, 0)
                + STACK_GAP * (sharing.length - 1);

      /* centred against the photograph, unless the pile is taller than it is */
      var y = lane.top + Math.max(0, (lane.height - stack) / 2);

      sharing.forEach(function (record, i) {
        record.dx = lane.x - ref.offsetLeft;
        record.dy = y - ref.offsetTop;
        record.seated = true;
        y += heights[i] + STACK_GAP;
      });
    });

    /* whatever is left over goes back under the story — a phone, mostly,
       where there is no margin beside anything. Stacked by their real heights
       rather than on a fixed pitch: a note is as tall as its fun fact is long,
       and a fixed pitch had the longer ones overlapping the note below. */
    var y = ref.offsetHeight + GAP_TOP;
    banded.forEach(function (record, index) {
      record.dx = (index % 2) * 9;          // dropped, not filed
      record.dy = y;
      record.seated = true;
      y += (record.el.offsetHeight || 130) + STACK_GAP;
    });

    /* the height the strip has to reserve so the objects clear the pile */
    return banded.length ? y - ref.offsetHeight : 0;
  }

  /* The note is absolutely positioned inside its chapter, so left/top are
     measured from the chapter — but the clamp that keeps it on screen has to
     be done in page coordinates. */
  function place(record) {
    var withinChapter = record.ref.offsetLeft + record.dx;
    var chapterLeft = docOffset(record.chapter).left;
    var lowest = EDGE - chapterLeft;
    var highest = document.documentElement.clientWidth - NOTE_W - EDGE - chapterLeft;

    record.el.style.left = clamp(withinChapter, lowest, Math.max(lowest, highest)) + "px";
    record.el.style.top = (record.ref.offsetTop + record.dy) + "px";
  }

  function layoutAll() {
    groups.forEach(function (group) { group.notes.forEach(place); });
  }

  /* ── building ─────────────────────────────────────────────────────────── */

  function buildNote(note, id) {
    var el = document.createElement("div");
    el.className = "note note--" + (note.tone === "memory" ? "memory" : "fact");
    el.id = id;
    el.tabIndex = 0;
    el.setAttribute("role", "note");

    var tone = document.createElement("span");
    tone.className = "note__tone";
    tone.textContent = note.tone === "memory" ? "A memory. " : "A fun fact. ";
    el.appendChild(tone);

    el.appendChild(document.createTextNode(note.text));
    return el;
  }

  /* ── dragging ─────────────────────────────────────────────────────────── */

  function attachDrag(record) {
    var el = record.el;
    var startX = 0, startY = 0, originDx = 0, originDy = 0, dragging = false;

    el.addEventListener("pointerdown", function (event) {
      if (event.button !== 0) return;
      dragging = true;
      startX = event.clientX;
      startY = event.clientY;
      originDx = record.dx;
      originDy = record.dy;
      el.classList.add("is-dragging");
      el.style.zIndex = ++topZ;
      el.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    el.addEventListener("pointermove", function (event) {
      if (!dragging) return;
      record.dx = originDx + (event.clientX - startX);
      record.dy = originDy + (event.clientY - startY);
      place(record);
    });

    function end(event) {
      if (!dragging) return;
      dragging = false;
      el.classList.remove("is-dragging");
      if (el.hasPointerCapture && el.hasPointerCapture(event.pointerId)) {
        el.releasePointerCapture(event.pointerId);
      }
      saveOffset(el.id, record.dx, record.dy);
    }

    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);

    /* the same move, without a mouse */
    el.addEventListener("keydown", function (event) {
      var step = event.shiftKey ? NUDGE_BIG : NUDGE;
      var moved = true;

      switch (event.key) {
        case "ArrowLeft":  record.dx -= step; break;
        case "ArrowRight": record.dx += step; break;
        case "ArrowUp":    record.dy -= step; break;
        case "ArrowDown":  record.dy += step; break;
        default: moved = false;
      }

      if (!moved) return;
      event.preventDefault();
      el.style.zIndex = ++topZ;
      place(record);
      saveOffset(el.id, record.dx, record.dy);
    });

    el.addEventListener("focus", function () { el.style.zIndex = ++topZ; });
  }

  /* ── placing them ─────────────────────────────────────────────────────── */

  /* Seating is done twice on purpose. The strip reserves room under the story
     for any note that could not find a margin, and changing that height moves
     every product row down the page — so the first pass only asks how many
     notes land in the band, and the second measures once the page has settled
     at its final height. */
  function seatAll() {
    var reserve = groups.map(seatGroup);
    groups.forEach(function (group, i) {
      group.strip.style.height = Math.round(reserve[i]) + "px";
    });
    groups.forEach(seatGroup);
  }

  function layoutDefaults() {
    seatAll();

    var saved = readStore();
    groups.forEach(function (group, gi) {
      group.notes.forEach(function (record, index) {
        var stored = saved[record.el.id];
        if (stored) {
          record.dx = stored.dx;
          record.dy = stored.dy;
        }
        /* a hand-pinned tilt — steady per note, not random on every reload */
        record.el.style.transform = "rotate(" + (((gi * 7 + index * 5) % 9) - 4) + "deg)";
        record.el.style.zIndex = ++topZ;
      });
    });

    layoutAll();
  }

  /* ── reveal ───────────────────────────────────────────────────────────── */

  function revealAll(group) {
    group.notes.forEach(function (record, i) {
      setTimeout(function () { record.el.classList.add("is-in"); }, i * 130);
    });
  }

  function watchReveal() {
    if (!("IntersectionObserver" in window)) {
      groups.forEach(revealAll);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        groups.forEach(function (group) {
          if (group.anchor === entry.target) revealAll(group);
        });
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });

    groups.forEach(function (g) { observer.observe(g.anchor); });
  }

  /* ── public ───────────────────────────────────────────────────────────── */

  function tidy() {
    writeStore({});
    seatAll();
    layoutAll();
    if (tidyBtn) tidyBtn.hidden = true;
  }

  function init(options) {
    tidyBtn = options.tidyButton || null;
    groups = [];

    options.groups.forEach(function (group, gi) {
      if (!group.notes || !group.notes.length) return;

      var ref = group.ref || group.anchor;

      /* the strip sits straight after the story and before the objects, so on
         a phone the notes are read in the right place */
      var strip = document.createElement("div");
      strip.className = "notes-strip";
      if (ref.parentNode === group.anchor) {
        ref.insertAdjacentElement("afterend", strip);
      } else {
        group.anchor.appendChild(strip);
      }

      var records = group.notes.map(function (note, index) {
        var el = buildNote(note, "note-" + (group.id || gi) + "-" + index);
        el.classList.add("reveal");
        strip.appendChild(el);

        var record = {
          el: el,
          source: note,
          chapter: group.anchor,
          ref: ref,
          side: group.side || "left",
          dx: 0,
          dy: 0
        };
        attachDrag(record);
        return record;
      });

      groups.push({ id: group.id || String(gi), anchor: group.anchor, strip: strip, notes: records });
    });

    if (!groups.length) return;

    layoutDefaults();
    watchReveal();

    if (tidyBtn) {
      tidyBtn.hidden = !hasSavedPositions();
      tidyBtn.addEventListener("click", tidy);
    }

    var resizeTimer;
    function reseat() {
      clearTimeout(resizeTimer);
      /* the margin a note sits in moves and narrows with the window, so an
         untouched note has to be re-seated, not merely re-measured */
      resizeTimer = setTimeout(layoutDefaults, 140);
    }

    window.addEventListener("resize", reseat);
    window.addEventListener("load", reseat);

    /* A product row is only 107px tall until its photograph arrives, and the
       photographs are lazy — they load on the way down the page, long after
       this runs. Seating a note against a row that hasn't got its picture yet
       puts it halfway up the one above. So watch the objects for their real
       height and seat again when it lands; this also catches "the details"
       being unfolded, which makes a row taller too. */
    if ("ResizeObserver" in window) {
      var watcher = new ResizeObserver(reseat);
      groups.forEach(function (group) {
        var list = group.anchor.querySelector(".objects");
        if (list) watcher.observe(list);
      });
    }
  }

  return { init: init, tidy: tidy, relayout: layoutAll };
})();
