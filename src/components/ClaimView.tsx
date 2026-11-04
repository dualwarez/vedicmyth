import type { Claim } from '../corpus/types';
import { PRACTICE_LABEL, TEXT_LABEL } from '../corpus/types';
import { VerdictBanner } from './VerdictBanner';
import { VerdictChip } from './VerdictChip';
import { VerseBlock } from './VerseBlock';

function toneFor(claim: Claim): 'myth' | 'fact' | 'no-source' | 'conditional' {
  if (claim.text.verdict === 'silent') return 'no-source';
  if (claim.text.verdict === 'contradicts') return 'myth';
  return claim.practice.verdict === 'recommended' ? 'fact' : 'conditional';
}

export function ClaimView({ claim }: { claim: Claim }) {
  const shareText = `${claim.claim.canonical}\n\n${claim.text.verdict === 'silent' ? 'No source found.' : TEXT_LABEL[claim.text.verdict]}\n${window.location.origin}/c/${claim.id}`;

  const share = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener');
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      /* clipboard blocked — the button simply does nothing visible */
    }
  };

  return (
    <article className="claim">
      <div className="claim-eyebrow">
        <span>{claim.claim.topic}</span>
        <span>·</span>
        <span>{claim.depth === 'verse-level' ? 'verse-level' : 'curated summary'}</span>
      </div>

      <h1>{claim.claim.canonical}</h1>

      <div className="verdict-slot">
        <VerdictBanner claim={claim} />
      </div>

      {claim.draft && <div className="draft-flag">Draft — not verified, not published</div>}

      <section className="layer">
        <div className="layer-head">
          <span className="layer-label">01 · Text</span>
          <VerdictChip tone={toneFor(claim)} label={TEXT_LABEL[claim.text.verdict]} />
        </div>

        {claim.text.citations.length > 0 ? (
          claim.text.citations.map((c) => (
            <VerseBlock
              key={c.locator}
              locator={c.locator}
              quote={claim.text.note ?? ''}
              citation={c}
            />
          ))
        ) : (
          <div className="empty">
            <strong>No verse with this content.</strong>
            <p>{claim.text.note}</p>
          </div>
        )}
      </section>

      <section className="layer">
        <div className="layer-head">
          <span className="layer-label">02 · Practice</span>
          <VerdictChip tone="conditional" label={PRACTICE_LABEL[claim.practice.verdict]} />
        </div>

        {claim.practice.guideline ? (
          <div className="source-line">
            <span className="source-tier">Tier {claim.practice.guideline.tier}</span>
            <span className="source-name">{claim.practice.guideline.source}</span>
            <span className="meta">
              {claim.practice.guideline.year} · {claim.practice.guideline.locator}
            </span>
            <a className="source-link" href={claim.practice.guideline.url}>
              source ↗
            </a>
          </div>
        ) : (
          <div className="empty">
            <strong>No current guideline recorded.</strong>
            <p>Practice layer is empty until a Tier 1 guideline is attached.</p>
          </div>
        )}

        {claim.practice.whyNot && (
          <div className="why-not">
            <strong>Why not, even if the text says yes</strong>
            <p>{claim.practice.whyNot}</p>
          </div>
        )}
      </section>

      <section className="layer">
        <div className="layer-head">
          <span className="layer-label">03 · Evidence</span>
          <VerdictChip
            tone={claim.evidence.grade ? 'fact' : 'no-source'}
            label={claim.evidence.grade ? `Grade ${claim.evidence.grade}` : 'No studies recorded'}
          />
        </div>

        {claim.evidence.studies.length > 0 ? (
          claim.evidence.studies.map((s) => (
            <div className="source-line" key={s.locator}>
              <span className="source-tier">Tier {s.tier}</span>
              <span className="source-name">{s.source}</span>
              <span className="meta">
                {s.studyType ? `${s.studyType} · ` : ''}
                {s.year} · {s.locator}
                {s.funding ? ` · funding: ${s.funding}` : ''}
              </span>
              <a className="source-link" href={s.url}>
                source ↗
              </a>
            </div>
          ))
        ) : (
          <div className="empty">
            <strong>No studies recorded.</strong>
            <p>{claim.evidence.summary}</p>
          </div>
        )}
      </section>

      {claim.recommendation && (
        <div className="recommendation">
          <span className="layer-label">In one line</span>
          <p>{claim.recommendation}</p>
        </div>
      )}

      <div className="actions">
        <button className="btn btn--primary" onClick={share}>
          Send on WhatsApp
        </button>
        <button className="btn" onClick={copy}>
          Copy
        </button>
      </div>

      <p className="disclaimer">
        <strong>Information, not prescription.</strong> This page shows what sources say. It does
        not diagnose, does not recommend a dose, and is not a substitute for a qualified
        practitioner.
        {claim.lastVerified ? ` Last verified ${claim.lastVerified}.` : ''}
      </p>
    </article>
  );
}
