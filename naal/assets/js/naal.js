/* ==========================================================================
   NAAL by ARTHAM · the page behaviour.

   ▼ THE ONLY PART YOU SHOULD NEED TO EDIT ▼
   Prices: write them like "₹ 6,500". Leave "" and the page simply says
   "price on request" in the WhatsApp message and shows nothing on the page.
   ========================================================================== */
var NAAL = {
  whatsapp: "919952062202",   // country code, no plus sign, no spaces
  instagram: "artham.made",
  bags: [
    { id: "veyil",             name: "Veyil",               form: "Circle-handle hand bag", hour: "12:00 · Midday",       img: "images/bags/veyil.jpg",             price: "" },
    { id: "nizhal",            name: "Nizhal",              form: "Shoulder baguette",       hour: "15:30 · Afternoon",    img: "images/bags/nizhal.jpg",            price: "" },
    { id: "malai",             name: "Malai",               form: "Domed tote",              hour: "18:30 · Evening",      img: "images/bags/malai.jpg",             price: "" },
    { id: "vizha-half-moon",   name: "Vizha Half Moon",     form: "Half-moon clutch",        hour: "21:00 · Festival night", img: "images/bags/vizha-half-moon.jpg", price: "" },
    { id: "vizha-long-clutch", name: "Vizha Long Clutch",   form: "Long clutch",             hour: "21:00 · Festival night", img: "images/bags/vizha-long-clutch.jpg", price: "" }
  ]
};
/* ▲ ─────────────────────────────────────────────────────────────────────── */

(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var byId = {}; NAAL.bags.forEach(function (b) { byId[b.id] = b; });

  /* ── storage that never throws ─────────────────────────── */
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ── WhatsApp links ─────────────────────────────────────── */
  function wa(text) { return "https://wa.me/" + NAAL.whatsapp + "?text=" + encodeURIComponent(text); }
  $$("[data-wa]").forEach(function (a) {
    var b = byId[a.getAttribute("data-wa")];
    a.href = wa("Hello Artham! I'd love to know more about " + b.name + " (" + b.form + ") from the Naal collection.");
    a.target = "_blank"; a.rel = "noopener";
  });
  $$("[data-price-for]").forEach(function (p) { p.textContent = byId[p.getAttribute("data-price-for")].price || ""; });
  var ig = "https://instagram.com/" + NAAL.instagram;
  $("#igLink").href = ig; $("#footIg").href = ig;
  $("#footWa").href = wa("Hello Artham! I found you through Naal.");

  /* ── the hour: page colour, calendar sheet, dial sun ───── */
  var toned = $$("[data-bg]");
  function hex(h) { h = h.replace("#", ""); return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); }); }
  function mix(a, b, t) { return "rgb(" + a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); }).join(",") + ")"; }
  var tones = toned.map(function (el) {
    return { el: el, bg: hex(el.dataset.bg), fg: hex(el.dataset.fg), time: +el.dataset.time, ta: el.dataset.tamil, name: el.dataset.name };
  });
  var root = document.documentElement.style;
  var sheet = $("#sheet");
  var dialSun = $("#dialSun"), arcPath = $("#arcPath"), arcLen = arcPath ? arcPath.getTotalLength() : 0;
  var tops = [];
  function measure() { tops = tones.map(function (t) { return t.el.getBoundingClientRect().top + window.scrollY; }); }
  function arcAt(minutes) { var f = Math.max(0, Math.min(1, (minutes - 360) / (1320 - 360))); return arcPath.getPointAtLength(f * arcLen); }
  if (arcLen) $$(".dial__stop").forEach(function (a) {
    var pt = arcAt(+a.dataset.time);
    a.style.setProperty("--x", (pt.x / 400 * 100).toFixed(2) + "%");
    a.style.setProperty("--y", (pt.y / 260 * 100).toFixed(2) + "%");
  });

  /* the calendar sheet: whatever today is for the person reading, and which
     hour of Naal it is for them right now */
  var MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  var DAYS_TA = ["ஞாயிறு","திங்கள்","செவ்வாய்","புதன்","வியாழன்","வெள்ளி","சனி"];
  var DAYS_EN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  function hourOfNaal(m) {
    if (m >= 600 && m < 840) return ["Veyil hour", "#veyil"];
    if (m >= 840 && m < 1050) return ["Nizhal hour", "#nizhal"];
    if (m >= 1050 && m < 1200) return ["Malai hour", "#malai"];
    if (m >= 1200 && m < 1380) return ["Vizha hour", "#vizha"];
    if (m >= 300 && m < 600) return ["Morning", "#naal"];
    return ["Night", "#vizha"];
  }
  function today() {
    var d = new Date(), m = d.getHours() * 60 + d.getMinutes();
    var h12 = d.getHours() % 12 || 12, mm = d.getMinutes();
    $("#sheetMonth").textContent = MONTHS[d.getMonth()];
    $("#sheetYear").textContent = d.getFullYear();
    $("#sheetDate").textContent = d.getDate();
    $("#sheetDay").textContent = DAYS_TA[d.getDay()];
    var time = h12 + ":" + (mm < 10 ? "0" : "") + mm + (d.getHours() < 12 ? " am" : " pm");
    $("#sheetTime").textContent = time;
    var hn = hourOfNaal(m);
    $("#sheetHour").textContent = hn[0];
    sheet.href = hn[1];
    sheet.setAttribute("aria-label", "Today, " + DAYS_EN[d.getDay()] + " " + d.getDate() + " " + MONTHS[d.getMonth()] + ", " + time + ". It is " + hn[0] + ".");
  }
  today(); setInterval(today, 20000);

  function tone() {
    var vh = window.innerHeight, y = window.scrollY + vh * 0.5, i = 0;
    while (i < tops.length - 1 && tops[i + 1] <= y) i++;
    var cur = tones[i], next = tones[i + 1];
    var bg = cur.bg, fg = cur.fg, t = 0;
    if (next) {
      var w = vh * 0.45, d = tops[i + 1] - y;
      if (d < w) t = 1 - d / w;
    }
    root.setProperty("--bg", next ? mix(cur.bg, next.bg, t) : mix(bg, bg, 0));
    root.setProperty("--fg", next ? mix(cur.fg, next.fg, t) : mix(fg, fg, 0));

    // time of day runs smoothly from this section's hour to the next one's
    var span = next ? tops[i + 1] - tops[i] : 1;
    var prog = next ? Math.max(0, Math.min(1, (y - tops[i]) / span)) : 0;
    var minutes = cur.time + (next ? (next.time - cur.time) * prog : 0);
    sheet.classList.toggle("is-on", window.scrollY > vh * 0.6);

    // the sun on the dial: 06:00 at the left horizon, 22:00 below the right
    if (dialSun && arcLen) {
      var pt = arcAt(minutes);
      dialSun.setAttribute("cx", pt.x); dialSun.setAttribute("cy", pt.y);
      dialSun.style.fill = minutes > 1150 ? "#F2E6C9" : "#E9A93A";
    }
  }

  /* ── top bar: hides going down, returns going up ───────── */
  var bar = $("#bar"), lastY = 0;
  function barState() {
    var y = window.scrollY;
    bar.classList.toggle("is-solid", y > 40);
    bar.classList.toggle("is-hidden", y > lastY && y > 400 && !drawer.classList.contains("is-open"));
    lastY = y;
  }

  /* ── the paai unrolls ───────────────────────────────────── */
  var paai = $("#paai"), mat = $("#mat"), mems = $$("#memories li");
  function unroll() {
    var r = paai.getBoundingClientRect(), vh = window.innerHeight;
    var total = r.height - vh;
    var p = Math.max(0, Math.min(1, -r.top / (total * 0.7)));
    mat.style.setProperty("--p", p.toFixed(4));
    var shown = -1;
    mems.forEach(function (li, i) {
      var on = p > 0.08 + i * 0.17;
      li.classList.toggle("is-on", on);
      if (on) shown = i;
    });
    mems.forEach(function (li, i) { li.classList.toggle("is-cur", i === shown); });
  }

  /* ── chapter scenes respond to scroll ──────────────────── */
  var sun = $(".sun"), grill = $("#grillLight");
  function scenes() {
    var vh = window.innerHeight;
    if (sun) { var r = sun.parentNode.getBoundingClientRect(); sun.style.setProperty("--sp", Math.max(0, Math.min(1, 1 - r.bottom / (r.height + vh))).toFixed(3)); }
    if (grill) { var g = grill.closest(".scene").getBoundingClientRect(); grill.style.setProperty("--np", Math.max(0, Math.min(1, 1 - g.bottom / (g.height + vh))).toFixed(3)); }
    $$("[data-parallax]").forEach(function (el) {
      var b = el.parentNode.getBoundingClientRect();
      var k = parseFloat(el.dataset.parallax);
      el.style.transform = "translate3d(0," + ((b.top + b.height / 2 - vh / 2) * -k).toFixed(1) + "px,0)";
    });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { ticking = false; tone(); barState(); unroll(); if (!reduce) scenes(); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { measure(); onScroll(); });
  window.addEventListener("load", function () { measure(); onScroll(); });
  // lazy images change the page height as they arrive; keep the boundaries true
  if ("ResizeObserver" in window) new ResizeObserver(function () { measure(); onScroll(); }).observe(document.body);

  /* ── reveals ────────────────────────────────────────────── */
  // the veils that lift off Nizhal (tiles) and Malai (stripes)
  $$(".reveal--tiles, .reveal--stripes").forEach(function (m) {
    var tiles = m.classList.contains("reveal--tiles"), n = tiles ? 42 : 12, v = document.createElement("div");
    v.className = "veil"; v.setAttribute("aria-hidden", "true");
    for (var i = 0; i < n; i++) {
      var c = document.createElement("i");
      var d = tiles ? ((i % 6) + Math.floor(i / 6)) * 0.05 + Math.random() * 0.12 : i * 0.06;
      c.style.transitionDelay = d.toFixed(2) + "s";
      v.appendChild(c);
    }
    var im = m.querySelector("img"); im.parentNode.insertBefore(v, im.nextSibling);
  });
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ── hotspots ───────────────────────────────────────────── */
  $$(".spot").forEach(function (s) {
    var span = s.querySelector("span");
    span.setAttribute("data-t", s.firstChild.textContent.trim());
    var x = parseFloat(s.style.getPropertyValue("--x"));
    if (x > 70) s.classList.add("edge-r"); else if (x < 30) s.classList.add("edge-l");
    s.addEventListener("click", function (ev) {
      ev.stopPropagation();
      var open = s.getAttribute("aria-expanded") === "true";
      $$(".spot[aria-expanded=true]").forEach(function (o) { o.setAttribute("aria-expanded", "false"); });
      s.setAttribute("aria-expanded", open ? "false" : "true");
    });
  });
  document.addEventListener("click", function () { $$(".spot[aria-expanded=true]").forEach(function (o) { o.setAttribute("aria-expanded", "false"); }); });

  /* ── chapter photographs ──────────────────────────────── */
  $$(".scene__photo").forEach(function (img) {
    var mark = function () { img.closest(".scene").classList.add("has-photo"); };
    if (img.complete && img.naturalWidth) mark(); else img.addEventListener("load", mark);
    img.addEventListener("error", function () { img.remove(); });
  });

  /* ── festival lights for Vizha ─────────────────────────── */
  var lights = $("#lights");
  if (lights) {
    var cols = ["#E5458C", "#3FB27F", "#F2C14E", "#B0264F", "#FF9A5A", "#7E5BD6"];
    for (var i = 0; i < 46; i++) {
      var l = document.createElement("i"), s = 8 + Math.random() * 70;
      l.style.cssText = "left:" + (Math.random() * 100) + "%;top:" + (Math.random() * 80) + "%;width:" + s + "px;height:" + s +
        "px;--c:" + cols[i % cols.length] + ";--b:" + (s / 7).toFixed(1) + "px;--d:" + (2 + Math.random() * 4).toFixed(1) + "s;--dl:-" + (Math.random() * 4).toFixed(1) + "s";
      lights.appendChild(l);
    }
  }

  /* ── the loom in the hero: a paai being woven, row by row ── */
  var cv = $("#loom");
  if (cv && cv.getContext) {
    var ctx = cv.getContext("2d"), dpr = Math.min(2, window.devicePixelRatio || 1), W, H, row = 0, pat = 0, cell = 7, rowH = 5;
    // four weaves of the day, as functions of (column, row) → colour
    var weaves = [
      function (c, r) { var b = Math.floor(r / 26) % 3; return b === 1 ? "#E6CF9E" : "#8A5A3C"; },                               // Veyil
      function (c, r) { var q = (Math.floor(c / 3) + Math.floor(r / 5)) % 2; return q ? ((Math.floor(c / 3) % 2) ? "#C2582F" : "#24345A") : "#EFE6D6"; }, // Nizhal
      function (c) { return (Math.floor(c / 4) % 2) ? "#161210" : "#D9C39A"; },                                                      // Malai
      function (c, r) { var s = Math.floor(c / 3) % 2; return s ? "#B1235E" : ((r % 4 < 2) ? "#1D6A4F" : "#5A1427"); }                // Vizha
    ];
    function size() {
      W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = "#2E231D"; ctx.fillRect(0, 0, W, H); row = 0;
    }
    function weaveRow() {
      var y = H - rowH;
      // shift the cloth up one row, like it's being taken up on the beam
      ctx.drawImage(cv, 0, rowH * dpr, W * dpr, (H - rowH) * dpr, 0, 0, W, H - rowH);
      var f = weaves[pat], cols = Math.ceil(W / cell);
      for (var c = 0; c < cols; c++) {
        ctx.fillStyle = f(c, row);
        ctx.fillRect(c * cell, y, cell, rowH);
        // over-under: every other strand dips under the warp
        if ((c + row) % 2) { ctx.fillStyle = "rgba(0,0,0,.28)"; ctx.fillRect(c * cell, y, cell, rowH); }
        else { ctx.fillStyle = "rgba(255,255,255,.10)"; ctx.fillRect(c * cell, y, cell, 1); }
      }
      row++;
      if (row % 120 === 0) pat = (pat + 1) % weaves.length;
    }
    size();
    window.addEventListener("resize", size);
    if (reduce) { for (var k = 0; k < Math.ceil(H / rowH); k++) weaveRow(); }
    else {
      var heroVisible = true;
      if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; }).observe(cv);
      var last = 0;
      (function loop(t) {
        if (heroVisible && t - last > 34) { weaveRow(); last = t; }
        requestAnimationFrame(loop);
      })(0);
      // fill most of the cloth at once so the hero never opens empty
      for (var k2 = 0; k2 < Math.ceil(H / rowH) + 2; k2++) weaveRow();
    }
  }

  /* ── story cards lightbox ──────────────────────────────── */
  var lb = $("#lightbox"), lbImg = $("#lightboxImg");
  $$("#fan button").forEach(function (b) {
    b.addEventListener("click", function () {
      var img = b.querySelector("img"); lbImg.src = img.src; lbImg.alt = img.alt;
      if (lb.showModal) lb.showModal(); else window.open(img.src);
    });
  });
  lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });

  /* ── your Naal: the selection and the WhatsApp order ───── */
  var picked = (store.get("naal-picked") || []).filter(function (id) { return byId[id]; });
  var drawer = $("#drawer"), scrim = $("#scrim"), list = $("#drawerList"), empty = $("#drawerEmpty"), send = $("#orderSend");
  var count = $("#bagCount"), name = $("#ordName"), city = $("#ordCity");
  name.value = store.get("naal-name") || ""; city.value = store.get("naal-city") || "";

  // the order grid near the end
  var grid = $("#orderGrid");
  NAAL.bags.forEach(function (b) {
    var li = document.createElement("li"); li.className = "tile reveal";
    li.innerHTML = '<a class="tile__img" href="#' + b.id.split("-")[0] + '"><img src="' + b.img + '" alt="" loading="lazy"></a>' +
      '<div class="tile__body"><span class="tile__hour">' + b.hour + '</span><span class="tile__name">' + b.name + '</span>' +
      '<span class="tile__form">' + b.form + (b.price ? " · " + b.price : "") + '</span>' +
      '<button class="btn add" type="button" data-add="' + b.id + '">Add to your day</button></div>';
    grid.appendChild(li);
    if (io) io.observe(li); else li.classList.add("is-in");
  });

  function message() {
    var lines = ["Hello Artham! I'd like to order from Naal:", ""];
    picked.forEach(function (id) { var b = byId[id]; lines.push("• " + b.name + ": " + b.form + (b.price ? " (" + b.price + ")" : "")); });
    lines.push("");
    if (name.value.trim()) lines.push("Name: " + name.value.trim());
    if (city.value.trim()) lines.push("City: " + city.value.trim());
    lines.push("Could you confirm availability, price and delivery?");
    return lines.join("\n");
  }
  function render() {
    count.textContent = picked.length;
    list.innerHTML = "";
    picked.forEach(function (id) {
      var b = byId[id], li = document.createElement("li");
      li.innerHTML = '<img src="' + b.img + '" alt=""><div><b>' + b.name + '</b><span>' + b.form + (b.price ? " · " + b.price : "") + '</span></div><button type="button" data-remove="' + id + '">Remove</button>';
      list.appendChild(li);
    });
    empty.hidden = picked.length > 0;
    send.href = wa(message());
    send.setAttribute("aria-disabled", picked.length ? "false" : "true");
    $$("[data-add]").forEach(function (btn) {
      var id = btn.getAttribute("data-add"), on = picked.indexOf(id) > -1;
      if (!btn.dataset.label) btn.dataset.label = btn.textContent;
      btn.classList.toggle("is-added", on);
      btn.textContent = on ? "✓ In your day" : btn.dataset.label;
    });
    store.set("naal-picked", picked);
  }
  var toast = document.createElement("div"); toast.className = "toast"; toast.setAttribute("role", "status");
  document.body.appendChild(toast);
  var toastTimer;
  function say(text) {
    toast.innerHTML = "<span>" + text + '</span><button type="button">View</button>';
    toast.querySelector("button").onclick = openDrawer;
    toast.classList.add("is-on"); clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("is-on"); }, 3200);
  }
  document.addEventListener("click", function (e) {
    var add = e.target.closest("[data-add]"), rm = e.target.closest("[data-remove]");
    if (add) {
      var id = add.getAttribute("data-add"), at = picked.indexOf(id);
      if (at > -1) { picked.splice(at, 1); } else { picked.push(id); say(byId[id].name + " added to your Naal"); count.classList.remove("bump"); void count.offsetWidth; count.classList.add("bump"); }
      render();
    }
    if (rm) { picked.splice(picked.indexOf(rm.getAttribute("data-remove")), 1); render(); }
  });
  [name, city].forEach(function (f) { f.addEventListener("input", function () { store.set("naal-name", name.value); store.set("naal-city", city.value); send.href = wa(message()); }); });

  var lastFocus;
  function openDrawer() {
    lastFocus = document.activeElement;
    scrim.hidden = false; drawer.classList.add("is-open"); drawer.setAttribute("aria-hidden", "false");
    $("#bagBtn").setAttribute("aria-expanded", "true"); toast.classList.remove("is-on");
    setTimeout(function () { drawer.focus(); }, 50);
  }
  function closeDrawer() {
    scrim.hidden = true; drawer.classList.remove("is-open"); drawer.setAttribute("aria-hidden", "true");
    $("#bagBtn").setAttribute("aria-expanded", "false");
    if (lastFocus) lastFocus.focus();
  }
  $("#bagBtn").addEventListener("click", openDrawer);
  $("#orderOpen").addEventListener("click", openDrawer);
  $("#drawerClose").addEventListener("click", closeDrawer);
  scrim.addEventListener("click", closeDrawer);
  drawer.addEventListener("click", function (e) { if (e.target.closest(".drawer__empty a")) closeDrawer(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && drawer.classList.contains("is-open")) closeDrawer(); });

  render(); measure(); tone(); unroll(); barState();
})();
