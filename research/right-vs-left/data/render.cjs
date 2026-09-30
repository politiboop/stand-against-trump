// Renders the site articles src/content/articles/values-vs-votes.md and epstein-votes.md from the JSON data.
// Run after editing the data builders:
//   node build-values-votes.cjs && node build-epstein-votes.cjs && node render.cjs
const fs = require('fs'), path = require('path');
const V = JSON.parse(fs.readFileSync(path.join(__dirname, 'values-votes.json'), 'utf8'));
const E = JSON.parse(fs.readFileSync(path.join(__dirname, 'epstein-votes.json'), 'utf8'));
const sp = (a) => (a ? `${a[0]}–${a[1]}${a[2] ? ` (${a[2]} nv)` : ''}` : '');
const esc = (s) => String(s ?? '').replace(/\|/g, '\\|');

// ── values vs votes: a scannable page. At a glance (one finding per topic), then one card per topic.
const h = (x) => String(x ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const q = (x) => h(x).replace(/&quot;/g, '"'); // quote text inside elements keeps its marks
const MON = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
const fdate = (d) => { const [y, m, dd] = d.split('-').map(Number); return `${MON[m - 1]} ${dd}, ${y}`; };
const verdict = (r) => (/^(Rejected|Failed)/.test(r) ? 'Failed' : 'Passed');
const tally = (r) => (r.match(/(\d+)-(\d+)/) || []).slice(1, 3).join('–');
// The headline number must match the record: "a of b" = R yea of R voting on one of the topic's roll calls.
const STAT_ROLL = { 'child-tax-credit-2024': 1, 'fiscal-votes-for': 1 };
for (const t of V.votes) {
  const m = t.stat.match(/^(\d+) of (\d+)$/);
  if (!m) continue;
  const r = t.rollcalls[STAT_ROLL[t.id] ?? 0];
  if (+m[1] !== r.R[0] || +m[2] !== r.R[0] + r.R[1]) throw new Error(`${t.id}: headline ${t.stat} does not match R ${r.R}`);
}
const bar = (label, a) => {
  if (!a) return '';
  const pct = a[0] + a[1] ? Math.round((a[0] / (a[0] + a[1])) * 1000) / 10 : 0;
  return `<div class="vv-party"><span class="vv-party-name">${label}</span><span class="vv-bar" role="img" aria-label="${label}: ${a[0]} yes, ${a[1]} no"><span class="vv-bar-yes" style="width:${pct}%"></span></span><span class="vv-party-count"><b>${a[0]}</b> yes · <b>${a[1]}</b> no</span></div>`;
};

let m = `---
title: "What They Say, How They Vote"
order: 6
date: 2026-09-30
summary: "Border security, IVF, veterans, police, China, infrastructure, protecting women. On 32 roll calls, most Republicans voted against the values they campaign on, and the reason was almost never the value itself."
---

Republicans campaign on border security, families, veterans, the police and fiscal discipline. Below are 14 of those promises set against how Republicans in Congress actually voted, ${V.votes.reduce((n, t) => n + t.rollcalls.length, 0)} roll calls in all. Each one comes with the reason Republicans gave, because the comparison is only fair if their best argument is on the record.

<p class="vv-howto"><b>How to read each card.</b> What they say, in their own words. How they voted, with the teal share of each bar showing yes votes. The reason they gave. The fine print, including procedural details and anything that complicates the story, is folded underneath. Every vote links to the official roll call.</p>

## At a glance

<div class="vv-glance">
`;
for (const t of V.votes) m += `<a class="vv-tile" href="#${t.id}"><span class="vv-tile-theme">${h(t.theme)}</span><span class="vv-tile-stat">${h(t.stat)}</span><span class="vv-tile-text">${h(t.headline)}</span></a>\n`;
m += `</div>

## The votes, one by one
`;
for (const t of V.votes) {
  m += `\n<section class="vv-card" id="${t.id}">\n<p class="vv-card-theme">${h(t.theme)}</p>\n<h3 class="vv-card-title">${h(t.headline)}</h3>\n`;
  if (t.value && t.value.quote) m += `<div class="vv-say"><span class="vv-label">What they say</span><p class="vv-quote">“${q(t.value.quote)}”</p><p class="vv-source">${h(t.value.who)} · <a href="${h(t.value.url)}">source</a>${t.value.note ? ` · ${h(t.value.note)}` : ''}</p></div>\n`;
  m += `<div class="vv-votes"><span class="vv-label">How they voted</span>\n`;
  for (const r of t.rollcalls) {
    m += `<div class="vv-vote"><p class="vv-vote-head"><span class="vv-vote-date">${fdate(r.date)} · ${r.chamber}</span><span class="vv-vote-what">${h(r.plain)}</span><span class="vv-verdict vv-${verdict(r.result).toLowerCase()}">${verdict(r.result)}, ${tally(r.result)}</span></p>${bar('Republicans', r.R)}${bar('Democrats', r.D)}<p class="vv-vote-link"><a href="${h(r.url)}">Official roll call</a></p></div>\n`;
  }
  m += `</div>\n<div class="vv-why"><span class="vv-label">Their reason</span>\n`;
  for (const o of t.objections.slice(0, 2)) m += `<p class="vv-reason">“${q(o.quote)}”</p><p class="vv-source">${h(o.who)}, ${fdate(o.date)} · <a href="${h(o.url)}">source</a></p>\n`;
  m += `</div>\n<details class="vv-fine"><summary>Fine print</summary>\n<ul>\n`;
  for (const r of t.rollcalls) m += `<li><b>${fdate(r.date)}, ${r.chamber}.</b> ${h(r.question)}. ${h(r.result)}.${r.note ? ' ' + h(r.note) : ''}</li>\n`;
  for (const o of t.objections.slice(2)) m += `<li>Also: ${h(o.who)}, ${fdate(o.date)}: “${q(o.quote)}” (<a href="${h(o.url)}">source</a>)</li>\n`;
  for (const e of t.estimates || []) m += `<li>${h(e.what)}: ${h(e.figure)} (<a href="${h(e.url)}">source</a>)</li>\n`;
  for (const c of t.complications || []) m += `<li>${h(c)}</li>\n`;
  m += `<li>Confidence: ${h(t.confidence)}.</li>\n</ul>\n</details>\n</section>\n`;
}
m += `
## What this proves, and what it doesn't

Many of these were procedural votes, not final passage. Almost every no came with a reason, and some are real arguments: the gun provisions, the insurance mandates, the tie to Democrats' larger bills. Some Republicans were decisive in passing these laws: 15 Republican senators passed the gun bill, 13 House Republicans carried the infrastructure law, and Senate Republicans split evenly on the Violence Against Women Act in 2013.

The pattern survives that. When a bill that advances a value Republicans campaign on arrives with Democrats' names on it, most of them vote no, and the reason given is almost never the value itself. It is procedure, timing, an attached provision, or a warning from Trump. The border bill is the cleanest case: their own negotiator wrote it, and the man running for president asked them to kill it. The veterans' vote is the same story in miniature: 25 senators voted yes, then no on the same text, then yes again after the outcry.

Their stated values fold whenever they collide with party advantage, and the voting record lets anyone watch it happen, one roll call at a time.
`;
const OUT = path.join(__dirname, '..', '..', '..', 'src', 'content', 'articles');
fs.writeFileSync(path.join(OUT, 'values-vs-votes.md'), m);

// ── Epstein
const c = E.counts, cx = E.context;
let e = `---
title: "Every Epstein Files Vote, July 2025 to Now"
order: 7
date: 2026-09-30
summary: "Republicans did not vote against releasing the Epstein files. They voted down efforts to force release 24 times and blocked it by objection 10 more, then passed it 427-1 once Trump allowed it. Every vote, from the official record."
---

This list was compiled from official records: every House Clerk roll call and Rules Committee record vote for 2025 and 2026, the committee roll-call sheets on docs.house.gov, Senate roll calls, the Congressional Record and the Senate floor logs. For how this fits the larger story, see [The Epstein Files: A Timeline of Obstruction](/epstein-guilt).

**What didn't happen.** Republicans did not vote against releasing the files. When the release bill finally reached the floor on November 18, 2025, it passed 427-1, with Rep. Clay Higgins the only no, and the Senate passed it by unanimous consent.

**What did.** Before that, Republicans voted down efforts to force release or investigation ${c.recordedVotesBlockingRelease} times in recorded votes, and Republican senators blocked release bills by objection ${c.senateObjections} more times. Only four Republicans ever crossed over in those recorded votes: Rep. Ralph Norman once, Sens. Josh Hawley and Rand Paul once each, and Rep. Thomas Massie four times. It ended when Trump reversed on November 16, 2025.

## Trump and the Speaker, in their words

`;
for (const t of cx.trump) e += `- Trump, ${t.date}: "${t.quote}" ([source](${t.url}))\n`;
e += `- Speaker Mike Johnson, ${cx.johnson.date}, sending the House home early: "${cx.johnson.quote}" ([source](${cx.johnson.url}))\n`;
e += `\n## Every vote\n\n"Blocked" means the winning side stopped a release or investigation step. Splits are yea–nay.\n\n| Date | Where | What was voted on | Result | R | D | Blocked | Source |\n|---|---|---|---|---|---|---|---|\n`;
for (const x of E.votes) e += `| ${x.date} | ${esc(x.body)} | ${esc(x.question)}${x.notes ? `. *${esc(x.notes)}*` : ''} | ${esc(x.result)} | ${sp(x.R)} | ${sp(x.D)} | ${x.blocked ? 'yes' : ''} | ${x.sources.map((u, i) => `[${i + 1}](${u})`).join(' ')} |\n`;
e += `\n## Discharge petitions\n\n- First (${cx.dischargePetition1.measure}): filed ${cx.dischargePetition1.filed}, reached 218 on ${cx.dischargePetition1.reached218}. Republican signers: ${cx.dischargePetition1.republicanSigners.join(', ')}. ([Clerk](${cx.dischargePetition1.url}))\n- Second (${cx.dischargePetition2.measure}): filed ${cx.dischargePetition2.filed}; ${cx.dischargePetition2.signatures} signatures as of ${cx.dischargePetition2.asOf}. Republican signers: ${cx.dischargePetition2.republicanSigners.join(', ')}. ${cx.dischargePetition2.note}\n`;
e += `\n## Related votes not counted above\n\n`;
for (const r of E.related) e += `- ${r.date}: ${r.what}\n`;
e += `
## What the record shows

January 21, 2026 is the sharpest single day. In one Oversight session every Republican voted against enforcing the
subpoena on Trump's attorney general, and all 25 then voted to hold both Clintons in contempt. Six weeks later, 19 of
24 Republicans voted against subpoenaing Bondi at all.

The Republican defense: they said the right path was their own Oversight investigation, which they did back (the DOJ
subpoena three Republicans supported, their resolution backing the probe, the contempt votes). They added protections
for victims' names and argued Democrats' add-ons were political. Most House votes were procedural, and the final vote
was nearly unanimous.

The pattern survives that. Whenever a vote would have forced the administration to release the files, Republicans
voted no. Whenever the target was a Democrat or a private figure, they voted yes. They switched on release only when
the president said they could.

## What this list may be missing

- A few days of Senate floor logs did not load; there may be additional unanimous-consent requests.
- One July 22, 2025 Financial Services vote (Tlaib amendment) could not be confirmed from an official record.
- Three House Judiciary "motion to table" sheets (Nov 18, 2025; Jan 13 and Feb 3, 2026) have no identified subject.
`;
fs.writeFileSync(path.join(OUT, 'epstein-votes.md'), e);
console.log('rendered', path.join(OUT, 'values-vs-votes.md'), 'and epstein-votes.md');
