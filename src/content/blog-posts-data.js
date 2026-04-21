const BLOG_POST_SUMMARIES = [
  {
    slug: 'vaults-v2-a-new-standard-for-asset-curation',
    title: 'Morpho Vaults V2: A new standard for asset curation',
    date: '2025-09-29',
    category: 'product',
    url: 'https://morpho.org/blog/morpho-vaults-v2-a-new-standard-for-asset-curation/',
    keyPoints: [
      'Vaults V2 launched first as the first component of Morpho V2, with Markets V2 planned to follow.',
      'Vaults V2 can allocate across current and future Morpho protocols through an adapter architecture.',
      'The role system was revamped around owner, curator, allocator, and sentinel for segregation of duties.',
      'Advanced risk management includes absolute and relative caps over shared risk factors via ids.',
      'Optional gate contracts allow KYC or token-gated access controls without forcing all vaults to be permissioned.',
      'In-kind redemptions allow users to exit even when immediate liquidity is not available.'
    ],
    partnerUse: 'Use this post when explaining why Vaults V2 is institutional-grade curation infrastructure instead of only another yield vault.'
  },
  {
    slug: 'curators-explained',
    title: 'Curators Explained',
    date: '2025-12-22',
    category: '101',
    url: 'https://morpho.org/blog/curators-explained/',
    keyPoints: [
      'Curators are independent teams, not part of Morpho, that design and manage vault strategies.',
      'The closest TradFi analogy is an asset manager or fund manager, but execution remains noncustodial and onchain.',
      'Curators can charge management fees, performance fees, or enter revenue-sharing agreements with distributors.',
      'Curator economics are structurally lighter than traditional funds because the vault infrastructure is already provided onchain.'
    ],
    partnerUse: 'Use this post to answer who curators are, how they get paid, and why Morpho can support curator businesses as a category.'
  },
  {
    slug: 'vaults-the-future-of-noncustodial-finance',
    title: 'Vaults: The Future of Noncustodial Finance',
    date: '2025-12-17',
    category: '101',
    url: 'https://morpho.org/blog/vaults-the-future-of-noncustodial-finance/',
    keyPoints: [
      'Vaults are programmable, noncustodial strategies that users can opt into without giving custody to intermediaries.',
      'The post compares vaults to funds but emphasizes instant, permissionless deposit and withdrawal.',
      'Depositor protections include caps, timelocks, optional sentinels, and in-kind redemption.',
      'The article argues tokenization is useful but vaults are the endgame for truly onchain financial products.'
    ],
    partnerUse: 'Use this post when a partner needs a product-level explanation of why vaults matter beyond yield farming.'
  },
  {
    slug: 'introducing-bundler3',
    title: 'Introducing Bundler3',
    date: '2025-01-23',
    category: 'protocol',
    url: 'https://morpho.org/blog/introducing-bundler3/',
    keyPoints: [
      'Bundler3 enables EOAs to execute arbitrary atomic call sequences including flows that require approvals or callbacks.',
      'It uses transient storage to track the initiator and callback hashes to constrain reentry behavior.',
      'Adapters can enforce initiator-aware permission checks and support slippage management or migrations.',
      'Bundler3 was released as open-source ecosystem infrastructure, not only for the Morpho app.'
    ],
    partnerUse: 'Use this post when a partner asks why one-click leveraged or refinance flows need something stronger than a basic multicall.'
  },
  {
    slug: 'introducing-the-public-allocator-for-morpho',
    title: 'Introducing the Public Allocator for Morpho',
    date: '2024-05-10',
    category: 'protocol',
    url: 'https://morpho.org/blog/introducing-the-public-allocator-for-morpho/',
    keyPoints: [
      'Public Allocator provides just-in-time liquidity by reallocating among listed markets when enabled by vaults.',
      'Frontends should bundle reallocation with borrowing rather than making users call the allocator directly.',
      'Vaults can impose max inflow/outflow restrictions and fees to constrain allocator behavior.',
      'The allocator helps isolated markets re-aggregate liquidity without reverting to monolithic pooled risk.'
    ],
    partnerUse: 'Use this post to explain how Morpho handles liquidity fragmentation concerns in a partner-facing way.'
  },
  {
    slug: 'introducing-pre-liquidations-enhanced-loan-management-on-morpho',
    title: 'Introducing Pre-Liquidations: Enhanced Loan Management on Morpho',
    date: '2025-03-04',
    category: 'protocol',
    url: 'https://morpho.org/blog/introducing-pre-liquidations-enhanced-loan-management-on-morpho/',
    keyPoints: [
      'Pre-liquidations are opt-in custom liquidation contracts deployed from a factory on top of Morpho markets.',
      'Apps can use them to offer auto-deleverage or auto-close experiences before default liquidation.',
      'Borrowers must authorize the custom contract and still fall back to Morpho’s default liquidation if the pre-liquidation path does not execute.',
      'Parameters include pre-LLTV, close factors, incentive factors, and a pre-liquidation oracle.'
    ],
    partnerUse: 'Use this post when discussing borrower-experience improvements that do not require changing Morpho’s base liquidation logic.'
  },
  {
    slug: 'onchainkit-earn-integrate-morpho-vaults-in-minutes',
    title: 'OnchainKit Earn: Integrate Morpho Vaults in Minutes',
    date: '2025-03-05',
    category: 'general',
    url: 'https://morpho.org/blog/onchainkit-earn-integrate-morpho-vaults-in-minutes/',
    keyPoints: [
      'OnchainKit Earn provides a prebuilt component for integrating Morpho vaults quickly on Base.',
      'The pitch is faster, easier, and safer integration rather than building a full earn stack from scratch.',
      'Builders can add passive-income and retention features with a few snippets of code.',
      'The post shows concrete integration steps using the OnchainKit provider and Earn component.'
    ],
    partnerUse: 'Use this post when pitching fast POCs and low-overhead partner demos.'
  },
  {
    slug: 'pioneering-the-defi-mullet-coinbase-in-the-front-defi-in-the-back',
    title: 'Pioneering the DeFi Mullet: Coinbase in the Front, DeFi in the Back',
    date: '2025-05-06',
    category: 'product',
    url: 'https://morpho.org/blog/pioneering-the-defi-mullet-coinbase-in-the-front-defi-in-the-back/',
    keyPoints: [
      'The DeFi mullet is defined as intuitive fintech UX in front and decentralized financial infrastructure in the back.',
      'Coinbase used Morpho to abstract wallets, gas, wrapping, and lending mechanics while still giving users onchain loans.',
      'The product relied on Smart Wallet, Paymaster, passkeys, Magic Spend, and Base to smooth the UX.',
      'Morpho provided instant access to existing liquidity and native accounting and liquidation primitives.'
    ],
    partnerUse: 'Use this post as the flagship embedded-lending pattern for exchanges and fintechs.'
  },
  {
    slug: 'morpho-institutional-grade-lending-infrastructure',
    title: 'Morpho: Institutional Grade Lending Infrastructure',
    date: '2025-01-16',
    category: 'general',
    url: 'https://morpho.org/blog/morpho-institutional-grade-lending-infrastructure/',
    keyPoints: [
      'The post frames security and compliance as the two major institutional barriers to DeFi integration.',
      'It highlights permissioned-market design via wrapped or gated collateral for KYC-sensitive workflows.',
      'It stresses Morpho’s noncustodial, immutable, governance-minimized design as a compliance and reliability advantage.',
      'The post links institutional adoption directly to open-source ownership, security framework, and Lindy-style immutability.'
    ],
    partnerUse: 'Use this post when a regulated partner asks why Morpho is suitable for fintech or institutional integration.'
  },
  {
    slug: 'the-morpho-rwa-playbook-make-tokenized-rwas-productive-via-defi-lending',
    title: 'The Morpho RWA Playbook: make tokenized RWAs productive via DeFi lending',
    date: '2025-10-22',
    category: 'product',
    url: 'https://morpho.org/blog/the-morpho-rwa-playbook-make-tokenized-rwas-productive-via-defi-lending/',
    keyPoints: [
      'The post argues tokenization’s real value is distribution and composability rather than only better back-office plumbing.',
      'It presents a repeatable pattern: tokenize an RWA exposure, list it as collateral, borrow stablecoins, and use financing for leverage or working capital.',
      'Case studies include mF-ONE, Apollo / sACRED, and Pareto / FalconX credit vaults.',
      'Risk framing emphasizes explicit LLTVs, trusted oracles, caps, and curator / sentinel response ability.'
    ],
    partnerUse: 'Use this post when speaking to RWA issuers or tokenized-fund teams about productive collateral and lending utility.'
  },
  {
    slug: 'introducing-morpho-vaults-1-1',
    title: 'Introducing Morpho Vaults 1.1',
    date: '2025-01-07',
    category: 'protocol',
    url: 'https://morpho.org/blog/introducing-morpho-vaults-1-1/',
    keyPoints: [
      'Vaults 1.1 removed automated bad debt realization at the vault level to broaden compatibility for integrations.',
      'The update opened room for reserve or safety-module style products around vaults.',
      'Vaults 1.1 remained a separate immutable codebase that coexists with prior versions and shares liquidity through common markets.',
      'Quality-of-life curator changes included editable names, editable symbols, and zero timelock at deployment before a later minimum of 24 hours.'
    ],
    partnerUse: 'Use this post when explaining version differences or why some integrations preferred Vaults 1.1 before Vaults V2.'
  },
  {
    slug: 'morpho-blue-security-framework-building-the-most-secure-lending-protocol',
    title: 'Morpho Blue Security Framework: Building the Most Secure Lending Protocol',
    date: '2024-05-02',
    category: 'protocol',
    url: 'https://morpho.org/blog/morpho-blue-security-framework-building-the-most-secure-lending-protocol/',
    keyPoints: [
      'Morpho presents security as a multi-layer process rather than a single audit milestone.',
      'The framework emphasizes internal reviews, invariant testing, formal verification, external audits, contests, and bug bounties.',
      'The post explicitly treats security work as ongoing both before and after deployment.',
      'The article reinforces that minimal immutable codebases are easier to reason about and verify rigorously.'
    ],
    partnerUse: 'Use this post when you need to explain Morpho security in a serious engineering voice rather than with generic audit claims.'
  },
  {
    slug: 'formally-verifying-morpho-with-certora',
    title: 'Formally Verifying Morpho with Certora',
    date: '2024-03-19',
    category: 'general',
    url: 'https://morpho.org/blog/formally-verifying-morpho-with-certora/',
    keyPoints: [
      'MetaMorpho formal verification is positioned as one layer of the broader security framework.',
      'The post explains why formal verification is more exhaustive than unit tests for scoped properties.',
      'Examples include roles, timelock behavior, and liveness properties for emergency actions.',
      'The article explicitly notes that formal verification has limits and depends on specification quality and assumptions.'
    ],
    partnerUse: 'Use this post when a partner asks what Morpho means by formal verification or why it matters for vault logic.'
  },
  {
    slug: 'formally-verifying-morpho-blue-with-certorav',
    title: 'Formally Verifying Morpho Blue with Certora',
    date: '2023-12-21',
    category: 'general',
    url: 'https://morpho.org/blog/formally-verifying-morpho-blue-with-certorav/',
    keyPoints: [
      'Morpho Blue’s small immutable codebase is presented as especially suitable for formal verification.',
      'Examples cover market independence, conservation-like invariants, and reentrancy-related safety properties.',
      'The article stresses exhaustive property checking over all scenarios rather than sample inputs.',
      'It also explains why simple immutable architecture helps security review quality.'
    ],
    partnerUse: 'Use this post to explain why Morpho Blue’s minimal design is a security and diligence advantage.'
  },
  {
    slug: 'introducing-risk-warnings-transitioning-to-a-permissionless-interface',
    title: 'Introducing Risk Warnings: Transitioning to a Permissionless Interface',
    date: '2024-05-02',
    category: 'general',
    url: 'https://morpho.org/blog/introducing-risk-warnings-transitioning-to-a-permissionless-interface/',
    keyPoints: [
      'As markets and vaults become more permissionless, the interface must help users understand configuration risk.',
      'Risk warnings are categorized as red, yellow, and blacklisted rather than silently filtering everything.',
      'Red warnings require opt-in for unrecognized assets, oracles, or curators.',
      'The post frames risk signaling as a step toward a more permissionless interface, not a contradiction of permissionlessness.'
    ],
    partnerUse: 'Use this post when talking to frontend teams or product leaders about warning systems and permissionless UX.'
  },
  {
    slug: 'morpho-everywhere-infrastructure-mode',
    title: 'Morpho Everywhere: Infrastructure Mode',
    date: '2025-01-29',
    category: 'governance',
    url: 'https://morpho.org/blog/morpho-everywhere-infrastructure-mode/',
    keyPoints: [
      'Morpho infrastructure-only deployments expand the stack to additional chains without immediate app support or MORPHO rewards.',
      'Builders on those chains can operate under their own brand and business model while using Morpho contracts.',
      'The deployed stack includes Morpho, Vaults 1.1, oracles, URD, AdaptiveCurveIRM, Public Allocator, Bundler3, and pre-liquidations.',
      'The post frames Morpho as public infrastructure that contributors can grow independently of the core app.'
    ],
    partnerUse: 'Use this post when talking to chain teams or distributors about Morpho as infrastructure rather than only a destination app.'
  },
  {
    slug: 'introducing-metamorpho-permissionless-lending-vaults-on-morpho-blue',
    title: 'Introducing MetaMorpho: Permissionless lending vaults on Morpho Blue',
    date: '2023-10-24',
    category: 'product',
    url: 'https://morpho.org/blog/introducing-metamorpho-permissionless-lending-vaults-on-morpho-blue/',
    keyPoints: [
      'MetaMorpho was introduced as a layered vault protocol on top of Morpho Blue.',
      'The key argument was that users want delegated risk management without returning to pooled one-size-fits-all lending.',
      'MetaMorpho vaults share liquidity where their underlying market allocations overlap, preserving network effects.',
      'The post frames permissionless curation as open competition among risk managers serving users directly.'
    ],
    partnerUse: 'Use this post when explaining the original logic behind vault curation and why curated layers belong on top of isolated primitives.'
  },
  {
    slug: 'introducing-the-adaptivecurveirm-efficient-and-autonomous',
    title: 'Introducing the AdaptiveCurveIRM: Efficient and Autonomous',
    date: '2023-11-16',
    category: 'product',
    url: 'https://morpho.org/blog/introducing-the-adaptivecurveirm-efficient-and-autonomous/',
    keyPoints: [
      'AdaptiveCurveIRM is immutable and designed to maintain utilization near a 90% target.',
      'The model combines a static curve mechanism with an adaptive mechanism that shifts rates over time.',
      'Morpho’s design allows higher target utilization because supplied assets are not simultaneously used as collateral.',
      'The post frames autonomy as a feature: governance and market creators do not fine-tune the model after launch.'
    ],
    partnerUse: 'Use this post when explaining why Morpho rates can adapt without governance babysitting.'
  },
  {
    slug: 'establishing-morpho-blues-oracle-network-with-chainlink-price-feeds',
    title: 'Establishing Morpho Blue’s Oracle Network with Chainlink Price Feeds',
    date: '2024-01-24',
    category: 'general',
    url: 'https://morpho.org/blog/establishing-morpho-blues-oracle-network-with-chainlink-price-feeds/',
    keyPoints: [
      'Morpho Blue is oracle-agnostic and lets market creators choose the oracle address at market creation.',
      'Morpho Labs built Chainlink wrappers to help launch early markets with high-quality feeds.',
      'The post ties oracle quality directly to safe LLTV selection and liquidation reliability.',
      'Multi-feed composition is highlighted as a way to price many collateral and loan pairs.'
    ],
    partnerUse: 'Use this post when explaining why oracle choice is central to market design and not just an implementation detail.'
  },
  {
    slug: 'how-to-evaluate-defi-protocols-a-practical-guide-for-product-leaders-exploring-defi-infrastructure',
    title: 'How to Evaluate DeFi Protocols: a practical guide for product leaders exploring DeFi infrastructure',
    date: '2026-01-29',
    category: '101',
    url: 'https://morpho.org/blog/how-to-evaluate-defi-protocols-a-practical-guide-for-product-leaders-exploring-defi-infrastructure',
    keyPoints: [
      'The evaluation framework covers simplicity, ease of integration, immutability, governance, security, and risk management.',
      'The post argues that modular neutral infrastructure gives integrators more control than monolithic protocols.',
      'It emphasizes that audits are only one signal and that security posture includes process, design, and ongoing practices.',
      'The article is explicitly written for product leaders choosing backend financial infrastructure.'
    ],
    partnerUse: 'Use this post as a high-level framework when an interviewer asks how you evaluate Morpho versus alternative infrastructure.'
  }
].map((post) => {
  const publishedAt = new Date(`${post.date}T00:00:00Z`);
  const asOf = new Date('2026-03-27T00:00:00Z');
  const ageDays = Math.floor((asOf - publishedAt) / (1000 * 60 * 60 * 24));

  let recency;
  let relevanceNote;

  if (ageDays <= 120) {
    recency = 'current';
    relevanceNote = 'Current enough for direct interview prep, but still verify operational details like addresses, deployments, and live integrations.';
  } else if (ageDays <= 365) {
    recency = 'recent-but-verify';
    relevanceNote = 'Useful for strategy and product framing, but treat concrete metrics, rollout state, and integration details as potentially outdated as of March 27, 2026.';
  } else {
    recency = 'historical';
    relevanceNote = 'Historical context only. Use for design philosophy, product evolution, and interview framing; do not rely on it alone for live protocol or integration facts.';
  }

  return {
    ...post,
    recency,
    relevanceNote
  };
});

const BLOG_QUIZ_QUESTIONS = [
  {
    q: 'What is the most important architectural promise of Vaults V2 from the September 29, 2025 blog post?',
    options: [
      'They can allocate across current and future Morpho protocols through a flexible adapter architecture while staying immutable.',
      'They replace all prior Morpho contracts with one upgradeable vault contract.',
      'They remove role separation to simplify governance.',
      'They force all vaults to be KYC-gated.'
    ],
    correct: 0,
    explanation: 'The Vaults V2 launch post emphasizes future-proof adapter-based compatibility while keeping vault logic immutable.',
    category: 'blog-posts',
    difficulty: 'intermediate',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'Use this when explaining why Vaults V2 is a platform, not just a version bump.'
  },
  {
    q: 'According to the Bundler3 blog post, what problem does Bundler3 solve better than a simple multicall?',
    options: [
      'It supports atomic flows that require approvals, callbacks, and initiator-aware security checks.',
      'It turns every transaction into a fixed-rate loan.',
      'It replaces the oracle system for all markets.',
      'It eliminates the need for token allowances completely.'
    ],
    correct: 0,
    explanation: 'The post positions Bundler3 as a more powerful multicall for advanced authorization and callback-heavy flows.',
    category: 'blog-posts',
    difficulty: 'intermediate',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'Do not reduce Bundler3 to "gas savings."'
  },
  {
    q: 'What is the key user-facing idea behind pre-liquidations?',
    options: [
      'Applications can offer opt-in borrower features like auto-deleverage or auto-close before default liquidation.',
      'Morpho guarantees borrowers will never be liquidated.',
      'All markets automatically use lower liquidation penalties.',
      'Curators can manually close positions offchain.'
    ],
    correct: 0,
    explanation: 'Pre-liquidations are optional borrower-experience overlays, not a replacement for default liquidation.',
    category: 'blog-posts',
    difficulty: 'intermediate',
    module_slug: 'core-math-and-formulas',
    interviewTip: 'Stress opt-in and fallback to default liquidation.'
  },
  {
    q: 'What is the strongest explanation of the Public Allocator from the blog post?',
    options: [
      'It lets frontends pull just-in-time liquidity from eligible listed markets when borrowing demand exceeds one market’s local liquidity.',
      'It gives curators direct access to user wallets.',
      'It socializes risk across every asset in the protocol.',
      'It makes isolated-market liquidity identical to pooled lending without restrictions.'
    ],
    correct: 0,
    explanation: 'The Public Allocator helps re-aggregate liquidity while still respecting vault listing and flow constraints.',
    category: 'blog-posts',
    difficulty: 'intermediate',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: 'Pair this with "frontends bundle it, users do not think about it directly."'
  },
  {
    q: 'What does the "DeFi mullet" blog mean by the term?',
    options: [
      'Polished fintech UX in the front, decentralized financial infrastructure in the back.',
      'A governance-first system with no frontend abstraction.',
      'A pooled lending system wrapped by a bridge contract.',
      'A custodial app with opaque yield generation.'
    ],
    correct: 0,
    explanation: 'The Coinbase post explicitly defines the DeFi mullet as a UX/backend split.',
    category: 'blog-posts',
    difficulty: 'fundamental',
    module_slug: 'partner-communication-and-objections',
    interviewTip: 'This is one of the best business-translation phrases in the whole Morpho corpus.'
  },
  {
    q: 'What is the clearest institutional message from the "Institutional Grade Lending Infrastructure" post?',
    options: [
      'Security and compliance are the main barriers, and Morpho addresses them through immutability, noncustodial design, permissioning flexibility, and a strong security framework.',
      'Institutions should ignore compliance and focus only on APY.',
      'Institutions can only use Morpho through governance.',
      'Morpho removes the need for internal risk review.'
    ],
    correct: 0,
    explanation: 'The institutional post is built around security and compliance as the adoption bottlenecks.',
    category: 'blog-posts',
    difficulty: 'advanced',
    module_slug: 'partner-communication-and-objections',
    interviewTip: 'Great for bank, fintech, and custody conversations.'
  },
  {
    q: 'What repeated RWA pattern is highlighted in the RWA Playbook blog?',
    options: [
      'Tokenize an exposure, use it as collateral on Morpho, borrow stablecoins against it, and use that financing for leverage or working capital.',
      'Tokenize an exposure and keep it isolated from all lending activity.',
      'Only distribute RWAs offchain to avoid composability.',
      'Use RWA tokens only as yield rewards.'
    ],
    correct: 0,
    explanation: 'The RWA playbook explicitly lays out a repeatable tokenization-plus-lending pattern.',
    category: 'blog-posts',
    difficulty: 'advanced',
    module_slug: 'real-world-integrations-and-merkl',
    interviewTip: 'Excellent answer structure for RWA issuers.'
  },
  {
    q: 'What is the strongest takeaway from the risk warnings blog post?',
    options: [
      'A permissionless interface still needs explicit warning systems so users can evaluate markets and vaults with unusual parameters.',
      'Permissionless interfaces should hide all unknown markets entirely with no explanation.',
      'Risk warnings replace the need for user due diligence.',
      'Only governance-approved markets should ever be visible.'
    ],
    correct: 0,
    explanation: 'The post argues for warning users about risk while still moving toward a more permissionless interface.',
    category: 'blog-posts',
    difficulty: 'intermediate',
    module_slug: 'partner-communication-and-objections',
    interviewTip: 'This is a strong UX-governance tradeoff answer.'
  },
  {
    q: 'Why does Morpho emphasize formal verification in both Morpho Blue and MetaMorpho blog posts?',
    options: [
      'Because it helps exhaustively verify specified properties across all scenarios, complementing rather than replacing other security work.',
      'Because formal verification guarantees the absence of all possible bugs.',
      'Because audits are unnecessary once formal verification exists.',
      'Because it only matters for frontend code.'
    ],
    correct: 0,
    explanation: 'The formal verification posts repeatedly present it as one powerful part of a broader security process.',
    category: 'blog-posts',
    difficulty: 'advanced',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'Never oversell formal verification as magic.'
  },
  {
    q: 'What is the best interpretation of "infrastructure mode" from the Morpho Everywhere post?',
    options: [
      'Morpho can be deployed as backend lending infrastructure on new chains even before those deployments are first-class in the main app.',
      'Morpho stops supporting builders outside the main app.',
      'Only the DAO can use Morpho on new chains.',
      'Infrastructure mode means every chain gets identical rewards immediately.'
    ],
    correct: 0,
    explanation: 'Infrastructure mode means contract deployments can exist before core app or reward support, allowing local builders to build around them.',
    category: 'blog-posts',
    difficulty: 'intermediate',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: 'Very useful for chain and ecosystem partner conversations.'
  },
  {
    q: 'What is the practical product value of OnchainKit Earn according to the blog post?',
    options: [
      'It lets builders integrate Morpho vaults quickly with prebuilt components instead of building a full earn stack from scratch.',
      'It is a replacement for Morpho vaults.',
      'It only works for governance dashboards.',
      'It removes the need to choose vaults or think about risk.'
    ],
    correct: 0,
    explanation: 'The OnchainKit Earn post is explicitly about faster and easier vault integration using prebuilt components.',
    category: 'blog-posts',
    difficulty: 'fundamental',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: 'Great POC-speed talking point.'
  },
  {
    q: 'What is the strongest core idea from the MetaMorpho launch post?',
    options: [
      'Curated vaults can sit on top of isolated Morpho Blue markets so users can delegate risk management without returning to one-size-fits-all pooled risk.',
      'Every user should choose markets manually forever.',
      'Vaults eliminate the need for risk managers.',
      'Morpho Blue and vaults should never share liquidity.'
    ],
    correct: 0,
    explanation: 'MetaMorpho was introduced as a curated layer on top of Morpho Blue, not as a return to monolithic pooled risk.',
    category: 'blog-posts',
    difficulty: 'intermediate',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'This is the historical precursor to later vault messaging.'
  },
  {
    q: 'According to the AdaptiveCurveIRM post, why can Morpho target higher utilization than some other lending systems?',
    options: [
      'Because supplied assets are not used as collateral, reducing liquidation-related liquidity constraints.',
      'Because governance can force liquidity providers to stay.',
      'Because liquidations are disabled at high utilization.',
      'Because Morpho socializes liquidity across all markets.'
    ],
    correct: 0,
    explanation: 'The post explicitly ties higher utilization targets to Morpho’s collateral design.',
    category: 'blog-posts',
    difficulty: 'advanced',
    module_slug: 'core-math-and-formulas',
    interviewTip: 'This is a subtle but strong IRM explanation.'
  },
  {
    q: 'What is the main oracle-design point from the Chainlink oracle-network post?',
    options: [
      'Morpho Blue is oracle-agnostic, and oracle quality directly influences safe LLTV selection and liquidation reliability.',
      'Morpho hardcodes a single oracle for every market.',
      'LLTV is unrelated to oracle quality.',
      'Chainlink feeds are required because Morpho cannot compose feeds.'
    ],
    correct: 0,
    explanation: 'The post directly connects oracle quality to lending safety and emphasizes Morpho’s oracle-agnostic market design.',
    category: 'blog-posts',
    difficulty: 'intermediate',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'Great partner answer for oracle due diligence.'
  },
  {
    q: 'What is the most useful takeaway from the "How to Evaluate DeFi Protocols" article for a partner engineer?',
    options: [
      'Choose infrastructure by evaluating simplicity, integration quality, governance scope, security process, and risk-control ownership, not only APY.',
      'The only thing that matters is current yield.',
      'Upgradeability is always better than immutability.',
      'Frontends should ignore protocol governance design.'
    ],
    correct: 0,
    explanation: 'The article is a framework for selecting backend financial infrastructure with product, risk, and control tradeoffs in mind.',
    category: 'blog-posts',
    difficulty: 'fundamental',
    module_slug: 'partner-communication-and-objections',
    interviewTip: 'Excellent interview answer framework.'
  }
];

const BLOG_OPEN_ENDED_QUESTIONS = [
  {
    id: 31,
    question: 'Explain Vaults V2 to a sophisticated partner using the September 29, 2025 launch post as your framing.',
    category: 'vault-v2',
    difficulty: 'advanced',
    rubric: [
      'Explains allocation across current and future Morpho protocols',
      'Mentions roles, caps, gates, or in-kind redemptions as differentiated controls',
      'Explains why this matters for curation or institutional use cases',
      'Keeps the answer technically precise without becoming a feature dump',
      'Sounds like a partner engineer, not a marketer'
    ],
    followUp: 'Which Vaults V2 feature would you emphasize first to a regulated distributor and why?'
  },
  {
    id: 32,
    question: 'Use the DeFi mullet concept to explain how you would pitch Morpho to an exchange or fintech team.',
    category: 'partner-communication',
    difficulty: 'intermediate',
    rubric: [
      'Defines the DeFi mullet clearly',
      'Explains what the partner keeps ownership of on the frontend side',
      'Explains what Morpho provides on the backend side',
      'Uses a concrete customer pattern like Coinbase',
      'Connects the concept to speed, transparency, or operational leverage'
    ],
    followUp: 'What should you say if the partner worries abstraction will make users distrust the product?'
  },
  {
    id: 33,
    question: 'How would you explain Public Allocator and pre-liquidations as examples of Morpho’s "base layer plus overlays" design philosophy?',
    category: 'integration-judgment',
    difficulty: 'advanced',
    rubric: [
      'Explains Public Allocator as a liquidity overlay rather than a change to pooled risk design',
      'Explains pre-liquidations as an optional borrower-experience overlay',
      'Shows how Morpho keeps a simple primitive while allowing richer application layers',
      'Uses accurate language about opt-in behavior or frontend bundling',
      'Connects the explanation to partner product design'
    ],
    followUp: 'Which type of partner would benefit most from each overlay?'
  },
  {
    id: 34,
    question: 'An RWA issuer asks why Morpho is useful beyond token distribution. Answer with the RWA Playbook framing.',
    category: 'objection-handling',
    difficulty: 'advanced',
    rubric: [
      'Explains that tokenization alone mostly improves distribution',
      'Explains that Morpho adds productive collateral and financing utility',
      'Mentions at least one live case study such as mF-ONE or sACRED',
      'Frames the answer around capital efficiency and composability',
      'Keeps risk controls in view'
    ],
    followUp: 'What risk controls would you highlight before recommending an RWA market launch?'
  },
  {
    id: 35,
    question: 'A product team asks how to build a permissionless interface responsibly. Use the risk-warnings post to answer.',
    category: 'partner-communication',
    difficulty: 'advanced',
    rubric: [
      'Explains that permissionless visibility still needs user-facing warnings',
      'Mentions differentiated warning levels or opt-in mechanics',
      'Balances openness with user protection',
      'Avoids suggesting every unknown market should be hidden by default forever',
      'Frames the answer as product design, not only protocol philosophy'
    ],
    followUp: 'What should trigger a hard opt-in warning versus a softer caution?'
  },
  {
    id: 36,
    question: 'A technical partner asks what Morpho means by security beyond just "we were audited." Answer using the security framework and formal verification posts.',
    category: 'partner-communication',
    difficulty: 'advanced',
    rubric: [
      'Mentions multiple layers such as peer review, testing, fuzzing, formal verification, audits, contests, and bug bounties',
      'Explains formal verification carefully without overstating it',
      'Connects minimal immutable design to easier diligence',
      'Maintains a serious, engineering-first tone',
      'Avoids zero-risk language'
    ],
    followUp: 'What kinds of claims should you avoid making even with a strong security framework?'
  },
  {
    id: 37,
    question: 'A chain ecosystem team wants to know what "Morpho Everywhere: Infrastructure Mode" means for them. How do you answer?',
    category: 'poc-readiness',
    difficulty: 'intermediate',
    rubric: [
      'Explains infrastructure-only deployments clearly',
      'Mentions that app support and rewards may come later',
      'Frames Morpho as public infrastructure for local builders',
      'Mentions the broader stack beyond only the core contract',
      'Connects the answer to partner opportunity on the chain'
    ],
    followUp: 'What would you build first on a new infrastructure-mode deployment?'
  },
  {
    id: 38,
    question: 'Explain why Morpho’s architecture separates isolated markets from curated vault layers, using the MetaMorpho launch logic.',
    category: 'protocol-accuracy',
    difficulty: 'advanced',
    rubric: [
      'Explains isolated markets as the primitive and vaults as the curated delegation layer',
      'Connects this to differentiated risk profiles',
      'Mentions shared liquidity through overlapping allocations',
      'Avoids collapsing the two layers into one concept',
      'Uses language a partner can understand'
    ],
    followUp: 'When would you recommend direct market exposure instead of a curated vault?'
  },
  {
    id: 39,
    question: 'A partner asks how to evaluate whether Morpho is the right backend infrastructure for their product. Use the January 2026 evaluation framework.',
    category: 'scoping',
    difficulty: 'advanced',
    rubric: [
      'Mentions simplicity and integration quality',
      'Mentions immutability or upgradeability considerations',
      'Mentions governance scope and security practices',
      'Mentions control of risk and compliance exposure',
      'Turns the framework into a decision process rather than a marketing pitch'
    ],
    followUp: 'Which of those criteria usually matters most for a regulated fintech?'
  }
];

module.exports = {
  BLOG_POST_SUMMARIES,
  BLOG_QUIZ_QUESTIONS,
  BLOG_OPEN_ENDED_QUESTIONS
};
