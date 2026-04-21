/**
 * Comprehensive Content Ingestion for Morpho Interview Trainer
 * Parses morpho.txt and creates extensive learning content for Integration Engineer role
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, '../data/morpho_trainer.db');

// Comprehensive lesson modules based on actual morpho.txt content
const COMPREHENSIVE_MODULES = [
  // MODULE 1: Protocol Foundations
  {
    id: 'protocol-foundations',
    title: 'Protocol Foundations',
    category: 'protocol',
    difficulty: 1,
    lessons: [
      {
        title: 'What is Morpho?',
        content: `## Morpho Overview

**Morpho** is a decentralized, noncustodial lending protocol implemented for the Ethereum Virtual Machine. It serves as a trustless base layer for lenders, borrowers, and applications.

### Key Distinctions

- **The Morpho Protocol**: A decentralized lending protocol on EVM
- **The Morpho Interfaces**: Web interfaces for easy interaction
- **Morpho Governance**: Governance system via MORPHO token
- **Morpho Association**: France-registered association promoting development

### Core Value Proposition

Morpho is a simple lending primitive that allows the creation of **immutable** and **efficient** lending markets in a **permissionless** way.

### Key Features

1. **Overcollateralized Lending**: Users provide collateral to borrow other assets
2. **Risk Protection**: Liquidation mechanisms protect through loan-to-value ratios
3. **Interest Accrual**: Dynamic rates based on market conditions
4. **Open Participation**: Anyone can lend or borrow
5. **Non-custodial**: Users maintain ownership of their assets

### Architecture Overview

**Morpho Markets** (Blue): Isolated lending pools
- Each market is independent
- Risk in one doesn't affect others
- Permissionless creation

**Morpho Vaults** (MetaMorpho): Managed lending strategies
- ERC-4626 vaults
- Professional curation
- Automated allocation

### For Integration Engineers

You need to understand:
- Why Morpho is different from Aave/Compound
- How the isolation model benefits integrators
- What use cases fit best with Morpho
- How to explain this to technical and non-technical partners`,
        estimated_minutes: 20
      },
      {
        title: 'Markets: The Core Primitive',
        content: `## Morpho Markets (Blue)

A Morpho Market is an isolated lending pool with these components:

### Market Parameters

| Component | Description | Example |
|-----------|-------------|---------|
| **Loan Asset** | Asset being borrowed | USDC |
| **Collateral Asset** | Asset deposited as collateral | ETH |
| **Oracle** | Price feed for collateral valuation | Chainlink |
| **IRM** | Interest Rate Model | AdaptiveCurveIRM |
| **LLTV** | Liquidation Loan-to-Value (max borrow ratio) | 86.5% |

### Isolation Benefits

1. **Risk Containment**: Problems in one market don't spread
2. **Custom Parameters**: Each market can have tailored settings
3. **Permissionless**: Anyone can create markets for any asset pair
4. **Transparency**: Clear risk boundaries

### Market Creation

Markets are created permissionlessly by calling:
\`\`\`solidity
Morpho.createMarket(marketParams);
\`\`\`

Once created, a market is immutable - its parameters cannot be changed.

### Common Partner Questions

**Q: "How many markets exist?"**
A: Thousands of markets exist across Ethereum, Base, and other chains. Anyone can create new ones.

**Q: "Can markets be paused?"**
A: No, markets are immutable. This is a feature, not a bug - users can always interact with the protocol.

**Q: "What happens if an oracle fails?"**
A: Only that specific market is affected due to isolation. Users can still withdraw collateral if price data is stale.

### Integration Considerations

- Markets have unique IDs based on their parameters
- Always verify market parameters before integrating
- Consider LLTV when showing risk metrics to users`,
        estimated_minutes: 25
      },
      {
        title: 'Vaults: Managed Lending',
        content: `## Morpho Vaults (MetaMorpho)

Vaults are ERC-4626 compliant tokenized vaults that allocate deposits across multiple markets according to a strategy.

### Why Vaults Exist

1. **Simplified UX**: Users deposit once, vault handles allocation
2. **Professional Management**: Curators optimize for yield/risk
3. **Gas Efficiency**: Batch operations across markets
4. **Risk Diversification**: Spread across multiple markets

### Vault Architecture

**Shares**: Users receive shares representing their deposit + accrued yield
**Total Assets**: Sum of assets allocated across all markets
**APY**: Calculated based on current allocations and market rates

### Key Roles in Vaults

| Role | Responsibility | V1 | V2 |
|------|----------------|----|----|
| **Owner** | Administrative authority, appoints curator | ✓ | ✓ |
| **Curator** | Defines strategy, risk parameters | ✓ | ✓ |
| **Allocator** | Tactical portfolio management | - | ✓ |
| **Sentinel** | Emergency safety mechanism | Guardian | Sentinel |
| **Timelock** | Delay on sensitive operations | ✓ | ✓ |

### Vault V1 vs V2

**Vault V1**:
- Allocates only to Morpho Market V1
- Simple absolute supply caps per market
- Curator manages allocation directly

**Vault V2**:
- Universal via Adapters (any protocol)
- Granular ID & Cap system (absolute and relative)
- Curator appoints Allocators
- Interest rate limits (maxRate)
- Onchain compliance gating

### Integration Patterns

**Earn Integration**:
\`\`\`javascript
// Simple deposit
await vault.deposit(amount, userAddress);

// Check APY
const apy = await vault.supplyAPY();
\`\`\`

**Custom Strategy**:
- Build vaults with specific risk profiles
- Create protocol-specific integrations
- Implement compliance requirements

### Partner Questions

**Q: "Why use vaults vs direct markets?"**
A: Vaults offer professional management, gas optimization, and simplified UX. Direct markets offer full control.

**Q: "How do curator fees work?"**
A: Curators set performance/management fees (typically 0-20%). Fees are taken from yield.

**Q: "Can users lose money in vaults?"**
A: Yes, if underlying markets have bad debt. Vaults diversify but don't eliminate risk.`,
        estimated_minutes: 30
      },
      {
        title: 'Interest Rate Model (AdaptiveCurveIRM)',
        content: `## Interest Rate Model

Morpho is IRM-agnostic but currently uses only the **AdaptiveCurveIRM**.

### Borrow APY Calculation

\`\`\`
Borrow APY = e^(borrowRate × secondsPerYear) - 1
\`\`\`

Where:
- borrowRate: per-second rate from IRM (18 decimals)
- secondsPerYear: 31,536,000

### Supply APY Calculation

\`\`\`
Supply APY = Borrow APY × utilization × (1 - fee)
\`\`\`

Where:
- utilization: borrowed/supplied ratio
- fee: market fee (currently 0)

### AdaptiveCurveIRM Mechanism

The IRM has two complementary mechanisms:

#### 1. Curve Mechanism (Short-term)
Manages utilization around 90% target:
- At 100% utilization: rate = 4× target rate
- At 0% utilization: rate = target rate / 4
- At 90% utilization: rate = target rate

#### 2. Adaptive Mechanism (Long-term)
Adjusts the curve based on market conditions:
- Utilization > 90%: curve shifts UP (incentivize repayment)
- Utilization < 90%: curve shifts DOWN (incentivize borrowing)
- Adjustment speed proportional to distance from target

**Speed Examples**:
- 45% utilization: target rate halves after 10 days
- 95% utilization: target rate doubles after 10 days
- 100% utilization: target rate doubles after 5 days (max speed)

### Why 90% Target?

Morpho doesn't rehypothecate collateral, removing liquidity constraints. This enables:
- Higher target utilization
- Better rates for both sides
- Lower penalties for illiquidity

### Code Example

\`\`\`typescript
function calculateAPYs(borrowRatePerSecond: bigint, utilization: number) {
  const SECONDS_PER_YEAR = 31536000;
  
  // Calculate borrow APY
  const rate = Number(borrowRatePerSecond) / 1e18;
  const borrowAPY = Math.exp(rate * SECONDS_PER_YEAR) - 1;
  
  // Calculate supply APY (no fees)
  const supplyAPY = borrowAPY * utilization;
  
  return { borrowAPY, supplyAPY };
}
\`\`\`

### Partner Questions

**Q: "Why are rates changing?"**
A: The IRM adapts to market conditions to maintain 90% utilization.

**Q: "Can rates spike?"**
A: Yes, if utilization hits 100%, rates increase 4x instantly, then adapt over time.

**Q: "Is this the same as Aave?"**
A: No, Morpho's IRM adapts autonomously without governance intervention.`,
        estimated_minutes: 35
      },
      {
        title: 'Liquidations and Risk Management',
        content: `## Liquidation Mechanics

Liquidation protects lenders by closing undercollateralized positions.

### When Liquidation Occurs

A position is liquidatable when:

\`\`\`
LTV > LLTV

or equivalently:

Health Factor < 1
\`\`\`

Where:
\`\`\`
Health Factor = (Collateral Value × LLTV) / Borrowed Amount
\`\`\`

### Liquidation Process

1. **Position becomes unhealthy**: Price drops or interest accrues
2. **Liquidator identifies**: Anyone can monitor and liquidate
3. **Debt repaid**: Liquidator pays borrower's debt
4. **Collateral seized**: Liquidator receives collateral + bonus
5. **Position closed**: Borrower keeps remaining collateral (if any)

### Liquidation Bonus

Typical bonus: 5-10%

\`\`\`
Collateral Seized = Debt Repaid × (1 + Bonus)
\`\`\`

This incentivizes liquidators to monitor positions.

### Pre-Liquidation

An opt-in mechanism for incremental liquidations before reaching LLTV:
- Creates safety cushion for borrowers
- Smaller, more frequent liquidations
- Reduces risk of large penalties

### Risk Factors for Integrators

| Risk | Mitigation |
|------|------------|
| Oracle failure | Use multiple price sources, circuit breakers |
| Extreme volatility | Lower LLTV recommendations |
| Bad debt | Monitor market health, diversify |
| Gas spikes | Consider gasless transactions |

### Calculating Position Health

\`\`\`typescript
function calculateHealthFactor(
  collateralAmount: bigint,
  collateralPrice: bigint, // 36 decimal oracle price
  borrowedAmount: bigint,
  lltv: bigint // 18 decimals
): number {
  const WAD = 10n ** 18n;
  const PRICE_SCALE = 10n ** 36n;
  
  const collateralValue = (collateralAmount * collateralPrice) / PRICE_SCALE;
  const maxBorrow = (collateralValue * lltv) / WAD;
  
  return Number((maxBorrow * WAD) / borrowedAmount) / 1e18;
}
\`\`\`

### Partner Questions

**Q: "What's the liquidation penalty?"**
A: Typically 5-10% of collateral value goes to liquidators.

**Q: "Can I be partially liquidated?"**
A: Yes, liquidators can choose to liquidate any amount up to full position.

**Q: "What if no one liquidates?"**
A: Position remains open but becomes increasingly underwater. Bad debt is socialized to lenders.

**Q: "How fast do liquidations happen?"**
A: Usually within minutes for healthy markets. Depends on gas prices and liquidation incentives.`,
        estimated_minutes: 40
      }
    ]
  },
  
  // MODULE 2: Integration Deep Dive
  {
    id: 'integration-deep-dive',
    title: 'Integration Deep Dive',
    category: 'integration',
    difficulty: 2,
    lessons: [
      {
        title: 'Integration Patterns and Use Cases',
        content: `## Common Integration Patterns

### 1. Earn/Yield Integration

**Use Case**: Wallets, aggregators, yield platforms wanting to offer yield to users.

**Approach**:
\`\`\`javascript
// Deposit user funds into curated vault
const vault = new ethers.Contract(vaultAddress, vaultABI, signer);
await vault.deposit(amount, userAddress);

// Show user their position
const shares = await vault.balanceOf(userAddress);
const assets = await vault.convertToAssets(shares);
\`\`\`

**Benefits**:
- Professional risk management
- Diversified exposure
- Simple UX (one deposit)

### 2. Borrow Integration

**Use Case**: DeFi protocols, trading platforms offering leverage.

**Approach**:
\`\`\`javascript
const morpho = new ethers.Contract(morphoAddress, morphoABI, signer);

// Supply collateral
await morpho.supplyCollateral(marketId, collateralAmount, userAddress);

// Borrow against it
await morpho.borrow(marketId, borrowAmount, userAddress);
\`\`\`

**Benefits**:
- Higher LTVs than competitors
- Isolated risk per position
- Competitive rates

### 3. Leverage Integration

**Use Case**: Advanced traders wanting leveraged positions.

**Approach** - Use Bundler3:
\`\`\`javascript
// Bundle: Deposit collateral → Borrow → Swap → Redeposit
const bundler = new ethers.Contract(bundlerAddress, bundlerABI, signer);
// Execute complex leverage in single transaction
\`\`\`

**Benefits**:
- Atomic operations
- No looping transactions
- Gas efficient

### 4. Rebalancing/Refinancing

**Use Case**: Portfolio management, rate optimization.

**Approach**:
\`\`\`javascript
// Move position from Market A to Market B
// 1. Flash borrow from Market B
// 2. Repay Market A
// 3. Withdraw collateral from A
// 4. Supply to B
// 5. Borrow from B to repay flash loan
\`\`\`

### Integration Decision Tree

**Should they use Vaults or Direct Markets?**

Use **Vaults** if:
- Users want simple "deposit and earn" experience
- Don't want to manage risk parameters
- Prefer professional curation

Use **Direct Markets** if:
- Building custom strategies
- Need full control over risk
- Sophisticated users

**Which markets/vaults to integrate?**
- Start with high TVL, established markets
- Consider user asset preferences
- Evaluate curator reputation for vaults

### Technical Considerations

1. **Gas Costs**: Estimate for deposit/withdraw/borrow operations
2. **Oracle Latency**: Prices update at different speeds
3. **Reverts**: Handle insufficient liquidity, stale prices
4. **APY Volatility**: Rates change based on utilization`,
        estimated_minutes: 35
      },
      {
        title: 'SDK and API Integration',
        content: `## Blue SDK

The official SDK simplifies Morpho integrations:

\`\`\`bash
npm install @morpho-org/blue-sdk
\`\`\`

### Basic Usage

\`\`\`typescript
import { MorphoClient, Market } from '@morpho-org/blue-sdk';

const client = new MorphoClient({ 
  provider, 
  chainId: 1 // Ethereum mainnet
});

// Get market data
const market = await client.getMarket(marketId);
console.log({
  totalSupplyAssets: market.totalSupplyAssets,
  totalBorrowAssets: market.totalBorrowAssets,
  supplyAPY: market.supplyAPY,
  borrowAPY: market.borrowAPY
});

// Get user position
const position = await client.getPosition(marketId, userAddress);
console.log({
  supplyShares: position.supplyShares,
  borrowShares: position.borrowShares,
  collateral: position.collateral
});
\`\`\`

### GraphQL API

Endpoint: \`https://api.morpho.org/graphql\`

#### Query Vaults

\`\`\`graphql
query Vaults {
  vaults {
    items {
      address
      name
      symbol
      totalAssets
      apy
      curator {
        name
      }
    }
  }
}
\`\`\`

#### Query Markets

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
      totalSupply
      totalBorrow
    }
  }
}
\`\`\`

#### Query User Positions

\`\`\`graphql
query UserPositions($address: String!) {
  userPositions(
    where: { userAddress_eq: $address }
  ) {
    items {
      market { uniqueKey }
      supplyAssets
      borrowAssets
      collateralAssets
    }
  }
}
\`\`\`

### Contract Addresses

**Ethereum Mainnet**:
- Morpho Blue: \`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb\`
- AdaptiveCurveIRM: \`0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC\`
- MetaMorpho Factory V1.1: \`0x1897A8997241C1cD4bD0698647e4EB7213535c24\`
- Public Allocator: \`0xfd32fA2ca22c76dD6E550706Ad913FC6CE91c75D\`

### Subgraph

For historical data and complex queries:
- Available for all supported chains
- Real-time indexing of protocol events
- Custom query support

### Rate Limiting

- API: 100 requests/minute default
- Subgraph: Based on query complexity
- Consider caching for high-traffic applications

### Error Handling

Common errors and solutions:

| Error | Cause | Solution |
|-------|-------|----------|
| Insufficient liquidity | Market fully utilized | Try different market or amount |
| Stale price | Oracle hasn't updated | Wait or use different market |
| Unauthorized | Missing approval | Approve token first |
| Invalid market | Wrong parameters | Verify market ID |

### Testing

Always test on:
1. Local fork (Anvil/Hardhat)
2. Testnet (Sepolia, Base Sepolia)
3. Mainnet (with small amounts first)`,
        estimated_minutes: 40
      },
      {
        title: 'Bundler3: Complex Operations',
        content: `## What are Bundlers?

Bundlers combine multiple actions into a single transaction:
- Save gas fees
- Atomic execution (all succeed or all fail)
- Complex workflows in one click

## Bundler3 Architecture

Bundler3 uses an adapter pattern:
- **Bundler3 Core**: Orchestrates execution
- **GeneralAdapter1**: Morpho + common operations
- **Specialized Adapters**: Paraswap, migration, etc.

## Common Bundled Operations

### One-Click Leverage

\`\`\`
1. Wrap ETH → WETH
2. Supply WETH as collateral
3. Borrow USDC
4. Swap USDC → WETH
5. Supply WETH as additional collateral
\`\`\`

### Instant Refinancing

\`\`\`
1. Flash borrow from new market
2. Repay old market
3. Withdraw collateral from old market
4. Supply to new market
5. Borrow from new market
6. Repay flash loan
\`\`\`

### Collateral Swap

\`\`\`
1. Flash loan for target collateral
2. Supply new collateral
3. Borrow against it
4. Withdraw old collateral
5. Swap to repay flash loan
\`\`\`

## Integration Example

\`\`\`javascript
// Build bundle of actions
const bundle = [
  {
    adapter: generalAdapter,
    data: generalAdapter.interface.encodeFunctionData('morphoSupplyCollateral', [
      marketParams,
      collateralAmount,
      userAddress
    ])
  },
  {
    adapter: generalAdapter,
    data: generalAdapter.interface.encodeFunctionData('morphoBorrow', [
      marketParams,
      borrowAmount,
      0, // shares (0 = use assets)
      userAddress
    ])
  }
];

// Execute bundle
await bundler.multicall(bundle);
\`\`\`

## Available Adapters

| Adapter | Purpose |
|---------|---------|
| GeneralAdapter1 | Morpho operations, token transfers |
| ParaswapAdapter | Token swapping |
| ERC20WrapperAdapter | Wrap/unwrap tokens |
| Migration Adapters | Migrate from Aave/Compound |

## Gas Savings

Bundling typically saves 20-40% on gas compared to separate transactions due to:
- Single transaction overhead
- Reduced storage operations
- Optimized calldata

## Security

- All operations revert if any step fails
- No partial execution
- Slippage protection via min amounts

## Partner Use Cases

**Yield Aggregator**:
- Bundle: Deposit → Allocate across vaults → Stake receipts

**Trading Platform**:
- Bundle: Deposit collateral → Borrow → Execute trade

**Wallet**:
- Bundle: Approve → Deposit → Receive shares in one click`,
        estimated_minutes: 35
      },
      {
        title: 'Flash Loans and Callbacks',
        content: `## Flash Loans in Morpho

Flash loans allow borrowing without collateral, as long as repayment happens in the same transaction.

### Flash Loan Flow

1. **Initiate**: Call \`morpho.flashLoan(token, amount, data)\`
2. **Receive**: Morpho transfers tokens to caller
3. **Callback**: \`onMorphoFlashLoan(amount, data)\` is called
4. **Execute**: Your logic (arbitrage, swap, etc.)
5. **Repay**: Approve Morpho to pull back amount
6. **Verify**: Morpho confirms repayment

If any step fails, entire transaction reverts.

### Implementation Example

\`\`\`solidity
contract FlashLoanExample is IMorphoFlashLoanCallback {
    IMorpho public immutable morpho;
    
    constructor(address _morpho) {
        morpho = IMorpho(_morpho);
    }
    
    function executeFlashLoan(address token, uint256 amount) external {
        morpho.flashLoan(token, amount, abi.encode(token));
    }
    
    function onMorphoFlashLoan(uint256 assets, bytes calldata data) external {
        require(msg.sender == address(morpho), "Unauthorized");
        
        address token = abi.decode(data, (address));
        
        // Your logic here
        // e.g., arbitrage, collateral swap, etc.
        
        // Must approve repayment
        IERC20(token).approve(address(morpho), assets);
    }
}
\`\`\`

### Use Cases

1. **Arbitrage**: Exploit price differences across DEXs
2. **Collateral Swap**: Change collateral type without closing position
3. **Self-Liquidation**: Avoid penalties by liquidating yourself
4. **Leverage**: Build positions without looping
5. **Refinancing**: Move between markets efficiently

### Callback Types

Morpho supports multiple callback interfaces:

- \`IMorphoFlashLoanCallback\`: Flash loans
- \`IMorphoSupplyCallback\`: Supply operations
- \`IMorphoSupplyCollateralCallback\`: Collateral supply
- \`IMorphoRepayCallback\`: Repay operations
- \`IMorphoLiquidateCallback\`: Liquidations

### Security Considerations

1. **Always verify caller**: Ensure msg.sender is Morpho
2. **Approve repayment**: Without this, transaction reverts
3. **Handle reentrancy**: Be careful with external calls
4. **Gas limits**: Flash loans consume significant gas
5. **No state**: Don't leave funds in flash loan contracts

### Partner Applications

**DEX Aggregator**:
- Use flash loans for atomic arbitrage
- Ensure prices are aligned across venues

**Risk Management**:
- Self-liquidation to avoid penalties
- Emergency collateral swaps

**Leverage Protocols**:
- One-click leverage via flash loans
- More efficient than looping`,
        estimated_minutes: 35
      }
    ]
  },
  
  // MODULE 3: Partner Communication
  {
    id: 'partner-communication',
    title: 'Partner Communication',
    category: 'communication',
    difficulty: 2,
    lessons: [
      {
        title: 'Explaining Morpho to Different Audiences',
        content: `## Audience-Specific Explanations

### For Non-Technical Partners

**The Marketplace Analogy**:
"Traditional lending like Aave is like one big Walmart - everything in one place. Morpho is like a marketplace with many specialized shops. Each shop (market) only handles specific pairs, so if one has a problem, the others keep running. This means better rates and better risk management."

**Key Points**:
- Isolation = safety
- Permissionless = anyone can participate
- Vaults = professional management

### For Technical Leads

**Architecture Focus**:
"Morpho is a lending primitive with two layers:

1. **Blue (Markets)**: Immutable, isolated lending pools. Each market has its own oracle, IRM, and LLTV. No shared risk.

2. **MetaMorpho (Vaults)**: ERC-4626 vaults that allocate across markets. Curators manage strategy, allocators execute."

**Technical Advantages**:
- Immutable contracts (no admin keys)
- Isolated risk per market
- Higher LTVs possible (no rehypothecation)
- Permissionless market creation
- IRM-agnostic design

### For Risk Teams

**Risk Framework**:
"Morpho isolates risk to individual markets. Unlike pooled lending where one bad asset affects everyone, Morpho markets are independent.

**Risk Controls**:
- LLTV limits per market
- Oracle-based pricing
- Liquidation mechanisms
- Timelocked governance

**Vault Risk**:
- Curator reputation matters
- Diversification across markets
- Sentinel emergency functions
- User can always withdraw"

### For Business Development

**Value Proposition**:
"Morpho offers:
- **Better rates**: Through P2P matching and higher utilization
- **More markets**: Permissionless creation for any asset pair
- **Flexibility**: Integrate via vaults (simple) or markets (custom)
- **Proven track record**: $10B+ in deposits

**Use Cases**:
- Yield aggregators (earn integrations)
- Trading platforms (borrow for leverage)
- Wallets (native yield for users)
- Institutions (curated vault strategies)"

### For Developers

**Integration Paths**:
"Three ways to integrate:

1. **Vaults** (easiest): Deposit to curated vaults, receive yield-bearing shares
2. **Markets** (custom): Direct interaction for specific strategies
3. **Bundler3** (advanced): Complex multi-step operations in one transaction

**SDK**: \`@morpho-org/blue-sdk\`
**API**: GraphQL at api.morpho.org
**Docs**: docs.morpho.org"

### Common Questions Cheat Sheet

| Question | Short Answer |
|----------|--------------|
| "How is this different from Aave?" | Isolated markets vs shared pool. Higher LTVs. Permissionless. |
| "Is it safe?" | Audited by leading firms. Immutable contracts. $10B+ TVL. |
| "What are the fees?" | Currently 0 protocol fees. Curators may charge (0-20%). |
| "How fast can we integrate?" | Simple: 1-2 weeks. Complex: 1-2 months. |
| "What chains?" | Ethereum, Base, and many others. See docs for full list. |
| "Can we create custom markets?" | Yes, permissionless. Define your own parameters. |

### Red Flags to Address

**"We need admin controls"** → Explain immutability as a feature
**"Can you pause the protocol?"** → No, but explain isolation benefits
**"What if curators are malicious?"** → Timelocks, sentinels, user withdrawal rights
**"How do we trust oracles?"** → Discuss oracle diversity, Morpho's oracle-agnostic design`,
        estimated_minutes: 40
      },
      {
        title: 'Discovery and Scoping',
        content: `## Discovery Questions Framework

### Understanding the Partner

**1. What are you building?**
- Category: Wallet, DEX, Aggregator, Yield platform, etc.
- Stage: MVP, scaling, established
- Users: Retail, institutional, DeFi natives

**2. What's your timeline?**
- MVP deadline?
- Full launch target?
- Any external commitments?

**3. What's your technical stack?**
- Frontend: React, Vue, mobile?
- Backend: Node, Python, Go?
- Blockchain: EVM-only or multi-chain?

**4. What assets are you interested in?**
- Blue chips (ETH, WBTC, stables)?
- Long-tail tokens?
- Specific LSTs/LRTs?

**5. What's your risk tolerance?**
- Conservative (only top vaults)?
- Aggressive (new markets)?
- User-defined?

### Technical Discovery

**Integration Complexity**:
- Simple display of APYs?
- Deposit/withdraw functionality?
- Complex strategies?

**Data Requirements**:
- Real-time prices?
- Historical data?
- User position tracking?

**UX Preferences**:
- One-click deposits?
- Advanced controls?
- Custom dashboards?

### Scoping the Integration

**Tier 1 - Display Only (1 week)**:
- Show vault/market data
- Link to Morpho app
- APY display

**Tier 2 - Basic Integration (2-4 weeks)**:
- Deposit/withdraw via SDK
- Show user positions
- Basic analytics

**Tier 3 - Full Integration (1-2 months)**:
- Custom UI
- Advanced features
- White-label experience

**Tier 4 - Deep Integration (2-3 months)**:
- Custom vaults
- Complex strategies
- Multi-protocol

### Identifying Blockers Early

**Technical Blockers**:
- Team Solidity experience?
- Testing infrastructure?
- Security audit requirements?

**Business Blockers**:
- Internal approvals needed?
- Compliance requirements?
- Resource constraints?

**Timeline Blockers**:
- Competing priorities?
- External deadlines?
- Team availability?

### Creating the Integration Plan

**Phase 1: Setup (Week 1)**
- SDK installation
- Testnet deployment
- Basic connection

**Phase 2: Core Features (Weeks 2-3)**
- Deposit functionality
- Withdraw functionality
- Position display

**Phase 3: Polish (Week 4)**
- Error handling
- Edge cases
- UX improvements

**Phase 4: Launch**
- Mainnet deployment
- Monitoring
- Documentation

### Documentation to Provide

- Quickstart guide
- Code examples
- Testing checklist
- Troubleshooting guide
- Support channels (Telegram/Slack)

### Setting Expectations

**What Morpho Provides**:
- Technical support
- Code review
- Documentation
- Best practices

**What Partner Needs**:
- Dedicated developer
- Testing resources
- Timeline commitment
- Clear requirements

**Response Times**:
- Critical issues: Same day
- Technical questions: 24-48 hours
- Feature requests: Evaluated weekly`,
        estimated_minutes: 45
      },
      {
        title: 'Troubleshooting and Support',
        content: `## Common Integration Issues

### Issue: "Transaction reverts with insufficient liquidity"

**Diagnosis**:
- Market utilization at 100%
- Trying to borrow more than available

**Solution**:
1. Check \`totalSupplyAssets - totalBorrowAssets\`
2. Show "Max Borrow" to user
3. Suggest alternative markets

**Prevention**:
- Query available liquidity before showing UI
- Cache and refresh periodically

### Issue: "User can't withdraw"

**Possible Causes**:
1. Market has no liquidity (utilization 100%)
2. User has active borrow (need to repay first)
3. Position is liquidatable

**Solution**:
1. Check if position has borrows
2. Check market liquidity
3. Suggest partial withdraw or repay

### Issue: "Prices seem wrong"

**Possible Causes**:
1. Oracle stale
2. Wrong decimal handling
3. Displaying raw vs formatted

**Solution**:
1. Verify oracle last update time
2. Check decimal conversion (USDC 6, ETH 18)
3. Use formatted units for display

### Issue: "APY calculation doesn't match"

**Possible Causes**:
1. Not accounting for compounding
2. Wrong rate conversion
3. Outdated data

**Solution**:
\`\`\`typescript
// Correct calculation
const borrowAPY = Math.exp(ratePerSecond * SECONDS_PER_YEAR) - 1;
const supplyAPY = borrowAPY * utilization * (1 - fee);
\`\`\`

### Issue: "Position health shows incorrectly"

**Common Mistakes**:
1. Wrong decimal handling
2. Not using oracle price scale (36 decimals)
3. LLTV in basis points vs WAD

**Correct Calculation**:
\`\`\`typescript
const collateralValue = (collateral * oraclePrice) / 10n**36n;
const maxBorrow = (collateralValue * lltv) / 10n**18n;
const healthFactor = maxBorrow / borrowed;
\`\`\`

### Support Escalation Process

**Level 1 - Self-Service**:
- Documentation
- FAQs
- Example code

**Level 2 - Integration Team** (You!):
- Technical questions
- Code review
- Debugging help
- Best practices

**Level 3 - Engineering**:
- Protocol bugs
- Feature requests
- Complex issues

### Escalation Criteria

**Escalate to Engineering when**:
- Potential protocol bug
- Security concern
- Feature not working as documented
- Performance issues

**Template for Escalation**:
\`\`\`
Partner: [Name]
Issue: [Description]
Steps to Reproduce:
1. ...
2. ...
3. ...

Expected: [What should happen]
Actual: [What actually happens]

Code snippet: [Minimal example]
Transaction hash: [If applicable]
\`\`\`

### Building a Knowledge Base

Track recurring questions:
- Add to documentation
- Create code examples
- Update troubleshooting guide

**Common Questions to Document**:
- "How do I calculate APY?"
- "What's the difference between shares and assets?"
- "How do I check if a position is healthy?"
- "Can I partially liquidate?"

### Communication Best Practices

**In Telegram/Slack**:
- Respond quickly (even if just acknowledging)
- Use threads for complex issues
- Share code snippets in blocks
- Tag relevant team members

**On Calls**:
- Take notes
- Follow up with summary
- Provide next steps
- Set clear expectations

**Documentation**:
- Keep partner docs updated
- Log lessons learned
- Share improvements with team`,
        estimated_minutes: 45
      }
    ]
  },
  
  // MODULE 4: Advanced Topics
  {
    id: 'advanced-topics',
    title: 'Advanced Topics',
    category: 'protocol',
    difficulty: 3,
    lessons: [
      {
        title: 'Oracles and Price Feeds',
        content: `## Oracle Architecture

Morpho is oracle-agnostic but typically uses Chainlink.

### Oracle Interface

\`\`\`solidity
interface IOracle {
    function price() external view returns (uint256);
}
\`\`\`

Returns price with 36 decimal precision:
\`\`\`
Price = (collateralPrice / loanPrice) × 10^36
\`\`\`

### Chainlink Oracle V2

Morpho's standard oracle uses Chainlink feeds:

\`\`\`solidity
price = (chainlinkCollateralPrice × 10^36) / chainlinkLoanPrice
\`\`\`

Scale factors handle different decimal precisions.

### Oracle Risk

**Risk Factors**:
1. **Stale prices**: Oracle hasn't updated recently
2. **Price deviations**: DEX prices differ significantly
3. **Oracle failure**: Feed stops working

**Mitigations**:
1. Use multiple price sources
2. Implement circuit breakers
3. Monitor oracle health
4. Diversify across markets

### Creating Custom Oracles

Partners can create custom oracles for exotic assets:

\`\`\`solidity
contract CustomOracle is IOracle {
    function price() external view returns (uint256) {
        // Custom price logic
        // Could use Uniswap TWAP, multiple sources, etc.
        return calculatedPrice;
    }
}
\`\`\`

### Oracle Factory

Morpho provides oracle factories for easy creation:
- ChainlinkOracleV2Factory
- Creates correctly configured oracles
- Ensures proper scale factors

### Integration Considerations

**When showing prices**:
- Always show last update time
- Warn if stale (>1 hour)
- Use 36-decimal precision internally

**When calculating position health**:
- Use current oracle price
- Account for volatility
- Consider TWAP for large positions

### Common Issues

**"Oracle returns 0"**:
- Feed doesn't exist for this pair
- Check oracle address
- Verify feed is active

**"Price seems wrong"**:
- Check decimal conversion
- Verify price direction (collateral/loan)
- Compare with other sources

### Best Practices

1. **Monitor oracle updates**: Track freshness
2. **Multiple sources**: Don't rely on single oracle
3. **Circuit breakers**: Pause if prices diverge
4. **User warnings**: Show price staleness in UI`,
        estimated_minutes: 35
      },
      {
        title: 'Universal Rewards Distributor (URD)',
        content: `## Rewards System

Morpho uses the Universal Rewards Distributor for incentivizing vaults and markets.

### How URD Works

1. **Distribution creation**: Rewards program created for a vault/market
2. **Merkle tree**: Rewards calculated off-chain, committed on-chain
3. **Claiming**: Users claim rewards with Merkle proofs
4. **Multiple tokens**: Support for various reward tokens

### Integration

**Checking Claimable Rewards**:

\`\`\`typescript
// Query user's claimable rewards
const rewards = await urd.claimable(userAddress, rewardToken);
\`\`\`

**Claiming Rewards**:

\`\`\`typescript
// Claim specific reward
await urd.claim(
  userAddress,
  rewardToken,
  claimableAmount,
  merkleProof
);

// Or claim all rewards at once
await urd.claimAll(userAddress, claims);
\`\`\`

### Rewards Calculation

APY including rewards:
\`\`\`
Total APY = Base APY + Rewards APY
\`\`\`

Calculate rewards APY:
\`\`\`
Rewards APY = (Reward Value / Total Deposits) × (Year / Duration)
\`\`\`

### Displaying Rewards

**In Your UI**:
1. Show base APY
2. Show rewards APY separately
3. Show total APY
4. List reward tokens

**Example**:
\`\`\`
Vault APY: 4.5% base + 2.3% MORPHO = 6.8% total
\`\`\`

### Common Questions

**Q: "How are rewards distributed?"**
A: Proportionally based on shares held during reward period.

**Q: "Can rewards be claimed anytime?"**
A: Yes, once the Merkle root is updated.

**Q: "What tokens can be rewards?"**
A: Any ERC20 token.

**Q: "How often are rewards updated?"**
A: Depends on the program - weekly, monthly, etc.`,
        estimated_minutes: 25
      },
      {
        title: 'Governance and MORPHO Token',
        content: `## MORPHO Token

The MORPHO token enables governance of the protocol.

### Token Utility

1. **Governance voting**: Vote on protocol changes
2. **Parameter changes**: IRM approvals, fee settings
3. **Treasury control**: Manage protocol treasury

### Governance Process

1. **Proposal**: Forum discussion
2. **Review**: Community feedback
3. **Vote**: On-chain voting
4. **Execution**: Timelock delay, then execution

### Key Governance Decisions

- IRM approvals (currently only AdaptiveCurveIRM)
- Fee activation (currently 0 fees)
- Treasury allocations
- Protocol upgrades

### For Integrators

**Does governance affect integrations?**
- Generally no - markets are immutable
- New IRMs may be approved
- Fee changes would affect markets

**Monitoring Governance**:
- Subscribe to governance forum
- Follow Snapshot votes
- Track on-chain proposals

### Token Economics

- **Supply**: 1 billion MORPHO
- **Distribution**: Community, team, investors
- **Vesting**: Various schedules
- **Inflation**: None (fixed supply)

### Common Questions

**Q: "Do users need MORPHO tokens?"**
A: No, tokens only needed for governance.

**Q: "Can MORPHO be used as collateral?"**
A: Yes, if markets are created for it.

**Q: "How do I participate in governance?"**
A: Acquire MORPHO, delegate voting power, participate in votes.

### Resources

- Governance forum: governance.morpho.org
- Snapshot: snapshot.org/#/morpho.eth
- Token info: morpho.org/token`,
        estimated_minutes: 20
      }
    ]
  }
];

// Comprehensive quiz questions
const COMPREHENSIVE_QUIZZES = [
  // Protocol Basics
  {
    question_id: 'qb001',
    question: 'What is the main advantage of Morpho\'s isolated market design?',
    options: JSON.stringify(['Lower gas costs', 'Risk in one market doesn\'t affect others', 'Higher interest rates', 'Faster transactions']),
    correct_answer: 1,
    explanation: 'Isolation means each market operates independently. If one market has issues (bad debt, oracle problems), it doesn\'t cascade to other markets.',
    difficulty: 1,
    category: 'protocol',
    tags: 'isolation,risk,markets'
  },
  {
    question_id: 'qb002',
    question: 'What does LLTV stand for in Morpho?',
    options: JSON.stringify(['Liquidation Loan-to-Value', 'Lending Liquidity Threshold Value', 'Long-term Lending Total Volume', 'Liquidation Limit Total Value']),
    correct_answer: 0,
    explanation: 'LLTV (Liquidation Loan-to-Value) is the maximum ratio of borrowed assets to collateral value before liquidation becomes possible.',
    difficulty: 1,
    category: 'protocol',
    tags: 'lltv,liquidation,terminology'
  },
  {
    question_id: 'qb003',
    question: 'Who manages the allocation strategy in a Morpho Vault V2?',
    options: JSON.stringify(['The Owner', 'The Curator', 'The Allocator', 'Token holders']),
    correct_answer: 1,
    explanation: 'The Curator defines the vault\'s strategy and risk boundaries. In V2, they appoint Allocators who execute tactical allocation within those boundaries.',
    difficulty: 2,
    category: 'protocol',
    tags: 'vaults,curators,v2'
  },
  {
    question_id: 'qb004',
    question: 'What is the target utilization rate for the AdaptiveCurveIRM?',
    options: JSON.stringify(['80%', '90%', '95%', '100%']),
    correct_answer: 1,
    explanation: 'The AdaptiveCurveIRM targets 90% utilization, adjusting rates to maintain this level. This is higher than traditional lending pools due to Morpho\'s non-rehypothecation design.',
    difficulty: 2,
    category: 'protocol',
    tags: 'irm,utilization,adaptive'
  },
  {
    question_id: 'qb005',
    question: 'What happens when a position\'s Health Factor drops below 1?',
    options: JSON.stringify(['Position is automatically closed', 'Position becomes eligible for liquidation', 'Interest rates increase', 'Collateral is frozen']),
    correct_answer: 1,
    explanation: 'When Health Factor < 1, the position is underwater and can be liquidated by anyone. The position remains open until a liquidator acts.',
    difficulty: 2,
    category: 'protocol',
    tags: 'liquidation,health-factor'
  },
  // Integration
  {
    question_id: 'qi001',
    question: 'Which SDK package should integrators use for Morpho?',
    options: JSON.stringify(['@morpho/morpho-js', '@morpho-org/blue-sdk', 'morpho-react', 'web3-morpho']),
    correct_answer: 1,
    explanation: '@morpho-org/blue-sdk is the official SDK for interacting with Morpho Blue protocol.',
    difficulty: 1,
    category: 'integration',
    tags: 'sdk,integration'
  },
  {
    question_id: 'qi002',
    question: 'What is Bundler3 used for?',
    options: JSON.stringify(['Staking MORPHO tokens', 'Bundling multiple operations into one transaction', 'Creating new markets', 'Managing vault curation']),
    correct_answer: 1,
    explanation: 'Bundler3 allows combining multiple actions (supply, borrow, swap, etc.) into a single transaction, saving gas and enabling complex workflows.',
    difficulty: 2,
    category: 'integration',
    tags: 'bundler3,transactions'
  },
  {
    question_id: 'qi003',
    question: 'What is the main difference between Vault V1 and Vault V2?',
    options: JSON.stringify(['V1 is deprecated', 'V2 supports adapters for any protocol, not just Morpho markets', 'V1 has higher fees', 'V2 requires KYC']),
    correct_answer: 1,
    explanation: 'Vault V2 introduces adapters allowing allocation to any protocol, granular risk curation with ID/Cap system, and onchain compliance gating.',
    difficulty: 2,
    category: 'integration',
    tags: 'vaults,v1,v2,comparison'
  },
  // Communication
  {
    question_id: 'qc001',
    question: 'A partner asks "How is Morpho different from Aave?" What\'s the best answer?',
    options: JSON.stringify([
      'Morpho has lower fees',
      'Morpho uses isolated markets instead of shared pools, has higher LTVs, and is permissionless',
      'Morpho is on more chains',
      'Morpho has better marketing'
    ]),
    correct_answer: 1,
    explanation: 'The key differentiators are isolated markets (risk containment), higher LTVs (capital efficiency), and permissionless market creation.',
    difficulty: 2,
    category: 'communication',
    tags: 'comparison,aave,explaining'
  },
  {
    question_id: 'qc002',
    question: 'During discovery, what should be your FIRST question to a potential partner?',
    options: JSON.stringify(['What is your timeline?', 'What are you building?', 'What is your budget?', 'What chain are you on?']),
    correct_answer: 1,
    explanation: 'Understanding what the partner is building helps frame all subsequent discussions and determine the best integration approach.',
    difficulty: 1,
    category: 'communication',
    tags: 'discovery,partners'
  },
  // Advanced
  {
    question_id: 'qa001',
    question: 'What decimal precision does Morpho\'s oracle use for prices?',
    options: JSON.stringify(['18 decimals', '36 decimals', '8 decimals', 'Depends on the asset']),
    correct_answer: 1,
    explanation: 'Morpho oracles return prices with 36 decimal precision to handle division of two 18-decimal values without precision loss.',
    difficulty: 3,
    category: 'protocol',
    tags: 'oracle,decimals,technical'
  },
  {
    question_id: 'qa002',
    question: 'In a flash loan, when must the borrowed amount be repaid?',
    options: JSON.stringify(['Within 1 hour', 'Within the same transaction block', 'Within 24 hours', 'Before the next oracle update']),
    correct_answer: 1,
    explanation: 'Flash loans must be repaid within the same transaction block. If not repaid, the entire transaction reverts.',
    difficulty: 2,
    category: 'protocol',
    tags: 'flash-loans,mechanics'
  }
];

// Interview scenarios based on job description
const INTERVIEW_SCENARIOS = [
  {
    scenario_id: 'int_001',
    type: 'conceptual',
    title: 'Explain Morpho to a DeFi Fund',
    description: 'You\'re on a call with a DeFi fund considering using Morpho for yield generation. They understand Aave but are new to Morpho. Explain what Morpho is and why they should consider it.',
    questions: JSON.stringify([
      'What is Morpho at a high level?',
      'How is it different from Aave/Compound?',
      'What are the main benefits for a yield-focused fund?',
      'What risks should they be aware of?'
    ]),
    difficulty: 2,
    category: 'communication'
  },
  {
    scenario_id: 'int_002',
    type: 'technical',
    title: 'Integration Architecture Discussion',
    description: 'A protocol wants to integrate Morpho vaults into their yield aggregator. Their lead developer asks about the best technical approach.',
    questions: JSON.stringify([
      'What are the integration options?',
      'Should they use the SDK or direct contract calls?',
      'What data should they display to users?',
      'What are common pitfalls to avoid?'
    ]),
    difficulty: 3,
    category: 'integration'
  },
  {
    scenario_id: 'int_003',
    type: 'troubleshooting',
    title: 'Liquidation Issue',
    description: 'A user messages your Telegram support channel: "My position was liquidated but I think the price was wrong. Can you help?"',
    questions: JSON.stringify([
      'What information do you need?',
      'How do you investigate?',
      'What do you tell the user?',
      'When do you escalate to engineering?'
    ]),
    difficulty: 3,
    category: 'support'
  },
  {
    scenario_id: 'int_004',
    type: 'partner',
    title: 'Risk Team Questions',
    description: 'A potential partner\'s risk team is concerned about Morpho\'s safety. They ask detailed questions about the protocol\'s security model.',
    questions: JSON.stringify([
      'How do you explain Morpho\'s security?',
      'What about smart contract risk?',
      'How does market isolation help?',
      'What happens if there\'s a bug?'
    ]),
    difficulty: 3,
    category: 'communication'
  },
  {
    scenario_id: 'int_005',
    type: 'technical',
    title: 'Custom Market Creation',
    description: 'A partner wants to create a custom market for a long-tail token. They ask about the process and requirements.',
    questions: JSON.stringify([
      'What do they need to create a market?',
      'What oracle options do they have?',
      'How do they choose LLTV?',
      'What risks should they consider?'
    ]),
    difficulty: 3,
    category: 'integration'
  },
  {
    scenario_id: 'int_006',
    type: 'conceptual',
    title: 'Vault vs Direct Markets',
    description: 'A sophisticated DeFi user asks: "Why would I use a vault instead of depositing directly into markets?"',
    questions: JSON.stringify([
      'What are the tradeoffs?',
      'When should someone use vaults vs direct markets?',
      'What are curator fees?',
      'Can they lose money in a vault?'
    ]),
    difficulty: 2,
    category: 'protocol'
  },
  {
    scenario_id: 'int_007',
    type: 'troubleshooting',
    title: 'Transaction Reverting',
    description: 'An integrator reports that user deposits are reverting with "insufficient liquidity". They\'re frustrated and need help quickly.',
    questions: JSON.stringify([
      'What\'s likely causing this?',
      'How do you verify?',
      'What\'s the immediate fix?',
      'How do they prevent this in the future?'
    ]),
    difficulty: 2,
    category: 'support'
  },
  {
    scenario_id: 'int_008',
    type: 'partner',
    title: 'Discovery Call',
    description: 'You\'re on a discovery call with a new potential partner. They\'re building a DeFi dashboard and want to add Morpho data.',
    questions: JSON.stringify([
      'What questions do you ask?',
      'What integration approach do you recommend?',
      'What timeline do you suggest?',
      'What resources do you provide?'
    ]),
    difficulty: 2,
    category: 'communication'
  }
];

// Coding challenges relevant to integration work
const CODING_CHALLENGES = [
  {
    challenge_id: 'code_001',
    title: 'Calculate Position Health Factor',
    description: 'Write a function to calculate the health factor of a Morpho position. Health Factor = (Collateral Value × LLTV) / Borrowed Amount. Return a value where > 1e18 means healthy.',
    difficulty: 1,
    category: 'calculation',
    starter_code: `function calculateHealthFactor(
  collateralAmount,    // bigint, e.g., 5e18 for 5 ETH
  collateralPrice,     // bigint, 36 decimals (oracle price)
  borrowAmount,        // bigint, e.g., 5000e6 for 5000 USDC
  lltv                 // bigint, 18 decimals (e.g., 8650e14 = 86.5%)
) {
  const PRICE_SCALE = 10n ** 36n;
  const WAD = 10n ** 18n;
  
  // Your code here
  
}`,
    solution: `function calculateHealthFactor(collateralAmount, collateralPrice, borrowAmount, lltv) {
  const PRICE_SCALE = 10n ** 36n;
  const WAD = 10n ** 18n;
  
  // Calculate collateral value in loan token units
  const collateralValue = (collateralAmount * collateralPrice) / PRICE_SCALE;
  
  // Calculate max borrow allowed
  const maxBorrow = (collateralValue * lltv) / WAD;
  
  // Health factor (scaled to WAD)
  const healthFactor = (maxBorrow * WAD) / borrowAmount;
  
  return healthFactor;
}`,
    test_cases: JSON.stringify([
      { input: ["5000000000000000000", "2000000000000000000000000000000000000", "5000000000000", "865000000000000000"], expected: "1730000000000000000" },
      { input: ["1000000000000000000", "2000000000000000000000000000000000000", "1800000000000", "865000000000000000"], expected: "961111111111111111" }
    ]),
    hints: JSON.stringify(['Convert collateral to USD using oracle price', 'Remember to divide by PRICE_SCALE (36 decimals)', 'LLTV is in WAD format (18 decimals)'])
  },
  {
    challenge_id: 'code_002',
    title: 'Parse Market Data for Display',
    description: 'Create a function that takes raw market data and returns formatted display values including APYs and utilization.',
    difficulty: 2,
    category: 'data-processing',
    starter_code: `function formatMarketData(market) {
  // Input:
  // market.totalSupplyAssets (bigint)
  // market.totalBorrowAssets (bigint)
  // market.supplyAPY (number, e.g., 0.045 for 4.5%)
  // market.loanAsset.decimals (number)
  
  // Return object with:
  // - formattedSupply (e.g., "$10.5M")
  // - formattedBorrow (e.g., "$8.2M")
  // - utilization (e.g., "78%")
  // - supplyAPY (e.g., "4.5%")
  
  // Your code here
  
}`,
    solution: `function formatMarketData(market) {
  const decimals = market.loanAsset.decimals;
  const scale = 10n ** BigInt(decimals);
  
  // Format amounts
  const supplyUSD = Number(market.totalSupplyAssets) / Number(scale);
  const borrowUSD = Number(market.totalBorrowAssets) / Number(scale);
  
  // Format with appropriate suffix
  const formatAmount = (amount) => {
    if (amount >= 1e9) return \`$\${(amount / 1e9).toFixed(1)}B\`;
    if (amount >= 1e6) return \`$\${(amount / 1e6).toFixed(1)}M\`;
    if (amount >= 1e3) return \`$\${(amount / 1e3).toFixed(1)}K\`;
    return \`$\${amount.toFixed(2)}\`;
  };
  
  // Calculate utilization
  const utilization = market.totalSupplyAssets > 0n 
    ? (market.totalBorrowAssets * 100n) / market.totalSupplyAssets
    : 0n;
  
  return {
    formattedSupply: formatAmount(supplyUSD),
    formattedBorrow: formatAmount(borrowUSD),
    utilization: \`\${utilization}%\`,
    supplyAPY: \`\${(market.supplyAPY * 100).toFixed(2)}%\`
  };
}`,
    test_cases: JSON.stringify([
      { input: [{totalSupplyAssets: "10500000000000", totalBorrowAssets: "8400000000000", supplyAPY: 0.045, loanAsset: {decimals: 6}}], expected: {formattedSupply: "$10.5M", formattedBorrow: "$8.4M", utilization: "80%", supplyAPY: "4.50%"} }
    ]),
    hints: JSON.stringify(['Handle decimal conversion carefully', 'Use helper function for formatting', 'Calculate utilization as percentage'])
  },
  {
    challenge_id: 'code_003',
    title: 'Calculate Liquidation Price',
    description: 'Given a position, calculate the collateral price at which it would become liquidatable (health factor = 1).',
    difficulty: 3,
    category: 'calculation',
    starter_code: `function getLiquidationPrice(
  collateralAmount,  // bigint
  borrowedAmount,    // bigint
  lltv               // bigint (18 decimals)
) {
  // Return the collateral price (in loan token units, 36 decimals scale)
  // at which health factor equals 1
  
  // Your code here
  
}`,
    solution: `function getLiquidationPrice(collateralAmount, borrowedAmount, lltv) {
  const WAD = 10n ** 18n;
  const PRICE_SCALE = 10n ** 36n;
  
  // At liquidation: (collateralAmount * price / SCALE * lltv / WAD) = borrowedAmount
  // Solving for price: price = borrowedAmount * SCALE * WAD / (collateralAmount * lltv)
  
  const liquidationPrice = (borrowedAmount * PRICE_SCALE * WAD) / (collateralAmount * lltv);
  
  return liquidationPrice;
}`,
    test_cases: JSON.stringify([
      { input: ["1000000000000000000", "1500000000000", "865000000000000000"], expected: "1734104046242774566" }
    ]),
    hints: JSON.stringify(['Work backwards from health factor = 1', 'Be careful with decimal scales', 'Price should be in 36 decimal format'])
  },
  {
    challenge_id: 'code_004',
    title: 'APY Calculator with Compounding',
    description: 'Convert a per-second interest rate to an annual APY using the proper compounding formula.',
    difficulty: 2,
    category: 'calculation',
    starter_code: `function calculateAPY(ratePerSecond) {
  // ratePerSecond: bigint with 18 decimals (WAD format)
  // Return: APY as a decimal (e.g., 0.0489 for 4.89%)
  
  const SECONDS_PER_YEAR = 31536000;
  
  // Your code here
  
}`,
    solution: `function calculateAPY(ratePerSecond) {
  const SECONDS_PER_YEAR = 31536000;
  const WAD = 10n ** 18n;
  
  // Convert rate to number
  const rate = Number(ratePerSecond) / Number(WAD);
  
  // APY = e^(rate * seconds) - 1
  const apy = Math.exp(rate * SECONDS_PER_YEAR) - 1;
  
  return apy;
}`,
    test_cases: JSON.stringify([
      { input: [1512768697], expected: 0.0489 }
    ]),
    hints: JSON.stringify(['Use exponential formula: e^(rt) - 1', 'Convert from WAD (18 decimals) to number', 'Use Math.exp for exponential'])
  }
];

async function ingestComprehensive() {
  const db = new sqlite3.Database(DB_PATH);
  
  console.log('🚀 Starting comprehensive content ingestion...\n');
  
  // Clear existing content
  console.log('🧹 Clearing existing content...');
  await new Promise(r => db.run('DELETE FROM lessons', r));
  await new Promise(r => db.run('DELETE FROM quiz_questions', r));
  await new Promise(r => db.run('DELETE FROM coding_challenges', r));
  await new Promise(r => db.run('DELETE FROM interview_scenarios', r));
  
  // Insert comprehensive lessons
  console.log('📚 Inserting comprehensive lessons...');
  let lessonCount = 0;
  for (const module of COMPREHENSIVE_MODULES) {
    for (let i = 0; i < module.lessons.length; i++) {
      const lesson = module.lessons[i];
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO lessons (module_id, lesson_order, title, content, difficulty, category, estimated_minutes)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [module.id, i, lesson.title, lesson.content, module.difficulty, module.category, lesson.estimated_minutes],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
      lessonCount++;
    }
  }
  console.log(`✅ Inserted ${lessonCount} lessons\n`);
  
  // Insert comprehensive quiz questions
  console.log('❓ Inserting comprehensive quiz questions...');
  for (const q of COMPREHENSIVE_QUIZZES) {
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO quiz_questions (question_id, question, options, correct_answer, explanation, difficulty, category, tags)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [q.question_id, q.question, q.options, q.correct_answer, q.explanation, q.difficulty, q.category, q.tags],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }
  console.log(`✅ Inserted ${COMPREHENSIVE_QUIZZES.length} quiz questions\n`);
  
  // Insert coding challenges
  console.log('💻 Inserting coding challenges...');
  for (const c of CODING_CHALLENGES) {
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO coding_challenges (challenge_id, title, description, difficulty, category, starter_code, solution, test_cases, hints)
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
        `INSERT INTO interview_scenarios (scenario_id, type, title, description, questions, difficulty, category)
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
  console.log('🎉 Comprehensive content ingestion complete!');
  console.log(`\n📊 Summary:`);
  console.log(`   - ${COMPREHENSIVE_MODULES.length} modules`);
  console.log(`   - ${lessonCount} lessons`);
  console.log(`   - ${COMPREHENSIVE_QUIZZES.length} quiz questions`);
  console.log(`   - ${CODING_CHALLENGES.length} coding challenges`);
  console.log(`   - ${INTERVIEW_SCENARIOS.length} interview scenarios`);
}

ingestComprehensive().catch(console.error);
