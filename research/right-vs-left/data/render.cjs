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
const nb = (x) => x.replace(/\b(S\.|H\.R\.) (\d)/g, '$1\u00a0$2'); // keep bill numbers on one line
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

<p class="vv-howto"><b>How to read each card.</b> What they voted on, in plain English, drawn from the official summaries by the Congressional Research Service. What they say, in their own words. How they voted, with the teal share of each bar showing yes votes. The reason they gave. The fine print, including procedural details and anything that complicates the story, is folded underneath. Every vote links to the official roll call.</p>

## At a glance

<div class="vv-glance">
`;
for (const t of V.votes) m += `<a class="vv-tile" href="#${t.id}"><span class="vv-tile-theme">${h(t.theme)}</span><span class="vv-tile-stat">${h(t.stat)}</span><span class="vv-tile-text">${h(t.headline)}</span></a>\n`;
m += `</div>

## The votes, one by one
`;
for (const t of V.votes) {
  m += `\n<section class="vv-card" id="${t.id}">\n<p class="vv-card-theme">${h(t.theme)}</p>\n<h3 class="vv-card-title">${h(t.headline)}</h3>\n`;
  m += `<div class="vv-what"><span class="vv-label">What they voted on</span>\n`;
  for (const b of t.bills) m += `<p><b>${nb(h(b.name))}.</b> ${nb(q(b.what))} <span class="vv-what-src">${b.sources.map((s) => `<a href="${h(s.url)}">${h(s.label)}</a>`).join(' · ')}</span></p>\n`;
  m += `</div>\n`;
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
const dash = (s) => String(s).replace(/(\d)-(\d)/g, '$1–$2');
const byId = Object.fromEntries(E.votes.map((x) => [x.id, x]));
const need = (id, test, msg) => { if (!byId[id] || !test(byId[id])) throw new Error('epstein tile: ' + msg); };
need('roll-289', (x) => /^Passed 427-1$/.test(x.result), '427-1');
need('jan21-bondi', (x) => x.R[0] === 0 && x.R[1] === 24, '0 of 24');
need('bondi-subpoena', (x) => x.R[0] === 5 && x.R[0] + x.R[1] === 24, '5 of 24');
const clintonR = E.votes.filter((x) => /Clinton contempt resolution/.test(x.question)).map((x) => x.R[0]);
if (clintonR.some((n) => n !== 25)) throw new Error('epstein tile: Clinton contempt R yes should be 25');
const SRC = [[/clerk\.house\.gov\/Votes/, 'House roll call'], [/senate\.gov\/legislative\/LIS/, 'Senate roll call'], [/CRPT-119hrpt|rules\.house\.gov/, 'Rules Committee report'],
  [/CREC-/, 'Congressional Record'], [/docs\.house\.gov/, 'Committee record'], [/dailypress\.senate\.gov/, 'Senate floor log'], [/congress\.gov/, 'Congress.gov'],
  [/appropriations\.senate\.gov/, 'Committee record'], [/oversight\.house\.gov/, 'Oversight Committee'], [/cbsnews/, 'CBS News'], [/foxnews/, 'Fox News'],
  [/newrepublic/, 'The New Republic'], [/americanbanker/, 'American Banker'], [/cnn\.com/, 'CNN']];
const srcLabel = (u) => (SRC.find(([re]) => re.test(u)) || [null, 'Source'])[1];
const chip = (x) => x.blocked ? '<span class="ev-chip ev-chip-blocked">Blocked</span>'
  : `<span class="ev-chip">${(x.result.match(/^(Each failed|Failed|Passed|Adopted|Agreed|Tabled)/) || [, 'Done'])[1].replace('Each failed', 'Failed')}</span>`;
const tags = (x) => [...(x.m || []).map((k) => `<a class="ev-tag" href="#m-${k}">${h(E.measures[k].short)}</a>`), ...(x.t || []).map((k) => `<a class="ev-tag ev-tag-term" href="#t-${k}">${h(E.terms[k].name.toLowerCase())}</a>`)].join('');
const reasonHtml = (r) => r ? `<p class="ev-reason">“${q(r.quote)}”</p><p class="vv-source">${h(r.who)} · <a href="${h(r.url)}">source</a></p>` : '';

let e = `---
title: "Every Epstein Files Vote, July 2025 to Now"
order: 7
date: 2026-09-30
summary: "Republicans did not vote against releasing the Epstein files. They voted down efforts to force release ${c.recordedVotesBlockingRelease} times and blocked it by objection ${c.senateObjections} more, then passed it 427-1 once Trump allowed it. Every vote, from the official record."
---

This list was compiled from official records: every House Clerk roll call and Rules Committee record vote for 2025 and 2026, the committee roll-call sheets on docs.house.gov, Senate roll calls, the Congressional Record and the Senate floor logs. For how this fits the larger story, see [The Epstein Files: A Timeline of Obstruction](/epstein-guilt).

**What didn't happen.** Republicans did not vote against releasing the files. When the release bill finally reached the floor on November 18, 2025, it passed 427-1, with Rep. Clay Higgins the only no, and the Senate passed it by unanimous consent.

**What did.** Before that, Republicans voted down efforts to force release or investigation ${c.recordedVotesBlockingRelease} times in recorded votes, and Republican senators blocked release measures by objection ${c.senateObjections} more times. Only four Republicans ever crossed over in those recorded votes: Rep. Ralph Norman once, Sens. Josh Hawley and Rand Paul once each, and Rep. Thomas Massie four times. It ended when Trump reversed on November 16, 2025. Democrats blocked a release measure once: Sen. Ruben Gallego objected to a Republican resolution asking the courts to unseal the records, after its author refused to pass it together with his.

<p class="vv-howto"><b>How to read this page.</b> Each entry says in plain English what the vote would have done. <span class="ev-chip ev-chip-blocked">Blocked</span> marks the ${E.votes.filter((x) => x.blocked).length} entries where the winning side stopped a step toward releasing or investigating the files. Bars show the share of each party voting yes. The tags under each entry link to a short explainer of the bill or the procedure involved, and every entry links to the official record. The fine print under each period has the exact wording.</p>

## At a glance

<div class="vv-glance">
<a class="vv-tile" href="#every-vote"><span class="vv-tile-theme">recorded votes</span><span class="vv-tile-stat">${c.recordedVotesBlockingRelease}</span><span class="vv-tile-text">Times Republicans voted down a push to release the files or investigate, before Trump reversed.</span></a>
<a class="vv-tile" href="#v5"><span class="vv-tile-theme">Senate objections</span><span class="vv-tile-stat">${c.senateObjections}</span><span class="vv-tile-text">Times a Republican senator objected to a release request. One Democrat objected once.</span></a>
<a class="vv-tile" href="#roll-289"><span class="vv-tile-theme">the final vote</span><span class="vv-tile-stat">427–1</span><span class="vv-tile-text">The House vote to release the files, two days after Trump said Republicans should.</span></a>
<a class="vv-tile" href="#every-vote"><span class="vv-tile-theme">crossovers</span><span class="vv-tile-stat">4</span><span class="vv-tile-text">Republicans who ever voted against their party in those ${c.recordedVotesBlockingRelease} votes: Norman, Hawley, Paul and Massie.</span></a>
<a class="vv-tile" href="#jan21-bondi"><span class="vv-tile-theme">Jan. 21, 2026</span><span class="vv-tile-stat">0 of 24</span><span class="vv-tile-text">Oversight Republicans who voted to go to court to enforce the subpoena on Trump's attorney general. The same day, all 25 voted to hold the Clintons in contempt.</span></a>
<a class="vv-tile" href="#bondi-subpoena"><span class="vv-tile-theme">March 4, 2026</span><span class="vv-tile-stat">5 of 24</span><span class="vv-tile-text">Oversight Republicans who voted to subpoena Attorney General Pam Bondi.</span></a>
</div>

## In their words

<div class="ev-words">
`;
for (const t of cx.trump) e += `<div class="vv-say"><span class="vv-label">Trump · ${fdate(t.date)}</span><p class="vv-quote">“${q(t.quote)}”</p><p class="vv-source">Truth Social · <a href="${h(t.url)}">source</a></p></div>\n`;
e += `<div class="vv-say"><span class="vv-label">Speaker Mike Johnson · ${fdate(cx.johnson.date)}</span><p class="vv-quote">“${q(cx.johnson.quote)}”</p><p class="vv-source">Sending the House home early for August · <a href="${h(cx.johnson.url)}">source</a></p></div>
</div>

## What they were voting on

The same few measures come up again and again. Each entry below links back here.

<div class="ev-gloss">
`;
for (const [k, x] of Object.entries(E.measures)) e += `<div class="vv-what ev-gloss-item" id="m-${k}"><p><b>${nb(h(x.name))}.</b> ${nb(q(x.what))} <span class="vv-what-src">${x.src.map(([l, u]) => `<a href="${h(u)}">${h(l)}</a>`).join(' · ')}</span></p></div>\n`;
e += `</div>

### The procedures, in plain English

<div class="ev-terms">
`;
for (const [k, x] of Object.entries(E.terms)) e += `<div class="ev-term" id="t-${k}"><p><b>${h(x.name)}.</b> ${q(x.what)} <span class="vv-what-src">${x.src.map(([l, u]) => `<a href="${h(u)}">${h(l)}</a>`).join(' · ')}</span></p></div>\n`;
e += `</div>

## Every vote
`;
for (const p of E.phases) {
  const rows = E.votes.filter((x) => x.phase === p.id);
  const nb_ = rows.filter((x) => x.blocked).length;
  e += `\n<section class="ev-phase" id="${p.id}">\n<h3 class="ev-phase-title">${h(p.title)}</h3>\n<p class="ev-phase-intro">${h(p.intro)} <span class="ev-phase-count">${rows.length} entries, ${nb_} blocked.</span></p>\n<div class="ev-list">\n`;
  for (const x of rows) {
    e += `<div class="ev-row${x.blocked ? ' ev-is-blocked' : ''}" id="${x.id}">`;
    e += `<p class="ev-head"><span class="ev-date">${fdate(x.date)} · ${h(x.body)}</span>${chip(x)}</p>`;
    e += `<p class="ev-what">${nb(h(x.plain))}</p>`;
    if (x.explain) e += `<p class="ev-explain">${nb(q(x.explain))}</p>`;
    if (x.R) e += bar('Republicans', x.R) + bar('Democrats', x.D);
    if (x.reason || x.reason2) e += `<div class="ev-why">${reasonHtml(x.reason)}${reasonHtml(x.reason2)}</div>`;
    e += `<p class="ev-foot"><span class="ev-result">${h(dash(x.result))}</span>${tags(x)}<a class="ev-record" href="${h(x.sources[0])}">${srcLabel(x.sources[0])}</a></p>`;
    e += `</div>\n`;
  }
  e += `</div>\n<details class="vv-fine"><summary>Fine print</summary>\n<ul>\n`;
  for (const x of rows) e += `<li><b>${fdate(x.date)}, ${h(x.body)}.</b> ${h(x.question)}. ${h(x.result)}.${x.R ? ` Republicans ${sp(x.R)}, Democrats ${sp(x.D)}.` : ''}${x.notes ? ' ' + h(x.notes) : ''} ${x.sources.map((u) => `<a href="${h(u)}">${srcLabel(u)}</a>`).join(' · ')}</li>\n`;
  e += `</ul>\n</details>\n</section>\n`;
}
const d1 = cx.dischargePetition1, d2 = cx.dischargePetition2;
e += `
## Discharge petitions

<div class="ev-gloss">
<div class="vv-what"><p><b>The first petition (${h(d1.measure)}).</b> Filed ${fdate(d1.filed)}; reached 218 signatures on ${fdate(d1.reached218)}. Republican signers: ${d1.republicanSigners.join(', ')}. <span class="vv-what-src"><a href="${h(d1.url)}">House Clerk</a></span></p></div>
<div class="vv-what"><p><b>The second petition (${h(d2.measure)}).</b> Filed ${fdate(d2.filed)}; ${d2.signatures} signatures as of ${fdate(d2.asOf)}. Republican signers: ${d2.republicanSigners.join(', ')}. ${h(d2.note)} <span class="vv-what-src"><a href="${h(d2.url)}">House Clerk</a></span></p></div>
</div>

## Related votes not counted above

`;
for (const r of E.related) e += `- ${fdate(r.date)}: ${r.what} (${r.urls.map((u) => `[${srcLabel(u)}](${u})`).join(', ')})\n`;
e += `
## What the record shows

January 21, 2026 is the sharpest single day. In one Oversight session every Republican voted against enforcing the
subpoena on Trump's attorney general, and all 25 then voted to hold both Clintons in contempt. Six weeks later, 19 of
24 Republicans voted against subpoenaing Bondi at all.

The Republican defense: they said the right path was their own Oversight investigation, which they did back (the DOJ
subpoena three Republicans supported, their resolution backing the probe, the contempt votes). They added protections
for victims' names and argued Democrats' add-ons were political. Senate Republicans said the requests were stunts, or
objected over unrelated fights such as Democrats' holds on Trump's nominees. Most House votes were procedural, and the
final vote was nearly unanimous. Democrats blocked a release measure once, too.

The pattern survives that. Whenever a vote would have forced the administration to release the files, Republicans
voted no. Whenever the target was a Democrat or a private figure, they voted yes. They switched on release only when
the president said they could.

## What this list may be missing

- A few days of Senate floor logs did not load; there may be additional unanimous-consent requests.
- One July 22, 2025 Financial Services vote (Tlaib amendment) could not be confirmed from an official record.
- Three House Judiciary "motion to table" sheets (Nov 18, 2025; Jan 13 and Feb 3, 2026) have no identified subject.

## Correction

September 30, 2026: an earlier version of this list recorded both July 24, 2025 Senate objections as Sen. Markwayne
Mullin blocking Sen. Ruben Gallego. The Congressional Record shows Mullin objected to Gallego's resolution, then offered
his own asking the courts to unseal the records; he objected to passing the two together, and Gallego then objected to
Mullin's alone. The count of Republican objections is unchanged, and the Democratic objection is now listed.
`;
fs.writeFileSync(path.join(OUT, 'epstein-votes.md'), e);
console.log('rendered', path.join(OUT, 'values-vs-votes.md'), 'and epstein-votes.md');
