const EXACT_REWRITES = new Map([
  [
    'The liquidation loan-to-value threshold that defines maximum borrowing power before liquidation eligibility.',
    'The borrow threshold before liquidation.'
  ],
  [
    'Each market has its own risk surface, so failures stay contained instead of contaminating a shared pool.',
    'Each market has its own risk, so failures stay contained.'
  ],
  [
    'Because live prices, accrued debt, and onchain timing can differ from a rough UI snapshot.',
    'Because live price, debt, and timing can differ from a UI snapshot.'
  ],
  [
    'The position can enter bad debt territory because collateral can be fully seized while debt remains.',
    'Bad debt can remain after all collateral is seized.'
  ],
  [
    'It lets the asset have dedicated oracle, LLTV, and IRM choices instead of competing inside a shared pool design.',
    'It gives the asset its own oracle, LLTV, and IRM choices.'
  ],
  [
    'By marking total assets down when adapter realAssets() falls and letting share price depreciate for all depositors proportionally.',
    'By marking assets down and letting share price fall proportionally.'
  ],
  [
    'When a MarketV1AdapterV2 is the liquidity adapter, it points to one underlying market at a time via liquidityData.',
    'It points to one underlying market at a time.'
  ],
  [
    'The high-utilization borrow APY level above the 90% target slope',
    'The borrow APY level above target utilization'
  ],
  [
    'Because any small oracle move, accrued debt, or rounding effect can immediately make the position liquidatable.',
    'Because small price, debt, and rounding changes can trigger liquidation.'
  ],
  [
    'Share-to-asset rounding can leave a tiny residual allocation, which is expected and not necessarily a protocol bug.',
    'Share rounding can leave tiny residual dust, which is expected.'
  ],
  [
    'Cache responses, keep queries narrow, split heavy reads, and avoid hard dependency for critical paths.',
    'Cache it, keep queries narrow, and avoid API critical-path dependency.'
  ],
  [
    'Atomic multi-step workflows where partial completion would be dangerous or poor UX',
    'Atomic multi-step flows where partial completion would be risky.'
  ],
  [
    'Use GraphQL for indexed reads, but calculate critical risk with onchain-aware logic and build degraded-mode handling if API data is stale.',
    'Use GraphQL for reads, but compute critical risk with onchain-aware logic.'
  ],
  [
    'Legacy rewards.morpho.org is deprecated and new reward programs are distributed via Merkl.',
    'Legacy rewards.morpho.org is deprecated; rewards now use Merkl.'
  ],
  [
    'It retrieves rewards data from the Merkl API and exposes a pre-aggregated rewards field.',
    'It pulls Merkl rewards and exposes them in a pre-aggregated field.'
  ],
  [
    'Because token amounts, shares, and prices can lose correctness if converted to JS floats too early.',
    'Because early float conversion can break token, share, and price math.'
  ],
  [
    'A dashboard that joins Morpho vault discovery and APY data with Merkl reward APR and claim context.',
    'A dashboard combining vault APY, reward APR, and claim context.'
  ],
  [
    'Acknowledge Aave’s strengths, then explain Morpho’s better fit for isolated custom markets or curation-heavy managed products.',
    'Acknowledge Aave, then explain Morpho’s fit for isolated markets and curated products.'
  ],
  [
    'Acknowledge the impact, clarify scope and risk, then provide the next update path and workaround if one exists.',
    'Acknowledge the impact, clarify scope, and give next steps or a workaround.'
  ],
  [
    'Are you integrating borrow, earn, or both, and what exact user workflow are you trying to support?',
    'Are you integrating borrow, earn, or both, and for which user flow?'
  ],
  [
    'A safety buffer or credit-score-like ratio where higher is safer and 1 is the danger line.',
    'A safety-buffer ratio where higher is safer and 1 is the danger line.'
  ],
  [
    'chain, address, repro steps, expected vs actual result, and impact',
    'chain, address, repro, expected vs actual, and impact'
  ],
  [
    'A health dashboard showing current LTV, HF, liquidation price, and alerts by market',
    'A health dashboard with LTV, HF, liquidation price, and alerts'
  ],
  [
    'Liquidity fragmentation across isolated markets by reallocating assets toward target borrow demand within vault constraints',
    'Liquidity fragmentation across isolated markets via constrained reallocations'
  ],
  [
    'It turns rewards from a passive metric into an actionable user workflow the partner can evaluate.',
    'It makes rewards an actionable workflow the partner can evaluate.'
  ],
  [
    'State the concept you know for sure, then say you would verify the exact chain-specific value on the official Addresses page.',
    'State what you know, then verify the exact chain-specific value on the Addresses page.'
  ],
  [
    '"Given your use case, I would start with GraphQL for discovery, onchain execution for settlement, and a cache-backed dashboard for rewards and HF."',
    '"I would use GraphQL for discovery, onchain execution, and a cached rewards/HF dashboard."'
  ],
  [
    'Focus on weak formulas, weak explanations, and high-value partner scenarios rather than rereading everything equally.',
    'Focus on weak formulas, weak explanations, and high-value partner scenarios.'
  ],
  [
    'Partner confusion and POC friction should be translated into concrete documentation improvements and better internal examples.',
    'Turn partner confusion and POC friction into better docs and examples.'
  ],
  [
    'Market creation is permissionless, but market creators still use governance-approved IRMs and oracles.',
    'Market creation is permissionless, but approved IRMs and oracles still matter.'
  ],
  [
    'Partners can diligence a stable rule set that will not be admin-upgraded underneath them.',
    'Partners can diligence a rule set that will not be admin-upgraded underneath them.'
  ],
  [
    'Because liquidations are performed by external permissionless actors and depend on economic incentives, not protocol-operated guarantees.',
    'Because liquidations depend on outside actors and incentives, not protocol guarantees.'
  ],
  [
    'Because that price both determines liquidatability and the exchange rate used for collateral seizure.',
    'Because it sets both liquidatability and collateral seizure pricing.'
  ],
  [
    'Borrow debt accrues interest over time, so Health Factor can fall even when collateral price is stable.',
    'Debt accrues interest, so Health Factor can fall even if price stays flat.'
  ]
]);

function compactOptionText(text) {
  if (!text) return text;
  if (EXACT_REWRITES.has(text)) {
    return EXACT_REWRITES.get(text);
  }

  let next = text
    .replace(/, which is expected and not necessarily a protocol bug\./i, ', which is expected.')
    .replace(/ instead of competing inside a shared pool design\./i, '.')
    .replace(/ for all depositors proportionally\./i, ' proportionally.')
    .replace(/ above the 90% target slope/i, ' above target utilization')
    .replace(/ and avoid hard dependency for critical paths\./i, '.')
    .replace(/ and what exact user workflow are you trying to support\?/i, ' and for which user flow?')
    .replace(/ that defines maximum borrowing power before liquidation eligibility\./i, ' before liquidation.')
    .replace(/ and depend on economic incentives, not protocol-operated guarantees\./i, ' through outside incentives, not guarantees.')
    .replace(/ can immediately make the position liquidatable\./i, ' can trigger liquidation.')
    .replace(/ rather than rereading everything equally\./i, '.')
    .replace(/ concrete documentation improvements and better internal examples\./i, ' better docs and examples.')
    .replace(/\s{2,}/g, ' ')
    .trim();

  const commaCount = (next.match(/, /g) || []).length;
  if (next.length > 78 && commaCount === 1) {
    next = `${next.split(', ')[0]}.`;
  }

  if (next.length > 72 && next.includes(' because ')) {
    next = next.replace(' because ', ': ');
  }

  const andCount = (next.match(/\sand\s/g) || []).length;
  if (next.length > 72 && andCount === 1 && next.includes(' and ')) {
    const parts = next.split(' and ');
    if (parts.length > 1) {
      next = `${parts[0]} and ${parts[1]}`.replace(/\.$/, '');
      if (!/[.?!]$/.test(next)) {
        next += '.';
      }
    }
  }

  return next.trim();
}

function canExpandDistractor(text) {
  return Boolean(
    text &&
    /\s/.test(text) &&
    !/^0x[a-fA-F0-9]{40}$/.test(text) &&
    !/^\d+(\.\d+)?%?$/.test(text) &&
    !/^[\d.eEnN+\-*/ ()×]+$/.test(text)
  );
}

function expandDistractorText(text, currentLength, targetLength) {
  if (!canExpandDistractor(text) || currentLength >= targetLength) {
    return text;
  }

  const suffixes = [
    ' in this setup',
    ' on this design',
    ' in this model',
    ' in practice'
  ];

  let next = text.replace(/[.?!]$/, '');
  let suffixIndex = 0;

  while (next.length < targetLength && suffixIndex < suffixes.length) {
    next += suffixes[suffixIndex];
    suffixIndex += 1;
  }

  if (!/[.?!]$/.test(next)) {
    next += '.';
  }

  return next;
}

function rebalanceOptionLengths(question) {
  const options = [...(question.options || [])];

  for (let pass = 0; pass < 4; pass += 1) {
    const lengths = options.map((option) => option.length);
    const sorted = [...lengths].sort((a, b) => b - a);
    const longest = sorted[0] || 0;
    const secondLongest = sorted[1] || 0;

    if (longest <= 72 && longest - secondLongest < 12) {
      break;
    }

    const longestIndex = lengths.indexOf(longest);
    const compacted = compactOptionText(options[longestIndex]);

    if (compacted === options[longestIndex]) {
      break;
    }

    options[longestIndex] = compacted;
  }

  const lengths = options.map((option) => option.length);
  const correctIndex = Number.isInteger(question.correct) ? question.correct : -1;
  const correctLength = correctIndex >= 0 ? lengths[correctIndex] : 0;
  const maxLength = Math.max(...lengths, 0);

  if (correctIndex >= 0 && correctLength === maxLength) {
    const targetLength = Math.max(correctLength - 6, 36);

    options.forEach((option, index) => {
      if (index === correctIndex) return;
      if (option.length >= targetLength) return;
      options[index] = expandDistractorText(option, option.length, targetLength);
    });
  }

  return {
    ...question,
    options
  };
}

module.exports = {
  compactOptionText,
  rebalanceOptionLengths
};
