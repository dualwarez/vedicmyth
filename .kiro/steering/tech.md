# Tech Steering — VedicMyth

## Shape
- Static site. **No backend, no database, no runtime API calls, no paid services.**
- The corpus is JSON committed to the repo and compiled at build time into a static index.
- Vite + React 18 + TypeScript, `strict: true`.

## Why static
Every requirement in this project is compatible with static output: claims are finite, sources
are cited, and nothing needs a server. Static means zero running cost, instant page loads, and —
most importantly — **nothing can be hallucinated at request time**, because no model runs then.

## Rules
1. `data/claims/*.json` is the only content source. Nothing is fetched at runtime.
2. `scripts/validate-corpus.mjs` must pass before any build. It is also wired to a Kiro hook.
3. No `any`. Unknown input is narrowed with guards.
4. No third-party analytics that phone home with claim text.
5. Chinese/Unani/folk records are marked `depth: "curated"`; Ayurveda records are
   `depth: "verse-level"`. The UI must not imply equal depth.

## Accessibility
Body text meets WCAG AA against the paper background. Every card is keyboard reachable. Verdict is
never conveyed by colour alone — the word is always present.
