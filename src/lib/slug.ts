// slug.ts — stable URL slugs for film and cinema pages
export function slugify(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics (à→a, è→e, etc.)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // non-alphanumeric → dash
    .replace(/^-+|-+$/g, ''); // trim leading/trailing dashes
}

// cinemaSlug — cinema names are already unique location descriptors
// (e.g. "Ocine Tarragona - Les Gavarres"), so slugify(name) is sufficient.
export function cinemaSlug(name: string): string {
  return slugify(name);
}
