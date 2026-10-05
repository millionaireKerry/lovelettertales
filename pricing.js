/* All prices map to the existing Stripe links; no client-side payment amounts. */
(function () {
  'use strict';
  var plans = {
    uk: { monthly: ['12.99','28E00idAhgQ6dgw8gU1Nu03'], annual: ['119.99','4gM3cuao50R8foE2WA1Nu04'], gift3: ['34.99','7sY9AS8fX2Zgdgw9kY1Nu02'], gift6: ['64.99','eVqcN4gMtfM25O440E1Nu01'], gift12: ['109.99','bJedR8bs9gQ6dgwdBe1Nu00'] },
    intl: { monthly: ['17.99','4gM4gy7bTarI90g1Sw1Nu05'], annual: ['179.99','bJe6oGfIp57o4K07cQ1Nu06'], gift3: ['49.99','fZu00i7bT43kfoE1Sw1Nu07'], gift6: ['94.99','00wfZgbs97fwa4k40E1Nu08'], gift12: ['169.99','cNi4gybs9arIb8odBe1Nu09'] }
  };
  window.setDelivery = function (zone) {
    if (!plans[zone]) return;
    ['uk', 'intl'].forEach(function (value) {
      var button = document.getElementById('btn-' + value);
      if (button) { button.classList.toggle('active', value === zone); button.setAttribute('aria-pressed', String(value === zone)); }
    });
    Object.keys(plans[zone]).forEach(function (key) {
      var link = document.getElementById('link-' + key);
      var price = document.getElementById('price-' + key);
      if (link) link.href = 'https://buy.stripe.com/' + plans[zone][key][1];
      if (price) price.textContent = '£' + plans[zone][key][0];
    });
    var note = document.getElementById('intl-note');
    if (note) note.style.display = zone === 'intl' ? 'block' : 'none';
    try { sessionStorage.setItem('llt_delivery', zone); } catch (_) { /* Storage optional. */ }
  };
  var zone = 'uk';
  try { zone = sessionStorage.getItem('llt_delivery') || 'uk'; } catch (_) { /* Default UK. */ }
  window.setDelivery(zone);
})();
