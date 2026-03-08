import {
  e as createAstro,
  f as createComponent,
  k as renderComponent,
  r as renderTemplate,
  l as renderScript,
  u as unescapeHTML,
  h as addAttribute,
  m as maybeRenderHead,
} from '../../chunks/astro/server_BYSDsKQF.mjs';
import 'piccolore';
import {
  $ as $$Base,
  a as $$Footer,
  c as cityToProvince,
  C as CINEMA_URLS,
  b as $$Header,
} from '../../chunks/provinces_BArfpejy.mjs';
import { f as fetchFilms } from '../../chunks/filmcat_DweQ5djV.mjs';
import { f as fetchTMDBPoster } from '../../chunks/tmdb_DX24Wr-G.mjs';
import { s as slugify } from '../../chunks/slug_Ds8KCdkD.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) =>
  __freeze(__defProp(cooked, 'raw', { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro('https://filmcat.cat');
const $$id = createComponent(
  async ($$result, $$props, $$slots) => {
    const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
    Astro2.self = $$id;
    const { id } = Astro2.params;
    const { films, comingSoon } = await fetchFilms();
    const allFilms = [...films, ...comingSoon];
    const film = allFilms.find((f) => slugify(f.title) === id);
    if (!film) {
      return Astro2.redirect('/', 302);
    }
    const tmdb = await fetchTMDBPoster(film.searchTitle, film.year);
    if (tmdb) {
      film.posterPath = tmdb.posterPath;
      film.backdropPath = tmdb.backdropPath;
      film._tmdbId = tmdb.tmdbId;
    }
    const siteUrl = Astro2.site?.toString().replace(/\/$/, '') || 'https://filmcat.cat';
    const filmSlug = slugify(film.title);
    const canonicalUrl = `${siteUrl}/films/${filmSlug}`;
    const posterUrl = film.posterPath ? `https://image.tmdb.org/t/p/w500${film.posterPath}` : null;
    const backdropUrl = film.backdropPath
      ? `https://image.tmdb.org/t/p/w780${film.backdropPath}`
      : null;
    const description = film.synopsis
      ? film.synopsis.slice(0, 160).replace(/\s+\S*$/, '') + '\u2026'
      : `${film.title} \u2014 Cinema en Catal\xE0. Horaris i sessions a Catalunya.`;
    const isVO = ['VO', 'VOSC', 'VOSE'].includes(film.version);
    const versionLabel = {
      VD: 'Versi\xF3 Doblada',
      VO: 'Versi\xF3 Original',
      VOSC: 'Versi\xF3 Original Subtitulada en Catal\xE0',
      VOSE: 'Versi\xF3 Original Subtitulada en Espanyol',
    };
    const sessionCount = film.sessions.reduce((a, s) => a + s.times.length, 0);
    const totalFilmCount = films.length;
    const totalCinemaCount = new Set(films.flatMap((f) => f.sessions.map((s) => s.cinema))).size;
    const totalSessionCount = films.reduce(
      (a, f) => a + f.sessions.reduce((b, s) => b + s.times.length, 0),
      0
    );
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Movie',
      name: film.title,
      ...(film.titleOriginal && film.titleOriginal !== film.title
        ? { alternateName: film.titleOriginal }
        : {}),
      description: film.synopsis || '',
      datePublished: String(film.year),
      ...(film.director ? { director: { '@type': 'Person', name: film.director } } : {}),
      ...(posterUrl ? { image: posterUrl } : {}),
      url: canonicalUrl,
      inLanguage: 'ca',
      offers:
        film.sessions.length > 0
          ? {
              '@type': 'Offer',
              availability: 'https://schema.org/InStock',
              priceCurrency: 'EUR',
            }
          : void 0,
      ...(film._trailerKey
        ? {
            trailer: {
              '@type': 'VideoObject',
              name: `Tr\xE0iler de ${film.title}`,
              embedUrl: `https://www.youtube.com/embed/${film._trailerKey}`,
            },
          }
        : {}),
    };
    const jsonLdStr = JSON.stringify(jsonLd).replace(/<\/script>/gi, '<\\/script>');
    const breadcrumbLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Inici',
          item: siteUrl + '/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: film.title,
          item: canonicalUrl,
        },
      ],
    };
    const breadcrumbLdStr = JSON.stringify(breadcrumbLd).replace(/<\/script>/gi, '<\\/script>');
    const colorRe = /^#[0-9a-fA-F]{3,6}$/;
    const c1 = colorRe.test(film.color1) ? film.color1 : '#111';
    const c2 = colorRe.test(film.color2) ? film.color2 : '#222';
    const abbr = film.title
      .split(' ')
      .filter((w) => w.length > 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 3);
    function mapsUrl(cinema, city) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${cinema}, ${city}`)}`;
    }
    Astro2.response.headers.set('Cache-Control', 's-maxage=604800, stale-while-revalidate=86400');
    return renderTemplate`${renderComponent(
      $$result,
      'Base',
      $$Base,
      {
        title: `${film.title} \u2014 FILMCAT`,
        description: description,
        ogImage: posterUrl,
        canonical: canonicalUrl,
      },
      {
        default: async ($$result2) =>
          renderTemplate(
            _a ||
              (_a = __template([
                ' ',
                ' ',
                '<main id="main-content"> <div class="film-page"> <!-- \u2500\u2500 HERO \u2500\u2500 --> <div class="film-hero"> ',
                ' <div class="film-backdrop-gradient" aria-hidden="true"></div> <div class="film-hero-content"> <div class="film-poster"> ',
                ' </div> <div class="film-hero-info"> <h1 class="film-title">',
                '</h1> ',
                ' <div class="film-tags"> <span',
                '>',
                '</span> ',
                ' ',
                ' ',
                ' </div> </div> </div> </div> <!-- \u2500\u2500 BODY \u2500\u2500 --> <div class="film-body"> <a href="/" class="film-back-link" id="backLink" aria-label="Tornar a la cartellera">\n\u2190 Cartellera\n</a> <!-- Trailer --> ',
                ' <!-- Synopsis --> ',
                ' <!-- Version info --> ',
                ' <!-- Sessions --> <div> <h2 class="film-section-title"> ',
                ' </h2> ',
                ' </div> </div> </div> </main> ',
                '  <script type="application/ld+json">',
                '<\/script> <script type="application/ld+json">',
                '<\/script>  ',
                ' ',
              ])),
            renderComponent($$result2, 'Header', $$Header, {}),
            maybeRenderHead(),
            backdropUrl
              ? renderTemplate`<img class="film-backdrop-img"${addAttribute(backdropUrl, 'src')} alt="" aria-hidden="true" decoding="async">`
              : renderTemplate`<div class="film-backdrop-img"${addAttribute(`background:linear-gradient(135deg,${c1},${c2})`, 'style')} aria-hidden="true"></div>`,
            posterUrl
              ? renderTemplate`<img${addAttribute(posterUrl, 'src')}${addAttribute(`P\xF2ster oficial de ${film.title}`, 'alt')} width="120" height="180" decoding="async" loading="eager">`
              : renderTemplate`<div class="poster-placeholder"${addAttribute(`background:linear-gradient(160deg,${c1} 0%,${c2} 100%)`, 'style')} aria-hidden="true"> <svg viewBox="0 0 100 88" width="32" style="opacity:.25"> <polygon points="50,0 100,88 0,88" fill="white"></polygon> </svg> <div class="abbr" style="font-size:1rem"> ${abbr} </div> </div>`,
            film.title,
            film.titleOriginal &&
              film.titleOriginal !== film.title &&
              renderTemplate`<p class="film-original-title">${film.titleOriginal}</p>`,
            addAttribute(`badge${isVO ? ' vo' : ''}`, 'class'),
            film.version,
            film.genre && renderTemplate`<span class="tag">${film.genre.split(' \xB7 ')[0]}</span>`,
            film.year && renderTemplate`<span class="tag">${film.year}</span>`,
            film.director && renderTemplate`<span class="tag">${film.director}</span>`,
            film._trailerKey &&
              renderTemplate`<div> <a${addAttribute(`https://www.youtube.com/watch?v=${film._trailerKey}`, 'href')} target="_blank" rel="noopener noreferrer" class="trailer-btn"${addAttribute(`Veure el tr\xE0iler de ${film.title} a YouTube`, 'aria-label')}> <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"> <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"></path> </svg>
Veure tràiler
</a> </div>`,
            film.synopsis &&
              renderTemplate`<div> <h2 class="film-section-title">Sinopsi</h2> <p class="film-synopsis">${film.synopsis}</p> </div>`,
            versionLabel[film.version] &&
              renderTemplate`<div> <h2 class="film-section-title">Versió</h2> <p class="film-synopsis">${versionLabel[film.version]}</p> </div>`,
            film.sessions.length > 0
              ? `Sessions disponibles \u2014 ${sessionCount} horaris`
              : 'Sessions',
            film.sessions.length === 0
              ? renderTemplate`<p class="status-msg">Properament — Sessions pendent de confirmar</p>`
              : renderTemplate`<div class="sessions-grid" role="list" aria-label="Sessions disponibles"> ${film.sessions.map(
                  (session) => {
                    const isSessionVO = ['VO', 'VOSC', 'VOSE'].includes(session.lang);
                    return renderTemplate`<div class="session-cinema" role="listitem"${addAttribute(cityToProvince(session.city), 'data-province')}> <div class="session-cinema-header"> <div> <div class="session-cinema-name-row"> ${CINEMA_URLS[session.cinema] ? renderTemplate`<a${addAttribute(CINEMA_URLS[session.cinema], 'href')} target="_blank" rel="noopener noreferrer" class="session-cinema-name session-cinema-name-link"${addAttribute(`Web oficial de ${session.cinema}`, 'aria-label')}> ${session.cinema} </a>` : renderTemplate`<span class="session-cinema-name">${session.cinema}</span>`} </div> <div class="session-cinema-city"> <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"> <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path> <circle cx="12" cy="10" r="3"></circle> </svg> ${session.city} <span aria-hidden="true" class="session-city-sep">
·
</span> <a${addAttribute(mapsUrl(session.cinema, session.city), 'href')} target="_blank" rel="noopener noreferrer" class="session-maps-link"${addAttribute(`Com arribar a ${session.cinema}`, 'aria-label')}>
Com arribar
</a> </div> </div> <span${addAttribute(`badge${isSessionVO ? ' vo' : ''}`, 'class')}>${session.lang}</span> </div> <div class="session-times" role="group"${addAttribute(`Horaris a ${session.cinema}`, 'aria-label')}> ${session.times.map((time) => renderTemplate`<span class="session-time"${addAttribute(`${time} a ${session.cinema}`, 'aria-label')}> ${time} <span class="session-time-lang" aria-hidden="true"> ${session.lang} </span> </span>`)} </div> </div>`;
                  }
                )} </div>`,
            renderComponent($$result2, 'Footer', $$Footer, {
              filmCount: totalFilmCount,
              cinemaCount: totalCinemaCount,
              sessionCount: totalSessionCount,
            }),
            unescapeHTML(jsonLdStr),
            unescapeHTML(breadcrumbLdStr),
            renderScript(
              $$result2,
              '/Users/adriamontiel/Code/filmcat-astro/src/pages/films/[id].astro?astro&type=script&index=0&lang.ts'
            )
          ),
      }
    )}`;
  },
  '/Users/adriamontiel/Code/filmcat-astro/src/pages/films/[id].astro',
  void 0
);

const $$file = '/Users/adriamontiel/Code/filmcat-astro/src/pages/films/[id].astro';
const $$url = '/films/[id]';

const _page = /*#__PURE__*/ Object.freeze(
  /*#__PURE__*/ Object.defineProperty(
    {
      __proto__: null,
      default: $$id,
      file: $$file,
      url: $$url,
    },
    Symbol.toStringTag,
    { value: 'Module' }
  )
);

const page = () => _page;

export { page };
