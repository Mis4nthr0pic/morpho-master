/**
 * Content Loader - Populates database with comprehensive training content
 */

const fs = require('fs');
const path = require('path');

// Comprehensive Learning Modules
const LEARNING_MODULES = [
  {
    slug: 'what-is-morpho',
    title: 'Module 1: What is Morpho?',
    category: 'fundamental',
    durationMinutes: 45,
    orderIndex: 1,
    content: `
# What is Morpho?

Morpho is a **decentralized lending protocol** with two main products:

## 1. Morpho Markets (V1)
Isolated lending pairs where each market has its own:
- Collateral token
- Loan token
- LLTV (Liquidation Loan-to-Value)
- Oracle
- Interest Rate Model (IRM)

## 2. Morpho Vaults (V1.1 & V2)
ERC4626-compatible vaults that:
- Accept deposits
- Allocate across multiple markets
- Optimize for yield
- Managed by curators

## Key Innovation: Isolated Markets

### Traditional (Pooled) Lending
All assets share one risk pool. If one asset fails, the whole pool suffers.

### Morpho (Isolated) Lending
Each market is independent. Problems stay contained.

## Important Numbers
- **$10B+** Total Value Locked
- **0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb** - Morpho Blue address
- **No protocol fees** - Users keep all yield
- **Immutable core** - Markets can't be changed once created

## Investors
Morpho raised $70M from: a16z, Coinbase Ventures, Pantera, Ribbit Capital, Brevan Howard, and 50+ others.
    `,
    keyPoints: [
      'Morpho uses isolated markets, not pooled risk',
      'Two products: Markets (V1) and Vaults (V1.1/V2)',
      '$10B+ TVL, backed by top investors',
      'Immutable core protocol at 0xBBBB...',
      'No protocol fees'
    ],
    must Memorize: [
      'Morpho Blue address: 0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb',
      'MetaMorpho Factory: 0x1897A8997241C1cD4bD0698647e4EB7213535c24'
    ]
  },
  {
    slug: 'lltv-liquidation',
    title: 'Module 2: LLTV & Liquidation Math',
    category: 'fundamental',
    durationMinutes: 60,
    orderIndex: 2,
    content: `
# LLTV & Liquidation Math

## LLTV (Liquidation Loan-to-Value)

LLTV defines maximum borrowing power:

**Formula:**
\`\`\`
Max Borrow = Collateral Value × LLTV
\`\`\`

**Example:**
- 5 ETH collateral worth $10,000
- LLTV: 80% (0.8)
- Max Borrow = $10,000 × 0.8 = $8,000

## Health Factor

Measures position safety:

**Formula:**
\`\`\`
Health Factor = (Collateral Value × LLTV) / Borrowed Amount
\`\`\`

**Interpretation:**
- HF > 1: Healthy (can borrow more)
- HF = 1: At maximum (can't borrow more)
- HF < 1: LIQUIDATABLE

## Liquidation Example

\`\`\`
Position:
- 5 ETH at $2,000/ETH = $10,000 collateral
- LLTV: 80%
- Borrowed: $7,000 USDC

Health Factor = ($10,000 × 0.8) / $7,000 = 1.14 → HEALTHY

If ETH drops to $1,600:
Collateral = $8,000
Health Factor = ($8,000 × 0.8) / $7,000 = 0.91 → LIQUIDATABLE!
\`\`\`

## Liquidation Mechanics

- **Permissionless:** Anyone can liquidate
- **Partial:** Can liquidate any amount up to full debt
- **Incentive:** Liquidators get bonus (typically 5-10%)
- **Bad Debt:** If collateral < debt, loss shared by suppliers

## Formulas to Memorize

\`\`\`typescript
const WAD = 10n ** 18n;

// Health Factor
HF = (collateral * price * lltv) / (borrow * WAD)

// Liquidation Price
Liquidation Price = (borrow * WAD * WAD) / (collateral * lltv)
\`\`\`
    `,
    keyPoints: [
      'LLTV = max borrow as % of collateral value',
      'Health Factor > 1 = safe, < 1 = liquidatable',
      'Liquidations are permissionless with incentive',
      'Bad debt is socialized among suppliers'
    ],
    practiceProblems: [
      {
        question: '10 ETH at $2,500/ETH, LLTV 86%, Borrowed $18,000. What is Health Factor?',
        answer: 'HF = (25,000 × 0.86) / 18,000 = 1.19',
        explanation: 'Collateral value × LLTV divided by borrowed amount'
      },
      {
        question: 'Same position - at what ETH price does liquidation occur?',
        answer: '$2,093/ETH',
        explanation: 'Liquidation price = Borrow / (Collateral × LLTV) = 18,000 / (10 × 0.86)'
      }
    ]
  },
  {
    slug: 'four-roles',
    title: 'Module 3: The 4-Role System',
    category: 'intermediate',
    durationMinutes: 45,
    orderIndex: 3,
    content: `
# The 4-Role System (MetaMorpho)

MetaMorpho vaults separate powers across 4 roles for security:

## 1. Owner
**Responsibilities:**
- Set fees (entry, exit, performance)
- Manage roles (assign/remove curators, guardians)
- Critical changes

**Constraints:**
- Timelocked (minimum 3-7 days)
- Gives users time to exit before changes

## 2. Curator
**Responsibilities:**
- Set allocation strategy
- Choose which markets to allocate to
- Set market caps (max per market)

**Constraints:**
- Guardian can emergency pause
- Allocator executes within curator's caps

## 3. Guardian
**Responsibilities:**
- Emergency pause capability
- Protect against exploits

**Constraints:**
- Can ONLY pause (cannot unpause)
- Cannot change strategy or move funds

## 4. Allocator
**Responsibilities:**
- Execute rebalancing transactions
- Move funds between markets

**Constraints:**
- Can only move to markets curator approved
- Cannot exceed market caps
- Typically a bot/operator

## Why Separate?

**Security through separation:**
- Even if curator is malicious → guardian can pause, caps limit exposure
- Even if owner wants changes → timelock delays them
- Guardian is limited → can only pause, not steal
- Allocator is restricted → can only execute within bounds

## Timelock Minimums

| Function | Minimum Timelock |
|----------|------------------|
| Set gates (deposit/withdraw limits) | 7 days |
| Add adapter | 3 days |
| Change fee | 3-7 days |
| Remove guardian | 7 days |
    `,
    keyPoints: [
      'Owner: Governance, fees, timelocked',
      'Curator: Strategy, market selection',
      'Guardian: Emergency pause only',
      'Allocator: Execution within bounds',
      'Separation protects users from single bad actor'
    ]
  },
  {
    slug: 'bundler3',
    title: 'Module 4: Bundler3 Atomic Operations',
    category: 'intermediate',
    durationMinutes: 45,
    orderIndex: 4,
    content: `
# Bundler3: Atomic Multi-Step Operations

## What is Bundler3?

Bundler3 allows multiple operations in **one atomic transaction**:
- **All succeed** → transaction succeeds
- **Any fails** → ALL revert (nothing happens)

## Common Use Case: Leveraged Position

**Goal:** Supply ETH → Borrow USDC → Swap for ETH → Supply more ETH

**Correct Order:**
1. Approve Morpho to spend collateral
2. Supply ETH collateral
3. Borrow USDC
4. Swap USDC for ETH
5. Supply swapped ETH

**Why This Order Matters:**
- Can't borrow before supplying collateral (no backing)
- Can't supply swapped tokens before swapping
- Atomic = if swap fails, no borrow happened, collateral safe

## Key Adapters

| Adapter | Purpose |
|---------|---------|
| GeneralAdapter1 | Core Morpho (supply, borrow, repay) |
| ERC20WrapperAdapter | Wrap/unwrap (WETH) |
| ParaswapAdapter | DEX swaps |
| AaveV3MigrationAdapter | Migrate from Aave |

## Code Pattern

\`\`\`typescript
const bundle = [
  // 1. Supply collateral FIRST
  {
    adapter: GeneralAdapter1,
    data: encodeSupplyCollateral(market, collateral, user)
  },
  // 2. Borrow SECOND
  {
    adapter: GeneralAdapter1,
    data: encodeBorrow(market, amount, user)
  },
  // 3. Optional: Swap
  {
    adapter: ParaswapAdapter,
    data: encodeSwap(params, minAmountOut)
  }
];

// Execute atomically
await bundler3.multicall(bundle);
\`\`\`

## Common Mistake

**WRONG ORDER:**
\`\`\`
1. Borrow ← FAILS! No collateral yet
2. Supply collateral
\`\`\`

**Always:** Supply before Borrow
    `,
    keyPoints: [
      'Bundler3 = atomic multi-step operations',
      'All succeed or all revert',
      'Order matters: Supply before Borrow',
      'Adapters: GeneralAdapter1, ParaswapAdapter, etc.',
      'Include slippage protection on swaps'
    ]
  },
  {
    slug: 'sdk-integration',
    title: 'Module 5: SDK & Integration Patterns',
    category: 'intermediate',
    durationMinutes: 60,
    orderIndex: 5,
    content: `
# SDK & Integration Patterns

## SDK Structure

\`\`\`typescript
// Core entities
import { Market, Position, Vault } from '@morpho-org/blue-sdk';

// Viem integration (fetching)
import { fetchMarket, fetchPosition, fetchVault } from '@morpho-org/blue-sdk-viem';

// Bundler3
import { Bundler3, GeneralAdapter1 } from '@morpho-org/bundler3';
\`\`\`

## Fetching Data

\`\`\`typescript
// Market state
const market = await fetchMarket(client, marketParams);
// Returns: totalSupplyAssets, totalBorrowAssets, utilization, etc.

// User position
const position = await fetchPosition(client, marketParams, userAddress);
// Returns: supplyShares, borrowShares, collateral

// Vault info
const vault = await fetchVault(client, vaultAddress);
// Returns: totalAssets, totalSupply (shares), asset, fee, curator
\`\`\`

## ERC4626 Vault Interface

\`\`\`typescript
// Deposit assets, get shares
const shares = await vault.previewDeposit(assets);
await vault.deposit(assets, receiver);

// Withdraw by burning shares  
const assets = await vault.previewRedeem(shares);
await vault.redeem(shares, receiver, owner);

// Share price
const sharePrice = await vault.convertToAssets(10n**18n);
\`\`\`

## BigInt Rules (CRITICAL)

\`\`\`typescript
const WAD = 10n ** 18n;

// ✅ DO: Multiply first, then divide
const result = (a * b) / c;

// ✅ DO: Use BigInt literals
const value = 1000000000000000000n;

// ❌ DON'T: Convert to Number (loses precision!)
const bad = Number(bigIntValue); // NEVER

// ❌ DON'T: Divide first (truncates)
const wrong = a / b * c; // Loses precision
\`\`\`

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| insufficient liquidity | Utilization too high | Check available first |
| unauthorized | No permission | User calls setAuthorization |
| unhealthy position | Would liquidate | Add collateral first |
| slippage exceeded | Price moved | Increase tolerance or wait |
    `,
    keyPoints: [
      '@morpho-org/blue-sdk for entities',
      '@morpho-org/blue-sdk-viem for fetching',
      'Vaults are ERC4626 standard',
      'Never use Number() on BigInt',
      'Multiply before dividing for precision'
    ]
  },
  {
    slug: 'partner-communication',
    title: 'Module 6: Partner Communication',
    category: 'expert',
    durationMinutes: 45,
    orderIndex: 6,
    content: `
# Partner Communication

## Discovery Questions (Ask First)

1. **"What chain and tech stack?"**
   - Determines code examples to provide

2. **"Read or write integration?"**
   - Data display vs transactions (different complexity)

3. **"User flow - deposit, borrow, leverage?"**
   - Scopes the integration effort

4. **"Timeline?"**
   - Prioritize critical path

5. **"Risk tolerance?"**
   - Recommend appropriate vaults

## Explaining to Different Audiences

### To a CTO
Focus: Immutability, isolated risk, trust model
> "Morpho Blue is immutable lending infrastructure. Unlike upgradeable protocols, existing markets can never change - no governance risk, no admin keys."

### To a Product Manager
Focus: UX, yields, no fees
> "Users deposit once, curators optimize across markets. ERC4626 means we work with any wallet. No protocol fees means better APY."

### To Business Development
Focus: Growth, backing, speed
> "$10B TVL, fastest-growing, backed by a16z and Coinbase. SDK gets you live in days."

## Support Triage Flow

1. **GATHER:** Chain, contract, tx hash, error message
2. **CLASSIFY:** UI, transaction, oracle, or unexpected
3. **ISOLATE:** Reproduce locally, check API
4. **RESOLVE:** Fix or escalate with full context

## Stress Questions

**Q: "Aave has more TVL, why switch?"**
> "TVL isn't the only metric. Morpho is growing faster - we hit $10B in record time. Isolated markets offer better risk-adjusted yields. Many protocols offer both."

**Q: "What if there's a bug?"**
> "Blue is immutable and audited. If a bug exists, isolation contains it. We have guardian roles for emergency response."
    `,
    keyPoints: [
      'Ask: chain, stack, read/write, timeline, risk',
      'CTO: immutability, isolated risk',
      'PM: UX, yields, ERC4626',
      'BD: $10B, a16z, fast integration',
      'Triage: Gather → Classify → Isolate → Resolve'
    ]
  },
  {
    slug: 'the-pitch',
    title: 'Module 7: The 60-Second Pitch',
    category: 'critical',
    durationMinutes: 30,
    orderIndex: 7,
    content: `
# The 60-Second "Why Morpho?" Pitch

## Memorize This Template

\`\`\`
"Morpho is the fastest-growing lending protocol with over $10 billion 
in deposits. Unlike traditional pooled lending like Aave, Morpho uses 
isolated markets - each market is its own risk container with immutable 
parameters.

This means three key benefits:
First, no contagion risk - if one market has issues, it doesn't spread.
Second, better rates through market-specific optimization.
Third, permissionless - anyone can create markets.

For integrators, our MetaMorpho vaults are ERC4626 standard, so they work 
with any wallet or dashboard. Our TypeScript SDK means you can be 
production-ready in days, not weeks. And with $10B in deposits and 
backing from a16z, Coinbase Ventures, and Pantera, we're the new 
standard for DeFi lending."
\`\`\`

## Practice Tips

1. **Time yourself** - Should be 55-65 seconds
2. **Record yourself** - Listen back 5 times
3. **Practice daily** - Until it flows naturally
4. **Adapt slightly** - For different audiences

## Key Elements

✓ $10B+ TVL (credibility)
✓ Isolated vs pooled (differentiation)
✓ Three benefits (value)
✓ ERC4626 + SDK (ease of integration)
✓ Top investors (validation)
    `,
    keyPoints: [
      '60 seconds, no more, no less',
      'Lead with growth ($10B)',
      'Explain isolated markets',
      'Three clear benefits',
      'Close with integration ease'
    ]
  }
];

// Comprehensive Quiz Questions
const QUIZ_QUESTIONS = [
  // Module 1: What is Morpho?
  {
    questionId: 'm1-1',
    moduleSlug: 'what-is-morpho',
    prompt: 'What is the core difference between Morpho and Aave/Compound?',
    choices: [
      'Morpho has lower fees',
      'Morpho uses isolated markets vs pooled risk',
      'Morpho is only on Ethereum',
      'Morpho does not support borrowing'
    ],
    correctIndex: 1,
    explanation: 'Morpho\'s key innovation is isolated markets where each market is its own risk container, unlike Aave/Compound\'s pooled model.',
    category: 'fundamental',
    difficulty: 1
  },
  {
    questionId: 'm1-2',
    moduleSlug: 'what-is-morpho',
    prompt: 'What is the Morpho Blue contract address on Ethereum?',
    choices: [
      '0x1234567890abcdef...',
      '0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb',
      '0xA0b86a33E6441da5...',
      '0x0000000000000000...'
    ],
    correctIndex: 1,
    explanation: 'The iconic 0xBBBB... address is Morpho Blue\'s main contract.',
    category: 'fundamental',
    difficulty: 1
  },
  {
    questionId: 'm1-3',
    moduleSlug: 'what-is-morpho',
    prompt: 'How much has Morpho raised in funding?',
    choices: [
      '$10 million',
      '$30 million',
      '$70 million',
      '$100 million'
    ],
    correctIndex: 2,
    explanation: 'Morpho raised $70M from Ribbit Capital, a16z, Coinbase Ventures, Pantera, and 50+ others.',
    category: 'fundamental',
    difficulty: 2
  },
  
  // Module 2: LLTV & Liquidation
  {
    questionId: 'm2-1',
    moduleSlug: 'lltv-liquidation',
    prompt: 'A user has $10,000 in ETH collateral and the LLTV is 80%. What is their maximum borrow?',
    choices: [
      '$10,000',
      '$8,000',
      '$12,500',
      '$2,000'
    ],
    correctIndex: 1,
    explanation: 'Max Borrow = Collateral Value × LLTV = $10,000 × 80% = $8,000',
    category: 'fundamental',
    difficulty: 1
  },
  {
    questionId: 'm2-2',
    moduleSlug: 'lltv-liquidation',
    prompt: 'What happens when a position\'s health factor drops below 1?',
    choices: [
      'The position is automatically closed',
      'The position becomes liquidatable',
      'Interest rates increase',
      'Nothing happens'
    ],
    correctIndex: 1,
    explanation: 'HF < 1 means borrowed value exceeds max allowed, making the position eligible for liquidation.',
    category: 'fundamental',
    difficulty: 1
  },
  {
    questionId: 'm2-3',
    moduleSlug: 'lltv-liquidation',
    prompt: 'In Morpho\'s isolated model, if Market A has bad debt, what happens to Market B?',
    choices: [
      'Market B also suffers losses',
      'Market B is unaffected',
      'All markets are paused',
      'Governance must vote on resolution'
    ],
    correctIndex: 1,
    explanation: 'Isolated markets mean risk is contained. Bad debt in one market does not affect others.',
    category: 'fundamental',
    difficulty: 2
  },
  
  // Module 3: 4-Role System
  {
    questionId: 'm3-1',
    moduleSlug: 'four-roles',
    prompt: 'What are the four roles in MetaMorpho?',
    choices: [
      'Admin, User, Validator, Executor',
      'Owner, Curator, Guardian, Allocator',
      'Maker, Taker, Lender, Borrower',
      'Signer, Submitter, Verifier, Finalizer'
    ],
    correctIndex: 1,
    explanation: 'The 4-role system: Owner (governance), Curator (strategy), Guardian (emergency), Allocator (execution).',
    category: 'intermediate',
    difficulty: 1
  },
  {
    questionId: 'm3-2',
    moduleSlug: 'four-roles',
    prompt: 'What is the purpose of a timelock in MetaMorpho?',
    choices: [
      'To delay transactions for gas optimization',
      'To give users time to exit before changes take effect',
      'To prevent flash loan attacks',
      'To sync with Ethereum\'s block time'
    ],
    correctIndex: 1,
    explanation: 'Timelocks provide a safety window for users to withdraw if they disagree with upcoming changes.',
    category: 'intermediate',
    difficulty: 2
  },
  {
    questionId: 'm3-3',
    moduleSlug: 'four-roles',
    prompt: 'What can a Guardian do?',
    choices: [
      'Change allocation strategy',
      'Emergency pause only',
      'Set fees',
      'Move funds between markets'
    ],
    correctIndex: 1,
    explanation: 'Guardian can only emergency pause. They cannot change strategy, set fees, or move funds.',
    category: 'intermediate',
    difficulty: 2
  },
  
  // Module 4: Bundler3
  {
    questionId: 'm4-1',
    moduleSlug: 'bundler3',
    prompt: 'What is the main benefit of Bundler3?',
    choices: [
      'Lower gas costs',
      'Atomic multi-step operations',
      'Better UI components',
      'Automatic liquidations'
    ],
    correctIndex: 1,
    explanation: 'Bundler3 enables atomic bundles - multiple operations that either all succeed or all revert.',
    category: 'intermediate',
    difficulty: 1
  },
  {
    questionId: 'm4-2',
    moduleSlug: 'bundler3',
    prompt: 'What is the correct order for a supply-and-borrow bundle?',
    choices: [
      'Borrow first, then supply collateral',
      'Supply collateral first, then borrow',
      'Both at the same time',
      'Order doesn\'t matter'
    ],
    correctIndex: 1,
    explanation: 'Must supply collateral BEFORE borrowing. The borrow checks collateral value at execution time.',
    category: 'intermediate',
    difficulty: 2
  },
  
  // Module 5: SDK
  {
    questionId: 'm5-1',
    moduleSlug: 'sdk-integration',
    prompt: 'What is the correct way to handle BigInt division in JavaScript?',
    choices: [
      'Use Number() to convert first',
      'Multiply first, then divide',
      'Use regular division',
      'Convert to string'
    ],
    correctIndex: 1,
    explanation: 'BigInt division truncates. Multiply first to preserve precision, then divide.',
    category: 'intermediate',
    difficulty: 2
  },
  {
    questionId: 'm5-2',
    moduleSlug: 'sdk-integration',
    prompt: 'What error means the market has no available liquidity?',
    choices: [
      'unauthorized',
      'insufficient liquidity',
      'unhealthy position',
      'slippage exceeded'
    ],
    correctIndex: 1,
    explanation: '"insufficient liquidity" means trying to borrow more than the market has available.',
    category: 'intermediate',
    difficulty: 1
  },
  
  // Module 6: Partner Communication
  {
    questionId: 'm6-1',
    moduleSlug: 'partner-communication',
    prompt: 'A partner\'s transaction keeps reverting. What is your first question?',
    choices: [
      'What is your favorite color?',
      'What is the chain, contract address, and error message?',
      'How much are you depositing?',
      'Have you tried turning it off and on?'
    ],
    correctIndex: 1,
    explanation: 'Technical debugging requires specific information: chain, contract, transaction hash, and error.',
    category: 'expert',
    difficulty: 1
  },
  {
    questionId: 'm6-2',
    moduleSlug: 'partner-communication',
    prompt: 'How do you explain Morpho to a skeptical CTO?',
    choices: [
      'Focus on marketing slogans',
      'Emphasize immutability, isolated risk, and predictable parameters',
      'Promise guaranteed returns',
      'Show memes'
    ],
    correctIndex: 1,
    explanation: 'CTOs care about technical robustness - immutability and isolated risk are key selling points.',
    category: 'expert',
    difficulty: 2
  }
];

// Code Challenges
const CODE_CHALLENGES = [
  {
    title: 'Calculate Health Factor',
    difficulty: 'fundamental',
    starterCode: `function calculateHealthFactor(
  collateral: bigint,
  borrowShares: bigint,
  price: bigint,
  lltv: bigint,
  market: any
): bigint {
  // Your code here
  return 0n;
}`,
    solutionCode: `function calculateHealthFactor(
  collateral: bigint,
  borrowShares: bigint,
  price: bigint,
  lltv: bigint,
  market: any
): bigint {
  const WAD = 10n ** 18n;
  
  // Calculate borrowed assets
  const borrowed = borrowShares > 0n
    ? (borrowShares * market.totalBorrowAssets) / market.totalBorrowShares
    : 0n;
  
  // Calculate collateral value in loan terms
  const collateralValue = (collateral * price) / WAD;
  
  // Calculate max borrow
  const maxBorrow = (collateralValue * lltv) / WAD;
  
  // Health factor
  if (borrowed === 0n) return 2n ** 256n - 1n;
  
  return (maxBorrow * WAD) / borrowed;
}`,
    testCases: [
      { input: 'calculateHealthFactor(5n, 100n, 2000n, 8000n, {totalBorrowAssets: 1000n, totalBorrowShares: 100n})', expected: '1142857142857142857' }
    ],
    conceptsCovered: ['LLTV', 'health factor', 'BigInt math'],
    tips: ['Remember WAD = 10^18', 'Multiply before dividing']
  },
  {
    title: 'Calculate Liquidation Price',
    difficulty: 'fundamental',
    starterCode: `function calculateLiquidationPrice(
  collateral: bigint,
  borrowed: bigint,
  lltv: bigint
): bigint {
  // Your code here
  return 0n;
}`,
    solutionCode: `function calculateLiquidationPrice(
  collateral: bigint,
  borrowed: bigint,
  lltv: bigint
): bigint {
  const WAD = 10n ** 18n;
  
  // Liquidation when: collateral * price * LLTV = borrowed
  // So: price = borrowed / (collateral * LLTV)
  
  if (collateral === 0n || lltv === 0n) return 0n;
  
  return (borrowed * WAD * WAD) / (collateral * lltv);
}`,
    testCases: [
      { input: 'calculateLiquidationPrice(10n, 18000n, 8600n)', expected: '2093023255813953488372' }
    ],
    conceptsCovered: ['liquidation', 'price calculation'],
    tips: ['At liquidation: HF = 1', 'Scale by WAD twice for 18 decimals']
  }
];

// LLM Questions for open-ended evaluation
const LLM_QUESTIONS = [
  {
    id: 'pitch-why-morpho',
    category: 'pitch',
    difficulty: 'critical',
    title: 'Why Morpho? (60-Second Pitch)',
    question: 'Give me your 60-second answer to "Why Morpho?" as if you\'re talking to a skeptical CTO who currently uses Aave.',
    evaluationCriteria: {
      mustInclude: ['isolated markets', 'immutability', 'better rates', 'permissionless'],
      avoid: ['vague claims', 'marketing without substance'],
      bonusPoints: ['mentions $10B TVL', 'addresses tradeoffs']
    }
  },
  {
    id: 'explain-isolated',
    category: 'core-concepts',
    difficulty: 'fundamental',
    title: 'Isolated vs Pooled Lending',
    question: 'Explain the difference between isolated lending (Morpho) and pooled lending (Aave/Compound). What are the tradeoffs?',
    evaluationCriteria: {
      mustInclude: ['risk containment', 'no contagion', 'custom parameters', 'tradeoffs'],
      avoid: ['saying one is always better'],
      bonusPoints: ['draws diagram', 'mentions integration implications']
    }
  },
  {
    id: 'four-roles-explain',
    category: 'architecture',
    difficulty: 'intermediate',
    title: 'The 4-Role System',
    question: 'Explain the 4-role system in MetaMorpho. For each role, what can they do and what are their constraints?',
    evaluationCriteria: {
      mustInclude: ['owner', 'curator', 'guardian', 'allocator', 'timelock'],
      avoid: ['confusing roles'],
      bonusPoints: ['explains separation benefits', 'real examples']
    }
  },
  {
    id: 'bundler-order',
    category: 'integration',
    difficulty: 'intermediate',
    title: 'Bundler3 Operation Order',
    question: 'A partner wants to build a leveraged position: supply collateral, borrow, swap, supply more. What is the correct bundle order? What happens if wrong?',
    evaluationCriteria: {
      mustInclude: ['supply first', 'borrow second', 'atomic execution', 'revert behavior'],
      avoid: ['wrong order'],
      bonusPoints: ['mentions slippage protection']
    }
  },
  {
    id: 'debug-support',
    category: 'partner-support',
    difficulty: 'expert',
    title: 'Support Triage Scenario',
    question: 'A partner messages: "Users getting weird errors when withdrawing. Some work, some don\'t. No pattern. Help!" What are your first 3 questions?',
    evaluationCriteria: {
      mustInclude: ['asks for tx hash', 'asks for error', 'checks liquidity'],
      avoid: ['vague response'],
      bonusPoints: ['specific debugging steps', 'code to diagnose']
    }
  }
];

module.exports = {
  LEARNING_MODULES,
  QUIZ_QUESTIONS,
  CODE_CHALLENGES,
  LLM_QUESTIONS
};
