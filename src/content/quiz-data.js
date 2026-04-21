/**
 * Quiz Questions - Hand-written, high quality
 * Organized by module
 */

const QUIZ_QUESTIONS = [
  // Module 1: Protocol Foundations
  {
    module: 'protocol-foundations',
    questions: [
      {
        q: 'What is Morpho\'s core value proposition?',
        options: [
          'A lending optimizer that matches lenders and borrowers P2P while maintaining pool liquidity',
          'A competing lending protocol to replace Aave and Compound',
          'A governance token for DeFi lending protocols',
          'An NFT marketplace for lending positions'
        ],
        correct: 0,
        explanation: 'Morpho optimizes existing lending pools through P2P matching. It doesn\'t replace protocols - it makes them better.',
        difficulty: 'fundamental'
      },
      {
        q: 'What is the key difference between isolated and pooled lending?',
        options: [
          'Isolated markets contain risk per market; pooled lending shares risk across all assets',
          'Isolated lending has higher gas fees than pooled lending',
          'Isolated lending only supports one asset pair per protocol',
          'Pooled lending offers better rates than isolated lending'
        ],
        correct: 0,
        explanation: 'In isolated markets, each collateral/borrow pair has independent risk parameters. In pooled lending, all assets share the same risk pool.',
        difficulty: 'fundamental'
      },
      {
        q: 'Calculate the Health Factor: Collateral = 1000 USDC, Price = $1.00, LLTV = 86.5%, Borrowed = 800 USDC',
        options: ['1.08', '1.25', '0.95', '1.50'],
        correct: 0,
        explanation: 'HF = (1000 × 1.00 × 0.865) / 800 = 865 / 800 = 1.08125',
        difficulty: 'intermediate'
      },
      {
        q: 'What does LLTV stand for?',
        options: [
          'Liquidation Loan-to-Value',
          'Lending Liquidity Threshold Value',
          'Liquidation Limit Threshold Value',
          'Leveraged Lending Total Value'
        ],
        correct: 0,
        explanation: 'LLTV = Liquidation Loan-to-Value. It represents the maximum borrowing power of collateral before liquidation.',
        difficulty: 'fundamental'
      },
      {
        q: 'When is a position liquidatable?',
        options: [
          'When Health Factor < 1',
          'When LLTV > 90%',
          'When collateral price drops 10%',
          'When interest accrues for 30 days'
        ],
        correct: 0,
        explanation: 'Liquidation occurs when Health Factor falls below 1, meaning borrowed value exceeds max borrow capacity.',
        difficulty: 'fundamental'
      },
      {
        q: 'What is the Morpho Blue contract address?',
        options: [
          '0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb',
          '0x1111111111111111111111111111111111111111',
          '0x0000000000000000000000000000000000000000',
          '0xAAAAAA... (varies by chain)'
        ],
        correct: 0,
        explanation: 'Morpho Blue uses vanity address 0xBBBB... and is the same on all supported chains.',
        difficulty: 'intermediate'
      },
      {
        q: 'A partner asks: "How does isolated lending benefit our LRT integration?" Best response:',
        options: [
          'Your LRT can have its own market with custom parameters instead of competing in a shared risk pool',
          'Isolated lending is more expensive but safer',
          'It doesn\'t affect your integration significantly',
          'All LRTs must use the same market parameters'
        ],
        correct: 0,
        explanation: 'Isolated markets allow custom risk parameters per asset. Partners can create dedicated markets for their tokens.',
        difficulty: 'intermediate'
      },
      {
        q: 'What happens to liquidation incentive?',
        options: [
          'Liquidator receives collateral at a discount (no protocol fee)',
          'Protocol takes 10% as liquidation fee',
          'Borrower pays a penalty to the protocol',
          'Incentive is distributed to all lenders'
        ],
        correct: 0,
        explanation: 'Morpho has no protocol-level liquidation penalty. The liquidator\'s profit comes from the collateral discount.',
        difficulty: 'intermediate'
      },
      {
        q: 'Calculate the liquidation price: 1 ETH collateral, borrowed $1700 USDC, LLTV 86.5%',
        options: ['$1,965', '$1,700', '$2,000', '$1,500'],
        correct: 0,
        explanation: 'LiqPrice = Borrowed / (Collateral × LLTV) = 1700 / (1 × 0.865) = $1,965.32',
        difficulty: 'intermediate'
      },
      {
        q: 'Why is Morpho Blue immutable?',
        options: [
          'To provide predictability and trustlessness - no admin can change rules',
          'To save on gas costs',
          'To make upgrades easier',
          'To allow governance to change parameters quickly'
        ],
        correct: 0,
        explanation: 'Immutability means the contract code cannot be upgraded. Partners know the rules won\'t change unexpectedly.',
        difficulty: 'intermediate'
      }
    ]
  },
  // Module 2: Architecture
  {
    module: 'architecture-deep-dive',
    questions: [
      {
        q: 'What are the 4 roles in MetaMorpho?',
        options: [
          'Owner, Curator, Guardian, Allocator',
          'Admin, Manager, Guardian, User',
          'Owner, Curator, Guardian, Depositor',
          'Governor, Curator, Guardian, Strategist'
        ],
        correct: 0,
        explanation: 'The 4 roles are: Owner (fees/governance), Curator (strategy), Guardian (emergency pause), Allocator (execution).',
        difficulty: 'fundamental'
      },
      {
        q: 'What can the GUARDIAN role do?',
        options: [
          'Only emergency pause the vault',
          'Change the allocation strategy',
          'Set fees and fee recipient',
          'Unpause the vault after pausing'
        ],
        correct: 0,
        explanation: 'The Guardian can ONLY pause. They cannot unpause (only Owner can) or change any parameters.',
        difficulty: 'intermediate'
      },
      {
        q: 'What is MetaMorpho?',
        options: [
          'ERC4626 vaults on top of Morpho Blue with professional risk management',
          'The governance token for Morpho',
          'A competing lending protocol',
          'An NFT collection for lenders'
        ],
        correct: 0,
        explanation: 'MetaMorpho is the permissionless vault layer on Blue. It implements ERC4626 and offers professional curation.',
        difficulty: 'fundamental'
      },
      {
        q: 'What is Bundler3 used for?',
        options: [
          'Atomic multi-step transactions like leverage and flash loans',
          'Batch oracle price updates',
          'Governance voting aggregation',
          'Cross-chain bridging'
        ],
        correct: 0,
        explanation: 'Bundler3 enables atomic execution of multiple actions, critical for leverage, deleverage, and complex operations.',
        difficulty: 'intermediate'
      },
      {
        q: 'What is the difference between V1.1 and V2 MetaMorpho?',
        options: [
          'V2 adds adapters for external protocols; V1.1 is Morpho-only',
          'V2 removes ERC4626 compliance',
          'V1.1 has higher fees than V2',
          'V2 requires governance approval for all vaults'
        ],
        correct: 0,
        explanation: 'V2 introduces adapters allowing vaults to allocate to protocols beyond Morpho Blue (Aave, Compound, etc.).',
        difficulty: 'intermediate'
      }
    ]
  },
  // Module 3: Integration
  {
    module: 'integration-patterns',
    questions: [
      {
        q: 'Which SDK package should you use for Morpho integration?',
        options: [
          '@morpho-org/blue-sdk',
          '@morpho/core',
          'morpho-js',
          'ethers-morpho'
        ],
        correct: 0,
        explanation: '@morpho-org/blue-sdk is the official TypeScript SDK for Morpho integration.',
        difficulty: 'fundamental'
      },
      {
        q: 'What are the 5 MarketParams?',
        options: [
          'Loan token, collateral token, oracle, IRM, LLTV',
          'Name, symbol, decimals, supply, borrow',
          'Owner, curator, guardian, allocator, fee',
          'Chain ID, pool ID, token A, token B, fee tier'
        ],
        correct: 0,
        explanation: 'MarketParams defines a market: loanToken, collateralToken, oracle, irm, and lltv.',
        difficulty: 'fundamental'
      },
      {
        q: 'A partner gets "INSUFFICIENT_COLLATERAL" error. What\'s the issue?',
        options: [
          'The borrow would make Health Factor < 1',
          'They don\'t have enough ETH for gas',
          'The market doesn\'t have enough liquidity',
          'The oracle is stale'
        ],
        correct: 0,
        explanation: 'This error means the transaction would result in a liquidatable position (HF < 1).',
        difficulty: 'intermediate'
      },
      {
        q: 'Why use Bundler3 instead of direct transactions?',
        options: [
          'For atomic multi-step operations that revert together if one fails',
          'It\'s cheaper than direct transactions',
          'It requires less gas',
          'It\'s required for all Morpho transactions'
        ],
        correct: 0,
        explanation: 'Bundler3 ensures all actions succeed or fail together, preventing partial states in complex operations.',
        difficulty: 'intermediate'
      },
      {
        q: 'What should you check before going to production?',
        options: [
          'Oracle freshness, slippage protection, access control, emergency procedures',
          'Only that the code compiles',
          'That gas costs are minimal',
          'That the UI looks good'
        ],
        correct: 0,
        explanation: 'Security checklist: oracle validation, slippage protection, access control, reentrancy guards, emergency procedures.',
        difficulty: 'intermediate'
      }
    ]
  },
  // Module 4: Partner Communication
  {
    module: 'partner-communication',
    questions: [
      {
        q: 'A partner asks: "Why Morpho instead of Aave?" Best response:',
        options: [
          'Morpho offers isolated markets with custom parameters for your specific use case',
          'Morpho is newer and more innovative',
          'Aave doesn\'t support your token',
          'Morpho has lower gas fees for all transactions'
        ],
        correct: 0,
        explanation: 'Focus on the specific benefit (isolated markets) and tie it to their use case. Avoid vague claims.',
        difficulty: 'intermediate'
      },
      {
        q: 'Partner is frustrated about integration delay. What do you do?',
        options: [
          'Acknowledge frustration, take ownership, provide timeline, offer workaround',
          'Blame the engineering team',
          'Tell them to be patient',
          'Escalate immediately without investigating'
        ],
        correct: 0,
        explanation: 'Empathy + ownership + clear communication. Partners need to feel heard and informed.',
        difficulty: 'intermediate'
      },
      {
        q: 'When explaining technical concepts to non-technical partners:',
        options: [
          'Use analogies from their domain and link to their specific use case',
          'Use precise technical terminology to be accurate',
          'Avoid explaining and just provide code',
          'Tell them to hire a technical consultant'
        ],
        correct: 0,
        explanation: 'Translation is key. Use analogies and always connect to partner impact.',
        difficulty: 'intermediate'
      },
      {
        q: 'A partner asks for a feature Morpho doesn\'t have. Response:',
        options: [
          'Explain why it\'s not available and offer alternative solutions',
          'Promise to build it soon',
          'Say Morpho will never have that',
          'Ignore the request'
        ],
        correct: 0,
        explanation: 'Be honest about limitations but helpful with alternatives. Never promise what you can\'t deliver.',
        difficulty: 'intermediate'
      }
    ]
  },
  // Module 5: Core Math & Formulas
  {
    module: 'core-math-and-formulas',
    questions: [
      {
        q: 'Oracle price in Morpho uses what scale factor?',
        options: ['1e36', '1e18', '1e8', '1e6'],
        correct: 0,
        explanation: 'Oracle prices are scaled by 1e36. collateralValue = (collateral * oraclePrice) / 1e36.',
        difficulty: 'fundamental'
      },
      {
        q: 'The Health Factor formula is:',
        options: [
          'HF = (collateralValue × LLTV) / borrowAssets',
          'HF = borrowAssets / collateralValue',
          'HF = collateralValue / (LLTV × borrowAssets)',
          'HF = LLTV / (borrowAssets / collateralValue)'
        ],
        correct: 0,
        explanation: 'HF = maxBorrow / borrowAssets = (collateralValue × LLTV) / borrowAssets. HF < 1 is liquidatable.',
        difficulty: 'fundamental'
      },
      {
        q: 'A borrower has 10 ETH collateral (price $3,000), borrowed $20,000 USDC, LLTV 86%. What is their HF?',
        options: ['1.29', '1.50', '0.90', '1.08'],
        correct: 0,
        explanation: 'collateralValue = 10 × 3000 = $30,000. maxBorrow = 30,000 × 0.86 = $25,800. HF = 25,800 / 20,000 = 1.29.',
        difficulty: 'intermediate'
      },
      {
        q: 'LLTV is stored in Morpho contracts in what format?',
        options: [
          'WAD (1e18 = 100%)',
          'Percentage integer (86 = 86%)',
          'Basis points (8600 = 86%)',
          'Fixed point 1e6 (860000 = 86%)'
        ],
        correct: 0,
        explanation: 'LLTV uses WAD format. An LLTV of 86% is stored as 860000000000000000 (0.86 × 10^18).',
        difficulty: 'intermediate'
      },
      {
        q: 'For borrow share-to-asset conversion, which rounding direction is correct and why?',
        options: [
          'Round UP — so borrowers owe at least the real debt, preventing protocol bad debt',
          'Round DOWN — to favor borrowers',
          'Round to nearest — for fairness',
          'No rounding needed — shares are exact'
        ],
        correct: 0,
        explanation: 'Borrow shares convert UP (toAssetsUp) to ensure the protocol does not undercollect. Supply shares convert DOWN (toAssetsDown) to ensure suppliers do not over-receive.',
        difficulty: 'advanced'
      },
      {
        q: 'The AdaptiveCurveIRM targets what utilization rate, and how fast does it adjust?',
        options: [
          '90% target; rate doubles/halves every 50 hours when util is 100%/0%',
          '80% target; rate doubles/halves every 24 hours',
          '75% target; rate adjusts linearly over 30 days',
          '95% target; rate is fixed unless governance changes it'
        ],
        correct: 0,
        explanation: 'AdaptiveCurveIRM targets 90% utilization. At 100% util the rate doubles in ~50 hours; at 0% it halves. The adjustment is logarithmic per the docs.',
        difficulty: 'advanced'
      },
      {
        q: 'The Liquidation Incentive Factor (LIF) formula rewards liquidators by giving them collateral at a discount. The LIF upper bound is:',
        options: [
          'min(maxLIF, 1 / (1 - LLTV)) where maxLIF is a protocol constant (1.15 = 15% max bonus)',
          '10% fixed regardless of LLTV',
          '(1 - LLTV) × 2',
          'Always exactly 5%'
        ],
        correct: 0,
        explanation: 'LIF = min(maxLIF, 1/LLTV - 1). Higher LLTV markets have less room for liquidation bonus. maxLIF caps the bonus at 15%.',
        difficulty: 'advanced'
      }
    ]
  },
  // Module 6: Vault V2 Deep Dive
  {
    module: 'vault-v2-deep-dive',
    questions: [
      {
        q: 'In Vault V2, what are the TWO adapter types used to access Morpho Blue markets?',
        options: [
          'MorphoMarketV1AdapterV2 (direct market access) and MorphoVaultV1Adapter (V1 vault wrapping)',
          'LendingAdapter and BorrowAdapter',
          'BlueBridgeAdapter and VaultGateway',
          'MarketRouterV2 and MetaMorphoConnector'
        ],
        correct: 0,
        explanation: 'MorphoMarketV1AdapterV2 allocates directly to Morpho Blue markets and has its own timelock. MorphoVaultV1Adapter wraps exposure to an existing Vault V1 and has no separate timelock.',
        difficulty: 'fundamental'
      },
      {
        q: 'A Vault V2 allocation through MorphoMarketV1AdapterV2 must satisfy how many cap layers?',
        options: [
          'Three: adapter cap, collateral token cap, and market cap — all must be non-zero',
          'One: only the market cap',
          'Two: adapter cap and market cap',
          'No caps apply — allocation is unlimited by default'
        ],
        correct: 0,
        explanation: 'All three cap layers must be non-zero: adapter cap, collateral ID cap, and market ID cap. If any is zero, no allocation flows to that market.',
        difficulty: 'intermediate'
      },
      {
        q: 'The "liquidity adapter" in a Vault V2 context refers to:',
        options: [
          'The single adapter used for user deposits and withdrawals — it points to one market at a time via liquidityData',
          'An adapter that provides flash loan liquidity',
          'The adapter with the highest TVL in the vault',
          'A special Chainlink-connected adapter for price discovery'
        ],
        correct: 0,
        explanation: 'The liquidity adapter is the deposit/withdrawal path. It can point to only one underlying market at a time via liquidityData. There is no automatic fallthrough across markets.',
        difficulty: 'intermediate'
      },
      {
        q: 'In Vault V2 cap encoding, what is the collateral ID?',
        options: [
          'abi.encode("collateralToken", collateralTokenAddress)',
          'abi.encode("collateral", marketId)',
          'keccak256(collateralTokenAddress)',
          'abi.encode("asset", loanTokenAddress, collateralTokenAddress)'
        ],
        correct: 0,
        explanation: 'collateralId = abi.encode("collateralToken", collateralTokenAddress). This abstract ID allows a single cap to limit total collateral exposure across all markets using that collateral.',
        difficulty: 'advanced'
      },
      {
        q: 'When does Vault V2 realize a loss from a market position?',
        options: [
          'When adapter.realAssets() reports less than the previously tracked assets — the difference is written off and socialized through share price depreciation',
          'Immediately when any borrower in the market is liquidated',
          'When the vault guardian calls emergencyPause()',
          'Only when the curator manually calls markLoss()'
        ],
        correct: 0,
        explanation: 'Loss is realized when an adapter\'s realAssets() returns less than tracked. The vault writes down totalAssets and all depositors share the loss proportionally via lower share prices.',
        difficulty: 'advanced'
      },
      {
        q: 'Vault V2 relative caps use what scale where 100% is represented as:',
        options: [
          '1e18 (WAD format)',
          '100 (plain integer)',
          '10000 (basis points)',
          '1e6'
        ],
        correct: 0,
        explanation: 'Relative caps follow WAD format: 1e18 = 100%. A relative cap of 0.2e18 means at most 20% of vault assets can flow to that adapter/market.',
        difficulty: 'intermediate'
      }
    ]
  },
  // Module 7: Merkl, Rewards & API Patterns
  {
    module: 'real-world-integrations',
    questions: [
      {
        q: 'What is the primary Morpho GraphQL API endpoint?',
        options: [
          'https://api.morpho.org/graphql',
          'https://graphql.morpho.xyz/v1',
          'https://subgraph.morpho.org/query',
          'https://data.morpho.org/gql'
        ],
        correct: 0,
        explanation: 'The canonical Morpho API endpoint is https://api.morpho.org/graphql. It has a max query complexity of 1,000,000 and a rate limit of 5,000 requests per 5 minutes.',
        difficulty: 'fundamental'
      },
      {
        q: 'Merkl updates its Merkle tree (and thus onchain claimable amounts) how often?',
        options: [
          'Every 8 hours',
          'Every block',
          'Once per day at midnight UTC',
          'Every hour'
        ],
        correct: 0,
        explanation: 'Merkl generates a new Merkle root every 8 hours. Users see near-real-time reward accrual in the UI, but the onchain claimable amount lags up to 8 hours.',
        difficulty: 'fundamental'
      },
      {
        q: 'The Merkl API endpoint for fetching a user\'s claimable reward amounts and Merkle proofs is:',
        options: [
          'GET https://api.merkl.xyz/v4/claim?user={address}&chainId={chainId}',
          'GET https://api.merkl.xyz/rewards/{address}',
          'POST https://merkl.xyz/api/v1/claim',
          'GET https://api.morpho.org/rewards?user={address}'
        ],
        correct: 0,
        explanation: 'The Merkl claim endpoint returns claimable amounts and Merkle proofs needed for the onchain claim transaction: GET https://api.merkl.xyz/v4/claim?user={address}&chainId={chainId}',
        difficulty: 'intermediate'
      },
      {
        q: 'In the Merkl distributor claim function signature, what four arguments are required?',
        options: [
          'user (address), tokens (address[]), amounts (uint256[]), proofs (bytes32[][])',
          'user (address), amount (uint256), token (address), proof (bytes32)',
          'merkleRoot (bytes32), recipient (address), data (bytes), signature (bytes)',
          'account (address), reward (address), claimable (uint256), proof (bytes32[])'
        ],
        correct: 0,
        explanation: 'Merkl distributor: claim(address user, address[] tokens, uint256[] amounts, bytes32[][] proofs). Note the plural proofs as bytes32[][] — one proof array per token.',
        difficulty: 'advanced'
      },
      {
        q: 'When displaying vault yield, which format is correct?',
        options: [
          'Show base APY and reward APR separately BEFORE also showing combined yield',
          'Show combined yield only — breakdown confuses users',
          'Show reward APR only if it exceeds 1%',
          'Always show combined yield first, then explain base vs rewards on hover'
        ],
        correct: 0,
        explanation: 'Always decompose before combining. Show base APY and each reward APR individually first, then combined. Partners who only see the combined number cannot explain yield changes to their own users.',
        difficulty: 'intermediate'
      },
      {
        q: 'The legacy Morpho rewards API (rewards.morpho.org) was deprecated when?',
        options: [
          'July 2025 following MIP 111 — all new programs use Merkl exclusively',
          'January 2024',
          'It is still active and recommended for new integrations',
          'It was never deprecated — it runs alongside Merkl'
        ],
        correct: 0,
        explanation: 'Per MIP 111 (July 2025), all reward programs migrated to Merkl. The legacy API is deprecated. Use rewards-legacy.morpho.org for unclaimed historical rewards only.',
        difficulty: 'intermediate'
      }
    ]
  },
  // Module 8: Bundler3 & Atomic Flows
  {
    module: 'integration-patterns-and-sdks',
    questions: [
      {
        q: 'Bundler3 executes a list of calls atomically via which function?',
        options: [
          'multicall(Call[] calldata calls)',
          'execute(bytes[] actions)',
          'bundle(Action[] actions, bool revertOnFail)',
          'batchCall(address[] targets, bytes[] data)'
        ],
        correct: 0,
        explanation: 'Bundler3.multicall(Call[] calldata calls) is the entry point. Each Call is {address target, bytes data, uint256 value, bool allowFailure}.',
        difficulty: 'fundamental'
      },
      {
        q: 'In a leverage loop using Bundler3, borrowed USDC should be routed to the bundler (not the user) because:',
        options: [
          'The bundler must hold the funds to use them in the next step — routing to user would require a second transaction',
          'Sending to user triggers a tax event',
          'The Morpho contract only allows bundler as a recipient',
          'Routing to user would inflate the user\'s borrow position'
        ],
        correct: 0,
        explanation: 'In a leverage bundle, borrow() routes funds to the bundler so they can be used atomically in the next step (swap + re-supply). Routing to the user exits the atomic context.',
        difficulty: 'intermediate'
      },
      {
        q: 'What is the "Call3Value" pattern in Bundler3, and when do you need it?',
        options: [
          'A call struct that includes a value field for ETH forwarding — needed when a step wraps ETH or pays fees in native token',
          'A 3-step ERC-20 approval pattern',
          'A pattern for verifying oracle prices mid-bundle',
          'A callback pattern for flash loan repayment'
        ],
        correct: 0,
        explanation: 'Call3Value extends Call with a value field for ETH. Used when the bundle includes WETH wrapping, native ETH deposits, or any step requiring msg.value.',
        difficulty: 'advanced'
      },
      {
        q: 'A flash loan inside a Bundler3 bundle: where must repayment logic live?',
        options: [
          'In a callback function called by the flash loan provider, which must be triggered within the same multicall context',
          'In a separate transaction after the bundle completes',
          'The bundler handles repayment automatically',
          'Flash loans are not supported through Bundler3'
        ],
        correct: 0,
        explanation: 'Flash loan repayment must happen within the callback triggered by the flash loan provider — still within the same multicall. The callbackHash must be set correctly in the bundle to authorize the callback.',
        difficulty: 'advanced'
      },
      {
        q: 'When should you use `skipRevert: true` on a call inside a Bundler3 bundle?',
        options: [
          'Only for non-critical cleanup steps that should not block the entire bundle if they fail',
          'Always — it makes bundles more gas-efficient',
          'Never — all calls should revert together',
          'Only for oracle price update calls'
        ],
        correct: 0,
        explanation: 'skipRevert: true means a single call\'s failure does not revert the whole bundle. Use sparingly and only on truly non-critical steps. Never use it on supply, borrow, or repay steps where partial execution creates invalid state.',
        difficulty: 'advanced'
      }
    ]
  }
];

// Flatten for database seeding
function getAllQuestions() {
  const all = [];
  QUIZ_QUESTIONS.forEach(module => {
    module.questions.forEach((q, idx) => {
      all.push({
        ...q,
        id: `${module.module}-${idx}`,
        module_slug: module.module,
        interview_tip: q.explanation.slice(0, 100) + '...'
      });
    });
  });
  return all;
}

module.exports = { QUIZ_QUESTIONS, getAllQuestions };
