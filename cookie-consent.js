/* Load optional analytics only after an affirmative choice. */
(function () {
  'use strict';
  var key = 'llt_cookie_consent';
  var choice;
  try { choice = localStorage.getItem(key); } catch (_) { /* Storage optional. */ }
  var loaded = false;
  function analytics() {
    window['ga-disable-G-HSR8VEQMJF'] = false;
    if (window.gtag) window.gtag('consent', 'update', { analytics_storage: 'granted' });
    if (loaded || /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', 'G-HSR8VEQMJF');
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-HSR8VEQMJF';
    document.head.appendChild(script);
  }
  var banner = document.createElement('section');
  banner.id = 'llt-cookie-banner';
  banner.setAttribute('aria-label', 'Cookie preferences');
  banner.innerHTML = '<p>May we use optional analytics cookies to understand how people use our website? <a href="privacy.html">Privacy policy</a></p><div class="llt-cookie-buttons"><button type="button" data-choice="declined">Essential only</button><button type="button" data-choice="accepted">Allow analytics</button></div>';
  banner.hidden = choice === 'accepted' || choice === 'declined';
  document.body.appendChild(banner);
  var settings;
  banner.querySelectorAll('button').forEach(function (button) {
    button.addEventListener('click', function () {
      choice = button.dataset.choice;
      try { localStorage.setItem(key, choice); } catch (_) { /* Keep working. */ }
      banner.hidden = true;
      if (choice === 'accepted') analytics();
      else {
        window['ga-disable-G-HSR8VEQMJF'] = true;
        if (window.gtag) window.gtag('consent', 'update', { analytics_storage: 'denied' });
        document.cookie.split(';').forEach(function (cookie) {
          var name = cookie.split('=')[0].trim();
          if (!name.startsWith('_ga')) return;
          ['', location.hostname, '.' + location.hostname, '.lovelettertales.com'].forEach(function (domain) { document.cookie = name + '=; Max-Age=0; path=/' + (domain ? '; domain=' + domain : ''); });
        });
      }
      if (settings) settings.focus({ preventScroll: true });
    });
  });
  var footer = document.querySelector('.footer-bottom') || document.querySelector('footer');
  if (footer) {
    settings = document.createElement('button'); settings.type = 'button'; settings.className = 'cookie-settings'; settings.textContent = 'Cookie settings';
    settings.addEventListener('click', function () { banner.hidden = false; banner.querySelector('button').focus(); });
    footer.appendChild(settings);
  }
  if (choice === 'accepted') analytics();
})();
