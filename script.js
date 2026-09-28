// Header: solid background once the hero is scrolled past
const header = document.querySelector('.site-header');
const hero = document.querySelector('.hero');
const onScroll = () => {
  header.classList.toggle('is-solid', window.scrollY > hero.offsetHeight - 120);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu
const toggle = document.getElementById('navToggle');
const setMenu = (open) => {
  document.body.classList.toggle('nav-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
  document.body.style.overflow = open ? 'hidden' : '';
};
toggle.addEventListener('click', () => setMenu(!document.body.classList.contains('nav-open')));
document.querySelectorAll('.nav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// Reveal on scroll
const revealer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach((el) => revealer.observe(el));

// Highlight the nav link for the section in view
const links = [...document.querySelectorAll('.nav a')];
const spy = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    links.forEach((l) => l.classList.toggle('is-current', l.getAttribute('href') === '#' + entry.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));

// Count-up for the stats
const counter = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const end = Number(el.dataset.count);
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / 1400, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counter.unobserve(el);
  });
}, { threshold: 0.6 });
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('[data-count]').forEach((el) => counter.observe(el));
}

// Portfolio filter
const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.card');
filters.forEach((btn) => {
  btn.addEventListener('click', () => {
    filters.forEach((b) => b.classList.toggle('is-active', b === btn));
    const f = btn.dataset.filter;
    cards.forEach((c) => c.classList.toggle('is-hidden', f !== 'all' && c.dataset.cat !== f));
  });
});

// Contact form (front-end only: opens the visitor's email app with the enquiry)
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll('[required]').forEach((input) => {
    const valid = input.value.trim() !== '' && (input.type !== 'email' || /^\S+@\S+\.\S+$/.test(input.value));
    input.closest('.field').classList.toggle('has-error', !valid);
    if (!valid) ok = false;
  });
  if (!ok) {
    note.textContent = 'Lütfen adınızı, geçerli bir e-posta adresini ve kısa bir mesaj yazın.';
    return;
  }
  const d = new FormData(form);
  const subject = encodeURIComponent(`Yeni proje talebi: ${d.get('type')}`);
  const body = encodeURIComponent(`${d.get('message')}\n\n${d.get('name')}\n${d.get('email')}`);
  window.location.href = `mailto:merhaba@sukunstudio.com?subject=${subject}&body=${body}`;
  note.textContent = 'Teşekkürler! E-posta uygulamanız mesajınız hazır şekilde açılacak.';
  form.reset();
});

document.getElementById('year').textContent = new Date().getFullYear();
