/* Aisyah & Daniel — Wedding invitation interactions */
(function () {
  'use strict';

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => [...(c || document).querySelectorAll(s)];

  /* ── Cover open ── */
  const cover = $('#cover');
  const openBtn = $('#openBtn');
  if (openBtn && cover) {
    openBtn.addEventListener('click', () => {
      cover.classList.add('hidden');
      document.body.style.overflow = '';
      // Start music on first interaction (user gesture)
      const m = $('#bgMusic');
      if (m) m.play().catch(() => {});
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.IntersectionObserver) observeReveals();
    });
  }
  document.body.style.overflow = 'hidden';

  /* ── Music FAB ── */
  const fab = $('#musicFab');
  const music = $('#bgMusic');
  let musicOn = false;
  if (fab && music) {
    fab.addEventListener('click', () => {
      if (musicOn) { music.pause(); fab.classList.remove('playing'); }
      else { music.play().then(() => { fab.classList.add('playing'); }).catch(() => {}); }
      musicOn = !musicOn;
    });
    // Missing audio file → keep button functional but graceful
    music.addEventListener('error', () => { fab.classList.add('playing'); });
  }

  /* ── Nav scrolled state ── */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile nav ── */
  const burger = $('#navBurger');
  const navLinks = $('.nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', () => navLinks.classList.toggle('open'));
    $$('.nav-links a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  /* ── Reveal on scroll ── */
  function observeReveals() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach(el => io.observe(el));
  }

  /* ── Countdown ⚠️ EDIT THIS: set your actual wedding date here ── */
  const target = new Date('2027-03-14T10:00:00+08:00').getTime();
  const cdDays = $('#cdDays'), cdHours = $('#cdHours'), cdMins = $('#cdMins'), cdSecs = $('#cdSecs');
  function tick() {
    let diff = target - Date.now();
    if (diff < 0) diff = 0;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2, '0');
    if (cdDays) cdDays.textContent = pad(d);
    if (cdHours) cdHours.textContent = pad(h);
    if (cdMins) cdMins.textContent = pad(m);
    if (cdSecs) cdSecs.textContent = pad(s);
  }
  tick(); setInterval(tick, 1000);

  /* ── Save the date → .ics download ── */
  const saveBtn = $('#saveCalBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const ics = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//AisyahDaniel//Wedding//EN',
        'BEGIN:VEVENT',
        'UID:demo-nurul-hafiz-20270314',
        'DTSTART:20270314T100000', 'DTEND:20270314T170000',
        'SUMMARY:The Wedding of Aisyah & Daniel',
        'DESCRIPTION:Akad Nikah 10AM - 12PM | Majlis Resepsi 12PM - 5PM',
        'LOCATION:Cowie Bay Resort, Kota Kinabalu',
        'END:VEVENT', 'END:VCALENDAR'
      ].join('\r\n');
      const blob = new Blob([ics], { type: 'text/calendar' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'aisyah-daniel-wedding.ics';
      a.click();
      URL.revokeObjectURL(a.href);
      saveBtn.textContent = 'TARIKH DISIMPAN ✓';
      setTimeout(() => (saveBtn.textContent = 'SIMPAN TARIKH'), 3500);
    });
  }

  /* ── RSVP form (demo: opens WhatsApp) ── */
  const rsvpForm = $('#rsvpForm');
  const rsvpMsg = $('#rsvpMsg');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(rsvpForm);
      const name = fd.get('name'), guests = fd.get('guests'), attend = fd.get('attend');
      const msg = `RSVP Wedding Aisyah & Daniel%0A%0ANama: ${encodeURIComponent(name)}%0ABilangan: ${guests}%0AKehadiran: ${attend === 'yes' ? 'Hadir ✅' : 'Tidak dapat hadir ❌'}`;
      const wa = `https://wa.me/60123456789?text=${msg}`;
      window.open(wa, '_blank');
      if (rsvpMsg) rsvpMsg.textContent = 'Terima kasih! RSVP anda sedang dihantar melalui WhatsApp.';
    });
  }

  /* ── Wishes form ── */
  const wishForm = $('#wishForm');
  const wishList = $('#wishList');
  if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(wishForm);
      const name = fd.get('wisher') || 'Tamu';
      const wish = fd.get('wish');
      const card = document.createElement('div');
      card.className = 'wish-card';
      card.innerHTML = `<p class="wish-text"></p><p class="wish-author"></p>`;
      card.querySelector('.wish-text').textContent = wish;
      card.querySelector('.wish-author').textContent = '— ' + name;
      wishList.prepend(card);
      wishForm.reset();
    });
  }

  /* ── Copy gift numbers ── */
  $$('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.copy;
      const done = () => {
        const old = btn.textContent;
        btn.textContent = 'DISALIN ✓';
        setTimeout(() => (btn.textContent = old), 2200);
      };
      const fallback = () => {
        const ta = document.createElement('textarea');
        ta.value = val;
        ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
        done();
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(val).then(done).catch(fallback);
      } else fallback();
    });
  });

  /* ── Lightbox ── */
  const lb = $('#lightbox'), lbImg = $('#lbImg'), lbCaption = $('#lbCaption'), lbClose = $('#lbClose');
  $$('.g-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      lbImg.src = item.getAttribute('href');
      lbCaption.textContent = item.dataset.caption || '';
      lb.classList.add('open');
    });
  });
  function closeLb() { lb.classList.remove('open'); }
  if (lbClose) lbClose.addEventListener('click', closeLb);
  if (lb) lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLb(); });

  /* ── Reveal if cover already dismissed (e.g. no JS-first state) ── */
  if (!cover || cover.classList.contains('hidden')) observeReveals();
})();

/* Personalised guest name (?to=Encik%20Ali) — cover greets the guest by name. */
(function () {
  var params = new URLSearchParams(window.location.search);
  var to = params.get('to');
  var el = document.getElementById('guestName');
  if (to && el) el.textContent = decodeURIComponent(to).slice(0, 60);
})();
