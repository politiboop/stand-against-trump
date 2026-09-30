// Writes values-votes.json: roll calls compared against values Republicans state.
// Every tally was confirmed on clerk.house.gov or senate.gov by a research agent on 2026-09-30;
// saved page texts are in ../cache/{va,vb,vc} (local only). Edit this file, then run: node build-values-votes.cjs
const fs = require('fs');
const SEN = (c, s, n) => `https://www.senate.gov/legislative/LIS/roll_call_votes/vote${c}${s}/vote_${c}_${s}_${String(n).padStart(5, '0')}.htm`;
const HOU = (y, n) => `https://clerk.house.gov/Votes/${y}${String(n).padStart(3, '0')}`;
const PLATFORM_2024 = 'https://www.presidency.ucsb.edu/documents/2024-republican-party-platform';

const votes = [
  {
    id: 'border-deal-feb-2024', theme: 'border security',
    value: { who: '2024 Republican platform', quote: 'We will end the Invasion at the Southern Border', url: PLATFORM_2024, note: 'Adopted July 2024, after both votes' },
    rollcalls: [
      { chamber: 'Senate', date: '2024-02-07', question: 'Cloture on motion to proceed, H.R. 815 (Lankford-Murphy-Sinema border deal plus foreign aid)', result: 'Rejected 49-50', R: [4, 44, 1], D: [43, 5, 0], I: [2, 1, 0], url: SEN(118, 2, 39), note: 'R yes: Collins, Lankford, Murkowski, Romney. The page names only H.R. 815; FactCheck.org ties it to the border deal.' },
      { chamber: 'Senate', date: '2024-05-23', question: 'Cloture on motion to proceed, S. 4361 (Border Act, standalone)', result: 'Rejected 43-50', R: [1, 44, 4], D: [41, 4, 3], I: [1, 2, 0], url: SEN(118, 2, 182), note: 'R yes: Murkowski. Lankford, its author, voted no.' },
    ],
    objections: [
      { who: 'House GOP leadership (Johnson, Scalise, Emmer, Stefanik)', date: '2024-02-05', quote: 'It is DEAD on arrival in the House.', url: 'https://www.speaker.gov/2024/02/05/house-republican-leadership-statement-on-senate-immigration-bill/' },
      { who: 'Donald Trump, Las Vegas rally', date: '2024-01-27', quote: 'Please blame it on me. Please.', url: 'https://www.bostonglobe.com/2024/01/28/nation/trump-brags-about-efforts-stymie-border-talks-please-blame-it-me/' },
      { who: 'Donald Trump, Truth Social (quoted by Fox News)', date: '2024-02-05', quote: 'Only a fool, or a Radical Left Democrat, would vote for this horrendous Border Bill', url: 'https://www.foxnews.com/politics/trump-blasts-horrendous-senate-border-deal-great-gift-democrats' },
      { who: 'Sen. James Lankford, to CNN, before the May vote', date: '2024-05-21', quote: "It's no longer a bill. It's a prop.", url: 'https://www.cnn.com/2024/05/23/politics/senate-border-bill-vote/index.html' },
    ],
    complications: [
      'Feb 8, 2024 the Senate proceeded to H.R. 815 67-32 (17 R yes) and on Feb 13 passed the aid without the border provisions, 70-29 (22 R yes).',
      'Some Democrats voted no from the left in both votes (Menendez called the deal an "outright betrayal").',
      "FactCheck.org rated Trump's \"5,000 encounters\" description wrong: emergency authority began at 4,000 a day.",
      'The factcheck: https://www.factcheck.org/2024/02/unraveling-misinformation-about-bipartisan-immigration-bill/',
    ],
    confidence: 'high',
  },
  {
    id: 'right-to-ivf-2024', theme: 'IVF / family',
    value: { who: 'Donald Trump, Fox News town hall', quote: "I'm the father of IVF", url: 'https://www.nbcnews.com/politics/2024-election/trump-says-father-ivf-recently-learned-rcna175940', note: 'Aired Oct 16, 2024; the campaign later called it a joke. Platform: "supporting mothers and policies that advance Prenatal Care, access to Birth Control, and IVF (fertility treatments)."' },
    rollcalls: [
      { chamber: 'Senate', date: '2024-06-13', question: 'Cloture on motion to proceed, S. 4445 Right to IVF Act', result: 'Rejected 48-47', R: [2, 46, 1], D: [44, 1, 2], I: [2, 0, 2], url: SEN(118, 2, 197), note: 'R yes: Collins, Murkowski. Schumer no for procedural reasons.' },
      { chamber: 'Senate', date: '2024-09-17', question: 'Same, upon reconsideration (after the platform was adopted)', result: 'Rejected 51-44', R: [2, 44, 3], D: null, I: null, url: SEN(118, 2, 242) },
    ],
    objections: [
      { who: 'Sen. John Cornyn', date: '2024-06-13', quote: "Why should we vote for a bill that fixes a non-existent problem? There's not a problem. There's no restrictions on IVF, nor should there be.", url: 'https://www.cnn.com/2024/06/13/politics/senate-ivf-bill-vote/index.html' },
      { who: 'Sen. John Thune', date: '2024-09-17', quote: 'Republicans support IVF, full stop', url: 'https://www.cbsnews.com/news/senate-ivf-vote-republicans-trump/' },
    ],
    complications: ['Republicans offered the Britt-Cruz IVF Protection Act; Democrats blocked it by objection June 12, 2024.', 'The Democratic bill included an insurance-coverage mandate, the "overreach" Republicans cited.'],
    confidence: 'high',
  },
  {
    id: 'right-to-contraception-2024', theme: 'contraception / family',
    value: { who: '2024 Republican platform', quote: 'access to Birth Control', url: PLATFORM_2024 },
    rollcalls: [{ chamber: 'Senate', date: '2024-06-05', question: 'Cloture on motion to proceed, S. 4381 Right to Contraception Act', result: 'Rejected 51-39', R: [2, 38, 9], D: [46, 1, 1], I: [3, 0, 0], url: SEN(118, 2, 190), note: 'R yes: Collins, Murkowski. 9 Republicans did not vote.' }],
    objections: [
      { who: 'Sen. John Cornyn', date: '2024-06-05', quote: "It's a phony vote because contraception, to my knowledge, is not illegal.", url: 'https://www.nbcnews.com/politics/congress/senate-republicans-block-bill-protect-americans-access-contraception-rcna155448' },
      { who: 'Sen. Josh Hawley', date: '2024-06-05', quote: "That's an abortion issue. That's not a contraception issue.", url: 'https://www.nbcnews.com/politics/congress/senate-republicans-block-bill-protect-americans-access-contraception-rcna155448' },
    ],
    complications: ['Sen. Joni Ernst had a separate contraception-access bill.'],
    confidence: 'high',
  },
  {
    id: 'child-tax-credit-2024', theme: 'families / children',
    value: { who: 'Pro-family positioning (no single quote gathered)', quote: null, url: null, note: '[NEEDS SOURCE] for a specific GOP pro-family pledge tied to the child tax credit' },
    rollcalls: [
      { chamber: 'House', date: '2024-01-31', question: 'Suspend the rules and pass H.R. 7024 (Tax Relief for American Families and Workers Act)', result: 'Passed 357-70', R: [169, 47, 3], D: [188, 23, 2], I: null, url: HOU(2024, 30) },
      { chamber: 'Senate', date: '2024-08-01', question: 'Cloture on motion to proceed, H.R. 7024', result: 'Rejected 48-44', R: [3, 41, 5], D: [43, 1, 3], I: [2, 2, 0], url: SEN(118, 2, 230), note: 'R yes: Hawley, Mullin, Scott (FL).' },
    ],
    objections: [{ who: 'Sen. Mike Crapo, floor statement', date: '2024-08-01', quote: "instead goes too far toward Democrats' goal of turning the child tax credit into a subsidy untethered to work", url: 'https://www.finance.senate.gov/imo/media/doc/crapo_floor_statement_on_hr_7024_080124.pdf' }],
    complications: ['House Republicans backed it 169-47; the split was Senate vs. House Republicans, not party vs. party.', 'Crapo conceded "there are plenty of provisions in the bill that my colleagues and I support."'],
    confidence: 'high',
  },
  {
    id: 'insulin-cap-2022', theme: 'lower costs',
    value: { who: null, quote: null, url: null, note: '[NEEDS SOURCE] for a GOP pledge on drug or insulin prices' },
    rollcalls: [
      { chamber: 'Senate', date: '2022-08-07', question: 'Motion to waive the Budget Act point of order against the $35 insulin cap for private insurance (H.R. 5376, Inflation Reduction Act)', result: 'Rejected 57-43 (60 needed)', R: [7, 43, 0], D: [48, 0, 0], I: [2, 0, 0], url: SEN(117, 2, 314), note: 'R yes: Cassidy, Collins, Hawley, Hyde-Smith, Kennedy, Murkowski, Sullivan.' },
      { chamber: 'Senate', date: '2022-08-07', question: "Kennedy's alternative (discounted insulin at community health centers)", result: 'Failed 50-50', R: [50, 0, 0], D: [0, 48, 0], I: [0, 2, 0], url: SEN(117, 2, 313) },
    ],
    objections: [
      { who: 'Sen. Lindsey Graham, point of order', date: '2022-08-06', quote: 'Mr. President, I believe this violates the rules of reconciliation.', url: 'https://www.govinfo.gov/content/pkg/CREC-2022-08-06/pdf/CREC-2022-08-06.pdf' },
      { who: 'Sen. Ron Johnson, tweet (per ABC)', date: '2022-08-07', quote: "the Dems wanted to break Senate rules to pass insulin pricing cap instead of going through regular order", url: 'https://abcnews.com/Politics/republicans-strip-35-insulin-price-cap-democrats-bill/story?id=88069589' },
    ],
    complications: ['The parliamentarian had ruled the cap violated the Byrd rule; the vote was on waiving that ruling.', 'The $35 cap for Medicare stayed in the law.'],
    confidence: 'high',
  },
  {
    id: 'disclose-act-2022', theme: 'drain the swamp / transparency',
    value: { who: 'Donald Trump, Gettysburg', quote: 'We will drain the swamp in Washington DC', url: 'https://www.presidency.ucsb.edu/documents/remarks-proposals-for-the-first-100-days-office-the-eisenhower-complex-gettysburg', note: 'Oct 22, 2016 campaign speech, not about this bill' },
    rollcalls: [{ chamber: 'Senate', date: '2022-09-22', question: 'Cloture on motion to proceed, S. 4822 DISCLOSE Act', result: 'Rejected 49-49', R: [0, 49, 1], D: [47, 0, 1], I: [2, 0, 0], url: SEN(117, 2, 346) }],
    objections: [{ who: 'Sen. Mitch McConnell, floor', date: '2022-09-21', quote: 'a bill to erode the First Amendment and make political speech more difficult', url: 'https://www.govinfo.gov/content/pkg/CREC-2022-09-21/pdf/CREC-2022-09-21.pdf' }],
    complications: ['McConnell rests on associational privacy (NAACP v. Alabama) and notes the ACLU has opposed versions of the bill.', 'A "McConnell once backed disclosure" angle is [NEEDS SOURCE].'],
    confidence: 'high',
  },
  {
    id: 'jan6-commission-2021', theme: 'law and order / police',
    value: { who: '2024 Republican platform', quote: 'Republicans will restore safety in our neighborhoods by replenishing Police Departments, restoring Common Sense Policing, and protecting Officers from frivolous lawsuits.', url: PLATFORM_2024, note: 'The phrase "back the blue" is not in the platform.' },
    rollcalls: [
      { chamber: 'House', date: '2021-05-19', question: 'Passage, H.R. 3233 (independent Jan. 6 commission)', result: 'Passed 252-175', R: [35, 175, 1], D: [217, 0, 2], I: null, url: HOU(2021, 154) },
      { chamber: 'Senate', date: '2021-05-28', question: 'Cloture on motion to proceed, H.R. 3233', result: 'Rejected 54-35 (60 needed)', R: [6, 35, 9], D: [46, 0, 2], I: [2, 0, 0], url: SEN(117, 1, 218), note: 'R yes: Cassidy, Collins, Murkowski, Portman, Romney, Sasse. Party split tallied from the member list.' },
      { chamber: 'House', date: '2021-06-15', question: 'Suspension, H.R. 3325 (Congressional Gold Medals for the Capitol Police and defenders of the Capitol)', result: 'Passed 406-21', R: [188, 21, 2], D: [218, 0, 2], I: null, url: HOU(2021, 161), note: 'The 21 no votes objected to the wording ("insurrectionists"), not to honoring police.' },
    ],
    objections: [
      { who: 'Rep. Kevin McCarthy', date: '2021-05-18', quote: "given the now duplicative and potentially counterproductive nature of this effort", url: 'https://www.cbsnews.com/news/january-6-commission-mccarthy-opposes/' },
      { who: 'Sen. Mitch McConnell', date: '2021-05-19', quote: "the House Democrats' slanted and unbalanced proposal", url: 'https://www.foxnews.com/politics/mcconnell-opposes-jan-6-capitol-riot-commission' },
    ],
    complications: ['The commission bill met a GOP demand for equal membership from each party.', 'The platform came three years after these votes.'],
    confidence: 'high',
  },
  {
    id: 'infrastructure-2021', theme: 'infrastructure',
    value: { who: 'Donald Trump, 2016 victory speech', quote: "We're going to rebuild our infrastructure, which will become, by the way, second to none.", url: 'https://www.presidency.ucsb.edu/documents/remarks-new-york-city-accepting-election-the-45th-president-the-united-states' },
    rollcalls: [
      { chamber: 'House', date: '2021-11-05', question: 'Concur in Senate amendment, H.R. 3684 Infrastructure Investment and Jobs Act (final passage)', result: 'Passed 228-206', R: [13, 200, 0], D: [215, 6, 0], I: null, url: HOU(2021, 369), note: 'The 13 Republicans were decisive; 6 progressive Democrats voted no.' },
      { chamber: 'Senate', date: '2021-08-10', question: 'Passage, H.R. 3684', result: 'Passed 69-30', R: [19, 30, 1], D: null, I: null, url: SEN(117, 1, 314), note: 'McConnell voted yes.' },
    ],
    objections: [
      { who: "Rep. Steve Scalise's whip office", date: '2021-09-22', quote: 'we will be whipping against both measures in an effort to stop Democrats from enacting $5 trillion in socialist spending', url: 'https://www.washingtonexaminer.com/news/1797313/house-gop-to-whip-votes-against-bipartisan-infrastructure-bill-in-win-for-conservative-wing/' },
      { who: 'Donald Trump', date: '2021-11-07', quote: 'Very sad that the RINOs in the House and Senate gave Biden and Democrats a victory', url: 'https://www.cnn.com/2021/11/09/politics/trump-reaction-republicans-voting-infrastrcutre/index.html' },
    ],
    complications: ['The House GOP objection was mainly the link to Build Back Better.'],
    confidence: 'high',
  },
  {
    id: 'chips-act-2022', theme: 'compete with China',
    value: { who: 'Sen. Roger Wicker (R-MS), who voted yes', quote: 'enhance our ability to compete with China', url: 'https://www.govinfo.gov/content/pkg/CREC-2022-07-27/html/CREC-2022-07-27-pt1-PgS3707-7.htm' },
    rollcalls: [
      { chamber: 'House', date: '2022-07-28', question: 'Concur in Senate amendment, H.R. 4346 CHIPS and Science Act', result: 'Passed 243-187, 1 present', R: [24, 187, 0], D: [219, 0, 0], I: null, url: HOU(2022, 404) },
      { chamber: 'Senate', date: '2022-07-27', question: 'Concur with amendment, H.R. 4346', result: 'Passed 64-33', R: [17, 32, 1], D: null, I: null, url: SEN(117, 2, 271), note: 'Sanders (I) voted no.' },
    ],
    objections: [{ who: "Rep. Steve Scalise, whip notice", date: '2022-07-27', quote: 'While acknowledging the threat China poses to American industrial supply chains, this corporate welfare bill will not effectively address that important challenge.', url: 'https://www.foxnews.com/politics/house-republicans-move-reject-china-competition-bill-manchin-schumer-agree-reconciliation-deal' }],
    complications: ['House GOP leaders switched to opposition after the Schumer-Manchin reconciliation deal was announced.'],
    confidence: 'high',
  },
  {
    id: 'safer-communities-2022', theme: 'mass shootings as a mental-health problem',
    value: { who: 'Gov. Greg Abbott (R-TX), after Uvalde', quote: 'Anybody who shoots somebody else has a mental health challenge. Period.', url: 'https://abcnews.go.com/Health/gov-abbott-places-shooting-blame-mental-health-texas/story?id=84993527', note: 'A governor, not a member of Congress' },
    rollcalls: [
      { chamber: 'House', date: '2022-06-24', question: 'Agree to Senate amendments, S. 2938 Bipartisan Safer Communities Act', result: 'Passed 234-193', R: [14, 193, 3], D: [220, 0, 0], I: null, url: HOU(2022, 299), note: 'Tony Gonzales, whose district includes Uvalde, voted yes.' },
      { chamber: 'Senate', date: '2022-06-23', question: 'Concur in House amendment with amendment, S. 2938', result: 'Passed 65-33', R: [15, 33, 2], D: [48, 0, 0], I: [2, 0, 0], url: SEN(117, 2, 242) },
    ],
    objections: [{ who: 'Rep. Steve Scalise, whip notice', date: '2022-06-22', quote: "In an effort to slowly chip away at law-abiding citizens' 2nd Amendment rights, this legislation takes the wrong approach in attempting to curb violent crimes.", url: 'https://www.foxnews.com/politics/bipartisan-senate-gun-bill-icy-reception-house-republicans' }],
    complications: ['The bill itself funds mental health (CNN, paraphrasing Cornyn: $12 billion).', 'Trump urged Republicans to vote no (NBC).'],
    confidence: 'high',
  },
  {
    id: 'infant-formula-2022', theme: 'families / children',
    value: { who: null, quote: null, url: null },
    rollcalls: [
      { chamber: 'House', date: '2022-05-18', question: 'Passage, H.R. 7790 ($28 million for FDA during the formula shortage)', result: 'Passed 231-192', R: [12, 192, 4], D: [219, 0, 1], I: null, url: HOU(2022, 220), note: 'Never became law.' },
      { chamber: 'House', date: '2022-05-18', question: 'Suspension, H.R. 7791 Access to Baby Formula Act (WIC)', result: 'Passed 414-9', R: [194, 9, 5], D: [220, 0, 1], I: null, url: HOU(2022, 218), note: 'Became law May 21, 2022.' },
    ],
    objections: [{ who: 'Rep. Kay Granger, ranking Republican on Appropriations', date: '2022-05-18', quote: 'the bill does nothing to force the FDA to come up with a plan to address the shortage', url: 'https://appropriations.house.gov/news/statements/granger-remarks-hr-7790-infant-formula-supplemental-appropriations-act' }],
    complications: ["Granger noted FDA's budget had risen $102 million two months earlier."],
    confidence: 'high',
  },
  {
    id: 'pact-act-2022', theme: 'veterans',
    value: { who: '2024 Republican platform', quote: "We will restore Trump Administration reforms to expand Veterans' Healthcare Choices", url: PLATFORM_2024 },
    rollcalls: [
      { chamber: 'Senate', date: '2022-06-16', question: 'Passage, H.R. 3967 Honoring our PACT Act', result: 'Passed 84-14', R: [34, 14, 2], D: [48, 0, 0], I: [2, 0, 0], url: SEN(117, 2, 230) },
      { chamber: 'Senate', date: '2022-07-27', question: 'Cloture on motion to concur, S. 3373 (the same bill, re-passed by the House)', result: 'Rejected 55-42', R: [8, 41, 1], D: [45, 1, 2], I: [2, 0, 0], url: SEN(117, 2, 272), note: '25 Republicans who voted yes in June voted no: Barrasso, Blackburn, Blunt, Braun, Cassidy, Cornyn, Cotton, Cramer, Cruz, Ernst, Fischer, Hagerty, Hawley, Hyde-Smith, Inhofe, Johnson, Kennedy, Marshall, McConnell, Portman, Sasse, Scott (FL), Scott (SC), Sullivan, Young.' },
      { chamber: 'Senate', date: '2022-08-02', question: 'Concur in House amendment, S. 3373', result: 'Passed 86-11', R: [38, 11, 1], D: [46, 0, 2], I: [2, 0, 0], url: SEN(117, 2, 280) },
    ],
    objections: [{ who: 'Sen. Pat Toomey', date: '2022-07-27', quote: 'it is a budgetary gimmick', url: 'https://www.govinfo.gov/content/pkg/CREC-2022-07-27/html/CREC-2022-07-27-pt1-PgS3715.htm' }],
    complications: ['Toomey voted no in June too; the 25 switchers were the inconsistency.', "Newsweek's fact-check (medium confidence, via summary) said nothing substantive changed between the votes."],
    confidence: 'high on roll calls; medium on whether texts were identical',
  },
  {
    id: 'vawa-reauthorizations', theme: 'protecting women',
    value: { who: null, quote: null, url: null },
    rollcalls: [
      { chamber: 'House', date: '2013-02-28', question: 'Passage, S. 47 (VAWA 2013)', result: 'Passed 286-138', R: [87, 138, 6], D: [199, 0, 1], I: null, url: HOU(2013, 55) },
      { chamber: 'Senate', date: '2013-02-12', question: 'Passage, S. 47', result: 'Passed 78-22', R: [23, 22, 0], D: [53, 0, 0], I: [2, 0, 0], url: SEN(113, 1, 19) },
      { chamber: 'House', date: '2019-04-04', question: 'Passage, H.R. 1585', result: 'Passed 263-158, 1 present', R: [33, 157, 6], D: [230, 1, 3], I: null, url: HOU(2019, 156), note: 'Died in the Senate.' },
      { chamber: 'House', date: '2021-03-17', question: 'Passage, H.R. 1620', result: 'Passed 244-172', R: [29, 172, 10], D: [215, 0, 4], I: null, url: HOU(2021, 86) },
      { chamber: 'House', date: '2022-03-09', question: 'Omnibus "remaining divisions" including VAWA (Division W)', result: 'Passed 260-171, 1 present', R: [39, 171, 1], D: [221, 0, 0], I: null, url: HOU(2022, 66), note: 'A package vote; no standalone VAWA vote.' },
    ],
    objections: [
      { who: 'Rep. Kevin Cramer (R-ND), 2013', date: '2013-02-28', quote: 'Please consider the damage we have done if a court overturns this act and its protection all because we wanted a good slogan instead of a good law.', url: 'https://www.cnn.com/2013/02/28/politics/violence-against-women' },
      { who: 'House Judiciary Republican dissent (signed by Doug Collins, Mike Johnson and others), 2019', date: '2019-03-27', quote: 'H.R. 1585 includes language related to firearms and restricting their possession.', url: 'https://www.govinfo.gov/content/pkg/CRPT-116hrpt21/pdf/CRPT-116hrpt21-pt1.pdf' },
      { who: 'NRA spokeswoman Jennifer Baker, 2019', date: '2019-04-04', quote: 'The gun control lobby and anti-gun politicians are intentionally politicizing the Violence Against Women Act as a smokescreen to push their gun control agenda.', url: 'https://www.npr.org/2019/04/04/707685268/violence-against-women-act-gets-tangled-up-in-gun-rights-debate' },
    ],
    complications: ['Senate Republicans split 23-22 in favor in 2013.', 'The 2022 reauthorization dropped the "boyfriend loophole" gun provision.'],
    confidence: 'high',
  },
  {
    id: 'fiscal-votes-for', theme: 'fiscal responsibility (votes FOR deficits)',
    value: { who: '2016 Republican platform', quote: 'The Republican path to fiscal sanity and economic expansion begins with a constitutional requirement for a federal balanced budget.', url: 'https://www.presidency.ucsb.edu/documents/2016-republican-party-platform', note: 'The 2024 platform never uses "debt", "balanced budget" or "borrow"; it pledges to "improve fiscal sanity".' },
    rollcalls: [
      { chamber: 'House', date: '2017-12-20', question: 'Concur in Senate amendment, Tax Cuts and Jobs Act (final)', result: 'Passed 224-201', R: [224, 12, 3], D: [0, 189, 4], I: null, url: HOU(2017, 699) },
      { chamber: 'Senate', date: '2017-12-20', question: 'Recede and concur with amendment, Tax Cuts and Jobs Act (final)', result: 'Passed 51-48', R: [51, 0, 1], D: [0, 46, 0], I: [0, 2, 0], url: SEN(115, 1, 323) },
      { chamber: 'House', date: '2023-05-31', question: 'Passage, H.R. 3746 Fiscal Responsibility Act', result: 'Passed 314-117', R: [149, 71, 2], D: [165, 46, 2], I: null, url: HOU(2023, 243) },
    ],
    estimates: [
      { what: 'TCJA deficit increase, static', figure: '$1,455 billion over 10 years', url: 'https://www.cbo.gov/publication/53415' },
      { what: 'TCJA deficit increase with economic feedback, 2018-2028', figure: '$1.854 trillion', url: 'https://www.cbo.gov/publication/54994' },
      { what: 'One Big Beautiful Bill Act (2025)', figure: '$3.4 trillion over 2025-2034 (CBO)', url: 'https://bipartisanpolicy.org/explainer/what-does-the-one-big-beautiful-bill-cost/' },
    ],
    objections: [{ who: 'Treasury Department', date: '2017-12-11', quote: '$1.8 trillion of additional revenue would be generated over 10 years based upon expected growth', url: 'https://home.treasury.gov/news/press-releases/sm0233' }],
    complications: ['Fiscal Responsibility Act no votes came from Republicans who said it did not cut enough.'],
    confidence: 'high',
  },
];

fs.writeFileSync(__dirname + '/values-votes.json', JSON.stringify({ updated: '2026-09-30', note: 'Party splits are [yea, nay, not voting]. I = independents.', votes }, null, 2) + '\n');
console.log('wrote values-votes.json:', votes.length, 'topics,', votes.reduce((n, v) => n + v.rollcalls.length, 0), 'roll calls');
