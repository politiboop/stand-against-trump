# Stand Against Trump — Project Guide

## What This Is

A personal research project compiling arguments against supporting Trump, organized into standalone markdown essays. Each essay is built from documented evidence — court records, government filings, investigative journalism, and the controversy database in `controversial-trump/data/controversies/`.

This is NOT a public-facing site (yet). It's a personal reference — arguments with sourcing that can be used in conversations, social media, or as the basis for future content.

## Editorial Standards

**This project is opinionated — but it must be factually airtight.**

- Every claim must be sourced to a reputable outlet or official record
- Use the same evidence standards as the tracker: court documents > government records > investigative journalism > major news outlets
- Never fabricate URLs or fill claims from memory — use `[NEEDS SOURCE]` for gaps
- When a claim has been debunked, partially debunked, or is contested, note that
- Distinguish clearly between what is proven, what is alleged, and what is circumstantial
- Source URLs must be verified before including them

**Tone:** Direct, persuasive, but evidence-based. Unlike The Civics Desk (which is neutral), this project takes a position — but the position must be supported by facts, not rhetoric.

## Structure

Essays live in the root directory as markdown files:

```
epstein-guilt.md           — Epstein file actions that imply guilt
economy-by-party.md        — Economic performance data: Democrats vs. Republicans
sexual-predator-evidence.md — Documented allegations, testimony, and rulings
```

## Data Sources

- **Primary:** `G:/git/politiboop/controversial-trump/data/controversies/*.json` — our controversy database
- **Secondary:** Court filings, government records, investigative journalism
- **Research agents:** Use web search to find and verify claims beyond what's in the database

## Anti-Leakage Protocol

Same as the tracker and Civics Desk — construct claims from provided sources, not from parametric memory. Flag `[NEEDS SOURCE]` for gaps rather than inventing citations.

## Git Configuration

- **SSH alias:** `github-politiboop`
- **User:** `politiboop`
- **Email:** `basketball469@msn.com`
- **Remote:** `git@github-politiboop:politiboop/stand-against-trump.git`
