// provinces.ts — map Gencat session city names to display province/territory names.
// Uses substring matching (lowercase) against the `city` field from the filmcat API.
// Cities not matched default to 'Barcelona' (largest province, most cinemas).

const KEYWORDS: [string, string[]][] = [
  ['Girona',    ['girona', 'salt', 'figueres', 'blanes', "platja d'aro", 'roses',
                 'torroella', 'olot', 'ribes de freser', 'lloret', 'palamós',
                 'sant feliu de guíxols', 'ripoll']],
  ['Tarragona', ['tarragona', 'reus', 'cambrils', 'vendrell', 'calafell', 'roquetes',
                 'vila-seca', 'valls', 'tortosa', 'amposta', 'deltebre']],
  ['Lleida',    ['lleida', 'alpicat', 'solsona', "seu d'urgell", 'tremp',
                 'balaguer', 'mollerussa', 'tàrrega', 'cervera']],
  ['València',  ['valència', 'valencia', 'gandia', 'elx', 'elche',
                 'vila-real', 'castelló', 'alacant']],
  ['Andorra',   ['escaldes', 'andorra']],
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
