/* Oru Naal — the day dial, the bag, and the woven placeholders. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var WHATSAPP = "919952062202";

  // Prices are placeholders for the preview.
  var PIECES = [
    { id: "veyil",           name: "Veyil",      type: "Circle-handle bag",   price: 4800, img: "images/veyil.jpg",             href: "#veyil" },
    { id: "nizhal",          name: "Nizhal",     type: "Shoulder baguette",   price: 3900, img: "images/nizhal.jpg",            href: "#nizhal" },
    { id: "malai",           name: "Malai",      type: "Domed tote",          price: 5600, img: "images/malai.jpg",             href: "#malai" },
    { id: "vizha-long",      name: "Vizha",      type: "Long clutch",         price: 3400, img: "images/vizha-long-clutch.jpg", href: "#vizha" },
    { id: "vizha-half-moon", name: "Vizha",      type: "Half-moon clutch",    price: 3800, img: "images/vizha-half-moon.jpg",   href: "#vizha" }
  ];
  var byId = {};
  PIECES.forEach(function (p) { byId[p.id] = p; });

  var rupees = function (n) { return "₹" + n.toLocaleString("en-IN"); };
  var $ = function (id) { return document.getElementById(id); };

  /* ── shop grid ─────────────────────────────────────────────────────── */
  $("grid").innerHTML = PIECES.map(function (p) {
    return '<li class="card">' +
      '<a class="card__img" href="' + p.href + '"><img src="' + p.img + '" alt="' + p.name + ", " + p.type.toLowerCase() + '" loading="lazy"></a>' +
      '<div class="card__row"><h3 class="card__name"><a href="' + p.href + '">' + p.name + '</a></h3>' +
      '<span class="price">' + rupees(p.price) + '</span></div>' +
      '<span class="card__type">' + p.type + '</span>' +
      '<button class="add" type="button" data-add="' + p.id + '">Add to bag</button>' +
    '</li>';
  }).join("");

  /* ── the bag ───────────────────────────────────────────────────────── */
  var bag = {};
  try { bag = JSON.parse(localStorage.getItem("oru-naal-bag")) || {}; } catch (e) { bag = {}; }
  Object.keys(bag).forEach(function (k) { if (!byId[k]) delete bag[k]; });

  function save() { try { localStorage.setItem("oru-naal-bag", JSON.stringify(bag)); } catch (e) {} }

  function render() {
    var ids = Object.keys(bag).filter(function (k) { return bag[k] > 0; });
    var count = 0, total = 0;
    $("bagItems").innerHTML = ids.map(function (id) {
      var p = byId[id], q = bag[id];
      count += q; total += q * p.price;
      return '<li><img src="' + p.img + '" alt="">' +
        '<div><div class="n">' + p.name + '</div><div class="t">' + p.type + '</div>' +
        '<div class="qty"><button type="button" data-dec="' + id + '" aria-label="One fewer ' + p.name + ' ' + p.type + '">−</button>' +
        '<span>' + q + '</span>' +
        '<button type="button" data-inc="' + id + '" aria-label="One more ' + p.name + ' ' + p.type + '">+</button></div></div>' +
        '<span class="p">' + rupees(q * p.price) + '</span></li>';
    }).join("");
    $("bagCount").textContent = count;
    $("bagTotal").textContent = rupees(total);
    $("bagEmpty").hidden = count > 0;
    $("bagFoot").hidden = count === 0;

    var lines = ids.map(function (id) { return bag[id] + " × " + byId[id].name + " (" + byId[id].type + ")"; });
    var msg = "Hello Artham, I'd like to order from Oru Naal:\n" + lines.join("\n") + "\nTotal " + rupees(total);
    $("checkout").href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg);

    document.querySelectorAll("[data-add]").forEach(function (b) {
      var q = bag[b.getAttribute("data-add")] || 0;
      if (q) { b.setAttribute("data-added", ""); b.textContent = "In your bag"; }
      else { b.removeAttribute("data-added"); b.textContent = "Add to bag"; }
    });
  }

  function open() { $("bag").hidden = false; $("scrim").hidden = false; $("bagClose").focus(); }
  function close() { $("bag").hidden = true; $("scrim").hidden = true; $("bagOpen").focus(); }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-add],[data-inc],[data-dec]");
    if (!t) return;
    var add = t.getAttribute("data-add"), inc = t.getAttribute("data-inc"), dec = t.getAttribute("data-dec");
    if (add) { if (bag[add]) { open(); return; } bag[add] = 1; }
    if (inc) bag[inc] = (bag[inc] || 0) + 1;
    if (dec) { bag[dec] = (bag[dec] || 0) - 1; if (bag[dec] <= 0) delete bag[dec]; }
    save(); render();
  });
  $("bagOpen").addEventListener("click", open);
  $("bagClose").addEventListener("click", close);
  $("scrim").addEventListener("click", close);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !$("bag").hidden) close(); });
  render();

  /* ── the day dial: follows whichever chapter holds the middle of the screen ── */
  var dial = $("dial"), sun = $("dialSun");
  var chapters = Array.prototype.slice.call(document.querySelectorAll("[data-hour]"));
  function place(el) {
    // the sun rides a half circle: 0 is sunrise on the left, 1 is the far right
    var t = parseFloat(el.getAttribute("data-sun")) || 0;
    var a = Math.PI * (1 - t);
    sun.setAttribute("cx", (32 + 28 * Math.cos(a)).toFixed(2));
    sun.setAttribute("cy", (32 - 28 * Math.sin(a)).toFixed(2));
    $("dialHour").textContent = el.getAttribute("data-hour");
    $("dialName").textContent = el.getAttribute("data-name");
    if (el.hasAttribute("data-night")) dial.setAttribute("data-night", ""); else dial.removeAttribute("data-night");
  }
  place(chapters[0]);
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) place(en.target); });
    }, { rootMargin: "-50% 0px -50% 0px" });
    chapters.forEach(function (c) { io.observe(c); });

    var rv = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); rv.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { rv.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  /* ── woven placeholders: stand-ins for photos still to be taken ─────── */
  var PALETTES = {
    stitch: { warp: ["#E9DCC6", "#DCCBB0"], weft: ["#7A171B", "#E9DCC6", "#E9DCC6", "#C9923E"], leather: "#8A4B2A" },
    vizha:  { warp: ["#2A171E", "#3A1B28"], weft: ["#B3245B", "#1F6B45", "#6E1530", "#B3245B", "#D0487A"] },
    nizhal: { warp: ["#E9DCC6"], weft: ["#26314F", "#B5532E"], check: true }
  };
  document.querySelectorAll("canvas.weave").forEach(function (c) {
    var p = PALETTES[c.getAttribute("data-weave")];
    var ctx = c.getContext("2d"), W = c.width, H = c.height, s = 10;
    var rnd = (function (seed) { return function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; })(7);
    ctx.fillStyle = p.warp[0]; ctx.fillRect(0, 0, W, H);
    for (var y = 0, row = 0; y < H; y += s, row++) {
      for (var x = 0, col = 0; x < W; x += s, col++) {
        var over = (row + col) % 2 === 0;
        var colr;
        if (p.check) colr = over ? ((Math.floor(row / 3) + Math.floor(col / 3)) % 2 ? p.weft[0] : p.weft[1]) : p.warp[0];
        else colr = over ? p.weft[Math.floor(row / 4) % p.weft.length] : p.warp[col % p.warp.length];
        ctx.fillStyle = colr;
        ctx.globalAlpha = 0.86 + rnd() * 0.14;
        // each crossing is a slightly rounded, slightly uneven strand
        ctx.beginPath();
        ctx.ellipse(x + s / 2, y + s / 2, s * (over ? 0.62 : 0.5), s * (over ? 0.42 : 0.55), 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    if (p.leather) {
      // a leather edge across the lower third, with a saddle stitch running along it
      var top = Math.round(H * 0.64);
      ctx.fillStyle = p.leather; ctx.fillRect(0, top, W, H - top);
      ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.fillRect(0, top, W, 6);
      ctx.strokeStyle = "#F1E7DA"; ctx.lineWidth = 4; ctx.lineCap = "round";
      for (var sx = 18; sx < W; sx += 34) {
        ctx.beginPath(); ctx.moveTo(sx, top + 34); ctx.lineTo(sx + 18, top + 30); ctx.stroke();
      }
    }
  });
})();
