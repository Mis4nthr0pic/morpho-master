/**
 * Code Examples for Morpho Integration
 * TypeScript patterns for common operations
 */

const CODE_EXAMPLES = {
  calculations: {
    healthFactor: `import { formatUnits } from 'viem';

function calculateHealthFactor(
  collateralAmount: bigint,
  collateralPrice: bigint,
  lltv: bigint,
  borrowed: bigint
): number {
  if (borrowed === 0n) return Number.MAX_VALUE;
  
  // Calculate collateral value
  const collateralValue = (collateralAmount * collateralPrice) / 10n**18n;
  
  // Calculate max borrow capacity
  const maxBorrow = (collateralValue * lltv) / 10n**18n;
  
  // Health Factor = maxBorrow / borrowed
  const hf = Number((maxBorrow * 10000n) / borrowed) / 10000;
  
  return hf;
}

// Example usage
const hf = calculateHealthFactor(
  1000n * 10n**6n,   // 1000 USDC (6 decimals)
  1n * 10n**18n,     // $1.00 price
  8650n * 10n**14n,  // 86.5% LLTV
  800n * 10n**6n     // 800 USDC borrowed
);
console.log(hf); // ~1.08`,

    liquidationPrice: `function calculateLiquidationPrice(
  collateralAmount: bigint,
  borrowed: bigint,
  lltv: bigint
): bigint {
  if (collateralAmount === 0n) return 0n;
  
  // Liquidation occurs when HF = 1
  // HF = (Collateral * Price * LLTV) / Borrowed = 1
  // Therefore: Price = Borrowed / (Collateral * LLTV)
  
  const liqPrice = (borrowed * 10n**18n * 10n**18n) / (collateralAmount * lltv);
  
  return liqPrice;
}

// Example: At what price does liquidation occur?
const liqPrice = calculateLiquidationPrice(
  1000n * 10n**6n,   // 1000 USDC collateral
  800n * 10n**6n,    // 800 USDC borrowed
  8650n * 10n**14n   // 86.5% LLTV
);
console.log(formatUnits(liqPrice, 18)); // ~$0.925`,

    maxBorrow: `function calculateMaxBorrow(
  collateralAmount: bigint,
  collateralPrice: bigint,
  lltv: bigint,
  bufferPercent: number = 5 // 5% safety buffer
): bigint {
  const collateralValue = (collateralAmount * collateralPrice) / 10n**18n;
  const maxBorrow = (collateralValue * lltv) / 10n**18n;
  
  // Apply safety buffer to avoid liquidation
  const buffer = BigInt(Math.floor((100 - bufferPercent) * 100)) / 10000n;
  
  return (maxBorrow * buffer * 10000n) / 10000n;
}

// Example with 5% buffer
const safeBorrow = calculateMaxBorrow(
  1000n * 10n**6n,
  1n * 10n**18n,
  8650n * 10n**14n,
  5 // 5% buffer
);
console.log(formatUnits(safeBorrow, 6)); // ~821 USDC instead of 865`,

    utilization: `function calculateUtilization(
  totalBorrow: bigint,
  totalSupply: bigint
): number {
  if (totalSupply === 0n) return 0;
  
  return Number((totalBorrow * 10000n) / totalSupply) / 100;
}

// Utilization affects interest rates
// High utilization = higher rates = more supply incentive`,

    liquidationProfitability: `function isLiquidationProfitable(
  collateralAmount: bigint,
  collateralPrice: bigint,
  borrowed: bigint,
  lltv: bigint,
  gasCost: bigint,
  rewardPercent: number = 5 // 5% liquidation incentive
): boolean {
  const maxLiquidatable = (borrowed * BigInt(rewardPercent * 100)) / 10000n;
  const rewardValue = maxLiquidatable;
  
  return rewardValue > gasCost;
}`
  },

  sdk: {
    basicSetup: `import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { BlueSdk } from '@morpho-org/blue-sdk';

// Initialize viem client
const client = createPublicClient({
  chain: mainnet,
  transport: http()
});

// Initialize SDK
const sdk = new BlueSdk(client);

// Fetch market data
const market = await sdk.market.get(marketParams);
console.log(market.totalSupply, market.totalBorrow, market.supplyAPY);`,

    marketParams: `import { MarketParams } from '@morpho-org/blue-sdk';

// Define a market
const marketParams: MarketParams = {
  loanToken: '0xA0b86a33E6441E6C7D3D4B4f6c7E8F9A0B1C2D3E', // USDC
  collateralToken: '0xB1C2D3E4F5A6B7C8D9E0F1A2B3C4D5E6F7A8B9C0', // WETH
  oracle: '0x1234567890123456789012345678901234567890',
  irm: '0x2345678901234567890123456789012345678901',
  lltv: 865000000000000000n // 86.5%
};`,

    positionTracking: `// Get user position
const position = await sdk.position.get({
  user: '0x...',
  marketParams
});

console.log({
  supplyShares: position.supplyShares,
  borrowShares: position.borrowShares,
  collateral: position.collateral
});

// Calculate health factor from position
const market = await sdk.market.get(marketParams);
const hf = market.getHealthFactor(position);
console.log(\`Health Factor: \${hf}\`);`,

    vaultIntegration: `import { MetaMorphoVault } from '@morpho-org/blue-sdk';

// Connect to a MetaMorpho vault
const vault = await sdk.vault.get(vaultAddress);

// Get vault info
console.log({
  totalAssets: vault.totalAssets,
  totalSupply: vault.totalSupply,
  apy: vault.apy,
  curator: vault.curator,
  guardian: vault.guardian
});

// Get user's vault position
const userShares = await vault.balanceOf(userAddress);
const userAssets = await vault.convertToAssets(userShares);`
  },

  bundler: {
    leverageBundle: `import { Bundler3 } from '@morpho-org/blue-sdk';

// Build a leverage position: Supply collateral → Borrow → Swap → Supply more
const bundle = Bundler3.bundle()
  // Step 1: Supply initial collateral
  .then(Bundler3.supplyCollateral({
    marketParams,
    assets: initialCollateral
  }))
  // Step 2: Borrow against it
  .then(Bundler3.borrow({
    marketParams,
    assets: borrowAmount,
    receiver: swapperAddress
  }))
  // Step 3: Swap borrowed for collateral (external swap)
  .then(Bundler3.call({
    to: swapRouter,
    data: swapCalldata
  }))
  // Step 4: Supply swapped collateral
  .then(Bundler3.supplyCollateral({
    marketParams,
    assets: swappedAmount
  }));

const tx = await bundle.build();
await walletClient.sendTransaction(tx);`,

    deleverageBundle: `// Deleverage: Repay → Withdraw → Swap → Repay more
const bundle = Bundler3.bundle()
  // Withdraw collateral to swap
  .then(Bundler3.withdrawCollateral({
    marketParams,
    assets: withdrawAmount
  }))
  // Swap for debt token
  .then(Bundler3.call({
    to: swapRouter,
    data: swapCalldata
  }))
  // Repay debt
  .then(Bundler3.repay({
    marketParams,
    assets: repayAmount
  }));`,

    flashLoan: `// Flash loan for liquidation or arbitrage
const bundle = Bundler3.bundle()
  // Flash loan assets
  .then(Bundler3.flashLoan({
    token: usdcAddress,
    amount: flashLoanAmount,
    // Actions to execute with flash loan
    actions: [
      // Example: Repay on behalf of user
      Bundler3.repay({
        marketParams,
        assets: repayAmount,
        onBehalf: liquidatableUser
      }),
      // Withdraw collateral as reward
      Bundler3.withdrawCollateral({
        marketParams,
        assets: collateralReward
      }),
      // Swap to repay flash loan
      Bundler3.call({
        to: swapRouter,
        data: swapCalldata
      })
    ]
  }));`
  },

  bestPractices: {
    errorHandling: `// Always wrap transactions with proper error handling
try {
  const tx = await morpho.supplyCollateral(
    marketParams,
    amount,
    onBehalf,
    slippage
  );
  
  await publicClient.waitForTransactionReceipt({ hash: tx });
  
  // Verify state change
  const newPosition = await sdk.position.get({ user, marketParams });
  
  if (newPosition.collateral < expectedCollateral) {
    throw new Error('Collateral not updated as expected');
  }
} catch (error) {
  // Categorize errors for better UX
  if (error.message.includes('INSUFFICIENT_COLLATERAL')) {
    throw new Error('Health factor would be too low. Try supplying more collateral or borrowing less.');
  }
  if (error.message.includes('INSUFFICIENT_LIQUIDITY')) {
    throw new Error('Not enough liquidity in this market. Try a smaller amount or different market.');
  }
  throw error;
}`,

    slippageProtection: `// Always include slippage protection for amounts that change
const expectedShares = await vault.previewDeposit(assets);

// Allow 0.5% slippage
const minShares = (expectedShares * 995n) / 1000n;

const tx = await vault.deposit({
  assets,
  receiver: userAddress,
  minShares // Slippage protection
});`,

    decimalHandling: `// Be careful with token decimals
const TOKENS = {
  USDC: { address: '0x...', decimals: 6 },
  WETH: { address: '0x...', decimals: 18 },
  WBTC: { address: '0x...', decimals: 8 }
};

function parseAmount(token: string, amount: string): bigint {
  const decimals = TOKENS[token].decimals;
  return parseUnits(amount, decimals);
}

function formatAmount(token: string, amount: bigint): string {
  const decimals = TOKENS[token].decimals;
  return formatUnits(amount, decimals);
}`,

    healthFactorMonitoring: `// Monitor positions for liquidation risk
interface PositionAlert {
  user: string;
  market: MarketParams;
  healthFactor: number;
  riskLevel: 'safe' | 'warning' | 'danger';
}

async function monitorPositions(users: string[]): Promise<PositionAlert[]> {
  const alerts: PositionAlert[] = [];
  
  for (const user of users) {
    const positions = await sdk.position.getAll(user);
    
    for (const position of positions) {
      if (position.borrowShares === 0n) continue;
      
      const market = await sdk.market.get(position.marketParams);
      const hf = market.getHealthFactor(position);
      
      let riskLevel: PositionAlert['riskLevel'] = 'safe';
      if (hf < 1.05) riskLevel = 'danger';
      else if (hf < 1.2) riskLevel = 'warning';
      
      if (riskLevel !== 'safe') {
        alerts.push({ user, market: position.marketParams, healthFactor: hf, riskLevel });
      }
    }
  }
  
  return alerts.sort((a, b) => a.healthFactor - b.healthFactor);
}`
  },

  commonErrors: {
    insufficientCollateral: `// Error: INSUFFICIENT_COLLATERAL
// Cause: Transaction would result in HF < 1
// Fix: Reduce borrow amount or increase collateral

const maxBorrow = await market.getMaxBorrow(position);
const safeBorrow = (maxBorrow * 95n) / 100n; // 5% buffer

await morpho.borrow(marketParams, safeBorrow);`,

    invalidMarketId: `// Error: INVALID_MARKET_ID
// Cause: Wrong market parameters
// Fix: Verify all 5 parameters match an existing market

const marketExists = await morpho.marketExists(marketParams);
if (!marketExists) {
  throw new Error('Market does not exist. Check loanToken, collateralToken, oracle, irm, and lltv.');
}`,

    oracleStale: `// Error: ORACLE_STALE or price manipulation
// Fix: Implement oracle freshness checks

const oracleData = await oracle.latestRoundData();
const staleness = Date.now() / 1000 - Number(oracleData.updatedAt);

if (staleness > 3600) { // 1 hour
  throw new Error('Oracle price is stale. Try again later or use a different market.');
}`
  }
};

module.exports = { CODE_EXAMPLES };
