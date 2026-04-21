const CUSTOMER_STORIES = [
  {
    company: 'Anchorage Digital',
    solution: 'Embedded Earn',
    pattern: 'institutional-custody',
    headline: 'Anchorage enabled productive onchain positions from qualified custody by connecting clients to Morpho vaults without changing custody workflows.',
    coreLesson: 'Morpho can sit behind regulated custody while vault receipt tokens remain held inside the institution’s existing custody perimeter.',
    partnerAngle: 'No new wallets, no policy rewrites, and ERC4626 receipt tokens held under the same institutional controls.'
  },
  {
    company: 'Wirex',
    solution: 'Embedded Earn',
    pattern: 'business-banking',
    headline: 'Wirex packaged Gauntlet-curated Morpho vaults into business accounts so idle stablecoin balances could earn yield without feeling like DeFi ops.',
    coreLesson: 'The winning move was product packaging: make onchain yield feel like a business account primitive with immediate liquidity and no lockups.',
    partnerAngle: 'Finance teams want liquidity plus familiar UX, not wallets, gas, and protocol spelunking.'
  },
  {
    company: 'Jumper',
    solution: 'Embedded Earn',
    pattern: 'cross-chain-aggregation',
    headline: 'Jumper added Morpho vaults to Jumper Earn and combined bridging, swapping, and depositing into a single user flow.',
    coreLesson: 'Morpho lets a cross-chain product inherit lending liquidity and curation immediately instead of building markets from scratch.',
    partnerAngle: 'Use Bundler-style atomic UX to turn a bridge destination into a productive deposit destination.'
  },
  {
    company: 'Sky',
    solution: 'Embedded Earn + Curation',
    pattern: 'stablecoin-expansion',
    headline: 'Sky used Morpho curation to accept USDC and USDT into savings products without building a new lending protocol from scratch.',
    coreLesson: 'Becoming a curator on Morpho can expand an ecosystem’s distribution and collateral utility faster than forking a money market.',
    partnerAngle: 'Morpho becomes the distribution and liquidity layer while the partner focuses on asset and strategy design.'
  },
  {
    company: 'OKX',
    solution: 'Embedded Earn',
    pattern: 'exchange-abstraction',
    headline: 'OKX used a Gauntlet-curated USDT vault on Katana to ship onchain earn without asking users to manage wallets, bridges, or gas.',
    coreLesson: 'Exchanges can abstract all the chain complexity while keeping yield sourcing transparent and noncustodial underneath.',
    partnerAngle: 'Distribution stays with the exchange; Morpho and curators handle lending infrastructure and risk curation.'
  },
  {
    company: 'Ondo',
    solution: 'Crypto-Backed Loans',
    pattern: 'tokenized-equities',
    headline: 'Morpho helped Ondo turn tokenized stocks and ETFs into productive collateral for USDC borrowing.',
    coreLesson: 'Isolated markets are especially useful when onboarding new collateral types like tokenized securities because risk remains local to each market.',
    partnerAngle: 'Use Morpho when the asset needs dedicated collateral treatment instead of pooled-protocol standardization.'
  },
  {
    company: 'Polygon Vault Bridge',
    solution: 'Embedded Earn',
    pattern: 'chain-revenue',
    headline: 'Vault Bridge routes bridged collateral into Morpho vaults on Ethereum so idle escrow can fund ecosystem incentives and liquidity.',
    coreLesson: 'Morpho can power infrastructure-level capital efficiency, not just end-user wallets or exchanges.',
    partnerAngle: 'Turn dormant bridge collateral into chain revenue without changing the user-facing bridging flow.'
  },
  {
    company: 'Apollo',
    solution: 'Crypto-Backed Loans',
    pattern: 'tokenized-private-credit',
    headline: 'Apollo used Morpho to let tokenized ACRED fund positions serve as collateral for stablecoin borrowing across multiple chains.',
    coreLesson: 'Morpho makes tokenized fund positions productive by enabling borrowing and loop-style strategies against them.',
    partnerAngle: 'Tokenization creates access; Morpho creates utility.'
  },
  {
    company: 'Safe',
    solution: 'Embedded Earn',
    pattern: 'treasury-yield',
    headline: 'Safe embedded Morpho-powered yield directly in-wallet so DAOs and enterprises could deploy idle treasury assets without leaving their governance environment.',
    coreLesson: 'The product win is keeping yield generation inside the same multisig and approval environment teams already trust.',
    partnerAngle: 'Safe proves that governance-preserving embedded earn is stronger than telling treasuries to go use a separate DeFi app.'
  },
  {
    company: 'Coinbase',
    solution: 'Embedded Earn + Crypto-Backed Loans',
    pattern: 'defi-mullet',
    headline: 'Coinbase used Morpho on Base for both borrowing and lending, with smart wallet tooling abstracting gas, signing, and account movement.',
    coreLesson: 'A partner can use the same Morpho backend to power both sides of the market and create an internal supply-demand flywheel.',
    partnerAngle: 'Borrow and lend products become stronger together when lender deposits directly fund borrower demand.'
  },
  {
    company: 'Société Générale',
    solution: 'Stablecoin Lending + Crypto-backed Stablecoin Borrowing',
    pattern: 'regulated-banking',
    headline: 'SG Forge used Morpho with curated vaults to support MiCA-compliant stablecoin lending and borrowing on transparent DeFi rails.',
    coreLesson: 'Morpho can serve regulated institutions that need auditable parameters, 24/7 markets, and explicit asset/collateral treatment.',
    partnerAngle: 'Use Morpho as the open market layer while the institution keeps issuance, compliance, and regulated distribution.'
  },
  {
    company: 'Crypto.com',
    solution: 'Embedded Earn + Crypto-Backed Loans',
    pattern: 'exchange-mullet',
    headline: 'Crypto.com embedded Morpho-backed lending inside its app and exchange to offer transparent yield without exposing users to DeFi complexity.',
    coreLesson: 'The DeFi mullet pattern is repeatable: trusted consumer UX in front, noncustodial lending rails in back.',
    partnerAngle: 'Account abstraction and app-native flows matter as much as APY when shipping to mainstream users.'
  },
  {
    company: 'Trust Wallet',
    solution: 'Embedded Earn',
    pattern: 'self-custody-wallet',
    headline: 'Trust Wallet made Morpho the default engine for Stablecoin Earn while preserving self-custody and onchain auditability.',
    coreLesson: 'Wallets can use Morpho to make idle stablecoins productive without compromising self-custody or pushing users into opaque intermediaries.',
    partnerAngle: 'Simple in-wallet earn can be a daily driver feature when the backend stays transparent and noncustodial.'
  },
  {
    company: 'Ledger',
    solution: 'Embedded Earn',
    pattern: 'self-custody-wallet',
    headline: 'Ledger integrated Morpho-powered yield through its Earn dashboard using Kiln’s enterprise integration layer.',
    coreLesson: 'Morpho can be distributed through enterprise middleware when the partner wants compliance tooling, monetization hooks, or operational wrappers.',
    partnerAngle: 'Sometimes the best integration path is through an enterprise distribution layer rather than directly from the app team to the contracts.'
  },
  {
    company: 'Gauntlet and Steakhouse',
    solution: 'Curation',
    pattern: 'curator-business-model',
    headline: 'Gauntlet and Steakhouse used Morpho vault infrastructure to turn risk expertise into large-scale curation businesses across many chains and assets.',
    coreLesson: 'Morpho is not just a lender/borrower network; it is a business platform for third-party curation and distribution.',
    partnerAngle: 'Curators can focus on strategy and risk because Morpho handles the vault and market infrastructure.'
  }
];

const CUSTOMER_STORY_QUIZ_QUESTIONS = [
  {
    q: 'What is the cleanest way to describe the Anchorage integration pattern?',
    options: [
      'Institutional clients accessed Morpho vaults from existing qualified custody without changing custody or policy workflows.',
      'Anchorage moved all clients to unmanaged wallets so they could use Morpho directly.',
      'Anchorage only used Morpho for governance voting.',
      'Anchorage replaced vault receipt tokens with offchain ledger entries.'
    ],
    correct: 0,
    explanation: 'Anchorage is the benchmark case study for qualified custody plus productive onchain positions.',
    category: 'customer-stories',
    difficulty: 'intermediate',
    module_slug: 'partner-communication-and-objections',
    interviewTip: 'Great institutional story for "How can a bank use Morpho?"'
  },
  {
    q: 'Which customer story best illustrates the DeFi mullet pattern of polished consumer UX in front and Morpho rails in back?',
    options: [
      'Coinbase',
      'Only protocol-native curators, not consumer apps',
      'None of the customer stories',
      'Morpho does not support this model'
    ],
    correct: 0,
    explanation: 'Coinbase is the clearest example, though Crypto.com, Bitget, Binance, and others also fit the pattern.',
    category: 'customer-stories',
    difficulty: 'fundamental',
    module_slug: 'partner-communication-and-objections',
    interviewTip: 'Use Coinbase when you need the clearest flagship example.'
  },
  {
    q: 'Why was Morpho especially useful for Ondo tokenized stocks?',
    options: [
      'Isolated markets let new collateral types launch without contaminating unrelated markets.',
      'Because Morpho automatically removes all oracle risk.',
      'Because tokenized stocks can only exist in pooled markets.',
      'Because vault curators can freeze stock-backed positions.'
    ],
    correct: 0,
    explanation: 'Ondo is a strong case study for isolated-market onboarding of new collateral classes.',
    category: 'customer-stories',
    difficulty: 'intermediate',
    module_slug: 'morpho-blue-fundamentals',
    interviewTip: 'Good answer for RWA and tokenized-equity partners.'
  },
  {
    q: 'Which story is the best example of Morpho powering chain-level revenue rather than only a wallet or exchange product?',
    options: [
      'Polygon Vault Bridge',
      'Safe',
      'Jumper',
      'Anchorage'
    ],
    correct: 0,
    explanation: 'Vault Bridge shows Morpho as infrastructure for productive escrowed bridge collateral and chain revenue.',
    category: 'customer-stories',
    difficulty: 'intermediate',
    module_slug: 'building-pocs-and-dashboards',
    interviewTip: 'Useful when talking to chain or bridge teams.'
  },
  {
    q: 'What is the strongest lesson from the Safe case study?',
    options: [
      'Yield adoption improves when treasuries can deploy from the same multisig and governance environment they already use.',
      'Treasuries prefer leaving custody environments to chase yield.',
      'Embedded earn only works for retail wallets.',
      'Safe solved treasury yield by making assets custodial.'
    ],
    correct: 0,
    explanation: 'Safe demonstrates governance-preserving embedded earn for DAOs and enterprises.',
    category: 'customer-stories',
    difficulty: 'intermediate',
    module_slug: 'partner-communication-and-objections',
    interviewTip: 'This is a strong treasury-facing objection answer.'
  },
  {
    q: 'What is the core takeaway from the Jumper story?',
    options: [
      'Morpho lets a cross-chain app turn bridging into a productive one-flow deposit experience.',
      'Morpho requires users to bridge and then learn a separate lending UI.',
      'Cross-chain apps cannot use Morpho because markets are isolated.',
      'Morpho only works for exchanges and not aggregators.'
    ],
    correct: 0,
    explanation: 'Jumper Earn shows how Morpho can sit behind a one-flow bridge, swap, and deposit experience.',
    category: 'customer-stories',
    difficulty: 'intermediate',
    module_slug: 'integration-patterns-and-sdks',
    interviewTip: 'Pairs well with Bundler3 and zap-style flow discussions.'
  },
  {
    q: 'Which story best supports the argument that Morpho can be a platform for curator businesses, not just end-user products?',
    options: [
      'Gauntlet and Steakhouse',
      'Only Coinbase',
      'Only Binance',
      'Only World'
    ],
    correct: 0,
    explanation: 'Gauntlet and Steakhouse are the clearest proof that curation itself can be a scaled business on Morpho.',
    category: 'customer-stories',
    difficulty: 'fundamental',
    module_slug: 'vault-v2-deep-dive',
    interviewTip: 'Great when discussing curator incentives and business models.'
  },
  {
    q: 'What common pattern shows up across Coinbase, OKX, Binance, Crypto.com, and Bitget?',
    options: [
      'They keep distribution and UX while Morpho provides noncustodial lending rails underneath.',
      'They each had to build a proprietary loan book from scratch.',
      'They each replaced wallet abstractions with raw contract UIs.',
      'They use Morpho only for governance participation.'
    ],
    correct: 0,
    explanation: 'These stories repeatedly show exchanges owning UX and distribution while Morpho powers transparent onchain backend rails.',
    category: 'customer-stories',
    difficulty: 'fundamental',
    module_slug: 'partner-communication-and-objections',
    interviewTip: 'This is the universal-lending-network sales pattern.'
  }
];

const CUSTOMER_STORY_OPEN_ENDED_QUESTIONS = [
  {
    id: 27,
    question: 'A regulated custody partner asks how Morpho could fit inside existing custody controls. Answer using the Anchorage story as your model.',
    category: 'partner-communication',
    difficulty: 'advanced',
    rubric: [
      'Explains that vault receipt tokens can remain inside existing custody',
      'Explains that no separate unmanaged wallet workflow is required',
      'Keeps custody, policy, and operational controls central to the answer',
      'Positions Morpho as the noncustodial execution layer underneath',
      'Sounds institution-ready rather than retail-oriented'
    ],
    followUp: 'What concerns would you proactively surface before saying the integration is ready?'
  },
  {
    id: 28,
    question: 'Explain the DeFi mullet pattern to a fintech or exchange prospect using Coinbase, Crypto.com, or Binance as evidence.',
    category: 'partner-communication',
    difficulty: 'intermediate',
    rubric: [
      'Defines the pattern clearly as polished frontend plus DeFi backend',
      'Explains why Morpho is a strong backend for that model',
      'Mentions transparency, noncustodial rails, and existing borrower demand',
      'Uses at least one concrete customer example',
      'Keeps the answer commercially useful'
    ],
    followUp: 'What would you tell a partner who worries DeFi abstraction will weaken user trust?'
  },
  {
    id: 29,
    question: 'A chain team wants to know whether Morpho can power infrastructure-level revenue, not just a wallet earn tab. Answer with the Vault Bridge pattern.',
    category: 'poc-readiness',
    difficulty: 'advanced',
    rubric: [
      'Explains productive bridged collateral or idle escrow clearly',
      'Mentions revenue being routed back to the chain or ecosystem',
      'States that the user-facing bridge flow can remain familiar',
      'Positions Morpho vaults as the yield engine',
      'Avoids implying risk disappears'
    ],
    followUp: 'What dashboards would you build first for a chain team exploring this model?'
  },
  {
    id: 30,
    question: 'How would you explain Morpho’s value to an RWA issuer using Ondo, Apollo, or Midas as examples?',
    category: 'objection-handling',
    difficulty: 'advanced',
    rubric: [
      'Explains productive collateral or borrow utility for tokenized assets',
      'Connects isolated markets to safer onboarding of new asset classes',
      'Mentions liquidity access without building lending infrastructure from scratch',
      'Uses at least one concrete case study',
      'Balances excitement with risk-awareness'
    ],
    followUp: 'What would make you recommend a dedicated isolated market instead of a more generic vault route?'
  }
];

module.exports = {
  CUSTOMER_STORIES,
  CUSTOMER_STORY_QUIZ_QUESTIONS,
  CUSTOMER_STORY_OPEN_ENDED_QUESTIONS
};
