/* Preview only — there is no Shopify behind this page, so "Add to bag"
   is acted out in the browser. None of this ships in the theme. */
(function () {
  var drawer = document.querySelector('[data-drawer]');
  var lines = [];
  function draw() {
    var body = drawer.querySelector('[data-drawer-body]');
    var total = lines.reduce(function (s, l) { return s + l.price; }, 0);
    body.innerHTML = lines.map(function (l) {
      return '<div class="cart__line"><img src="' + l.img + '" alt=""><div><h3>' + l.title + '</h3><p class="meta">' + l.type + '</p>' +
        '<div class="tools"><span>' + l.priceText + '</span></div></div></div>';
    }).join('');
    var foot = drawer.querySelector('.drawer__foot');
    if (!foot) { foot = document.createElement('div'); foot.className = 'drawer__foot'; drawer.querySelector('.drawer__panel').appendChild(foot); }
    foot.innerHTML = '<div class="row"><span>Subtotal</span><b>₹ ' + (total / 100).toLocaleString('en-IN') + '</b></div>' +
      '<small>Taxes and shipping are worked out at checkout.</small><a class="btn btn--full" href="cart.html">Checkout</a>';
    document.querySelectorAll('[data-cart-count]').forEach(function (el) { el.textContent = lines.length; });
  }
  document.querySelectorAll('[data-product-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault(); e.stopImmediatePropagation();
      var price = document.querySelector('[data-price]').textContent.trim();
      lines.push({
        title: document.querySelector('.product__title').textContent, type: (document.querySelector('.product__type') || {}).textContent || '',
        img: document.querySelector('.product__gallery img').getAttribute('src'), priceText: price, price: Number(price.replace(/[^0-9]/g, '')) * 100
      });
      draw(); drawer.classList.add('is-open'); drawer.setAttribute('aria-hidden', 'false');
    }, true);
  });
})();

/* forms have nowhere to post in a preview */
document.addEventListener('submit', function (e) {
  if (e.target.matches('[data-product-form]')) return;
  e.preventDefault();
  var b = e.target.querySelector('button[type="submit"]');
  if (b && e.target.classList.contains('letter__form')) b.textContent = 'Thank you';
}, true);
