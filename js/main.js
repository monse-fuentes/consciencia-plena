(function () {
  'use strict';

  /* ---------- Menú móvil ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('menu');

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
  }
  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('open', open);
  });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('open')) { closeMenu(); toggle.focus(); }
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Contacto (solo con datos reales de config.js) ---------- */
  var cfg = window.SITE_CONFIG || {};
  var container = document.getElementById('contact-links');
  var NS = 'http://www.w3.org/2000/svg';
  var ICONS = {
    email: [['rect', { x: 3, y: 5, width: 18, height: 14, rx: 2.5 }], ['path', { d: 'M4 7.5l8 6 8-6' }]],
    phone: [['path', { d: 'M6.6 3.5h2.7l1.4 3.8-1.8 1.3a11 11 0 0 0 5.5 5.5l1.3-1.8 3.8 1.4v2.7a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z' }]],
    whatsapp: [['path', { d: 'M4 20l1.2-4A8 8 0 1 1 8 18.8L4 20z' }], ['path', { d: 'M9.2 9.2c.3 2.6 2.4 4.6 5 5l1.2-1.2-1.8-1-.8.7a3.6 3.6 0 0 1-1.7-1.7l.7-.8-1-1.8-1.6.8z' }]]
  };

  function icon(kind) {
    var wrap = document.createElement('span');
    wrap.className = 'icon';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    ICONS[kind].forEach(function (item) {
      var el = document.createElementNS(NS, item[0]);
      Object.keys(item[1]).forEach(function (k) { el.setAttribute(k, item[1][k]); });
      svg.appendChild(el);
    });
    wrap.appendChild(svg);
    return wrap;
  }

  function contact(kind, label, value, href) {
    var a = document.createElement('a');
    a.className = 'contact-link';
    a.href = href;
    if (kind === 'whatsapp' || kind === 'email') { a.target = '_blank'; a.rel = 'noopener'; }
    var text = document.createElement('span');
    var title = document.createElement('strong');
    title.textContent = label;
    var detail = document.createElement('span');
    detail.className = 'detail';
    detail.textContent = value;
    text.append(title, detail);
    a.append(icon(kind), text);
    container.append(a);
  }

  if (cfg.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cfg.email))
{
    contact('email', 'Escríbenos por correo', cfg.email,
      'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(cfg.email) +
      '&su=' + encodeURIComponent('Información sobre consultas virtuales'));
    var alt = document.createElement('p');
    alt.className = 'mail-alt';
    var altLink = document.createElement('a');
    altLink.href = 'mailto:' + cfg.email;
    altLink.textContent = 'Abrir en mi app de correo';
    alt.append(altLink);
    container.append(alt);
  }
  if (cfg.phone && /^\+?[\d\s()-]{8,}$/.test(cfg.phone))
    contact('phone', 'Teléfono', cfg.phone, 'tel:' + cfg.phone.replace(/[^+\d]/g, ''));
  if (cfg.whatsapp && /^\d{10,15}$/.test(cfg.whatsapp))
    contact('whatsapp', 'WhatsApp', 'Solicitar información',
      'https://wa.me/' + cfg.whatsapp + '?text=' + encodeURIComponent('Hola, quisiera información sobre las consultas virtuales.'));

  if (container.children.length) document.getElementById('contact-pending').hidden = true;

  /* ---------- Datos de Sobre mí (se completan desde config.js) ---------- */
  document.querySelectorAll('.entry[data-key]').forEach(function (el) {
    var v = cfg[el.getAttribute('data-key')];
    if (!v) return;
    el.querySelector('.field').textContent = v;
    el.hidden = false;
    var card = el.closest('.card');
    card.classList.add('filled');
    var soon = card.querySelector('.soon');
    if (soon) soon.hidden = true;
  });

  /* ---------- Carrusel horizontal de Sobre mí ---------- */
  var track = document.getElementById('about-track');
  var bar = document.querySelector('.progress span');
  var arrows = document.querySelectorAll('.arrow');
  function update() {
    var max = track.scrollWidth - track.clientWidth;
    var pos = max > 0 ? track.scrollLeft / max : 0;
    var ratio = track.clientWidth / track.scrollWidth;
    bar.style.width = Math.max(ratio * 100, 12) + '%';
    bar.style.marginLeft = (pos * (100 - Math.max(ratio * 100, 12))) + '%';
    arrows[0].disabled = track.scrollLeft < 4;
    arrows[1].disabled = track.scrollLeft > max - 4;
  }
  arrows.forEach(function (b) {
    b.addEventListener('click', function () {
      var card = track.querySelector('.card');
      var behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      track.scrollBy({ left: Number(b.dataset.dir) * (card.offsetWidth + 20), behavior: behavior });
    });
  });
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();

  /* ---------- Enlace activo del menú según la sección visible ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        menu.querySelectorAll('a').forEach(function (a) {
          a.classList.toggle('active', a.hash === '#' + e.target.id);
        });
      });
    }, { rootMargin: '-15% 0px -60% 0px' });
    sections.forEach(function (s) { observer.observe(s); });
  }
})();
