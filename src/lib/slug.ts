// slug.ts — stable URL slugs for film pages
export function slugify(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics (à→a, è→e, etc.)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')    // non-alphanumeric → dash
    .replace(/^-+|-+$/g, '');       // trim leading/trailing dashes
}
