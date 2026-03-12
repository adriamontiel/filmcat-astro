/* filmcat.js — vanilla JS interactivity for FILMCAT Astro
 * Covers: mobile nav, filter bar, modal (card click → quick-view), search dialog
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

  // ── SEARCH STATE (persists across navigations) ──
  let _searchCache = null; // { films, cinemas } — cached after first fetch
  let _searchFetchPromise = null; // in-flight fetch promise
  let _searchGlobalKeyAttached = false; // prevent duplicate Cmd+K listeners

  // Replicates slug.ts slugify() for client-side cinema URL building
  function slugifyClient(str) {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Normalize text for matching (lowercase + strip diacritics)
  function normalizeQuery(str) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  // Fetch search index from /api/search-index.json (cached in memory)
  function fetchSearchData() {
    if (_searchCache) return Promise.resolve(_searchCache);
    if (_searchFetchPromise) return _searchFetchPromise;
    _searchFetchPromise = fetch('/api/search-index.json')
      .then((r) => r.json())
      .then((data) => {
        _searchCache = data;
        return data;
      })
      .catch(() => ({ films: [], cinemas: [] }));
    return _searchFetchPromise;
  }

  function filmResultHTML(film, idx) {
    const thumb = film.posterPath
      ? `<div class="search-result-thumb"><img src="https://image.tmdb.org/t/p/w92${sanitize(film.posterPath)}" alt="" loading="lazy" decoding="async"></div>`
      : `<div class="search-result-thumb" aria-hidden="true"><svg viewBox="0 0 100 88" width="16" height="14"><polygon points="50,0 100,88 0,88" fill="currentColor" opacity="0.25"/></svg></div>`;
    const badge = film.upcoming ? `<span class="search-result-badge">Pròximament</span>` : '';
    const meta =
      !film.upcoming && film.cinemaCount > 0
        ? `<span class="search-result-meta">${film.cinemaCount} ${film.cinemaCount === 1 ? 'cinema' : 'cinemes'}</span>`
        : '';
    return `<a href="/films/${sanitize(film.id)}" class="search-result" role="option" aria-selected="false" data-result-idx="${idx}" tabindex="-1">${thumb}<div class="search-result-info"><span class="search-result-title">${sanitize(film.title)}</span>${badge}${meta}</div></a>`;
  }

  function cinemaResultHTML(cinema, idx) {
    return `<a href="/cinemes/${sanitize(slugifyClient(cinema.name))}" class="search-result" role="option" aria-selected="false" data-result-idx="${idx}" tabindex="-1"><div class="search-result-cinema-icon" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div><div class="search-result-info"><span class="search-result-title">${sanitize(cinema.name)}</span><span class="search-result-meta">${sanitize(cinema.city)}</span></div></a>`;
  }

  function buildSearchHTML(query, data) {
    const films = data.films || [];
    const cinemas = data.cinemas || [];
    const q = normalizeQuery(query.trim());

    if (!q) {
      // Empty state: top 4 current films (sorted by cinemaCount desc)
      const top = films.filter((f) => !f.upcoming).slice(0, 4);
      if (!top.length) return '';
      return (
        '<div class="search-section-label">Pel·lícules destacades</div>' +
        top.map((f, i) => filmResultHTML(f, i)).join('')
      );
    }

    const matchFilms = films.filter((f) => normalizeQuery(f.title).includes(q)).slice(0, 4);
    const matchCinemas = cinemas
      .filter((c) => normalizeQuery(c.name).includes(q) || normalizeQuery(c.city).includes(q))
      .slice(0, 3);

    if (!matchFilms.length && !matchCinemas.length) {
      return `<div class="search-no-results">Cap resultat per «<strong>${sanitize(query.trim())}</strong>»</div>`;
    }

    let html = '';
    if (matchFilms.length) {
      html += '<div class="search-section-label">Pel·lícules</div>';
      html += matchFilms.map((f, i) => filmResultHTML(f, i)).join('');
    }
    if (matchFilms.length && matchCinemas.length) {
      html += '<div class="search-divider"></div>';
    }
    if (matchCinemas.length) {
      html += '<div class="search-section-label">Cinemes</div>';
      html += matchCinemas.map((c, i) => cinemaResultHTML(c, matchFilms.length + i)).join('');
    }
    return html;
  }

  // ── MODAL STATE (persists across navigations) ──
  let lastFocused = null;

  function posterPlaceholder(film) {
    const abbr = film.title
      .split(' ')
      .filter((w) => w.length > 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 3);
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
    if (titleEl) titleEl.textContent = film.title || '';
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
        .map((t) => `<span class="tag">${sanitize(t)}</span>`)
        .join('');
    }

    const sg = document.getElementById('modalSessions');
    if (sg) {
      if (!film.sessions?.length) {
        sg.innerHTML =
          '<p class="status-msg" role="status">Properament — Sessions pendent de confirmar</p>';
      } else {
        sg.innerHTML = film.sessions
          .map((s) => {
            const isVO = ['VO', 'VOSC', 'VOSE'].includes(s.lang);
            const mapsQ = encodeURIComponent(`${s.cinema}, ${s.city}`);
            const mapsLink = sanitizeUrl(
              `https://www.google.com/maps/search/?api=1&query=${mapsQ}`
            );
            const times = (s.times || [])
              .map(
                (t) =>
                  `<button class="session-time" aria-label="${sanitize(t)} a ${sanitize(s.cinema)}, versió ${sanitize(s.lang)}">
              ${sanitize(t)} <span class="session-time-lang" aria-hidden="true">${sanitize(s.lang)}</span>
            </button>`
              )
              .join('');
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
          })
          .join('');
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

  function attachCarouselListeners(carousel, getActiveProvince) {
    if (!carousel) return;
    carousel.addEventListener('click', (e) => {
      // Save scroll + province filter when navigating to a film page (cross-browser, incl. Safari)
      const link = e.target.closest('a[href^="/films/"]');
      if (link) {
        sessionStorage.setItem('filmcat_scroll', String(window.scrollY));
        sessionStorage.setItem('filmcat_province', getActiveProvince ? getActiveProvince() : 'all');
        return;
      }
      const card = e.target.closest('[data-film]');
      if (!card || card.tagName === 'A') return;
      try {
        openModal(JSON.parse(card.dataset.film));
      } catch (_) {}
    });
    carousel.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const card = e.target.closest('[data-film]');
      if (!card || card.tagName === 'A') return;
      e.preventDefault();
      try {
        openModal(JSON.parse(card.dataset.film));
      } catch (_) {}
    });
  }

  // ── FILTER STATE — module-level so it survives astro:page-load re-inits ──
  let activeProvince = 'all';
  let activeVersion = 'all';

  // ── INIT — runs on every page load, including View Transitions navigations ──
  function init() {
    // Restore scroll position when returning to home page (cross-browser, incl. Safari)
    // Skip if the URL has a hash — the browser/anchor scroll takes priority.
    const savedScroll = sessionStorage.getItem('filmcat_scroll');
    if (savedScroll !== null) {
      sessionStorage.removeItem('filmcat_scroll'); // always clear to avoid stale state
      if (document.getElementById('mainCarousel') && !window.location.hash) {
        requestAnimationFrame(() => window.scrollTo(0, parseInt(savedScroll, 10)));
      }
    }

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
      mobileNav.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', (e) => {
          hamburger.setAttribute('aria-expanded', 'false');
          mobileNav.setAttribute('aria-hidden', 'true');
          mobileNav.classList.remove('open');
          document.body.style.overflow = '';

          // Explicit hash scroll: needed when Astro intercepts /#hash links
          // and doesn't auto-scroll (e.g. /#cinemes from the homepage).
          const href = a.getAttribute('href') || '';
          const hashIdx = href.indexOf('#');
          if (hashIdx !== -1 && window.location.pathname === '/') {
            e.preventDefault();
            const target = document.getElementById(href.slice(hashIdx + 1));
            if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth' }));
          }
        });
      });
    }

    // ── FILTERS (province × version) ──
    // State lives at module level — don't re-declare here.

    function applyFilters(animate = true) {
      const cards = document.querySelectorAll('#mainCarousel .card');
      let visible = 0;
      cards.forEach((card) => {
        const provinces = (card.dataset.province || '').split(' ');
        const provinceOk = activeProvince === 'all' || provinces.includes(activeProvince);
        const versionOk = activeVersion === 'all' || card.dataset.version === activeVersion;
        const show = provinceOk && versionOk;
        if (show) {
          if (card.style.display === 'none') {
            card.style.display = '';
            if (animate) void card.offsetWidth; // force reflow so fade-in transition plays
          }
          card.style.opacity = '1';
          visible++;
        } else {
          // Always hide instantly — no fade-out animation.
          // Relying on transitionend to set display:none is fragile because
          // other CSS transitions on the card (hover transform, img scale)
          // can interfere. Instant hide is reliable and the correct UX:
          // filter results should appear immediately on click.
          card.style.opacity = '0';
          card.style.display = 'none';
        }
      });
      let msg = document.getElementById('filterEmptyMsg');
      if (!visible) {
        if (!msg) {
          msg = document.createElement('p');
          msg.id = 'filterEmptyMsg';
          msg.className = 'status-msg';
          msg.setAttribute('role', 'status');
          msg.textContent = 'Cap pel·lícula amb aquesta combinació de filtres.';
          document.getElementById('mainCarousel')?.appendChild(msg);
        }
      } else {
        msg?.remove();
      }
    }

    // Disable version buttons that have no films in the current province,
    // and reset the active version if it becomes unavailable.
    function syncVersionButtons() {
      const versionBar = document.querySelector('.filter-bar[data-filter-type="version"]');
      if (!versionBar) return;

      const available = new Set(['all']);
      document.querySelectorAll('#mainCarousel .card').forEach((card) => {
        const provinces = (card.dataset.province || '').split(' ');
        if (activeProvince === 'all' || provinces.includes(activeProvince)) {
          available.add(card.dataset.version || '');
        }
      });

      let mustReset = false;
      versionBar.querySelectorAll('.filter-btn').forEach((btn) => {
        const f = btn.dataset.filter || 'all';
        if (available.has(f)) {
          btn.removeAttribute('aria-disabled');
        } else {
          btn.setAttribute('aria-disabled', 'true');
          if (activeVersion === f) mustReset = true;
        }
      });

      if (mustReset) {
        activeVersion = 'all';
        versionBar.querySelectorAll('.filter-btn').forEach((b) => {
          const isAll = (b.dataset.filter || 'all') === 'all';
          b.setAttribute('aria-pressed', isAll ? 'true' : 'false');
        });
      }
    }

    // Restore province from sessionStorage if returning from a film detail page,
    // then clear it immediately so stale state never leaks into future re-inits.
    const savedProvince = sessionStorage.getItem('filmcat_province');
    if (savedProvince !== null) {
      sessionStorage.removeItem('filmcat_province');
      activeProvince = savedProvince; // may be 'all' — that's correct too
    }

    // Province filter bar
    const provinceBar = document.querySelector('.filter-bar[data-filter-type="province"]');
    if (provinceBar) {
      // Re-sync button UI with current module-level state
      // (Astro replaces the DOM on every navigation, resetting button classes)
      provinceBar.querySelectorAll('.filter-btn').forEach((b) => {
        const isActive = (b.dataset.provinceFilter || 'all') === activeProvince;
        b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
      provinceBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn || btn.getAttribute('aria-disabled') === 'true') return;
        activeProvince = btn.dataset.provinceFilter || 'all';
        provinceBar.querySelectorAll('.filter-btn').forEach((b) => {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        syncVersionButtons();
        applyFilters();
      });
    }

    // Version filter bar
    const versionBar = document.querySelector('.filter-bar[data-filter-type="version"]');
    if (versionBar) {
      // Re-sync button UI with current module-level state
      versionBar.querySelectorAll('.filter-btn').forEach((b) => {
        const isActive = (b.dataset.filter || 'all') === activeVersion;
        b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
      versionBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn || btn.getAttribute('aria-disabled') === 'true') return;
        activeVersion = btn.dataset.filter || 'all';
        versionBar.querySelectorAll('.filter-btn').forEach((b) => {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        applyFilters();
      });
    }

    // Apply persisted filter state to the freshly-swapped DOM (no animation)
    syncVersionButtons();
    if (activeProvince !== 'all' || activeVersion !== 'all') applyFilters(false);

    // Back link → history.back() si hi ha historial, fallback a href="/"
    const backLink = document.getElementById('backLink');
    if (backLink) {
      backLink.addEventListener('click', (e) => {
        if (history.length > 1) {
          e.preventDefault();
          history.back();
        }
      });
    }

    // Cinema province filter (independent from the film filters)
    const cinemaProvinceBar = document.querySelector(
      '.filter-bar[data-filter-type="cinema-province"]'
    );
    if (cinemaProvinceBar) {
      cinemaProvinceBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        const selected = btn.dataset.cinemaProvinceFilter || 'all';
        cinemaProvinceBar.querySelectorAll('.filter-btn').forEach((b) => {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        document.querySelectorAll('[data-cinema-province]').forEach((card) => {
          const show = selected === 'all' || card.dataset.cinemaProvince === selected;
          // Hide/show instantly (same approach as film cards).
          // transitionend is unreliable here because .cinema-card only
          // transitions transform + border-color, not opacity.
          card.hidden = !show;
        });
      });
    }

    // Carousels
    attachCarouselListeners(document.getElementById('mainCarousel'), () => activeProvince);
    attachCarouselListeners(document.getElementById('upcomingCarousel'), () => activeProvince);

    // Modal close handlers
    document.getElementById('modalBackdrop')?.addEventListener('click', (e) => {
      if (e.target === document.getElementById('modalBackdrop')) closeModal();
    });
    document.getElementById('modalCloseBtn')?.addEventListener('click', closeModal);

    // Trap focus inside modal + Escape key
    document.getElementById('modal')?.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
        return;
      }
      if (e.key !== 'Tab') return;
      const modal = document.getElementById('modal');
      const focusable = [...modal.querySelectorAll('button, a, [tabindex]:not([tabindex="-1"])')];
      const first = focusable[0],
        last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    });

    // ── SEARCH ──
    const searchDialog = document.getElementById('searchDialog');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchBtn = document.getElementById('searchBtn');
    const searchCloseBtn = document.getElementById('searchCloseBtn');
    let searchActiveIdx = -1;

    function setSearchActive(idx) {
      const items = searchResults?.querySelectorAll('.search-result') || [];
      items.forEach((el) => el.setAttribute('aria-selected', 'false'));
      searchActiveIdx = Math.max(-1, Math.min(items.length - 1, idx));
      if (searchActiveIdx >= 0) {
        const active = items[searchActiveIdx];
        active?.setAttribute('aria-selected', 'true');
        active?.scrollIntoView({ block: 'nearest' });
      }
    }

    function openSearch() {
      if (!searchDialog) return;
      searchDialog.showModal();
      searchInput?.focus();
      // Pre-warm data + show empty state (top films)
      fetchSearchData().then((data) => {
        if (searchDialog.open && !searchInput?.value) {
          if (searchResults) searchResults.innerHTML = buildSearchHTML('', data);
        }
      });
    }

    function closeSearch() {
      if (!searchDialog?.open) return;
      searchDialog.close();
      searchActiveIdx = -1;
      if (searchInput) searchInput.value = '';
      if (searchResults) searchResults.innerHTML = '';
      searchBtn?.focus();
    }

    // Search button
    searchBtn?.addEventListener('click', openSearch);

    // ESC button inside dialog
    searchCloseBtn?.addEventListener('click', closeSearch);

    if (searchDialog) {
      // Click on ::backdrop (e.target === dialog itself)
      searchDialog.addEventListener('click', (e) => {
        if (e.target === searchDialog) closeSearch();
      });
      // Native dialog cancel (ESC key) — clean up state
      searchDialog.addEventListener('close', () => {
        searchActiveIdx = -1;
        if (searchInput) searchInput.value = '';
        if (searchResults) searchResults.innerHTML = '';
        searchBtn?.focus();
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const q = searchInput.value;
        searchActiveIdx = -1;
        if (_searchCache) {
          // Data already loaded — instant search, no loading indicator
          if (searchResults) searchResults.innerHTML = buildSearchHTML(q, _searchCache);
        } else {
          // Still fetching — show animated loading indicator
          if (searchResults)
            searchResults.innerHTML =
              '<div class="search-loading">Buscant<span class="search-dots" aria-hidden="true"><span>.</span><span>.</span><span>.</span></span></div>';
          fetchSearchData().then((data) => {
            // Only update if the query hasn't changed while we were loading
            if (searchInput.value === q && searchResults)
              searchResults.innerHTML = buildSearchHTML(q, data);
          });
        }
      });

      searchInput.addEventListener('keydown', (e) => {
        const items = searchResults?.querySelectorAll('.search-result') || [];
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSearchActive(searchActiveIdx + 1);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (searchActiveIdx <= 0) {
            setSearchActive(-1);
            searchInput.focus();
          } else {
            setSearchActive(searchActiveIdx - 1);
          }
        } else if (e.key === 'Enter' && searchActiveIdx >= 0) {
          e.preventDefault();
          const active = items[searchActiveIdx];
          if (active) {
            active.click();
            closeSearch();
          }
        }
      });
    }

    // Cmd+K / Ctrl+K — attach only once (persists in the IIFE closure)
    if (!_searchGlobalKeyAttached) {
      _searchGlobalKeyAttached = true;
      document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          const dlg = document.getElementById('searchDialog');
          if (dlg?.open) {
            closeSearch();
          } else {
            openSearch();
          }
        }
      });
    }
  }

  // astro:page-load fires on first load AND on every View Transitions navigation
  document.addEventListener('astro:page-load', init);
})();
