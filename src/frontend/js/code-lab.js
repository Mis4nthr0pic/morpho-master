/**
 * Code Lab - Monaco Editor Integration
 * Comprehensive TypeScript examples from Morpho docs
 */

let monacoEditor = null;
let currentChallenge = null;
let loadedChallenges = [];

function getMonacoTheme() {
  const theme = document.body?.dataset?.theme || 'dark';
  return theme === 'dark' ? 'vs-dark' : 'vs';
}

window.addEventListener('themechange', () => {
  if (window.monaco && monacoEditor) {
    monaco.editor.setTheme(getMonacoTheme());
  }
});

// Code challenges based on Morpho documentation
const CODE_CHALLENGES = [
  {
    id: 'calculate-ltv',
    title: 'Calculate Current LTV',
    difficulty: 'easy',
    category: 'fundamentals',
    description: `Calculate the current LTV (Loan-to-Value) ratio for a Morpho position.

The formula is: LTV = (Borrowed * WAD) / CollateralValue

Where WAD = 10^18 (scaling factor for precision)`,
    starterCode: `const WAD = BigInt(10) ** BigInt(18);

function calculateLTV(
  borrowedAmount,           // Amount borrowed (in loan token units)
  collateralValueInLoanToken // Collateral value converted to loan token
) {
  // TODO: Calculate LTV scaled by WAD
  // Return the LTV as a BigInt scaled by WAD
  
  return BigInt(0);
}

// Test cases
const testCases = [
  { name: "Standard case", borrowed: BigInt("150000000000"), collateral: BigInt("200000000000"), expected: "750000000000000000" },
  { name: "High LTV", borrowed: BigInt("800000000"), collateral: BigInt("1000000000"), expected: "800000000000000000" }
];

console.log("Running LTV tests...\\n");
for (const test of testCases) {
  const result = calculateLTV(test.borrowed, test.collateral);
  const passed = result.toString() === test.expected;
  console.log((passed ? "✓" : "✗") + " " + test.name + ": got " + result + " (expected: " + test.expected + ")");
}`,
    solution: `const WAD = BigInt(10) ** BigInt(18);

function calculateLTV(borrowedAmount, collateralValueInLoanToken) {
  // LTV = (Borrowed * WAD) / CollateralValue
  return (borrowedAmount * WAD) / collateralValueInLoanToken;
}

// Example: 150 USDC borrowed against 200 USDC collateral = 75% LTV
const testCases = [
  { name: "Standard case", borrowed: BigInt("150000000000"), collateral: BigInt("200000000000"), expected: "750000000000000000" },
  { name: "High LTV", borrowed: BigInt("800000000"), collateral: BigInt("1000000000"), expected: "800000000000000000" }
];

console.log("Running LTV tests...\\n");
for (const test of testCases) {
  const result = calculateLTV(test.borrowed, test.collateral);
  const passed = result.toString() === test.expected;
  console.log((passed ? "✓" : "✗") + " " + test.name + ": got " + result + " (expected: " + test.expected + ")");
}`,
    hints: [
      'Multiply borrowed by WAD first to preserve precision',
      'Then divide by collateral value',
      'Result is scaled by WAD (10^18)'
    ],
    testCases: [
      { input: [BigInt("150000000000"), BigInt("200000000000")], expected: BigInt("750000000000000000") },
      { input: [BigInt("800000000"), BigInt("1000000000")], expected: BigInt("800000000000000000") }
    ]
  },
  {
    id: 'calculate-health-factor',
    title: 'Calculate Health Factor',
    difficulty: 'easy',
    category: 'fundamentals',
    description: `Calculate the Health Factor for a Morpho position.

Formula: Health Factor = (CollateralValue * LLTV) / Borrowed

Health Factor > 1: Position is healthy
Health Factor < 1: Position is liquidatable`,
    starterCode: `const WAD = BigInt(10) ** BigInt(18);

function calculateHealthFactor(
  collateralValueInLoanToken, // Collateral value in loan token units
  lltv,                       // LLTV (scaled by WAD, e.g., 86% = 0.86 * 10^18)
  borrowedAmount              // Amount borrowed
) {
  // TODO: Calculate health factor scaled by WAD
  // Remember: LLTV is already scaled by WAD, so result will be scaled by WAD
  
  return BigInt(0);
}

// Test cases
const testCases = [
  { name: "Healthy", collateral: BigInt("200000000000"), lltv: BigInt("860000000000000000"), borrowed: BigInt("150000000000"), expectedMin: "1140000000000000000" },
  { name: "Very healthy", collateral: BigInt("1000000000"), lltv: BigInt("865000000000000000"), borrowed: BigInt("800000000"), expectedMin: "1080000000000000000" }
];

console.log("Running Health Factor tests...\\n");
for (const test of testCases) {
  const result = calculateHealthFactor(test.collateral, test.lltv, test.borrowed);
  const passed = result > BigInt(test.expectedMin);
  console.log((passed ? "✓" : "✗") + " " + test.name + ": HF = " + result);
}`,
    solution: `const WAD = BigInt(10) ** BigInt(18);

function calculateHealthFactor(collateralValueInLoanToken, lltv, borrowedAmount) {
  if (borrowedAmount === BigInt(0)) return BigInt(Number.MAX_SAFE_INTEGER); // No borrowing = infinite health
  // Health Factor = (CollateralValue * LLTV) / Borrowed
  return (collateralValueInLoanToken * lltv) / borrowedAmount;
}

// Test cases
const testCases = [
  { name: "Healthy", collateral: BigInt("200000000000"), lltv: BigInt("860000000000000000"), borrowed: BigInt("150000000000"), expectedMin: "1140000000000000000" },
  { name: "Very healthy", collateral: BigInt("1000000000"), lltv: BigInt("865000000000000000"), borrowed: BigInt("800000000"), expectedMin: "1080000000000000000" }
];

console.log("Running Health Factor tests...\\n");
for (const test of testCases) {
  const result = calculateHealthFactor(test.collateral, test.lltv, test.borrowed);
  const passed = result > BigInt(test.expectedMin);
  console.log((passed ? "✓" : "✗") + " " + test.name + ": HF = " + result + (result > WAD ? " (healthy)" : " (liquidatable)"));
}`,
    hints: [
      'LLTV is already scaled by WAD (e.g., 86.5% = 865000000000000000)',
      'Multiply collateral value by LLTV first',
      'Then divide by borrowed amount'
    ],
    testCases: [
      { input: [BigInt("200000000000"), BigInt("860000000000000000"), BigInt("150000000000")], expected: BigInt("1146666666666666666") },
      { input: [BigInt("1000000000"), BigInt("865000000000000000"), BigInt("800000000")], expected: BigInt("1081250000000000000") }
    ]
  },
  {
    id: 'collateral-value',
    title: 'Calculate Collateral Value',
    difficulty: 'easy',
    category: 'fundamentals',
    description: `Calculate the collateral value in loan token units using the oracle price.

Formula: CollateralValue = (CollateralAmount * OraclePrice) / ORACLE_PRICE_SCALE

Where ORACLE_PRICE_SCALE = 10^36`,
    starterCode: `const ORACLE_PRICE_SCALE = BigInt(10) ** BigInt(36);

function calculateCollateralValue(
  collateralAmount, // Amount of collateral tokens
  oraclePrice       // Oracle price (scaled by 10^36)
) {
  // TODO: Calculate collateral value in loan token units
  
  return BigInt(0);
}

// Test: 0.2 wstETH collateral at price 1000 USDC per wstETH
const testCases = [
  { name: "wstETH at $1000", amount: BigInt("200000000"), price: BigInt("1000000000000000000000000000000000000"), expected: "200000000000" },
  { name: "ETH at $2000", amount: BigInt("1000000000000000000"), price: BigInt("2000000000000000000000000000000000000"), expected: "2000000000000000000" }
];

console.log("Running Collateral Value tests...\\n");
for (const test of testCases) {
  const result = calculateCollateralValue(test.amount, test.price);
  const passed = result.toString() === test.expected;
  console.log((passed ? "✓" : "✗") + " " + test.name + ": value = " + result);
}`,
    solution: `const ORACLE_PRICE_SCALE = BigInt(10) ** BigInt(36);

function calculateCollateralValue(collateralAmount, oraclePrice) {
  // CollateralValue = (CollateralAmount * OraclePrice) / ORACLE_PRICE_SCALE
  return (collateralAmount * oraclePrice) / ORACLE_PRICE_SCALE;
}

// Oracle price has 36 decimals to handle both token decimals
const testCases = [
  { name: "wstETH at $1000", amount: BigInt("200000000"), price: BigInt("1000000000000000000000000000000000000"), expected: "200000000000" },
  { name: "ETH at $2000", amount: BigInt("1000000000000000000"), price: BigInt("2000000000000000000000000000000000000"), expected: "2000000000000000000" }
];

console.log("Running Collateral Value tests...\\n");
for (const test of testCases) {
  const result = calculateCollateralValue(test.amount, test.price);
  const passed = result.toString() === test.expected;
  console.log((passed ? "✓" : "✗") + " " + test.name + ": value = " + result);
}`,
    hints: [
      'Oracle price is scaled by 10^36',
      'Multiply collateral amount by oracle price first',
      'Then divide by ORACLE_PRICE_SCALE (10^36)'
    ],
    testCases: [
      { input: [BigInt("200000000"), BigInt("1000000000000000000000000000000000000")], expected: BigInt("200000000000") },
      { input: [BigInt("1000000000000000000"), BigInt("2000000000000000000000000000000000000")], expected: BigInt("2000000000000000000") }
    ]
  },
  {
    id: 'max-borrow-amount',
    title: 'Calculate Max Borrow Amount',
    difficulty: 'medium',
    category: 'fundamentals',
    description: `Calculate the maximum amount a user can borrow based on their collateral.

Formula: MaxBorrow = (CollateralValue * LLTV) / WAD

Then apply a safety buffer (e.g., 95% of max for 5% buffer).`,
    starterCode: `const WAD = BigInt(10) ** BigInt(18);

function calculateMaxBorrow(
  collateralValueInLoanToken,
  lltv,
  safetyBufferPercent // e.g., 95 for 5% buffer, 90 for 10% buffer
) {
  // TODO: Calculate max borrow with safety buffer
  // 1. Calculate theoretical max borrow
  // 2. Apply safety buffer
  
  return BigInt(0);
}

// Test cases
const testCases = [
  { name: "$1000 collateral, 86.5% LLTV, 5% buffer", collateral: BigInt("1000000000"), lltv: BigInt("865000000000000000"), buffer: 95, expected: "821750000" },
  { name: "$2000 collateral, 80% LLTV, 10% buffer", collateral: BigInt("2000000000"), lltv: BigInt("800000000000000000"), buffer: 90, expected: "1440000000" }
];

console.log("Running Max Borrow tests...\\n");
for (const test of testCases) {
  const result = calculateMaxBorrow(test.collateral, test.lltv, test.buffer);
  const passed = result.toString() === test.expected;
  console.log((passed ? "✓" : "✗") + " " + test.name + ": max borrow = " + result);
}`,
    solution: `const WAD = BigInt(10) ** BigInt(18);

function calculateMaxBorrow(collateralValueInLoanToken, lltv, safetyBufferPercent) {
  // Max theoretical borrow
  const maxBorrow = (collateralValueInLoanToken * lltv) / WAD;
  
  // Apply safety buffer
  const bufferScaled = BigInt(Math.floor(safetyBufferPercent * 100));
  return (maxBorrow * bufferScaled) / BigInt(10000);
}

// Always leave a safety buffer to avoid liquidation from price fluctuations!
const testCases = [
  { name: "$1000 collateral, 86.5% LLTV, 5% buffer", collateral: BigInt("1000000000"), lltv: BigInt("865000000000000000"), buffer: 95, expected: "821750000" },
  { name: "$2000 collateral, 80% LLTV, 10% buffer", collateral: BigInt("2000000000"), lltv: BigInt("800000000000000000"), buffer: 90, expected: "1440000000" }
];

console.log("Running Max Borrow tests...\\n");
for (const test of testCases) {
  const result = calculateMaxBorrow(test.collateral, test.lltv, test.buffer);
  const passed = result.toString() === test.expected;
  console.log((passed ? "✓" : "✗") + " " + test.name + ": max borrow = " + result);
}`,
    hints: [
      'Calculate max theoretical first: (collateral * LLTV) / WAD',
      'Convert safety buffer percent to BigInt (e.g., 95% = 9500)',
      'Apply buffer: maxBorrow * buffer / 10000'
    ],
    testCases: [
      { input: [BigInt("1000000000"), BigInt("865000000000000000"), 95], expected: BigInt("821750000") },
      { input: [BigInt("2000000000"), BigInt("800000000000000000"), 90], expected: BigInt("1440000000") }
    ]
  },
  {
    id: 'liquidation-price',
    title: 'Calculate Liquidation Price',
    difficulty: 'medium',
    category: 'fundamentals',
    description: `Calculate the price at which a position becomes liquidatable.

At liquidation: Health Factor = 1
So: (Collateral * Price * LLTV) / Borrowed = 1
Therefore: LiquidationPrice = Borrowed / (Collateral * LLTV)`,
    starterCode: `const WAD = BigInt(10) ** BigInt(18);

function calculateLiquidationPrice(
  borrowedAmount,     // Amount borrowed
  collateralAmount,   // Amount of collateral tokens
  lltv                // LLTV scaled by WAD
) {
  // TODO: Calculate liquidation price scaled by WAD
  // If result is 0, return 0 (avoid division by zero)
  
  return BigInt(0);
}

// Test cases
const testCases = [
  { name: "ETH position", borrowed: BigInt("150000000000"), collateral: BigInt("200000000000000000"), lltv: BigInt("865000000000000000"), expected: "8670520231213872832" },
  { name: "WBTC position", borrowed: BigInt("3200000000"), collateral: BigInt("2000000000000000000"), lltv: BigInt("800000000000000000"), expected: "2000000000000000000000" }
];

console.log("Running Liquidation Price tests...\\n");
for (const test of testCases) {
  const result = calculateLiquidationPrice(test.borrowed, test.collateral, test.lltv);
  const passed = result.toString() === test.expected;
  console.log((passed ? "✓" : "✗") + " " + test.name + ": liq price = " + result);
}`,
    solution: `const WAD = BigInt(10) ** BigInt(18);

function calculateLiquidationPrice(borrowedAmount, collateralAmount, lltv) {
  if (collateralAmount === BigInt(0)) return BigInt(0);
  
  // LiquidationPrice = (Borrowed * WAD * WAD) / (Collateral * LLTV)
  // Need WAD^2 because both result and LLTV are scaled by WAD
  return (borrowedAmount * WAD * WAD) / (collateralAmount * lltv);
}

// Result is scaled by WAD
const testCases = [
  { name: "ETH position", borrowed: BigInt("150000000000"), collateral: BigInt("200000000000000000"), lltv: BigInt("865000000000000000"), expected: "8670520231213872832" },
  { name: "WBTC position", borrowed: BigInt("3200000000"), collateral: BigInt("2000000000000000000"), lltv: BigInt("800000000000000000"), expected: "2000000000000000000000" }
];

console.log("Running Liquidation Price tests...\\n");
for (const test of testCases) {
  const result = calculateLiquidationPrice(test.borrowed, test.collateral, test.lltv);
  const passed = result.toString() === test.expected;
  console.log((passed ? "✓" : "✗") + " " + test.name + ": liq price = " + result);
}`,
    hints: [
      'Watch out for division by zero if collateral is 0',
      'Result needs to be scaled by WAD',
      'Multiply numerator by WAD twice to handle LLTV scaling'
    ],
    testCases: [
      { input: [BigInt("150000000000"), BigInt("200000000000000000"), BigInt("865000000000000000")], expected: BigInt("8670520231213872832") },
      { input: [BigInt("3200000000"), BigInt("2000000000000000000"), BigInt("800000000000000000")], expected: BigInt("2000000000000000000000") }
    ]
  },
  {
    id: 'shares-to-assets',
    title: 'Convert Shares to Assets',
    difficulty: 'medium',
    category: 'vaults',
    description: `Convert vault shares to underlying assets for ERC4626 vaults.

Formula: Assets = (Shares * TotalAssets) / TotalShares

This is used when withdrawing or redeeming from MetaMorpho vaults.`,
    starterCode: `function convertSharesToAssets(
  shares,           // Amount of vault shares
  totalAssets,      // Total assets managed by vault
  totalShares       // Total shares issued by vault
) {
  // TODO: Calculate asset amount for given shares
  // Avoid division by zero
  
  return BigInt(0);
}

// Test cases
const testCases = [
  { name: "Normal conversion", shares: BigInt(100), totalAssets: BigInt(1100), totalShares: BigInt(1000), expected: "110" },
  { name: "With interest accrued", shares: BigInt(500), totalAssets: BigInt(1050), totalShares: BigInt(1000), expected: "525" }
];

console.log("Running Shares to Assets tests...\\n");
for (const test of testCases) {
  const result = convertSharesToAssets(test.shares, test.totalAssets, test.totalShares);
  const passed = result.toString() === test.expected;
  console.log((passed ? "✓" : "✗") + " " + test.name + ": assets = " + result);
}`,
    solution: `function convertSharesToAssets(shares, totalAssets, totalShares) {
  if (totalShares === BigInt(0)) return BigInt(0);
  
  // Assets = (Shares * TotalAssets) / TotalShares
  return (shares * totalAssets) / totalShares;
}

// Vaults use this for ERC4626 compliance
// totalAssets includes accrued interest since last update
const testCases = [
  { name: "Normal conversion", shares: BigInt(100), totalAssets: BigInt(1100), totalShares: BigInt(1000), expected: "110" },
  { name: "With interest accrued", shares: BigInt(500), totalAssets: BigInt(1050), totalShares: BigInt(1000), expected: "525" }
];

console.log("Running Shares to Assets tests...\\n");
for (const test of testCases) {
  const result = convertSharesToAssets(test.shares, test.totalAssets, test.totalShares);
  const passed = result.toString() === test.expected;
  console.log((passed ? "✓" : "✗") + " " + test.name + ": assets = " + result);
}`,
    hints: [
      'Handle case where totalShares is 0',
      'Multiply shares by totalAssets first',
      'Then divide by totalShares'
    ],
    testCases: [
      { input: [BigInt(100), BigInt(1100), BigInt(1000)], expected: BigInt(110) },
      { input: [BigInt(500), BigInt(1050), BigInt(1000)], expected: BigInt(525) }
    ]
  },
  {
    id: 'assets-to-shares',
    title: 'Convert Assets to Shares',
    difficulty: 'medium',
    category: 'vaults',
    description: `Convert underlying assets to vault shares for ERC4626 vaults.

Formula: Shares = (Assets * TotalShares) / TotalAssets

This is used when depositing or minting MetaMorpho vault shares.`,
    starterCode: `function convertAssetsToShares(
  assets,           // Amount of underlying assets
  totalShares,      // Total shares issued by vault
  totalAssets       // Total assets managed by vault
) {
  // TODO: Calculate shares for given asset amount
  // Avoid division by zero
  
  return BigInt(0);
}

// Test cases
const testCases = [
  { name: "Normal conversion", assets: BigInt(110), totalShares: BigInt(1000), totalAssets: BigInt(1100), expected: "100" },
  { name: "First deposit (1:1)", assets: BigInt(100), totalShares: BigInt(0), totalAssets: BigInt(0), expected: "100" },
  { name: "Larger deposit", assets: BigInt(210), totalShares: BigInt(1000), totalAssets: BigInt(1100), expected: "190" }
];

console.log("Running Assets to Shares tests...\\n");
for (const test of testCases) {
  const result = convertAssetsToShares(test.assets, test.totalShares, test.totalAssets);
  const passed = result.toString() === test.expected;
  console.log((passed ? "✓" : "✗") + " " + test.name + ": shares = " + result);
}`,
    solution: `function convertAssetsToShares(assets, totalShares, totalAssets) {
  if (totalAssets === BigInt(0)) return assets; // 1:1 on first deposit
  
  // Shares = (Assets * TotalShares) / TotalAssets
  return (assets * totalShares) / totalAssets;
}

// First deposit is always 1:1 (shares = assets)
// After that, use the proportional formula
const testCases = [
  { name: "Normal conversion", assets: BigInt(110), totalShares: BigInt(1000), totalAssets: BigInt(1100), expected: "100" },
  { name: "First deposit (1:1)", assets: BigInt(100), totalShares: BigInt(0), totalAssets: BigInt(0), expected: "100" },
  { name: "Larger deposit", assets: BigInt(210), totalShares: BigInt(1000), totalAssets: BigInt(1100), expected: "190" }
];

console.log("Running Assets to Shares tests...\\n");
for (const test of testCases) {
  const result = convertAssetsToShares(test.assets, test.totalShares, test.totalAssets);
  const passed = result.toString() === test.expected;
  console.log((passed ? "✓" : "✗") + " " + test.name + ": shares = " + result);
}`,
    hints: [
      'First deposit should return assets (1:1)',
      'Check if totalAssets is 0 for first deposit',
      'Otherwise: multiply assets by totalShares, divide by totalAssets'
    ],
    testCases: [
      { input: [BigInt(110), BigInt(1000), BigInt(1100)], expected: BigInt(100) },
      { input: [BigInt(100), BigInt(0), BigInt(0)], expected: BigInt(100) },
      { input: [BigInt(210), BigInt(1000), BigInt(1100)], expected: BigInt(190) }
    ]
  },
  {
    id: 'slippage-protection',
    title: 'Slippage Protection for Deposits',
    difficulty: 'hard',
    category: 'vaults',
    description: `Calculate minimum shares to receive with slippage protection.

When depositing to a vault, calculate expected shares and apply slippage tolerance.
If you receive less than minShares, the transaction reverts.

Formula: MinShares = ExpectedShares * (100 - SlippagePercent) / 100`,
    starterCode: `function calculateMinShares(
  assets,           // Assets to deposit
  totalShares,      // Current total shares
  totalAssets,      // Current total assets
  slippagePercent   // Max acceptable slippage (e.g., 0.5 for 0.5%)
) {
  // TODO: 
  // 1. Calculate expected shares
  // 2. Apply slippage tolerance
  // 3. Return minimum acceptable shares
  
  return BigInt(0);
}

// Test cases
const testCases = [
  { name: "0.5% slippage", assets: BigInt(1000), totalShares: BigInt(1000), totalAssets: BigInt(1100), slippage: 0.5, expected: "904" },
  { name: "1% slippage, first deposit", assets: BigInt(100), totalShares: BigInt(0), totalAssets: BigInt(0), slippage: 1.0, expected: "99" }
];

console.log("Running Slippage Protection tests...\\n");
for (const test of testCases) {
  const result = calculateMinShares(test.assets, test.totalShares, test.totalAssets, test.slippage);
  const passed = result.toString() === test.expected;
  console.log((passed ? "✓" : "✗") + " " + test.name + ": min shares = " + result);
}`,
    solution: `function calculateMinShares(assets, totalShares, totalAssets, slippagePercent) {
  // Calculate expected shares
  let expectedShares;
  if (totalAssets === BigInt(0)) {
    expectedShares = assets; // 1:1 on first deposit
  } else {
    expectedShares = (assets * totalShares) / totalAssets;
  }
  
  // Apply slippage: (100 - slippage) / 100
  // Scale by 10000 for precision: (10000 - slippage*100) / 10000
  const slippageBps = BigInt(Math.floor(slippagePercent * 100));
  const minShares = (expectedShares * (BigInt(10000) - slippageBps)) / BigInt(10000);
  
  return minShares;
}

// Always use slippage protection for vault deposits!
// Interest accrues every block, changing the exchange rate
const testCases = [
  { name: "0.5% slippage", assets: BigInt(1000), totalShares: BigInt(1000), totalAssets: BigInt(1100), slippage: 0.5, expected: "904" },
  { name: "1% slippage, first deposit", assets: BigInt(100), totalShares: BigInt(0), totalAssets: BigInt(0), slippage: 1.0, expected: "99" }
];

console.log("Running Slippage Protection tests...\\n");
for (const test of testCases) {
  const result = calculateMinShares(test.assets, test.totalShares, test.totalAssets, test.slippage);
  const passed = result.toString() === test.expected;
  console.log((passed ? "✓" : "✗") + " " + test.name + ": min shares = " + result);
}`,
    hints: [
      'Calculate expected shares first using convertAssetsToShares logic',
      'Convert slippage percent to basis points (0.5% = 50 bps)',
      'Formula: minShares = expected * (10000 - slippageBps) / 10000'
    ],
    testCases: [
      { input: [BigInt(1000), BigInt(1000), BigInt(1100), 0.5], expected: BigInt(904) },
      { input: [BigInt(100), BigInt(0), BigInt(0), 1.0], expected: BigInt(99) }
    ]
  },
  {
    id: 'interest-accrual',
    title: 'Calculate Accrued Interest',
    difficulty: 'hard',
    category: 'advanced',
    description: `Calculate total assets with accrued interest since last update.

Interest accrues based on borrow rate and time elapsed.
Formula: TotalAssets = LastTotalAssets * (1 + BorrowRate * TimeElapsed)`,
    starterCode: `const WAD = BigInt(10) ** BigInt(18);
const YEAR_IN_SECONDS = BigInt(365 * 24 * 60 * 60); // 31,536,000

function calculateAccruedAssets(
  lastTotalAssets,    // Total assets at last update
  borrowRate,         // Current borrow rate (scaled by WAD)
  lastUpdate,         // Timestamp of last update
  currentTime         // Current timestamp
) {
  // TODO: Calculate total assets with accrued interest
  // Interest = Principal * Rate * Time / Year
  // All values scaled by WAD
  
  return BigInt(0);
}

// Test cases
const testCases = [
  { name: "10% rate, 1 day", lastAssets: BigInt("1000000000"), rate: BigInt("100000000000000000"), lastUpdate: BigInt(0), current: BigInt(86400), expected: "1000273972602739726" },
  { name: "No time elapsed", lastAssets: BigInt(10000), rate: BigInt("50000000000000000"), lastUpdate: BigInt(1000), current: BigInt(1000), expected: "10000" }
];

console.log("Running Interest Accrual tests...\\n");
for (const test of testCases) {
  const result = calculateAccruedAssets(test.lastAssets, test.rate, test.lastUpdate, test.current);
  const passed = result.toString() === test.expected;
  console.log((passed ? "✓" : "✗") + " " + test.name + ": accrued = " + result);
}`,
    solution: `const WAD = BigInt(10) ** BigInt(18);
const YEAR_IN_SECONDS = BigInt(365 * 24 * 60 * 60);

function calculateAccruedAssets(lastTotalAssets, borrowRate, lastUpdate, currentTime) {
  if (currentTime <= lastUpdate) return lastTotalAssets;
  
  const timeElapsed = currentTime - lastUpdate;
  
  // Accrued = Principal * (1 + Rate * Time / Year)
  // = Principal + (Principal * Rate * Time / Year)
  const interest = (lastTotalAssets * borrowRate * timeElapsed) / (WAD * YEAR_IN_SECONDS);
  
  return lastTotalAssets + interest;
}

// Interest compounds over time
// Borrow rate is per-second, so we scale by time elapsed
const testCases = [
  { name: "10% rate, 1 day", lastAssets: BigInt("1000000000"), rate: BigInt("100000000000000000"), lastUpdate: BigInt(0), current: BigInt(86400), expected: "1000273972602739726" },
  { name: "No time elapsed", lastAssets: BigInt(10000), rate: BigInt("50000000000000000"), lastUpdate: BigInt(1000), current: BigInt(1000), expected: "10000" }
];

console.log("Running Interest Accrual tests...\\n");
for (const test of testCases) {
  const result = calculateAccruedAssets(test.lastAssets, test.rate, test.lastUpdate, test.current);
  const passed = result.toString() === test.expected;
  console.log((passed ? "✓" : "✗") + " " + test.name + ": accrued = " + result);
}`,
    hints: [
      'Calculate time elapsed: currentTime - lastUpdate',
      'Interest = Principal * Rate * Time / (WAD * Year)',
      'Add interest to principal for total accrued assets'
    ],
    testCases: [
      { input: [BigInt("1000000000"), BigInt("100000000000000000"), BigInt(0), BigInt(86400)], expected: BigInt("1000273972602739726") },
      { input: [BigInt(10000), BigInt("50000000000000000"), BigInt(1000), BigInt(1000)], expected: BigInt(10000) }
    ]
  },
  {
    id: 'position-summary',
    title: 'Get Position Summary',
    difficulty: 'hard',
    category: 'integration',
    description: `Create a function that returns a complete summary of a user's position.

Should return: LTV, Health Factor, Liquidation Price, and status.`,
    starterCode: `const WAD = BigInt(10) ** BigInt(18);
const ORACLE_PRICE_SCALE = BigInt(10) ** BigInt(36);

function getPositionSummary(
  collateralAmount,
  collateralPrice,         // Scaled by ORACLE_PRICE_SCALE
  borrowedAmount,
  lltv                     // Scaled by WAD
) {
  // TODO: Calculate all metrics and determine status
  // Status thresholds:
  // - healthy: HF > 1.2
  // - warning: 1.05 < HF <= 1.2
  // - danger: 1.0 < HF <= 1.05
  // - liquidatable: HF <= 1.0
  
  return {
    ltv: 0,
    healthFactor: 0,
    liquidationPrice: BigInt(0),
    status: 'healthy'
  };
}

// Test cases
const testCases = [
  { 
    name: "Healthy position",
    collateral: BigInt("200000000"), 
    price: BigInt("1000000000000000000000000000000000000"), 
    borrowed: BigInt("150000000000"), 
    lltv: BigInt("860000000000000000"),
    expectedStatus: 'healthy'
  }
];

console.log("Running Position Summary tests...\\n");
for (const test of testCases) {
  const result = getPositionSummary(test.collateral, test.price, test.borrowed, test.lltv);
  const passed = result.status === test.expectedStatus;
  console.log((passed ? "✓" : "✗") + " " + test.name + ": status = " + result.status + ", LTV = " + result.ltv + ", HF = " + result.healthFactor);
}`,
    solution: `const WAD = BigInt(10) ** BigInt(18);
const ORACLE_PRICE_SCALE = BigInt(10) ** BigInt(36);

function getPositionSummary(collateralAmount, collateralPrice, borrowedAmount, lltv) {
  // Calculate collateral value
  const collateralValue = (collateralAmount * collateralPrice) / ORACLE_PRICE_SCALE;
  
  // Calculate LTV
  const ltvRaw = (borrowedAmount * WAD) / collateralValue;
  const ltv = Number(ltvRaw) / Number(WAD);
  
  // Calculate Health Factor
  const healthFactorRaw = (collateralValue * lltv) / borrowedAmount;
  const healthFactor = Number(healthFactorRaw) / Number(WAD);
  
  // Calculate Liquidation Price
  const liqPriceRaw = (borrowedAmount * WAD * WAD) / (collateralAmount * lltv);
  const liquidationPrice = liqPriceRaw;
  
  // Determine status
  let status;
  if (healthFactor <= 1.0) status = 'liquidatable';
  else if (healthFactor <= 1.05) status = 'danger';
  else if (healthFactor <= 1.2) status = 'warning';
  else status = 'healthy';
  
  return { ltv, healthFactor, liquidationPrice, status };
}

// This combines all the fundamental calculations into one useful function!
const testCases = [
  { 
    name: "Healthy position",
    collateral: BigInt("200000000"), 
    price: BigInt("1000000000000000000000000000000000000"), 
    borrowed: BigInt("150000000000"), 
    lltv: BigInt("860000000000000000"),
    expectedStatus: 'healthy'
  }
];

console.log("Running Position Summary tests...\\n");
for (const test of testCases) {
  const result = getPositionSummary(test.collateral, test.price, test.borrowed, test.lltv);
  const passed = result.status === test.expectedStatus;
  console.log((passed ? "✓" : "✗") + " " + test.name + ": status = " + result.status + ", LTV = " + result.ltv.toFixed(3) + ", HF = " + result.healthFactor.toFixed(3));
}`,
    hints: [
      'Use the formulas from previous challenges',
      'Calculate each metric step by step',
      'Use if-else chain to determine status based on HF thresholds'
    ],
    testCases: [
      { 
        input: [BigInt("200000000"), BigInt("1000000000000000000000000000000000000"), BigInt("150000000000"), BigInt("860000000000000000")],
        expected: { ltv: 0.75, healthFactor: 1.146, status: 'healthy' }
      }
    ]
  }
];

function getChallengeBank() {
  return loadedChallenges.length ? loadedChallenges : CODE_CHALLENGES;
}

function getChallengeGlossaryTexts(challenge) {
  return [
    challenge.title,
    challenge.category,
    challenge.description,
    challenge.starterCode,
    ...(challenge.hints || [])
  ];
}

function transpileChallengeCode(source) {
  if (window.ts?.transpileModule) {
    const result = window.ts.transpileModule(source, {
      compilerOptions: {
        target: window.ts.ScriptTarget.ES2020,
        module: window.ts.ModuleKind.None,
        strict: false
      },
      reportDiagnostics: false
    });

    return result.outputText || source;
  }

  return source;
}

function getChallengeFunctionName(challenge) {
  const sources = [challenge.starterCode || '', challenge.solution || ''];
  for (const source of sources) {
    const fnMatch = source.match(/function\s+([A-Za-z_$][\w$]*)\s*\(/);
    if (fnMatch) return fnMatch[1];

    const constFnMatch = source.match(/const\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\(/);
    if (constFnMatch) return constFnMatch[1];
  }
  return null;
}

function parseLiteralValue(value) {
  if (typeof value !== 'string') return value;

  try {
    return new Function(`return (${value});`)();
  } catch {
    return value;
  }
}

function normalizeDeep(value) {
  if (typeof value === 'bigint') return `${value.toString()}n`;
  if (Array.isArray(value)) return value.map(normalizeDeep);
  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = normalizeDeep(value[key]);
        return acc;
      }, {});
  }
  return value;
}

function matchesExpected(actual, expected) {
  const normalizedActual = normalizeDeep(actual);
  const normalizedExpected = normalizeDeep(expected);

  if (
    normalizedExpected &&
    typeof normalizedExpected === 'object' &&
    !Array.isArray(normalizedExpected) &&
    normalizedActual &&
    typeof normalizedActual === 'object' &&
    !Array.isArray(normalizedActual)
  ) {
    return Object.keys(normalizedExpected).every(
      (key) => JSON.stringify(normalizedActual[key]) === JSON.stringify(normalizedExpected[key])
    );
  }

  return JSON.stringify(normalizedActual) === JSON.stringify(normalizedExpected);
}

function formatValue(value) {
  const normalized = normalizeDeep(value);
  if (typeof normalized === 'string') return normalized;
  return JSON.stringify(normalized, null, 2);
}

function runChallengeTests(challenge, executableCode) {
  const functionName = getChallengeFunctionName(challenge);
  if (!functionName) {
    return {
      ok: false,
      output: 'Could not detect a callable function for this challenge.'
    };
  }

  let candidate;
  try {
    candidate = new Function(`${executableCode}\nreturn typeof ${functionName} !== 'undefined' ? ${functionName} : null;`)();
  } catch (error) {
    return {
      ok: false,
      output: `Compile/runtime error while loading function:\n${error.message}`
    };
  }

  if (typeof candidate !== 'function') {
    return {
      ok: false,
      output: `Function "${functionName}" was not available after transpilation.`
    };
  }

  const cases = challenge.testCases || [];
  if (!cases.length) {
    return {
      ok: true,
      output: 'No structured test cases found for this challenge.'
    };
  }

  const lines = [];
  let passedCount = 0;

  cases.forEach((testCase, index) => {
    try {
      const parsedInputs = (testCase.input || []).map(parseLiteralValue);
      const expected = parseLiteralValue(testCase.expected);
      const actual = candidate(...parsedInputs);
      const passed = matchesExpected(actual, expected);

      if (passed) passedCount += 1;

      lines.push(
        `${passed ? 'PASS' : 'FAIL'} test ${index + 1}\nexpected: ${formatValue(expected)}\nreceived: ${formatValue(actual)}`
      );
    } catch (error) {
      lines.push(`FAIL test ${index + 1}\nerror: ${error.message}`);
    }
  });

  return {
    ok: passedCount === cases.length,
    output: `Ran ${cases.length} test${cases.length === 1 ? '' : 's'} for ${functionName}\n${passedCount}/${cases.length} passed\n\n${lines.join('\n\n')}`
  };
}

async function fetchChallengeBank() {
  try {
    const response = await fetch('/api/code/challenges');
    const data = await response.json();
    loadedChallenges = data.challenges || [];
  } catch (error) {
    console.error('Failed to load remote code challenges, using fallback bank:', error);
    loadedChallenges = [];
  }
}

// Initialize Code Lab
async function initCodeLab() {
  const challengeList = document.getElementById('code-challenge-list');
  if (!challengeList) return;

  await fetchChallengeBank();
  const challengeBank = getChallengeBank();
  const subtitle = document.querySelector('#code .subtitle');

  if (subtitle) {
    subtitle.textContent = `${challengeBank.length} realistic TypeScript challenges sourced from the upgraded trainer`;
  }
  
  // Render challenge list
  challengeList.innerHTML = challengeBank.map(c => `
    <div class="challenge-nav-item ${c.difficulty}" data-id="${c.id}">
      <div class="challenge-nav-title">${c.title}</div>
      <div class="challenge-nav-meta">
        <span class="difficulty-badge ${c.difficulty}">${c.difficulty}</span>
        <span class="category-badge">${c.category}</span>
      </div>
    </div>
  `).join('');
  
  // Bind click handlers
  challengeList.querySelectorAll('.challenge-nav-item').forEach(item => {
    item.addEventListener('click', () => loadChallenge(item.dataset.id));
  });
  
  // Load first challenge
  if (challengeBank.length > 0) {
    const preferred = localStorage.getItem('preferredCodeChallenge');
    const firstId = challengeBank.find((item) => item.id === preferred)?.id || challengeBank[0].id;
    loadChallenge(firstId);
  }
}

function loadChallenge(id) {
  const challenge = getChallengeBank().find(c => c.id === id);
  if (!challenge) return;
  
  currentChallenge = challenge;
  localStorage.setItem('preferredCodeChallenge', challenge.id);
  window.trainingAnalytics?.recordCode({
    challengeId: challenge.id,
    completed: false,
    concepts: window.trainingAnalytics.extractConcepts(getChallengeGlossaryTexts(challenge))
  });
  
  // Update UI
  const descEl = document.getElementById('code-description');
  if (descEl) {
    descEl.innerHTML = `
      <h2>${challenge.title}</h2>
      <div class="challenge-meta">
        <span class="difficulty-badge ${challenge.difficulty}">${challenge.difficulty}</span>
        <span class="category-badge">${challenge.category}</span>
      </div>
      <div class="challenge-description">${challenge.description.replace(/\n/g, '<br>')}</div>
      <div id="code-hint-panel" class="code-hint-panel"></div>
    `;
  }
  
  const editorContainer = document.getElementById('code-editor-container');
  if (editorContainer) editorContainer.style.display = 'block';
  
  // Initialize Monaco if not already, otherwise set value
  if (!monacoEditor) {
    initMonaco();
  } else {
    monacoEditor.setValue(challenge.starterCode);
  }
  
  // Highlight active
  document.querySelectorAll('.challenge-nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.id === id);
  });
}

function initMonaco() {
  // Check if require is available (Monaco loader loaded)
  if (typeof require === 'undefined') {
    console.error('Monaco loader not loaded');
    document.getElementById('monaco-editor').innerHTML = '<p style="padding: 20px; color: var(--text-secondary);">Loading editor...</p>';
    setTimeout(initMonaco, 500);
    return;
  }
  
  require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });
  
  require(['vs/editor/editor.main'], function() {
    const editorContainer = document.getElementById('monaco-editor');
    if (!editorContainer) return;
    
    // Clear loading message
    editorContainer.innerHTML = '';
    
    monacoEditor = monaco.editor.create(editorContainer, {
      value: currentChallenge ? currentChallenge.starterCode : '// Select a challenge',
      language: 'javascript',
      theme: getMonacoTheme(),
      fontSize: 14,
      minimap: { enabled: false },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      lineNumbers: 'on',
      roundedSelection: false,
      padding: { top: 16 }
    });
    
    console.log('Monaco editor initialized');
  }, function(err) {
    console.error('Monaco loading error:', err);
    document.getElementById('monaco-editor').innerHTML = '<p style="padding: 20px; color: var(--color-danger);">Failed to load editor. Please refresh.</p>';
  });
  
  // Bind toolbar buttons
  const runBtn = document.getElementById('code-run-btn');
  const hintBtn = document.getElementById('code-hint-btn');
  const solutionBtn = document.getElementById('code-solution-btn');
  const resetBtn = document.getElementById('code-reset-btn');
  
  if (runBtn) runBtn.addEventListener('click', runCode);
  if (hintBtn) hintBtn.addEventListener('click', showHint);
  if (solutionBtn) solutionBtn.addEventListener('click', showSolution);
  if (resetBtn) resetBtn.addEventListener('click', resetCode);
}

function runCode() {
  if (!monacoEditor || !currentChallenge) return;
  
  const code = monacoEditor.getValue();
  const executableCode = transpileChallengeCode(code);
  const output = document.getElementById('output-content');
  
  output.textContent = 'Running tests...\n\n';
  
  // Capture console.log
  const logs = [];
  const originalLog = console.log;
  console.log = function(...args) {
    logs.push(args.map(a => String(a)).join(' '));
  };
  
  try {
    const testResult = runChallengeTests(currentChallenge, executableCode);
    const consoleOutput = logs.length > 0 ? `Console output:\n${logs.join('\n')}\n\n` : '';
    output.textContent = `${testResult.output}${consoleOutput}`;
    window.trainingAnalytics?.recordCode({
      challengeId: currentChallenge.id,
      completed: testResult.ok,
      concepts: window.trainingAnalytics.extractConcepts(getChallengeGlossaryTexts(currentChallenge))
    });
  } catch (error) {
    output.textContent = 'Error: ' + error.message;
    console.error(error);
  } finally {
    console.log = originalLog;
  }
}

function showHint() {
  if (!currentChallenge) return;
  
  const hintPanel = document.getElementById('code-hint-panel');
  const output = document.getElementById('output-content');
  const hintMarkup = `
    <div class="hint-card">
      <strong>Hints</strong>
      <ol>
        ${currentChallenge.hints.map((hint) => `<li>${hint}</li>`).join('')}
      </ol>
    </div>
  `;

  if (hintPanel) {
    hintPanel.innerHTML = hintMarkup;
    hintPanel.style.display = 'block';
  }

  if (output) {
    output.textContent = `Hints:\n\n${currentChallenge.hints.map((h, i) => `${i + 1}. ${h}`).join('\n')}`;
  }
}

function showSolution() {
  if (!currentChallenge || !monacoEditor) return;
  
  if (confirm('Show solution? This will replace your current code.')) {
    monacoEditor.setValue(currentChallenge.solution);
  }
}

function resetCode() {
  if (!currentChallenge || !monacoEditor) return;
  
  if (confirm('Reset to starter code?')) {
    monacoEditor.setValue(currentChallenge.starterCode);
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initCodeLab);
