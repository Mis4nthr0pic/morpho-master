/**
 * Morpho Partner Engineer Bootcamp
 * 10 modules / 46 lessons
 * Sources: morpho.txt saved from docs.morpho.org + official docs structure as of March 2026
 */

const { COMPLEMENTARY_LESSON_APPENDICES } = require('./complementary-data');

const docs = (...refs) => refs.map(([title, url]) => ({ title, url }));

const lesson = ({
  title,
  body,
  mustMemorize,
  formulas = '',
  whyItMatters,
  interviewDrill,
  estimatedMinutes,
  docsRefs
}) => ({
  title,
  body: enrichLessonBody({ title, body, mustMemorize, formulas, whyItMatters, interviewDrill }),
  mustMemorize,
  formulas,
  whyItMatters,
  interviewDrill,
  estimatedMinutes,
  docsRefs
});

const buildStandardLessonAppendix = ({ mustMemorize, formulas, whyItMatters, interviewDrill }) => {
  const memoBullets = mustMemorize.slice(0, 3).map((item) => `- ${item}`).join('\n');
  const formulaNote = formulas
    ? `## Formula check\n\nDo not memorize symbols in isolation. Be able to say what each input means, what the scaling is, and what product decision changes if the number moves.\n`
    : '';

  return `## What to retain without reopening the docs

${memoBullets}

${formulaNote}## Call-ready framing

${whyItMatters}

If you get pressed for an example, fall back to this drill:

${interviewDrill}`;
};

const LESSON_APPENDICES = {
  'Morpho Blue in One Minute': `## Deeper detail

Morpho Blue is easiest to misunderstand when people treat it like a branded lending app instead of a base primitive. The docs position it as a market architecture: one market per exact set of parameters, with no later mutation of the core risk tuple. That matters because partners evaluating diligence want to know whether "risk can move under them" after launch.

The self-contained way to explain it is:

- the market identity is fixed by the five parameters
- the state inside that market evolves over time through supply, borrow, interest accrual, and liquidation
- the risk design itself does not morph because someone passed governance later

For partner calls, always separate "permissionless market creation" from "approved oracle and IRM components." That prevents you from implying that literally any arbitrary risk module can be attached.`,
  'Isolated vs Pooled Lending': `## Deeper detail

The strongest isolated-vs-pooled explanation is not moral or tribal. It is about failure domains and customization. In pooled systems, asset decisions share a broader balance-sheet consequence. In Morpho, each market has its own failure domain, which makes listing and diligence conversations much more local.

What to say when a partner pushes back:

- pooled systems can be simpler for standardized money markets
- isolated markets are stronger when the partner needs dedicated collateral design, custom oracle choice, or a tailored LLTV
- the trade-off is more market-by-market monitoring discipline, not zero operational work`,
  'Market IDs, Addresses, and Contract Landmarks': `## Deeper detail

This lesson should be treated like an operator checklist, not trivia. What you really need to know cold is which addresses are canonical enough to quote from memory and which addresses should always be re-verified from the official registry before deployment, demos, or support.

Use this order:

1. quote the Blue contract from memory because it is the core primitive
2. quote Bundler3 only if the workflow depends on atomic flows
3. verify factories, registries, and adapters live on the addresses page before giving a final answer

That behavior makes you sound production-minded instead of performative.`,
  'Collateral, LTV, and Health Factor': `## Deeper detail

When partners confuse LTV and health factor, they usually treat them as two unrelated risk metrics. They are not. LTV tells you the current leverage level. Health factor tells you how much room remains before the current debt breaches the market's allowed limit.

A clean mental model:

- collateral value is the denominator foundation
- LLTV transforms collateral value into the protocol's max debt line
- health factor compares that max line to the debt actually drawn

That is why HF is so useful in UX. A user may not know what 82% LTV means instinctively, but they can understand that a safety buffer ratio has moved dangerously close to 1.`,
  'Liquidation Math, LIF, and Bad Debt': `## Deeper detail

The subtle point many candidates miss is that liquidation eligibility and full debt recovery are different questions. Crossing LLTV makes liquidation possible. Crossing the bad-debt threshold means even a perfectly executed liquidation may not repay everything because the collateral left is insufficient after incentive math.

The safest explanation on a live call is:

- Morpho does not guarantee liquidation execution
- it creates an economic incentive for permissionless liquidators to act
- if market conditions move too fast, some residual debt can remain

That is accurate, empathetic, and avoids overselling protocol guarantees.`,
  'Oracles, Pricing, and Why 1e36 Matters': `## Deeper detail

This lesson becomes much easier once you stop thinking in USD-first terms. Morpho oracles are expressing collateral in units of the loan token, scaled by 1e36. USD may be a downstream interpretation, but it is not the protocol-native assumption.

Operationally, this means:

- read the actual quote pair before building UI math
- normalize the returned value at 1e36, not token-decimal scale
- verify whether a vault conversion layer or multi-hop route exists

A lot of "protocol bugs" reported by partners are actually quote-unit mistakes.`,
  'What Vault V2 Actually Is': `## Deeper detail

Vault V2 is easiest to explain as a managed allocation shell with explicit governance and allocation layers. Depositors enter the vault, but the vault does not magically own one hardcoded strategy. It routes assets through adapters under caps and role controls.

The front-end implication is important enough to say out loud: if a team has only built against vanilla ERC4626 vaults, they need to know Vault V2 intentionally takes a conservative stance on max* helpers. If they ignore that and build "max" buttons from ERC4626 assumptions, they will create broken UX.`,
  'Roles and Exact Permissions': `## Deeper detail

This lesson matters because partners often assume "owner can do everything." Vault V2 was designed to avoid that shortcut. The split is there so the person defining strategy, the person executing allocations, and the person braking risk do not collapse into one omnipotent role.

The practical support value is obvious:

- if a cap changed, look at curator authority
- if funds moved inside allowed bounds, look at allocator behavior
- if a pending risk increase disappeared, a sentinel may have revoked it

You debug faster when you think in role boundaries, not vault-level vagueness.`,
  'Timelocks: What Is Immediate vs Timelocked': `## Deeper detail

Treat timelocks as depositor exit rights expressed in protocol design. That sentence lands well with curators and institutions. The protocol delays actions that can widen risk and accelerates actions that can reduce risk.

This is also where many partner misunderstandings happen:

- "permissionless" does not mean "instantly mutable"
- "curator-managed" does not mean "curator can do anything right now"
- "emergency response" does not require waiting for the same long delay as a risk increase

That balance is the story you should tell.`,
  'Adapters, Factories, and Liquidity Adapter Flow': `## Deeper detail

Adapters are where Vault V2 stops being a simple wrapper and becomes a generalized managed architecture. The vault can route exposure through different adapter types, but the deposit and withdrawal path still depends heavily on the configured liquidity adapter.

The key operational implication is that "the vault has other allocations" does not automatically mean a withdrawal is frictionless. If the liquidity adapter points to one market, that specific market path matters for user exit behavior. That is the sort of nuance partner engineers are expected to catch before a dashboard overpromises liquidity.`,
  'Caps System: Absolute, Relative, and Abstract IDs': `## Deeper detail

This is one of the most important architecture lessons in the entire curriculum. Abstract ids let curators define constraints around reusable risk factors rather than only one literal market row. That is a big reason Vault V2 feels more like a risk engine than a thin vault wrapper.

Explain it with concrete examples:

- market cap limits one exact market path
- collateral cap limits aggregate exposure to one collateral across paths
- adapter cap limits aggregate exposure to the strategy channel itself

All three can matter at once, and all three must pass for allocation to occur.`,
  'Loss Socialization and Share Price Depreciation': `## Deeper detail

A lot of people intuitively want losses to be "assigned to the bad bucket only." Vault V2 does not work that way once assets are pooled at the vault share layer. The share price becomes the mechanism that reflects aggregate asset reality for all depositors.

That means your explanation to depositors should be direct:

- the vault share represents a proportional claim on total assets
- if total assets go down, each share claims less
- the protocol reflects that economically instead of pretending the loss is elsewhere

It is harsher than a marketing answer, but it is the technically honest one.`,
  'Formula Sheet: Position Math': `## Deeper detail

Do not learn these formulas as static flashcards only. For interview use, you should be able to narrate them in sequence. Start from collateral amount and price, compute collateral value, apply LLTV, compare to debt, then infer HF and liquidation price.

If you can say the sequence out loud without hesitating, you will sound much more credible than someone reciting equations without interpretation.`,
  'AdaptiveCurveIRM APY Math': `## Deeper detail

The important product intuition is not the exact JavaScript snippet. It is why the curve behaves the way it does. Below target utilization, rates should still encourage demand to rise toward productive usage. Above target utilization, rates should steepen enough to discourage excessive borrowing and attract supply.

Supply APY being lower than borrow APY is not a bug. Some value is lost to protocol fee and some to the fact that unused liquidity is not borrowed. That is why utilization sits directly inside the supply-side formula.`,
  'Liquidation Regimes, Pre-Liquidation, and Incentive Math': `## Deeper detail

Pre-liquidation should not be described as "Morpho always liquidates earlier." It is an opt-in design surface that can create a softer intervention zone before full liquidation, depending on how the market or system is configured.

When talking to partners, keep the hierarchy straight:

- standard liquidation is the default regime to understand first
- pre-liquidation is an optional extension, not the base rule
- permissionless liquidators remain central to execution incentives in both cases`,
  'Shares, Assets, Rounding, and UX Safety Buffers': `## Deeper detail

Share accounting is where many frontend teams quietly get themselves into trouble. Users think in assets. The protocol often tracks position state in shares. Conversions are not symmetrical if rounding direction matters for safety.

Translate that into product rules:

- preview the user-facing asset outcome before signing
- use conservative rounding for liabilities
- never treat a dust remainder as evidence of protocol insolvency

Those are the habits that keep support queues calm.`,
  'Choosing the Right Integration Surface': `## Deeper detail

This lesson is really about decision discipline. A senior integration engineer should be able to say why a particular data or execution surface is appropriate instead of defaulting to whichever library looks convenient.

A clean heuristic:

- contracts for correctness and settlement
- GraphQL for indexed discovery and broad dashboards
- SDKs for typed developer ergonomics
- Merkl REST when you need reward-program or claim-specific context

Partners trust you more when you can justify the split clearly.`,
  'Blue SDK and Direct Contract Patterns': `## Deeper detail

SDKs help, but the interview-safe stance is that typed abstractions do not remove the need to understand core contract semantics. If the SDK output and the UI disagree, you still need to reason from market params, share balances, oracle reads, and interest accrual.

That is why a good answer sounds like:

"I would use the SDK for speed, but I would still verify market identity, share conversion, and accrued state against contract semantics before trusting the dashboard."`,
  'Permits, Approvals, and Shares vs Assets': `## Deeper detail

This lesson combines two different classes of mistakes that often show up in the same support thread: allowance mistakes and unit mistakes. Permit flows can reduce transaction count, but they do not save you from passing the wrong quantity type or simulating the wrong final state.

When you design the flow, always separate:

- what the user is authorizing
- what unit the protocol entrypoint expects
- what state the UI predicts after execution

That keeps you out of most approval-related trouble.`,
  'Bundler3 for Atomic Flows': `## Deeper detail

Bundler3 should be taught as workflow composition infrastructure. It is not just "multicall but cooler." The important design point is that adapters can rely on the initiator context and callback controls to build safe higher-level workflows.

In partner language:

- atomicity prevents dangerous half-completed states
- one-click UX matters because DeFi flows often require several dependent actions
- bundlers reduce both cognitive overhead and operational failure risk

That is the real story, and it belongs inside the lesson rather than hidden in contract docs.`,
  'Morpho API, GraphQL Complexity, and Fallback Design': `## Deeper detail

The GraphQL endpoint is an acceleration layer, not a magical dependency you should overfit your entire product around. The docs are explicit about complexity and rate limits because a careless dashboard can become unreliable fast.

Your production-ready story should include:

- cache policy
- field minimization
- polling discipline
- degraded behavior when the API is stale or unavailable

That is how you sound like someone who has supported real dashboards before.`,
  'Security Checklist for Real Integrations': `## Deeper detail

This lesson exists because "the protocol works" is not the same thing as "the integration is safe." Most real incidents happen in the glue code: bad decimal handling, incorrect slippage assumptions, stale data, unsafe approvals, or front-end optimism.

A senior answer is operational:

- identify the failing layer
- protect the user path
- communicate clearly
- document the root cause for the next partner

That is the behavior Morpho is hiring for.`,
  'The Merkl + Morpho Recipe Pattern': `## Deeper detail

The point of the recipe is not just to show that incentives exist. It shows how to combine two data systems into one partner-facing story without flattening everything into a misleading single yield number.

If you were demoing this live, the narrative would be:

- Morpho gives the vault state and native yield context
- Merkl gives the incentive-program and claim context
- the front end composes both into a decision-ready yield panel

That is exactly the shape of a practical integration demo.`,
  'Exact GraphQL Queries for Vault Lists, APY, and Rewards': `## Deeper detail

These query patterns matter because they are reusable building blocks. You do not want to improvise GraphQL live in an interview or partner call. You want to know the families of reads you need for discovery, detail, and user positions.

Think in three layers:

- discovery: what vaults or markets exist
- comparison: what are their yields, fees, and rewards
- user context: what does this wallet specifically hold or earn`,
  'Merkl Rewards, Claim Context, and Combined Yield Display': `## Deeper detail

This lesson should leave no ambiguity about presentation. Base yield and incentive yield are not the same economic object. One comes from the vault strategy. The other depends on incentive programs that can change independently.

So the UI should always answer:

- what the vault earns natively
- what incentives add on top
- whether the user has claimable value right now

That separation makes the product trustworthy.`,
  'Frontend Hooks, BigInt Safety, and Error Handling': `## Deeper detail

The problem with multi-source yield dashboards is that small mistakes compound fast. Converting to floats too early, assuming shared decimals, or treating one failed panel as a full-page failure are all avoidable design mistakes.

The self-contained engineering standard is:

- raw math stays integer-safe as long as possible
- each data source gets its own failure boundary
- composition happens after normalization, not before`,
  'How to Use This Pattern in a Partner Demo': `## Deeper detail

This lesson is where protocol knowledge becomes a sales-enabling artifact. A good partner demo is not "look at all these endpoints." It is "here is the exact partner problem, here is the fastest convincing dashboard, and here is how the numbers map to user behavior."

That is why the best demos show:

- asset or vault choice
- current yield picture
- reward upside
- user-level action such as claim, deposit, or compare`,
  'Translate Tech into Business Value': `## Deeper detail

This is one of the highest-leverage lessons in the entire app. The interviewer is not just testing whether you know Morpho. They are testing whether you can convert Morpho details into partner decisions.

A good pattern is:

- start with the partner's product goal
- name the Morpho primitive that serves it
- explain the operational or commercial effect

That sequence keeps you from sounding like a protocol lecturer.`,
  'Run Better Discovery and Scoping Calls': `## Deeper detail

Scoping calls are where you win or lose momentum. If you do not clarify the user action, chain, risk assumptions, and operational owner early, you will either overbuild a POC or under-spec a production rollout.

The lesson to internalize is that a strong first call ends with a recommendation, not just a transcript of questions.`,
  'Answer: Why Morpho over Aave or Compound?': `## Deeper detail

Competitive answers should be calm and specific. The credible answer is not that Morpho replaces every incumbent use case. It is that Morpho is a better fit when isolated markets, immutable risk configuration, or curated managed exposure are strategic advantages for the partner.

Balanced positioning makes you sound trustworthy. Tribal positioning makes you sound immature.`,
  'Handle Liquidation and Risk Objections': `## Deeper detail

The emotional part of this lesson matters. Liquidation conversations often happen after stress, loss, or user frustration. The right tone is not defensive and not robotic.

Your answer should usually do four things:

- acknowledge the concern
- explain the mechanism simply
- identify what the product could have surfaced better
- offer concrete mitigation for the next iteration`,
  'Timezone Bridging, Escalations, and Closing the Loop': `## Deeper detail

This lesson is operational by design because the role is operational. A good partner engineer does not just answer questions in the moment. They create a reliable follow-through path across internal teams and across timezones.

The practical rule is simple: every escalation should be reproducible, scoped, and written so another engineer can pick it up without a live handoff.`,
  'Fastest High-Value POC Patterns': `## Deeper detail

The POCs that land are the ones that reduce uncertainty for the partner quickly. They do not need full production polish. They need to answer one important question decisively.

Choose POCs that prove:

- the integration is feasible
- the user-facing metrics are understandable
- the partner can see business value immediately`,
  'Dashboard Data Model: Positions, HF, Yield, Rewards': `## Deeper detail

Good dashboard design is about choosing the smallest set of numbers that answer the real operational question. If the user needs to know who is at risk, lead with HF and liquidation price. If the user needs to compare vaults, lead with base yield, reward APR, and liquidity context.

A lot of dashboards fail because they display everything the API offers instead of what the operator needs.`,
  'Public Allocator and Liquidity Monitoring': `## Deeper detail

This topic matters because isolated markets can make partners worry about fragmented liquidity. Public Allocator is part of the answer: it provides a public mechanism for reallocating liquidity toward demand, subject to the curator's flow-cap and fee design.

When you explain it, emphasize both parts:

- it improves liquidity routing
- it still operates within curator-defined boundaries`,
  '60-Second Pitch Library': `## Deeper detail

These drills are not filler. The interview will reward concise spoken answers more than encyclopedic rambling. Each pitch should sound like you know the protocol, the product impact, and the likely caveat.

Practice until you can give the answer without loading too much background first.`,
  'Mock Partner Call Framework': `## Deeper detail

This framework is meant to stop you from drifting into abstract theory. A good partner call has movement: clarify, map, challenge assumptions, and leave with a next step.

If you do not make a recommendation by the end of the conversation, you are probably still in discovery mode for too long.`,
  'Technical Whiteboard Drills': `## Deeper detail

Whiteboard answers should prove judgment, not drawing speed. Start with problem framing, then pick the data and execution surfaces, then call out edge cases before you sketch the flow.

That order makes you sound like someone who has had to own the consequences of bad architecture choices.`,
  'Final Formula and Address Sprint': `## Deeper detail

This is the compression lesson. By the time you reach it, you should not be learning new concepts. You should be checking whether recall is fast enough for spoken use.

If you cannot recite the main formulas and addresses cleanly, go back to the earlier lessons and re-drill before the interview.`,
  'Documentation and Bug-Forwarding Mindset': `## Deeper detail

This final lesson exists because Morpho is hiring for a loop-closer. Knowing the docs is not enough. The role is about turning partner friction into better explanations, better examples, better escalations, and better onboarding for the next team.

That is the posture you want to project in the interview: technically precise, partner-aware, and relentlessly useful.`,
  'Fixed-Rate Primitives: Zero Coupon, Maturity, Tenor, Payoff, Obligations': `## Deeper detail

The cleanest way to explain zero coupon to a DeFi-native audience: instead of paying interest periodically, the borrower receives less than face value upfront and repays the full face value at maturity. The discount IS the interest. That framing maps directly to how institutions think about bond issuance.

Tenor matters because it ties to treasury planning. A borrower choosing a 30-day tenor versus a 90-day tenor is making a fundamentally different treasury decision. When you scope a partner integration, always ask which tenor range their business model actually needs before assuming any default.

The obligation concept bridges TradFi and DeFi cleanly: TradFi obligation = legal contract enforced by courts. DeFi obligation = smart contract enforced by code. Neither removes default risk, but DeFi removes counterparty execution risk.`,
  'Vault V2 Roles — Cold Recall Under Pressure': `## Deeper detail

The most common mistake in vault role explanations is collapsing Curator and Allocator into one. They are deliberately separated because strategy definition and execution authority are different trust levels. A curator can set where capital should go. An allocator moves it there within those boundaries. That split prevents a single compromised key from both designing and executing a malicious allocation.

Sentinel-vs-Guardian confusion is equally common. Sentinels operate at the pending-change level: they can cancel risk-increasing proposals before execution. Guardians operate at the vault level: they can pause everything. Different scope, different use case.

Practice the five roles as a sequential reveal: Owner sets up the governance structure. Curator defines the allocation strategy. Allocator executes within it. Sentinel blocks dangerous pending changes. Guardian pauses in emergency. If you can say that sequence in 30 seconds without hesitation, you will not stumble here again.`,
  'Morpho V2 Architecture and Intent-Based Markets': `## Deeper detail

The conceptual jump from variable-rate to fixed-rate is not just "rate is now fixed." The entire matching mechanism changes. In variable-rate markets, the IRM curve sets the price based on utilization. In V2 intent-based markets, the price emerges from matching: lenders and borrowers each declare what they want, and the system finds the intersection.

That has a product implication worth making explicit: if no matching intent exists, a lender's capital may sit unmatched and undeployed. That is different from Morpho Blue where supply is always earning something at current utilization. Partners building on V2 need to understand that unfilled intent is a real state, not a bug.

The TradFi parallel that resonates most with institutional partners: intent-based fixed-rate is closer to a primary issuance desk than a money market. The terms are negotiated (expressed as intents), matched, and then fixed for the tenor.`,
  'Morpho as Non-Opinionated Infrastructure: The Full Ecosystem Map': `## Deeper detail

"Non-opinionated" is not a marketing phrase. It is a technical claim with integration consequences. When Morpho does not mandate an oracle, that means each partner must choose one. When Morpho does not mandate a wallet stack, the partner must design account abstraction, key management, and signing flows themselves.

The list of decisions a partner faces is longer than most expect going in: oracle provider and aggregation strategy, wallet infrastructure and onboarding UX, KYC and compliance flow, liquidity bootstrapping plan, frontend data sources, and monitoring on market health.

Your value-add as Solution Architect is shortening that decision list by bringing relevant ecosystem knowledge to each conversation, not just Morpho docs.`,
  'CeFi Partner Scenarios and Liquidity Management': `## Deeper detail

CeFi teams are not slow or unsophisticated. They have deeply built intuitions around CEX liquidity, spot trading, and order books. The gaps are specific and predictable: oracle manipulation, liquidation mechanics without a central counterparty, smart contract upgrade risk, and composability dependencies.

When re-educating a CeFi PM, the most effective framing is not "here is how DeFi works." It is "here is what is different from your current mental model, and here is why it matters for your users." That respects their existing knowledge and focuses the conversation.

Liquidity bootstrapping is almost always the hardest conversation with a new partner. The honest answer is that cold-start liquidity requires either incentive programs like Merkl, protocol partnerships, or a committed liquidity provider. There is no shortcut that does not involve either time or cost.`
};

function enrichLessonBody({ title, body, mustMemorize, formulas, whyItMatters, interviewDrill }) {
  const standardAppendix = buildStandardLessonAppendix({ mustMemorize, formulas, whyItMatters, interviewDrill });
  const customAppendixParts = [LESSON_APPENDICES[title], COMPLEMENTARY_LESSON_APPENDICES[title]].filter(Boolean);
  const customAppendix = customAppendixParts.length ? `\n\n${customAppendixParts.join('\n\n')}` : '';

  return `${body}\n\n${standardAppendix}${customAppendix}`;
}

const CURRICULUM_MODULES = [
  {
    slug: 'morpho-blue-fundamentals',
    title: 'Module 1: Morpho Blue Fundamentals',
    category: 'core',
    durationHours: 4,
    summary: 'Master isolated lending, immutable markets, LLTV, health factor, and liquidation mechanics so you can explain Morpho Blue with authority.',
    objective: 'Speak fluently about why Morpho Blue is different, how positions become risky, and how to frame the protocol for technical partners.',
    format: 'read-drill-test',
    lessons: [
      lesson({
        title: 'Morpho Blue in One Minute',
        body: `## Company context for your interview

Morpho raised **$70 million** from Ribbit Capital, a16z crypto, Coinbase Ventures, Variant, Brevan Howard, Pantera, and Blocktower among 50+ others. As of 2026, Morpho has **over $10 billion in deposits** across Ethereum, Base, and other EVM chains — making it the largest pure-primitive DeFi lending infrastructure.

The Americas Partner Engineer role was created specifically to cover the **GMT -4/-5 timezone gap** as Morpho expands across North and South America. Your interviewers know this is a growth hire for a fast-moving market.

**What success looks like for this role:**
- 30 days: immerse in codebase, shadow BD calls, answer technical questions with support
- 4–6 months: fully autonomous on partner questions, onboarding integrators independently
- 12 months: key technical contact for Americas Growth, measurably faster integration cycles

## Core framing

Morpho Market V1, often referred to in the docs as Morpho Blue, is a **primitive lending market** where one collateral asset is paired with one loan asset. Each market is:

- **Isolated**: risk stays inside that market
- **Immutable**: the market parameters never change after creation
- **Permissionless**: anyone can create a market using approved IRMs and oracles

The single most important technical fact: **one contract address** (\`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb\`) handles all markets on both Ethereum and Base. Markets are identified by a \`bytes32\` ID derived from hashing the five market parameters.

## Why partners care

For an integrator, Morpho is not "a general pool with a long governance path." It is a programmable lending base layer where a partner can pick a precise risk surface.

| Property | Why it matters on partner calls |
|---|---|
| Isolated markets | New assets do not contaminate the whole protocol |
| Immutable parameters | Risk analysis is stable and easier to communicate |
| Permissionless deployment | Time to market is much faster |
| One contract per chain | Integrations are operationally simpler |
| $10B+ TVL | Enough liquidity depth to matter for serious integrations |

## What Morpho builds on top of Blue

- **Morpho Vaults V1** (MetaMorpho): managed lending strategies deploying capital across multiple markets
- **Morpho Vaults V2**: more general managed architecture with adapters, strict role controls, and abstract cap system
- **Bundler3**: atomic transaction dispatcher for complex multi-step flows
- **Public Allocator**: permissionless just-in-time liquidity reallocation across markets
- **SDK + GraphQL API**: developer-facing tooling for dashboards and integrations

## Role-specific angle

For a Partner Engineer, the job is not just saying "isolated is safer." It is translating that into business value:

- faster launch for a new collateral type
- custom oracle and LLTV for that asset
- less governance dependency than a pooled listing flow
- easier post-launch monitoring because market state is explicit
- foundation for a managed vault product (Vaults V1/V2) on top of the market primitive

## The interview pitch in one sentence

> "Morpho is the base layer that lets builders launch dedicated lending markets and managed strategies without relying on slow governance cycles or accepting someone else's risk parameters."

## Tag

\`Partner-Scenario\` \`Foundational-Pitch\` \`Company-Context\``,
        mustMemorize: [
          'Morpho Market V1 / Blue = isolated, immutable, permissionless lending market.',
          'A market is one collateral token + one loan token with its own oracle, IRM, and LLTV.',
          'The integration pitch is custom risk surfaces and faster listing, not generic "higher APY".',
          'Morpho Blue contract address on Ethereum and Base is 0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb.'
        ],
        whyItMatters: 'This is the first answer you will give when BD brings you into a partner call. It has to sound clear, precise, and commercially useful.',
        interviewDrill: 'Give a 60-second explanation of Morpho Blue to a protocol team that currently only knows Aave-style pooled lending.',
        estimatedMinutes: 25,
        docsRefs: docs(
          ['Morpho Market V1', 'https://docs.morpho.org/learn/concepts/market/'],
          ['Addresses', 'https://docs.morpho.org/get-started/resources/addresses/']
        )
      }),
      lesson({
        title: 'Isolated vs Pooled Lending',
        body: `## The comparison partners actually ask for

Traditional pooled lending systems aggregate many assets inside shared risk buckets. Morpho instead isolates each market — a fundamentally different architecture choice with deep consequences for risk, customization, and listing speed.

| Model | Risk shape | Parameter flexibility | Typical integration trade-off |
|---|---|---|---|
| Pooled lending | Shared pool risk | More standardized | Easier to explain, slower to customize |
| Morpho isolated lending | Risk contained per market | Very high | Better fit for bespoke collateral or launch strategy |

## The MarketParams struct — the canonical market identity

Every Morpho market is fully identified by a five-field struct:

\`\`\`solidity
struct MarketParams {
    address loanToken;       // the asset that gets borrowed
    address collateralToken; // the asset posted as collateral
    address oracle;          // price feed (returns collateral price in loan token units, scaled 1e36)
    address irm;             // interest rate model (must be governance-approved)
    uint256 lltv;            // liquidation LTV, WAD-scaled (e.g. 860000000000000000 = 86%)
}
\`\`\`

The market ID is deterministically derived: \`marketId = keccak256(abi.encode(marketParams))\`. No registry lookup is needed — any integrator can compute the market ID from the parameters.

**Why governance-approved IRMs only?** Allowing arbitrary rate models would let someone deploy a market with a manipulable IRM that could drain liquidity or cause unexpected behavior. Currently the only approved IRM is the AdaptiveCurveIRM.

## How isolation changes failure domains

In a pooled protocol, a governance-approved asset that later turns out to have manipulation risk can affect all pools simultaneously. In Morpho:

- A bad collateral asset only endangers lenders in **that specific market**
- Oracle failures affect only markets using that oracle address
- A bad LLTV parameter affects only the specific (collateral, loanToken, oracle, IRM, LLTV) tuple

This makes Morpho's risk analysis strictly local. Partners evaluating diligence ask: "Can my market's listing parameters be changed after deployment?" The answer is no — and that is a feature, not a limitation.

## The concrete deployment flow

1. Choose collateral token, loan token, LLTV (must be from governance-approved set)
2. Choose or deploy a governance-approved oracle
3. Specify the AdaptiveCurveIRM address
4. Call \`Morpho.createMarket(marketParams)\` — the market is live immediately
5. Optional: supply initial seed liquidity to prevent share inflation attacks

No governance vote. No committee approval. No weeks-long listing process.

## When isolated markets are the wrong fit

Be honest with partners: isolated markets are stronger when a partner needs custom parameters, a new collateral type, or contained failure domains. For high-liquidity commodity pairs where a deep shared pool already exists (ETH/USDC), the partner may simply want existing liquidity rather than their own isolated market.

The decision tree is:
- New asset with custom risk parameters → isolated market
- Managed yield product → Vault V2 allocating across curated markets
- Standard asset, wants deep liquidity immediately → consider Vault V2 pointing to existing community markets

## Good partner-language

- "isolated blast radius"
- "bespoke risk surface"
- "faster path to a dedicated listing"
- "clearer failure domain"
- "your LLTV, your oracle, your market"

## Tag

\`Partner-Scenario\` \`Competitive-Positioning\` \`Contract-Deep-Dive\``,
        mustMemorize: [
          'The five market parameters are loan token, collateral token, oracle, IRM, and LLTV.',
          'Isolated markets contain failures inside one market instead of socializing them across a pool.',
          'Permissionless creation still depends on governance-approved IRMs and oracles.',
          'The clean business benefit is faster custom market design, not just "more flexible".'
        ],
        whyItMatters: 'This is the core contrast you will need when someone asks "Why Morpho over Aave or Compound?"',
        interviewDrill: 'A partner says pooled lending is "good enough." Explain why isolation is strategically better for long-tail or higher-beta collateral.',
        estimatedMinutes: 35,
        docsRefs: docs(
          ['Market Concept', 'https://docs.morpho.org/learn/concepts/market/'],
          ['Interest Rate Model Concept', 'https://docs.morpho.org/learn/concepts/irm/']
        )
      }),
      lesson({
        title: 'Market IDs, Addresses, and Contract Landmarks',
        body: `## The single most important address to know cold

**Morpho Blue / Morpho**: \`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb\` on **both Ethereum and Base**

This is the same address on all chains where it is deployed. It is the core lending primitive. Every supply, borrow, repay, withdraw, liquidate, and flash loan happens through this one contract.

## How the market ID is derived

A market's ID is deterministically computed from its parameters — no registry lookup needed:

\`\`\`solidity
bytes32 marketId = keccak256(abi.encode(marketParams));
\`\`\`

Where \`marketParams\` is the full \`MarketParams\` struct:

\`\`\`solidity
struct MarketParams {
    address loanToken;
    address collateralToken;
    address oracle;
    address irm;
    uint256 lltv;
}
\`\`\`

**Practical implication**: If any of the five parameters differ, it is a different market with a different ID. Two markets with the same collateral and loan token but different LLTVs are entirely separate entities.

In TypeScript:
\`\`\`typescript
import { keccak256, encodeAbiParameters, parseAbiParameters } from 'viem';

const marketId = keccak256(encodeAbiParameters(
  parseAbiParameters('address, address, address, address, uint256'),
  [loanToken, collateralToken, oracle, irm, lltv]
));
\`\`\`

## Bundler3 — one paragraph before the address list

Bundler3 is Morpho's atomic transaction dispatcher. It lets integrators combine multiple dependent actions — supply, borrow, swap, resupply — into one transaction that fully reverts if any step fails. The full operational explanation comes later in Module 4. For now, know the addresses.

## Ethereum mainnet addresses from the docs

| Contract | Address |
|---|---|
| Morpho Blue | \`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb\` |
| Adaptive Curve IRM | \`0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC\` |
| Morpho ChainlinkOracleV2 Factory | \`0x3A7bB36Ee3f3eE32A60e9f2b33c1e5f2E83ad766\` |
| Public Allocator | \`0xfd32fA2ca22c76dD6E550706Ad913FC6CE91c75D\` |
| PreLiquidation Factory | \`0x6FF33615e792E35ed1026ea7cACCf42D9BF83476\` |
| Bundler3 | \`0x6566194141eefa99Af43Bb5Aa71460Ca2Dc90245\` |
| EthereumGeneralAdapter1 | \`0x4A6c312ec70E8747a587EE860a0353cd42Be0aE0\` |

## Base addresses from the docs

| Contract | Address |
|---|---|
| Morpho Blue | \`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb\` |
| Adaptive Curve IRM | \`0x46415998764C29aB2a25CbeA6254146D50D22687\` |
| Morpho ChainlinkOracleV2 Factory | \`0x2DC205F24BCb6B311E5cdf0745B0741648Aebd3d\` |
| Public Allocator | \`0xA090dD1a701408Df1d4d0B85b716c87565f90467\` |
| PreLiquidation Factory | \`0x8cd16b62E170Ee0bA83D80e1F80E6085367e2aef\` |
| Bundler3 | \`0x6BFd8137e702540E7A42B74178A4a49Ba43920C4\` |

## Vault V2 factory addresses

| Chain | VaultV2Factory |
|---|---|
| Ethereum | \`0xA1D94F746dEfa1928926b84fB2596c06926C0405\` |
| Base | \`0x4501125508079A99ebBebCE205DeC9593C2b5857\` |

## Interview-safe phrasing

Memorize the Blue address and know where to verify everything else: the official Addresses page. In a real partner call, it is stronger to say "let me verify the network-specific factory on the official addresses registry" than to recite from memory without checking.

The addresses most worth memorizing cold:
- Blue (same on all chains): \`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb\`
- Ethereum AdaptiveCurveIRM: \`0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC\`
- Ethereum Public Allocator: \`0xfd32fA2ca22c76dD6E550706Ad913FC6CE91c75D\`
- Ethereum Bundler3: \`0x6566194141eefa99Af43Bb5Aa71460Ca2Dc90245\`
- Base Bundler3: \`0x6BFd8137e702540E7A42B74178A4a49Ba43920C4\`

## Tag

\`Ops-Readiness\` \`Partner-Scenario\` \`Contract-Deep-Dive\``,
        mustMemorize: [
          'Blue contract on Ethereum and Base: 0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb.',
          'Ethereum Bundler3: 0x6566194141eefa99Af43Bb5Aa71460Ca2Dc90245.',
          'Base Bundler3: 0x6BFd8137e702540E7A42B74178A4a49Ba43920C4.',
          'Always verify factories and registries on the official Addresses page before shipping.'
        ],
        whyItMatters: 'Partner Engineers get trusted when they can recall the canonical contract and also know when to verify chain-specific factories live.',
        interviewDrill: 'A partner asks for the canonical Blue contract and the right place to verify Base-specific factories. Answer in 30 seconds.',
        estimatedMinutes: 20,
        docsRefs: docs(
          ['Addresses', 'https://docs.morpho.org/get-started/resources/addresses/'],
          ['Bundler3 Contracts', 'https://docs.morpho.org/get-started/resources/contracts/bundlers/'],
          ['Bundlers Concept', 'https://docs.morpho.org/learn/concepts/bundlers/']
        )
      }),
      lesson({
        title: 'Collateral, LTV, and Health Factor',
        body: `## The borrower mental model

When a user borrows on Morpho, they lock collateral and draw debt. Two numbers define their safety at any moment:

- **LTV (Loan-to-Value)**: the ratio of debt to collateral value. As debt grows or collateral price falls, LTV rises.
- **Health Factor (HF)**: the buffer between current debt and the maximum the market allows. When HF hits 1.0, liquidation becomes possible.

Neither number is static. Debt accrues interest continuously. Oracle prices update every block. A position with HF 1.05 at 9am may be liquidatable by noon if the collateral price drops 5%.

## Exact formulas — know these derivations, not just the outputs

\`\`\`
Collateral Value = collateralAssets * oraclePrice / 1e36
LTV = borrowAssets / Collateral Value
Max Borrow (the safety ceiling) = Collateral Value * LLTV
Health Factor = Max Borrow / borrowAssets
             = (Collateral Value * LLTV) / borrowAssets
Liquidation Price = borrowAssets * 1e36 * 1e18 / (collateralAssets * LLTV)
\`\`\`

The oracle price is expressed as: **the price of 1 unit of collateral token quoted in loan token units, scaled by 1e36**. That 1e36 scaling is not arbitrary — it gives the protocol consistent precision across token pairs with different decimals.

## Worked example: a live position you should be able to reproduce verbally

Suppose a user deposits 1 ETH worth $3,000 as collateral into a USDC/ETH market with LLTV = 86%.

**Step 1: Collateral Value**
- oraclePrice = ETH price in USDC = 3,000 * 1e36 / 1e18 = 3000e18 (in 1e36 units)
- collateralAssets = 1e18 (1 ETH in wei)
- Collateral Value = 1e18 * 3000e18 / 1e36 = 3000 USDC (in wei: 3000 * 1e6)

**Step 2: Max Borrow**
- Max Borrow = 3000 USDC * 0.86 = 2580 USDC

**Step 3: Health Factor at $1500 borrowed**
- HF = 2580 / 1500 = 1.72 — very healthy

**Step 4: What happens if ETH drops to $1800?**
- Collateral Value = 1800 USDC
- Max Borrow = 1800 * 0.86 = 1548 USDC
- HF = 1548 / 1500 = 1.032 — dangerously close to liquidation

**Step 5: Liquidation price**
- LP = 1500 * 1e36 * 1e18 / (1e18 * 0.86e18) = 1744 USDC per ETH
- This means if ETH drops below $1,744, the position becomes liquidatable

This worked example is exactly what a partner engineer would walk through to debug a "surprise liquidation" support ticket.

## Why LTV alone is not enough for a UI

LTV tells users how leveraged they are. Health Factor tells them how close to the edge they are. They answer different questions:

- LTV 80% on a 90% LLTV market: comfortable (HF = 1.125)
- LTV 80% on an 82% LLTV market: one bad oracle tick from liquidation (HF = 1.025)

A good borrower UI shows both, plus a liquidation price estimate, and highlights when HF is approaching 1.10 (caution) and 1.02 (danger).

## Edge cases that cause dashboard surprises

**1. Debt accrual between refreshes**
Even with a flat oracle price, borrow balance grows continuously because interest accrues in shares. A user who borrowed $1000 at 12% APY will see their debt at $1012 one month later. If your dashboard caches borrow balance and does not re-accrue, displayed HF will be slightly optimistic.

**2. Oracle lag on volatile collateral**
Chainlink oracles update on a heartbeat (usually 1 hour) or when price deviates by a threshold (usually 0.5%). Between updates, the onchain oracle price can be stale relative to the real market. That gap can mean a position looks safe onchain but is actually undercollateralized in practice.

**3. Rounding in shares-to-assets conversion**
The protocol tracks debt in borrow shares, not raw asset amounts. Converting shares back to assets uses integer division. Small rounding differences (usually 1 wei) can make a "max repay" transaction revert if the UI does not add a small buffer.

## How to explain HF clearly to a non-technical stakeholder

Tell partners HF is a **safety buffer ratio**:

- "Think of it as: if HF is 1.5, the collateral can drop 33% before liquidation becomes possible."
- "When HF is 1.03, the collateral only needs to drop 3% before the position is at risk."
- "We recommend users stay above HF 1.1 as a working safety buffer, and we alert at HF 1.05."

The formula for "how much can collateral drop before liquidation":

\`\`\`
Max Safe Drop % = 1 - (1 / HF)
At HF 1.5: max drop = 33%
At HF 1.1: max drop = 9%
At HF 1.03: max drop = 2.9%
\`\`\`

## Tag

\`Math-Core\` \`Partner-Scenario\``,
        mustMemorize: [
          'Collateral Value = collateralAssets * oraclePrice / 1e36.',
          'Health Factor = (Collateral Value * LLTV) / Borrow Assets.',
          'HF > 1 is healthy; HF <= 1 is liquidatable.',
          'Explain HF as a safety buffer, not just a fraction.'
        ],
        formulas: `Collateral Value = collateralAssets * oraclePrice / 1e36
LTV = borrowAssets / collateralValue
Max Borrow = collateralValue * LLTV
Health Factor = Max Borrow / borrowAssets`,
        whyItMatters: 'If you cannot explain HF cleanly, you will sound like a docs-reader rather than the person partners call when things break.',
        interviewDrill: 'Explain to a non-technical PM why a position with HF 1.03 is riskier than it sounds.',
        estimatedMinutes: 35,
        docsRefs: docs(
          ['Collateral, LTV, and Health Factor', 'https://docs.morpho.org/learn/concepts/ltv-and-health-factor/'],
          ['Oracle Contract Reference', 'https://docs.morpho.org/get-started/resources/contracts/oracles/']
        )
      }),
      lesson({
        title: 'Liquidation Math, LIF, and Bad Debt',
        body: `## The full liquidation lifecycle — start to finish

Liquidation in Morpho is not one event. It is a sequence that any external actor can trigger when the economic incentive exists and the health condition is met. Understanding the full sequence is what makes your partner call answers credible.

**Step 1: Position becomes unhealthy**
Health Factor drops to or below 1.0. This happens when borrowed debt exceeds the market's allowed borrow ceiling relative to current collateral value. The market does not pause or alert automatically. Nothing happens until a liquidator acts.

**Step 2: Liquidator detects the opportunity**
Liquidators are permissionless external bots. They monitor positions, compute expected profit from the LIF bonus, compare against gas cost, and decide whether to liquidate. If the expected profit minus gas cost is negative, rational bots do not act. This is why thin collateral markets or very small positions may stay undercollateralized for longer.

**Step 3: Liquidator calls liquidate()**
The liquidator repays some or all of the borrower's debt and receives collateral in return at the LIF-discounted price (i.e., they pay less than market value for the collateral, which is their profit).

**Step 4: Protocol adjusts state**
Borrow shares and collateral balance are updated atomically. If all debt is repaid and some collateral remains, the excess collateral stays in the borrower's position. If the collateral is insufficient to cover remaining debt, bad debt occurs.

## Liquidation Incentive Factor — the exact formula

\`\`\`
LIF = min(1.15, 1 / (0.3 * LLTV + 0.7))
\`\`\`

**Why this formula?** Higher LLTV markets operate at tighter margins between collateral value and debt. If the incentive were too large on high-LLTV markets, the liquidator would receive more collateral than makes sense relative to the minimal safety buffer. The formula scales LIF down as LLTV increases.

**Key values to know:**

| LLTV | LIF (approx) | Bonus % |
|---|---|---|
| 77% | 1.15 (capped) | 15% |
| 86% | 1.05 | 5% |
| 91.5% | 1.028 | 2.8% |
| 94.5% | 1.015 | 1.5% |
| 98% | 1.008 | 0.8% |

The 86% LLTV / LIF ≈ 1.05 pair is the most common example in the docs. Know it cold.

## Three health regimes — each has a different implication

| Zone | Condition | What a liquidator can do | What debt remains |
|---|---|---|---|
| **Healthy** | LTV ≤ LLTV | Nothing, position is safe | N/A |
| **Liquidatable (recoverable)** | LLTV < LTV ≤ 1/LIF | Repay debt, receive collateral with bonus | Zero if full repayment |
| **Bad debt zone** | LTV > 1/LIF | Seize ALL collateral | Some debt remains uncovered |

**What 1/LIF means**: For a 5% bonus (LIF = 1.05), the bad debt threshold is 1/1.05 ≈ 95.2% LTV. If the position reaches 95.2% LTV before a liquidator acts, the entire collateral may be insufficient to repay the debt even at the discounted collateral price.

## Worked example: liquidation arithmetic

- Collateral: 1 ETH, valued at $1,800 (after a price drop from $3,000)
- Borrow: 1,600 USDC
- LLTV = 86%, LIF = 1.05
- Max borrow = 1,800 * 0.86 = 1,548 USDC
- HF = 1,548 / 1,600 = 0.9675 — **liquidatable**

**Liquidator repays 1,600 USDC of debt:**
- Collateral they can seize = 1,600 * LIF = 1,600 * 1.05 = 1,680 USD worth
- At $1,800/ETH, they receive 1,680 / 1,800 = 0.9333 ETH
- Borrower retains 1 - 0.9333 = 0.0667 ETH ($120)
- Liquidator's gross profit = 1,680 - 1,600 = $80

**Now suppose ETH drops further to $1,550 (bad debt territory):**
- Position LTV = 1,600 / 1,550 = 103.2%
- Bad debt threshold: LTV > 1 / 1.05 = 95.2% — we are well into bad debt zone
- Full collateral (1 ETH = $1,550) cannot cover $1,600 of debt after 5% bonus
- Even if liquidator seizes all collateral, a residual debt remains

## Why liquidations are not guaranteed — the economic reality

Morpho creates the **incentive** for liquidation but does not guarantee **execution**. A rational liquidator will not act if:
- Gas cost exceeds expected profit (common on Mainnet for small positions)
- MEV bots front-run the liquidation opportunity before they can execute
- The collateral has no liquid market for the swap-out (illiquid long-tail tokens)

This is why partner products must communicate liquidation risk without implying Morpho will always clean up the position. The correct framing: "Morpho provides economic incentives for permissionless external liquidators to act, but execution depends on market conditions and position size."

## Bad debt handling: V1 vs Vault V2

**In isolated Blue markets (V1):** When bad debt occurs, the remaining debt is realized as a loss. This loss affects the borrow shares outstanding — lenders who held those borrow-side positions effectively experience a proportional haircut through the exchange rate.

**In Vault V2:** The vault's \`realAssets()\` for the affected adapter decreases. This reduces \`totalAssets\` for the vault, which reduces the share price for all vault depositors proportionally. There is no selectivity — it is socialized across the vault share base.

**For a partner:** This means vault depositors are implicitly exposed to the risk of bad debt in the underlying markets the vault is allocated to. A good vault comparison dashboard should show which markets each vault allocates to and that market's LLTV/LIF profile, not just the headline APY.

## Common partner support scenario: "Why was my user liquidated at 85% LTV on an 86% LLTV market?"

The best answer has four parts:
1. **Oracle timing**: The oracle price used for the liquidation may have been lower than the price the user saw in the UI. Oracle updates lag real market prices.
2. **Debt accrual**: Borrow interest had been accruing since last displayed balance. The "real" debt was slightly higher than shown.
3. **Rounding at execution**: Shares-to-assets conversions can add a tiny amount to the effective debt.
4. **The LLTV is a ceiling, not a guarantee**: The position remains liquidatable from the moment HF drops to or below 1. The displayed LLTV is the parameter, not a promise that you can always borrow exactly to that threshold safely.

## Tag

\`Math-Core\` \`Risk-Explainer\` \`Partner-Scenario\``,
        mustMemorize: [
          'LIF = min(1.15, 1 / (0.3 * LLTV + 0.7)).',
          'At 86% LLTV, LIF is about 1.05.',
          'No protocol liquidation fee: the liquidator receives the full incentive.',
          'Bad debt starts once LTV exceeds 1 / LIF and collateral can no longer cover remaining debt.'
        ],
        formulas: `LIF = min(1.15, 1 / (0.3 * LLTV + 0.7))
Healthy if LTV <= LLTV
Liquidatable if LLTV < LTV <= 1 / LIF
Bad debt zone if LTV > 1 / LIF`,
        whyItMatters: 'Partners often ask why a position liquidated "early" or why some debt remained. You need the exact regime boundaries, not hand-wavy intuition.',
        interviewDrill: 'A partner says: "Our user liquidated at 85% LTV on an 86% LLTV market. How is that possible?" Explain clearly and empathetically.',
        estimatedMinutes: 40,
        docsRefs: docs(
          ['Liquidation Concept', 'https://docs.morpho.org/learn/concepts/liquidation/'],
          ['Pre-Liquidation Concept', 'https://docs.morpho.org/learn/concepts/pre-liquidation/']
        )
      }),
      lesson({
        title: 'Oracles, Pricing, and Why 1e36 Matters',
        body: `## What the oracle actually returns

Morpho docs define oracle price precisely:

> The price of 1 asset of collateral token quoted in 1 asset of loan token, scaled by 1e36.

This is the most important sentence in the oracle section. Unpack it:

1. **"1 asset of collateral"** — this is one base unit (1 wei if 18 decimals, 1 satoshi if 8 decimals, etc.)
2. **"quoted in 1 asset of loan token"** — the answer is in loan token units, not USD
3. **"scaled by 1e36"** — a fixed-point representation that avoids floating point precision loss

**Why 1e36 specifically?** Because Morpho needs to handle token pairs like (6-decimal USDC / 18-decimal ETH) without losing precision. The 1e36 factor is large enough that the math stays integer-safe even for small amounts across any combination of decimals.

## How to use the oracle price in code

\`\`\`typescript
// From the Blue contract: market.oracle.price() returns uint256 scaled by 1e36
const oraclePriceRaw: bigint = await oracle.price(); // e.g., 3000n * 10n**36n / 10n**12n for USDC/ETH

// Collateral value computation (always use BigInt — never convert to float early)
const collateralValue = (collateralAssets * oraclePriceRaw) / 10n**36n;
// Result is in loan token units (e.g., USDC in base units if loan is USDC)

// Health Factor
const maxBorrow = (collateralValue * lltv) / 10n**18n; // LLTV is WAD (1e18)
const healthFactor = (maxBorrow * 10n**18n) / borrowAssets; // 1e18 = HF of 1.0
\`\`\`

**Critical**: the oracle price pairs depend on the market. For an ETH/USDC market where you borrow USDC against ETH:
- The oracle returns: (1 wei of ETH) valued in (USDC units), scaled by 1e36
- If ETH = $3,000 and USDC has 6 decimals while ETH has 18: \`price ≈ 3000e6 * 1e36 / 1e18 = 3000e24\`

If you use token decimals (1e18 or 1e6) instead of 1e36 for this division, you will be off by 12–18 orders of magnitude. That is how a health factor of "1.3" becomes "1300000000000000" in a buggy dashboard.

## MorphoChainlinkOracleV2 feed constructions

The contract supports several composition patterns for the feed route:

| Pattern | When to use |
|---|---|
| Direct A/B | Collateral and loan token have a single Chainlink feed |
| Inverse B/A | Only the B/A feed exists; oracle inverts it |
| Two-hop A/C and B/C | Both tokens have USD feeds; route through USD |
| Three-hop A/C, C/D, B/D | More exotic routes via an intermediate asset |
| Vault-conversion layer | Collateral is a yield-bearing token (e.g., wstETH); feed includes exchange rate |

The vault-conversion path is common for LST/LRT collateral. If you see a market with stETH or wstETH as collateral, the oracle likely has a conversion step to normalize the staked exchange rate before the price feed.

**Why this matters for debugging**: If the collateral is a yield-bearing token and the oracle is missing the conversion layer, the price will be wrong and HF will be systematically incorrect. This is a market design issue, not a frontend bug.

## Common oracle-related bugs in partner dashboards

**Bug 1: Wrong oracle reading → HF = 0 or infinity**

Symptom: Health factor displays as 0 or as a massive number for all positions.

Root cause: Oracle price returned 0 (stale feed), or the wrong field was read (e.g., reading \`latestAnswer\` from a Chainlink feed before confirming it is non-negative and non-stale).

Fix: Always validate oracle.price() is non-zero and check the oracle's lastUpdate timestamp against the current block.

**Bug 2: Decimal normalization error → HF is off by multiple orders of magnitude**

Symptom: HF displays as 1,200,000 when it should be 1.2. Or as 0.0000012 when it should be 1.2.

Root cause: Dividing by 1e18 instead of 1e36, or vice versa. Often happens when someone copies health factor code from an Aave integration that uses different scaling.

Fix: Always use the full 1e36 denominator for collateral value. Never trust a copy-pasted formula without verifying which protocol it came from.

**Bug 3: USD price interpretation error**

Symptom: Dashboard shows "ETH collateral worth $3,000" correctly, but health factor is still wrong because the compute uses a USD price instead of the oracle-native loan-token price.

Root cause: The integrator used a separate price feed to get USD values and then tried to use those USD values inside Morpho's collateral value formula. Morpho's oracle price is loan-token-native, not USD.

Fix: Never mix USD-denominated prices with Morpho's 1e36-scaled oracle prices in the same formula.

**Bug 4: Stale oracle on high-volatility assets**

Symptom: User reports their position was liquidated even though the price "didn't drop that far." The UI shows HF 1.08 but onchain it was 0.98 when liquidation happened.

Root cause: The oracle used the last Chainlink heartbeat price, which lagged the actual market move by 30–60 minutes. The UI also used the API-cached price (stale by even more) rather than the live onchain oracle.

Fix: For critical HF displays, read oracle.price() directly onchain. Do not rely on a cached API value for liquidation proximity warnings.

## Safe onchain oracle freshness check

\`\`\`typescript
// For a Chainlink-backed oracle
const [, answer, , updatedAt,] = await aggregator.latestRoundData();
const staleness = BigInt(Math.floor(Date.now() / 1000)) - updatedAt;
const STALE_THRESHOLD = 3600n; // 1 hour in seconds
if (staleness > STALE_THRESHOLD || answer <= 0n) {
  showOracleStaleWarning();
}
\`\`\`

## Safe explanation for partners

> "Morpho health metrics are only as accurate as the market oracle. Before trusting a displayed HF, verify: the oracle address matches the market params, the feed path is appropriate for the collateral type (including any vault conversion), the normalization uses 1e36 not token decimals, and the oracle was updated recently. Most dashboard bugs around HF start with one of those four checks."

## Tag

\`Integration-Safety\` \`Partner-Scenario\` \`Math-Core\``,
        mustMemorize: [
          'Morpho oracle price is scaled by 1e36.',
          'The quote is collateral priced in units of the loan token, not automatically USD.',
          'MorphoChainlinkOracleV2 supports direct, inverse, multi-hop, and vault-conversion paths.',
          'Most dashboard bugs around HF come from decimal normalization mistakes.'
        ],
        formulas: `Collateral Value = collateralAssets * oraclePrice / 1e36`,
        whyItMatters: 'Partner-facing debugging often starts with "your health factor is wrong." This lesson lets you isolate whether the issue is onchain risk or offchain math.',
        interviewDrill: 'Explain to an integrator why using JavaScript floating numbers for oracle math is unacceptable.',
        estimatedMinutes: 30,
        docsRefs: docs(
          ['Oracle Contract Reference', 'https://docs.morpho.org/get-started/resources/contracts/oracles/'],
          ['Addresses', 'https://docs.morpho.org/get-started/resources/addresses/']
        )
      })
    ]
  },
  {
    slug: 'vault-v2-deep-dive',
    title: 'Module 2: Morpho Vault V2 Deep Dive',
    category: 'core',
    durationHours: 4,
    summary: 'Understand Vault V2 roles, timelocks, adapters, caps, force deallocate, and loss socialization so you can reason like a curator-facing engineer.',
    objective: 'Be able to explain how Vault V2 governance and risk controls work in real integrations and emergency scenarios.',
    format: 'read-drill-test',
    lessons: [
      lesson({
        title: 'What Vault V2 Actually Is',
        body: `## Mental model: a managed allocation shell, not a simple vault wrapper

Vault V2 is the managed lending layer on top of Morpho markets. It differs fundamentally from MetaMorpho (Vault V1) by introducing an adapter-based architecture that can route capital through multiple types of underlying positions.

The key distinction from a plain ERC4626 vault:

- **ERC4626 vault**: one asset in, one strategy
- **Vault V2**: one asset in, multiple adapters, each with its own cap structure and allocation logic

## How capital flows through Vault V2

\`\`\`
User deposit (ERC20)
      |
   [Vault V2] — manages shares, totalAssets, fee accrual
      |
      +—— [MorphoMarketV1AdapterV2] —— supply to Blue market directly
      |
      +—— [MorphoVaultV1Adapter] —— allocate to a MetaMorpho (V1) vault
      |
      +—— [Future adapter types] — expandable
\`\`\`

The **liquidity adapter** is the adapter used for deposit/withdrawal. It determines which market users' assets enter and exit from. There is no automatic fallthrough across markets — the liquidity adapter points to one specific market at a time via its \`liquidityData\`.

## MorphoMarketV1AdapterV2 vs MorphoVaultV1Adapter

| Feature | MorphoMarketV1AdapterV2 | MorphoVaultV1Adapter |
|---|---|---|
| Underlying destination | Morpho Blue market (V1) | MetaMorpho vault (V1) |
| Internal timelock | Yes — same submit/execute pattern as Vault V2 | No — inherits from V1 vault |
| Multi-market routing | Manages multiple markets in a list | Delegated to V1 vault strategy |
| IRM restriction | Can only use AdaptiveCurveIRM markets | Inherits V1 vault constraint |
| Loss realization | Direct via realAssets() | V1.1 does not realize bad debt internally |

## The ERC4626 max* helpers caveat

Vault V2 intentionally returns **zero** for:
- \`maxDeposit\`
- \`maxMint\`
- \`maxWithdraw\`
- \`maxRedeem\`

This is not a bug. It is a conservative stance because gates (deposit/withdrawal restrictions) are external contracts that may not be revert-free when queried in all states. The vault cannot safely compute a non-zero maximum without potentially causing UX confusion.

**Frontend implication**: Do not build "max" buttons from these helpers. Compute available deposit/withdrawal capacity from the vault's current share balance, totalAssets, and any relevant cap constraints instead.

## Share accounting formula

\`\`\`
convertToAssets(shares) = shares × (totalAssets + 1) / (totalSupply + virtualShares)
\`\`\`

The \`virtualShares\` offset prevents share price inflation attacks at vault inception. For an 18-decimal asset, virtualShares = 1. For a 6-decimal asset (like USDC), virtualShares = 10^12. The formula ensures even a single wei of assets translates to a non-zero share value.

## Minimum initial deposit requirement

To deploy a new Vault V2, curators must provide an initial deposit meeting:

\`\`\`
initialDeposit >= max(1e9, 1e6 × virtualShares)
\`\`\`

This satisfies both inflation attack prevention and share price rounding protection. For 18-decimal assets: \`max(1e9, 1e6 × 1) = 1e9\` wei. For USDC (6 decimals): \`max(1e9, 1e6 × 1e12) = 1e18\` base units = 1 USDC.

## Why partners should care about Vault V2 vs V1

- **V1 vaults**: simpler, already deployed, widely integrated — use for straightforward earn products
- **V2 vaults**: more governance controls (timelocks, role separation), adapter flexibility, future-proof architecture

For new curator partnerships starting in 2025+, Vault V2 is the recommended path.

## Tag

\`Vault-V2\` \`Integration-Safety\` \`Architecture\``,
        mustMemorize: [
          'Vault V2 is adapter-based managed lending, not just a simple Morpho-only vault wrapper.',
          'Deposits and allocations are separated by design.',
          'ERC4626 max* helpers always returning zero is expected behavior in Vault V2.',
          'Frontend UX must compute availability with vault-specific logic instead of max* shortcuts.'
        ],
        whyItMatters: 'A partner dashboard that treats Vault V2 like a vanilla ERC4626 can easily mislead users.',
        interviewDrill: 'Explain to a frontend team why Vault V2 maxDeposit() returning zero does not mean the vault is broken.',
        estimatedMinutes: 25,
        docsRefs: docs(
          ['Morpho Vault V2', 'https://docs.morpho.org/learn/concepts/vault-v2/'],
          ['Vault Mechanics', 'https://docs.morpho.org/build/earn/concepts/vault-mechanics/']
        )
      }),
      lesson({
        title: 'Roles and Exact Permissions',
        body: `## Why the role split exists

Vault V2 was designed so that no single actor holds both the ability to define risk and the ability to act on it. This is a deliberate separation of powers. The pattern is similar to how well-governed financial institutions separate investment committees (strategy) from portfolio managers (execution) from risk officers (limits).

The docs make this explicit: **roles do not inherit permissions from each other**. Curator authority does not grant Owner powers. Allocator authority does not grant Curator powers. This is intentional.

## Exact capability matrix

| Role | Can do | Cannot do |
|---|---|---|
| **Owner** | Set curator; set/remove sentinels; transfer ownership; set skim recipient | Change caps, fees, adapters, or allocations directly |
| **Curator** | Set/remove allocators; set supply/performance fee and fee recipient; submit timelock proposals for adapter add/remove, caps, gates, and liquidity adapter | Bypass timelocks on risk-increasing actions |
| **Allocator** | Allocate and deallocate within current caps; set reallocate flow data | Change caps, add/remove adapters, set fees |
| **Sentinel** | Revoke any pending proposal; decrease absolute and relative caps (instantly); call forceDeallocate or deallocate | Increase caps; add adapters; set fees; steal funds |

## The key reason Sentinel is safe

A compromised Sentinel can cause operational pain (reverting pending proposals, deallocating funds to idle), but it **cannot widen risk exposure**. It can only reduce it. This asymmetry is the safety story. The docs describe this as: "An honest sentinel is the last defense against a compromised curator."

If a Sentinel key is compromised, the worst realistic outcome is operational disruption, not fund loss from new risky allocations.

## The real compromise risk hierarchy

**Least dangerous: Sentinel compromise**
- Can revert pending proposals, cause operational friction
- Cannot put new capital at risk
- Response: revoke sentinel key and rebuild operational state

**Moderate: Allocator compromise**
- Can move funds within existing cap bounds, but cannot exceed caps or add new adapters
- Cannot open new risk surfaces
- Response: zero all caps immediately (Sentinel can do this) and remove allocator privilege

**Severe: Curator compromise**
- Can submit malicious timelock proposals to widen caps or add bad adapters
- However, timelocks give depositors time to exit before the changes execute
- Response: Sentinel should revoke all pending proposals; Owner should revoke curator privilege

**Most dangerous: Owner compromise**
- Cannot directly steal funds or change strategy
- But can appoint a malicious Curator, turning it into a Curator-compromise scenario
- The timelock on Curator-level actions is the main protection
- Response: immediately revoke curator if known, reset sentinel access, communicate to depositors

## Operations by timelock category

**Immediate (no timelock):**
- Allocator: allocate/deallocate within caps
- Sentinel: decrease caps, revoke proposals
- Curator: remove allocator, decrease fees, set skim recipient

**3-day minimum timelock:**
- addAdapter (the most common timelocked action)
- increase absolute cap
- increase relative cap
- set gate
- set liquidity adapter

**7-day minimum timelock:**
- removeAdapter (longer delay because it can affect withdrawal paths)

**Why the asymmetry?** Risk-increasing actions (add adapter, increase cap) need time so depositors can evaluate and exit. Risk-decreasing actions (decrease cap, revoke proposal) should be fast because delay in an emergency is dangerous.

## Practical debugging with roles

When a curator reports an unexpected vault state, use the role model as your triage framework:

- "Cap increased unexpectedly" → check curator's recent timelock proposals and execution timestamps
- "Funds moved to a new market" → check allocator activity, verify the destination market had a non-zero cap
- "A pending proposal was revoked" → check whether a sentinel acted
- "maxWithdraw shows 0" → check the liquidity adapter's current liquidityData market, not the cap system

This mental model lets you ask the right question on a partner call instead of fishing through event logs blindly.

## Interview-ready soundbite

> "Vault V2 isolates strategy definition from tactical execution and gives you an emergency brake (Sentinel) that can only reduce risk, not increase it. No single role compromise can immediately drain a vault."

## Tag

\`Vault-V2\` \`Partner-Scenario\` \`Security\``,
        mustMemorize: [
          'Roles do not inherit permissions from one another in Vault V2.',
          'Owner can only set curator and sentinels, not directly manage caps or allocations.',
          'Curator defines strategy; allocator executes inside those boundaries.',
          'Sentinel only performs risk-reducing actions.'
        ],
        whyItMatters: 'You will almost certainly be asked to explain why Vault V2 is safer than a single-manager vault.',
        interviewDrill: 'A partner asks why they need both Curator and Allocator. Explain the distinction in one minute.',
        estimatedMinutes: 30,
        docsRefs: docs(
          ['Roles & Capabilities', 'https://docs.morpho.org/curate/concepts/roles/'],
          ['Manage Vault V2 Roles', 'https://docs.morpho.org/curate/tutorials-v2/roles/']
        )
      }),
      lesson({
        title: 'Timelocks: What Is Immediate vs Timelocked',
        body: `## Timelock rules that matter in interviews

From the official warning and timelock tables:

| Function | Minimum timelock |
|---|---|
| addAdapter | 3 days |
| increaseAbsoluteCap | 3 days |
| increaseRelativeCap | 3 days |
| setForceDeallocatePenalty | 3 days |
| removeAdapter | 7 days |
| setAdapterRegistry | 7 days |
| setReceiveSharesGate / setSendSharesGate / setReceiveAssetsGate | 7 days |
| increaseTimelock | 7 days |
| abdicate | 7 days |

## Immediate actions

- Owner setting curator / sentinel / owner
- cap decreases
- sentinel revokes
- deallocations by authorized roles

## How to explain this well

Risk-increasing actions are timelocked so depositors can react. Risk-reducing actions are immediate so operators can respond under stress.

## Tag

\`Vault-V2\` \`Governance-Safety\``,
        mustMemorize: [
          'addAdapter and cap increases require at least 3 days.',
          'removeAdapter and critical gating or registry changes require at least 7 days.',
          'Cap decreases are immediate.',
          'The product story is delayed risk increase, instant risk reduction.'
        ],
        whyItMatters: 'This is the cleanest way to answer governance-risk objections from institutions and curators.',
        interviewDrill: 'A partner asks whether a malicious curator can instantly add a risky adapter. Answer with exact timelock logic.',
        estimatedMinutes: 30,
        docsRefs: docs(
          ['Risk Warnings and Timelocks', 'https://docs.morpho.org/learn/resources/risks/'],
          ['Manage Vault V2 Roles', 'https://docs.morpho.org/curate/tutorials-v2/roles/']
        )
      }),
      lesson({
        title: 'Adapters, Factories, and Liquidity Adapter Flow',
        body: `## Main adapter types in the docs

1. **MorphoMarketV1AdapterV2**
2. **MorphoVaultV1Adapter**

## Current mainnet factories from the docs

### Ethereum

- VaultV2Factory: \`0xA1D94F746dEfa1928926b84fB2596c06926C0405\`
- MorphoVaultV1 AdapterFactory: \`0xD1B8E2dee25c2b89DCD2f98448a7ce87d6F63394\`
- MorphoMarketV1 AdapterV2Factory: \`0x32BB1c0D48D8b1B3363e86eeB9A0300BAd61ccc1\`
- MorphoRegistry: \`0x3696c5eAe4a7Ffd04Ea163564571E9CD8Ed9364e\`

### Base

- VaultV2Factory: \`0x4501125508079A99ebBebCE205DeC9593C2b5857\`
- MorphoVaultV1 AdapterFactory: \`0xF42D9c36b34c9c2CF3Bc30eD2a52a90eEB604642\`
- MorphoMarketV1 AdapterV2Factory: \`0x9a1B378C43BA535cDB89934230F0D3890c51C0EB\`
- MorphoRegistry: \`0x5C2531Cbd2cf112Cf687da3Cd536708aDd7DB10a\`

## Liquidity adapter concept

The liquidity adapter is the adapter used for user deposits and withdrawals. If a \`MorphoMarketV1AdapterV2\` is the liquidity adapter, it points to **one market at a time** via \`liquidityData\`.

There is no automatic fallthrough across multiple markets.

## Tag

\`Vault-V2\` \`Ops-Readiness\``,
        mustMemorize: [
          'MorphoMarketV1AdapterV2 manages direct market exposure and has its own timelock system.',
          'MorphoVaultV1Adapter wraps exposure to a Vault V1 and has no separate timelock system.',
          'The liquidity adapter points to one underlying market at a time.',
          'No automatic withdrawal queue fallthrough exists inside a MarketV1AdapterV2 liquidity setup.'
        ],
        whyItMatters: 'This is exactly the level of specificity that separates a protocol generalist from someone who can scope a real vault integration.',
        interviewDrill: 'Explain why a Vault V2 with a MarketV1AdapterV2 can still become operationally illiquid even if other markets in the adapter exist.',
        estimatedMinutes: 35,
        docsRefs: docs(
          ['Curate Adapters (Vaults V2)', 'https://docs.morpho.org/curate/tutorials-v2/listing-adapters/'],
          ['MorphoMarketV1AdapterV2 Contract', 'https://docs.morpho.org/get-started/resources/contracts/morpho-market-v1-adapter-v2/'],
          ['Addresses', 'https://docs.morpho.org/get-started/resources/addresses/']
        )
      }),
      lesson({
        title: 'Caps System: Absolute, Relative, and Abstract IDs',
        body: `## The cap hierarchy

For \`MorphoMarketV1AdapterV2\`, every allocation is gated by three cap layers:

1. adapter cap
2. collateral token cap
3. market cap

All three must be non-zero for allocation to happen.

## ID encodings you should know

\`\`\`solidity
adapterId    = abi.encode("this", adapterAddress)
collateralId = abi.encode("collateralToken", collateralTokenAddress)
marketId     = abi.encode("this/marketParams", adapterAddress, marketParams)
\`\`\`

## Absolute vs relative

- **absolute cap**: max assets in loan token units
- **relative cap**: max share of total vault allocation, with \`1e18 = 100%\`

## Why abstract ids matter

This is one of the deepest design points in Vault V2: risk controls can be attached to reusable risk factors, not only to a single market record.

That enables statements like:

- "max 15M total exposure to this collateral"
- "max 20% of the vault in this protocol path"

## Tag

\`Vault-V2\` \`Risk-Curation\``,
        mustMemorize: [
          'Every allocation through MarketV1AdapterV2 must satisfy adapter, collateral, and market caps.',
          'Absolute caps are denominated in the loan asset; relative caps use WAD where 1e18 is 100%.',
          'Collateral ID = abi.encode("collateralToken", collateralTokenAddress).',
          'Market ID = abi.encode("this/marketParams", adapterAddress, marketParams).'
        ],
        formulas: `Relative cap uses WAD scaling: 1e18 = 100%`,
        whyItMatters: 'If you can explain abstract ids well, you will sound like someone who really understands Vault V2 risk architecture.',
        interviewDrill: 'A curator asks why they need both collateral caps and market caps. Answer with a concrete cbBTC example.',
        estimatedMinutes: 35,
        docsRefs: docs(
          ['Market Listing in MorphoMarketV1AdapterV2', 'https://docs.morpho.org/curate/tutorials-v2/market-listing/'],
          ['Curator Concept', 'https://docs.morpho.org/learn/concepts/curator/']
        )
      }),
      lesson({
        title: 'Loss Socialization and Share Price Depreciation',
        body: `## Exact Vault V2 behavior

Vault V2 implements **automatic loss socialization**.

When an adapter reports \`realAssets()\` below previously tracked vault assets, the vault marks total assets down and the loss is spread proportionally through share price depreciation.

## What does not happen

- shares are not burned
- one depositor is not singled out
- loss is not hidden off-balance-sheet

## The formula intuition

The docs describe conversion using:

\`\`\`
convertToAssets = shares * (totalAssets + 1) / (totalSupply + virtualShares)
\`\`\`

When \`totalAssets\` falls, each share claims fewer assets.

## Important caveat

If Vault V2 uses a \`MorphoVaultV1Adapter\` into Vault V1.1, V1.1 does not realize bad debt internally, so Vault V2 will not reflect those specific losses through that path.

## Tag

\`Vault-V2\` \`Risk-Explainer\``,
        mustMemorize: [
          'Vault V2 socializes losses through share price depreciation.',
          'Loss realization starts when adapter realAssets() reports less than previously tracked assets.',
          'No shares are burned during socialization.',
          'Vault V1.1 bad debt caveat matters when using MorphoVaultV1Adapter.'
        ],
        whyItMatters: 'Partners building dashboards or wrappers on top of Vault V2 must understand why share price can go down even without withdrawals.',
        interviewDrill: 'Explain loss socialization to a depositor partner who thinks only "the bad market users" should absorb the loss.',
        estimatedMinutes: 30,
        docsRefs: docs(
          ['Managing Bad Debt (Vault V2)', 'https://docs.morpho.org/curate/tutorials-v2/bad-debt/'],
          ['Morpho Vault V2 Concept', 'https://docs.morpho.org/learn/concepts/vault-v2/']
        )
      })
    ]
  },
  {
    slug: 'core-math-and-formulas',
    title: 'Module 3: Core Math & Formulas',
    category: 'core',
    durationHours: 3,
    summary: 'Memorize the formulas and computational patterns that show up in product UX, partner debugging, and code reviews.',
    objective: 'Turn Morpho math from fuzzy intuition into exact, interview-grade language.',
    format: 'read-drill-test',
    lessons: [
      lesson({
        title: 'Formula Sheet: Position Math',
        body: `## Position formulas you should know exactly

\`\`\`
Collateral Value = collateralAssets * oraclePrice / 1e36
LTV = borrowAssets / collateralValue
Max Borrow = collateralValue * LLTV
Health Factor = Max Borrow / borrowAssets
Liquidation Price = borrowAssets * 1e36 * 1e18 / (collateralAssets * LLTV)
\`\`\`

## Precision notes

- oracle price uses **1e36**
- LLTV uses **WAD / 1e18**
- share math uses supply/borrow share conversion helpers

## Practical advice

If you are speaking verbally:

1. compute collateral value
2. apply LLTV to get max borrow
3. divide by debt for HF
4. only then discuss liquidation risk

That order makes you sound calm and systematic.

## Tag

\`Math-Core\` \`Interview-Ready\``,
        mustMemorize: [
          'Collateral value uses 1e36 oracle scaling.',
          'LLTV is WAD-scaled.',
          'Health Factor is max borrow divided by borrowed assets.',
          'Liquidation price is the price that makes HF exactly 1.'
        ],
        formulas: `Collateral Value = collateralAssets * oraclePrice / 1e36
LTV = borrowAssets / collateralValue
Max Borrow = collateralValue * LLTV
Health Factor = Max Borrow / borrowAssets
Liquidation Price = borrowAssets * 1e36 * 1e18 / (collateralAssets * LLTV)`,
        whyItMatters: 'This is the math layer behind nearly every support question and every product dashboard.',
        interviewDrill: 'Solve a liquidation price question aloud without writing code.',
        estimatedMinutes: 30,
        docsRefs: docs(
          ['Collateral, LTV, and Health Factor', 'https://docs.morpho.org/learn/concepts/ltv-and-health-factor/'],
          ['Position Math Example', 'https://docs.morpho.org/build/borrow/tutorials/get-data/']
        )
      }),
      lesson({
        title: 'AdaptiveCurveIRM APY Math',
        body: `## What the IRM is optimizing for

AdaptiveCurveIRM is designed to keep utilization around **90%** using two complementary mechanisms:

1. **The Curve Mechanism** — an instant kinked response: rates react immediately to current utilization, with a steeper slope above 90%
2. **The Adaptive Mechanism** — a slow drift: the curve itself shifts up or down over time to align with market equilibrium

This two-layer design makes it suitable for all assets without governance intervention — it adapts autonomously regardless of market conditions.

## The two mechanisms explained clearly

**Curve mechanism (instant)**

This behaves like a traditional kinked IRM. At 90% utilization, the borrow rate equals \`rateAtTarget\`. Below 90%, the rate is lower (by a factor related to CURVE_STEEPNESS = 4). Above 90%, it is higher.

Example: If rateAtTarget is 4% APY:
- At 0% utilization → ~1% APY (4% / CURVE_STEEPNESS)
- At 90% utilization → 4% APY (rateAtTarget)
- At 100% utilization → 16% APY (4% × CURVE_STEEPNESS)

**Adaptive mechanism (slow)**

Over time, if utilization stays away from 90%, the rateAtTarget itself shifts:
- Above 90% sustained → rateAtTarget drifts upward
- Below 90% sustained → rateAtTarget drifts downward

Speed depends on how far utilization is from target:
- At 95% sustained → rateAtTarget **doubles in ~10 days**
- At 100% sustained → rateAtTarget **doubles in ~5 days** (maximum speed)
- At 45% sustained → rateAtTarget **halves in ~10 days**

## IRM constants hardcoded in the contract

From the Ethereum deployment at \`0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC\`:

| Constant | Value | Meaning |
|---|---|---|
| CURVE_STEEPNESS | 4 (WAD) | Rate multiplier from target to max/min |
| ADJUSTMENT_SPEED | 50 / seconds per year | How fast rateAtTarget drifts |
| TARGET_UTILIZATION | 90% (WAD) | The utilization the IRM targets |
| INITIAL_RATE_AT_TARGET | 4% / year | Starting rateAtTarget for new markets |
| MIN_RATE_AT_TARGET | 0.1% / year | Floor for rateAtTarget |
| MAX_RATE_AT_TARGET | 200% / year | Ceiling for rateAtTarget |

## How to read rateAtTarget for a specific market

The AdaptiveCurveIRM contract stores rateAtTarget in a mapping:

\`\`\`solidity
mapping(Id => uint256) public rateAtTarget;
\`\`\`

Call \`irm.rateAtTarget(marketId)\` to get the per-second rate. Convert to APY:

\`\`\`typescript
const ratePerSecond: bigint = await irm.rateAtTarget(marketId);
const SECONDS_PER_YEAR = 365 * 24 * 60 * 60;
// Example: ratePerSecond = 1512768697n means ~4.9% APY
const apyAtTarget = Math.expm1(Number(ratePerSecond) * SECONDS_PER_YEAR / 1e18);
\`\`\`

## Core formulas from the docs

\`\`\`typescript
minApy = expm1(log1p(apyAtTarget) / 4)         // at 0% utilization
maxApy = expm1(log1p(apyAtTarget) * 4)         // at 100% utilization

if (utilization <= 0.9) {
  borrowApy = minApy + (apyAtTarget - minApy) * (utilization / 0.9)
} else {
  borrowApy = ((maxApy - apyAtTarget) / 0.1) * (utilization - 0.9) + apyAtTarget
}

supplyApy = borrowApy * (1 - fee) * utilization
\`\`\`

The division by 4 (CURVE_STEEPNESS) and multiplication by 4 uses \`log1p/expm1\` for precision, not simple division — the actual formula is slightly curved, not linear.

## Why supply APY is lower than borrow APY

Two reasons:
1. **Fee**: The \`(1 - fee)\` term deducts the curator's performance fee from the supply side
2. **Utilization**: Only the borrowed fraction of supplied assets earns interest. If 80% is borrowed, suppliers earn as if only 80% of the pool is working

\`supplyApy = borrowApy × (1 - fee) × utilization\`

This means at 80% utilization and 4% borrow APY with 0% fee: supply APY = 4% × 0.80 = 3.2%.

## Interview-ready framing

> "Morpho does not need governance to adjust rates. AdaptiveCurveIRM is immutable and contains its own equilibrium-seeking logic. Short-term: the kinked curve reacts immediately to utilization. Long-term: the curve height shifts autonomously to track market rates. Maximum drift speed is a doubling of rateAtTarget in 5 days when utilization stays at 100%."

## Tag

\`Math-Core\` \`Rate-Model\` \`Contract-Deep-Dive\``,
        mustMemorize: [
          'AdaptiveCurveIRM targets 90% utilization.',
          'Supply APY = borrowApy * (1 - fee) * utilization.',
          'Below 90% utilization the slope is gentler; above 90% it steepens sharply.',
          'AdaptiveCurveIRM is immutable.'
        ],
        formulas: `minApy = expm1(log1p(apyAtTarget) / 4)
maxApy = expm1(log1p(apyAtTarget) * 4)
borrowApy below target = minApy + (apyAtTarget - minApy) * (u / 0.9)
borrowApy above target = ((maxApy - apyAtTarget) / 0.1) * (u - 0.9) + apyAtTarget
supplyApy = borrowApy * (1 - fee) * utilization`,
        whyItMatters: 'This is the right answer when a partner asks how Morpho rates adapt without governance intervention.',
        interviewDrill: 'Explain to a yield aggregator why supply APY does not equal borrow APY.',
        estimatedMinutes: 35,
        docsRefs: docs(
          ['IRM Concept', 'https://docs.morpho.org/learn/concepts/irm/'],
          ['AdaptiveCurveIRM Contract', 'https://docs.morpho.org/get-started/resources/contracts/irm/']
        )
      }),
      lesson({
        title: 'Liquidation Regimes, Pre-Liquidation, and Incentive Math',
        body: `## Standard liquidation

\`\`\`
LIF = min(1.15, 1 / (0.3 * LLTV + 0.7))
\`\`\`

For 86% LLTV, LIF is about 1.05.

## Position regimes

\`\`\`
Healthy: LTV <= LLTV
Standard liquidation range: LLTV < LTV <= 1 / LIF
Bad debt region: LTV > 1 / LIF
\`\`\`

## LIF table for common LLTVs

| LLTV | LIF | Bonus |
|---|---|---|
| 77% | 1.15 (cap) | 15% |
| 86% | 1.05 | 5% |
| 91.5% | 1.028 | 2.8% |
| 94.5% | 1.015 | 1.5% |
| 98% | 1.008 | 0.8% |

## Pre-liquidation: the opt-in cushion zone

Pre-liquidation (also called Auto-Deleverage) creates an optional buffer zone between a healthy position and standard liquidation. When a borrower's LTV exceeds a pre-defined preLLTV (but is still below the market's LLTV), partial pre-liquidation becomes possible.

**This is opt-in at the market level.** It requires a PreLiquidation contract deployed via the factory. The borrower does not configure it — the market deployer does.

### preLLTV

The threshold at which pre-liquidation becomes possible. Must be less than the market's LLTV. Example: market LLTV = 80%, preLLTV = 75%. When LTV is 77%, pre-liquidation is possible but full liquidation is not yet.

### Pre-Liquidation Close Factor (preLCF)

The maximum percentage of debt that can be repaid in a single pre-liquidation event. It scales linearly between two values based on where the LTV sits between preLLTV and LLTV:

\`\`\`
preLCF = ((LLTV - LTV) / (LLTV - preLLTV)) * preLCF₁
       + ((LTV - preLLTV) / (LLTV - preLLTV)) * preLCF₂
\`\`\`

- When LTV is just above preLLTV → preLCF is closer to preLCF₁ (small partial close)
- When LTV approaches LLTV → preLCF is closer to preLCF₂ (larger partial close, up to 100%)

**Example**: preLLTV = 75%, LLTV = 80%, LTV = 77.5% (midpoint)
- preLCF = 0.5 × preLCF₁ + 0.5 × preLCF₂

### Pre-Liquidation Incentive Factor (preLIF)

The collateral bonus liquidators receive during pre-liquidation. Must be <= LIF. Typically smaller than full LIF to reflect the lower urgency.

## PreLiquidation Factory addresses

| Chain | Address |
|---|---|
| Ethereum | \`0x6FF33615e792E35ed1026ea7cACCf42D9BF83476\` |
| Base | \`0x8cd16b62E170Ee0bA83D80e1F80E6085367e2aef\` |

## When to recommend pre-liquidation to a partner

Pre-liquidation reduces the risk of sudden large liquidations for borrowers with volatile collateral. It is appropriate when:
- Collateral is volatile (large price swings common)
- Borrowers are likely retail users who may not monitor positions actively
- The market LLTV is relatively high (86%+) where a single-step liquidation could be harsh

It is **not** a substitute for sound market design. A poorly chosen LLTV is not fixed by adding pre-liquidation.

## How to communicate it

> "Standard liquidation provides the external liquidation mechanism once HF hits 1. Pre-liquidation is an optional add-on that creates a cushion zone — borrowers face smaller, staged closures before hitting full liquidation. Neither is run by the protocol itself. Both depend on external liquidators acting on economic incentives."

## Tag

\`Math-Core\` \`Risk-Explainer\` \`Contract-Deep-Dive\``,
        mustMemorize: [
          'Standard liquidation is permissionless and external.',
          'LIF shrinks as LLTV rises, which helps avoid cascading liquidation incentives on riskier markets.',
          'Bad debt emerges once collateral is insufficient even after liquidation incentive math.',
          'Pre-liquidation is opt-in and separate from standard liquidation.'
        ],
        formulas: `LIF = min(1.15, 1 / (0.3 * LLTV + 0.7))
Healthy: LTV <= LLTV
Liquidatable: LLTV < LTV <= 1 / LIF
Bad debt: LTV > 1 / LIF`,
        whyItMatters: 'Partners care less about the existence of LIF than about whether you can explain liquidator incentives crisply under stress.',
        interviewDrill: 'A partner asks whether liquidations are guaranteed. Give an accurate, nuanced answer.',
        estimatedMinutes: 25,
        docsRefs: docs(
          ['Liquidation Concept', 'https://docs.morpho.org/learn/concepts/liquidation/'],
          ['Pre-Liquidation Concept', 'https://docs.morpho.org/learn/concepts/pre-liquidation/']
        )
      }),
      lesson({
        title: 'Shares, Assets, Rounding, and UX Safety Buffers',
        body: `## Core share logic

Morpho position accounting uses shares under the hood:

- **Supply shares**: lenders hold these; they appreciate as interest accrues to the supply side
- **Borrow shares**: borrowers hold these; they appreciate as debt grows from accrued interest
- **Vault shares (ERC4626)**: vault depositors hold these; they appreciate as the vault's total assets grow

In all cases, shares represent a proportional claim on the underlying pool — they are not fixed-value tokens.

## The virtualShares offset

Both the Blue contract and Vault V2 use a virtual shares offset to prevent share price inflation attacks at inception.

**Blue (Morpho Market V1):**
- Virtual shares offset = **1e6**
- Formula: \`assets = shares × (totalAssets + 1) / (totalShares + 1e6)\`

**Vault V2:**
- Virtual shares = \`10^max(0, 18 - decimals)\`
- For 18-decimal assets: virtualShares = 1
- For 6-decimal assets (USDC): virtualShares = \`10^12\` = 1,000,000,000,000

**Why this matters for UI**: The virtual offset makes the initial share price ≠ 1.0 exactly. For a new vault, \`convertToAssets(1e18)\` will return approximately \`10^decimals\`, not exactly \`10^18\`.

## Rounding direction rules — critical for correctness

| Operation | Correct direction | Risk if wrong |
|---|---|---|
| Supply shares → supply assets | Round **down** (favorable to protocol) | Overstating assets → shows more yield than real |
| Borrow shares → borrow assets | Round **up** (conservative for debt) | Understating debt → position looks healthier than it is |
| Withdraw shares → assets | Round **down** | Could over-withdraw if rounding up against pool |
| Repay assets → shares | Round **up** | Could under-repay if rounding down |

**Key rule**: when computing debt for risk display, always round up. When computing supply balance for display, round down. Never show a health factor derived from rounded-down debt — it will make positions appear safer than they actually are.

## Concrete conversion formulas with rounding

\`\`\`typescript
// Supply assets from shares (round DOWN)
function toSupplyAssets(supplyShares: bigint, totalSupplyAssets: bigint, totalSupplyShares: bigint): bigint {
  return (supplyShares * (totalSupplyAssets + 1n)) / (totalSupplyShares + 1000000n);
}

// Borrow assets from shares (round UP — conservative for debt)
function toBorrowAssets(borrowShares: bigint, totalBorrowAssets: bigint, totalBorrowShares: bigint): bigint {
  return (borrowShares * (totalBorrowAssets + 1n) + totalBorrowShares + 999999n) / (totalBorrowShares + 1000000n);
}
\`\`\`

## The dust problem after full deallocate

After a vault allocator calls full deallocate on a market, a few wei of assets may remain. This is expected: the shares-to-assets conversion uses integer division that may leave a remainder < 1 wei equivalent. The docs explicitly warn:

> "When the allocation is zero, this does not mean the adapter has zero shares on that market."

This is not a bug. The correct response is to log it, not treat it as a protocol failure.

## Product rules

- Never let users borrow to HF exactly 1 — enforce a minimum buffer (e.g., HF 1.02)
- Surface liquidation price prominently alongside HF
- Simulate post-transaction HF before signing — show the expected state, not just the pre-state
- Use the shares-based full exit (pass \`shares\`, not assets) for clean full repays and withdrawals
- Treat residual dust after deallocate as expected behavior

## Tag

\`Math-Core\` \`Integration-Safety\` \`Contract-Deep-Dive\``,
        mustMemorize: [
          'Morpho uses share accounting extensively for supply, borrow, and vault balances.',
          'Rounding direction matters: do not mix up toAssetsUp and toAssetsDown logic.',
          'Dust after deallocate is expected due to share rounding.',
          'Good UX imposes safety buffers instead of exposing users to HF 1.00.'
        ],
        whyItMatters: 'Many partner-facing "bug reports" are actually rounding misunderstandings.',
        interviewDrill: 'Explain why a dashboard can show a tiny residual allocation after a full deallocate without implying a protocol bug.',
        estimatedMinutes: 20,
        docsRefs: docs(
          ['Borrow Integration Tutorial', 'https://docs.morpho.org/build/borrow/tutorials/get-data/'],
          ['Vault Mechanics', 'https://docs.morpho.org/build/earn/concepts/vault-mechanics/']
        )
      })
    ]
  },
  {
    slug: 'integration-patterns-and-sdks',
    title: 'Module 4: Integration Patterns & SDKs',
    category: 'build',
    durationHours: 4,
    summary: 'Cover SDK usage, direct contract patterns, Bundler3, permits, GraphQL, and security checks that show up in production integrations.',
    objective: 'Be able to scope and prototype partner integrations quickly and safely.',
    format: 'read-build-drill',
    lessons: [
      lesson({
        title: 'Choosing the Right Integration Surface',
        body: `## Four surfaces you will use repeatedly

1. **Onchain contracts** for final settlement and exact state
2. **SDKs** for typed ergonomics and faster developer velocity
3. **Morpho API / GraphQL** for indexed market, vault, and rewards data
4. **Merkl REST API** for rewards details and claim context

## Practical rule

- use contracts for execution
- use API for dashboards and discovery
- use SDK helpers where they reduce footguns
- build fallback logic because the API has no SLA

## Key docs warning

The Morpho API is provided without SLA and is rate limited to **5k requests / 5 minutes**. Query only what you need and cache responses.

## Tag

\`Integration-Pattern\` \`POC-Readiness\``,
        mustMemorize: [
          'Contracts are the source of truth for execution.',
          'Morpho API is GraphQL, rate-limited, and should be cached.',
          'Use the API for dashboards; use contracts for transactions.',
          'A solid partner integration has a degraded mode when the API is unavailable.'
        ],
        whyItMatters: 'This is exactly how a Solutions Architect frames build choices on a scoping call.',
        interviewDrill: 'A partner asks whether they can rely purely on the Morpho API in production. Give the right answer.',
        estimatedMinutes: 20,
        docsRefs: docs(
          ['Morpho API Get Started', 'https://docs.morpho.org/tools/offchain/api/get-started/'],
          ['SDKs', 'https://docs.morpho.org/tools/sdks/']
        )
      }),
      lesson({
        title: 'Blue SDK and Direct Contract Patterns',
        body: `## The MarketParams struct — memorize this cold

Every entrypoint in Morpho Blue accepts a \`MarketParams\` struct. This is the canonical market identity:

\`\`\`solidity
struct MarketParams {
    address loanToken;       // the asset that gets borrowed
    address collateralToken; // the asset posted as collateral
    address oracle;          // returns price of collateral in loan token units, scaled 1e36
    address irm;             // interest rate model (must be governance-approved)
    uint256 lltv;            // liquidation LTV, WAD-scaled (e.g. 860000000000000000 = 86%)
}
\`\`\`

The market ID is \`keccak256(abi.encode(marketParams))\`. You derive it deterministically — no registry needed.

## Core Blue functions — what they do and how to call them

| Function | What it does | Key detail |
|---|---|---|
| \`supply(marketParams, assets, shares, onBehalf, data)\` | Lend into a market | Pass assets>0,shares=0 for most cases |
| \`withdraw(marketParams, assets, shares, onBehalf, receiver)\` | Withdraw supplied funds | Pass assets=0,shares=max for full exit |
| \`borrow(marketParams, assets, shares, onBehalf, receiver)\` | Borrow from a market | Pass assets>0,shares=0 for UX |
| \`repay(marketParams, assets, shares, onBehalf, data)\` | Repay debt | Pass assets=0,shares=borrowShares for full repay |
| \`supplyCollateral(marketParams, assets, onBehalf, data)\` | Post collateral | Always assets-based; no yield, no shares |
| \`withdrawCollateral(marketParams, assets, onBehalf, receiver)\` | Retrieve collateral | Always assets-based |
| \`liquidate(marketParams, borrower, seizedAssets, repaidShares, data)\` | Liquidate an unhealthy position | Can specify seizedAssets or repaidShares |
| \`flashLoan(token, assets, data)\` | Flash loan any market asset | Must repay in same tx with callback |

## The dual assets/shares pattern — critical for interviews

Most functions take **either** assets or shares. Pass one, zero the other:

\`\`\`typescript
// SUPPLY: user deposits 1000 USDC (assets > 0, shares = 0)
await morpho.supply(marketParams, parseUnits('1000', 6), 0n, userAddress, '0x');

// BORROW: user borrows 500 USDC (assets > 0, shares = 0)
await morpho.borrow(marketParams, parseUnits('500', 6), 0n, userAddress, userAddress);

// FULL REPAY: use shares to ensure position fully closes (assets = 0, shares > 0)
const { borrowShares } = await morpho.position(marketId, userAddress);
await morpho.repay(marketParams, 0n, borrowShares, userAddress, '0x');

// FULL WITHDRAW: use shares for full exit (assets = 0, shares > 0)
const { supplyShares } = await morpho.position(marketId, userAddress);
await morpho.withdraw(marketParams, 0n, supplyShares, userAddress, userAddress);
\`\`\`

**Why it matters**: Always use \`shares\` for full exits to avoid dust. Always use \`assets\` for partial operations to give users intuitive amounts.

## Reading position state the right way

\`\`\`typescript
// 1. Get user position (supply shares, borrow shares, collateral assets)
const position = await morpho.position(marketId, userAddress);
// returns: { supplyShares, borrowShares, collateral }

// 2. Get market state (updated totals)
const market = await morpho.market(marketId);
// returns: { totalSupplyAssets, totalSupplyShares, totalBorrowAssets, totalBorrowShares, lastUpdate, fee }

// 3. Convert shares to assets manually (critical: rounding matters)
// For supply: round DOWN (favorable to the protocol)
const supplyAssets = (position.supplyShares * (market.totalSupplyAssets + 1n)) / (market.totalSupplyShares + 1n);
// For borrow: round UP (borrower pays more on uncertain positions)
const borrowAssets = (position.borrowShares * (market.totalBorrowAssets + 1n) + market.totalBorrowShares) / (market.totalBorrowShares + 1n);

// WARNING: totalBorrowAssets is only current as of lastUpdate.
// For real-time values, simulate interest accrual or use the Morpho SDK.
\`\`\`

## The integration pattern in order

1. Resolve \`MarketParams\` from the market ID using \`idToMarketParams(marketId)\`
2. Read \`market(marketId)\` for totals
3. Read \`position(marketId, userAddress)\` for user state
4. Convert shares to assets with correct rounding direction
5. Compute health factor: \`(collateralValue * lltv) / borrowAssets\`
6. Compute liquidation price: \`(borrowAssets * 1e36 * 1e18) / (collateralAssets * lltv)\`

## Tag

\`Integration-Pattern\` \`Math-In-Product\` \`Contract-Deep-Dive\``,
        mustMemorize: [
          'Accrue interest when presenting real-time debt or supply state.',
          'Shares must be converted with correct rounding direction.',
          'MarketParams are the canonical identity of a market.',
          'Local metric calculation should match onchain semantics.'
        ],
        whyItMatters: 'If you can connect raw state, share math, and UI metrics, you can ship trustworthy partner dashboards.',
        interviewDrill: 'Describe the minimum reads needed to show a user’s real-time HF on a dashboard.',
        estimatedMinutes: 30,
        docsRefs: docs(
          ['Borrow Data Tutorial', 'https://docs.morpho.org/build/borrow/tutorials/get-data/'],
          ['Morpho Contracts', 'https://docs.morpho.org/get-started/resources/contracts/morpho/']
        )
      }),
      lesson({
        title: 'Permits, Approvals, and Shares vs Assets',
        body: `## Approval philosophy

A good integration minimizes approval friction without becoming sloppy about risk.

## Practical rules

- prefer permit-style flows when available
- scope approvals rather than reaching for infinite allowances blindly
- always distinguish **assets** from **shares**
- show post-transaction estimates to the user before they sign

## Partner support reality

Many support incidents are not protocol bugs. They are:

- wrong unit conversions
- passing shares where assets were expected
- stale allowance state
- missing signature deadline or nonce handling

## What to say on calls

"We can reduce UX friction with permit-based flows, but we still need explicit unit discipline because Morpho exposes both shares and assets in multiple paths."

## Tag

\`Integration-Pattern\` \`Security-Hygiene\``,
        mustMemorize: [
          'Permit flows reduce clicks but do not eliminate unit-risk and allowance-risk.',
          'Shares and assets are not interchangeable.',
          'Always simulate the final state users should expect after a permit-based flow.',
          'Approval minimization is a product plus and a security plus.'
        ],
        whyItMatters: 'This is the type of pragmatic answer a partner-facing interviewer expects from a senior integration engineer.',
        interviewDrill: 'A partner says "we’ll just use max approvals everywhere." Push back constructively.',
        estimatedMinutes: 25,
        docsRefs: docs(
          ['Build Borrow Tutorials', 'https://docs.morpho.org/build/borrow/tutorials/'],
          ['Vault Mechanics', 'https://docs.morpho.org/build/earn/concepts/vault-mechanics/']
        )
      }),
      lesson({
        title: 'Bundler3 for Atomic Flows',
        body: `## What problem Bundler3 actually solves

Before understanding the contract, understand the problem. A typical DeFi user flow for leveraged borrowing on Morpho requires at least four steps:

1. Approve the collateral token for the Morpho contract
2. Supply collateral to the market
3. Borrow the loan token
4. (Optional) Swap the borrowed token back into collateral and re-supply for leverage

If each step is a separate transaction, the user signs four times. Worse, if step 3 succeeds but step 4 fails (e.g., slippage exceeded), the user is left with an open borrow position they did not want. That is a dangerous partial state.

Bundler3 solves this by running all four steps as **a single atomic transaction**: all succeed or all revert. No dangerous partial state. One signature.

## Contract-level structure

\`\`\`solidity
function multicall(Call[] calldata bundle) external payable;
\`\`\`

Each \`Call\` struct contains:

\`\`\`solidity
struct Call {
  address to;        // Target contract (Morpho, adapter, DEX, etc.)
  bytes data;        // Encoded calldata
  uint256 value;     // Native ETH value to forward
  bool skipRevert;   // If true, this call can fail without reverting the whole bundle
  bytes32 callbackHash; // Controls reentrancy: the expected hash of the callback data
}
\`\`\`

**skipRevert** is powerful and dangerous. Use it for optional steps (like claiming rewards if they exist) where failure should not block the main flow. Never use it for critical steps like supply or borrow.

**callbackHash** exists because Bundler3 supports callback patterns. When a call needs to receive a callback (e.g., a flash loan pattern), the callbackHash tells the contract what callback data to expect.

## The initiator and why it matters

Bundler3 stores the original \`msg.sender\` in transient storage and exposes it to all adapters as \`initiator\`. This is a critical security design:

Without \`initiator\`, any contract could call an adapter on behalf of any user. With \`initiator\`, adapters can assert "the person who triggered this bundle is the same person whose assets I am moving." That is what prevents Bundler3 from being an open asset-drain vector.

Adapters that interact with user positions check the initiator before doing anything sensitive.

## Adapter types and what they unlock

**GeneralAdapter (most common)**
Handles ERC20 transfers, native token wrapping, and most standard Morpho calls. This is the adapter you use for supply, borrow, repay, withdraw flows.

**Chain-specific adapters (e.g., EthereumGeneralAdapter1)**
Adds Ethereum-specific functionality like direct stETH or ETH wrapping paths. Used when the collateral is native ETH or a liquid staking derivative.

**ParaswapAdapter / DEX aggregation adapters**
Enables swaps within a bundle. This is what powers one-click leverage: borrow USDC, swap to ETH via Paraswap, resupply ETH collateral, all in one transaction.

**Migration adapters (Aave, Compound)**
Enables "move my entire position from Aave to Morpho" as a single transaction. This is a partner acquisition tool.

## Worked example: one-click leverage (step by step)

User goal: start with 1 ETH as collateral on an ETH/USDC market and achieve 1.5x leverage.

**Without Bundler3 (4 transactions, dangerous if any fail):**
1. approve(Morpho, 1 ETH)
2. supplyCollateral(market, 1 ETH)
3. borrow(market, 500 USDC)
4. swap(500 USDC → 0.167 ETH via DEX)
5. supplyCollateral(market, 0.167 ETH)  ← 5 steps if you include the final resupply

**With Bundler3 (1 transaction):**
\`\`\`typescript
const calls = [
  // Step 1: Transfer ETH to bundler (or use permit for ERC20 collateral)
  { to: generalAdapter, data: encode('transferFrom', [user, bundler, 1 ETH]) },
  // Step 2: Supply collateral to market
  { to: generalAdapter, data: encode('morphoSupplyCollateral', [marketParams, 1 ETH, user, []]) },
  // Step 3: Borrow USDC
  { to: generalAdapter, data: encode('morphoBorrow', [marketParams, 500 USDC, 0, MAX_SLIPPAGE, user]) },
  // Step 4: Swap borrowed USDC → ETH via Paraswap
  { to: paraswapAdapter, data: encode('sell', [paraswapCalldata]) },
  // Step 5: Resupply the additional ETH
  { to: generalAdapter, data: encode('morphoSupplyCollateral', [marketParams, 0.167 ETH, user, []]) },
];
await bundler3.multicall(calls);
\`\`\`

If the Paraswap swap fails (e.g., slippage exceeded), the entire bundle reverts. The user's position is unchanged. No dangerous partial state.

## Worked example: permit + supply in one click

Users frequently complain about having to sign two transactions for a supply (approve + supply). With Bundler3 + permit:

\`\`\`typescript
const calls = [
  // User signs a permit off-chain (no transaction needed)
  { to: generalAdapter, data: encode('permit', [token, amount, deadline, v, r, s]) },
  // The permit is submitted inside the bundle alongside the supply
  { to: generalAdapter, data: encode('morphoSupply', [marketParams, amount, 0, user, []]) },
];
await bundler3.multicall(calls);
\`\`\`

Net result: one transaction instead of two. The permit signature is included as calldata, so it is validated atomically with the supply.

## Error handling and edge cases

**What if the user's slippage tolerance is exceeded in a swap step?**
The DEX adapter call reverts. Because skipRevert is false for critical steps, the entire bundle reverts. The user sees one failed transaction with the specific revert reason from the swap. No cleanup needed.

**What if the user does not have enough collateral in their wallet?**
The transferFrom call reverts. Bundle fails immediately. No position is opened.

**What about gas estimation?**
Gas estimation for Bundler3 bundles is more complex than for single calls. The estimate should include all calls in the bundle. For swaps, the slippage simulation affects the estimated gas. Use simulateContract for each step individually, then sum, and add a 20–30% buffer for safety.

**What about tokens that do not support EIP-2612 permit?**
The user must pre-approve the Bundler3 generalAdapter address (not the Morpho contract directly). Then the bundle proceeds without a permit step. Alternatively, use Permit2 if supported.

## Bundler3 addresses (chain-specific)

| Chain | Bundler3 address |
|---|---|
| Ethereum | 0x6566194141eefa99Af43Bb5Aa71460Ca2Dc90245 |
| Base | 0x6BFd8137e702540E7A42B74178A4a49Ba43920C4 |

Always verify current addresses on the official Addresses page before shipping.

## What to emphasize to a partner

> "Bundler3 is not primarily a gas optimization. It is a state safety guarantee. In DeFi, partial execution is often worse than no execution at all. One signed transaction that atomically either fully executes or fully reverts is the right UX default for any multi-step flow."

## Tag

\`Bundler3\` \`Partner-Scenario\` \`Integration-Pattern\``,
        mustMemorize: [
          'Bundler3 is a call dispatcher for atomic execution of arbitrary calls.',
          'The core entrypoint is multicall(Call[] calldata bundle).',
          'Each call has to, data, value, skipRevert, and callbackHash fields.',
          'CoreAdapter exposes the initiator so adapters can enforce permission checks.',
          'Bundler3 is ideal for complex multi-step flows like leverage or refinancing.',
          'The value proposition is safe workflow composition, not just fewer transactions.',
          'Bundler3 addresses are chain-specific; verify them on the Addresses page.'
        ],
        whyItMatters: 'This lesson prepares you for the inevitable "why bundler instead of separate txs?" question.',
        interviewDrill: 'Walk through a supply collateral -> borrow -> swap -> resupply leveraged flow and explain why atomicity matters.',
        estimatedMinutes: 30,
        docsRefs: docs(
          ['Bundlers Concept', 'https://docs.morpho.org/learn/concepts/bundlers/'],
          ['Bundler3 Contract Reference', 'https://docs.morpho.org/get-started/resources/contracts/bundlers/'],
          ['Permit2 Guide', 'https://blog.uniswap.org/permit2-integration-guide']
        )
      }),
      lesson({
        title: 'Morpho API, GraphQL Complexity, and Fallback Design',
        body: `## API rules from the docs

- Endpoint: \`https://api.morpho.org/graphql\`
- Interactive playground: visit the endpoint in a browser
- Max complexity: **1,000,000 per query**
- Rate limit: **5,000 requests / 5 minutes**
- SLA: **none** — build for failure, not uptime guarantees

## APY field semantics — know these cold

| Field | Meaning |
|---|---|
| \`state.apy\` | Native vault APY from lending only (no rewards) |
| \`state.netApy\` | Native APY + all reward APRs - performance fee |
| \`state.netApyWithoutRewards\` | Native APY - performance fee, no rewards |
| \`state.avgApy\` | 6-hour average native APY |
| \`state.avgNetApy\` | 6-hour average including rewards, after fee |
| \`state.rewards[].supplyApr\` | Annualized APR from a specific reward token |
| \`asset.yield.apr\` | Yield from the underlying asset (e.g., stETH rebase) |

**Net APY formula**: \`Native APY + Underlying Token Yield + Rewards APRs - Perf Fee on Native APY\`

Show \`netApy\` as the headline. Break out \`rewards\` by token. Never collapse everything without disclosure.

## Critical query patterns

### vault discovery list
\`\`\`graphql
query {
  vaults(first: 100, orderBy: TotalAssetsUsd, orderDirection: Desc) {
    items {
      address symbol name listed
      asset { address symbol decimals }
      chain { id network }
      state { totalAssets totalAssetsUsd apy netApy }
    }
  }
}
\`\`\`

### single vault with full allocation breakdown
\`\`\`graphql
query {
  vaultByAddress(address: "0x...", chainId: 1) {
    address name
    state {
      apy netApy
      rewards { supplyApr asset { address symbol } }
      allocation {
        supplyAssets
        market { uniqueKey lltv state { borrowApy supplyApy utilization } }
      }
    }
  }
}
\`\`\`

The \`state.allocation[]\` field is the vault composition breakdown: what share of assets is deployed to each underlying market.

### user positions for a wallet
\`\`\`graphql
query {
  userByAddress(address: "0x...", chainId: 1) {
    vaultPositions {
      shares assets assetsUsd
      vault { address symbol state { netApy } }
    }
    marketPositions {
      borrowAssets collateralAssets
      healthFactor
      market { uniqueKey lltv loanAsset { symbol } collateralAsset { symbol } }
    }
  }
}
\`\`\`

### public allocator shared liquidity (total borrowable calculation)
\`\`\`graphql
query {
  marketByUniqueKey(uniqueKey: "0x...") {
    state { liquidityAssets }
    publicAllocatorSharedLiquidity {
      assets
      vault { address }
      allocationMarket { uniqueKey }
    }
  }
}
\`\`\`

Total borrowable = \`liquidityAssets + sum(publicAllocatorSharedLiquidity[].assets)\`

## Production-safe pattern

\`\`\`typescript
// Pattern: discovery first, detail on demand, fallback for critical reads
const vaultList = await fetchVaults(chainId); // lightweight list
const vaultDetail = await fetchVaultByAddress(selectedAddress, chainId); // on selection
const userPositions = await fetchUserPositions(walletAddress, chainId); // on connect

// Cache all responses — poll no faster than 30 seconds
// For critical HF: always go onchain, never trust cached API
const healthFactor = await computeHFOnchain(userAddress, marketId);
\`\`\`

## Degraded mode design

When the API fails, production integrations should:
1. Show the last cached response with a freshness timestamp ("Data from 5 minutes ago")
2. Mark HF values as "Estimated" or fall back to live onchain reads for borrow positions
3. Show the API error visibly rather than blank cards
4. Never let a stale API response silently prevent a deposit or withdrawal

## Partner-value framing

> "We can ship a responsive dashboard quickly with GraphQL, but we should treat it as an indexed read layer, not as the sole execution or safety source. For sensitive user actions, we validate against the chain before confirming."

## Tag

\`GraphQL\` \`POC-Readiness\` \`Integration-Safety\``,
        mustMemorize: [
          'Main endpoint: https://api.morpho.org/graphql.',
          'Maximum GraphQL complexity is 1,000,000.',
          'Rate limit is 5k requests per 5 minutes.',
          'Production integrations should cache and degrade gracefully.'
        ],
        whyItMatters: 'This is how you demonstrate that you think like someone who has actually supported data-heavy partner dashboards.',
        interviewDrill: 'A partner wants to poll everything every 2 seconds. Explain why that is a bad plan and propose a better one.',
        estimatedMinutes: 30,
        docsRefs: docs(
          ['Morpho API Get Started', 'https://docs.morpho.org/tools/offchain/api/get-started/'],
          ['Morpho Vaults API', 'https://docs.morpho.org/tools/offchain/api/morpho-vaults/']
        )
      }),
      lesson({
        title: 'Security Checklist for Real Integrations',
        body: `## Checks that prevent embarrassing incidents

Before telling a partner they are ready for production, review:

1. oracle path and decimal normalization
2. safety buffers on borrow flows
3. slippage protection on swap legs
4. timelock and role assumptions in vault flows
5. approvals and permit deadlines
6. fallback behavior when API data is stale or unavailable
7. handling of dust and rounding

## Partner support script

When something goes wrong:

- acknowledge impact
- identify whether it is data, execution, or config
- isolate the failing layer
- provide a workaround if possible
- feed the root cause back internally

## Tag

\`Security-Hygiene\` \`Partner-Scenario\``,
        mustMemorize: [
          'Separate data-layer issues from execution-layer issues.',
          'Most integration failures come from decimal, approval, swap, or fallback design mistakes.',
          'Never approve a production rollout without reviewing oracle assumptions and user safety buffers.',
          'Clear incident communication is part of the technical job.'
        ],
        whyItMatters: 'The Morpho role is as much about reducing partner mistakes as it is about writing snippets.',
        interviewDrill: 'A partner’s dashboard shows healthy positions that are actually liquidatable. What do you check first?',
        estimatedMinutes: 25,
        docsRefs: docs(
          ['Security Considerations for Vault Curators', 'https://docs.morpho.org/curate/concepts/security-considerations/'],
          ['Morpho API Get Started', 'https://docs.morpho.org/tools/offchain/api/get-started/']
        )
      })
    ]
  },
  {
    slug: 'real-world-integrations-and-merkl',
    title: 'Module 5: Real-World Integrations & Partner Demos',
    category: 'build',
    durationHours: 4,
    summary: 'Practice real partner patterns with GraphQL, Merkl rewards, APY+APR dashboards, claim simulation, and BigInt-safe frontend logic.',
    objective: 'Be ready to build a partner-facing POC that combines Morpho yield data with rewards in a way decision-makers understand.',
    format: 'read-build-drill',
    lessons: [
      lesson({
        title: 'The Merkl + Morpho Recipe Pattern',
        body: `## What the official demo teaches

The \`morpho-org/merkl-morpho-recipe\` GitHub repository is an educational Next.js 15 + TypeScript application that demonstrates the canonical pattern for combining two distinct data systems:

- **Morpho GraphQL API** — vault metrics, market state, base APY, reward APR fields
- **Merkl REST API** — user-level claimable amounts, per-token reward data, Merkle proofs for claim transactions

The distinction matters: Morpho's API tells you what reward rates are being offered on a vault right now. Merkl's API tells you what a specific wallet address has actually earned and can claim today.

## Repository structure you need to know

\`\`\`
src/
├── lib/
│   ├── api.ts          ← Morpho GraphQL fetch + Merkl REST fetch
│   ├── claiming.ts     ← Merkl claim transaction builder
│   └── helpers/
│       └── rewards.ts  ← APY / APR aggregation helpers
├── hooks/
│   └── useVaultData.ts ← React hook wrapping api.ts
└── components/
    ├── VaultMetricsPanel.tsx   ← shows base APY + rewards APR
    ├── UserRewardsPanel.tsx    ← shows claimable per token
    └── ClaimImplementationPanel.tsx ← claim button + tx flow
\`\`\`

The three-layer architecture — data (lib/), state (hooks/), display (components/) — is exactly the pattern Morpho expects Partner Engineers to propose when scoping a POC.

## Two APIs, two jobs

### Morpho API: vault state + reward rates

\`\`\`typescript
// src/lib/api.ts
export async function getVaultData(vaultAddress: string, chainId: number) {
  const morphoData = await fetchMorphoVault(vaultAddress, chainId);

  const rewards = morphoData.vault.state.rewards.map((r) => ({
    token: r.asset.symbol,
    apr: parseFloat(r.supplyApr),           // reward APR as decimal
    yearlySupplyTokens: r.yearlySupplyTokens,
  }));

  const baseApy    = parseFloat(morphoData.vault.state.apy);
  const rewardsApr = rewards.reduce((sum, r) => sum + r.apr, 0);

  return {
    vault:      morphoData.vault,
    baseApy,
    rewardsApr,
    totalApy:   baseApy + rewardsApr,   // ← show breakdown, not just this
    rewards,
  };
}
\`\`\`

Key insight: \`state.rewards[].supplyApr\` is already in the Morpho GraphQL response. You do **not** need to call Merkl to get vault-level APR numbers.

### Merkl API: user claimable amounts and proofs

Merkl updates its Merkle tree every **8 hours**. Users see near-real-time reward accrual; the onchain claimable amount lags by up to 8 hours.

\`\`\`typescript
// Two endpoints you must know:
// 1. User reward amounts
GET https://api.merkl.xyz/v4/userRewards?user={address}&chainId={chainId}

// 2. Claim data (amounts + Merkle proofs for the transaction)
GET https://api.merkl.xyz/v4/claim?user={address}&chainId={chainId}
\`\`\`

\`\`\`typescript
// src/lib/helpers/rewards.ts
export async function getUserRewards(userAddress: string, chainId: number) {
  return fetchMerklUserRewards(userAddress, chainId);
}
\`\`\`

## Claim transaction flow

The Merkl Distributor \`claim\` function signature:

\`\`\`solidity
function claim(
  address   user,
  address[] tokens,
  uint256[] amounts,
  bytes32[][] proofs
) external;
\`\`\`

\`\`\`typescript
// src/lib/claiming.ts
export async function claimMerklRewards(
  userAddress: string,
  chainId: number,
  walletClient: WalletClient
) {
  // 1. Fetch Merkle proof data
  const claimData = await fetch(
    \`https://api.merkl.xyz/v4/claim?user=\${userAddress}&chainId=\${chainId}\`
  ).then((r) => r.json());

  // 2. Submit claim
  const hash = await walletClient.writeContract({
    address: MERKL_DISTRIBUTOR_ADDRESS,
    abi:     MERKL_ABI,
    functionName: 'claim',
    args: [claimData.user, claimData.tokens, claimData.amounts, claimData.proofs],
  });

  return walletClient.waitForTransactionReceipt({ hash });
}
\`\`\`

All Morpho users (vault depositors, market suppliers, and borrowers) use the **identical** claim flow. There is no special path for each position type.

## Display rule: always decompose before combining

\`\`\`tsx
// VaultMetricsPanel.tsx — correct APY display order
<div className="total-apy">
  Total APY: {data.totalApy.toFixed(2)}%
</div>
<div className="breakdown">
  <div>Base APY: {data.baseApy.toFixed(2)}%</div>
  {data.rewardsApr > 0 && (
    <div>Rewards: +{data.rewardsApr.toFixed(2)}%</div>
  )}
</div>
\`\`\`

Never surface only the combined number. Partners will be unable to explain the yield to their own users, and the number will be wrong the moment any reward program changes.

## Critical distinction: legacy rewards

Before MIP 111 (July 2025), Morpho used its own Universal Rewards Distributor (URD) system. That API (\`rewards.morpho.org\`) is **deprecated**. All new programs are Merkl-only. If a user asks about unclaimed old rewards, point them to \`rewards-legacy.morpho.org\`.

## Why this is the right POC answer

When a Morpho interviewer asks "how would you build a partner demo fast?", the recipe pattern is the correct answer because:

1. It uses the same two data sources a real production integration needs
2. It demonstrates the Morpho-specific design principle of separating base yield from incentives
3. It shows you understand the claim UX is a separate concern from the APY display
4. It ships something a non-technical partner stakeholder can click and understand in under 10 minutes

## Tag

\`Merkl\` \`POC-Readiness\``,
        mustMemorize: [
          'The Merkl recipe is educational, not production-ready.',
          'Morpho GraphQL + Merkl REST is the standard combined-yield dashboard pattern.',
          'Show base APY and rewards APR separately before showing combined yield.',
          'This is a textbook Partner Engineer demo pattern.'
        ],
        whyItMatters: 'If Morpho asks how you would build a partner demo quickly, this is one of the best concrete answers you can give.',
        interviewDrill: 'Describe the Merkl + Morpho recipe to a BD teammate who wants to know why it is useful in partner sales motions.',
        estimatedMinutes: 20,
        docsRefs: docs(
          ['Fetch Rewards Data', 'https://docs.morpho.org/build/rewards/tutorials/fetch-rewards-data/'],
          ['Morpho API Rewards', 'https://docs.morpho.org/tools/offchain/api/rewards/'],
          ['Merkl Morpho Recipe', 'https://github.com/morpho-org/merkl-morpho-recipe']
        )
      }),
      lesson({
        title: 'Exact GraphQL Queries for Vault Lists, APY, and Rewards',
        body: `## API endpoint and key facts

- Endpoint: \`https://api.morpho.org/graphql\`
- Interactive playground: \`https://api.morpho.org/graphql\` (browser UI)
- Max complexity: **1,000,000 per query**
- Rate limit: **5,000 requests / 5 minutes**
- No SLA: always build a fallback

## Query pattern 1: vault discovery list (V1 vaults — current standard)

\`\`\`graphql
query {
  vaults(first: 100, orderBy: TotalAssetsUsd, orderDirection: Desc) {
    items {
      address
      symbol
      name
      listed
      asset {
        address
        symbol
        decimals
      }
      chain {
        id
        network
      }
      state {
        totalAssets
        totalAssetsUsd
        totalSupply
        apy
        netApy
      }
    }
  }
}
\`\`\`

## Query pattern 2: single vault with full APY breakdown (the real interview query)

\`\`\`graphql
query {
  vaultByAddress(
    address: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB"
    chainId: 1
  ) {
    address
    name
    asset {
      yield {
        apr
      }
    }
    state {
      apy
      netApy
      netApyWithoutRewards
      avgApy
      avgNetApy
      dailyApy
      dailyNetApy
      weeklyApy
      weeklyNetApy
      monthlyApy
      monthlyNetApy
      rewards {
        asset {
          address
          symbol
        }
        supplyApr
        yearlySupplyTokens
      }
      allocation {
        supplyAssets
        supplyAssetsUsd
        market {
          uniqueKey
          state {
            rewards {
              asset {
                address
                symbol
              }
              supplyApr
              borrowApr
            }
          }
        }
      }
    }
  }
}
\`\`\`

## APY field semantics — know these cold

| Field | What it means |
|---|---|
| \`apy\` | Native vault APY from lending only |
| \`netApy\` | Native APY + all rewards - performance fee |
| \`netApyWithoutRewards\` | Native APY - performance fee (no rewards) |
| \`avgApy\` | 6-hour average, native only |
| \`avgNetApy\` | 6-hour average including rewards, after fee |
| \`dailyApy\` | 24-hour window estimate |
| \`weeklyApy\` | 7-day window estimate |
| \`state.rewards[].supplyApr\` | Annualized APR from a specific reward token |
| \`asset.yield.apr\` | Yield from the underlying token itself (e.g. stETH) |

**Net APY formula**: \`Native APY + Underlying Token Yield + Rewards APRs - Perf Fee on Native APY\`

## Query pattern 3: user vault positions

\`\`\`graphql
query GetUserVaultPositions($address: String!, $chainId: Int!) {
  userByAddress(address: $address, chainId: $chainId) {
    vaultPositions {
      shares
      assets
      assetsUsd
      vault {
        address
        symbol
        state {
          netApy
        }
      }
    }
  }
}
\`\`\`

## Query pattern 4: market data for borrow dashboards

\`\`\`graphql
query {
  markets(where: { listed: true }) {
    items {
      uniqueKey
      lltv
      loanAsset { address symbol decimals }
      collateralAsset { address symbol decimals }
      state {
        borrowAssets
        supplyAssets
        utilization
        fee
        supplyApy
        borrowApy
        rewards {
          asset { address symbol }
          supplyApr
          borrowApr
        }
      }
    }
  }
}
\`\`\`

## Production pattern: discovery first, detail second

\`\`\`typescript
// Step 1: lightweight list (low complexity)
const vaultList = await fetchVaults(chainId);

// Step 2: user selects vault — then fetch full detail
const vaultDetail = await fetchVaultByAddress(selectedAddress, chainId);

// Step 3: for connected user, fetch positions separately
const userPositions = await fetchUserPositions(walletAddress, chainId);

// Step 4: cache all of the above — poll no faster than 30 seconds
// Step 5: critical health factor calculations always go onchain, never trust stale API
\`\`\`

## Tag

\`GraphQL\` \`POC-Readiness\` \`Merkl\``,
        mustMemorize: [
          'vaultV2s is the discovery root for vault lists.',
          'avgApy / avgNetApy and rewards.supplyApr are the main combined-yield fields.',
          'userByAddress -> vaultV2Positions is the key user-vault query family.',
          'Keep queries narrow to respect complexity and rate limits.'
        ],
        whyItMatters: 'This is the practical query toolkit you need to demo a partner rewards dashboard without fumbling through docs live.',
        interviewDrill: 'Talk through the minimal GraphQL data you would fetch for a vault comparison table with rewards.',
        estimatedMinutes: 35,
        docsRefs: docs(
          ['Morpho Vaults API', 'https://docs.morpho.org/tools/offchain/api/morpho-vaults/'],
          ['Morpho API Get Started', 'https://docs.morpho.org/tools/offchain/api/get-started/']
        )
      }),
      lesson({
        title: 'Merkl Rewards, Claim Context, and Combined Yield Display',
        body: `## Rewards stack

The docs explicitly say:

- legacy \`rewards.morpho.org\` is deprecated
- all new reward programs are distributed through **Merkl**
- for Vault V2 rewards, Morpho API already retrieves rewards data from Merkl

## One query worth memorizing

\`\`\`graphql
query VaultV2Rewards($address: String!, $chainId: Int!) {
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
}
\`\`\`

## UX rule

Show:

1. base APY
2. incentive APR by token
3. combined estimate

Do not flatten everything into one giant number without explanation.

## Claim simulation pattern

For user-specific rewards, the Merkl side provides program-level and claim-oriented data. A strong POC shows claimable tokens, estimated value, and a dry-run / simulation step before prompting a real claim action.

## Tag

\`Merkl\` \`Rewards-UX\``,
        mustMemorize: [
          'Legacy rewards API is deprecated; new programs are distributed via Merkl.',
          'Vault V2 rewards are pre-aggregated in the Morpho API.',
          'Show base APY, token-by-token reward APR, then combined yield.',
          'Claim simulation is a strong partner demo because it turns rewards into a user action, not just a metric.'
        ],
        whyItMatters: 'Partners care about incentivized yields because incentives drive deposits. Your POC should make that obvious without overselling.',
        interviewDrill: 'Explain to a partner why combined APY should still be broken out into base and incentive components.',
        estimatedMinutes: 30,
        docsRefs: docs(
          ['Fetch Rewards Data', 'https://docs.morpho.org/build/rewards/tutorials/fetch-rewards-data/'],
          ['Rewards API', 'https://docs.morpho.org/tools/offchain/api/rewards/']
        )
      }),
      lesson({
        title: 'Frontend Hooks, BigInt Safety, and Error Handling',
        body: `## Why reward dashboards break

Most bugs come from these patterns:

- turning large integers into floats too early
- mixing APR and APY concepts
- assuming every reward token has the same decimals
- treating empty Merkl payloads as fatal

## Robust front-end pattern

- fetch Morpho and Merkl in parallel
- normalize token metadata per reward asset
- keep raw amounts as \`bigint\` until final formatting
- isolate network / API failures per panel
- render partial data rather than blank screens

## Hook design

Split by concern:

- query hook for vault state
- query hook for rewards
- composition hook for combined yield

That is the same architecture taught by the Merkl recipe: separate data, logic, and UI.

## Tag

\`Merkl\` \`Frontend-Safety\``,
        mustMemorize: [
          'Keep raw token math in bigint until the formatting boundary.',
          'APR and APY are not interchangeable.',
          'Partial failure handling is mandatory for multi-source dashboards.',
          'Separate hooks for Morpho state, Merkl rewards, and combined calculations.'
        ],
        whyItMatters: 'Partner-facing demos fail most often in the frontend. This lesson makes your POC feel senior rather than hacky.',
        interviewDrill: 'A reward token with 6 decimals and one with 18 decimals display the same value on your dashboard. Diagnose the likely bug.',
        estimatedMinutes: 30,
        docsRefs: docs(
          ['Morpho API Get Started', 'https://docs.morpho.org/tools/offchain/api/get-started/'],
          ['Merkl Morpho Recipe', 'https://github.com/morpho-org/merkl-morpho-recipe']
        )
      }),
      lesson({
        title: 'How to Use This Pattern in a Partner Demo',
        body: `## Demo scenario

Imagine a partner wants to launch an incentivized vault campaign.

Your fastest useful demo is:

1. list their target vaults
2. show native APY and net APY
3. overlay Merkl incentive APR by token
4. show total estimated yield
5. show user positions and claimable rewards
6. simulate a claim or deposit path

## Business translation

When presenting:

- speak to deposit growth, not only contract details
- explain that incentives are additive but variable
- clarify that reward APR can change faster than base yield
- set expectations that claim paths are separate from passive yield display

## Partner objection handling

If they ask "Can you build this quickly?" the honest strong answer is:

"Yes. I would use Morpho GraphQL for vault discovery and state, Merkl for reward context, then ship a cache-backed dashboard with explicit APY/APR split and claim simulation."

## Tag

\`Partner-Scenario\` \`Demo-Ready\``,
        mustMemorize: [
          'The winning demo pattern is vault discovery + native yield + reward APR + user claim context.',
          'Reward APR is not static; present it as incentive-driven and program-dependent.',
          'A good demo bridges protocol detail and business impact.',
          'Claim simulation is a strong differentiator in partner-facing POCs.'
        ],
        whyItMatters: 'This lesson connects all the technical pieces to the actual Morpho interview role.',
        interviewDrill: 'You have one hour before a partner call. Explain what POC you would ship first and why.',
        estimatedMinutes: 25,
        docsRefs: docs(
          ['Get Data for Earn', 'https://docs.morpho.org/build/earn/tutorials/get-data/'],
          ['Create a Rewards Program', 'https://docs.morpho.org/build/rewards/tutorials/create-program/'],
          ['Merkl Morpho Recipe', 'https://github.com/morpho-org/merkl-morpho-recipe']
        )
      })
    ]
  },
  {
    slug: 'partner-communication-and-objections',
    title: 'Module 6: Partner Communication & Objection Handling',
    category: 'communication',
    durationHours: 3,
    summary: 'Translate Morpho’s technical architecture into partner value, handle objections, and manage high-context partner calls well.',
    objective: 'Sound like the technical counterpart BD wants beside them on a live partner call.',
    format: 'read-drill-roleplay',
    lessons: [
      lesson({
        title: 'Translate Tech into Business Value',
        body: `## Why this skill separates Partner Engineers from support engineers

A support engineer can explain what a function does. A Partner Engineer can explain why a partner's user cares. Technical translation is not about oversimplifying — it is about reordering the explanation. Lead with the partner's operational problem, then introduce the protocol primitive as the solution.

## Full translation table

| Technical fact | Business translation | When to use it |
|---|---|---|
| Isolated markets | Dedicated risk surface for your asset — failures in other markets do not contaminate yours | LRT/RWA partners asking about listing safety |
| Immutable core contract | The rules your users see today are the same rules six months from now — no governance can silently change them | Partners doing legal/compliance diligence |
| Permissionless market creation | You can list your asset without a protocol vote — today | New chain or new collateral launches |
| Vault V2 caps + roles | You can enforce "max 15M to this collateral" without trusting any single operator to self-police | Institutional curators asking about risk controls |
| Bundler3 atomicity | Your users get leverage or refinancing in one click and one gas payment, not 3–4 confirmations | Wallets or apps building UX-sensitive products |
| Merkl rewards integration | Your incentive program automatically credits every qualifying depositor without manual distribution — and it separates cleanly from the base yield | Partners building yield-bearing products |
| ERC-4626 compliance | Your vault shows up natively in any DeFi aggregator or portfolio tracker that reads 4626 | Earn integrators asking about discoverability |
| Public Allocator | Users can self-service move liquidity between markets within a vault without curator intervention | High-throughput borrow apps needing responsive liquidity |

## The communication anti-pattern to avoid

**Wrong order:**
> "We have isolated markets with a five-parameter identity hash. The health factor is computed using a 1e36 oracle price scale and WAD-format LLTV. You can create a market permissionlessly by calling createMarket() with the MarketParams struct."

**Right order:**
> "If you list your LRT on Morpho, you get dedicated market parameters — your own oracle, your own LLTV, your own liquidity. A problem in another market never touches yours. You can list it today without any vote. Want me to show you what that createMarket call looks like?"

## Partner-type translation cheat sheet

**Wallet partner (e.g., Metamask, Coinbase Wallet)**
- They care about: one-click flows, ERC-4626 discoverability, user-facing APY display
- Lead with: Bundler3 + 4626 compliance + GraphQL API for real-time yield

**LRT/RWA protocol (e.g., staking protocol with their own token)**
- They care about: getting their asset listed, custom LLTV, oracle flexibility
- Lead with: permissionless markets + isolated risk + partner-tuned parameters

**DeFi aggregator or leverage protocol**
- They care about: atomic operations, composability, liquidity depth
- Lead with: Bundler3 flash flows + GraphQL for market state + Vault V2 liquidity

**Institutional curator**
- They care about: operational controls, audit surface, governance risk
- Lead with: Vault V2 role system + cap hierarchy + timelock design

## Transition phrases that sound senior

- "The way I'd think about this for your use case is…"
- "That's essentially what [primitive] solves — let me map it to your product."
- "The technical constraint here is [X], but from your users' perspective it shows up as [Y]."
- "That's not a Morpho limitation — that's a design choice. Here's why it matters to your partners."

## Tag

\`Partner-Scenario\` \`Communication-Core\``,
        mustMemorize: [
          'Lead with partner outcomes, then explain protocol primitives.',
          'Every technical claim should map to a business or operational benefit.',
          'Do not drown a BD call in low-level details before establishing the use case.',
          'Strong communication sounds like architecture plus judgment.'
        ],
        whyItMatters: 'Morpho is hiring for someone who can bridge complexity and partner value, not someone who only recites formulas.',
        interviewDrill: 'Convert "abstract cap system" into a business-level explanation for a vault curator in two sentences.',
        estimatedMinutes: 20,
        docsRefs: docs(
          ['Curator Concept', 'https://docs.morpho.org/learn/concepts/curator/'],
          ['Morpho Vault V2', 'https://docs.morpho.org/learn/concepts/vault-v2/']
        )
      }),
      lesson({
        title: 'Run Better Discovery and Scoping Calls',
        body: `## Pre-call research (do this before the call)

Before joining any BD partner call, check:
1. What chain are they deployed on? Does Morpho have liquidity there?
2. Do they have an existing token or asset that needs a market?
3. Are they a wallet, protocol, or infrastructure provider?
4. What is their current lending solution if any?
5. Are any existing Morpho integrations on similar protocols?

## Opening the call (first 3 minutes)

Set the agenda explicitly so you run the time well:
> "We have 45 minutes. I'd like to spend the first 15 learning about your product and what you want to build, 15 minutes on the technical approach, and leave the last 15 for open questions and next steps. Does that work?"

## The 7 discovery questions — ask all of them

1. **Product goal**: Are you building an earn product, a borrow product, or both? What does the end user action look like?
2. **Asset scope**: Do you have a specific collateral or loan asset in mind, or do you want exposure to existing Morpho markets?
3. **Chain preference**: Which chains matter at launch — Ethereum, Base, or both?
4. **Workflow complexity**: Is the key user flow simple (deposit/withdraw) or complex (loop, leverage, refinance)?
5. **Data requirements**: Do you need a live dashboard, or just execution flows? If dashboard, what metrics matter?
6. **Incentives**: Are you planning to run a rewards program through Merkl to drive deposits or borrowing?
7. **Operational ownership**: Who owns monitoring and incident response after go-live on your side?

## After gathering answers, scope the integration explicitly

Good scoping call output (what you write before you hang up):

\`\`\`
Integration surface: [Direct Blue markets / Vault V1 / Vault V2 / SDK]
Chain: [Ethereum mainnet / Base / Both]
Key user flows: [e.g. supply collateral + borrow USDC]
Data sources: [GraphQL API + onchain fallback]
Merkl rewards: [Yes / No / TBD]
POC deliverable: [e.g. health factor dashboard + borrow simulator]
Timeline: [e.g. POC in 2 weeks, production in 6–8 weeks]
Blockers: [oracle choice, risk parameters, audit requirements]
\`\`\`

## Phrases that make you sound senior

- "To make sure we're scoping this correctly — is this a net-new market or exposure to existing listed markets?"
- "The implementation differs significantly depending on whether you need custom risk parameters or you're comfortable with community-managed markets."
- "For production, I'd want to verify oracle path and freshness before we finalize the architecture."
- "A POC for this would take 2–3 days. Production readiness with proper monitoring is 4–6 weeks."

## The red flags to watch for

- Partner wants to use the GraphQL API as their only data source (no onchain fallback)
- Partner wants to borrow against a non-standard or very thin liquidity asset without a custom market plan
- Partner assumes Morpho will match liquidity from incumbent protocols immediately
- Partner does not know who owns monitoring post-launch

## Tag

\`Partner-Scenario\` \`Scoping\` \`Communication-Core\``,
        mustMemorize: [
          'Always scope chain, workflow, risk assumptions, and monitoring ownership.',
          'The first call should end with a concrete technical next step.',
          'Differentiate POC scope from production scope explicitly.',
          'Merkl and dashboard requirements should be surfaced early if incentives matter.'
        ],
        whyItMatters: 'A Partner Engineer adds value by reducing ambiguity quickly.',
        interviewDrill: 'Role-play the first five questions you would ask a wallet partner that wants Morpho earn integration.',
        estimatedMinutes: 25,
        docsRefs: docs(
          ['Get Started Resources', 'https://docs.morpho.org/get-started/resources/'],
          ['Morpho API Get Started', 'https://docs.morpho.org/tools/offchain/api/get-started/']
        )
      }),
      lesson({
        title: 'Answer: Why Morpho over Aave or Compound?',
        body: `## The interview trap to avoid

Most candidates either attack incumbents ("Aave is outdated") or hedge too much ("they both have strengths"). Neither lands well. The strong answer is **use-case specific** and **technically precise**.

## Head-to-head comparison you should know cold

| Dimension | Aave V3 / Compound | Morpho |
|---|---|---|
| Market structure | Pooled, shared risk across all assets | Isolated per market, contained failure domain |
| Risk parameters | Governance-managed, can change | Immutable after market creation |
| New asset listing | Governance vote required | Permissionless (approved IRM/oracle required) |
| Oracle flexibility | Standardized Chainlink feeds | Custom oracle per market, 1e36 scaled |
| Managed strategies | Protocol-managed or simple wrappers | Vault V2 with curators, adapters, caps, role separation |
| Liquidation incentive | Protocol-collected fee model | All to liquidator, no protocol fee on liquidation |
| Speed to market | Weeks/months for governance | Days for a new isolated market |
| TVL (2026) | ~$15–20B+ across all markets | $10B+ focused on Ethereum and Base |

## The model answer for different partner types

**For a new token protocol wanting to bootstrap lending:**
> "Morpho lets you launch a dedicated market for your token in days without a governance vote. You pick your oracle, your LLTV, and your collateral pair. If something goes wrong with your token’s risk, the blast radius stays inside your market."

**For a wallet building an earn product:**
> "Vault V2 gives you institutional-grade curation controls — timelocked risk increases, role separation between strategy and execution, and a cap system that limits exposure at the adapter, collateral, and market level. That is hard to replicate in a pooled protocol."

**For a protocol asking about yield:**
> "Morpho does not charge a protocol liquidation fee. All incentives go directly to liquidators, which lets competitive liquidation economics keep rates tighter. Supply APY is borrowApy × utilization × (1 - curator fee) — fully transparent."

**For a cautious enterprise partner:**
> "Morpho’s core Blue contract is immutable. There is no owner key that can change your market’s LLTV or swap out your oracle mid-flight. Aave governance decisions could in principle affect all pools simultaneously. Morpho market risk stays local."

## Numbers to use in the pitch

- $10B+ TVL on Morpho across Ethereum and Base
- $70M raised from a16z, Coinbase Ventures, Ribbit Capital, Variant, Brevan Howard, and 50+ others
- One smart contract address per chain handles all markets
- Formal verification + multiple audits on the core Blue contract

## What Morpho does NOT claim to replace

- High-liquidity generalized markets where users want one-stop borrowing across many assets (Aave is often fine)
- Leverage vaults with deep Aave-backed liquidity already integrated
- Use cases where governance-managed rate adjustments are desirable

Saying this clearly makes you sound credible, not weak.

## Tag

\`Competitive-Positioning\` \`Partner-Scenario\``,
        mustMemorize: [
          'Be balanced: do not pretend incumbents have no strengths.',
          'Lead with isolated markets, immutability, and curation controls.',
          'Tailor the answer to the asset or product being launched.',
          'Credibility beats evangelism.'
        ],
        whyItMatters: 'This objection will come up in the interview and on real calls.',
        interviewDrill: 'Answer "Why Morpho over Aave?" in 45 seconds without sounding tribal.',
        estimatedMinutes: 25,
        docsRefs: docs(
          ['Morpho Market V1', 'https://docs.morpho.org/learn/concepts/market/'],
          ['Morpho Vault V2', 'https://docs.morpho.org/learn/concepts/vault-v2/']
        )
      }),
      lesson({
        title: 'Handle Liquidation and Risk Objections',
        body: `## The 5 objections you will face — and how to handle each

---

### Objection 1: "How do we know our users won’t get liquidated unexpectedly?"

**What they fear**: market risk, sudden price drops, invisible danger.

**Your answer**:
> "Liquidation is economically incentivized, not protocol-run. Liquidators monitor positions continuously and act when HF hits 1 because they earn the LIF bonus — roughly 5% on an 86% LLTV market. The product design answer is: surface HF prominently in the UI, simulate post-transaction HF before signing, add a safety buffer so users cannot borrow to exact max, and monitor oracle freshness. Morpho’s isolated markets also mean one bad asset does not put the whole protocol at risk."

**What not to say**: "Don’t worry, liquidations are rare." Or: "Liquidations are always executed fast."

---

### Objection 2: "What happens if there’s bad debt?"

**What they fear**: getting stuck with losses that are not theirs.

**Your answer**:
> "In isolated Blue markets, bad debt stays in that specific market. If collateral cannot cover the remaining debt after liquidation, the residual bad debt is absorbed by lenders in that market proportionally. It does not leak into other markets. For vaults, Vault V2 socializes bad debt through share price depreciation across all depositors in that vault — transparent and proportional, not hidden."

**Follow up**: explain that the LIF formula (\`min(1.15, 1 / (0.3 × LLTV + 0.7))\`) is calibrated to minimize bad debt likelihood, not eliminate it.

---

### Objection 3: "Morpho is newer than Aave — how battle-tested is it?"

**Your answer**:
> "The core Blue contract has been audited by multiple firms and formally verified. It is a simpler codebase than pooled protocols by design — intentional minimalism. $10B in deposits across Ethereum and Base, with institutional curators including [name the ones you know], suggests real trust from sophisticated operators. That said, newer products like Vault V2 are worth approaching with appropriate diligence on specific adapters and curator track records."

---

### Objection 4: "Can a curator rug vault depositors?"

**Your answer**:
> "Vault V2 has explicit timelock requirements for all risk-increasing actions. Adding an adapter takes at minimum 3 days. Removing one takes 7 days. Depositors have a window to exit before new risk comes live. Risk-reducing actions like cap decreases are immediate. Sentinels can revoke pending actions but cannot increase risk. That architecture is specifically designed so the curator cannot instantly change strategy and take depositor capital without notice."

---

### Objection 5: "What if the oracle is wrong or manipulated?"

**Your answer**:
> "Oracle risk is real in any lending protocol. The Morpho oracle returns collateral price in loan token units scaled by 1e36. Most markets use MorphoChainlinkOracleV2 which supports multi-hop Chainlink routes and vault conversion layers — those reduce but do not eliminate manipulation risk. The correct practice is to verify oracle path, check freshness, and ensure your integration uses integer math from the oracle output instead of converting to floats early. Isolated markets mean an oracle failure only affects the markets using that oracle, not the whole protocol."

---

## The 30-second empathetic format for any objection

1. Acknowledge the concern directly ("That’s a fair concern — here’s what matters")
2. Explain the mechanism in plain terms
3. Name the product or operational mitigation
4. Be honest about what the protocol does not guarantee
5. Offer a concrete next step if they want more depth

## Tag

\`Partner-Scenario\` \`Risk-Explainer\` \`Communication-Core\``,
        mustMemorize: [
          'Acknowledge risk first, then explain controls.',
          'Use HF, LLTV, safety buffers, and monitoring as the main mitigation vocabulary.',
          'Do not overstate liquidation certainty.',
          'Tie isolated markets back to containment of protocol-level blast radius.'
        ],
        whyItMatters: 'Empathetic technical explanation is a big part of developer relations and partner success.',
        interviewDrill: 'A partner is upset after a user liquidation. Explain the event clearly without sounding defensive.',
        estimatedMinutes: 20,
        docsRefs: docs(
          ['Liquidation Concept', 'https://docs.morpho.org/learn/concepts/liquidation/'],
          ['Collateral, LTV, and Health Factor', 'https://docs.morpho.org/learn/concepts/ltv-and-health-factor/']
        )
      }),
      lesson({
        title: 'Timezone Bridging, Escalations, and Closing the Loop',
        body: `## The job beyond coding

This role explicitly bridges timezones and forwards partner feedback into engineering.

## Good operating pattern

- summarize partner issue in reproducible steps
- separate protocol issue vs integrator issue
- provide a workaround when possible
- set expectation on next update time
- close the loop after internal investigation

## A strong escalation note includes

- chain
- market / vault address
- exact failing call or query
- reproduction steps
- expected vs actual result
- impact level
- whether user funds are at risk

## Tag

\`Partner-Scenario\` \`Operational-Excellence\``,
        mustMemorize: [
          'Escalations must be reproducible and scoped.',
          'Always separate protocol bugs from integration bugs.',
          'Set next-update expectations explicitly across timezones.',
          'Closing the loop matters as much as first response.'
        ],
        whyItMatters: 'This is where partner trust is won or lost after the initial excitement of the integration.',
        interviewDrill: 'Write the first 3 things you would send engineering after a partner reports a suspected vault withdrawal issue.',
        estimatedMinutes: 20,
        docsRefs: docs(
          ['Get Started Resources', 'https://docs.morpho.org/get-started/resources/'],
          ['Morpho API Get Started', 'https://docs.morpho.org/tools/offchain/api/get-started/']
        )
      })
    ]
  },
  {
    slug: 'building-pocs-and-dashboards',
    title: 'Module 7: Building POCs & Dashboards',
    category: 'build',
    durationHours: 3,
    summary: 'Turn the protocol into useful demos, internal tools, and partner dashboards that answer real questions fast.',
    objective: 'Think in terms of fast-to-ship POCs with defensible technical choices.',
    format: 'read-build-drill',
    lessons: [
      lesson({
        title: 'Fastest High-Value POC Patterns',
        body: `## POC #1: Vault comparison table (2–3 days)

**What it shows**: All Morpho vaults on one or two chains, with TVL, native APY, reward APR, and combined net APY.

**Why it wins**: Every earn-product partner starts by asking "which vault should my users be in?" This answers it visually.

**Data sources**:
- \`vaults(first: 100, orderBy: TotalAssetsUsd)\` from GraphQL for list + APY
- \`state.netApy\`, \`state.rewards[].supplyApr\`, \`state.totalAssetsUsd\`

**Tech stack**: Next.js + Tailwind + SWR for polling, BigInt-safe formatting for APY display.

**Talking points for BD**: "We built this in 2 days. Here is exactly what a partner's earn page would look like."

---

## POC #2: Borrow health monitor (2–3 days)

**What it shows**: All open positions for a wallet across Morpho markets, with current HF, LTV, and liquidation price for each.

**Why it wins**: Every borrow integration partner asks "how do we show users when they're in danger?"

**Data sources**:
- \`userByAddress → marketPositions\` from GraphQL for discovery
- Onchain \`position(marketId, userAddress)\` + \`market(marketId)\` for real-time HF
- Compute HF locally: \`(collateralAssets × oraclePrice / 1e36 × LLTV) / borrowAssets\`

**Alert logic**: highlight positions with HF < 1.10 in orange, HF < 1.02 in red.

**Talking points for BD**: "Risk monitoring is the #1 user request from borrowers. This dashboard lets a partner brand it in 3 days."

---

## POC #3: Bundler3 one-click leverage (3–4 days)

**What it shows**: A UI where a user picks a market and leverage ratio, and the full loop (supply → borrow → swap → re-supply) executes in one transaction.

**Why it wins**: Shows Bundler3's power more concretely than any explanation.

**Implementation notes**:
- Compute required swap amount for target leverage
- Build the \`Call[]\` bundle: supplyCollateral + borrow + ParaswapAdapter swap + supplyCollateral again
- Show simulated post-transaction HF before signing

**Talking points for BD**: "This is the same flow that would take 4 transactions on Aave. Morpho does it in one."

---

## POC #4: Rewards-aware yield dashboard (2–3 days)

**What it shows**: Combined yield = native APY + Merkl rewards + underlying token yield, broken down by component.

**Data sources**:
- Morpho GraphQL: \`state.apy\`, \`state.netApy\`, \`state.rewards[].supplyApr\`, \`asset.yield.apr\`
- Merkl REST: campaign data and claim context per user

**Key lesson**: Show native APY and reward APR as separate bars, then combined net APY as the headline.

**Talking points for BD**: "This is the yield breakdown your users need to understand what they're actually earning."

---

## What makes a partner POC land

1. **Answers one real question** — do not build a kitchen sink
2. **Uses real protocol data** — not mocked numbers
3. **Shows business value** — not just API endpoints
4. **Explains the tech** — one minute verbal walk-through
5. **Points to production path** — what changes to go from POC to real?

## The pitch structure for any POC

> "We can ship [POC name] in [N] days. It answers [the specific partner question]. The data comes from [GraphQL / onchain]. The main thing that changes for production is [monitoring / security audit / customization]. Want me to do a quick build?"

## Tag

\`POC-Readiness\` \`Partner-Scenario\` \`Communication-Core\``,
        mustMemorize: [
          'The best POCs answer a real operational question, not just display random metrics.',
          'Health dashboards, yield dashboards, and flow simulators are high-value defaults.',
          'A good POC should be explainable to BD and useful to engineering.',
          'Prefer cache-backed read layers plus a narrow execution path.'
        ],
        whyItMatters: 'Interviewers want to believe you can make useful artifacts quickly.',
        interviewDrill: 'Pitch the first POC you would build for a new wallet partner in under a minute.',
        estimatedMinutes: 20,
        docsRefs: docs(
          ['Get Data for Borrow', 'https://docs.morpho.org/build/borrow/tutorials/get-data/'],
          ['Get Data for Earn', 'https://docs.morpho.org/build/earn/tutorials/get-data/']
        )
      }),
      lesson({
        title: 'Dashboard Data Model: Positions, HF, Yield, Rewards',
        body: `## Two fundamentally different dashboard types

A borrow dashboard and an earn dashboard answer completely different user questions. Build them independently. The data model, API queries, and risk logic do not overlap.

**Borrow dashboard question**: "Am I at risk of being liquidated?"
**Earn dashboard question**: "Which vault gives the best risk-adjusted yield?"

## Borrow dashboard: data model and GraphQL pattern

The minimum viable borrow position row:

| Field | Source | Note |
|---|---|---|
| Market ID | GraphQL or onchain | fixed identifier |
| Collateral amount | \`position().collateral\` onchain | raw units, needs decimals |
| Borrow assets | shares → assets conversion | must accrue interest first |
| Oracle price | \`oracle.price()\` onchain | 1e36 scaled |
| LLTV | \`marketParams.lltv\` | WAD format (1e18 = 100%) |
| Health Factor | computed | see formula below |
| Liquidation price | computed | see formula below |

### GraphQL query for borrow positions by market

\`\`\`graphql
query AtRiskBorrowers($marketId: String!) {
  marketPositions(
    first: 100,
    orderBy: BorrowShares,
    orderDirection: Desc
    where: { marketUniqueKey_in: [$marketId] }
  ) {
    items {
      user { address }
      state {
        collateral
        borrowAssets
        borrowAssetsUsd
        collateralValue
        healthFactor
      }
    }
  }
}
\`\`\`

The API's \`healthFactor\` field is convenience-only. For critical operations — liquidation bots, risk alerts — always recompute from onchain data because indexed values lag by one block or more.

### Computing HF and liquidation price from onchain data

\`\`\`typescript
const WAD             = 10n ** 18n;
const ORACLE_SCALE    = 10n ** 36n;

// shares → assets (borrowers: round up; suppliers: round down)
const toAssetsUp = (shares, totalAssets, totalShares) =>
  (shares * (totalAssets + 1n) + totalShares) / (totalShares + 10n ** 6n);

// After fetching market state and position:
const borrowAssets = toAssetsUp(
  position.borrowShares,
  market.totalBorrowAssets,
  market.totalBorrowShares
);

const collateralValueInLoan =
  (position.collateral * oraclePrice) / ORACLE_SCALE;

const maxBorrow =
  (collateralValueInLoan * marketParams.lltv) / WAD;

const healthFactor =
  borrowAssets > 0n
    ? (maxBorrow * WAD) / borrowAssets
    : maxBorrow === 0n ? 0n : BigInt(Number.MAX_SAFE_INTEGER);

// Liquidation price: the oracle price at which HF hits 1.0
const liquidationPrice =
  position.collateral > 0n
    ? (borrowAssets * ORACLE_SCALE * WAD) /
      (position.collateral * marketParams.lltv)
    : 0n;
\`\`\`

**Critical BigInt rule**: keep all arithmetic in BigInt until the display layer. Intermediate \`Number\` conversions silently lose precision on amounts > 2^53.

### Risk triage display pattern

For a risk monitoring dashboard, sort positions by proximity to liquidation:

1. HF < 1.05 → **RED** — liquidatable or near-liquidatable
2. HF 1.05–1.15 → **ORANGE** — warn partner
3. HF > 1.15 → **GREEN** — healthy

## Earn dashboard: data model and GraphQL pattern

\`\`\`graphql
query EarnDashboard {
  vaults(first: 50, orderBy: TotalAssetsUsd, orderDirection: Desc) {
    items {
      address
      name
      symbol
      chain { id }
      state {
        totalAssets
        totalAssetsUsd
        apy           # base APY (decimal, e.g. 0.053 = 5.3%)
        netApy        # after vault management fee
        rewards {
          asset { symbol }
          supplyApr   # reward APR for this token (decimal)
          yearlySupplyTokens
        }
      }
    }
  }
}
\`\`\`

### Yield display hierarchy

Always decompose before combining. Never surface only the blended number.

\`\`\`
Net APY:         5.3%    ← from state.netApy (after fees)
  + MORPHO APR:  1.2%    ← from state.rewards[0].supplyApr
  + OP APR:      0.4%    ← from state.rewards[1].supplyApr
─────────────────────
  Combined:      6.9%    ← show last, not first
\`\`\`

A partner who only sees "6.9%" cannot explain to their own users what happens when the reward program ends. Always show the breakdown first.

### Vault liquidity context

\`\`\`graphql
state {
  totalAssets
  # idle = assets not yet deployed to any market
  # low idle = withdrawals may hit withdrawal queue
}
\`\`\`

Surface idle ratio when it drops below 5–10% of TVL. Warn the partner that large withdrawals may queue.

## User view: shares, PnL, and claimable rewards

For a user-level position view:

\`\`\`graphql
query UserPortfolio($address: String!) {
  userByAddress(address: $address) {
    marketPositions {
      market { uniqueKey }
      state {
        collateral borrowAssets collateralValue healthFactor
      }
    }
    vaultPositions {
      vault { address name }
      state {
        assets    # user's assets at current share price
        shares
      }
    }
  }
}
\`\`\`

Claimable rewards come from Merkl, not Morpho API:
\`\`\`
GET https://api.merkl.xyz/v4/userRewards?user={address}&chainId={chainId}
\`\`\`

Aggregate per-token amounts across all programs. Display each token separately — never sum different tokens into a single "rewards" number.

## Common mistakes to avoid

| Mistake | Fix |
|---|---|
| Using \`healthFactor\` from GraphQL for liquidation logic | Recompute from onchain position data |
| Showing combined APY without breakdown | Always show base + reward separately |
| Converting borrowShares with \`toAssetsDown\` | Use \`toAssetsUp\` for borrow — borrows round up |
| Using \`maxWithdraw\` on Vault V2 as the definitive available liquidity | It may return conservative value; supplement with idle assets query |
| Displaying oracle price = 0 as "no position" | Oracle = 0 is a data pipeline failure; show error state |

## Tag

\`Dashboard-Design\` \`POC-Readiness\``,
        mustMemorize: [
          'Borrow dashboards should lead with HF and liquidation price.',
          'Earn dashboards should separate native yield from incentives.',
          'User views need both raw position state and actionable next steps.',
          'Use GraphQL for indexed reads and onchain/state simulation for sensitive calculations.'
        ],
        whyItMatters: 'This is the bridge from protocol understanding to product design.',
        interviewDrill: 'Design a dashboard for a partner who only cares about which users are approaching liquidation.',
        estimatedMinutes: 25,
        docsRefs: docs(
          ['Morpho Vaults API', 'https://docs.morpho.org/tools/offchain/api/morpho-vaults/'],
          ['Morpho Markets API', 'https://docs.morpho.org/tools/offchain/api/morpho/']
        )
      }),
      lesson({
        title: 'Public Allocator and Liquidity Monitoring',
        body: `## What Public Allocator solves

Morpho's isolated markets create a fragmentation problem: liquidity is locked in specific market supply positions within vaults. If a borrower wants to borrow more than what is currently available in one market, they are stuck — even if the same vault has idle liquidity in another market.

Public Allocator solves this by enabling **anyone** to call \`reallocateTo\` to move liquidity between markets within a vault, subject to curator-defined flow caps, and paying a curator-set fee.

## Contract address

| Chain | Address |
|---|---|
| Ethereum | \`0xfd32fA2ca22c76dD6E550706Ad913FC6CE91c75D\` |
| Base | \`0xA090dD1a701408Df1d4d0B85b716c87565f90467\` |

## The core function

\`\`\`solidity
function reallocateTo(
    address vault,
    Withdrawal[] calldata withdrawals,
    MarketParams calldata supplyMarketParams
) external payable;
\`\`\`

- **vault**: The vault whose liquidity is being reallocated
- **withdrawals**: Array of (marketParams, amount) pairs — source markets to pull from
- **supplyMarketParams**: The destination market where all withdrawn funds are deposited
- **value**: Must send the curator-set fee in ETH alongside the call

The withdrawals array **must be sorted in ascending order by market ID**.

## Flow caps: maxIn and maxOut

Curators define flow caps per market to limit how much liquidity can flow in or out via Public Allocator:

- **maxOut**: Maximum assets that can be withdrawn from this market via PA
- **maxIn**: Maximum assets that can be supplied to this market via PA

These are not cumulative limits — they reset each time the curator updates them. A market with maxOut=0 cannot have liquidity moved out via PA.

**Prerequisite**: The vault must have granted PA the allocator role.

## How to discover reallocatable liquidity

\`\`\`graphql
query {
  marketByUniqueKey(uniqueKey: "0x...") {
    state { liquidityAssets }
    publicAllocatorSharedLiquidity {
      assets
      vault { address symbol }
      allocationMarket { uniqueKey }
    }
  }
}
\`\`\`

**Total borrowable** = \`liquidityAssets + sum(publicAllocatorSharedLiquidity[].assets)\`

This is the correct way to answer "how much can actually be borrowed right now?" on a borrow dashboard.

## Integration pattern: bundle reallocation + borrow

The most common production use is to bundle a Public Allocator call with the borrow transaction so users see seamless availability:

\`\`\`typescript
// 1. Check if direct borrow has enough liquidity
const market = await getMarketState(marketId);
if (market.liquidityAssets >= desiredBorrow) {
  // Simple borrow path
} else {
  // 2. Query PA shared liquidity for the gap
  const sharedLiquidity = await queryPublicAllocatorLiquidity(marketId);
  // 3. Build reallocateTo call, then borrow call
  // 4. Bundle both via Bundler3 for atomicity
}
\`\`\`

The Morpho SDK's bundler-sdk-viem package handles this automatically by simulating and including PA reallocation inside the bundle when needed.

## Why this is useful in partner demos

If a partner asks "What happens when the market is short on liquidity?", this is your answer:

> "Morpho has a Public Allocator mechanism. Anyone can call reallocateTo to move liquidity from idle markets in a vault toward the demand market. The curator sets flow caps and fees, so this is always within their approved parameters. The result is that effective borrowable capacity often exceeds the in-market idle balance."

Show the GraphQL query that reveals total borrowable vs current liquidity — that is a concrete, trust-building demo moment.

## Tag

\`Public-Allocator\` \`Liquidity-Ops\` \`GraphQL\``,
        mustMemorize: [
          'Public Allocator is a publicly callable allocator for vault liquidity reallocation.',
          'Fees are curator-set and paid in the gas token.',
          'Use API data to discover reallocatable liquidity.',
          'This is a strong answer to liquidity fragmentation concerns.'
        ],
        whyItMatters: 'It shows you understand not just static markets but liquidity operations across isolated venues.',
        interviewDrill: 'Explain the Public Allocator to a partner that worries about fragmented liquidity across markets.',
        estimatedMinutes: 25,
        docsRefs: docs(
          ['Public Allocator Concept', 'https://docs.morpho.org/learn/concepts/public-allocator/'],
          ['Public Allocator Contract', 'https://docs.morpho.org/tools/onchain/public-allocator/']
        )
      }),
      lesson({
        title: 'Production Hardening: Error States, Degraded Modes, and Monitoring',
        body: `## The gap between a POC and a production integration

A POC answers "does this work in a demo?" Production code answers "does this work when things break?"

The Partner Engineer role rewards people who build toward production quality, not just demo quality. That means knowing the failure modes before your partner asks.

## Error category 1: Oracle failures

**Symptom**: Health Factor shows 0 or infinity for all positions.

**Root cause**: Oracle price returned zero or is stale. The collateral value computation collapses.

**Mitigation**: Before displaying any HF value, validate that the oracle price is non-zero and was updated recently. If the oracle is stale, show a "Data Unavailable" state rather than a misleading zero or last-known value.

**Interview answer**: "My first check is always oracle price. A zero oracle price looks like a protocol bug but is almost always a data-pipeline issue."

## Error category 2: API stale data

**Symptom**: APY values do not update. Vault balances show stale totals. Position state is hours old.

**Root cause**: The Morpho GraphQL API has no SLA. Network timeouts, deployment incidents, or rate limit exhaustion can stall data freshness.

**Mitigation**:
- Cache the last known good response
- Show a freshness timestamp so users know how old the data is
- For critical operations like borrow risk, fall back to onchain reads instead of relying solely on the API

**Interview answer**: "I build dashboards to degrade gracefully, not crash. Show stale data with a clear timestamp rather than blank screens."

## Error category 3: Decimal and BigInt mistakes

**Symptom**: APY shows as 0.0001% instead of 10%. Token balances display as fractional when they should be whole.

**Root cause**: Token amounts from onchain or GraphQL are in the smallest unit (wei, base units). Converting to float too early loses precision. Dividing by the wrong decimals creates order-of-magnitude errors.

**Mitigation**:
- Keep all token amounts as BigInt until the final formatting step
- Confirm token decimals from the contract (do not assume 18)
- Oracle price uses 1e36 scaling, not 1e18

**Interview answer**: "Decimal bugs are the #1 cause of silent dashboard errors. I never convert to float until the display layer."

## Error category 4: ERC4626 maxWithdraw misuse on Vault V2

**Symptom**: Withdraw button shows 0 when the user clearly has a balance.

**Root cause**: Vault V2 takes a conservative stance on ERC4626 max helpers. If the liquidity adapter has no available liquidity, maxWithdraw correctly returns 0 or a low value.

**Mitigation**: Show the vault share balance and current redemption estimate separately from a "max" withdraw button. If liquidity is constrained, explain why rather than showing 0.

**Interview answer**: "Vault V2 and ERC4626 max helpers do not always agree. I compute expected redemption value from shares and current share price instead."

## Monitoring checklist for a production Morpho integration

| Signal | How to monitor |
|---|---|
| Oracle freshness | Check oracle.updatedAt timestamp against block time |
| API latency | Track last successful GraphQL response time |
| HF distribution | Alert when any user position drops below 1.10 |
| Vault NAV vs expected | Compare share price to rolling 24h average |
| Merkl reward data | Verify reward token list has not changed unexpectedly |
| Error rate | Track failed transactions by error type (revert, timeout, user rejection) |

## Tag

\`POC-Readiness\` \`Partner-Scenario\` \`Integration\``,
        mustMemorize: [
          'Oracle = 0 always means data pipeline failure, not protocol failure. Check this first.',
          'Build dashboards to degrade gracefully: stale data with a timestamp beats blank screens.',
          'Keep all BigInt math in BigInt until the display layer.',
          'ERC4626 maxWithdraw on Vault V2 may return conservative values; do not use it alone.'
        ],
        whyItMatters: 'This separates engineers who ship demos from engineers who build production integrations. Every bullet here has a real support ticket behind it.',
        interviewDrill: 'Walk through how you would triage a report that your vault dashboard is showing a Health Factor of 0 for all positions.',
        estimatedMinutes: 25,
        docsRefs: docs(
          ['Oracle Concept', 'https://docs.morpho.org/learn/concepts/oracles/'],
          ['Morpho API', 'https://docs.morpho.org/tools/offchain/api/'],
          ['Vault V2 Withdraw', 'https://docs.morpho.org/learn/concepts/vault-v2/']
        )
      })
    ]
  },
  {
    slug: 'mock-interviews-and-drills',
    title: 'Module 8: Mock Interviews & Drills',
    category: 'practice',
    durationHours: 2,
    summary: 'Practice concise explanations, mock partner calls, and high-pressure answer structure.',
    objective: 'Convert raw knowledge into interview performance.',
    format: 'drill-repeat-review',
    lessons: [
      lesson({
        title: '60-Second Pitch Library',
        body: `## Why this matters more than any other lesson

The Partner Engineer interview includes a live call simulation. You will be asked to explain something to a "partner" in plain terms. These pitches need to be in muscle memory — not recalled, just spoken.

---

## Pitch 1 — What is Morpho?

> "Morpho is a decentralized lending primitive on Ethereum and Base. Instead of pooling assets together like Aave or Compound, every market in Morpho is isolated: one collateral token, one loan token, its own oracle, its own interest rate model, its own liquidation threshold. That isolation means a new asset doesn't inherit the risk of everything else in the system. On top of those isolated markets, Morpho Vaults let curators manage capital allocation strategies — picking which markets to deploy into, under what caps, with what risk controls. Partners use Morpho to launch dedicated lending products faster and with more control than any governance-gated pooled protocol."

**Length**: ~55 seconds. Practice until you can say it without rushing.

---

## Pitch 2 — Why isolated markets over Aave-style pools?

> "In a pooled system, every new asset or oracle decision affects the entire protocol's risk surface. That means listing a new collateral requires governance approval because the failure of that asset could drain the shared pool. In Morpho, each market is its own failure domain. If an oracle fails in the wstETH/USDC market, only borrowers in that market are exposed. Other markets are untouched. For a partner launching a new collateral type — say a newly minted liquid restaking token — that isolation means faster listing, a custom LLTV tuned to the asset's volatility, and a custom oracle without waiting for a governance vote."

---

## Pitch 3 — What does Vault V2 add on top of Blue?

> "Morpho Blue is the base layer: permissionless, immutable, minimal. Vault V2 is a managed allocation layer built on top. A curator deploys a Vault V2 and decides which markets to route deposits into, under what supply caps. They can add or remove adapters — which point to markets or other vaults — with mandatory timelocks for any risk-increasing action. So if a curator wants to add a new riskier market, depositors have at least three days' notice before that market goes live and can exit if they disagree. It's designed so the person managing strategy and the person executing allocations don't have to be the same entity."

---

## Pitch 4 — What problem does Bundler3 solve?

> "A typical leveraged borrow position on Morpho requires four separate transactions: approve collateral, supply collateral, borrow loan token, and optionally loop back. If step three succeeds and step four fails, the user is left in a dangerous partial state — holding an open borrow they didn't want. Bundler3 solves this by batching all four steps into one atomic transaction. Everything succeeds or everything reverts. The user signs once. For a partner building a leverage product, that's the difference between a clunky multi-step flow and a one-click experience."

---

## Pitch 5 — How does Merkl fit into a partner demo?

> "Merkl is the incentive distribution layer that many curators and protocols use to run rewards programs on top of Morpho vaults and markets. When a partner asks 'what yield can my users earn?', the answer often has two parts: the native APY from the vault strategy, and the additional reward APR from any active Merkl campaigns. The Morpho GraphQL API gives you the native yield and even surfaces some reward fields. The Merkl REST API gives you the campaign details and user-level claim context. In a partner demo, you always separate these two numbers — native yield and reward yield — before showing a combined figure, because the two have different sources, different durability, and different claim mechanics."

---

## The four-sentence structure that always works

1. **State the problem** — what is broken or missing without this
2. **Name the mechanism** — the specific Morpho feature and how it works
3. **Quantify or localize** — a real number, address, or concrete scenario
4. **Partner outcome** — what this enables the partner to ship or say to their users

## Tag

\`Interview-Drill\` \`Communication-Core\``,
        mustMemorize: [
          'Lead with the point, not the background.',
          'Keep one major claim per sentence.',
          'Always connect protocol mechanics to partner outcomes.',
          'Acknowledge trade-offs when they are relevant.'
        ],
        whyItMatters: 'The interview role depends on crisp spoken communication, not just correctness.',
        interviewDrill: 'Deliver a 60-second pitch: "What is Morpho and why should a partner care?"',
        estimatedMinutes: 20,
        docsRefs: docs(
          ['Morpho Market V1', 'https://docs.morpho.org/learn/concepts/market/'],
          ['Morpho Vault V2', 'https://docs.morpho.org/learn/concepts/vault-v2/']
        )
      }),
      lesson({
        title: 'Mock Partner Call Framework',
        body: `## The five-stage call flow

Every technical partner call follows the same pattern. Internalize it so you navigate real conversations without a script.

1. **Use-case clarification** — what does the partner's user actually do?
2. **Workflow summary** — restate it back in Morpho terms to confirm alignment
3. **Building block mapping** — which Morpho primitives cover each step
4. **Risk and ops flag** — what assumptions need validating before building
5. **Concrete next step** — POC offer, docs link, or follow-up call

---

## Scenario A — Wallet app wants earn integration

**Partner opening**: "We want to let users deposit USDC and earn yield. How does Morpho work?"

**Your response**:

> "The natural fit is Morpho Vaults. Your users deposit USDC into a vault, and the curator routes that capital across isolated Morpho markets to earn supply interest. From your frontend it is standard ERC-4626: \`deposit(assets, receiver)\`, \`redeem(shares, receiver, owner)\`, and \`convertToAssets(shares)\` to show a preview. Yield comes from borrowers paying interest in those markets. You show two numbers: native vault APY from the Morpho GraphQL API (\`state.netApy\`) and any reward APR from active Merkl campaigns. One flag: Vault V2 \`maxWithdraw\` is intentionally conservative — do not build your 'max' button directly from ERC-4626 assumptions or it will underestimate available liquidity."

**Follow-up**: Three-day POC — vault list, APY, user balance, deposit/withdraw flow.

---

## Scenario B — LRT issuer wants a dedicated borrow market

**Partner opening**: "We issued a liquid restaking token and want users to borrow USDC against it."

**Your response**:

> "Morpho markets are permissionless — no governance vote required. You deploy a market right now: your LRT as \`collateralToken\`, USDC as \`loanToken\`, a Chainlink oracle, the AdaptiveCurveIRM (\`0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC\` on Ethereum), and an LLTV. For a new LRT most curators start at 77–86% LLTV depending on liquidity depth. For a rebasing token, MorphoChainlinkOracleV2 supports a vault conversion layer. One flag: creating the market is permissionless, but getting curator supply requires a separate conversation with vault curators — otherwise nobody supplies to borrow from."

**Follow-up**: Walk through \`createMarket(MarketParams)\`, confirm oracle path, connect to curator community.

---

## Scenario C — Curator wants a rewards dashboard

**Partner opening**: "We run a vault and want to show depositors what they earn including our Merkl campaign."

**Your response**:

> "Two data sources. From Morpho GraphQL: \`state.apy\`, \`state.netApy\` (accounts for performance fees), and \`state.rewards[].supplyApr\`. For full Merkl campaign context and user-level claimable amounts, query the Merkl REST API at \`https://api.merkl.xyz/v4/\`. Display rule: show native yield and reward yield as separate line items, then combined APY as the headline. Never add them without labeling — native yield is durable, reward yield depends on the campaign staying active."

---

## Scenario D — Aggregator wants one-click leverage

**Partner opening**: "We want to loop: supply ETH, borrow USDC, swap for more ETH, re-supply — all in one click."

**Your response**:

> "That is exactly Bundler3. The bundle is: \`supplyCollateral\` → \`borrow\` → DEX swap via Paraswap or Uniswap adapter → \`supplyCollateral\` again. Each step is a \`Call\` struct passed to \`Bundler3.multicall()\` — atomic, so a slippage failure on the swap reverts everything. Key engineering decisions: compute a simulated post-loop health factor before presenting the confirmation UI, set \`skipRevert: false\` on every critical step, and cap the UI leverage below the theoretical LLTV-derived maximum. For a 90% LLTV market, theoretical max is 10x but you should display 5–6x as the safe ceiling."

---

## What separates good from great

| Weak | Strong |
|---|---|
| Lists features generically | Maps exact building blocks to the stated use case |
| Skips assumptions | Flags oracle, curator supply, rate limits explicitly |
| Ends with "let me know" | Proposes a specific POC with a timeframe |
| Recites knowledge | Shows judgment: "I would start with X not Y because..." |

## Tag

\`Interview-Drill\` \`Partner-Scenario\``,
        mustMemorize: [
          'Use case first, architecture second.',
          'Always recommend a concrete next step.',
          'State assumptions out loud.',
          'Show judgment by choosing one path and defending it.'
        ],
        whyItMatters: 'The interview is for a partner-facing role. They want to hear how you think in a live conversation.',
        interviewDrill: 'Run a mock discovery call for a partner that wants both borrow and earn integrations on Base.',
        estimatedMinutes: 25,
        docsRefs: docs(
          ['Addresses', 'https://docs.morpho.org/get-started/resources/addresses/'],
          ['Morpho API Get Started', 'https://docs.morpho.org/tools/offchain/api/get-started/']
        )
      }),
      lesson({
        title: 'Technical Whiteboard Drills',
        body: `## The rule before you draw anything

Do not open with boxes and arrows. Open with:

1. **What problem you are solving** — user story, not protocol feature
2. **What surfaces exist** — data reads vs execution calls, on-chain vs indexed
3. **What can go wrong** — decimals, rounding, stale data, failed calls

Then draw. This sequence sounds senior. Starting with diagrams sounds junior.

---

## Drill 1 — Health factor and liquidation price

**Setup**: A partner asks you to whiteboard how a user's health factor is calculated and at what price they get liquidated.

**Narrate it like this**:

> "Start with the user's position: they have \`collateralAssets\` units of collateral and \`borrowAssets\` units of debt. To get collateral value in loan-token terms, we read the oracle: it returns a price scaled to 1e36, so collateral value = \`(collateralAssets * oraclePrice) / 1e36\`. Then apply the market's LLTV to get the maximum debt allowed: \`maxDebt = collateralValue * LLTV / WAD\`. Health factor is \`maxDebt / borrowAssets\` — if HF drops to or below 1, the position is liquidatable. For liquidation price: rearrange the formula. The collateral price at which HF = 1 is \`borrowAssets * 1e36 / (collateralAssets * LLTV / WAD)\`. That is the number you display as the liquidation price in the UI. Edge cases: oracle returns 0 (treat as insolvent), collateral is 0 (no borrow allowed), LLTV is 0 (market not configured for borrowing)."

**Numbers to have ready**: wstETH/USDC market uses LLTV of 86% (0.86e18). HF = 1.0 means exactly at the liquidation boundary.

---

## Drill 2 — Vault V2 cap hierarchy

**Setup**: An interviewer asks you to diagram how allocation limits work in Vault V2.

**Narrate it like this**:

> "Vault V2 has three cap layers that all must pass for an allocation to proceed. First, the market cap: an absolute limit on how much can be deployed into one specific market. Second, the collateral cap: limits aggregate exposure to a given collateral asset across all markets using that collateral — this prevents concentrating risk in one collateral through multiple different loan-token markets. Third, the adapter cap: limits total assets routed through a specific adapter, regardless of which markets that adapter touches. When a curator calls \`reallocate\`, the vault checks all three. If any one cap is breached, the allocation fails. The curator sets these caps via role-controlled functions with timelocks for increases. Immediate for decreases — that's the safety design."

**Edge case to mention**: abstract IDs allow the collateral cap to span multiple markets with the same collateral token, even if the loan token differs.

---

## Drill 3 — Bundler3 atomic leverage loop

**Setup**: Design a one-click 3x leverage flow for a wstETH/USDC market.

**Narrate it like this**:

> "The user wants to start with 1 ETH worth of wstETH and end up with 3x leveraged exposure. Step one: \`supplyCollateral(marketParams, 1 wstETH, user, '')\`. Step two: \`borrow(marketParams, targetBorrowAmount, user, bundler)\` — note we route borrowed USDC to the bundler, not the user, so it can be used in the next step. Step three: swap USDC back to wstETH via Paraswap adapter. Step four: \`supplyCollateral\` again with the newly acquired wstETH. All four steps are wrapped in \`Bundler3.multicall(Call[])\`. If the swap slips past tolerance, the whole bundle reverts. Before presenting the UI, compute the simulated final HF: with LLTV 86% and 3x leverage, HF ≈ 1.43 — show that number and a warning if it drops below 1.15."

**Risk flags to mention**: flash loan or callback patterns in the bundle require setting the correct \`callbackHash\`. Never use \`skipRevert: true\` on the borrow or supply steps.

---

## Drill 4 — Vault + Merkl rewards dashboard data flow

**Setup**: Design the data layer for a dashboard showing current vault APY plus Merkl rewards.

**Narrate it like this**:

> "Two data sources. Morpho GraphQL at \`api.morpho.org/graphql\` gives you: \`state.apy\` (gross), \`state.netApy\` (after fee), \`state.rewards[{asset, supplyApr}]\`, \`totalAssets\`, and \`allocations\` per market. Merkl REST at \`api.merkl.xyz/v4/\` gives you: active campaigns for the vault address, reward token and APR, and user-level claimable amounts. Caching: poll the Morpho API every 60 seconds, Merkl every 5 minutes. Degraded mode: if GraphQL fails, show last-known values with a staleness warning. Never show a combined APY without labeling both components. The UI should have: native APY (from Morpho), reward APR (from Merkl), net combined APY, and a 'Claim' button that links to the Merkl claim flow."

**Edge case to mention**: \`state.netApy\` can be negative if the fee structure hasn't been updated after a reward campaign ends. Always display both gross and net.

---

## Whiteboard hygiene checklist

Before wrapping up any whiteboard drill, always cover:

- [ ] Happy path data flow described
- [ ] At least two failure or edge cases mentioned
- [ ] Decimal / rounding behavior noted
- [ ] Monitoring or alerting mentioned (HF threshold, staleness)
- [ ] Concrete next step offered (POC, contract call, query pattern)

## Tag

\`Interview-Drill\` \`System-Design\``,
        mustMemorize: [
          'Whiteboards should start from problem framing, not diagram spam.',
          'Mention edge cases early: decimals, rounding, stale API data, role assumptions.',
          'Use exact protocol terms where they matter.',
          'Show fallback and monitoring, not just happy-path flow.'
        ],
        whyItMatters: 'The best interview answers look like someone already operating in the role.',
        interviewDrill: 'Whiteboard a partner dashboard that shows user positions, HF, and rewards across Morpho vaults.',
        estimatedMinutes: 20,
        docsRefs: docs(
          ['Borrow Data Tutorial', 'https://docs.morpho.org/build/borrow/tutorials/get-data/'],
          ['Fetch Rewards Data', 'https://docs.morpho.org/build/rewards/tutorials/fetch-rewards-data/']
        )
      })
    ]
  },
  {
    slug: 'final-review-and-feedback-loop',
    title: 'Module 9: Final Review & Feedback Loop',
    category: 'review',
    durationHours: 2,
    summary: 'Condense the bootcamp into final formulas, weak-area review, and a feedback/escalation mindset.',
    objective: 'Leave the last day with fast recall and a clear operational posture.',
    format: 'review-drill-repeat',
    lessons: [
      lesson({
        title: 'Final Formula and Address Sprint',
        body: `## Final sprint items

### Core formulas

\`\`\`
Collateral Value = collateralAssets * oraclePrice / 1e36
Health Factor = (Collateral Value * LLTV) / borrowAssets
Liquidation Price = borrowAssets * 1e36 * 1e18 / (collateralAssets * LLTV)
LIF = min(1.15, 1 / (0.3 * LLTV + 0.7))
Supply APY = borrowApy * (1 - fee) * utilization
\`\`\`

### Core addresses to recall

- Blue / Morpho: \`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb\`
- Ethereum Bundler3: \`0x6566194141eefa99Af43Bb5Aa71460Ca2Dc90245\`
- Base Bundler3: \`0x6BFd8137e702540E7A42B74178A4a49Ba43920C4\`
- Ethereum VaultV2Factory: \`0xA1D94F746dEfa1928926b84fB2596c06926C0405\`
- Base VaultV2Factory: \`0x4501125508079A99ebBebCE205DeC9593C2b5857\`

## Tag

\`Final-Review\` \`Memorize\``,
        mustMemorize: [
          'Blue address: 0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb.',
          'Vault V2 factories and Bundler3 are chain-specific.',
          'Oracle scaling is 1e36 and LLTV uses WAD.',
          'LIF for 86% LLTV is about 1.05.'
        ],
        formulas: `Collateral Value = collateralAssets * oraclePrice / 1e36
Health Factor = (Collateral Value * LLTV) / borrowAssets
Liquidation Price = borrowAssets * 1e36 * 1e18 / (collateralAssets * LLTV)
LIF = min(1.15, 1 / (0.3 * LLTV + 0.7))
Supply APY = borrowApy * (1 - fee) * utilization`,
        whyItMatters: 'This is the sheet you should revisit right before the interview.',
        interviewDrill: 'Recite the five highest-value formulas and explain when each one matters.',
        estimatedMinutes: 20,
        docsRefs: docs(
          ['Addresses', 'https://docs.morpho.org/get-started/resources/addresses/'],
          ['IRM Concept', 'https://docs.morpho.org/learn/concepts/irm/']
        )
      }),
      lesson({
        title: 'Partner Engineer Role Playbook: Top 8 Scenarios',
        body: `## How to use this lesson

These are the eight most likely scenario types you will face in a Morpho partner engineering interview. For each one, know the structure of a strong answer before you walk in. Practice saying each out loud, not just reading it.

---

## Scenario 1: "Explain Morpho to us."

**What they are really testing**: Can you communicate infrastructure in plain language, and do you default to the builder angle or the user angle?

**Strong answer structure**:
1. One sentence on what Morpho is (infrastructure layer, not just an app)
2. One sentence on the core primitive (Blue, isolated markets)
3. One sentence on the builder value (anyone can build lending or earn products on top)
4. Optional: one concrete partner type as an example

**Strong answer**: "Morpho is permissionless, non-custodial lending infrastructure. The core primitive is Morpho Blue, which uses isolated, immutable markets. Each market has its own parameters, so builders can launch custom lending or managed yield products without accepting someone else's risk design. A wallet, exchange, or protocol can wrap all of that in their own product while Morpho handles the lending mechanics underneath."

**Avoid**: Starting with "Morpho is a DeFi protocol..." or using yield as the hook.

---

## Scenario 2: "Why Morpho over Aave?"

**What they are really testing**: Can you make a balanced, use-case-driven comparison without sounding tribal?

**Strong answer structure**:
1. Acknowledge Aave's strengths honestly
2. Name the design difference (isolated vs pooled, custom parameters)
3. Explain when each is the better fit
4. Give one concrete example

**Strong answer**: "Aave is great for standardized markets with deep liquidity concentration. If the partner needs a new asset listing with custom LLTV, oracle choice, and rate model, and they want isolated failure domains, Morpho is stronger. The clearest example: launching an LRT as collateral. On Aave you are lobbying into a shared pool. On Morpho you create a dedicated market with the parameters that fit your asset."

---

## Scenario 3: "Walk me through a partner integration from zero."

**What they are really testing**: Do you think in product flows or just APIs? Can you scope from use case to architecture?

**Strong answer structure**:
1. Start with use case discovery: what are they building? Borrow? Earn? Both?
2. Match to integration surface: Blue markets for borrow, Vault V2 for earn, Bundler3 for complex flows
3. Data layer: GraphQL for discovery + display, onchain for health and execution
4. Fallback and monitoring plan

**Strong answer**: "First I ask: what is the user doing? If it is earn, I recommend starting with a curated Vault V2 — simple deposit flow, one asset, managed by a curator. The data layer is GraphQL for vault discovery and APY, Merkl REST for reward context, and vault share contract for user position. If it is borrow, I start with direct Blue market access, GraphQL for market data, onchain HF computation, and Bundler3 for permit-based one-click flows. In both cases, I build a degraded mode for when the API is stale."

---

## Scenario 4: "What POC would you build first?"

**What they are really testing**: Do you think in partner outcomes, or do you just want to write code?

**Strong answer structure**:
1. Ask what the partner wants to demonstrate or evaluate
2. Propose a specific POC tied to that goal
3. Name the data sources and rough timeline
4. Explain what decision it helps the partner make

**Strong answer**: "For an earn partner, my first POC would be a vault comparison dashboard: TVL, native APY, reward APR, and combined net APY across the major vaults on one or two chains. GraphQL gives me the vault list and APY data; Merkl REST gives me the reward context. That answers the partner's actual question: 'which vault should my users be in?' It takes 2–3 days and it ships something they can show their own stakeholders."

---

## Scenario 5: "A partner says their user was liquidated unexpectedly. How do you handle it?"

**What they are really testing**: Can you triage a support incident like a senior engineer while keeping the partner relationship intact?

**Strong answer structure**:
1. Empathy first: acknowledge the impact
2. Clarify without speculation: gather the facts (chain, address, block number, market)
3. Explain the four likely causes without blaming the user or the protocol
4. Provide next steps

**Strong answer**: "First I acknowledge this was a bad user experience and I want to understand what happened. Then I ask for the basics: wallet address, market, approximate timestamp. From there I check four things: what was the oracle price at the block the liquidation occurred, what was the accrued debt at that point (not the UI snapshot), whether there was any price gap between the oracle update and real market prices, and whether any rounding in the shares-to-assets conversion affected the threshold. Usually it is one of these, and I can explain it specifically. I would never say 'the protocol just works this way' without showing the data."

---

## Scenario 6: "What risks does Morpho have?"

**What they are really testing**: Can you discuss risk honestly or do you give a PR answer?

**Strong answer structure**:
1. Name the five risk categories specifically
2. Explain how Morpho's design makes some risks more explicit and bounded
3. Acknowledge the risks that remain

**Strong answer**: "Five categories: oracle risk — if the feed is wrong or stale, collateral values are wrong. Market configuration risk — a bad LLTV or IRM increases bad debt probability. Liquidation execution risk — permissionless liquidators must be incentivized enough to act, and very small or illiquid positions may not be liquidated quickly. Vault curation risk — a poorly managed allocation strategy can cause losses. Liquidity risk — vault withdrawals depend on underlying market liquidity. Morpho's isolation makes failure domains more explicit and bounded, but it does not eliminate these risks. A good partner product communicates them honestly."

---

## Scenario 7: "Design a health monitoring dashboard."

**What they are really testing**: Can you architect a real product solution, not just list APIs?

**Strong answer structure**:
1. State the primary user need (real-time risk visibility)
2. List data sources and why each is appropriate
3. Describe the alert tiers
4. Mention degraded mode and fallback

**Strong answer**: "The dashboard needs three data sources: GraphQL for user vault positions and market discovery, the Morpho Blue contract for live borrow shares and collateral state (critical for accurate HF), and the oracle contract for current price. I compute HF locally from onchain data, not from a cached API value, because a stale HF for a borrower at risk is dangerous. Alert tiers: HF < 1.1 shows a yellow warning, HF < 1.05 shows a red alert with recommended actions. If the oracle is stale, I show a 'data unavailable' state rather than a misleading HF. I cache the last valid state with a freshness timestamp."

---

## Scenario 8: "Why do you want to work at Morpho?"

**What they are really testing**: Are you genuinely interested in the infrastructure layer, or is this just another job application?

**Strong answer structure**:
1. Specific aspect of the role that genuinely appeals (not generic "crypto is cool")
2. Why Morpho specifically (not just any DeFi company)
3. What you bring to the specific partner-engineering function

**Strong answer**: "What I find compelling about this role is that Partner Engineers at Morpho sit at the junction between protocol depth and real adoption. The integrations that other teams build on Morpho become real product infrastructure for real users — that is a rare kind of leverage. What pulls me to Morpho specifically is that the protocol is serious. The market design, the vault architecture, and the documentation are all built for builders who need more than a nice landing page. And the partner-facing role here is not just support — it is scoping integrations, shipping POCs, and turning protocol friction into better docs and better tools. That is exactly the role I want to be in."

## Tag

\`Interview-Drill\` \`Role-Readiness\` \`Partner-Scenario\``,
        mustMemorize: [
          'Always lead with use case and builder value, not just protocol definitions.',
          'When asked about risk, give the five categories: oracle, market config, liquidation execution, curation, liquidity.',
          'For support scenarios: empathy first, gather facts, then explain with data.',
          'The POC answer should name the data source and the decision it helps the partner make.'
        ],
        whyItMatters: 'These eight scenarios cover most of what a senior Morpho interviewer will test. Practicing them out loud before the interview is more valuable than rereading docs.',
        interviewDrill: 'Pick any two scenarios from this list and deliver them back-to-back out loud, targeting under 90 seconds each.',
        estimatedMinutes: 30,
        docsRefs: docs(
          ['Morpho Blue Concept', 'https://docs.morpho.org/learn/concepts/market/'],
          ['Vault V2 Concept', 'https://docs.morpho.org/learn/concepts/vault-v2/'],
          ['Morpho API', 'https://docs.morpho.org/tools/offchain/api/']
        )
      }),
      lesson({
        title: 'Documentation and Bug-Forwarding Mindset',
        body: `## Final mindset

If you get the job, your value is not only knowing Morpho. It is closing loops:

- partner confusion -> better docs
- partner bug -> better internal report
- partner request -> better POC
- partner objection -> better explanation

## Personal checklist before the interview

- can I explain Morpho in one minute?
- can I explain Vault V2 roles without mixing permissions?
- can I calculate HF and liquidation price correctly?
- can I describe a real POC using GraphQL + Merkl?
- can I answer objections without getting defensive?

## Weak-area loop

Use the lesson tags and your quiz misses as the review queue:

- repeat \`Math-Core\` if you miss formulas
- repeat \`Partner-Scenario\` if your answers sound correct but not persuasive
- repeat \`Vault-V2\` if you mix up roles or timelocks
- repeat \`Merkl\` if combined-yield or claim flows still feel fuzzy

## Tag

\`Final-Review\` \`Role-Readiness\``,
        mustMemorize: [
          'The role rewards loop-closing behavior, not just protocol recall.',
          'Great partner support creates better product feedback and better docs.',
          'You should have one credible POC story ready.',
          'Technical clarity plus empathy is the target persona.'
        ],
        whyItMatters: 'This lesson aligns your study with how Morpho will actually evaluate you in a partner-facing interview.',
        interviewDrill: 'Give a final 90-second "why I fit this role" answer anchored in protocol knowledge plus partner communication.',
        estimatedMinutes: 15,
        docsRefs: docs(
          ['Morpho Docs Home', 'https://docs.morpho.org/'],
          ['Curator Concept', 'https://docs.morpho.org/learn/concepts/curator/']
        )
      })
    ]
  },
  {
    slug: 'interview-questions-and-behavior',
    title: 'Module 10: Behaviour',
    category: 'interview',
    durationHours: 2,
    summary: 'Prepare for the non-trivia part of the process: judgment, ownership, ambiguity handling, and role-fit answers.',
    objective: 'Make your interview answers sound like a partner engineer Morpho would trust with real partners.',
    format: 'read-rehearse-repeat',
    lessons: [
      lesson({
        title: 'What Morpho Is Testing Beyond Protocol Recall',
        body: `## The hidden scorecard

Most candidates overfocus on definitions, addresses, and formulas. Those matter, but the interview is also scoring for behavior:

1. do you clarify before you prescribe?
2. do you separate execution truth from indexed reads?
3. do you admit uncertainty without sounding lost?
4. do you move toward the next useful step?
5. do you sound partner-safe under pressure?

## What strong behavior sounds like

- "Before I recommend a surface, I want to clarify whether the partner is building earn, borrow, or both."
- "For discovery I would use GraphQL, but I would not trust it as the sole source of truth for risk-critical state."
- "I am confident in the architecture direction. For the exact Base address, I would verify the official Addresses page before giving a final answer."
- "My first pass would be a small POC that answers the partner's actual decision, not a giant integration."

## What weak behavior sounds like

- answering immediately without clarifying use case
- pretending stale API data is "close enough" for liquidation math
- guessing exact addresses or chain-specific details
- speaking in generic DeFi buzzwords instead of concrete partner workflows

## Tag

\`Interview-Behavior\` \`Role-Signal\``,
        mustMemorize: [
          'Clarify use case before recommending architecture.',
          'Separate indexed data from execution truth.',
          'Verify exact chain-specific details instead of bluffing.',
          'Always end with a concrete next step.'
        ],
        whyItMatters: 'This role is judged on judgment and communication quality as much as technical recall.',
        interviewDrill: 'Answer: "How would you approach a new partner integration?" in under 75 seconds, emphasizing your decision process.',
        estimatedMinutes: 18,
        docsRefs: docs(
          ['Morpho API Get Started', 'https://docs.morpho.org/tools/offchain/api/get-started/'],
          ['Addresses', 'https://docs.morpho.org/get-started/resources/addresses/']
        )
      }),
      lesson({
        title: 'Behavioral Questions: Ownership, Ambiguity, and Follow-Through',
        body: `## The likely behavioral themes

Behavioral questions in this role usually orbit four themes:

### Ownership

"Tell me about a time you owned a technical problem with multiple stakeholders."

What they want:
- did you create clarity?
- did you define next actions?
- did you close the loop?

### Ambiguity

"Tell me about a time requirements were incomplete."

What they want:
- did you turn vague asks into a concrete scope?
- did you identify the risky assumptions early?

### Partner pressure

"Tell me about a time an external team was blocked or frustrated."

What they want:
- were you calm?
- did you avoid speculative blame?
- did you translate technical issues into a safe partner update?

### Feedback loop

"Tell me about a time you improved docs, tooling, or process after a repeated issue."

What they want:
- do you think beyond one-off heroics?
- do you convert pain into system improvement?

## The answer shape that works

1. set the context in one sentence
2. define the actual risk or ambiguity
3. explain the action you took
4. explain the result
5. explain what changed in the system afterward

## Tag

\`Behavioral\` \`Ownership\` \`Follow-Through\``,
        mustMemorize: [
          'Behavioral answers should emphasize clarity, prioritization, and loop-closing.',
          'Do not tell a hero story without a systems improvement at the end.',
          'External-pressure stories should include calm communication and technical structure.',
          'Ambiguity stories should show how you turned vague asks into scoped execution.'
        ],
        whyItMatters: 'Morpho is not hiring a memorizer. They are hiring someone who can absorb pressure, create clarity, and keep momentum with partners.',
        interviewDrill: 'Give a STAR-style answer for a time you handled an ambiguous technical request from another team.',
        estimatedMinutes: 20,
        docsRefs: docs(
          ['Morpho Docs Home', 'https://docs.morpho.org/'],
          ['Forum', 'https://forum.morpho.org/']
        )
      }),
      lesson({
        title: 'Why Morpho, Why This Role, Why You',
        body: `## Avoid generic motivation answers

Bad answers sound like:

- "I like crypto."
- "Morpho is a top protocol."
- "I want to work in DeFi."

Those say nothing.

## Strong structure

### Why Morpho

- isolated, immutable market design is intellectually serious
- the protocol is clearly built for builders, not just end-user branding
- the role sits close to real integrations, not just abstract ecosystem talk

### Why partner engineering

- you like turning protocol complexity into partner-safe explanations
- you like scoping, POCs, debugging, and stakeholder translation
- you want leverage through tools, demos, and technical communication

### Why you

- you can go deep on protocol mechanics
- you can still communicate simply
- you think in next steps, not just answers

## Example framing

"What makes Morpho compelling to me is that the infrastructure is serious. Blue's isolated-market design, Vault V2's explicit role and timelock model, and the surrounding integration surfaces all show a protocol designed for builders who need precision. The role itself is compelling because it is not passive support. It combines technical depth, product judgment, partner communication, and fast POC execution. That combination is where I do my best work."

## Tag

\`Motivation\` \`Role-Fit\``,
        mustMemorize: [
          'Do not give generic crypto enthusiasm answers.',
          'Anchor your answer in Morpho design quality and builder-facing leverage.',
          'Explain why partner engineering fits your working style.',
          'End with what you specifically bring to the role.'
        ],
        whyItMatters: 'Interviewers use motivation answers to check whether your interest is real and whether you understand what the job actually is.',
        interviewDrill: 'Give a 90-second answer to: "Why Morpho, and why this role?"',
        estimatedMinutes: 18,
        docsRefs: docs(
          ['Market Concept', 'https://docs.morpho.org/learn/concepts/market/'],
          ['Vault V2 Concept', 'https://docs.morpho.org/learn/concepts/vault-v2/']
        )
      }),
      lesson({
        title: 'How to Answer When You Do Not Know',
        body: `## The right move is controlled uncertainty

In this interview, bluffing is much worse than saying you would verify something.

The pattern:

1. state the part you know with confidence
2. identify the exact detail you would verify
3. name the source of truth
4. say what decision you can still make right now

## Example

Bad:
"I think the Base factory is probably..."

Strong:
"I know the integration pattern I would use, and I know this address is chain-specific. I would verify the exact Base factory on the official Addresses page before giving a production answer. That does not change the architecture choice, only the final deployment constant."

## When to use this pattern

- exact addresses
- chain-specific deployment details
- current reward campaign assumptions
- exact API field names you have not used recently

## Tag

\`Judgment\` \`Uncertainty\` \`Partner-Safe\``,
        mustMemorize: [
          'Never bluff exact chain-specific details.',
          'State what you know, what you would verify, and why it matters.',
          'Use source-of-truth language explicitly.',
          'Controlled uncertainty is a strength if paired with a concrete decision path.'
        ],
        whyItMatters: 'Senior interviewers trust people who know how to bound uncertainty. This is core partner-engineer behavior.',
        interviewDrill: 'Answer a question you cannot fully complete from memory without bluffing any details.',
        estimatedMinutes: 16,
        docsRefs: docs(
          ['Addresses', 'https://docs.morpho.org/get-started/resources/addresses/'],
          ['Morpho API', 'https://docs.morpho.org/tools/offchain/api/']
        )
      })
    ]
  },
  {
    slug: 'fixed-rate-lending-v2',
    title: 'Fixed-Rate Lending & Morpho V2 Markets',
    category: 'expert',
    durationHours: 3,
    summary: 'Built from direct interview feedback by Florian de Miramon (Morpho Solution Architect, March 30 2026). Covers fixed-rate primitives (zero coupon, maturity, tenor, obligations, payoff), Vault V2 role recall under pressure, Morpho V2 intent-based architecture, the non-opinionated infrastructure mental model, and CeFi partner re-education scenarios.',
    objective: 'Answer every fixed-rate lending question with institutional fluency, recite all five Vault V2 roles without hesitation, position Morpho V2 vs Blue cleanly, and lead a full partner onboarding conversation for a CeFi exchange.',
    format: 'read-drill-test',
    lessons: [
      lesson({
        title: 'Fixed-Rate Primitives: Zero Coupon, Maturity, Tenor, Payoff, Obligations',
        body: `## Why this module exists

On March 30 2026, Florian de Miramon (Solution Architect, Morpho) conducted the first round interview and stated explicitly: the role requires being **"super proficient in lending and borrowing mechanism with fixed terms."** He named five concepts directly: **obligations, zero coupon, payoff, maturity, tenor.** This module covers every one of them at interview depth.

---

## Zero Coupon Bonds

A zero coupon bond is a debt instrument issued **at a discount to face value** that pays no periodic interest. The borrower receives less than face value upfront, holds the funds for the tenor, and repays the full face value at maturity.

**Example:**
- Face value: 100 USDC
- Tenor: 90 days
- Discount rate: 8% annualized
- Borrower receives: ~98 USDC today
- Borrower repays: 100 USDC at maturity
- The 2 USDC difference IS the interest — it is baked into the discount

**Why Morpho V2 uses this model:**
- Lenders know their exact return at origination — no rate drift
- Borrowers know their exact cost at origination — no surprise resets
- Settlement is clean: one payment at maturity, not a stream of accrual

**How this differs from Morpho Blue:**
Morpho Blue uses a utilization-based IRM. The rate borrowers pay today will be different tomorrow if utilization changes. Zero coupon eliminates that variable. The rate is locked the moment the loan is originated.

---

## Maturity

Maturity is the **date when the loan must be settled in full**.

- In Morpho Blue: loans are open-ended. A borrower can hold a position indefinitely as long as health factor stays above 1.
- In Morpho V2 fixed-rate markets: there is an explicit maturity date. At maturity, the borrower must repay. If they do not, default mechanics apply.

**What happens at maturity:**
1. The borrower repays principal + encoded interest (face value)
2. The lender receives the repayment and can exit
3. If the borrower fails to repay, the protocol enforces settlement using the posted collateral

**Explaining maturity to a CeFi partner who only knows perpetual lending:**
"In Morpho Blue, your loan has no expiry — you manage it in real time based on collateral price. In Morpho V2, you are entering a term loan with a specific end date, like a 30-day commercial paper. The terms are fixed at origination and the clock runs to settlement."

---

## Tenor

Tenor is the **length of time until maturity**. Common tenors: 7 days, 30 days, 90 days, 180 days.

**Why tenor matters for product design:**
- Short tenor (7-30 days): lower interest rate, more frequent rollover decisions, suits treasury managers with short cash cycles
- Long tenor (90-180 days): higher rate, predictable for longer planning horizons, suits institutional lenders doing quarterly reporting
- Tenor selection should match the partner's cash flow model and regulatory reporting cycle

**Interview angle:**
When a partner says "we want fixed-rate lending," your first question should be: "What tenor range fits your business model?" Not every partner has thought through this, and the answer shapes the entire integration.

---

## Obligations

An obligation is the **contractual commitment to repay** a fixed-rate loan at maturity.

**TradFi vs DeFi:**
- TradFi: obligation is a legal document enforceable by courts and intermediaries
- DeFi: obligation is a smart contract. Enforcement is automatic — collateral is available for liquidation without requiring court action

**How obligations are represented onchain:**
In V2's intent-based model, when a lending intent is matched to a borrowing intent, the resulting position encodes the obligation terms: amount owed, maturity timestamp, collateral posted, and settlement conditions.

**The partner-facing nuance:**
Institutions sometimes worry about "who enforces repayment?" In DeFi fixed-rate, collateral enforcement replaces legal enforcement. If the borrower cannot repay, the collateral is used to settle the lender. The obligation is not a promise backed by legal standing — it is a position backed by locked collateral.

---

## Payoff

Payoff is the **total amount returned to the lender at maturity**.

In the zero coupon model:
- Lender deposits X at origination (at a discount to face value)
- Lender receives Y at maturity, where Y > X
- Payoff = Y = the face value of the loan
- The interest earned = Y - X = the original discount

**Payoff calculation:**
\`\`\`
Face Value = Principal / (1 - discount_rate * tenor_in_years)
Lender deposits: Principal
Lender receives at maturity: Face Value
Interest earned: Face Value - Principal
\`\`\`

**Payoff profile for different tenors (8% annualized):**
- 30-day tenor: lender deposits 99.33, receives 100. Earns 0.67 per 100 face value.
- 90-day tenor: lender deposits 98.04, receives 100. Earns 1.96 per 100 face value.
- 180-day tenor: lender deposits 96.15, receives 100. Earns 3.85 per 100 face value.

**Interview framing:**
"The lender's payoff is fully defined at origination. There is no duration risk in the sense that the rate will not change — but there is maturity risk: if the borrower defaults, the collateral recovery determines the actual payoff."

---

## Fixed Rate vs Variable Rate: Clean Comparison

| Dimension | Variable Rate (Morpho Blue) | Fixed Rate (Morpho V2) |
|-----------|---------------------------|----------------------|
| Rate mechanism | Utilization-based IRM curve | Locked at origination via intent matching |
| Borrower cost | Changes with market utilization | Known exactly at loan start |
| Lender return | Fluctuates based on borrow demand | Known exactly at loan start |
| Loan term | Open-ended (no maturity) | Fixed maturity date |
| Institutional fit | Good for short-term flexible exposure | Strong for treasury planning, regulatory reporting |
| Risk profile | Rate risk + collateral risk | Maturity/default risk + collateral risk |

**Why institutions prefer fixed rates:**
- Treasury teams require predictable yields for quarterly and annual reporting
- Risk teams require known maximum exposure for capital allocation models
- Compliance teams require clear loan terms for regulatory classification
- Fixed-rate + fixed-term = "TradFi-like" experience on DeFi infrastructure

---

## Interest Rate Discovery in Fixed-Rate Markets

In Morpho Blue: the IRM curve determines rates algorithmically. Higher utilization = higher borrow rate. No human negotiation.

In Morpho V2: rates emerge from **intent matching**. A lender declares "I will lend 1M USDC for 90 days at minimum 6% APY." A borrower declares "I will borrow 1M USDC for 90 days, posting ETH collateral, at maximum 7% APY." If the terms overlap, the system matches them.

This is fundamentally different from order-book lending, which implies centralized matching and maker/taker dynamics. V2 matching is permissionless and protocol-enforced.`,
        mustMemorize: [
          'Zero coupon: borrower receives face value minus discount, repays full face value at maturity. The discount IS the interest.',
          'Tenor is the length until maturity. Tenor selection should match the partner\'s cash flow model.',
          'Obligation in DeFi = collateral-enforced commitment, not legally enforced promise.',
          'Payoff is fully defined at origination. No rate drift, no surprise resets.',
          'Fixed rate eliminates rate risk but introduces maturity risk. Know the trade-off.'
        ],
        whyItMatters: 'Florian named these five concepts by name in the first interview. This is the single highest-priority topic for the technical round. You must be able to explain each concept cleanly and contrast fixed-rate with variable-rate without hesitation.',
        interviewDrill: 'Explain zero coupon bonds to a product manager who only knows Aave-style variable lending. Then explain what happens at maturity if the borrower cannot repay.',
        estimatedMinutes: 40,
        docsRefs: docs(
          ['Morpho V2 Concepts', 'https://docs.morpho.org/learn/concepts/'],
          ['Market Concept', 'https://docs.morpho.org/learn/concepts/market/']
        )
      }),
      lesson({
        title: 'Vault V2 Roles — Cold Recall Under Pressure',
        body: `## Why this lesson exists

In the March 30 interview, the Vault V2 roles came up and the answer was not clean enough. This lesson is structured for cold recall — no hesitation, no confusion between roles. Five roles, five clean sentences.

---

## The Five Roles: Complete Reference

### 1. Owner
**What they do:** Sets the top-level governance structure of the vault.
**Specific powers:** Set the curator. Set and remove sentinels. Transfer ownership. Set the skim recipient.
**What they CANNOT do:** Directly change caps, fees, adapters, or move funds.
**Why this role exists:** Separates governance authority from operational risk management. The owner defines who manages the vault, not how the vault manages money.

### 2. Curator
**What they do:** Defines the vault's allocation strategy and manages risk parameters.
**Specific powers:** Set and remove allocators. Set supply fee and performance fee. Set fee recipient. Submit timelock proposals to add/remove adapters, change caps, configure gates, and set the liquidity adapter.
**What they CANNOT do:** Bypass timelocks on risk-increasing actions.
**Florian's exact framing:** "The curator is here to decide where the money of this vault is allocated."
**Why this role exists:** Curator = vault's risk manager. They decide which markets receive capital and under what constraints. This is the Morpho innovation over Aave-style governance: each vault has a dedicated, accountable risk manager.

### 3. Allocator
**What they do:** Executes fund movements between markets within the boundaries set by the curator.
**Specific powers:** Allocate and deallocate within current caps. Set reallocate flow data.
**What they CANNOT do:** Change caps, add/remove adapters, or set fees.
**Why this role exists:** Operational execution authority without strategic override ability. An allocator can move money, but only within the guardrails the curator has established. If the allocator key is compromised, the attacker cannot change the caps — they can only move funds within existing constraints.

### 4. Sentinel
**What they do:** Emergency blocker for risk-increasing changes.
**Specific powers:** Revoke any pending timelock proposal. Decrease absolute and relative caps immediately (no timelock). Call forceDeallocate or deallocate.
**What they CANNOT do:** Increase caps, add adapters, set fees, or access funds directly.
**Why this role exists:** Risk changes go through timelocks, but a dangerous pending change needs to be stoppable before execution. Sentinels are the safety layer that can cancel proposals without being able to create new risk.

### 5. Guardian
**What they do:** Emergency vault pause.
**Specific powers:** Pause the entire vault in emergency scenarios.
**What they CANNOT do:** Change strategy, access funds, modify caps.
**Sentinel vs Guardian:** Sentinel operates at the proposal level (cancel specific pending changes). Guardian operates at the vault level (pause everything). Guardian is the nuclear option.

---

## Timelock Asymmetry: CRITICAL

This is where the interview stumble happened. The rule is precise and must be stated precisely:

- **Risk-INCREASING changes** (adding new adapters, raising caps, increasing maximum exposure): **TIMELOCKED** — typically 3-7 days
- **Risk-REDUCING changes** (lowering caps, removing allocations, reducing exposure, revoking proposals): **IMMEDIATE**

**Why:** Depositors need time to evaluate and exit if a curator is about to increase their risk exposure. Fast risk reduction protects depositors. Slow risk increase gives depositors the ability to leave.

**Concrete scenario:** A curator submits a proposal to double the cap on a volatile collateral market. A sentinel sees this and believes it is too aggressive. The sentinel revokes the proposal immediately. The vault returns to its previous configuration. No timelock, no delay — protection is instantaneous.

---

## Three Cap Layers: The Constraint Stack

Before any allocation can occur, three caps must all have headroom:

1. **Market cap (absolute):** Maximum USDC that can be allocated to one specific market. Hard ceiling per market.
2. **Relative cap:** Percentage-based maximum of total vault assets that can go to one adapter or category.
3. **Adapter cap / abstract ID cap:** Maximum aggregate exposure through a given strategy channel or collateral category.

All three must pass simultaneously. The binding constraint wins.

**Practical example:** A vault has 10M USDC total. Market cap for WBTC/USDC market is 2M (absolute). Relative cap for all WBTC-collateral positions is 25% (2.5M). Adapter cap for the MorphoBlue adapter is 8M. If the allocator tries to put 2.3M into the WBTC/USDC market, the 2M market cap blocks it — even though the other caps have headroom.

---

## The 30-Second Role Sequence

Practice this out loud until it takes under 30 seconds:

"Vault V2 has five roles. Owner sets who can manage the vault — specifically the curator and sentinels — but doesn't touch allocations directly. Curator defines the strategy: which markets receive capital, under what caps, and with what fees. Allocator executes the strategy: moves funds within the boundaries the curator set. Sentinel is the emergency blocker: cancels dangerous pending changes before they execute. Guardian is the last resort: pauses the entire vault if something goes wrong. Risk-increasing changes are timelocked. Risk-reducing changes are immediate. That asymmetry protects depositors."`,
        mustMemorize: [
          'Owner: sets curator and sentinels, no direct cap/allocation control.',
          'Curator: defines strategy and submits risk proposals. Florian\'s words: "decides where the money is allocated."',
          'Allocator: executes moves within curator-set caps. Cannot change caps.',
          'Sentinel: revokes pending proposals, reduces caps immediately. Cannot increase anything.',
          'Guardian: pauses the vault. Nuclear option.',
          'Risk-increasing = timelocked. Risk-reducing = immediate. This asymmetry protects depositors.'
        ],
        whyItMatters: 'You stumbled on Vault V2 roles in the first interview. This cannot happen again in the technical round. The five roles must come out clean, in sequence, with no hesitation. Practice the 30-second sequence out loud.',
        interviewDrill: 'Name all five Vault V2 roles and explain each in one sentence. Then explain why timelock asymmetry exists and give a concrete scenario where it matters.',
        estimatedMinutes: 30,
        docsRefs: docs(
          ['Vault V2 Roles', 'https://docs.morpho.org/learn/concepts/vault-v2/'],
          ['Timelock Documentation', 'https://docs.morpho.org/learn/concepts/vault-v2/']
        )
      }),
      lesson({
        title: 'Morpho V2 Architecture and Intent-Based Markets',
        body: `## Morpho V2: What Is New

Morpho V2 introduces **fixed-rate, fixed-term lending** through an intent-based matching system. This is a fundamentally different architecture from Morpho Blue.

---

## Side-by-Side Architecture Comparison

| Feature | Morpho Blue | Morpho V2 |
|---------|------------|-----------|
| Rate type | Variable — utilization-based IRM | Fixed — set at origination via intent matching |
| Loan term | Open-ended, no maturity | Fixed maturity date |
| Rate discovery | Algorithmic curve | Intent matching between lenders and borrowers |
| Collateral type | Single asset per market | Single, multiple assets, or entire portfolios |
| Risk parameters | 5 immutable params (loan token, collateral, oracle, IRM, LLTV) | Intent-driven, more flexible per loan |
| Asset support | Standard DeFi collateral | Includes RWAs and niche assets |
| What happens to undeployed capital | Earns at current supply rate | May sit unmatched if no intent is found |

---

## Intent-Based Lending: How It Works

In Morpho Blue, rates are set by the IRM. No negotiation.

In V2, the process works differently:

1. **Lender expresses intent:** "I will lend 500,000 USDC for 90 days at a minimum APY of 6%."
2. **Borrower expresses intent:** "I will borrow 500,000 USDC for 90 days, posting wBTC as collateral, at a maximum APY of 7%."
3. **System matches:** The terms overlap (lender wants ≥6%, borrower accepts ≤7%). The system can match at any rate in that range.
4. **Loan is originated:** The rate is fixed at the match point. Both sides have locked terms.
5. **Maturity arrives:** Borrower repays face value. Lender receives payoff.

**What happens if no match exists:**
- Lender's capital sits unmatched and undeployed.
- This is NOT a bug — it is an explicit design choice. Lenders should understand that strict intent parameters may result in unmatched positions.
- Partners building on V2 must design UX that surfaces this state clearly.

---

## Intent vs Order Book vs AMM

Clearing up the confusion:

- **AMM (Uniswap, Morpho Blue IRM):** Rate is set algorithmically. No human negotiation. Execution is immediate.
- **Order book (CLOB):** Maker/taker dynamic. Central matching engine. Discrete price levels.
- **Intent-based (Morpho V2):** Each side declares preferences. Matching is permissionless. Rate can land anywhere in the overlap zone. More flexible than an order book.

**The interview-safe definition:**
"Intent-based means both sides express what they want, and the system finds the valid overlap without requiring a centralized matching engine or algorithmic price setting."

---

## Collateral Flexibility in V2

Morpho Blue: one collateral token per market. Clean isolation.

Morpho V2 expands this:
- Single-asset collateral (same as Blue)
- Multi-asset collateral: a borrower can post a basket of assets
- Portfolio collateral: cross-collateralization across a broader position
- RWA support: real-world assets as collateral, important for institutional partners

**Why this matters for partner conversations:**
An institutional borrower might have a portfolio of tokenized treasuries, wBTC, and ETH they want to use as collateral. V2's flexible collateral model accommodates this. Blue does not.

---

## Lifecycle of a Fixed-Rate Loan on V2

\`\`\`
1. ORIGINATION
   Lender and borrower express matching intents
   Rate locked at match point
   Collateral posted by borrower
   Lender's USDC transferred to borrower

2. DURING TENOR
   No rate changes — terms are fixed
   Borrower uses funds for their treasury/strategy
   Lender holds a claim on the maturity payoff

3. MATURITY
   Borrower repays face value (principal + encoded interest)
   Lender receives payoff
   Collateral returned to borrower

4. DEFAULT SCENARIO
   Borrower fails to repay at maturity
   Protocol uses collateral to settle the lender
   Recovery depends on collateral value at settlement time
\`\`\`

---

## When to Recommend Blue vs V2

**Recommend Morpho Blue when:**
- Partner needs flexible, open-ended borrowing (no fixed maturity pressure)
- Partner is building a variable-rate product and the rate uncertainty is acceptable
- Partner needs immediate liquidity access without commitment to a tenor
- Partner's collateral is a standard single asset

**Recommend Morpho V2 when:**
- Partner's users need predictable yield for treasury planning or regulatory reporting
- Partner is targeting institutional or CeFi users who expect term loans
- Partner needs multi-asset or RWA collateral support
- Partner wants to offer structured lending products with defined risk profiles`,
        mustMemorize: [
          'V2 uses intent-based matching: lenders and borrowers express terms, system finds the overlap.',
          'Unmatched intents are a valid state in V2 — capital may sit undeployed. Design UX for this.',
          'V2 supports single, multi-asset, and portfolio collateral, including RWAs.',
          'Recommend Blue for flexible open-ended borrowing. Recommend V2 for fixed-term institutional products.',
          'Lifecycle: origination → locked terms → maturity settlement. No rate changes mid-loan.'
        ],
        whyItMatters: 'Florian confirmed the technical round will focus on V2 mechanics. You need to explain the intent-based architecture and contrast it with Blue clearly and quickly, ideally in under 90 seconds.',
        interviewDrill: 'Walk through the full lifecycle of a 90-day fixed-rate USDC loan on Morpho V2, from origination to maturity, including what happens if the borrower defaults.',
        estimatedMinutes: 35,
        docsRefs: docs(
          ['Morpho V2 Concepts', 'https://docs.morpho.org/learn/concepts/'],
          ['Market Concept', 'https://docs.morpho.org/learn/concepts/market/']
        )
      }),
      lesson({
        title: 'Morpho as Non-Opinionated Infrastructure: The Full Ecosystem Map',
        body: `## The Core Concept

Florian was explicit about this in the interview: the role is not just "help partners integrate Morpho." It is "help partners choose and integrate the **entire ecosystem** around Morpho."

Morpho provides lending and borrowing infrastructure only. It deliberately does not mandate:
- Which oracle to use
- Which wallet infrastructure to use
- How to comply with regulations
- How to manage liquidity
- How to build the frontend
- How to handle KYC/KYB

**Why non-opinionated is a design choice, not a gap:**
Being opinionated about the ecosystem would force every partner into the same tooling, even if that tooling does not fit their regulatory jurisdiction, user base, or technical stack. Non-opinionated means maximum composability. Partners can use the oracle that fits their risk model, the wallet provider that works in their geography, the compliance tool that satisfies their legal team.

---

## The Full Ecosystem Map

When a partner says "we want to build on Morpho," the real scope is:

### Layer 1: Morpho Core
- Morpho Blue markets (isolated, immutable, permissionless)
- Vault V2 (managed allocation with roles and timelocks)
- Bundler3 (atomic multi-step transaction flows)

### Layer 2: Oracle Infrastructure
- Chainlink: most widely used, good for major assets
- Pyth: high-frequency updates, suitable for fast-moving assets
- Redstone: pull-based oracle, good for newer assets
- Chronicle: privacy-focused, institutional-grade
- **Your job:** Help the partner understand trade-offs and which oracle fits their collateral and risk tolerance

### Layer 3: Wallet & Account Infrastructure
- WalletConnect: broad wallet compatibility
- Web3Auth / Privy: social login and embedded wallets for lower-friction onboarding
- Safe (Gnosis): multisig for institutional users, common for treasury management
- **Your job:** Match wallet infrastructure to the partner's user profile (retail vs institutional vs treasury)

### Layer 4: Compliance & KYC
- Chainalysis: blockchain analytics, AML screening
- Elliptic: transaction monitoring and risk scoring
- Persona: identity verification and KYB flows
- **Your job:** Understand the partner's jurisdictional requirements and recommend compatible tools

### Layer 5: Liquidity Bootstrapping
- Merkl: incentive programs, token rewards to attract early liquidity
- Protocol-level incentive campaigns from Morpho
- Market making partnerships for institutional vaults
- **Your job:** Set realistic liquidity expectations and build a bootstrapping plan

### Layer 6: Data & Frontend
- Morpho GraphQL API: indexed data for dashboards and discovery
- Blue SDK: typed TypeScript abstractions for contract interactions
- Direct contract calls: fallback for real-time data the API does not index
- Merkl REST API: reward and claim data
- **Your job:** Select the right data surface for each UI component and design for API fallback

### Layer 7: Risk Monitoring
- Custom monitoring on market health (HF distributions, utilization, oracle latency)
- Automated alerts for curator-relevant events (caps approaching, sentinel actions, timelock expirations)
- **Your job:** Help partners design monitoring systems appropriate for their vault's risk profile

---

## Liquidity Management: The Common Hard Conversation

Florian said this comes up in "really common discussions" with partners.

**The honest answer to "why is our new vault getting no deposits?":**
1. Cold-start liquidity is a real problem. New markets have no track record, which means conservative depositors wait.
2. The network effect works against new entrants: more liquidity attracts better rates which attracts more liquidity. Getting to that flywheel requires seed capital.
3. Strategies that work: Merkl incentive programs (token rewards for early depositors), protocol-level promotional campaigns, or a committed anchor depositor who provides initial scale.

**Setting expectations correctly from day one:**
A partner expecting 50M TVL in week 1 without incentives is going to be frustrated. Your job is to scope realistic ramp expectations before launch, not after disappointment.

**Practical liquidity bootstrapping advice:**
- Merkl campaigns: design reward distribution to target lenders, not just swappers. Calibrate reward duration to the partner's timeline.
- Pricing strategy: launch with slightly elevated borrow rates to attract lenders quickly
- Anchor partner: identify one committed institutional depositor for the first 30 days
- Monitoring threshold: set an alert when TVL drops below the level needed for adequate rate competitiveness

---

## CeFi Partner Re-Education Framework

CeFi exchange teams know spot trading. They do not know DeFi lending mechanics. The gaps are predictable:

**Gap 1: Oracle risk**
CeFi: "We use our internal price feed."
DeFi reality: Oracle manipulation is a real attack vector. The partner needs to understand oracle design, latency, and manipulation resistance.

**Gap 2: Liquidation mechanics**
CeFi: "Our risk team handles margin calls."
DeFi reality: Liquidation is permissionless and executed by third-party liquidators, not by Morpho. The partner needs to design UX that surfaces HF clearly before users reach liquidation risk.

**Gap 3: Smart contract risk**
CeFi: "Who do we call if something breaks?"
DeFi reality: Immutable contracts cannot be patched. Audits and formal verification reduce risk, but do not eliminate it. The partner should understand the risk disclosure obligations.

**Gap 4: Composability dependencies**
CeFi: "Can we launch next month?"
DeFi reality: Integration scope involves oracle, wallet, compliance, and liquidity layers. The actual timeline is 3-6 months for a production-ready integration.

**Your framing approach:**
"I want to make sure we scope this correctly so your launch is successful. Let me walk through the decisions you will need to make beyond the Morpho integration itself..."

Then systematically cover the seven layers above. This positions you as a strategic advisor, not just a docs-forwarder.`,
        mustMemorize: [
          'Non-opinionated means partners choose all ecosystem components: oracle, wallet, compliance, liquidity, frontend.',
          'Seven layers: Morpho core, oracles, wallets, compliance, liquidity bootstrapping, data/frontend, risk monitoring.',
          'Cold-start liquidity requires incentives, anchor depositors, or realistic timeline expectations.',
          'CeFi gaps: oracle risk, liquidation mechanics, smart contract risk, composability dependencies.',
          'Your role is strategic advisor across the full ecosystem, not just Morpho docs expert.'
        ],
        whyItMatters: 'Florian framed the role explicitly as ecosystem-wide advisor, not just Morpho integration support. This lesson defines what the job actually is.',
        interviewDrill: 'A CeFi exchange says they want to add lending using Morpho. They say "just plug it in." Walk through every decision they still need to make beyond the Morpho integration itself.',
        estimatedMinutes: 35,
        docsRefs: docs(
          ['Morpho Tools Overview', 'https://docs.morpho.org/tools/'],
          ['Addresses', 'https://docs.morpho.org/get-started/resources/addresses/'],
          ['Morpho API', 'https://docs.morpho.org/tools/offchain/api/']
        )
      }),
      lesson({
        title: 'CeFi Partner Scenarios and Liquidity Management',
        body: `## Scenario Drills: Practice Out Loud

This lesson is entirely scenario-based. For each scenario, practice giving a spoken answer at 90 seconds or less. Then review the model answer and identify what you missed.

---

## Scenario 1: The Impatient CeFi PM

**They say:** "We're a top-10 exchange. We want to add lending. We'll use Morpho. How long does this take?"

**What they expect:** "A few weeks."

**What is actually true:** A production-ready integration with proper oracle selection, wallet infrastructure, compliance layer, and tested UX typically takes **3-6 months** with a dedicated engineering team.

**How to deliver this without losing the partner:**
"The Morpho protocol integration itself is fast — the SDK and GraphQL API are well-documented and your team will have a working prototype quickly. The timeline extends because of the decisions around you: which oracle to use for your specific collateral assets, how to integrate compliance tooling for your jurisdiction, and how you want to handle the onboarding UX. I'd rather scope this correctly so your launch is successful than give you an optimistic number that sets us up for a hard conversation in month two. Can we spend 30 minutes mapping the full scope?"

---

## Scenario 2: The Liquidity Frustration Call

**They say:** "We launched two weeks ago. Our vault has almost no deposits. What's wrong?"

**The honest diagnosis:**
- Cold-start liquidity is normal and expected without seed capital or incentives
- The market may not be visible enough to attract organic depositors
- The yield may not be competitive enough relative to alternatives

**Your answer:**
"This is a common pattern with new vaults, and it's not a sign anything is broken with the integration. Cold-start liquidity is genuinely hard without either an anchor depositor or an incentive program. Let me ask three questions: Do you have an anchor institutional depositor who committed to the first $5M? Have you set up a Merkl campaign to reward early lenders? And what is your current borrow rate relative to comparable markets? If the rate is competitive and you have an incentive program running, deposits usually follow within 4-6 weeks. If neither is in place, that's where we should focus."

---

## Scenario 3: Explaining Liquidation to a CeFi Risk Manager

**They say:** "If a borrower's collateral drops in value, how does your system margin-call them?"

**The translation challenge:** CeFi margin calls are centralized. DeFi liquidation is permissionless and executed by third-party bots.

**Your answer:**
"In Morpho, there's no central margin call team. Instead, the protocol creates an economic incentive for third-party liquidators — anyone in the world can liquidate an undercollateralized position and earn a bonus for doing so. When a borrower's Health Factor drops to 1.0, their position is eligible for liquidation. Liquidators monitor positions onchain and execute when it's profitable for them. The incentive structure ensures that liquidations happen quickly in normal market conditions. The risk we discuss with partners is tail scenarios — extremely fast price moves where liquidators cannot execute before the collateral is worth less than the debt, creating bad debt. That's why LLTV selection and oracle choice matter so much at market creation time."

---

## Scenario 4: Recommending an Oracle

**They say:** "Which oracle should we use?"

**The right response is to ask before recommending:**

Questions to ask first:
1. What assets are you using as collateral?
2. How frequently does the price need to update? (What's your acceptable staleness threshold?)
3. What's your jurisdiction and are there any oracle providers you've already evaluated?
4. What's your risk tolerance for oracle-related incidents?

**General heuristics after the answers:**
- Major assets (ETH, BTC, USDC) with standard update frequency → Chainlink (most proven, widest adoption)
- Assets that need frequent updates with lower latency → Pyth (pull-based, high frequency)
- Newer or niche assets with limited Chainlink coverage → Redstone (broader coverage, pull model)
- Institutional partners with privacy requirements → Chronicle

**Always end with:** "I'd also recommend reviewing the oracle's track record for your specific asset pair, not just their general reputation. I can help you evaluate that."

---

## Scenario 5: Fixed-Rate for a Treasury Team

**They say:** "Our treasury team wants a predictable 6% yield on USDC for 90 days."

**This is exactly the V2 use case:**

"Morpho V2's fixed-rate markets are designed for exactly this. Your treasury would express a lending intent at 6% for a 90-day tenor. If a matching borrower intent exists — someone willing to borrow USDC for 90 days, posting collateral, at or above 6% — the loan is originated. Your treasury receives a known payoff at the 90-day maturity date regardless of what happens to variable rates in the market during that period. The risk is maturity risk — if the borrower cannot repay, the collateral covers the settlement. The rate itself cannot change. That's the proposition: predictable yield with collateral-backed repayment."

---

## The Interview Oral Format: What Florian Described

The technical round is an **oral discussion**, not a coding exercise. What that means practically:

- You will be asked to explain concepts verbally, not write code
- Conciseness matters: 60-90 seconds per answer is the target
- You will be interrupted and pushed with follow-ups — this is normal and good
- Demonstrate that you can hold complexity and communicate simply simultaneously
- If you do not know an exact detail, use the controlled uncertainty pattern: state what you know, name what you would verify, identify the source of truth

**The posture Florian is evaluating:**
A Solution Architect who can get on a call with a CeFi exchange, identify the integration gaps, explain the mechanics, and leave with a concrete next step. Not a developer who reads docs. Not a sales person who oversells. Someone who bridges both.`,
        mustMemorize: [
          'Cold-start liquidity requires anchor depositors or incentive programs. Set this expectation before launch.',
          'DeFi liquidation is permissionless third-party bots, not centralized margin calls.',
          'Before recommending an oracle, ask about collateral assets, update frequency, and jurisdiction.',
          'Fixed-rate V2 is the answer to treasury teams wanting predictable yield.',
          'Technical round = oral discussion, 60-90 second answers, expect interruptions and follow-ups.'
        ],
        whyItMatters: 'These scenarios represent the actual conversations you will have in week one of the role. If you can handle all five cleanly and calmly, you are ready for the technical interview.',
        interviewDrill: 'A CeFi exchange PM says "we just need to integrate lending, it should be simple." Give a calm, complete, 90-second response that sets correct expectations without losing the partner.',
        estimatedMinutes: 30,
        docsRefs: docs(
          ['Morpho Tools Overview', 'https://docs.morpho.org/tools/'],
          ['Market Concept', 'https://docs.morpho.org/learn/concepts/market/']
        )
      })
    ]
  }
];

module.exports = { CURRICULUM_MODULES };
