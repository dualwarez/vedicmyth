import type { Claim } from '../corpus/types';
import { CLAIM_LABEL } from '../corpus/types';

const REASON: Record<Claim['verdict'], string> = {
  myth: 'Not supported by the source it is attributed to.',
  fact: 'Supported by the source, and consistent with current guidance.',
  mixed: 'Partly true — the text says something narrower than the claim.',
  unverified: 'We could not check this one yet. No verdict is being given.',
};

/**
 * The verdict is the first thing the eye lands on, and it is never colour alone:
 * the word is large, the reason sits next to it, and the colour only reinforces it.
 */
export function VerdictBanner({ claim }: { claim: Claim }) {
  return (
    <div className={`banner banner--${claim.verdict}`} role="status">
      <span className="banner-label">{CLAIM_LABEL[claim.verdict]}</span>
      <span className="banner-reason">{REASON[claim.verdict]}</span>
    </div>
  );
}
