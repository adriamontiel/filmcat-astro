import 'piccolore';
import { q as decodeKey } from './chunks/astro/server_BYSDsKQF.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_Dslnz2H0.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === 'string') {
        return [key, value.normalize().replace(/#/g, '%23').replace(/\?/g, '%3F')];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || '';
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content
    .normalize()
    .replace(/\?/g, '%3F')
    .replace(/#/g, '%23')
    .replace(/%5B/g, '[')
    .replace(/%5D/g, ']');
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join('');
  return segmentPath ? '/' + segmentPath : '';
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = '';
    if (addTrailingSlash === 'always' && segments.length) {
      trailing = '/';
    }
    const path =
      segments.map((segment) => getSegment(segment, sanitizedParams)).join('') + trailing;
    return path || '/';
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute
      ? deserializeRouteData(rawRouteData.redirectRoute)
      : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin,
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData),
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key,
  };
}

const manifest = deserializeManifest({
  hrefRoot: 'file:///Users/adriamontiel/Code/filmcat-astro/',
  cacheDir: 'file:///Users/adriamontiel/Code/filmcat-astro/node_modules/.astro/',
  outDir: 'file:///Users/adriamontiel/Code/filmcat-astro/dist/',
  srcDir: 'file:///Users/adriamontiel/Code/filmcat-astro/src/',
  publicDir: 'file:///Users/adriamontiel/Code/filmcat-astro/public/',
  buildClientDir: 'file:///Users/adriamontiel/Code/filmcat-astro/dist/client/',
  buildServerDir: 'file:///Users/adriamontiel/Code/filmcat-astro/dist/server/',
  adapterName: '@astrojs/vercel',
  routes: [
    {
      file: '',
      links: [],
      scripts: [],
      styles: [],
      routeData: {
        type: 'page',
        component: '_server-islands.astro',
        params: ['name'],
        segments: [
          [{ content: '_server-islands', dynamic: false, spread: false }],
          [{ content: 'name', dynamic: true, spread: false }],
        ],
        pattern: '^\\/_server-islands\\/([^/]+?)\\/?$',
        prerender: false,
        isIndex: false,
        fallbackRoutes: [],
        route: '/_server-islands/[name]',
        origin: 'internal',
        _meta: { trailingSlash: 'ignore' },
      },
    },
    {
      file: '',
      links: [],
      scripts: [],
      styles: [],
      routeData: {
        type: 'endpoint',
        isIndex: false,
        route: '/_image',
        pattern: '^\\/_image\\/?$',
        segments: [[{ content: '_image', dynamic: false, spread: false }]],
        params: [],
        component: 'node_modules/astro/dist/assets/endpoint/generic.js',
        pathname: '/_image',
        prerender: false,
        fallbackRoutes: [],
        origin: 'internal',
        _meta: { trailingSlash: 'ignore' },
      },
    },
    {
      file: '',
      links: [],
      scripts: [],
      styles: [],
      routeData: {
        route: '/api/refresh-cache',
        isIndex: false,
        type: 'endpoint',
        pattern: '^\\/api\\/refresh-cache\\/?$',
        segments: [
          [{ content: 'api', dynamic: false, spread: false }],
          [{ content: 'refresh-cache', dynamic: false, spread: false }],
        ],
        params: [],
        component: 'src/pages/api/refresh-cache.ts',
        pathname: '/api/refresh-cache',
        prerender: false,
        fallbackRoutes: [],
        distURL: [],
        origin: 'project',
        _meta: { trailingSlash: 'ignore' },
      },
    },
    {
      file: '',
      links: [],
      scripts: [],
      styles: [{ type: 'external', src: '/_astro/_id_.B20TUUZw.css' }],
      routeData: {
        route: '/films/[id]',
        isIndex: false,
        type: 'page',
        pattern: '^\\/films\\/([^/]+?)\\/?$',
        segments: [
          [{ content: 'films', dynamic: false, spread: false }],
          [{ content: 'id', dynamic: true, spread: false }],
        ],
        params: ['id'],
        component: 'src/pages/films/[id].astro',
        prerender: false,
        fallbackRoutes: [],
        distURL: [],
        origin: 'project',
        _meta: { trailingSlash: 'ignore' },
      },
    },
    {
      file: '',
      links: [],
      scripts: [],
      styles: [],
      routeData: {
        route: '/robots.txt',
        isIndex: false,
        type: 'endpoint',
        pattern: '^\\/robots\\.txt\\/?$',
        segments: [[{ content: 'robots.txt', dynamic: false, spread: false }]],
        params: [],
        component: 'src/pages/robots.txt.ts',
        pathname: '/robots.txt',
        prerender: false,
        fallbackRoutes: [],
        distURL: [],
        origin: 'project',
        _meta: { trailingSlash: 'ignore' },
      },
    },
    {
      file: '',
      links: [],
      scripts: [],
      styles: [],
      routeData: {
        route: '/sitemap.xml',
        isIndex: false,
        type: 'endpoint',
        pattern: '^\\/sitemap\\.xml\\/?$',
        segments: [[{ content: 'sitemap.xml', dynamic: false, spread: false }]],
        params: [],
        component: 'src/pages/sitemap.xml.ts',
        pathname: '/sitemap.xml',
        prerender: false,
        fallbackRoutes: [],
        distURL: [],
        origin: 'project',
        _meta: { trailingSlash: 'ignore' },
      },
    },
    {
      file: '',
      links: [],
      scripts: [],
      styles: [{ type: 'external', src: '/_astro/_id_.B20TUUZw.css' }],
      routeData: {
        route: '/',
        isIndex: true,
        type: 'page',
        pattern: '^\\/$',
        segments: [],
        params: [],
        component: 'src/pages/index.astro',
        pathname: '/',
        prerender: false,
        fallbackRoutes: [],
        distURL: [],
        origin: 'project',
        _meta: { trailingSlash: 'ignore' },
      },
    },
  ],
  site: 'https://filmcat.cat',
  base: '/',
  trailingSlash: 'ignore',
  compressHTML: true,
  componentMetadata: [
    [
      '/Users/adriamontiel/Code/filmcat-astro/src/pages/films/[id].astro',
      { propagation: 'none', containsHead: true },
    ],
    [
      '/Users/adriamontiel/Code/filmcat-astro/src/pages/index.astro',
      { propagation: 'none', containsHead: true },
    ],
  ],
  renderers: [],
  clientDirectives: [
    [
      'idle',
      '(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value=="object"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};"requestIdleCallback"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event("astro:idle"));})();',
    ],
    [
      'load',
      '(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event("astro:load"));})();',
    ],
    [
      'media',
      '(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener("change",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event("astro:media"));})();',
    ],
    [
      'only',
      '(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event("astro:only"));})();',
    ],
    [
      'visible',
      '(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value=="object"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event("astro:visible"));})();',
    ],
  ],
  entryModules: {
    '\u0000noop-middleware': '_noop-middleware.mjs',
    '\u0000virtual:astro:actions/noop-entrypoint': 'noop-entrypoint.mjs',
    '\u0000@astro-page:src/pages/api/refresh-cache@_@ts': 'pages/api/refresh-cache.astro.mjs',
    '\u0000@astro-page:src/pages/films/[id]@_@astro': 'pages/films/_id_.astro.mjs',
    '\u0000@astro-page:src/pages/robots.txt@_@ts': 'pages/robots.txt.astro.mjs',
    '\u0000@astro-page:src/pages/sitemap.xml@_@ts': 'pages/sitemap.xml.astro.mjs',
    '\u0000@astro-page:src/pages/index@_@astro': 'pages/index.astro.mjs',
    '\u0000@astrojs-ssr-virtual-entry': 'entry.mjs',
    '\u0000@astro-renderers': 'renderers.mjs',
    '\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js':
      'pages/_image.astro.mjs',
    '\u0000@astrojs-ssr-adapter': '_@astrojs-ssr-adapter.mjs',
    '\u0000@astrojs-manifest': 'manifest_CvSMNx1m.mjs',
    '/Users/adriamontiel/Code/filmcat-astro/node_modules/astro/dist/assets/services/sharp.js':
      'chunks/sharp_C9jOtrgP.mjs',
    '/Users/adriamontiel/Code/filmcat-astro/src/pages/films/[id].astro?astro&type=script&index=0&lang.ts':
      '_astro/_id_.astro_astro_type_script_index_0_lang.BW42wRve.js',
    '/Users/adriamontiel/Code/filmcat-astro/src/components/Header.astro?astro&type=script&index=0&lang.ts':
      '_astro/Header.astro_astro_type_script_index_0_lang.KYrttyop.js',
    '/Users/adriamontiel/Code/filmcat-astro/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts':
      '_astro/ClientRouter.astro_astro_type_script_index_0_lang.CDGfc0hd.js',
    '/Users/adriamontiel/Code/filmcat-astro/node_modules/@vercel/analytics/dist/astro/index.astro?astro&type=script&index=0&lang.ts':
      '_astro/index.astro_astro_type_script_index_0_lang.C06vs49o.js',
    'astro:scripts/before-hydration.js': '',
  },
  inlinedScripts: [
    [
      '/Users/adriamontiel/Code/filmcat-astro/src/pages/films/[id].astro?astro&type=script&index=0&lang.ts',
      'document.addEventListener("astro:page-load",()=>{const n=sessionStorage.getItem("filmcat_province");if(!n||n==="all")return;const t=document.querySelector(".sessions-grid");if(!t)return;const o=[...t.querySelectorAll(":scope > .session-cinema")],i=o.filter(e=>e.dataset.province===n),a=o.filter(e=>e.dataset.province!==n);if(i.length===0)return;t.innerHTML="",t.removeAttribute("role"),t.removeAttribute("aria-label");const l=(e,s)=>{const r=document.createElement("div");return r.className="session-group-label"+(s?" session-group-label--"+s:""),r.textContent=e,r},c=e=>{const s=document.createElement("div");return s.className="sessions-group",s.setAttribute("role","list"),s.setAttribute("aria-label",e),s},d=c(`Sessions a ${n}`);if(i.forEach(e=>d.appendChild(e)),t.appendChild(l(n)),t.appendChild(d),a.length>0){const e=c("Altres sessions");a.forEach(s=>e.appendChild(s)),t.appendChild(l("Altres sessions","others")),t.appendChild(e)}});',
    ],
    [
      '/Users/adriamontiel/Code/filmcat-astro/src/components/Header.astro?astro&type=script&index=0&lang.ts',
      'document.addEventListener("astro:page-load",()=>{document.querySelector(".logo-wrap")?.addEventListener("click",e=>{sessionStorage.removeItem("filmcat_scroll"),sessionStorage.removeItem("filmcat_province"),window.location.pathname==="/"&&(e.preventDefault(),document.querySelector(\'[data-province-filter="all"]\')?.click(),document.querySelector(\'[data-filter="all"]\')?.click(),window.scrollTo({top:0,behavior:"smooth"}))})});',
    ],
    [
      '/Users/adriamontiel/Code/filmcat-astro/node_modules/@vercel/analytics/dist/astro/index.astro?astro&type=script&index=0&lang.ts',
      'var f="@vercel/analytics",l="1.6.1",w=()=>{window.va||(window.va=function(...r){(window.vaq=window.vaq||[]).push(r)})};function d(){return typeof window<"u"}function u(){try{const e="production"}catch{}return"production"}function v(e="auto"){if(e==="auto"){window.vam=u();return}window.vam=e}function m(){return(d()?window.vam:u())||"production"}function c(){return m()==="development"}function b(e,r){if(!e||!r)return e;let n=e;try{const t=Object.entries(r);for(const[a,i]of t)if(!Array.isArray(i)){const o=s(i);o.test(n)&&(n=n.replace(o,`/[${a}]`))}for(const[a,i]of t)if(Array.isArray(i)){const o=s(i.join("/"));o.test(n)&&(n=n.replace(o,`/[...${a}]`))}return n}catch{return e}}function s(e){return new RegExp(`/${h(e)}(?=[/?#]|$)`)}function h(e){return e.replace(/[.*+?^${}()|[\\]\\\\]/g,"\\\\$&")}function y(e){return e.scriptSrc?e.scriptSrc:c()?"https://va.vercel-scripts.com/v1/script.debug.js":e.basePath?`${e.basePath}/insights/script.js`:"/_vercel/insights/script.js"}function g(e={debug:!0}){var r;if(!d())return;v(e.mode),w(),e.beforeSend&&((r=window.va)==null||r.call(window,"beforeSend",e.beforeSend));const n=y(e);if(document.head.querySelector(`script[src*="${n}"]`))return;const t=document.createElement("script");t.src=n,t.defer=!0,t.dataset.sdkn=f+(e.framework?`/${e.framework}`:""),t.dataset.sdkv=l,e.disableAutoTrack&&(t.dataset.disableAutoTrack="1"),e.endpoint?t.dataset.endpoint=e.endpoint:e.basePath&&(t.dataset.endpoint=`${e.basePath}/insights`),e.dsn&&(t.dataset.dsn=e.dsn),t.onerror=()=>{const a=c()?"Please check if any ad blockers are enabled and try again.":"Be sure to enable Web Analytics for your project and deploy again. See https://vercel.com/docs/analytics/quickstart for more information.";console.log(`[Vercel Web Analytics] Failed to load script from ${n}. ${a}`)},c()&&e.debug===!1&&(t.dataset.debug="false"),document.head.appendChild(t)}function p({route:e,path:r}){var n;(n=window.va)==null||n.call(window,"pageview",{route:e,path:r})}function k(){try{return}catch{}}customElements.define("vercel-analytics",class extends HTMLElement{constructor(){super();try{const r=JSON.parse(this.dataset.props??"{}"),n=JSON.parse(this.dataset.params??"{}");g({...r,disableAutoTrack:!0,framework:"astro",basePath:k(),beforeSend:window.webAnalyticsBeforeSend});const t=this.dataset.pathname;p({route:b(t??"",n),path:t})}catch(r){throw new Error(`Failed to parse WebAnalytics properties: ${r}`)}}});',
    ],
  ],
  assets: [
    '/_astro/_id_.B20TUUZw.css',
    '/favicon.ico',
    '/favicon.svg',
    '/_astro/ClientRouter.astro_astro_type_script_index_0_lang.CDGfc0hd.js',
    '/fonts/bebas-neue-400-latin-ext.woff2',
    '/fonts/bebas-neue-400-latin.woff2',
    '/fonts/outfit-latin-ext.woff2',
    '/fonts/outfit-latin.woff2',
    '/fonts/space-mono-400-latin.woff2',
    '/fonts/space-mono-700-latin.woff2',
    '/js/filmcat.js',
  ],
  buildFormat: 'directory',
  checkOrigin: true,
  allowedDomains: [],
  actionBodySizeLimit: 1048576,
  serverIslandNameMap: [],
  key: 'gmRWPsjvRfMGC3VBaKhQ/tpzq9mR+M9EnBUdFrZ6R6o=',
});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
