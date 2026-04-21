/**
 * LLM Evaluation Service
 * Structured local evaluation for Morpho Partner Engineer drills.
 */

const fs = require('fs');
const path = require('path');
const { COMPLEMENTARY_OPEN_ENDED_QUESTIONS } = require('../../content/complementary-data');
const { BLOG_OPEN_ENDED_QUESTIONS } = require('../../content/blog-posts-data');
const { CUSTOMER_STORY_OPEN_ENDED_QUESTIONS } = require('../../content/customer-stories-data');
const { DRILL_GOLD_ANSWERS } = require('../../content/drill-gold-answers');

const CORE_OPEN_ENDED_QUESTIONS = [
  {
    id: 1,
    question: 'Explain Morpho Blue to a crypto-native partner who currently only knows pooled lending protocols like Aave.',
    category: 'partner-communication',
    difficulty: 'fundamental',
    rubric: [
      'Explains isolated markets versus pooled lending clearly',
      'Mentions the five market parameters',
      'Explains why isolation matters for partners launching new assets',
      'Uses business translation, not only protocol jargon',
      'Sounds concise and credible rather than salesy'
    ],
    followUp: 'When would pooled liquidity still be a reasonable answer for a partner?'
  },
  {
    id: 2,
    question: 'Walk through Health Factor and liquidation risk for a partner building a borrower dashboard.',
    category: 'protocol-accuracy',
    difficulty: 'intermediate',
    rubric: [
      'Defines Health Factor accurately as a safety ratio',
      'Mentions HF <= 1 as the liquidation threshold',
      'References oracle price and debt accrual as drivers of risk',
      'Recommends UI protections like warnings and safety buffers',
      'Explains the concept in a partner-friendly way'
    ],
    followUp: 'How would you explain a liquidation that happened even though the user thought they were still below LLTV?'
  },
  {
    id: 3,
    question: 'Why is Morpho Blue immutable, and how would you position that trade-off to an institutional or protocol partner?',
    category: 'partner-communication',
    difficulty: 'intermediate',
    rubric: [
      'Defines immutability accurately',
      'Explains predictability and diligence advantages',
      'Acknowledges trade-offs like inability to hot-patch deployed code',
      'Avoids overstating governance powers',
      'Frames the answer in trust and operational-control terms'
    ],
    followUp: 'What would you say if the partner prefers upgradeable systems?'
  },
  {
    id: 4,
    question: 'Compare Morpho Vault V2 with a simpler single-manager yield vault from a security and operations perspective.',
    category: 'vault-v2',
    difficulty: 'advanced',
    rubric: [
      'Names Owner, Curator, Allocator, and Sentinel correctly',
      'Explains separation of powers',
      'Mentions timelocked risk-increasing actions',
      'Mentions immediate risk-reducing actions',
      'Connects the design to partner trust or institutional controls'
    ],
    followUp: 'Which role compromise is most severe in Vault V2 and why?'
  },
  {
    id: 5,
    question: 'A curator asks why Vault V2 needs adapter caps, collateral caps, and market caps instead of one simple limit. Answer them.',
    category: 'vault-v2',
    difficulty: 'advanced',
    rubric: [
      'Explains the three cap layers correctly',
      'Mentions abstract risk control via ids',
      'Distinguishes absolute and relative caps',
      'Connects the design to risk curation flexibility',
      'Uses a concrete example instead of abstract hand-waving'
    ],
    followUp: 'What happens operationally if only one of those three cap layers is non-zero?'
  },
  {
    id: 6,
    question: 'When would you recommend Bundler3 instead of direct Morpho transactions?',
    category: 'integration-judgment',
    difficulty: 'intermediate',
    rubric: [
      'Explains atomic multi-step execution',
      'Provides at least one real example like leverage or refinance',
      'Notes that direct calls remain fine for simple flows',
      'Frames the value as state safety and UX, not just gas',
      'Shows trade-off awareness'
    ],
    followUp: 'Describe a leverage flow where partial completion would be dangerous.'
  },
  {
    id: 7,
    question: 'A partner wants a quick POC for incentivized vaults. Describe the dashboard you would ship first using Morpho and Merkl.',
    category: 'poc-readiness',
    difficulty: 'advanced',
    rubric: [
      'Uses Morpho GraphQL for vault discovery and APY data',
      'Uses Merkl or rewards data correctly for incentives',
      'Separates base APY from reward APR before showing combined yield',
      'Includes one user-facing action like claim simulation or position view',
      'Sounds like a practical first deliverable, not a vague concept'
    ],
    followUp: 'How would you handle partial failure if rewards data times out but vault state still loads?'
  },
  {
    id: 8,
    question: 'How would you explain the Merkl + Morpho integration pattern to a BD teammate before a partner demo?',
    category: 'partner-communication',
    difficulty: 'intermediate',
    rubric: [
      'Explains that Morpho provides yield/state and Merkl provides reward context',
      'States why this matters for partner demos or deposit growth',
      'Avoids drowning the answer in low-level implementation details',
      'Uses clear business translation',
      'Mentions that the pattern is ideal for fast POCs or dashboards'
    ],
    followUp: 'Why should the UI not flatten base APY and rewards APR into one unexplained number?'
  },
  {
    id: 9,
    question: 'A partner says: "Why should we build on Morpho instead of just building our own isolated lending market?" Give a balanced answer.',
    category: 'objection-handling',
    difficulty: 'advanced',
    rubric: [
      'Acknowledges the appeal of building in-house',
      'Mentions battle-tested contracts and faster time to market',
      'Mentions operational ecosystem benefits like docs, API, tooling, or support',
      'Avoids absolutist or tribal framing',
      'Matches the answer to a partner decision rather than only protocol ideology'
    ],
    followUp: 'When would building in-house still be a rational choice?'
  },
  {
    id: 10,
    question: 'A partner integration is delayed by a bug and they are frustrated. How do you respond in the first five minutes?',
    category: 'partner-empathy',
    difficulty: 'intermediate',
    rubric: [
      'Acknowledges frustration and impact',
      'Separates protocol issue from integration issue carefully',
      'Asks for exact repro or transaction context',
      'Provides a next-update expectation or workaround path',
      'Sounds calm, accountable, and technically organized'
    ],
    followUp: 'How would your response change if funds are at risk versus if it is only a data-layer issue?'
  },
  {
    id: 11,
    question: 'A partner asks why their dashboard should not rely purely on the Morpho API for risk-critical behavior. Answer with nuance.',
    category: 'integration-judgment',
    difficulty: 'advanced',
    rubric: [
      'Mentions that the API is useful but provided without SLA',
      'Describes the API as an indexed read layer rather than execution truth',
      'Mentions caching and degraded-mode behavior',
      'Mentions onchain or simulation-backed logic for sensitive actions',
      'Avoids dismissing the API as worthless'
    ],
    followUp: 'What parts of a production app would you still happily build from GraphQL?'
  },
  {
    id: 12,
    question: 'How do you answer "Why Morpho over Aave?" without sounding tribal or unserious?',
    category: 'objection-handling',
    difficulty: 'intermediate',
    rubric: [
      'Acknowledges incumbent strengths fairly',
      'Highlights Morpho isolation and custom market fit',
      'Mentions Vault V2 curation controls when relevant',
      'Frames the answer around partner use case',
      'Maintains credibility and balance'
    ],
    followUp: 'What would you say if the partner values standardization more than custom market design?'
  },
  {
    id: 13,
    question: 'Describe the minimum information you need from a partner before recommending Blue, Vault V2, or both.',
    category: 'scoping',
    difficulty: 'intermediate',
    rubric: [
      'Asks about borrow versus earn workflow',
      'Asks about chain and target user action',
      'Asks about incentives, monitoring, or risk assumptions',
      'Turns discovery into a concrete architecture recommendation',
      'Keeps the answer practical'
    ],
    followUp: 'What would make you recommend a fast POC before a production integration?'
  },
  {
    id: 14,
    question: 'Explain Public Allocator to a partner that worries isolated markets fragment liquidity too much.',
    category: 'protocol-accuracy',
    difficulty: 'advanced',
    rubric: [
      'Explains the fragmentation problem clearly',
      'Explains that Public Allocator can reallocate liquidity toward target borrow demand',
      'Mentions curator-set fees and flow constraints',
      'Avoids claiming it removes all liquidity risk',
      'Connects it to a concrete partner or product concern'
    ],
    followUp: 'How would you use API data to surface reallocatable liquidity in a dashboard?'
  },
  {
    id: 15,
    question: 'What would a great internal escalation note look like after a partner reports a broken vault withdrawal flow?',
    category: 'operational-excellence',
    difficulty: 'intermediate',
    rubric: [
      'Includes chain and target address',
      'Includes expected versus actual behavior',
      'Includes reproduction steps or calldata context',
      'Includes impact or fund-risk assessment',
      'Sounds concise and actionable'
    ],
    followUp: 'What should you tell the partner while engineering is still investigating?'
  }
];

const OPEN_ENDED_QUESTIONS = [
  ...CORE_OPEN_ENDED_QUESTIONS,
  ...COMPLEMENTARY_OPEN_ENDED_QUESTIONS,
  ...BLOG_OPEN_ENDED_QUESTIONS,
  ...CUSTOMER_STORY_OPEN_ENDED_QUESTIONS
].map((question) => ({
  ...question,
  goldAnswer: DRILL_GOLD_ANSWERS[question.id]?.answer || '',
  goldFollowUpAnswer: DRILL_GOLD_ANSWERS[question.id]?.followUp || '',
  goldAnswerSources: DRILL_GOLD_ANSWERS[question.id]?.sources || []
}));

let docsChunksCache = null;

function loadDocsChunks() {
  if (docsChunksCache) return docsChunksCache;

  const files = [
    path.join(__dirname, '../../../morpho.txt'),
    path.join(__dirname, '../../../docs/morpho-source.txt'),
    path.join(__dirname, '../../../morpho-complementary.txt')
  ];

  const chunks = [];

  files.forEach((filePath) => {
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf8');
    content
      .split(/\n\s*\n+/)
      .map((chunk) => chunk.replace(/\s+/g, ' ').trim())
      .filter((chunk) => chunk.length >= 80)
      .forEach((chunk) => chunks.push(chunk));
  });

  docsChunksCache = chunks;
  return docsChunksCache;
}

function extractQueryTerms(questionLike) {
  const raw = [
    questionLike?.question || '',
    questionLike?.followUp || '',
    ...(Array.isArray(questionLike?.rubric) ? questionLike.rubric : [])
  ].join(' ');

  const forcedTerms = [];
  const text = raw.toLowerCase();
  const rubric = Array.isArray(questionLike?.rubric) ? questionLike.rubric : [];

  if (text.includes('morpho blue')) forcedTerms.push('morpho blue', 'isolated markets', 'five immutable parameters');
  if (text.includes('health factor')) forcedTerms.push('health factor', 'liquidation', 'lltv', 'oracle');
  if (text.includes('vault v2')) forcedTerms.push('vault v2');
  if (/owner|curator|allocator|sentinel|single-manager|separation of powers|timelocked/i.test(raw)) {
    forcedTerms.push('owner', 'curator', 'allocator', 'sentinel', 'timelock', 'separation of powers');
  }
  if (/borrow versus earn|borrow versus|earn workflow|target user action|architecture recommendation|fast poc/i.test(raw)) {
    forcedTerms.push('borrow', 'earn', 'workflow', 'incentives', 'monitoring', 'risk assumptions');
  }
  if (/adapter caps|collateral caps|market caps|absolute and relative caps|ids/i.test(raw)) {
    forcedTerms.push('adapter cap', 'collateral cap', 'market cap', 'absolute cap', 'relative cap');
  }
  if (text.includes('bundler3')) forcedTerms.push('bundler3', 'atomic');
  if (text.includes('merkl')) forcedTerms.push('merkl', 'rewards', 'apr');
  if (text.includes('public allocator')) forcedTerms.push('public allocator', 'reallocate liquidity');
  if (text.includes('graphql') || text.includes('api')) forcedTerms.push('graphql', 'api', 'indexed reads');
  if (text.includes('liquidation')) forcedTerms.push('liquidation', 'health factor', 'oracle price');
  if (text.includes('lltv')) forcedTerms.push('lltv');
  if (text.includes('aave')) forcedTerms.push('pooled lending', 'isolated markets');
  rubric.forEach((item) => {
    if (item.length > 12) forcedTerms.push(item.toLowerCase());
  });

  const tokenTerms = raw
    .toLowerCase()
    .replace(/[^a-z0-9\s/-]/g, ' ')
    .split(/\s+/)
    .filter((term) => term.length >= 4)
    .filter((term) => !['with', 'that', 'this', 'from', 'into', 'their', 'about', 'would', 'could', 'should', 'because', 'while', 'still', 'which', 'what', 'when', 'explain', 'answer', 'partner', 'building'].includes(term));

  return Array.from(new Set([...forcedTerms, ...tokenTerms]));
}

function getDocsReferenceSnippets(questionLike, limit = 4) {
  const chunks = loadDocsChunks();
  const terms = extractQueryTerms(questionLike);

  const scored = chunks
    .map((chunk) => {
      const lower = chunk.toLowerCase();
      const score = terms.reduce((sum, term) => {
        if (!lower.includes(term)) return sum;
        if (term.includes(' ')) return sum + 8;
        return sum + 2;
      }, 0);
      return { chunk, score };
    })
    .filter((item) => item.score >= 8)
    .sort((a, b) => b.score - a.score || a.chunk.length - b.chunk.length)
    .filter((item, index, array) =>
      array.findIndex((candidate) => candidate.chunk.slice(0, 180) === item.chunk.slice(0, 180)) === index
    )
    .slice(0, limit)
    .map((item) => item.chunk.slice(0, 320));

  return scored;
}

function getQuestionEvaluationContext(questionLike) {
  const text = `${questionLike?.question || ''} ${questionLike?.followUp || ''} ${questionLike?.category || ''}`.toLowerCase();
  const notes = [];

  if (/morpho blue|pooled lending|aave|five market parameters|isolated/.test(text)) {
    notes.push(
      'Morpho Blue should be explained as isolated lending, not pooled lending.',
      'A Blue market is defined by five immutable parameters: loan token, collateral token, oracle, IRM, and LLTV.',
      'The partner-facing advantage is dedicated market design and contained risk for new assets.'
    );
  }

  if (/health factor|hf|liquidation|lltv/.test(text)) {
    notes.push(
      'Health Factor is the safety ratio for a position; around 1 or below means liquidation risk is active or near.',
      'A position can liquidate even if the UI snapshot looked safe because oracle price, accrued debt, rounding, and exact timing can differ from a rough user snapshot.',
      'A strong answer should distinguish LLTV, current LTV, and Health Factor rather than treating them as identical.'
    );
  }

  if (/immutable|immutability|upgradeable/.test(text)) {
    notes.push(
      'Immutability means deployed core logic and market parameters are not admin-upgraded later.',
      'The trade-off is stronger predictability and diligence, but no hot patching of deployed code.'
    );
  }

  if (/owner|curator|allocator|sentinel|single-manager|separation of powers|timelocked/.test(text)) {
    notes.push(
      'Vault V2 roles are Owner, Curator, Allocator, and Sentinel.',
      'The security story is separation of powers rather than one all-powerful manager.',
      'Risk-increasing actions are timelocked; some risk-reducing actions such as cap decreases are immediate.'
    );
  }

  if (/adapter cap|collateral cap|market cap|cap layers|id/.test(text)) {
    notes.push(
      'Vault V2 can constrain risk at multiple layers, including adapter, collateral, and market exposure.',
      'The point is flexible risk curation across shared risk dimensions, not just one blunt limit.'
    );
  }

  if (/bundler3|atomic|refinance|leverage/.test(text)) {
    notes.push(
      'Bundler3 is for atomic multi-step execution where partial completion would be risky or poor UX.',
      'Simple flows can still use direct Morpho transactions; Bundler3 is not mandatory for everything.'
    );
  }

  if (/merkl|reward|reward apr|claim|incentivized vault/.test(text)) {
    notes.push(
      'Morpho state and base yield should be separated from reward incentives.',
      'A good answer should distinguish native APY from reward APR and avoid flattening them into one unexplained number.',
      'Claim simulation, position view, and graceful degraded mode are good POC patterns.'
    );
  }

  if (/build on morpho|own isolated lending market|why morpho|aave/.test(text)) {
    notes.push(
      'A balanced answer should acknowledge in-house appeal but explain the trade-off around time to market, battle-tested contracts, and ecosystem support.',
      'Do not reward tribal or absolutist comparisons.'
    );
  }

  if (/api|graphql|risk-critical|source of truth/.test(text)) {
    notes.push(
      'Morpho API or GraphQL is useful for indexed reads, dashboards, and discovery, but not the sole source of truth for risk-critical execution logic.',
      'A good answer should mention caching, degraded mode, and onchain-aware logic for sensitive actions.'
    );
  }

  if (/public allocator|fragment/.test(text)) {
    notes.push(
      'Public Allocator addresses liquidity fragmentation by reallocating within allowed vault constraints.',
      'It helps but does not eliminate all liquidity risk.'
    );
  }

  if (/scoping|borrow, earn|blue, vault v2|workflow/.test(text)) {
    notes.push(
      'Scoping should clarify whether the partner wants earn, borrow, or both, on which chain, for which assets, and for what user workflow.',
      'A strong answer turns those inputs into a concrete architecture recommendation.'
    );
  }

  if (/bug|withdrawal flow|escalation|frustrated|first five minutes/.test(text)) {
    notes.push(
      'Operationally strong answers include repro details, expected vs actual behavior, impact, and a clear next-update path.',
      'If funds may be at risk, the response should sound more urgent and safety-oriented than a data-only issue.'
    );
  }

  if (!notes.length) {
    notes.push(
      'Evaluate against the rubric strictly and prefer Morpho-specific mechanism over generic DeFi language.',
      'Do not reward answers that sound smooth but miss the actual operational or protocol detail.'
    );
  }

  return notes;
}

function getQuestionIntent(questionLike) {
  const text = `${questionLike?.question || ''} ${questionLike?.followUp || ''}`.toLowerCase();

  if (/minimum information|before recommending blue, vault v2, or both|scoping/.test(text)) {
    return 'This is a scoping question. The candidate should name the discovery inputs needed to decide between direct market exposure, curated vault exposure, or both.';
  }
  if (/health factor|liquidation risk/.test(text)) {
    return 'This is a borrower-risk explainer. The candidate should explain how safety is measured, what changes it, and what the product should warn about.';
  }
  if (/morpho blue|pooled lending|aave/.test(text)) {
    return 'This is a protocol positioning question. The candidate should contrast isolated markets with pooled lending and explain why a partner would care.';
  }
  if (/vault v2|single-manager/.test(text)) {
    return 'This is a security and operations comparison. The candidate should explain how Vault V2 changes trust, control, and governance assumptions.';
  }
  if (/bundler3|atomic/.test(text)) {
    return 'This is an integration-judgment question. The candidate should explain when atomic execution matters and when simpler direct calls are still fine.';
  }
  if (/merkl|incentivized vaults|dashboard/.test(text)) {
    return 'This is a POC design question. The candidate should describe the smallest useful product, the right data sources, and the key user actions.';
  }
  if (/public allocator/.test(text)) {
    return 'This is an overlay-design question. The candidate should explain the problem, what Public Allocator improves, and what it does not guarantee.';
  }

  return 'This question should be scored against the exact Morpho mechanism a partner would need explained during a real integration conversation.';
}

function rubricFallbackBullets(questionLike) {
  const rubric = Array.isArray(questionLike?.rubric) ? questionLike.rubric : [];
  return rubric
    .map((item) => item.replace(/^(Mentions|Explains|Uses|Defines|States|Includes|Connects|Frames|Asks|Avoids|Keeps|Provides|Names)\s+/i, ''))
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .slice(0, 6);
}

function getExpectedAnswerBlueprint(questionLike) {
  if (questionLike?.goldAnswer || questionLike?.goldFollowUpAnswer) {
    return {
      main: questionLike.goldAnswer ? [questionLike.goldAnswer] : [],
      followUp: questionLike.goldFollowUpAnswer ? [questionLike.goldFollowUpAnswer] : []
    };
  }

  const text = `${questionLike?.question || ''} ${questionLike?.followUp || ''}`.toLowerCase();
  const main = [];
  const followUp = [];

  if (/morpho blue|pooled lending|aave/.test(text)) {
    main.push(
      'State that Morpho Blue uses isolated markets rather than a pooled risk engine, so each market contains risk to one collateral/loan pair and parameter set.',
      'Name the five immutable market parameters: loan token, collateral token, oracle, IRM, and LLTV.',
      'Explain why partners care: custom market design and contained blast radius make it easier to launch or support new assets.',
      'Translate that into business terms instead of only protocol jargon.'
    );
    followUp.push(
      'Say pooled liquidity can still make sense when a partner values standardization, shared liquidity depth, and a simpler product surface more than custom market design.'
    );
  }

  if (/health factor|liquidation risk/.test(text)) {
    main.push(
      'Define Health Factor as a safety ratio showing how close a position is to liquidation, with HF around 1 or below meaning liquidation risk is active or near.',
      'Explain that HF changes with oracle price movement and debt accrual, not just the original borrow action.',
      'Recommend dashboard protections like warnings, safety buffers, and near-real-time risk refresh.'
    );
    followUp.push(
      'Explain that a user may still liquidate even if they thought they were below LLTV because the UI snapshot can lag actual onchain state, oracle price can move, debt accrues continuously, and exact liquidation timing matters.'
    );
  }

  if (/immutable|immutability|upgradeable/.test(text)) {
    main.push(
      'Define immutability as no admin-upgrade path for deployed core logic or market configuration after launch.',
      'Explain the upside: predictability, easier diligence, and lower governance surprise for partners and institutions.',
      'Acknowledge the trade-off: no hot patching, so deployment quality and integration diligence matter more.'
    );
    followUp.push(
      'If a partner prefers upgradeable systems, say that upgradeability offers flexibility but also expands governance and trust assumptions, whereas Morpho prioritizes predictable primitives.'
    );
  }

  if (/single-manager|owner|curator|allocator|sentinel|separation of powers/.test(text)) {
    main.push(
      'Name the four Vault V2 roles correctly: Owner, Curator, Allocator, and Sentinel.',
      'Explain that Vault V2 separates governance, strategy, day-to-day allocation, and emergency protection instead of concentrating power in one manager.',
      'Mention that risk-increasing changes are timelocked, while some protective risk-reducing actions can happen immediately.'
    );
    followUp.push(
      'The most severe compromise depends on context, but Curator or Owner compromise is usually most serious because they shape strategy and governance; the answer should justify the trade-off rather than naming one blindly.'
    );
  }

  if (/adapter caps|collateral caps|market caps|cap layers/.test(text)) {
    main.push(
      'Explain that adapter caps limit exposure through a venue or integration path, collateral caps limit shared collateral exposure, and market caps limit one exact market.',
      'Explain that multiple cap layers let curators manage shared risk dimensions instead of relying on one blunt limit.',
      'Mention absolute and relative controls, plus ids or shared dimensions, as the reason the model is flexible.'
    );
    followUp.push(
      'If only one layer is non-zero, operational control is concentrated at that layer and other shared-risk paths may remain unconstrained.'
    );
  }

  if (/bundler3|atomic/.test(text)) {
    main.push(
      'Explain that Bundler3 is for atomic multi-step execution when partial completion would leave the user in a broken or unsafe intermediate state.',
      'Give a real example such as leverage, refinance, repay-and-withdraw, or collateral swap.',
      'State that direct Morpho calls are still fine for simple single-step flows.'
    );
    followUp.push(
      'A good leverage example is borrow, swap, and resupply in one transaction; if that partially completed, the user could end with debt but without the intended collateral state.'
    );
  }

  if (/incentivized vaults|merkl|dashboard/.test(text)) {
    main.push(
      'Describe a first dashboard that loads vault discovery, APY, allocations, and user positions from Morpho data sources.',
      'Keep rewards separate by showing base APY and reward APR distinctly, then optionally a combined view with explanation.',
      'Include one concrete user action such as claim simulation, position drilldown, or deposit path preview.'
    );
    followUp.push(
      'If rewards data times out, still show vault state and base APY, mark incentives as temporarily unavailable, and avoid blocking the whole page.'
    );
  }

  if (/build on morpho|own isolated lending market|why morpho instead/.test(text)) {
    main.push(
      'Acknowledge that building in-house can offer full control and custom ownership.',
      'Then explain Morpho’s value: battle-tested contracts, faster time to market, existing docs/tooling/support, and access to an ecosystem already oriented around Morpho primitives.',
      'Keep the framing balanced rather than tribal.'
    );
    followUp.push(
      'Building in-house can still be rational when the partner needs highly custom risk, compliance, or product behavior that Morpho integration cannot satisfy cleanly.'
    );
  }

  if (/frustrated|first five minutes|bug/.test(text)) {
    main.push(
      'Start by acknowledging frustration and impact.',
      'Ask for exact repro details, chain, addresses, tx hashes, expected versus actual behavior, and whether funds are at risk.',
      'Set a concrete next update and separate protocol risk from integration risk carefully.'
    );
    followUp.push(
      'If funds are at risk, communication should become more urgent, safety-first, and escalation-oriented than for a pure data-layer issue.'
    );
  }

  if (/risk-critical|source of truth|graphql|api/.test(text)) {
    main.push(
      'Explain that the Morpho API or GraphQL layer is excellent for indexed reads, discovery, and dashboards, but not the sole source of truth for risk-critical decisions.',
      'Recommend degraded mode, caching, and onchain-aware or simulation-backed checks for sensitive actions like borrow safety.',
      'Still say that non-critical views can rely heavily on the API.'
    );
    followUp.push(
      'It is still reasonable to build lists, portfolio views, market discovery, historical analytics, and non-critical comparison surfaces from GraphQL.'
    );
  }

  if (/minimum information|before recommending blue, vault v2, or both|scoping/.test(text)) {
    main.push(
      'Ask first whether the partner wants a borrow workflow, an earn workflow, or both.',
      'Then ask about chain, assets, who the user is, and the exact action the user should take in the product.',
      'Ask about incentives, monitoring expectations, custody or compliance constraints, and how much control over risk configuration the partner wants.',
      'Turn that into a recommendation: Blue fits direct market or borrow-product needs, Vault V2 fits curated earn or managed allocation needs, and both fit partners that want a curated earn surface plus direct market exposure.'
    );
    followUp.push(
      'Recommend a fast POC when requirements are still fuzzy, the partner needs to validate UX or demand quickly, or the safest next step is a narrow dashboard or earn surface before production scope expands.'
    );
  }

  if (/public allocator/.test(text)) {
    main.push(
      'Explain the liquidity-fragmentation problem created by isolated markets.',
      'State that Public Allocator can reallocate liquidity across enabled markets within vault constraints to improve borrow execution.',
      'Be clear that it improves capital routing but does not remove liquidity risk entirely.'
    );
    followUp.push(
      'A good dashboard answer would surface available liquidity, reallocation headroom, and where reallocatable supply could support demand.'
    );
  }

  if (/escalation note|withdrawal flow/.test(text)) {
    main.push(
      'A strong escalation note includes chain, addresses, tx hashes, exact repro, expected versus actual behavior, and impact assessment.',
      'It should separate what is known from what is still being investigated and clearly call out whether funds are at risk.'
    );
    followUp.push(
      'Tell the partner what is being investigated, what evidence has been collected, whether funds look safe, and when they will get the next update.'
    );
  }

  if (/secure, and can assets be frozen|freeze user assets|assets be frozen/.test(text)) {
    main.push(
      'Say Morpho uses strong security practices such as audits and bug bounty programs, but avoid claiming zero risk.',
      'State clearly that Morpho cannot arbitrarily freeze user assets through an admin control path.',
      'Keep the tone balanced and non-legalistic.'
    );
    followUp.push(
      'Avoid absolute legal guarantees; frame the answer as a technical property of the protocol design and current admin model.'
    );
  }

  if (/compare-vaults|vault selection/.test(text)) {
    main.push(
      'Explain vault selection through curator quality, underlying exposures, fees, liquidity, and net yield.',
      'Mention concrete risk dimensions such as collateral mix, LLTVs, oracle quality, and strategy behavior.',
      'Translate those into a comparison table an end user can act on.'
    );
    followUp.push(
      'Yield-maximizing users may care first about net return and incentives; risk-sensitive users should see curator quality, liquidity, and exposure risk first.'
    );
  }

  if (/collateral does not earn supply apy/.test(text)) {
    main.push(
      'Explain that collateral is posted to secure borrowing and is not automatically lent out to earn supply APY.',
      'Connect that to simpler borrow mechanics and reduced dependence on making collateral simultaneously available for lending.',
      'Translate the trade-off clearly for a user or PM.'
    );
    followUp.push(
      'In a dashboard, make it explicit that borrowed-side yield and collateral utility are different concepts.'
    );
  }

  if (/earning risks responsibly|withdrawal button if liquidity is temporarily exhausted|earning risks/.test(text)) {
    main.push(
      'Mention protocol risk, liquidity risk, bad debt risk, and vault-strategy risk without pretending they disappear.',
      'Explain that withdrawals depend on available liquidity and can be constrained temporarily.',
      'Encourage diligence on curator, allocations, and settings.'
    );
    followUp.push(
      'Near a withdrawal button, say clearly when liquidity is currently limited and that redemption may require waiting for liquidity to return or using other supported paths.'
    );
  }

  if (/kinds of products partners can realistically build|what kinds of products/.test(text)) {
    main.push(
      'Frame Morpho as permissionless infrastructure rather than only a frontend.',
      'Name concrete product types such as earn surfaces, borrow interfaces, dashboards, vault comparisons, or infrastructure-level chain revenue designs.',
      'Tie the answer back to partner use cases instead of listing abstractions.'
    );
    followUp.push(
      'For a wallet partner, an earn surface or compare-vaults flow is usually the fastest useful prototype.'
    );
  }

  if (/governance participation|snapshot|delegation/.test(text)) {
    main.push(
      'Explain governance as MORPHO-holder discussion, signaling, and voting processes.',
      'Distinguish forum discussion from Snapshot voting and from delegated voting power.',
      'Explain why a partner engineer should know where decisions and governance signals show up.'
    );
    followUp.push(
      'Governance pathways matter in partner engineering because integrations can be affected by governance expectations, community process, and delegated stakeholders.'
    );
  }

  if (/minimum read paths, write paths, and risk disclosures|earn surface/.test(text)) {
    main.push(
      'Mention required reads like vault discovery, APY, allocations, positions, and exposure context.',
      'Mention writes like deposit, withdraw, and reward claim if rewards are part of the surface.',
      'Mention disclosures around curator strategy, underlying exposures, liquidity, and attribution or disclaimer requirements.'
    );
    followUp.push(
      'If shipping in one week, prioritize the smallest trustworthy read surface plus deposit and withdraw before advanced analytics.'
    );
  }

  if (/asset flow of a morpho earn product|deposit to yield accrual to withdrawal/.test(text)) {
    main.push(
      'Explain deposit of the underlying asset into the vault.',
      'Explain receipt of vault shares and that value accrues through share-price change rather than a visible coupon stream.',
      'Explain allocation into Morpho venues and eventual withdrawal or redemption back into the underlying asset.'
    );
    followUp.push(
      'For Vault V2, emphasize the adapter-based allocation flexibility and role system; for Vault V1, keep the explanation simpler.'
    );
  }

  if (/build a borrow interface|must-have monitoring and warning systems/.test(text)) {
    main.push(
      'Mention Health Factor tracking, liquidation-threshold warnings, and market-state refresh.',
      'Mention interest-rate and available-liquidity visibility, plus any allocator-driven context when relevant.',
      'Frame the answer around safe user decisions, not just raw data.'
    );
    followUp.push(
      'Novices need simpler warnings and safety buffers; power borrowers can handle denser live risk data.'
    );
  }

  if (/present morpho security in a serious way|security beyond just/.test(text)) {
    main.push(
      'Describe security as a layered practice: review, testing, fuzzing, formal verification, audits, contests, and bounties.',
      'Explain that these are evidence of diligence, not a zero-risk guarantee.',
      'Keep the tone engineering-first and encourage partner-side diligence.'
    );
    followUp.push(
      'Avoid claims like risk-free, impossible to fail, or guaranteed safety.'
    );
  }

  if (/ponder template|liquidation bot repos/.test(text)) {
    main.push(
      'Explain that the Ponder template shows Morpho supports indexing and analytics use cases beyond core contracts.',
      'Explain that the liquidation bot shows operational tooling around protocol activity and integrations.',
      'Connect both to partner POCs or internal monitoring, not just repo trivia.'
    );
    followUp.push(
      'For internal monitoring, the indexing template is usually the first repo to reach for.'
    );
  }

  if (/vaults v2.*september 29, 2025|vaults v2 to a sophisticated partner/.test(text)) {
    main.push(
      'Explain Vaults V2 as a noncustodial curation layer that can allocate across current and future Morpho venues.',
      'Mention differentiated controls such as roles, caps, gates, and in-kind redemption.',
      'Translate that into institutional and distributor value rather than listing features randomly.'
    );
    followUp.push(
      'For a regulated distributor, emphasize access controls, role separation, and operational controls first.'
    );
  }

  if (/defi mullet/.test(text)) {
    main.push(
      'Define the DeFi mullet as polished distribution and UX in front, DeFi rails in the back.',
      'Explain what the partner keeps: user relationship, product surface, compliance posture, and workflow abstraction.',
      'Explain what Morpho provides: transparent noncustodial lending infrastructure and borrow demand or market plumbing beneath the surface.'
    );
    followUp.push(
      'If the partner worries abstraction hurts trust, explain that abstraction can simplify UX while still preserving onchain transparency and verification.'
    );
  }

  if (/pre-liquidations|base layer plus overlays/.test(text)) {
    main.push(
      'Explain that Public Allocator and pre-liquidations are overlays built around a simple base primitive rather than a redesign of pooled risk.',
      'Explain Public Allocator as liquidity routing and pre-liquidations as a borrower-experience overlay.',
      'Emphasize opt-in application-layer richness on top of a simple base layer.'
    );
    followUp.push(
      'Different partner types benefit differently: borrower-facing apps may care more about pre-liquidations, while liquidity-focused surfaces may care more about allocator behavior.'
    );
  }

  if (/rwa playbook|ondo|apollo|midas|rwa issuer/.test(text)) {
    main.push(
      'Explain that tokenization improves distribution, but Morpho adds financing utility, productive collateral, and composability.',
      'Mention that isolated markets help onboard new asset classes with contained risk assumptions.',
      'Use at least one concrete case such as mF-ONE, Ondo, or Apollo to ground the answer.'
    );
    followUp.push(
      'Before recommending an RWA market launch, highlight oracle design, liquidity, caps, collateral policy, and conservative parameterization.'
    );
  }

  if (/permissionless interface responsibly|risk-warnings/.test(text)) {
    main.push(
      'Explain that permissionless visibility still requires warnings and user-protection design.',
      'Mention differentiated warning severity, explicit opt-ins, and honest UX rather than hiding everything forever.',
      'Balance openness with user protection.'
    );
    followUp.push(
      'Use harder opt-in warnings for unknown or higher-risk markets; use softer caution where the market is better understood but still carries risk.'
    );
  }

  if (/infrastructure mode/.test(text)) {
    main.push(
      'Explain infrastructure mode as Morpho being deployed as public lending infrastructure before a full app or rewards stack exists.',
      'State that local builders can still build on the primitive immediately.',
      'Frame it as ecosystem infrastructure, not only a wallet earn tab.'
    );
    followUp.push(
      'A first build on infrastructure mode is often a simple dashboard, vault surface, or borrow interface for local builders.'
    );
  }

  if (/metamorpho|separates isolated markets from curated vault/.test(text)) {
    main.push(
      'Explain isolated markets as the primitive and vaults as the curated delegation layer on top.',
      'Connect the split to differentiated risk profiles and shared liquidity through overlapping allocations.',
      'Do not collapse the market layer and vault layer into one thing.'
    );
    followUp.push(
      'Direct market exposure makes sense when a partner wants precise market-level control rather than curated delegation.'
    );
  }

  if (/evaluate whether morpho is the right backend|evaluation framework/.test(text)) {
    main.push(
      'Answer through evaluation criteria like simplicity, integration quality, immutability versus upgradeability, governance scope, security posture, and compliance exposure.',
      'Keep the answer framed as a backend selection decision rather than a generic protocol pitch.'
    );
    followUp.push(
      'For a regulated fintech, security, control boundaries, and compliance exposure often dominate.'
    );
  }

  if (/anchorage|custody controls/.test(text)) {
    main.push(
      'Explain that Morpho can fit under existing custody controls by keeping vault receipt tokens inside the partner’s custody environment.',
      'Explain that no separate unmanaged wallet workflow is required for the user-facing product pattern being discussed.',
      'Position Morpho as the noncustodial execution layer under the custody workflow.'
    );
    followUp.push(
      'Before saying the integration is ready, surface operational, policy, liquidity, and compliance review concerns.'
    );
  }

  if (/vault bridge|infrastructure-level revenue|productive bridged collateral/.test(text)) {
    main.push(
      'Explain the pattern of keeping bridge UX familiar while productive collateral or escrowed assets earn yield through Morpho vaults.',
      'Explain that the yield can be routed back to the chain or ecosystem as revenue rather than directly to end users.',
      'Position Morpho as the yield engine under the infrastructure.'
    );
    followUp.push(
      'A first dashboard should show bridged TVL, productive collateral, earned revenue, and where that revenue is being routed.'
    );
  }

  const fallback = rubricFallbackBullets(questionLike);
  return {
    main: main.length ? main : fallback,
    followUp: followUp.length ? followUp : (questionLike?.followUp ? [questionLike.followUp] : [])
  };
}

function evaluateLocally(questionId, answer) {
  const question = OPEN_ENDED_QUESTIONS.find((entry) => entry.id === questionId);
  if (!question) {
    return { error: 'Question not found' };
  }

  const lowerAnswer = answer.toLowerCase();
  const covered = [];
  const missed = [];

  question.rubric.forEach((point) => {
    const keyTerms = point
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 4 && !['would', 'could', 'should', 'there', 'their', 'while'].includes(word));

    const matched = keyTerms.filter((term) =>
      lowerAnswer.includes(term) ||
      lowerAnswer.includes(term.replace(/s$/, '')) ||
      lowerAnswer.includes(`${term}s`)
    );

    if (keyTerms.length === 0 || matched.length / keyTerms.length >= 0.35) {
      covered.push(point);
    } else {
      missed.push(point);
    }
  });

  const score = Math.round((covered.length / question.rubric.length) * 100);

  let summary;
  if (score >= 85) {
    summary = 'Strong answer. It sounds accurate, partner-aware, and implementation-minded.';
  } else if (score >= 65) {
    summary = 'Decent answer. The structure is usable, but it needs sharper protocol precision or clearer partner framing.';
  } else {
    summary = 'Weak answer. It needs better protocol accuracy, clearer structure, and more practical partner-facing guidance.';
  }

  return {
    score,
    covered,
    missed,
    feedback: summary
  };
}

module.exports = {
  OPEN_ENDED_QUESTIONS,
  evaluateLocally,
  getQuestionEvaluationContext,
  getDocsReferenceSnippets,
  getQuestionIntent,
  getExpectedAnswerBlueprint
};
