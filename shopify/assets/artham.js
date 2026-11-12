/* ==========================================================================
   ARTHAM — Naal
   Small, dependency-free. Everything here is progressive: with JavaScript off
   the page still reads top to bottom, the film still plays, the forms still post.
   ========================================================================== */
(function () {
  'use strict';

  var doc = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';

  /* ── the light: which hour of the day the page is in ─────────────────── */
  var HOURS = ['veyil', 'nizhal', 'maalai', 'vizha'];
  var hourEls = $$('[data-hour]').filter(function (el) { return el !== doc; });
  var pinned = $('[data-hour-pin]');
  var dial = $('[data-dial]');
  var hoverHour = null;
  var scrollHour = 'dawn';

  function paintHour() {
    var hour = hoverHour || scrollHour;
    if (doc.getAttribute('data-hour') !== hour) doc.setAttribute('data-hour', hour);
    if (dial) {
      dial.classList.toggle('is-on', HOURS.indexOf(scrollHour) > -1);
      $$('[data-dial-link]', dial).forEach(function (a) {
        a.classList.toggle('is-now', a.getAttribute('data-dial-link') === scrollHour);
      });
    }
  }

  function readHour() {
    if (pinned) { scrollHour = pinned.getAttribute('data-hour') || 'dawn'; return; }
    var mid = window.innerHeight * 0.5;
    var found = 'dawn';
    for (var i = 0; i < hourEls.length; i++) {
      var r = hourEls[i].getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) { found = hourEls[i].getAttribute('data-hour'); break; }
    }
    // an interlude with no light of its own keeps the light of the chapter before it
    if (found === 'dawn') {
      var keeps = $$('.interlude:not([data-hour])');
      for (var k = 0; k < keeps.length; k++) {
        var kr = keeps[k].getBoundingClientRect();
        if (kr.top <= mid && kr.bottom > mid) { found = scrollHour; break; }
      }
    }
    scrollHour = found;
  }

  // on the day index, resting on an hour lets you see its light before you get there
  $$('.day__hours [data-hour-hover]').forEach(function (a) {
    a.addEventListener('mouseenter', function () { hoverHour = a.getAttribute('data-hour-hover'); paintHour(); });
    a.addEventListener('mouseleave', function () { hoverHour = null; paintHour(); });
  });

  /* ── header ──────────────────────────────────────────────────────────── */
  var header = $('[data-header]');
  var film = $('[data-film]');
  var lastY = window.scrollY;

  function readHeader() {
    if (!header) return;
    var y = window.scrollY;
    var edge = film ? film.offsetHeight - header.offsetHeight - 8 : 24;
    header.classList.toggle('is-solid', y > edge);
    header.classList.toggle('is-hidden', y > edge + 200 && y > lastY + 4);
    if (y < lastY - 4 || y <= edge) header.classList.remove('is-hidden');
    lastY = y;
  }

  /* ── parallax: photographs drift a little slower than the page ────────── */
  var drifters = reduced ? [] : $$('[data-parallax], [data-parallax-x]');
  function readDrift() {
    var vh = window.innerHeight;
    for (var i = 0; i < drifters.length; i++) {
      var el = drifters[i];
      var r = el.parentNode.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      var off = (r.top + r.height / 2) - vh / 2;
      if (el.hasAttribute('data-parallax-x')) {
        el.style.transform = 'translate3d(' + (off * parseFloat(el.getAttribute('data-parallax-x'))).toFixed(1) + 'px,0,0)';
      } else {
        el.style.transform = 'translate3d(0,' + (off * parseFloat(el.getAttribute('data-parallax'))).toFixed(1) + 'px,0)';
      }
    }
  }

  /* ── the opening line lights up word by word as it is read ───────────── */
  var quote = $('[data-words]');
  var words = [];
  if (quote && !reduced) {
    var parts = quote.textContent.trim().split(/\s+/);
    quote.setAttribute('aria-label', parts.join(' '));
    quote.innerHTML = parts.map(function (w) { return '<span class="w" aria-hidden="true">' + w + '</span>'; }).join(' ');
    words = $$('.w', quote);
  }
  function readWords() {
    if (!words.length) return;
    var r = quote.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = (vh * 0.86 - r.top) / (r.height + vh * 0.36);
    var n = Math.round(Math.max(0, Math.min(1, p)) * words.length);
    for (var i = 0; i < words.length; i++) words[i].classList.toggle('is-lit', i < n);
  }

  /* ── the gate: the film plays inside the logo; scrolling walks through its disc ── */
  var gate = $('[data-gate]');
  var gateMedia = gate && $('[data-gate-media]', gate);
  var gateGhost = gate && $('[data-gate-ghost]', gate);
  // where the disc sits inside the mark, as fractions of the mark's width
  var DISC = { x: 0.45, y: 0.2, r: 0.2, ratio: 1564 / 1600 };
  if (gate && !reduced && window.CSS && CSS.supports && (CSS.supports('mask-size', '10px') || CSS.supports('-webkit-mask-size', '10px'))) {
    gate.classList.add('is-gated');
  } else { gate = null; }

  function readGate() {
    if (!gate) return;
    var vw = window.innerWidth, vh = window.innerHeight;
    var span = gate.offsetHeight - vh;
    var p = Math.max(0, Math.min(1, window.scrollY / (span * 0.86)));
    var g = gateGhost.getBoundingClientRect();
    var s0 = g.width;
    var far = Math.sqrt(vw * vw + vh * vh) / 2;
    var s1 = (far * 1.12) / DISC.r;
    var e = p * p * (3 - 2 * p);
    var s = s0 * Math.pow(s1 / s0, e);
    // the disc's centre travels from where it sits in the logo to the middle of the screen
    var stick = gate.firstElementChild.getBoundingClientRect();
    var ax0 = g.left + s0 * DISC.x, ay0 = (g.top - stick.top) + s0 * DISC.y;
    var ax = ax0 + (vw / 2 - ax0) * e, ay = ay0 + (vh / 2 - ay0) * e;
    gateMedia.style.setProperty('--gs', s.toFixed(1) + 'px');
    gateMedia.style.setProperty('--gx', (ax - s * DISC.x).toFixed(1) + 'px');
    gateMedia.style.setProperty('--gy', (ay - s * DISC.y).toFixed(1) + 'px');
    gate.style.setProperty('--gate-out', Math.max(0, 1 - p * 3.2).toFixed(3));
    gate.style.setProperty('--gate-in', Math.max(0, Math.min(1, (p - 0.74) / 0.22)).toFixed(3));
    var img = p >= 1 ? 'none' : 'url("' + gateMedia.getAttribute('data-gate-src') + '")';
    if (gateMedia.getAttribute('data-mask') !== img) {
      gateMedia.setAttribute('data-mask', img);
      gateMedia.style.webkitMaskImage = img; gateMedia.style.maskImage = img;
    }
    gate.classList.toggle('is-open', p >= 1);
    if (header) {
      header.classList.toggle('is-gate', p < 0.5);
      header.classList.toggle('is-over-film', p > 0.62);
    }
  }

  /* ── the sun: it crosses the bottom of the screen as the hours pass ─────── */
  var sunline = $('[data-sunline]');
  var chapters = $$('[data-minutes]');
  var NAMES = { veyil: ['Veyil', 'வெயில்'], nizhal: ['Nizhal', 'நிழல்'], maalai: ['Maalai', 'மாலை'], vizha: ['Vizha', 'விழா'] };
  var DAWN = 360, NIGHT = 1350;

  function readSun() {
    if (!sunline || !chapters.length) return;
    var vh = window.innerHeight, mid = vh / 2;
    var first = chapters[0].getBoundingClientRect();
    var last = chapters[chapters.length - 1].getBoundingClientRect();
    var on = first.top < vh * 0.7 && last.bottom > vh * 0.5;
    sunline.classList.toggle('is-on', on);
    if (!on) return;
    // each chapter's own time sits at its opening photograph; between them the clock runs on
    var pts = [{ y: first.top - vh * 0.3 - mid, m: DAWN }];
    chapters.forEach(function (c) {
      var r = c.getBoundingClientRect();
      pts.push({ y: r.top + Math.min(r.height, vh) * 0.5 - mid, m: Number(c.getAttribute('data-minutes')), key: c.getAttribute('data-hour') });
    });
    pts.push({ y: last.bottom - mid, m: NIGHT });
    var m = pts[pts.length - 1].m;
    for (var i = 0; i < pts.length - 1; i++) {
      if (pts[i + 1].y > 0) {
        var t = Math.max(0, Math.min(1, (0 - pts[i].y) / (pts[i + 1].y - pts[i].y)));
        m = pts[i].m + (pts[i + 1].m - pts[i].m) * t; break;
      }
    }
    m = Math.round(m);
    var h = Math.floor(m / 60), mm = m % 60;
    var x = (m - DAWN) / (NIGHT - DAWN);
    sunline.style.setProperty('--sun', x.toFixed(4));
    sunline.classList.toggle('is-late', x > 0.62);
    var name = NAMES[scrollHour] || ['', ''];
    $('[data-sun-time]', sunline).textContent = ((h + 11) % 12 + 1) + ':' + (mm < 10 ? '0' : '') + mm + (h < 12 ? ' am' : ' pm');
    $('[data-sun-name]', sunline).textContent = name[0];
    $('[data-sun-tamil]', sunline).textContent = name[1];
  }

  /* ── one scroll loop for all of it ───────────────────────────────────── */
  var ticking = false;
  function frame() {
    ticking = false;
    readHour(); paintHour(); readHeader(); readGate(); readDrift(); readWords(); readSun();
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  frame();

  /* ── reveal on arrival ───────────────────────────────────────────────── */
  var reveals = $$('.reveal, .unveil');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ── the film ────────────────────────────────────────────────────────── */
  if (film) {
    var video = $('video', film);
    var toggle = $('[data-film-toggle]', film);
    var marks = $$('[data-film-hour]', film);

    if (video) {
      video.muted = true;
      var play = video.play();
      if (play && play.catch) play.catch(function () {});
      if (reduced) { video.pause(); }

      var tick = function () {
        if (video.duration) {
          var p = (video.currentTime / video.duration) * marks.length;
          marks.forEach(function (m, i) {
            m.style.setProperty('--p', Math.max(0, Math.min(1, p - i)).toFixed(3));
            m.classList.toggle('is-now', Math.floor(p) === i);
          });
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);

      if (toggle) {
        var label = function () {
          toggle.textContent = video.paused ? 'Play film' : 'Pause film';
          toggle.setAttribute('aria-pressed', String(video.paused));
        };
        toggle.addEventListener('click', function () { if (video.paused) video.play(); else video.pause(); });
        video.addEventListener('play', label);
        video.addEventListener('pause', label);
        label();
      }
    } else if (toggle) {
      toggle.hidden = true;
    }
  }

  /* ── menu (small screens) ────────────────────────────────────────────── */
  var sheet = $('[data-menu]');
  if (sheet) {
    var openBtn = $('[data-menu-open]');
    var setMenu = function (open) {
      sheet.classList.toggle('is-open', open);
      sheet.setAttribute('aria-hidden', String(!open));
      if (openBtn) openBtn.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    if (openBtn) openBtn.addEventListener('click', function () { setMenu(true); });
    $$('[data-menu-close], a', sheet).forEach(function (el) { el.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* ── bag: add without leaving the page, shown in a drawer ────────────── */
  var drawer = $('[data-drawer]');
  var lastFocus = null;

  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { lastFocus = document.activeElement; var panel = $('.drawer__panel', drawer); if (panel) panel.focus(); }
    else if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function refreshDrawer() {
    return fetch(root + '?section_id=cart-drawer', { headers: { Accept: 'text/html' } })
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var next = new DOMParser().parseFromString(html, 'text/html').querySelector('[data-drawer]');
        if (next && drawer) { var open = drawer.classList.contains('is-open'); drawer.innerHTML = next.innerHTML; if (open) drawer.classList.add('is-open'); }
        return fetch(root + 'cart.js', { headers: { Accept: 'application/json' } });
      })
      .then(function (r) { return r.json(); })
      .then(function (cart) { $$('[data-cart-count]').forEach(function (el) { el.textContent = cart.item_count; }); });
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target : e.target.parentNode;
    if (!t || !t.closest) return;
    if (t.closest('[data-drawer-close]')) { e.preventDefault(); setDrawer(false); return; }
    var opener = t.closest('[data-cart-open]');
    if (opener && drawer && !document.body.classList.contains('template-cart')) { e.preventDefault(); setDrawer(true); return; }
    var qty = t.closest('[data-qty]');
    if (qty && drawer && drawer.contains(qty)) {
      e.preventDefault();
      var line = qty.closest('[data-line]');
      fetch(root + 'cart/change.js', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ line: Number(line.getAttribute('data-line')), quantity: Number(qty.getAttribute('data-qty')) })
      }).then(refreshDrawer).catch(function () { window.location.href = qty.href; });
    }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setDrawer(false); });

  $$('[data-product-form]').forEach(function (form) {
    var button = $('[data-add]', form);
    var idInput = $('[data-variant-id]', form);
    var priceEl = $('[data-price]');
    var variantsEl = $('[data-variants]', form);
    var variants = variantsEl ? JSON.parse(variantsEl.textContent) : null;

    function money(cents) {
      var fmt = (priceEl && priceEl.getAttribute('data-money')) || '{{amount}}';
      var whole = Math.round(cents / 100).toLocaleString('en-IN');
      var full = (cents / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return fmt.replace(/\{\{\s*amount_no_decimals[a-z_]*\s*\}\}/, whole).replace(/\{\{\s*amount[a-z_]*\s*\}\}/, cents % 100 === 0 ? whole : full);
    }

    if (variants) {
      form.addEventListener('change', function () {
        var chosen = $$('[data-option]:checked', form).sort(function (a, b) {
          return a.getAttribute('data-option') - b.getAttribute('data-option');
        }).map(function (i) { return i.value; });
        var v = variants.filter(function (x) { return x.options.join('|') === chosen.join('|'); })[0];
        if (!v) { button.disabled = true; button.textContent = 'Unavailable'; return; }
        idInput.value = v.id;
        button.disabled = !v.available;
        button.textContent = v.available ? 'Add to bag' : 'Sold out';
        if (priceEl) priceEl.textContent = money(v.price);
        var url = new URL(window.location.href); url.searchParams.set('variant', v.id);
        window.history.replaceState({}, '', url);
      });
    }

    form.addEventListener('submit', function (e) {
      if (!drawer || !window.fetch) return;
      e.preventDefault();
      var was = button.textContent;
      button.disabled = true; button.textContent = 'Adding…';
      fetch(root + 'cart/add.js', { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) })
        .then(function (r) { if (!r.ok) throw new Error('add failed'); return refreshDrawer(); })
        .then(function () { button.disabled = false; button.textContent = was; setDrawer(true); })
        .catch(function () { button.disabled = false; button.textContent = was; form.submit(); });
    });
  });
})();
