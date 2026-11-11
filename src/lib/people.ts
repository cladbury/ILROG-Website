import team from '../data/team.json';

// Looks up an ILROG-NEXT name in the ILROG team roster to reuse its photo and affiliation.
const nick: Record<string, string[]> = { nick: ['nicholas'], tim: ['timothy'], jess: ['jessica'], mike: ['michael'], will: ['william'], mary: ['maryam'] };
const norm = (s: string) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();
const roster = team.flatMap((s) => s.people);

export interface Person { name: string; photo: string | null; affiliation: string | null }

export function person(name: string): Person {
  const parts = norm(name).split(' ');
  const first = parts[0], last = parts[parts.length - 1];
  const firsts = [first, ...(nick[first] || [])];
  const hit = roster.find((p) => {
    const q = norm(p.name).split(' ');
    return q[q.length - 1] === last && firsts.some((f) => q[0] === f || q[0].startsWith(f));
  });
  if (!hit) return { name, photo: null, affiliation: null };
  // pick the institution line: the line before the city/country line, else the last line
  const aff = hit.affiliation;
  const looksInst = /(Universit|Hospital|Cent(er|re)|Institut|Clinic|College|School|Health|Cancer|Medical|Rigshospitalet|Curie|Kettering|Mayo|Anderson|Hope)/i;
  const inst = aff.find((l) => looksInst.test(l) && !/^(Department|Dept|Division|Section)\b/i.test(l))
    || (aff.length >= 2 ? aff[aff.length - 2] : aff[0]) || null;
  return { name, photo: hit.photo, affiliation: inst };
}
