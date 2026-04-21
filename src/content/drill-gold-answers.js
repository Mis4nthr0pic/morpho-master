const DRILL_GOLD_ANSWERS = {
  1: {
    answer: `Morpho Blue is not a pooled lending market like Aave. It is an isolated lending primitive where each market is defined by one loan asset, one collateral asset, one oracle, one IRM, and one LLTV, and the risk stays inside that exact market instead of being socialized across unrelated assets. For a partner, that matters because you can launch or integrate around a specific asset pair with precise parameters and a contained blast radius. The trade-off is that liquidity is not automatically shared the way pooled systems share it, but the gain is cleaner market-level control and easier reasoning about risk.`,
    followUp: `Pooled liquidity can still be reasonable when the partner values standardization, a simpler product surface, and shared liquidity depth across many assets more than custom market design. If they do not need isolated asset onboarding or precise market-level controls, pooled lending can still be a good fit.`,
    sources: ['morpho-docs-blue-market-concepts', 'faq-page-extract']
  },
  2: {
    answer: `Health Factor is the position safety metric a borrower dashboard should surface. In plain terms, it tells the user how close they are to the liquidation threshold, and when HF is around 1 or below the position is near or at liquidation risk. It changes as oracle prices move and as debt accrues, so the dashboard cannot treat it as static. A good borrower UI should show HF, explain that price movement and accrued debt can push it down, and add warnings and safety buffers before the user gets close to the threshold.`,
    followUp: `A user can still liquidate even if they thought they were below LLTV because their UI snapshot may not match exact onchain state at the liquidation moment. Oracle prices can move, debt keeps accruing, rounding and timing matter, and the dashboard may have been showing a rough snapshot rather than the exact liquidation state.`,
    sources: ['morpho-docs-borrow-risk', 'faq-page-extract']
  },
  3: {
    answer: `Morpho Blue is immutable in the sense that the deployed core primitive and each market’s five parameters are not admin-upgraded after the fact. For a partner, that means the trust assumptions stay narrow and diligence is easier because they are integrating a stable primitive rather than a system that can be changed underneath them. The trade-off is that you do not get hot patches or flexible governance upgrades on deployed markets. So the pitch is not “immutability is always better,” it is that Morpho trades flexibility for predictability, bounded governance power, and easier institutional review.`,
    followUp: `If a partner prefers upgradeable systems, I would say that upgradeability can be rational when they want rapid feature changes or broad admin control, but it also expands trust and governance assumptions. Morpho’s approach is better when predictability and constrained control matter more than post-deploy flexibility.`,
    sources: ['morpho-docs-blue-market-concepts', 'how-to-evaluate-defi-protocols', 'faq-page-extract']
  },
  4: {
    answer: `Vault V2 is designed as a separation-of-powers system rather than a single-manager vault. The key roles are Owner, Curator, Allocator, and Sentinel. Owner handles top-level governance, Curator defines the strategy and risk envelope, Allocator moves liquidity within the allowed strategy, and Sentinel has limited emergency protection powers. That matters operationally because no single operator needs every permission, and risk-increasing changes are timelocked while some protective risk-reducing actions can happen immediately. Compared with a single-manager vault, Vault V2 gives stronger internal controls and a structure that fits institutional oversight much better.`,
    followUp: `The most severe compromise depends on context, but Curator or Owner compromise is usually the most serious because those roles shape strategy and governance powers. A good answer should justify that in terms of what each role can actually change, rather than naming one role mechanically.`,
    sources: ['vaults-v2-launch-post', 'morpho-docs-vault-v2']
  },
  5: {
    answer: `Vault V2 does not use one blunt limit because curators need to control risk at different layers. Market caps constrain exposure to one exact market, collateral caps constrain shared exposure to a collateral type across markets, and adapter caps constrain exposure through a venue or integration path. The point is that risk is multi-dimensional, so one limit is not enough if you want flexible but disciplined curation. The docs also frame this through ids and absolute versus relative caps, which lets a curator express shared risk limits without flattening everything into one bucket.`,
    followUp: `If only one cap layer is non-zero, then risk control exists only at that layer and other shared-risk dimensions may remain unconstrained. Operationally, that makes the vault easier to manage, but less expressive and less precise.`,
    sources: ['vaults-v2-launch-post', 'morpho-docs-vault-v2']
  },
  6: {
    answer: `I would recommend Bundler3 when the user flow is multi-step and partial completion would leave them in a bad intermediate state. The canonical examples are leverage, refinance, collateral swap, or repay-and-withdraw flows, where you want all steps to settle atomically or not at all. I would not pitch Bundler3 as mandatory for every integration, because simple single-step deposits, borrows, or withdrawals can still use direct Morpho transactions. The value is state safety and cleaner UX, not just gas or abstraction for its own sake.`,
    followUp: `A leverage flow is the easiest example: borrow, swap the borrowed asset into more collateral, and resupply it. If that sequence only half-completes, the user can end up with debt but without the intended collateral state, which is exactly what atomic bundling prevents.`,
    sources: ['bundler3-blog-post', 'morpho-docs-build']
  },
  7: {
    answer: `For a first incentivized-vault POC, I would ship a focused dashboard rather than a broad app. I would use Morpho’s API or GraphQL layer for vault discovery, APY, allocation, and user position data, and Merkl or the rewards data path for incentive context. The UI should show base APY separately from reward APR, then optionally a combined yield number with explanation, because flattening them into one unexplained number hides what is sustainable versus incentive-driven. For user actions, I would include at least a position view and a claim simulation or claim path so the partner can demonstrate the full loop without overbuilding.`,
    followUp: `If rewards data times out, I would still load vault state and base APY, mark incentives as temporarily unavailable, and keep the rest of the product usable. The POC should degrade gracefully instead of failing as a whole just because the rewards layer is late.`,
    sources: ['merkl-rewards-content', 'morpho-docs-api', 'morpho-docs-rewards']
  },
  8: {
    answer: `The simplest BD explanation is that Morpho provides the lending state and base yield, while Merkl provides the rewards context layered on top. Morpho tells you what the vault is, what it allocates into, and what the native yield is. Merkl tells you whether there are active incentive programs and what the reward APR looks like. That matters in a partner demo because users care about both sustainable yield and incentive-driven upside, but the UI should explain them separately so the partner does not oversell one blended number.`,
    followUp: `The UI should not flatten base APY and rewards APR into one unexplained number because they are different yield sources with different durability. Base APY comes from borrowing demand, while reward APR can change or end with the campaign.`,
    sources: ['merkl-rewards-content', 'faq-page-extract']
  },
  9: {
    answer: `The balanced answer is that building your own isolated market can make sense if you want full ownership and highly custom behavior, but it also means you are responsible for contract maturity, tooling, operational support, and time to market. Morpho gives you a battle-tested isolated primitive, docs, APIs, ecosystem tooling, and a partner pattern that many teams already use. So the case for Morpho is not “never build in-house,” it is that you can ship faster on stronger infrastructure and focus your resources on distribution, UX, and partner-specific logic instead of rebuilding the lending base layer.`,
    followUp: `Building in-house is still rational when the partner needs custom compliance, custom economics, or a control surface that does not map well to Morpho. The right answer is use-case dependent, not ideological.`,
    sources: ['how-to-evaluate-defi-protocols', 'customer-stories-coinbase', 'faq-page-extract']
  },
  10: {
    answer: `In the first five minutes I would acknowledge the frustration and the impact, then move immediately into structured triage. I would ask for the exact chain, address, transaction hashes, expected versus actual behavior, and whether funds appear at risk or the issue is only affecting the integration surface. I would avoid blaming either the protocol or the partner too early, and I would give a concrete next-update expectation so they know the issue is being handled. The goal is to be calm, accountable, and technically organized.`,
    followUp: `If funds may be at risk, the tone becomes more urgent and safety-oriented: preserve evidence, stop unsafe user actions if needed, and escalate immediately. If it is only a data-layer issue, I would still move quickly, but the communication can focus more on degraded UX and ETA than on asset safety.`,
    sources: ['support-playbook-content', 'faq-page-extract']
  },
  11: {
    answer: `Morpho’s API is very useful for indexed reads, market discovery, vault comparisons, and historical views, but it should not be treated as the sole source of truth for risk-critical behavior. Risk-critical flows should account for the fact that API data is an indexed read layer and may lag or degrade, while execution truth lives onchain. So for production borrow safety or other sensitive actions, I would combine API reads with onchain-aware checks, simulation, caching, and degraded-mode behavior. I would still happily build non-critical surfaces like portfolio views, vault discovery, and dashboards from GraphQL.`,
    followUp: `I would absolutely use GraphQL for portfolio pages, vault lists, allocations, APY comparisons, and historical analytics. I just would not let it be the only input for a risk-critical execution decision.`,
    sources: ['morpho-docs-api', 'how-to-evaluate-defi-protocols']
  },
  12: {
    answer: `I would answer by acknowledging that Aave is an established pooled-lending protocol with strong network effects, then explain that Morpho is a different design optimized around isolated markets and more precise market-level control. Morpho is stronger when a partner cares about launching or integrating specific asset pairs with contained risk and custom parameterization. If Vault V2 is relevant, I would add that Morpho also supports curated allocation products on top of the isolated market layer. So the answer is not “Morpho beats Aave everywhere,” it is that Morpho is often a better fit when the partner’s use case needs isolated design and curated control rather than a shared pool model.`,
    followUp: `If the partner values standardization more than custom market design, pooled systems can still be a rational answer. The correct recommendation depends on what they are optimizing for.`,
    sources: ['morpho-docs-blue-market-concepts', 'faq-page-extract']
  },
  13: {
    answer: `Before recommending Blue, Vault V2, or both, I need to know whether the partner is building a borrow flow, an earn flow, or both. Then I need the chain, the assets involved, who the end user is, and what exact action the user should take in the product. I also need to understand whether incentives matter, what monitoring or risk disclosures they expect, whether there are custody or compliance constraints, and whether they want direct market control or curated allocation. From there the recommendation gets concrete: Morpho Blue is the right fit for direct market-level borrowing or isolated asset exposure, Vault V2 is the right fit for curated earn or managed strategy exposure, and some partners may need both if they want a managed earn surface plus direct market integrations.`,
    followUp: `I would recommend a fast POC when requirements are still fuzzy, when the partner needs to validate user demand or UX quickly, or when the safest next step is a narrow dashboard or earn surface before production complexity grows.`,
    sources: ['morpho-docs-build', 'morpho-docs-vault-v2', 'how-to-evaluate-defi-protocols']
  },
  14: {
    answer: `The fragmentation concern is real in isolated markets because liquidity is not pooled automatically across unrelated markets. Public Allocator is Morpho’s answer to part of that problem: it can help reallocate liquidity across enabled markets within curator-defined constraints so capital moves toward where borrow demand exists. The important nuance is that it improves liquidity routing; it does not make isolated markets magically behave like one pooled market or remove liquidity risk entirely. So the partner-facing explanation is that Morpho keeps the clean isolated primitive, then adds allocator tooling to make capital more usable without abandoning isolation.`,
    followUp: `In a dashboard, I would surface available liquidity, utilization, and any reallocatable liquidity context so the partner can show where borrow demand could realistically be served. That helps users understand why liquidity might exist in the ecosystem but not yet in the exact market they care about.`,
    sources: ['public-allocator-blog-post', 'morpho-docs-vault-v2']
  },
  15: {
    answer: `A strong escalation note should include the chain, contract or vault address, any user addresses involved, transaction hashes, and exact reproduction steps. It should say what was expected, what actually happened, whether the issue is deterministic or intermittent, and whether funds are at risk or the impact is limited to UX. It should also separate confirmed facts from assumptions so engineering does not waste time. The note should be concise, but detailed enough that someone can reproduce and triage immediately.`,
    followUp: `While engineering investigates, I would tell the partner what is known so far, what evidence has been collected, whether funds currently appear safe, and when they will receive the next update. That keeps the loop tight without pretending we already know the root cause.`,
    sources: ['support-playbook-content', 'faq-page-extract']
  },
  16: {
    answer: `I would say Morpho uses strong security practices, including audits and bug bounty programs, but I would avoid implying that any protocol is risk-free. On the asset-freeze question, the important technical point from the FAQ is that Morpho is non-custodial, permissionless, and immutable, and it cannot arbitrarily freeze user assets through an admin action. So the balanced live-call answer is strong security process plus no asset-freeze control, without turning that into a zero-risk guarantee.`,
    followUp: `To avoid sounding like I am making legal guarantees, I would frame the answer as a technical property of the protocol design and the current control model, not as a promise that nothing can ever go wrong.`,
    sources: ['faq-page-extract', 'security-framework-post']
  },
  17: {
    answer: `For a compare-vaults interface, I would help the partner rank vaults by curator quality, underlying exposure, fees, liquidity, and net yield rather than by headline APY alone. A good comparison should surface who the curator is and their track record, what collateral or market exposures sit under the vault, what the fee structure looks like, and what current and historical net APY has looked like. For risk-sensitive users, exposure quality and liquidity should be prominent. For yield-maximizing users, net return and incentives can be more prominent, but the risk context still needs to be visible.`,
    followUp: `If the user is yield-maximizing, I would surface net APY and reward context first. If they are risk-sensitive, I would surface curator quality, liquidity, and exposure details first.`,
    sources: ['faq-page-extract', 'morpho-docs-earn']
  },
  18: {
    answer: `Collateral does not earn supply APY by default on Morpho because it is posted to secure the borrowing position rather than being lent out into the supply side. The FAQ explains this as helping reduce liquidation liquidity constraints and improving capital utilization dynamics. The product trade-off is that borrowers get clean collateral utility and clearer borrow mechanics, but they should not expect their posted collateral to behave like a yield-bearing supply position at the same time.`,
    followUp: `In a borrower dashboard, I would say clearly that posted collateral is securing the loan, not earning supply APY, so users do not confuse collateral utility with lender yield.`,
    sources: ['faq-page-extract']
  },
  19: {
    answer: `A responsible earn-risk explanation should say that onchain earning is not risk-free and that users need to understand protocol risk, liquidity risk, and vault-strategy risk. The FAQ and docs also support mentioning that bad debt can be socialized among lenders and that withdrawals depend on available liquidity, so instant exit is not guaranteed in every state. I would also tell the partner to encourage diligence on the curator and the vault’s actual exposures, because the vault wrapper does not remove underlying market risk. The tone should be honest and steady, not scary or promotional.`,
    followUp: `Near a withdrawal button, I would show a warning like: “Available liquidity may be temporarily limited. Withdrawals depend on current onchain liquidity and may not be instantly available in all market conditions.”`,
    sources: ['faq-page-extract', 'morpho-docs-earn']
  },
  20: {
    answer: `Partners can build a lot more than a simple frontend on Morpho. The FAQ and docs support product types like earn products, borrow products, vault comparison dashboards, structured products, yield aggregators, and other applications built on permissionless lending infrastructure. So the concise answer is that Morpho is a lending backend and market infrastructure layer, not only a retail app. The useful part for BD is tying that to partner types like wallets, exchanges, fintechs, chains, and asset issuers.`,
    followUp: `For a wallet partner, I would usually prototype an earn surface or compare-vaults interface first, because it is the fastest path to a visible user benefit without the complexity of a full borrow stack.`,
    sources: ['faq-page-extract', 'morpho-docs-build']
  },
  21: {
    answer: `I would explain governance as the process by which MORPHO holders discuss proposals, delegate voting power, and participate in signaling and voting. Forum discussion is where ideas and proposals get debated, while Snapshot is the offchain voting surface partners are most likely to encounter. A technically strong partner should also understand that they can vote directly if they hold voting power or participate through delegation if someone else has delegated to them. For a partner engineer, this matters because governance process can shape integrations, priorities, and stakeholder expectations even if they are not personally proposing votes.`,
    followUp: `Knowing governance pathways is useful in partner engineering because product and integration decisions may intersect with community process, delegation, or governance signals, even when the day-to-day work is technical.`,
    sources: ['faq-page-extract', 'governance-content']
  },
  22: {
    answer: `Before launching an Earn surface, I would require read paths for vault discovery, APY, allocations, underlying exposures, and user positions. I would require write paths for deposit and withdrawal, and reward-claim flows if the UI is showing incentives. I would also require risk transparency around the curator, market exposures, liquidity conditions, utilization, and how net yield is composed, plus any attribution or first-use disclaimer requirements from the integration docs. The idea is that the first version should already be trustworthy, even if it is not yet feature-complete.`,
    followUp: `If I only had one week, I would postpone richer analytics and advanced comparison views and focus on trustworthy discovery, position viewing, deposit, withdrawal, and honest risk disclosure.`,
    sources: ['morpho-docs-earn', 'morpho-docs-api', 'faq-page-extract']
  },
  23: {
    answer: `The asset flow of an Earn product starts with the user depositing the underlying asset into a vault. In return, the user receives vault shares, usually ERC-4626 style receipt tokens, that represent their claim on the vault. The vault then allocates that capital into underlying Morpho venues according to its strategy, and yield accrues through growth in the share value rather than through a separate interest coupon. When the user withdraws, they redeem shares back into the underlying asset, subject to available liquidity and the vault’s actual onchain state.`,
    followUp: `For Vault V1 I would keep the explanation simpler as a curated vault allocating into markets. For Vault V2 I would add that the vault can allocate through the newer adapter architecture and that its role system and controls are more advanced.`,
    sources: ['morpho-docs-earn', 'vaults-v2-launch-post']
  },
  24: {
    answer: `A borrow interface needs real-time or near-real-time Health Factor tracking, clear liquidation-threshold warnings, and visibility into changing market conditions like rates and available liquidity. It should also surface safety buffers instead of showing only the bare threshold, because borrowers need margin, not just a limit line. If Public Allocator or similar liquidity-routing context matters for the market, that should be visible too. The goal is not to show more numbers for the sake of it, but to help the user understand when the position is getting unsafe and whether the market can actually serve the action they want to take.`,
    followUp: `For novice users I would simplify the risk surface into warnings, safety status, and suggested buffers. For power users I would expose denser live metrics and more detailed market-state information.`,
    sources: ['morpho-docs-borrow-risk', 'public-allocator-blog-post']
  },
  25: {
    answer: `I would present Morpho security as a layered engineering practice, not as “we were audited, therefore safe.” The security materials point to peer review, testing, fuzzing, mutation testing, formal verification, audits, contests, and bug bounties, all on top of a simpler immutable protocol design that is easier to inspect. The important tone point is that these are signals of diligence and process, not guarantees of zero risk. A skeptical integrator should hear that Morpho takes security seriously and that they should still do their own review.`,
    followUp: `I would avoid claims like “risk-free,” “guaranteed safe,” or “formal verification proves nothing can go wrong.” Even a strong framework is evidence of rigor, not a guarantee.`,
    sources: ['security-framework-post', 'formal-verification-post']
  },
  26: {
    answer: `The Ponder template and liquidation bot repos show that Morpho’s ecosystem support extends beyond the core contracts. The Ponder template signals that Morpho expects partners to build indexing, analytics, and internal tooling around the protocol, while the liquidation bot shows there is operational tooling for real protocol activity and market maintenance. For a partner engineer, the takeaway is that Morpho gives you building blocks for POCs, dashboards, and internal monitoring, not just contracts and docs. That says a lot about integration style: pragmatic, composable, and ecosystem-friendly.`,
    followUp: `If a partner wanted an internal monitoring tool first, I would reach for the indexing template before the liquidation bot, because it is the clearer starting point for a data and observability surface.`,
    sources: ['ponder-template-repo', 'liquidation-bot-repo']
  },
  27: {
    answer: `The Anchorage story is useful because it shows Morpho fitting under existing custody controls rather than forcing institutions into a separate unmanaged wallet workflow. The user-facing institution stays inside its established custody and policy environment, and the resulting ERC-4626 vault receipt tokens remain in custody like other assets. Morpho acts as the noncustodial execution layer underneath, while the custody provider keeps operational controls and approvals intact. That is the institutional answer: productive onchain positions without giving up the custody model the client already relies on.`,
    followUp: `Before saying the integration is ready, I would surface operational, liquidity, policy, and compliance questions, especially around supported vaults, withdrawal behavior, and how the custody environment will represent and monitor the resulting vault tokens.`,
    sources: ['customer-story-anchorage']
  },
  28: {
    answer: `The DeFi mullet pattern is a polished fintech or exchange frontend in the front and DeFi rails in the back. In the customer stories, Coinbase, Crypto.com, and Binance keep the user relationship, product surface, and familiar UX, while Morpho provides transparent noncustodial lending infrastructure underneath. That gives the partner a way to ship onchain earn or borrow products without forcing users through raw DeFi workflows. The commercial point is better speed, transparency, and product leverage without rebuilding the lending backend from scratch.`,
    followUp: `If a partner worries abstraction weakens trust, I would say the right abstraction simplifies UX while preserving onchain verification and transparent yield or loan mechanics. The user does not need to touch raw DeFi interfaces to still benefit from transparent rails.`,
    sources: ['customer-story-coinbase', 'customer-story-cryptocom', 'customer-story-binance']
  },
  29: {
    answer: `The Vault Bridge pattern shows Morpho doing more than powering an earn tab. The core idea is that bridged collateral or escrowed assets do not have to sit idle; they can be deployed into Morpho vaults so the yield generated on the origin side becomes a revenue stream for the destination chain or ecosystem. Importantly, the user-facing bridge flow can remain familiar, while Morpho acts as the yield engine under the hood. It is an infrastructure-level pattern, not just a wallet product pattern, and the docs and story both make clear that risk does not disappear just because the flow is productive.`,
    followUp: `The first dashboards I would build would track bridged TVL, productive collateral deployed through vaults, yield generated, and where that revenue is being routed inside the ecosystem.`,
    sources: ['customer-story-polygon-vault-bridge']
  },
  30: {
    answer: `Morpho’s value to an RWA issuer is that it turns tokenized assets from static distribution objects into productive collateral and financing infrastructure. The Ondo, Apollo, and Midas examples all show the same basic pattern: tokenized assets can be borrowed against, used in structured leverage or repo-like flows, and plugged into onchain liquidity without the issuer building a lending stack from scratch. Morpho’s isolated market design also matters because it gives new asset classes a contained way to come onchain without forcing them into a pooled risk model. So the answer is capital efficiency and utility, not just broader distribution.`,
    followUp: `I would recommend a dedicated isolated market instead of a more generic vault route when the asset class has distinct collateral assumptions, needs explicit market-level parameterization, or deserves a tighter risk container than a broader curation product would provide.`,
    sources: ['customer-story-ondo', 'customer-story-apollo', 'customer-story-midas']
  },
  31: {
    answer: `Using the September 29, 2025 launch framing, Vaults V2 is the next standard for noncustodial asset curation. It keeps the familiar vault experience but adds the ability to allocate across current and future Morpho protocols, including Vault V1, Markets V1, and later Markets V2. The post also highlights differentiated controls like the updated role system, richer cap logic, customizable gate contracts, in-kind redemption, and a future-proof adapter architecture. The partner-level point is that Vaults V2 gives curators and distributors much more control over governance, compliance, and risk expression without giving up the noncustodial design.`,
    followUp: `For a regulated distributor, I would emphasize customizable access controls and role separation first, because they map most directly to compliance, approvals, and operational governance requirements.`,
    sources: ['vaults-v2-launch-post']
  },
  32: {
    answer: `The DeFi mullet pitch is that the partner keeps the polished frontend, compliance posture, and user relationship, while Morpho provides the DeFi backend rails. In practice that means the fintech or exchange owns onboarding, UX, and distribution, and Morpho provides transparent noncustodial lending infrastructure underneath. The Coinbase pattern is the clearest example: Coinbase kept the app experience and account abstraction layer while using Morpho to power the onchain lending side. That is why the concept matters to exchanges and fintechs: they can ship faster on strong rails without surrendering the product surface.`,
    followUp: `If they worry abstraction will make users distrust the product, I would say that the right abstraction hides operational complexity while keeping the source of yield or borrowing verifiable onchain. Trust comes from transparent rails plus a familiar interface, not from forcing every user into raw protocol interactions.`,
    sources: ['defi-mullet-blog-post', 'customer-story-coinbase']
  },
  33: {
    answer: `Public Allocator and pre-liquidations are good examples of Morpho’s base-layer-plus-overlays philosophy because neither one requires changing the core isolated-market primitive. Public Allocator is a liquidity-routing overlay that helps capital move where it is needed within allowed constraints. Pre-liquidations are a borrower-experience overlay that can improve how positions are managed before they hit the harsher edge of full liquidation. The architectural pattern is that Morpho keeps the primitive simple and lets richer application behavior happen in optional overlays or bundled flows rather than inside one bloated base layer.`,
    followUp: `Borrower-facing partners get the clearest benefit from pre-liquidations because it changes user experience near liquidation. Partners focused on capital routing, liquidity efficiency, or allocator tooling benefit most from Public Allocator.`,
    sources: ['public-allocator-blog-post', 'pre-liquidations-blog-post']
  },
  34: {
    answer: `The RWA Playbook framing is that tokenization mostly improves distribution, but Morpho adds financing utility. Once an issuer brings an asset onchain, Morpho can make it productive collateral, create borrow access around it, and let it participate in more capital-efficient onchain strategies. The live examples make that concrete: Midas’s mF-ONE, Apollo’s ACRED use case, and similar patterns show tokenized assets gaining repo-like or borrow utility instead of just sitting as wrapped exposure. So the real value is composability, financing, and capital efficiency beyond issuance alone.`,
    followUp: `Before recommending an RWA market launch, I would highlight oracle design, conservative caps and collateral factors, liquidity availability, and the need for asset-specific risk review. The point is not only “the asset is tokenized,” but “the financing mechanics are safe enough to support.”`,
    sources: ['rwa-playbook-blog-post', 'customer-story-midas', 'customer-story-apollo']
  },
  35: {
    answer: `A permissionless interface still needs responsible product design. The risk-warnings framing is that you can preserve open visibility while still adding differentiated warnings, opt-ins, and clearer product cues for riskier or less understood markets. The goal is not to hide everything unfamiliar forever, but to avoid pretending all permissionless surfaces are equally safe or equally understood by end users. So the responsible answer is openness plus product-layer warnings and graduated friction where it matters.`,
    followUp: `A hard opt-in warning should trigger when the market or asset carries materially higher uncertainty or risk for the user. A softer caution is enough when the surface is better understood but still deserves clear disclosure.`,
    sources: ['risk-warnings-blog-post']
  },
  36: {
    answer: `Morpho’s security story is broader than audits. The security framework and formal verification materials describe a layered process that includes review, extensive testing, fuzzing, formal verification, audits, competitions, and bug bounties, all combined with a simpler immutable design that is easier to reason about. Formal verification should be explained carefully: it increases confidence about specific properties, but it is not magic and does not eliminate all risk. The right tone with a technical partner is engineering-first, specific, and free of “perfect security” claims.`,
    followUp: `Even with a strong security framework, you should avoid claims like “this cannot fail,” “formal verification guarantees safety,” or “audits prove the protocol is risk-free.”`,
    sources: ['security-framework-post', 'formal-verification-post']
  },
  37: {
    answer: `Infrastructure Mode means Morpho can be deployed as public lending infrastructure for a chain before the full app, rewards, or distribution stack is in place. The value to the chain is that local builders can start using the primitive and related tooling immediately, even if ecosystem-level support layers come later. So the answer is not “it is a half-finished app,” but “it is infrastructure first.” That framing is important for a chain team because it points to builder opportunity, not just to an end-user surface.`,
    followUp: `On a new infrastructure-mode deployment, I would build a simple dashboard or an earn/borrow reference surface first so local builders can see the primitive working and start composing around it.`,
    sources: ['infrastructure-mode-blog-post']
  },
  38: {
    answer: `MetaMorpho’s launch logic separates isolated markets from curated vaults on purpose. The isolated markets are the primitive: simple, immutable venues with clear risk boundaries. The curated vault layer sits on top as a delegation and allocation layer, so different curators can express different risk profiles without changing the base market design. That separation also allows overlapping allocations and shared liquidity behavior across vault strategies without collapsing everything into one pooled structure. The partner-friendly explanation is simple markets underneath, curated products on top.`,
    followUp: `I would recommend direct market exposure instead of a curated vault when the partner wants exact market-level control or when the product is specifically about one borrowing market rather than managed diversification.`,
    sources: ['metamorpho-launch-post', 'faq-page-extract']
  },
  39: {
    answer: `Using the January 2026 evaluation framework, I would tell a partner to evaluate Morpho the same way they should evaluate any backend financial infrastructure: simplicity of the primitive, integration quality, governance scope, security process, immutability versus upgradeability trade-offs, and who controls risk and compliance exposure. The point is not to ask only “what APY do I get,” but “what backend am I trusting, how hard is it to integrate, what can change, and where do the control boundaries sit.” That turns the decision into an engineering and product framework rather than a marketing pitch. For the right product, Morpho is attractive because it is simple, composable, and gives the partner a lot of control over the user-facing layer while keeping the lending base transparent.`,
    followUp: `For a regulated fintech, control boundaries, security process, and compliance exposure usually matter most, because they determine whether the product can fit the partner’s operating model at all.`,
    sources: ['how-to-evaluate-defi-protocols']
  }
};

module.exports = { DRILL_GOLD_ANSWERS };
