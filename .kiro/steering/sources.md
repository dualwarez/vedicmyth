# Source Policy — VedicMyth

This file governs everything the ingestion pipeline is allowed to accept. It is a **whitelist**,
not a judgment call made at runtime. If a source is not in Tier 1 or Tier 2, it does not enter the
corpus — no exceptions, no "just this once".

## Classical sources — editions we are allowed to quote

Only **public-domain editions**. Modern translations (P. Sharma's Charaka, Srikantha Murthy's
Ashtanga Hridaya, most 20th-century commentaries) are copyrighted and may be linked but never
reproduced. Every verse record stores `edition`, `translator`, `year` and `license` so the
provenance of the English text is as traceable as the Sanskrit.

| Text | Sanskrit | English translation | Status |
|---|---|---|---|
| Charaka Samhita | GRETIL / sanskritdocuments.org | Kaviratna (1890s) | public domain |
| Sushruta Samhita | GRETIL | Bhishagratna (1907–16) | public domain |
| Ashtanga Hridaya | GRETIL | edition to be identified | pending |
| Bhavaprakasha Nighantu | sanskritdocuments.org | edition to be identified | pending |

If an edition cannot be confirmed public domain, the verse is **not quoted**. It is linked, and
the card says the quote is unavailable.

## Hard rules

1. **No news articles.** Not one. Ever. A news article is a report about a source, not a source.
2. **No press releases, no company blogs, no brand "research" pages.** This is the single most
   common vector for biased claims: a study is commissioned, a PR agency pitches it, forty outlets
   copy the release, and it ranks #1. Blocking the release blocks the whole chain.
3. **No preprints** as evidence. A preprint can appear as a *disputed* note, never as support.
4. **No SEO/AEO content farms**, no listicles, no "10 benefits of X" pages.
5. **Every claim carries provenance**: source name, year, tier, and `last_verified`. No provenance,
   no display.
6. **Never use the word "unbiased" in the UI.** Adjectives are unverifiable. Provenance is not.
   Show the source; let the reader judge.

## Tier 1 — Guidelines and public health bodies (authoritative)

Accepted for the *practice* layer without further review:

- WHO (guidelines, fact sheets, model lists)
- ICMR / Ministry of AYUSH (for Ayurveda, Unani, Siddha specifics)
- NICE (UK), USPSTF (US), NHS
- National formularies and pharmacopoeias (IP, USP, BP)
- Cochrane systematic reviews

These win every disagreement with Tier 2.

## Tier 2 — Primary literature (accepted with metadata)

- Systematic reviews and meta-analyses in peer-reviewed journals
- RCTs registered in CTRI / ClinicalTrials.gov / ISRCTN
- Cohort and case-control studies

Each record stores: study type, sample size, **funding source**, conflict-of-interest statement,
and publication year. Industry funding is recorded and displayed, never hidden and never
auto-rejected — the reader sees who paid.

## Tier 3 — Never evidence (may exist only as a *disputed claim* record)

News articles · press releases · brand white papers · sponsored content · preprints · conference
abstracts without data · anecdote · social media.

A Tier 3 item may be stored **only** as the thing being checked (i.e. "this claim circulates
online"), never as support for a claim.

## Conflict resolution

When a Tier 1 guideline and a Tier 2 study disagree, display both, and the guideline decides the
*practice* verdict. This is deliberate: guidelines already weigh the body of evidence, including
studies the reader will never see.

## Freshness

- Guidelines re-checked monthly; `last_verified` shown on every card.
- If `last_verified` is older than 12 months, the card displays an "aging source" warning.
- The audit log records every corpus write: source, tier, timestamp, and the check that allowed it.
