// provinces.ts — map Gencat session city names to display province/territory names.
// Uses substring matching (lowercase) against the `city` field from the filmcat API.
// Cities not matched default to 'Barcelona' (largest province, most cinemas).
// Keywords derived from the full city list returned by /api/cartellera.

const KEYWORDS: [string, string[]][] = [
  ['Girona', [
    // Original
    'girona', 'salt', 'figueres', 'blanes', "platja d'aro", 'roses',
    'torroella', 'olot', 'ribes de freser', 'lloret', 'palamós',
    'sant feliu de guíxols', 'ripoll',
    // Added from full API city list
    'anglès', 'banyoles', 'cadaqués', 'cassà', 'celrà',
    'joanetes', "bisbal d'empordà", 'la cellera', 'la jonquera',
    'llagostera', 'palafrugell', 'planoles', 'riudarenes',
    'sant joan les fonts', 'santa coloma de farners',
  ]],
  ['Tarragona', [
    // Original
    'tarragona', 'reus', 'cambrils', 'vendrell', 'calafell', 'roquetes',
    'vila-seca', 'valls', 'tortosa', 'amposta', 'deltebre',
    // Added from full API city list
    'alcanar', 'alcover', 'arnes', 'ascó', 'batea', 'bonastre', 'caseres',
    'catllar', 'gandesa', 'espluga de francolí', "l'infant",
    'bisbal del penedès', 'la ràpita', 'montblanc', 'riba-roja',
    'santa oliva', 'solivella', 'ulldemolins', 'vandellòs',
    'vilalba dels arcs', 'vilallonga del camp',
  ]],
  ['Lleida', [
    // Original
    'lleida', 'alpicat', 'solsona', "seu d'urgell", 'tremp',
    'balaguer', 'mollerussa', 'tàrrega', 'cervera',
    // Added from full API city list
    'agramunt', 'almacelles', 'arbeca', 'artesa de segre', 'barruera',
    'bellcaire', 'bellpuig', 'bellver', 'bellvís',
    'pont de suert', 'guissona', 'la fuliola', 'la granadella',
    'pobla de segur', 'les borges blanques', 'linyola', 'sort',
    'torrefarrera', 'unha', 'vallbona de les monges', 'vinaixa',
  ]],
  ['València', [
    // Original
    'valència', 'valencia', 'gandia', 'elx', 'elche',
    'vila-real', 'castelló', 'alacant',
    // Added from full API city list
    'alcoi', 'llíria', 'ontinyent', 'pedreguer', 'villena',
  ]],
  ['Andorra', ['escaldes', 'andorra']],
];

// Canonical display order for province filter buttons
export const PROVINCE_ORDER = ['Barcelona', 'Girona', 'Tarragona', 'Lleida', 'València', 'Andorra'];

export function cityToProvince(city: string): string {
  const lower = city.toLowerCase();
  for (const [province, keywords] of KEYWORDS) {
    if (keywords.some(k => lower.includes(k))) return province;
  }
  return 'Barcelona';
}
