const STOP = new Set([
  'the', 'a', 'an', 'is', 'are', 'to', 'of', 'in', 'on', 'for', 'and', 'or', 'it', 'this', 'that',
  'does', 'do', 'se', 'me', 'mein', 'ka', 'ki', 'ko', 'hai', 'hota', 'hoti', 'kya', 'if', 'you',
  'your', 'my', 'i', 'we', 'be', 'can', 'will', 'with', 'from', 'by', 'as', 'at',
]);

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokens(s: string): string[] {
  return normalize(s)
    .split(' ')
    .filter((t) => t.length > 1 && !STOP.has(t));
}

/**
 * Deliberately generous: people do not type the canonical phrasing, they type
 * whatever they heard. Score by shared tokens, with a small bonus for substring hits.
 * Returns null when nothing clears the bar — the caller must then say "no source found"
 * rather than guess.
 */
export function score(query: string, candidates: string[]): number {
  const q = tokens(query);
  if (q.length === 0) return 0;
  const qNorm = normalize(query);

  let best = 0;
  for (const candidate of candidates) {
    const c = new Set(tokens(candidate));
    const shared = q.filter((t) => c.has(t)).length;
    let s = shared / q.length;

    const cNorm = normalize(candidate);
    if (cNorm.includes(qNorm) || qNorm.includes(cNorm)) s += 0.35;
    // partial word match helps with Hinglish spellings: "ghutna" vs "ghutno"
    s += q.filter((t) => t.length > 3 && [...c].some((w) => w.startsWith(t.slice(0, 4)))).length * 0.08;

    if (s > best) best = s;
  }
  return Math.min(best, 1);
}

export const MATCH_THRESHOLD = 0.42;
