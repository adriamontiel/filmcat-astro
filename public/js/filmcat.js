/* filmcat.js — vanilla JS interactivity for FILMCAT Astro
 * Covers: mobile nav, filter bar, modal (card click → quick-view)
 * All HTML injected via innerHTML uses sanitize() for XSS safety.
 * Uses astro:page-load for View Transitions compatibility.
 */
(function () {
  'use strict';

  const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';
  const TMDB_BIG = 'https://image.tmdb.org/t/p/w780';

  // ── SANITIZE (for innerHTML) ──
  function sanitize(str) {
    if (!str && str !== 0) return '';
    const el = document.createElement('div');
    el.textContent = String(str);
    return el.innerHTML;
  }
  function sanitizeUrl(url) {
    if (!url) return '#';
    const t = String(url).trim();
    return /^https?:\/\//i.test(t) ? t : '#';
  }

  // ── MODAL STATE (persists across navigations) ──
  let lastFocused = null;

  function posterPlaceholder(film) {
    const abbr = film.title
      .split(' ').filter(w => w.length > 2).map(w => w[0]).join('').toUpperCase().slice(0, 3);
    const re = /^#[0-9a-fA-F]{3,6}$/;
    const c1 = re.test(film.color1) ? film.color1 : '#111';
    const c2 = re.test(film.color2) ? film.color2 : '#222';
    return `<div class="poster-placeholder" style="background:linear-gradient(160deg,${c1} 0%,${c2} 100%)" aria-hidden="true">
      <svg viewBox="0 0 100 88" width="38" style="opacity:.25"><polygon points="50,0 100,88 0,88" fill="white"/></svg>
      <div class="abbr">${sanitize(abbr)}</div>
      <div class="pp-title">${sanitize(film.title)}</div>
    </div>`;
  }

  function openModal(film) {
    lastFocused = document.activeElement;

    const titleEl = document.getElementById('modalTitle');
    const synopsisEl = document.getElementById('modalSynopsis');
    if (titleEl)    titleEl.textContent    = film.title    || '';
    if (synopsisEl) synopsisEl.textContent = film.synopsis || '';

    const pi = document.getElementById('modalPosterImg');
    const posterWrap = pi?.closest('.modal-poster');
    if (pi) {
      if (film.posterPath) {
        pi.src = TMDB_IMG + film.posterPath;
        pi.alt = `Pòster de ${film.title}`;
      } else if (posterWrap) {
        posterWrap.innerHTML = posterPlaceholder(film);
      }
    }

    const bi = document.getElementById('modalBgImg');
    if (bi) {
      if (film.backdropPath) {
        bi.src = TMDB_BIG + film.backdropPath;
        bi.style.background = '';
      } else {
        bi.src = '';
        const re = /^#[0-9a-fA-F]{3,6}$/;
        const c1 = re.test(film.color1) ? film.color1 : '#111';
        const c2 = re.test(film.color2) ? film.color2 : '#222';
        bi.style.background = `linear-gradient(135deg,${c1},${c2})`;
      }
    }

    const tagsEl = document.getElementById('modalTags');
    if (tagsEl) {
      tagsEl.innerHTML = [film.version, film.genre, film.duration, String(film.year)]
        .filter(Boolean)
        .map(t => `<span class="tag">${sanitize(t)}</span>`)
        .join('');
    }

    const sg = document.getElementById('modalSessions');
    if (sg) {
      if (!film.sessions?.length) {
        sg.innerHTML = '<p class="status-msg" role="status">Properament — Sessions pendent de confirmar</p>';
      } else {
        sg.innerHTML = film.sessions.map(s => {
          const isVO = ['VO', 'VOSC', 'VOSE'].includes(s.lang);
          const mapsQ = encodeURIComponent(`${s.cinema}, ${s.city}`);
          const mapsLink = sanitizeUrl(`https://www.google.com/maps/search/?api=1&query=${mapsQ}`);
          const times = (s.times || []).map(t =>
            `<button class="session-time" aria-label="${sanitize(t)} a ${sanitize(s.cinema)}, versió ${sanitize(s.lang)}">
              ${sanitize(t)} <span class="session-time-lang" aria-hidden="true">${sanitize(s.lang)}</span>
            </button>`
          ).join('');
          return `<div class="session-cinema" role="listitem">
            <div class="session-cinema-header">
              <div>
                <div class="session-cinema-name-row">
                  <span class="session-cinema-name">${sanitize(s.cinema)}</span>
                  <a href="${mapsLink}" target="_blank" rel="noopener noreferrer"
                     class="session-maps-link" aria-label="Veure ${sanitize(s.cinema)} a Google Maps">Veure</a>
                </div>
                <div class="session-cinema-city">${sanitize(s.city)}</div>
              </div>
              <span class="badge ${isVO ? 'vo' : ''}">${sanitize(s.lang)}</span>
            </div>
            <div class="session-times" role="group" aria-label="Horaris a ${sanitize(s.cinema)}">${times}</div>
          </div>`;
        }).join('');
      }
    }

    const trailerDiv = document.getElementById('modalTrailer');
    if (trailerDiv) {
      trailerDiv.innerHTML = '';
      const key = film._trailerKey;
      if (key) {
        const safeUrl = sanitizeUrl(`https://www.youtube.com/watch?v=${key}`);
        trailerDiv.innerHTML = `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer"
          class="trailer-btn" aria-label="Veure el tràiler de ${sanitize(film.title)} a YouTube">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
          </svg>
          Veure tràiler
        </a>`;
      }
    }

    const bd = document.getElementById('modalBackdrop');
    if (bd) {
      bd.classList.add('open');
      bd.removeAttribute('aria-hidden');
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => document.getElementById('modal')?.focus());
    }
  }

  function closeModal() {
    const bd = document.getElementById('modalBackdrop');
    if (!bd) return;
    bd.classList.remove('open');
    bd.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocused?.focus();
  }

  function attachCarouselListeners(carousel) {
    if (!carousel) return;
    carousel.addEventListener('click', e => {
      const card = e.target.closest('[data-film]');
      if (!card || card.tagName === 'A') return;
      try { openModal(JSON.parse(card.dataset.film)); } catch (_) {}
    });
    carousel.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const card = e.target.closest('[data-film]');
      if (!card || card.tagName === 'A') return;
      e.preventDefault();
      try { openModal(JSON.parse(card.dataset.film)); } catch (_) {}
    });
  }

  // ── INIT — runs on every page load, including View Transitions navigations ──
  function init() {
    // Mobile nav
    const hamburger = document.getElementById('hamburgerBtn');
    const mobileNav = document.getElementById('mobile-nav');
    if (hamburger && mobileNav) {
      hamburger.addEventListener('click', () => {
        const expanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', String(!expanded));
        mobileNav.setAttribute('aria-hidden', String(expanded));
        mobileNav.classList.toggle('open', !expanded);
        document.body.style.overflow = expanded ? '' : 'hidden';
      });
      mobileNav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          hamburger.setAttribute('aria-expanded', 'false');
          mobileNav.setAttribute('aria-hidden', 'true');
          mobileNav.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    // Filter bar
    const filterBar = document.querySelector('.filter-bar');
    if (filterBar) {
      filterBar.addEventListener('click', e => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        const version = btn.dataset.filter || 'all';
        filterBar.querySelectorAll('.filter-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const cards = document.querySelectorAll('#mainCarousel .card');
        let visible = 0;
        cards.forEach(card => {
          const show = version === 'all' || card.dataset.version === version;
          card.style.display = show ? '' : 'none';
          if (show) visible++;
        });

        let msg = document.getElementById('filterEmptyMsg');
        if (!visible) {
          if (!msg) {
            msg = document.createElement('p');
            msg.id = 'filterEmptyMsg';
            msg.className = 'status-msg';
            msg.setAttribute('role', 'status');
            msg.textContent = 'Cap pel·lícula amb aquesta versió a la cartellera actual.';
            document.getElementById('mainCarousel')?.appendChild(msg);
          }
        } else {
          msg?.remove();
        }
      });
    }

    // Back link → history.back() si hi ha historial, fallback a href="/"
    const backLink = document.getElementById('backLink');
    if (backLink) {
      backLink.addEventListener('click', e => {
        if (history.length > 1) {
          e.preventDefault();
          history.back();
        }
      });
    }

    // Carousels
    attachCarouselListeners(document.getElementById('mainCarousel'));
    attachCarouselListeners(document.getElementById('upcomingCarousel'));

    // Modal close handlers
    document.getElementById('modalBackdrop')?.addEventListener('click', e => {
      if (e.target === document.getElementById('modalBackdrop')) closeModal();
    });
    document.getElementById('modalCloseBtn')?.addEventListener('click', closeModal);

    // Trap focus inside modal + Escape key
    document.getElementById('modal')?.addEventListener('keydown', e => {
      if (e.key === 'Escape') { closeModal(); return; }
      if (e.key !== 'Tab') return;
      const modal = document.getElementById('modal');
      const focusable = [...modal.querySelectorAll('button, a, [tabindex]:not([tabindex="-1"])')];
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    });
  }

  // astro:page-load fires on first load AND on every View Transitions navigation
  document.addEventListener('astro:page-load', init);

})();
