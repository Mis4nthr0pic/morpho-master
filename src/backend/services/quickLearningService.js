const { CURRICULUM_MODULES } = require('../../content/curriculum-data');
const { QUIZ_QUESTIONS } = require('../../content/quiz-questions');

function sanitizeText(text = '') {
  return String(text)
    .replace(/`/g, '')
    .replace(/\*\*/g, '')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function isLowSignalFragment(text = '') {
  const clean = sanitizeText(text);
  const lower = clean.toLowerCase();
  if (!clean) return true;
  if (clean.length <= 2) return true;
  if (/^(the|a|an|and|or|but|if|then|always|never|usually|generally|most|many|some|this|that|these|those)$/i.test(clean)) return true;
  if (/^(explain|describe|discuss|show|define|compare|review|understand|remember|know|think|note|consider)$/i.test(clean)) return true;
  if (/^(important|correct|precise|accurate|safe|safer|strongest|best|good|better)$/i.test(clean)) return true;
  if (/^[a-z]+ing$/i.test(clean) && clean.length <= 10) return true;
  return false;
}

function isLowSignalPrompt(text = '') {
  const clean = sanitizeText(text);
  if (!clean) return true;
  if (clean.length < 18) return true;
  if (/type the key morpho term/i.test(clean)) return true;
  return false;
}

function hasSufficientSpecificity(text = '') {
  const clean = sanitizeText(text);
  if (!clean || clean.length < 12) return false;
  if (isLowSignalFragment(clean)) return false;
  return true;
}

function normalizeAnswer(text = '') {
  return sanitizeText(text)
    .toLowerCase()
    .replace(/[^a-z0-9.%/+\-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitLessonBullets(lesson) {
  const source = lesson.whatYouMustKnow || lesson.mustMemorize || [];
  return source
    .map((item) => sanitizeText(item).replace(/^-\s*/, ''))
    .filter(Boolean);
}

function splitFormulaLines(lesson) {
  return String(lesson.formulas || '')
    .split(/\n+/)
    .map((line) => sanitizeText(line))
    .filter((line) => line && (line.includes('=') || /hf|lltv|ltv|price|utilization|apy|apr|shares|assets|liquidation/i.test(line)));
}

function buildFormulaPrompt(lessonTitle, formulaLine) {
  if (/health factor|hf/i.test(formulaLine)) return `Health Factor formula: which line matches the Health Factor concept from "${lessonTitle}"?`;
  if (/lltv|ltv/i.test(formulaLine)) return `Leverage limit formula: which line best matches the LLTV/LTV concept from "${lessonTitle}"?`;
  if (/utilization|apy|apr|irm/i.test(formulaLine)) return `Rate model formula: which line belongs to "${lessonTitle}"?`;
  if (/shares|assets/i.test(formulaLine)) return `Shares vs assets formula: which conversion line belongs to "${lessonTitle}"?`;
  if (/price|oracle/i.test(formulaLine)) return `Oracle pricing formula: which line belongs to "${lessonTitle}"?`;
  return `Formula recall: which formula line is part of "${lessonTitle}"?`;
}

function buildDrillPrompt(lessonTitle, drill) {
  const clean = sanitizeText(drill);
  if (/product manager|pm/i.test(clean)) return `PM explanation drill: which partner-facing explanation prompt should you be ready to answer after "${lessonTitle}"?`;
  if (/partner asks|partner says|integrator/i.test(clean)) return `Partner objection drill: which explanation prompt should you be ready to answer after "${lessonTitle}"?`;
  if (/dashboard|hf|health factor|liquidation/i.test(clean)) return `Risk-debugging drill: which explanation prompt belongs to "${lessonTitle}"?`;
  if (/frontend|ui|ux/i.test(clean)) return `Frontend reasoning drill: which explanation prompt belongs to "${lessonTitle}"?`;
  return `Partner communication drill: which explanation prompt should you be ready to answer after "${lessonTitle}"?`;
}

function buildPromptLead(label, lessonTitle) {
  return `${label} from "${lessonTitle}":`;
}

function truncateFocusLabel(text, max = 48) {
  const clean = sanitizeText(text).replace(/[.?!:]$/, '');
  if (!clean) return '';
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}

function buildBulletFocusLabel(bullet) {
  const clean = sanitizeText(bullet).replace(/\.$/, '');
  const lower = clean.toLowerCase();

  // ── Addresses ────────────────────────────────────────────────────
  if (/0x[a-fA-F0-9]{26,}/.test(clean)) {
    if (/ethereum bundler3|bundler3.*ethereum/i.test(lower)) return 'Ethereum Bundler3 address';
    if (/base bundler3|bundler3.*base/i.test(lower)) return 'Base Bundler3 address';
    if (/bundler3/i.test(lower)) return 'Bundler3 address';
    return 'Blue contract address';
  }

  // ── URLs ─────────────────────────────────────────────────────────
  if (/https?:\/\//i.test(clean)) {
    if (/graphql/i.test(lower)) return 'GraphQL API endpoint';
    return 'API endpoint';
  }

  // ── Market definition ────────────────────────────────────────────
  if (/five market parameters/i.test(lower)) return 'Five market parameters';
  if (/loan token.*collateral token.*oracle|market is one collateral/i.test(lower)) return 'Market = token pair + oracle + IRM';
  if (/integration pitch.*custom risk.*faster listing/i.test(lower)) return 'Integration pitch';
  if (/isolated markets.*contain.*failures/i.test(lower)) return 'Isolation = failure containment';
  if (/permissionless creation.*governance-approved/i.test(lower)) return 'Permissionless but gov-gated IRMs';
  if (/clean business benefit.*custom market/i.test(lower)) return 'Business pitch: custom markets';
  if (/verify factories.*registries.*addresses/i.test(lower)) return 'Always verify addresses before shipping';
  if (/marketparams.*canonical identity/i.test(lower)) return 'MarketParams = market identity';
  if (/market v1.*blue.*isolated.*immutable.*permissionless/i.test(lower)) return 'Morpho Blue: isolated markets';

  // ── Health factor ────────────────────────────────────────────────
  if (/collateral value.*lltv.*borrow assets|health factor.*max borrow.*borrowed/i.test(lower)) return 'Health factor formula';
  if (/hf > 1.*healthy|hf.*<=.*liquidatable/i.test(lower)) return 'HF liquidation threshold';
  if (/explain hf as a safety buffer/i.test(lower)) return 'HF: safety buffer framing';
  if (/health factor.*max borrow divided/i.test(lower)) return 'Health factor definition';
  if (/liquidation price.*hf.*1|price that makes hf exactly 1/i.test(lower)) return 'Liquidation price = HF 1';
  if (/collateral value.*=.*collateral.*oracle.*1e36/i.test(lower)) return 'Collateral value formula';

  // ── Oracle ───────────────────────────────────────────────────────
  if (/morpho oracle price.*scaled.*1e36|oracle.*scaled.*1e36/i.test(lower)) return 'Oracle price: 1e36 scaling';
  if (/quote.*collateral priced.*loan token|collateral priced in units/i.test(lower)) return 'Oracle quote: not auto-USD';
  if (/morphochainlinkoraclev2.*direct.*inverse.*multi-hop/i.test(lower)) return 'Oracle: 4 path types';
  if (/dashboard bugs.*decimal|decimal normalization.*hf/i.test(lower)) return 'HF bugs from decimal errors';
  if (/oracle.*1e36.*lltv.*wad|oracle scaling.*1e36/i.test(lower)) return 'Oracle 1e36 + LLTV WAD';
  if (/oracle = 0.*pipeline failure/i.test(lower)) return 'Oracle = 0: pipeline failure';
  if (/collateral value uses 1e36/i.test(lower)) return 'Collateral value: 1e36 scaling';

  // ── Liquidation & LIF ────────────────────────────────────────────
  if (/lif.*=.*min\(|lif\s*=\s*min/i.test(lower)) return 'LIF formula';
  if (/lif.*86%|86%.*lif.*1\.05/i.test(lower)) return 'LIF at 86% LLTV ≈ 1.05';
  if (/no protocol liquidation fee/i.test(lower)) return 'No protocol liquidation fee';
  if (/bad debt starts once|bad debt emerges/i.test(lower)) return 'Bad debt onset condition';
  if (/lif shrinks as lltv rises/i.test(lower)) return 'LIF shrinks as LLTV rises';
  if (/pre-liquidation.*opt-in/i.test(lower)) return 'Pre-liquidation: opt-in';
  if (/standard liquidation.*permissionless/i.test(lower)) return 'Liquidation: permissionless';
  if (/lltv.*wad-scaled|lltv is wad/i.test(lower)) return 'LLTV in WAD format';

  // ── IRM ──────────────────────────────────────────────────────────
  if (/adaptivecurveirm.*targets.*90|targets.*90%.*utilization/i.test(lower)) return 'IRM targets 90% utilization';
  if (/supply apy.*borrowapy.*utilization|supply apy = borrowapy/i.test(lower)) return 'Supply APY formula';
  if (/below 90%.*slope.*gentler|above 90%.*steepens/i.test(lower)) return 'IRM kink at 90% utilization';
  if (/adaptivecurveirm.*immutable/i.test(lower)) return 'AdaptiveCurveIRM: immutable';

  // ── Vault V2 general ─────────────────────────────────────────────
  if (/vault v2.*adapter-based|adapter-based managed lending/i.test(lower)) return 'Vault V2: adapter-based lending';
  if (/deposits.*allocations.*separated by design/i.test(lower)) return 'Deposit vs allocation separation';
  if (/erc4626 max.*helpers.*returning zero/i.test(lower)) return 'ERC4626 max*: returns zero (expected)';
  if (/frontend.*vault-specific logic.*max\*/i.test(lower)) return 'Vault availability: skip max* shortcuts';
  if (/vault v2.*socializes losses.*share price/i.test(lower)) return 'Loss socialization via share price';
  if (/realassets\(\).*reports less/i.test(lower)) return 'realAssets() triggers loss realization';
  if (/no shares are burned.*socializ/i.test(lower)) return 'Loss socialization: no share burn';
  if (/vault v1.*bad debt caveat.*vaultv1adapter/i.test(lower)) return 'VaultV1Adapter: bad debt caveat';
  if (/vault v2 factories.*bundler3.*chain-specific/i.test(lower)) return 'Factories + Bundler3: chain-specific';
  if (/erc4626 maxwithdraw.*conservative/i.test(lower)) return 'maxWithdraw: unreliable for Vault V2';

  // ── Roles & permissions ──────────────────────────────────────────
  if (/roles do not inherit permissions/i.test(lower)) return 'Roles: no permission inheritance';
  if (/owner can only set curator and sentinels/i.test(lower)) return 'Owner permission limits';
  if (/curator defines strategy.*allocator executes/i.test(lower)) return 'Curator vs allocator';
  if (/sentinel only performs risk-reducing/i.test(lower)) return 'Sentinel: risk-reducing only';

  // ── Timelocks ────────────────────────────────────────────────────
  if (/addadapter.*cap increases.*3 days|cap increases.*at least 3/i.test(lower)) return '3-day timelock: adapters + cap increases';
  if (/removeadapter.*7 days|critical.*registry.*7 days/i.test(lower)) return '7-day timelock: removeAdapter';
  if (/cap decreases are immediate/i.test(lower)) return 'Cap decreases: immediate';
  if (/delayed risk increase.*instant risk reduction/i.test(lower)) return 'Asymmetric timelock design';

  // ── Adapters ─────────────────────────────────────────────────────
  if (/morphomarketv1adapterv2.*manages.*market exposure.*timelock/i.test(lower)) return 'MarketV1AdapterV2: own timelock';
  if (/morphovaultv1adapter.*wraps.*vault v1.*no.*timelock/i.test(lower)) return 'VaultV1Adapter: no timelock';
  if (/liquidity adapter points to one underlying market/i.test(lower)) return 'Liquidity adapter: single market';
  if (/no automatic withdrawal queue fallthrough/i.test(lower)) return 'No withdrawal queue fallthrough';

  // ── Cap system ───────────────────────────────────────────────────
  if (/adapter, collateral, and market caps/i.test(lower)) return 'Three-cap requirement';
  if (/absolute caps.*loan asset.*relative caps.*wad/i.test(lower)) return 'Absolute vs relative caps';
  if (/collateral id.*abi\.encode/i.test(lower)) return 'Collateral ID: abi.encode format';
  if (/market id.*abi\.encode/i.test(lower)) return 'Market ID: abi.encode format';

  // ── Share accounting ─────────────────────────────────────────────
  if (/rounding direction.*toassetsup.*toassetsdown/i.test(lower)) return 'Rounding: toAssetsUp vs toAssetsDown';
  if (/dust after deallocate.*share rounding/i.test(lower)) return 'Deallocate dust: expected';
  if (/shares.*assets.*not interchangeable/i.test(lower)) return 'Shares ≠ assets';
  if (/shares must be converted.*rounding/i.test(lower)) return 'Share conversion rounding';
  if (/morpho uses share accounting/i.test(lower)) return 'Share accounting everywhere';
  if (/good ux.*safety buffers.*hf 1/i.test(lower)) return 'UX: safety buffers, not HF 1.00';

  // ── Data layer & contracts ───────────────────────────────────────
  if (/contracts.*source of truth.*execution/i.test(lower)) return 'Contracts = source of truth';
  if (/api.*graphql.*rate-limited.*cached/i.test(lower)) return 'API: GraphQL, rate-limited, cache it';
  if (/use.*api.*dashboards.*use.*contracts.*transactions/i.test(lower)) return 'API for reads, contracts for writes';
  if (/degraded mode.*api.*unavailable/i.test(lower)) return 'Degraded mode when API is down';
  if (/accrue interest.*real-time debt/i.test(lower)) return 'Accrue interest for real-time state';
  if (/local metric.*match.*onchain/i.test(lower)) return 'Local math must match onchain';
  if (/separate data.*layer.*execution.*layer/i.test(lower)) return 'Data layer vs execution layer';
  if (/most integration failures.*decimal.*approval.*swap/i.test(lower)) return 'Top integration failure causes';
  if (/never approve.*production.*oracle assumptions/i.test(lower)) return 'Review oracle before shipping';
  if (/clear incident communication/i.test(lower)) return 'Incident communication is part of the job';
  if (/build dashboards.*degrade gracefully.*stale data/i.test(lower)) return 'Dashboard: stale data beats blank screen';
  if (/bigint.*display layer|bigint.*formatting boundary/i.test(lower)) return 'BigInt until the display layer';
  if (/production.*cache.*degrade gracefully/i.test(lower)) return 'Cache + graceful degradation';
  if (/maximum graphql complexity.*1,000,000/i.test(lower)) return 'GraphQL complexity limit: 1,000,000';
  if (/rate limit.*5k.*5 minutes/i.test(lower)) return 'API rate limit: 5k / 5 min';

  // ── Permit / approval ────────────────────────────────────────────
  if (/permit flows.*reduce clicks.*unit-risk/i.test(lower)) return 'Permit flows: risks remain';
  if (/simulate.*final state.*permit/i.test(lower)) return 'Simulate permit final state';
  if (/approval minimization.*product plus.*security/i.test(lower)) return 'Minimize approvals';

  // ── Bundler3 ─────────────────────────────────────────────────────
  if (/bundler3.*call dispatcher.*atomic/i.test(lower)) return 'Bundler3: atomic call dispatcher';
  if (/entrypoint.*multicall.*call.*calldata.*bundle/i.test(lower)) return 'Bundler3 entrypoint: multicall()';
  if (/each call.*to.*data.*value.*skiprevert.*callbackhash/i.test(lower)) return 'Call struct fields';
  if (/coreadapter.*initiator/i.test(lower)) return 'CoreAdapter: exposes initiator';
  if (/bundler3.*ideal.*multi-step.*leverage.*refinancing/i.test(lower)) return 'Bundler3 for leverage + refinancing';
  if (/value proposition.*safe workflow composition/i.test(lower)) return 'Bundler3: safe workflow composition';
  if (/bundler3.*chain-specific.*addresses page/i.test(lower)) return 'Bundler3: chain-specific addresses';

  // ── Rewards & Merkl ──────────────────────────────────────────────
  if (/merkl.*recipe.*educational.*not production/i.test(lower)) return 'Merkl recipe: demo only';
  if (/morpho graphql.*merkl rest.*combined.yield|graphql.*merkl.*yield dashboard/i.test(lower)) return 'GraphQL + Merkl = yield dashboard';
  if (/show base apy.*rewards apr.*separately/i.test(lower)) return 'Show APY and reward APR separately';
  if (/textbook partner engineer demo/i.test(lower)) return 'PE demo pattern';
  if (/vaultv2s.*discovery root|vaultsv2s.*discovery/i.test(lower)) return 'vaultV2s: vault discovery root';
  if (/avgapy.*avgnetapy.*rewards\.supplyapr/i.test(lower)) return 'Combined yield API fields';
  if (/userbyaddress.*vaultv2positions/i.test(lower)) return 'User vault position query';
  if (/keep queries narrow.*complexity.*rate/i.test(lower)) return 'Narrow queries: respect rate limits';
  if (/legacy rewards.*deprecated.*merkl/i.test(lower)) return 'Legacy rewards: use Merkl';
  if (/vault v2 rewards.*pre-aggregated/i.test(lower)) return 'Vault V2 rewards: pre-aggregated in API';
  if (/show base apy.*token-by-token.*combined/i.test(lower)) return 'Yield display: base → per-token → combined';
  if (/claim simulation.*partner demo.*rewards.*user action/i.test(lower)) return 'Claim simulation as demo';
  if (/keep.*bigint.*formatting boundary|raw token math.*bigint/i.test(lower)) return 'BigInt until formatting boundary';
  if (/apr.*apy.*not interchangeable/i.test(lower)) return 'APR ≠ APY';
  if (/partial failure.*mandatory.*multi-source/i.test(lower)) return 'Multi-source: handle partial failures';
  if (/separate hooks.*morpho state.*merkl/i.test(lower)) return 'Separate hooks per data source';
  if (/winning demo.*vault discovery.*reward apr/i.test(lower)) return 'Winning demo pattern';
  if (/reward apr.*not static.*incentive-driven/i.test(lower)) return 'Reward APR is dynamic';
  if (/claim simulation.*differentiator.*partner.*poc/i.test(lower)) return 'Claim simulation: POC differentiator';

  // ── Public Allocator ─────────────────────────────────────────────
  if (/public allocator.*publicly callable/i.test(lower)) return 'Public Allocator';
  if (/fees.*curator-set.*gas token/i.test(lower)) return 'Public Allocator: curator-set fees';
  if (/api data.*discover.*reallocatable liquidity/i.test(lower)) return 'Discover reallocatable liquidity via API';
  if (/strong answer.*liquidity fragmentation/i.test(lower)) return 'Liquidity fragmentation answer';

  // ── Architecture & POC patterns ──────────────────────────────────
  if (/best pocs.*real operational question/i.test(lower)) return 'POC answers real questions';
  if (/health dashboards.*yield dashboards.*flow simulators/i.test(lower)) return 'High-value POC types';
  if (/good poc.*explainable to bd.*useful to engineering/i.test(lower)) return 'POC: useful to BD and engineering';
  if (/prefer cache-backed read layers.*narrow execution/i.test(lower)) return 'Architecture: cache + narrow execution';
  if (/borrow dashboards.*hf.*liquidation price/i.test(lower)) return 'Borrow dashboard: lead with HF';
  if (/earn dashboards.*native yield.*incentives/i.test(lower)) return 'Earn dashboard: split native vs rewards';
  if (/user views.*raw position state.*actionable/i.test(lower)) return 'User view: state + actionable next steps';
  if (/graphql.*indexed reads.*onchain.*sensitive/i.test(lower)) return 'GraphQL for reads, onchain for sensitive';
  if (/a good demo bridges.*protocol detail.*business/i.test(lower)) return 'Demo: protocol detail + business impact';
  if (/one credible poc story/i.test(lower)) return 'Have a POC story ready';
  if (/poc answer.*name the data source.*decision/i.test(lower)) return 'POC: name data source + decision';

  // ── Communication patterns ───────────────────────────────────────
  if (/lead with partner outcomes.*protocol primitives/i.test(lower)) return 'Outcomes before primitives';
  if (/every technical claim.*business.*operational benefit/i.test(lower)) return 'Map tech to business outcomes';
  if (/do not drown.*bd call.*low-level/i.test(lower)) return 'Use case before tech details';
  if (/strong communication.*architecture plus judgment/i.test(lower)) return 'Communication: architecture + judgment';
  if (/always scope.*chain.*workflow.*risk.*monitoring/i.test(lower)) return 'Scope: chain, workflow, risk, monitoring';
  if (/first call.*concrete.*technical next step/i.test(lower)) return 'First call: end with a next step';
  if (/differentiate.*poc scope.*production scope/i.test(lower)) return 'POC scope vs production scope';
  if (/merkl.*dashboard requirements.*surfaced early/i.test(lower)) return 'Surface Merkl requirements early';
  if (/be balanced.*incumbents.*no strengths/i.test(lower)) return 'Acknowledge competitor strengths';
  if (/lead with isolated markets.*immutability.*curation/i.test(lower)) return 'Lead with isolation + immutability';
  if (/tailor.*asset.*product.*launched/i.test(lower)) return 'Tailor pitch to the asset context';
  if (/credibility beats evangelism/i.test(lower)) return 'Credibility over evangelism';
  if (/acknowledge risk first.*then.*controls/i.test(lower)) return 'Risk first, then controls';
  if (/hf.*lltv.*safety buffers.*monitoring.*vocabulary/i.test(lower)) return 'Risk vocab: HF, LLTV, buffers';
  if (/do not overstate liquidation certainty/i.test(lower)) return 'No liquidation guarantees';
  if (/tie isolated markets.*blast radius/i.test(lower)) return 'Isolation = blast radius control';
  if (/escalations must be reproducible/i.test(lower)) return 'Escalations: reproducible + scoped';
  if (/separate protocol bugs.*integration bugs/i.test(lower)) return 'Protocol bug vs integration bug';
  if (/set next-update expectations.*timezones/i.test(lower)) return 'Set update expectations explicitly';
  if (/closing the loop.*first response/i.test(lower)) return 'Closing the loop matters';
  if (/lead with the point.*not the background/i.test(lower)) return 'Lead with the point';
  if (/one major claim per sentence/i.test(lower)) return 'One claim per sentence';
  if (/always connect protocol.*partner outcomes/i.test(lower)) return 'Connect mechanics to outcomes';
  if (/acknowledge trade-offs when/i.test(lower)) return 'Acknowledge trade-offs';
  if (/use case first.*architecture second/i.test(lower)) return 'Use case first, architecture second';
  if (/always recommend.*concrete next step/i.test(lower)) return 'Always give a concrete next step';
  if (/state assumptions out loud/i.test(lower)) return 'State your assumptions';
  if (/show judgment.*choosing one path.*defending/i.test(lower)) return 'Show judgment: commit and defend';
  if (/whiteboards.*problem framing.*not diagram spam/i.test(lower)) return 'Whiteboard: frame first';
  if (/mention edge cases early.*decimals.*rounding/i.test(lower)) return 'Mention edge cases early';
  if (/use exact protocol terms/i.test(lower)) return 'Use exact protocol terms';
  if (/show fallback.*monitoring.*happy-path/i.test(lower)) return 'Show fallback + monitoring';
  if (/always lead with use case.*builder value/i.test(lower)) return 'Use case first in interviews';
  if (/when asked about risk.*five categories/i.test(lower)) return 'Five risk categories';
  if (/support scenarios.*empathy first/i.test(lower)) return 'Support: empathy first';
  if (/role rewards loop-closing/i.test(lower)) return 'Role rewards loop-closing behavior';
  if (/great partner support.*product feedback/i.test(lower)) return 'Partner support = product feedback';
  if (/technical clarity.*empathy.*target persona/i.test(lower)) return 'Technical clarity + empathy';
  if (/clarify use case before recommending architecture/i.test(lower)) return 'Clarify use case before architecture';
  if (/separate indexed data.*execution truth/i.test(lower)) return 'Indexed data ≠ execution truth';
  if (/verify exact chain-specific details.*bluffing/i.test(lower)) return 'Verify chain details, never bluff';
  if (/always end with a concrete next step/i.test(lower)) return 'Always end with a next step';
  if (/behavioral answers.*clarity.*prioritization.*loop-closing/i.test(lower)) return 'Behavioral: clarity + loop-closing';
  if (/do not tell a hero story.*systems improvement/i.test(lower)) return 'Hero stories need a systems lesson';
  if (/external-pressure stories.*calm communication.*technical structure/i.test(lower)) return 'Pressure stories: calm + structure';
  if (/ambiguity stories.*vague asks.*scoped execution/i.test(lower)) return 'Ambiguity → scoped execution';
  if (/do not give generic crypto enthusiasm/i.test(lower)) return 'No generic crypto enthusiasm';
  if (/anchor.*morpho design quality.*builder-facing leverage/i.test(lower)) return 'Anchor in Morpho design quality';
  if (/explain why partner engineering fits.*working style/i.test(lower)) return 'Why partner engineering fits you';
  if (/end with what you specifically bring to the role/i.test(lower)) return 'End with what you bring';
  if (/never bluff exact chain-specific/i.test(lower)) return 'Never bluff chain-specific details';
  if (/state what you know.*would verify.*why it matters/i.test(lower)) return 'State known, verify unknown';
  if (/use source-of-truth language explicitly/i.test(lower)) return 'Use source-of-truth language';
  if (/controlled uncertainty.*strength.*concrete decision path/i.test(lower)) return 'Controlled uncertainty = strength';

  // ─── Algorithmic fallback ─────────────────────────────────────────
  // "X = Y" → use X as the label
  const equalsMatch = clean.match(/^([A-Za-z][^=*\/(]{2,35}?)\s*=/);
  if (equalsMatch) {
    const lhs = equalsMatch[1].trim();
    if (lhs.length >= 2 && !/abi\.encode/i.test(lhs)) return truncateFocusLabel(lhs);
  }

  // "X: Y" → use X as the label (colon separator)
  const colonMatch = clean.match(/^([^:]{4,50}):/);
  if (colonMatch) {
    const pre = colonMatch[1].trim().replace(/^(the|a|an)\s+/i, '');
    if (pre.split(/\s+/).length <= 6) return truncateFocusLabel(pre);
  }

  // "Subject is/are ..." → extract subject
  const isAreMatch = clean.match(/^(.+?)\s+(?:is|are)\s+/i);
  if (isAreMatch) {
    const subj = isAreMatch[1].trim().replace(/^(the|a|an)\s+/i, '');
    if (subj.split(/\s+/).length <= 5 && subj.length >= 3 && subj.length <= 45) {
      return truncateFocusLabel(subj);
    }
  }

  // "Subject supports/uses/targets/manages/..." → extract subject
  const verbMatch = clean.match(/^(.+?)\s+(?:supports|uses|targets|manages|wraps|exposes|requires|defines|starts|shrinks|emerges|matters)\s+/i);
  if (verbMatch) {
    const subj = verbMatch[1].trim().replace(/^(the|a|an)\s+/i, '');
    if (subj.split(/\s+/).length <= 4 && subj.length >= 3) return truncateFocusLabel(subj);
  }

  // Directive: "Always/Never/Use/Show/..." → short label
  const dirMatch = clean.match(/^(Always|Never|Use|Show|Keep|Lead|Prefer|Separate|Acknowledge|Mention|State|Build|Do not|Tailor|Tie|Set|Accrue)\s+(.+)/i);
  if (dirMatch) {
    const rest = dirMatch[2].split(/[;:,]/)[0].trim().split(/\s+/).slice(0, 3).join(' ');
    return truncateFocusLabel(`${dirMatch[1]} ${rest}`);
  }

  // Default: strip leading article + take first clause
  const stripped = clean.replace(/^(the|a|an)\s+/i, '');
  return truncateFocusLabel(stripped.split(/[.;]/)[0].trim());
}

function buildBulletTitle(lessonTitle, bullet) {
  const focus = buildBulletFocusLabel(bullet);
  if (focus && focus.toLowerCase() !== sanitizeText(lessonTitle).toLowerCase()) return focus;
  return sanitizeText(lessonTitle);
}

function buildFormulaTitle(lessonTitle) {
  const lower = sanitizeText(lessonTitle).toLowerCase();
  if (/health factor|hf/i.test(lower)) return 'Formula — Health Factor';
  if (/supply apy|borrow apy|apy math/i.test(lower)) return 'Formula — APY Composition';
  if (/lif|liquidation incentive/i.test(lower)) return 'Formula — LIF';
  if (/adaptivecurve|irm|utilization/i.test(lower)) return 'Formula — IRM & Utilization';
  if (/liquidation price/i.test(lower)) return 'Formula — Liquidation Price';
  if (/shares.*asset|asset.*share/i.test(lower)) return 'Formula — Shares vs Assets';
  if (/position math|formula sheet/i.test(lower)) return 'Formula — Position Math';
  return `Formula — ${sanitizeText(lessonTitle)}`;
}

function buildDrillTitle(lessonTitle, drill) {
  const clean = sanitizeText(drill).toLowerCase();
  if (/partner asks|partner says|partner call|partner.*question/i.test(clean)) return 'Partner Call Drill';
  if (/whiteboard|walk.*through|explain.*to|narrate|draw/i.test(clean)) return 'Whiteboard Drill';
  if (/pitch|60.second|elevator|one.sentence/i.test(clean)) return 'Pitch Drill';
  if (/dashboard|health factor|hf|liquidat|at.risk/i.test(clean)) return 'Risk Debugging Drill';
  if (/poc|demo|prototype|proof.of.concept/i.test(clean)) return 'POC Scoping Drill';
  if (/bd|business|stakeholder|non.technical/i.test(clean)) return 'BD Communication Drill';
  return 'Interview Drill';
}

function buildWhyTitle(lessonTitle) {
  const clean = sanitizeText(lessonTitle);
  if (clean.length <= 40) return `Why: ${clean}`;
  return 'Why This Matters';
}

function buildQuizTitle(question, index) {
  const raw = (question.category || question.module_slug || '').trim();
  if (!raw) return `Question ${index + 1}`;
  return raw
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildTypedDefinitionPrompt(lessonTitle, bullet) {
  const leadTerm = extractLeadTerm(bullet);
  if (!leadTerm) {
    return `Type the key Morpho term from "${lessonTitle}".`;
  }
  const escaped = leadTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const redacted = bullet.replace(new RegExp(`^${escaped}\\s*[:=-]?\\s*`, 'i'), '_____ ');
  return `Type the missing Morpho term from "${lessonTitle}": ${redacted}`;
}

function extractLeadTerm(bullet) {
  const clean = sanitizeText(bullet);
  const phrasePatterns = [
    /^Morpho Market V1 \/ Blue/i,
    /^Morpho Blue contract/i,
    /^Blue contract/i,
    /^Ethereum Bundler3/i,
    /^Base Bundler3/i,
    /^Collateral Value/i,
    /^Health Factor/i,
    /^Max Borrow/i,
    /^LIF/i,
    /^MorphoChainlinkOracleV2/i
  ];

  for (const pattern of phrasePatterns) {
    const match = clean.match(pattern);
    if (match) return match[0];
  }

  const firstToken = clean.match(/^([A-Za-z0-9/+.-]{2,40})/)?.[1] || '';
  if (!firstToken) return '';
  if (isLowSignalFragment(firstToken)) return '';
  return firstToken;
}

function estimateDifficulty({ prompt, answer, sourceType, difficultyHint }) {
  if (difficultyHint) {
    if (['fundamental', 'easy'].includes(difficultyHint)) return 'easy';
    if (['intermediate', 'medium'].includes(difficultyHint)) return 'medium';
    return 'hard';
  }

  const combined = `${prompt} ${answer}`.toLowerCase();
  if (/formula|hf|lltv|oracle|liquidation|cap|market|timelock|bundler|rewards|graphql/.test(combined)) {
    return 'hard';
  }
  if (sourceType === 'lesson-why') return 'medium';
  return answer.length > 120 ? 'medium' : 'easy';
}

function timingForUnit({ difficulty, prompt, choices }) {
  const promptSize = sanitizeText(prompt).length;
  const maxChoiceSize = Math.max(...choices.map((choice) => sanitizeText(choice).length), 0);
  const complexityBoost = /formula|hf|lltv|liquidation|oracle|cap|market|bundler|graphql|rewards/i.test(prompt) ? 2 : 0;

  let base = 20;
  if (difficulty === 'medium') base = 22;
  if (difficulty === 'hard') base = 26;

  if (promptSize > 120 || maxChoiceSize > 120) base += 1;
  if (promptSize > 180 || maxChoiceSize > 180) base += 1;

  return Math.max(20, Math.min(32, base + complexityBoost));
}

function buildDistractors(pool, currentText, count = 3) {
  const cleanCurrent = sanitizeText(currentText);
  const seen = new Set([cleanCurrent]);
  const result = [];

  for (const item of pool) {
    const clean = sanitizeText(item);
    if (!clean || seen.has(clean)) continue;
    seen.add(clean);
    result.push(clean);
    if (result.length >= count) break;
  }

  while (result.length < count) {
    result.push(`Not this exact Morpho point: ${result.length + 1}`);
  }

  return result;
}

function stableShuffleChoices(correctChoice, distractors, seedString) {
  const entries = [
    { text: sanitizeText(correctChoice), correct: true },
    ...distractors.map((text) => ({ text: sanitizeText(text), correct: false }))
  ];

  return stableShuffleEntries(entries, seedString);
}

function stableShuffleEntries(entries, seedString) {
  const normalizedEntries = entries.map((entry) => ({
    text: sanitizeText(entry.text),
    correct: Boolean(entry.correct)
  }));

  let seed = Array.from(seedString).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  for (let i = normalizedEntries.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    const j = seed % (i + 1);
    [normalizedEntries[i], normalizedEntries[j]] = [normalizedEntries[j], normalizedEntries[i]];
  }

  const correctIndexes = normalizedEntries
    .map((entry, index) => (entry.correct ? index : -1))
    .filter((index) => index >= 0);

  return {
    choices: normalizedEntries.map((entry) => entry.text),
    correctIndex: correctIndexes[0] ?? -1,
    correctIndexes
  };
}

function dedupeTexts(items) {
  const seen = new Set();
  return items
    .map((item) => sanitizeText(item))
    .filter((item) => {
      if (!item || seen.has(item) || isLowSignalFragment(item)) return false;
      seen.add(item);
      return true;
    });
}

function shouldSeedTypedLeadTerm(leadTerm, bullet, prompt) {
  if (!leadTerm) return false;
  if (leadTerm.length > 24) return false;
  if (isLowSignalFragment(leadTerm)) return false;
  if (!hasSufficientSpecificity(bullet)) return false;
  if (isLowSignalPrompt(prompt)) return false;
  return true;
}

function shouldSeedChoiceUnit({ prompt, correctChoice, distractors, explanation }) {
  if (isLowSignalPrompt(prompt)) return false;
  if (!hasSufficientSpecificity(correctChoice)) return false;
  if (!hasSufficientSpecificity(explanation)) return false;
  if (!Array.isArray(distractors) || distractors.length < 3) return false;
  if (distractors.some((choice) => isLowSignalFragment(choice) || !hasSufficientSpecificity(choice))) return false;
  return true;
}

function isValidQuickLearningUnit(unit) {
  if (!unit || isLowSignalPrompt(unit.prompt)) return false;

  if (unit.answerFormat === 'typed') {
    const accepted = Array.isArray(unit.acceptedAnswers) ? unit.acceptedAnswers.map(sanitizeText).filter(Boolean) : [];
    if (!accepted.length) return false;
    if (accepted.some((answer) => isLowSignalFragment(answer) || !hasSufficientSpecificity(answer))) return false;
  }

  if (unit.answerFormat === 'multiple_choice' || unit.answerFormat === 'multi_select') {
    const choices = Array.isArray(unit.choices) ? unit.choices.map(sanitizeText).filter(Boolean) : [];
    if (choices.length < 2) return false;
    if (choices.some((choice) => isLowSignalFragment(choice))) return false;
  }

  if (!hasSufficientSpecificity(unit.explanation || '')) return false;
  return true;
}

function buildSpecificBulletPrompt(lessonTitle, bullet) {
  const clean = sanitizeText(bullet);
  const focus = buildBulletFocusLabel(clean);
  if (/contract address|0x[a-f0-9]{8,}/i.test(clean)) return `${buildPromptLead('Contract landmarks', lessonTitle)} ${focus}; which contract landmark should you quote exactly?`;
  if (/integration pitch|business benefit|partner call/i.test(clean)) return `${buildPromptLead('Partner-facing framing', lessonTitle)} ${focus}; which statement is actually accurate?`;
  if (/roles do not inherit permissions|owner can only set curator and sentinels|curator defines strategy|sentinel only performs risk-reducing actions/i.test(clean)) return `${buildPromptLead('Vault V2 role boundaries', lessonTitle)} ${focus}; which statement is correct?`;
  if (/3 days|7 days|cap decreases are immediate|timelock/i.test(clean)) return `${buildPromptLead('Vault V2 timelocks', lessonTitle)} ${focus}; which statement is exact?`;
  if (/adapter|liquidity adapter|withdrawal queue|operationally illiquid/i.test(clean)) return `${buildPromptLead('Adapter behavior', lessonTitle)} ${focus}; which statement is accurate?`;
  if (/cap|wad|abi.encode|market id|collateral id/i.test(clean)) return `${buildPromptLead('Caps and id systems', lessonTitle)} ${focus}; which statement is correct?`;
  if (/share price depreciation|socializes losses|no shares are burned|bad debt caveat/i.test(clean)) return `${buildPromptLead('Loss accounting', lessonTitle)} ${focus}; which statement is correct?`;
  if (/adaptivecurveirm|90% utilization|supply apy|borrow apy/i.test(clean)) return `${buildPromptLead('Rate model behavior', lessonTitle)} ${focus}; which statement is accurate?`;
  if (/liquidation price|1e36|wad-scaled|health factor/i.test(clean)) return `${buildPromptLead('Position math', lessonTitle)} ${focus}; which statement is the precise one?`;
  if (/pre-liquidation|permissionless and external|lends? guaranteed|lif shrinks/i.test(clean)) return `${buildPromptLead('Liquidation regimes', lessonTitle)} ${focus}; which statement is correct?`;
  if (/rounding|dust|shares and assets|safety buffers/i.test(clean)) return `${buildPromptLead('Rounding and UX safety', lessonTitle)} ${focus}; which statement is accurate?`;
  if (/source of truth|graphql|rate-limited|cached|degraded mode/i.test(clean)) return `${buildPromptLead('Execution truth vs API reads', lessonTitle)} ${focus}; which statement is production-safe?`;
  if (/accrue interest|marketparams|canonical identity|real-time hf/i.test(clean)) return `${buildPromptLead('Market identity and live reads', lessonTitle)} ${focus}; which statement is correct?`;
  if (/permit|approvals|simulate|approval minimization/i.test(clean)) return `${buildPromptLead('Permits and approvals', lessonTitle)} ${focus}; which statement is the right engineering answer?`;
  if (/bundler3|multicall|call\[]|atomic|initiator/i.test(clean)) return `${buildPromptLead('Bundler3 workflow design', lessonTitle)} ${focus}; which statement is correct?`;
  if (/api\.morpho\.org\/graphql|complexity|rate limit|degrade gracefully/i.test(clean)) return `${buildPromptLead('Morpho API constraints', lessonTitle)} ${focus}; which statement is accurate?`;
  if (/incident communication|oracle assumptions|decimal|approval|swap|fallback/i.test(clean)) return `${buildPromptLead('Integration risk handling', lessonTitle)} ${focus}; which statement is the strongest answer?`;
  if (/permissionless|immutable|isolated|pooled/i.test(clean)) return `${buildPromptLead('Core mechanism', lessonTitle)} ${focus}; which statement best captures it?`;
  if (/health factor|hf/i.test(clean)) return `${buildPromptLead('Health Factor explanation', lessonTitle)} ${focus}; which answer is most precise?`;
  if (/liquidation fee|bad debt|liquidatable/i.test(clean)) return `${buildPromptLead('Liquidation mechanics', lessonTitle)} ${focus}; which statement is correct?`;
  if (/oracle|1e36|decimal/i.test(clean)) return `${buildPromptLead('Oracle pricing', lessonTitle)} ${focus}; which statement is accurate?`;
  return `${buildPromptLead('Interview-safe recall', lessonTitle)} ${focus}; which statement is the most precise answer?`;
}

function buildBulletDistractors(bullet) {
  const clean = sanitizeText(bullet);
  const distractors = [];

  if (/one collateral token \+ one loan token/i.test(clean)) {
    distractors.push(
      'A market can mix many collateral assets and many debt assets inside one pooled configuration.',
      'A market is mainly defined by utilization, rewards APR, and frontend settings.',
      'A market can change its oracle or IRM after launch through governance hot-patching.'
    );
  }
  if (/five market parameters/i.test(clean)) {
    distractors.push(
      'The core set is loan token, collateral token, utilization, health factor, and liquidation fee.',
      'The core set is collateral token, oracle, rewards APR, curator fee, and vault address.',
      'The core set is loan token, collateral token, governance, liquidation bot, and Bundler3.'
    );
  }
  if (/isolated markets contain failures/i.test(clean)) {
    distractors.push(
      'Losses and parameter failures are socialized across one shared pool of unrelated collateral.',
      'Isolation mainly means users get higher APY, not that risk is ring-fenced by market.',
      'Isolation removes the need to reason about oracle or liquidation design for each market.'
    );
  }
  if (/permissionless creation still depends on governance-approved IRMs and oracles/i.test(clean)) {
    distractors.push(
      'Anyone can create a market using any arbitrary oracle or IRM without approved components.',
      'Only Morpho Labs can create new markets once governance approves an asset.',
      'Permissionless means the frontend chooses the oracle and the chain picks the IRM automatically.'
    );
  }
  if (/custom risk surfaces and faster listing|faster custom market design/i.test(clean)) {
    distractors.push(
      'The main pitch is generic higher APY from one large pooled book, regardless of asset specifics.',
      'The main pitch is that governance can rewrite market parameters whenever a partner asks.',
      'The main pitch is standardization above all else, even if that slows down asset-specific launches.'
    );
  }
  if (/0x[a-f0-9]{8,}/i.test(clean)) {
    const address = clean.match(/0x[a-fA-F0-9]{40}/)?.[0] || '';
    if (/bbbbbbb/i.test(address.toLowerCase())) {
      distractors.push(
        'Bundler3 on Ethereum is 0x6566194141eefa99Af43Bb5Aa71460Ca2Dc90245.',
        'Bundler3 on Base is 0x6BFd8137e702540E7A42B74178A4a49Ba43920C4.',
        'You should quote the factory address instead of the canonical Blue contract.'
      );
    } else {
      distractors.push(
        'The canonical Blue contract is 0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb.',
        'The address is chain-agnostic so it is safer to quote the API endpoint than the contract.',
        'You should rely on memory for addresses rather than rechecking the official addresses page.'
      );
    }
  }
  if (/hf > 1 is healthy; hf <= 1 is liquidatable/i.test(clean)) {
    distractors.push(
      'HF below 1 just means higher interest, not liquidation eligibility.',
      'HF above 1 means the position is already in the liquidation band.',
      'HF is mainly a yield metric, so liquidation thresholds should be expressed only as APR.'
    );
  }
  if (/safety buffer, not just a fraction/i.test(clean)) {
    distractors.push(
      'HF should be pitched as an abstract fraction with no need to translate it into risk buffer.',
      'HF is best described only as a backend metric because PMs do not need risk intuition.',
      'HF should be framed as the user’s rewards multiplier rather than distance from liquidation.'
    );
  }
  if (/1e36/i.test(clean)) {
    distractors.push(
      'Morpho oracle math is usually treated as 1e18, so decimal normalization can be approximate.',
      'The 1e36 scaling only matters for UI display and not for collateral value math.',
      'If the oracle quote looks roughly right in JavaScript floats, the scaling is probably fine.'
    );
  }
  if (/quote is collateral priced in units of the loan token/i.test(clean)) {
    distractors.push(
      'Morpho oracles always quote collateral directly in USD, so loan-token denomination is irrelevant.',
      'The quote is always the loan token priced in collateral units, regardless of oracle path.',
      'Oracle outputs are mainly for analytics dashboards and not used in liquidation math.'
    );
  }
  if (/supports direct, inverse, multi-hop, and vault-conversion paths/i.test(clean)) {
    distractors.push(
      'It only supports direct USD feeds and cannot compose vault conversion logic.',
      'It only supports inverse feeds if a frontend normalizes the path offchain.',
      'It is limited to one-hop Chainlink feeds and does not support conversion adapters.'
    );
  }
  if (/dashboard bugs around hf come from decimal normalization mistakes/i.test(clean)) {
    distractors.push(
      'Most HF bugs come from users refreshing too slowly, not from decimal or price normalization.',
      'If the displayed ratio looks close, floating-point math is acceptable for HF previews.',
      'HF dashboards can ignore token decimals because the oracle scaling already cancels them out.'
    );
  }
  if (/no protocol liquidation fee/i.test(clean)) {
    distractors.push(
      'Morpho takes a protocol liquidation fee before the liquidator receives any incentive.',
      'The liquidator only earns a fee when governance enables it market by market.',
      'Liquidation incentives are paid to the vault curator rather than the liquidator.'
    );
  }
  if (/bad debt starts once ltv exceeds 1 \/ lif/i.test(clean)) {
    distractors.push(
      'Bad debt starts immediately once LTV crosses LLTV, even if collateral still covers the position.',
      'Bad debt starts only when utilization is high and does not depend on LIF.',
      'Bad debt is impossible on Morpho because liquidations always restore full solvency.'
    );
  }
  if (/roles do not inherit permissions/i.test(clean)) {
    distractors.push(
      'Vault V2 roles inherit from one another, so Owner can do anything Curator or Allocator can do.',
      'Sentinels can increase risk temporarily if that helps keep utilization high.',
      'Owner is the operational role that directly reallocates capital day to day.'
    );
  }
  if (/owner can only set curator and sentinels/i.test(clean)) {
    distractors.push(
      'Owner directly manages caps and reallocations because it is the super-admin role.',
      'Owner can instantly add risky adapters without curator involvement.',
      'Owner mainly exists to set rewards APR and rebalance liquidity.'
    );
  }
  if (/curator defines strategy; allocator executes inside those boundaries/i.test(clean)) {
    distractors.push(
      'Allocator defines the risk strategy and Curator only signs off on withdrawals.',
      'Curator and Allocator are interchangeable names for the same role.',
      'Allocator can bypass caps if execution conditions look favorable.'
    );
  }
  if (/sentinel only performs risk-reducing actions/i.test(clean)) {
    distractors.push(
      'Sentinel can both increase and decrease risk as long as it acts quickly.',
      'Sentinel is mainly a reporting role with no onchain protective actions.',
      'Sentinel can create new adapters but cannot reduce caps.'
    );
  }
  if (/3 days|7 days|cap decreases are immediate|delayed risk increase, instant risk reduction/i.test(clean)) {
    distractors.push(
      'Risk-increasing and risk-reducing actions share the same short timelock, so there is no asymmetry.',
      'Cap decreases require the longest timelock because they change user expectations.',
      'A curator can immediately add a risky adapter if they also lower a cap elsewhere.'
    );
  }
  if (/liquidity adapter points to one underlying market at a time|no automatic withdrawal queue fallthrough/i.test(clean)) {
    distractors.push(
      'The liquidity adapter automatically rotates across all markets with spare liquidity during withdrawal.',
      'MarketV1AdapterV2 always guarantees withdrawal routing across every configured market.',
      'Liquidity setup falls back through every adapter recursively until cash is found.'
    );
  }
  if (/absolute caps are denominated in the loan asset|relative caps use wad/i.test(clean)) {
    distractors.push(
      'Absolute caps are always denominated in USD and relative caps are percentages in basis points.',
      'Relative caps use 1e6 scaling and absolute caps are denominated in vault shares.',
      'All cap layers use the same unit, so WAD scaling only matters in the frontend.'
    );
  }
  if (/collateral id = abi.encode|market id = abi.encode/i.test(clean)) {
    distractors.push(
      'Collateral and market ids are free-form strings chosen by the curator for readability.',
      'Market ids are derived from API responses rather than adapter plus market parameters.',
      'Collateral ids are always just the token symbol, not encoded addresses.'
    );
  }
  if (/socializes losses through share price depreciation|no shares are burned/i.test(clean)) {
    distractors.push(
      'Vault V2 burns depositor shares directly whenever a loss is realized.',
      'Losses are assigned only to users who touched the bad adapter most recently.',
      'Share price only goes up in Vault V2 because realized losses sit outside accounting.'
    );
  }
  if (/adaptivecurveirm targets 90% utilization/i.test(clean)) {
    distractors.push(
      'AdaptiveCurveIRM targets 50% utilization to minimize all volatility in rates.',
      'AdaptiveCurveIRM relies on governance votes instead of an onchain target utilization.',
      'AdaptiveCurveIRM has no target utilization; rates move only when an operator updates them.'
    );
  }
  if (/supply apy = borrowapy \* \(1 - fee\) \* utilization/i.test(clean)) {
    distractors.push(
      'Supply APY should equal borrow APY unless a vault-level reward is active.',
      'Supply APY is borrow APY divided by utilization and then increased by the fee.',
      'Supply APY is unrelated to borrow APY because lenders and borrowers are priced independently.'
    );
  }
  if (/liquidation price is the price that makes hf exactly 1/i.test(clean)) {
    distractors.push(
      'Liquidation price is the price where utilization reaches 100%.',
      'Liquidation price is only a UI estimate and cannot be tied directly to HF = 1.',
      'Liquidation price is the point where borrow APY exceeds supply APY.'
    );
  }
  if (/pre-liquidation is opt-in and separate from standard liquidation/i.test(clean)) {
    distractors.push(
      'Pre-liquidation replaces standard liquidation globally once enabled by governance.',
      'Pre-liquidation is mandatory for every market using a high LLTV.',
      'Standard liquidation only works after pre-liquidation has already failed.'
    );
  }
  if (/rounding direction matters|dust after deallocate is expected/i.test(clean)) {
    distractors.push(
      'Any residual dust after deallocate is proof the protocol accounting is broken.',
      'Rounding direction does not matter as long as values are close on the frontend.',
      'Shares and assets can be treated interchangeably if the user position is small.'
    );
  }
  if (/contracts are the source of truth|api is graphql, rate-limited, and should be cached/i.test(clean)) {
    distractors.push(
      'The API is the execution truth, so production actions can safely depend on it without onchain checks.',
      'Contracts should only be used for rare incidents, while dashboards and transactions can share API truth.',
      'Caching is mostly unnecessary if the partner polls frequently enough.'
    );
  }
  if (/accrue interest when presenting real-time debt|marketparams are the canonical identity/i.test(clean)) {
    distractors.push(
      'Real-time debt can be shown from stale shares without accruing interest if the UI refreshes often.',
      'Market identity is best treated as a display symbol plus chain id rather than MarketParams.',
      'Correct rounding direction is optional for read-only dashboards.'
    );
  }
  if (/permit flows reduce clicks|approval minimization is a product plus and a security plus/i.test(clean)) {
    distractors.push(
      'Permits remove the need to simulate end state because the wallet signs the full intent.',
      'Max approvals everywhere are the cleanest senior-engineering answer for product speed.',
      'Shares and assets become interchangeable once a permit flow is introduced.'
    );
  }
  if (/bundler3 is a call dispatcher|multicall\(call\[] calldata bundle\)|safe workflow composition/i.test(clean)) {
    distractors.push(
      'Bundler3 is mainly a gas coupon mechanism, not an atomic workflow primitive.',
      'Bundler3 only supports Morpho-native actions and cannot dispatch arbitrary calls.',
      'Atomicity matters mostly for analytics consistency, not for state safety.'
    );
  }
  if (/maximum graphql complexity is 1,000,000|rate limit is 5k requests per 5 minutes|degrade gracefully/i.test(clean)) {
    distractors.push(
      'The safest production plan is polling every query every 2 seconds until the cache is warm.',
      'If the API is rate-limited, execution-layer features should also pause because contracts depend on it.',
      'GraphQL complexity only matters in local development and not in production integration design.'
    );
  }
  if (/separate data-layer issues from execution-layer issues|never approve a production rollout without reviewing oracle assumptions/i.test(clean)) {
    distractors.push(
      'If a dashboard is wrong, assume the contracts are wrong first and escalate before checking decimals.',
      'Oracle assumptions can be deferred until after rollout if the UI has enough caveat text.',
      'Incident communication is optional if engineering already has enough logs.'
    );
  }

  if (/borrow dashboards should lead with hf and liquidation price/i.test(clean)) {
    distractors.push(
      'Borrow dashboards should lead with TVL and base APY to show market health first.',
      'Health Factor should be a secondary metric because partners primarily care about yield.',
      'Liquidation price is only relevant after the user is already liquidatable, so it need not be prominent.'
    );
  }
  if (/earn dashboards should separate native yield from incentives/i.test(clean)) {
    distractors.push(
      'Earn dashboards should combine base APY and reward APR into one number to avoid confusing users.',
      'Incentives should always be shown first because they drive partner adoption decisions.',
      'Separating yield components is unnecessary because users only care about the combined number.'
    );
  }
  if (/merkl recipe is educational, not production-ready/i.test(clean)) {
    distractors.push(
      'The Merkl recipe is a production-ready template that can be deployed without modification.',
      'The Merkl recipe is mainly a gas optimization tool, not a data-integration pattern.',
      'The Merkl recipe is only relevant for borrowers, not vault depositors.'
    );
  }
  if (/morpho graphql.*merkl rest.*standard combined-yield/i.test(clean)) {
    distractors.push(
      'The standard pattern is to fetch all yield data from Merkl REST and skip the Morpho GraphQL API.',
      'Combined yield dashboards should use only onchain reads to avoid API dependency.',
      'Merkl GraphQL is the canonical yield source; the Morpho API handles only claim flows.'
    );
  }
  if (/show base apy and rewards apr separately before showing combined yield/i.test(clean)) {
    distractors.push(
      'Always show combined yield first so partners see the headline number before the breakdown.',
      'Reward APR should be hidden by default because it is volatile and can mislead users.',
      'Separating yield components is optional UI polish and does not affect partner trust.'
    );
  }
  if (/lead with partner outcomes, then explain protocol primitives/i.test(clean)) {
    distractors.push(
      'Lead with protocol primitives first so partners understand the architecture before the benefits.',
      'Open calls with technical detail to establish credibility before discussing business outcomes.',
      'Protocol education should always precede any discussion of what the partner is trying to build.'
    );
  }
  if (/every technical claim should map to a business or operational benefit/i.test(clean)) {
    distractors.push(
      'Technical accuracy matters more than business framing on partner calls with engineering teams.',
      'Business framing should be saved for BD-only calls; technical partners prefer raw details.',
      'Protocol concepts stand on their own and do not need to be translated into business outcomes.'
    );
  }
  if (/oracle = 0 always means data pipeline failure|build dashboards to degrade gracefully/i.test(clean)) {
    distractors.push(
      'Oracle = 0 is a valid state indicating no collateral has been deposited yet.',
      'Dashboards should show blank screens when data is unavailable rather than showing stale values.',
      'Stale data should always trigger a full page reload rather than degraded display.'
    );
  }
  if (/keep all bigint math in bigint until the display layer/i.test(clean)) {
    distractors.push(
      'JavaScript floats are precise enough for DeFi math as long as values stay under 10^15.',
      'BigInt is only needed for the borrow share conversion, not for collateral or oracle math.',
      'Intermediate Number conversions in BigInt chains are safe if the final step uses BigInt.'
    );
  }
  if (/merkl updates.*8 hours|every 8 hours/i.test(clean)) {
    distractors.push(
      'Merkl updates claimable amounts every block, giving sub-second reward accuracy.',
      'Merkl updates once per day at midnight UTC to reduce onchain costs.',
      'Merkl updates are triggered manually by the curator when they submit a new campaign.'
    );
  }
  if (/dead deposit.*erc-4626 inflation|dead deposit required/i.test(clean)) {
    distractors.push(
      'Dead deposits are optional and only recommended for vaults with more than $1M TVL.',
      'ERC-4626 inflation attacks are not possible when the vault uses Morpho Blue as the underlying.',
      'The dead deposit protection is already built into the Vault V2 factory and does not require a manual step.'
    );
  }
  if (/fee wrapper.*vault v2.*fee layer|fee wrapper is a vault v2/i.test(clean)) {
    distractors.push(
      'Fee Wrapper is a standalone contract separate from Vault V2 with its own interface.',
      'Fee Wrapper can only be deployed by the Morpho registry and requires curator approval.',
      'Fee Wrapper is a Vault V1 extension that adds fee logic without the full Vault V2 role system.'
    );
  }
  if (/borrow shares convert up.*toassetsup|supply shares convert down.*toassetsdown/i.test(clean)) {
    distractors.push(
      'Both borrow and supply shares convert using round-down to minimize value leakage.',
      'Rounding direction is symmetric in Morpho — both supply and borrow round toward zero.',
      'Shares always convert at exactly the virtual-shares-adjusted price with no rounding.'
    );
  }
  if (/public allocator.*anyone.*reallocateto|public allocator solves/i.test(clean)) {
    distractors.push(
      'Public Allocator can only be called by the vault curator, not by external users.',
      'Public Allocator moves liquidity between vaults, not between markets within a vault.',
      'Public Allocator requires governance approval before each reallocation.'
    );
  }

  return dedupeTexts(distractors).slice(0, 3);
}

function buildMultiSelectSpec(bullet, lessonTitle) {
  const clean = sanitizeText(bullet);

  if (/five market parameters/i.test(clean)) {
    return {
      title: truncateFocusLabel(clean, 96),
      prompt: `Market parameters from "${lessonTitle}": select every immutable Morpho Blue market parameter.`,
      explanation: 'The immutable market parameter set is loan token, collateral token, oracle, IRM, and LLTV.',
      entries: [
        { text: 'Loan token', correct: true },
        { text: 'Collateral token', correct: true },
        { text: 'Oracle', correct: true },
        { text: 'IRM', correct: true },
        { text: 'LLTV', correct: true },
        { text: 'LIF', correct: false },
        { text: 'Health Factor', correct: false },
        { text: 'Rewards APR', correct: false }
      ],
      difficulty: 'hard',
      conceptKey: 'multi:market-parameters'
    };
  }

  if (/one collateral token \+ one loan token with its own oracle, IRM, and LLTV/i.test(clean)) {
    return {
      title: truncateFocusLabel(clean, 96),
      prompt: `Single-market definition from "${lessonTitle}": select every component that belongs in one Morpho Blue market.`,
      explanation: 'A market is defined by one collateral token, one loan token, plus its oracle, IRM, and LLTV.',
      entries: [
        { text: 'One collateral token', correct: true },
        { text: 'One loan token', correct: true },
        { text: 'Oracle', correct: true },
        { text: 'IRM', correct: true },
        { text: 'LLTV', correct: true },
        { text: 'Curator fee', correct: false },
        { text: 'Rewards APR', correct: false },
        { text: 'Vault share price', correct: false }
      ],
      difficulty: 'hard',
      conceptKey: 'multi:market-definition'
    };
  }

  if (/supports direct, inverse, multi-hop, and vault-conversion paths/i.test(clean)) {
    return {
      title: truncateFocusLabel(clean, 96),
      prompt: `MorphoChainlinkOracleV2 path support from "${lessonTitle}": select every supported oracle path.`,
      explanation: 'MorphoChainlinkOracleV2 supports direct, inverse, multi-hop, and vault-conversion paths.',
      entries: [
        { text: 'Direct path', correct: true },
        { text: 'Inverse path', correct: true },
        { text: 'Multi-hop path', correct: true },
        { text: 'Vault-conversion path', correct: true },
        { text: 'Manual frontend override path', correct: false },
        { text: 'Keeper-selected path', correct: false }
      ],
      difficulty: 'hard',
      conceptKey: 'multi:oracle-paths'
    };
  }
  if (/roles do not inherit permissions from one another/i.test(clean)) {
    return {
      title: truncateFocusLabel(clean, 96),
      prompt: `Vault V2 role separation from "${lessonTitle}": select every correct role statement.`,
      explanation: 'Vault V2 separates responsibilities: roles do not inherit permissions from one another.',
      entries: [
        { text: 'Roles do not inherit permissions from one another.', correct: true },
        { text: 'Owner is not automatically allowed to do everything Curator or Allocator can do.', correct: true },
        { text: 'A role separation model is part of the security story.', correct: true },
        { text: 'All operational roles collapse into Owner during emergencies.', correct: false },
        { text: 'Curator and Allocator are just two labels for the same permission set.', correct: false }
      ],
      difficulty: 'hard',
      conceptKey: 'multi:vault-v2-role-separation'
    };
  }
  if (/3 days|7 days|cap decreases are immediate|delayed risk increase, instant risk reduction/i.test(clean)) {
    return {
      title: truncateFocusLabel(clean, 96),
      prompt: `Immediate vs timelocked actions from "${lessonTitle}": select every action that is intentionally immediate.`,
      explanation: 'Vault V2 is designed around delayed risk increases and immediate risk reductions, such as cap decreases.',
      entries: [
        { text: 'Cap decreases', correct: true },
        { text: 'Other risk-reducing moves called out by the vault design', correct: true },
        { text: 'addAdapter', correct: false },
        { text: 'Risk-increasing cap raises', correct: false },
        { text: 'Critical registry changes with higher review windows', correct: false }
      ],
      difficulty: 'hard',
      conceptKey: 'multi:vault-v2-immediate-actions'
    };
  }
  if (/one underlying market at a time|no automatic withdrawal queue fallthrough/i.test(clean)) {
    return {
      title: truncateFocusLabel(clean, 96),
      prompt: `Liquidity-adapter behavior from "${lessonTitle}": select every correct statement.`,
      explanation: 'The liquidity adapter points to one underlying market at a time and does not automatically fall through a withdrawal queue.',
      entries: [
        { text: 'It points to one underlying market at a time.', correct: true },
        { text: 'There is no automatic withdrawal queue fallthrough inside that setup.', correct: true },
        { text: 'Operational illiquidity can still happen even if other markets exist in the adapter.', correct: true },
        { text: 'It always rotates through all configured markets automatically during withdrawal.', correct: false },
        { text: 'It guarantees liquidity as long as any market in the adapter has cash.', correct: false }
      ],
      difficulty: 'hard',
      conceptKey: 'multi:vault-v2-liquidity-adapter'
    };
  }
  if (/every allocation through marketv1adapterv2 must satisfy adapter, collateral, and market caps/i.test(clean)) {
    return {
      title: truncateFocusLabel(clean, 96),
      prompt: `MarketV1AdapterV2 cap layers from "${lessonTitle}": select every cap layer that must be satisfied.`,
      explanation: 'MarketV1AdapterV2 allocation must satisfy adapter, collateral, and market caps at the same time.',
      entries: [
        { text: 'Adapter cap', correct: true },
        { text: 'Collateral cap', correct: true },
        { text: 'Market cap', correct: true },
        { text: 'Rewards cap', correct: false },
        { text: 'GraphQL complexity cap', correct: false }
      ],
      difficulty: 'hard',
      conceptKey: 'multi:vault-v2-cap-layers'
    };
  }
  if (/contracts are the source of truth|use the api for dashboards; use contracts for transactions/i.test(clean)) {
    return {
      title: truncateFocusLabel(clean, 96),
      prompt: `Execution truth vs API reads from "${lessonTitle}": select every production-safe integration choice.`,
      explanation: 'Use contracts as execution truth, use the API for read-heavy surfaces, and design for degraded mode.',
      entries: [
        { text: 'Use contracts as the source of truth for execution.', correct: true },
        { text: 'Use the API for dashboards and indexed read paths.', correct: true },
        { text: 'Cache API responses and design degraded mode behavior.', correct: true },
        { text: 'Rely purely on the API for risk-critical execution paths.', correct: false },
        { text: 'Treat the API as a replacement for contract-level transaction checks.', correct: false }
      ],
      difficulty: 'hard',
      conceptKey: 'multi:integration-surface'
    };
  }
  if (/bundler3 is a call dispatcher|core entrypoint is multicall|coreadapter exposes the initiator|ideal for complex multi-step flows/i.test(clean)) {
    return {
      title: truncateFocusLabel(clean, 96),
      prompt: `Bundler3 foundations from "${lessonTitle}": select every accurate statement.`,
      explanation: 'Bundler3 is an atomic call-dispatch layer for complex workflows, with multicall entrypoint and initiator-aware adapter checks.',
      entries: [
        { text: 'Bundler3 is a call dispatcher for atomic execution.', correct: true },
        { text: 'The core entrypoint is multicall(Call[] calldata bundle).', correct: true },
        { text: 'CoreAdapter exposes the initiator for permission-aware adapter checks.', correct: true },
        { text: 'Bundler3 is only useful for lowering gas and not for state safety.', correct: false },
        { text: 'Bundler3 only supports one Morpho action per transaction.', correct: false }
      ],
      difficulty: 'hard',
      conceptKey: 'multi:bundler3-foundations'
    };
  }

  return null;
}

function deriveQuickLearningUnits(maps) {
  const moduleBullets = new Map();
  const moduleWhy = new Map();
  const moduleFormulas = new Map();
  const moduleDrills = new Map();
  const globalBullets = [];
  const globalWhy = [];
  const globalFormulas = [];
  const globalDrills = [];

  CURRICULUM_MODULES.forEach((module) => {
    moduleBullets.set(module.slug, []);
    moduleWhy.set(module.slug, []);
    moduleFormulas.set(module.slug, []);
    moduleDrills.set(module.slug, []);

    module.lessons.forEach((lesson) => {
      splitLessonBullets(lesson).forEach((bullet) => {
        moduleBullets.get(module.slug).push(bullet);
        globalBullets.push(bullet);
      });
      if (lesson.whyItMatters) {
        const why = sanitizeText(lesson.whyItMatters);
        moduleWhy.get(module.slug).push(why);
        globalWhy.push(why);
      }
      splitFormulaLines(lesson).forEach((formula) => {
        moduleFormulas.get(module.slug).push(formula);
        globalFormulas.push(formula);
      });
      if (lesson.interviewDrill) {
        const drill = sanitizeText(lesson.interviewDrill);
        moduleDrills.get(module.slug).push(drill);
        globalDrills.push(drill);
      }
    });
  });

  const units = [];

  CURRICULUM_MODULES.forEach((module) => {
    const moduleId = maps.moduleIdBySlug[module.slug];
    const siblingBullets = moduleBullets.get(module.slug) || [];
    const siblingWhy = moduleWhy.get(module.slug) || [];
    const siblingFormulas = moduleFormulas.get(module.slug) || [];
    const siblingDrills = moduleDrills.get(module.slug) || [];
    let order = 0;

    module.lessons.forEach((lesson, lessonIndex) => {
      const lessonId = maps.lessonIdByKey[`${module.slug}:${lessonIndex}`] || null;
      const ownBullets = splitLessonBullets(lesson);
      const ownFormulas = splitFormulaLines(lesson);
      const ownDrill = lesson.interviewDrill ? sanitizeText(lesson.interviewDrill) : '';
      const lessonConceptKeys = new Set();
      const bulletPool = [
        ...siblingBullets.filter((bullet) => !ownBullets.includes(bullet)),
        ...globalBullets
      ];
      const whyPool = [
        ...siblingWhy.filter((text) => text !== sanitizeText(lesson.whyItMatters || '')),
        ...globalWhy
      ];
      const formulaPool = [
        ...siblingFormulas.filter((formula) => !ownFormulas.includes(formula)),
        ...globalFormulas
      ];
      const drillPool = [
        ...siblingDrills.filter((prompt) => prompt !== ownDrill),
        ...globalDrills
      ];

      ownBullets.forEach((bullet, bulletIndex) => {
        const multiSelectSpec = buildMultiSelectSpec(bullet, lesson.title);
        if (multiSelectSpec) {
          if (lessonConceptKeys.has(multiSelectSpec.conceptKey)) {
            return;
          }
          lessonConceptKeys.add(multiSelectSpec.conceptKey);
          const shuffled = stableShuffleEntries(
            multiSelectSpec.entries,
            `${module.slug}:${lessonIndex}:bullet-multi:${bulletIndex}`
          );
          units.push({
            unitKey: `lesson-bullet:${module.slug}:${lessonIndex}:${bulletIndex}`,
            moduleId,
            lessonId,
            moduleSlug: module.slug,
            lessonTitle: lesson.title,
            sourceType: 'lesson-bullet',
            sourceRef: `${lesson.title}#must-know`,
            title: lesson.title,
            prompt: multiSelectSpec.prompt,
            choices: shuffled.choices,
            correctIndex: shuffled.correctIndex,
            correctIndexes: shuffled.correctIndexes,
            answerFormat: 'multi_select',
            acceptedAnswers: [],
            explanation: multiSelectSpec.explanation,
            difficulty: multiSelectSpec.difficulty,
            timingSeconds: timingForUnit({ difficulty: multiSelectSpec.difficulty, prompt: multiSelectSpec.prompt, choices: shuffled.choices }),
            conceptKey: multiSelectSpec.conceptKey,
            sortOrder: order++
          });
        } else {
          const prompt = buildSpecificBulletPrompt(lesson.title, bullet);
          let distractors = buildBulletDistractors(bullet);
          if (distractors.length < 3) {
            const extra = buildDistractors(bulletPool, bullet, 3);
            distractors = dedupeTexts([...distractors, ...extra]).slice(0, 3);
          }
          const explanation = `This lesson explicitly reinforces: ${bullet}`;
          if (shouldSeedChoiceUnit({ prompt, correctChoice: bullet, distractors, explanation })) {
            const difficulty = estimateDifficulty({ prompt, answer: bullet, sourceType: 'lesson-bullet' });
            const shuffled = stableShuffleChoices(bullet, distractors, `${module.slug}:${lessonIndex}:bullet:${bulletIndex}`);

            units.push({
              unitKey: `lesson-bullet:${module.slug}:${lessonIndex}:${bulletIndex}`,
              moduleId,
              lessonId,
              moduleSlug: module.slug,
              lessonTitle: lesson.title,
              sourceType: 'lesson-bullet',
              sourceRef: `${lesson.title}#must-know`,
              title: buildBulletTitle(lesson.title, bullet),
              prompt,
              choices: shuffled.choices,
              correctIndex: shuffled.correctIndex,
              correctIndexes: shuffled.correctIndexes,
              answerFormat: 'multiple_choice',
              acceptedAnswers: [],
              explanation,
              difficulty,
              timingSeconds: timingForUnit({ difficulty, prompt, choices: shuffled.choices }),
              conceptKey: sanitizeText(bullet).toLowerCase().slice(0, 80),
              sortOrder: order++
            });
          }
        }

      });

      if (lesson.whyItMatters) {
        const correct = sanitizeText(lesson.whyItMatters);
        const prompt = `Why does "${lesson.title}" matter in product or partner terms?`;
        const difficulty = estimateDifficulty({ prompt, answer: correct, sourceType: 'lesson-why' });
        const distractors = buildDistractors(whyPool, correct, 3);
        if (shouldSeedChoiceUnit({ prompt, correctChoice: correct, distractors, explanation: correct })) {
          const shuffled = stableShuffleChoices(correct, distractors, `${module.slug}:${lessonIndex}:why`);

          units.push({
            unitKey: `lesson-why:${module.slug}:${lessonIndex}`,
            moduleId,
            lessonId,
            moduleSlug: module.slug,
            lessonTitle: lesson.title,
            sourceType: 'lesson-why',
            sourceRef: `${lesson.title}#why-it-matters`,
            title: buildWhyTitle(lesson.title),
            prompt,
            choices: shuffled.choices,
            correctIndex: shuffled.correctIndex,
            correctIndexes: shuffled.correctIndexes,
            answerFormat: 'multiple_choice',
            acceptedAnswers: [],
            explanation: correct,
            difficulty,
            timingSeconds: timingForUnit({ difficulty, prompt, choices: shuffled.choices }),
            conceptKey: `why:${lesson.title.toLowerCase()}`,
            sortOrder: order++
          });
        }
      }

      ownFormulas.forEach((formulaLine, formulaIndex) => {
        const prompt = buildFormulaPrompt(lesson.title, formulaLine);
        const difficulty = estimateDifficulty({ prompt, answer: formulaLine, sourceType: 'lesson-formula', difficultyHint: 'hard' });
        const distractors = buildDistractors(formulaPool, formulaLine, 3);
        const formulaExplanation = `This formula line appears in the lesson: ${formulaLine}`;
        if (shouldSeedChoiceUnit({ prompt, correctChoice: formulaLine, distractors, explanation: formulaExplanation })) {
          const shuffled = stableShuffleChoices(formulaLine, distractors, `${module.slug}:${lessonIndex}:formula:${formulaIndex}`);

          units.push({
            unitKey: `lesson-formula:${module.slug}:${lessonIndex}:${formulaIndex}`,
            moduleId,
            lessonId,
            moduleSlug: module.slug,
            lessonTitle: lesson.title,
            sourceType: 'lesson-formula',
            sourceRef: `${lesson.title}#formula`,
            title: buildFormulaTitle(lesson.title),
            prompt,
            choices: shuffled.choices,
            correctIndex: shuffled.correctIndex,
            correctIndexes: shuffled.correctIndexes,
            answerFormat: 'multiple_choice',
            acceptedAnswers: [],
            explanation: formulaExplanation,
            difficulty,
            timingSeconds: timingForUnit({ difficulty, prompt, choices: shuffled.choices }),
            conceptKey: `formula:${sanitizeText(formulaLine).toLowerCase().slice(0, 80)}`,
            sortOrder: order++
          });
        }

      });

      if (ownDrill) {
        const prompt = buildDrillPrompt(lesson.title, ownDrill);
        const title = buildDrillTitle(lesson.title, ownDrill);
        const difficulty = estimateDifficulty({ prompt, answer: ownDrill, sourceType: 'lesson-drill', difficultyHint: 'medium' });
        const distractors = buildDistractors(drillPool, ownDrill, 3);
        const drillExplanation = `This is the lesson's partner-facing drill focus: ${ownDrill}`;
        if (shouldSeedChoiceUnit({ prompt, correctChoice: ownDrill, distractors, explanation: drillExplanation })) {
          const shuffled = stableShuffleChoices(ownDrill, distractors, `${module.slug}:${lessonIndex}:drill`);

          units.push({
            unitKey: `lesson-drill:${module.slug}:${lessonIndex}`,
            moduleId,
            lessonId,
            moduleSlug: module.slug,
            lessonTitle: lesson.title,
            sourceType: 'lesson-drill',
            sourceRef: `${lesson.title}#interview-drill`,
            title,
            prompt,
            choices: shuffled.choices,
            correctIndex: shuffled.correctIndex,
            correctIndexes: shuffled.correctIndexes,
            answerFormat: 'multiple_choice',
            acceptedAnswers: [],
            explanation: drillExplanation,
            difficulty,
            timingSeconds: timingForUnit({ difficulty, prompt, choices: shuffled.choices }),
            conceptKey: `drill:${lesson.title.toLowerCase()}`,
            sortOrder: order++
          });
        }
      }
    });
  });

  QUIZ_QUESTIONS.forEach((question, index) => {
    const moduleId = maps.moduleIdBySlug[question.module_slug];
    if (!moduleId) return;

    const difficulty = estimateDifficulty({
      prompt: question.q,
      answer: question.options[question.correct],
      sourceType: 'quiz-bank',
      difficultyHint: question.difficulty
    });

    units.push({
      unitKey: `quiz-bank:${question.module_slug}:${index}`,
      moduleId,
      lessonId: null,
      moduleSlug: question.module_slug,
      lessonTitle: null,
      sourceType: 'quiz-bank',
      sourceRef: `quiz-bank:${index}`,
      title: buildQuizTitle(question, index),
      prompt: sanitizeText(question.q),
      choices: question.options.map((option) => sanitizeText(option)),
      correctIndex: question.correct,
      correctIndexes: [question.correct],
      answerFormat: 'multiple_choice',
      acceptedAnswers: [],
      explanation: sanitizeText(question.explanation),
      difficulty,
      timingSeconds: timingForUnit({ difficulty, prompt: question.q, choices: question.options }),
      conceptKey: `${question.category}:${index}`,
      sortOrder: 1000 + index
    });
  });

  return units.filter(isValidQuickLearningUnit);
}

function seedQuickLearningUnits(db, maps) {
  const insert = db.prepare(`
    INSERT INTO quick_learning_units (
      unit_key, module_id, lesson_id, module_slug, lesson_title, source_type, source_ref,
      title, prompt, choices, correct_index, correct_indexes, answer_format, accepted_answers, explanation, difficulty, timing_seconds, concept_key, sort_order, active
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);

  const units = deriveQuickLearningUnits(maps);

  units.forEach((unit) => {
    insert.run(
      unit.unitKey,
      unit.moduleId,
      unit.lessonId,
      unit.moduleSlug,
      unit.lessonTitle,
      unit.sourceType,
      unit.sourceRef,
      unit.title || '',
      unit.prompt,
      JSON.stringify(unit.choices),
      unit.correctIndex,
      JSON.stringify(unit.correctIndexes || [unit.correctIndex]),
      unit.answerFormat || 'multiple_choice',
      JSON.stringify(unit.acceptedAnswers || []),
      unit.explanation,
      unit.difficulty,
      unit.timingSeconds,
      unit.conceptKey,
      unit.sortOrder
    );
  });

  console.log(`  ✓ Seeded ${units.length} quick learning units`);
}

function getModuleQuickLearningSnapshot(db, moduleId, userId = 1) {
  const totalUnits = db.prepare(`
    SELECT COUNT(*) AS count
    FROM quick_learning_units
    WHERE module_id = ? AND active = 1 AND answer_format != 'typed'
  `).get(moduleId).count;

  const masteredUnits = db.prepare(`
    SELECT COUNT(*) AS count
    FROM quick_learning_mastery
    WHERE user_id = ? AND module_id = ? AND mastered = 1
  `).get(userId, moduleId).count;

  const totals = db.prepare(`
    SELECT
      COALESCE(SUM(times_correct), 0) AS totalCorrect,
      COALESCE(SUM(times_wrong), 0) AS totalWrong,
      COALESCE(SUM(times_seen), 0) AS totalSeen
    FROM quick_learning_mastery
    WHERE user_id = ? AND module_id = ?
  `).get(userId, moduleId);

  return {
    totalUnits,
    masteredUnits,
    masteryPercent: totalUnits ? Math.round((masteredUnits / totalUnits) * 100) : 0,
    questionsRemainingForMastery: Math.max(0, totalUnits - masteredUnits),
    totalCorrect: totals.totalCorrect || 0,
    totalWrong: totals.totalWrong || 0,
    totalSeen: totals.totalSeen || 0
  };
}

function buildSessionQueue(db, moduleId, userId = 1) {
  const units = db.prepare(`
    SELECT
      u.unit_key,
      u.sort_order,
      COALESCE(m.mastered, 0) AS mastered,
      COALESCE(m.times_wrong, 0) AS times_wrong,
      COALESCE(m.times_seen, 0) AS times_seen
    FROM quick_learning_units u
    LEFT JOIN quick_learning_mastery m
      ON m.unit_key = u.unit_key
     AND m.module_id = u.module_id
     AND m.user_id = ?
    WHERE u.module_id = ? AND u.active = 1 AND u.answer_format != 'typed'
    ORDER BY mastered ASC, times_wrong DESC, times_seen ASC, u.sort_order ASC
  `).all(userId, moduleId);

  const queue = units.filter((unit) => !unit.mastered).map((unit) => unit.unit_key);
  if (queue.length) return queue;
  return units.map((unit) => unit.unit_key);
}

function getUnitByKey(db, moduleId, unitKey) {
  const row = db.prepare(`
    SELECT *
    FROM quick_learning_units
    WHERE module_id = ? AND unit_key = ? AND active = 1 AND answer_format != 'typed'
  `).get(moduleId, unitKey);

  if (!row) return null;

  return {
    unitKey: row.unit_key,
    prompt: row.prompt,
    title: row.title || row.prompt,
    choices: JSON.parse(row.choices || '[]'),
    correctIndex: row.correct_index,
    correctIndexes: JSON.parse(row.correct_indexes || '[]'),
    answerFormat: row.answer_format || 'multiple_choice',
    acceptedAnswers: JSON.parse(row.accepted_answers || '[]'),
    explanation: row.explanation,
    difficulty: row.difficulty,
    timingSeconds: row.timing_seconds,
    sourceType: row.source_type,
    lessonTitle: row.lesson_title
  };
}

function computePerformanceRating({ accuracyPercent, paceRatio, bestStreak, wrongCount }) {
  if (accuracyPercent >= 93 && paceRatio <= 0.68 && bestStreak >= 10) {
    return { label: 'Locked In', tone: 'elite' };
  }
  if (accuracyPercent >= 85 && paceRatio <= 0.82 && bestStreak >= 7) {
    return { label: 'Clean', tone: 'strong' };
  }
  if (accuracyPercent >= 72 && wrongCount <= Math.max(12, bestStreak + 4)) {
    return { label: 'Tight', tone: 'solid' };
  }
  return { label: 'Brutal', tone: 'grindy' };
}

function buildCompletionSummary(sessionLike, snapshot) {
  const answeredCount = sessionLike.answered_count || sessionLike.answeredCount || 0;
  const totalResponseMs = sessionLike.total_response_ms || sessionLike.totalResponseMs || 0;
  const avgResponseMs = answeredCount ? Math.round(totalResponseMs / answeredCount) : 0;
  const answeredForAccuracy = Math.max(1, (sessionLike.correct_count || sessionLike.correct || 0) + (sessionLike.wrong_count || sessionLike.incorrect || 0));
  const accuracyPercent = Math.round(((sessionLike.correct_count || sessionLike.correct || 0) / answeredForAccuracy) * 100);
  const theoreticalMaxMs = Math.max(1, snapshot.totalSeen) * 12000;
  const paceRatio = totalResponseMs ? Math.min(2, totalResponseMs / theoreticalMaxMs) : 1;
  const rating = computePerformanceRating({
    accuracyPercent,
    paceRatio,
    bestStreak: sessionLike.best_streak || sessionLike.bestStreak || 0,
    wrongCount: sessionLike.wrong_count || sessionLike.incorrect || 0
  });

  return {
    answeredCount,
    avgResponseMs,
    avgResponseSeconds: avgResponseMs ? (avgResponseMs / 1000).toFixed(1) : '0.0',
    accuracyPercent,
    paceRatio,
    rating
  };
}

function recordCompletion(db, sessionId, sessionLike, snapshot, userId = 1) {
  const completion = buildCompletionSummary(sessionLike, snapshot);
  db.prepare(`
    INSERT INTO quick_learning_completions (
      user_id, module_id, session_id, medal_label, medal_tone, accuracy_percent,
      avg_response_ms, best_streak, total_correct, total_wrong, pressure_mode
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    userId,
    sessionLike.module_id || sessionLike.moduleId,
    sessionId,
    completion.rating.label,
    completion.rating.tone,
    completion.accuracyPercent,
    completion.avgResponseMs,
    sessionLike.best_streak || sessionLike.bestStreak || 0,
    sessionLike.correct_count || sessionLike.correct || 0,
    sessionLike.wrong_count || sessionLike.incorrect || 0,
    sessionLike.pressure_mode ? 1 : 0
  );
  return completion;
}

function getQuickLearningHistory(db, userId = 1, limit = 12) {
  return db.prepare(`
    SELECT
      qlc.*,
      m.title AS module_title
    FROM quick_learning_completions qlc
    JOIN curriculum_modules m ON m.id = qlc.module_id
    WHERE qlc.user_id = ?
    ORDER BY qlc.completed_at DESC, qlc.id DESC
    LIMIT ?
  `).all(userId, limit);
}

function getOrCreateQuickLearningSession(db, moduleId, userId = 1, pressureMode = false) {
  const module = db.prepare(`SELECT id, slug, title FROM curriculum_modules WHERE id = ?`).get(moduleId);
  if (!module) {
    throw new Error('Module not found');
  }

  const existing = db.prepare(`
    SELECT * FROM quick_learning_sessions
    WHERE user_id = ? AND module_id = ? AND status = 'active'
    ORDER BY started_at DESC
    LIMIT 1
  `).get(userId, moduleId);

  if (existing) {
    if (Boolean(existing.pressure_mode) !== Boolean(pressureMode)) {
      db.prepare(`
        UPDATE quick_learning_sessions
        SET status = 'abandoned', updated_at = datetime('now')
        WHERE id = ?
      `).run(existing.id);
      return getOrCreateQuickLearningSession(db, moduleId, userId, pressureMode);
    }
    const queue = JSON.parse(existing.queue_state || '[]');
    const currentUnitKey = existing.current_unit_key || queue[0] || null;
    const unit = currentUnitKey ? getUnitByKey(db, moduleId, currentUnitKey) : null;
    if (!unit && currentUnitKey) {
      db.prepare(`
        UPDATE quick_learning_sessions
        SET status = 'abandoned', updated_at = datetime('now')
        WHERE id = ?
      `).run(existing.id);
      return getOrCreateQuickLearningSession(db, moduleId, userId);
    }
    return {
      sessionId: existing.id,
      module,
      status: existing.status,
      stats: {
        correct: existing.correct_count,
        incorrect: existing.wrong_count,
        streak: existing.current_streak,
        bestStreak: existing.best_streak,
        answeredCount: existing.answered_count || 0,
        avgResponseMs: existing.answered_count ? Math.round((existing.total_response_ms || 0) / existing.answered_count) : 0,
        pressureMode: Boolean(existing.pressure_mode),
        ...getModuleQuickLearningSnapshot(db, moduleId, userId)
      },
      question: unit
    };
  }

  const queue = buildSessionQueue(db, moduleId, userId);
  const currentUnitKey = queue[0] || null;

  const result = db.prepare(`
    INSERT INTO quick_learning_sessions (
      user_id, module_id, status, queue_state, asked_order, current_unit_key, pressure_mode, mastery_percent
    )
    VALUES (?, ?, 'active', ?, '[]', ?, ?, ?)
  `).run(
    userId,
    moduleId,
    JSON.stringify(queue),
    currentUnitKey,
    pressureMode ? 1 : 0,
    getModuleQuickLearningSnapshot(db, moduleId, userId).masteryPercent
  );

  return getOrCreateQuickLearningSession(db, moduleId, userId, pressureMode);
}

function getQuickLearningSession(db, sessionId, userId = 1) {
  const session = db.prepare(`
    SELECT s.*, m.title AS module_title, m.slug AS module_slug
    FROM quick_learning_sessions s
    JOIN curriculum_modules m ON m.id = s.module_id
    WHERE s.id = ? AND s.user_id = ?
  `).get(sessionId, userId);

  if (!session) {
    throw new Error('Session not found');
  }

  const queue = JSON.parse(session.queue_state || '[]');
  const currentUnitKey = session.current_unit_key || queue[0] || null;
  const unit = currentUnitKey ? getUnitByKey(db, session.module_id, currentUnitKey) : null;
  if (!unit && currentUnitKey) {
    db.prepare(`
      UPDATE quick_learning_sessions
      SET status = 'abandoned', updated_at = datetime('now')
      WHERE id = ?
    `).run(session.id);
    return getOrCreateQuickLearningSession(db, session.module_id, userId);
  }

  return {
    sessionId: session.id,
    module: {
      id: session.module_id,
      slug: session.module_slug,
      title: session.module_title
    },
    status: session.status,
    stats: {
      correct: session.correct_count,
      incorrect: session.wrong_count,
      streak: session.current_streak,
      bestStreak: session.best_streak,
      answeredCount: session.answered_count || 0,
      avgResponseMs: session.answered_count ? Math.round((session.total_response_ms || 0) / session.answered_count) : 0,
      pressureMode: Boolean(session.pressure_mode),
      ...getModuleQuickLearningSnapshot(db, session.module_id, userId)
    },
    question: unit
  };
}

function isTypedAnswerCorrect(unit, typedAnswer) {
  const normalizedTyped = normalizeAnswer(typedAnswer);
  if (!normalizedTyped) return false;

  const accepted = (unit.acceptedAnswers || []).map(normalizeAnswer).filter(Boolean);
  return accepted.some((candidate) =>
    normalizedTyped === candidate ||
    normalizedTyped.includes(candidate) ||
    candidate.includes(normalizedTyped)
  );
}

function isMultiSelectCorrect(unit, selectedIndices) {
  const selected = Array.isArray(selectedIndices)
    ? selectedIndices.map((value) => Number(value)).filter((value) => Number.isInteger(value))
    : [];
  const expected = Array.isArray(unit.correctIndexes) && unit.correctIndexes.length
    ? unit.correctIndexes.map((value) => Number(value)).filter((value) => Number.isInteger(value))
    : [Number(unit.correctIndex)];

  const selectedSorted = [...new Set(selected)].sort((a, b) => a - b);
  const expectedSorted = [...new Set(expected)].sort((a, b) => a - b);

  return selectedSorted.length === expectedSorted.length &&
    selectedSorted.every((value, index) => value === expectedSorted[index]);
}

function upsertMasteryRow(db, moduleId, unitKey, result, userId = 1) {
  const existing = db.prepare(`
    SELECT *
    FROM quick_learning_mastery
    WHERE user_id = ? AND module_id = ? AND unit_key = ?
  `).get(userId, moduleId, unitKey);

  if (!existing) {
    if (result === 'correct') {
      db.prepare(`
        INSERT INTO quick_learning_mastery (
          user_id, module_id, unit_key, times_seen, times_correct, times_wrong, mastered, last_result, last_seen_at, mastered_at
        )
        VALUES (?, ?, ?, 1, 1, 0, 1, ?, datetime('now'), datetime('now'))
      `).run(userId, moduleId, unitKey, result);
    } else {
      db.prepare(`
        INSERT INTO quick_learning_mastery (
          user_id, module_id, unit_key, times_seen, times_correct, times_wrong, mastered, last_result, last_seen_at
        )
        VALUES (?, ?, ?, 1, 0, 1, 0, ?, datetime('now'))
      `).run(userId, moduleId, unitKey, result);
    }
    return;
  }

  const nextSeen = existing.times_seen + 1;
  const nextCorrect = existing.times_correct + (result === 'correct' ? 1 : 0);
  const nextWrong = existing.times_wrong + (result === 'correct' ? 0 : 1);
  const nextMastered = existing.mastered || result === 'correct';

  db.prepare(`
    UPDATE quick_learning_mastery
    SET
      times_seen = ?,
      times_correct = ?,
      times_wrong = ?,
      mastered = ?,
      last_result = ?,
      last_seen_at = datetime('now'),
      mastered_at = CASE
        WHEN mastered = 0 AND ? = 1 THEN datetime('now')
        ELSE mastered_at
      END
    WHERE id = ?
  `).run(
    nextSeen,
    nextCorrect,
    nextWrong,
    nextMastered ? 1 : 0,
    result,
    nextMastered ? 1 : 0,
    existing.id
  );
}

function reinjectUnit(queue, unitKey, wrongCount) {
  const cleanQueue = queue.filter((key) => key !== unitKey);
  const offset = Math.min(cleanQueue.length, 2 + Math.min(wrongCount, 4));
  cleanQueue.splice(offset, 0, unitKey);
  return cleanQueue;
}

function answerQuickLearning(db, sessionId, selectedIndex, timedOut = false, responseTimeMs = 0, userId = 1, typedAnswer = '', selectedIndices = []) {
  const session = db.prepare(`
    SELECT * FROM quick_learning_sessions
    WHERE id = ? AND user_id = ? AND status = 'active'
  `).get(sessionId, userId);

  if (!session) {
    throw new Error('Active session not found');
  }

  let queue = JSON.parse(session.queue_state || '[]');
  const currentUnitKey = session.current_unit_key || queue[0];
  const currentUnit = getUnitByKey(db, session.module_id, currentUnitKey);

  if (!currentUnit) {
    throw new Error('Current unit not found');
  }

  const correct = currentUnit.answerFormat === 'typed'
    ? (!timedOut && isTypedAnswerCorrect(currentUnit, typedAnswer))
    : currentUnit.answerFormat === 'multi_select'
      ? (!timedOut && isMultiSelectCorrect(currentUnit, selectedIndices))
    : (Number(selectedIndex) === Number(currentUnit.correctIndex) && !timedOut);
  const result = correct ? 'correct' : (timedOut ? 'timeout' : 'wrong');

  upsertMasteryRow(db, session.module_id, currentUnitKey, correct ? 'correct' : 'wrong', userId);

  const masteryRow = db.prepare(`
    SELECT times_wrong, mastered
    FROM quick_learning_mastery
    WHERE user_id = ? AND module_id = ? AND unit_key = ?
  `).get(userId, session.module_id, currentUnitKey);

  queue = queue.filter((key) => key !== currentUnitKey);
  if (!correct) {
    queue = reinjectUnit(queue, currentUnitKey, masteryRow?.times_wrong || 1);
  }

  const askedOrder = JSON.parse(session.asked_order || '[]');
  askedOrder.push(currentUnitKey);

  const correctCount = session.correct_count + (correct ? 1 : 0);
  const wrongCount = session.wrong_count + (correct ? 0 : 1);
  const currentStreak = correct ? session.current_streak + 1 : 0;
  const bestStreak = Math.max(session.best_streak, currentStreak);
  const answeredCount = (session.answered_count || 0) + 1;
  const totalResponseMs = (session.total_response_ms || 0) + Math.max(0, Number(responseTimeMs) || 0);
  const snapshot = getModuleQuickLearningSnapshot(db, session.module_id, userId);

  let nextUnitKey = queue[0] || null;
  let status = 'active';
  let endedAt = null;

  if (!nextUnitKey && snapshot.questionsRemainingForMastery > 0) {
    queue = buildSessionQueue(db, session.module_id, userId);
    nextUnitKey = queue[0] || null;
  }

  if (!nextUnitKey && snapshot.questionsRemainingForMastery === 0) {
    status = 'completed';
    endedAt = "datetime('now')";
  }

  db.prepare(`
    UPDATE quick_learning_sessions
    SET
      status = ?,
      queue_state = ?,
      asked_order = ?,
      current_unit_key = ?,
      correct_count = ?,
      wrong_count = ?,
      current_streak = ?,
      best_streak = ?,
      answered_count = ?,
      total_response_ms = ?,
      mastery_percent = ?,
      updated_at = datetime('now'),
      ended_at = CASE WHEN ? = 'completed' THEN datetime('now') ELSE ended_at END
    WHERE id = ?
  `).run(
    status,
    JSON.stringify(queue),
    JSON.stringify(askedOrder),
    nextUnitKey,
    correctCount,
    wrongCount,
    currentStreak,
    bestStreak,
    answeredCount,
    totalResponseMs,
    snapshot.masteryPercent,
    status,
    session.id
  );

  const nextQuestion = nextUnitKey ? getUnitByKey(db, session.module_id, nextUnitKey) : null;

  const completion = status === 'completed'
    ? recordCompletion(
        db,
        session.id,
        {
          module_id: session.module_id,
          correct_count: correctCount,
          wrong_count: wrongCount,
          best_streak: bestStreak,
          answered_count: answeredCount,
          total_response_ms: totalResponseMs,
          pressure_mode: session.pressure_mode
        },
        snapshot
      )
    : null;

  return {
    result,
    correct,
    correctIndex: currentUnit.correctIndex,
    correctIndexes: currentUnit.correctIndexes,
    correctAnswer: currentUnit.answerFormat === 'typed'
      ? (currentUnit.acceptedAnswers?.[0] || currentUnit.choices?.[currentUnit.correctIndex] || '')
      : currentUnit.answerFormat === 'multi_select'
        ? currentUnit.correctIndexes.map((index) => currentUnit.choices[index]).filter(Boolean).join(', ')
      : currentUnit.choices[currentUnit.correctIndex],
    explanation: currentUnit.explanation,
    stats: {
      correct: correctCount,
      incorrect: wrongCount,
      streak: currentStreak,
      bestStreak,
      answeredCount,
      avgResponseMs: answeredCount ? Math.round(totalResponseMs / answeredCount) : 0,
      ...snapshot
    },
    status,
    completion,
    nextQuestion
  };
}

function resetQuickLearningModule(db, moduleId, userId = 1) {
  db.prepare(`
    DELETE FROM quick_learning_mastery
    WHERE user_id = ? AND module_id = ?
  `).run(userId, moduleId);

  db.prepare(`
    DELETE FROM quick_learning_sessions
    WHERE user_id = ? AND module_id = ?
  `).run(userId, moduleId);
}

module.exports = {
  seedQuickLearningUnits,
  getModuleQuickLearningSnapshot,
  getOrCreateQuickLearningSession,
  getQuickLearningSession,
  answerQuickLearning,
  resetQuickLearningModule,
  getQuickLearningHistory
};
