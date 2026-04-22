// JIRAH Growth Partners — mock data
window.JIRAH_DATA = (function () {
  const pipeline = [
    // Cold
    { id: 'p1', name: 'Northcrest Structural', stage: 'cold', industry: 'Structural Eng.', geo: 'BC', owner: 'JL', lastContactDays: 14, nextAction: '2026-04-22', value: 48000, contact: 'Dana Whitfield, Principal', source: 'Referral — Larkspur', notes: 'Cold intro via Larkspur Engineering partner. 52 staff, owner preparing for succession in 3 years.' },
    { id: 'p2', name: 'Brightfield Consulting', stage: 'cold', industry: 'Consulting', geo: 'ON', owner: 'JM', lastContactDays: 21, nextAction: '2026-04-24', value: 36000, contact: 'Owen Bramley, Founder', source: 'LinkedIn outreach', notes: 'Boutique strategy shop, 34 staff. Owner explicitly posted about wanting an outside perspective.' },
    // Warm
    { id: 'p3', name: 'Fairgrove Mechanical', stage: 'warm', industry: 'Building Systems', geo: 'AB', owner: 'JL', lastContactDays: 4, nextAction: '2026-04-20', value: 72000, contact: 'Marcus Whitlock, President', source: 'Industry event', notes: '$14M rev, 78 staff. Margin pressure after recent expansion; two follow-ups booked already.' },
    { id: 'p4', name: 'Coastline Environmental', stage: 'warm', industry: 'Consulting', geo: 'BC', owner: 'JM', lastContactDays: 9, nextAction: '2026-04-23', value: 54000, contact: 'Priya Anand, Managing Partner', source: 'Podcast listener', notes: 'Heard Jason on the Owner Operators podcast. Running two-partner firm, 61 staff.' },
    { id: 'p5', name: 'Hollister Dental Group', stage: 'warm', industry: 'Healthcare', geo: 'ON', owner: 'JL', lastContactDays: 6, nextAction: '2026-04-21', value: 42000, contact: 'Dr. Neil Hollister', source: 'Newsletter reply', notes: '4-location group, ~90 staff. Replied to the operating cadence piece.' },
    // Meeting Booked
    { id: 'p6', name: 'Tideline Physio', stage: 'booked', industry: 'Healthcare', geo: 'BC', owner: 'JM', lastContactDays: 2, nextAction: '2026-04-22', value: 58000, contact: 'Sophie Arden, CEO', source: 'Referral — Cascade Physio', notes: 'Intro call booked. 6 clinics, 112 staff. Similar profile to Cascade engagement.' },
    { id: 'p7', name: 'Quarry Ridge Accounting', stage: 'booked', industry: 'Accounting', geo: 'AB', owner: 'JL', lastContactDays: 3, nextAction: '2026-04-24', value: 66000, contact: 'Theresa Boyd, Managing Partner', source: 'Outbound', notes: '$8.4M rev, 46 staff. Partner group divided on growth strategy.' },
    // Proposal Sent
    { id: 'p8', name: 'Ironwood Accounting', stage: 'proposal', industry: 'Accounting', geo: 'ON', owner: 'JM', lastContactDays: 5, nextAction: '2026-04-21', value: 84000, contact: 'Aaron Petrov, Managing Partner', source: 'Referral — Client', notes: 'Proposal for 6-month engagement sent Apr 11. Two-partner review scheduled Monday.' },
    { id: 'p9', name: 'Stavelot Engineering', stage: 'proposal', industry: 'Civil Eng.', geo: 'QC', owner: 'JL', lastContactDays: 8, nextAction: '2026-04-28', value: 96000, contact: 'Jean-Luc Marchand, President', source: 'Audit applicant', notes: 'Came through audit pipeline. Proposal includes a team-ops sprint upfront.' },
    // Closed Won
    { id: 'p10', name: 'Larkspur Engineering', stage: 'won', industry: 'Engineering', geo: 'BC', owner: 'JL', lastContactDays: 12, nextAction: '—', value: 120000, contact: 'Elena Voss, President', source: 'Referral — Summit', notes: 'Signed Q1. Discovery kicking off in 3 weeks. 110 staff.' },
    { id: 'p11', name: 'Beacon Payroll', stage: 'won', industry: 'Professional Svc.', geo: 'ON', owner: 'JM', lastContactDays: 18, nextAction: '—', value: 78000, contact: 'Reid Callahan, CEO', source: 'Newsletter', notes: '45 staff. Signed end of March. Kickoff scheduled May 6.' },
    // Closed Lost
    { id: 'p12', name: 'Basalt Environmental', stage: 'lost', industry: 'Consulting', geo: 'BC', owner: 'JL', lastContactDays: 30, nextAction: '—', value: 60000, contact: 'Morgan Pell, Principal', source: 'Outbound', notes: 'Went with internal COO hire. Keep warm for mid-2027 check-in.' },
    { id: 'p13', name: 'Redpath Legal', stage: 'lost', industry: 'Professional Svc.', geo: 'ON', owner: 'JM', lastContactDays: 42, nextAction: '—', value: 48000, contact: 'Charlotte Redpath, Managing Partner', source: 'Conference', notes: 'Not a fit — single-owner firm, too small. Keep on distribution list.' },
  ];

  const audits = [
    { id: 'a1', applicant: 'Graywolf Partners', contact: 'David Kersten', role: 'Managing Director', company: 'Graywolf Partners (Consulting, ON)', submitted: '2026-04-15', icp: 25, status: 'pending', revenue: '$4.2M', staff: 22, why: 'Curious about offer; under ICP on revenue and staff count.' },
    { id: 'a2', applicant: 'Cedarhill Dental Group', contact: 'Dr. Amy Trent', role: 'Owner-CEO', company: 'Cedarhill Dental Group (Healthcare, BC)', submitted: '2026-04-14', icp: 58, status: 'pending', revenue: '$9.8M', staff: 74, why: 'Owner preparing for partial exit; wants outside operator perspective before committing to PE conversation.' },
    { id: 'a3', applicant: 'Aurora Controls', contact: 'Nils Johansson', role: 'President', company: 'Aurora Controls (Industrial Automation, AB)', submitted: '2026-04-13', icp: 82, status: 'shortlist', revenue: '$16.4M', staff: 108, why: 'Strong ICP match: owner-run, scaling past 100 staff, clear margin compression after recent growth.' },
    { id: 'a4', applicant: 'Stonepath Advisory', contact: 'Mira Chen', role: 'Founder', company: 'Stonepath Advisory (Professional Svc, ON)', submitted: '2026-04-11', icp: 71, status: 'shortlist', revenue: '$11.2M', staff: 62, why: 'Good fit — two partners, stalled above $10M. Applied after reading the Succession Trap essay.' },
    { id: 'a5', applicant: 'Highmark Structural', contact: 'Ben Alvero', role: 'President', company: 'Highmark Structural (Engineering, BC)', submitted: '2026-04-09', icp: 88, status: 'accepted', revenue: '$18.7M', staff: 134, why: 'Ideal profile. Accepted and moved to proposal phase as Stavelot Engineering had similar profile.' },
    { id: 'a6', applicant: 'Pinewood Mechanical', contact: 'Fraser Inglis', role: 'Owner', company: 'Pinewood Mechanical (Building Systems, AB)', submitted: '2026-04-07', icp: 64, status: 'pending', revenue: '$7.6M', staff: 51, why: 'Borderline — strong owner profile, revenue just above floor.' },
    { id: 'a7', applicant: 'Harrowgate & Co', contact: 'Simon Yates', role: 'Managing Partner', company: 'Harrowgate & Co (Accounting, ON)', submitted: '2026-04-05', icp: 76, status: 'accepted', revenue: '$13.5M', staff: 88, why: 'Kickoff scheduled May 20. Three-partner firm with succession pressure.' },
    { id: 'a8', applicant: 'Strandline Physio', contact: 'Dr. Kate Dalrymple', role: 'CEO', company: 'Strandline Physio (Healthcare, BC)', submitted: '2026-04-02', icp: 34, status: 'declined', revenue: '$3.9M', staff: 28, why: 'Below threshold on revenue and staff. Declined with warm referral to boutique advisor.' },
  ];

  const engagements = [
    {
      id: 'e1',
      name: 'Summit Engineering Partners',
      industry: 'Engineering',
      geo: 'BC',
      owner: 'JL',
      coOwner: 'JM',
      currentStep: 3, // 0-indexed; Sprint
      milestone: 'Leadership Ops Sprint',
      dueLabel: 'Jan 21–22',
      lastContactDays: 2,
      contract: '$96,000 · 6 months',
      sponsor: 'Maya Linares, President',
      timeline: [
        { date: 'Apr 16', body: 'Sprint agenda finalized with sponsor.' },
        { date: 'Apr 11', body: 'Discovery interviews wrapped — 9 leaders, 4 senior ICs.' },
        { date: 'Mar 28', body: 'Kickoff — goals, north-star KPI agreed.' },
      ],
    },
    {
      id: 'e2',
      name: 'Cascade Physio Group',
      industry: 'Healthcare',
      geo: 'BC',
      owner: 'JM',
      coOwner: 'JL',
      currentStep: 1,
      milestone: 'Discussion Document Draft',
      dueLabel: 'Due Friday',
      lastContactDays: 5,
      warn: true,
      contract: '$72,000 · 5 months',
      sponsor: 'Tomás Reyes, CEO',
      timeline: [
        { date: 'Apr 12', body: 'Second round of clinic lead interviews completed.' },
        { date: 'Apr 04', body: 'Discovery kickoff session — 8 clinic leads.' },
        { date: 'Mar 22', body: 'Contract countersigned.' },
      ],
    },
    {
      id: 'e3',
      name: 'Meridian Accounting',
      industry: 'Accounting',
      geo: 'ON',
      owner: 'JL',
      coOwner: 'JM',
      currentStep: 5,
      milestone: 'Monthly KPI Check-in',
      dueLabel: 'Apr 30',
      lastContactDays: 11,
      contract: '$84,000 · 12 months (KPI tracking)',
      sponsor: 'Priya Bhatt, Managing Partner',
      timeline: [
        { date: 'Mar 31', body: 'March KPI review — NPS +6, utilization 71% (target 75%).' },
        { date: 'Feb 27', body: 'Feb KPI review — on plan.' },
        { date: 'Jan 24', body: 'End-of-sprint report delivered to partner group.' },
      ],
    },
  ];

  const briefing = {
    date: 'Saturday, April 18',
    overdue: [
      { id: 'b1', name: 'Aaron Petrov — Ironwood Accounting', when: '5 days', body: 'Proposal response was promised end-of-week last. Partner meeting moved to Monday.', cta: 'Open drafted reply' },
      { id: 'b2', name: 'Sophie Arden — Tideline Physio', when: '2 days', body: 'Pre-meeting prep doc committed. Intro call is Tuesday 10am PT.', cta: 'Open drafted reply' },
    ],
    sprint: [
      { id: 'br1', name: 'Cascade Physio Group', when: '3 days out', body: 'Discussion Doc due Friday. Two interview transcripts still outstanding — check with Joshua.', cta: 'Review draft' },
    ],
    warm: [
      { id: 'bw1', name: 'Fairgrove Mechanical', when: '4 days', body: 'Marcus opened the follow-up email twice. No reply yet; send the margin compression case study.', cta: 'Send case study' },
      { id: 'bw2', name: 'Hollister Dental Group', when: '6 days', body: 'Neil replied warmly to the newsletter. Suggest a 20-minute intro for next week.', cta: 'Propose time' },
    ],
  };

  return { pipeline, audits, engagements, briefing };
})();
