export type TextVerdict = 'supports' | 'contradicts' | 'silent';
export type PracticeVerdict = 'recommended' | 'conditional' | 'not-recommended';

/**
 * The headline answer. Separate from the three layers on purpose: a claim can be a myth
 * because the text is silent, or because the text says the opposite, or because the evidence
 * contradicts it. The layers explain *why* the verdict is what it is.
 */
export type ClaimVerdict = 'myth' | 'fact' | 'mixed' | 'unverified';

export interface Citation {
  source: string;
  tier: 1 | 2;
  url: string;
  year: number;
  locator: string;
  funding?: string;
  studyType?: string;
}

export interface Claim {
  id: string;
  depth: 'verse-level' | 'curated';
  draft: boolean;
  verdict: ClaimVerdict;
  claim: { canonical: string; variants: string[]; topic: string };
  text: { verdict: TextVerdict; citations: Citation[]; note?: string };
  practice: {
    verdict: PracticeVerdict;
    guideline: Citation | null;
    whyNot: string | null;
  };
  evidence: { grade: string | null; summary: string; studies: Citation[] };
  systems: Array<{ system: string; says: string; basis: string }>;
  recommendation: string;
  lastVerified: string | null;
}

/** Human labels. Never render colour alone — the word always appears. */
export const CLAIM_LABEL: Record<ClaimVerdict, string> = {
  myth: 'Myth',
  fact: 'Supported',
  mixed: 'Partly true',
  unverified: 'Unverified',
};

export const CLAIM_TONE: Record<ClaimVerdict, 'myth' | 'fact' | 'conditional' | 'no-source'> = {
  myth: 'myth',
  fact: 'fact',
  mixed: 'conditional',
  unverified: 'no-source',
};

export const TEXT_LABEL: Record<TextVerdict, string> = {
  supports: 'Text says this',
  contradicts: 'Text says otherwise',
  silent: 'No source found',
};

export const PRACTICE_LABEL: Record<PracticeVerdict, string> = {
  recommended: 'Recommended',
  conditional: 'Conditional',
  'not-recommended': 'Not recommended',
};
