/* Love Letter Tales — JavaScript */

(function () {
  'use strict';

  // ---- Mobile Navigation Toggle ----
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // ---- Navbar scroll shadow ----
  var navbar = document.getElementById('navbar');

  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // ---- Dismissible Promo Banner ----
  var promoBanner = document.getElementById('promoBanner');
  var bannerClose = document.getElementById('bannerClose');

  if (promoBanner && bannerClose) {
    // Check if already dismissed this session
    if (sessionStorage.getItem('promoBannerDismissed') === 'true') {
      promoBanner.classList.add('hidden');
    }

    bannerClose.addEventListener('click', function () {
      promoBanner.classList.add('hidden');
      sessionStorage.setItem('promoBannerDismissed', 'true');
    });
  }

  // ---- FAQ Accordion ----
  document.querySelectorAll('.faq-question').forEach(function (button) {
    button.addEventListener('click', function () {
      var item = this.closest('.faq-item');
      var isOpen = item.classList.contains('active');

      // Close all other items
      document.querySelectorAll('.faq-item').forEach(function (el) {
        el.classList.remove('active');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#stripe') return; // placeholder links
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
