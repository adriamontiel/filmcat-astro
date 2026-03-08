import {
  e as createAstro,
  f as createComponent,
  h as addAttribute,
  l as renderScript,
  r as renderTemplate,
  k as renderComponent,
  o as renderSlot,
  p as renderHead,
  m as maybeRenderHead,
} from './astro/server_BYSDsKQF.mjs';
import 'piccolore';
import 'clsx';
/* empty css                        */

const $$Astro$3 = createAstro('https://filmcat.cat');
const $$ClientRouter = createComponent(
  ($$result, $$props, $$slots) => {
    const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
    Astro2.self = $$ClientRouter;
    const { fallback = 'animate' } = Astro2.props;
    return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, 'content')}>${renderScript($$result, '/Users/adriamontiel/Code/filmcat-astro/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts')}`;
  },
  '/Users/adriamontiel/Code/filmcat-astro/node_modules/astro/components/ClientRouter.astro',
  void 0
);

const $$Astro$2 = createAstro('https://filmcat.cat');
const $$Index = createComponent(
  ($$result, $$props, $$slots) => {
    const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
    Astro2.self = $$Index;
    const propsStr = JSON.stringify(Astro2.props);
    const paramsStr = JSON.stringify(Astro2.params);
    return renderTemplate`${renderComponent($$result, 'vercel-analytics', 'vercel-analytics', { 'data-props': propsStr, 'data-params': paramsStr, 'data-pathname': Astro2.url.pathname })} ${renderScript($$result, '/Users/adriamontiel/Code/filmcat-astro/node_modules/@vercel/analytics/dist/astro/index.astro?astro&type=script&index=0&lang.ts')}`;
  },
  '/Users/adriamontiel/Code/filmcat-astro/node_modules/@vercel/analytics/dist/astro/index.astro',
  void 0
);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) =>
  __freeze(__defProp(cooked, 'raw', { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro('https://filmcat.cat');
const $$Base = createComponent(
  ($$result, $$props, $$slots) => {
    const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
    Astro2.self = $$Base;
    const {
      title = 'FILMCAT \u2014 Cinema en Catal\xE0',
      description = 'FILMCAT \u2014 Totes les pel\xB7l\xEDcules en catal\xE0 als cinemes de Catalunya. Horaris, sessions i cinemes actualitzats setmanalment.',
      ogImage = null,
      canonical = null,
    } = Astro2.props;
    return renderTemplate(
      _a ||
        (_a = __template([
          '<html lang="ca" dir="ltr"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"',
          `><meta name="theme-color" content="#0a0a0c"><meta name="color-scheme" content="dark"><!-- Security --><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' https://image.tmdb.org data: blob:; connect-src https://api.themoviedb.org https://www.youtube.com https://filmcat-api.vercel.app; frame-ancestors 'none'; base-uri 'none'; form-action 'none';"><meta http-equiv="X-Content-Type-Options" content="nosniff"><meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin"><meta http-equiv="Permissions-Policy" content="geolocation=(), camera=(), microphone=()"><!-- Open Graph --><meta property="og:title"`,
          '><meta property="og:description"',
          '><meta property="og:type" content="website"><meta property="og:locale" content="ca_ES"><meta property="og:url"',
          '>',
          '<meta name="twitter:card" content="summary_large_image">',
          '<title>',
          '</title>',
          '',
          '',
          '</head> <body> <a href="#main-content" class="skip-link">Saltar al contingut principal</a> ',
          ' <script src="/js/filmcat.js" defer><\/script> ',
          ' </body></html>',
        ])),
      addAttribute(description, 'content'),
      addAttribute(title, 'content'),
      addAttribute(description, 'content'),
      addAttribute(canonical || 'https://filmcat.cat/', 'content'),
      ogImage && renderTemplate`<meta property="og:image"${addAttribute(ogImage, 'content')}>`,
      ogImage && renderTemplate`<meta name="twitter:image"${addAttribute(ogImage, 'content')}>`,
      title,
      canonical && renderTemplate`<link rel="canonical"${addAttribute(canonical, 'href')}>`,
      renderComponent($$result, 'ViewTransitions', $$ClientRouter, {}),
      renderHead(),
      renderSlot($$result, $$slots['default']),
      renderComponent($$result, 'Analytics', $$Index, {})
    );
  },
  '/Users/adriamontiel/Code/filmcat-astro/src/layouts/Base.astro',
  void 0
);

const $$Header = createComponent(
  ($$result, $$props, $$slots) => {
    return renderTemplate`${maybeRenderHead()}<header role="banner"> <a class="logo-wrap" href="/" aria-label="FILMCAT - Inici"> <svg class="logo-svg" viewBox="0 0 100 88" aria-hidden="true" focusable="false"> <defs> <linearGradient id="lg1" x1="0" y1="88" x2="100" y2="0" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#922B21"></stop> <stop offset="100%" stop-color="#E74C3C"></stop> </linearGradient> <linearGradient id="lg2" x1="50" y1="0" x2="0" y2="88" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#C0392B" stop-opacity=".85"></stop> <stop offset="100%" stop-color="#7B241C"></stop> </linearGradient> </defs> <polygon points="50,0 100,88 0,88" fill="url(#lg1)"></polygon> <polygon points="50,0 50,60 0,88" fill="url(#lg2)"></polygon> </svg> <span class="logo-text">FILMCAT</span> </a> <nav aria-label="Navegació principal"> <a href="#cartellera-h">Cartellera</a> <a href="#cinemes">Cinemes</a> </nav> <button class="hamburger" aria-label="Obrir menú de navegació" aria-expanded="false" aria-controls="mobile-nav" id="hamburgerBtn"> <span class="menu-label">MENU</span> </button> </header> <nav id="mobile-nav" class="mobile-nav" aria-label="Menú mòbil" aria-hidden="true"> <a href="#cartellera-h">Cartellera</a> <a href="#cinemes">Cinemes</a> </nav> ${renderScript($$result, '/Users/adriamontiel/Code/filmcat-astro/src/components/Header.astro?astro&type=script&index=0&lang.ts')}`;
  },
  '/Users/adriamontiel/Code/filmcat-astro/src/components/Header.astro',
  void 0
);

const $$Astro = createAstro('https://filmcat.cat');
const $$Footer = createComponent(
  ($$result, $$props, $$slots) => {
    const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
    Astro2.self = $$Footer;
    const { filmCount, cinemaCount, sessionCount } = Astro2.props;
    return renderTemplate`${maybeRenderHead()}<footer role="contentinfo"> <div class="footer-bg" aria-hidden="true"></div> <div class="footer-grid" aria-hidden="true"></div> <div class="footer-inner"> <div class="footer-top"> <div class="footer-headline"> <p class="footer-eyebrow" aria-hidden="true">Cinema en català</p> <div class="footer-title" aria-hidden="true">EL CINEMA<br>EN <em>CATALÀ</em></div> </div> <div class="footer-stats" role="region" aria-label="Estadístiques de la cartellera"> <div class="footer-stat"> <span class="footer-stat-num">${filmCount}</span> <span class="footer-stat-label">Pel·lícules</span> </div> <div class="footer-stat"> <span class="footer-stat-num">${cinemaCount}</span> <span class="footer-stat-label">Cinemes</span> </div> <div class="footer-stat"> <span class="footer-stat-num">${sessionCount}</span> <span class="footer-stat-label">Sessions</span> </div> </div> </div> <div class="footer-bottom"> <a class="footer-logo" href="/" aria-label="FILMCAT - Tornar a l'inici"> <svg viewBox="0 0 100 88" fill="none" aria-hidden="true"> <defs> <linearGradient id="flg1" x1="0" y1="88" x2="100" y2="0" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#922B21"></stop> <stop offset="100%" stop-color="#E74C3C"></stop> </linearGradient> <linearGradient id="flg2" x1="50" y1="0" x2="0" y2="88" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#C0392B" stop-opacity=".85"></stop> <stop offset="100%" stop-color="#7B241C"></stop> </linearGradient> </defs> <polygon points="50,0 100,88 0,88" fill="url(#flg1)"></polygon> <polygon points="50,0 50,60 0,88" fill="url(#flg2)"></polygon> </svg> <span class="footer-logo-text">FILMCAT</span> </a> <div class="footer-note"> <div class="footer-attribution">
Dades de sessions i cinemes: <a href="https://www.gencat.cat/llengua/cinema/" target="_blank" rel="noopener noreferrer">Portal Cinema en Català — Generalitat de Catalunya</a> · Llicència de dades obertes
</div> <div class="footer-attribution">
Pòsters i sinopsi: <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">The Movie Database (TMDB)</a> </div> <div class="footer-attribution footer-attribution--author">
Creat per Adrià Montiel · Actualitzat cada dijous
</div> </div> </div> </div> </footer>`;
  },
  '/Users/adriamontiel/Code/filmcat-astro/src/components/Footer.astro',
  void 0
);

const CINEMA_URLS = {
  // ── CINESA ──────────────────────────────────────────────────────────────
  'Cinesa Diagonal': 'https://www.cinesa.es',
  'Cinesa Diagonal Mar': 'https://www.cinesa.es',
  "Cinesa La Farga de l'Hospitalet de Llobregat": 'https://www.cinesa.es',
  'Cinesa Barnasud de Gavà': 'https://www.cinesa.es',
  'Cinesa Parc Vallès de Terrassa': 'https://www.cinesa.es',
  'Cinesa SOM Multiespai': 'https://www.cinesa.es',
  // ── YELMO ───────────────────────────────────────────────────────────────
  'Cine Yelmo Abrera': 'https://www.yelmocines.es',
  'Cine Yelmo Baricentro de Barberà del Vallès': 'https://www.yelmocines.es',
  'Cine Yelmo Sant Cugat': 'https://www.yelmocines.es',
  'Cine Yelmo Westfield La Maquinista': 'https://www.yelmocines.es',
  'Cine Yelmo Premium Castelldefels': 'https://www.yelmocines.es',
  'Cine Yelmo Parc Central de Tarragona': 'https://www.yelmocines.es',
  'Cine Yelmo Mercado de Campanar de València': 'https://www.yelmocines.es',
  // ── OCINE ───────────────────────────────────────────────────────────────
  'Ocine Arenys': 'https://www.ocine.es',
  'Ocine Blanes': 'https://www.ocine.es',
  'Ocine El Vendrell – Les Mates': 'https://www.ocine.es',
  'Ocine Girona': 'https://www.ocine.es',
  'Ocine Granollers - El Nord': 'https://www.ocine.es',
  'Ocine Màgic Badalona': 'https://www.ocine.es',
  "Ocine Platja d'Aro – Parc d'Aro": 'https://www.ocine.es',
  'Ocine Premium Lleida': 'https://www.ocine.es',
  'Ocine Roquetes': 'https://www.ocine.es',
  'Ocine Tarragona - Les Gavarres': 'https://www.ocine.es',
  'Ocine Vila-seca – Port Halley': 'https://www.ocine.es',
  // ── ACEC ────────────────────────────────────────────────────────────────
  'ACEC CAT Cines Figueres': 'https://www.cinesacec.es',
  'ACEC Cines Bages Centre de Manresa': 'https://www.cinesacec.es',
  "ACEC Cines Filmax Gran Via de l'Hospitalet de Llobregat": 'https://www.cinesacec.es',
  'ACEC Cines Imperial de Sabadell': 'https://www.cinesacec.es',
  'ACEC Cines Olot': 'https://www.cinesacec.es',
  'ACEC Multicinemes Eix Macià de Sabadell': 'https://www.cinesacec.es',
  // ── GRUP BALANAS ────────────────────────────────────────────────────────
  'Aribau Multicines': 'https://www.grupbalanas.com',
  'Arenas Multicines': 'https://www.grupbalanas.com',
  'Balmes Multicines': 'https://www.grupbalanas.com',
  'Cinemes Girona': 'https://www.grupbalanas.com',
  'Glòries Multicines': 'https://www.grupbalanas.com',
  'Gran Sarrià Multicines': 'https://www.grupbalanas.com',
  // ── KINÈPOLIS ───────────────────────────────────────────────────────────
  'Kinépolis Mataró Parc': 'https://kinepolis.es',
  'Cines FULL de Cornellà de Llobregat': 'https://kinepolis.es',
  // ── JCA CINEMES ─────────────────────────────────────────────────────────
  'JCA Cinemes Lleida - Alpicat': 'https://jcacinemes.com',
  'JCA Cinemes Tarragona - Valls': 'https://jcacinemes.com',
  // ── CINES ABC ───────────────────────────────────────────────────────────
  'Cinemes ABC Elx': 'https://www.cinesabc.com',
  'Cinemes ABC Gandia': 'https://www.cinesabc.com',
  'Cinemes ABC Park de València': 'https://www.cinesabc.com',
  'Cines ABC Saler': 'https://www.cinesabc.com',
  // ── ODEON MULTICINES ────────────────────────────────────────────────────
  'Odeon Multicines Girona de Salt': 'https://odeonmulticines.com',
  'Odeon Multicines Vilanova': 'https://odeonmulticines.com',
  // ── MULTICINES SUCRE ────────────────────────────────────────────────────
  'Multicines Sucre de Vic': 'https://www.sucrecines.com',
  'Multicines Sucre Vila-real': 'https://www.sucrecines.com',
  // ── INDEPENDENTS ────────────────────────────────────────────────────────
  'Cines Verdi': 'https://cines-verdi.com',
  'Zumzeig Cinema': 'https://zumzeigcine.coop',
  'Cinema Maldà': 'https://cinemamalda.com',
  'Espai Texas': 'https://espaitexas.cat',
  'Filmoteca de Catalunya': 'https://www.filmoteca.cat',
  'Renoir Floridablanca': 'https://www.cinesrenoir.com',
  'Cinema Truffaut de Girona': 'https://cinematruffaut.girona.cat',
  'Cinemes Can Castellet de Sant Boi de Llobregat': 'https://cinemescancastellet.com',
  'Cinemes Roses': 'https://cinemesroses.cat',
  "Cinemes Guiu de La Seu d'Urgell": 'https://cinemesguiu.com',
  'Cinemes Sant Cugat': 'https://cinemessantcugat.cat',
  'Kubrick Cinema de Vilafranca del Penedès': 'https://kubrickcinema.cat',
  'Cines Axion de Reus': 'https://www.cinesaxion.com',
  'Screenbox Funatic de Lleida': 'https://www.screenbox.cat',
  'Octubre Centre de Cultura Contemporània de València': 'https://octubre.cat',
  "Lluïsos d'Horta": 'https://lluisos.net',
  // ── NOU (afegits automàticament) ────────────────────────────────────────
  'Cine Bic': 'https://www.cinebic.com',
  'MCB Cinema Calafell': 'https://www.mcbcinemas.com',
  'Cinemes Illa Carlemany de Les Escaldes': 'https://cinemesilla.com',
  'Cinema Montgrí de Torroella de Montgrí': 'https://cinemamontgri.cat',
  'Bosque Multicines': 'https://www.moobycinemas.com/bosque',
  'Cinema Ribes de Sant Pere de Ribes': 'https://www.cinemaribes.com',
  'Cine Alhambra de La Garriga': 'https://www.cinealhambra.com',
  'Cinemes Moix Negre': 'https://www.cinesmoixnegre.org',
  'Cines Lys de València': 'https://cineslys.com',
  'Sala Zazie de Vilafranca del Penedès - CineClub Vilafranca': 'https://cineclubvila.cat',
  "Cinema Rambla de l'Art de Cambrils": 'https://www.rambladelart-cambrils.com',
  'Cine París de Solsona': 'https://www.cineparis.cat',
  'Mont-Àgora Cinemes de Santa Margarida de Montbui': 'https://www.cinemesmontagora.com',
  'Cinema Edison de Granollers': 'https://cinemaedison.cat',
  "Ateneu Cinema d'Igualada": 'https://ateneucinema.cat',
  'Cinema Catalunya de Ribes de Freser': 'https://amicscinevallderibes.com',
};

const KEYWORDS = [
  [
    'Girona',
    [
      // Original
      'girona',
      'salt',
      'figueres',
      'blanes',
      "platja d'aro",
      'roses',
      'torroella',
      'olot',
      'ribes de freser',
      'lloret',
      'palamós',
      'sant feliu de guíxols',
      'ripoll',
      // Added from full API city list
      'anglès',
      'banyoles',
      'cadaqués',
      'cassà',
      'celrà',
      'joanetes',
      "bisbal d'empordà",
      'la cellera',
      'la jonquera',
      'llagostera',
      'palafrugell',
      'planoles',
      'riudarenes',
      'sant joan les fonts',
      'santa coloma de farners',
    ],
  ],
  [
    'Tarragona',
    [
      // Original
      'tarragona',
      'reus',
      'cambrils',
      'vendrell',
      'calafell',
      'roquetes',
      'vila-seca',
      'valls',
      'tortosa',
      'amposta',
      'deltebre',
      // Added from full API city list
      'alcanar',
      'alcover',
      'arnes',
      'ascó',
      'batea',
      'bonastre',
      'caseres',
      'catllar',
      'gandesa',
      'espluga de francolí',
      "l'infant",
      'bisbal del penedès',
      'la ràpita',
      'montblanc',
      'riba-roja',
      'santa oliva',
      'solivella',
      'ulldemolins',
      'vandellòs',
      'vilalba dels arcs',
      'vilallonga del camp',
    ],
  ],
  [
    'Lleida',
    [
      // Original
      'lleida',
      'alpicat',
      'solsona',
      "seu d'urgell",
      'tremp',
      'balaguer',
      'mollerussa',
      'tàrrega',
      'cervera',
      // Added from full API city list
      'agramunt',
      'almacelles',
      'arbeca',
      'artesa de segre',
      'barruera',
      'bellcaire',
      'bellpuig',
      'bellver',
      'bellvís',
      'pont de suert',
      'guissona',
      'la fuliola',
      'la granadella',
      'pobla de segur',
      'les borges blanques',
      'linyola',
      'sort',
      'torrefarrera',
      'unha',
      'vallbona de les monges',
      'vinaixa',
    ],
  ],
  [
    'València',
    [
      // Original
      'valència',
      'valencia',
      'gandia',
      'elx',
      'elche',
      'vila-real',
      'castelló',
      'alacant',
      // Added from full API city list
      'alcoi',
      'llíria',
      'ontinyent',
      'pedreguer',
      'villena',
    ],
  ],
  ['Andorra', ['escaldes', 'andorra']],
];
const PROVINCE_ORDER = ['Barcelona', 'Girona', 'Tarragona', 'Lleida', 'València', 'Andorra'];
function cityToProvince(city) {
  const lower = city.toLowerCase();
  for (const [province, keywords] of KEYWORDS) {
    if (keywords.some((k) => lower.includes(k))) return province;
  }
  return 'Barcelona';
}

export {
  $$Base as $,
  CINEMA_URLS as C,
  PROVINCE_ORDER as P,
  $$Footer as a,
  $$Header as b,
  cityToProvince as c,
};
