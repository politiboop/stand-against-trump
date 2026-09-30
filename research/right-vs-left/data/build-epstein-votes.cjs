// Writes epstein-votes.json: every recorded congressional action on releasing or investigating the Epstein files,
// July 2025 - Sept 30, 2026. Compiled 2026-09-30 from official records by two research agents (House floor and Rules:
// every Clerk roll call and Rules record vote checked; committees: docs.house.gov roll-call sheets; Senate: roll calls,
// Congressional Record and Senate Press Gallery floor logs). Saved texts: ../cache/ea, ../cache/eb and ../cache/ec
// (local only); bill texts and CRS summaries for every measure: ../cache/crs119.
// blocked: true means the winning side stopped a release or investigation step. R/D are [yea, nay] (nv noted in notes).
// objR/objD count unanimous-consent objections by Republican and Democratic senators.
// The last argument holds the presentation: a plain-English label, the measures and procedures involved (keys of
// MEASURES and TERMS below), an optional one-line explanation, and for objections the reason the objector gave.
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
const CR = {
  h0715: 'https://www.govinfo.gov/content/pkg/CREC-2025-07-15/pdf/CREC-2025-07-15-house.pdf',
  h0717: 'https://www.govinfo.gov/content/pkg/CREC-2025-07-17/pdf/CREC-2025-07-17-house.pdf',
  h0903: 'https://www.govinfo.gov/content/pkg/CREC-2025-09-03/pdf/CREC-2025-09-03-house.pdf',
  s0717: 'https://www.govinfo.gov/content/pkg/CREC-2025-07-17/pdf/CREC-2025-07-17-senate.pdf',
  s0724: 'https://www.govinfo.gov/content/pkg/CREC-2025-07-24/pdf/CREC-2025-07-24-senate.pdf',
  s0730: 'https://www.govinfo.gov/content/pkg/CREC-2025-07-30/html/CREC-2025-07-30-pt1-PgS4888.htm',
  s0802a: 'https://www.govinfo.gov/content/pkg/CREC-2025-08-02/html/CREC-2025-08-02-pt1-PgS5482.htm',
  s0802b: 'https://www.govinfo.gov/content/pkg/CREC-2025-08-02/html/CREC-2025-08-02-pt1-PgS5484.htm',
  s0802c: 'https://www.govinfo.gov/content/pkg/CREC-2025-08-02/html/CREC-2025-08-02-pt1-PgS5502-4.htm',
  s0205: 'https://www.govinfo.gov/content/pkg/CREC-2026-02-05/html/CREC-2026-02-05-pt1-PgS501-2.htm',
  s0303: 'https://www.govinfo.gov/content/pkg/CREC-2026-03-03/html/CREC-2026-03-03-pt1-PgS748-2.htm',
};
const OV = 'https://docs.house.gov/meetings/GO';
const v = (date, body, question, result, R, D, blocked, sources, notes = '', o = {}) => ({ date, body, question, result, R, D, blocked, sources: [].concat(sources), notes, ...o });

const votes = [
  // ── July 2025
  v('2025-07-10', 'Senate Appropriations', 'Van Hollen-Durbin amendment: DOJ must preserve Epstein records and report to Congress', 'Adopted by voice vote', null, null, false, 'https://appropriations.senate.gov/download/fy26-commerce-justice-science-adopted-amendments&download=1', 'Described as unanimous (Scripps, Van Hollen). The bill never passed.',
    { plain: 'Require the Justice Department to keep the Epstein records and report to Congress', m: ['vhd'] }),
  v('2025-07-14', 'House Rules', 'Record vote 149: allow a floor vote on the Khanna release amendment to H.R. 3633', 'Failed 5-7', [1, 7], [4, 0], true, RULES.jul14, 'Norman the only R yes; Roy absent.',
    { plain: 'Allow a House vote on the Khanna amendment to release the files', m: ['khanna50'], t: ['rules'] }),
  v('2025-07-14', 'House Rules', 'Record vote 150: bring H.Res. 577 (demanding release) to the floor', 'Failed 4-8', [0, 8], [4, 0], true, RULES.jul14, '',
    { plain: 'Bring up the Democrats\' resolution demanding release', m: ['hres577'], t: ['rules'] }),
  v('2025-07-15', 'House floor', 'Roll 194: previous question on H.Res. 580, which shut out the release amendment', 'Passed 211-210', [211, 0], [0, 210], true, [HOU(2025, 194), CR.h0715], 'Procedural. Source of the claim that Republicans "voted against releasing" the files. 9 R not voting, including Massie.',
    { id: 'roll-194', plain: 'Shut off the attempt to add the release amendment to a rule', m: ['khanna50', 'rules'], t: ['pq'],
      explain: 'Democrats said that if this vote failed, they would change the rule to allow a vote on the Khanna amendment. It passed by one vote.' }),
  v('2025-07-17', 'Senate floor (unanimous consent)', 'Gallego request to pass S.Res. 325 (release the files)', 'Objection: Sen. Markwayne Mullin', null, null, true, ['https://dailypress.senate.gov/thursday-july-17-2025/', CR.s0717], '', {
    plain: 'Pass Gallego\'s resolution asking the Justice Department to release the files', m: ['sres325'], t: ['uc'], objR: 1,
    reason: { who: 'Sen. Markwayne Mullin (R)', quote: 'this is nothing but political theater', url: CR.s0717 } }),
  v('2025-07-17', 'House Rules', 'Record vote 156: consider the binding bill H.R. 4405 instead of the GOP nonbinding H.Res. 589', 'Failed 4-9', [0, 9], [4, 0], true, RULES.jul17, '',
    { plain: 'Swap the Republican resolution for a vote on the release bill', m: ['eft', 'hres589'], t: ['rules'] }),
  v('2025-07-17', 'House Rules', 'Record votes 157 and 158: appeals of the chair\'s rulings', 'Each failed 4-9', [0, 9], [4, 0], true, RULES.jul17, 'Procedural; counted as two votes.',
    { plain: 'Appeal the chair\'s rulings against Democrats\' motions (two votes)', t: ['rules'] }),
  v('2025-07-17', 'House Rules', 'Record vote 159: report the rule deeming the GOP nonbinding H.Res. 589 adopted', 'Adopted 9-4', [9, 0], [0, 4], false, RULES.jul17, 'The rule was never called up; tabled Sept 3.',
    { plain: 'Send the rule adopting the Republican resolution to the floor', m: ['hres589'], t: ['rules'], explain: 'The rule never came to the floor; it was set aside in September.' }),
  v('2025-07-17', 'House floor', 'Roll 202: previous question on H.Res. 590, which shut out consideration of H.R. 4405', 'Passed 218-211', [218, 0], [0, 211], true, [HOU(2025, 202), CR.h0717], 'Procedural. Epstein link is in the Congressional Record (McGovern); no news story found on this roll.',
    { plain: 'Shut off the attempt to bring up the release bill', m: ['eft', 'rules'], t: ['pq'],
      explain: 'The rule was for the spending-cuts package. Democrats said a defeated previous question would let them bring up the release bill immediately.' }),
  v('2025-07-22', 'Oversight subcommittee (Government Operations)', 'Burchett motion to subpoena Ghislaine Maxwell', 'Agreed by voice vote', null, null, false, 'https://oversight.house.gov/release/chairman-comer-subpoenas-ghislaine-maxwell-for-deposition-at-federal-prison/', '',
    { plain: 'Subpoena Ghislaine Maxwell' }),
  v('2025-07-23', 'Oversight subcommittee (Federal Law Enforcement)', 'Garcia amendment: widen the DOJ request to any president\'s communications, including Trump\'s', 'Failed 5-5', [0, 5], [5, 0], true, `${OV}/GO33/20250723/118526/CRPT-119-GO33-Vote001-20250723.pdf`, '',
    { plain: 'Widen the request to any president\'s communications, including Trump\'s' }),
  v('2025-07-23', 'Oversight subcommittee (Federal Law Enforcement)', 'Mace amendment: limit the request to "credible" files', 'Failed 5-5', [5, 0], [0, 5], false, `${OV}/GO33/20250723/118526/CRPT-119-GO33-Vote002-20250723.pdf`, '',
    { plain: 'Limit the request to "credible" files' }),
  v('2025-07-23', 'Oversight subcommittee (Federal Law Enforcement)', 'Summer Lee motion to subpoena DOJ for the Epstein files', 'Passed 8-2', [3, 2], [5, 0], false, [`${OV}/GO33/20250723/118526/CRPT-119-GO33-Vote003-20250723.pdf`, 'https://www.cbsnews.com/news/house-committee-votes-to-subpoena-justice-department-for-epstein-files/'], 'R yes: Mace, Perry, Jack. R no: Higgins, Biggs. Subpoena issued Aug 5.',
    { plain: 'Subpoena the Justice Department for the Epstein files' }),
  v('2025-07-23', 'Oversight subcommittee (Federal Law Enforcement)', 'Perry motion to subpoena the Clintons, Comey, Lynch, Holder, Garland, Mueller, Barr, Sessions, Gonzales', 'Agreed by voice vote', null, null, false, 'https://oversight.house.gov/release/chairman-comer-subpoenas-bill-and-hillary-clinton-former-attorneys-general-and-former-fbi-directors-in-epstein-investigation/', 'Transcript records "[Chorus of noes.]"; Comer\'s office called it unanimous.',
    { plain: 'Subpoena the Clintons and former attorneys general and FBI directors' }),
  v('2025-07-24', 'Senate floor (unanimous consent)', 'Gallego request to pass S.Res. 325', 'Objection: Sen. Markwayne Mullin', null, null, true, ['https://dailypress.senate.gov/thursday-july-24-2025/', CR.s0724], '', {
    plain: 'Pass Gallego\'s resolution again', m: ['sres325'], t: ['uc'], objR: 1,
    reason: { who: 'Sen. Markwayne Mullin (R)', quote: 'this resolution does absolutely nothing; therefore, I object', url: CR.s0724 } }),
  v('2025-07-24', 'Senate floor (unanimous consent)', 'Mullin request to pass his S.Res. 335 (courts should unseal the Epstein and Maxwell records); Gallego asks to pass it together with S.Res. 325', 'Objection: Mullin, to passing both; then Gallego, to S.Res. 335 alone', null, null, true, CR.s0724, 'Corrected 2026-09-30: this list first recorded both July 24 objections as Mullin blocking Gallego. The Congressional Record shows the second exchange began with Mullin\'s own resolution, and ended with Gallego objecting to it.', {
    plain: 'Pass Mullin\'s resolution asking the courts to unseal the records, or both resolutions together', m: ['sres335', 'sres325'], t: ['uc'], objR: 1, objD: 1,
    explain: 'Mullin refused to pass the two together, and Gallego then blocked Mullin\'s alone. The only Democratic objection on this list.',
    reason: { who: 'Sen. Ruben Gallego (D)', quote: 'Republicans are demanding that the courts be transparent but aren\'t willing to ask the same thing of the Trump DOJ.', url: CR.s0724 },
    reason2: { who: 'Sen. Markwayne Mullin (R)', quote: 'My colleague from Arizona\'s resolution tells the FBI and the DOJ how to do their job.', url: CR.s0724 } }),
  v('2025-07-30', 'Senate floor (unanimous consent)', 'Merkley request to pass S. 2557 (Senate Epstein Files Transparency Act)', 'Objection: Sen. John Barrasso', null, null, true, CR.s0730, '', {
    plain: 'Pass the Senate version of the release bill', m: ['eft'], t: ['uc'], objR: 1,
    reason: { who: 'Sen. John Barrasso (R)', quote: 'this exercise is a Democrat distraction', url: CR.s0730 } }),
  v('2025-08-02', 'Senate floor (unanimous consent)', 'Four requests (Merkley, Blumenthal, Van Hollen x2)', 'Objection four times: Sen. John Barrasso', null, null, true, [CR.s0802a, CR.s0802b, CR.s0802c], 'Counted as four objections.', {
    plain: 'Pass the release bill (three tries) and the preserve-the-records language (one try)', m: ['eft', 'vhd'], t: ['uc'], objR: 4,
    explain: 'Merkley, Blumenthal and Van Hollen each asked to pass the Senate release bill; Van Hollen also asked to pass the Appropriations Committee\'s preserve-and-report language on its own. Barrasso objected each time, citing Democrats\' holds on Trump\'s nominees.',
    reason: { who: 'Sen. John Barrasso (R)', quote: 'a historic obstruction by the Democrats of President Trump\'s qualified nominees, and therefore I object', url: CR.s0802a } }),

  // ── September 2025
  v('2025-09-02', 'House Rules', 'Record vote 165: deem the attorney general in contempt if DOJ does not comply', 'Failed 4-9', [0, 9], [4, 0], true, RULES.sep2, '',
    { plain: 'Hold the attorney general in contempt if the Justice Department ignores the Oversight subpoena', m: ['hres668'], t: ['rules'] }),
  v('2025-09-02', 'House Rules', 'Record vote 166: consider H.R. 4405', 'Failed 4-9', [0, 9], [4, 0], true, RULES.sep2, '',
    { plain: 'Bring up the release bill', m: ['eft'], t: ['rules'] }),
  v('2025-09-02', 'House Rules', 'Record vote 169: require the ranking member\'s consent before redactions', 'Failed 4-9', [0, 9], [4, 0], true, RULES.sep2, '',
    { plain: 'Require Democrats\' agreement before Oversight redacts or withholds records', m: ['hres668'], t: ['rules'] }),
  v('2025-09-02', 'House Rules', 'Record vote 170: report H.Res. 672 (rule deeming the GOP\'s H.Res. 668 adopted)', 'Adopted 9-4', [9, 0], [0, 4], false, RULES.sep2, '',
    { plain: 'Send the rule adopting the Republican Oversight resolution to the floor', m: ['hres668', 'rules'], t: ['rules'] }),
  v('2025-09-03', 'House floor', 'Roll 221: previous question on H.Res. 672, which shut out H.R. 4405', 'Passed 212-209', [212, 0], [0, 209], true, [HOU(2025, 221), CR.h0903], 'Procedural.',
    { plain: 'Shut off the attempt to bring up the release bill', m: ['eft', 'rules'], t: ['pq'], explain: 'Democrats said a defeated previous question would let them bring up the release bill.' }),
  v('2025-09-03', 'House floor', 'Roll 222: adopt H.Res. 672, which also adopted the GOP\'s H.Res. 668 backing the Oversight probe', 'Passed 212-208, 1 present', [212, 0], [0, 208], false, [HOU(2025, 222), 'https://www.foxnews.com/politics/house-moves-expose-epstein-files-authorizes-oversight-probe'], 'The only floor vote on the GOP\'s own Epstein resolution; bundled with unrelated items.',
    { plain: 'Adopt the rule, which also passed the Republican Oversight resolution', m: ['hres668', 'rules'] }),
  v('2025-09-09', 'House Rules', 'Record vote 177: consider H.R. 4405', 'Failed 4-8', [0, 8], [4, 0], true, [RULES.sep9, 'https://newrepublic.com/post/200213/list-house-republicans-voted-kill-epstein-bill'], '',
    { plain: 'Bring up the release bill', m: ['eft'], t: ['rules'] }),
  v('2025-09-09', 'Financial Services subcommittee (National Security/Illicit Finance)', 'Motion to table the Beatty-Tlaib motion to subpoena Treasury for Epstein financial records', 'Tabled, about 8-5', [8, 0], [0, 5], true, 'https://www.americanbanker.com/news/house-committee-gop-blocks-epstein-subpoena-to-treasury', 'No official roll call posted; tally reconstructed from names in American Banker.',
    { plain: 'Kill a motion to subpoena Treasury for Epstein\'s financial records', t: ['table'] }),
  v('2025-09-10', 'House Appropriations', 'Morelle motion: require the AG to give the committee all Epstein and Maxwell materials', 'Failed 28-33', [0, 33], [28, 0], true, 'https://docs.house.gov/meetings/AP/AP00/20250910/118544/HMKP-119-AP00-20250910-SD004.pdf', '',
    { plain: 'Require the attorney general to give the committee all Epstein and Maxwell materials' }),
  v('2025-09-10', 'House Appropriations', 'Dean amendment: no funds to withhold, redact or delay non-classified Epstein-Maxwell records', 'Failed 28-34', [0, 34], [28, 0], true, 'https://docs.house.gov/meetings/AP/AP00/20250910/118544/HMKP-119-AP00-20250910-SD004.pdf', '',
    { plain: 'Bar spending money to withhold, redact or delay unclassified Epstein-Maxwell records' }),
  v('2025-09-10', 'Senate floor', 'Roll 512: table Schumer amendment 3849 to the defense bill directing the AG to publish the Epstein documents', 'Tabled 51-49', [51, 2], [0, 45], true, 'https://www.senate.gov/legislative/LIS/roll_call_votes/vote1191/vote_119_1_00512.htm', 'R no: Hawley, Paul. Independents 0-2.',
    { plain: 'Kill Schumer\'s amendment to publish the Epstein documents', m: ['schumer3849'], t: ['table'] }),
  v('2025-09-15', 'House Rules', 'Record vote 189: consider H.R. 4405', 'Failed 2-8', [0, 8], [2, 0], true, RULES.sep15, '',
    { plain: 'Bring up the release bill', m: ['eft'], t: ['rules'] }),
  v('2025-09-17', 'House Judiciary', 'Table Raskin motion to subpoena the CEOs of JPMorgan, BNY Mellon, Bank of America and Deutsche Bank', 'Tabled 20-19', [20, 1], [0, 18], true, 'https://docs.house.gov/meetings/JU/JU00/20250917/118612/CRPT-119-JU00-Vote001-20250917.pdf', 'Massie the only R no. Motion subjects from CNN/NBC/The Hill coverage.',
    { plain: 'Kill a motion to subpoena the CEOs of four banks', t: ['table'] }),
  v('2025-09-17', 'House Judiciary', 'Table Scanlon motion to subpoena Treasury Secretary Bessent', 'Tabled 23-16', [23, 1], [0, 15], true, 'https://docs.house.gov/meetings/JU/JU00/20250917/118612/CRPT-119-JU00-Vote002-20250917.pdf', '',
    { plain: 'Kill a motion to subpoena Treasury Secretary Scott Bessent', t: ['table'] }),
  v('2025-09-17', 'House Judiciary', 'Table Swalwell motion to subpoena Deputy FBI Director Bongino', 'Tabled 21-16', [21, 1], [0, 15], true, 'https://docs.house.gov/meetings/JU/JU00/20250917/118612/CRPT-119-JU00-Vote003-20250917.pdf', '',
    { plain: 'Kill a motion to subpoena Deputy FBI Director Dan Bongino', t: ['table'] }),
  v('2025-09-17', 'House Judiciary', 'Table Crockett motion to subpoena the Bureau of Prisons over Maxwell\'s transfer', 'Tabled 21-16', [21, 1], [0, 15], true, 'https://docs.house.gov/meetings/JU/JU00/20250917/118612/CRPT-119-JU00-Vote004-20250917.pdf', '',
    { plain: 'Kill a motion to subpoena the Bureau of Prisons over Maxwell\'s transfer', t: ['table'] }),

  // ── November 2025
  v('2025-11-17', 'House Rules', 'Record vote 208: guarantee the discharge route if the suspension vote failed', 'Failed 4-9', [0, 9], [4, 0], true, RULES.nov17, '',
    { plain: 'Keep the discharge petition\'s route open in case the release bill failed', m: ['eft', 'hres581'], t: ['rules', 'discharge'] }),
  v('2025-11-17', 'House Rules', 'Record vote 210: report H.Res. 879 (rule that tabled the discharge petition\'s rule once the bill passed)', 'Adopted 9-4', [9, 0], [0, 4], false, RULES.nov17, '',
    { plain: 'Send the rule that retires the discharge petition after passage to the floor', m: ['hres581', 'rules'], t: ['rules'] }),
  v('2025-11-18', 'Senate floor (unanimous consent)', 'Schumer: pass H.R. 4405 on arrival from the House', 'Agreed without objection', null, null, false, 'https://www.govinfo.gov/content/pkg/CREC-2025-11-18/pdf/CREC-2025-11-18-senate.pdf', '',
    { plain: 'Pass the release bill as soon as it arrives from the House', m: ['eft'], t: ['uc'] }),
  v('2025-11-18', 'House floor', 'Roll 289: pass H.R. 4405, the Epstein Files Transparency Act', 'Passed 427-1', [216, 1], [211, 0], false, HOU(2025, 289), 'Higgins (R-LA) the only no. Trump had reversed Nov 16.',
    { id: 'roll-289', plain: 'Pass the Epstein Files Transparency Act', m: ['eft'], t: ['suspension'] }),
  v('2025-11-18', 'House floor', 'Roll 291: adopt H.Res. 879', 'Passed 217-210', [216, 0], [1, 210], false, HOU(2025, 291), 'Weak Epstein link: section 8 tabled the discharge rule after passage.',
    { plain: 'Adopt the rule that retired the discharge petition', m: ['hres581', 'rules'] }),
  v('2025-11-19', 'Senate', 'H.R. 4405 passed under the Nov 18 order; signed by Trump the same day (P.L. 119-38)', 'Passed by unanimous consent', null, null, false, 'https://www.congress.gov/bill/119th-congress/house-bill/4405/all-actions', '',
    { plain: 'The release bill passes the Senate; Trump signs it', m: ['eft'] }),

  // ── 2026
  v('2026-01-21', 'House Oversight', 'Lee amendment: sue to enforce the Aug 5 subpoena against AG Bondi instead of Clinton contempt', 'Failed 19-24', [0, 24], [19, 0], true, `${OV}/GO00/20260121/118877/CRPT-119-GO00-Vote001-20260121.pdf`, 'ABC reported a voice vote; the official record shows a recorded vote.',
    { id: 'jan21-bondi', plain: 'Go to court to enforce the subpoena on Attorney General Bondi, instead of holding Bill Clinton in contempt' }),
  v('2026-01-21', 'House Oversight', 'Min amendment: civil enforcement against Bill Clinton instead of criminal contempt', 'Failed 19-25', [0, 25], [19, 0], false, `${OV}/GO00/20260121/118877/CRPT-119-GO00-Vote002-20260121.pdf`, '',
    { plain: 'Take Bill Clinton to civil court instead of holding him in criminal contempt' }),
  v('2026-01-21', 'House Oversight', 'Report the Bill Clinton contempt resolution', 'Adopted 34-8, 2 present', [25, 0], [9, 8], false, `${OV}/GO00/20260121/118877/CRPT-119-GO00-Vote003-20260121.pdf`, '',
    { plain: 'Hold Bill Clinton in contempt for defying the committee\'s subpoena' }),
  v('2026-01-21', 'House Oversight', 'Report the Hillary Clinton contempt resolution', 'Adopted 28-15, 1 present', [25, 0], [3, 15], false, `${OV}/GO00/20260121/118877/CRPT-119-GO00-Vote004-20260121.pdf`, 'The Clintons then agreed to testify; no floor vote.',
    { plain: 'Hold Hillary Clinton in contempt for defying the committee\'s subpoena' }),
  v('2026-02-05', 'Senate floor (unanimous consent)', 'Schumer request to adopt S.Res. 597 authorizing lawsuits over DOJ noncompliance', 'Objection: Sen. John Barrasso', null, null, true, CR.s0205, '', {
    plain: 'Let the Senate sue the Justice Department to enforce the release law', m: ['sres597'], t: ['uc'], objR: 1,
    reason: { who: 'Sen. John Barrasso (R)', quote: 'this is another reckless political stunt designed to distract Americans from Democrats\' dangerous plan to shut down the Department of Homeland Security', url: CR.s0205 } }),
  v('2026-03-03', 'Senate floor (unanimous consent)', 'Wyden request to pass S. 2746, Produce Epstein Treasury Records Act', 'Objection: Sen. Mike Crapo', null, null, true, CR.s0303, '', {
    plain: 'Make Treasury hand the Senate the bank reports on Epstein\'s transactions', m: ['s2746'], t: ['uc'], objR: 1,
    reason: { who: 'Sen. Mike Crapo (R)', quote: 'it would not be helpful for either the Senate Finance or the Senate Banking Committee to confound the process by attempting to duplicate or compete with their work', url: CR.s0303 } }),
  v('2026-03-04', 'House Oversight', 'Mace motion to subpoena Attorney General Pam Bondi', 'Passed 24-19', [5, 19], [19, 0], false, `${OV}/GO00/20260304/119003/CRPT-119-GO00-Vote002-20260304.pdf`, 'R yes: Cloud, Mace, Perry, Burchett, Boebert. Bondi later skipped her April 14 deposition; no contempt vote followed.',
    { id: 'bondi-subpoena', plain: 'Subpoena Attorney General Pam Bondi' }),
  v('2026-09-15', 'House Oversight', 'Report the Leon Black contempt resolution (defied Epstein-probe subpoenas)', 'Adopted 41-0', [20, 0], [21, 0], false, `${OV}/GO00/20260915/119567/CRPT-119-GO00-Vote001-20260915.pdf`, 'Comer says the House adopted it by unanimous consent Sept 16; not checked against the Clerk.',
    { plain: 'Hold financier Leon Black in contempt for defying the committee\'s subpoenas' }),
];

// ── The measures, in plain English. Written only from the bill texts and CRS summaries in ../cache/crs119, the
// Rules Committee reports and Congressional Record pages in ../cache/ea and ../cache/eb, and the Senate roll call page.
// Every congress.gov link was loaded and its title checked on 2026-09-30.
const CG = (path) => `https://www.congress.gov/${path}`;
const MEASURES = {
  eft: { name: 'The Epstein Files Transparency Act (H.R. 4405; Senate version S. 2557)', short: 'release bill',
    what: 'The bill that became law. It requires the Justice Department to publish, within 30 days, all its unclassified records on Jeffrey Epstein and Ghislaine Maxwell, including flight logs and the people named in the investigation, government officials among them. It may withhold victims\' personal information, child sexual abuse material and anything that would jeopardize an active federal investigation, but nothing for "embarrassment, reputational harm, or political sensitivity." Written by Reps. Ro Khanna (D) and Thomas Massie (R); Sen. Jeff Merkley (D) introduced the Senate version.',
    src: [['H.R. 4405', CG('bill/119th-congress/house-bill/4405')], ['S. 2557', CG('bill/119th-congress/senate-bill/2557')]], basis: 'crs119/BILLS-119hr4405enr.txt, BILLSTATUS-119hr4405, BILLS-119s2557is.txt, ea/txt/crec_house_2025-07-17_excerpts.txt' },
  hres581: { name: 'Massie\'s discharge resolution (H.Res. 581)', short: 'discharge resolution',
    what: 'A rule that would bring the release bill to the floor by amending another bill, H.R. 185, to carry it. It was the target of Massie\'s discharge petition, which reached 218 signatures on November 12, 2025. Once the House passed the release bill, another rule set it aside.',
    src: [['H.Res. 581', CG('bill/119th-congress/house-resolution/581')]], basis: 'crs119/BILLSTATUS-119hres581, BILLS-119hres879rh.txt sec. 8, ea/txt/clerk_discharge_petition_9.txt' },
  khanna50: { name: 'The Khanna amendment (No. 50 to H.R. 3633)', short: 'Khanna amendment',
    what: 'Rep. Ro Khanna\'s amendment to the CLARITY Act, a bill regulating digital assets such as cryptocurrency. It "would require the Attorney General to preserve and release any records related to Jeffrey Epstein," in the words of the Rules Committee\'s report.',
    src: [['Rules Committee report', 'https://rules.house.gov/sites/evo-subsites/rules.house.gov/files/documents/rulesreport07142025.pdf'], ['H.R. 3633', CG('bill/119th-congress/house-bill/3633')]], basis: 'ea/txt/rules_report_H.Rpt.119-199.txt, crs119/BILLSTATUS-119hr3633' },
  hres577: { name: 'The Democrats\' release resolution (H.Res. 577)', short: 'H.Res. 577',
    what: 'Rep. Marc Veasey\'s resolution demanding that the Trump administration immediately release all unclassified Epstein files, flight logs and evidence, with redactions only to protect minor victims and ongoing prosecutions, and asking the Justice Department and FBI to report any delays or destruction of evidence. A House resolution, not a bill: it could not become law.',
    src: [['H.Res. 577', CG('bill/119th-congress/house-resolution/577')]], basis: 'crs119/BILLS-119hres577ih.txt, ec/congress_glossary.txt (simple resolution)' },
  hres589: { name: 'The Republican resolution (H.Res. 589)', short: 'Republican resolution',
    what: 'Rep. Ralph Norman\'s resolution asking the attorney general to release all "credible" Epstein files within 30 days. Speaker Johnson allowed it forward as part of a deal with Republican holdouts. CNN described it as non-binding and noted it "doesn\'t immediately force any action." The rule to adopt it was never brought to the floor.',
    src: [['H.Res. 589', CG('bill/119th-congress/house-resolution/589')], ['CNN', 'https://www.cnn.com/2025/07/21/politics/epstein-files-house-vote-gop-johnson-massie']], basis: 'crs119/BILLS-119hres589ih.txt, ea/txt/cnn_johnson_shuts_door_20250721.txt, BILLS-119hres672rh.txt sec. 10' },
  hres668: { name: 'The Republican Oversight resolution (H.Res. 668)', short: 'Oversight resolution',
    what: 'Directed the House Oversight Committee to continue its Epstein investigation and to publish the committee\'s own records, with exceptions for victims\' identities, abuse material and active investigations. It passed without a vote of its own, inside a rule for an unrelated spending bill.',
    src: [['H.Res. 668', CG('bill/119th-congress/house-resolution/668')]], basis: 'crs119/BILLSTATUS-119hres668, BILLS-119hres672rh.txt sec. 8' },
  sres325: { name: 'Gallego\'s Senate resolution (S.Res. 325)', short: 'S.Res. 325',
    what: 'Sen. Ruben Gallego\'s statement of the Senate\'s view that the Justice Department should release the appropriate Epstein records, meet with victims first, say what it is withholding and why, and correct misleading statements by its officials.',
    src: [['S.Res. 325', CG('bill/119th-congress/senate-resolution/325')]], basis: 'crs119/BILLS-119sres325is.txt' },
  sres335: { name: 'Mullin\'s Senate resolution (S.Res. 335)', short: 'S.Res. 335',
    what: 'Sen. Markwayne Mullin\'s resolution calling on federal and state courts to unseal all Epstein and Maxwell materials, including grand jury records, with redactions to protect victims.',
    src: [['S.Res. 335', CG('bill/119th-congress/senate-resolution/335')]], basis: 'crs119/BILLS-119sres335is.txt' },
  vhd: { name: 'The Van Hollen-Durbin language', short: 'preserve-the-records language',
    what: 'Adopted by the Senate Appropriations Committee: the attorney general must "retain, preserve, and compile" the Epstein records and, within 60 days, report to the committee on the case, including the 2008 non-prosecution agreement, victims, co-conspirators and oversight failures at the federal jail in New York. Its spending bill never passed.',
    src: [['Committee amendments', 'https://appropriations.senate.gov/download/fy26-commerce-justice-science-adopted-amendments&download=1'], ['Congressional Record', CR.s0802c]], basis: 'eb/sac_cjs_adopted.txt, eb/crec_20250802_S5502.txt' },
  schumer3849: { name: 'Schumer\'s amendment (No. 3849 to the defense bill)', short: 'Schumer amendment',
    what: 'An amendment to the annual defense authorization bill "to direct the Attorney General to make publicly available documents related to Jeffrey Epstein."',
    src: [['S.Amdt. 3849', CG('amendment/119th-congress/senate-amendment/3849')]], basis: 'ec/senate_vote_119_1_00512.htm, crs119/BILLSTATUS-119s2296' },
  sres597: { name: 'Schumer\'s lawsuit resolution (S.Res. 597)', short: 'S.Res. 597',
    what: 'Would have directed the Senate to go to court over the Justice Department\'s failure to comply with the Epstein Files Transparency Act.',
    src: [['S.Res. 597', CG('bill/119th-congress/senate-resolution/597')]], basis: 'crs119/BILLS-119sres597is.txt' },
  s2746: { name: 'The Produce Epstein Treasury Records Act (S. 2746)', short: 'S. 2746',
    what: 'Sen. Ron Wyden\'s bill requiring Treasury to give the Senate Finance and Banking committees every bank suspicious activity report on Epstein, his co-conspirators and anyone who did business with him or his companies.',
    src: [['S. 2746', CG('bill/119th-congress/senate-bill/2746')]], basis: 'crs119/BILLS-119s2746is.txt, eb/crec_20260303_S748.txt' },
  rules: { name: 'The rules for other bills (H.Res. 580, 590, 672 and 879)', short: 'rule',
    what: 'A rule sets the terms for debating other bills. These four brought up a defense spending bill and digital-asset bills (580), the spending-cuts package (590), an energy and water spending bill that also carried the Republican Oversight resolution (672), and resolutions overturning federal land plans, a rule that also retired the discharge petition (879). Democrats tried to amend them to add an Epstein vote.',
    src: [['H.Res. 580', CG('bill/119th-congress/house-resolution/580')], ['590', CG('bill/119th-congress/house-resolution/590')], ['672', CG('bill/119th-congress/house-resolution/672')], ['879', CG('bill/119th-congress/house-resolution/879')]], basis: 'crs119/BILLSTATUS-119hres580/590/672/879, BILLS-119hres672rh.txt, BILLS-119hres879rh.txt' },
};

// ── The procedures, from the Congress.gov glossary (ec/congress_glossary.txt) unless noted.
const GLOSS = 'https://www.congress.gov/help/legislative-glossary';
const TERMS = {
  pq: { name: 'Previous question', what: 'A House vote to end debate on a rule and vote on it as written. Winning it "cuts off further debate, prevents the offering of additional amendments." Democrats asked members to vote it down so they could add an Epstein vote.', src: [['Congress.gov glossary', GLOSS]] },
  rules: { name: 'Rules Committee votes', what: 'The Rules Committee writes each rule, "a resolution reported by the Rules Committee that, if agreed to by the House, sets the terms for debating and amending" bills. Its nine Republicans and four Democrats vote on motions to change them.', src: [['Congress.gov glossary', GLOSS]] },
  table: { name: 'Motion to table', what: 'A vote to kill a motion without debating it: "a simple majority may agree to negatively and permanently dispose of a question."', src: [['Congress.gov glossary', GLOSS]] },
  uc: { name: 'Unanimous consent', what: 'In the Senate, any member may ask colleagues to set the usual rules aside and pass a measure at once. "If any member objects to such a request, it is not agreed to." One objection is enough.', src: [['Congress.gov glossary', GLOSS]] },
  discharge: { name: 'Discharge petition', what: 'A way to force a House vote that leaders oppose, "provided the petition gets a majority of lawmaker signatures," in Fox News\'s words: 218 when every seat is filled.', src: [['Fox News', 'https://www.foxnews.com/politics/house-moves-expose-epstein-files-authorizes-oversight-probe']] },
  suspension: { name: 'Suspension of the rules', what: 'A fast track for bills with wide support: no amendments, 40 minutes of debate, and "a two-thirds majority for passage."', src: [['Congress.gov glossary', GLOSS]] },
};

const PHASES = [
  { id: 'july-2025', from: '2025-07-01', to: '2025-08-31', title: 'July 2025: the first push',
    intro: 'Trump called the matter a hoax. Democrats and a handful of Republicans tried to force a vote, and Speaker Johnson sent the House home early for August.' },
  { id: 'september-2025', from: '2025-09-01', to: '2025-10-31', title: 'September 2025: the petition fight',
    intro: 'Massie filed his discharge petition on September 2. House Republicans passed their own Oversight resolution instead, and committees voted down subpoenas aimed at banks, Treasury and the FBI.' },
  { id: 'november-2025', from: '2025-11-01', to: '2025-12-31', title: 'November 2025: Trump reverses',
    intro: 'The petition reached 218 signatures on November 12. Trump reversed on November 16, and the bill passed two days later.' },
  { id: 'year-2026', from: '2026-01-01', to: '2026-12-31', title: '2026: enforcing the law',
    intro: 'With the law passed, the fight moved to whether the Justice Department was complying, and whom the Oversight Committee would pursue.' },
];

const related = [
  { date: '2025-11-18', what: 'House rejected censuring Del. Stacey Plaskett over 2019 texts with Epstein, 209-214 (roll 297); motion to refer to Ethics failed 213-214 (roll 293)', urls: [HOU(2025, 297), HOU(2025, 293)] },
  { date: '2026-07-29', what: 'Senate adopted Rosen\'s S.Res. 608 opposing clemency for Ghislaine Maxwell by unanimous consent', urls: [CG('bill/119th-congress/senate-resolution/608'), 'https://www.dailypress.senate.gov/wednesday-july-29-2026/'] },
];

const context = {
  dischargePetition1: { number: 9, measure: 'H.Res. 581', filed: '2025-09-02', reached218: '2025-11-12', republicanSigners: ['Massie', 'Mace', 'Boebert', 'Greene'], url: 'https://clerk.house.gov/DischargePetition/2025090209' },
  dischargePetition2: { number: 27, measure: 'H.Res. 1430 (second Epstein Files Transparency Act)', filed: '2026-08-31', signatures: 216, asOf: '2026-09-16', republicanSigners: ['Massie', 'Mace', 'Norman', 'Fitzpatrick'], note: 'No floor vote; the House has cast no Epstein floor vote in 2026.', url: 'https://clerk.house.gov/DischargePetition/2026083127' },
  trump: [
    { date: '2025-07-16', quote: "Their new SCAM is what we will forever call the Jeffrey Epstein Hoax, and my PAST supporters have bought into this \"bullshit,\" hook, line, and sinker.", url: 'https://www.presidency.ucsb.edu/documents/truth-social-posts-july-16-2025' },
    { date: '2025-11-12', quote: 'Only a very bad, or stupid, Republican would fall into that trap.', url: 'https://www.presidency.ucsb.edu/documents/truth-social-posts-november-12-2025' },
    { date: '2025-11-16', quote: 'House Republicans should vote to release the Epstein files, because we have nothing to hide', url: 'https://www.presidency.ucsb.edu/documents/truth-social-posts-november-16-2025' },
  ],
  johnson: { date: '2025-07-22', quote: "There's no purpose for Congress to push an administration to do something that they're already doing.", url: 'https://www.cbsnews.com/news/johnson-house-recess-epstein-files-vote/' },
};

// Checks: every key a row names must exist, every row must fall in a phase, anchors must be unique.
votes.forEach((x, i) => {
  x.id = x.id || `v${i + 1}`;
  for (const k of x.m || []) if (!MEASURES[k]) throw new Error(`row ${i + 1}: unknown measure ${k}`);
  for (const k of x.t || []) if (!TERMS[k]) throw new Error(`row ${i + 1}: unknown term ${k}`);
  if (!x.plain) throw new Error(`row ${i + 1}: no plain label`);
  x.phase = (PHASES.find((p) => x.date >= p.from && x.date <= p.to) || {}).id;
  if (!x.phase) throw new Error(`row ${i + 1}: no phase for ${x.date}`);
  if (!x.R && x.blocked && !(x.objR || x.objD)) throw new Error(`row ${i + 1}: blocked without a recorded vote or objection count`);
});
if (new Set(votes.map((x) => x.id)).size !== votes.length) throw new Error('duplicate row ids');

const recorded = votes.filter((x) => x.R && x.blocked);
const blockedRecorded = recorded.reduce((n, x) => n + (/157 and 158/.test(x.question) ? 2 : 1), 0);
const senateObjections = votes.reduce((n, x) => n + (x.objR || 0), 0);
const democraticObjections = votes.reduce((n, x) => n + (x.objD || 0), 0);
fs.writeFileSync(__dirname + '/epstein-votes.json', JSON.stringify({ updated: '2026-09-30', counts: { rows: votes.length, recordedVotesBlockingRelease: blockedRecorded, senateObjections, democraticObjections }, phases: PHASES, measures: MEASURES, terms: TERMS, votes, related, context }, null, 2) + '\n');
console.log('wrote epstein-votes.json:', votes.length, 'rows |', blockedRecorded, 'recorded votes blocking release |', senateObjections, 'Republican Senate objections |', democraticObjections, 'Democratic');
