import { useMemo, useState } from 'react';
import { ClaimView } from './components/ClaimView';
import { claims } from './corpus/load';
import { MATCH_THRESHOLD, score } from './match';

export default function App() {
  const [query, setQuery] = useState('');

  const result = useMemo(() => {
    if (!query.trim()) return { kind: 'idle' as const, claim: claims[0] };
    let best: { claim: (typeof claims)[number]; s: number } | null = null;
    for (const claim of claims) {
      const s = score(query, [claim.claim.canonical, ...claim.claim.variants]);
      if (!best || s > best.s) best = { claim, s };
    }
    if (best && best.s >= MATCH_THRESHOLD) return { kind: 'match' as const, claim: best.claim };
    return { kind: 'miss' as const, claim: null };
  }, [query]);

  return (
    <div className="shell">
      <header className="masthead">
        <h1 className="wordmark">
          Vedic<span>Myth</span>
        </h1>
        <p>What the source actually says</p>
      </header>

      <section className="checker">
        <label htmlFor="claim-input">Check a claim you have heard</label>
        <input
          id="claim-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. khade hokar paani peene se paani ghutno me jata hai"
          autoComplete="off"
        />
        <p className="hint">
          Type it however you heard it. The tool looks for the claim, not the exact words.
        </p>
      </section>

      {result.kind === 'miss' && (
        <article className="claim">
          <div className="claim-eyebrow">
            <span>no match</span>
          </div>
          <h1>We do not have this claim yet.</h1>
          <div className="layer">
            <div className="empty">
              <strong>No source found — and no entry either.</strong>
              <p>
                This is deliberate. We would rather show nothing than guess, paraphrase, or
                invent a citation. If this claim is circulating, it gets added only after a
                human pins it to a verse locator or a guideline.
              </p>
            </div>
          </div>
        </article>
      )}

      {result.claim && <ClaimView claim={result.claim} />}

      <p className="disclaimer">
        Every entry names its source, its tier and the date it was last checked. Tier 3 material —
        news articles, press releases, brand pages — is never accepted as evidence, only recorded
        as the claim being checked.
      </p>
    </div>
  );
}
