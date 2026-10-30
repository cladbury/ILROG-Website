export function slugify(s: string): string {
  return s.normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/['’]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
export function fmtDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00Z');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}
export function initials(name: string): string {
  const parts = name.replace(/[A-Z]\.\s?/g, (m, o) => (o === 0 ? m : '')).split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || '') + (parts[parts.length - 1]?.[0] || '')).toUpperCase();
}
