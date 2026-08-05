/* ============================================================
   Biohackr Health, Shared UI
   Header / footer / cart drawer / product cards / toasts.
   Every page calls BHUI.init({ active: 'shop' }) after load.
   ============================================================ */

(function () {
  'use strict';
  const $ = (sel, el) => (el || document).querySelector(sel);
  const $$ = (sel, el) => Array.from((el || document).querySelectorAll(sel));

  const esc = s => String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  /* ---------------- icons (inline SVG, stroke = currentColor) ---------------- */
  const I = (paths, extra) => `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}${extra || ''}</svg>`;
  const ICONS = {
    iv: I('<path d="M17 6h14v6a7 7 0 0 1-14 0V6z"/><path d="M14 6h20"/><path d="M24 19v9"/><path d="M24 28c0 5 6 5 6 10v4"/><circle cx="30" cy="44" r="1.6" fill="currentColor" stroke="none"/><path d="M20 12.5v-3"/>'),
    shot: I('<path d="M30 8l10 10"/><path d="M33 11l4-4"/><path d="M14 34l-7 7"/><path d="M28 13l7 7-15 15-7-7 15-15z"/><path d="M20 21l3 3M25 16l3 3"/>'),
    nad: I('<path d="M24 5l7 4v8l-7 4-7-4V9l7-4z"/><path d="M24 21l7 4v8l-7 4-7-4v-8l7-4z" opacity=".55"/><path d="M31 13l8 4.5"/><path d="M17 13l-8 4.5"/><circle cx="24" cy="13" r="1.7" fill="currentColor" stroke="none"/>'),
    vial: I('<path d="M19 12h10"/><path d="M20 12v5l-5 14a6 6 0 0 0 5.7 8h6.6a6 6 0 0 0 5.7-8l-5-14v-5"/><path d="M17.5 27h13"/><path d="M19 8h10v4H19z"/>'),
    lab: I('<path d="M20 6v12L9 38a4 4 0 0 0 3.6 6h22.8a4 4 0 0 0 3.6-6L28 18V6"/><path d="M16 6h16"/><path d="M14.5 30h19"/><circle cx="22" cy="36" r="1.5" fill="currentColor" stroke="none"/><circle cx="28" cy="33" r="1.2" fill="currentColor" stroke="none"/>'),
    hair: I('<path d="M16 5c9 7-7 14 1 22 6 6-2 11 2 16"/><path d="M27 4c10 8-8 15 1 23 6 6-1 11 2 16" opacity=".85"/><path d="M37 6c8 7-6 12 1 19 5 5-1 9 1 13" opacity=".6"/>'),
    clipboard: I('<path d="M17 9h-3a3 3 0 0 0-3 3v29a3 3 0 0 0 3 3h20a3 3 0 0 0 3-3V12a3 3 0 0 0-3-3h-3"/><rect x="17" y="5" width="14" height="7" rx="2"/><path d="M16 22l3.5 3.5L26 19"/><path d="M30 23h7"/><path d="M16 33l3.5 3.5L26 30"/><path d="M30 34h7"/>'),
    dna: I('<path d="M16 5c0 12 16 14 16 26"/><path d="M32 5c0 12-16 14-16 26"/><path d="M16 43c0-6 4-9 8-12"/><path d="M32 43c0-6-4-9-8-12"/><path d="M17 10h14M17 38h14M19 16h10M19 32h10"/>'),
    scan: I('<path d="M8 14V8h6M34 8h6v6M40 34v6h-6M14 40H8v-6"/><circle cx="24" cy="17" r="4"/><path d="M16 36c0-6 3.5-9 8-9s8 3 8 9"/>'),
    peptide: I('<circle cx="11" cy="24" r="4"/><circle cx="24" cy="15" r="4"/><circle cx="24" cy="33" r="4"/><circle cx="37" cy="24" r="4"/><path d="M14.5 21.5l6-4M14.5 26.5l6 4M27.5 17.5l6 4M27.5 30.5l6-4"/>'),
    hormone: I('<path d="M24 6l9 5.2v10.4L24 26.8l-9-5.2V11.2L24 6z"/><path d="M24 26.8V38"/><path d="M17 42h14"/><path d="M24 38c-3 0-4 2-7 2M24 38c3 0 4 2 7 2"/>'),
    consult: I('<path d="M8 12a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H22l-8 8v-8h-2a4 4 0 0 1-4-4V12z"/><path d="M16 16h16M16 22h10"/>'),
    package: I('<path d="M8 16l16-8 16 8-16 8-16-8z"/><path d="M8 16v16l16 8V24"/><path d="M40 16v16l-16 8"/><path d="M16 12l16 8"/>'),
    wave: I('<path d="M6 24h6l4-10 6 20 5-16 4 6h11"/><circle cx="42" cy="24" r="1.8" fill="currentColor" stroke="none"/>'),
    pulse: I('<path d="M24 42S7 31 7 18.5C7 12 12 8 17 8c3.5 0 5.9 1.8 7 4 1.1-2.2 3.5-4 7-4 5 0 10 4 10 10.5C41 31 24 42 24 42z"/><path d="M13 24h6l3-6 4 10 3-6h6"/>'),
    mens: I('<circle cx="20" cy="28" r="11"/><path d="M28 20L40 8"/><path d="M30 8h10v10"/>'),
    womens: I('<circle cx="24" cy="18" r="11"/><path d="M24 29v13"/><path d="M17 36h14"/>'),
    member: I('<circle cx="24" cy="20" r="13"/><path d="M24 12l2.4 4.8 5.4.8-3.9 3.8.9 5.3-4.8-2.5-4.8 2.5.9-5.3-3.9-3.8 5.4-.8L24 12z" fill="currentColor" stroke="none"/><path d="M16 31l-3 12 11-5 11 5-3-12"/>'),
    sparkle: I('<path d="M24 8c1.5 8.5 4 11 12.5 12.5C28 22 25.5 24.5 24 33c-1.5-8.5-4-11-12.5-12.5C20 19 22.5 16.5 24 8z"/><path d="M37 30c.8 4.2 2 5.4 6 6-4 .6-5.2 1.8-6 6-.8-4.2-2-5.4-6-6 4-.6 5.2-1.8 6-6z" opacity=".6"/><path d="M11 34c.6 3 1.4 3.9 4.3 4.3-2.9.4-3.7 1.3-4.3 4.3-.6-3-1.4-3.9-4.3-4.3 2.9-.4 3.7-1.3 4.3-4.3z" opacity=".6"/>'),
    cart: I('<path d="M8 10h4l5 22h18l5-16H15"/><circle cx="19" cy="39" r="2.6"/><circle cx="33" cy="39" r="2.6"/>'),
    user: I('<circle cx="24" cy="16" r="8"/><path d="M9 41c1.5-8 7.5-12 15-12s13.5 4 15 12"/>'),
    search: I('<circle cx="21" cy="21" r="11"/><path d="M30 30l10 10"/>'),
    phone: I('<path d="M14 6h8l3 9-5 4a22 22 0 0 0 9 9l4-5 9 3v8a4 4 0 0 1-4 4C21 38 10 27 10 10a4 4 0 0 1 4-4z"/>'),
    pin: I('<path d="M24 42S10 30 10 19a14 14 0 0 1 28 0c0 11-14 23-14 23z"/><circle cx="24" cy="19" r="5"/>'),
    check: I('<path d="M9 25l10 10L39 13"/>'),
    shield: I('<path d="M24 5l15 5v12c0 10-6.5 17.5-15 21-8.5-3.5-15-11-15-21V10l15-5z"/><path d="M17 24l5 5 9-10"/>'),
    flask: I('<path d="M20 6v12L9 38a4 4 0 0 0 3.6 6h22.8a4 4 0 0 0 3.6-6L28 18V6"/><path d="M16 6h16"/>'),
    data: I('<path d="M8 40h32"/><path d="M12 40V24M22 40V14M32 40V20M42 40V10" stroke-width="3"/>'),
    arrow: I('<path d="M10 24h28M28 14l10 10-10 10"/>')
  };

  /* ---------------- header / footer ---------------- */
  /* One-page site: every nav target is a same-page anchor (#key). */
  const NAV = [
    ['signs', 'Warning Signs'],
    ['services', 'What We Do'],
    ['team', 'Our Team'],
    ['reviews', 'Reviews'],
    ['faq', 'FAQ']
  ];

  function headerHtml(active) {
    const links = NAV.map(([key, label]) =>
      `<a href="#${key}" class="${key === active ? 'active' : ''}">${label}</a>`).join('');
    return `
    <div class="announce"><p>Only 20 free longevity consults available each month, <a href="#claim">claim yours before they fill</a><span class="announce-sep">·</span><a href="tel:+16506707460" class="announce-tel">(650) 670-7460</a></p></div>
    <header class="hdr" id="hdr">
      <div class="wrap hdr-in">
        <button class="nav-burger" id="navBurger" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
        <a class="hdr-logo" href="#" aria-label="Biohackr Health home">
          <img src="assets/logo-horizontal.png" alt="Biohackr Health">
        </a>
        <nav class="hdr-nav" id="hdrNav" aria-label="Main">${links}</nav>
        <div class="hdr-actions">
          <a class="btn btn-red hdr-claim" href="#claim"><span class="hdr-claim-full">Claim Free Consult</span><span class="hdr-claim-short">Claim now</span></a>
        </div>
      </div>
    </header>`;
  }

  function footerHtml() {
    const year = new Date().getFullYear();
    return `
    <footer class="ftr">
      <div class="wrap ftr-grid">
        <div class="ftr-brand">
          <img src="assets/logo-horizontal-white.png" alt="Biohackr Health" class="ftr-logo">
          <p>Medical-grade longevity clinic. Physician-supervised treatments, comprehensive diagnostics, and personalized protocols in the Bay Area.</p>
        </div>
        <nav class="ftr-col" aria-label="Explore">
          <h4>Explore</h4>
          <a href="#signs">Warning signs</a>
          <a href="#team">Our physician team</a>
          <a href="#why">Why Biohackr Health</a>
          <a href="#claim">Claim a free consult</a>
        </nav>
        <div class="ftr-col">
          <h4>Visit</h4>
          <p><strong>San Francisco</strong><br><a class="addr-link" href="https://www.google.com/maps?q=Biohackr+Health+1877+Union+Street+San+Francisco+CA+94123" target="_blank" rel="noopener">1877 Union Street<br>San Francisco, CA 94123</a><br>Mon–Fri 10–6 · Sat 10–4</p>
          <p><strong>Palo Alto</strong><br><a class="addr-link" href="https://www.google.com/maps?q=Biohackr+Health+540+Bryant+Street+Palo+Alto+CA+94301" target="_blank" rel="noopener">540 Bryant Street<br>Palo Alto, CA 94301</a><br>Mon–Fri 10:30–6 · Sat 10–4</p>
        </div>
        <nav class="ftr-col" aria-label="Support">
          <h4>Support</h4>
          <a href="#services">What we do</a>
          <a href="#faq">FAQ</a>
          <a href="#reviews">Reviews</a>
          <a href="tel:+16506707460">(650) 670-7460</a>
        </nav>
      </div>
      <div class="wrap ftr-fine">
        <p>Treatments are administered in clinic by licensed professionals under physician supervision. Individual results vary. Statements on this site have not been evaluated by the Food and Drug Administration. Services are for general wellness support only and are not intended to diagnose, treat, cure, or prevent any disease.</p>
        <p>© ${year} Biohackr Health · San Francisco &amp; Palo Alto, CA · <a href="https://www.biohackr.health/privacy-policy">Privacy Policy</a></p>
      </div>
    </footer>`;
  }

  /* ---------------- toasts ---------------- */
  function toast(msg, kind) {
    const root = $('#toasts');
    if (!root) return;
    const el = document.createElement('div');
    el.className = 'toast' + (kind ? ' toast-' + kind : '');
    el.innerHTML = `<span class="toast-ic">${ICONS.check}</span><span>${esc(msg)}</span>`;
    root.appendChild(el);
    requestAnimationFrame(() => el.classList.add('in'));
    setTimeout(() => { el.classList.remove('in'); setTimeout(() => el.remove(), 350); }, 2600);
  }

  /* ---------------- reveal on scroll ---------------- */
  function reveals() {
    const els = $$('.reveal');
    if (!('IntersectionObserver' in window) || !els.length) {
      els.forEach(e => e.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(e => io.observe(e));
    // failsafe: anything already on screen must never stay hidden
    setTimeout(() => {
      els.forEach(e => {
        if (e.classList.contains('in')) return;
        const r = e.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) e.classList.add('in');
      });
    }, 1200);
  }

  /* ---------------- init ---------------- */
  function init(opts) {
    opts = opts || {};
    const h = $('#site-header'); if (h) h.innerHTML = headerHtml(opts.active);
    const f = $('#site-footer'); if (f) f.innerHTML = footerHtml();
    document.body.insertAdjacentHTML('beforeend', `<div class="toasts" id="toasts" aria-live="polite"></div>
      <button class="to-top" id="toTop" aria-label="Back to top" title="Back to top">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
      </button>`);

    /* logo click scrolls to top (one-page site) */
    const logoEl = $('.hdr-logo');
    if (logoEl) logoEl.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const toTop = $('#toTop');
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    const onTopScroll = () => toTop.classList.toggle('show', window.scrollY > 600);
    window.addEventListener('scroll', onTopScroll, { passive: true });
    onTopScroll();

    document.addEventListener('click', ev => {
      if (ev.target.closest('#navBurger')) {
        const nav = $('#hdrNav');
        const open = nav.classList.toggle('open');
        $('#navBurger').setAttribute('aria-expanded', open ? 'true' : 'false');
        $('#navBurger').classList.toggle('is-open', open);
      }
    });

    /* sticky header shadow */
    const hdr = $('#hdr');
    if (hdr) {
      const onScroll = () => hdr.classList.toggle('scrolled', window.scrollY > 8);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    reveals();
  }

  window.BHUI = { init, toast, icons: ICONS, esc, reveals };
})();
