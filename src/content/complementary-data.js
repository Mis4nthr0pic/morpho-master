const MORPHO_COMPLEMENTARY_SOURCES = [
  {
    id: 'faq-page-extract',
    title: 'Morpho FAQ Extract',
    type: 'faq',
    file: 'morpho-complementary.txt',
    sections: ['general', 'earn', 'borrow', 'liquidations', 'curation', 'build', 'governance']
  }
];

const COMPLEMENTARY_LESSON_APPENDICES = {
  'Morpho Blue in One Minute': `## FAQ reinforcement

The FAQ language is useful here because it gives a broader platform framing: Morpho is not only for end users earning or borrowing. Developers and businesses can create markets, curate vaults, and build on a permissionless infrastructure. That phrasing helps when an interviewer wants a bigger-picture answer than "it is an isolated lending primitive."`,
  'What Vault V2 Actually Is': `## FAQ reinforcement

The FAQ curation section gives a useful plain-English distinction: markets are simple immutable venues with one loan asset and one collateral asset, while vaults are curated products that can allocate across many markets with their own risk profile. That is a strong non-jargony explanation for partners who are new to curation.`,
  'Loss Socialization and Share Price Depreciation': `## FAQ reinforcement

The FAQ earn-risk section says bad debt losses are shared proportionally among lenders. That maps well to the Vault V2 socialization story in this curriculum: pooled exposure at the vault share layer means losses show up through reduced share value rather than being hidden or isolated to one visible bucket.`,
  'AdaptiveCurveIRM APY Math': `## FAQ reinforcement

The FAQ borrow section adds a helpful product sentence: current and historical Borrow APY can be observed on the borrow page or market pages. In partner language, that means you can explain AdaptiveCurveIRM both as formulaic onchain logic and as a user-visible changing rate surface tied to utilization.`,
  'Merkl Rewards, Claim Context, and Combined Yield Display': `## FAQ reinforcement

The FAQ earn section is useful for drill answers because it separates net APY into native APY, third-party rewards APR, and MORPHO rewards APR. That gives you a clean verbal template for explaining why one displayed yield number can have multiple drivers.`,
  'Translate Tech into Business Value': `## FAQ reinforcement

The FAQ build section is unusually useful for partner communication: Morpho can support earn products, structured products, yield aggregators, and other lending or borrowing use cases. That gives you a concise menu of business outcomes to mention on calls.`,
  'Handle Liquidation and Risk Objections': `## FAQ reinforcement

The FAQ liquidation section gives simple user-safe wording you should be comfortable repeating: positions become eligible for liquidation when they are unhealthy, anyone can liquidate permissionlessly, and users can reduce risk by adding collateral or repaying debt to keep health factor above 1.`,
  'Documentation and Bug-Forwarding Mindset': `## FAQ reinforcement

The FAQ build and governance sections reinforce a useful support habit: point builders to docs, GitHub, Discord, governance forum, and Snapshot depending on whether the issue is technical, community, or governance-related. Good partner engineers know where each kind of conversation belongs.`
};

const COMPLEMENTARY_QUIZ_QUESTIONS = [
  {
    q: 'Which answer best matches the FAQ definition of Morpho?',
    options: [
      'An open, efficient, and resilient platform for earning, borrowing, creating markets, curating vaults, and building applications.',
      'A custodial yield app where only approved institutions can launch products.',
      'A governance-only system for MORPHO token voting.',
      'A pooled lending market with frozen parameters managed by Morpho Labs.'
    ],
    correct: 0,
    explanation: 'The FAQ frames Morpho broadly as a platform for users, developers, and businesses across earning, borrowing, building, and curation.',
    category: 'faq-general',
    difficulty: 'fundamental',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'This is a good first-sentence platform definition.'
  },
  {
    q: 'According to the FAQ, which statement about asset freezing is accurate?',
    options: [
      'Morpho cannot freeze user assets because it is non-custodial, permissionless, and immutable.',
      'Assets can be frozen by the owner role during emergencies.',
      'Vault curators can freeze withdrawals for any reason.',
      'Governance can freeze individual user balances on demand.'
    ],
    correct: 0,
    explanation: 'The FAQ explicitly states the protocol cannot freeze assets.',
    category: 'faq-general',
    difficulty: 'fundamental',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'Be precise: non-custodial and immutable, not "totally risk free."'
  },
  {
    q: 'Which components can make up a vault net APY according to the FAQ?',
    options: [
      'Native APY, third-party rewards APR, and MORPHO rewards APR',
      'Only native APY from borrowers',
      'Only curator incentives and protocol fees',
      'Only MORPHO emissions voted weekly by governance'
    ],
    correct: 0,
    explanation: 'The FAQ breaks net APY into native APY, rewards APR, and MORPHO rewards APR.',
    category: 'earn',
    difficulty: 'fundamental',
    module_slug: 'real-world-integrations-and-merkl',
    interviewTip: 'Use this structure whenever you explain combined yields.'
  },
  {
    q: 'Which due-diligence question is explicitly recommended when choosing a Morpho Vault?',
    options: [
      'Who is the curator and what is their track record?',
      'Which liquidator is assigned by governance?',
      'Whether collateral automatically earns supply APY.',
      'Which wallet extension the curator prefers.'
    ],
    correct: 0,
    explanation: 'The FAQ says vault selection should consider curator expertise, exposures, fees, and historical net APY.',
    category: 'earn',
    difficulty: 'intermediate',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'This is a strong partner-education point.'
  },
  {
    q: 'What specific earn-side risk does the FAQ describe when all liquidity is borrowed?',
    options: [
      'Liquidity risk: withdrawals may be delayed until new liquidity becomes available.',
      'Oracle risk: vault prices become permanently wrong.',
      'Governance risk: Snapshot votes can block withdrawals.',
      'Bundler risk: multicalls will stop executing.'
    ],
    correct: 0,
    explanation: 'The FAQ calls out liquidity risk as delayed withdrawal when available liquidity is exhausted.',
    category: 'earn',
    difficulty: 'fundamental',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'Do not promise instant withdrawal in every state.'
  },
  {
    q: 'Why do collateral assets not earn supply APY by default on Morpho?',
    options: [
      'Because collateral is not lent out to borrowers, which reduces liquidation liquidity constraints and improves capital utilization.',
      'Because governance disables collateral APY on weekends.',
      'Because only vault assets can ever earn interest.',
      'Because borrowers pay interest directly to liquidators instead.'
    ],
    correct: 0,
    explanation: 'The FAQ explains that collateral is not lent out, which helps liquidation liquidity and utilization dynamics.',
    category: 'borrow',
    difficulty: 'intermediate',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'This is a clean differentiator versus systems where collateral is reused differently.'
  },
  {
    q: 'How does the FAQ describe borrowing capacity?',
    options: [
      'It depends directly on collateral value and the market’s fixed LLTV.',
      'It depends only on utilization and governance voting.',
      'It is the same across every market on a given chain.',
      'It is set by the curator of the vault used as collateral.'
    ],
    correct: 0,
    explanation: 'Borrow capacity is tied to collateral value and the fixed LLTV of the market.',
    category: 'borrow',
    difficulty: 'fundamental',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'Good answer: collateral value plus market LLTV, not a generic borrow cap.'
  },
  {
    q: 'Which risk is the FAQ specifically telling borrowers to evaluate about a market oracle?',
    options: [
      'Security, reliability, update frequency, and centralization or manipulation exposure',
      'Whether the oracle supports infinite allowances',
      'Whether the oracle can mint MORPHO rewards',
      'Whether the oracle has a lower gas cost than Bundler3'
    ],
    correct: 0,
    explanation: 'The FAQ highlights oracle manipulation and reliability concerns and suggests evaluating update quality and trust assumptions.',
    category: 'borrow',
    difficulty: 'intermediate',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'This is the right practical oracle-evaluation language.'
  },
  {
    q: 'Which statement matches the FAQ explanation of liquidations?',
    options: [
      'They mitigate bad debt and protect lenders when LTV exceeds LLTV.',
      'They are protocol-operated auctions that run automatically.',
      'They only apply to vault depositors, not borrowers.',
      'They are disabled when utilization is low.'
    ],
    correct: 0,
    explanation: 'The FAQ describes liquidation as a bad-debt mitigation mechanism once LTV exceeds LLTV.',
    category: 'liquidations',
    difficulty: 'fundamental',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'Use "mitigate bad debt and protect lenders" verbatim in your own words.'
  },
  {
    q: 'Who performs liquidations on Morpho according to the FAQ?',
    options: [
      'Anyone, because liquidations are permissionless and pay an incentive.',
      'Only the owner role of the affected vault.',
      'Only whitelisted keepers selected by governance.',
      'Only Morpho Labs support staff.'
    ],
    correct: 0,
    explanation: 'The FAQ states liquidations are permissionless and open to anyone willing to repay debt for collateral plus incentive.',
    category: 'liquidations',
    difficulty: 'fundamental',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'This is why "Morpho guarantees liquidations" is inaccurate.'
  },
  {
    q: 'What is the simplest FAQ-based way to avoid liquidation?',
    options: [
      'Keep health factor above 1 by adding collateral or repaying debt.',
      'Use Bundler3 so positions cannot liquidate.',
      'Only borrow from vaults rather than markets.',
      'Vote in governance to pause the market.'
    ],
    correct: 0,
    explanation: 'The FAQ says liquidation can be avoided by maintaining health factor above 1, typically by repaying or adding collateral.',
    category: 'liquidations',
    difficulty: 'fundamental',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'This is strong user-facing support phrasing.'
  },
  {
    q: 'What is the FAQ’s plain-English distinction between Morpho Markets and Morpho Vaults?',
    options: [
      'Markets are simple immutable lending venues; vaults are curated products that allocate across one or more markets.',
      'Markets are custodial and vaults are permissionless.',
      'Markets are only for borrowers and vaults are only for liquidators.',
      'Markets are deprecated and vaults have replaced them entirely.'
    ],
    correct: 0,
    explanation: 'The FAQ draws a direct distinction between simple immutable markets and curated vault products.',
    category: 'curation',
    difficulty: 'fundamental',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'This is a very usable intro explanation for non-technical partners.'
  },
  {
    q: 'What is the FAQ’s explanation for why curation exists?',
    options: [
      'It simplifies market selection and strategy changes for users by letting vaults allocate automatically according to a strategy.',
      'It allows governance to freeze unsafe assets.',
      'It removes the need for oracles and LLTV settings.',
      'It guarantees higher APY than direct markets.'
    ],
    correct: 0,
    explanation: 'The FAQ frames curation as a simplification layer over a permissionless set of possible markets.',
    category: 'curation',
    difficulty: 'intermediate',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'This is a clean business-value explanation for vaults.'
  },
  {
    q: 'How does the FAQ describe curators?',
    options: [
      'Independent third-party risk experts offering different Morpho Vaults.',
      'Governance delegates that control all markets on a chain.',
      'Protocol-owned bots that manage liquidations.',
      'Users who only provide Snapshot votes.'
    ],
    correct: 0,
    explanation: 'The FAQ describes curators as independent third-party risk experts.',
    category: 'curation',
    difficulty: 'fundamental',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'Keep the wording independent and risk-expert oriented.'
  },
  {
    q: 'Which build-oriented statement is closest to the FAQ?',
    options: [
      'Morpho’s flexible infrastructure can support earn products, structured products, yield aggregators, and other lending or borrowing use cases.',
      'Morpho only supports vault UIs built by Morpho Labs.',
      'Morpho is only intended for governance dashboards.',
      'Morpho can only be integrated through the main frontend.'
    ],
    correct: 0,
    explanation: 'The FAQ explicitly positions Morpho as flexible infrastructure for many lending/borrowing use cases.',
    category: 'build',
    difficulty: 'fundamental',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: 'Useful for partner-call ideation.'
  },
  {
    q: 'Where does the FAQ tell builders to look for deeper technical information or support?',
    options: [
      'Morpho docs, GitHub repository, and Discord',
      'Only Snapshot and the governance forum',
      'Only third-party explorers',
      'Only Merkl reward dashboards'
    ],
    correct: 0,
    explanation: 'The FAQ points builders toward docs, GitHub, and Discord.',
    category: 'build',
    difficulty: 'fundamental',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: 'Good support-direction answer when you need to route a builder.'
  },
  {
    q: 'According to the FAQ, who can participate in governance discussions versus formal voting?',
    options: [
      'Anyone can join discussions, but voting requires MORPHO voting power directly or via delegation.',
      'Only Morpho Labs can join discussions or vote.',
      'Anyone can vote without tokens or delegation.',
      'Only vault curators can use Snapshot.'
    ],
    correct: 0,
    explanation: 'The FAQ distinguishes open discussion participation from token-based or delegated voting rights.',
    category: 'governance',
    difficulty: 'intermediate',
    module_slug: 'final-review-and-feedback-loop',
    interviewTip: 'This is a strong crisp governance answer.'
  }
];

const COMPLEMENTARY_OPEN_ENDED_QUESTIONS = [
  {
    id: 16,
    question: 'A partner asks, "Is Morpho secure, and can assets be frozen?" Give the answer you would use on a live call.',
    category: 'partner-communication',
    difficulty: 'intermediate',
    rubric: [
      'States that Morpho uses industry-leading security practices without claiming zero risk',
      'Mentions audits and bug bounty as supporting evidence rather than guarantees',
      'States clearly that Morpho cannot freeze user assets',
      'Keeps the tone balanced and non-promotional',
      'Encourages partner-side diligence'
    ],
    followUp: 'How do you answer that question without sounding like you are making legal guarantees?'
  },
  {
    id: 17,
    question: 'Explain vault selection to a partner building a compare-vaults interface for end users.',
    category: 'poc-readiness',
    difficulty: 'intermediate',
    rubric: [
      'Mentions curator quality or track record',
      'Mentions risk exposures such as collateral, LLTV, or oracle choices',
      'Mentions fees and current or historical net APY',
      'Translates those criteria into a product comparison table',
      'Avoids presenting APY alone as the only decision metric'
    ],
    followUp: 'What would you surface first if the user is yield-maximizing versus risk-sensitive?'
  },
  {
    id: 18,
    question: 'A new borrower asks why their collateral does not earn supply APY. Explain the protocol reason and product trade-off.',
    category: 'protocol-accuracy',
    difficulty: 'intermediate',
    rubric: [
      'States that collateral is not lent out by default',
      'Connects that to reduced liquidation liquidity constraints',
      'Connects it to higher capital utilization or cleaner borrow mechanics',
      'Keeps the answer understandable for a user or partner PM',
      'Avoids inventing governance or fee-based reasons'
    ],
    followUp: 'How would you reflect that behavior in a borrower dashboard?'
  },
  {
    id: 19,
    question: 'A partner wants to explain earning risks responsibly in their own UI. What should they say?',
    category: 'partner-empathy',
    difficulty: 'advanced',
    rubric: [
      'Mentions general protocol risk without pretending it disappears',
      'Mentions bad debt risk, liquidity risk, and vault risk',
      'Explains that withdrawals depend on available liquidity',
      'Encourages due diligence on curator and vault settings',
      'Uses user-safe language rather than legalese'
    ],
    followUp: 'What warning text would you place near a withdrawal button if liquidity is temporarily exhausted?'
  },
  {
    id: 20,
    question: 'A BD teammate asks what kinds of products partners can realistically build on Morpho. Give a concise but concrete answer.',
    category: 'partner-communication',
    difficulty: 'fundamental',
    rubric: [
      'Mentions at least three supported product types from the FAQ or docs',
      'Frames Morpho as permissionless infrastructure rather than only a frontend',
      'Connects the answer to partner use cases',
      'Remains concise and practical',
      'Sounds like someone comfortable scoping integrations'
    ],
    followUp: 'Which of those product types would you prototype first for a wallet partner and why?'
  },
  {
    id: 21,
    question: 'How would you explain governance participation to a technically strong partner who has never interacted with Snapshot or delegation before?',
    category: 'governance',
    difficulty: 'intermediate',
    rubric: [
      'Defines governance as MORPHO-holder voting and execution processes',
      'Distinguishes open forum discussion from voting rights',
      'Mentions direct token holding or delegated voting power',
      'References forum and Snapshot correctly',
      'Keeps the explanation simple enough for first-time participants'
    ],
    followUp: 'Why is it useful to know governance pathways even in a partner engineering role?'
  }
];

const COMPLEMENTARY_CODE_CHALLENGES = [
  {
    id: 'format-net-apy-breakdown',
    title: 'Format Net APY Breakdown',
    difficulty: 'easy',
    category: 'rewards',
    description: 'Build a helper that separates native APY, third-party rewards APR, and MORPHO rewards APR into a dashboard-friendly total.',
    starterCode: `interface ApyBreakdown {
  nativeApyBps: number;
  rewardsAprBps: number;
  morphoRewardsAprBps: number;
}

function summarizeNetApy(parts: ApyBreakdown) {
  // TODO: return each component and totalBps
  return {
    nativeApyBps: 0,
    rewardsAprBps: 0,
    morphoRewardsAprBps: 0,
    totalBps: 0
  };
}`,
    solution: `interface ApyBreakdown {
  nativeApyBps: number;
  rewardsAprBps: number;
  morphoRewardsAprBps: number;
}

function summarizeNetApy(parts: ApyBreakdown) {
  const totalBps =
    parts.nativeApyBps +
    parts.rewardsAprBps +
    parts.morphoRewardsAprBps;

  return {
    nativeApyBps: parts.nativeApyBps,
    rewardsAprBps: parts.rewardsAprBps,
    morphoRewardsAprBps: parts.morphoRewardsAprBps,
    totalBps
  };
}`,
    hints: [
      'The dashboard should preserve the breakdown, not only the sum.',
      'Return the original values plus a computed total.'
    ],
    testCases: [
      { input: ['{ nativeApyBps: 420, rewardsAprBps: 180, morphoRewardsAprBps: 35 }'], expected: '{ totalBps: 635 }' }
    ]
  },
  {
    id: 'pick-vault-checklist',
    title: 'Build a Vault Due-Diligence Checklist',
    difficulty: 'easy',
    category: 'dashboard',
    description: 'Turn FAQ vault-selection guidance into a structured checklist for a comparison UI.',
    starterCode: `interface VaultCardInput {
  curator: string;
  performanceFeeBps: number;
  riskNotes: string[];
  hasHistoricalNetApy: boolean;
}

function buildVaultChecklist(input: VaultCardInput): string[] {
  // TODO
  return [];
}`,
    solution: `interface VaultCardInput {
  curator: string;
  performanceFeeBps: number;
  riskNotes: string[];
  hasHistoricalNetApy: boolean;
}

function buildVaultChecklist(input: VaultCardInput): string[] {
  const items = [
    \`Review curator track record: \${input.curator}\`,
    \`Review performance fee: \${input.performanceFeeBps} bps\`,
    \`Review risk exposures: \${input.riskNotes.join(', ')}\`
  ];

  if (input.hasHistoricalNetApy) {
    items.push('Review current and historical net APY');
  } else {
    items.push('Historical net APY data missing: flag for due diligence');
  }

  return items;
}`,
    hints: [
      'Use curator, fees, risk, and APY history because those are explicitly called out in the FAQ.',
      'Return human-readable checklist items.'
    ],
    testCases: [
      { input: ['{ curator: "Gauntlet", performanceFeeBps: 1000, riskNotes: ["cbBTC exposure", "oracle quality"], hasHistoricalNetApy: true }'], expected: 'Review current and historical net APY' }
    ]
  },
  {
    id: 'withdrawal-availability-message',
    title: 'Write a Withdrawal Availability Message',
    difficulty: 'medium',
    category: 'support',
    description: 'Create a UI message that explains whether a user can withdraw now or must wait for liquidity.',
    starterCode: `function getWithdrawalMessage(
  requestedAssets: bigint,
  availableLiquidity: bigint
): string {
  // TODO
  return '';
}`,
    solution: `function getWithdrawalMessage(
  requestedAssets: bigint,
  availableLiquidity: bigint
): string {
  if (availableLiquidity >= requestedAssets) {
    return 'Withdrawal can proceed now because enough liquidity is currently available.';
  }

  return 'Withdrawal cannot be completed immediately because current available liquidity is lower than the requested amount. The user must wait for new liquidity to become available.';
}`,
    hints: [
      'This is an FAQ-based earn risk explanation.',
      'Differentiate immediate execution from delayed availability.'
    ],
    testCases: [
      { input: ['100n', '80n'], expected: 'Withdrawal cannot be completed immediately because current available liquidity is lower than the requested amount. The user must wait for new liquidity to become available.' }
    ]
  },
  {
    id: 'borrower-risk-summary',
    title: 'Generate a Borrower Risk Summary',
    difficulty: 'medium',
    category: 'support',
    description: 'Summarize liquidation and oracle risk for a borrower support panel.',
    starterCode: `function buildBorrowRiskSummary(hasOracleConcern: boolean): string[] {
  // TODO
  return [];
}`,
    solution: `function buildBorrowRiskSummary(hasOracleConcern: boolean): string[] {
  const items = [
    'Monitor health factor because positions become liquidatable when health factor reaches 1 or lower.',
    'Add collateral or repay debt to improve safety if the position becomes risky.'
  ];

  if (hasOracleConcern) {
    items.push('Review oracle security, reliability, update frequency, and manipulation exposure for this market.');
  }

  return items;
}`,
    hints: [
      'Use FAQ borrower and liquidation language.',
      'Liquidation risk and oracle risk should both appear when relevant.'
    ],
    testCases: [
      { input: ['true'], expected: 'Review oracle security, reliability, update frequency, and manipulation exposure for this market.' }
    ]
  }
];

MORPHO_COMPLEMENTARY_SOURCES.push({
  id: 'earn-borrow-integration-copy',
  title: 'Morpho Earn / Borrow Integration Copy + Repo Notes',
  type: 'integration-guide',
  file: 'morpho-complementary.txt',
  sections: ['earn', 'borrow', 'ux', 'security', 'repos']
});

Object.assign(COMPLEMENTARY_LESSON_APPENDICES, {
  'Choosing the Right Integration Surface': `## Integration-guide reinforcement

The earn-product integration copy makes the architecture split explicit: vault operations, yield tracking, and rewards integration are three separate responsibilities. That is a useful planning framework when deciding which reads live in GraphQL, which writes go onchain, and which reward flows need Merkl-specific handling.`,
  'Blue SDK and Direct Contract Patterns': `## Integration-guide reinforcement

The borrow integration copy provides a clean checklist for direct-market products: read market parameters, fetch live market state, display user collateral and debt with Health Factor, and expose available liquidity including Public Allocator context when relevant. That is exactly the read/write split a solid SDK-backed product should implement.`,
  'Fastest High-Value POC Patterns': `## Integration-guide reinforcement

The earn-integration page provides a useful POC scaffold: vault discovery, APY and allocation display, user position view, reward tracking, and claims. If you need a demo fast, that checklist is more useful than inventing a greenfield dashboard from scratch.`,
  'Dashboard Data Model: Positions, HF, Yield, Rewards': `## Integration-guide reinforcement

The integration copy gives a clear data schema for both product surfaces. Earn views should include vault metadata, APY, allocation breakdown, risk profile, and user rewards. Borrow views should include LLTV, oracle, IRM, liquidity, collateral, debt, health factor, and liquidation alerts.`,
  'Security Checklist for Real Integrations': `## Integration-guide reinforcement

The integration pages add two product requirements you should not treat as legal afterthoughts: show "Powered by Morpho" attribution and display the first-use disclaimer before users interact. The security review copy also gives stronger talking points for why Morpho emphasizes formal verification, fuzzing, mutation testing, peer review, audits, contests, and bounties.`,
  'How to Use This Pattern in a Partner Demo': `## Integration-guide reinforcement

One of the best demo details in the earn integration copy is that users receive ERC4626 shares and vault share price rises as yield accrues. That gives you a concrete "how the product works" story instead of only discussing APY labels on a screen.`
});

Object.assign(COMPLEMENTARY_LESSON_APPENDICES, {
  'What Vault V2 Actually Is': `## Blog reinforcement

The September 29, 2025 Vaults V2 launch post gives a stronger product framing than the docs alone: Vaults V2 is intended as a global standard for noncustodial asset curation, not just a new Morpho-specific wrapper. The big idea is future-proof curation across current and future Morpho protocols without needing upgrades or migrations.`,
  'Bundler3 for Atomic Flows': `## Blog reinforcement

The Bundler3 launch post helps with product framing: Bundler3 is ecosystem infrastructure for complex onchain workflows, not an app-only internal tool. That matters when pitching one-click leverage, migration, or refinance flows to integrators.`,
  'Public Allocator and Liquidity Monitoring': `## Blog reinforcement

The Public Allocator blog sharpens the partner explanation: isolated markets keep risk local, while Public Allocator helps make liquidity more reachable at borrow time through a just-in-time reallocation path. That is much stronger than vaguely saying Morpho "solves fragmentation."`,
  'Answer: Why Morpho over Aave or Compound?': `## Blog reinforcement

The "DeFi mullet" and institutional-infrastructure posts give strong commercial language here. Morpho is often the better fit when the partner wants to keep their own UX, distribution, and controls while outsourcing the lending backend to transparent, noncustodial infrastructure.`
});

COMPLEMENTARY_QUIZ_QUESTIONS.push(
  {
    q: 'What are the three main components called out in the earn integration copy?',
    options: [
      'Vault operations, yield tracking, and rewards integration',
      'Governance voting, liquidation bots, and Snapshot delegation',
      'Vault deployment, oracle creation, and chain whitelisting',
      'Borrow APY, liquidation price, and liquidation execution'
    ],
    correct: 0,
    explanation: 'The integration page frames earn integrations around vault operations, yield tracking, and rewards integration.',
    category: 'earn-integration',
    difficulty: 'fundamental',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: 'This is a very usable scoping framework.'
  },
  {
    q: 'In the earn asset flow, what do users receive when they deposit into a Morpho Vault?',
    options: [
      'Vault shares representing proportional ownership',
      'A permission to borrow against the vault',
      'A liquidation bonus token',
      'A fixed APY coupon'
    ],
    correct: 0,
    explanation: 'The integration guide states that users receive ERC4626 vault shares representing proportional ownership.',
    category: 'earn-integration',
    difficulty: 'fundamental',
    module_slug: 'real-world-integrations-and-merkl',
    interviewTip: 'This is a good plain-English answer about vault accounting.'
  },
  {
    q: 'According to the earn integration copy, what should a risk-transparency view show?',
    options: [
      'Underlying markets, collateral exposure, utilization, allocation strategy, and pending changes',
      'Only historical APY and token logos',
      'Only the curator Twitter handle and Discord link',
      'Only the latest liquidation transaction'
    ],
    correct: 0,
    explanation: 'The guide says earn products should surface underlying market exposure, collateral types, utilization, allocation strategy, and pending changes.',
    category: 'earn-integration',
    difficulty: 'intermediate',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: 'This is a good checklist for vault detail pages.'
  },
  {
    q: 'Which borrow integration read operation is explicitly called out in the copy page?',
    options: [
      'Present available liquidity, including reallocatable liquidity from the Public Allocator',
      'Load curator performance fees for the borrow market',
      'Fetch only governance voting power',
      'Simulate Merkl reward claims before borrow'
    ],
    correct: 0,
    explanation: 'The borrow integration page explicitly says to present available liquidity, including reallocatable liquidity from the Public Allocator.',
    category: 'borrow-integration',
    difficulty: 'intermediate',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: 'This is a strong answer when talking about liquidity-aware borrow UIs.'
  },
  {
    q: 'Which monitoring capability is explicitly required for a responsible borrow integration?',
    options: [
      'Track Health Factor changes in real-time and alert users near liquidation threshold',
      'Vote automatically on behalf of users in governance',
      'Whitelist every liquidator address before users can borrow',
      'Guarantee liquidation execution by the protocol'
    ],
    correct: 0,
    explanation: 'The borrow integration page explicitly calls for Health Factor monitoring and liquidation-threshold alerts.',
    category: 'borrow-integration',
    difficulty: 'fundamental',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: 'This is the product-safety answer interviewers want.'
  },
  {
    q: 'What UX requirement appears in both the earn and borrow integration copy?',
    options: [
      'Include a "Powered by Morpho" mention and first-use disclaimer flow',
      'Hide all risk explanations behind an advanced settings modal',
      'Require users to connect through the main Morpho frontend only',
      'Force all apps to use the same wallet provider'
    ],
    correct: 0,
    explanation: 'Both integration pages require Powered by Morpho attribution and a first-use disclaimer notice.',
    category: 'ux-requirements',
    difficulty: 'fundamental',
    module_slug: 'partner-communication-and-objections',
    interviewTip: 'Treat attribution and disclosure as product requirements.'
  },
  {
    q: 'Which security practice is explicitly named in the security review copy?',
    options: [
      'Formal verification',
      'Centralized market shutdown',
      'Permissioned liquidator auctions',
      'Forced KYC for vault depositors'
    ],
    correct: 0,
    explanation: 'The security review copy explicitly lists formal verification among Morpho security practices.',
    category: 'security',
    difficulty: 'fundamental',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'Use multiple practices together instead of naming one silver bullet.'
  },
  {
    q: 'What does the morpho-blue-oracles README say an oracle returns?',
    options: [
      'The price of 1 unit of collateral quoted in 1 unit of loan asset',
      'The utilization of the whole protocol',
      'The latest governance-approved LLTV',
      'A USD price only'
    ],
    correct: 0,
    explanation: 'The repo README says the oracle returns the price of 1 asset of collateral token quoted in 1 asset of loan token.',
    category: 'oracles',
    difficulty: 'intermediate',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'This is the exact repo-level oracle definition.'
  },
  {
    q: 'What does the Ponder for Morpho v1 repo describe itself as?',
    options: [
      'A monorepo template for indexing Morpho v1 state with Ponder, usable as a GraphQL API starting point',
      'A replacement for the Morpho API',
      'A mandatory dependency for all vault integrations',
      'A liquidation executor contract'
    ],
    correct: 0,
    explanation: 'The repo describes itself as a Ponder-based indexing template that can be run as a GraphQL API into Morpho v1 data.',
    category: 'indexing',
    difficulty: 'intermediate',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: 'Great POC or partner-data-infra talking point.'
  },
  {
    q: 'What is the current guidance from the morpho-blue-reward-programs repo for new reward programs?',
    options: [
      'Use Merkl for new programs because the old repository is deprecated',
      'Use the old reward-program repo for all new campaigns',
      'Only governance can create reward programs now',
      'Rewards are no longer supported on Morpho'
    ],
    correct: 0,
    explanation: 'The repo is marked deprecated and points new reward programs to Merkl.',
    category: 'rewards',
    difficulty: 'fundamental',
    module_slug: 'real-world-integrations-and-merkl',
    interviewTip: 'This is the correct up-to-date answer for new reward programs.'
  },
  {
    q: 'According to the archived reward-program repo, what had to happen before a pull request would be merged?',
    options: [
      'Funds had to be sent to the URD before the program start date and referenced in the PR process',
      'The vault owner had to freeze withdrawals',
      'The market had to be upgradeable',
      'The program had to avoid all borrow rewards'
    ],
    correct: 0,
    explanation: 'The old repo required funding the URD before the program start and used verification checks before merge.',
    category: 'rewards',
    difficulty: 'advanced',
    module_slug: 'real-world-integrations-and-merkl',
    interviewTip: 'Good historical context for incentive-ops discussions.'
  }
);

COMPLEMENTARY_OPEN_ENDED_QUESTIONS.push(
  {
    id: 22,
    question: 'A partner wants to ship an Earn surface on Morpho. Explain the minimum read paths, write paths, and risk disclosures you would require before launch.',
    category: 'poc-readiness',
    difficulty: 'advanced',
    rubric: [
      'Mentions vault discovery, APY, allocations, and user position reads',
      'Mentions deposit, withdraw, and reward-claim write paths',
      'Mentions risk transparency around markets, collateral exposure, utilization, and curator strategy',
      'Mentions attribution and first-use disclaimer requirements',
      'Sounds like a launch checklist rather than generic theory'
    ],
    followUp: 'What would you postpone to v2 if you only had one week to build the first version?'
  },
  {
    id: 23,
    question: 'Walk through the asset flow of a Morpho Earn product from deposit to yield accrual to withdrawal.',
    category: 'protocol-accuracy',
    difficulty: 'advanced',
    rubric: [
      'Mentions deposit of the underlying asset into the vault',
      'Mentions receipt of vault shares',
      'Mentions allocation into underlying Morpho venues',
      'Explains share-price-based yield accrual clearly',
      'Explains withdrawal through the relevant liquidity path'
    ],
    followUp: 'How would your explanation differ for Vault V1 versus Vault V2?'
  },
  {
    id: 24,
    question: 'A partner wants to build a borrow interface. What are the must-have monitoring and warning systems?',
    category: 'integration-judgment',
    difficulty: 'intermediate',
    rubric: [
      'Mentions real-time or near-real-time Health Factor tracking',
      'Mentions liquidation-threshold alerts',
      'Mentions dynamic market-state and interest-rate updates',
      'Mentions liquidity visibility including Public Allocator context when relevant',
      'Translates the answer into product behavior rather than only protocol theory'
    ],
    followUp: 'What would you show differently for a novice user versus a power borrower?'
  },
  {
    id: 25,
    question: 'How do you present Morpho security in a serious way to a skeptical integrator?',
    category: 'partner-communication',
    difficulty: 'advanced',
    rubric: [
      'Mentions that there is no zero-risk claim',
      'Mentions multiple security practices such as formal verification, fuzzing, mutation tests, peer review, audits, and bounties',
      'Uses the security work as evidence, not as a guarantee',
      'Encourages partner-side diligence and risk review',
      'Maintains a calm and credible tone'
    ],
    followUp: 'Which security claims should you avoid making on a live partner call?'
  },
  {
    id: 26,
    question: 'Explain what the Ponder template and liquidation bot repos tell you about Morpho’s integration style and ecosystem support.',
    category: 'operational-excellence',
    difficulty: 'advanced',
    rubric: [
      'Mentions indexing support or GraphQL-style data access from the Ponder template',
      'Mentions operational tooling from the liquidation bot',
      'Explains that Morpho provides ecosystem building blocks beyond core contracts',
      'Connects repo knowledge to partner POCs or internal tooling',
      'Does not claim those repos are mandatory dependencies'
    ],
    followUp: 'Which repo would you reach for first if a partner wanted an internal monitoring tool rather than an end-user product?'
  }
);

COMPLEMENTARY_CODE_CHALLENGES.push(
  {
    id: 'earn-launch-checklist',
    title: 'Build an Earn Launch Checklist',
    difficulty: 'medium',
    category: 'support',
    description: 'Convert the Earn integration copy into a product-launch checklist with reads, writes, monitoring, UX, and risk disclosure.',
    starterCode: `function buildEarnLaunchChecklist(): string[] {
  // TODO
  return [];
}`,
    solution: `function buildEarnLaunchChecklist(): string[] {
  return [
    'Implement vault discovery, APY display, allocation display, and user position reads.',
    'Implement approvals, deposits, withdrawals, and reward claiming.',
    'Track position changes and significant vault parameter changes.',
    'Display risk transparency for underlying markets, collateral exposure, utilization, and curator strategy.',
    'Include Powered by Morpho attribution and first-use disclaimer flow.'
  ];
}`,
    hints: [
      'Use the explicit sections from the integration copy page.',
      'This should read like a product-launch checklist.'
    ],
    testCases: [
      { input: [], expected: 'Include Powered by Morpho attribution and first-use disclaimer flow.' }
    ]
  },
  {
    id: 'borrow-monitoring-config',
    title: 'Configure Borrow Monitoring Rules',
    difficulty: 'medium',
    category: 'dashboard',
    description: 'Return a simple config object for a borrow dashboard with HF alerting, liquidity visibility, and dynamic market refresh.',
    starterCode: `function buildBorrowMonitoringConfig() {
  // TODO
  return {
    trackHealthFactor: false,
    showAllocatorLiquidity: false,
    refreshMarketState: false
  };
}`,
    solution: `function buildBorrowMonitoringConfig() {
  return {
    trackHealthFactor: true,
    showAllocatorLiquidity: true,
    refreshMarketState: true
  };
}`,
    hints: [
      'The borrow integration page names all three behaviors directly.',
      'This challenge is about product requirements, not chain calls.'
    ],
    testCases: [
      { input: [], expected: '{ trackHealthFactor: true, showAllocatorLiquidity: true, refreshMarketState: true }' }
    ]
  },
  {
    id: 'reward-program-validation-summary',
    title: 'Summarize Reward Program Validation',
    difficulty: 'hard',
    category: 'rewards',
    description: 'Build a validator summary for an old-style reward-program submission based on the archived repo checks.',
    starterCode: `interface RewardProgramInput {
  startInFuture: boolean;
  validUrd: boolean;
  marketOrVaultWhitelisted: boolean;
  tokenPriced: boolean;
  fundsSent: boolean;
  rewardMatchesFunding: boolean;
}

function summarizeProgramValidation(input: RewardProgramInput): string[] {
  // TODO
  return [];
}`,
    solution: `interface RewardProgramInput {
  startInFuture: boolean;
  validUrd: boolean;
  marketOrVaultWhitelisted: boolean;
  tokenPriced: boolean;
  fundsSent: boolean;
  rewardMatchesFunding: boolean;
}

function summarizeProgramValidation(input: RewardProgramInput): string[] {
  const issues: string[] = [];

  if (!input.startInFuture) issues.push('Program start date must be in the future.');
  if (!input.validUrd) issues.push('URD address is invalid.');
  if (!input.marketOrVaultWhitelisted) issues.push('Target market or vault is not valid and whitelisted.');
  if (!input.tokenPriced) issues.push('Reward token is not priced in the API yet.');
  if (!input.fundsSent) issues.push('Funds must be sent to the URD before submission.');
  if (!input.rewardMatchesFunding) issues.push('Reward amount does not match funded amount.');

  return issues;
}`,
    hints: [
      'Use the validation checklist from the archived reward-program repo.',
      'Return only failing conditions.'
    ],
    testCases: [
      { input: ['{ startInFuture: true, validUrd: false, marketOrVaultWhitelisted: true, tokenPriced: true, fundsSent: false, rewardMatchesFunding: true }'], expected: 'Funds must be sent to the URD before submission.' }
    ]
  }
);

module.exports = {
  MORPHO_COMPLEMENTARY_SOURCES,
  COMPLEMENTARY_LESSON_APPENDICES,
  COMPLEMENTARY_QUIZ_QUESTIONS,
  COMPLEMENTARY_OPEN_ENDED_QUESTIONS,
  COMPLEMENTARY_CODE_CHALLENGES
};
