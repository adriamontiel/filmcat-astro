// cinema-urls.ts — verified website URLs for cinemas in the filmcat API.
// Keys must match the exact cinema name returned by the API.
// Only cinemas with a confirmed web presence are listed.
// Last updated: March 2026.

export const CINEMA_URLS: Record<string, string> = {
  // ── CINESA ──────────────────────────────────────────────────────────────
  'Cinesa Diagonal': 'https://www.cinesa.es/cines/diagonal/',
  'Cinesa Diagonal Mar': 'https://www.cinesa.es/cines/diagonal-mar/',
  "Cinesa La Farga de l'Hospitalet de Llobregat": 'https://www.cinesa.es/cines/la-farga/',
  'Cinesa Barnasud de Gavà': 'https://www.cinesa.es/cines/barnasud/',
  'Cinesa Parc Vallès de Terrassa': 'https://www.cinesa.es/cines/parc-valles/',
  'Cinesa SOM Multiespai': 'https://www.cinesa.es/cines/som-multiespai/',

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
  "Ocine Platja d'Aro – Parc d'Aro": 'https://www.ocineplatjadaro.es/',
  'Ocine Premium Lleida': 'https://www.ocine.es',
  'Ocine Roquetes': 'https://www.ocine.es',
  'Ocine Tarragona - Les Gavarres': 'https://www.ocine.es',
  'Ocine Vila-seca – Port Halley': 'https://www.ocine.es',

  // ── ACEC ────────────────────────────────────────────────────────────────
  'ACEC CAT Cines Figueres': 'https://www.cinesacec.es',
  'ACEC Cines Bages Centre de Manresa': 'https://www.cinesacec.es',
  "ACEC Cines Filmax Gran Via de l'Hospitalet de Llobregat": 'https://cinesfilmax.com/',
  'ACEC Cines Imperial de Sabadell': 'https://www.cinesacec.es',
  'ACEC Cines Olot': 'https://www.cinesacec.es',
  'ACEC Multicinemes Eix Macià de Sabadell': 'https://www.cinesacec.es',

  // ── GRUP BALAÑÁ ─────────────────────────────────────────────────────────
  // Nota: el domini era grupbalanas.com (mort) — el correcte és grupbalana.com
  'Aribau Multicines': 'https://www.moobycinemas.com/aribau',
  'Arenas Multicines': 'https://www.moobycinemas.com/arenas',
  'Balmes Multicines': 'https://www.moobycinemas.com/balmes',
  'Glòries Multicines': 'https://www.moobycinemas.com/glories',
  'Gran Sarrià Multicines': 'https://www.moobycinemas.com/sarria',

  // ── CINEMES GIRONA (independent, no Balañá) ──────────────────────────────
  'Cinemes Girona': 'https://www.cinemesgirona.cat',

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
  'Zumzeig Cinema': 'https://www.codetickets.com/portal/zumzeigcooperativa/online/',
  'Cinema Maldà': 'https://cinemamalda.com',
  'Espai Texas': 'https://espaitexas.cat',
  'Filmoteca de Catalunya': 'https://www.filmoteca.cat',
  'Renoir Floridablanca': 'https://www.cinesrenoir.com',
  'Cinema Truffaut de Girona': 'https://cinematruffaut.girona.cat',
  'CineBaix de Sant Feliu de Llobregat': 'https://www.cinebaix.com',
  'Cinemes Can Castellet de Sant Boi de Llobregat': 'https://cinemescancastellet.com',
  'Cinemes Roses': 'https://cinemesroses.cat',
  "Cinemes Guiu de La Seu d'Urgell": 'https://cinemesguiu.com',
  'Cinemes Sant Cugat': 'https://www.cinemessantcugat.com',
  'Kubrick Cinema de Vilafranca del Penedès': 'https://kubrickcinema.cat',
  'Cines Axion de Reus': 'https://www.cinesaxion.com',
  'Screenbox Funatic de Lleida': 'https://www.screenbox.cat',
  'Octubre Centre de Cultura Contemporània de València': 'https://octubre.cat',
  "Lluïsos d'Horta": 'https://lluisoshorta.cat',

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
