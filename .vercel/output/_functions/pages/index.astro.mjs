import {
  e as createAstro,
  f as createComponent,
  m as maybeRenderHead,
  r as renderTemplate,
  h as addAttribute,
  k as renderComponent,
  u as unescapeHTML,
  n as Fragment,
} from '../chunks/astro/server_BYSDsKQF.mjs';
import 'piccolore';
import {
  c as cityToProvince,
  C as CINEMA_URLS,
  P as PROVINCE_ORDER,
  $ as $$Base,
  a as $$Footer,
  b as $$Header,
} from '../chunks/provinces_BArfpejy.mjs';
import 'clsx';
import { T as TMDB_IMG, f as fetchTMDBPoster } from '../chunks/tmdb_DX24Wr-G.mjs';
import { s as slugify } from '../chunks/slug_Ds8KCdkD.mjs';
import { f as fetchFilms, a as fetchCinemas } from '../chunks/filmcat_DweQ5djV.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$3 = createAstro('https://filmcat.cat');
const $$Hero = createComponent(
  ($$result, $$props, $$slots) => {
    const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
    Astro2.self = $$Hero;
    const { filmCount, cinemaCount, sessionCount } = Astro2.props;
    return renderTemplate`${maybeRenderHead()}<section class="hero" aria-labelledby="hero-heading"> <div class="hero-bg" aria-hidden="true"></div> <div class="hero-grid" aria-hidden="true"></div> <div class="hero-content fade-up" style="animation-delay:.15s"> <p class="hero-eyebrow" aria-hidden="true">Cinema en català</p> <h1 id="hero-heading">DESCOBREIX<br>EL CINEMA<br>EN <em>CATALÀ</em></h1> <p class="hero-sub">Totes les pel·lícules en català als cinemes de Catalunya. Horaris, sessions i cinemes actualitzats cada dijous.</p> <div class="hero-stats" role="region" aria-label="Estadístiques"> <div class="stat"> <span class="stat-num">${filmCount}</span> <span class="stat-label">Pel·lícules</span> </div> <div class="stat"> <span class="stat-num">${cinemaCount}</span> <span class="stat-label">Cinemes</span> </div> <div class="stat"> <span class="stat-num">${sessionCount}</span> <span class="stat-label">Sessions</span> </div> </div> </div> </section>`;
  },
  '/Users/adriamontiel/Code/filmcat-astro/src/components/Hero.astro',
  void 0
);

const $$Astro$2 = createAstro('https://filmcat.cat');
const $$FilmCard = createComponent(
  ($$result, $$props, $$slots) => {
    const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
    Astro2.self = $$FilmCard;
    const { film } = Astro2.props;
    const sessionCount = film.sessions.reduce((a, s) => a + s.times.length, 0);
    const isUpcoming = film.sessions.length === 0;
    const slug = slugify(film.title);
    const href = `/films/${slug}`;
    const posterSrc = film.posterPath ? `${TMDB_IMG}${film.posterPath}` : null;
    const abbr = film.title
      .split(' ')
      .filter((w) => w.length > 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 3);
    const isVO = ['VO', 'VOSC', 'VOSE'].includes(film.version);
    const genreFirst = film.genre ? film.genre.split(' \xB7 ')[0] : '';
    const filmProvinces =
      film.sessions.length > 0
        ? [...new Set(film.sessions.map((s) => cityToProvince(s.city)))].join(' ')
        : 'Barcelona';
    const colorRe = /^#[0-9a-fA-F]{3,6}$/;
    const c1 = colorRe.test(film.color1) ? film.color1 : '#111';
    const c2 = colorRe.test(film.color2) ? film.color2 : '#222';
    const filmJson = JSON.stringify({
      id: film.id,
      title: film.title,
      titleOriginal: film.titleOriginal,
      director: film.director,
      synopsis: film.synopsis,
      version: film.version,
      year: film.year,
      genre: film.genre,
      duration: film.duration,
      color1: film.color1,
      color2: film.color2,
      posterPath: film.posterPath,
      backdropPath: film.backdropPath,
      _tmdbId: film._tmdbId ?? null,
      _trailerKey: film._trailerKey ?? null,
      sessions: film.sessions,
    });
    return renderTemplate`${maybeRenderHead()}<a class="card"${addAttribute(href, 'href')} role="listitem"${addAttribute(film.version, 'data-version')}${addAttribute(filmProvinces, 'data-province')}${addAttribute(filmJson, 'data-film')}${addAttribute(`${film.title} (${film.year}), versi\xF3 ${film.version}${!isUpcoming ? `, ${sessionCount} sessions avui` : ', pr\xF2ximament'}`, 'aria-label')}> <div class="card-img-wrap"> ${posterSrc ? renderTemplate`<img${addAttribute(posterSrc, 'src')}${addAttribute(`P\xF2ster oficial de ${film.title}`, 'alt')} loading="lazy" decoding="async" width="215" height="322">` : renderTemplate`<div class="poster-placeholder"${addAttribute(`background:linear-gradient(160deg,${c1} 0%,${c2} 100%)`, 'style')} aria-hidden="true"> <svg viewBox="0 0 100 88" width="38" style="opacity:.25"> <polygon points="50,0 100,88 0,88" fill="white"></polygon> </svg> <div class="abbr">${abbr}</div> <div class="pp-title">${film.title}</div> </div>`} <div class="card-overlay" aria-hidden="true"> <div class="card-overlay-title">${film.title}</div> <div class="card-overlay-sessions"> ${!isUpcoming ? `${sessionCount} sessions avui` : 'Pr\xF2ximament'} </div> </div> </div> <div class="card-info"> <div class="card-title">${film.title}</div> <div class="card-meta"> <span${addAttribute(`badge${isVO ? ' vo' : ''}`, 'class')}>${film.version}</span> <span>${genreFirst}</span> </div> </div> </a>`;
  },
  '/Users/adriamontiel/Code/filmcat-astro/src/components/FilmCard.astro',
  void 0
);

function sanitizeUrl(url) {
  if (!url) return '#';
  const trimmed = String(url).trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return '#';
}

const $$Astro$1 = createAstro('https://filmcat.cat');
const $$CinemaCard = createComponent(
  ($$result, $$props, $$slots) => {
    const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
    Astro2.self = $$CinemaCard;
    const { cinema, province } = Astro2.props;
    const mapsQuery = encodeURIComponent(`${cinema.name}, ${cinema.address}, ${cinema.city}`);
    const mapsUrl = sanitizeUrl(`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`);
    const filmCount = cinema.films ?? 0;
    const webUrl = CINEMA_URLS[cinema.name];
    return renderTemplate`${maybeRenderHead()}<article class="cinema-card" role="listitem"${addAttribute(`${cinema.name}, ${cinema.city}, ${filmCount} pel\xB7l\xEDcules en catal\xE0`, 'aria-label')}${addAttribute(province, 'data-cinema-province')}> <div class="session-cinema-name-row"> ${webUrl ? renderTemplate`<a${addAttribute(webUrl, 'href')} target="_blank" rel="noopener noreferrer" class="session-cinema-name session-cinema-name-link"${addAttribute(`Web oficial de ${cinema.name}`, 'aria-label')}>${cinema.name}</a>` : renderTemplate`<span class="session-cinema-name">${cinema.name}</span>`} </div> <div class="cinema-card-bottom"> <div class="session-cinema-city"> <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"> <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path> <circle cx="12" cy="10" r="3"></circle> </svg> ${cinema.city} </div> <a${addAttribute(mapsUrl, 'href')} target="_blank" rel="noopener noreferrer" class="session-maps-link"${addAttribute(`Com arribar a ${cinema.name}`, 'aria-label')}>Com arribar</a> <div class="cinema-films-count"${addAttribute(`${filmCount} pel\xB7l\xEDcules`, 'aria-label')}>${filmCount} pel·lícules</div> </div> </article>`;
  },
  '/Users/adriamontiel/Code/filmcat-astro/src/components/CinemaCard.astro',
  void 0
);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) =>
  __freeze(__defProp(cooked, 'raw', { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro('https://filmcat.cat');
const $$Index = createComponent(
  async ($$result, $$props, $$slots) => {
    const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
    Astro2.self = $$Index;
    const [{ films, comingSoon, isOffline }, cinemasFromApi] = await Promise.all([
      fetchFilms(),
      fetchCinemas(),
    ]);
    await Promise.allSettled(
      [...films, ...comingSoon].map(async (film) => {
        const result = await fetchTMDBPoster(film.searchTitle, film.year);
        if (result) {
          film.posterPath = result.posterPath;
          film.backdropPath = result.backdropPath;
          film._tmdbId = result.tmdbId;
        }
      })
    );
    const cinemaFilmCount = {};
    const cinemaCityMap = {};
    for (const film of films) {
      for (const session of film.sessions) {
        cinemaFilmCount[session.cinema] = (cinemaFilmCount[session.cinema] ?? 0) + 1;
        cinemaCityMap[session.cinema] = session.city;
      }
    }
    let cinemas;
    if (cinemasFromApi.length > 0) {
      cinemas = cinemasFromApi;
      for (const cinema of cinemas) {
        cinema.films = cinemaFilmCount[cinema.name] ?? 0;
      }
    } else {
      const seen = /* @__PURE__ */ new Set();
      cinemas = [];
      for (const film of films) {
        for (const session of film.sessions) {
          if (!seen.has(session.cinema)) {
            seen.add(session.cinema);
            cinemas.push({
              id: session.cinema,
              name: session.cinema,
              address: '',
              city: session.city,
              province: '',
              lat: null,
              lng: null,
              films: cinemaFilmCount[session.cinema] ?? 1,
            });
          }
        }
      }
      cinemas.sort((a, b) => (b.films ?? 0) - (a.films ?? 0));
    }
    const allProvinces = /* @__PURE__ */ new Set();
    for (const film of films) {
      for (const session of film.sessions) allProvinces.add(cityToProvince(session.city));
    }
    const availableProvinces = PROVINCE_ORDER.filter((p) => allProvinces.has(p));
    const cinemasByProvince = /* @__PURE__ */ new Map();
    for (const province of PROVINCE_ORDER) cinemasByProvince.set(province, []);
    for (const cinema of cinemas) {
      const province = cityToProvince(cinema.city);
      cinemasByProvince.get(province)?.push(cinema);
    }
    const cinemaProvinces = PROVINCE_ORDER.filter(
      (p) => (cinemasByProvince.get(p)?.length ?? 0) > 0
    );
    const sessionCount = films.reduce(
      (a, f) => a + f.sessions.reduce((b, s) => b + s.times.length, 0),
      0
    );
    Astro2.response.headers.set('Cache-Control', 's-maxage=604800, stale-while-revalidate=86400');
    const siteUrl = Astro2.site?.toString().replace(/\/$/, '') || 'https://filmcat.cat';
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Cartellera de Cinema en Catal\xE0',
      description: 'Totes les pel\xB7l\xEDcules en catal\xE0 als cinemes de Catalunya',
      numberOfItems: films.length,
      itemListElement: films.map((film, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Movie',
          name: film.title,
          url: `${siteUrl}/films/${slugify(film.title)}`,
          ...(film.posterPath
            ? { image: `https://image.tmdb.org/t/p/w500${film.posterPath}` }
            : {}),
          datePublished: String(film.year),
        },
      })),
    };
    const jsonLdStr = JSON.stringify(jsonLd).replace(/<\/script>/gi, '<\\/script>');
    return renderTemplate`${renderComponent(
      $$result,
      'Base',
      $$Base,
      {
        title: 'FILMCAT \u2014 Cinema en Catal\xE0',
        description:
          'Totes les pel\xB7l\xEDcules en catal\xE0 als cinemes de Catalunya. Horaris, sessions i cinemes actualitzats cada dijous.',
        canonical: `${siteUrl}/`,
      },
      {
        default: async ($$result2) =>
          renderTemplate(
            _a ||
              (_a = __template([
                ' ',
                ' ',
                ' ',
                '<main id="main-content"> <!-- \u2500\u2500 API ERROR BANNER \u2500\u2500 --> ',
                ' <!-- \u2500\u2500 CARTELLERA \u2500\u2500 --> <section aria-labelledby="cartellera-h" id="avui" style="padding-top: 32px"> <div class="section-header"> <h2 class="section-title" id="cartellera-h" style="scroll-margin-top: 80px">\nEn Cartellera\n</h2> </div> ',
                ' <div class="filter-bar" role="group" aria-label="Filtrar pel\xB7l\xEDcules per versi\xF3" data-filter-type="version"> <button class="filter-btn active" data-filter="all" aria-pressed="true">Totes</button> <button class="filter-btn" data-filter="VD" aria-pressed="false">Versi\xF3 Doblada (VD)</button> <button class="filter-btn" data-filter="VO" aria-pressed="false">Versi\xF3 Original (VO)</button> <button class="filter-btn" data-filter="VOSC" aria-pressed="false">Sub. Catal\xE0 (VOSC)</button> </div> <div class="carousel-wrap"> <div class="carousel" id="mainCarousel" role="list" aria-label="Pel\xB7l\xEDcules en cartellera"> ',
                ' </div> </div> </section> <!-- \u2500\u2500 PR\xD2XIMES ESTRENES \u2500\u2500 --> ',
                ' <!-- \u2500\u2500 CINEMES \u2500\u2500 --> <section aria-labelledby="cinemes-h" id="cinemes" style="margin-top: clamp(3rem, 8vw, 5rem)"> <div class="section-header"> <h2 class="section-title" id="cinemes-h">Cinemes</h2> </div> ',
                ' <div class="cinema-list" role="list"> ',
                ' </div> </section> </main>  <div class="modal-backdrop" id="modalBackdrop" role="dialog" aria-modal="true" aria-labelledby="modalTitle" aria-hidden="true"> <div class="modal" id="modal" tabindex="-1"> <button class="close-btn" id="modalCloseBtn" aria-label="Tancar">\u2715</button> <div class="modal-hero" aria-hidden="true"> <img class="modal-bg" id="modalBgImg" src="" alt="" role="presentation"> <div class="modal-hero-content"> <div class="modal-poster"><img id="modalPosterImg" src="" alt=""></div> <div> <h2 class="modal-title" id="modalTitle"></h2> <div class="modal-tags" id="modalTags"></div> </div> </div> </div> <div class="modal-body"> <p class="modal-synopsis" id="modalSynopsis"></p> <div id="modalTrailer"></div> <h3 class="modal-section-title">Sessions disponibles</h3> <div class="sessions-grid" id="modalSessions" role="list" aria-label="Sessions disponibles"></div> </div> </div> </div> ',
                '  <script type="application/ld+json">',
                '<\/script> ',
              ])),
            renderComponent($$result2, 'Header', $$Header, {}),
            renderComponent($$result2, 'Hero', $$Hero, {
              filmCount: films.length,
              cinemaCount: cinemas.length,
              sessionCount: sessionCount,
            }),
            maybeRenderHead(),
            isOffline &&
              renderTemplate`<div class="api-error-banner" role="alert"> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" flex-shrink="0"> <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path> ${renderComponent($$result2, 'Fragment', Fragment, {}, { default: async ($$result3) => renderTemplate` <line x1="12" y1="9" x2="12" y2="13"></line> <line x1="12" y1="17" x2="12.01" y2="17"></line> ` })} </svg> <span>
Les dades en temps real no estan disponibles. S'estan mostrant dades de mostra —
            torna-ho a intentar en uns minuts.
</span> </div>`,
            availableProvinces.length > 1 &&
              renderTemplate`<div class="filter-bar" role="group" aria-label="Filtrar pel·lícules per província" data-filter-type="province"> <button class="filter-btn active" data-province-filter="all" aria-pressed="true">
Totes
</button> ${availableProvinces.map((province) => renderTemplate`<button class="filter-btn"${addAttribute(province, 'data-province-filter')} aria-pressed="false"> ${province} </button>`)} </div>`,
            films.map(
              (film) =>
                renderTemplate`${renderComponent($$result2, 'FilmCard', $$FilmCard, { film: film })}`
            ),
            comingSoon.length > 0 &&
              renderTemplate`<section aria-labelledby="upcoming-h" style="margin-top: clamp(3rem, 8vw, 5rem)"> <div class="section-header"> <h2 class="section-title" id="upcoming-h">
Pròximes Estrenes
</h2> </div> <div class="carousel-wrap"> <div class="carousel" id="upcomingCarousel" role="list" aria-label="Pròximes estrenes en català"> ${comingSoon.map((film) => renderTemplate`${renderComponent($$result2, 'FilmCard', $$FilmCard, { film: film })}`)} </div> </div> </section>`,
            cinemaProvinces.length > 1 &&
              renderTemplate`<div class="filter-bar" role="group" aria-label="Filtrar cinemes per província" data-filter-type="cinema-province"> <button class="filter-btn active" data-cinema-province-filter="all" aria-pressed="true">
Tots
</button> ${cinemaProvinces.map((province) => renderTemplate`<button class="filter-btn"${addAttribute(province, 'data-cinema-province-filter')} aria-pressed="false"> ${province} </button>`)} </div>`,
            PROVINCE_ORDER.flatMap((p) =>
              (cinemasByProvince.get(p) ?? []).map(
                (cinema) =>
                  renderTemplate`${renderComponent($$result2, 'CinemaCard', $$CinemaCard, { cinema: cinema, province: p })}`
              )
            ),
            renderComponent($$result2, 'Footer', $$Footer, {
              filmCount: films.length,
              cinemaCount: cinemas.length,
              sessionCount: sessionCount,
            }),
            unescapeHTML(jsonLdStr)
          ),
      }
    )}`;
  },
  '/Users/adriamontiel/Code/filmcat-astro/src/pages/index.astro',
  void 0
);

const $$file = '/Users/adriamontiel/Code/filmcat-astro/src/pages/index.astro';
const $$url = '';

const _page = /*#__PURE__*/ Object.freeze(
  /*#__PURE__*/ Object.defineProperty(
    {
      __proto__: null,
      default: $$Index,
      file: $$file,
      url: $$url,
    },
    Symbol.toStringTag,
    { value: 'Module' }
  )
);

const page = () => _page;

export { page };
