/**
 * Expert-Level Content Ingestion Script
 * Deep technical content from morpho.txt for Integration Engineer interview prep
 */

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../data/morpho_trainer.db');
const db = new Database(dbPath);

console.log('🚀 Ingesting expert-level Morpho content...\n');

// Begin transaction
db.exec('BEGIN TRANSACTION');

try {
  // Clear existing content
  db.exec("DELETE FROM lessons");
  db.exec("DELETE FROM quiz_questions");
  db.exec("DELETE FROM coding_challenges");
  db.exec("DELETE FROM interview_scenarios");
  db.exec("DELETE FROM sqlite_sequence WHERE name IN ('lessons', 'quiz_questions', 'coding_challenges', 'interview_scenarios')");

  // ==========================================
  // EXPERT-LEVEL LESSONS
  // ==========================================
  
  const lessons = [
    // Module 1: Morpho Core Architecture
    {
      module: 'core_architecture',
      title: 'Morpho Blue: The Lending Primitive',
      content: `# Morpho Blue: The Lending Primitive

## Core Concept

Morpho Blue is a decentralized, non-custodial lending protocol implemented as an **immutable smart contract** on the Ethereum Virtual Machine. It serves as a trustless base layer for lenders, borrowers, and applications.

## Key Characteristics

### 1. Immutability
- Once deployed, the contract cannot be modified
- Licensed under dual license (BUSL-1.1 and GPLv2)
- Functions in perpetuity as long as the blockchain exists

### 2. Permissionless Market Creation
Anyone can create a lending market by specifying:
- **Loan Token**: The asset being borrowed (e.g., USDC)
- **Collateral Token**: The asset securing the loan (e.g., cbBTC)
- **Oracle**: Price feed contract for collateral valuation
- **IRM**: Interest Rate Model contract
- **LLTV**: Liquidation Loan-To-Value ratio

### 3. Isolated Markets
Each market operates independently with its own risk parameters:
- No cross-collateralization between markets
- Risk is contained to individual markets
- Lenders can choose specific markets matching their risk appetite

## Contract Address (Mainnet)
\`\`\`
Morpho Blue: 0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb
\`\`\`

## Market ID Calculation
Markets are identified by a unique ID derived from:
\`\`\`solidity
keccak256(abi.encode(loanToken, collateralToken, oracle, irm, lltv))
\`\`\`

## Key Functions

### Supply
\`\`\`solidity
function supply(
    MarketParams memory marketParams,
    uint256 assets,
    uint256 shares,
    address onBehalf,
    bytes memory data
) external returns (uint256 assetsSupplied, uint256 sharesSupplied);
\`\`\`

### Borrow
\`\`\`solidity
function borrow(
    MarketParams memory marketParams,
    uint256 assets,
    uint256 shares,
    address onBehalf,
    address receiver
) external returns (uint256 assetsBorrowed, uint256 sharesBorrowed);
\`\`\`

### Supply Collateral
\`\`\`solidity
function supplyCollateral(
    MarketParams memory marketParams,
    uint256 assets,
    address onBehalf,
    bytes memory data
) external;
\`\`\`

## Why This Matters for Integration Engineers

As an Integration Engineer, you'll help partners:
1. Understand which markets fit their use case
2. Integrate supply/borrow functionality into their applications
3. Handle callbacks and complex transaction flows
4. Navigate the permissionless market landscape

## Practice Exercise

Calculate the market ID for a cbBTC/USDC market with:
- loanToken: 0xA0b86a33E6441c57aF7C6F822C7a5d9E7b9E35B2 (USDC)
- collateralToken: 0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf (cbBTC)
- oracle: 0x48... (example)
- irm: 0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC (AdaptiveCurveIRM)
- lltv: 860000000000000000 (86%)`,
      difficulty: 'advanced',
      tags: 'architecture,core,immutable,permissionless'
    },
    {
      module: 'core_architecture',
      title: 'AdaptiveCurveIRM: Interest Rate Mechanics',
      content: `# AdaptiveCurveIRM: Interest Rate Mechanics

## Overview

The AdaptiveCurveIRM is Morpho's governance-approved Interest Rate Model that maintains utilization close to a target of **90%**.

## Key Innovation

Unlike traditional lending pools, Morpho does **NOT** rehypothecate collateral. This removes systemic risk and liquidity constraints, enabling:
- Higher target utilization (90% vs ~80% in other protocols)
- Lower penalties for illiquidity
- Better rates for both lenders and borrowers

## Two-Mechanism System

### 1. The Curve Mechanism
Manages short-term utilization with a sigmoid curve:

\`\`\`
If utilization = 90% and rate = 4%:
- At 100% utilization → rate instantly jumps to 16% (×4)
- At 0% utilization → rate instantly drops to 1% (÷4)
\`\`\`

### 2. The Adaptive Mechanism
Fine-tunes the curve over time based on market conditions:

- **Utilization > 90%**: Curve shifts UP → incentivizes repayment → utilization decreases
- **Utilization < 90%**: Curve shifts DOWN → incentivizes borrowing → utilization increases

**Speed of adjustment**: Faster when further from target
- 95% utilization → doubles after 10 days
- 100% utilization → doubles after 5 days (max speed)
- 45% utilization → halves after 10 days

## Contract Address
\`\`\`
AdaptiveCurveIRM: 0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC (Ethereum)
\`\`\`

## APY Calculations

### Borrow APY
\`\`\`
borrowAPY = (e^(borrowRate × secondsPerYear) - 1)
\`\`\`

Example in TypeScript:
\`\`\`typescript
const ratePerSecond = "1512768697"; // 1.512768697 × 10^-9 (18 decimals)
const secondsInYear = 31536000;

const borrowAPY = Math.exp((Number(ratePerSecond) / 1e18) * secondsInYear) - 1;
// Result: ~4.89%
\`\`\`

### Supply APY
\`\`\`
supplyAPY = borrowAPY × utilization × (1 - fee)
\`\`\`

Currently, **no fees** are applied on Morpho markets.

## Integration Considerations

When building with Morpho:
1. Always fetch current borrow rate from the market
2. Calculate APY for UI display using the formulas above
3. Account for rate changes in position planning
4. Note: IRM is immutable per market - cannot be changed after creation`,
      difficulty: 'advanced',
      tags: 'irm,interest-rates,adaptivecurve,apy'
    },
    {
      module: 'core_architecture',
      title: 'Liquidation Mechanics: LTV, LLTV, and Health Factor',
      content: `# Liquidation Mechanics

## Overview

Liquidation protects lenders by ensuring borrowers maintain healthy collateral positions. Morpho offers:

1. **Standard Liquidation**: Protocol-level mechanism
2. **Pre-Liquidation**: Opt-in external contract for gradual liquidations

## Key Metrics

### Loan-To-Value (LTV)
\`\`\`
LTV = (BORROWED_AMOUNT / COLLATERAL_VALUE_IN_LOAN_TOKEN) × 100%
\`\`\`

Where:
\`\`\`
COLLATERAL_VALUE = (COLLATERAL_AMOUNT × ORACLE_PRICE) / ORACLE_PRICE_SCALE
\`\`\`

### Liquidation LTV (LLTV)
The threshold at which a position becomes eligible for liquidation. Examples:
- 86% (0.86) - Common for stable pairs
- 94.5% (0.945) - Lower volatility pairs
- 96.5% (0.965) - Very stable pairs

### Health Factor
\`\`\`
Health Factor = (COLLATERAL_VALUE × LLTV) / BORROWED_AMOUNT
\`\`\`

- **HF > 1.0**: Position is healthy
- **HF < 1.0**: Position can be liquidated

## Worked Example

**Position:**
- Borrowed: 150,000 USDC (6 decimals: 150,000,000,000)
- Collateral: 2 cbBTC (8 decimals: 200,000,000)
- Oracle Price: 1 × 10^39 (1 cbBTC = 100,000 USDC)
- LLTV: 86% (860000000000000000)

**Calculation:**
\`\`\`typescript
const collateralValue = (200_000_000n * 1_000_000_000_000_000_000_000_000_000_000_000_000_000n) / (10n ** 36n);
// = 200,000,000,000 (USDC units)

const currentLTV = (150_000_000_000n * WAD) / collateralValue;
// = 750,000,000,000,000,000 (75% LTV)

const healthFactor = (collateralValue * LLTV) / borrowedAmount;
// = (200,000,000,000 × 0.86) / 150,000,000,000
// = 1.147 (HEALTHY)
\`\`\`

## Liquidation Process

1. **Liquidator** identifies an underwater position (HF < 1)
2. **Liquidator** repays some or all of the debt
3. **Liquidator** receives collateral at a discount (LLTV-based)
4. **Bonus**: Liquidators earn the difference between collateral value and debt repaid

## Code Example: Liquidation Call
\`\`\`solidity
function liquidate(
    MarketParams memory marketParams,
    address borrower,
    uint256 seizedAssets,
    uint256 repaidShares,
    bytes memory data
) external returns (uint256 seizedAssetsRet, uint256 repaidAssets);
\`\`\`

## Integration Engineer Responsibilities

Help partners understand:
- How to monitor position health
- When to recommend users add collateral or repay
- Liquidation risks in volatile markets
- Pre-liquidation as a safety mechanism`,
      difficulty: 'advanced',
      tags: 'liquidation,ltv,lltv,health-factor,risk'
    },
    {
      module: 'core_architecture',
      title: 'Morpho Oracles: Price Feed Architecture',
      content: `# Morpho Oracles: Price Feed Architecture

## Overview

Morpho uses external oracle contracts for collateral pricing. The protocol is oracle-agnostic but governance approves specific oracle implementations.

## ChainlinkOracleV2

The primary governance-approved oracle uses Chainlink price feeds with additional safety features.

### Contract Address (Factory)
\`\`\`
Ethereum: 0x3A7bB36Ee3f3eE32A60e9f2b33c1e5f2E83ad766
\`\`\`

## Oracle Interface
\`\`\`solidity
interface IOracle {
    /// @notice Returns the price of 1 asset of collateral token quoted in 1 asset of loan token.
    /// @return price The price scaled by 36 decimals.
    function price() external view returns (uint256);
}
\`\`\`

## Price Scale

All Morpho oracle prices use **36 decimal places**:
\`\`\`
ORACLE_PRICE_SCALE = 10^36
\`\`\`

Example: If 1 cbBTC = 100,000 USDC
\`\`\`
price = 100,000 × 10^36 = 1 × 10^41
\`\`\`

## Oracle Implementation Details

### ChainlinkOracleV2 Features:
1. **Multiple Price Feeds**: Supports complex pricing (e.g., cbBTC/USD + USDC/USD)
2. **Stale Price Protection**: Reverts if price feed hasn't updated recently
3. **Price Bounds**: Configurable min/max to prevent extreme values
4. **Decimals Normalization**: Handles different token decimals automatically

### Creating an Oracle
\`\`\`solidity
// Through the factory
function createOracle(
    address baseVault,
    address baseFeed1,
    address baseFeed2,
    address quoteFeed1,
    address quoteFeed2,
    uint256 vaultConversionSample,
    uint256 baseTokenDecimals,
    uint256 quoteTokenDecimals,
    uint256 baseFeed1Heartbeat,
    uint256 baseFeed2Heartbeat,
    uint256 quoteFeed1Heartbeat,
    uint256 quoteFeed2Heartbeat,
    uint256 baseMinPrice,
    uint256 baseMaxPrice,
    uint256 quoteMinPrice,
    uint256 quoteMaxPrice
) external returns (address oracle);
\`\`\`

## Integration Considerations

### For Integration Engineers:

1. **Price Validation**: Always verify oracle returns reasonable prices
2. **Heartbeat Monitoring**: Ensure price feeds update within expected intervals
3. **Market Creation**: Help partners select appropriate oracles for their markets
4. **Risk Assessment**: Understand how oracle configurations affect liquidation safety

### Common Oracle Patterns:

| Collateral | Loan | Oracle Type |
|------------|------|-------------|
| cbBTC | USDC | Chainlink cbBTC/USD + USDC/USD |
| wstETH | USDC | Chainlink wstETH/USD + USDC/USD |
| wBTC | USDT | Chainlink wBTC/USD + USDT/USD |

## Security Best Practices

1. Use governance-approved oracle factories
2. Set appropriate heartbeat values for each feed
3. Configure min/max price bounds based on historical volatility
4. Test oracle behavior during network congestion
5. Monitor for price feed outages

## Code Example: Reading Oracle Price
\`\`\`typescript
const oraclePrice = await publicClient.readContract({
  address: oracleAddress,
  abi: oracleABI,
  functionName: 'price'
});

// Convert to human-readable
const collateralPriceInLoan = Number(oraclePrice) / 1e36;
\`\`\``,
      difficulty: 'advanced',
      tags: 'oracle,price-feed,chainlink,safety'
    },
    {
      module: 'integration',
      title: 'Bundler3: Transaction Batching',
      content: `# Bundler3: Transaction Batching

## Overview

**Bundler3** is Morpho's most advanced bundler for combining multiple operations into a single atomic transaction. It is integrated directly into the Morpho interface.

## Key Benefits

1. **Gas Efficiency**: Pay for one transaction instead of many
2. **Atomic Execution**: All operations succeed or all fail
3. **Complex Workflows**: Enable sophisticated DeFi strategies
4. **One-Click UX**: Users complete multi-step operations with single signature

## Common Bundle Operations

### One-Click Leverage
\`\`\`
1. Wrap ETH → wstETH
2. Supply wstETH as collateral
3. Borrow USDC
\`\`\`

### Collateral Swap
\`\`\`
1. Flash loan new collateral
2. Repay borrow with old collateral
3. Withdraw old collateral
4. Swap to new collateral
5. Supply new collateral
6. Borrow to repay flash loan
\`\`\`

### Instant Refinancing
\`\`\`
1. Borrow from Market B
2. Repay Market A
3. Withdraw collateral from Market A
4. Supply collateral to Market B
\`\`\`

## Bundler SDK (Viem)

### Installation
\`\`\`bash
npm install @morpho-org/bundler-sdk-viem
\`\`\`

### Basic Usage
\`\`\`typescript
import { populateBundle, finalizeBundle, encodeBundle } from '@morpho-org/bundler-sdk-viem';
import { DEFAULT_SLIPPAGE_TOLERANCE } from '@morpho-org/blue-sdk';

// Define operations
const operations = [
  {
    type: 'Blue_SupplyCollateral',
    args: {
      id: marketId,
      assets: collateralAmount,
      onBehalf: userAddress
    }
  },
  {
    type: 'Blue_Borrow',
    args: {
      id: marketId,
      assets: borrowAmount,
      onBehalf: userAddress,
      receiver: userAddress,
      slippage: DEFAULT_SLIPPAGE_TOLERANCE
    }
  }
];

// Populate bundle
const { operations: populatedOps } = populateBundle(
  operations,
  simulationState,
  bundlingOptions
);

// Finalize and encode
const finalizedOps = finalizeBundle(populatedOps, simulationState, receiver);
const bundle = encodeBundle(finalizedOps, simulationState);
\`\`\`

## Advanced Options

### Public Allocator Integration
\`\`\`typescript
const bundlingOptions = {
  publicAllocatorOptions: {
    enabled: true,
    supplyTargetUtilization: {
      [marketId]: 905000000000000000n // 90.5%
    },
    defaultSupplyTargetUtilization: 905000000000000000n
  }
};
\`\`\`

### Slippage Protection
\`\`\`typescript
// Include in borrow operations
const borrowOp = {
  type: 'Blue_Borrow',
  args: {
    id: marketId,
    assets: borrowAmount,
    slippage: DEFAULT_SLIPPAGE_TOLERANCE // 0.3%
  }
};
\`\`\`

## Integration Engineer Checklist

When helping partners integrate:
- [ ] Understand their specific use case and workflow
- [ ] Map user actions to bundler operations
- [ ] Configure slippage based on market volatility
- [ ] Test bundles on fork before mainnet
- [ ] Handle ERC20 approvals (bundler manages this automatically)
- [ ] Consider gas limits for complex bundles

## Resources

- Bundler SDK: https://github.com/morpho-org/sdks/tree/main/packages/bundler-sdk-viem
- Contract Specs: https://docs.morpho.org/get-started/resources/contracts/bundlers/`,
      difficulty: 'advanced',
      tags: 'bundler,bundler3,transaction-batching,integration'
    },
    {
      module: 'integration',
      title: 'Flash Loans in Morpho',
      content: `# Flash Loans in Morpho

## Overview

Flash loans allow users to borrow assets without collateral, provided the borrowed amount is returned within the same transaction block.

## The Morpho Flash Loan Flow

1. **Initiation**: Call \`morpho.flashLoan(token, amount, data)\`
2. **Asset Transfer**: Morpho transfers tokens to caller
3. **Callback Execution**: Morpho calls \`onMorphoFlashLoan(amount, data)\` on caller
4. **Logic Execution**: Your contract executes operations (swap, liquidate, etc.)
5. **Repayment**: Your contract approves Morpho to pull back funds
6. **Completion**: Morpho pulls funds, transaction completes

## Interface
\`\`\`solidity
interface IMorphoFlashLoanCallback {
    function onMorphoFlashLoan(uint256 assets, bytes calldata data) external;
}

function flashLoan(
    address token,
    uint256 assets,
    bytes calldata data
) external;
\`\`\`

## Implementation Example
\`\`\`solidity
// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.0;

import {IERC20} from "@openzeppelin/token/ERC20/IERC20.sol";
import {IMorpho} from "./interfaces/IMorpho.sol";
import {IMorphoFlashLoanCallback} from "./interfaces/IMorphoCallbacks.sol";

contract FlashBorrower is IMorphoFlashLoanCallback {
    IMorpho private immutable MORPHO;

    constructor(IMorpho morpho) {
        MORPHO = morpho;
    }

    function executeFlashLoan(address token, uint256 amount) external {
        MORPHO.flashLoan(token, amount, abi.encode(token));
    }

    function onMorphoFlashLoan(uint256 assets, bytes calldata data) external override {
        require(msg.sender == address(MORPHO), "Unauthorized");
        
        address token = abi.decode(data, (address));
        
        // YOUR LOGIC HERE
        // - Arbitrage across DEXs
        // - Self-liquidation
        // - Collateral swaps
        // - Leverage building
        
        // MUST approve repayment
        IERC20(token).approve(address(MORPHO), assets);
    }
}
\`\`\`

## Use Cases

### 1. Arbitrage
\`\`\`
1. Flash borrow USDC
2. Buy cbBTC on DEX A (cheaper)
3. Sell cbBTC on DEX B (expensive)
4. Repay USDC + keep profit
\`\`\`

### 2. Self-Liquidation
\`\`\`
1. Flash borrow loan token
2. Repay own borrow position
3. Withdraw collateral
4. Swap collateral to loan token
5. Repay flash loan
6. Keep remaining collateral
\`\`\`

### 3. Collateral Swap
\`\`\`
1. Flash borrow new collateral
2. Supply new collateral
3. Borrow against new collateral
4. Repay old borrow
5. Withdraw old collateral
6. Swap old collateral to repay flash loan
\`\`\`

### 4. Leverage (One-Transaction)
\`\`\`
1. Flash borrow target loan amount
2. Swap to collateral
3. Supply collateral
4. Borrow to repay flash loan
5. Achieve target leverage in single tx
\`\`\`

## Security Considerations

1. **Reentrancy**: Be careful calling external contracts
2. **Gas Limits**: Flash loans are complex - monitor gas
3. **Atomicity**: If repayment fails, entire tx reverts
4. **Approval**: Always approve Morpho to pull funds back
5. **Token Transfers**: Verify token amounts match expected

## Integration Support

Common partner questions:
- "How do I calculate profit after gas?"
- "What's the optimal arbitrage path?"
- "Can I combine flash loans with bundler?"
- "How do I handle failed arbitrage attempts?"

Best practice: Provide simulation capabilities before mainnet execution.`,
      difficulty: 'advanced',
      tags: 'flash-loans,arbitrage,liquidation,leverage,callbacks'
    },
    {
      module: 'vaults',
      title: 'Morpho Vaults V1 & V2: Architecture Deep Dive',
      content: `# Morpho Vaults V1 & V2

## Overview

Morpho Vaults are ERC4626-compliant vaults that aggregate user deposits and allocate them across multiple Morpho markets according to a defined strategy.

## Vault V1 (MetaMorpho)

### Key Components
- **ERC4626 Standard**: Composable with DeFi ecosystem
- **Supply Queue**: Ordered list of markets to allocate to
- **Withdraw Queue**: Ordered list for withdrawal sourcing
- **Curator**: Entity managing allocation strategy
- **Guardian**: Can revoke pending actions in emergency

### Factory Address
\`\`\`
Ethereum: 0xA9c3D3a366466Fa809d1Ae982Fb2c46E5fC41101 (Legacy)
Ethereum: 0x1897A8997241C1cD4bD0698647e4EB7213535c24 (V1.1)
\`\`\`

## Vault V2: The Evolution

### New Features

| Feature | V1 | V2 |
|---------|-----|-----|
| Protocol Selection | Morpho Markets V1 only | Any protocol via Adapters |
| Risk Curation | Supply caps per market | ID & Cap system (absolute + relative) |
| Yield Curation | Automatic | Interest rate limits (maxRate) |
| Fee Control | Owner-managed | Curator-controlled |
| Compliance | Not supported | Gate contracts |

### Role System

\`\`\`
Owner
  └── Appoints Curator & Sentinels
      └── Curator defines strategy & risk boundaries
          └── Allocator executes within boundaries
              └── Sentinel monitors & can revoke
\`\`\`

### Key Addresses (V2)
\`\`\`
VaultV2Factory: 0xA1D94F746dEfa1928926b84fB2596c06926C0405 (Ethereum)
MorphoRegistry: 0x3696c5eAe4a7Ffd04Ea163564571E9CD8Ed9364e (Ethereum)
\`\`\`

## ERC4626 Integration

### Standard Functions
\`\`\`solidity
// Deposit assets, get shares
function deposit(uint256 assets, address receiver) returns (uint256 shares);

// Mint shares, deposit assets
function mint(uint256 shares, address receiver) returns (uint256 assets);

// Withdraw assets, burn shares
function withdraw(uint256 assets, address receiver, address owner) returns (uint256 shares);

// Redeem shares, withdraw assets
function redeem(uint256 shares, address receiver, address owner) returns (uint256 assets);

// Preview functions for UI
function previewDeposit(uint256 assets) view returns (uint256 shares);
function previewRedeem(uint256 shares) view returns (uint256 assets);
\`\`\`

## Reading Vault Data

### Using SDK
\`\`\`typescript
import { Vault } from '@morpho-org/blue-sdk';

const vault = await Vault.fetch(vaultAddress, provider);
console.log(vault.totalAssets);
console.log(vault.totalSupply);
console.log(vault.supplyQueue);
\`\`\`

### Using Viem
\`\`\`typescript
const totalAssets = await publicClient.readContract({
  address: vaultAddress,
  abi: metaMorphoABI,
  functionName: 'totalAssets'
});

const supplyQueue = await Promise.all(
  Array.from({ length: supplyQueueLength }, (_, i) =>
    publicClient.readContract({
      address: vaultAddress,
      abi: metaMorphoABI,
      functionName: 'supplyQueue',
      args: [i]
    })
  )
);
\`\`\`

## Integration Patterns

### For Yield Aggregators
- Deposit user funds into Morpho Vaults
- ERC4626 compatibility makes integration trivial
- Monitor APY changes for rebalancing

### For Wallets
- Display vault APY alongside market rates
- Show underlying market allocations
- Calculate projected returns

### For Risk Managers
- Track vault allocation across markets
- Monitor exposure to specific assets
- Alert on allocation changes

## Curator/Allocator Model

### Curator Responsibilities
1. Define investment thesis
2. Set risk parameters (caps, limits)
3. Appoint allocators
4. Control fees and gates
5. All significant actions timelocked

### Allocator Responsibilities
1. Execute allocations within curator bounds
2. Optimize yield across enabled markets
3. Rebalance based on market conditions

## Support Checklist

When helping vault integrators:
- [ ] Clarify which vault version they're using
- [ ] Explain ERC4626 interface for their use case
- [ ] Show how to read allocation data
- [ ] Discuss timelock implications for Curator actions
- [ ] Explain difference between supply and withdraw queues`,
      difficulty: 'advanced',
      tags: 'vaults,metamorpho,erc4626,curator,allocator'
    },
    {
      module: 'integration',
      title: 'Universal Rewards Distributor (URD)',
      content: `# Universal Rewards Distributor (URD)

## Overview

The Universal Rewards Distributor is a permissionless rewards distribution system for Morpho markets and vaults.

## Key Features

1. **Permissionless**: Anyone can create a rewards program
2. **Merkle-based**: Efficient on-chain verification
3. **Multi-reward**: Support for multiple reward tokens
4. **Flexible**: Works with both markets and vaults

## How It Works

1. **Creator** defines rewards distribution parameters
2. **Rewards** are deposited into the URD contract
3. **Merkle Root** is submitted, defining claimable amounts
4. **Users** claim rewards by providing merkle proof
5. **Claims** are tracked to prevent double-spending

## Contract Interface

\`\`\`solidity
function createDistribution(
    address rewardToken,
    address morphoMarketOrVault,
    uint256 totalRewards,
    uint256 startTime,
    uint256 duration
) external returns (address distribution);

function claim(
    address distribution,
    address account,
    address rewardToken,
    uint256 claimable,
    bytes32[] calldata merkleProof
) external;
\`\`\`

## Claiming Rewards

### Using SDK
\`\`\`typescript
// Fetch user's claimable rewards
const rewards = await fetchUserRewards(userAddress, chainId);

// Claim via merkle proof
await urd.claim(
  distributionAddress,
  userAddress,
  rewardToken,
  claimableAmount,
  merkleProof
);
\`\`\`

### Merkl API
\`\`\`
GET https://api.merkl.xyz/v4/userRewards?user={address}
\`\`\`

Response:
\`\`\`json
{
  "1": {
    "0xVaultAddress": {
      "claimable": {
        "0xRewardToken": {
          "accumulated": "1234567890",
          "unclaimed": "1234567890",
          "symbol": "MORPHO",
          "decimals": 18
        }
      }
    }
  }
}
\`\`\`

## Rewards Types

### Market-Level Rewards
- Rewards for suppliers to a specific market
- Rewards for borrowers (can be negative APR = earning)
- Configured by market creator or third parties

### Vault-Level Rewards
- Direct campaigns targeting vault depositors
- Forwarded from underlying markets
- Controlled by vault Curator

## Integration Scenarios

### For Partners Building UI
1. Fetch all active rewards for markets/vaults
2. Display total APY = base APY + rewards APR
3. Allow one-click claiming
4. Show claim history

### For Yield Aggregators
1. Factor rewards into yield calculations
2. Auto-claim and compound rewards
3. Optimize allocation based on total APY

### For Analytics Platforms
1. Track total rewards distributed
2. Calculate effective APR from rewards
3. Compare pre/post-rewards yields

## Code Example: Aggregating Rewards
\`\`\`typescript
// Calculate total vault rewards APR
const vaultRewardsApr = vault.state.rewards.reduce(
  (sum, reward) => sum + parseFloat(reward.supplyApr), 0
);

// Calculate weighted market rewards
const marketRewardsApr = vault.state.allocation.reduce((sum, alloc) => {
  const marketRewards = alloc.market.state.rewards.reduce(
    (mSum, r) => mSum + parseFloat(r.supplyApr), 0
  );
  const weight = parseFloat(alloc.supplyAssetsUsd) / totalAllocatedUsd;
  return sum + (marketRewards * weight);
}, 0);

const totalRewardsApr = vaultRewardsApr + marketRewardsApr;
\`\`\`

## Support Topics

Common questions to prepare for:
- "How do I calculate my rewards?"
- "Why are my rewards different than expected?"
- "How do I create a rewards program?"
- "What's the difference between accumulated and unclaimed?"
- "How do merkle proofs work?"
- "Can I claim rewards for multiple periods at once?"`,
      difficulty: 'advanced',
      tags: 'rewards,urd,merkle,distribution,apy'
    },
    {
      module: 'integration',
      title: 'Public Allocator: JIT Liquidity',
      content: `# Public Allocator: JIT Liquidity

## Overview

The **Public Allocator** enables Just-In-Time (JIT) liquidity reallocation across Morpho markets without requiring vault withdrawals.

## Contract Address
\`\`\`
Ethereum: 0xfd32fA2ca22c76dD6E550706Ad913FC6CE91c75D
\`\`\`

## Why It Matters

Traditional vault reallocation requires:
1. Withdraw from Market A
2. Wait for liquidity
3. Deposit to Market B

**With Public Allocator:**
1. Reallocate instantly within vault's idle liquidity
2. No withdrawal needed
3. Users get immediate access to better rates

## How It Works

1. Vault deposits liquidity into Public Allocator
2. Allocator maintains "idle" liquidity across markets
3. When reallocation needed:
   - Withdraw from over-allocated market
   - Supply to under-allocated market
4. Instant, atomic reallocation

## Reallocation Flow

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                    Vault Deposits                        │
│                      (100M USDC)                         │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Public Allocator Contract                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Market A    │  │  Market B    │  │  Market C    │  │
│  │   (40M)      │  │   (35M)      │  │   (25M)      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │
         Reallocation Triggered
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Market A    │  │  Market B    │  │  Market C    │  │
│  │   (30M) ↓    │  │   (35M)      │  │   (35M) ↑    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│  10M reallocated A → C atomically                        │
└─────────────────────────────────────────────────────────┘
\`\`\`

## Integration via Bundler

Enable in bundling options:
\`\`\`typescript
const bundlingOptions = {
  publicAllocatorOptions: {
    enabled: true,
    supplyTargetUtilization: {
      [marketId]: 905000000000000000n // 90.5%
    },
    defaultSupplyTargetUtilization: 905000000000000000n
  }
};

const { operations } = populateBundle(
  inputOperations,
  simulationState,
  bundlingOptions
);
\`\`\`

## Use Cases

### 1. Rate Optimization
When Market A rates drop and Market B rates rise:
- Automatically reallocate to higher yield
- Users get better returns without action

### 2. Risk Management
When Market A risk increases:
- Reallocate to safer markets
- Protect depositor capital

### 3. Liquidity Management
When large withdrawals occur:
- Rebalance across markets
- Maintain withdrawal availability

### 4. Yield Farming
When rewards programs launch:
- Quickly move liquidity to rewarded markets
- Capture early yield opportunities

## Reallocation Constraints

1. **Timelock**: Significant reallocations may be timelocked
2. **Caps**: Cannot exceed market supply caps
3. **Withdrawal Queue**: Must respect withdraw queue ordering
4. **Fees**: Small fee may apply for external reallocators

## Support Considerations

When partners ask about reallocation:
- Explain difference from withdrawal/redeposit
- Show how it maintains user positions
- Discuss gas costs vs traditional methods
- Clarify timing and constraints

## Code Example: Checking Reallocation Status
\`\`\`typescript
const canReallocate = await publicClient.readContract({
  address: PUBLIC_ALLOCATOR_ADDRESS,
  abi: publicAllocatorABI,
  functionName: 'canReallocate',
  args: [vaultAddress, fromMarketId, toMarketId, amount]
});
\`\`\``,
      difficulty: 'advanced',
      tags: 'public-allocator,jit,reallocation,liquidity'
    },
    {
      module: 'career',
      title: 'Why Morpho? Company Deep Dive',
      content: `# Why Morpho? Company Deep Dive

## Company Overview

Morpho is a **decentralized lending protocol** that's redefining DeFi infrastructure through its permissionless, non-custodial lending primitive.

## Key Facts

### Funding & Growth
- **$70M+ raised** from top-tier investors:
  - a16z (Andreessen Horowitz)
  - Ribbit Capital
  - Coinbase Ventures
  - Variant
  - Semantic Ventures

### Traction
- **$10B+ in total deposits**
- **Multiple chains**: Ethereum, Base, Arbitrum, Optimism, and more
- **Hundreds of markets** created permissionlessly
- **Major integrations**: Leading DeFi protocols and institutions

## The Morpho Vision

### Core Thesis
> "Lending is the most important primitive in DeFi, and it should be as efficient, flexible, and secure as possible."

### Differentiation

| Aspect | Traditional DeFi | Morpho |
|--------|------------------|--------|
| Architecture | Monolithic pools | Isolated markets |
| Risk | Cross-contamination | Contained per market |
| Efficiency | One-size-fits-all | Optimized per market |
| Permission | Governance-gated | Permissionless creation |
| Collateral | Rehypothecated | Non-rehypothecated |

## Why This Role Matters

### Integration Engineer (Partner-facing)

**Mission**: Help partners successfully integrate Morpho into their products

**Impact**:
- Directly influence adoption of the protocol
- Shape the developer experience
- Build relationships with leading DeFi teams
- Contribute to technical standards

**Challenges**:
- Explain complex concepts clearly
- Support diverse integration types
- Balance partner needs with protocol principles
- Debug issues across different tech stacks

## Cultural Values

### 1. Excellence
- Immutable, audited contracts
- Rigorous testing and formal verification
- Gas-optimized implementations

### 2. Decentralization
- Permissionless market creation
- Governance-minimized design
- Open source everything

### 3. Pragmatism
- Focus on real user needs
- Practical solutions over theoretical purity
- Iterative improvement

## Interview Answer Framework

### Question: "Why do you want to work at Morpho?"

**Strong Answer Structure**:

1. **Connect with the mission**
   - "I believe DeFi infrastructure should be both powerful and accessible."
   - "Morpho's approach to isolated lending markets solves real problems I've seen in other protocols."

2. **Show you understand the tech**
   - "The non-rehypothecated design enables higher utilization without compromising safety."
   - "The permissionless market creation opens up possibilities for any asset pair."

3. **Align with the role**
   - "As an Integration Engineer, I'd help partners unlock these benefits."
   - "My background in both engineering and technical communication fits this partner-facing role."

4. **Demonstrate enthusiasm**
   - "The traction and quality of backers shows this is the right team to build with."
   - "I want to be part of the team defining the future of lending infrastructure."

## Questions to Ask

Show curiosity about:
- Current partner integration challenges
- How the team measures integration success
- Roadmap for developer tooling
- Most surprising use cases partners have built

## Red Flags to Avoid

Don't say:
- "I want to work in DeFi because it's hot"
- "I don't really understand the technical details but..."
- "I haven't used Morpho but I've heard good things"

Do:
- Reference specific features you've explored
- Mention markets or vaults you've interacted with
- Show you've done your homework on the codebase`,
      difficulty: 'intermediate',
      tags: 'career,why-morpho,company,interview-prep'
    }
  ];

  const insertLesson = db.prepare(`
    INSERT INTO lessons (module_id, title, content, difficulty, category, lesson_order, estimated_minutes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  lessons.forEach((lesson, index) => {
    insertLesson.run(
      lesson.module,
      lesson.title,
      lesson.content,
      lesson.difficulty,
      lesson.tags || lesson.module,
      index + 1,
      15
    );
  });

  console.log(`✅ Inserted ${lessons.length} expert lessons`);

  // ==========================================
  // EXPERT-LEVEL QUIZ QUESTIONS
  // ==========================================

  const quizQuestions = [
    // Core Architecture
    {
      question: "What is the main difference between Morpho's isolated markets and traditional lending pools?",
      options: JSON.stringify([
        "Morpho charges higher fees",
        "Each market has independent risk parameters with no cross-contamination",
        "Morpho only supports stablecoins",
        "Traditional pools use more advanced oracles"
      ]),
      correct_answer: 1,
      explanation: "Morpho's isolated markets contain risk to individual markets. Each market has its own collateral, oracle, IRM, and LLTV. Traditional pools share risk across all assets, meaning one bad asset can affect the entire pool.",
      difficulty: 2,
      category: 'core_architecture',
      tags: 'isolated-markets,risk,architecture'
    },
    {
      question: "What are the 5 immutable parameters required to create a Morpho market?",
      options: JSON.stringify([
        "Token name, symbol, decimals, supply cap, borrow cap",
        "Loan token, collateral token, oracle, IRM, LLTV",
        "Owner, curator, guardian, fee recipient, timelock",
        "Deposit amount, withdrawal limit, interest rate, liquidation bonus, flash loan fee"
      ]),
      correct_answer: 1,
      explanation: "A Morpho market is uniquely defined by: 1) Loan Token (asset being borrowed), 2) Collateral Token (asset securing the loan), 3) Oracle (price feed), 4) IRM (interest rate model), and 5) LLTV (liquidation loan-to-value ratio). These are immutable once set.",
      difficulty: 2,
      category: 'core_architecture',
      tags: 'market-creation,immutable,parameters'
    },
    {
      question: "What is Morpho Blue's main contract address on Ethereum mainnet?",
      options: JSON.stringify([
        "0x8888888888888888888888888888888888888888",
        "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb",
        "0xMorpho000000000000000000000000000000000",
        "0x1234567890123456789012345678901234567890"
      ]),
      correct_answer: 1,
      explanation: "The Morpho Blue contract is deployed at 0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb on Ethereum mainnet. The 'BBBB' prefix is intentional branding.",
      difficulty: 2,
      category: 'core_architecture',
      tags: 'contract-addresses,mainnet'
    },
    {
      question: "Why can Morpho target 90% utilization while traditional protocols target ~80%?",
      options: JSON.stringify([
        "Morpho has more efficient code",
        "Morpho doesn't rehypothecate collateral, removing liquidity constraints",
        "Morpho uses better oracles",
        "Morpho has larger liquidity reserves"
      ]),
      correct_answer: 1,
      explanation: "Traditional protocols rehypothecate collateral (re-lend it out), requiring buffer liquidity for liquidations. Morpho doesn't rehypothecate, so there's no systemic liquidity risk, allowing higher utilization and better rates.",
      difficulty: 3,
      category: 'core_architecture',
      tags: 'utilization,rehypothecation,efficiency'
    },
    // IRM
    {
      question: "What happens to the AdaptiveCurveIRM when utilization stays at 100% for 5 days?",
      options: JSON.stringify([
        "Nothing changes until governance votes",
        "The target rate doubles",
        "The market is paused",
        "All borrowers are liquidated"
      ]),
      correct_answer: 1,
      explanation: "The AdaptiveCurveIRM has a maximum speed of adjustment: at 100% utilization (furthest from 90% target), the rate doubles after 5 days. This incentivizes repayment and reduces utilization.",
      difficulty: 3,
      category: 'irm',
      tags: 'adaptivecurveirm,rate-adjustment,mechanism'
    },
    {
      question: "Calculate the supply APY given: borrow APY = 5%, utilization = 90%, fee = 0%",
      options: JSON.stringify([
        "4.5%",
        "5.5%",
        "5%",
        "4%"
      ]),
      correct_answer: 0,
      explanation: "Supply APY = borrowAPY × utilization × (1 - fee) = 5% × 0.90 × 1 = 4.5%. Currently, Morpho markets have no fees, so suppliers receive the full proportional yield.",
      difficulty: 2,
      category: 'irm',
      tags: 'apy-calculation,supply,formula'
    },
    // Liquidation
    {
      question: "What is the formula for Health Factor?",
      options: JSON.stringify([
        "(Borrowed Amount / Collateral Value) × LLTV",
        "(Collateral Value × LLTV) / Borrowed Amount",
        "(Collateral Value / Borrowed Amount) × 100",
        "(Borrowed Amount + Collateral Value) / 2"
      ]),
      correct_answer: 1,
      explanation: "Health Factor = (Collateral Value × LLTV) / Borrowed Amount. When HF > 1.0, the position is healthy. When HF < 1.0, the position can be liquidated.",
      difficulty: 2,
      category: 'liquidation',
      tags: 'health-factor,formula,liquidation'
    },
    {
      question: "A position has $200,000 collateral value and has borrowed $150,000. The LLTV is 86%. What is the Health Factor?",
      options: JSON.stringify([
        "1.0",
        "1.147",
        "0.75",
        "1.33"
      ]),
      correct_answer: 1,
      explanation: "Health Factor = (Collateral Value × LLTV) / Borrowed Amount = ($200,000 × 0.86) / $150,000 = $172,000 / $150,000 = 1.147. This position is healthy.",
      difficulty: 3,
      category: 'liquidation',
      tags: 'health-factor,calculation,example'
    },
    // Oracles
    {
      question: "What decimal scale do Morpho oracles use for price returns?",
      options: JSON.stringify([
        "8 decimals (like Chainlink)",
        "18 decimals (like WAD)",
        "36 decimals",
        "Token decimals"
      ]),
      correct_answer: 2,
      explanation: "Morpho oracles always return prices with 36 decimal places. This provides precision for calculations involving tokens with different decimals (e.g., 18-decimal WETH vs 6-decimal USDC).",
      difficulty: 2,
      category: 'oracles',
      tags: 'price-scale,decimals,oracle-interface'
    },
    // Bundler
    {
      question: "What is the main benefit of using Bundler3 for Morpho transactions?",
      options: JSON.stringify([
        "Lower gas costs through optimized bytecode",
        "Combine multiple operations into a single atomic transaction",
        "Avoid paying gas entirely",
        "Automatically find the best interest rates"
      ]),
      correct_answer: 1,
      explanation: "Bundler3 enables transaction batching, allowing multiple operations (supply, borrow, swap, etc.) to be executed atomically in a single transaction. This saves gas and ensures either all operations succeed or all fail.",
      difficulty: 2,
      category: 'integration',
      tags: 'bundler3,transaction-batching,atomic'
    },
    // Flash Loans
    {
      question: "What must a flash loan borrower do in their onMorphoFlashLoan callback?",
      options: JSON.stringify([
        "Transfer tokens to the Morpho contract",
        "Approve Morpho to pull back the borrowed amount",
        "Call Morpho.flashLoan again",
        "Update the price oracle"
      ]),
      correct_answer: 1,
      explanation: "The flash loan borrower must approve the Morpho contract to pull back the borrowed amount. Morpho uses transferFrom at the end of the callback to retrieve the funds. Without this approval, the transaction will revert.",
      difficulty: 2,
      category: 'flash-loans',
      tags: 'flash-loan,callback,approval'
    },
    // Vaults
    {
      question: "What is the key difference between Vault V1 and V2's risk curation?",
      options: JSON.stringify([
        "V1 doesn't have risk curation",
        "V1 uses supply caps; V2 uses ID & Cap system with absolute and relative limits",
        "V2 removes all risk limits",
        "V1 uses relative caps; V2 uses absolute caps only"
      ]),
      correct_answer: 1,
      explanation: "Vault V1 uses simple supply caps per market. Vault V2 introduces a sophisticated ID & Cap system where Curators can set both absolute caps (e.g., 'max 10M in this market') and relative caps (e.g., 'max 20% of vault in stETH exposure').",
      difficulty: 3,
      category: 'vaults',
      tags: 'vaults-v1,vaults-v2,risk-curation,caps'
    },
    {
      question: "What ERC standard do Morpho Vaults implement?",
      options: JSON.stringify([
        "ERC20",
        "ERC721",
        "ERC4626",
        "ERC1155"
      ]),
      correct_answer: 2,
      explanation: "Morpho Vaults implement ERC4626, the Tokenized Vault Standard. This provides a standardized interface for deposit/mint/withdraw/redeem operations, making vaults composable with the broader DeFi ecosystem.",
      difficulty: 1,
      category: 'vaults',
      tags: 'erc4626,standard,composability'
    },
    // Public Allocator
    {
      question: "What is the main benefit of the Public Allocator for vault users?",
      options: JSON.stringify([
        "Higher APY guaranteed",
        "Instant liquidity reallocation without withdrawal",
        "No fees on any transactions",
        "Automatic liquidation protection"
      ]),
      correct_answer: 1,
      explanation: "The Public Allocator enables Just-In-Time (JIT) liquidity reallocation across markets without requiring vault withdrawals. This means users' positions can be moved to better opportunities instantly while they remain deposited.",
      difficulty: 3,
      category: 'integration',
      tags: 'public-allocator,jit,reallocation'
    },
    // Career
    {
      question: "Which of the following is NOT an investor in Morpho?",
      options: JSON.stringify([
        "a16z (Andreessen Horowitz)",
        "Ribbit Capital",
        "Sequoia Capital",
        "Coinbase Ventures"
      ]),
      correct_answer: 2,
      explanation: "Morpho's $70M+ funding round included a16z, Ribbit Capital, Coinbase Ventures, Variant, and Semantic Ventures. Sequoia Capital is not listed among Morpho's investors.",
      difficulty: 1,
      category: 'career',
      tags: 'funding,investors,company'
    },
    {
      question: "What is the primary responsibility of a Curator in Morpho Vault V2?",
      options: JSON.stringify([
        "Execute daily trades",
        "Define strategy, set risk boundaries, and appoint Allocators",
        "Handle user support tickets",
        "Deploy smart contracts"
      ]),
      correct_answer: 1,
      explanation: "The Curator defines the vault's investment thesis, sets risk parameters (caps, limits), appoints Allocators to execute within those bounds, controls fees, and can implement compliance gates. Their actions are typically timelocked for transparency.",
      difficulty: 3,
      category: 'vaults',
      tags: 'curator,role,vaults-v2'
    },
    {
      question: "What happens if a Morpho transaction callback fails to approve token repayment?",
      options: JSON.stringify([
        "The transaction continues with a fee",
        "The entire transaction reverts atomically",
        "Only the callback fails, other operations continue",
        "The tokens are automatically seized"
      ]),
      correct_answer: 1,
      explanation: "Morpho operations are atomic. If any part fails (including the callback failing to approve repayment), the entire transaction reverts as if nothing happened. This ensures safety but requires careful implementation of callbacks.",
      difficulty: 3,
      category: 'integration',
      tags: 'atomicity,revert,callbacks,safety'
    },
    {
      question: "What is the relationship between LTV and LLTV?",
      options: JSON.stringify([
        "LTV is always higher than LLTV",
        "LTV is the current ratio; LLTV is the maximum allowed before liquidation",
        "They are the same thing with different names",
        "LTV applies to lenders; LLTV applies to borrowers"
      ]),
      correct_answer: 1,
      explanation: "LTV (Loan-To-Value) is the current ratio of borrowed amount to collateral value. LLTV (Liquidation Loan-To-Value) is the maximum allowed ratio. When LTV exceeds LLTV, the position becomes eligible for liquidation.",
      difficulty: 2,
      category: 'liquidation',
      tags: 'ltv,lltv,definitions,risk'
    },
    {
      question: "In the Morpho SDK, what does populateBundle() do?",
      options: JSON.stringify([
        "Deploys contracts to the blockchain",
        "Converts input operations into a bundle of low-level operations",
        "Calculates APY for vaults",
        "Validates oracle prices"
      ]),
      correct_answer: 1,
      explanation: "populateBundle() transforms high-level input operations (like 'supplyCollateral', 'borrow') into a bundle of low-level operations. It simulates each operation and prepares the complete transaction bundle including approvals and transfers.",
      difficulty: 2,
      category: 'integration',
      tags: 'sdk,bundler,populateBundle'
    },
    {
      question: "Why is the non-rehypothecation of collateral important for Morpho?",
      options: JSON.stringify([
        "It reduces gas costs",
        "It removes systemic risk and enables higher utilization",
        "It makes the code simpler",
        "It increases the number of supported tokens"
      ]),
      correct_answer: 1,
      explanation: "Non-rehypothecation means Morpho never re-lends user collateral. This removes the systemic risk where one borrower's default could cascade to others. It also removes liquidity constraints, allowing Morpho to target 90% utilization vs ~80% for protocols that rehypothecate.",
      difficulty: 3,
      category: 'core_architecture',
      tags: 'rehypothecation,systemic-risk,utilization'
    },
    {
      question: "What is the purpose of the timelock on Curator actions in Vault V2?",
      options: JSON.stringify([
        "To make the code run faster",
        "To give depositors time to exit if they disagree with proposed changes",
        "To prevent flash loan attacks",
        "To reduce gas costs"
      ]),
      correct_answer: 1,
      explanation: "The timelock on significant Curator actions provides transparency and gives depositors a window (typically days) to withdraw their funds if they disagree with proposed changes to strategy, risk parameters, or fees. This is a key safety mechanism.",
      difficulty: 2,
      category: 'vaults',
      tags: 'timelock,curator,safety,depositor-protection'
    }
  ];

  const insertQuiz = db.prepare(`
    INSERT INTO quiz_questions (question_id, question, options, correct_answer, explanation, difficulty, category, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  quizQuestions.forEach((q, index) => {
    insertQuiz.run(
      `quiz_${index + 1}`,
      q.question,
      q.options,
      q.correct_answer,
      q.explanation,
      q.difficulty,
      q.category,
      q.tags
    );
  });

  console.log(`✅ Inserted ${quizQuestions.length} expert quiz questions`);

  // ==========================================
  // CODING CHALLENGES
  // ==========================================

  const codingChallenges = [
    {
      challenge_id: 'health-factor-calc',
      title: 'Calculate Position Health Factor',
      difficulty: 'medium',
      category: 'liquidation',
      description: `Implement a function to calculate the Health Factor for a Morpho position.

**Given:**
- borrowedAmount: bigint (in loan token units)
- collateralAmount: bigint (in collateral token units)
- oraclePrice: bigint (36 decimals)
- lltv: bigint (18 decimals, WAD format)
- oraclePriceScale: 10^36

**Formula:**
Health Factor = (collateralValue * lltv) / borrowedAmount
where collateralValue = (collateralAmount * oraclePrice) / oraclePriceScale

**Requirements:**
1. Use BigInt for all calculations
2. Return the health factor as a bigint (WAD format)
3. Handle the decimal scaling correctly

**Example:**
- borrowedAmount = 150000000000n (150,000 USDC)
- collateralAmount = 200000000n (2 cbBTC)
- oraclePrice = 100000000000000000000000000000000000000n (100,000 USDC per cbBTC)
- lltv = 860000000000000000n (86%)
- Expected: ~1147000000000000000n (1.147)`,
      starter_code: `function calculateHealthFactor(
  borrowedAmount,
  collateralAmount,
  oraclePrice,
  lltv,
  oraclePriceScale = 10n ** 36n
) {
  // Your code here
  
}`,
      solution: `function calculateHealthFactor(
  borrowedAmount,
  collateralAmount,
  oraclePrice,
  lltv,
  oraclePriceScale = 10n ** 36n
) {
  // Calculate collateral value in loan token units
  const collateralValue = (collateralAmount * oraclePrice) / oraclePriceScale;
  
  // Calculate health factor: (collateralValue * lltv) / borrowedAmount
  const healthFactor = (collateralValue * lltv) / borrowedAmount;
  
  return healthFactor;
}

// Example usage:
// const hf = calculateHealthFactor(
//   150000000000n,  // borrowed
//   200000000n,     // collateral
//   100000000000000000000000000000000000000n,  // price
//   860000000000000000n  // 86% LLTV
// );
// Returns: 1146666666666666666n (1.1466...)`,
      test_cases: JSON.stringify([
        { input: 'borrowed:150000000000,collateral:200000000,price:100000000000000000000000000000000000000,lltv:860000000000000000', expected: 'healthFactor > 1000000000000000000' },
        { input: 'borrowed:170000000000,collateral:200000000,price:100000000000000000000000000000000000000,lltv:860000000000000000', expected: 'healthFactor < 1000000000000000000' },
        { input: 'borrowed:172000000000,collateral:200000000,price:100000000000000000000000000000000000000,lltv:860000000000000000', expected: 'healthFactor == 1000000000000000000' }
      ]),
      hints: JSON.stringify([
        'Remember that oraclePrice has 36 decimals and lltv has 18 decimals (WAD)',
        'Calculate collateralValue first, then apply the lltv',
        'Use BigInt arithmetic throughout to avoid precision loss'
      ])
    },
    {
      challenge_id: 'market-id-calc',
      title: 'Calculate Market ID',
      difficulty: 'hard',
      category: 'core',
      description: `Implement a function to calculate the unique Market ID for a Morpho market.

**Market Parameters:**
- loanToken: address (string)
- collateralToken: address (string)
- oracle: address (string)
- irm: address (string)
- lltv: bigint

**Market ID Formula:**
\`keccak256(abi.encode(loanToken, collateralToken, oracle, irm, lltv))\`

**Requirements:**
1. Properly encode all parameters as Solidity would
2. Use keccak256 for hashing
3. Return the market ID as a hex string

**Hint:** Addresses are 20 bytes, lltv is 32 bytes (uint256)

**Example Addresses:**
- loanToken: 0xA0b86a33E6441c57aF7C6F822C7a5d9E7b9E35B2
- collateralToken: 0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf
- oracle: 0x48... (example)
- irm: 0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC
- lltv: 860000000000000000n`,
      starter_code: `const { keccak256, encodeAbiParameters, parseAbiParameters } = require('viem');

function calculateMarketId(loanToken, collateralToken, oracle, irm, lltv) {
  // Your code here
  
}`,
      solution: `const { keccak256, encodeAbiParameters, parseAbiParameters } = require('viem');

function calculateMarketId(loanToken, collateralToken, oracle, irm, lltv) {
  // Encode parameters exactly as Solidity would
  const encoded = encodeAbiParameters(
    parseAbiParameters('address, address, address, address, uint256'),
    [loanToken, collateralToken, oracle, irm, lltv]
  );
  
  // Calculate keccak256 hash
  const marketId = keccak256(encoded);
  
  return marketId;
}

// Alternative using raw encoding:
function calculateMarketIdRaw(loanToken, collateralToken, oracle, irm, lltv) {
  // Remove 0x prefix and convert to lowercase for consistency
  const loan = loanToken.toLowerCase().slice(2).padStart(64, '0');
  const collateral = collateralToken.toLowerCase().slice(2).padStart(64, '0');
  const oracleClean = oracle.toLowerCase().slice(2).padStart(64, '0');
  const irmClean = irm.toLowerCase().slice(2).padStart(64, '0');
  const lltvHex = lltv.toString(16).padStart(64, '0');
  
  const packed = '0x' + loan + collateral + oracleClean + irmClean + lltvHex;
  
  return keccak256(packed);
}`,
      test_cases: JSON.stringify([
        { input: 'loan:0xA0b86a33E6441c57aF7C6F822C7a5d9E7b9E35B2,collateral:0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf', expected: 'valid bytes32 hex string' },
        { input: 'same params', expected: 'same market id' },
        { input: 'different lltv', expected: 'different market id' }
      ]),
      hints: JSON.stringify([
        'Use viem\'s encodeAbiParameters with the correct types',
        'Addresses must be checksummed or normalized consistently',
        'The order of parameters matters: loan, collateral, oracle, irm, lltv'
      ])
    },
    {
      challenge_id: 'apy-calculator',
      title: 'APY Calculator from Rate',
      difficulty: 'medium',
      category: 'irm',
      description: `Implement functions to calculate Borrow APY and Supply APY from the raw rate.

**Borrow APY Formula:**
\`borrowAPY = e^(borrowRate × secondsPerYear) - 1\`

**Supply APY Formula:**
\`supplyAPY = borrowAPY × utilization × (1 - fee)\`

**Given:**
- ratePerSecond: string (18 decimals, in wei format)
- utilization: number (0-1, e.g., 0.85 for 85%)
- fee: string (18 decimals, usually "0" currently)
- secondsPerYear: 31536000

**Requirements:**
1. Convert ratePerSecond from wei to decimal
2. Calculate continuous compounding for borrow APY
3. Apply utilization and fee for supply APY
4. Return percentages as decimals (e.g., 0.0489 for 4.89%)

**Example:**
- ratePerSecond: "1512768697" (1.512768697 × 10^-9)
- utilization: 0.85
- fee: "0"
- Expected borrowAPY: ~0.0489 (4.89%)
- Expected supplyAPY: ~0.0416 (4.16%)`,
      starter_code: `function calculateBorrowAPY(ratePerSecond, secondsPerYear = 31536000) {
  // Your code here
}

function calculateSupplyAPY(borrowAPY, utilization, fee = "0") {
  // Your code here
}`,
      solution: `function calculateBorrowAPY(ratePerSecond, secondsPerYear = 31536000) {
  // Convert from wei (18 decimals) to decimal
  const rate = Number(ratePerSecond) / 1e18;
  
  // Calculate continuous compounding: e^(rate × seconds) - 1
  const borrowAPY = Math.exp(rate * secondsPerYear) - 1;
  
  return borrowAPY;
}

function calculateSupplyAPY(borrowAPY, utilization, fee = "0") {
  // Convert fee from wei to decimal
  const feeRate = Number(fee) / 1e18;
  
  // supplyAPY = borrowAPY × utilization × (1 - fee)
  const supplyAPY = borrowAPY * utilization * (1 - feeRate);
  
  return supplyAPY;
}

// Example usage:
const ratePerSecond = "1512768697";
const utilization = 0.85;
const fee = "0";

const borrowAPY = calculateBorrowAPY(ratePerSecond);
// Result: ~0.0489 (4.89%)

const supplyAPY = calculateSupplyAPY(borrowAPY, utilization, fee);
// Result: ~0.0416 (4.16%)`,
      test_cases: JSON.stringify([
        { input: 'rate:1512768697,utilization:0.85,fee:0', expected: 'borrow:0.0489,supply:0.0416' },
        { input: 'rate:1000000000,utilization:0.90,fee:0', expected: 'supplyAPY = borrowAPY * 0.90' },
        { input: 'rate:2000000000,utilization:0.50,fee:0', expected: 'supplyAPY = borrowAPY * 0.50' }
      ]),
      hints: JSON.stringify([
        'Remember to divide ratePerSecond by 1e18 to get the actual rate',
        'Use Math.exp() for continuous compounding',
        'Current Morpho markets have 0 fees, but the code should handle fees correctly'
      ])
    },
    {
      challenge_id: 'flash-loan-callback',
      title: 'Implement Flash Loan Callback',
      difficulty: 'hard',
      category: 'flash-loans',
      description: `Implement a flash loan callback that performs arbitrage between two DEXs.

**Scenario:**
- Flash borrow 1000 USDC from Morpho
- Buy cbBTC on DEX A (lower price)
- Sell cbBTC on DEX B (higher price)
- Repay flash loan + keep profit

**Interface:**
\`\`\`solidity
function onMorphoFlashLoan(uint256 assets, bytes calldata data) external;
\`\`\`

**Requirements:**
1. Verify the caller is Morpho
2. Decode the data parameter to get token address
3. Execute arbitrage logic (mocked)
4. Approve Morpho to pull back exactly 'assets'
5. Ensure profit remains in the contract

**Assumptions:**
- DEX A price: 1 cbBTC = 99,500 USDC
- DEX B price: 1 cbBTC = 100,500 USDC
- Flash loan amount: 1000 USDC
- No fees for simplicity`,
      starter_code: `// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.0;

import {IERC20} from "@openzeppelin/token/ERC20/IERC20.sol";
import {IMorpho} from "./interfaces/IMorpho.sol";
import {IMorphoFlashLoanCallback} from "./interfaces/IMorphoCallbacks.sol";

contract ArbitrageFlashLoan is IMorphoFlashLoanCallback {
    IMorpho private immutable MORPHO;
    
    // DEX interfaces (mocked)
    IDex public dexA;
    IDex public dexB;
    
    constructor(IMorpho morpho, address _dexA, address _dexB) {
        MORPHO = morpho;
        dexA = IDex(_dexA);
        dexB = IDex(_dexB);
    }
    
    function onMorphoFlashLoan(uint256 assets, bytes calldata data) external override {
        // Your implementation here
        
    }
}`,
      solution: `// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.0;

import {IERC20} from "@openzeppelin/token/ERC20/IERC20.sol";
import {IMorpho} from "./interfaces/IMorpho.sol";
import {IMorphoFlashLoanCallback} from "./interfaces/IMorphoCallbacks.sol";

contract ArbitrageFlashLoan is IMorphoFlashLoanCallback {
    IMorpho private immutable MORPHO;
    
    IDex public dexA;
    IDex public dexB;
    
    // Token addresses
    address public constant USDC = 0xA0b86a33E6441c57aF7C6F822C7a5d9E7b9E35B2;
    address public constant CBBTC = 0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf;
    
    constructor(IMorpho morpho, address _dexA, address _dexB) {
        MORPHO = morpho;
        dexA = IDex(_dexA);
        dexB = IDex(_dexB);
    }
    
    function onMorphoFlashLoan(uint256 assets, bytes calldata data) external override {
        // 1. Security: Verify caller is Morpho
        require(msg.sender == address(MORPHO), "Unauthorized caller");
        
        // 2. Decode data
        address token = abi.decode(data, (address));
        
        // 3. Arbitrage logic:
        // We have 1000 USDC flash loan
        // Buy cbBTC on DEX A at 99,500 USDC per cbBTC
        // Get: 1000 / 99500 = ~0.01005 cbBTC
        
        IERC20(USDC).approve(address(dexA), assets);
        uint256 cbbtcAmount = dexA.swap(USDC, CBBTC, assets);
        
        // 4. Sell cbBTC on DEX B at 100,500 USDC per cbBTC
        // Get: 0.01005 * 100500 = ~1010 USDC
        IERC20(CBBTC).approve(address(dexB), cbbtcAmount);
        uint256 usdcReceived = dexB.swap(CBBTC, USDC, cbbtcAmount);
        
        // 5. Verify we made profit
        require(usdcReceived > assets, "Arbitrage failed: no profit");
        
        uint256 profit = usdcReceived - assets;
        
        // 6. Approve Morpho to pull back the borrowed amount
        IERC20(token).approve(address(MORPHO), assets);
        
        // Profit stays in contract (or could be sent to caller)
        // IERC20(token).transfer(tx.origin, profit);
    }
}

interface IDex {
    function swap(address tokenIn, address tokenOut, uint256 amountIn) external returns (uint256 amountOut);
}`,
      test_cases: JSON.stringify([
        { input: 'flashLoan:1000 USDC, dexA:99500, dexB:100500', expected: 'profit > 0, Morpho approved for 1000 USDC' },
        { input: 'caller:not Morpho', expected: 'revert with Unauthorized' },
        { input: 'no arbitrage opportunity', expected: 'revert with Arbitrage failed' }
      ]),
      hints: JSON.stringify([
        'Always verify msg.sender == address(MORPHO) for security',
        'Remember to approve the DEX before swapping',
        'You must approve Morpho to pull back exactly the borrowed amount',
        'Calculate profit before approving repayment'
      ])
    }
  ];

  const insertChallenge = db.prepare(`
    INSERT INTO coding_challenges 
    (challenge_id, title, difficulty, category, description, starter_code, solution, test_cases, hints)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  codingChallenges.forEach(c => {
    insertChallenge.run(
      c.challenge_id,
      c.title,
      c.difficulty,
      c.category,
      c.description,
      c.starter_code,
      c.solution,
      c.test_cases,
      c.hints
    );
  });

  console.log(`✅ Inserted ${codingChallenges.length} coding challenges`);

  // ==========================================
  // INTERVIEW SCENARIOS
  // ==========================================

  const interviewScenarios = [
    {
      scenario_id: 'partner-integration-plan',
      type: 'technical',
      title: 'Partner Integration Planning',
      description: 'A DeFi yield aggregator wants to integrate Morpho Vaults into their platform. They want to display vault APYs, allow deposits/withdrawals, and show underlying market allocations. Walk through your approach to helping them.',
      difficulty: 'medium',
      category: 'integration',
      questions: JSON.stringify([
        'What information do you need from the partner first?',
        'Which Morpho SDKs and contracts would you recommend?',
        'How would you explain the ERC4626 interface benefits?',
        'What are the key risks to communicate about vault deposits?',
        'How would you handle APY calculations including rewards?'
      ]),
      model_answer: 'Start by understanding their tech stack (React? Vue? Node?). Recommend the @morpho-org/blue-sdk-viem for TypeScript integration. Explain that ERC4626 means they can use standard deposit/mint/withdraw/redeem patterns. Emphasize that vault APY = base APY + rewards APR, and show how to fetch allocation data for transparency. Discuss timelock risks and curator changes.'
    },
    {
      scenario_id: 'debugging-liquidation',
      type: 'problem-solving',
      title: 'Debugging Liquidation Issues',
      description: 'A partner\'s user reports that their position should be liquidatable (they think) but liquidators aren\'t touching it. The partner is frustrated and needs help understanding what\'s happening.',
      difficulty: 'hard',
      category: 'liquidation',
      questions: JSON.stringify([
        'What information would you request from the partner?',
        'Walk through how you would verify the position\'s health factor',
        'What reasons might explain why liquidators aren\'t acting?',
        'How would you explain this clearly to the partner?',
        'What recommendations might you give their user?'
      ]),
      model_answer: 'Request: market ID, borrower address, current block. Walk through LTV calculation: verify oracle price, collateral amount, borrowed amount. Check if HF < 1.0. Reasons for no liquidation: (1) HF actually > 1, (2) oracle stale, (3) insufficient liquidity for profitable liquidation, (4) gas costs exceed profit. Explain clearly with the math and suggest they monitor with buffer above LLTV.'
    },
    {
      scenario_id: 'why-morpho-pitch',
      type: 'behavioral',
      title: 'Why Morpho?',
      description: 'Give a compelling answer to "Why do you want to work at Morpho?" that demonstrates your understanding of the protocol and alignment with the Integration Engineer role.',
      difficulty: 'medium',
      category: 'career',
      questions: JSON.stringify([
        'What aspects of Morpho\'s technology excite you most?',
        'How does your background prepare you for this specific role?',
        'What do you understand about the Integration Engineer responsibilities?',
        'How would you contribute to partner success?'
      ]),
      model_answer: 'Connect personal experience with Morpho\'s mission. Mention specific features like isolated markets, non-rehypothecation, or the bundler system. Show understanding that this is a partner-facing technical role requiring both deep protocol knowledge and communication skills. Mention the $70M funding, $10B+ TVL, and tier-1 investors as evidence of traction. Be authentic about wanting to help build the future of lending infrastructure.'
    },
    {
      scenario_id: 'explain-bundler',
      type: 'technical',
      title: 'Explain Bundler3 to a Non-Technical Partner',
      description: 'A business development lead at a potential partner company wants to understand what Bundler3 enables for their users. They don\'t have a technical background. Explain it clearly.',
      difficulty: 'medium',
      category: 'integration',
      questions: JSON.stringify([
        'How would you explain transaction batching in simple terms?',
        'What user benefits would you emphasize?',
        'Can you give concrete use cases relevant to their users?',
        'How would you address any concerns about complexity?'
      ]),
      model_answer: 'Use analogy: like combining multiple bank transfers into one form instead of filling out forms separately. Benefits: (1) cheaper (one gas fee vs many), (2) safer (all succeed or all fail - no partial states), (3) simpler UX (one click vs many). Use cases: deposit collateral + borrow in one step, or switch between markets instantly. Reassure that SDK handles complexity; their devs just specify what they want to happen.'
    },
    {
      scenario_id: 'vault-v1-v2-migration',
      type: 'technical',
      title: 'Vault V1 to V2 Migration Support',
      description: 'A partner currently integrated with Morpho Vault V1 wants to understand what\'s changing in V2 and how to migrate. They\'re concerned about breaking changes.',
      difficulty: 'hard',
      category: 'vaults',
      questions: JSON.stringify([
        'What are the key differences between V1 and V2?',
        'Is ERC4626 interface still compatible?',
        'What new capabilities can they offer users?',
        'What migration steps would you recommend?',
        'How would you handle the timeline discussion?'
      ]),
      model_answer: 'V2 adds: universal adapters (not just Morpho markets), ID & Cap risk system, interest rate limits, curator-controlled fees, compliance gates. ERC4626 is unchanged - their existing deposit/withdraw code works. New capabilities: exposure to multiple protocols, granular risk controls, compliance features for institutional users. Migration: test on staging, update SDK version, adapt to new data structures for allocations. Timeline: dependent on their testing cycle.'
    }
  ];

  const insertScenario = db.prepare(`
    INSERT INTO interview_scenarios 
    (scenario_id, type, title, description, difficulty, category, questions)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  interviewScenarios.forEach(s => {
    insertScenario.run(
      s.scenario_id,
      s.type,
      s.title,
      s.description,
      s.difficulty,
      s.category,
      s.questions
    );
  });

  console.log(`✅ Inserted ${interviewScenarios.length} interview scenarios`);

  // Commit transaction
  db.exec('COMMIT');

  console.log('\n🎉 Expert content ingestion complete!');
  console.log('=====================================');
  console.log('The database now contains:');
  console.log(`  • ${lessons.length} comprehensive lessons`);
  console.log(`  • ${quizQuestions.length} expert quiz questions`);
  console.log(`  • ${codingChallenges.length} coding challenges`);
  console.log(`  • ${interviewScenarios.length} interview scenarios`);
  console.log('\nReady for intensive interview preparation! 💪');

} catch (error) {
  db.exec('ROLLBACK');
  console.error('❌ Error ingesting content:', error);
  process.exit(1);
} finally {
  db.close();
}
