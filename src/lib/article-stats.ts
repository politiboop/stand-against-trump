// Stats shown on article cards and headers, computed from the article's markdown body.
// Articles mix markdown links and raw HTML blocks (the vote pages), so both link forms count.

/** Distinct external URLs linked from the body. */
export function countSources(body: string): number {
  const urls = [...body.matchAll(/(?:\]\(|href=")(https?:[^)"\s]+)/g)].map((m) => m[1].replace(/&amp;/g, '&'));
  return new Set(urls).size;
}

/** Reading time in minutes at 200 words a minute, ignoring HTML tags and link targets. */
export function readMinutes(body: string): number {
  const text = body.replace(/<[^>]+>/g, ' ').replace(/\]\([^)]*\)/g, ']');
  return Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 200));
}
