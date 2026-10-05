/* Progressive enhancement; core content works without JavaScript. */
(function () {
  'use strict';
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  function closeMenu() {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') !== 'true';
      navToggle.classList.toggle('active', open);
      navLinks.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('a').forEach(function (link) { link.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navLinks.classList.contains('open')) { closeMenu(); navToggle.focus(); }
    });
  }
  var navbar = document.getElementById('navbar');
  if (navbar) window.addEventListener('scroll', function () { navbar.classList.toggle('scrolled', window.scrollY > 10); }, { passive: true });
  var promo = document.getElementById('promoBanner');
  var close = document.getElementById('bannerClose');
  if (promo && close) {
    try { if (sessionStorage.getItem('promoBannerDismissed') === 'true') promo.classList.add('hidden'); } catch (_) { /* Storage optional. */ }
    close.addEventListener('click', function () {
      promo.classList.add('hidden');
      try { sessionStorage.setItem('promoBannerDismissed', 'true'); } catch (_) { /* Still dismiss. */ }
    });
  }
  document.querySelectorAll('.faq-question').forEach(function (button, index) {
    var item = button.closest('.faq-item');
    var answer = item.querySelector('.faq-answer');
    if (!answer) return;
    answer.id = 'faq-answer-' + index;
    answer.hidden = !item.classList.contains('active');
    button.setAttribute('aria-controls', answer.id);
    button.setAttribute('aria-expanded', String(!answer.hidden));
    button.addEventListener('click', function () {
      var open = !item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(function (other) {
        other.classList.remove('active');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-answer').hidden = true;
      });
      item.classList.toggle('active', open);
      button.setAttribute('aria-expanded', String(open));
      answer.hidden = !open;
    });
  });
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: .05 });
    document.querySelectorAll('.fade-up').forEach(function (element) { element.classList.add('will-reveal'); observer.observe(element); });
  }
  var scene = document.getElementById('writing-scene');
  var replay = document.getElementById('replay-letter');
  if (scene && replay) {
    var replayTimer;
    function writeLetter() {
      clearTimeout(replayTimer);
      if (reducedMotion.matches) return;
      replay.hidden = true;
      scene.classList.remove('is-writing');
      void scene.offsetWidth;
      scene.classList.add('is-writing');
      replayTimer = setTimeout(function () { replay.hidden = reducedMotion.matches; }, 4900);
    }
    writeLetter();
    replay.addEventListener('click', writeLetter);
    reducedMotion.addEventListener('change', function () { clearTimeout(replayTimer); scene.classList.remove('is-writing'); replay.hidden = reducedMotion.matches; });
  }
  // Show success only after the endpoint acknowledges a submission.
  document.querySelectorAll('form[data-netlify], form[name="newsletter"], form[name="contact"], form[name="gift-redemption"], form[name="personalization"]').forEach(function (form) {
    var status = document.createElement('p');
    status.className = 'form-status';
    status.setAttribute('role', 'status');
    form.insertAdjacentElement('afterend', status);
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      var submit = form.querySelector('[type="submit"]');
      if (!form.reportValidity() || submit.disabled) return;
      submit.disabled = true;
      status.textContent = 'Sending…';
      try {
        var response = await fetch(form.getAttribute('action') || '/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() });
        if (!response.ok) throw new Error('Submission failed');
        window.location.assign('/form-received.html');
      } catch (_) {
        status.textContent = 'We could not send this just now. Please try again, or email hello@lovelettertales.com. Your details are still here.';
        submit.disabled = false;
      }
    });
  });
  var giftCode = document.getElementById('gift-code');
  if (giftCode) {
    var code = new URLSearchParams(window.location.search).get('code');
    if (code) giftCode.value = code.toUpperCase().slice(0, 20);
    giftCode.addEventListener('input', function () { this.value = this.value.toUpperCase(); });
  }
  var contactMessage = document.querySelector('#contactForm #message');
  if (contactMessage) {
    var params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'redeem') contactMessage.value = 'I would like to redeem my gift.\nGift code: ' + (params.get('code') || '').slice(0, 20) + '\nStory: ' + (params.get('story') || '').slice(0, 80) + '\n\nMy delivery address:\n';
  }
})();
