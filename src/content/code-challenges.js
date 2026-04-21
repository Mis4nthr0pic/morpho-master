/**
 * Morpho Partner Engineer code lab
 * Realistic TypeScript challenges
 */

const { COMPLEMENTARY_CODE_CHALLENGES } = require('./complementary-data');

const challenge = (data) => data;

const CORE_CODE_CHALLENGES = [
  challenge({
    id: 'build-market-params',
    title: 'Build MarketParams',
    difficulty: 'easy',
    category: 'blue-sdk',
    description: `Create a typed MarketParams object for a Morpho market. This is the foundation for direct contract calls, adapter allocations, and market-id derivation.`,
    starterCode: `type Address = \`0x\${string}\`;

interface MarketParams {
  loanToken: Address;
  collateralToken: Address;
  oracle: Address;
  irm: Address;
  lltv: bigint;
}

function buildMarketParams(
  loanToken: Address,
  collateralToken: Address,
  oracle: Address,
  irm: Address,
  lltvBps: number
): MarketParams {
  // TODO: convert basis points to WAD-scaled bigint
  return {
    loanToken,
    collateralToken,
    oracle,
    irm,
    lltv: 0n
  };
}`,
    solution: `type Address = \`0x\${string}\`;
const WAD = 10n ** 18n;

interface MarketParams {
  loanToken: Address;
  collateralToken: Address;
  oracle: Address;
  irm: Address;
  lltv: bigint;
}

function buildMarketParams(
  loanToken: Address,
  collateralToken: Address,
  oracle: Address,
  irm: Address,
  lltvBps: number
): MarketParams {
  return {
    loanToken,
    collateralToken,
    oracle,
    irm,
    lltv: BigInt(lltvBps) * WAD / 10_000n
  };
}`,
    hints: [
      'LLTV uses WAD scaling.',
      'Basis points divide by 10,000.',
      'Return a plain object with the same key order as MarketParams.'
    ],
    testCases: [
      { input: ['0x1', '0x2', '0x3', '0x4', '8600'], expected: '{ lltv: 860000000000000000n }' }
    ]
  }),
  challenge({
    id: 'calculate-collateral-value',
    title: 'Calculate Collateral Value with 1e36 Scaling',
    difficulty: 'easy',
    category: 'fundamentals',
    description: `Compute collateral value in loan-token units using Morpho's 1e36 oracle scaling.`,
    starterCode: `const ORACLE_PRICE_SCALE = 10n ** 36n;

function calculateCollateralValue(
  collateralAssets: bigint,
  oraclePrice: bigint
): bigint {
  // TODO
  return 0n;
}`,
    solution: `const ORACLE_PRICE_SCALE = 10n ** 36n;

function calculateCollateralValue(
  collateralAssets: bigint,
  oraclePrice: bigint
): bigint {
  return collateralAssets * oraclePrice / ORACLE_PRICE_SCALE;
}`,
    hints: ['Multiply first, divide second.', 'The output is in loan-token units.'],
    testCases: [
      { input: ['200000000n', '1000000000000000000000000000000000000000n'], expected: '200000000000n' }
    ]
  }),
  challenge({
    id: 'calculate-health-factor',
    title: 'Calculate Health Factor',
    difficulty: 'easy',
    category: 'fundamentals',
    description: `Given collateral value, LLTV, and borrow assets, return a WAD-scaled health factor.`,
    starterCode: `function calculateHealthFactor(
  collateralValue: bigint,
  lltv: bigint,
  borrowAssets: bigint
): bigint {
  // TODO
  return 0n;
}`,
    solution: `function calculateHealthFactor(
  collateralValue: bigint,
  lltv: bigint,
  borrowAssets: bigint
): bigint {
  if (borrowAssets === 0n) return 2n ** 256n - 1n;
  return collateralValue * lltv / borrowAssets;
}`,
    hints: ['LLTV is already WAD-scaled.', 'Borrow assets in the denominator.'],
    testCases: [
      { input: ['200000000000n', '860000000000000000n', '150000000000n'], expected: '1146666666666666666n' }
    ]
  }),
  challenge({
    id: 'calculate-liquidation-price',
    title: 'Calculate Liquidation Price',
    difficulty: 'medium',
    category: 'fundamentals',
    description: `Return the oracle price that would push Health Factor to 1.`,
    starterCode: `const WAD = 10n ** 18n;
const ORACLE_PRICE_SCALE = 10n ** 36n;

function calculateLiquidationPrice(
  collateralAssets: bigint,
  borrowAssets: bigint,
  lltv: bigint
): bigint {
  // TODO
  return 0n;
}`,
    solution: `const WAD = 10n ** 18n;
const ORACLE_PRICE_SCALE = 10n ** 36n;

function calculateLiquidationPrice(
  collateralAssets: bigint,
  borrowAssets: bigint,
  lltv: bigint
): bigint {
  if (collateralAssets === 0n || lltv === 0n) return 0n;
  return borrowAssets * ORACLE_PRICE_SCALE * WAD / (collateralAssets * lltv);
}`,
    hints: ['Set HF = 1 and solve for price.', 'Use both ORACLE_PRICE_SCALE and WAD.'],
    testCases: [
      { input: ['1000000000000000000n', '1700000000n', '865000000000000000n'], expected: '1965317919075144508670520231n' }
    ]
  }),
  challenge({
    id: 'calculate-max-borrow-buffered',
    title: 'Calculate Max Borrow with Safety Buffer',
    difficulty: 'medium',
    category: 'fundamentals',
    description: `Compute maximum borrow from collateral value and LLTV, then apply a frontend safety buffer.`,
    starterCode: `const WAD = 10n ** 18n;

function calculateBufferedMaxBorrow(
  collateralValue: bigint,
  lltv: bigint,
  bufferBps: number
): bigint {
  // TODO
  return 0n;
}`,
    solution: `const WAD = 10n ** 18n;

function calculateBufferedMaxBorrow(
  collateralValue: bigint,
  lltv: bigint,
  bufferBps: number
): bigint {
  const maxBorrow = collateralValue * lltv / WAD;
  const keepBps = 10_000n - BigInt(bufferBps);
  return maxBorrow * keepBps / 10_000n;
}`,
    hints: ['First compute max borrow.', 'A 500 bps buffer means keep 95%.'],
    testCases: [
      { input: ['1000000000n', '865000000000000000n', '500'], expected: '821750000n' }
    ]
  }),
  challenge({
    id: 'to-assets-down',
    title: 'Convert Shares to Assets Down',
    difficulty: 'easy',
    category: 'shares',
    description: `Implement a floor conversion from shares to assets. Use this pattern when rounding down is safer for supplier-facing numbers.`,
    starterCode: `function toAssetsDown(
  shares: bigint,
  totalAssets: bigint,
  totalShares: bigint
): bigint {
  // TODO
  return 0n;
}`,
    solution: `function toAssetsDown(
  shares: bigint,
  totalAssets: bigint,
  totalShares: bigint
): bigint {
  if (totalShares === 0n) return 0n;
  return shares * totalAssets / totalShares;
}`,
    hints: ['This is floor division.', 'Guard zero shares supply.'],
    testCases: [
      { input: ['50n', '1000n', '200n'], expected: '250n' }
    ]
  }),
  challenge({
    id: 'to-assets-up',
    title: 'Convert Shares to Assets Up',
    difficulty: 'medium',
    category: 'shares',
    description: `Implement a ceil conversion from shares to assets. Use this pattern when borrower-facing debt should not be understated.`,
    starterCode: `function toAssetsUp(
  shares: bigint,
  totalAssets: bigint,
  totalShares: bigint
): bigint {
  // TODO
  return 0n;
}`,
    solution: `function toAssetsUp(
  shares: bigint,
  totalAssets: bigint,
  totalShares: bigint
): bigint {
  if (totalShares === 0n) return 0n;
  return (shares * totalAssets + totalShares - 1n) / totalShares;
}`,
    hints: ['Ceil division = (n + d - 1) / d.', 'Do not understate debt.'],
    testCases: [
      { input: ['1n', '10n', '3n'], expected: '4n' }
    ]
  }),
  challenge({
    id: 'summarize-position',
    title: 'Summarize a Borrow Position',
    difficulty: 'medium',
    category: 'dashboard',
    description: `Combine collateral value, LTV, HF, and liquidation price into a UI summary object.`,
    starterCode: `const WAD = 10n ** 18n;
const ORACLE_PRICE_SCALE = 10n ** 36n;

function summarizePosition(
  collateralAssets: bigint,
  oraclePrice: bigint,
  borrowAssets: bigint,
  lltv: bigint
) {
  // TODO
  return {
    collateralValue: 0n,
    healthFactor: 0n,
    currentLtvBps: 0,
    liquidationPrice: 0n
  };
}`,
    solution: `const WAD = 10n ** 18n;
const ORACLE_PRICE_SCALE = 10n ** 36n;

function summarizePosition(
  collateralAssets: bigint,
  oraclePrice: bigint,
  borrowAssets: bigint,
  lltv: bigint
) {
  const collateralValue = collateralAssets * oraclePrice / ORACLE_PRICE_SCALE;
  const healthFactor = borrowAssets === 0n ? 2n ** 256n - 1n : collateralValue * lltv / borrowAssets;
  const currentLtvBps = collateralValue === 0n ? 0 : Number(borrowAssets * 10_000n / collateralValue);
  const liquidationPrice = collateralAssets === 0n ? 0n : borrowAssets * ORACLE_PRICE_SCALE * WAD / (collateralAssets * lltv);

  return {
    collateralValue,
    healthFactor,
    currentLtvBps,
    liquidationPrice
  };
}`,
    hints: ['Reuse the earlier formulas.', 'Return raw bigint values for math-sensitive fields.'],
    testCases: [
      { input: ['200000000n', '1000000000000000000000000000000000000000n', '150000000000n', '860000000000000000n'], expected: '{ collateralValue: 200000000000n }' }
    ]
  }),
  challenge({
    id: 'build-market-id-data',
    title: 'Build Market Cap idData',
    difficulty: 'easy',
    category: 'vault-v2',
    description: `Return the ABI-idData payload shape used for MarketV1AdapterV2 market caps. For this challenge, return a readable tuple-like array.`,
    starterCode: `type Address = \`0x\${string}\`;

interface MarketParams {
  loanToken: Address;
  collateralToken: Address;
  oracle: Address;
  irm: Address;
  lltv: bigint;
}

function buildMarketIdData(adapter: Address, marketParams: MarketParams) {
  // TODO
  return [];
}`,
    solution: `type Address = \`0x\${string}\`;

interface MarketParams {
  loanToken: Address;
  collateralToken: Address;
  oracle: Address;
  irm: Address;
  lltv: bigint;
}

function buildMarketIdData(adapter: Address, marketParams: MarketParams) {
  return ['this/marketParams', adapter, marketParams] as const;
}`,
    hints: ['The docs pattern is abi.encode("this/marketParams", adapterAddress, marketParams).'],
    testCases: [
      { input: ['0xabc', '{...marketParams}'], expected: "['this/marketParams', '0xabc', marketParams]" }
    ]
  }),
  challenge({
    id: 'build-collateral-id-data',
    title: 'Build Collateral Cap idData',
    difficulty: 'easy',
    category: 'vault-v2',
    description: `Return the collateral-token cap idData shape used by Vault V2.`,
    starterCode: `type Address = \`0x\${string}\`;

function buildCollateralIdData(collateralToken: Address) {
  // TODO
  return [];
}`,
    solution: `type Address = \`0x\${string}\`;

function buildCollateralIdData(collateralToken: Address) {
  return ['collateralToken', collateralToken] as const;
}`,
    hints: ['The first element is the literal string "collateralToken".'],
    testCases: [
      { input: ['0xabc'], expected: "['collateralToken', '0xabc']" }
    ]
  }),
  challenge({
    id: 'build-adapter-id-data',
    title: 'Build Adapter idData',
    difficulty: 'easy',
    category: 'vault-v2',
    description: `Return the adapter-level idData shape used for adapter caps in Vault V2.`,
    starterCode: `type Address = \`0x\${string}\`;

function buildAdapterIdData(adapter: Address) {
  // TODO
  return [];
}`,
    solution: `type Address = \`0x\${string}\`;

function buildAdapterIdData(adapter: Address) {
  return ['this', adapter] as const;
}`,
    hints: ['The docs pattern is abi.encode("this", adapterAddress).'],
    testCases: [
      { input: ['0xabc'], expected: "['this', '0xabc']" }
    ]
  }),
  challenge({
    id: 'plan-cap-submissions',
    title: 'Plan Cap Increase Submissions',
    difficulty: 'medium',
    category: 'vault-v2',
    description: `Return the ordered list of cap operations needed to list a new market on a MarketV1AdapterV2.`,
    starterCode: `function planCapSubmissions() {
  // TODO: adapter caps are already assumed configured.
  return [] as string[];
}`,
    solution: `function planCapSubmissions() {
  return [
    'submit increaseAbsoluteCap(collateralIdData, absoluteCollateralCap)',
    'submit increaseRelativeCap(collateralIdData, relativeCollateralCap)',
    'submit increaseAbsoluteCap(marketIdData, absoluteMarketCap)',
    'submit increaseRelativeCap(marketIdData, relativeMarketCap)',
    'after timelock execute the four accepted cap increases'
  ];
}`,
    hints: ['Collateral caps first, then market caps.', 'Each increase is a separate timelocked action.'],
    testCases: [
      { input: [], expected: "includes collateral and market cap submissions" }
    ]
  }),
  challenge({
    id: 'create-permit-request',
    title: 'Create an ERC20 Permit Request',
    difficulty: 'medium',
    category: 'permits',
    description: `Build a typed permit request object for a frontend signing flow. Keep it protocol-agnostic and bigint-safe.`,
    starterCode: `type Address = \`0x\${string}\`;

function createPermitRequest(
  owner: Address,
  spender: Address,
  value: bigint,
  nonce: bigint,
  deadline: bigint
) {
  // TODO
  return {};
}`,
    solution: `type Address = \`0x\${string}\`;

function createPermitRequest(
  owner: Address,
  spender: Address,
  value: bigint,
  nonce: bigint,
  deadline: bigint
) {
  return {
    owner,
    spender,
    value,
    nonce,
    deadline
  };
}`,
    hints: ['The important part is preserving bigint fields and signer intent.'],
    testCases: [
      { input: ['0x1', '0x2', '100n', '0n', '123n'], expected: '{ owner: "0x1", spender: "0x2" }' }
    ]
  }),
  challenge({
    id: 'build-supply-with-permit-flow',
    title: 'Describe a Supply-With-Permit Flow',
    difficulty: 'medium',
    category: 'permits',
    description: `Return an ordered array of frontend steps for a supply flow that uses permit instead of a separate approval transaction.`,
    starterCode: `function buildSupplyWithPermitFlow() {
  // TODO
  return [] as string[];
}`,
    solution: `function buildSupplyWithPermitFlow() {
  return [
    'fetch token nonce and user balance',
    'construct permit payload',
    'ask user to sign permit',
    'submit supply transaction with permit data',
    'refresh position and allowance state',
    'show post-transaction assets and health metrics if relevant'
  ];
}`,
    hints: ['Think in UX steps, not contract internals only.'],
    testCases: [
      { input: [], expected: '6 ordered steps' }
    ]
  }),
  challenge({
    id: 'build-repay-with-permit-flow',
    title: 'Describe a Repay-With-Permit Flow',
    difficulty: 'medium',
    category: 'permits',
    description: `Return the ordered steps for a repay flow that uses permit to avoid a separate ERC20 approve.`,
    starterCode: `function buildRepayWithPermitFlow() {
  // TODO
  return [] as string[];
}`,
    solution: `function buildRepayWithPermitFlow() {
  return [
    'read current debt and token allowance',
    'prepare repay amount in loan-token units',
    'build permit payload for the exact repay amount',
    'have user sign the permit',
    'submit repay transaction with permit data',
    'refresh debt, HF, and remaining borrowing power'
  ];
}`,
    hints: ['Repay flows should refresh HF after success.'],
    testCases: [
      { input: [], expected: '6 ordered steps' }
    ]
  }),
  challenge({
    id: 'build-bundler3-leverage-steps',
    title: 'Build a Bundler3 Leverage Bundle',
    difficulty: 'hard',
    category: 'bundler3',
    description: `Return the ordered high-level actions for a one-click leverage flow: swap into collateral, supply collateral, borrow loan asset, swap borrowed asset back into collateral, then resupply.`,
    starterCode: `function buildLeverageBundle() {
  // TODO
  return [] as string[];
}`,
    solution: `function buildLeverageBundle() {
  return [
    'swap input asset into collateral asset if needed',
    'supply initial collateral',
    'borrow loan asset against collateral',
    'swap borrowed asset into more collateral',
    'supply the swapped collateral',
    'revert everything if any step fails'
  ];
}`,
    hints: ['The last line should make atomicity explicit.', 'Think about dependency order.'],
    testCases: [
      { input: [], expected: 'includes borrow before the second supply and atomic revert note' }
    ]
  }),
  challenge({
    id: 'build-bundler3-deleverage-steps',
    title: 'Build a Bundler3 Deleverage Bundle',
    difficulty: 'hard',
    category: 'bundler3',
    description: `Return the ordered high-level actions for a deleverage / self-repay flow using collateral sale.`,
    starterCode: `function buildDeleverageBundle() {
  // TODO
  return [] as string[];
}`,
    solution: `function buildDeleverageBundle() {
  return [
    'withdraw a controlled amount of collateral',
    'swap withdrawn collateral into loan asset',
    'repay debt with the swapped loan asset',
    'recompute remaining debt and health factor',
    'revert everything if any step fails'
  ];
}`,
    hints: ['This is the inverse intuition of the leverage flow.', 'Atomicity still matters.'],
    testCases: [
      { input: [], expected: 'includes collateral withdraw, swap, repay, atomicity' }
    ]
  }),
  challenge({
    id: 'encode-bundler-call',
    title: 'Encode a Bundler3 Call Shape',
    difficulty: 'medium',
    category: 'bundler3',
    description: `Bundler3 multicall executes an array of calls. For this challenge, return a JS object shape representing one call item.`,
    starterCode: `type Address = \`0x\${string}\`;

function createBundlerCall(target: Address, value: bigint, data: \`0x\${string}\`) {
  // TODO
  return {};
}`,
    solution: `type Address = \`0x\${string}\`;

function createBundlerCall(target: Address, value: bigint, data: \`0x\${string}\`) {
  return { target, value, data };
}`,
    hints: ['Keep it minimal and serializable.'],
    testCases: [
      { input: ['0xabc', '0n', '0x1234'], expected: '{ target: "0xabc", value: 0n, data: "0x1234" }' }
    ]
  }),
  challenge({
    id: 'build-vault-reallocation-plan',
    title: 'Build a Vault Reallocation Plan',
    difficulty: 'hard',
    category: 'vault-v2',
    description: `Given a source adapter market, destination adapter market, and asset amount, return the ordered vault actions for a simple reallocation.`,
    starterCode: `function buildReallocationPlan(
  fromAdapter: string,
  fromData: string,
  toAdapter: string,
  toData: string,
  assets: bigint
) {
  // TODO
  return [] as string[];
}`,
    solution: `function buildReallocationPlan(
  fromAdapter: string,
  fromData: string,
  toAdapter: string,
  toData: string,
  assets: bigint
) {
  return [
    \`deallocate \${assets} from \${fromAdapter} using \${fromData}\`,
    \`allocate \${assets} to \${toAdapter} using \${toData}\`,
    'verify resulting allocations and idle assets',
    'surface failure if either leg exceeds current caps or available liquidity'
  ];
}`,
    hints: ['Deallocate first, then allocate.', 'Mention validation.'],
    testCases: [
      { input: ['adapterA', 'dataA', 'adapterB', 'dataB', '100n'], expected: 'ordered reallocation steps' }
    ]
  }),
  challenge({
    id: 'force-deallocate-explainer',
    title: 'Explain forceDeallocate in Product Language',
    difficulty: 'medium',
    category: 'vault-v2',
    description: `Return a short user-facing explanation of what forceDeallocate does and why a vault might set its penalty to zero on a liquidity adapter.`,
    starterCode: `function explainForceDeallocate() {
  // TODO
  return '';
}`,
    solution: `function explainForceDeallocate() {
  return 'forceDeallocate permissionlessly moves available adapter liquidity back to idle so withdrawals can proceed; some vaults set the penalty to zero on a liquidity adapter to keep exits from getting stuck, while accepting a griefing trade-off.';
}`,
    hints: ['Mention idle assets and griefing trade-off.'],
    testCases: [
      { input: [], expected: 'mentions permissionless movement to idle and trade-off' }
    ]
  }),
  challenge({
    id: 'query-vault-list-graphql',
    title: 'Write a Vault List GraphQL Query',
    difficulty: 'easy',
    category: 'graphql',
    description: `Return the official Morpho API query string used to list Vault V2s on Ethereum and Base.`,
    starterCode: `function getVaultListQuery() {
  // TODO
  return '';
}`,
    solution: `function getVaultListQuery() {
  return \`query {
  vaultV2s(first: 1000, where: { chainId_in: [1, 8453] }) {
    items {
      address
      symbol
      name
      listed
      asset { id address decimals }
      chain { id network }
    }
  }
}\`;
}`,
    hints: ['Use vaultV2s with chainId_in [1, 8453].'],
    testCases: [
      { input: [], expected: 'contains vaultV2s and chainId_in: [1, 8453]' }
    ]
  }),
  challenge({
    id: 'query-vault-rewards-graphql',
    title: 'Write a Vault Rewards GraphQL Query',
    difficulty: 'easy',
    category: 'graphql',
    description: `Return the query string for fetching Vault V2 rewards by address and chain.`,
    starterCode: `function getVaultRewardsQuery() {
  // TODO
  return '';
}`,
    solution: `function getVaultRewardsQuery() {
  return \`query VaultV2Rewards($address: String!, $chainId: Int!) {
  vaultV2ByAddress(address: $address, chainId: $chainId) {
    address
    rewards {
      supplyApr
      asset {
        address
        symbol
        priceUsd
      }
    }
  }
}\`;
}`,
    hints: ['The root is vaultV2ByAddress.', 'Rewards contain supplyApr and reward asset metadata.'],
    testCases: [
      { input: [], expected: 'contains query VaultV2Rewards' }
    ]
  }),
  challenge({
    id: 'combine-native-and-reward-yield',
    title: 'Combine Native APY and Reward APR',
    difficulty: 'medium',
    category: 'merkl-rewards',
    description: `Given a native APY and an array of reward APR values, compute a naive displayed total yield for a dashboard while still preserving the breakdown.`,
    starterCode: `function combineYield(nativeApy: number, rewardAprs: number[]) {
  // TODO
  return {
    nativeApy,
    totalRewardApr: 0,
    displayTotal: 0
  };
}`,
    solution: `function combineYield(nativeApy: number, rewardAprs: number[]) {
  const totalRewardApr = rewardAprs.reduce((sum, apr) => sum + apr, 0);
  return {
    nativeApy,
    totalRewardApr,
    displayTotal: nativeApy + totalRewardApr
  };
}`,
    hints: ['Do not hide the breakdown.', 'This is a display helper, not a compounding engine.'],
    testCases: [
      { input: ['0.052', '[0.01, 0.025]'], expected: '{ totalRewardApr: 0.035, displayTotal: 0.087 }' }
    ]
  }),
  challenge({
    id: 'normalize-reward-token',
    title: 'Normalize Reward Token Amounts',
    difficulty: 'medium',
    category: 'merkl-rewards',
    description: `Convert a raw bigint token amount into a human-readable decimal string using token decimals.`,
    starterCode: `function formatTokenAmount(raw: bigint, decimals: number): string {
  // TODO
  return '';
}`,
    solution: `function formatTokenAmount(raw: bigint, decimals: number): string {
  const scale = 10n ** BigInt(decimals);
  const whole = raw / scale;
  const fraction = raw % scale;
  const trimmed = fraction.toString().padStart(decimals, '0').replace(/0+$/, '');
  return trimmed ? \`\${whole}.\${trimmed}\` : whole.toString();
}`,
    hints: ['Keep bigint until the formatting boundary.', 'Trim trailing zeros.'],
    testCases: [
      { input: ['1234500n', '6'], expected: '"1.2345"' }
    ]
  }),
  challenge({
    id: 'merge-dashboard-data-safely',
    title: 'Merge Morpho and Merkl Data Safely',
    difficulty: 'hard',
    category: 'dashboard',
    description: `Combine vault state and rewards state into a dashboard row. If rewards fail, still return the vault row with an error flag instead of throwing.`,
    starterCode: `interface VaultRowInput {
  address: string;
  symbol: string;
  avgApy: number;
}

interface RewardsState {
  rewardAprs: number[];
}

function buildVaultRow(
  vault: VaultRowInput,
  rewards: RewardsState | null,
  rewardsError: string | null
) {
  // TODO
  return null;
}`,
    solution: `interface VaultRowInput {
  address: string;
  symbol: string;
  avgApy: number;
}

interface RewardsState {
  rewardAprs: number[];
}

function buildVaultRow(
  vault: VaultRowInput,
  rewards: RewardsState | null,
  rewardsError: string | null
) {
  const totalRewardApr = rewards ? rewards.rewardAprs.reduce((sum, apr) => sum + apr, 0) : 0;

  return {
    address: vault.address,
    symbol: vault.symbol,
    nativeApy: vault.avgApy,
    totalRewardApr,
    displayTotalYield: vault.avgApy + totalRewardApr,
    rewardsAvailable: !rewardsError,
    rewardsError
  };
}`,
    hints: ['Graceful degradation > throwing.', 'Keep rewards optional.'],
    testCases: [
      { input: ['vault', 'null', '"merkl timeout"'], expected: 'returns row with rewardsAvailable false' }
    ]
  }),
  challenge({
    id: 'build-claim-simulation-summary',
    title: 'Build a Claim Simulation Summary',
    difficulty: 'medium',
    category: 'merkl-rewards',
    description: `Given a list of claimable rewards, build a concise UI summary with token count and estimated USD value.`,
    starterCode: `interface ClaimableReward {
  symbol: string;
  amountUsd: number;
}

function summarizeClaimSimulation(rewards: ClaimableReward[]) {
  // TODO
  return {
    tokenCount: 0,
    totalUsd: 0,
    label: ''
  };
}`,
    solution: `interface ClaimableReward {
  symbol: string;
  amountUsd: number;
}

function summarizeClaimSimulation(rewards: ClaimableReward[]) {
  const tokenCount = rewards.length;
  const totalUsd = rewards.reduce((sum, reward) => sum + reward.amountUsd, 0);

  return {
    tokenCount,
    totalUsd,
    label: tokenCount === 0
      ? 'No claimable rewards'
      : \`Claim \${tokenCount} reward token(s) worth about $\${totalUsd.toFixed(2)}\`
  };
}`,
    hints: ['Think about the UX string as well as the math.'],
    testCases: [
      { input: ['[{symbol:"MORPHO",amountUsd:12.5},{symbol:"USDC",amountUsd:3}]'], expected: 'tokenCount 2, totalUsd 15.5' }
    ]
  }),
  challenge({
    id: 'prioritize-risk-alerts',
    title: 'Prioritize Risk Alerts',
    difficulty: 'medium',
    category: 'dashboard',
    description: `Classify positions into healthy, warning, danger, and liquidatable buckets based on Health Factor.`,
    starterCode: `function classifyRisk(healthFactor: number): 'healthy' | 'warning' | 'danger' | 'liquidatable' {
  // TODO
  return 'healthy';
}`,
    solution: `function classifyRisk(healthFactor: number): 'healthy' | 'warning' | 'danger' | 'liquidatable' {
  if (healthFactor <= 1) return 'liquidatable';
  if (healthFactor <= 1.05) return 'danger';
  if (healthFactor <= 1.15) return 'warning';
  return 'healthy';
}`,
    hints: ['These thresholds are product thresholds, not protocol constants.', 'Liquidatable should be the lowest bucket.'],
    testCases: [
      { input: ['1.2'], expected: '"healthy"' },
      { input: ['1.03'], expected: '"danger"' }
    ]
  }),
  challenge({
    id: 'triage-support-incident',
    title: 'Triage a Partner Incident',
    difficulty: 'medium',
    category: 'partner-support',
    description: `Return a structured escalation object from raw incident inputs. This mirrors real partner support work.`,
    starterCode: `function buildIncidentEscalation(
  chainId: number,
  targetAddress: string,
  symptom: string,
  expected: string,
  actual: string
) {
  // TODO
  return {};
}`,
    solution: `function buildIncidentEscalation(
  chainId: number,
  targetAddress: string,
  symptom: string,
  expected: string,
  actual: string
) {
  return {
    chainId,
    targetAddress,
    symptom,
    expected,
    actual,
    needsRepro: true,
    severity: 'pending-triage'
  };
}`,
    hints: ['Good support data is structured and reproducible.'],
    testCases: [
      { input: ['8453', '0xabc', '"withdraw reverted"', '"withdraw succeeds"', '"revert: insufficient liquidity"'], expected: 'structured object with severity' }
    ]
  }),
  challenge({
    id: 'design-doc-feedback-note',
    title: 'Write a Docs Feedback Note',
    difficulty: 'easy',
    category: 'partner-support',
    description: `Return a concise documentation feedback note from a POC friction point. This challenge trains the "close the loop" habit.`,
    starterCode: `function makeDocsFeedback(page: string, friction: string, fix: string): string {
  // TODO
  return '';
}`,
    solution: `function makeDocsFeedback(page: string, friction: string, fix: string): string {
  return \`Page: \${page}. Friction: \${friction}. Suggested improvement: \${fix}.\`;
}`,
    hints: ['Be concrete, not emotional.', 'Page + friction + fix is enough.'],
    testCases: [
      { input: ['"/tools/offchain/api/get-started/"', '"missing rewards example"', '"add a vault rewards query snippet"'], expected: 'single concise sentence' }
    ]
  })
];

const CODE_CHALLENGES = [...CORE_CODE_CHALLENGES, ...COMPLEMENTARY_CODE_CHALLENGES];

module.exports = { CODE_CHALLENGES };
