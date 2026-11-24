/* Bikes Zone Scooters - small helper script (no libraries needed) */
(function () {
  'use strict';

  /* ---- scroll progress bar + back-to-top + shrinking header ---- */
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);

  var topBtn = document.createElement('a');
  topBtn.href = '#';
  topBtn.className = 'to-top';
  topBtn.innerHTML = '&uarr;';
  topBtn.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(topBtn);
  topBtn.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  var header = document.querySelector('.header');
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    topBtn.classList.toggle('show', h.scrollTop > 500);
    if (header) header.classList.toggle('shrink', h.scrollTop > 80);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- scroll reveal: classes are added automatically ---- */
  var targets = document.querySelectorAll(
    '.title, .card, .product, .feature, .step, .strip .item, .plan, .tile, .info-card, .stat, .t-item, .faq details, .visit, .gallery-wrap, .calc, .form-wrap, .shop-feature'
  );
  var splitImgs = document.querySelectorAll('.split-img');
  var splitTexts = document.querySelectorAll('.split-text');

  targets.forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.transitionDelay = ((i % 4) * 0.1) + 's';
  });
  splitImgs.forEach(function (el) { el.classList.add('reveal', 'from-left'); });
  splitTexts.forEach(function (el) { el.classList.add('reveal', 'from-right'); });

  /* ---- animated counters: <div class="num" data-count="500" data-suffix="+"> ---- */
  function runCounter(el) {
    var end = parseInt(el.getAttribute('data-count'), 10) || 0;
    var dur = 1800, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.floor(end * (1 - Math.pow(1 - p, 3))).toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var all = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        en.target.querySelectorAll('[data-count]').forEach(runCounter);
        io.unobserve(en.target);
      });
    }, { threshold: 0.15 });
    all.forEach(function (el) { io.observe(el); });
  } else {
    all.forEach(function (el) {
      el.classList.add('in');
      el.querySelectorAll('[data-count]').forEach(runCounter);
    });
  }

  /* ---- installment calculator (installments.html) ---- */
  var calc = document.getElementById('calc');
  if (calc) {
    var price = document.getElementById('c-price');
    var down = document.getElementById('c-down');
    var months = document.getElementById('c-months');
    var fee = document.getElementById('c-fee');
    var out = document.getElementById('c-out');
    var update = function () {
      var p = parseFloat(price.value) || 0;
      var d = parseFloat(down.value) || 0;
      var m = parseInt(months.value, 10) || 12;
      var f = parseFloat(fee.value) || 0;
      var financed = Math.max(p - d, 0);
      var monthly = m > 0 ? (financed * (1 + f / 100)) / m : 0;
      out.textContent = 'EGP ' + Math.round(monthly).toLocaleString('en-US');
    };
    [price, down, months, fee].forEach(function (el) { el.addEventListener('input', update); });
    update();
  }

  /* ---- contact form: opens WhatsApp with the message ---- */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (id) { return (document.getElementById(id) || {}).value || ''; };
      var msg = 'Hello Bikes Zone Scooters!%0A' +
        'Name: ' + encodeURIComponent(v('f-name')) + '%0A' +
        'Phone: ' + encodeURIComponent(v('f-phone')) + '%0A' +
        'Topic: ' + encodeURIComponent(v('f-topic')) + '%0A' +
        'Message: ' + encodeURIComponent(v('f-msg'));
      /* TODO: replace 20XXXXXXXXXX with the real WhatsApp number */
      window.open('https://wa.me/20XXXXXXXXXX?text=' + msg, '_blank', 'noopener');
    });
  }
})();