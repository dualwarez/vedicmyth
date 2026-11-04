# Product Steering — VedicMyth

## What this is
A source-first checker for traditional-medicine claims. A user brings a claim they have heard
("drinking water standing up causes knee fluid"), and the tool shows what the classical text
actually says, what current practice recommends, and what the evidence supports — each with its
own provenance.

It is **not** an Ayurveda promoter, and **not** an Ayurveda debunker. It reports the gap between
text, practice and evidence, and leaves the decision with the reader.

## Voice and tone
- Neutral, never mocking. The reader is not stupid; they were misinformed by something.
- Never "you are wrong". Always "here is the source".
- Never diagnose, never prescribe, never give a dose.
- If the answer is not known: say **"no source found"**. That is a valid, respectable answer and
  the product's main trust signal.

## The three-layer verdict
Every claim renders three independent layers. They are shown separately because they often
disagree, and the disagreement is the product's value.

| Layer | Question | Values |
|---|---|---|
| Text | Does the classical text say this? | `supports` · `contradicts` · `silent` |
| Practice | Do current guidelines recommend it? | `recommended` · `conditional` · `not-recommended` |
| Evidence | What does the literature show? | grade `A`–`D` + funding note |

The most valuable state is **Text = supports, Practice = not-recommended**. Then the tool must
explain *why*: dose, toxicity, drug interaction, lack of standardisation, contraindication.

## Modes
- **Reader mode** (default): plain language, three cards, citations collapsed but one tap away.
- **Clinician mode**: citation dossier — verse locators, study identifiers, guideline sections —
  formatted to be shown to a patient or colleague.

## Boundaries
- No personalised medical advice. Every card ends with: information, not prescription; consult a
  qualified practitioner.
- No claim without a locator. If the retriever cannot find a verse, the card shows `silent` and
  says so plainly.
- Tradition coverage is honest: Ayurveda is deep (verse-level); TCM, Unani and folk traditions are
  curated summaries. Never imply equal depth.
