# Requirement — Claim Check

**User story:** As someone who was told a health claim, I want to see what the source actually
says before I believe it, so that my decision is mine and not a forwarded message's.

## Requirement 1 — Claim intake
1. WHEN a user submits a claim as text, THE SYSTEM SHALL normalise it and extract the asserted
   entity, action and claimed effect before retrieval.
2. WHEN a user submits a claim by voice, THE SYSTEM SHALL transcribe it and display the transcript
   for correction before retrieval runs.
3. IF the transcript confidence is low, THEN THE SYSTEM SHALL ask for confirmation rather than
   guessing silently.

## Requirement 2 — Verdict
1. WHEN a claim is checked, THE SYSTEM SHALL return three independent layers: text, practice,
   evidence. It SHALL NOT collapse them into a single true/false badge.
2. WHEN the corpus contains no matching passage, THE SYSTEM SHALL return text = `silent` and state
   "no source found", and SHALL NOT generate a substitute passage.
3. WHEN text = `supports` and practice = `not-recommended`, THE SYSTEM SHALL display a "why not"
   block naming at least one concrete reason (dose, toxicity, interaction, standardisation,
   contraindication).
4. THE SYSTEM SHALL quote retrieved text verbatim, with a locator (`Charaka Sutrasthana 5/12`),
   and SHALL NOT paraphrase inside the quote block.

## Requirement 3 — Provenance
1. WHEN any card is rendered, THE SYSTEM SHALL show source name, year, tier and `last_verified`.
2. IF a source's `last_verified` is older than 12 months, THEN THE SYSTEM SHALL show an aging-source
   warning on that card.
3. THE SYSTEM SHALL display the funding source of every cited study, including industry funding.

## Requirement 4 — Ingestion guard
1. WHEN a corpus file is added, THE SYSTEM SHALL validate its declared source against the
   allowlist in `steering/sources.md`.
2. IF the source domain or type is Tier 3, THEN THE SYSTEM SHALL reject the file and report the
   violating line.
3. WHEN a corpus write is accepted, THE SYSTEM SHALL append an audit record: source, tier,
   timestamp, checker.
