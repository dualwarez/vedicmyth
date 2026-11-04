# Structure Steering — VedicMyth

```
/
├── .kiro/
│   ├── steering/          sources.md · product.md · tech.md · structure.md
│   ├── specs/             one folder per feature
│   └── hooks/             corpus guard, wired to scripts/validate-corpus.mjs
├── data/
│   ├── claims/            one JSON file per claim (the product's content)
│   └── sources.json       allowlist mirror of steering/sources.md, machine-readable
├── scripts/
│   └── validate-corpus.mjs   rejects anything Tier 3
├── src/
│   ├── corpus/            loader + types, build-time only
│   ├── components/        presentational
│   └── styles/
└── docs/
```

## Rules
- One claim per file. A claim file never contains prose that is not attributable to a source.
- `data/sources.json` and `steering/sources.md` must agree; the validator checks the JSON, the
  steering doc is the human explanation.
- `src/corpus/` may not import from `src/components/`.
- Draft claims live in git with `"draft": true` and are excluded from the build output.
