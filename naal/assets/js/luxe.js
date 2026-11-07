/* NAAL · the quiet edition: the side menu, and the light of the hour.
   Runs alongside naal.js, which handles the bag, the calendar and the rest. */
(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── side menu ─────────────────────────────────────────── */
  var menu = $("#menu"), scrim = $("#menuScrim"), btn = $("#menuBtn"), last;
  function open() {
    last = document.activeElement;
    scrim.hidden = false; menu.classList.add("is-open"); menu.setAttribute("aria-hidden", "false");
    btn.setAttribute("aria-expanded", "true"); document.body.classList.add("menu-open");
    setTimeout(function () { menu.focus(); }, 60);
  }
  function close(keepFocus) {
    scrim.hidden = true; menu.classList.remove("is-open"); menu.setAttribute("aria-hidden", "true");
    btn.setAttribute("aria-expanded", "false"); document.body.classList.remove("menu-open");
    if (!keepFocus && last) last.focus();
  }
  btn.addEventListener("click", open);
  $("#menuClose").addEventListener("click", function () { close(); });
  scrim.addEventListener("click", function () { close(); });
  menu.addEventListener("click", function (e) { if (e.target.closest("a[href^='#']")) close(true); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu.classList.contains("is-open")) close(); });
  if (window.NAAL) {
    $("#menuWa").href = "https://wa.me/" + NAAL.whatsapp + "?text=" + encodeURIComponent("Hello Artham! I found you through Naal.");
    $("#menuIg").href = "https://instagram.com/" + NAAL.instagram;
  }

  /* ── the light of the hour ─────────────────────────────────
     A wash of light that moves across the page as the story's day goes on:
     pink at dawn, white-gold at noon, amber in the afternoon, low and orange
     at dusk, a magenta glow for the festival, then moonlight. */
  var light = $("#daylight");
  var keys = [ // minutes, x%, y%, r, g, b, strength
    [330, 6, 96, 255, 150, 140, .16],
    [420, 12, 72, 255, 186, 160, .34],
    [600, 30, 30, 255, 222, 170, .34],
    [720, 50, 4, 255, 236, 186, .48],
    [930, 76, 22, 255, 184, 104, .42],
    [1110, 94, 70, 255, 124, 74, .44],
    [1260, 50, 12, 214, 70, 150, .32],
    [1340, 70, 10, 140, 130, 210, .2],
    [1440, 70, 10, 110, 110, 190, .14]
  ];
  var secs = [].slice.call(document.querySelectorAll("[data-time]")), tops = [];
  function measure() { tops = secs.map(function (s) { return s.getBoundingClientRect().top + window.scrollY; }); }
  function minutesNow() {
    var y = window.scrollY + window.innerHeight * 0.5, i = 0;
    while (i < tops.length - 1 && tops[i + 1] <= y) i++;
    var a = +secs[i].dataset.time, n = secs[i + 1];
    if (!n) return a;
    var f = Math.max(0, Math.min(1, (y - tops[i]) / (tops[i + 1] - tops[i])));
    return a + (+n.dataset.time - a) * f;
  }
  function paint() {
    var m = minutesNow(), k = 0;
    while (k < keys.length - 2 && keys[k + 1][0] <= m) k++;
    var A = keys[k], B = keys[k + 1], t = Math.max(0, Math.min(1, (m - A[0]) / (B[0] - A[0])));
    var v = A.map(function (x, j) { return x + (B[j] - x) * t; });
    light.style.setProperty("--x", v[1].toFixed(1) + "%");
    light.style.setProperty("--y", v[2].toFixed(1) + "%");
    light.style.setProperty("--c", Math.round(v[3]) + "," + Math.round(v[4]) + "," + Math.round(v[5]));
    light.style.setProperty("--a", v[6].toFixed(3));
  }
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { ticking = false; paint(); });
  }, { passive: true });
  window.addEventListener("resize", function () { measure(); paint(); });
  if ("ResizeObserver" in window) new ResizeObserver(function () { measure(); paint(); }).observe(document.body);
  /* ── Artham: korai and leather slide together and are stitched ── */
  var meetSec = $("#artham"), meet = $("#meet");
  function clamp01(x) { return Math.max(0, Math.min(1, x)); }
  function meeting() {
    if (!meetSec || !meet) return;
    var r = meetSec.getBoundingClientRect(), p = clamp01(-r.top / (r.height - window.innerHeight));
    if (reduce) p = 1;
    meet.style.setProperty("--a", clamp01(p / .55).toFixed(3));          // the two halves approach
    meet.style.setProperty("--s", clamp01((p - .55) / .2).toFixed(3));   // the stitch runs down the seam
    meet.style.setProperty("--m", clamp01((p - .74) / .14).toFixed(3));  // the mark is set
    meetSec.classList.toggle("is-met", p > .82);
  }
  window.addEventListener("scroll", function () { requestAnimationFrame(meeting); }, { passive: true });
  meeting();

  measure(); paint();
  if (reduce) light.style.transition = "none";
})();
