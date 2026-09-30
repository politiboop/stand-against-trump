// Writes epstein-votes.json: every recorded congressional action on releasing or investigating the Epstein files,
// July 2025 - Sept 30, 2026. Compiled 2026-09-30 from official records by two research agents (House floor and Rules:
// every Clerk roll call and Rules record vote checked; committees: docs.house.gov roll-call sheets; Senate: roll calls,
// Congressional Record and Senate Press Gallery floor logs). Saved texts: ../cache/ea and ../cache/eb (local only).
// blocked: true means the winning side stopped a release or investigation step. R/D are [yea, nay] (nv noted in notes).
const fs = require('fs');
const HOU = (y, n) => `https://clerk.house.gov/Votes/${y}${String(n).padStart(3, '0')}`;
const RULES = {
  jul14: 'https://rules.house.gov/sites/evo-subsites/rules.house.gov/files/documents/rulesreport07142025.pdf',
  jul17: 'https://www.govinfo.gov/content/pkg/CRPT-119hrpt209/html/CRPT-119hrpt209.htm',
  sep2: 'https://www.govinfo.gov/content/pkg/CRPT-119hrpt232/html/CRPT-119hrpt232.htm',
  sep9: 'https://www.govinfo.gov/content/pkg/CRPT-119hrpt255/html/CRPT-119hrpt255.htm',
  sep15: 'https://www.govinfo.gov/content/pkg/CRPT-119hrpt298/html/CRPT-119hrpt298.htm',
  nov17: 'https://www.govinfo.gov/content/pkg/CRPT-119hrpt380/html/CRPT-119hrpt380.htm',
};
const OV = 'https://docs.house.gov/meetings/GO';
const v = (date, body, question, result, R, D, blocked, sources, notes = '') => ({ date, body, question, result, R, D, blocked, sources: [].concat(sources), notes });

const votes = [
  v('2025-07-10', 'Senate Appropriations', 'Van Hollen-Durbin amendment: DOJ must preserve Epstein records and report to Congress', 'Adopted by voice vote', null, null, false, 'https://appropriations.senate.gov/download/fy26-commerce-justice-science-adopted-amendments&download=1', 'Described as unanimous (Scripps, Van Hollen). The bill never passed.'),
  v('2025-07-14', 'House Rules', 'Record vote 149: allow a floor vote on the Khanna release amendment to H.R. 3633', 'Failed 5-7', [1, 7], [4, 0], true, RULES.jul14, 'Norman the only R yes; Roy absent.'),
  v('2025-07-14', 'House Rules', 'Record vote 150: bring H.Res. 577 (demanding release) to the floor', 'Failed 4-8', [0, 8], [4, 0], true, RULES.jul14),
  v('2025-07-15', 'House floor', 'Roll 194: previous question on H.Res. 580, which shut out the release amendment', 'Passed 211-210', [211, 0], [0, 210], true, HOU(2025, 194), 'Procedural. Source of the claim that Republicans "voted against releasing" the files. 9 R not voting, including Massie.'),
  v('2025-07-17', 'Senate floor (unanimous consent)', 'Gallego request to pass S.Res. 325 (release the files)', 'Objection: Sen. Markwayne Mullin', null, null, true, 'https://dailypress.senate.gov/thursday-july-17-2025/'),
  v('2025-07-17', 'House Rules', 'Record vote 156: consider the binding bill H.R. 4405 instead of the GOP nonbinding H.Res. 589', 'Failed 4-9', [0, 9], [4, 0], true, RULES.jul17),
  v('2025-07-17', 'House Rules', 'Record votes 157 and 158: appeals of the chair\'s rulings', 'Each failed 4-9', [0, 9], [4, 0], true, RULES.jul17, 'Procedural; counted as two votes.'),
  v('2025-07-17', 'House Rules', 'Record vote 159: report the rule deeming the GOP nonbinding H.Res. 589 adopted', 'Adopted 9-4', [9, 0], [0, 4], false, RULES.jul17, 'The rule was never called up; tabled Sept 3.'),
  v('2025-07-17', 'House floor', 'Roll 202: previous question on H.Res. 590, which shut out consideration of H.R. 4405', 'Passed 218-211', [218, 0], [0, 211], true, [HOU(2025, 202), 'https://www.govinfo.gov/content/pkg/CREC-2025-07-17/pdf/CREC-2025-07-17-house.pdf'], 'Procedural. Epstein link is in the Congressional Record (McGovern); no news story found on this roll.'),
  v('2025-07-22', 'Oversight subcommittee (Government Operations)', 'Burchett motion to subpoena Ghislaine Maxwell', 'Agreed by voice vote', null, null, false, 'https://oversight.house.gov/release/chairman-comer-subpoenas-ghislaine-maxwell-for-deposition-at-federal-prison/'),
  v('2025-07-23', 'Oversight subcommittee (Federal Law Enforcement)', 'Garcia amendment: widen the DOJ request to any president\'s communications, including Trump\'s', 'Failed 5-5', [0, 5], [5, 0], true, `${OV}/GO33/20250723/118526/CRPT-119-GO33-Vote001-20250723.pdf`),
  v('2025-07-23', 'Oversight subcommittee (Federal Law Enforcement)', 'Mace amendment: limit the request to "credible" files', 'Failed 5-5', [5, 0], [0, 5], false, `${OV}/GO33/20250723/118526/CRPT-119-GO33-Vote002-20250723.pdf`),
  v('2025-07-23', 'Oversight subcommittee (Federal Law Enforcement)', 'Summer Lee motion to subpoena DOJ for the Epstein files', 'Passed 8-2', [3, 2], [5, 0], false, [`${OV}/GO33/20250723/118526/CRPT-119-GO33-Vote003-20250723.pdf`, 'https://www.cbsnews.com/news/house-committee-votes-to-subpoena-justice-department-for-epstein-files/'], 'R yes: Mace, Perry, Jack. R no: Higgins, Biggs. Subpoena issued Aug 5.'),
  v('2025-07-23', 'Oversight subcommittee (Federal Law Enforcement)', 'Perry motion to subpoena the Clintons, Comey, Lynch, Holder, Garland, Mueller, Barr, Sessions, Gonzales', 'Agreed by voice vote', null, null, false, 'https://oversight.house.gov/release/chairman-comer-subpoenas-bill-and-hillary-clinton-former-attorneys-general-and-former-fbi-directors-in-epstein-investigation/', 'Transcript records "[Chorus of noes.]"; Comer\'s office called it unanimous.'),
  v('2025-07-24', 'Senate floor (unanimous consent)', 'Gallego requests to pass S.Res. 325 and S.Res. 335', 'Objection twice: Sen. Markwayne Mullin', null, null, true, 'https://dailypress.senate.gov/thursday-july-24-2025/', 'Counted as two objections.'),
  v('2025-07-30', 'Senate floor (unanimous consent)', 'Merkley request to pass S. 2557 (Senate Epstein Files Transparency Act)', 'Objection: Sen. John Barrasso', null, null, true, 'https://www.govinfo.gov/content/pkg/CREC-2025-07-30/html/CREC-2025-07-30-pt1-PgS4888.htm'),
  v('2025-08-02', 'Senate floor (unanimous consent)', 'Four requests (Merkley, Blumenthal, Van Hollen x2)', 'Objection four times: Sen. John Barrasso', null, null, true, 'https://www.govinfo.gov/content/pkg/CREC-2025-08-02/html/CREC-2025-08-02-pt1-PgS5482.htm', 'Counted as four objections.'),
  v('2025-09-02', 'House Rules', 'Record vote 165: deem the attorney general in contempt if DOJ does not comply', 'Failed 4-9', [0, 9], [4, 0], true, RULES.sep2),
  v('2025-09-02', 'House Rules', 'Record vote 166: consider H.R. 4405', 'Failed 4-9', [0, 9], [4, 0], true, RULES.sep2),
  v('2025-09-02', 'House Rules', 'Record vote 169: require the ranking member\'s consent before redactions', 'Failed 4-9', [0, 9], [4, 0], true, RULES.sep2),
  v('2025-09-02', 'House Rules', 'Record vote 170: report H.Res. 672 (rule deeming the GOP\'s H.Res. 668 adopted)', 'Adopted 9-4', [9, 0], [0, 4], false, RULES.sep2),
  v('2025-09-03', 'House floor', 'Roll 221: previous question on H.Res. 672, which shut out H.R. 4405', 'Passed 212-209', [212, 0], [0, 209], true, HOU(2025, 221), 'Procedural.'),
  v('2025-09-03', 'House floor', 'Roll 222: adopt H.Res. 672, which also adopted the GOP\'s H.Res. 668 backing the Oversight probe', 'Passed 212-208, 1 present', [212, 0], [0, 208], false, [HOU(2025, 222), 'https://www.foxnews.com/politics/house-moves-expose-epstein-files-authorizes-oversight-probe'], 'The only floor vote on the GOP\'s own Epstein resolution; bundled with unrelated items.'),
  v('2025-09-09', 'House Rules', 'Record vote 177: consider H.R. 4405', 'Failed 4-8', [0, 8], [4, 0], true, [RULES.sep9, 'https://newrepublic.com/post/200213/list-house-republicans-voted-kill-epstein-bill']),
  v('2025-09-09', 'Financial Services subcommittee (National Security/Illicit Finance)', 'Motion to table the Beatty-Tlaib motion to subpoena Treasury for Epstein financial records', 'Tabled, about 8-5', [8, 0], [0, 5], true, 'https://www.americanbanker.com/news/house-committee-gop-blocks-epstein-subpoena-to-treasury', 'No official roll call posted; tally reconstructed from names in American Banker.'),
  v('2025-09-10', 'House Appropriations', 'Morelle motion: require the AG to give the committee all Epstein and Maxwell materials', 'Failed 28-33', [0, 33], [28, 0], true, 'https://docs.house.gov/meetings/AP/AP00/20250910/118544/HMKP-119-AP00-20250910-SD004.pdf'),
  v('2025-09-10', 'House Appropriations', 'Dean amendment: no funds to withhold, redact or delay non-classified Epstein-Maxwell records', 'Failed 28-34', [0, 34], [28, 0], true, 'https://docs.house.gov/meetings/AP/AP00/20250910/118544/HMKP-119-AP00-20250910-SD004.pdf'),
  v('2025-09-10', 'Senate floor', 'Roll 512: table Schumer amendment 3849 to the defense bill directing the AG to publish the Epstein documents', 'Tabled 51-49', [51, 2], [0, 45], true, 'https://www.senate.gov/legislative/LIS/roll_call_votes/vote1191/vote_119_1_00512.htm', 'R no: Hawley, Paul. Independents 0-2.'),
  v('2025-09-15', 'House Rules', 'Record vote 189: consider H.R. 4405', 'Failed 2-8', [0, 8], [2, 0], true, RULES.sep15),
  v('2025-09-17', 'House Judiciary', 'Table Raskin motion to subpoena the CEOs of JPMorgan, BNY Mellon, Bank of America and Deutsche Bank', 'Tabled 20-19', [20, 1], [0, 18], true, 'https://docs.house.gov/meetings/JU/JU00/20250917/118612/CRPT-119-JU00-Vote001-20250917.pdf', 'Massie the only R no. Motion subjects from CNN/NBC/The Hill coverage.'),
  v('2025-09-17', 'House Judiciary', 'Table Scanlon motion to subpoena Treasury Secretary Bessent', 'Tabled 23-16', [23, 1], [0, 15], true, 'https://docs.house.gov/meetings/JU/JU00/20250917/118612/CRPT-119-JU00-Vote002-20250917.pdf'),
  v('2025-09-17', 'House Judiciary', 'Table Swalwell motion to subpoena Deputy FBI Director Bongino', 'Tabled 21-16', [21, 1], [0, 15], true, 'https://docs.house.gov/meetings/JU/JU00/20250917/118612/CRPT-119-JU00-Vote003-20250917.pdf'),
  v('2025-09-17', 'House Judiciary', 'Table Crockett motion to subpoena the Bureau of Prisons over Maxwell\'s transfer', 'Tabled 21-16', [21, 1], [0, 15], true, 'https://docs.house.gov/meetings/JU/JU00/20250917/118612/CRPT-119-JU00-Vote004-20250917.pdf'),
  v('2025-11-17', 'House Rules', 'Record vote 208: guarantee the discharge route if the suspension vote failed', 'Failed 4-9', [0, 9], [4, 0], true, RULES.nov17),
  v('2025-11-17', 'House Rules', 'Record vote 210: report H.Res. 879 (rule that tabled the discharge petition\'s rule once the bill passed)', 'Adopted 9-4', [9, 0], [0, 4], false, RULES.nov17),
  v('2025-11-18', 'Senate floor (unanimous consent)', 'Schumer: pass H.R. 4405 on arrival from the House', 'Agreed without objection', null, null, false, 'https://www.govinfo.gov/content/pkg/CREC-2025-11-18/pdf/CREC-2025-11-18-senate.pdf'),
  v('2025-11-18', 'House floor', 'Roll 289: pass H.R. 4405, the Epstein Files Transparency Act', 'Passed 427-1', [216, 1], [211, 0], false, HOU(2025, 289), 'Higgins (R-LA) the only no. Trump had reversed Nov 16.'),
  v('2025-11-18', 'House floor', 'Roll 291: adopt H.Res. 879', 'Passed 217-210', [216, 0], [1, 210], false, HOU(2025, 291), 'Weak Epstein link: section 8 tabled the discharge rule after passage.'),
  v('2025-11-19', 'Senate', 'H.R. 4405 passed under the Nov 18 order; signed by Trump the same day (P.L. 119-38)', 'Passed by unanimous consent', null, null, false, 'https://www.congress.gov/bill/119th-congress/house-bill/4405/all-actions'),
  v('2026-01-21', 'House Oversight', 'Lee amendment: sue to enforce the Aug 5 subpoena against AG Bondi instead of Clinton contempt', 'Failed 19-24', [0, 24], [19, 0], true, `${OV}/GO00/20260121/118877/CRPT-119-GO00-Vote001-20260121.pdf`, 'ABC reported a voice vote; the official record shows a recorded vote.'),
  v('2026-01-21', 'House Oversight', 'Min amendment: civil enforcement against Bill Clinton instead of criminal contempt', 'Failed 19-25', [0, 25], [19, 0], false, `${OV}/GO00/20260121/118877/CRPT-119-GO00-Vote002-20260121.pdf`),
  v('2026-01-21', 'House Oversight', 'Report the Bill Clinton contempt resolution', 'Adopted 34-8, 2 present', [25, 0], [9, 8], false, `${OV}/GO00/20260121/118877/CRPT-119-GO00-Vote003-20260121.pdf`),
  v('2026-01-21', 'House Oversight', 'Report the Hillary Clinton contempt resolution', 'Adopted 28-15, 1 present', [25, 0], [3, 15], false, `${OV}/GO00/20260121/118877/CRPT-119-GO00-Vote004-20260121.pdf`, 'The Clintons then agreed to testify; no floor vote.'),
  v('2026-02-05', 'Senate floor (unanimous consent)', 'Schumer request to adopt S.Res. 597 authorizing lawsuits over DOJ noncompliance', 'Objection: Sen. John Barrasso', null, null, true, 'https://www.govinfo.gov/content/pkg/CREC-2026-02-05/html/CREC-2026-02-05-pt1-PgS501-2.htm'),
  v('2026-03-03', 'Senate floor (unanimous consent)', 'Wyden request to pass S. 2746, Produce Epstein Treasury Records Act', 'Objection: Sen. Mike Crapo', null, null, true, 'https://www.govinfo.gov/content/pkg/CREC-2026-03-03/html/CREC-2026-03-03-pt1-PgS748-2.htm'),
  v('2026-03-04', 'House Oversight', 'Mace motion to subpoena Attorney General Pam Bondi', 'Passed 24-19', [5, 19], [19, 0], false, `${OV}/GO00/20260304/119003/CRPT-119-GO00-Vote002-20260304.pdf`, 'R yes: Cloud, Mace, Perry, Burchett, Boebert. Bondi later skipped her April 14 deposition; no contempt vote followed.'),
  v('2026-09-15', 'House Oversight', 'Report the Leon Black contempt resolution (defied Epstein-probe subpoenas)', 'Adopted 41-0', [20, 0], [21, 0], false, `${OV}/GO00/20260915/119567/CRPT-119-GO00-Vote001-20260915.pdf`, 'Comer says the House adopted it by unanimous consent Sept 16; not checked against the Clerk.'),
];

const related = [
  { date: '2025-11-18', what: 'House rejected censuring Del. Stacey Plaskett over 2019 texts with Epstein, 209-214 (roll 297); motion to refer to Ethics failed 213-214 (roll 293)', urls: [HOU(2025, 297), HOU(2025, 293)] },
  { date: '2026-07-29', what: 'Senate adopted Rosen\'s S.Res. 608 opposing clemency for Ghislaine Maxwell by unanimous consent', urls: ['https://dailypress.senate.gov/'] },
];

const context = {
  dischargePetition1: { number: 9, measure: 'H.Res. 581', filed: '2025-09-02', reached218: '2025-11-12', republicanSigners: ['Massie', 'Mace', 'Boebert', 'Greene'], url: 'https://clerk.house.gov/DischargePetition/2025090209' },
  dischargePetition2: { number: 27, measure: 'H.Res. 1430 (second Epstein Files Transparency Act)', filed: '2026-08-31', signatures: 216, asOf: '2026-09-16', republicanSigners: ['Massie', 'Mace', 'Norman', 'Fitzpatrick'], note: 'No floor vote; the House has cast no Epstein floor vote in 2026.' },
  trump: [
    { date: '2025-07-16', quote: "Their new SCAM is what we will forever call the Jeffrey Epstein Hoax, and my PAST supporters have bought into this \"bullshit,\" hook, line, and sinker.", url: 'https://www.presidency.ucsb.edu/documents/truth-social-posts-july-16-2025' },
    { date: '2025-11-12', quote: 'Only a very bad, or stupid, Republican would fall into that trap.', url: 'https://www.presidency.ucsb.edu/documents/truth-social-posts-november-12-2025' },
    { date: '2025-11-16', quote: 'House Republicans should vote to release the Epstein files, because we have nothing to hide', url: 'https://www.presidency.ucsb.edu/documents/truth-social-posts-november-16-2025' },
  ],
  johnson: { date: '2025-07-22', quote: "There's no purpose for Congress to push an administration to do something that they're already doing.", url: 'https://www.cbsnews.com/news/johnson-house-recess-epstein-files-vote/' },
};

const recorded = votes.filter((x) => x.R && x.blocked);
const blockedRecorded = recorded.reduce((n, x) => n + (/157 and 158/.test(x.question) ? 2 : 1), 0);
const ucObjections = votes.filter((x) => !x.R && x.blocked).reduce((n, x) => n + (/twice/.test(x.result) ? 2 : /four times/.test(x.result) ? 4 : 1), 0);
fs.writeFileSync(__dirname + '/epstein-votes.json', JSON.stringify({ updated: '2026-09-30', counts: { rows: votes.length, recordedVotesBlockingRelease: blockedRecorded, senateObjections: ucObjections }, votes, related, context }, null, 2) + '\n');
console.log('wrote epstein-votes.json:', votes.length, 'rows |', blockedRecorded, 'recorded votes blocking release |', ucObjections, 'Senate objections');
