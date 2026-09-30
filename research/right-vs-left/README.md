# Right vs. Left: research file

Working material for the argument that the two parties are not the same. Started September 29, 2026; everything here
was built from checked sources, with gaps marked `[NEEDS SOURCE]`. This is a personal research file, not published.

## What's here

| File | What it is |
|---|---|
| `not-the-same.md` | The 40-year argument against "both sides are bad", its 30 sources, the short version, claims not to make, and claims from earlier drafts that still need sources |
| `values-vs-votes.md` | 32 roll calls on 14 topics where most Republicans voted against a stated value, each with their stated reason (rendered from data) |
| `epstein-votes.md` | Every recorded congressional action on the Epstein files, July 2025 to September 2026: 47 rows (rendered from data) |
| `identity-vs-issues.md` | Campaign emphasis vs. the big issues (in progress) |
| `data/values-votes.json` | Structured roll calls, splits, URLs, objections and values |
| `data/epstein-votes.json` | Structured Epstein chronology, discharge petitions, Trump and Johnson quotes |
| `data/build-*.cjs` | The source of truth for the JSON: edit these, not the JSON |
| `data/render.cjs` | Regenerates the two vote documents from the JSON |
| `data/check-quotes.cjs` | Checks every `quote` in a data file word for word against the saved source texts |
| `cache/` | Saved copies of every source page the research relied on, with `map.tsv` files. Local only (gitignored): these are copies of copyrighted articles. |

To rebuild after an edit:

```bash
cd research/right-vs-left/data
node build-values-votes.cjs && node build-epstein-votes.cjs && node render.cjs
node check-quotes.cjs values-votes.json && node check-quotes.cjs epstein-votes.json
```

## Standards

Same as the rest of the workspace: every number from an official record or a named outlet, every quote verbatim,
no URL that was not loaded, and the other side's best argument stated. Official roll calls come from clerk.house.gov
and senate.gov. When a claim is contested or single-sourced, the files say so.

## Corrections made while building this

- **The Epstein vote claim.** "Most Republicans voted against releasing the Epstein files" is false: the release bill
  passed 427-1. The accurate claim is 24 recorded votes and 10 Senate objections blocking release before Trump reversed.
- **Tracker, `mtg-epstein-files-feud`.** It said the bill passed "despite Trump's opposition"; he had urged a yes vote
  on November 16, 2025. Corrected with a public note (controversial-trump commit 165461e).
- **Tracker, `trump-fires-bondi-attorney-general-epstein`.** It said "the House" voted 24-19 to subpoena Bondi; that
  was the Oversight Committee. Corrected with a public note (commit bf9971a).
- **This repo, `src/content/articles/epstein-guilt.md`.** It dated Trump's reversal to November 12, the day he called it
  a trap for "stupid" Republicans. The reversal was November 16. Corrected.

## Open threads

- Claims from the early drafts that still need sources (listed at the bottom of `not-the-same.md`).
- A value statement is missing for three vote topics (child tax credit, insulin, infant formula): find a Republican
  pledge on family costs or drug prices to set against them.
- The Brennan grand jury date: the tracker says October 15, 2026; AP (September 28) says October 25. Unresolved.
- Epstein gaps: a few days of Senate floor logs, one July 2025 Financial Services vote, three untitled Judiciary
  "motion to table" votes.
