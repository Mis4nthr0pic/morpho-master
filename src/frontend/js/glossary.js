/**
 * Shared glossary renderer for protocol terms.
 */

(function () {
  const GLOSSARY_ENTRIES = [
    { term: 'APY', aliases: ['APY', 'annual percentage yield'], definition: 'Annual Percentage Yield. The yearly return after compounding is taken into account.' },
    { term: 'APR', aliases: ['APR', 'annual percentage rate'], definition: 'Annual Percentage Rate. A yearly rate that usually does not assume compounding.' },
    { term: 'LLTV', aliases: ['LLTV', 'liquidation loan-to-value', 'liquidation loan to value'], definition: 'Liquidation Loan-To-Value. The maximum debt-to-collateral ratio allowed before a position becomes liquidatable.' },
    { term: 'LTV', aliases: ['LTV', 'loan-to-value', 'loan to value'], definition: 'Loan-To-Value. The ratio between borrowed value and collateral value.' },
    { term: 'HF', aliases: ['HF', 'health factor', 'health ratio'], definition: 'Health Factor. A measure of position safety. Around 1 or below means liquidation risk is near or active.' },
    { term: 'LIF', aliases: ['LIF', 'liquidation incentive factor'], definition: 'Liquidation Incentive Factor. A parameter that determines how much extra collateral a liquidator can receive for repaying debt.' },
    { term: 'IRM', aliases: ['IRM', 'interest rate model', 'adaptivecurveirm'], definition: 'Interest Rate Model. The onchain logic that determines borrow and supply rates based on market conditions such as utilization.' },
    { term: 'AdaptiveCurveIRM', aliases: ['AdaptiveCurveIRM'], definition: 'Morpho’s current standard immutable interest rate model that adapts rates over time around a target utilization.' },
    { term: 'TVL', aliases: ['TVL', 'total value locked'], definition: 'Total Value Locked. The total value of assets deposited in a protocol, vault, or market.' },
    { term: 'WAD', aliases: ['WAD'], definition: 'A fixed-point precision scale of 1e18 commonly used in Solidity math.' },
    { term: '1e36 oracle scaling', aliases: ['1e36', '10^36', 'oracle scaling'], definition: 'Morpho oracle pricing is typically scaled to 1e36 so prices can be combined safely across tokens with different decimals.' },
    { term: 'ERC4626', aliases: ['ERC4626', 'ERC-4626'], definition: 'A tokenized vault standard where users deposit assets and receive shares representing ownership in the vault.' },
    { term: 'Vault share', aliases: ['shares', 'vault shares', 'share price'], definition: 'A unit representing ownership in a vault. Share value can rise or fall relative to the underlying assets.' },
    { term: 'Curator', aliases: ['curator', 'curators'], definition: 'A party that defines and manages a vault’s risk and allocation strategy.' },
    { term: 'Allocator', aliases: ['allocator', 'allocators'], definition: 'A role allowed to move liquidity according to the strategy and limits set for a vault.' },
    { term: 'Sentinel', aliases: ['sentinel', 'sentinels'], definition: 'An emergency oversight role in Vault V2 that can intervene in limited protective ways.' },
    { term: 'Owner', aliases: ['owner', 'owners'], definition: 'The role responsible for top-level vault governance and administrative controls.' },
    { term: 'Oracle', aliases: ['oracle', 'oracles'], definition: 'The pricing source a market uses to value collateral against debt.' },
    { term: 'Bundler3', aliases: ['Bundler3', 'bundler'], definition: 'Morpho’s advanced bundling contract system for executing multi-step flows atomically in one transaction.' },
    { term: 'Merkl', aliases: ['Merkl', 'merkl'], definition: 'A rewards distribution system commonly used to surface and claim incentive programs tied to Morpho positions.' },
    { term: 'Public Allocator', aliases: ['Public Allocator', 'public allocator'], definition: 'A Morpho component that can help reallocate liquidity across enabled markets to reduce fragmentation and improve borrow execution.' },
    { term: 'Market ID', aliases: ['market id', 'market ids'], definition: 'A unique identifier derived from a market’s immutable parameters.' },
    { term: 'Market parameters', aliases: ['market parameters'], definition: 'The fixed configuration that defines a Morpho market, such as the loan asset, collateral asset, oracle, IRM, and LLTV.' },
    { term: 'MarketParams', aliases: ['MarketParams', 'market params'], definition: 'The code-level object used to represent the immutable parameter set of a Morpho market.' },
    { term: 'Permissionless', aliases: ['permissionless'], definition: 'Anyone can use or deploy the component without needing protocol-level approval.' },
    { term: 'Immutable', aliases: ['immutable'], definition: 'The core contract logic or market configuration cannot be changed after deployment.' },
    { term: 'Atomic', aliases: ['atomic', 'atomic flow', 'atomic execution'], definition: 'A multi-step transaction pattern where either every step succeeds together or the full transaction reverts.' },
    { term: 'Utilization', aliases: ['utilization', 'utilisation'], definition: 'The share of supplied liquidity that is currently borrowed.' },
    { term: 'Collateral', aliases: ['collateral'], definition: 'Assets posted to secure a borrowing position.' },
    { term: 'Bad debt', aliases: ['bad debt'], definition: 'Debt that remains after collateral is insufficient to fully cover what was borrowed.' },
    { term: 'Liquidation', aliases: ['liquidation', 'liquidations', 'liquidatable'], definition: 'The process where an unhealthy borrowing position can be partially or fully unwound by repaying debt against collateral.' },
    { term: 'POC', aliases: ['POC', 'proof of concept'], definition: 'A lightweight implementation used to prove that an integration or product pattern works.' },
    { term: 'SDK', aliases: ['SDK', 'software development kit'], definition: 'A package of code helpers and abstractions used to integrate with a protocol more quickly.' },
    { term: 'API', aliases: ['API', 'application programming interface', 'GraphQL', 'REST'], definition: 'An interface used by applications to query data or trigger actions programmatically.' },
    { term: 'Noncustodial', aliases: ['noncustodial', 'non-custodial'], definition: 'Users keep direct control over assets instead of giving custody to an intermediary.' }
  ];

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function includesAlias(text, alias) {
    const source = text.toLowerCase();
    const token = alias.toLowerCase();

    if (/^[a-z0-9-]+$/i.test(token) && token.length <= 8) {
      const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`\\b${escaped}\\b`, 'i').test(text);
    }

    return source.includes(token);
  }

  function getGlossaryEntries(texts) {
    const sourceText = texts.filter(Boolean).join(' ');
    if (!sourceText.trim()) return [];

    return GLOSSARY_ENTRIES.filter((entry) =>
      entry.aliases.some((alias) => includesAlias(sourceText, alias))
    );
  }

  function renderGlossaryHtmlFromTexts(texts) {
    const entries = getGlossaryEntries(texts).slice(0, 10);
    return renderGlossaryHtmlFromEntries(entries);
  }

  function renderGlossaryHtmlFromEntries(entries) {
    if (!entries.length) return '';

    return `
      <section class="glossary-box auto-glossary">
        <h4>Glossary</h4>
        <dl class="glossary-list">
          ${entries.map((entry) => `
            <div class="glossary-item">
              <dt>${escapeHtml(entry.term)}</dt>
              <dd>${escapeHtml(entry.definition)}</dd>
            </div>
          `).join('')}
        </dl>
      </section>
    `;
  }

  window.renderGlossaryHtmlFromTexts = renderGlossaryHtmlFromTexts;
  window.renderGlossaryHtmlFromEntries = renderGlossaryHtmlFromEntries;
  window.getGlossaryEntries = getGlossaryEntries;
})();
