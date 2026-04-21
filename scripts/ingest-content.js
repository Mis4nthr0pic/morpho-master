/**
 * Content Ingestion Script
 * Parses morpho.txt and creates structured lessons, quiz questions, and coding challenges
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const MORPHO_TXT = path.join(__dirname, '../morpho.txt');
const DB_PATH = path.join(__dirname, '../data/morpho_trainer.db');

// Core content structure based on morpho.txt sections
const MODULES = [
  {
    id: 'protocol-basics',
    title: 'Protocol Basics',
    category: 'protocol',
    difficulty: 1,
    lessons: [
      {
        title: 'What is Morpho?',
        content: `Morpho is a decentralized lending protocol on Ethereum, Base, and other EVM chains. It consists of:

**Morpho Markets** - Isolated lending pools where users can borrow and lend
**Morpho Vaults** - Managed lending strategies that allocate deposits across markets
**Curators** - Expert entities who manage vault strategies and risk parameters

## Key Concepts

1. **Isolation**: Each market is isolated, meaning risk in one market doesn't affect others
2. **Permissionless**: Anyone can create markets or integrate with the protocol
3. **Optimized**: Morpho improves upon traditional lending protocols through better interest rate matching

## The Vision

Morpho aims to be the most efficient lending infrastructure in DeFi by allowing:
- Higher collateralization factors
- Lower borrowing costs  
- Better rates for lenders through peer-to-peer matching

## For Partners

As a partner-facing technical role, you'll need to explain:
- Why Morpho is different from Aave/Compound
- How integrators can build on top
- Risk considerations for different use cases`,
        estimated_minutes: 20
      },
      {
        title: 'Morpho Markets Deep Dive',
        content: `## Market Structure

A Morpho Market consists of:
- **Loan Asset**: The asset being borrowed (e.g., USDC)
- **Collateral Asset**: The asset deposited as collateral (e.g., ETH)
- **Oracle**: Price feed for determining collateral value
- **IRM**: Interest Rate Model that determines borrow/supply rates
- **LLTV (Liquidation Loan-to-Value)**: Maximum borrowing ratio

## Key Parameters

| Parameter | Purpose | Example |
|-----------|---------|---------|
| LLTV | Max borrow ratio | 86.5% for ETH/USDC |
| Oracle | Price discovery | Chainlink |
| IRM | Rate calculation | AdaptiveCurveIRM |

## Interest Rate Mechanism

Morpho uses an Adaptive Curve IRM that:
1. Adjusts rates based on utilization
2. Targets a specific utilization rate
3. Responds to market conditions

## Liquidation

When a position's collateral value drops:
1. Position becomes eligible for liquidation
2. Liquidators repay debt and seize collateral
3. Liquidation incentive rewards liquidators

## Partner Context

Integrators often ask about:
- "What's the liquidation penalty?" (typically 5-10%)
- "How do I check if my position is healthy?"
- "Can I use custom oracles?" (Yes, permissionless)`,
        estimated_minutes: 30
      },
      {
        title: 'Morpho Vaults Explained',
        content: `## Vault Architecture

Morpho Vaults (MetaMorpho) are ERC-4626 vaults that:
- Accept deposits of a single asset
- Allocate across multiple markets
- Optimize for yield and risk

## Key Roles

**Curator**: Manages the vault's allocation strategy
**Guardian**: Can revoke curator actions in emergencies
**Timelock**: Delays sensitive operations for security

## Vault Mechanics

1. Users deposit assets → receive shares
2. Curator allocates to markets based on risk/reward
3. Yield accrues to vault → share value increases
4. Users withdraw → burn shares, receive assets + yield

## Important Concepts

**Supply Queue**: Ordered list of markets for new deposits
**Withdraw Queue**: Ordered list for withdrawals
**Caps**: Maximum allocation per market

## For Integrators

Common integration patterns:
- **Earn Products**: Deposit user funds into curated vaults
- **Yield Optimization**: Route deposits to highest-yielding vaults
- **Custom Strategies**: Build vaults with specific risk profiles

## Questions You'll Answer

- "What's the difference between Morpho Blue and MetaMorpho?"
  - Blue = core lending protocol (markets)
  - MetaMorpho = vault layer on top

- "How do curator fees work?"
  - Curators set a performance fee (typically 0-20%)

- "Is there a default vault?"
  - No, each vault is managed by independent curators`,
        estimated_minutes: 35
      }
    ]
  },
  {
    id: 'integration-guide',
    title: 'Integration Guide',
    category: 'integration',
    difficulty: 2,
    lessons: [
      {
        title: 'Integration Patterns',
        content: `## Common Integration Patterns

### 1. Earn Integration
For apps wanting to offer yield to users:

\`\`\`javascript
// Deposit into a vault
const vault = new ethers.Contract(vaultAddress, vaultABI, signer);
await vault.deposit(amount, userAddress);
\`\`\`

### 2. Borrow Integration
For apps wanting to offer borrowing:

\`\`\`javascript
// Supply collateral and borrow
const morpho = new ethers.Contract(morphoAddress, morphoABI, signer);
await morpho.supplyCollateral(marketId, collateralAmount, userAddress);
await morpho.borrow(marketId, borrowAmount, userAddress);
\`\`\`

### 3. Leverage Integration
For advanced use cases:

\`\`\`javascript
// Use Bundler3 for complex operations
const bundler = new ethers.Contract(bundlerAddress, bundlerABI, signer);
// Bundle multiple operations atomically
\`\`\`

## SDK Usage

The Morpho SDK simplifies integrations:

\`\`\`bash
npm install @morpho-org/blue-sdk
\`\`\`

## API Access

Morpho provides a GraphQL API:
- Vault data
- Market data
- User positions
- Historical data

## Common Blockers

1. **Oracle Understanding**: Partners need help understanding price feeds
2. **Risk Assessment**: Curators need help evaluating market risk
3. **Gas Optimization**: Complex operations need bundling
4. **Testing**: Need guidance on testnet usage

## Your Role

You'll help partners:
- Scope their integration
- Review their implementation
- Answer technical questions
- Escalate bugs to engineering`,
        estimated_minutes: 40
      },
      {
        title: 'SDK and API Reference',
        content: `## Blue SDK

The official SDK for interacting with Morpho:

\`\`\`typescript
import { MorphoClient, Market } from '@morpho-org/blue-sdk';

const client = new MorphoClient({ provider, chainId: 1 });

// Get market data
const market = await client.getMarket(marketId);
console.log(market.totalSupplyAssets);
console.log(market.totalBorrowAssets);
\`\`\`

## API Endpoints

### GraphQL
\`\`\`
https://api.morpho.org/graphql
\`\`\`

### Key Queries

**Get Vaults**:
\`\`\`graphql
query Vaults {
  vaults {
    items {
      address
      name
      symbol
      totalAssets
      apy
    }
  }
}
\`\`\`

**Get Markets**:
\`\`\`graphql
query Markets {
  markets {
    items {
      uniqueKey
      loanAsset { symbol }
      collateralAsset { symbol }
      lltv
      supplyApy
      borrowApy
    }
  }
}
\`\`\`

## Contract Addresses

Mainnet Morpho Blue: \`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb\`

See docs for other chains.

## Subgraph

Available for historical data analysis and complex queries.`,
        estimated_minutes: 30
      }
    ]
  },
  {
    id: 'partner-communication',
    title: 'Partner Communication',
    category: 'communication',
    difficulty: 2,
    lessons: [
      {
        title: 'Explaining Morpho Simply',
        content: `## The "Explain Like I'm 5" Approach

### Analogy: The Lending Marketplace

"Imagine Morpho as a marketplace for loans:
- **Traditional banks (Aave/Compound)**: One big pool where everyone deposits and borrows
- **Morpho**: Many small shops (markets) each specializing in specific pairs

**Benefits:**
- If one shop has a problem, others aren't affected (isolation)
- Each shop can offer better rates for their specialty (optimization)
- Anyone can open a new shop (permissionless)"

### Key Talking Points

**For Protocols:**
- "Integrate once, access all markets"
- "Build on battle-tested infrastructure"
- "Customize risk parameters for your users"

**For Traders:**
- "Get better rates than traditional lending"
- "Use any token as collateral (permissionless)"
- "Leverage with higher LTV ratios"

**For Risk Managers:**
- "Isolate risk to specific markets"
- "Curated vaults with professional management"
- "Transparent, on-chain risk parameters"

### Questions and Responses

Q: "Why should we use Morpho over Aave?"
A: "Morpho offers isolated markets (better risk), higher LTVs (more capital efficient), and permissionless market creation. Many protocols use both - Morpho for specialized markets, Aave for general lending."

Q: "What if a curator makes bad decisions?"
A: "Vaults have timelocks and guardians. Users can always withdraw directly from underlying markets. Curators are incentivized to perform well as they earn fees."

Q: "How do we get started?"
A: "Start with the SDK, test on Base or Ethereum testnet, then go to mainnet. We're here to support your integration."`,
        estimated_minutes: 25
      },
      {
        title: 'Discovery Questions',
        content: `## Understanding Partner Needs

### Initial Discovery

1. **What are you building?**
   - Yield aggregator? Trading protocol? Wallet?
   
2. **What's your target user?**
   - Retail? Institutions? DeFi natives?

3. **What assets are you interested in?**
   - Major assets (ETH, USDC)? Long-tail tokens?

4. **What's your risk tolerance?**
   - Conservative (blue-chip only)? Aggressive (new markets)?

5. **What's your timeline?**
   - MVP in weeks? Full integration in months?

### Technical Discovery

1. **What's your stack?**
   - React? Node? Python? Mobile?

2. **Do you need real-time data?**
   - API polling? WebSocket? Subgraph?

3. **Are you cross-chain?**
   - Ethereum mainnet? L2s? Multiple chains?

4. **What's your security requirement?**
   - Audits required? Bug bounty?

### Scoping the Integration

**Small Scope (1-2 weeks):**
- Display vault APYs
- Link to Morpho app for deposits

**Medium Scope (1 month):**
- Deposit/withdraw via SDK
- Show user positions

**Large Scope (2-3 months):**
- Full integration with custom UI
- Advanced features (leverage, looping)
- Mobile app support

### Red Flags to Watch

- Unrealistic timelines
- Lack of technical expertise
- Unclear use case
- Security shortcuts
- Unwillingness to test

### Your Role

Be the bridge between:
- Partner's business needs
- Technical implementation
- Morpho's capabilities
- Risk considerations`,
        estimated_minutes: 30
      }
    ]
  },
  {
    id: 'risk-and-liquidations',
    title: 'Risk & Liquidations',
    category: 'protocol',
    difficulty: 3,
    lessons: [
      {
        title: 'Understanding Liquidations',
        content: `## Liquidation Mechanics

### When Does Liquidation Happen?

A position becomes liquidatable when:

\`\`
Collateral Value × LLTV < Borrowed Amount
\`\`

Example:
- You supply $10,000 ETH
- LLTV is 86.5%
- You borrow $8,500 USDC
- If ETH drops 15%, your position is at risk

### The Liquidation Process

1. **Health Factor Drops**: Price movement puts position underwater
2. **Liquidator Steps In**: Anyone can call liquidate()
3. **Debt Repaid**: Liquidator repays borrower's debt
4. **Collateral Seized**: Liquidator receives collateral + bonus
5. **Position Closed**: Borrower keeps remaining collateral (if any)

### Liquidation Incentive

Typical liquidation bonus: 5-10%

\`\`
Liquidator receives = Repaid Amount × (1 + Bonus)
\`\`

This incentivizes liquidators to monitor and act quickly.

### Bad Debt

If collateral value drops faster than liquidation:
- Protocol may accrue bad debt
- Lenders absorb the loss
- This is why LLTVs are conservative

### For Partners

Common questions:
- "How fast are liquidations?" (Usually within minutes on main markets)
- "Can I self-liquidate?" (Yes, by repaying your own debt)
- "What happens if I'm liquidated?" (You lose the liquidated collateral)

### Best Practices

1. **Monitor positions**: Use health factor alerts
2. **Keep buffer**: Don't borrow at max LLTV
3. **Understand oracles**: Know your price feed source
4. **Have exit plan**: Keep assets ready to repay if needed`,
        estimated_minutes: 35
      }
    ]
  }
];

// Quiz questions database
const QUIZ_QUESTIONS = [
  {
    question_id: 'q001',
    question: 'What is the main benefit of Morpho\'s isolated market design?',
    options: JSON.stringify([
      'Higher gas efficiency',
      'Risk in one market doesn\'t affect others',
      'Lower interest rates',
      'Faster transactions'
    ]),
    correct_answer: 1,
    explanation: 'Isolation means each market operates independently. If one market has issues (bad debt, oracle problems), it doesn\'t cascade to other markets.',
    difficulty: 1,
    category: 'protocol',
    tags: 'isolation,risk,markets'
  },
  {
    question_id: 'q002',
    question: 'What does LLTV stand for?',
    options: JSON.stringify([
      'Liquidation Loan-to-Value',
      'Liquidation Limit Total Value',
      'Lending Liquidity Threshold Value',
      'Long-term Lending Total Volume'
    ]),
    correct_answer: 0,
    explanation: 'LLTV (Liquidation Loan-to-Value) is the maximum ratio of borrowed assets to collateral value before liquidation becomes possible.',
    difficulty: 1,
    category: 'protocol',
    tags: 'lltv,liquidation,terminology'
  },
  {
    question_id: 'q003',
    question: 'Who manages the allocation strategy in a Morpho Vault?',
    options: JSON.stringify([
      'Morpho Labs',
      'The Curator',
      'Token holders',
      'Automated algorithm'
    ]),
    correct_answer: 1,
    explanation: 'Curators are expert entities who manage vault strategies, deciding which markets to allocate deposits to and in what proportions.',
    difficulty: 1,
    category: 'protocol',
    tags: 'vaults,curators,management'
  },
  {
    question_id: 'q004',
    question: 'What is the typical liquidation bonus percentage?',
    options: JSON.stringify([
      '1-2%',
      '5-10%',
      '15-20%',
      '25-30%'
    ]),
    correct_answer: 1,
    explanation: 'Liquidation bonuses typically range from 5-10%, incentivizing liquidators to monitor and liquidate unhealthy positions promptly.',
    difficulty: 2,
    category: 'protocol',
    tags: 'liquidation,incentives'
  },
  {
    question_id: 'q005',
    question: 'Which SDK package should integrators use?',
    options: JSON.stringify([
      '@morpho/morpho-js',
      '@morpho-org/blue-sdk',
      'morpho-react',
      'web3-morpho'
    ]),
    correct_answer: 1,
    explanation: '@morpho-org/blue-sdk is the official SDK for interacting with Morpho Blue protocol.',
    difficulty: 1,
    category: 'integration',
    tags: 'sdk,integration,development'
  },
  {
    question_id: 'q006',
    question: 'What is the main difference between Morpho Blue and MetaMorpho?',
    options: JSON.stringify([
      'Blue is for borrowing, MetaMorpho is for lending',
      'Blue is the core lending protocol; MetaMorpho is the vault layer',
      'Blue is on Ethereum, MetaMorpho is on Base',
      'Blue requires KYC, MetaMorpho is permissionless'
    ]),
    correct_answer: 1,
    explanation: 'Morpho Blue is the core lending protocol (markets layer). MetaMorpho builds on top, providing managed vault strategies.',
    difficulty: 2,
    category: 'protocol',
    tags: 'blue,metamorpho,architecture'
  },
  {
    question_id: 'q007',
    question: 'When explaining Morpho to a non-technical partner, which analogy works best?',
    options: JSON.stringify([
      'It\'s like a decentralized exchange',
      'It\'s like a marketplace with many specialized shops instead of one big store',
      'It\'s like a traditional bank with better rates',
      'It\'s like a staking protocol'
    ]),
    correct_answer: 1,
    explanation: 'The marketplace analogy helps non-technical audiences understand isolation (separate shops) and specialization (each shop focused on specific pairs).',
    difficulty: 2,
    category: 'communication',
    tags: 'communication,analogy,explaining'
  },
  {
    question_id: 'q008',
    question: 'What is the first question you should ask during partner discovery?',
    options: JSON.stringify([
      'What is your timeline?',
      'What are you building?',
      'What is your budget?',
      'What chain are you on?'
    ]),
    correct_answer: 1,
    explanation: 'Understanding what the partner is building helps frame all subsequent discussions and recommendations.',
    difficulty: 1,
    category: 'communication',
    tags: 'discovery,partners,questions'
  },
  {
    question_id: 'q009',
    question: 'What is a "Supply Queue" in a Morpho Vault?',
    options: JSON.stringify([
      'Users waiting to deposit',
      'Ordered list of markets for new deposits',
      'Queue for withdrawals',
      'Pending transactions'
    ]),
    correct_answer: 1,
    explanation: 'The supply queue is an ordered list that determines which markets receive new deposits first, managed by the curator.',
    difficulty: 2,
    category: 'protocol',
    tags: 'vaults,supply-queue,curator'
  },
  {
    question_id: 'q010',
    question: 'What happens when a position\'s health factor drops below 1?',
    options: JSON.stringify([
      'The position is automatically closed',
      'The position becomes eligible for liquidation',
      'Interest rates increase',
      'Collateral is frozen'
    ]),
    correct_answer: 1,
    explanation: 'When health factor drops below 1, the position is underwater and can be liquidated by anyone. The position remains open until a liquidator acts.',
    difficulty: 2,
    category: 'protocol',
    tags: 'liquidation,health-factor,risk'
  }
];

// Coding challenges
const CODING_CHALLENGES = [
  {
    challenge_id: 'code001',
    title: 'Calculate Position Health Factor',
    description: `Write a function that calculates the health factor of a Morpho position.

The health factor is:
\`\`
Health Factor = (Collateral Amount × Collateral Price × LLTV) / Borrow Amount
\`\`

If Health Factor < 1, the position can be liquidated.`,
    difficulty: 1,
    category: 'calculation',
    starter_code: `function calculateHealthFactor(
  collateralAmount,    // in wei (18 decimals)
  collateralPrice,     // USD price with 8 decimals
  borrowAmount,        // in wei (6 decimals for USDC)
  lltv                 // in basis points (8650 = 86.5%)
) {
  // Your code here
  
}`,
    solution: `function calculateHealthFactor(
  collateralAmount,
  collateralPrice,
  borrowAmount,
  lltv
) {
  // Calculate collateral value in USD (8 decimals)
  const collateralValueUSD = (collateralAmount * collateralPrice) / 1e18;
  
  // Calculate max borrow allowed (8 decimals)
  const maxBorrowUSD = (collateralValueUSD * lltv) / 10000;
  
  // Convert borrow amount to USD (6 decimals input -> 8 decimals)
  const borrowValueUSD = borrowAmount * 100;
  
  // Health factor (scaled to 1e18 for precision)
  const healthFactor = (maxBorrowUSD * 1e18) / borrowValueUSD;
  
  return healthFactor;
}`,
    test_cases: JSON.stringify([
      { input: [1e18, 2000e8, 1500e6, 8650], expected: 1153333333333333333n },
      { input: [5e18, 1800e8, 6000e6, 8000], expected: 1200000000000000000n },
      { input: [1e18, 2000e8, 1800e6, 8650], expected: 961111111111111111n }
    ]),
    hints: JSON.stringify([
      'Remember to handle decimal conversions carefully',
      'LLTV is in basis points (10000 = 100%)',
      'Health factor > 1e18 means healthy position'
    ])
  },
  {
    challenge_id: 'code002',
    title: 'Parse Market ID',
    description: `Given a Morpho market object, create a human-readable description.

A market has:
- loanAsset: { symbol: "USDC", decimals: 6 }
- collateralAsset: { symbol: "ETH", decimals: 18 }
- lltv: number (in basis points)

Return a string like: "ETH/USDC Market with 86.5% LLTV"`,
    difficulty: 1,
    category: 'data-processing',
    starter_code: `function describeMarket(market) {
  // market.loanAsset.symbol
  // market.collateralAsset.symbol
  // market.lltv
  
  // Your code here
  
}`,
    solution: `function describeMarket(market) {
  const lltvPercent = (market.lltv / 100).toFixed(1);
  return \`\${market.collateralAsset.symbol}/\${market.loanAsset.symbol} Market with \${lltvPercent}% LLTV\`;
}`,
    test_cases: JSON.stringify([
      { input: [{loanAsset: {symbol: "USDC"}, collateralAsset: {symbol: "ETH"}, lltv: 8650}], expected: "ETH/USDC Market with 86.5% LLTV" },
      { input: [{loanAsset: {symbol: "DAI"}, collateralAsset: {symbol: "WBTC"}, lltv: 8000}], expected: "WBTC/DAI Market with 80.0% LLTV" }
    ]),
    hints: JSON.stringify([
      'LLTV in basis points means 8650 = 86.50%',
      'Use toFixed(1) to get one decimal place'
    ])
  },
  {
    challenge_id: 'code003',
    title: 'Calculate APY from Rate',
    description: `Morpho returns borrow rates as per-second rates.
Convert this to an annual APY percentage.

Formula: APY = ((1 + ratePerSecond)^secondsPerYear - 1) × 100

Use 31,536,000 seconds per year.`,
    difficulty: 2,
    category: 'calculation',
    starter_code: `function calculateAPY(ratePerSecond) {
  // ratePerSecond is a uint256 with 18 decimals
  // Return APY as a percentage with 2 decimals
  
  // Your code here
  
}`,
    solution: `function calculateAPY(ratePerSecond) {
  const SECONDS_PER_YEAR = 31536000;
  const RAY = 1e27; // 27 decimals for precision
  
  // Convert to ray for precision
  const rateRay = (ratePerSecond * RAY) / 1e18;
  
  // Compound: (1 + r)^n - 1
  // Simplified approximation for display: r * secondsPerYear
  const apyRaw = (rateRay * SECONDS_PER_YEAR) / RAY;
  
  // Convert to percentage with 2 decimals
  const apyPercent = (apyRaw * 10000) / 1e9;
  
  return Math.round(apyPercent) / 100;
}`,
    test_cases: JSON.stringify([
      { input: [6341958396753n], expected: 2.0 },
      { input: [3170979198376n], expected: 1.0 },
      { input: [1585489599188n], expected: 0.5 }
    ]),
    hints: JSON.stringify([
      'For small rates, APY ≈ rate × secondsPerYear',
      'Remember to convert from 18 decimals to percentage'
    ])
  },
  {
    challenge_id: 'code004',
    title: 'Vault Share Price Calculator',
    description: `Calculate the price of a vault share given:
- totalAssets: total assets in the vault
- totalShares: total shares issued
- decimals: vault decimals (usually 18)

Return the amount of assets per share.`,
    difficulty: 2,
    category: 'calculation',
    starter_code: `function getSharePrice(totalAssets, totalShares, decimals) {
  // Handle edge case of empty vault
  
  // Your code here
  
}`,
    solution: `function getSharePrice(totalAssets, totalShares, decimals) {
  if (totalShares === 0n) {
    return 10n ** BigInt(decimals); // Initial price is 1:1
  }
  
  // Price = totalAssets * 10^decimals / totalShares
  return (totalAssets * (10n ** BigInt(decimals))) / totalShares;
}`,
    test_cases: JSON.stringify([
      { input: [1000000000000000000n, 1000000000000000000n, 18], expected: 1000000000000000000n },
      { input: [2000000000000000000n, 1000000000000000000n, 18], expected: 2000000000000000000n },
      { input: [0n, 0n, 18], expected: 1000000000000000000n }
    ]),
    hints: JSON.stringify([
      'Use BigInt for precision with large numbers',
      'Initial share price is 1:1 when vault is empty'
    ])
  },
  {
    challenge_id: 'code005',
    title: 'Liquidation Profit Calculator',
    description: `A liquidator repays debt and seizes collateral.
Calculate the liquidator's profit.

Given:
- debtRepaid: amount of debt repaid (in loan asset)
- collateralSeized: amount of collateral seized
- collateralPrice: price of collateral in terms of loan asset
- liquidationBonus: in basis points (e.g., 500 = 5%)

Return profit in loan asset terms.`,
    difficulty: 3,
    category: 'calculation',
    starter_code: `function calculateLiquidationProfit(
  debtRepaid,
  collateralSeized,
  collateralPrice,
  liquidationBonus
) {
  // collateralPrice: how much loan asset per unit of collateral
  // Both assets have 18 decimals
  
  // Your code here
  
}`,
    solution: `function calculateLiquidationProfit(
  debtRepaid,
  collateralSeized,
  collateralPrice,
  liquidationBonus
) {
  // Calculate collateral value in loan asset terms
  const collateralValue = (collateralSeized * collateralPrice) / 1e18;
  
  // Apply liquidation bonus to get expected collateral value
  const expectedCollateralValue = (debtRepaid * (10000n + BigInt(liquidationBonus))) / 10000n;
  
  // Profit is the difference
  const profit = collateralValue - debtRepaid;
  
  return profit;
}`,
    test_cases: JSON.stringify([
      { input: [1000n, 1050n, 1n, 500], expected: 50n },
      { input: [5000n, 5250n, 1n, 500], expected: 250n }
    ]),
    hints: JSON.stringify([
      'Collateral value = amount × price',
      'Profit = value of seized collateral - debt repaid',
      'Liquidation bonus is the incentive for liquidators'
    ])
  }
];

// Interview scenarios
const INTERVIEW_SCENARIOS = [
  {
    scenario_id: 'int001',
    type: 'conceptual',
    title: 'Explain Morpho in 2 Minutes',
    description: 'A partner on a call asks: "I\'ve heard of Morpho but don\'t really understand it. How is it different from Aave?"',
    questions: JSON.stringify([
      'What is Morpho at a high level?',
      'How is it different from Aave/Compound?',
      'Why should someone use Morpho?'
    ]),
    difficulty: 2,
    category: 'protocol'
  },
  {
    scenario_id: 'int002',
    type: 'technical',
    title: 'Integration Architecture',
    description: 'A developer asks: "We want to integrate Morpho into our yield aggregator. What\'s the best approach?"',
    questions: JSON.stringify([
      'What integration options exist?',
      'What\'s the difference between vault and market integration?',
      'What are the main technical considerations?'
    ]),
    difficulty: 3,
    category: 'integration'
  },
  {
    scenario_id: 'int003',
    type: 'partner',
    title: 'Risk Concerns',
    description: 'A potential partner\'s risk team asks: "How do we know Morpho is safe? What if there\'s a bug or oracle failure?"',
    questions: JSON.stringify([
      'How do you address security concerns?',
      'What happens if an oracle fails?',
      'How does isolation help with risk?'
    ]),
    difficulty: 2,
    category: 'communication'
  },
  {
    scenario_id: 'int004',
    type: 'troubleshooting',
    title: 'Integration Issue',
    description: 'An integrator messages: "Users can\'t withdraw from our app. The transaction reverts with \"insufficient liquidity\". What\'s happening?"',
    questions: JSON.stringify([
      'What\'s the likely cause?',
      'How would you debug this?',
      'What\'s the solution?'
    ]),
    difficulty: 3,
    category: 'support'
  },
  {
    scenario_id: 'int005',
    type: 'conceptual',
    title: 'Curator Value Proposition',
    description: 'A DeFi fund asks: "Why would we use a curated vault instead of depositing directly into markets ourselves?"',
    questions: JSON.stringify([
      'What value do curators provide?',
      'What are the tradeoffs?',
      'When should someone use vaults vs direct markets?'
    ]),
    difficulty: 2,
    category: 'protocol'
  }
];

async function ingest() {
  const db = new sqlite3.Database(DB_PATH);
  
  console.log('🔄 Starting content ingestion...\n');

  // Insert lessons
  console.log('📚 Inserting lessons...');
  for (const module of MODULES) {
    for (let i = 0; i < module.lessons.length; i++) {
      const lesson = module.lessons[i];
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT OR REPLACE INTO lessons (module_id, lesson_order, title, content, difficulty, category, estimated_minutes)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [module.id, i, lesson.title, lesson.content, module.difficulty, module.category, lesson.estimated_minutes],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }
  }
  console.log(`✅ Inserted ${MODULES.reduce((acc, m) => acc + m.lessons.length, 0)} lessons\n`);

  // Insert quiz questions
  console.log('❓ Inserting quiz questions...');
  for (const q of QUIZ_QUESTIONS) {
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT OR REPLACE INTO quiz_questions (question_id, question, options, correct_answer, explanation, difficulty, category, tags)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [q.question_id, q.question, q.options, q.correct_answer, q.explanation, q.difficulty, q.category, q.tags],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }
  console.log(`✅ Inserted ${QUIZ_QUESTIONS.length} quiz questions\n`);

  // Insert coding challenges
  console.log('💻 Inserting coding challenges...');
  for (const c of CODING_CHALLENGES) {
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT OR REPLACE INTO coding_challenges (challenge_id, title, description, difficulty, category, starter_code, solution, test_cases, hints)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [c.challenge_id, c.title, c.description, c.difficulty, c.category, c.starter_code, c.solution, c.test_cases, c.hints],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }
  console.log(`✅ Inserted ${CODING_CHALLENGES.length} coding challenges\n`);

  // Insert interview scenarios
  console.log('🎤 Inserting interview scenarios...');
  for (const s of INTERVIEW_SCENARIOS) {
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT OR REPLACE INTO interview_scenarios (scenario_id, type, title, description, questions, difficulty, category)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [s.scenario_id, s.type, s.title, s.description, s.questions, s.difficulty, s.category],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }
  console.log(`✅ Inserted ${INTERVIEW_SCENARIOS.length} interview scenarios\n`);

  db.close();
  console.log('🎉 Content ingestion complete!');
}

ingest().catch(console.error);
