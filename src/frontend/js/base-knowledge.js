const BASE_KNOWLEDGE = {
  title: 'Base Knowledge',
  subtitle: 'Start here if you want clear Morpho answers that do not sound rehearsed.',
  topics: [
    {
      slug: 'defi-foundations',
      category: 'DeFi Foundations',
      title: 'What A Senior DeFi User Should Actually Know',
      deck: 'This is the DeFi layer you should be able to explain without sounding vague, overconfident, or junior.',
      quickLearningSeeds: ['self-custody', 'smart contracts', 'liquidity', 'oracles', 'liquidations', 'MEV'],
      memorize: [
        'DeFi is open financial infrastructure built from smart contracts, transparent state, and user-controlled wallets.',
        'The core concepts are execution, custody, liquidity, collateral, pricing, incentives, and failure modes.',
        'A senior DeFi explanation connects mechanism to user risk, product behavior, and integration consequences.',
        'You should be able to explain AMMs, lending, borrowing, stablecoins, derivatives, liquid staking, bridges, governance, MEV, and liquidation risk in plain language.'
      ],
      simple: [
        'DeFi is finance built from smart contracts instead of traditional intermediaries.',
        'The important part is not just that it runs onchain. It is that users can hold assets directly, inspect the rules, and move between protocols that share the same execution environment.'
      ],
      deep: [
        'If I were explaining DeFi like a senior user, I would start with the primitives. Users interact through wallets. Smart contracts hold the rules. Tokens represent value or claims. Liquidity is what makes borrowing, swapping, and redeeming possible. Oracles provide price inputs. Liquidations enforce solvency. Incentives shape user behavior. None of those pieces is optional if you want to understand what is really happening.',
        'Then I would walk through the product categories. AMMs are the core swap primitive and depend on liquidity pools, pricing curves, and arbitrage. Lending and borrowing depend on collateral, utilization, interest-rate models, and liquidation mechanics. Stablecoins depend on collateral, redemption assumptions, or issuer trust depending on the design. Derivatives and perps add leverage, funding, and mark-price risk. Liquid staking and restaking turn staked positions into reusable collateral or yield-bearing assets, which is useful but can pile up dependency risk. Bridges move value across chains, but they also add custody, validator, message-passing, and liquidity assumptions. Governance controls parameters, incentives, and protocol direction, but it can also create political and operational risk.',
        'Then I would talk about tradeoffs. DeFi is transparent and composable, but it is not forgiving. Execution is final. Approvals can be dangerous. Oracle mistakes can break markets. Liquidity can disappear. Incentive programs can distort usage. LPs can take impermanent loss. Derivatives can look liquid until volatility spikes. Bridges can fail in ugly ways. MEV changes execution quality and user outcomes. A protocol that looks simple on the surface usually depends on a lot of hidden assumptions underneath, and senior people learn to look for those assumptions first.'
      ],
      builderAngle: [
        'For a builder, DeFi is useful because you can assemble products from shared infrastructure instead of rebuilding everything from zero.',
        'For a user-facing team, the hard part is not plugging into one contract. The hard part is handling approvals, pricing, slippage, liquidation risk, degraded modes, and trust in a way that normal users can survive.',
        'For a partner engineer, the real job is translating protocol mechanics into product decisions: what must be simulated, what must be shown in the UI, what can fail, and what should happen when offchain systems are stale.',
        'That includes knowing the difference between AMM routing risk, borrowing risk, derivatives risk, bridge risk, governance risk, and plain old smart-contract risk. They are not all the same problem.'
      ],
      interview: {
        sayIt: 'DeFi is open financial infrastructure built from smart contracts, wallets, tokens, shared liquidity, and transparent execution. The upside is composability. The downside is that products inherit more responsibility around custody, pricing, liquidity, liquidations, MEV, and user risk.',
        strong: 'A senior DeFi answer is not just “finance onchain.” I would explain the main primitives and product categories: AMMs, lending, borrowing, stablecoins, derivatives, liquid staking, bridges, governance, and incentives. Then I would tie them to actual risks like oracle failure, liquidation, liquidity stress, impermanent loss, bridge assumptions, and MEV.',
        weak: 'DeFi is crypto apps where users keep control and earn yield.',
        pitfalls: [
          'Do not reduce DeFi to only yield farming or trading.',
          'Do not talk about composability like it is always good and never dangerous.',
          'Do not forget approvals, oracle dependence, and liquidity risk.',
          'Do not explain DeFi only from the user side if the role is builder-facing.'
        ]
      },
      interviewGuide: {
        coreQuestions: [
          {
            question: 'What do you know about DeFi?',
            strong: 'DeFi is open financial infrastructure built from smart contracts, wallets, tokens, and shared liquidity. At a high level I would break it into swaps via AMMs, lending and borrowing, stablecoins, derivatives, liquid staking, bridges, governance, and incentive systems. The upside is composability and transparent execution. The cost is more responsibility around pricing, liquidity, execution safety, MEV, and user risk.',
            weak: 'It is finance on the blockchain where people can trade and earn yield.'
          },
          {
            question: 'What are the most important DeFi concepts to understand before integrating a lending protocol?',
            strong: 'I would start with custody, approvals, contract execution, oracle pricing, collateralization, liquidation mechanics, liquidity availability, and degraded-mode behavior. I would also separate those from adjacent DeFi surfaces like AMMs, bridge flows, and incentive systems, because users often move between them in one journey and the risks stack. If you miss any one of those, the integration can look fine in a demo and still fail in production.',
            weak: 'Mainly tokens, wallets, and APY.'
          }
        ],
        positioning: [
          'Answer DeFi questions like an operator, not a tourist.',
          'Connect each concept to a product consequence: approvals affect trust, oracles affect pricing, liquidity affects withdrawals, liquidations affect user safety.',
          'Show that you understand both the upside and the failure modes.'
        ],
        mistakes: [
          'Using the word DeFi as shorthand for speculation instead of infrastructure.',
          'Naming concepts without explaining why they matter in a product.',
          'Ignoring operational issues like stale data, execution reverts, or liquidity exhaustion.',
          'Talking like every user is sophisticated and every UI can be minimal.'
        ],
        tactical: [
          'If asked broad DeFi questions, structure the answer: primitives first, then behavior, then risk.',
          'Use one or two concrete examples instead of listing ten buzzwords.',
          'If relevant, mention AMMs, derivatives, bridges, or governance explicitly so the answer sounds complete rather than narrow.',
          'If the role is partner-facing, always translate protocol mechanics into what a wallet, exchange, or protocol team would need to build or explain.'
        ],
        hiringSignals: [
          'The Glassdoor prompt “What do you know about DeFi?” is broad on purpose.',
          'A good answer shows range, but also structure and judgment.',
          'You do not need to name every protocol. You do need to sound like you understand how the system works.'
        ]
      }
    },
    {
      slug: 'amms-and-liquidity',
      category: 'DeFi Foundations',
      title: 'AMMs, Liquidity, and Impermanent Loss',
      deck: 'Know how swaps actually work, where LP yield comes from, and why liquidity can look safe until it is not.',
      quickLearningSeeds: ['amm', 'lp', 'slippage', 'arbitrage', 'impermanent loss'],
      memorize: [
        'AMMs price trades against liquidity pools instead of a traditional order book.',
        'LP returns come from trading fees, incentives, and asset exposure, not from “free yield.”',
        'Impermanent loss is the opportunity cost of providing two-sided liquidity when price moves against your hold strategy.'
      ],
      simple: [
        'An AMM lets users swap against a pool of tokens instead of matching buyers and sellers directly.',
        'Liquidity providers make those swaps possible, but they take inventory risk in exchange for fees and incentives.'
      ],
      deep: [
        'The basic AMM idea is simple: a pool holds assets and a pricing curve determines how the price moves as people trade against it. In practice, that means LPs are constantly selling the asset that is going up and buying the asset that is going down. That rebalancing is why LP exposure is not the same as just holding the tokens in a wallet.',
        'A senior explanation should also mention slippage, arbitrage, and capital efficiency. Traders care about execution quality. LPs care about fee income versus inventory damage. Protocol teams care about whether liquidity is deep, sticky, and useful under stress rather than only during quiet markets.'
      ],
      builderAngle: [
        'For a builder, AMMs are the default swap primitive, but routing quality, slippage handling, and price protection matter a lot.',
        'If a product depends on swapping into or out of collateral, vault assets, or bridge assets, AMM liquidity quality becomes part of the product risk.',
        'This is why partner teams need to reason about liquidity depth and not just token availability.'
      ],
      interview: {
        sayIt: 'AMMs are swap engines built around pooled liquidity and pricing curves. They are great for permissionless trading, but LPs are taking inventory risk and users still face slippage, routing, and execution-quality issues.',
        strong: 'A good AMM answer covers the pool model, fee income, arbitrage, slippage, and impermanent loss. I would also tie it back to product design: if your app depends on swapping collateral or vault assets, AMM liquidity is not just a trading concern, it is part of your protocol and UX risk.',
        weak: 'AMMs are where people trade tokens and LPs earn fees.',
        pitfalls: [
          'Do not talk about LP yield without talking about inventory risk.',
          'Do not explain impermanent loss as a bug.',
          'Do not forget slippage and routing quality.'
        ]
      },
      interviewGuide: {
        coreQuestions: [
          {
            question: 'How do AMMs work?',
            strong: 'AMMs replace the order book with a liquidity pool and a pricing curve. Traders swap against the pool. The price moves along the curve as trades change the pool balance. LPs provide the liquidity and earn fees, but they are constantly rebalancing against directional moves, which is where impermanent loss comes from.',
            weak: 'AMMs are where people swap tokens and liquidity providers earn fees.'
          },
          {
            question: 'Why does AMM liquidity matter for a lending product?',
            strong: 'If your lending product depends on liquidations, the liquidator needs to swap the seized collateral into a stable or loan asset. That swap quality depends on AMM depth. Thin AMM liquidity on the collateral token directly increases liquidation slippage and can make liquidation unprofitable, which is a systemic risk for the lending market.',
            weak: 'AMMs are just for trading, lending is separate.'
          }
        ],
        positioning: [
          'Connect AMMs to execution quality and product risk, not just as abstract trading infrastructure.',
          'Explain impermanent loss as inventory risk from rebalancing, not as a bug or scam.',
          'Mention that liquidation flows in lending protocols often depend on AMM depth for the collateral token.'
        ],
        mistakes: [
          'Treating AMMs as only relevant for retail trading and missing their role in lending liquidations.',
          'Describing impermanent loss as money that disappears rather than opportunity cost from holding the pool instead of the raw assets.',
          'Ignoring slippage tolerance as a product safety parameter.'
        ],
        tactical: [
          'If asked about AMMs in a Morpho context, connect to collateral token liquidity and how thin markets affect liquidation risk.',
          'Use the phrase "inventory risk" for LPs — it sounds senior.',
          'Mention concentrated liquidity briefly if asked about capital efficiency to show you know Uniswap V3 style designs.'
        ],
        hiringSignals: [
          'AMM questions at Morpho likely come up as context for liquidation mechanics or integration design.',
          'Showing the connection between swap liquidity and lending solvency is a strong signal.'
        ]
      }
    },
    {
      slug: 'lending-and-borrowing',
      category: 'DeFi Foundations',
      title: 'Lending, Borrowing, Collateral, and Liquidations',
      deck: 'This is the part you absolutely need if you want to explain Morpho well.',
      quickLearningSeeds: ['collateral', 'ltv', 'liquidation', 'utilization', 'interest rate model'],
      memorize: [
        'Onchain lending depends on collateral, available liquidity, pricing, and liquidation incentives.',
        'Borrowing power is constrained by collateral value and risk parameters, not user intention.',
        'Liquidation is a solvency mechanism, not a punishment feature.'
      ],
      simple: [
        'Lending protocols let users supply assets so other users can borrow against collateral.',
        'The core question is always the same: is there enough collateral, enough liquidity, and a good enough pricing system to keep the market solvent?'
      ],
      deep: [
        'A senior answer should cover the loop from supply to borrow to liquidation. Suppliers provide liquidity. Borrowers lock collateral and draw debt. Interest-rate models move borrowing costs as utilization changes. Oracles determine collateral value. Liquidations step in when the position no longer satisfies the protocol’s safety thresholds.',
        'The important product point is that users experience this as “my borrow balance,” “my health factor,” or “my liquidation price,” but the backend reality is live market state. Debt accrues. Oracle values move. Liquidity changes. That is why borrowing UIs must show safety buffers and not pretend risk is static.'
      ],
      builderAngle: [
        'For a builder, lending integrations need more than deposit and borrow buttons. They need risk display, liquidation warnings, debt accrual awareness, and liquidity visibility.',
        'For a partner engineer, this is where dashboards go wrong most often: stale debt, bad decimal handling, or weak oracle assumptions.',
        'If you cannot explain liquidation clearly, you are not ready to explain a lending product on a real call.'
      ],
      interview: {
        sayIt: 'Lending and borrowing in DeFi come down to collateral, liquidity, pricing, and liquidation mechanics. If any of those pieces is weak, the user experience and the market can both break.',
        strong: 'I would explain the full mechanism: suppliers add liquidity, borrowers draw against collateral, IRMs react to utilization, oracles price collateral, and liquidations enforce solvency when the safety threshold is crossed. Then I would connect that to the UI layer, because that is where partner products usually fail.',
        weak: 'Users deposit, borrow, and get liquidated if they borrow too much.',
        pitfalls: [
          'Do not skip oracles.',
          'Do not treat liquidation like an edge case.',
          'Do not assume debt and collateral values are static between refreshes.'
        ]
      },
      interviewGuide: {
        coreQuestions: [
          {
            question: 'How does onchain lending work?',
            strong: 'Suppliers deposit assets that borrowers can draw against. Borrowers provide collateral, and the protocol uses an oracle to price it. An interest rate model adjusts borrowing cost based on utilization. When a borrower\'s collateral value relative to debt drops below the protocol\'s threshold, liquidators can close the position. The key product detail is that this is all live state: debt accrues, oracle prices move, and health can change between UI refreshes.',
            weak: 'Lenders put in money, borrowers take it out and pay interest.'
          },
          {
            question: 'What is a liquidation and when does it happen?',
            strong: 'Liquidation is the solvency enforcement mechanism. When a borrower\'s Health Factor drops to or below 1, meaning their collateral value relative to the LLTV threshold is no longer sufficient to cover their debt, permissionless external actors can repay their debt in exchange for a portion of the collateral at a discounted rate. This incentivizes rapid action before the loan becomes undercollateralized.',
            weak: 'Liquidation happens when prices drop too far and your funds get taken.'
          },
          {
            question: 'Why do lending products need live oracle pricing?',
            strong: 'Collateral value is not static. If a token price drops, a position that looked safe at borrow time can become undercollateralized. The oracle feeds current price to the protocol so health factor computation and liquidation eligibility are based on current market reality, not the price at deposit time.',
            weak: 'Oracles tell the protocol what tokens are worth.'
          }
        ],
        positioning: [
          'Frame lending as a loop: supply → borrow against collateral → IRM → oracle pricing → liquidation enforcement.',
          'Connect each layer to a product risk that a partner engineer would need to handle.',
          'Always mention that debt accrues continuously, which changes health factor even with flat prices.'
        ],
        mistakes: [
          'Explaining lending without mentioning oracles or their failure modes.',
          'Treating liquidation as an edge case rather than a core protocol mechanism.',
          'Forgetting that utilization affects borrow APY dynamically through the IRM.',
          'Describing collateral and debt as static between refreshes.'
        ],
        tactical: [
          'For Morpho specifically, lending mechanics map directly to isolated Blue markets.',
          'When asked about Morpho\'s lending model, use the same loop but add "isolated per market" as the key differentiator.',
          'Show awareness that dashboards must handle live state: health factor polling, debt accrual display, and liquidation price estimation.'
        ],
        hiringSignals: [
          'Understanding the supply → borrow → IRM → oracle → liquidation loop is foundational for this role.',
          'Connecting lending mechanics to product and UX responsibility is what separates a senior answer from a basic one.'
        ]
      }
    },
    {
      slug: 'stablecoins',
      category: 'DeFi Foundations',
      title: 'Stablecoins and What Actually Makes Them Stable',
      deck: 'You need to know the difference between “priced at one dollar” and “safe under stress.”',
      quickLearningSeeds: ['fiat-backed', 'crypto-backed', 'redemption', 'peg risk', 'depeg'],
      memorize: [
        'Stablecoins are not one thing; stability depends on collateral model, redemption design, and issuer assumptions.',
        'A stablecoin can be liquid in good times and still fail under redemption or liquidity stress.',
        'For DeFi integrations, stablecoin quality is part of market risk, not just token selection.'
      ],
      simple: [
        'A stablecoin is meant to track a reference value, usually a fiat currency.',
        'What matters is how it maintains that peg: reserves, collateral, redemption mechanics, and market confidence.'
      ],
      deep: [
        'There is a big difference between fiat-backed, crypto-backed, and more reflexive stablecoin designs. Fiat-backed coins depend heavily on issuer quality, reserve management, banking access, and redemption trust. Crypto-backed coins depend on overcollateralization, liquidation mechanics, and market behavior. In both cases, the token can look “stable” most days and still become fragile when redemption pressure or market stress hits.',
        'For a builder, stablecoin choice is not just a UX decision. It changes oracle risk, collateral behavior, liquidity profile, and sometimes legal or operational assumptions. That is why a serious answer talks about peg mechanics, not just ticker symbols.'
      ],
      builderAngle: [
        'A protocol using stablecoins in lending, vaults, or treasury products needs to ask what backs the coin and how it behaves under stress.',
        'If the product treats all stablecoins as interchangeable, that is usually a sign the team is not thinking deeply enough.',
        'Stablecoin quality affects liquidity, collateral safety, and user trust all at once.'
      ],
      interview: {
        sayIt: 'Stablecoins look simple on the surface, but the real question is what keeps the peg intact under stress. Reserve quality, collateral design, redemption mechanics, and liquidity all matter.',
        strong: 'I would separate fiat-backed, crypto-backed, and more reflexive designs. Then I would explain that for a DeFi product, stablecoin choice affects oracle assumptions, collateral behavior, redemption trust, and liquidity under pressure. That is why “it is a stablecoin” is never the full answer.',
        weak: 'Stablecoins are tokens worth one dollar.',
        pitfalls: [
          'Do not treat all stablecoins as equivalent.',
          'Do not ignore redemption mechanics.',
          'Do not confuse market price stability with system resilience.'
        ]
      },
      interviewGuide: {
        coreQuestions: [
          {
            question: 'What makes a stablecoin actually stable?',
            strong: 'Stability depends on the mechanism, not just the peg claim. Fiat-backed stablecoins depend on reserve quality, banking access, and redemption trust. Crypto-backed ones depend on overcollateralization and liquidation mechanics. Both can look stable in normal conditions and still fail under redemption pressure or market stress. For a lending product, stablecoin choice affects oracle assumptions, collateral safety, and liquidity under pressure.',
            weak: 'Stablecoins are tokens worth one dollar.'
          },
          {
            question: 'Why does stablecoin choice matter when designing a Morpho market?',
            strong: 'Stablecoin quality affects every layer of the market. Oracle feeds for a stablecoin can depeg temporarily, changing collateral values mid-liquidation. Redemption risk in the stablecoin creates correlated liquidity events. If USDC is used as the loan asset in a Morpho market and banking access is disrupted, borrow demand and supply behavior both change. The safer answer for a partner is to use battle-tested stablecoins and oracle paths with proven depeg resilience.',
            weak: 'Just use USDC; it is safe.'
          }
        ],
        positioning: [
          'Separate stability claim from stability mechanism: how does the peg hold under redemption or liquidity stress?',
          'Connect stablecoin type to oracle risk: peg deviations affect collateral value calculations.',
          'Show you understand that not all stablecoins behave the same under DeFi market stress.'
        ],
        mistakes: [
          'Treating all stablecoins as interchangeable in lending market design.',
          'Ignoring the connection between stablecoin reserve quality and oracle reliability.',
          'Describing stability only in good-weather conditions without mentioning stress scenarios.'
        ],
        tactical: [
          'When asked about stablecoin risk in a Morpho context, frame it as oracle + liquidity + redemption risk.',
          'USDC, USDT, and DAI each carry different assumptions. Know the difference at a high level.',
          'For a market using a stablecoin as collateral, always ask: “what happens to the oracle if it briefly depegs?”'
        ],
        hiringSignals: [
          'Connecting stablecoin choice to oracle and market design risk shows product maturity.',
          'Interviewers want to know you think about correlated risk, not just token names.'
        ]
      }
    },
    {
      slug: 'derivatives-and-perps',
      category: 'DeFi Foundations',
      title: 'Derivatives, Perps, Funding, and Leverage',
      deck: 'Know the moving parts before you talk about leveraged DeFi products like they are simple.',
      quickLearningSeeds: ['perps', 'funding rate', 'mark price', 'leverage', 'liquidation engine'],
      memorize: [
        'Derivatives add leverage and synthetic exposure, which means price, margin, and liquidation logic matter even more.',
        'Perpetuals use funding to anchor long and short positioning around the reference market.',
        'Mark price and liquidation engine design matter as much as headline liquidity.'
      ],
      simple: [
        'Derivatives let users gain exposure without holding the underlying asset directly.',
        'Perps are the common example in crypto: no expiry, but funding keeps the market from drifting too far from spot.'
      ],
      deep: [
        'A senior explanation of perps should mention leverage, maintenance margin, mark price, funding, and liquidation flow. Funding is not just a fee. It is a balancing mechanism between longs and shorts. Mark price is not just an arbitrary chart number. It exists so liquidations are not triggered from pure short-term noise or manipulation in one venue.',
        'From a product angle, derivatives are where teams often underestimate liquidation and execution complexity. The UI might look like “open a long,” but the system underneath depends on margin quality, reference pricing, liquidation engine behavior, and extreme-market handling.'
      ],
      builderAngle: [
        'If a product integrates leverage, it also inherits liquidation, monitoring, and risk communication problems.',
        'A senior builder should ask how funding is computed, how mark price is derived, and what the liquidation engine does under volatility.',
        'These are not details. They define whether the product behaves credibly under stress.'
      ],
      interview: {
        sayIt: 'Derivatives in DeFi are really about margin systems, funding, mark pricing, and liquidation logic. The leverage is the easy part to market. The hard part is making the risk engine hold up when volatility hits.',
        strong: 'I would explain perps through leverage, margin, mark price, funding, and liquidations. Then I would make the product point: if you are building around derivatives, execution quality and risk controls are not side details, they are the product.',
        weak: 'Derivatives let users trade with leverage.',
        pitfalls: [
          'Do not mention leverage without margin and liquidation.',
          'Do not ignore funding and mark price.',
          'Do not talk like volatility is only a trading issue instead of a product-risk issue.'
        ]
      },
      interviewGuide: {
        coreQuestions: [
          {
            question: 'How do perpetual futures work and why does funding matter?',
            strong: 'Perps are derivatives with no expiry. They track a reference price using a funding mechanism: if longs dominate, they pay funding to shorts and vice versa, which keeps the mark price anchored to spot. Liquidation engines use mark price rather than last trade price to prevent manipulation-triggered liquidations. For builders, this matters because products depending on leverage need to expose margin, funding, and mark price risk clearly — not just headline leverage.',
            weak: 'Perps let you trade with leverage and pay fees.'
          },
          {
            question: 'How does derivatives exposure relate to lending products like Morpho?',
            strong: 'Directly: leveraged lending through Morpho Bundler3 creates looping exposure similar to a leveraged position. The user borrows, swaps collateral, re-deposits, and repeats — creating a synthetic lever. Unlike perps, the cost is the borrow APY instead of a funding rate, and there is no liquidation engine; it is just standard Morpho HF liquidation. That means the product team needs to communicate liquidation price and health factor the same way a perp UI communicates margin and mark price.',
            weak: 'Derivatives are just for trading, not relevant to lending.'
          }
        ],
        positioning: [
          'Frame leverage through the lens of margin, risk, and liquidation — not just return potential.',
          'Connect derivatives concepts to Morpho leverage loops when the context is partner-facing.',
          'Show you understand funding, mark price, and liquidation engine as separate concerns.'
        ],
        mistakes: [
          'Treating leverage as just a multiplier without discussing liquidation and margin.',
          'Ignoring that Morpho leverage loops share many properties with leveraged derivatives.',
          'Missing the product design point: leverage products need more risk communication, not less.'
        ],
        tactical: [
          'When asked about leverage in a Morpho context, explain the Bundler3 leverage loop: borrow → swap → resupply.',
          'Show the HF consequence: with 3x leverage at LLTV 86%, HF ≈ 1.43 — show the number.',
          'Mark price risk in perps ↔ oracle price risk in Morpho HF: same concept, different labels.'
        ],
        hiringSignals: [
          'Connecting derivatives concepts to Morpho leverage flows shows depth.',
          'Being able to map perp mechanics (funding, mark price, liquidation engine) to lending equivalents is a strong signal.'
        ]
      }
    },
    {
      slug: 'bridges-and-crosschain',
      category: 'DeFi Foundations',
      title: 'Bridges, Cross-Chain Risk, and Asset Portability',
      deck: 'Moving value between chains is useful. It is also one of the easiest ways to hide serious risk.',
      quickLearningSeeds: ['bridge', 'wrapped asset', 'message passing', 'cross-chain risk', 'liquidity fragmentation'],
      memorize: [
        'A bridge is not just transport; it is a trust and settlement model.',
        'Cross-chain assets inherit assumptions from the bridge, not just the destination chain.',
        'Bridges can create liquidity, custody, and verification risk that is easy to ignore in a clean UI.'
      ],
      simple: [
        'Bridges let users move value across chains, usually by locking, minting, messaging, or liquidity routing.',
        'The hard question is not “did the token arrive?” It is “what assumptions made that transfer valid?”'
      ],
      deep: [
        'A senior answer should separate wrapped-asset bridges, liquidity-network bridges, and message-passing systems. They solve similar user problems but rely on different trust, liquidity, and settlement assumptions. The destination token may look normal in the wallet while still carrying extra bridge-specific risk.',
        'Cross-chain products also create monitoring problems. Liquidity can fragment. Finality assumptions can differ. Message relays can fail. Wrapped assets can decouple from the original asset. So a serious builder does not treat bridge usage as just another normal token transfer.'
      ],
      builderAngle: [
        'If a product relies on bridged collateral or bridged stablecoins, bridge quality is part of protocol risk.',
        'Cross-chain UX should make network, asset, and bridge assumptions visible enough that users are not blind.',
        'A partner engineer should know when the safer answer is “support fewer bridge routes, but do them well.”'
      ],
      interview: {
        sayIt: 'Bridges solve asset portability, but they also introduce settlement and trust assumptions that the user does not always see. A cross-chain product is only as clean as the bridge model underneath it.',
        strong: 'I would explain that bridges are not one category. Some lock and mint, some use liquidity networks, some depend on message verification. For builders, that changes custody assumptions, liquidity behavior, monitoring, and the real risk of the asset once it lands.',
        weak: 'Bridges move assets between chains.',
        pitfalls: [
          'Do not treat bridged assets as equivalent to native assets.',
          'Do not ignore settlement assumptions.',
          'Do not discuss cross-chain UX without discussing risk.'
        ]
      },
      interviewGuide: {
        coreQuestions: [
          {
            question: 'What are the trust assumptions in a typical bridge?',
            strong: 'It depends on the bridge type. Lock-and-mint bridges rely on custodians or multisigs holding the locked assets. Liquidity network bridges rely on LP capital availability on both sides. Message-passing bridges rely on validator sets or ZK proof systems for cross-chain communication. Each model has different failure modes: custodian compromise, LP exhaustion, or validator collusion. For a DeFi product using bridged assets, the bridge trust model is part of the product\'s risk surface, not just an implementation detail.',
            weak: 'Bridges move assets between chains.'
          },
          {
            question: 'If a partner wants to use a bridged collateral token in a Morpho market, what should you check?',
            strong: 'Four things: bridge trust model (who holds the locked assets), oracle support (can MorphoChainlinkOracleV2 support the price path for this bridged token), liquidity depth (thin bridged assets create liquidation slippage risk), and depeg risk (if the bridge is compromised, the bridged token can trade significantly below the underlying). I would also check if the bridge has a canonical vs unofficial version distinction, since liquidity can fragment across multiple bridges for the same underlying asset.',
            weak: 'Just make sure the token is listed somewhere.'
          }
        ],
        positioning: [
          'Frame bridge risk as custody + liquidity + settlement trust, not just "smart contract risk."',
          'Connect bridge assumptions to Morpho oracle and liquidation design.',
          'Show you understand that bridged ≠ native — the trust model is different.'
        ],
        mistakes: [
          'Treating bridged tokens as equivalent to native tokens in risk modeling.',
          'Ignoring oracle path support for bridged assets.',
          'Missing that liquidation bots need AMM liquidity for the bridged collateral, which may be thin.'
        ],
        tactical: [
          'When a partner proposes using a bridged asset as Morpho collateral, ask about the bridge model and oracle path first.',
          'Bridged assets with thin liquidity create liquidation risk even if the LLTV is conservative.',
          'Know that the canonical Morpho oracle (MorphoChainlinkOracleV2) may not support all bridged token price feeds.'
        ],
        hiringSignals: [
          'Connecting bridge risk to Morpho market design (oracle, liquidation, liquidity) signals real product thinking.',
          'Partners will sometimes propose exotic collateral. Knowing the right questions to ask is the job.'
        ]
      }
    },
    {
      slug: 'mev-and-execution',
      category: 'DeFi Foundations',
      title: 'MEV, Execution Quality, and Why Transactions Are Not Neutral',
      deck: 'Users think they clicked a button. You need to understand what really happened in the block.',
      quickLearningSeeds: ['mev', 'sandwich', 'ordering', 'slippage', 'execution quality'],
      memorize: [
        'MEV is value extracted from transaction ordering, inclusion, and execution path.',
        'Execution quality in DeFi is not neutral; ordering can change user outcomes.',
        'A senior DeFi answer should connect MEV to slippage, liquidations, arbitrage, and user trust.'
      ],
      simple: [
        'MEV is the value people capture by controlling or exploiting how transactions get ordered and included onchain.',
        'That can affect swaps, liquidations, arbitrage, lending flows, and the prices users actually get.'
      ],
      deep: [
        'MEV is not just sandwiches on retail swaps, even though that is the example most people know. It shows up wherever ordering matters: arbitrage, liquidations, backruns, reordering around large trades, and sometimes around lending flows. If the execution path changes, the user outcome changes.',
        'For a builder, this matters because a clean UI can still route users into poor execution. Slippage settings, routing choices, private orderflow, liquidation handling, and transaction batching all change whether the user is getting a fair result or just a fragile illusion of one.'
      ],
      builderAngle: [
        'MEV should influence routing, slippage defaults, simulation, and transaction design.',
        'A product team that ignores execution quality is often shipping hidden losses into the user journey.',
        'This is one reason batching and atomic workflows matter in DeFi product design.'
      ],
      interview: {
        sayIt: 'MEV is the value extracted from transaction ordering and execution path. In practice, it means user outcomes can change based on how the transaction lands, not just what the button said before the user clicked it.',
        strong: 'I would explain MEV as an execution-quality problem, not just a meme term. It affects swaps, liquidations, and price outcomes. For builders, that means routing, slippage protection, batching, and transaction design are all part of user safety.',
        weak: 'MEV is when bots front-run people.',
        pitfalls: [
          'Do not reduce MEV to one attack pattern.',
          'Do not ignore lending and liquidation contexts.',
          'Do not discuss UX without discussing execution quality.'
        ]
      },
      interviewGuide: {
        coreQuestions: [
          {
            question: 'How does MEV affect a lending product like Morpho?',
            strong: 'MEV affects Morpho in two main ways. First, liquidations: profitable liquidation opportunities are competitive, and searchers may extract value from the timing and ordering of liquidation transactions. This is generally positive for solvency (it incentivizes fast liquidation) but means the liquidation incentive design matters for real-world coverage. Second, leverage loop execution: when a user creates a leverage position via Bundler3, the atomic bundle includes a swap step that is vulnerable to sandwich attacks if slippage is not set properly. Both are product design concerns, not just theoretical issues.',
            weak: 'MEV is when bots front-run transactions and it is mostly a DEX problem.'
          },
          {
            question: 'What slippage protection should be present in a Bundler3 leverage loop?',
            strong: 'The swap step inside the bundle needs an explicit minimum output parameter. Without it, a sandwich bot can degrade the swap output, making the bundle execute at a worse-than-expected price and potentially creating a leverage position with a lower HF than the user intended. The safe pattern is to simulate the expected output offchain, apply a tolerance (e.g. 0.5–1%), and pass the minimum acceptable output into the swap adapter call inside the bundle. If the swap lands below that floor, the entire bundle reverts atomically.',
            weak: 'Bundler3 is atomic so it is safe from MEV.'
          }
        ],
        positioning: [
          'Connect MEV to specific Morpho flows: liquidation incentives and leverage loop slippage.',
          'Atomicity in Bundler3 helps but does not protect against slippage in the embedded swap.',
          'Show awareness that liquidations are a competition — MEV-resistant design matters for real-world coverage.'
        ],
        mistakes: [
          'Treating MEV as only relevant to DEX trading, not to lending and leverage.',
          'Assuming Bundler3 atomicity makes all execution safe without slippage protection.',
          'Ignoring that sandwich attacks on the swap step inside a leverage bundle are a real product risk.'
        ],
        tactical: [
          'When scoping a leverage product, always ask: "what slippage protection is on the swap step?"',
          'Liquidation coverage depends on economic incentives — LIF design and collateral AMM liquidity depth matter.',
          'Private orderflow or MEV protection (e.g. Flashbots Protect) can be worth recommending for large leverage positions.'
        ],
        hiringSignals: [
          'Connecting MEV to specific Morpho execution flows (not just generic DEX sandwiches) is a strong signal.',
          'Showing you think about execution quality as a product concern, not just an infrastructure one, is what the role needs.'
        ]
      }
    },
    {
      slug: 'governance-and-incentives',
      category: 'DeFi Foundations',
      title: 'Governance, Token Incentives, and Why Usage Can Be Fake',
      deck: 'This is where token mechanics, protocol politics, and real product quality start colliding.',
      quickLearningSeeds: ['governance', 'token incentives', 'emissions', 'delegation', 'mercenary liquidity'],
      memorize: [
        'Governance controls more than votes; it shapes parameters, incentives, listings, and protocol direction.',
        'Incentives can drive growth, but they can also create shallow, temporary usage.',
        'A senior answer distinguishes genuine product demand from emissions-driven activity.'
      ],
      simple: [
        'Governance is how protocols make decisions about parameters, upgrades, incentives, and direction.',
        'Token incentives can help bootstrap usage, but they can also attract capital that leaves the moment rewards dry up.'
      ],
      deep: [
        'A serious governance answer should mention forum discussion, delegated voting, parameter changes, and the practical difference between token ownership and real protocol influence. Governance is not only a philosophical layer. It decides risk settings, listings, emissions, and treasury choices that affect the product directly.',
        'The incentive side matters just as much. Emissions can create TVL and activity that looks impressive but is not durable. A senior operator learns to ask whether usage is sticky because the product is good or because the token program is temporarily paying people to show up.'
      ],
      builderAngle: [
        'For partner teams, governance matters because the protocol surface can change and incentives can distort user behavior.',
        'For product analysis, token incentives should be treated as one input, not proof of genuine market fit.',
        'A strong builder answer distinguishes core product value from temporary reward-fueled traction.'
      ],
      interview: {
        sayIt: 'Governance shapes protocol direction, parameters, and incentives. Token rewards can help bootstrap usage, but they can also fake product strength if the activity disappears when emissions end.',
        strong: 'I would separate governance mechanics from governance impact. Then I would separate real product demand from incentive-driven usage. That is the difference between looking at a protocol like an investor deck and looking at it like an operator.',
        weak: 'Governance is token holders voting, and incentives help growth.',
        pitfalls: [
          'Do not treat all TVL as equally meaningful.',
          'Do not confuse token voting with healthy protocol governance.',
          'Do not talk about incentives without asking whether the usage is durable.'
        ]
      },
      interviewGuide: {
        coreQuestions: [
          {
            question: 'How does Morpho governance work and what can it change?',
            strong: 'Morpho uses token-based governance for protocol-level decisions: fee settings, approved IRM and oracle registries, MORPHO token reward distributions, and broader protocol direction. Critically, Morpho Blue\'s core market logic is immutable — governance cannot change the rules of a market after creation. What governance can change is the approved component registry (which IRMs and oracles can be used), protocol fee recipients, and incentive programs. That distinction matters for partner diligence: the market they launch today will not have its parameters quietly changed by a governance vote.',
            weak: 'Token holders vote on changes to the protocol.'
          },
          {
            question: 'A partner asks: "How do we know Morpho governance won\'t change our market parameters?" Best answer:',
            strong: 'Morpho Blue markets are immutable after creation. The five parameters — loan token, collateral token, oracle, IRM, and LLTV — cannot be changed by governance, by Morpho Labs, or by anyone else. Governance operates at the protocol level, not the market level. The approved registry can change what new markets can use going forward, but existing markets are unaffected. That is a core design guarantee and is why the docs position Morpho as "trustless lending infrastructure."',
            weak: 'There is no way to guarantee governance won\'t change anything.'
          }
        ],
        positioning: [
          'Separate protocol-level governance (registries, fees, rewards) from market-level immutability.',
          'The immutability of individual markets is a feature, not a limitation — it is the key diligence answer.',
          'Show you understand MORPHO token distribution and Merkl as the current incentive delivery system.'
        ],
        mistakes: [
          'Implying governance can change market parameters after creation.',
          'Conflating protocol governance decisions with market-level risk parameter control.',
          'Treating incentive programs as permanent APY rather than discretionary reward programs.'
        ],
        tactical: [
          'For diligence calls: "The market parameters are immutable. Governance cannot change them after creation."',
          'For incentive questions: Morpho governance sets MORPHO token reward budgets; Merkl handles distribution.',
          'Know MIP 111: the migration of all reward programs from URD to Merkl in July 2025.'
        ],
        hiringSignals: [
          'Knowing the boundary between protocol governance and market immutability is a precise technical signal.',
          'Partners will ask this. The answer should be fast and confident.'
        ]
      }
    },
    {
      slug: 'what-is-morpho',
      category: 'Core Positioning',
      title: 'What Morpho Is',
      deck: 'Get the basic explanation right before you get lost in formulas, vault details, or integration edge cases.',
      quickLearningSeeds: ['permissionless', 'non-custodial', 'isolated markets', 'builders', 'vaults'],
      memorize: [
        'Morpho is a permissionless, non-custodial lending infrastructure layer.',
        'Morpho Blue is built around isolated markets, each defined by immutable market parameters.',
        'Morpho is not just a retail frontend; it is infrastructure that protocols, wallets, exchanges, and curators can build on.'
      ],
      simple: [
        'Morpho is onchain lending infrastructure. People can use it directly, but it is also something other products build on.',
        'The short version: it gives you lending markets and vaults that a wallet, exchange, treasury, or protocol can wrap in its own product.'
      ],
      deep: [
        'The key technical idea is Morpho Blue. It is an isolated-market lending primitive. Each market has its own loan asset, collateral asset, oracle, IRM, and LLTV. So risk sits inside that market instead of being mixed into one big pooled book.',
        'That matters because Morpho is built for direct use and for integrations. A builder can use markets directly, add vaults on top, or hide the whole thing behind a consumer or institutional product. They do not need to build a lending engine from scratch first.'
      ],
      builderAngle: [
        'A protocol uses Morpho when it wants lending rails without also signing up to build and maintain a full credit backend.',
        'It helps when the team wants to launch borrow or earn products faster, but still keep market design explicit instead of disappearing into one giant pooled setup.',
        'It is a strong fit when the builder wants custom markets, isolated new asset listings, or curated vault products on top of the lending layer.'
      ],
      interview: {
        sayIt: 'Morpho is permissionless, non-custodial lending infrastructure. The core piece is Morpho Blue, which uses isolated, immutable markets. That gives builders a way to launch lending or curated yield products without depending on one shared pooled risk surface.',
        strong: 'I would explain Morpho as infrastructure, not just an app. You get isolated markets for explicit risk design, vaults for curated allocation, and a backend other teams can wrap in wallets, exchanges, treasury tools, or new asset products.',
        weak: 'Morpho is a DeFi lending app with good yields.',
        pitfalls: [
          'Do not describe Morpho as only a frontend.',
          'Do not stop at “better yields” if the role is partner-facing.',
          'Do not confuse isolated markets with pooled liquidity systems.'
        ]
      },
      interviewGuide: {
        coreQuestions: [
          {
            question: 'What is Morpho?',
            strong: 'Morpho is permissionless, non-custodial lending infrastructure. The core primitive is Morpho Blue — isolated, immutable lending markets where each market is defined by five fixed parameters: loan asset, collateral asset, oracle, IRM, and LLTV. On top of Blue, vaults handle curated allocation and the risk management layer. Other products — wallets, exchanges, protocol treasuries — build on top of that without needing to build a lending system from scratch.',
            weak: 'Morpho is a DeFi lending protocol with good yields.'
          },
          {
            question: 'How is Morpho different from other lending protocols?',
            strong: 'The key design difference is isolated, immutable markets. Each market has its own dedicated risk surface. That means failures stay contained, new assets can get custom market design, and risk parameters do not shift through admin upgrades. Pooled protocols concentrate risk and liquidity across assets. Morpho keeps them separate by design. This makes Morpho stronger for custom product builds, new asset listings, and partner-specific configurations.',
            weak: 'Morpho has lower fees and better yields than competitors.'
          }
        ],
        positioning: [
          'Lead with “infrastructure” not “protocol” or “app.” The distinction matters for this role.',
          'The five market parameters are a concrete anchor: loan token, collateral token, oracle, IRM, LLTV. Use them.',
          'Frame Morpho as something builders use, not just something users experience.',
          'Vaults are the managed layer. Markets are the primitive layer. Know both and how they relate.'
        ],
        mistakes: [
          'Describing Morpho only as an end-user lending app.',
          'Using yield as the primary positioning point.',
          'Forgetting that immutability and isolation are deliberate design choices with specific trade-offs.',
          'Confusing Vault V2 curation with Morpho Blue market creation.'
        ],
        tactical: [
          'The one-sentence definition to memorize: “Morpho is permissionless, non-custodial lending infrastructure built around isolated, immutable markets.”',
          'After the one-liner, add the builder angle: “and other protocols build on top instead of building lending from scratch.”',
          'If asked to be more specific, name the two layers: Blue for the market primitive, Vaults for the curated allocation layer.',
          'Mention the canonical Blue address (0xBBBB...) if the conversation gets technical — it signals you know the protocol cold.'
        ],
        hiringSignals: [
          '”What is Morpho?” is almost certainly asked in every interview. The answer should be fast, clean, and builder-framed.',
          'Showing you understand the difference between the primitive layer and the product layer is a strong differentiator.'
        ]
      }
    },
    {
      slug: 'why-build-on-morpho',
      category: 'Builder Story',
      title: 'Why A Protocol Would Use Morpho',
      deck: 'Turn protocol mechanics into a real product decision.',
      quickLearningSeeds: ['custom market design', 'faster time to market', 'battle-tested contracts', 'composable backend'],
      memorize: [
        'Builders choose Morpho when they want lending or earn infrastructure without running their own full lending system.',
        'Morpho gives isolated market design, custom risk surfaces, and existing ecosystem tooling.',
        'The value is speed, composability, explicit risk design, and partner-friendly abstraction.'
      ],
      simple: [
        'A protocol uses Morpho when it wants lending or yield features without spending months building the whole stack itself.',
        'Morpho handles the lending backend. The partner still owns the frontend, the user relationship, and the product wrapper.'
      ],
      deep: [
        'The real value is not just that Morpho already does lending. It is that Morpho gives you a production lending substrate with isolated risk surfaces, existing demand, mature contract paths, and integration tooling.',
        'So a wallet, exchange, or treasury product can spend its time on UX, onboarding, approvals, monitoring, and distribution while Morpho handles the lending primitive underneath. That is the DeFi-mullet pattern in plain English: nice product in the front, DeFi rails in the back.'
      ],
      builderAngle: [
        'For a wallet: Morpho can power in-app earn or borrow flows without forcing users through raw DeFi UX.',
        'For an exchange or fintech: Morpho can sit behind an onchain earn product, while the partner owns onboarding, policy, and user trust.',
        'For a protocol listing a new asset: isolated markets let the team launch a new risk surface without contaminating unrelated pools.'
      ],
      interview: {
        sayIt: 'A protocol uses Morpho when it wants a lending backend without building and operating one from zero. The pitch is faster time to market, cleaner market-level risk design, and the freedom to wrap Morpho in the partner\'s own product experience.',
        strong: 'What makes Morpho useful is flexibility. A partner can use direct markets, curated vaults, or embedded earn and borrow flows. That matters when the real target is not a power user in raw DeFi, but a wallet customer, an exchange user, or an institution with process constraints.',
        weak: 'Protocols use Morpho because the APY is higher.',
        pitfalls: [
          'Do not position yield as the only reason to integrate.',
          'Do not ignore operational benefits like docs, SDKs, API, and existing liquidity/borrow demand.',
          'Do not sound tribal by saying Morpho is always better in every scenario.'
        ]
      },
      interviewGuide: {
        coreQuestions: [
          {
            question: 'Why would a protocol build on Morpho instead of building their own lending system?',
            strong: 'Three main reasons: speed, design flexibility, and existing infrastructure. Building a production lending system from scratch is months of work and ongoing audit overhead. Morpho gives a battle-tested primitive immediately. The design flexibility means the team can define custom markets, choose their own risk parameters, and wrap Morpho in their own product experience. The existing infrastructure means SDKs, APIs, documentation, and existing liquidity demand are already there.',
            weak: 'Because Morpho is popular and has liquidity.'
          },
          {
            question: 'What types of teams would benefit most from building on Morpho?',
            strong: 'Four categories: wallets that want in-app earn or borrow without building DeFi infrastructure. Exchanges and fintechs that want onchain yield products while owning the consumer relationship. Protocols listing new assets that need isolated markets without contaminating shared pools. DAOs and treasury teams that want structured yield strategies without direct market management. Each category has a different reason to integrate, but all benefit from not reinventing the lending layer.',
            weak: 'Teams that want better APY than they could get elsewhere.'
          }
        ],
        positioning: [
          'The core pitch is infrastructure speed, custom market design, and product flexibility — not just yield.',
          'Always translate Morpho value into a specific builder outcome: faster launch, cleaner risk surface, simpler embedded UX.',
          'The three integration patterns to know: direct Blue markets, curated vault embedding, and full product wrapper.'
        ],
        mistakes: [
          'Centering the answer on yield numbers instead of product and operational benefits.',
          'Talking only about DeFi power users instead of the wallet, exchange, and institutional partner use cases.',
          'Implying Morpho is always the right answer without connecting to the specific use case.',
          'Missing the operational benefits: docs, SDKs, audited contracts, existing liquidity demand.'
        ],
        tactical: [
          'When asked "why Morpho?", use the three-point structure: speed, custom market design, product flexibility.',
          'Then name one or two concrete integration types: "for a wallet, they embed a vault earn flow; for a new asset listing, they get an isolated market without shared pool risk."',
          'The phrase "DeFi-mullet" is memorable: nice product in the front, Morpho rails in the back.',
          'Avoid sounding like a sales pitch. Show you understand trade-offs.'
        ],
        hiringSignals: [
          '"Why would someone build on Morpho?" is likely a central interview question.',
          'Showing you can name specific use cases for specific partner types is much stronger than a generic benefits list.'
        ]
      }
    },
    {
      slug: 'morpho-vaults-and-apy',
      category: 'Product Mechanics',
      title: 'Morpho Vaults and How APY Is Produced',
      deck: 'Explain vaults like a product person and a protocol person at the same time.',
      quickLearningSeeds: ['curated yield', 'vault shares', 'borrow demand', 'curator', 'base apy'],
      memorize: [
        'Vaults are curated allocation layers on top of underlying Morpho markets or venues.',
        'Users deposit one asset and receive vault shares representing their claim on the strategy.',
        'Yield comes from borrower demand in the underlying lending markets, not from a guaranteed fixed coupon.'
      ],
      simple: [
        'Morpho Vaults let a user deposit into a managed strategy instead of choosing lending markets one by one.',
        'The curator handles allocation. The user holds vault shares and gets exposure to the strategy through that position.'
      ],
      deep: [
        'The clean product explanation is that vaults separate user intent from market management. A user wants “earn on USDC” or “give me a conservative stablecoin strategy.” They do not want to rebalance across isolated markets by hand. Vaults package that allocation layer for them.',
        'APY comes from borrower demand in the underlying lending markets. The user is not getting a guaranteed fixed return from Morpho. They are getting the yield generated when the vault routes capital into live credit demand under a chosen risk policy. That is also why a partner UI should separate base APY from rewards APR and be honest that withdrawals still depend on available liquidity.'
      ],
      builderAngle: [
        'A protocol can use vaults to ship curated yield strategies without forcing each end user to become a market analyst.',
        'This solves distribution and UX problems: the product can feel like “earn on idle balances” while the real market complexity stays below the surface.',
        'This is especially useful for wallets, exchanges, DAOs, and institutions that want a guided yield surface rather than raw per-market decisions.'
      ],
      interview: {
        sayIt: 'Morpho Vaults are curated allocation products on top of Morpho\'s lending layer. They let a protocol offer managed yield strategies while the end user holds one simpler vault position instead of juggling market-by-market exposure.',
        strong: 'The clean explanation for APY is simple: borrowers pay interest in the underlying markets, and the vault packages how capital gets allocated to capture that demand. So the value is not "magic yield." It is managed access to real onchain lending demand with a better product wrapper.',
        weak: 'Vaults are where Morpho stores assets so users get APY.',
        pitfalls: [
          'Do not imply APY is guaranteed.',
          'Do not flatten base lending yield and incentive rewards into one unexplained number.',
          'Do not describe vaults as pure custody containers.'
        ]
      },
      interviewGuide: {
        coreQuestions: [
          {
            question: 'How do Morpho Vaults work and where does the APY come from?',
            strong: 'Vaults are curated allocation layers on top of Morpho Blue markets. A user deposits a single asset and receives vault shares. The curator routes that capital across underlying lending markets based on their strategy. The yield comes from borrowers paying interest in those markets. There is no guaranteed fixed coupon. The displayed APY reflects live borrow demand, utilization, and any reward programs on top. So a UI should always show the composition: base yield from borrowers, plus rewards if applicable.',
            weak: 'Vaults are where users earn APY from Morpho.'
          },
          {
            question: 'How would you explain vault yield to a non-technical stakeholder?',
            strong: 'Think of the vault like a managed fund that lends into credit markets. Borrowers pay interest to use the capital, and that interest flows back to vault depositors after the curator\'s fee. The rate is not fixed; it moves with how much of the vault\'s capital is actively borrowed at any time. If reward programs are active, there can be bonus yield on top — but the two are separate and should be shown that way.',
            weak: 'The vault earns yield from Morpho. The APY is shown on the dashboard.'
          }
        ],
        positioning: [
          'Always separate: base APY from borrower demand vs. reward APR from incentive programs.',
          'Vaults solve the "which market?" problem for users who do not want to manage allocation themselves.',
          'The curator is responsible for allocation decisions. That is a real responsibility, not a black box.'
        ],
        mistakes: [
          'Implying APY is fixed or guaranteed.',
          'Presenting combined yield as a single number without explaining its components.',
          'Describing the curator as a passive role — they are actively managing strategy and risk.',
          'Ignoring that vault withdrawals depend on available liquidity in the underlying markets.'
        ],
        tactical: [
          'The three-layer APY breakdown: base lending yield + third-party reward APR + MORPHO rewards APR.',
          'For product design: always show the breakdown, not just the combined number.',
          'When asked "how does Vault V2 differ from V1?", lead with the roles model, timelocks, and the adapter cap system — those are the V2-specific stories.'
        ],
        hiringSignals: [
          'Vault yield composition is a high-signal area because it reveals whether you can translate protocol mechanics into product decisions.',
          'Knowing that APY is not a static number, and that vault withdrawals have liquidity dependencies, separates a senior answer from a surface-level one.'
        ]
      }
    },
    {
      slug: 'morpho-vs-aave-compound',
      category: 'Comparisons',
      title: 'Morpho vs Aave vs Compound',
      deck: 'Compare Morpho honestly. No fanboy answers.',
      quickLearningSeeds: ['pooled lending', 'isolated markets', 'standardization', 'customization', 'tradeoffs'],
      memorize: [
        'Aave and Compound are usually explained through pooled or more standardized market structures.',
        'Morpho Blue is stronger when custom market design and explicit isolated risk surfaces matter.',
        'The tradeoff is that more flexibility and isolation can also mean more responsibility for curation, integration design, and risk communication.'
      ],
      simple: [
        'Compared with Aave or Compound, Morpho is more infrastructure-like and more flexible at the market-design layer.',
        'The big difference is isolated, immutable markets. Builders can define risk more explicitly instead of pushing everything into one broad pooled structure.'
      ],
      deep: [
        'The serious answer is not “Morpho is better.” The serious answer is that the design target is different. Aave and Compound are strong when standardization, broad liquidity concentration, and familiar pooled experiences matter most. Morpho is stronger when the builder wants isolated risk surfaces, custom market formation, and vault-based curation on top of the lending primitive.',
        'That means Morpho often makes more sense for new assets, embedded earn products, RWA integrations, and partner-specific product shapes. But pooled systems can still be the right answer when the partner values a more standardized market surface and fewer custom configurations.'
      ],
      builderAngle: [
        'Choose Morpho when the integration needs custom markets, isolated new assets, curated vaults, or protocol-owned product wrappers.',
        'Choose a more pooled design when the partner values standardization over custom risk surfaces.',
        'The real partner-facing skill is explaining why Morpho fits a use case, not pretending alternatives are irrational.'
      ],
      interview: {
        sayIt: 'Morpho is strongest when the partner needs isolated market design, product flexibility, or curated vault layers. Aave or Compound can still make sense when the priority is a more standardized pooled structure.',
        strong: 'I would frame the difference around design goals. Pooled protocols concentrate risk and liquidity in a more standardized surface. Morpho gives builders more direct control over market-level configuration and vault packaging. That matters when the partner is launching something specific, not just plugging into a generic pool.',
        weak: 'Morpho beats Aave because it is newer and has better APY.',
        pitfalls: [
          'Do not attack incumbents instead of answering the use-case question.',
          'Do not ignore the benefits of standardization.',
          'Do not compare only consumer UX; compare architecture and builder fit.'
        ]
      },
      interviewGuide: {
        coreQuestions: [
          {
            question: 'How does Morpho compare to Aave or Compound?',
            strong: 'Aave and Compound are strong when standardization and concentrated liquidity in a well-known pooled surface matter. Morpho is stronger when the builder needs custom market design, isolated risk surfaces, or a curated vault layer for a specific product. The design target is different. Neither is universally better; the right answer depends on what the partner actually needs to build.',
            weak: 'Morpho is better because it has isolated markets and lower fees.'
          },
          {
            question: 'Why would a builder choose a pooled protocol over Morpho?',
            strong: 'Pooled protocols offer familiar UX, concentrated liquidity on major assets, and a more standardized integration path. If the partner is not launching a custom asset, does not need custom risk parameters, and values a well-known integration surface over flexibility, a pooled protocol can be the simpler answer. The honest version of the Morpho pitch is that it is the right choice when product flexibility and explicit risk design matter more than standardization.',
            weak: 'They would not; Morpho is always the better choice.'
          }
        ],
        positioning: [
          'Frame the comparison around design goals and use-case fit, not a ranking.',
          'Acknowledge Aave\'s strengths explicitly. Credibility comes from balance.',
          'The key Morpho advantage: isolated risk surfaces, custom market parameters, curated vault architecture.',
          'The key pooled advantage: concentrated liquidity, familiar integration, lower configuration overhead.'
        ],
        mistakes: [
          'Bashing incumbents instead of explaining design fit.',
          'Claiming Morpho is universally superior.',
          'Forgetting that liquidity concentration in pooled protocols is a real benefit for standardized markets.',
          'Comparing only user APY instead of architecture and builder fit.'
        ],
        tactical: [
          'Open with the honest frame: "Neither is universally better. The question is what the partner is building."',
          'Then name the two scenarios: "Morpho is stronger when custom market design or isolation matters. Pooled protocols are stronger when standardization and liquidity concentration matter."',
          'If asked for an example, use: "For a new LRT token listing, isolated markets make more sense than lobbying to get listed in a shared pool."'
        ],
        hiringSignals: [
          '"Morpho vs Aave" is almost certainly asked. A balanced, use-case-driven answer signals maturity.',
          'Sounding tribal (all-in on Morpho) is worse than acknowledging alternatives. Balance is the signal.'
        ]
      }
    },
    {
      slug: 'tradeoffs-and-risk',
      category: 'Risk & Judgment',
      title: 'Real Tradeoffs and Risk',
      deck: 'Show that you can talk about risk like an adult and not like a shill.',
      quickLearningSeeds: ['oracle risk', 'liquidation', 'liquidity availability', 'curator risk', 'market design'],
      memorize: [
        'Morpho does not remove risk; it makes market structure and risk boundaries more explicit.',
        'Important risks include oracle correctness, liquidation behavior, market configuration, vault curation, and liquidity availability.',
        'A strong interview answer acknowledges tradeoffs without collapsing into generic fear language.'
      ],
      simple: [
        'Morpho is powerful, but it does not make lending risk disappear.',
        'It makes the market design more explicit, which is good, but it also means you need to be honest about curation, liquidity, and operational risk.'
      ],
      deep: [
        'The interview-ready version is this: Morpho removes some shared-pool ambiguity by isolating markets, but it does not remove lending risk. If the oracle setup is wrong, liquidation assumptions are sloppy, or a vault strategy is poorly curated, users can still take losses or hit liquidity problems.',
        'That is why a good partner product needs more than a nice APY number. It needs market transparency, risk communication, liquidation warnings, sensible vault comparison, and fallback behavior when read layers or rewards data are delayed. This is the part people love to skip, and it matters a lot.'
      ],
      builderAngle: [
        'For a builder, Morpho is not just a product opportunity. It is also a responsibility. The integration has to explain risk clearly.',
        'It helps with hidden pooled-risk ambiguity, but it also forces the product team to present market and vault design honestly.',
        'This is where partner engineering matters: warning design, UI boundaries, and fallback behavior are part of the job.'
      ],
      interview: {
        sayIt: 'The real tradeoff is simple: Morpho gives you more explicit control and more flexibility, but it also forces you to be more deliberate about market design, vault curation, and user-facing risk communication.',
        strong: 'I would not pitch Morpho as “safe because DeFi.” I would say its design makes some risk boundaries clearer, especially with isolated markets and curated vault layers, but oracle, liquidity, liquidation, and curation risks still need to be understood and shown honestly in the product.',
        weak: 'Morpho is safe because it is audited and non-custodial.',
        pitfalls: [
          'Do not imply zero risk.',
          'Do not reduce all risk discussion to “smart contract risk.”',
          'Do not forget liquidity and product-surface risk.'
        ]
      },
      interviewGuide: {
        coreQuestions: [
          {
            question: 'What are the risks of using Morpho?',
            strong: 'Five categories worth knowing: oracle risk, because if the oracle feed is wrong or stale, collateral values and liquidation thresholds are wrong. Market configuration risk, because a poorly parameterized LLTV or IRM increases bad debt probability. Liquidation execution risk, because liquidations depend on external permissionless actors and economic incentives, not on a protocol-operated guarantee. Vault curation risk, because a badly managed allocation strategy can lose depositor funds. And liquidity availability risk, because vault withdrawals depend on underlying market liquidity. Morpho makes risk surfaces more explicit and isolated, but it does not eliminate these risks.',
            weak: 'Morpho is audited and non-custodial so it is relatively safe.'
          },
          {
            question: 'What is the tradeoff between isolated markets and pooled markets from a risk perspective?',
            strong: 'Isolated markets give each asset its own failure domain. A bad oracle or extreme liquidation event on one collateral does not contaminate unrelated markets. That is the upside. The downside is that isolated markets require more careful per-market configuration, more active curation, and more individual monitoring. Pooled markets concentrate liquidity but also spread failure. The right answer depends on the product. Morpho is designed for teams who want explicit risk control, not for teams who want to ignore risk entirely.',
            weak: 'Isolated markets are safer because they are separate.'
          }
        ],
        positioning: [
          'Show you can discuss risk without being dismissive (“it\'s audited”) or alarmist (“DeFi is dangerous”).',
          'Name specific risk categories: oracle, liquidation, market config, curation, liquidity.',
          'Frame Morpho\'s design as making risk explicit and bounded, not eliminating risk.',
          'Connect risk categories to what shows up in a product: UI warnings, health factor display, vault comparison, liquidity visibility.'
        ],
        mistakes: [
          'Reducing risk discussion to “smart contract risk” only.',
          'Saying non-custodial means low risk without explaining what risks remain.',
          'Ignoring curation risk, which is a major differentiator from simpler pooled systems.',
          'Forgetting that liquidity is a real risk for vault products, not just an edge case.'
        ],
        tactical: [
          'When asked about Morpho risk in an interview, structure the answer: here are the risk categories, here is how Morpho makes them more transparent, here is how a good product communicates them.',
          'The phrase “makes risk explicit and bounded, not zero” is credible language.',
          'Show that you would surface these risks in a product: liquidation warnings, health factor thresholds, liquidity estimates, vault market transparency.'
        ],
        hiringSignals: [
          'Talking about risk honestly and in specifics is a strong signal for a partner-facing role.',
          'Interviewers may test whether you will give a balanced risk answer or just pitch Morpho uncritically.'
        ]
      }
    },
    {
      slug: 'morpho-blue-five-params',
      category: 'Morpho Protocol',
      title: 'Morpho Blue: Five Parameters and Market Immutability',
      deck: 'Know the exact five market parameters and why immutability is a feature, not a bug.',
      quickLearningSeeds: ['market parameters', 'LLTV', 'oracle', 'IRM', 'immutability', 'market ID'],
      memorize: [
        'Every Morpho Blue market is defined by exactly five parameters: loanToken, collateralToken, oracle, IRM, and LLTV.',
        'Market ID is the keccak256 hash of these five parameters — same params always produce the same market.',
        'Markets are immutable at creation: no parameter can be changed, no admin can update the configuration.',
        'LLTV is the max loan-to-value at which liquidation can be triggered. It is expressed as a WAD (1e18 = 100%).',
        'The oracle must implement IMorphoOracle and return a price scaled to 1e36 / (collateral decimals / loan decimals).',
        'IRM defines the interest rate curve. AdaptiveCurveIRM is the primary production IRM.',
        'Immutability means partners must deploy a new market to change any parameter — there is no upgrade path.'
      ],
      simple: [
        'Every Morpho Blue market is defined by five things: what you lend, what you post as collateral, a price oracle, an interest rate model, and a max LTV.',
        'Once a market is deployed, these cannot be changed. Ever. That is by design: it makes the market trustless and predictable for every participant who joins it.'
      ],
      deep: [
        'The five parameters are: loanToken (ERC-20 address), collateralToken (ERC-20 address), oracle (IMorphoOracle compliant), IRM (interest rate model address), and LLTV (liquidation loan-to-value, WAD format).',
        'Market ID is derived as keccak256(abi.encode(loanToken, collateralToken, oracle, irm, lltv)). This means the same five inputs always resolve to the same market. There is no registry — the ID is the identity.',
        'The oracle must return a price in the format 1e36 * (loan unit price / collateral unit price), normalized for decimals. Getting this formula wrong by a factor of 1e6 is a common mistake when integrating custom oracles.',
        'LLTV is stored as WAD: 0.77e18 means 77% LTV. At this threshold, a position is liquidatable. The difference between LLTV and the actual market liquidation threshold is that LLTV is fixed at deployment — you cannot widen it later to rescue an underwater position.',
        'Immutability is deliberate: it prevents any party (including Morpho) from retroactively changing the rules of a market. A lender who deposits into a market with oracle X and LLTV 77% can trust that these parameters will never change. This is the core trust property of the protocol.',
        'The consequence for builders: if a partner wants different parameters — even just adjusting LLTV by 5% — they need a new market. This is not a bug. It forces explicit versioning of market risk.'
      ],
      builderAngle: [
        'When scoping a partner integration, the first technical question is always: what market parameters does this product need? The answer determines whether an existing market can be used or a new one must be deployed.',
        'For vault products, the curator selects which markets to allocate into. The five-parameter structure means the curator is explicitly selecting risk surfaces — not just token pairs.',
        'For direct lending products, the partner needs to know the LLTV to compute health factor display and liquidation warnings correctly. HF = (collateral * price * LLTV) / borrow. Every term comes from one of the five parameters.',
        'Oracle integration is often where bugs appear. The price must be scaled to 1e36 divided by the collateral-to-loan decimal ratio. Off by 1e6 or 1e12 errors are common.'
      ],
      interview: {
        sayIt: 'A Morpho Blue market is defined by five immutable parameters: loanToken, collateralToken, oracle, IRM, and LLTV. The market ID is just the hash of these five. Once deployed, nothing can change — which is what makes it trustless.',
        strong: 'The key insight about immutability is that it is a trust property, not a limitation. A lender joining a market with oracle X and LLTV 77% can verify exactly what they are signing up for and trust it will not change. The tradeoff is that any parameter change requires a new market. For a partner-facing engineer, this means you scope market requirements carefully upfront.',
        weak: 'Morpho Blue markets are customizable.',
        pitfalls: [
          'Vague about what the five parameters actually are.',
          'Treating immutability as a problem instead of a feature.',
          'Not knowing the oracle price format (1e36 scaled).',
          'Confusing LLTV with LTV — LLTV is the liquidation threshold, not the borrow ceiling.'
        ]
      },
      interviewGuide: {
        coreQuestions: [
          {
            question: 'What are the five parameters of a Morpho Blue market and what does each one do?',
            strong: 'loanToken is the asset being lent and borrowed. collateralToken is the asset posted as security. oracle is the price feed — must implement IMorphoOracle and return a price scaled to 1e36 normalized for decimals. IRM is the interest rate model, AdaptiveCurveIRM in most production markets. LLTV is the liquidation loan-to-value threshold in WAD format — when a position\'s LTV exceeds this, it becomes liquidatable. The market ID is keccak256 of all five, so the same parameters always map to the same market, with no separate registry needed.',
            weak: 'The parameters include the tokens, oracle, and some settings about interest rates.'
          },
          {
            question: 'Why are Morpho Blue markets immutable and what are the implications for integration?',
            strong: 'Immutability is a trust property. Every participant in a market can verify the exact rules at deployment and rely on them never changing. No admin, including Morpho itself, can alter the oracle, LLTV, or IRM after creation. The integration implication is that parameter changes require deploying a new market — you cannot patch a live market. For a partner engineering scoping call, this means getting parameters right upfront matters. It also means all state transitions (new caps, new allocations) happen through vault curation, not market modification.',
            weak: 'Markets are immutable because that is how smart contracts work.'
          }
        ],
        positioning: [
          'Know all five parameters by name and function, not just "tokens and settings."',
          'Be able to derive market ID from first principles: keccak256 of the five params.',
          'Explain immutability as a trust property, not a missing feature.',
          'Know the oracle price format: 1e36 * (loan price / collateral price), decimal-adjusted.'
        ],
        mistakes: [
          'Listing only three or four parameters and guessing the rest.',
          'Saying "admins can update parameters" — they cannot.',
          'Not knowing that LLTV is in WAD format (1e18 = 100%).',
          'Confusing the oracle format — 1e36 base is a common interview detail.'
        ],
        tactical: [
          'Memorize the five parameter names: loanToken, collateralToken, oracle, IRM, LLTV.',
          'Memorize the market ID derivation: keccak256(abi.encode(loanToken, collateralToken, oracle, irm, lltv)).',
          'Be ready to explain immutability with a concrete consequence: "If a curator wants to change LLTV on a live market, they cannot. They deploy a new market and migrate allocations."'
        ],
        hiringSignals: [
          'Knowing all five parameters without prompting is a strong signal.',
          'Explaining immutability as a trust feature rather than a limitation shows product maturity.',
          'Knowing the oracle price format (1e36 scaled) signals depth beyond surface-level familiarity.'
        ]
      }
    },
    {
      slug: 'vault-v2-roles-caps',
      category: 'Morpho Protocol',
      title: 'Vault V2: Roles, Timelocks, and Cap Architecture',
      deck: 'Know the five roles, the three-cap hierarchy, and why the timelock is asymmetric.',
      quickLearningSeeds: ['MetaMorpho vault', 'curator', 'allocator', 'timelock', 'supply cap', 'pending cap'],
      memorize: [
        'Vault V2 has five roles: owner, curator, allocator, guardian, and reentrancy guard.',
        'Owner sets caps and timelocks, curator manages market selection, allocator moves liquidity between markets.',
        'Every supply cap change goes through a timelock: pending → wait → accept. The wait period is enforced by the contract.',
        'The timelock is asymmetric: increasing caps requires waiting; decreasing caps is immediate.',
        'Guardian can veto a pending cap or timelock change before it is accepted.',
        'A market must have a non-zero supply cap before the allocator can move funds into it.',
        'The three-cap hierarchy: global vault cap → per-market supply cap → borrow capacity of underlying market.'
      ],
      simple: [
        'A Morpho Vault V2 is a managed lending vault. A curator selects which Morpho Blue markets are eligible. An allocator moves the deposited liquidity between those markets to optimize yield.',
        'To add a new market or increase its cap, there is a mandatory waiting period — a timelock. This prevents a rogue curator from draining depositors overnight.'
      ],
      deep: [
        'The five roles and their permissions: Owner — deploys and sets the timelock duration, sets per-market supply caps (after timelock), and manages fee config. Curator — submits cap increases and new market proposals to the pending queue. Allocator — rebalances liquidity between approved markets within cap limits, no timelock required. Guardian — can revoke any pending change before it is accepted. The reentrancy guard is a technical role enforced by the contract, not an EOA.',
        'Cap mechanics: when a curator submits a supply cap increase, it enters a pending state. After the timelock expires, the owner or anyone authorized can call acceptCap() to activate it. Decreasing a cap bypasses the timelock entirely — this is asymmetric by design. The rationale: lowering a cap reduces depositor exposure, which is always in their interest. Raising a cap expands exposure, which needs the delay for guardian review.',
        'The three-cap hierarchy controls how much capital can be in any market: The vault has a global deposit cap (totalSupply limit). Each market has a per-market supply cap set by the curator. The underlying Morpho Blue market has its own borrow capacity. The binding constraint is the minimum of the three.',
        'Liquidity adapter markets are a special allocation destination: they point to a vault-as-market construction that lets excess idle liquidity earn yield without a timelock-gated approval flow. These appear in integration patterns when partners need yield on unused capital.',
        'The fee structure: vault charges a performance fee (fraction of yield) paid to a feeRecipient. Fee accrual is computed at each interaction, not continuously, to minimize gas.'
      ],
      builderAngle: [
        'When building a vault product UI, the allocator and curator roles determine what state changes are immediate vs pending. A good vault dashboard needs to show pending caps, timelock expiry, and guardian veto windows — not just current allocations.',
        'For a partner building on top of a vault, the supply cap is the primary constraint. If a vault\'s cap for market X is full, new deposits get routed to other markets or sit idle. This affects yield display and deposit UX.',
        'The asymmetric timelock is critical for risk communication: if you are building a frontend that shows cap changes, distinguish between "cap just submitted (waiting)" vs "cap accepted (live)". Showing an unaccepted cap as live is a product bug.',
        'Vault share price is monotonically increasing (ignoring fees) because all interest accrues to the vault. Position tracking uses share-to-asset conversion: assets = shares * totalAssets() / totalSupply().'
      ],
      interview: {
        sayIt: 'A MetaMorpho Vault V2 has five roles — owner, curator, allocator, guardian, and reentrancy guard. Cap changes go through an asymmetric timelock: raising caps requires a wait period, lowering them is immediate. The allocator moves liquidity between approved markets within cap limits.',
        strong: 'The timelock asymmetry is the key design insight: increasing a market\'s cap expands depositor exposure and needs guardian review time. Decreasing it is always risk-reducing so it is immediate. This design makes it hard for a compromised curator to suddenly redirect all capital to a malicious market overnight. For integration, the key states to track are: pending cap, timelock expiry, and accepted cap.',
        weak: 'Vaults have a curator who manages the markets.',
        pitfalls: [
          'Conflating curator and allocator roles — they have different permissions and different operational patterns.',
          'Saying the timelock applies to all cap changes — it only applies to increases.',
          'Not knowing that guardian can veto pending changes.',
          'Forgetting the three-cap hierarchy when explaining why vault deposits sometimes go idle.'
        ]
      },
      interviewGuide: {
        coreQuestions: [
          {
            question: 'What are the roles in a MetaMorpho vault and what can each one do?',
            strong: 'Five roles: Owner sets the timelock duration, activates pending cap changes, and manages fees. Curator proposes market additions and cap increases — these go into a pending queue. Allocator rebalances liquidity between already-approved markets within existing caps, with no timelock required. Guardian can veto any pending change during the timelock window. The reentrancy guard is a protocol-level protection, not an operational role. In practice, the allocator is often an automated strategy contract; the curator is a trusted human or multisig.',
            weak: 'There is a vault owner and a curator who manages the markets.'
          },
          {
            question: 'Why is the vault timelock asymmetric — why does raising a cap require a wait but lowering it does not?',
            strong: 'Lowering a cap reduces depositor exposure to a given market, which is always risk-reducing. There is no scenario where immediately lowering a cap harms depositors. Raising a cap expands exposure, which could expose depositors to a newly risky market, so the delay exists to give the guardian time to review and potentially veto. The asymmetry is a deliberate safety guarantee: a curator cannot rapidly open up a large cap to a malicious market without the guardian having time to intervene.',
            weak: 'The timelock is there for security.'
          }
        ],
        positioning: [
          'Name all five roles without prompting: owner, curator, allocator, guardian, reentrancy guard.',
          'Know the pending → wait → accept cap flow and who can do what at each step.',
          'Explain the asymmetric timelock from first principles: exposure vs safety.',
          'Connect the three-cap hierarchy to why deposits sometimes sit idle.'
        ],
        mistakes: [
          'Conflating curator and allocator — curators approve markets, allocators move money.',
          'Saying the timelock applies to all cap changes.',
          'Not knowing guardian can veto.',
          'Treating vault share price as variable in the wrong direction — shares only go up in value (before fees).'
        ],
        tactical: [
          'Memorize: "Curator proposes, allocator executes, guardian vetoes." Three-sentence role summary.',
          'The timelock asymmetry answer: raising cap = more exposure = guardian review needed. Lowering cap = less exposure = always OK immediately.',
          'For any vault integration question, ask: what is the cap state? Pending, accepted, or full? These three states have different product implications.'
        ],
        hiringSignals: [
          'Knowing all five roles signals you have actually read the vault spec, not just the marketing page.',
          'Explaining the asymmetric timelock from a depositor-protection perspective is a strong signal for product thinking.',
          'Connecting caps to idle capital and yield impact shows integration-level understanding.'
        ]
      }
    },
    {
      slug: 'integration-surface-decision',
      category: 'Morpho Protocol',
      title: 'Integration Surface: Blue Direct, SDK, Bundler3, or API',
      deck: 'Know which integration layer to recommend and why — this comes up on every partner scoping call.',
      quickLearningSeeds: ['Bundler3', 'SDK', 'direct integration', 'API', 'multicall', 'leverage loop', 'integration surface'],
      memorize: [
        'Four integration surfaces: Morpho Blue direct calls, the TypeScript SDK, Bundler3, and the REST/GraphQL API.',
        'Morpho Blue direct: supply, borrow, repay, withdraw — atomic single operations, no approvals abstracted.',
        'Bundler3: multicall executor that batches operations, handles flash loans, and enables leverage loops in a single transaction.',
        'SDK: TypeScript abstraction over Morpho Blue and vaults — handles share math, market queries, and calldata generation.',
        'API: off-chain read layer for positions, APY, rewards, vault metadata — not for writes.',
        'Leverage loops require Bundler3: flash loan → buy collateral → deposit → borrow → repay flash loan, all atomic.',
        'Call3Value in Bundler3 allows ETH value forwarding across batched calls.',
        'skipRevert flag in Bundler3 lets a multicall continue even if one step fails — use for optional reward claims.'
      ],
      simple: [
        'Morpho Blue is the core protocol you write to. The SDK helps you build faster in TypeScript. Bundler3 lets you combine multiple operations — like a leverage loop — into one transaction. The API is for reading data.',
        'On a partner call, the right surface depends on what the partner is building: a simple deposit widget needs the SDK. A leverage product needs Bundler3. A dashboard needs the API.'
      ],
      deep: [
        'Morpho Blue direct calls: supply(marketParams, assets, shares, onBehalf, data), borrow(marketParams, assets, shares, onBehalf, receiver), repay(marketParams, assets, shares, onBehalf, data), withdraw(marketParams, assets, shares, onBehalf, receiver). All functions accept either an asset amount or a share amount — pass one and zero the other. The protocol handles share math. Direct calls require prior ERC-20 approval or use of Bundler3 permit2 flow.',
        'Bundler3: executes a list of Call3 structs in order. Each Call3 has (target, callData, value, skipRevert). Bundler3 can pull tokens via permit2 (no separate approval transaction needed), execute flash loans, and route ETH. Leverage loop pattern: (1) initiateFlashLoan → triggers callback → (2) swap ETH/asset for collateral → (3) supply collateral to Morpho → (4) borrow loan asset → (5) repay flash loan. All five steps happen in one transaction via Bundler3.',
        'Call3Value is the variant for ETH-forwarding: used when a step in the multicall needs to send ETH (e.g., wrapping ETH before supplying). skipRevert: true means if step N fails, the multicall continues to step N+1 instead of reverting the entire batch. Use this for optional reward claims where a failed claim should not block the main operation.',
        'TypeScript SDK: morpho-blue-sdk and @morpho-org/blue-sdk-viem provide market state queries, position math (health factor, max borrow, liquidation price), calldata builders, and vault state. Use getMarket() and getPosition() for off-chain math before sending transactions. The SDK handles the 1e36 oracle price normalization, WAD arithmetic, and share-to-asset conversion.',
        'REST/GraphQL API: https://blue-api.morpho.org/graphql returns positions, vault metadata, APY breakdowns (morpho APY + reward APY), and market state. Used for read-only dashboards and portfolio displays. Not suitable for writes. Morpho API data has a ~15-minute update lag — cache carefully for health factor display.',
        'Merkl integration is a separate read surface: the Merkl API (api.merkl.xyz/v4) provides reward campaign data and claimable amounts. Claim transactions are separate from Morpho operations but can be batched into a Bundler3 multicall with skipRevert: true so a missing reward campaign does not block a leverage adjustment.'
      ],
      builderAngle: [
        'The partner scoping decision tree: If the partner needs atomic multi-step transactions (leverage, looping, flash-loan-based collateral swaps) → Bundler3. If the partner is building a TypeScript frontend with share math, health factor computation, or calldata generation → SDK. If the partner needs a read-only dashboard with positions, APY, rewards → API + Merkl. If the partner is building a smart contract that needs to interact with Morpho directly → Blue direct calls.',
        'Common mistake: recommending SDK for a leverage product. The SDK generates calldata but Bundler3 is what executes the atomic flash-loan sequence. The SDK and Bundler3 are complementary: SDK for math and calldata generation, Bundler3 for execution.',
        'Common mistake: using Morpho API health factor data for liquidation warnings. The API has a 15-minute lag. For real-time HF, compute it from on-chain market state and oracle prices directly.',
        'For vault integrations, the SDK\'s getVault() and getVaultMarketAllocation() are the fastest way to build a vault dashboard. Supply and withdraw to vaults go through the vault contract directly, not through Morpho Blue.'
      ],
      interview: {
        sayIt: 'There are four integration surfaces: Morpho Blue for direct protocol calls, the TypeScript SDK for frontend math and calldata, Bundler3 for atomic multi-step transactions like leverage loops, and the API for read-only data. The right surface depends on what the partner is building.',
        strong: 'For a leverage product, Bundler3 is the only correct answer — it is the only surface that can atomically combine a flash loan, collateral purchase, deposit, borrow, and repayment in one transaction. For a dashboard, the API is the read layer, but for real-time health factor the API lag means you need to compute on-chain. The SDK bridges the gap: off-chain math from on-chain data.',
        weak: 'Use the SDK because it is easier than calling Morpho directly.',
        pitfalls: [
          'Recommending SDK alone for leverage products — SDK does not execute flash loans.',
          'Treating the API as real-time — it has a 15-minute lag.',
          'Not knowing that Bundler3 uses Call3 structs with skipRevert.',
          'Forgetting that direct Morpho calls need ERC-20 approval unless using Bundler3 permit2.'
        ]
      },
      interviewGuide: {
        coreQuestions: [
          {
            question: 'A partner wants to build a one-click leverage product on Morpho. What integration surface do they need and why?',
            strong: 'Bundler3. A leverage loop requires multiple steps to be atomic: flash loan to get initial capital, swap to acquire collateral, supply collateral to Morpho, borrow the loan asset, repay the flash loan. If any step fails, the entire transaction should revert to avoid partial state. Bundler3 executes a list of Call3 structs in a single transaction and supports flash loan callbacks. The SDK can be used off-chain to compute the borrow amounts and generate calldata, but Bundler3 is what executes the sequence on-chain.',
            weak: 'They should use the SDK because it has helper functions.'
          },
          {
            question: 'What is the skipRevert flag in Bundler3 and when would you use it?',
            strong: 'skipRevert: true on a Call3 means if that specific step reverts, the Bundler3 multicall continues to the next step instead of reverting the entire batch. You use it for optional operations that should not block the main transaction. The canonical example is batching a Merkl reward claim alongside a leverage adjustment: if the claim fails (no rewards accrued yet, or campaign ended), you still want the leverage operation to succeed. Without skipRevert, a failed claim would roll back the entire transaction.',
            weak: 'skipRevert makes the transaction not fail if something goes wrong.'
          }
        ],
        positioning: [
          'Know the four surfaces and when to recommend each without needing prompts.',
          'Bundler3 = atomic multi-step; SDK = off-chain math; API = read data; Blue direct = smart contracts.',
          'Be specific about Bundler3 Call3 structure: target, callData, value, skipRevert.',
          'Know the API lag (15 minutes) and its implication for real-time health factor.'
        ],
        mistakes: [
          'Recommending SDK alone for leverage — it cannot execute flash loans.',
          'Treating the API as real-time for health factor warnings.',
          'Not knowing what skipRevert does.',
          'Forgetting that Morpho direct calls need prior ERC-20 approval.'
        ],
        tactical: [
          'Memorize the leverage loop sequence: flash loan → swap → supply → borrow → repay. Five steps, one Bundler3 call.',
          'The skipRevert interview answer: "optional operations that should not block the main transaction — reward claims are the canonical example."',
          'For any integration scoping question, run through the decision tree: writes or reads? Multi-step atomic? TypeScript or smart contract? That gets you to the right surface fast.'
        ],
        hiringSignals: [
          'Correctly identifying Bundler3 for leverage without prompting is a strong signal.',
          'Knowing skipRevert and giving the Merkl example shows depth.',
          'Distinguishing SDK (off-chain math) from Bundler3 (on-chain execution) shows you understand the architecture.'
        ]
      }
    },
    {
      slug: 'interview-guide',
      category: 'Interview Guide',
      title: 'Morpho Interview Guide',
      deck: 'Use the interview patterns we have and answer like someone they would trust on a partner call.',
      quickLearningSeeds: ['why morpho', 'what do you know about defi', 'partner communication', 'business case', 'poc readiness'],
      memorize: [
        'Interviewers seem to care about crypto/DeFi fluency, motivation for Morpho, and communication clarity.',
        'This role likely rewards practical partner-facing explanations more than abstract theory.',
        'A strong answer connects protocol knowledge to builder outcomes, not just definitions.'
      ],
      simple: [
        'This section is about sounding like someone who could already represent Morpho to a partner.',
        'The target is not just getting facts right. It is being clear, showing judgment, and connecting product, protocol, and business value.'
      ],
      deep: [
        'The Glassdoor data is thin, but still useful. People seem to get broad questions like “What do you know about DeFi?”, “Do you know crypto?”, and “Why do you want to work at Morpho Labs?” There is also mention of business cases. So this is probably not a pure trivia screen. They want to see whether you can explain things cleanly and whether you think in a practical way.',
        'For this role, you want to sound like someone who can help a wallet, fintech, treasury, or protocol team scope an integration, explain why Morpho fits, and ship a decent first proof of concept. The real signal is synthesis. Can you explain the protocol, compare it honestly, talk about risk, and make a builder-focused recommendation without rambling?'
      ],
      interviewGuide: {
        coreQuestions: [
          {
            question: 'What is Morpho?',
            strong: 'Morpho is permissionless, non-custodial lending infrastructure. The core primitive is Morpho Blue, which uses isolated, immutable markets so builders can launch custom lending and curated yield products rather than only relying on one pooled risk surface.',
            weak: 'Morpho is a DeFi lending app with good yields.'
          },
          {
            question: 'Why would a protocol choose Morpho?',
            strong: 'Because Morpho gives the protocol a composable lending backend. It is useful when the team wants faster time to market, isolated market design, curated vault layers, or an embedded earn/borrow product without standing up a full lending system from scratch.',
            weak: 'Because Morpho has better APY than other protocols.'
          },
          {
            question: 'Why do you want to work at Morpho?',
            strong: 'Because Morpho sits in the interesting part of crypto: real protocol design tied to real product adoption. What pulls me in is not just the tech. It is that other teams actually build on Morpho, which means partner engineering can have real leverage instead of just explaining docs all day.',
            weak: 'I really like crypto and Morpho seems cool.'
          },
          {
            question: 'What do you know about DeFi?',
            strong: 'DeFi is more than onchain financial primitives. It is open execution, transparent state, composable protocols, and programmable market design. The practical point is that teams can assemble products from shared infrastructure, but they also inherit more responsibility around integration quality, risk communication, and operations.',
            weak: 'It is finance on the blockchain where people earn yield.'
          }
        ],
        positioning: [
          'Explain Morpho as infrastructure first, not only as an app.',
          'Frame Morpho in terms of builder outcomes: product flexibility, explicit market design, curated yield packaging, faster POC velocity.',
          'Use honest comparison language. Morpho is not automatically better than every alternative; it is often better when custom market design and isolated risk surfaces matter.'
        ],
        mistakes: [
          'Giving generic “better yields” answers with no architecture behind them.',
          'Answering only from a user perspective and ignoring the builder/protocol angle.',
          'Sounding too academic and not translating into product or partner decisions.',
          'Talking about audits and security without discussing actual risk surfaces.',
          'Failing to connect Morpho to real integrations, embedded earn, or partner-facing use cases.'
        ],
        tactical: [
          'When answering, lead with one sentence of positioning, then one sentence of mechanism, then one sentence of partner value.',
          'Use phrases like “for a wallet partner…”, “for a treasury product…”, or “for a protocol listing a new asset…” to show integration thinking.',
          'If you mention APY, explain where it comes from and what the UI should disclose.',
          'When asked broad questions, organize the answer instead of improvising: definition → mechanism → use case → tradeoff.',
          'In business-case style questions, sound like someone who can ship a first useful POC, not someone waiting for perfect specs.'
        ],
        hiringSignals: [
          'Glassdoor suggests broad crypto/DeFi questions and motivation questions appear early.',
          'Business-case style evaluation is plausible, so clear structure matters.',
          'Communication quality is likely more important than over-optimized jargon.'
        ]
      },
      interview: {
        sayIt: 'The way to stand out is to explain Morpho clearly as infrastructure, connect it to real partner use cases, and answer with judgment instead of generic excitement.',
        strong: 'A strong candidate sounds like they could scope an integration, explain Morpho honestly versus alternatives, and hold up on a live partner call. That is very different from just reciting DeFi definitions.',
        weak: 'I will stand out because I am very passionate about crypto.',
        pitfalls: [
          'Do not over-index on passion language with weak substance.',
          'Do not answer broad questions with jargon-only replies.',
          'Do not forget that this is a partner-facing role, not only a protocol-reader role.'
        ]
      }
    }
  ]
};

function getBaseKnowledgeTopicFromHash() {
  const hash = window.location.hash.replace(/^#/, '');
  const parts = hash.split('/');
  if (parts[0] !== 'base-knowledge') return null;
  return parts[1] || null;
}

function navigateToBaseKnowledgeTopic(slug = '') {
  window.location.hash = slug ? `base-knowledge/${slug}` : 'base-knowledge';
}

function renderBaseKnowledgeOverview() {
  const shell = document.getElementById('base-knowledge-shell');
  const title = document.getElementById('base-knowledge-title');
  const subtitle = document.getElementById('base-knowledge-subtitle');
  if (!shell) return;

  if (title) title.textContent = BASE_KNOWLEDGE.title;
  if (subtitle) subtitle.textContent = BASE_KNOWLEDGE.subtitle;

  shell.innerHTML = `
    <section class="base-knowledge-intro-card">
      <div class="base-knowledge-intro-copy">
        <span class="base-knowledge-kicker">Foundational Layer</span>
        <h2>Start here if you want sharper answers under pressure.</h2>
        <p>This section is here so you do not sound fuzzy in the interview. Use it to get the mental model right first, then go back to the deeper modules. The goal is simple: explain Morpho clearly, compare it honestly, and sound like someone who could help a partner ship something real.</p>
      </div>
      <div class="base-knowledge-intro-points">
        <div class="base-knowledge-pill">Definition</div>
        <div class="base-knowledge-pill">Mechanism</div>
        <div class="base-knowledge-pill">Builder Value</div>
        <div class="base-knowledge-pill">Interview Language</div>
      </div>
    </section>

    <section class="base-knowledge-grid">
      ${BASE_KNOWLEDGE.topics.map((topic) => `
        <article class="base-topic-card" onclick="navigateToBaseKnowledgeTopic('${topic.slug}')">
          <div class="base-topic-meta">
            <span class="base-topic-category">${topic.category}</span>
            <span class="base-topic-seed-count">${topic.quickLearningSeeds.length} anchors</span>
          </div>
          <h3>${topic.title}</h3>
          <p>${topic.deck}</p>
          <ul class="base-topic-seeds">
            ${topic.quickLearningSeeds.slice(0, 4).map((seed) => `<li>${seed}</li>`).join('')}
          </ul>
          <button class="module-btn module-btn-secondary" type="button" onclick="event.stopPropagation(); navigateToBaseKnowledgeTopic('${topic.slug}')">Open Topic →</button>
        </article>
      `).join('')}
    </section>
  `;
}

function renderInterviewGuide(topic) {
  const guide = topic.interviewGuide;
  return `
    <section class="base-topic-section">
      <h3>Morpho Interview Guide</h3>
      <div class="base-guide-grid">
        <div class="base-guide-card">
          <h4>Core Questions</h4>
          ${guide.coreQuestions.map((item) => `
            <div class="base-guide-question">
              <strong>${item.question}</strong>
              <p><span class="base-guide-label good">Strong:</span> ${item.strong}</p>
              <p><span class="base-guide-label weak">Weak:</span> ${item.weak}</p>
            </div>
          `).join('')}
        </div>
        <div class="base-guide-card">
          <h4>Positioning Strategy</h4>
          <ul>${guide.positioning.map((item) => `<li>${item}</li>`).join('')}</ul>
        </div>
        <div class="base-guide-card">
          <h4>Common Mistakes</h4>
          <ul>${guide.mistakes.map((item) => `<li>${item}</li>`).join('')}</ul>
        </div>
        <div class="base-guide-card">
          <h4>Tactical Advice</h4>
          <ul>${guide.tactical.map((item) => `<li>${item}</li>`).join('')}</ul>
        </div>
        <div class="base-guide-card">
          <h4>Interview Signals</h4>
          <ul>${guide.hiringSignals.map((item) => `<li>${item}</li>`).join('')}</ul>
        </div>
      </div>
    </section>
  `;
}

function renderBaseKnowledgeTopic(topic) {
  const shell = document.getElementById('base-knowledge-shell');
  const title = document.getElementById('base-knowledge-title');
  const subtitle = document.getElementById('base-knowledge-subtitle');
  if (!shell || !topic) return;

  const memorize = Array.isArray(topic.memorize) ? topic.memorize : [];
  const simple = Array.isArray(topic.simple) ? topic.simple : [];
  const deep = Array.isArray(topic.deep) ? topic.deep : [];
  const builderAngle = Array.isArray(topic.builderAngle) ? topic.builderAngle : [];
  const pitfalls = Array.isArray(topic.interview?.pitfalls) ? topic.interview.pitfalls : [];

  if (title) title.textContent = topic.title;
  if (subtitle) subtitle.textContent = topic.deck;

  shell.innerHTML = `
    <div class="base-topic-detail">
      <div class="base-topic-toolbar">
        <button class="back-link-btn" type="button" onclick="navigateToBaseKnowledgeTopic('')">← Back to Base Knowledge</button>
        <div class="base-topic-toolbar-meta">
          <span class="base-topic-category">${topic.category}</span>
          <span class="base-topic-seed-count">${topic.quickLearningSeeds.length} future quick-learning anchors</span>
        </div>
      </div>

      <section class="base-topic-hero">
        <div class="base-topic-hero-copy">
          <span class="base-knowledge-kicker">${topic.category}</span>
          <h2>${topic.title}</h2>
          <p>${topic.deck}</p>
        </div>
        <div class="base-topic-memory">
          <h4>What To Memorize</h4>
          <ul>
            ${memorize.map((item) => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      </section>

      <section class="base-topic-section-stack">
        <details class="base-topic-detail-card" open>
          <summary>Simple Explanation</summary>
          <div class="base-topic-detail-body">
            ${simple.map((item) => `<p>${item}</p>`).join('')}
          </div>
        </details>

        <details class="base-topic-detail-card" open>
          <summary>Deeper Explanation</summary>
          <div class="base-topic-detail-body">
            ${deep.map((item) => `<p>${item}</p>`).join('')}
          </div>
        </details>

        ${builderAngle.length ? `
        <details class="base-topic-detail-card" open>
          <summary>Builder + Business Angle</summary>
          <div class="base-topic-detail-body">
            <ul>
              ${builderAngle.map((item) => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        </details>
        ` : ''}

        <details class="base-topic-detail-card" open>
          <summary>How To Say This In An Interview</summary>
          <div class="base-topic-detail-body">
            <div class="base-interview-block">
              <h4>30-second version</h4>
              <p>${topic.interview.sayIt}</p>
            </div>
            <div class="base-interview-block">
              <h4>Strong answer standard</h4>
              <p>${topic.interview.strong}</p>
            </div>
            <div class="base-interview-block">
              <h4>Weak answer to avoid</h4>
              <p>${topic.interview.weak}</p>
            </div>
            <div class="base-interview-block">
              <h4>Common pitfalls</h4>
              <ul>
                ${pitfalls.map((item) => `<li>${item}</li>`).join('')}
              </ul>
            </div>
          </div>
        </details>
      </section>

      ${topic.interviewGuide ? renderInterviewGuide(topic) : ''}
    </div>
  `;
}

function loadBaseKnowledgeFromHash() {
  const slug = getBaseKnowledgeTopicFromHash();
  const topic = BASE_KNOWLEDGE.topics.find((item) => item.slug === slug);
  if (!slug || !topic) {
    renderBaseKnowledgeOverview();
    return;
  }
  renderBaseKnowledgeTopic(topic);
}

window.loadBaseKnowledgeFromHash = loadBaseKnowledgeFromHash;
window.navigateToBaseKnowledgeTopic = navigateToBaseKnowledgeTopic;
