/**
 * Hand-written quiz bank for the Morpho Partner Engineer bootcamp.
 * Flat format to keep seeding simple.
 */

const { COMPLEMENTARY_QUIZ_QUESTIONS } = require('./complementary-data');
const { BLOG_QUIZ_QUESTIONS } = require('./blog-posts-data');
const { CUSTOMER_STORY_QUIZ_QUESTIONS } = require('./customer-stories-data');

const CORE_QUIZ_QUESTIONS = [
  {
    q: 'Which five values define a Morpho market?',
    options: [
      'loan token, collateral token, oracle, IRM, LLTV',
      'loan token, collateral token, borrow cap, supply cap, guardian',
      'loan token, collateral token, price, fee, market owner',
      'collateral token, utilization, APY, oracle, curator'
    ],
    correct: 0,
    explanation: 'Morpho market identity is defined by loan token, collateral token, oracle, IRM, and LLTV.',
    category: 'protocol-knowledge',
    difficulty: 'fundamental',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'Say the five parameters cleanly and in order.'
  },
  {
    q: 'What is the strongest explanation of isolated lending?',
    options: [
      'Each market has its own risk surface, so failures stay contained instead of contaminating a shared pool.',
      'It means only one user can borrow from a market at a time.',
      'It means every market uses the same oracle and LLTV.',
      'It means deposits are routed through a single global pool.'
    ],
    correct: 0,
    explanation: 'Isolation means market-specific risk and contained blast radius.',
    category: 'protocol-knowledge',
    difficulty: 'fundamental',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'Use the phrase "contained blast radius" or "dedicated risk surface."'
  },
  {
    q: 'What is the canonical Morpho Blue contract address on Ethereum and Base?',
    options: [
      '0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb',
      '0xA1D94F746dEfa1928926b84fB2596c06926C0405',
      '0x6566194141eefa99Af43Bb5Aa71460Ca2Dc90245',
      '0x1897A8997241C1cD4bD0698647e4EB7213535c24'
    ],
    correct: 0,
    explanation: 'The Blue/Morpho contract uses the canonical 0xBBBB... address on Ethereum and Base.',
    category: 'protocol-knowledge',
    difficulty: 'fundamental',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'Know this address cold.'
  },
  {
    q: 'Collateral value in Morpho is calculated from oracle price using which scale?',
    options: ['1e36', '1e18', '1e8', '1e6'],
    correct: 0,
    explanation: 'Morpho oracle prices are quoted in loan-token units and scaled by 1e36.',
    category: 'math',
    difficulty: 'intermediate',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'Most dashboard bugs start here.'
  },
  {
    q: 'A position becomes liquidatable when:',
    options: [
      'Health Factor is less than or equal to 1',
      'Utilization exceeds 90%',
      'LLTV is above 80%',
      'Supply APY falls below borrow APY'
    ],
    correct: 0,
    explanation: 'The docs state that positions are eligible for liquidation when Health Factor drops to 1 or below.',
    category: 'liquidations',
    difficulty: 'fundamental',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'Say "eligible for liquidation," not "automatically liquidated."'
  },
  {
    q: 'Which formula best matches Morpho’s Health Factor?',
    options: [
      '(Collateral Value × LLTV) / Borrowed Assets',
      '(Borrowed Assets × LLTV) / Collateral Value',
      'Collateral Value / Borrowed Assets',
      'Borrowed Assets / (Collateral Value × LLTV)'
    ],
    correct: 0,
    explanation: 'HF is maximum borrow capacity divided by current borrowed assets.',
    category: 'math',
    difficulty: 'intermediate',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'Translate it verbally as "safety buffer ratio."'
  },
  {
    q: 'Why might a user be liquidated at roughly 85% LTV on an 86% LLTV market?',
    options: [
      'Because live prices, accrued debt, and onchain timing can differ from a rough UI snapshot.',
      'Because Morpho liquidates all users at 85% regardless of LLTV.',
      'Because LLTV is only advisory and not enforced.',
      'Because Bundler3 lowers the liquidation threshold.'
    ],
    correct: 0,
    explanation: 'A strong answer mentions exact oracle price, accrued debt, rounding, and timing rather than claiming the market broke its own LLTV.',
    category: 'partner-scenario',
    difficulty: 'advanced',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'Be empathetic first, then technical.'
  },
  {
    q: 'For an 86% LLTV market, the docs describe LIF as approximately:',
    options: ['1.05', '1.15', '0.95', '1.30'],
    correct: 0,
    explanation: 'The docs call out a roughly 5% liquidation bonus for 86% LLTV markets.',
    category: 'liquidations',
    difficulty: 'intermediate',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'Link it to liquidator incentive, not protocol fees.'
  },
  {
    q: 'What happens in Morpho when LTV moves above 1 / LIF?',
    options: [
      'The position can enter bad debt territory because collateral can be fully seized while debt remains.',
      'The protocol automatically socializes losses across all markets.',
      'The market is paused by governance.',
      'The liquidator loses their incentive.'
    ],
    correct: 0,
    explanation: 'Above 1/LIF, collateral may be insufficient to cover the remaining debt after liquidation mechanics.',
    category: 'liquidations',
    difficulty: 'advanced',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'Know the three health regimes.'
  },
  {
    q: 'What is the best response when a partner asks why isolated lending helps their LRT integration?',
    options: [
      'It lets the asset have dedicated oracle, LLTV, and IRM choices instead of competing inside a shared pool design.',
      'It guarantees the token will never be liquidated.',
      'It removes the need for an oracle.',
      'It means all risk is transferred to Morpho governance.'
    ],
    correct: 0,
    explanation: 'The value is a dedicated market and contained risk surface.',
    category: 'partner-scenario',
    difficulty: 'intermediate',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'Tie the architecture to a launch benefit.'
  },

  {
    q: 'Which four roles define Vault V2 governance and operations?',
    options: [
      'Owner, Curator, Allocator, Sentinel',
      'Owner, Guardian, Depositor, Liquidator',
      'Admin, Curator, Borrower, Oracle',
      'Owner, Curator, Registry, Gatekeeper'
    ],
    correct: 0,
    explanation: 'Vault V2 uses Owner, Curator, Allocator, and Sentinel.',
    category: 'vault-v2',
    difficulty: 'fundamental',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'Do not say Guardian. In V2 it is Sentinel.'
  },
  {
    q: 'Which role can directly set the curator and sentinels?',
    options: ['Owner', 'Allocator', 'Sentinel', 'Public Allocator'],
    correct: 0,
    explanation: 'The Owner is administrative authority and sets curator/sentinels.',
    category: 'vault-v2',
    difficulty: 'intermediate',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'Also remember what the Owner cannot do.'
  },
  {
    q: 'Which statement about Vault V2 roles is correct?',
    options: [
      'Roles do not inherit permissions from each other in V2.',
      'The Curator automatically inherits Owner powers.',
      'The Sentinel can increase caps in emergencies.',
      'The Allocator can add new adapters if liquidity is low.'
    ],
    correct: 0,
    explanation: 'The docs explicitly state V2 roles do not inherit permissions.',
    category: 'vault-v2',
    difficulty: 'intermediate',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'This is a strong security talking point.'
  },
  {
    q: 'What is the minimum timelock for addAdapter in Vault V2?',
    options: ['3 days', '7 days', '24 hours', 'No timelock'],
    correct: 0,
    explanation: 'addAdapter has a minimum 3-day timelock.',
    category: 'vault-v2',
    difficulty: 'intermediate',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'Pair this with "risk-increasing actions are delayed."'
  },
  {
    q: 'What is the minimum timelock for removeAdapter in Vault V2?',
    options: ['7 days', '3 days', '1 day', 'Immediate'],
    correct: 0,
    explanation: 'removeAdapter requires a minimum 7-day timelock.',
    category: 'vault-v2',
    difficulty: 'intermediate',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'Know both 3-day and 7-day buckets.'
  },
  {
    q: 'Which cap decreases can a Sentinel perform immediately?',
    options: [
      'Absolute and relative cap decreases',
      'Only relative cap decreases',
      'Only adapter removals',
      'Only fee reductions'
    ],
    correct: 0,
    explanation: 'Cap decreases are instant and can be done by a Sentinel.',
    category: 'vault-v2',
    difficulty: 'intermediate',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'This is the "instant risk reduction" story.'
  },
  {
    q: 'What three cap layers gate a MarketV1AdapterV2 allocation?',
    options: [
      'adapter cap, collateral cap, market cap',
      'owner cap, curator cap, allocator cap',
      'deposit cap, mint cap, redeem cap',
      'market cap, oracle cap, timelock cap'
    ],
    correct: 0,
    explanation: 'All three layers must be non-zero: adapter, collateral token, and market caps.',
    category: 'vault-v2',
    difficulty: 'advanced',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'Use this to show you understand abstract risk controls.'
  },
  {
    q: 'Which idData encoding is used for a collateral token cap?',
    options: [
      'abi.encode("collateralToken", collateralTokenAddress)',
      'abi.encode("market", marketId)',
      'abi.encode("this", adapterAddress, collateralTokenAddress)',
      'abi.encode("lltv", lltv)'
    ],
    correct: 0,
    explanation: 'Collateral caps use abi.encode("collateralToken", collateralTokenAddress).',
    category: 'vault-v2',
    difficulty: 'advanced',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'Memorize all three id patterns.'
  },
  {
    q: 'How does Vault V2 socialize losses?',
    options: [
      'By marking total assets down when adapter realAssets() falls and letting share price depreciate for all depositors proportionally.',
      'By burning only the newest depositor shares.',
      'By charging liquidators a protocol fee.',
      'By moving losses into a separate bad debt token.'
    ],
    correct: 0,
    explanation: 'Losses are realized via lower totalAssets and proportional share-price depreciation.',
    category: 'vault-v2',
    difficulty: 'advanced',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'Say "share price depreciation," not "selective haircut."'
  },
  {
    q: 'Which statement about the liquidity adapter is correct?',
    options: [
      'When a MarketV1AdapterV2 is the liquidity adapter, it points to one underlying market at a time via liquidityData.',
      'It automatically falls through to every market in the adapter if the first is illiquid.',
      'It is always the same as the Public Allocator.',
      'It ignores vault caps.'
    ],
    correct: 0,
    explanation: 'The docs stress that the liquidity adapter sources one market at a time and there is no automatic fallthrough.',
    category: 'vault-v2',
    difficulty: 'advanced',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'This is a favorite operational gotcha.'
  },

  {
    q: 'AdaptiveCurveIRM targets what utilization level?',
    options: ['90%', '80%', '75%', '95%'],
    correct: 0,
    explanation: 'AdaptiveCurveIRM is engineered to maintain utilization around 90%.',
    category: 'math',
    difficulty: 'fundamental',
    module_slug: 'core-math-and-formulas',
    interviewTip: 'This should come out instantly.'
  },
  {
    q: 'What is the formula for supply APY in the AdaptiveCurveIRM explanation?',
    options: [
      'borrowApy × (1 - fee) × utilization',
      'borrowApy × fee × utilization',
      'borrowApy / utilization',
      'borrowApy + fee + utilization'
    ],
    correct: 0,
    explanation: 'Supply APY is derived from borrow APY after fee and multiplied by utilization.',
    category: 'math',
    difficulty: 'intermediate',
    module_slug: 'core-math-and-formulas',
    interviewTip: 'Explain why supply APY is lower than borrow APY.'
  },
  {
    q: 'What does maxApy represent in the AdaptiveCurveIRM walkthrough?',
    options: [
      'The high-utilization borrow APY level above the 90% target slope',
      'The fixed supply APR every market earns',
      'The protocol fee ceiling',
      'The maximum liquidation bonus'
    ],
    correct: 0,
    explanation: 'maxApy is part of the two-slope IRM behavior above target utilization.',
    category: 'math',
    difficulty: 'intermediate',
    module_slug: 'core-math-and-formulas',
    interviewTip: 'Use "steeper slope above target utilization."'
  },
  {
    q: 'Why should a UI avoid letting users borrow to HF exactly 1.00?',
    options: [
      'Because any small oracle move, accrued debt, or rounding effect can immediately make the position liquidatable.',
      'Because Morpho rejects transactions above HF 1.00.',
      'Because Bundler3 requires HF 1.05.',
      'Because the Curator sets a global minimum HF.'
    ],
    correct: 0,
    explanation: 'Good UX leaves a safety margin above the liquidation threshold.',
    category: 'math',
    difficulty: 'intermediate',
    module_slug: 'core-math-and-formulas',
    interviewTip: 'Always mention safety buffers.'
  },
  {
    q: 'What is the safest explanation of rounding dust after a deallocate?',
    options: [
      'Share-to-asset rounding can leave a tiny residual allocation, which is expected and not necessarily a protocol bug.',
      'Dust means the adapter was hacked.',
      'Dust means the allocator exceeded caps.',
      'Dust means maxWithdraw was wrong.'
    ],
    correct: 0,
    explanation: 'The docs explicitly warn about residual dust due to share rounding.',
    category: 'math',
    difficulty: 'advanced',
    module_slug: 'core-math-and-formulas',
    interviewTip: 'Differentiate expected dust from true accounting mismatch.'
  },

  {
    q: 'What is the main GraphQL endpoint for Morpho API?',
    options: [
      'https://api.morpho.org/graphql',
      'https://api.morpho.org/rest',
      'https://app.morpho.org/graphql',
      'https://api.rewards.morpho.org/graphql'
    ],
    correct: 0,
    explanation: 'The docs explicitly list https://api.morpho.org/graphql as the main GraphQL endpoint.',
    category: 'integration',
    difficulty: 'fundamental',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'Know endpoint, rate limit, and no-SLA caveat together.'
  },
  {
    q: 'What is the documented Morpho API rate limit?',
    options: ['5k requests per 5 minutes', '500 requests per minute', 'Unlimited', '1k requests per hour'],
    correct: 0,
    explanation: 'The docs recommend caching and note a 5k / 5 minute rate limit.',
    category: 'integration',
    difficulty: 'intermediate',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'Tie this to backend caching and lighter queries.'
  },
  {
    q: 'Which is the best production posture for Morpho API usage?',
    options: [
      'Cache responses, keep queries narrow, split heavy reads, and avoid hard dependency for critical paths.',
      'Poll the API for every UI element on every render.',
      'Trust API responses more than onchain execution state.',
      'Use it only for writes, not reads.'
    ],
    correct: 0,
    explanation: 'The docs recommend caching, trimmed selection sets, and avoiding hard dependency for critical production behavior.',
    category: 'integration',
    difficulty: 'intermediate',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'This answer sounds operationally mature.'
  },
  {
    q: 'What is Bundler3 primarily valuable for?',
    options: [
      'Atomic multi-step workflows where partial completion would be dangerous or poor UX',
      'Replacing GraphQL for dashboard queries',
      'Setting vault timelocks',
      'Increasing liquidation incentives'
    ],
    correct: 0,
    explanation: 'Bundler3 matters because all steps succeed or all revert.',
    category: 'integration',
    difficulty: 'intermediate',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'Do not reduce it to a gas-only answer.'
  },
  {
    q: 'What is the Ethereum mainnet Bundler3 address listed in the docs?',
    options: [
      '0x6566194141eefa99Af43Bb5Aa71460Ca2Dc90245',
      '0x6BFd8137e702540E7A42B74178A4a49Ba43920C4',
      '0xfd32fA2ca22c76dD6E550706Ad913FC6CE91c75D',
      '0xA1D94F746dEfa1928926b84fB2596c06926C0405'
    ],
    correct: 0,
    explanation: '0x6566...0245 is the Ethereum Bundler3 address from the official addresses list.',
    category: 'integration',
    difficulty: 'advanced',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'Know Ethereum and Base.'
  },
  {
    q: 'A partner wants to rely only on GraphQL for liquidation-risk alerts. Best answer?',
    options: [
      'Use GraphQL for indexed reads, but calculate critical risk with onchain-aware logic and build degraded-mode handling if API data is stale.',
      'That is perfect because GraphQL is the source of truth.',
      'GraphQL is only for rewards and cannot show positions.',
      'Use Merkl instead of GraphQL.'
    ],
    correct: 0,
    explanation: 'A mature answer treats the API as an indexed read layer, not the sole safety source.',
    category: 'partner-scenario',
    difficulty: 'advanced',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'Use the phrase "indexed read layer."'
  },

  {
    q: 'Which statement about rewards is correct as of the docs in morpho.txt?',
    options: [
      'Legacy rewards.morpho.org is deprecated and new reward programs are distributed via Merkl.',
      'All rewards still flow through rewards.morpho.org.',
      'Merkl is only for testnets.',
      'Vault V2 does not expose rewards data anywhere.'
    ],
    correct: 0,
    explanation: 'The docs explicitly say legacy rewards API is deprecated and new programs use Merkl.',
    category: 'merkl',
    difficulty: 'fundamental',
    module_slug: 'real-world-integrations-and-merkl',
    interviewTip: 'Know the deprecation status.'
  },
  {
    q: 'What does the Morpho API do for Vault V2 rewards?',
    options: [
      'It retrieves rewards data from the Merkl API and exposes a pre-aggregated rewards field.',
      'It ignores Merkl entirely.',
      'It only shows reward token logos.',
      'It writes Merkl claims onchain.'
    ],
    correct: 0,
    explanation: 'Vault V2 rewards are pre-aggregated in the Morpho API and sourced from Merkl.',
    category: 'merkl',
    difficulty: 'intermediate',
    module_slug: 'real-world-integrations-and-merkl',
    interviewTip: 'Great for explaining combined-yield dashboards.'
  },
  {
    q: 'What is the right way to display native yield plus incentives in a partner dashboard?',
    options: [
      'Show base APY, reward APR by token, then a combined estimate.',
      'Only show the combined number to make yields look bigger.',
      'Only show Merkl APR because base APY is less important.',
      'Hide incentives unless the user connects a wallet.'
    ],
    correct: 0,
    explanation: 'Good UX separates passive native yield from incentive-driven reward APR before showing a combined number.',
    category: 'merkl',
    difficulty: 'intermediate',
    module_slug: 'real-world-integrations-and-merkl',
    interviewTip: 'This is a strong product answer.'
  },
  {
    q: 'Why is BigInt discipline important in a Merkl + Morpho dashboard?',
    options: [
      'Because token amounts, shares, and prices can lose correctness if converted to JS floats too early.',
      'Because GraphQL only returns strings.',
      'Because Bundler3 requires BigInt for every call.',
      'Because Merkl rewards are always larger than Number.MAX_SAFE_INTEGER.'
    ],
    correct: 0,
    explanation: 'A safe frontend keeps raw token math in bigint until formatting boundaries.',
    category: 'merkl',
    difficulty: 'advanced',
    module_slug: 'real-world-integrations-and-merkl',
    interviewTip: 'Mention mixed decimals too.'
  },
  {
    q: 'A partner wants a quick POC for incentivized yields. What is the strongest first build?',
    options: [
      'A dashboard that joins Morpho vault discovery and APY data with Merkl reward APR and claim context.',
      'A governance forum post.',
      'A liquidation bot.',
      'A full custom oracle deployment pipeline.'
    ],
    correct: 0,
    explanation: 'This is exactly the high-value Partner Engineer demo pattern.',
    category: 'partner-scenario',
    difficulty: 'intermediate',
    module_slug: 'real-world-integrations-and-merkl',
    interviewTip: 'Be concrete about GraphQL + REST.'
  },

  {
    q: 'What is the strongest structure for answering "Why Morpho over Aave?"',
    options: [
      'Acknowledge Aave’s strengths, then explain Morpho’s better fit for isolated custom markets or curation-heavy managed products.',
      'Say Aave is obsolete.',
      'Claim Morpho always has higher yields.',
      'Ignore the comparison and talk about your background.'
    ],
    correct: 0,
    explanation: 'Balanced comparison builds credibility.',
    category: 'communication',
    difficulty: 'intermediate',
    module_slug: 'partner-communication-and-objections',
    interviewTip: 'Credibility beats hype.'
  },
  {
    q: 'A partner is frustrated by an integration delay caused by a bug. What should you do first?',
    options: [
      'Acknowledge the impact, clarify scope and risk, then provide the next update path and workaround if one exists.',
      'Defend the protocol immediately.',
      'Tell them engineering will look eventually.',
      'Promise an ETA you do not have.'
    ],
    correct: 0,
    explanation: 'Good partner support starts with clarity and ownership, not defensiveness.',
    category: 'communication',
    difficulty: 'intermediate',
    module_slug: 'partner-communication-and-objections',
    interviewTip: 'Empathy + next steps.'
  },
  {
    q: 'Which question is most important on an initial scoping call?',
    options: [
      'Are you integrating borrow, earn, or both, and what exact user workflow are you trying to support?',
      'How many followers do you have on X?',
      'What is your favorite chain?',
      'Do you want the UI in dark mode?'
    ],
    correct: 0,
    explanation: 'Workflow and product scope determine the right Morpho building blocks.',
    category: 'communication',
    difficulty: 'fundamental',
    module_slug: 'partner-communication-and-objections',
    interviewTip: 'Use case first, architecture second.'
  },
  {
    q: 'When explaining Health Factor to a non-technical stakeholder, the best analogy is:',
    options: [
      'A safety buffer or credit-score-like ratio where higher is safer and 1 is the danger line.',
      'A validator uptime metric.',
      'A governance quorum threshold.',
      'A DEX liquidity gauge.'
    ],
    correct: 0,
    explanation: 'A safety buffer analogy makes the concept intuitive without losing meaning.',
    category: 'communication',
    difficulty: 'fundamental',
    module_slug: 'partner-communication-and-objections',
    interviewTip: 'Keep it human, not formula-heavy.'
  },
  {
    q: 'What should an internal escalation note always include?',
    options: [
      'chain, address, repro steps, expected vs actual result, and impact',
      'only the partner’s name',
      'only the error screenshot',
      'a vague summary without technical detail'
    ],
    correct: 0,
    explanation: 'High-quality escalations are reproducible and scoped.',
    category: 'communication',
    difficulty: 'intermediate',
    module_slug: 'partner-communication-and-objections',
    interviewTip: 'Show you think operationally.'
  },

  {
    q: 'Which POC is most likely to help a partner evaluate borrower risk quickly?',
    options: [
      'A health dashboard showing current LTV, HF, liquidation price, and alerts by market',
      'A logo gallery of supported assets',
      'A static docs mirror',
      'A management fee calculator only'
    ],
    correct: 0,
    explanation: 'HF/LTV/liquidation-focused dashboards solve real operational needs.',
    category: 'poc-design',
    difficulty: 'intermediate',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: 'Choose tools that answer an operational question.'
  },
  {
    q: 'What problem does the Public Allocator address?',
    options: [
      'Liquidity fragmentation across isolated markets by reallocating assets toward target borrow demand within vault constraints',
      'Reward claiming for Merkl users',
      'Automatic liquidation of bad debt',
      'ERC4626 share accounting'
    ],
    correct: 0,
    explanation: 'Public Allocator improves access to liquidity across isolated market structures.',
    category: 'poc-design',
    difficulty: 'advanced',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: 'Say "reallocateTo" and "curator-set fee" if you can.'
  },
  {
    q: 'Who sets and collects Public Allocator fees?',
    options: [
      'The vault curator',
      'Morpho governance',
      'Bundler3',
      'Merkl'
    ],
    correct: 0,
    explanation: 'Public Allocator fees are set and collected by the vault curator, not by Morpho.',
    category: 'poc-design',
    difficulty: 'advanced',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: 'This is a subtle but strong detail.'
  },
  {
    q: 'What is the best reason to build claim simulation into a rewards POC?',
    options: [
      'It turns rewards from a passive metric into an actionable user workflow the partner can evaluate.',
      'It replaces Merkl APIs entirely.',
      'It removes the need for wallet signatures.',
      'It guarantees successful claims in production.'
    ],
    correct: 0,
    explanation: 'Claim simulation is valuable because it demonstrates an end-to-end user action.',
    category: 'poc-design',
    difficulty: 'intermediate',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: 'Think in user actions, not just numbers.'
  },

  {
    q: 'If you do not know a chain-specific factory address during the interview, what is the best recovery?',
    options: [
      'State the concept you know for sure, then say you would verify the exact chain-specific value on the official Addresses page.',
      'Guess confidently.',
      'Refuse to answer.',
      'Invent a similar-looking address from memory.'
    ],
    correct: 0,
    explanation: 'Safe, explicit verification beats fake certainty.',
    category: 'interview',
    difficulty: 'intermediate',
    module_slug: 'mock-interviews-and-drills',
    interviewTip: 'Judgment matters.'
  },
  {
    q: 'What is the strongest structure for a 60-second protocol answer?',
    options: [
      'core point, why it matters, partner-specific value, then optional trade-off',
      'history, investor list, every supported chain, then the answer',
      'trade-offs only',
      'open with Solidity details and hope the listener follows'
    ],
    correct: 0,
    explanation: 'This structure is concise and partner-friendly.',
    category: 'interview',
    difficulty: 'fundamental',
    module_slug: 'mock-interviews-and-drills',
    interviewTip: 'Answer shape matters.'
  },
  {
    q: 'Which answer sounds most like a senior Partner Engineer?',
    options: [
      '"Given your use case, I would start with GraphQL for discovery, onchain execution for settlement, and a cache-backed dashboard for rewards and HF."',
      '"Morpho is cool and I can figure something out."',
      '"I would need to rebuild the protocol first."',
      '"We should wait until every docs page is perfect."'
    ],
    correct: 0,
    explanation: 'The best answer recommends a concrete architecture and explains why.',
    category: 'interview',
    difficulty: 'intermediate',
    module_slug: 'mock-interviews-and-drills',
    interviewTip: 'Specificity plus judgment.'
  },
  {
    q: 'What is the best final-study strategy in the last 24 hours?',
    options: [
      'Focus on weak formulas, weak explanations, and high-value partner scenarios rather than rereading everything equally.',
      'Start learning unrelated protocols.',
      'Ignore speaking practice and only code.',
      'Memorize addresses only.'
    ],
    correct: 0,
    explanation: 'Targeted review compounds quickly in a short prep window.',
    category: 'review',
    difficulty: 'fundamental',
    module_slug: 'final-review-and-feedback-loop',
    interviewTip: 'Use the tags to prioritize.'
  },
  {
    q: 'What is the best description of the role-specific value of docs feedback?',
    options: [
      'Partner confusion and POC friction should be translated into concrete documentation improvements and better internal examples.',
      'Docs work is unrelated to partner engineering.',
      'Only marketing should improve docs.',
      'Docs should change only after governance votes.'
    ],
    correct: 0,
    explanation: 'The job explicitly includes improving documentation based on partner feedback.',
    category: 'review',
    difficulty: 'intermediate',
    module_slug: 'final-review-and-feedback-loop',
    interviewTip: 'Tie your study tool back to the actual job.'
  },

  {
    q: 'Which statement about Morpho market creation is accurate?',
    options: [
      'Market creation is permissionless, but market creators still use governance-approved IRMs and oracles.',
      'Every new market requires a governance vote.',
      'Anyone can deploy any oracle or IRM without restriction.',
      'Only curators can create markets.'
    ],
    correct: 0,
    explanation: 'Creation is permissionless, but approved oracle and IRM sets still matter.',
    category: 'protocol-knowledge',
    difficulty: 'intermediate',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'Permissionless does not mean every component is unconstrained.'
  },
  {
    q: 'What is the cleanest business translation of immutability in Morpho Blue?',
    options: [
      'Partners can diligence a stable rule set that will not be admin-upgraded underneath them.',
      'Markets can be hot-fixed instantly by governance.',
      'Every market uses the newest rate model automatically.',
      'Immutable means interest rates never change.'
    ],
    correct: 0,
    explanation: 'Immutability means contract logic and market parameters do not shift under an admin upgrade path.',
    category: 'protocol-knowledge',
    difficulty: 'intermediate',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'Translate "immutable" into diligence and predictability.'
  },
  {
    q: 'Why is saying "Morpho guarantees liquidations" an inaccurate answer?',
    options: [
      'Because liquidations are performed by external permissionless actors and depend on economic incentives, not protocol-operated guarantees.',
      'Because Morpho disables liquidations on weekends.',
      'Because only the owner can liquidate.',
      'Because vault curators perform all liquidations.'
    ],
    correct: 0,
    explanation: 'Liquidations are incentive-driven and permissionless, not guaranteed by a built-in protocol auction engine.',
    category: 'liquidations',
    difficulty: 'advanced',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'Use precise language under risk questions.'
  },
  {
    q: 'If collateral price recovers before a liquidation is executed, what can happen?',
    options: [
      'The position may become healthy again and stop being liquidatable.',
      'The liquidation must still happen because the alert already fired.',
      'Morpho automatically reduces LLTV.',
      'The liquidator keeps a reserved right to seize collateral later.'
    ],
    correct: 0,
    explanation: 'Liquidatability depends on current state. If the position becomes healthy again, liquidation is no longer valid.',
    category: 'liquidations',
    difficulty: 'intermediate',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'This is a useful empathy detail.'
  },
  {
    q: 'Why does the docs language emphasize current oracle price during liquidations?',
    options: [
      'Because that price both determines liquidatability and the exchange rate used for collateral seizure.',
      'Because liquidators choose any market price they want.',
      'Because LLTV is recomputed from spot DEX price every block.',
      'Because Merkl rewards determine liquidation thresholds.'
    ],
    correct: 0,
    explanation: 'The oracle price drives both the liquidation trigger and the collateral valuation used in the liquidation.',
    category: 'liquidations',
    difficulty: 'advanced',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'Important when a partner disputes a liquidation.'
  },
  {
    q: 'A user asks why debt grew even though price stayed flat. Best explanation?',
    options: [
      'Borrow debt accrues interest over time, so Health Factor can fall even when collateral price is stable.',
      'The LLTV secretly decreases each day.',
      'Morpho charges a hidden liquidation tax.',
      'Bundler3 changes debt balances every hour.'
    ],
    correct: 0,
    explanation: 'Accrued interest raises debt and can reduce health even if price is unchanged.',
    category: 'partner-scenario',
    difficulty: 'intermediate',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'This is one of the best borrower-support answers to practice.'
  },
  {
    q: 'Which chain-specific address pair is correct?',
    options: [
      'Ethereum Bundler3 = 0x6566194141eefa99Af43Bb5Aa71460Ca2Dc90245, Base Bundler3 = 0x6BFd8137e702540E7A42B74178A4a49Ba43920C4',
      'Ethereum Bundler3 = 0x6BFd8137e702540E7A42B74178A4a49Ba43920C4, Base Bundler3 = 0x6566194141eefa99Af43Bb5Aa71460Ca2Dc90245',
      'Both chains use 0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb',
      'Bundler3 is not deployed on Base'
    ],
    correct: 0,
    explanation: 'These are the official Ethereum and Base Bundler3 addresses in the docs.',
    category: 'protocol-knowledge',
    difficulty: 'advanced',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'Memorize at least the two most likely interview chains.'
  },
  {
    q: 'Why is "same on all chains" correct for Blue but wrong for most auxiliary contracts?',
    options: [
      'Blue uses the canonical 0xBBBB address on some major chains, while factories, registries, Bundler3, and allocators are chain-specific deployments.',
      'All Morpho contracts use 0xBBBB.',
      'Nothing in Morpho is chain-specific.',
      'Only oracles are chain-specific.'
    ],
    correct: 0,
    explanation: 'Blue is the memorable canonical contract, but factories and tooling addresses vary by chain.',
    category: 'protocol-knowledge',
    difficulty: 'advanced',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'Great nuance point for address questions.'
  },
  {
    q: 'What is the role-safe reason to prefer verifying chain-specific addresses live?',
    options: [
      'Because accuracy matters more than performative memory, and the official addresses page is the source of truth for factories and tooling.',
      'Because Morpho docs are unreliable.',
      'Because interviews do not care about addresses.',
      'Because addresses change every block.'
    ],
    correct: 0,
    explanation: 'Senior partner-facing behavior is to verify chain-specific values from the source of truth.',
    category: 'partner-scenario',
    difficulty: 'intermediate',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'This conveys judgment.'
  },

  {
    q: 'Who can revoke pending timelocked actions in Vault V2?',
    options: [
      'Curator and Sentinel',
      'Allocator only',
      'Owner only',
      'Any depositor'
    ],
    correct: 0,
    explanation: 'Curators and Sentinels can revoke pending proposals.',
    category: 'vault-v2',
    difficulty: 'intermediate',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'This is central to curator-compromise response.'
  },
  {
    q: 'What is the safest summary of Sentinel compromise risk?',
    options: [
      'It is the least severe role compromise because Sentinel actions are risk-reducing, though it can still cause denial-of-service style operational pain.',
      'It is the most severe compromise because Sentinel can drain funds.',
      'Sentinel compromise cannot affect anything.',
      'Sentinel compromise automatically destroys the vault.'
    ],
    correct: 0,
    explanation: 'A compromised Sentinel can revoke or deallocate, but cannot escalate risk or steal funds through new exposure.',
    category: 'vault-v2',
    difficulty: 'advanced',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'Shows you understand the asymmetry of role risk.'
  },
  {
    q: 'What is the correct first response to allocator compromise according to the docs?',
    options: [
      'Submit removal of allocator privileges and immediately zero caps to neutralize the allocator even before the role change completes.',
      'Transfer ownership to the allocator.',
      'Increase all caps so liquidity can move out faster.',
      'Do nothing because the allocator has no real power.'
    ],
    correct: 0,
    explanation: 'The documented process is role removal plus immediate cap reductions to neutralize the compromised allocator.',
    category: 'vault-v2',
    difficulty: 'advanced',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'A very strong incident-response detail.'
  },
  {
    q: 'Why is owner compromise the most severe Vault V2 role compromise?',
    options: [
      'Because the owner can appoint a malicious curator, turning it into a curator-compromise cascade even though owner powers are otherwise intentionally limited.',
      'Because the owner can directly steal adapter assets.',
      'Because the owner can force liquidations.',
      'Because the owner can rewrite Blue market parameters.'
    ],
    correct: 0,
    explanation: 'Owner powers are limited, but appointing a malicious curator is enough to put the vault on a dangerous path.',
    category: 'vault-v2',
    difficulty: 'advanced',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'Tie this to timelock protection for depositors.'
  },
  {
    q: 'What should happen before a Curator removes an adapter?',
    options: [
      'The vault should first deallocate all funds from the adapter so the adapter allocation is zero.',
      'The adapter should be made the liquidity adapter.',
      'The allocator should increase the adapter cap.',
      'The owner should abdicate.'
    ],
    correct: 0,
    explanation: 'The docs warn to deallocate first; removing an adapter with funds still inside can realize a loss.',
    category: 'vault-v2',
    difficulty: 'intermediate',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'Good procedural detail.'
  },
  {
    q: 'What is the purpose of setForceDeallocatePenalty?',
    options: [
      'It sets a penalty for using permissionless forceDeallocate on a specific adapter.',
      'It sets liquidation incentive for a market.',
      'It sets management fee for the vault.',
      'It disables Public Allocator fees.'
    ],
    correct: 0,
    explanation: 'The penalty is configured per adapter and affects forceDeallocate behavior.',
    category: 'vault-v2',
    difficulty: 'advanced',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'Important for unwind and liquidity safety discussions.'
  },
  {
    q: 'Why might a vault choose a zero forceDeallocate penalty on a MarketV1AdapterV2?',
    options: [
      'To ensure users can permissionlessly pull available adapter liquidity back to idle for withdrawals, accepting a griefing trade-off.',
      'To increase management fees.',
      'To disable withdrawals completely.',
      'To allow cap increases without timelock.'
    ],
    correct: 0,
    explanation: 'Zero penalty improves withdrawal accessibility but opens a griefing vector by making forceDeallocate costless.',
    category: 'vault-v2',
    difficulty: 'advanced',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'This is a nuanced, interview-worthy trade-off.'
  },
  {
    q: 'What is the key operational difference between Vault V1 withdraw queues and Vault V2 MarketV1AdapterV2 liquidity?',
    options: [
      'Vault V1 can iterate through a withdraw queue across markets, while Vault V2 with MarketV1AdapterV2 uses a single liquidity market at a time.',
      'Vault V2 always has a longer withdraw queue than V1.',
      'Vault V1 cannot withdraw from markets.',
      'Vault V2 uses no adapters at all.'
    ],
    correct: 0,
    explanation: 'The docs explicitly contrast the multi-market V1 queue with the single-market-at-a-time V2 liquidity adapter model.',
    category: 'vault-v2',
    difficulty: 'advanced',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'Operational liquidity nuance.'
  },
  {
    q: 'What does the docs recommend securing Owner and Curator with in production?',
    options: [
      'A multisig or institutional-grade MPC wallet',
      'A hot EOA for faster response',
      'Only a Telegram bot',
      'An NFT-based access system'
    ],
    correct: 0,
    explanation: 'The docs explicitly recommend multisig or institutional MPC for the high-power roles.',
    category: 'vault-v2',
    difficulty: 'intermediate',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'Strong operational security detail.'
  },
  {
    q: 'Why is maxDeposit() returning zero in Vault V2 not automatically a bug?',
    options: [
      'Because max* functions conservatively return zero due to gate uncertainty and cannot be used as naive UX truth.',
      'Because no Vault V2 accepts deposits.',
      'Because all vaults are paused by default forever.',
      'Because only the owner can deposit.'
    ],
    correct: 0,
    explanation: 'The docs explain these max functions return zero conservatively because external gates may not be reliably computed offchain.',
    category: 'vault-v2',
    difficulty: 'advanced',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'Good frontend + protocol nuance.'
  },
  {
    q: 'Which Ethereum address is the official VaultV2Factory?',
    options: [
      '0xA1D94F746dEfa1928926b84fB2596c06926C0405',
      '0x4501125508079A99ebBebCE205DeC9593C2b5857',
      '0x32BB1c0D48D8b1B3363e86eeB9A0300BAd61ccc1',
      '0x3696c5eAe4a7Ffd04Ea163564571E9CD8Ed9364e'
    ],
    correct: 0,
    explanation: '0xA1D9...0405 is the Ethereum VaultV2Factory.',
    category: 'vault-v2',
    difficulty: 'advanced',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'Keep Ethereum and Base straight.'
  },
  {
    q: 'Which Base address is the official MorphoMarketV1 AdapterV2Factory?',
    options: [
      '0x9a1B378C43BA535cDB89934230F0D3890c51C0EB',
      '0xF42D9c36b34c9c2CF3Bc30eD2a52a90eEB604642',
      '0x4501125508079A99ebBebCE205DeC9593C2b5857',
      '0x5C2531Cbd2cf112Cf687da3Cd536708aDd7DB10a'
    ],
    correct: 0,
    explanation: '0x9a1B...C0EB is the Base MorphoMarketV1 AdapterV2Factory.',
    category: 'vault-v2',
    difficulty: 'advanced',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'Good chain-specific recall question.'
  },

  {
    q: 'What does apyAtTarget represent in the AdaptiveCurveIRM walkthrough?',
    options: [
      'The target borrow APY at 90% utilization, derived from rateAtTarget.',
      'The protocol fee at target utilization.',
      'The rewards APR from Merkl.',
      'The average APY across all markets.'
    ],
    correct: 0,
    explanation: 'apyAtTarget is the target borrow APY at the 90% utilization point.',
    category: 'math',
    difficulty: 'intermediate',
    module_slug: 'core-math-and-formulas',
    interviewTip: 'Know where the value comes from.'
  },
  {
    q: 'Why does supply APY equal zero at 0% utilization in the IRM walkthrough?',
    options: [
      'Because supply APY is borrowApy × (1 - fee) × utilization, and utilization is zero.',
      'Because suppliers are penalized when markets are empty.',
      'Because the oracle price becomes zero.',
      'Because all empty markets are paused.'
    ],
    correct: 0,
    explanation: 'If utilization is zero, no borrow demand exists to generate supplier yield.',
    category: 'math',
    difficulty: 'intermediate',
    module_slug: 'core-math-and-formulas',
    interviewTip: 'Shows you understand yield source, not just formula syntax.'
  },
  {
    q: 'What does it mean for suppliers when utilization goes above the 90% target?',
    options: [
      'Borrow APY rises more steeply, which can increase supplier yield but also signals tighter liquidity conditions.',
      'Markets instantly become safer for borrowers.',
      'LLTV increases automatically.',
      'Rewards APR disappears.'
    ],
    correct: 0,
    explanation: 'The high-utilization slope is steeper to discourage overutilization and attract supply.',
    category: 'math',
    difficulty: 'intermediate',
    module_slug: 'core-math-and-formulas',
    interviewTip: 'Tie economics to liquidity conditions.'
  },
  {
    q: 'What is the cleanest explanation of current LTV to a partner?',
    options: [
      'How much of the collateral value is currently being used by the debt at the present oracle price.',
      'The liquidation incentive a liquidator will receive.',
      'The percentage of the vault held in idle assets.',
      'The protocol fee charged to suppliers.'
    ],
    correct: 0,
    explanation: 'Current LTV is debt divided by current collateral value, expressed as utilization of the collateral.',
    category: 'math',
    difficulty: 'fundamental',
    module_slug: 'core-math-and-formulas',
    interviewTip: 'Contrast LTV with LLTV and HF.'
  },
  {
    q: 'Why is a liquidation price useful in partner dashboards?',
    options: [
      'It gives users an intuitive threshold for when their collateral price would make the position unhealthy.',
      'It is the price at which Merkl rewards begin.',
      'It tells curators how to set management fees.',
      'It replaces the need to show Health Factor.'
    ],
    correct: 0,
    explanation: 'Liquidation price turns abstract risk into a user-friendly threshold.',
    category: 'math',
    difficulty: 'intermediate',
    module_slug: 'core-math-and-formulas',
    interviewTip: 'Always pair it with HF.'
  },
  {
    q: 'What is the main reason to simulate post-transaction HF before signing?',
    options: [
      'To stop users from unknowingly making themselves liquidatable by borrowing or withdrawing collateral.',
      'To increase gas costs deliberately.',
      'To replace the need for oracles.',
      'To change the market LLTV.'
    ],
    correct: 0,
    explanation: 'Post-transaction simulation protects users from unintentionally crossing into a risky state.',
    category: 'math',
    difficulty: 'fundamental',
    module_slug: 'core-math-and-formulas',
    interviewTip: 'A core product UX answer.'
  },
  {
    q: 'If a dashboard uses floating-point math for 1e36 oracle values, what is the likely risk?',
    options: [
      'Precision loss that can corrupt HF, liquidation price, and value calculations.',
      'The contract will reject all transactions automatically.',
      'Merkl rewards will increase.',
      'The Public Allocator fee becomes zero.'
    ],
    correct: 0,
    explanation: 'Float math is dangerous for large integer precision and can lead to materially wrong risk metrics.',
    category: 'math',
    difficulty: 'advanced',
    module_slug: 'core-math-and-formulas',
    interviewTip: 'Great debugging scenario.'
  },
  {
    q: 'What is the best short explanation of LLTV?',
    options: [
      'The liquidation loan-to-value threshold that defines maximum borrowing power before liquidation eligibility.',
      'The current market utilization ratio.',
      'The liquidation fee collected by the protocol.',
      'The curve parameter for rateAtTarget.'
    ],
    correct: 0,
    explanation: 'LLTV is the liquidation threshold for borrowing power.',
    category: 'math',
    difficulty: 'fundamental',
    module_slug: 'core-math-and-formulas',
    interviewTip: 'The name should come out naturally.'
  },
  {
    q: 'What is the safest reason to treat LTV and HF as complementary, not redundant, metrics?',
    options: [
      'LTV shows leverage, while HF shows distance from liquidation.',
      'They are always numerically identical.',
      'HF applies only to vaults and LTV only to markets.',
      'LTV is for rewards and HF is for fees.'
    ],
    correct: 0,
    explanation: 'They answer different risk questions and should be displayed together.',
    category: 'math',
    difficulty: 'intermediate',
    module_slug: 'core-math-and-formulas',
    interviewTip: 'Useful for dashboard design answers.'
  },
  {
    q: 'What is the practical value of converting share-based state to asset-based state in the UI?',
    options: [
      'Users reason in assets, while the protocol often stores state in shares; good UIs bridge that correctly.',
      'It removes interest accrual.',
      'It disables rounding.',
      'It lets GraphQL skip indexing.'
    ],
    correct: 0,
    explanation: 'Users need asset-denominated values, but the protocol tracks much of the state in shares.',
    category: 'math',
    difficulty: 'intermediate',
    module_slug: 'core-math-and-formulas',
    interviewTip: 'Very partner-engineer answer.'
  },

  {
    q: 'What is the maximum GraphQL complexity allowed by Morpho API?',
    options: ['1,000,000', '100,000', '10,000', 'Unlimited'],
    correct: 0,
    explanation: 'The docs explicitly state a max allowed complexity of 1,000,000.',
    category: 'integration',
    difficulty: 'intermediate',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'Pair this with "request only what you need."'
  },
  {
    q: 'Which approach best reduces GraphQL complexity pressure?',
    options: [
      'Fetch a light list first, then run focused detail queries only for selected records.',
      'Always request every nested history field in a single call.',
      'Use one massive polling query for the whole app.',
      'Replace every read with a write transaction.'
    ],
    correct: 0,
    explanation: 'The docs recommend trimmed selection sets, lower fan-out, and split queries.',
    category: 'integration',
    difficulty: 'intermediate',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'This is a real dashboard design trade-off.'
  },
  {
    q: 'What is the best framing for permits in partner UX?',
    options: [
      'Permits reduce approval friction, but unit discipline and signature-handling correctness still matter.',
      'Permits remove all integration risk.',
      'Permits replace the need for simulation.',
      'Permits are only useful for vault curators.'
    ],
    correct: 0,
    explanation: 'Permits help UX but do not eliminate all approval- and unit-related footguns.',
    category: 'integration',
    difficulty: 'intermediate',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'Balanced product + security answer.'
  },
  {
    q: 'Why should complex borrow flows often use Bundler3 instead of several user-signed transactions?',
    options: [
      'Because borrow, swap, and resupply sequences are safer when they either fully succeed or fully revert.',
      'Because Bundler3 can set LLTV directly.',
      'Because the API requires it.',
      'Because Merkl claims only work inside Bundler3.'
    ],
    correct: 0,
    explanation: 'Bundler3 protects the user from partial completion across dependent steps.',
    category: 'integration',
    difficulty: 'intermediate',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'Emphasize state safety.'
  },
  {
    q: 'What is a high-signal production review item before approving a partner launch?',
    options: [
      'Whether the integration validates oracle assumptions and handles stale or unavailable read-layer data gracefully',
      'Whether the partner uses the exact same CSS colors as Morpho',
      'Whether all users are forced to borrow max size',
      'Whether the app hides Health Factor to simplify the UI'
    ],
    correct: 0,
    explanation: 'Read-path resilience and oracle correctness are core production concerns.',
    category: 'integration',
    difficulty: 'advanced',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'This is what a senior integrator checks.'
  },
  {
    q: 'What is the most reliable source of truth for execution state in production?',
    options: [
      'Onchain contracts',
      'A cached screenshot',
      'A Discord message',
      'A static spreadsheet'
    ],
    correct: 0,
    explanation: 'APIs and indexers are useful, but onchain state remains the execution source of truth.',
    category: 'integration',
    difficulty: 'fundamental',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'Simple but important.'
  },
  {
    q: 'What is the best reason to separate contracts, SDKs, and API responsibilities in your architecture?',
    options: [
      'Each layer serves a different purpose: settlement, ergonomics, and indexed reads respectively.',
      'Because Morpho forbids mixing them.',
      'Because SDKs replace contracts entirely.',
      'Because GraphQL is only for write operations.'
    ],
    correct: 0,
    explanation: 'A good architecture uses each integration surface for the job it is best at.',
    category: 'integration',
    difficulty: 'intermediate',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'This is a strong scoping answer.'
  },
  {
    q: 'What is the best answer when a partner says "we can just do direct transactions for everything"?',
    options: [
      'Direct calls are fine for simple flows, but Bundler3 is safer for dependent multi-step workflows where partial completion would be harmful.',
      'Direct calls are never allowed on Morpho.',
      'Bundler3 is mandatory for deposits.',
      'GraphQL replaces both options.'
    ],
    correct: 0,
    explanation: 'Use the simple surface when it is enough, and Bundler3 when atomic multi-step safety matters.',
    category: 'partner-scenario',
    difficulty: 'intermediate',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'Avoid absolutist answers.'
  },

  {
    q: 'Why is it useful that Vault V2 rewards are pre-aggregated by the Morpho API?',
    options: [
      'It simplifies dashboards because reward sources across adapters are already combined into the rewards field.',
      'It means Merkl is no longer involved.',
      'It guarantees rewards never change.',
      'It removes the need to know token prices.'
    ],
    correct: 0,
    explanation: 'The docs explicitly say Vault V2 rewards are pre-aggregated in the API.',
    category: 'merkl',
    difficulty: 'intermediate',
    module_slug: 'real-world-integrations-and-merkl',
    interviewTip: 'Important for "combined yield" demos.'
  },
  {
    q: 'What should a combined-yield dashboard avoid doing?',
    options: [
      'Collapsing native APY and incentive APR into a single unexplained number',
      'Showing reward tokens separately',
      'Displaying chain and vault identity',
      'Caching read data'
    ],
    correct: 0,
    explanation: 'Strong reward UX preserves the distinction between base yield and incentives.',
    category: 'merkl',
    difficulty: 'intermediate',
    module_slug: 'real-world-integrations-and-merkl',
    interviewTip: 'A good product judgment signal.'
  },
  {
    q: 'Why is claim simulation a compelling partner demo feature?',
    options: [
      'It shows the user action path for rewards rather than only passive APR metrics.',
      'It guarantees successful claims on mainnet.',
      'It replaces wallet integration.',
      'It disables the need for Merkl APIs.'
    ],
    correct: 0,
    explanation: 'Simulation makes rewards feel operational and user-centric.',
    category: 'merkl',
    difficulty: 'intermediate',
    module_slug: 'real-world-integrations-and-merkl',
    interviewTip: 'Action-oriented demos sell better.'
  },
  {
    q: 'What is the best fallback posture when Merkl rewards data fails but Morpho vault state still loads?',
    options: [
      'Show vault state and native yield, mark rewards as temporarily unavailable, and avoid blanking the whole page.',
      'Crash the page.',
      'Invent reward values from the last tweet.',
      'Hide the vault entirely.'
    ],
    correct: 0,
    explanation: 'Multi-source dashboards should degrade gracefully rather than fail all-or-nothing.',
    category: 'merkl',
    difficulty: 'advanced',
    module_slug: 'real-world-integrations-and-merkl',
    interviewTip: 'This shows mature frontend behavior.'
  },
  {
    q: 'What is the best technical reason to keep APY and APR terminology correct in rewards dashboards?',
    options: [
      'Because base vault yield and incentive rewards may use different annualization semantics, and mixing them sloppily erodes trust.',
      'Because APR and APY are always identical.',
      'Because Merkl only supports APY.',
      'Because GraphQL forbids APR fields.'
    ],
    correct: 0,
    explanation: 'Precise yield semantics matter in partner-facing products.',
    category: 'merkl',
    difficulty: 'advanced',
    module_slug: 'real-world-integrations-and-merkl',
    interviewTip: 'Trust is built on careful wording.'
  },
  {
    q: 'What does the Merkl + Morpho recipe most clearly demonstrate for the interview?',
    options: [
      'How to build a practical partner-facing POC by combining protocol data, rewards data, and user actions into one coherent dashboard.',
      'How to replace Morpho with Merkl.',
      'How to deploy a new oracle factory.',
      'How to bypass GraphQL rate limits.'
    ],
    correct: 0,
    explanation: 'The recipe is a model for the kind of practical integration demo the role requires.',
    category: 'merkl',
    difficulty: 'intermediate',
    module_slug: 'real-world-integrations-and-merkl',
    interviewTip: 'Tie it directly to the job.'
  },
  {
    q: 'Why should rewards-aware UIs fetch Morpho and Merkl data in parallel but handle them independently?',
    options: [
      'Because they are separate data sources with separate failure modes, and partial render is better than global failure.',
      'Because GraphQL can call Merkl automatically for every user claim.',
      'Because parallel fetches are forbidden on production backends.',
      'Because claim simulation only works serially.'
    ],
    correct: 0,
    explanation: 'Independent handling produces a more resilient dashboard.',
    category: 'merkl',
    difficulty: 'advanced',
    module_slug: 'real-world-integrations-and-merkl',
    interviewTip: 'This is solid frontend architecture language.'
  },
  {
    q: 'If a partner wants to highlight incentive campaigns to drive deposits, what is the strongest first dashboard widget?',
    options: [
      'A vault table showing native APY, reward APR by token, total estimated yield, and claimable rewards for the connected user',
      'A page showing only the Morpho logo',
      'A management fee admin panel',
      'A raw ABI explorer'
    ],
    correct: 0,
    explanation: 'This widget directly ties partner incentives to user actions and outcomes.',
    category: 'partner-scenario',
    difficulty: 'intermediate',
    module_slug: 'real-world-integrations-and-merkl',
    interviewTip: 'Very practical answer.'
  },

  {
    q: 'What is the first mistake to avoid on a partner discovery call?',
    options: [
      'Jumping into protocol details before clarifying the partner’s exact workflow and goal',
      'Asking about chain preference',
      'Talking about monitoring needs',
      'Proposing a POC'
    ],
    correct: 0,
    explanation: 'Use case first, architecture second.',
    category: 'communication',
    difficulty: 'fundamental',
    module_slug: 'partner-communication-and-objections',
    interviewTip: 'Simple but foundational.'
  },
  {
    q: 'What is the strongest answer to "Can Morpho support institutions?"',
    options: [
      'Vault V2’s separated roles, timelocks, caps, and gate controls create a stronger operational-control story for managed products.',
      'Because institutions never ask about controls.',
      'Because Blue has no liquidations.',
      'Because Merkl rewards solve compliance.'
    ],
    correct: 0,
    explanation: 'The institutional story is about controls, governance design, and operational boundaries.',
    category: 'communication',
    difficulty: 'advanced',
    module_slug: 'partner-communication-and-objections',
    interviewTip: 'Translate architecture into control language.'
  },
  {
    q: 'When a partner requests an unsupported feature, the best response is to:',
    options: [
      'Clarify the use case, explain current limitations honestly, and offer the closest workable alternative or POC path.',
      'Promise it will be shipped immediately.',
      'Dismiss the request as uninformed.',
      'Hide the limitation until integration starts.'
    ],
    correct: 0,
    explanation: 'Credible partner engineering combines honesty with forward motion.',
    category: 'communication',
    difficulty: 'intermediate',
    module_slug: 'partner-communication-and-objections',
    interviewTip: 'Never overpromise.'
  },
  {
    q: 'What is the best sign that you scoped a partner call well?',
    options: [
      'You can summarize the workflow, chosen integration surface, open risks, and next concrete action at the end of the call.',
      'You spoke the most.',
      'You listed every Morpho contract from memory.',
      'You left all implementation details open.'
    ],
    correct: 0,
    explanation: 'A well-scoped call ends with clear output and next steps.',
    category: 'communication',
    difficulty: 'intermediate',
    module_slug: 'partner-communication-and-objections',
    interviewTip: 'Outcome orientation.'
  },
  {
    q: 'What is the strongest reason to mention timezones explicitly in support workflows?',
    options: [
      'Because clear next-update timing reduces partner anxiety when engineering and partners are operating in different regions.',
      'Because timezones affect LLTV.',
      'Because Merkl rewards settle by timezone.',
      'Because Bundler3 only works in GMT-5.'
    ],
    correct: 0,
    explanation: 'Timezone clarity is part of expectation management in a partner-facing role.',
    category: 'communication',
    difficulty: 'intermediate',
    module_slug: 'partner-communication-and-objections',
    interviewTip: 'This directly matches the job spec.'
  },
  {
    q: 'What is the weakest answer to a liquidation objection?',
    options: [
      '"Users just should not over-borrow."',
      '"We should surface HF and simulate post-transaction risk."',
      '"Liquidation risk is real, so the product needs visible buffers and alerts."',
      '"We should validate oracle assumptions and user-facing calculations."'
    ],
    correct: 0,
    explanation: 'The weakest answer is dismissive and unhelpful.',
    category: 'communication',
    difficulty: 'fundamental',
    module_slug: 'partner-communication-and-objections',
    interviewTip: 'Empathy matters.'
  },
  {
    q: 'What is the best way to forward a suspected protocol bug internally?',
    options: [
      'State chain, address, exact failing call or query, reproduction steps, expected vs actual result, and impact.',
      'Send only "something looks off."',
      'Wait until a second partner reports it.',
      'Write a long emotional message without repro detail.'
    ],
    correct: 0,
    explanation: 'High-quality escalation notes are reproducible and actionable.',
    category: 'communication',
    difficulty: 'intermediate',
    module_slug: 'partner-communication-and-objections',
    interviewTip: 'Operational rigor signal.'
  },
  {
    q: 'What is the best way to explain technical trade-offs without hurting partner confidence?',
    options: [
      'State the trade-off directly, explain the mitigation, and propose the best path for the partner’s specific use case.',
      'Pretend there are no trade-offs.',
      'Overwhelm them with jargon.',
      'Refuse to compare options.'
    ],
    correct: 0,
    explanation: 'Credible technical communication is transparent and solution-oriented.',
    category: 'communication',
    difficulty: 'intermediate',
    module_slug: 'partner-communication-and-objections',
    interviewTip: 'This is real solutions-architect behavior.'
  },

  {
    q: 'Which POC demonstrates the most partner empathy for borrowers?',
    options: [
      'A borrow-flow simulator that previews post-transaction HF and liquidation price before users sign.',
      'A page showing only historical TVL.',
      'A wallet theme switcher.',
      'A static PDF of formulas.'
    ],
    correct: 0,
    explanation: 'Borrow-flow simulation prevents avoidable user mistakes and answers a real need.',
    category: 'poc-design',
    difficulty: 'intermediate',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: 'Tie POCs to user pain.'
  },
  {
    q: 'Which dashboard metric should be most prominent for open borrow positions?',
    options: ['Health Factor', 'Vault symbol', 'Reward logo count', 'Management fee'],
    correct: 0,
    explanation: 'The docs repeatedly emphasize HF as the core position safety metric.',
    category: 'poc-design',
    difficulty: 'fundamental',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: 'A basic but essential product call.'
  },
  {
    q: 'What is the best reason to add public-allocator liquidity data to a curator dashboard?',
    options: [
      'It helps operators understand where borrow demand can be supported through reallocatable liquidity across vaults.',
      'It replaces all market metrics.',
      'It removes the need for caps.',
      'It automatically claims rewards.'
    ],
    correct: 0,
    explanation: 'Public allocator data makes liquidity fragmentation operationally visible.',
    category: 'poc-design',
    difficulty: 'advanced',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: 'A strong ops-focused answer.'
  },
  {
    q: 'What is the best POC behavior when a specific market deallocate request cannot fully exit because utilization is high?',
    options: [
      'Show remaining allocation, explain that exits may need to happen incrementally as liquidity becomes available, and monitor for retry opportunities.',
      'Mark the protocol broken immediately.',
      'Hide the remaining allocation from the UI.',
      'Assume type(uint256).max will solve it.'
    ],
    correct: 0,
    explanation: 'The docs explain that deallocation may need to happen incrementally in illiquid conditions and exact asset amounts matter.',
    category: 'poc-design',
    difficulty: 'advanced',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: 'Great operational nuance.'
  },
  {
    q: 'What is the best source of documentation improvements when building POCs?',
    options: [
      'The exact places where an integration required hidden assumptions, missing examples, or repeated partner clarification',
      'A random preference for longer prose',
      'Only community memes',
      'The CSS layer of the demo'
    ],
    correct: 0,
    explanation: 'The highest-value doc feedback comes from real integration friction.',
    category: 'poc-design',
    difficulty: 'intermediate',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: 'This maps directly to the role.'
  },

  {
    q: 'What makes a strong 60-second answer sound senior?',
    options: [
      'It is structured, accurate, tied to partner value, and honest about trade-offs where needed.',
      'It includes every memorized address.',
      'It never pauses.',
      'It avoids all business language.'
    ],
    correct: 0,
    explanation: 'Senior-sounding answers are structured and useful, not maximalist.',
    category: 'interview',
    difficulty: 'intermediate',
    module_slug: 'mock-interviews-and-drills',
    interviewTip: 'Quality of structure matters.'
  },
  {
    q: 'What is the right first move if you start blanking on a technical question?',
    options: [
      'Restate the question, anchor on what you know, state the assumption, and say what you would verify.',
      'Start guessing addresses.',
      'Change the topic immediately.',
      'Apologize for several minutes.'
    ],
    correct: 0,
    explanation: 'This is the safest recovery pattern under pressure.',
    category: 'interview',
    difficulty: 'fundamental',
    module_slug: 'mock-interviews-and-drills',
    interviewTip: 'Judgment and calm matter.'
  },
  {
    q: 'What is the best evidence that you are thinking like a partner engineer during a mock call?',
    options: [
      'You recommend a concrete architecture, identify the main risks, and define the next implementation step.',
      'You list the investors.',
      'You avoid all trade-offs.',
      'You only talk about Solidity.'
    ],
    correct: 0,
    explanation: 'Concrete recommendations and scoped risk thinking are the strongest signals.',
    category: 'interview',
    difficulty: 'intermediate',
    module_slug: 'mock-interviews-and-drills',
    interviewTip: 'Be decisive and scoped.'
  },
  {
    q: 'What should you prioritize most in the final 12 hours before the interview?',
    options: [
      'Fast recall of formulas, role/timelock logic, and a few polished partner-scenario answers',
      'Learning an unrelated protocol from scratch',
      'Rewriting the entire app UI',
      'Memorizing only historical investor names'
    ],
    correct: 0,
    explanation: 'In the final stretch, polish high-yield recall and communication, not breadth expansion.',
    category: 'review',
    difficulty: 'fundamental',
    module_slug: 'final-review-and-feedback-loop',
    interviewTip: 'Focus wins in the last day.'
  },

  // --- Blue SDK and Integration Patterns ---
  {
    q: 'What is the primary advantage of using Blue SDK over calling contracts directly?',
    options: [
      'Typed position simulation, multicall batching, and pre-computed market state in JavaScript without reimplementing share math',
      'It bypasses oracle validation entirely',
      'It guarantees gasless transactions',
      'It automatically sets LLTV for every market'
    ],
    correct: 0,
    explanation: 'Blue SDK provides typed position objects, share math, and multicall building blocks so you spend less time reconstructing protocol logic in JS.',
    category: 'integration',
    difficulty: 'intermediate',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'Mention share math and typed simulation.'
  },
  {
    q: 'Which Blue SDK method should you use to check whether a position is currently liquidatable?',
    options: [
      'Compute HF from position.collateralValue and position.borrowAssets, then check if it is <= 1',
      'Call a "isLiquidatable()" endpoint on the Morpho API',
      'Check if the vault sentinel has revoked caps',
      'Read the Bundler3 initiator context'
    ],
    correct: 0,
    explanation: 'The SDK gives you typed position state. Liquidatability is derived by computing HF using the market\'s LLTV and the oracle-derived collateral value.',
    category: 'integration',
    difficulty: 'intermediate',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'Know the HF derivation, not just the SDK surface.'
  },
  {
    q: 'What does the Morpho Blue SDK\'s simulateOperation helper primarily do?',
    options: [
      'Predicts onchain state changes from a supply, borrow, repay, or withdraw without submitting a transaction',
      'Broadcasts transactions to multiple chains simultaneously',
      'Generates GraphQL queries from typed inputs',
      'Validates EIP-712 permit signatures before execution'
    ],
    correct: 0,
    explanation: 'simulateOperation is a pre-execution preview tool, letting UI builders show users the outcome before they sign.',
    category: 'integration',
    difficulty: 'advanced',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'This is a strong UX-quality answer.'
  },
  {
    q: 'When should you use ERC20 permit instead of a standard approve() for a Morpho supply flow?',
    options: [
      'When you want the user to sign a gasless authorization that can be bundled atomically with the supply call in one transaction',
      'Whenever the token is a stablecoin',
      'Only when the oracle is a Chainlink feed',
      'Only when depositing into a Vault V2 and never for direct Blue markets'
    ],
    correct: 0,
    explanation: 'Permit signatures can be passed into Bundler3 so the approve and supply happen atomically, removing the separate approve transaction from the UX.',
    category: 'integration',
    difficulty: 'intermediate',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'Bundle permit + action = one-click UX.'
  },
  {
    q: 'A token does not support EIP-2612 permit. What is the correct Bundler3 workaround?',
    options: [
      'Use a standard approve transaction before the Bundler3 flow, or use Permit2 if available',
      'Change the token standard in the market',
      'Use the sentinel to whitelist the token for permit',
      'Permits are always mandatory in Bundler3'
    ],
    correct: 0,
    explanation: 'Not all tokens support EIP-2612. In those cases you need a prior approve or a Permit2 adapter rather than forcing the flow into native permit.',
    category: 'integration',
    difficulty: 'advanced',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'A strong senior detail that shows you know the real edge cases.'
  },
  {
    q: 'Which callback pattern is specific to Bundler3 and enables flash loan-like atomic sequences?',
    options: [
      'The Bundler3 callback data field lets a recipient contract reenter Bundler3 with additional calls before the transaction reverts',
      'Bundler3 only supports linear single-step flows',
      'The callback is for logging only and has no execution effect',
      'Callbacks require curator signature every time'
    ],
    correct: 0,
    explanation: 'Bundler3 supports callback-driven reentrant sequences, making it possible to build complex flash loan or leverage unwind flows as a single atomic transaction.',
    category: 'integration',
    difficulty: 'advanced',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'Advanced Bundler3 knowledge signals real integration depth.'
  },

  // --- GraphQL and API Patterns ---
  {
    q: 'Which GraphQL field should you query to get a vault\'s current net APY including both native yield and rewards?',
    options: [
      'The state.netApy or equivalent yields aggregation field on the vault object',
      'The oracle field on the market',
      'The curator address field',
      'The withdrawQueue length'
    ],
    correct: 0,
    explanation: 'The Morpho API aggregates base and reward APY into a readable netApy-style field so dashboards do not need to recompute it from raw market data.',
    category: 'integration',
    difficulty: 'intermediate',
    module_slug: 'real-world-integrations-and-merkl',
    interviewTip: 'Show you know the API structure for yield display.'
  },
  {
    q: 'What GraphQL filter pattern should you use to discover vaults accepting a specific loan asset?',
    options: [
      'Filter by asset.address on the vault query to match the underlying token address',
      'Filter by market.oracle to match oracle address',
      'Filter by vault.curator to find specific strategies',
      'There is no filtering; you must fetch all vaults and filter in JS'
    ],
    correct: 0,
    explanation: 'The API supports asset-based filtering so you can efficiently discover vaults for a given token without pulling the full vault list.',
    category: 'integration',
    difficulty: 'intermediate',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'Know how to scope queries; do not pull everything.'
  },
  {
    q: 'What should a production dashboard do when a Morpho API call returns stale or empty data?',
    options: [
      'Show a degraded state indicator and fall back to last known values or onchain reads instead of showing zeros or crashing',
      'Block the whole page until the API responds',
      'Override the API with hardcoded values',
      'Increase the polling interval indefinitely'
    ],
    correct: 0,
    explanation: 'Robust dashboards handle API stale data gracefully with degraded mode UI, not silent failures or full page blocks.',
    category: 'poc-design',
    difficulty: 'intermediate',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: '"Degraded mode" is the phrase that signals operational maturity.'
  },
  {
    q: 'When querying user positions via GraphQL, which approach is most efficient for a wallet with many markets?',
    options: [
      'Query positions filtered by userAddress and include only the fields needed for display: borrowAssets, collateralAssets, healthFactor, market.uniqueKey',
      'Fetch all markets and filter positions in the frontend',
      'Fetch positions once and never re-query even when prices change',
      'Use REST endpoint for positions and GraphQL for market data'
    ],
    correct: 0,
    explanation: 'Narrow field selection and user-scoped filters prevent complexity overages and unnecessary data transfer.',
    category: 'integration',
    difficulty: 'advanced',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'Complexity and narrow queries are the key discipline.'
  },

  // --- IRM Mechanics ---
  {
    q: 'What happens to borrow APY in AdaptiveCurveIRM when utilization drops significantly below 90%?',
    options: [
      'The rate adapts downward over time as the curve curves below the target, incentivizing more borrowing demand',
      'APY stays frozen until governance votes to adjust it',
      'APY immediately jumps to maxApy',
      'Supply APY rises faster than borrow APY'
    ],
    correct: 0,
    explanation: 'The Adaptive part means the rate curve adjusts over time to target 90% utilization. Below target, rates adapt down to attract borrowers.',
    category: 'math',
    difficulty: 'advanced',
    module_slug: 'core-math-and-formulas',
    interviewTip: 'Explain "adaptive" as time-based curve adjustment, not instantaneous jump.'
  },
  {
    q: 'Why does supply APY always trail borrow APY in any market with a protocol fee?',
    options: [
      'Because the protocol fee takes a portion of interest before distributing to suppliers, so suppliers receive borrow revenue minus the fee fraction multiplied by utilization',
      'Because suppliers get paid in a different token',
      'Because Morpho Labs extracts all excess yield',
      'Because supply APY is calculated in USD while borrow APY is in ETH'
    ],
    correct: 0,
    explanation: 'Supply APY = borrow APY × utilization × (1 - fee). The fee and sub-100% utilization both reduce what suppliers receive relative to what borrowers pay.',
    category: 'math',
    difficulty: 'intermediate',
    module_slug: 'core-math-and-formulas',
    interviewTip: 'Verbalize the formula relationship, not just the conclusion.'
  },
  {
    q: 'Which combination of variables causes the maximum spread between supply and borrow APY?',
    options: [
      'Low utilization combined with a high protocol fee percentage',
      'High utilization combined with a zero protocol fee',
      'Exactly 90% utilization with any fee',
      'Zero utilization with zero fee'
    ],
    correct: 0,
    explanation: 'Low utilization means less of the borrow interest reaches suppliers, and a high fee takes another cut. Both effects compound the supply-borrow spread.',
    category: 'math',
    difficulty: 'advanced',
    module_slug: 'core-math-and-formulas',
    interviewTip: 'Strong analysis answer for formula reasoning under pressure.'
  },

  // --- Advanced Vault V2 Operational ---
  {
    q: 'Why is a Vault V2 curator advised to set the liquidity adapter and verify liquidityData before enabling withdrawals?',
    options: [
      'Because the vault can only source liquidity for withdrawals from the single market pointed to by the liquidity adapter, so a wrong pointer means withdrawals fail even if other markets have idle funds',
      'Because the liquidity adapter also controls which users can deposit',
      'Because liquidityData determines how rewards are distributed',
      'Because the oracle reads from liquidityData during liquidations'
    ],
    correct: 0,
    explanation: 'A misconfigured liquidity adapter points withdrawals to the wrong market or fails silently. Unlike V1 queues, V2 does not auto-fallthrough to other markets.',
    category: 'vault-v2',
    difficulty: 'advanced',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'The "no automatic fallthrough" detail is a key V2 gotcha.'
  },
  {
    q: 'If a Vault V2 curator wants to shift allocation between two adapters, what is the safest operational order?',
    options: [
      'Reduce caps on the source adapter, reallocate via the allocator to move funds to the destination, then adjust destination adapter caps',
      'Remove the source adapter immediately to force funds to the destination',
      'Increase destination caps first and wait for arbitrageurs to balance liquidity',
      'Ask Morpho governance to reroute the allocation'
    ],
    correct: 0,
    explanation: 'The safe path is always: cap reduction first to stop new inflows, then allocator-driven rebalancing, not abrupt adapter removal with funds still inside.',
    category: 'vault-v2',
    difficulty: 'advanced',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'Cap discipline before adapter moves = correct operations answer.'
  },
  {
    q: 'What is the difference between an absolute cap and a relative cap in Vault V2?',
    options: [
      'Absolute caps set a hard max on total allocated assets; relative caps express a limit as a proportion of the vault\'s total assets',
      'Absolute caps are set by the sentinel; relative caps are set by the curator',
      'Absolute caps only apply to Blue markets; relative caps apply to external adapter strategies',
      'They are the same concept with different naming conventions'
    ],
    correct: 0,
    explanation: 'Both types gate allocation but with different reference bases. Absolute is a fixed token ceiling; relative scales with vault size.',
    category: 'vault-v2',
    difficulty: 'advanced',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'Explain the reference basis difference, not just the names.'
  },
  {
    q: 'Why does Vault V2 use abstract cap IDs instead of only per-market caps?',
    options: [
      'So curators can express risk limits across a dimension (collateral type, adapter, strategy) that spans multiple markets without duplicating configuration for each market',
      'To save gas by reducing the number of onchain storage slots needed',
      'To let depositors vote on individual market limits',
      'Because oracle addresses change too frequently for per-market caps'
    ],
    correct: 0,
    explanation: 'Abstract IDs decouple risk governance from market enumeration. A single collateral cap can constrain all markets sharing that collateral without per-market repetition.',
    category: 'vault-v2',
    difficulty: 'advanced',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'This is a strong architecture insight that distinguishes V2 from V1.'
  },
  {
    q: 'What is the most important thing to check before a Curator increases a cap in Vault V2?',
    options: [
      'That the required timelock period has elapsed since the increase was proposed',
      'That the Sentinel has pre-approved the change',
      'That the Allocator has zeroed the current position',
      'That the Morpho API shows available liquidity in that market'
    ],
    correct: 0,
    explanation: 'Risk-increasing actions are timelocked in V2. You must wait the timelock period after submitting the proposal before executing the cap increase.',
    category: 'vault-v2',
    difficulty: 'intermediate',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'Timelock elapsed check is the key operational step.'
  },

  // --- Advanced Partner Scenarios ---
  {
    q: 'A partner asks if they can list a new LRT with a custom LLTV on Morpho without approval from Morpho Labs. Best answer?',
    options: [
      'Yes, market creation is permissionless; they choose the parameters, but they should use approved oracle and IRM components and understand that market quality depends on their own diligence',
      'No, every new asset requires Morpho Labs approval and a governance vote',
      'Yes, but only if Morpho governance first votes to whitelist the LRT token address',
      'No, LRTs are categorically excluded from Morpho Blue'
    ],
    correct: 0,
    explanation: 'Creation is permissionless, but the partner owns the market design choices. Using approved components and doing proper diligence is their responsibility, not a Morpho Labs gate.',
    category: 'partner-scenario',
    difficulty: 'intermediate',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: '"Permissionless but you own the diligence" is the right frame.'
  },
  {
    q: 'A partner wants to embed a Morpho earn product in their exchange but does not want to show raw DeFi complexity to their users. What integration model should you recommend first?',
    options: [
      'Embed a curated Vault V2 position: users deposit one token, get vault shares, and the exchange handles market complexity behind a simple yield interface',
      'Point users directly to the Morpho app and let them manage positions manually',
      'Embed raw Blue market calls with full oracle and parameter UI surfaced to exchange users',
      'Use only GraphQL and no onchain calls so complexity is fully hidden'
    ],
    correct: 0,
    explanation: 'Curated vaults are the abstraction layer that lets a partner offer a simple earn UX while Morpho handles the market routing underneath.',
    category: 'partner-scenario',
    difficulty: 'intermediate',
    module_slug: 'real-world-integrations-and-merkl',
    interviewTip: 'Vault = clean consumer abstraction. This is the DeFi-mullet pitch.'
  },
  {
    q: 'A partner integrates a borrow flow and notices that simulated borrow amounts differ slightly from final executed amounts. What is the most likely cause?',
    options: [
      'Interest accrues between simulation and execution, changing debt state; shares-to-assets conversion may also differ by a rounding step',
      'The GraphQL API returned stale data',
      'The oracle price changed between block and simulation',
      'Both A and C'
    ],
    correct: 3,
    explanation: 'Both interest accrual and oracle price movement between simulation and execution can cause small differences. This is why previews should show estimates with appropriate margins.',
    category: 'partner-scenario',
    difficulty: 'advanced',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'Multi-cause answers show you understand the execution environment.'
  },
  {
    q: 'A treasury team wants to move funds in and out of a Morpho vault on a fixed weekly schedule. What should you tell them about withdrawal timing?',
    options: [
      'Withdrawals depend on available liquidity in the vault\'s current liquidity adapter market; they should plan for delays and consider multiple liquidity sources or a liquidity buffer strategy',
      'Morpho guarantees instant withdrawals on all vaults by design',
      'Weekly schedule is fine because Morpho governance can always unlock idle liquidity on demand',
      'Vault V2 withdrawals always settle in the next block regardless of market liquidity'
    ],
    correct: 0,
    explanation: 'Vault V2 liquidity availability depends on the liquidity adapter market state. A treasury product should account for potential liquidity delays, not assume instant exit.',
    category: 'partner-scenario',
    difficulty: 'advanced',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'Honest liquidity caveat shows operational maturity.'
  },
  {
    q: 'A partner is building a yield comparison dashboard and wants to show Morpho vaults next to Aave markets. What is the most important data quality rule to follow?',
    options: [
      'Separate base lending yield from incentive rewards on both sides, mark data freshness, and avoid collapsing different yield components into one deceptive number',
      'Always show Morpho with higher numbers than Aave regardless of actual rates',
      'Only show Morpho vaults and omit competitors to avoid confusion',
      'Use identical API endpoints for both since yield is yield'
    ],
    correct: 0,
    explanation: 'Honest yield comparison requires yield decomposition and freshness markers. Conflating base and incentive yield looks inflated and misleads users.',
    category: 'poc-design',
    difficulty: 'intermediate',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: 'Data honesty and component separation are partner trust builders.'
  },

  // --- Monitoring and Incident Response ---
  {
    q: 'A production dashboard starts showing HF values of exactly 0 for all positions. What is the most likely root cause?',
    options: [
      'Oracle price returned zero or was not fetched, causing collateral value computation to produce zero',
      'Morpho governance froze all positions globally',
      'The allocator zeroed all caps simultaneously',
      'The Bundler3 contract was paused'
    ],
    correct: 0,
    explanation: 'HF = 0 almost always means the collateral value computation broke, usually from a missing or zero oracle response. Check oracle health first.',
    category: 'poc-design',
    difficulty: 'intermediate',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: 'Oracle first, then decimal math, then data pipeline.'
  },
  {
    q: 'What is the correct incident triage order for a partner reporting that their vault dashboard shows wrong APY?',
    options: [
      'Verify data source freshness, check if the APY is mixing base and reward yield incorrectly, then verify decimal and scaling math before escalating',
      'Immediately escalate to Morpho engineering without checking the integration',
      'Tell the partner APY fluctuations are normal and require no investigation',
      'Restart the frontend server and wait 24 hours'
    ],
    correct: 0,
    explanation: 'Methodical triage: data freshness → yield decomposition → math integrity → escalation. This mirrors how a senior partner engineer diagnoses dashboards.',
    category: 'partner-scenario',
    difficulty: 'advanced',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: 'Triage order shows you have real incident experience.'
  },
  {
    q: 'What metric should a production borrow dashboard monitor to give earliest warning of approaching liquidation?',
    options: [
      'Health Factor distance from 1, with configurable alert thresholds (e.g. HF < 1.1 and HF < 1.05)',
      'Only total debt in USD',
      'Only collateral price absolute level',
      'Bundler3 gas price trends'
    ],
    correct: 0,
    explanation: 'HF proximity to 1 is the direct liquidation-risk signal. Multi-tier thresholds (warning + critical) give users time to act before the position becomes liquidatable.',
    category: 'poc-design',
    difficulty: 'intermediate',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: 'HF with tiered thresholds is the right product answer.'
  },

  // --- Public Allocator Deep Dive ---
  {
    q: 'Which actor is allowed to call reallocateTo on the Public Allocator?',
    options: [
      'Anyone, permissionlessly, as long as they pay the curator-set fee if one is configured',
      'Only the vault curator',
      'Only Bundler3 contracts',
      'Only Morpho governance'
    ],
    correct: 0,
    explanation: 'The Public Allocator is intentionally public: anyone can trigger reallocations as long as they pay the fee the curator configured.',
    category: 'poc-design',
    difficulty: 'advanced',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: '"Anyone with the fee" is the permissionless story.'
  },
  {
    q: 'What problem does a zero Public Allocator fee create that a non-zero fee mitigates?',
    options: [
      'A zero fee makes griefing reallocations economically free, allowing anyone to spam reallocations and destabilize allocation state',
      'A zero fee prevents any reallocations from happening',
      'A zero fee disables the oracle feed',
      'A zero fee unlocks instant adapter removals'
    ],
    correct: 0,
    explanation: 'The fee exists partly as an anti-spam mechanism. Zero fee means reallocations cost only gas, which is a low barrier for disruptive behavior.',
    category: 'poc-design',
    difficulty: 'advanced',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: 'Fee as anti-griefing is a subtle but strong operational point.'
  },

  // --- Final Review: Cross-cutting Topics ---
  {
    q: 'Why should a partner UI never use ERC4626 maxWithdraw as the sole basis for the withdraw button amount on a Vault V2?',
    options: [
      'Because Vault V2 may return conservative values from max helpers; the actual withdrawable amount depends on current liquidity adapter state and share redemption math',
      'Because ERC4626 maxWithdraw is always zero for Vault V2',
      'Because maxWithdraw returns shares, not assets',
      'Because only the curator is allowed to call maxWithdraw'
    ],
    correct: 0,
    explanation: 'Vault V2 takes a conservative stance on ERC4626 max helpers. A UI that uses maxWithdraw naively can show broken or zero withdraw amounts when liquidity is available.',
    category: 'vault-v2',
    difficulty: 'advanced',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'This is the classic V2 ERC4626 integration gotcha.'
  },
  {
    q: 'A partner asks whether they need to write custom liquidation logic to support their Morpho integration. Best answer?',
    options: [
      'No, Morpho\'s permissionless liquidation design means any external liquidator can close unhealthy positions; the integration only needs to display health and let users manage their own positions',
      'Yes, every partner must run a liquidation bot or Morpho will pause their integration',
      'Yes, because Morpho governance assigns liquidation rights only to approved partners',
      'No, because Morpho Blue automatically liquidates positions at the block level'
    ],
    correct: 0,
    explanation: 'Liquidation is permissionless. The partner\'s UX responsibility is risk display and user safety warnings, not operating liquidation bots.',
    category: 'partner-scenario',
    difficulty: 'intermediate',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'Separate protocol liquidation incentives from partner operational obligations.'
  },
  {
    q: 'What is the correct way to calculate a user\'s current borrow balance in an onchain-accurate dashboard?',
    options: [
      'Fetch borrow shares from the market, then multiply by the current borrow shares-to-assets conversion accounting for accrued interest since the last update',
      'Read a fixed borrow balance stored in a position mapping that never changes',
      'Multiply the deposit amount by the current supply APY and divide by 12',
      'Use only the Morpho API response without any onchain verification'
    ],
    correct: 0,
    explanation: 'Borrow balances grow continuously with accrued interest. The correct calculation uses current shares and the live shares-to-assets rate including interest since last accrual.',
    category: 'math',
    difficulty: 'advanced',
    module_slug: 'core-math-and-formulas',
    interviewTip: 'Interest accrual between refreshes is the critical nuance.'
  },
  {
    q: 'Why is it important to distinguish between the vault share price and the vault APY when showing vault performance to depositors?',
    options: [
      'Share price shows the current redemption rate per share, while APY expresses an annualized growth rate; conflating them hides loss events and makes vault comparison misleading',
      'They are different names for the same metric and can be used interchangeably',
      'Share price is an onchain metric while APY is only a legal disclosure number',
      'Only institutional depositors care about share price; retail users only need APY'
    ],
    correct: 0,
    explanation: 'A vault can show a positive APY trend while the share price reflects a recent loss event. Showing both gives depositors a complete picture.',
    category: 'vault-v2',
    difficulty: 'intermediate',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'Historical share price vs point-in-time APY: both belong in a good dashboard.'
  },

  // ============================================================
  // DEEP-DIVE ADDITIONS: Contract function signatures
  // ============================================================
  {
    q: 'What is the exact Solidity signature of the Morpho Blue supply() function?',
    options: [
      'supply(MarketParams memory marketParams, uint256 assets, uint256 shares, address onBehalf, bytes memory data) returns (uint256 assetsSupplied, uint256 sharesSupplied)',
      'supply(address token, uint256 amount, address recipient) returns (uint256)',
      'supply(bytes32 marketId, uint256 assets, address onBehalf) returns (bool)',
      'supply(MarketParams marketParams, uint256 assets) returns (uint256 shares)'
    ],
    correct: 0,
    explanation: 'The Blue supply function takes MarketParams, assets, shares (pass one, zero the other), onBehalf, and callback data. It returns the actual assets supplied and shares minted.',
    category: 'protocol-knowledge',
    difficulty: 'advanced',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'Know the dual assets/shares pattern: pass assets>0 and shares=0 for normal supply. Use shares for precision when minting exact share amounts.'
  },
  {
    q: 'What is the exact Solidity signature of the Morpho Blue liquidate() function?',
    options: [
      'liquidate(MarketParams memory marketParams, address borrower, uint256 seizedAssets, uint256 repaidShares, bytes memory data) returns (uint256 assetsSeized, uint256 assetsRepaid)',
      'liquidate(bytes32 marketId, address borrower, uint256 repayAmount) returns (bool)',
      'liquidate(address collateral, address debt, address borrower, uint256 amount)',
      'liquidate(MarketParams marketParams, address borrower, uint256 maxRepay) returns (uint256)'
    ],
    correct: 0,
    explanation: 'The liquidate function takes MarketParams, the borrower address, either seizedAssets or repaidShares (pass one, zero the other), and callback data. It returns actual seized assets and repaid assets.',
    category: 'liquidations',
    difficulty: 'advanced',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'Know that liquidators can specify either how much collateral to seize OR how much debt to repay — Morpho computes the other side from the LIF formula.'
  },
  {
    q: 'In Morpho Blue, what does passing assets=0 and shares>0 to repay() accomplish that assets>0 shares=0 does not?',
    options: [
      'It closes the exact borrow position to zero shares, avoiding dust from rounding when converting assets to shares for full repayment',
      'It borrows additional shares instead of repaying',
      'It prevents the repayment from triggering interest accrual',
      'It instructs the protocol to use the oracle price for repayment valuation'
    ],
    correct: 0,
    explanation: 'For a full position close, use shares equal to the user\'s borrowShares. Converting a desired asset amount to shares and back can leave 1 wei of dust due to rounding, keeping the position open. Using exact shares guarantees zero remaining debt.',
    category: 'protocol-knowledge',
    difficulty: 'advanced',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'Always use shares for full exits (repay and withdraw) to prevent dust positions. Use assets for partial operations where the user specifies an amount.'
  },
  {
    q: 'What is the exact encoding for a market ID in Morpho Blue?',
    options: [
      'keccak256(abi.encode(marketParams)) where marketParams is the MarketParams struct with all 5 fields',
      'sha256(loanToken ++ collateralToken ++ oracle ++ irm ++ lltv)',
      'keccak256(loanToken, collateralToken, lltv) — oracle and IRM are not part of the ID',
      'A sequential uint256 assigned by the contract on market creation'
    ],
    correct: 0,
    explanation: 'Market IDs are deterministic hashes of the full MarketParams struct. All 5 fields (loanToken, collateralToken, oracle, irm, lltv) are included. You can derive the ID offchain without querying the contract.',
    category: 'protocol-knowledge',
    difficulty: 'intermediate',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'Being able to compute a market ID offchain is useful for integration work — you can predict the ID before the market exists and use idToMarketParams() to verify.'
  },
  {
    q: 'What does the MarketParams struct field "irm" store, and what constraint does Morpho enforce on it?',
    options: [
      'The address of a governance-approved IRM contract; Morpho only allows market creation with IRMs that have been enabled via enableIrm()',
      'The address of any arbitrary interest rate model; there is no approval requirement',
      'A uint256 encoding of the target utilization rate for the market',
      'The address of the oracle that provides interest rate data'
    ],
    correct: 0,
    explanation: 'The irm field stores the IRM contract address. Morpho governance whitelists IRMs via enableIrm(). Markets can only be created with enabled IRMs — currently only AdaptiveCurveIRM (0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC on Ethereum) is approved.',
    category: 'protocol-knowledge',
    difficulty: 'intermediate',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'Permissionless market creation does not mean any IRM is allowed. The approved IRM set is governance-controlled. Know the distinction for partner conversations.'
  },

  // ============================================================
  // IRM Math: AdaptiveCurveIRM deep mechanics
  // ============================================================
  {
    q: 'What are the two distinct mechanisms in AdaptiveCurveIRM and what does each control?',
    options: [
      'The Curve Mechanism manages short-term utilization with instant rate response; the Adaptive Mechanism adjusts the rateAtTarget over time to track market equilibrium',
      'The Curve Mechanism sets LLTV and the Adaptive Mechanism sets the oracle price',
      'The Curve Mechanism handles supply-side rates and the Adaptive Mechanism handles borrow-side rates independently',
      'The Curve Mechanism is governance-controlled; the Adaptive Mechanism is permissionless'
    ],
    correct: 0,
    explanation: 'The Curve (or kink) mechanism provides instant rate response to utilization changes — analogous to a traditional kinked curve. The Adaptive mechanism slowly adjusts rateAtTarget over days to move the whole curve up or down based on whether utilization is above or below 90%.',
    category: 'math',
    difficulty: 'advanced',
    module_slug: 'core-math-and-formulas',
    interviewTip: 'Explain it as two timescales: instant kink response (seconds/blocks) + slow curve drift (days). This is why the IRM is "adaptive" not just "kinked".'
  },
  {
    q: 'At what speed does rateAtTarget double if utilization stays at 100% in AdaptiveCurveIRM?',
    options: [
      'Approximately 5 days — this is the maximum adaptation speed',
      'Approximately 1 hour — it doubles very quickly at full utilization',
      'Approximately 30 days — it adapts slowly to prevent rate volatility',
      'Instantaneously — the rate jumps to double whenever utilization exceeds 95%'
    ],
    correct: 0,
    explanation: 'The docs state: if utilization remains at 100%, rateAtTarget doubles after approximately 5 days. At 95% utilization it doubles in ~10 days. The further above target, the faster the adaptation.',
    category: 'math',
    difficulty: 'advanced',
    module_slug: 'core-math-and-formulas',
    interviewTip: 'If a partner asks "how fast do rates rise in a liquidity crunch?", the answer is: instantly via the curve, then additionally doubling over ~5 days via the adaptive mechanism at 100% utilization.'
  },
  {
    q: 'What is CURVE_STEEPNESS in AdaptiveCurveIRM and what does it control?',
    options: [
      'A WAD-scaled constant equal to 4 that controls the multiplier between minRate/target rate and target rate/maxRate on the two-slope curve',
      'The maximum allowed utilization before the market pauses',
      'The number of days before rateAtTarget adjusts to new market conditions',
      'A governance-adjustable parameter that sets the target utilization percentage'
    ],
    correct: 0,
    explanation: 'CURVE_STEEPNESS = 4 (WAD-scaled). This means minApy = apyAtTarget / 4 and maxApy = apyAtTarget * 4 approximately. At target utilization the curve is at apyAtTarget; the slopes are asymmetric — gentle below target, steep above.',
    category: 'math',
    difficulty: 'advanced',
    module_slug: 'core-math-and-formulas',
    interviewTip: 'If apyAtTarget is 4%, then minApy ≈ 1% and maxApy ≈ 16%. This explains the x4 rate jump at 100% utilization mentioned in the docs.'
  },
  {
    q: 'How is rateAtTarget retrieved for a specific market when building an IRM dashboard?',
    options: [
      'Read the rateAtTarget public mapping on the AdaptiveCurveIRM contract using the market ID as the key',
      'It is stored in the MarketParams struct and never changes',
      'Query it from the Morpho API as a static market configuration field',
      'Call market() on the Blue contract — it returns the current rate as part of the Market struct'
    ],
    correct: 0,
    explanation: 'AdaptiveCurveIRM stores a public mapping(Id => uint256) rateAtTarget. Call the IRM contract directly with the market ID. This is the per-second rate; convert to APY with expm1(rateAtTarget * secondsPerYear).',
    category: 'math',
    difficulty: 'advanced',
    module_slug: 'core-math-and-formulas',
    interviewTip: 'Converting per-second rate to APY: apyAtTarget = exp(rateAtTarget * 365 * 24 * 3600) - 1. Know that rateAtTarget = 1512768697 (approx) converts to ~4.9% APY.'
  },

  // ============================================================
  // Pre-liquidation extension
  // ============================================================
  {
    q: 'What is preLLTV in the Morpho pre-liquidation extension?',
    options: [
      'A user-configured LTV threshold below LLTV at which incremental pre-liquidation can begin, allowing partial position closure before full liquidation',
      'A protocol-wide parameter that replaces LLTV for all markets',
      'The LTV at which Morpho governance automatically freezes borrowing',
      'An alternative formula for LIF that applies to large positions only'
    ],
    correct: 0,
    explanation: 'preLLTV is an opt-in parameter set below the market LLTV. When a position\'s LTV enters the range [preLLTV, LLTV), the pre-liquidation contract allows a liquidator to close a fraction of the position (bounded by preLCF) at a smaller incentive, reducing the borrower\'s LTV back toward preLLTV.',
    category: 'liquidations',
    difficulty: 'advanced',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'Pre-liquidation is separate from the core protocol — it is an external opt-in contract. The core Blue liquidation (at LLTV) always applies; pre-liquidation adds a softer zone below it.'
  },
  {
    q: 'What is the Ethereum mainnet PreLiquidation Factory address?',
    options: [
      '0x6FF33615e792E35ed1026ea7cACCf42D9BF83476',
      '0x8cd16b62E170Ee0bA83D80e1F80E6085367e2aef',
      '0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb',
      '0x6566194141eefa99Af43Bb5Aa71460Ca2Dc90245'
    ],
    correct: 0,
    explanation: '0x6FF33615e792E35ed1026ea7cACCf42D9BF83476 is the Ethereum mainnet PreLiquidation Factory. Base uses 0x8cd16b62E170Ee0bA83D80e1F80E6085367e2aef.',
    category: 'liquidations',
    difficulty: 'advanced',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'Know the distinction: PreLiquidation Factory is a separate address from Blue. The core Blue contract handles standard liquidations; this factory deploys opt-in pre-liquidation contracts.'
  },
  {
    q: 'What is preLCF in the pre-liquidation framework and how does it relate to position LTV?',
    options: [
      'Pre-Liquidation Close Factor: the maximum fraction of debt that can be repaid in one pre-liquidation call; it is computed as a function of how far LTV is between preLLTV and LLTV',
      'A fixed 50% limit applied uniformly to all pre-liquidation events',
      'The minimum collateral amount required before a pre-liquidation can execute',
      'The governance-set fee percentage charged to liquidators in the pre-liquidation zone'
    ],
    correct: 0,
    explanation: 'preLCF scales between preLCF_1 (at preLLTV) and preLCF_2 (at LLTV). As LTV moves closer to LLTV, more of the position can be closed. At exactly preLLTV, preLCF is very low (making early pre-liquidation unprofitable). At LLTV, the full standard liquidation takes over.',
    category: 'liquidations',
    difficulty: 'advanced',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'The formula: preLCF = ((LLTV - LTV)/(LLTV - preLLTV)) * preLCF_1 + ((LTV - preLLTV)/(LLTV - preLLTV)) * preLCF_2. Low at preLLTV means liquidators only have profitable incentive as LTV rises toward LLTV.'
  },

  // ============================================================
  // Vault V2 Cap System deeper mechanics
  // ============================================================
  {
    q: 'If a MorphoMarketV1AdapterV2 has an absolute cap of 10M USDC, what does this mean exactly?',
    options: [
      'The total assets allocated through that adapter cannot exceed 10 million USDC in value, regardless of how many markets the adapter routes to',
      'Each individual market through the adapter can hold up to 10M USDC',
      'The performance fee collected by the curator is capped at 10M USDC annually',
      'The adapter can receive at most 10M USDC in new deposits per day'
    ],
    correct: 0,
    explanation: 'An absolute adapter cap limits total assets across the adapter as a whole — it is an aggregate ceiling on all markets routed through that adapter. The cap is denominated in loan token units.',
    category: 'vaults',
    difficulty: 'advanced',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'Explain the three-level hierarchy: adapter cap (total across adapter) > collateral cap (across collateral type) > market cap (per specific market). All three must be non-zero for allocation.'
  },
  {
    q: 'What is the purpose of the "collateralToken" abstract cap ID in Vault V2 and what does its encoding look like?',
    options: [
      'It limits total exposure to a specific collateral asset across all markets in the adapter; encoded as abi.encode("collateralToken", collateralTokenAddress)',
      'It stores the oracle address for the collateral token in a cap structure',
      'It tracks collateral liquidation history for the vault curator',
      'It is a per-user cap limiting how much of one collateral type any single depositor can provide'
    ],
    correct: 0,
    explanation: 'The collateral cap limits total vault exposure to one collateral type regardless of which specific markets use that collateral. E.g., a 20M wBTC collateral cap would apply across all markets where wBTC is collateral. Encoding: abi.encode("collateralToken", wBTCAddress).',
    category: 'vaults',
    difficulty: 'advanced',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'This is the most powerful of the three cap types. A single collateral cap at the adapter level prevents concentrated collateral risk across many market variants.'
  },
  {
    q: 'What is the market cap ID encoding in MorphoMarketV1AdapterV2 and what does it constrain?',
    options: [
      'abi.encode("this/marketParams", adapterAddress, marketParams) — it constrains the allocation to one specific market defined by the full MarketParams struct',
      'abi.encode("marketId", marketId) — it constrains the market ID hash',
      'abi.encode("market", loanToken, collateralToken) — it constrains asset pair exposure',
      'abi.encode("cap", lltv, irm) — it constrains risk parameter combinations'
    ],
    correct: 0,
    explanation: 'The market cap ID encodes the adapter address and the full MarketParams struct. This limits allocation to one exact market (same oracle, IRM, and LLTV). Two markets with the same collateral/loan pair but different LLTVs have different market cap IDs.',
    category: 'vaults',
    difficulty: 'advanced',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'This encoding subtlety matters: if a curator creates a 77% LLTV and 86% LLTV market for the same pair, they need separate market caps. Same collateral pair ≠ same market cap ID.'
  },
  {
    q: 'What does "relative cap" with value 1e18 represent in Vault V2?',
    options: [
      '100% of total vault assets — the allocation can consume the entire vault if needed',
      '100% of the adapter\'s absolute cap',
      '1 unit of the loan token (1 USDC if 6-decimal)',
      'The maximum LLTV allowed for markets in that adapter'
    ],
    correct: 0,
    explanation: 'Relative caps use WAD scaling (1e18 = 100%). A relative cap of 5e17 (0.5 * 1e18) means the adapter, collateral type, or market can hold at most 50% of total vault assets. Both absolute and relative caps are enforced; the tighter one takes effect.',
    category: 'vaults',
    difficulty: 'intermediate',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'A common interview mistake is confusing WAD (1e18=1.0) with 1e36. In Vault V2 relative caps, 1e18 = 100%, so 1e17 = 10%, etc.'
  },

  // ============================================================
  // Bundler3 adapter patterns
  // ============================================================
  {
    q: 'What is the purpose of the "initiator" context in Bundler3 and why does it prevent an attack vector?',
    options: [
      'Bundler3 stores the original msg.sender in transient storage as "initiator"; adapters check this to ensure only the original caller can trigger asset movements, preventing any contract from calling adapters on behalf of arbitrary users',
      'The initiator is a fee recipient address specified by the curator for each bundle execution',
      'The initiator is a hash of all calls in the bundle used to verify bundle integrity after execution',
      'The initiator is a Morpho-controlled multisig that approves high-value bundle transactions'
    ],
    correct: 0,
    explanation: 'Without initiator tracking, any contract could call a Bundler3 adapter and move another user\'s pre-approved assets. The initiator check ensures the person whose assets are being moved is the same person who triggered the bundle — closing the re-entrancy-as-theft attack vector.',
    category: 'integration',
    difficulty: 'advanced',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'This is the key security design point of Bundler3. Mention transient storage (EIP-1153) as the mechanism if you want to sound very senior.'
  },
  {
    q: 'What is the EthereumGeneralAdapter1 and when would you use it instead of GeneralAdapter1?',
    options: [
      'It is an Ethereum-specific Bundler3 adapter (0x4A6c312ec70E8747a587EE860a0353cd42Be0aE0) that adds support for native ETH wrapping, stETH interactions, and other Ethereum-specific DeFi paths not available in the base GeneralAdapter1',
      'It is a Layer 2-optimized version of GeneralAdapter1 deployed on Ethereum for lower gas costs',
      'It replaces GeneralAdapter1 on Ethereum; GeneralAdapter1 is only for non-Ethereum chains',
      'It is a legacy adapter that should not be used in new integrations'
    ],
    correct: 0,
    explanation: 'EthereumGeneralAdapter1 extends the base GeneralAdapter1 with Ethereum-specific operations: wrapping ETH to WETH, converting stETH to wstETH, etc. Use it when the collateral involves native ETH or LST tokens like stETH/wstETH.',
    category: 'integration',
    difficulty: 'advanced',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'For a wstETH/USDC market on Ethereum, you would use EthereumGeneralAdapter1 in the bundle to handle the stETH→wstETH conversion step atomically with the collateral supply.'
  },
  {
    q: 'What Bundler3 adapter enables swap-based leverage loops on Morpho markets?',
    options: [
      'ParaswapAdapter — it allows swaps via Paraswap DEX aggregator inside a Bundler3 bundle, enabling borrow → swap → resupply loops in one atomic transaction',
      'LeverageAdapter — a dedicated adapter specifically for leveraged positions',
      'SwapAdapter — a Morpho-built DEX routing adapter',
      'GeneralAdapter1 — all swaps are handled internally without a dedicated adapter'
    ],
    correct: 0,
    explanation: 'ParaswapAdapter (0x03b5259Bd204BfD4A616E5B79b0B786d90c6C38f on Ethereum) routes swaps through Paraswap inside a bundle. It enables one-click leverage: supply collateral, borrow loan token, swap back to collateral via Paraswap, resupply — all atomic.',
    category: 'integration',
    difficulty: 'advanced',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'Know the Ethereum and Base addresses: Ethereum ParaswapAdapter = 0x03b5259... Base = 0x6abE8ABd... These are commonly asked in integration deep-dives.'
  },
  {
    q: 'What does skipRevert=true in a Bundler3 Call struct do and when should it be used?',
    options: [
      'It allows that specific call to fail without reverting the entire bundle — useful for optional steps like reward claims where failure should not block the main workflow',
      'It skips the initiator check for that call, allowing permissionless execution',
      'It bypasses callbackHash verification for that call, allowing dynamic callbacks',
      'It instructs the bundle to retry the call up to 3 times before reverting'
    ],
    correct: 0,
    explanation: 'skipRevert=true means: if this individual call reverts, the bundle continues instead of reverting entirely. Only use for genuinely optional steps. Never use it for critical steps like supply, borrow, or repay where failure would leave a dangerous half-state.',
    category: 'integration',
    difficulty: 'advanced',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'A good use case: include a Merkl reward claim with skipRevert=true before a supply. If there are no rewards to claim, the bundle still completes the supply. A bad use case: skipRevert=true on a swap step in a leverage loop would silently skip the swap and leave the user with unintended positions.'
  },

  // ============================================================
  // GraphQL query structure
  // ============================================================
  {
    q: 'In the Morpho GraphQL API, what is the difference between state.apy and state.netApy on a vault?',
    options: [
      'state.apy is native lending yield only; state.netApy is native APY plus all reward APRs minus the curator performance fee',
      'state.apy is the 24-hour average; state.netApy is the 7-day average',
      'state.apy includes rewards but not fees; state.netApy includes fees but not rewards',
      'They are the same field with different names for backward compatibility'
    ],
    correct: 0,
    explanation: 'apy = native vault yield from lending only. netApy = native APY + underlying token yield (e.g., stETH rebasing) + all reward token APRs - performance fee on native APY. netApy is what depositors actually earn net of costs.',
    category: 'integration',
    difficulty: 'intermediate',
    module_slug: 'real-world-integrations-and-merkl',
    interviewTip: 'For a partner yield dashboard, always show netApy as the headline and decompose it into base + rewards - fee for transparency. Using apy alone overstates yield for vaults with high performance fees.'
  },
  {
    q: 'Which GraphQL field provides the allocation breakdown showing how much of a vault is in each underlying market?',
    options: [
      'state.allocation[] — an array of {market, supplyAssets, supplyAssetsUsd} showing per-market allocation',
      'state.positions[] — a user-scoped array of positions per market',
      'state.markets — a flat list of market addresses without amounts',
      'state.withdrawQueue — the markets in priority order for withdrawals'
    ],
    correct: 0,
    explanation: 'state.allocation is the correct field. It returns an array where each entry contains the market object (with uniqueKey, lltv, collateral/loan assets) and the supplyAssets/supplyAssetsUsd currently allocated to that market. This is the primary field for showing vault allocation composition.',
    category: 'integration',
    difficulty: 'intermediate',
    module_slug: 'real-world-integrations-and-merkl',
    interviewTip: 'For a vault transparency dashboard, query state.allocation and display it as a pie chart. Each slice is one market allocation. This answers "what risk am I actually exposed to?" for depositors.'
  },
  {
    q: 'How do you query shared liquidity available to a specific market through the Public Allocator via GraphQL?',
    options: [
      'Query publicAllocatorSharedLiquidity on the market object — it returns all vaults that have flow caps allowing reallocation to this market',
      'Query publicAllocator.flowCaps with the market address as a filter',
      'Query vaults() and filter by having the market in their withdrawQueue',
      'Use the REST API endpoint /v1/liquidity/{marketId} — GraphQL does not support Public Allocator data'
    ],
    correct: 0,
    explanation: 'The publicAllocatorSharedLiquidity field on a market returns a list of all source markets across all vaults that can reallocate liquidity to the target market via the Public Allocator, respecting configured flow caps. The sum of assets fields = total reallocatable liquidity.',
    category: 'integration',
    difficulty: 'advanced',
    module_slug: 'real-world-integrations-and-merkl',
    interviewTip: 'This query is essential for a borrow UX that shows total available liquidity including PA-reallocatable amounts. The pattern: query market.state.liquidity for direct + market.publicAllocatorSharedLiquidity for reallocatable.'
  },
  {
    q: 'What GraphQL query pattern efficiently retrieves a user\'s borrow positions across all Morpho markets?',
    options: [
      'userByAddress(address: $addr, chainId: $chain) { marketPositions { borrowAssets collateralAssets market { uniqueKey lltv } } }',
      'markets(where: { borrower: $addr }) { items { borrowShares } }',
      'positions(filter: { user: $addr }) { items { marketId debtAmount } }',
      'userPositions(walletAddress: $addr) { borrows { amount market } }'
    ],
    correct: 0,
    explanation: 'The correct pattern is userByAddress → marketPositions. Each marketPosition entry contains the user\'s borrowAssets, supplyAssets, collateralAssets, and the market object. This is the primary discovery route for user borrow health dashboards.',
    category: 'integration',
    difficulty: 'intermediate',
    module_slug: 'real-world-integrations-and-merkl',
    interviewTip: 'Note: for accurate real-time HF, use GraphQL for discovery but fetch live borrow shares and current oracle price onchain. The API may lag by seconds to minutes.'
  },

  // ============================================================
  // Share vs asset accounting edge cases
  // ============================================================
  {
    q: 'Why does Morpho use share-based accounting for supply and borrow positions instead of tracking raw asset balances?',
    options: [
      'Because interest accrues continuously, inflating the total assets. Shares represent a proportional claim, so as interest accrues the share value increases without needing to update every individual position',
      'Because shares allow the protocol to charge fees without explicit fee transactions',
      'Because token decimals vary and shares normalize all positions to 18 decimals',
      'Because shares reduce gas costs by eliminating per-position storage updates'
    ],
    correct: 0,
    explanation: 'Interest accrual updates totalBorrowAssets and totalSupplyAssets atomically. Since positions are tracked as shares (a fraction of the total), each position automatically accrues interest without individual storage writes — just the totals change.',
    category: 'math',
    difficulty: 'advanced',
    module_slug: 'core-math-and-formulas',
    interviewTip: 'This is the core accounting insight. Draw the parallel to ERC4626 vault shares. The exchange rate between shares and assets grows over time as interest accrues.'
  },
  {
    q: 'What is the virtualShares offset in Morpho\'s share math and why does it exist?',
    options: [
      'virtualShares (= 1e6) is a constant added to both supply shares and assets in conversion math to prevent the exchange rate from being manipulated via tiny initial deposits that would inflate the share price',
      'virtualShares represents pre-minted shares given to the protocol treasury at market creation',
      'virtualShares is the minimum balance required before a market becomes active',
      'virtualShares is a WAD-scaled constant ensuring total shares never drop below 1'
    ],
    correct: 0,
    explanation: 'The virtual offset prevents the share price inflation attack: without it, an attacker could donate 1 wei to an empty market to make each share worth a huge amount of assets, breaking the accounting for subsequent depositors. The offset makes the initial share price stable.',
    category: 'math',
    difficulty: 'advanced',
    module_slug: 'core-math-and-formulas',
    interviewTip: 'The conversion formula is: assets = shares * (totalAssets + 1) / (totalShares + virtualShares). The +1 in numerator and +virtualShares in denominator together prevent both division-by-zero and the inflation attack.'
  },
  {
    q: 'When converting borrow shares to assets for display, which rounding direction should you use and why?',
    options: [
      'Round up (ceiling) — because the borrower owes at least this much; rounding down would show less debt than exists and could lead to underpayment on full repayment',
      'Round down — to be conservative and show the best case for the borrower',
      'Round to nearest — to minimize display error for both borrowers and lenders',
      'Always use exact division — Morpho guarantees borrow shares are always exactly divisible into assets'
    ],
    correct: 0,
    explanation: 'For debt (borrow position), round up when converting shares to assets. This ensures the user sees they owe at least the correct amount. For supply positions, round down — conservative for the protocol\'s side. This asymmetry matches how the contract itself rounds.',
    category: 'math',
    difficulty: 'advanced',
    module_slug: 'core-math-and-formulas',
    interviewTip: 'The rule of thumb: round against the party who could benefit from favorable rounding. For debt: round up (protocol-favorable). For supply: round down (also protocol-favorable). The helper names in the SDK are toAssetsUp() and toAssetsDown().'
  },

  // ============================================================
  // Public Allocator flow
  // ============================================================
  {
    q: 'What are flow caps in the Public Allocator and what do they constrain?',
    options: [
      'Per-market maximum reallocation amounts set by the vault curator; they bound how much can flow out of a source market and into a destination market via reallocateTo()',
      'Global rate limits on the number of reallocateTo() calls per block',
      'Hard caps on total vault TVL growth set by Morpho governance',
      'Minimum liquidity requirements that markets must maintain before reallocations are allowed'
    ],
    correct: 0,
    explanation: 'Flow caps are curator-configured per-market limits on the Public Allocator. Each market has a maxIn (max that can flow in) and maxOut (max that can flow out) per reallocation period. This prevents excessive liquidity fragmentation from a single PA call.',
    category: 'protocol-knowledge',
    difficulty: 'advanced',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: 'Flow caps are per-epoch (typically reset each reallocation). Query them via state.publicAllocatorConfig.flowCaps in GraphQL. When you see 0 flow cap, that market cannot be a source for PA reallocation.'
  },
  {
    q: 'Who pays the fee for a Public Allocator reallocateTo() call and where does that fee go?',
    options: [
      'The caller (borrower or integration) pays the fee in native ETH; it goes to the vault to compensate for reallocation-induced gas costs and potential imbalance',
      'The fee is deducted from the borrower\'s collateral automatically',
      'Morpho governance collects the fee to fund protocol development',
      'There is no fee; Public Allocator is always free to call'
    ],
    correct: 0,
    explanation: 'The caller must send ETH equal to the fee configured by the curator (via setFee on the PublicAllocator contract). The fee prevents griefing (costless spam reallocations) and compensates the vault for any operational imbalance caused by the reallocation.',
    category: 'protocol-knowledge',
    difficulty: 'advanced',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: 'When integrating PA into a borrow flow, always check the fee amount first (call publicAllocator.fee(vault)) and include it as msg.value. A transaction that does not send the fee will revert.'
  },

  // ============================================================
  // Oracle deep dive
  // ============================================================
  {
    q: 'What is the WstEthStEthExchangeRateChainlinkAdapter and when is it needed?',
    options: [
      'A Chainlink-interface-compatible adapter that returns the wstETH/stETH exchange rate, required when building a wstETH collateral oracle that needs to account for stETH rebasing before routing through a stETH/ETH or stETH/USD Chainlink feed',
      'A Bundler3 adapter for handling wstETH deposits',
      'A Vault V2 adapter for markets using stETH as collateral',
      'A Chainlink price feed for the MORPHO governance token'
    ],
    correct: 0,
    explanation: 'wstETH is a non-rebasing wrapper for stETH. Its USD or ETH value requires two steps: wstETH→stETH exchange rate (from Lido) + stETH→ETH price (from Chainlink). The WstEthStEthExchangeRateChainlinkAdapter provides the first step in a Chainlink-compatible interface so MorphoChainlinkOracleV2 can compose both hops.',
    category: 'protocol-knowledge',
    difficulty: 'advanced',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'This is a real example of the vault-conversion oracle path. Whenever collateral is a yield-bearing token (wstETH, cbETH, sDAI, etc.) the oracle needs this extra exchange-rate hop. Forgetting it causes systematic HF miscalculation.'
  },
  {
    q: 'If a Morpho oracle returns price = 3000 * 1e36 / 1e12, what does this represent for an ETH/USDC market?',
    options: [
      '1 wei of ETH (1e-18 ETH) is worth 3000 * 1e6 / 1e12 = 3000/1e6 USDC base units — normalizing back, 1 full ETH = 3000 USDC, as expected from the 1e36 scaling with different token decimals',
      '1 USDC equals 3000 ETH at the current oracle price',
      'The market\'s total collateral value is 3000 USDC per market share',
      'The oracle price is invalid because ETH/USDC should be expressed in USD'
    ],
    correct: 0,
    explanation: 'Oracle price = collateral value in loan token units per collateral base unit, scaled by 1e36. For ETH (18 dec) / USDC (6 dec): price = ETH_price_USD * 10^6 * 1e36 / 10^18 = 3000 * 1e36 / 1e12. The 1e36 scaling is specifically chosen to maintain precision across any decimal combination.',
    category: 'math',
    difficulty: 'advanced',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'The general formula for oracle price scaling: price = (loan_token_amount / collateral_token_amount) * 10^(36 + collateral_decimals - loan_decimals). Understanding this lets you debug any "wrong decimal" oracle bug.'
  },

  // ============================================================
  // Real contract addresses
  // ============================================================
  {
    q: 'What is the Ethereum mainnet AdaptiveCurveIRM address?',
    options: [
      '0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC',
      '0x46415998764C29aB2a25CbeA6254146D50D22687',
      '0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb',
      '0xfd32fA2ca22c76dD6E550706Ad913FC6CE91c75D'
    ],
    correct: 0,
    explanation: '0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC is the Ethereum mainnet AdaptiveCurveIRM. Base uses 0x46415998764C29aB2a25CbeA6254146D50D22687. These are the only governance-approved IRMs for Morpho market creation.',
    category: 'protocol-knowledge',
    difficulty: 'advanced',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'If a partner asks "what IRM should we use for our market?" the answer is AdaptiveCurveIRM — it is currently the only approved IRM. Quote the address for the relevant chain.'
  },
  {
    q: 'What is the Ethereum mainnet Public Allocator address?',
    options: [
      '0xfd32fA2ca22c76dD6E550706Ad913FC6CE91c75D',
      '0xA090dD1a701408Df1d4d0B85b716c87565f90467',
      '0x6566194141eefa99Af43Bb5Aa71460Ca2Dc90245',
      '0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC'
    ],
    correct: 0,
    explanation: '0xfd32fA2ca22c76dD6E550706Ad913FC6CE91c75D is the Ethereum Public Allocator. Base uses 0xA090dD1a701408Df1d4d0B85b716c87565f90467. To use it, the vault curator must first assign it the allocator role via setIsAllocator().',
    category: 'protocol-knowledge',
    difficulty: 'advanced',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: 'Know that the Public Allocator must be granted allocator role by the vault before reallocateTo() can work. This is a common setup mistake when integrating PA for the first time.'
  },
  {
    q: 'What is the Ethereum mainnet Morpho ChainlinkOracleV2 Factory address?',
    options: [
      '0x3A7bB36Ee3f3eE32A60e9f2b33c1e5f2E83ad766',
      '0x2DC205F24BCb6B311E5cdf0745B0741648Aebd3d',
      '0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb',
      '0xA1D94F746dEfa1928926b84fB2596c06926C0405'
    ],
    correct: 0,
    explanation: '0x3A7bB36Ee3f3eE32A60e9f2b33c1e5f2E83ad766 is the Ethereum Morpho ChainlinkOracleV2 Factory. Base uses 0x2DC205F24BCb6B311E5cdf0745B0741648Aebd3d. Use this factory to deploy a properly configured oracle for a new market.',
    category: 'protocol-knowledge',
    difficulty: 'advanced',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'When helping a partner create a new market, the oracle factory is their starting point. Walk them through: choose feed path (direct/inverse/two-hop), deploy via factory, verify the returned price, then use the oracle address in createMarket().'
  },

  // ============================================================
  // Advanced integration scenarios
  // ============================================================
  {
    q: 'A partner builds a position that auto-repays when HF drops below 1.05. What is the safest execution path?',
    options: [
      'Monitor HF via onchain oracle reads (not API cache), compute exact repayShares to restore HF above 1.1, and execute repay() in a Bundler3 bundle with a pre-signed permit to avoid a prior approve transaction',
      'Monitor HF from the GraphQL API and call repay() with assets equal to 50% of the displayed borrow balance',
      'Set up a governance-approved bot that can modify LLTV in the market to prevent liquidation',
      'Call the Public Allocator to move collateral between markets as the automatic repayment mechanism'
    ],
    correct: 0,
    explanation: 'Auto-repayment bots should use live onchain oracle data (not cached API) for HF monitoring since API lag of even 30 seconds at a critical threshold matters. Bundler3 + permit reduces to one transaction. Computing repayShares (not assets) ensures exact position closure without dust.',
    category: 'integration',
    difficulty: 'advanced',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'This is a real integration pattern for risk management products. Key points: onchain oracle for monitoring, shares for precision, Bundler3 for atomicity, and target HF 1.1+ (not 1.0+) to buffer against continued price movement.'
  },
  {
    q: 'A partner wants to show "total borrowable" for a market including PA-reallocatable liquidity. How do you compute this?',
    options: [
      'totalBorrowable = market.state.liquidityAssets + sum(publicAllocatorSharedLiquidity[].assets) for that market',
      'totalBorrowable = market.totalSupplyAssets - market.totalBorrowAssets (always)',
      'totalBorrowable = vault.state.totalAssets for any vault that has this market in its allocation',
      'totalBorrowable = market.state.supplyApy * market.state.totalAssets / 100'
    ],
    correct: 0,
    explanation: 'Direct available liquidity = liquidityAssets (idle in the market). PA-reallocatable = sum of assets from all source markets with flow caps pointing here. Total borrowable = their sum. This is the correct formula for showing users realistic borrow availability beyond what is already in the market.',
    category: 'integration',
    difficulty: 'advanced',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: 'This multi-source liquidity calculation is the "killer feature" of Morpho\'s fragmented market + PA architecture. Most competitors cannot show this because all liquidity is in one pool already.'
  },
  {
    q: 'What is the collateralNotional warning when Morpho docs say "Supplying a very high amount (~1e35) can cause overflow"?',
    options: [
      'Morpho uses uint256 math; at ~1e35 assets, the computation of toSharesUp or toSharesDown can overflow because it multiplies assets by virtual offsets. Partners should enforce practical deposit caps well below this threshold.',
      'The warning only applies to governance-managed markets; permissionless markets have different overflow behavior',
      'This overflow only occurs during liquidation, not during normal supply operations',
      'The 1e35 limit is a marketing constraint, not a technical one — real overflow requires 2^256 assets'
    ],
    correct: 0,
    explanation: 'The share math multiplies assets by the current share price. For very large asset amounts, this multiplication can overflow uint256. The docs explicitly list this as a liveness risk. Real protocols should implement max deposit bounds far below 1e35.',
    category: 'protocol-knowledge',
    difficulty: 'advanced',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'Know the four liveness risks: (1) token reverts, (2) large deposit overflow at ~1e35, (3) IRM reverts on borrowRate(), (4) oracle reverts on price(). These are the conditions under which a market can become temporarily non-functional.'
  },
  {
    q: 'When a Vault V2 curator removes an adapter that still has funds allocated, what risk does the docs warn about?',
    options: [
      'The adapter removal can realize a loss if the adapter\'s current realAssets() is less than the previously tracked amount, because the vault writes off the difference as bad debt during removal',
      'The adapter removal fails silently and funds remain stuck forever',
      'The adapter removal triggers an automatic liquidation of all positions in underlying markets',
      'The curator is penalized with a fee equal to 10% of the removed adapter\'s assets'
    ],
    correct: 0,
    explanation: 'The docs warn: always deallocate first. If you remove an adapter with remaining allocated assets, the vault writes off the difference between tracked assets and current realAssets() as a loss. This loss is socialized via share price depreciation. Deallocate to zero before removeAdapter.',
    category: 'vaults',
    difficulty: 'advanced',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'Correct operational procedure: (1) zero the cap to stop new allocations, (2) deallocate all funds from the adapter, (3) wait for removeAdapter timelock (7 days), (4) execute removal. Skipping step 2 causes an immediate realized loss.'
  },

  // ── Fixed-Rate Lending & Morpho V2 ──────────────────────────────────────

  {
    q: 'What is a zero coupon bond, and how does it apply to Morpho V2 fixed-rate lending?',
    options: [
      'A debt instrument issued at a discount to face value with no periodic interest — the borrower receives less than face value, repays the full face value at maturity, and the discount IS the interest',
      'A bond that pays zero interest because the lender earns yield through token incentives instead',
      'A variable-rate loan where the coupon resets to zero at each utilization checkpoint',
      'A loan where the borrower pays interest upfront at origination and receives the principal free and clear'
    ],
    correct: 0,
    explanation: 'Zero coupon means no periodic interest payments. The discount at issuance encodes the full interest cost. Lender deposits X, receives Y > X at maturity. The difference Y - X is the interest, expressed as a discount at origination.',
    category: 'protocol-knowledge',
    difficulty: 'fundamental',
    module_slug: 'fixed-rate-lending-v2',
    interviewTip: 'Lead with: "The discount IS the interest." That phrasing shows you understand the structure, not just the name.'
  },
  {
    q: 'Florian de Miramon named five fixed-rate lending concepts as critical for the role. Which set is correct?',
    options: [
      'Obligations, zero coupon, payoff, maturity, tenor',
      'Utilization, IRM, LLTV, health factor, liquidation incentive',
      'Curator, allocator, sentinel, guardian, owner',
      'APY, APR, TVL, liquidity depth, slippage'
    ],
    correct: 0,
    explanation: 'These five concepts — obligations, zero coupon, payoff, maturity, tenor — were named explicitly by Florian as requirements for the role. They map to TradFi fixed-income primitives now applied to DeFi.',
    category: 'final-review',
    difficulty: 'fundamental',
    module_slug: 'fixed-rate-lending-v2',
    interviewTip: 'Memorize these five as a set. If asked to define them, start with zero coupon since it underpins the others.'
  },
  {
    q: 'What is tenor in the context of fixed-rate lending?',
    options: [
      'The length of time from loan origination to maturity — e.g., a 90-day tenor means repayment is due 90 days after origination',
      'The total interest rate charged over the life of the loan',
      'The difference between the face value and the discount price at issuance',
      'The collateral ratio required to initiate a fixed-rate loan'
    ],
    correct: 0,
    explanation: 'Tenor = time until maturity. Common tenors: 7, 30, 90, 180 days. Tenor selection should match the partner\'s treasury planning cycle and cash flow needs.',
    category: 'protocol-knowledge',
    difficulty: 'fundamental',
    module_slug: 'fixed-rate-lending-v2',
    interviewTip: 'When a partner says "we want fixed-rate lending," your first question should be: "What tenor fits your business model?" This shows you understand the product dimension, not just the protocol.'
  },
  {
    q: 'How does maturity in Morpho V2 differ from loan management in Morpho Blue?',
    options: [
      'Morpho Blue loans are open-ended — borrowers hold positions as long as HF > 1. Morpho V2 loans have a fixed maturity date when repayment must occur.',
      'Both protocols use fixed maturity dates, but Morpho V2 maturities are longer',
      'Morpho Blue loans expire after 30 days by default unless renewed',
      'Maturity works the same way in both — it refers to the oracle price feed maturity'
    ],
    correct: 0,
    explanation: 'Morpho Blue is open-ended: a borrower can hold a position indefinitely as long as health factor stays above 1. Morpho V2 has a fixed maturity date — the borrower must repay at or before that date.',
    category: 'protocol-knowledge',
    difficulty: 'intermediate',
    module_slug: 'fixed-rate-lending-v2',
    interviewTip: 'The clean framing: "Blue is perpetual, V2 is term-based." Then explain the business implication: V2 maps to institutional treasury planning cycles.'
  },
  {
    q: 'What is the payoff in a zero coupon fixed-rate loan?',
    options: [
      'The total amount returned to the lender at maturity — equal to the face value of the loan, which is always greater than what the lender deposited',
      'The periodic interest payments made by the borrower during the loan term',
      'The liquidation bonus paid to liquidators when a borrower defaults',
      'The protocol fee deducted from lender yield at settlement'
    ],
    correct: 0,
    explanation: 'Payoff = face value received by the lender at maturity. In zero coupon: lender deposits less than face value, receives full face value at maturity. Payoff is fully known at origination — no rate uncertainty.',
    category: 'math',
    difficulty: 'fundamental',
    module_slug: 'fixed-rate-lending-v2',
    interviewTip: 'Distinguish payoff (total lender receipt at maturity) from interest (the difference between payoff and deposit). Conflating them is a common interview slip.'
  },
  {
    q: 'What is an obligation in DeFi fixed-rate lending, and how does it differ from a TradFi obligation?',
    options: [
      'In DeFi, an obligation is a smart-contract-enforced commitment to repay — enforcement is automatic via collateral. In TradFi, it is a legal contract enforced by courts.',
      'Obligations work identically in TradFi and DeFi — both require court enforcement for default scenarios',
      'In DeFi, obligations are voluntary commitments with no enforcement mechanism beyond social reputation',
      'TradFi obligations use overcollateralization; DeFi obligations are unsecured by design'
    ],
    correct: 0,
    explanation: 'TradFi obligation = legal document + courts. DeFi obligation = smart contract + collateral. DeFi removes counterparty execution risk (no need for courts to enforce) but does not remove default risk (collateral may not fully cover the debt).',
    category: 'protocol-knowledge',
    difficulty: 'intermediate',
    module_slug: 'fixed-rate-lending-v2',
    interviewTip: 'A clean bridge for institutional partners: "We replace legal enforcement with collateral enforcement. The obligation is just as real — the mechanism is different."'
  },
  {
    q: 'How does interest rate discovery work in Morpho V2, compared to Morpho Blue?',
    options: [
      'In Blue, rates are set algorithmically by a utilization-based IRM curve. In V2, rates emerge from intent matching — lenders and borrowers express their desired terms and the system finds the overlap.',
      'Both use a utilization curve, but V2 updates the rate at fixed daily intervals instead of continuously',
      'V2 uses an on-chain order book where limit orders set rates. Blue uses intent matching.',
      'V2 rates are set by governance vote. Blue rates are set by the curator.'
    ],
    correct: 0,
    explanation: 'Morpho Blue IRM: utilization → rate algorithmically. Morpho V2: lender expresses minimum acceptable rate, borrower expresses maximum acceptable rate, system matches at a rate in the overlap. If no overlap exists, the intent stays unmatched.',
    category: 'protocol-knowledge',
    difficulty: 'intermediate',
    module_slug: 'fixed-rate-lending-v2',
    interviewTip: 'The interview-safe definition of intent-based: "Both sides express what they want, the system finds the valid overlap without a centralized matching engine." This distinguishes it from an AMM and from an order book.'
  },
  {
    q: 'A lender expresses an intent on Morpho V2 but no matching borrower intent exists. What happens?',
    options: [
      'The lender\'s capital sits unmatched and undeployed — this is a valid, expected state in V2, not a bug',
      'The protocol automatically matches the lender to the closest available rate in the opposite direction',
      'The lender is automatically allocated to a Morpho Blue variable-rate market as a fallback',
      'The intent is rejected and the lender must resubmit with more attractive terms'
    ],
    correct: 0,
    explanation: 'Unfilled intent is an explicit design state in V2. Unlike Morpho Blue where supplied capital always earns at current utilization, V2 capital may sit undeployed if no matching borrower exists. Partners must design UX that surfaces this state clearly.',
    category: 'protocol-knowledge',
    difficulty: 'intermediate',
    module_slug: 'fixed-rate-lending-v2',
    interviewTip: 'This is a common misconception. Do not imply V2 always deploys capital. The unmatched state is real and partners need to understand it for product design.'
  },
  {
    q: 'Which of these best describes the key difference between variable-rate and fixed-rate lending from an institutional lender\'s perspective?',
    options: [
      'Fixed-rate gives a known payoff at origination — no rate drift, no surprise resets — which is required for treasury planning and regulatory reporting',
      'Fixed-rate is always higher APY than variable-rate for the same tenor and collateral',
      'Variable-rate is always safer because the protocol adjusts rates to market conditions automatically',
      'Fixed-rate requires more collateral than variable-rate for the same loan amount'
    ],
    correct: 0,
    explanation: 'For institutions, predictability is the core value. Treasury teams, risk teams, and compliance teams all require known yields for planning and reporting. Variable-rate uncertainty makes this difficult. Fixed-rate removes rate risk entirely (though maturity/default risk remains).',
    category: 'partner-scenario',
    difficulty: 'intermediate',
    module_slug: 'fixed-rate-lending-v2',
    interviewTip: 'When pitching fixed-rate to an institutional partner, lead with "treasury planning and regulatory reporting" — not yield. Those are the institutional priorities.'
  },
  {
    q: 'What happens at maturity in a Morpho V2 fixed-rate loan if the borrower fails to repay?',
    options: [
      'The protocol uses the borrower\'s posted collateral to settle the lender — actual recovery depends on collateral value at settlement time',
      'The loan automatically rolls over to a new 90-day term at the current market rate',
      'The borrower\'s position is converted to a Morpho Blue variable-rate position',
      'Morpho guarantees full repayment from a protocol insurance fund regardless of collateral value'
    ],
    correct: 0,
    explanation: 'In DeFi fixed-rate: no repayment → collateral is used for settlement. Recovery is not guaranteed to equal the full face value — it depends on collateral value at settlement. Morpho does not maintain an insurance fund that backstops lenders in default.',
    category: 'protocol-knowledge',
    difficulty: 'advanced',
    module_slug: 'fixed-rate-lending-v2',
    interviewTip: 'Be honest about default risk: "The collateral covers the lender in normal scenarios. Tail scenarios where collateral value drops below face value are the residual risk — this is why collateral selection and LLTV matter at origination."'
  },
  {
    q: 'A partner asks: "Should we build on Morpho Blue or Morpho V2?" What is the most important first question to ask?',
    options: [
      'Do your users need predictable, fixed-term yields or flexible open-ended borrowing?',
      'Which has lower protocol fees?',
      'Which has more total value locked?',
      'Which has more documentation?'
    ],
    correct: 0,
    explanation: 'Blue is open-ended, variable-rate — good for flexible DeFi-native borrowers. V2 is fixed-term, fixed-rate — good for institutional users needing predictable yields. The user need drives the architecture choice, not TVL or fees.',
    category: 'partner-scenario',
    difficulty: 'intermediate',
    module_slug: 'fixed-rate-lending-v2',
    interviewTip: 'Frame the choice around user need: "What does your user actually need — open-ended flexibility or predictable term-based yield?" Then map the answer to the right protocol.'
  },
  {
    q: 'Vault V2 has five roles. Which five are correct, in order from most to least privileged?',
    options: [
      'Owner, Curator, Allocator, Sentinel, Guardian',
      'Admin, Manager, Executor, Monitor, Auditor',
      'Curator, Owner, Allocator, Guardian, Sentinel',
      'Owner, Allocator, Curator, Guardian, Sentinel'
    ],
    correct: 0,
    explanation: 'Owner (governance), Curator (strategy), Allocator (execution), Sentinel (emergency blocker), Guardian (emergency pause). These five roles deliberately separate strategy definition, execution, and risk management.',
    category: 'vaults',
    difficulty: 'fundamental',
    module_slug: 'fixed-rate-lending-v2',
    interviewTip: 'Practice the 30-second sequence: "Owner sets who manages the vault. Curator defines strategy. Allocator executes within it. Sentinel blocks dangerous pending changes. Guardian pauses in emergency." Under 30 seconds, no hesitation.'
  },
  {
    q: 'What is the key difference between the Sentinel and the Guardian roles in Vault V2?',
    options: [
      'Sentinel operates at the proposal level — cancels dangerous pending timelock changes. Guardian operates at the vault level — pauses everything in emergency.',
      'Sentinel can pause the vault. Guardian can only reduce caps.',
      'Sentinel and Guardian have identical powers, just different names for different vault types.',
      'Guardian cancels pending changes. Sentinel pauses the vault.'
    ],
    correct: 0,
    explanation: 'Sentinel = proposal-level intervention: revoke specific pending risk-increasing changes before execution. Guardian = vault-level intervention: pause the entire vault. Different scope, different use case.',
    category: 'vaults',
    difficulty: 'intermediate',
    module_slug: 'fixed-rate-lending-v2',
    interviewTip: 'The confusion point: people swap Sentinel and Guardian. Remember: Sentinel = Specific (cancels specific proposals). Guardian = Global (pauses everything).'
  },
  {
    q: 'In Vault V2, what is timelock asymmetry and why does it exist?',
    options: [
      'Risk-increasing changes (higher caps, new adapters) are timelocked (3-7 days). Risk-reducing changes (lower caps, removing allocations) are immediate. This gives depositors time to exit before their risk increases.',
      'All changes are timelocked equally at 7 days. Asymmetry refers to the different fee rates for curators vs allocators.',
      'Curators face longer timelocks than allocators. Allocators can execute immediately.',
      'Timelocks apply only to guardian actions. Curator and allocator changes are always immediate.'
    ],
    correct: 0,
    explanation: 'Timelock asymmetry: risk up = slow (depositors need time to evaluate and potentially exit). Risk down = fast (emergency response must be immediate). This is the depositor protection mechanism embedded in the protocol design.',
    category: 'vaults',
    difficulty: 'intermediate',
    module_slug: 'fixed-rate-lending-v2',
    interviewTip: 'The clean framing: "The protocol delays actions that widen risk and accelerates actions that reduce risk. This is depositor exit rights expressed in code."'
  },
  {
    q: 'Morpho is described as "non-opinionated infrastructure." What does this mean for a partner building on it?',
    options: [
      'Morpho provides only lending and borrowing primitives — the partner must independently choose oracle provider, wallet infrastructure, compliance tooling, liquidity strategy, and frontend data sources',
      'Morpho does not have a formal opinion on fees, so partners can charge whatever they want',
      'Non-opinionated means the protocol does not require partners to use any specific collateral type',
      'Morpho provides a full-stack lending product and partners only need to add their branding'
    ],
    correct: 0,
    explanation: 'Non-opinionated = Morpho does not mandate the full stack. Every component around Morpho — oracle, wallet, compliance, liquidity, frontend — is a partner decision. This maximizes composability but increases integration scope.',
    category: 'partner-scenario',
    difficulty: 'fundamental',
    module_slug: 'fixed-rate-lending-v2',
    interviewTip: 'When a partner says "just plug in Morpho," this is your cue to walk through the seven ecosystem layers they still need to decide on.'
  },
  {
    q: 'A new partner vault has very low TVL after two weeks. What is the most realistic explanation and recommended first response?',
    options: [
      'Cold-start liquidity is normal without seed capital or incentives. Recommend an anchor depositor or Merkl incentive campaign and set realistic ramp expectations.',
      'The vault smart contract likely has a bug preventing deposits. Recommend an immediate audit.',
      'This always indicates the curator set the cap too low, preventing inflows. Raise the cap immediately.',
      'Low TVL after two weeks means the vault will never attract liquidity and should be shut down.'
    ],
    correct: 0,
    explanation: 'Cold-start liquidity is a known challenge. The first step is diagnosing root cause (no incentives? non-competitive rates? insufficient anchor depositor?) before recommending fixes. Merkl campaigns and anchor depositor commitments are the primary tools.',
    category: 'partner-scenario',
    difficulty: 'intermediate',
    module_slug: 'fixed-rate-lending-v2',
    interviewTip: 'Your diagnostic questions: (1) Is there an anchor depositor? (2) Is there a Merkl campaign running? (3) Is the yield competitive vs comparable markets? These three questions cover 80% of low-TVL root causes.'
  },
  {
    q: 'A CeFi exchange risk manager asks: "If a borrower\'s collateral drops, how does your system margin-call them?" What is the most accurate answer?',
    options: [
      'There is no central margin call team — permissionless liquidators monitor positions onchain and execute when it is profitable for them. The incentive structure replaces the centralized function.',
      'Morpho\'s risk team manually monitors all positions and calls borrowers when their Health Factor drops below 1.05',
      'The protocol automatically sends email notifications to borrowers when liquidation risk is high',
      'Borrowers must sign a legal agreement to repay before their collateral can be liquidated'
    ],
    correct: 0,
    explanation: 'DeFi liquidation is permissionless. Morpho creates an economic incentive (liquidation bonus) for anyone to liquidate undercollateralized positions. There is no central counterparty — the incentive mechanism replaces the margin call desk.',
    category: 'partner-scenario',
    difficulty: 'intermediate',
    module_slug: 'fixed-rate-lending-v2',
    interviewTip: 'After explaining permissionless liquidation, proactively mention the tail risk: very fast price moves can create bad debt if liquidators cannot execute in time. Showing you know both sides demonstrates credibility.'
  },
  {
    q: 'Morpho V2 supports multi-asset and portfolio collateral. Why does this matter for institutional partners?',
    options: [
      'Institutions often hold diversified portfolios (tokenized treasuries, wBTC, ETH) and need to use a basket of assets as collateral rather than being forced to pick one',
      'It allows Morpho to charge higher fees when more collateral types are used',
      'Multi-asset collateral reduces the LLTV requirement, making borrowing cheaper',
      'It is primarily for retail users who want to avoid selling individual assets'
    ],
    correct: 0,
    explanation: 'Institutional borrowers frequently hold diversified portfolios. Morpho Blue forces single-asset collateral per market. V2\'s flexible collateral model (single asset, multi-asset, full portfolio) accommodates institutional treasury management needs.',
    category: 'partner-scenario',
    difficulty: 'intermediate',
    module_slug: 'fixed-rate-lending-v2',
    interviewTip: 'The institutional framing: "Your treasury likely holds a mix of assets. V2 lets you use that portfolio as collateral without liquidating individual positions to isolate one collateral type."'
  },
  {
    q: 'A partner asks which oracle to use for their new Morpho market. What should you do before recommending one?',
    options: [
      'Ask about their collateral assets, required update frequency, jurisdictional constraints, and risk tolerance — then map those answers to the right provider',
      'Always recommend Chainlink since it is the most widely used regardless of use case',
      'Recommend whichever oracle Morpho uses for its own markets, since that ensures compatibility',
      'Tell the partner to choose any oracle since Morpho is non-opinionated and oracle choice has no impact on market safety'
    ],
    correct: 0,
    explanation: 'Oracle selection depends on asset type (Chainlink for majors, Pyth for high-frequency, Redstone for niche assets), update frequency needs, jurisdiction, and risk tolerance. Recommending without these answers is irresponsible.',
    category: 'partner-scenario',
    difficulty: 'intermediate',
    module_slug: 'fixed-rate-lending-v2',
    interviewTip: 'Demonstrate strategic advisor thinking: always ask before recommending. The questions are: (1) What assets? (2) What update frequency? (3) Any jurisdictional constraints? (4) What is your risk tolerance? Then map to the right provider.'
  },
  {
    q: 'What is the realistic timeline for a CeFi exchange to launch a production-ready Morpho integration?',
    options: [
      '3-6 months — the protocol integration is fast but oracle selection, compliance tooling, wallet infrastructure, and UX testing extend the timeline significantly',
      '1-2 weeks — Morpho is plug-and-play with no additional ecosystem decisions required',
      'Exactly 30 days if the partner commits a full engineering team',
      '12-18 months due to the complexity of DeFi regulatory requirements'
    ],
    correct: 0,
    explanation: 'The Morpho SDK integration can produce a prototype quickly, but production-readiness requires oracle selection, compliance layer integration, wallet infrastructure decisions, UX testing, and liquidity bootstrapping planning — typically 3-6 months.',
    category: 'partner-scenario',
    difficulty: 'intermediate',
    module_slug: 'fixed-rate-lending-v2',
    interviewTip: 'Deliver the realistic timeline without losing the partner: "The prototype is fast. Production-readiness takes longer because of the decisions around Morpho. I\'d rather scope this correctly up front than surprise you in month two."'
  },
  {
    q: 'The technical interview Florian described is an oral discussion, not a coding exercise. What does this mean for your preparation?',
    options: [
      'Practice giving spoken answers of 60-90 seconds per question, expect interruptions and follow-ups, and demonstrate that you can hold complexity while communicating simply',
      'Memorize code snippets for Morpho SDK calls so you can recite them verbatim',
      'Prepare a slide deck to present your integration knowledge visually',
      'Focus exclusively on written explanations and prepare detailed text documents'
    ],
    correct: 0,
    explanation: 'The format is verbal discussion. The evaluation is whether you can explain complex DeFi mechanics to institutional partners in real time, handle follow-up questions, and remain credible under pressure — all spoken, not written.',
    category: 'final-review',
    difficulty: 'fundamental',
    module_slug: 'fixed-rate-lending-v2',
    interviewTip: 'After each lesson in this module, practice the interview drill OUT LOUD at 90 seconds. Verbal fluency comes from verbal practice, not from reading.'
  }
];

const QUIZ_QUESTIONS = [
  ...CORE_QUIZ_QUESTIONS,
  ...COMPLEMENTARY_QUIZ_QUESTIONS,
  ...BLOG_QUIZ_QUESTIONS,
  ...CUSTOMER_STORY_QUIZ_QUESTIONS
];

module.exports = { QUIZ_QUESTIONS };
