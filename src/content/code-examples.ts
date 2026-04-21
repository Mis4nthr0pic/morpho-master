/**
 * Morpho Integration Code Examples
 * Copy-paste ready snippets for common integration patterns
 */

// ============================================
// EXAMPLE 1: Basic Vault Deposit
// ============================================

import { createPublicClient, createWalletClient, http, parseUnits } from 'viem';
import { mainnet } from 'viem/chains';
import { fetchVault, getVault } from '@morpho-org/blue-sdk-viem';
import { privateKeyToAccount } from 'viem/accounts';

// Setup clients
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(process.env.RPC_URL)
});

const walletClient = createWalletClient({
  chain: mainnet,
  transport: http(process.env.RPC_URL),
  account: privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`)
});

/**
 * Deposit to a MetaMorpho vault
 */
async function depositToVault(
  vaultAddress: `0x${string}`,
  assets: bigint
): Promise<{ hash: `0x${string}`; shares: bigint }> {
  // Fetch vault data
  const vault = getVault(vaultAddress);
  const vaultData = await fetchVault(publicClient, vaultAddress);
  
  // Get the underlying asset
  const asset = vaultData.asset;
  
  // 1. Approve vault to spend tokens
  const approveHash = await walletClient.writeContract({
    address: asset,
    abi: [{
      name: 'approve',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'spender', type: 'address' },
        { name: 'amount', type: 'uint256' }
      ],
      outputs: [{ type: 'bool' }]
    }],
    functionName: 'approve',
    args: [vaultAddress, assets]
  });
  
  await publicClient.waitForTransactionReceipt({ hash: approveHash });
  
  // 2. Preview shares to receive
  const shares = await vault.previewDeposit(assets);
  
  // 3. Deposit
  const depositHash = await walletClient.writeContract({
    address: vaultAddress,
    abi: [{
      name: 'deposit',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'assets', type: 'uint256' },
        { name: 'receiver', type: 'address' }
      ],
      outputs: [{ name: 'shares', type: 'uint256' }]
    }],
    functionName: 'deposit',
    args: [assets, walletClient.account.address]
  });
  
  return { hash: depositHash, shares };
}

// Usage
// const result = await depositToVault(
//   '0x...', // Vault address
//   parseUnits('1000', 6) // 1000 USDC
// );

// ============================================
// EXAMPLE 2: Calculate Health Factor
// ============================================

import { Market, Position } from '@morpho-org/blue-sdk';

const WAD = 10n ** 18n;

interface HealthFactorResult {
  healthFactor: bigint;
  healthFactorDecimal: number;
  isHealthy: boolean;
  maxBorrow: bigint;
  currentBorrow: bigint;
  liquidationPrice: bigint;
}

/**
 * Calculate comprehensive position health metrics
 */
function calculatePositionHealth(
  market: Market,
  position: Position,
  collateralPrice: bigint, // 18 decimals, collateral/loan
  lltv: bigint // 18 decimals
): HealthFactorResult {
  // Calculate borrowed assets from shares
  const currentBorrow = position.borrowShares > 0n
    ? (position.borrowShares * market.totalBorrowAssets) / market.totalBorrowShares
    : 0n;
  
  // Calculate collateral value in loan terms
  const collateralValue = (position.collateral * collateralPrice) / WAD;
  
  // Calculate max borrow allowed
  const maxBorrow = (collateralValue * lltv) / WAD;
  
  // Calculate health factor
  let healthFactor: bigint;
  if (currentBorrow === 0n) {
    healthFactor = type(uint256).max;
  } else {
    healthFactor = (maxBorrow * WAD) / currentBorrow;
  }
  
  // Calculate liquidation price (price at which HF = 1)
  // HF = 1 when collateralValue * LLTV = borrow
  // liquidationPrice = (borrow * WAD) / (collateral * LLTV)
  const liquidationPrice = position.collateral > 0n
    ? (currentBorrow * WAD * WAD) / (position.collateral * lltv)
    : 0n;
  
  return {
    healthFactor,
    healthFactorDecimal: Number(healthFactor) / 1e18,
    isHealthy: healthFactor >= WAD,
    maxBorrow,
    currentBorrow,
    liquidationPrice
  };
}

// Helper for max uint256
function type(typeName: string): { max: bigint } {
  if (typeName === 'uint256') {
    return { max: 2n ** 256n - 1n };
  }
  throw new Error('Unknown type');
}

// ============================================
// EXAMPLE 3: Bundler3 Multi-Step Operation
// ============================================

import { 
  Bundler3, 
  GeneralAdapter1,
  MorphoBlue__factory 
} from '@morpho-org/bundler3';

interface BundleStep {
  adapter: `0x${string}`;
  data: `0x${string}`;
}

/**
 * Create a leveraged position: Supply collateral → Borrow → Swap → Supply
 */
async function createLeveragedPosition(
  marketParams: {
    loanToken: `0x${string}`;
    collateralToken: `0x${string}`;
    oracle: `0x${string}`;
    irm: `0x${string}`;
    lltv: bigint;
  },
  collateralAmount: bigint,
  borrowAmount: bigint,
  minAmountOut: bigint // Slippage protection
): Promise<`0x${string}`> {
  const bundle: BundleStep[] = [];
  const userAddress = walletClient.account.address;
  
  // Step 1: Approve Morpho to spend collateral
  bundle.push({
    adapter: GeneralAdapter1.address,
    data: encodeApprove(marketParams.collateralToken, MORPHO_BLUE, collateralAmount)
  });
  
  // Step 2: Supply collateral
  bundle.push({
    adapter: GeneralAdapter1.address,
    data: encodeSupplyCollateral(marketParams, collateralAmount, userAddress)
  });
  
  // Step 3: Borrow loan token
  bundle.push({
    adapter: GeneralAdapter1.address,
    data: encodeBorrow(marketParams, borrowAmount, userAddress)
  });
  
  // Step 4: Swap borrowed tokens for more collateral (using Paraswap)
  const swapData = await fetchParaswapSwapData({
    srcToken: marketParams.loanToken,
    destToken: marketParams.collateralToken,
    amount: borrowAmount,
    userAddress,
    slippage: 0.5 // 0.5%
  });
  
  bundle.push({
    adapter: PARASWAP_ADAPTER,
    data: encodeSwap(swapData, minAmountOut)
  });
  
  // Step 5: Supply the swapped collateral
  bundle.push({
    adapter: GeneralAdapter1.address,
    data: encodeSupplyCollateral(marketParams, minAmountOut, userAddress)
  });
  
  // Execute bundle atomically
  const hash = await walletClient.writeContract({
    address: Bundler3.address,
    abi: Bundler3.abi,
    functionName: 'multicall',
    args: [bundle]
  });
  
  return hash;
}

// Helper functions (simplified - actual implementation needs full encoding)
function encodeApprove(token: `0x${string}`, spender: `0x${string}`, amount: bigint): `0x${string}` {
  // Implementation depends on exact adapter interface
  return '0x' as `0x${string}`;
}

function encodeSupplyCollateral(
  marketParams: any, 
  amount: bigint, 
  onBehalf: `0x${string}`
): `0x${string}` {
  return '0x' as `0x${string}`;
}

function encodeBorrow(
  marketParams: any, 
  amount: bigint, 
  receiver: `0x${string}`
): `0x${string}` {
  return '0x' as `0x${string}`;
}

function encodeSwap(swapData: any, minAmountOut: bigint): `0x${string}` {
  return '0x' as `0x${string}`;
}

async function fetchParaswapSwapData(params: any): Promise<any> {
  // Call Paraswap API for swap data
  const response = await fetch('https://api.paraswap.io/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  return response.json();
}

// Constants
const MORPHO_BLUE = '0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb' as `0x${string}`;
const PARASWAP_ADAPTER = '0x03b5259Bd204BfD4A616E5B79b0B786d90c6C38f' as `0x${string}`;

// ============================================
// EXAMPLE 4: Liquidation Monitor
// ============================================

import { fetchMarket, fetchPosition } from '@morpho-org/blue-sdk-viem';

interface LiquidationOpportunity {
  borrower: `0x${string}`;
  healthFactor: bigint;
  seizedAssets: bigint;
  repaidAssets: bigint;
  profit: bigint;
}

/**
 * Monitor for liquidatable positions
 */
class LiquidationMonitor {
  private unhealthyPositions: Map<`0x${string}`, { position: Position; hf: bigint }> = new Map();
  
  constructor(private publicClient: any) {}
  
  async checkMarket(
    marketParams: any,
    price: bigint
  ): Promise<LiquidationOpportunity[]> {
    const opportunities: LiquidationOpportunity[] = [];
    
    // Fetch market state
    const market = await fetchMarket(this.publicClient, marketParams);
    
    // In production, you'd query all positions from subgraph
    // For demo, checking specific addresses
    const borrowersToCheck: `0x${string}`[] = [
      // Add addresses to monitor
    ];
    
    for (const borrower of borrowersToCheck) {
      const position = await fetchPosition(this.publicClient, marketParams, borrower);
      
      // Skip if no borrow
      if (position.borrowShares === 0n) continue;
      
      const health = calculatePositionHealth(
        market,
        position,
        price,
        marketParams.lltv
      );
      
      if (!health.isHealthy) {
        this.unhealthyPositions.set(borrower, { position, hf: health.healthFactor });
        
        // Calculate liquidation profit
        const repaidAssets = health.currentBorrow;
        const seizedAssets = (repaidAssets * 105n) / 100n; // 5% bonus
        const profit = seizedAssets - repaidAssets;
        
        opportunities.push({
          borrower,
          healthFactor: health.healthFactor,
          seizedAssets,
          repaidAssets,
          profit
        });
      }
    }
    
    return opportunities.sort((a, b) => Number(b.profit - a.profit));
  }
  
  async liquidate(
    marketParams: any,
    borrower: `0x${string}`,
    repaidShares: bigint
  ): Promise<`0x${string}`> {
    // Execute liquidation
    const hash = await walletClient.writeContract({
      address: MORPHO_BLUE,
      abi: [{
        name: 'liquidate',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'marketParams', type: 'tuple', components: [
            { name: 'loanToken', type: 'address' },
            { name: 'collateralToken', type: 'address' },
            { name: 'oracle', type: 'address' },
            { name: 'irm', type: 'address' },
            { name: 'lltv', type: 'uint256' }
          ]},
          { name: 'borrower', type: 'address' },
          { name: 'seizedAssets', type: 'uint256' },
          { name: 'repaidShares', type: 'uint256' },
          { name: 'data', type: 'bytes' }
        ],
        outputs: [
          { name: 'seizedAssets', type: 'uint256' },
          { name: 'repaidAssets', type: 'uint256' }
        ]
      }],
      functionName: 'liquidate',
      args: [
        marketParams,
        borrower,
        0n, // seizedAssets (0 = calculate from repaidShares)
        repaidShares,
        '0x' // data
      ]
    });
    
    return hash;
  }
}

// ============================================
// EXAMPLE 5: Rate Calculations
// ============================================

import { AdaptiveCurveIrmLib } from '@morpho-org/blue-sdk';

/**
 * Calculate current market rates
 */
function calculateMarketRates(market: Market): {
  borrowAPR: number;
  supplyAPY: number;
  utilization: number;
} {
  // Calculate utilization
  const utilization = market.totalSupplyAssets > 0n
    ? Number((market.totalBorrowAssets * 10000n) / market.totalSupplyAssets) / 100
    : 0;
  
  // Get borrow rate from IRM
  const irm = new AdaptiveCurveIrmLib();
  const borrowRate = irm.borrowRate(market);
  
  // Convert to APR (annualized rate)
  const borrowAPR = Number(borrowRate) / 1e18 * 100;
  
  // Supply APY = Borrow APR * Utilization (assuming no fees)
  const supplyAPY = borrowAPR * (utilization / 100);
  
  return {
    borrowAPR,
    supplyAPY,
    utilization
  };
}

// ============================================
// EXAMPLE 6: Error Handling Pattern
// ============================================

type MorphoError = 
  | 'INSUFFICIENT_LIQUIDITY'
  | 'UNAUTHORIZED'
  | 'UNHEALTHY_POSITION'
  | 'SLIPPAGE_EXCEEDED'
  | 'INVALID_MARKET'
  | 'UNKNOWN';

interface Result<T, E> {
  success: true;
  data: T;
} | {
  success: false;
  error: E;
  message: string;
  suggestion: string;
};

/**
 * Wrap Morpho operations with proper error handling
 */
async function safeMorphoOperation<T>(
  operation: () => Promise<T>
): Promise<Result<T, MorphoError>> {
  try {
    const result = await operation();
    return { success: true, data: result };
  } catch (error: any) {
    const message = error.message?.toLowerCase() || '';
    
    if (message.includes('insufficient liquidity')) {
      return {
        success: false,
        error: 'INSUFFICIENT_LIQUIDITY',
        message: 'Market has insufficient liquidity for this operation.',
        suggestion: 'Try a smaller amount or check another market.'
      };
    }
    
    if (message.includes('unauthorized')) {
      return {
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Not authorized to perform this action on behalf of this address.',
        suggestion: 'Ensure the user has approved your contract or use their own wallet.'
      };
    }
    
    if (message.includes('not healthy') || message.includes('unhealthy')) {
      return {
        success: false,
        error: 'UNHEALTHY_POSITION',
        message: 'This operation would make the position liquidatable.',
        suggestion: 'Reduce the withdrawal/borrow amount or add more collateral first.'
      };
    }
    
    if (message.includes('slippage')) {
      return {
        success: false,
        error: 'SLIPPAGE_EXCEEDED',
        message: 'Price moved beyond acceptable slippage.',
        suggestion: 'Increase slippage tolerance or try again when volatility is lower.'
      };
    }
    
    return {
      success: false,
      error: 'UNKNOWN',
      message: error.message || 'Unknown error occurred.',
      suggestion: 'Check the transaction details and try again.'
    };
  }
}

// Usage example
// const result = await safeMorphoOperation(() => 
//   depositToVault(vaultAddress, amount)
// );
// 
// if (result.success) {
//   console.log('Success:', result.data);
// } else {
//   console.error('Error:', result.message);
//   console.log('Suggestion:', result.suggestion);
// }

// ============================================
// EXAMPLE 7: Vault Comparison Tool
// ============================================

interface VaultComparison {
  address: `0x${string}`;
  name: string;
  totalAssets: bigint;
  apy: number;
  fee: number;
  curator: string;
  riskLevel: 'low' | 'medium' | 'high';
  markets: number;
}

/**
 * Compare multiple vaults for recommendation
 */
async function compareVaults(
  vaultAddresses: `0x${string}`[]
): Promise<VaultComparison[]> {
  const comparisons: VaultComparison[] = [];
  
  for (const address of vaultAddresses) {
    const vault = await fetchVault(publicClient, address);
    const config = vault.config;
    
    // Calculate APY (simplified - real implementation needs historical data)
    const apy = estimateAPY(vault);
    
    // Determine risk level based on allocation
    const riskLevel = determineRiskLevel(vault);
    
    comparisons.push({
      address,
      name: vault.name,
      totalAssets: vault.totalAssets,
      apy,
      fee: Number(vault.fee) / 1e18,
      curator: vault.curator,
      riskLevel,
      markets: config.allocation.length
    });
  }
  
  // Sort by APY descending
  return comparisons.sort((a, b) => b.apy - a.apy);
}

function estimateAPY(vault: any): number {
  // Simplified APY estimation
  // Real implementation would calculate from historical share price
  return 0.085; // 8.5% example
}

function determineRiskLevel(vault: any): 'low' | 'medium' | 'high' {
  // Risk assessment based on allocation
  const hasBlueChipCollateral = vault.config.allocation.every(
    (a: any) => isBlueChip(a.market.collateralToken)
  );
  
  if (hasBlueChipCollateral && vault.config.allocation.length <= 3) {
    return 'low';
  } else if (hasBlueChipCollateral) {
    return 'medium';
  }
  return 'high';
}

function isBlueChip(token: `0x${string}`): boolean {
  const blueChips = [
    '0xC02aaA39b223FE8D0A0E5C4F27eAD9083C756Cc2', // WETH
    '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
    '0xA0b86a33E6441da517d363186e2c702aA5bCc1Db', // USDC
    '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
  ];
  return blueChips.includes(token);
}

// ============================================
// EXAMPLE 8: Gas Estimation Helper
// ============================================

/**
 * Estimate gas for common Morpho operations
 */
async function estimateMorphoGas(
  operation: 'supply' | 'borrow' | 'repay' | 'withdraw' | 'liquidate',
  marketParams: any,
  amount: bigint
): Promise<bigint> {
  const gasEstimates: Record<string, bigint> = {
    supply: 150000n,
    borrow: 200000n,
    repay: 150000n,
    withdraw: 120000n,
    liquidate: 250000n
  };
  
  // Base estimate
  let estimate = gasEstimates[operation] || 200000n;
  
  // Add buffer for complex markets
  if (operation === 'liquidate') {
    estimate += 50000n; // Extra for collateral transfer
  }
  
  // Get current base fee for more accurate estimate
  const block = await publicClient.getBlock({ blockTag: 'latest' });
  const baseFee = block.baseFeePerGas || 20n;
  
  return estimate * baseFee;
}

// ============================================
// EXAMPLE 9: Event Parsing
// ============================================

import { parseEventLogs } from 'viem';

/**
 * Parse Morpho events from transaction receipt
 */
function parseMorphoEvents(receipt: any) {
  const morphoAbi = [{
    name: 'Supply',
    type: 'event',
    inputs: [
      { name: 'marketParams', type: 'bytes32', indexed: true },
      { name: 'user', type: 'address', indexed: true },
      { name: 'assets', type: 'uint256' },
      { name: 'shares', type: 'uint256' }
    ]
  }, {
    name: 'Borrow',
    type: 'event',
    inputs: [
      { name: 'marketParams', type: 'bytes32', indexed: true },
      { name: 'caller', type: 'address', indexed: true },
      { name: 'onBehalf', type: 'address', indexed: true },
      { name: 'receiver', type: 'address' },
      { name: 'assets', type: 'uint256' },
      { name: 'shares', type: 'uint256' }
    ]
  }, {
    name: 'Liquidate',
    type: 'event',
    inputs: [
      { name: 'marketParams', type: 'bytes32', indexed: true },
      { name: 'borrower', type: 'address', indexed: true },
      { name: 'caller', type: 'address', indexed: true },
      { name: 'seizedAssets', type: 'uint256' },
      { name: 'repaidAssets', type: 'uint256' }
    ]
  }];
  
  const logs = parseEventLogs({
    abi: morphoAbi,
    logs: receipt.logs
  });
  
  return {
    supplies: logs.filter((l: any) => l.eventName === 'Supply'),
    borrows: logs.filter((l: any) => l.eventName === 'Borrow'),
    liquidations: logs.filter((l: any) => l.eventName === 'Liquidate')
  };
}

// ============================================
// EXAMPLE 10: Testing Utilities
// ============================================

import { fork } from 'viem/anvil';

/**
 * Setup local fork for testing
 */
async function setupTestEnvironment() {
  // Fork mainnet at specific block
  const client = createPublicClient({
    chain: mainnet,
    transport: http('http://localhost:8545') // Anvil local node
  });
  
  // Impersonate accounts for testing
  const testAccounts = {
    whale: '0x...', // Address with lots of tokens
    user: '0x...'   // Regular user
  };
  
  return {
    client,
    accounts: testAccounts,
    
    // Helper to fund test account
    async fundAccount(address: `0x${string}`, token: `0x${string}`, amount: bigint) {
      // Impersonate whale and transfer
      await client.request({
        method: 'anvil_impersonateAccount',
        params: [testAccounts.whale]
      });
      
      // Execute transfer
      // ... implementation
      
      await client.request({
        method: 'anvil_stopImpersonatingAccount',
        params: [testAccounts.whale]
      });
    }
  };
}

// Export all examples
export {
  depositToVault,
  calculatePositionHealth,
  createLeveragedPosition,
  LiquidationMonitor,
  calculateMarketRates,
  safeMorphoOperation,
  compareVaults,
  estimateMorphoGas,
  parseMorphoEvents,
  setupTestEnvironment
};
