import type { Claim } from './types';

/**
 * The corpus is compiled at build time. No fetch, no server, no model call at runtime —
 * which is why the page cannot invent a source.
 */
const modules = import.meta.glob<{ default: Claim }>('/data/claims/*.json', { eager: true });

export const claims: Claim[] = Object.values(modules)
  .map((m) => m.default)
  .filter((c): c is Claim => Boolean(c && c.id))
  .sort((a, b) => a.claim.canonical.localeCompare(b.claim.canonical));

export const published = claims.filter((c) => !c.draft);

export function findClaim(idOrSlug: string): Claim | undefined {
  return claims.find((c) => c.id === idOrSlug);
}
