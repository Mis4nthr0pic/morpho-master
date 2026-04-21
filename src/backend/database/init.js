const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const ROOT_DIR = path.join(__dirname, '../../..');
const WORKSPACE_DIR = path.join(ROOT_DIR, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');
const DB_PATH = path.join(DATA_DIR, 'morpho_trainer.db');
const MORPHO_DOC_PATH = path.join(WORKSPACE_DIR, 'morpho.txt');
const MORPHO_PAGES_PATH = path.join(WORKSPACE_DIR, 'morpho-pages.json');
const ROLE_BRIEF_PATH = path.join(DOCS_DIR, 'role-brief.md');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function normalizeSnippet(value, fallback) {
  return value ? value.replace(/\s+/g, ' ').trim() : fallback;
}

function parseMorphoDocsJson(input) {
  let raw = input;
  if (typeof input === 'string') {
    try {
      raw = JSON.parse(input);
    } catch {
      return [];
    }
  }

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return [];

  return Object.values(raw)
    .filter((page) => page && typeof page === 'object')
    .map((page) => ({
      section: String(page.section || 'General').trim(),
      title: String(page.title || 'Untitled').trim(),
      url: String(page.url || '').trim(),
      content: String(page.content || '').trim()
    }))
    .filter((page) => page.title);
}

function parseMorphoDocsPagesFromMarkdown(documentText) {
  const lines = String(documentText).split('\n');
  const pages = [];
  let currentSection = 'General';
  let currentPage = null;

  for (const line of lines) {
    const sectionMatch = line.match(/^# --- (.+) ---$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1].trim();
      continue;
    }

    const pageMatch = line.match(/^## \[(.+?)\]\((.+?)\)/);
    if (pageMatch) {
      if (currentPage) {
        currentPage.content = currentPage.content.trim();
        pages.push(currentPage);
      }

      currentPage = {
        section: currentSection,
        title: pageMatch[1].trim(),
        url: pageMatch[2].trim(),
        content: ''
      };
      continue;
    }

    if (currentPage) {
      currentPage.content += `${line}\n`;
    }
  }

  if (currentPage) {
    currentPage.content = currentPage.content.trim();
    pages.push(currentPage);
  }

  return pages;
}

function renderMorphoDocsMarkdown(pages) {
  const chunks = [];
  let currentSection = null;

  pages.forEach((page) => {
    if (page.section !== currentSection) {
      currentSection = page.section;
      chunks.push(`# --- ${currentSection} ---`);
      chunks.push('');
    }

    chunks.push(`## [${page.title}](${page.url})`);
    chunks.push('');
    if (page.content) chunks.push(page.content);
    chunks.push('');
  });

  return chunks.join('\n').trim();
}

function loadMorphoDocPages() {
  if (fs.existsSync(MORPHO_PAGES_PATH)) {
    const pages = parseMorphoDocsJson(fs.readFileSync(MORPHO_PAGES_PATH, 'utf8'));
    if (pages.length) return pages;
  }

  if (fs.existsSync(MORPHO_DOC_PATH)) {
    return parseMorphoDocsPagesFromMarkdown(fs.readFileSync(MORPHO_DOC_PATH, 'utf8'));
  }

  return [];
}

function pullDocSnippet(documentText, pattern, fallback) {
  const match = documentText.match(pattern);
  return normalizeSnippet(match && match[0], fallback);
}

function stringifyForStorage(value) {
  return JSON.stringify(value, (_key, currentValue) => {
    if (typeof currentValue === 'bigint') {
      return { __type: 'bigint', value: currentValue.toString() };
    }
    return currentValue;
  });
}

function getDocumentContext() {
  const morphoDocsPages = loadMorphoDocPages();
  const morphoDocs = morphoDocsPages.length
    ? renderMorphoDocsMarkdown(morphoDocsPages)
    : (fs.existsSync(MORPHO_DOC_PATH) ? fs.readFileSync(MORPHO_DOC_PATH, 'utf8') : '');
  const roleBrief = fs.existsSync(ROLE_BRIEF_PATH)
    ? fs.readFileSync(ROLE_BRIEF_PATH, 'utf8')
    : '';

  return {
    morphoDocs,
    morphoDocsPages,
    roleBrief,
    snippets: {
      products: pullDocSnippet(
        morphoDocs,
        /Morpho is a decentralized lending protocol[\s\S]{0,420}/,
        'Morpho is a decentralized lending protocol spanning markets, vaults, SDKs, and partner integrations.'
      ),
      sdk: pullDocSnippet(
        morphoDocs,
        /@morpho-org\/blue-sdk[\s\S]{0,320}/,
        'Use @morpho-org/blue-sdk for core entities and @morpho-org/blue-sdk-viem for fetchers.'
      ),
      bundler: pullDocSnippet(
        morphoDocs,
        /Bundler[\s\S]{0,320}/i,
        'Bundler flows combine multi-step Morpho actions into atomic transactions with slippage protection.'
      ),
      roles: pullDocSnippet(
        morphoDocs,
        /4-role[\s\S]{0,320}/i,
        'The 4-role system separates allocator, curator, guardian, and owner permissions to harden governance.'
      ),
      publicAllocator: pullDocSnippet(
        morphoDocs,
        /Public Allocator[\s\S]{0,320}/i,
        'Public Allocator mechanics matter for liquidity routing and real-world integration edge cases.'
      ),
      roleMission: normalizeSnippet(
        roleBrief,
        'Provide technical guidance to partners, build proofs of concept, unblock integrations, improve docs, and translate field feedback into engineering improvements.'
      )
    }
  };
}

function parseMorphoDocsIndex(documentText) {
  return parseMorphoDocsPages(documentText).map(({ section, title, url }) => ({
    section,
    title,
    url
  }));
}

function parseMorphoDocsPages(documentText) {
  if (Array.isArray(documentText)) {
    return documentText;
  }

  const value = String(documentText || '').trim();
  if (!value) return [];

  if (value.startsWith('{')) {
    const jsonPages = parseMorphoDocsJson(value);
    if (jsonPages.length) return jsonPages;
  }

  return parseMorphoDocsPagesFromMarkdown(value);
}

function moduleSlugForPage(page) {
  const title = page.title.toLowerCase();
  const section = page.section.toLowerCase();

  if (section === 'build') return 'integration-patterns';
  if (section === 'curate') return 'morpho-architecture';
  if (section === 'tools') {
    return /llm|community|contributions/.test(title) ? 'solution-architect' : 'integration-patterns';
  }
  if (section === 'get started') {
    return /products|overview|addresses|contracts|audits|resources/.test(title)
      ? 'morpho-architecture'
      : 'defi-primitives';
  }
  if (section === 'learn') {
    return /liquidation|oracle|interest|ltv|health|collateral|rewards|flash loans/.test(title)
      ? 'defi-primitives'
      : 'morpho-architecture';
  }

  return 'solution-architect';
}

function lessonSummaryFromContent(content) {
  const blocks = String(content)
    .split(/\n\s*\n/)
    .map((block) => block.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .filter((block) => !/^\[←/.test(block));

  return blocks.slice(0, 3).join('\n\n').slice(0, 1600);
}

function genericTipsForPage(page) {
  const title = page.title.toLowerCase();
  const tips = [
    `Read ${page.title} until you can explain it without reopening the source page.`,
    'Turn at least one protocol mechanic from this lesson into an integration consequence.'
  ];

  if (/liquidation|lltv|ltv|health/.test(title)) {
    tips.unshift('Write the formula and the failure condition before you try to explain the mechanic.');
  }

  if (/vault|erc4626|allocator/.test(title)) {
    tips.unshift('State what the user holds, what the contract manages, and where operational risk still lives.');
  }

  if (/bundler|sdk|api|tools/.test(title)) {
    tips.unshift('Name the exact surface you would use in a partner proof-of-concept.');
  }

  return tips.slice(0, 3);
}

function getPageTaxonomy(page) {
  try {
    const pathname = new URL(page.url).pathname.replace(/^\/+|\/+$/g, '');
    const parts = pathname.split('/').filter(Boolean);
    const title = String(page.title || '').trim();

    if (parts[0] === 'build' && parts[1] === 'earn') {
      return {
        productTrack: 'Earn - Morpho Vaults V2 & V1',
        docStage: parts[2] ? parts[2].replace(/-/g, ' ') : 'overview'
      };
    }

    if (parts[0] === 'build' && parts[1] === 'borrow') {
      return {
        productTrack: 'Borrow - Morpho Markets V1',
        docStage: parts[2] ? parts[2].replace(/-/g, ' ') : 'overview'
      };
    }

    if (parts[0] === 'build' && parts[1] === 'rewards') {
      return {
        productTrack: 'Rewards',
        docStage: parts[2] ? parts[2].replace(/-/g, ' ') : 'overview'
      };
    }

    if (parts[0] === 'tools') {
      return {
        productTrack: 'Tools',
        docStage: parts[1] ? parts[1].replace(/-/g, ' ') : 'overview'
      };
    }

    if (parts[0] === 'curate') {
      return {
        productTrack: 'Curate',
        docStage: parts[1] ? parts[1].replace(/-/g, ' ') : 'overview'
      };
    }

    if (parts[0] === 'learn') {
      return {
        productTrack: 'Learn',
        docStage: /governance|token|risk|security/i.test(title) ? 'resources' : 'concepts'
      };
    }

    return {
      productTrack: page.section,
      docStage: 'overview'
    };
  } catch {
    return {
      productTrack: page.section,
      docStage: 'overview'
    };
  }
}

function buildDocLesson(page, titleCounts) {
  const sectionLabel = page.section;
  const duplicateTitle = titleCounts[page.title.toLowerCase()] > 1;
  const lessonTitle = duplicateTitle ? `${page.title} [${sectionLabel}]` : page.title;
  const summary = lessonSummaryFromContent(page.content);
  const taxonomy = getPageTaxonomy(page);

  return {
    title: lessonTitle,
    body: summary || `${page.title} is a Morpho documentation page in ${sectionLabel}. Study it until you can explain the mechanism, the risk, and the integration implication.`,
    docs: [`morpho.txt -> ${sectionLabel} -> ${page.title}`],
    productTrack: taxonomy.productTrack,
    docStage: taxonomy.docStage,
    tips: genericTipsForPage(page),
    talkingPoints: [
      `Explain what ${page.title} is in one clean sentence.`,
      `Name the integration or risk consequence of ${page.title}.`,
      'Give one implementation check a partner team should do before shipping.'
    ]
  };
}

function extractPageSections(page) {
  const lines = String(page.content).split('\n');
  const sections = [];
  let current = null;

  lines.forEach((line) => {
    const headingMatch = line.match(/^##\s+(.+)/);
    if (headingMatch) {
      if (current && current.content.trim()) sections.push({ ...current, content: current.content.trim() });
      current = {
        heading: headingMatch[1].trim(),
        content: ''
      };
      return;
    }

    if (current) {
      current.content += `${line}\n`;
    }
  });

  if (current && current.content.trim()) {
    sections.push({ ...current, content: current.content.trim() });
  }

  return sections.filter((section) => section.heading && !/^code$/i.test(section.heading));
}

function buildSectionLesson(page, heading, content) {
  const taxonomy = getPageTaxonomy(page);
  return {
    title: `${heading} (${page.title})`,
    body: lessonSummaryFromContent(content) || `${heading} is a subsection of ${page.title}. Study the mechanism, the operational edge cases, and the partner-facing explanation.`,
    docs: [`morpho.txt -> ${page.section} -> ${page.title}`],
    productTrack: taxonomy.productTrack,
    docStage: taxonomy.docStage,
    tips: genericTipsForPage({ ...page, title: `${heading} ${page.title}` }),
    talkingPoints: [
      `Explain ${heading} in the context of ${page.title}.`,
      `Say why ${heading} matters to an integrator or curator.`,
      'Name one configuration or support mistake that would break here.'
    ]
  };
}

function extractDocLessonUnits(page, titleCounts) {
  const lessons = [buildDocLesson(page, titleCounts)];
  const pageSections = extractPageSections(page);

  pageSections.forEach((section) => {
    lessons.push(buildSectionLesson(page, section.heading, section.content));
  });

  return lessons;
}

function expandModulesWithDocs(modules, documentText) {
  const pages = parseMorphoDocsPages(documentText);
  const titleCounts = pages.reduce((acc, page) => {
    acc[page.title.toLowerCase()] = (acc[page.title.toLowerCase()] || 0) + 1;
    return acc;
  }, {});

  const moduleMap = new Map(modules.map((module) => [module.slug, {
    ...module,
    lessons: [...module.lessons]
  }]));

  const existingKeys = new Set(
    modules.flatMap((module) => module.lessons.map((lesson) => `${module.slug}:${lesson.title.toLowerCase()}`))
  );

  pages.forEach((page) => {
    const slug = moduleSlugForPage(page);
    const target = moduleMap.get(slug);
    if (!target) return;

    extractDocLessonUnits(page, titleCounts).forEach((lesson) => {
      const key = `${slug}:${lesson.title.toLowerCase()}`;
      if (existingKeys.has(key)) return;
      existingKeys.add(key);
      target.lessons.push(lesson);
    });
  });

  return modules.map((module) => moduleMap.get(module.slug));
}

function buildStudyBlock(title) {
  const map = {
    'Isolated vs pooled lending': {
      whatYouMustKnow: [
        'Morpho Blue uses isolated market risk rather than a broad pooled-risk surface.',
        'Each market must be reasoned about specifically, which changes integration and risk communication.'
      ],
      whyItMatters: [
        'This is the foundation for how you explain Morpho to partners.',
        'It changes what assumptions a frontend, backend, and support engineer can safely make.'
      ],
      implementationChecks: [
        'Confirm the exact market and its parameters before coding.',
        'Do not generalize one market’s behavior across other markets.'
      ],
      interviewDrill: 'Explain isolated lending in 45 seconds, then contrast it with pooled lending in one clean tradeoff sentence.'
    },
    'LLTV and liquidation math': {
      whatYouMustKnow: [
        'LLTV shapes borrow capacity and liquidation exposure.',
        'BigInt and basis-point handling are common sources of false confidence.'
      ],
      whyItMatters: [
        'Interviewers use this topic to test whether you can connect protocol math to user risk.',
        'Partners care because this math determines product constraints and safety messaging.'
      ],
      implementationChecks: [
        'Scale explicitly for bigint arithmetic.',
        'Test zero cases, basis-point conversion, and rounding expectations.'
      ],
      interviewDrill: 'Write the utilization and borrow-capacity formulas from memory and explain the main implementation trap.'
    },
    'Oracle mechanics and ERC4626': {
      whatYouMustKnow: [
        'Oracle quality is about assumptions, freshness, and decimals, not just vendor names.',
        'ERC4626 standardizes the interface but not the explanation of vault behavior.'
      ],
      whyItMatters: [
        'This is where integrations often fail quietly.',
        'Good candidates can explain assets, shares, price assumptions, and failure modes clearly.'
      ],
      implementationChecks: [
        'Normalize decimals before cross-asset math.',
        'Be explicit about assets versus shares in code and docs.'
      ],
      interviewDrill: 'Explain an ERC4626 vault to a PM, then restate it for a protocol engineer without changing the facts.'
    },
    'Blue markets and immutable design': {
      whatYouMustKnow: [
        'Morpho Blue is the immutable core market primitive.',
        'Its immutability narrows the trust and upgrade surface around core market logic.'
      ],
      whyItMatters: [
        'This is one of the highest-value Morpho interview topics.',
        'It tests whether you understand the trust model rather than just repeating product copy.'
      ],
      implementationChecks: [
        'Separate immutable market logic from operational layers like vault allocation.',
        'Know where SDK usage and offchain data fetching fit into the picture.'
      ],
      interviewDrill: 'Give the 60-second Morpho Blue explanation you would use on a partner call.'
    },
    'Vault evolution and adapters': {
      whatYouMustKnow: [
        'Vaults add managed strategy behavior on top of market primitives.',
        'Adapters matter because integrators interact through abstractions, not just raw contracts.'
      ],
      whyItMatters: [
        'Version confusion causes both bad integrations and bad interview answers.',
        'You need to be crisp on whether you are discussing V1.1, V2, direct markets, or vault flows.'
      ],
      implementationChecks: [
        'Name the exact surface before diagnosing behavior.',
        'Do not mix direct market assumptions into vault explanations.'
      ],
      interviewDrill: 'Explain when a partner should think in terms of markets versus vaults.'
    }
  };

  return map[title] || {
    whatYouMustKnow: [
      'Know the mechanism well enough to explain it without rereading the docs.',
      'Know the partner-facing implication, not just the protocol definition.'
    ],
    whyItMatters: [
      'Every topic should end in an integration, support, or product consequence.',
      'If you cannot explain why it matters, you do not know it well enough yet.'
    ],
    implementationChecks: [
      'Translate the concept into a concrete implementation check.',
      'List the first two ways it could fail in production.'
    ],
    interviewDrill: 'Explain the topic in 60 seconds, then answer one skeptical follow-up.'
  };
}

function baseModules(snippets) {
  return [
    {
      slug: 'defi-primitives',
      title: 'Module 1: DeFi Primitives',
      durationHours: 2,
      category: 'fundamental',
      summary: 'Lending architecture, LLTV math, oracle mechanics, and ERC4626 implementation drills.',
      objective: 'Explain the primitive layer clearly enough to survive detailed architecture questioning.',
      format: 'Read concept -> edit code -> run quiz -> move immediately to the next concept.',
      lessons: [
        {
          title: 'Isolated vs pooled lending',
          body: `Morpho sits inside the isolated-pool design space. ${snippets.products}`,
          docs: [
            'morpho.txt -> Learn -> Morpho Market V1',
            'morpho.txt -> Get Started -> Products'
          ],
          tips: [
            'Always explain isolated markets in terms of risk containment and integration clarity.',
            'When comparing to pooled lending, state the tradeoff instead of pretending one model dominates every use case.'
          ],
          talkingPoints: [
            'Why isolated risk surfaces matter for partner integrations',
            'How market-level collateralization changes product design',
            'What tradeoffs a skeptical CTO will ask about'
          ]
        },
        {
          title: 'LLTV and liquidation math',
          body: 'Train on liquidation loan-to-value thresholds, utilization, borrow power, and the edge cases caused by integer math.',
          docs: [
            'morpho.txt -> Learn -> Liquidation',
            'morpho.txt -> Learn -> Morpho Market V1'
          ],
          tips: [
            'Say the formula out loud before coding it.',
            'BigInt truncation is a standard interview trap. Mention scaling before you are asked.'
          ],
          talkingPoints: [
            'Explain LLTV versus risk-adjusted borrowing capacity',
            'Handle bigint precision without silent truncation',
            'Translate equations into product decisions'
          ]
        },
        {
          title: 'Oracle mechanics and ERC4626',
          body: 'Understand Chainlink-style oracle assumptions and how ERC4626 vault interfaces shape integrations.',
          docs: [
            'morpho.txt -> Learn -> Oracles',
            'morpho.txt -> Build -> Morpho Vaults for Earn products'
          ],
          tips: [
            'Decimals and stale prices matter more than generic oracle theory in partner conversations.',
            'For ERC4626, be crisp on assets vs shares.'
          ],
          talkingPoints: [
            'Failure modes: stale data, decimals, and assumptions',
            'ERC4626 method surface that partners actually care about',
            'How to explain share-price behavior without hand-waving'
          ]
        },
        {
          title: 'Interest rate model mental model',
          body: 'Train on utilization-driven borrowing rates, what moves supply APY, and how to explain rate volatility to a partner.',
          docs: [
            'morpho.txt -> Learn -> IRM',
            'morpho.txt -> Learn -> Morpho Market V1'
          ],
          tips: [
            'Tie rate movement back to utilization, not vague market conditions.',
            'If someone asks about APY, clarify whether they mean supply-side or borrow-side economics.'
          ],
          talkingPoints: [
            'Why utilization matters operationally',
            'How APY and APR discussions go wrong on calls',
            'How to set expectations for rate movement'
          ]
        },
        {
          title: 'Liquidation edge cases',
          body: 'Study liquidation paths, collateral shortfall, and why liquidation assumptions matter when a product team asks about worst-case behavior.',
          docs: [
            'morpho.txt -> Learn -> Liquidation',
            'morpho.txt -> Learn -> Oracles'
          ],
          tips: [
            'In interviews, explain what liquidation protects and what still remains risky.',
            'Tie liquidation behavior back to oracle freshness and LLTV.'
          ],
          talkingPoints: [
            'What liquidation protects',
            'Where oracle timing matters',
            'How to frame liquidation risk credibly'
          ]
        }
      ]
    },
    {
      slug: 'morpho-architecture',
      title: 'Module 2: Morpho Architecture',
      durationHours: 3,
      category: 'intermediate',
      summary: 'Blue markets, MetaMorpho vault mechanics, adapter architecture, 4-role control system, and timelock simulations.',
      objective: 'Speak fluently about Morpho’s architecture under interview pressure.',
      format: 'Interactive architecture brief -> code task -> debugging -> verbal explanation drill.',
      lessons: [
        {
          title: 'Blue markets and immutable design',
          body: `Blue is the core immutable market layer. ${snippets.sdk}`,
          docs: [
            'morpho.txt -> Learn -> Morpho Market V1',
            'morpho.txt -> Tools -> SDKs -> @morpho-org/blue-sdk'
          ],
          tips: [
            'When explaining Morpho Blue, lead with immutable market primitives and isolated risk.',
            'Distinguish core immutable logic from operational layers like vault allocation.'
          ],
          talkingPoints: [
            'Why immutability matters for trust and integrator assumptions',
            'How market IDs and isolated pools shape frontends and risk controls',
            'What data needs to be fetched offchain'
          ]
        },
        {
          title: 'Vault evolution and adapters',
          body: `V1.1 MetaMorpho and the V2 adapter layer define the operational reality for partner integrations. ${snippets.bundler}`,
          docs: [
            'morpho.txt -> Learn -> Morpho Vault V2',
            'morpho.txt -> Build -> Morpho Vaults for Earn products'
          ],
          tips: [
            'Say exactly whether you are discussing direct market integration or vault integration.',
            'Adapters are operationally important because they are where integration assumptions concentrate.'
          ],
          talkingPoints: [
            'Differences between direct market integrations and vault integrations',
            'Adapter architecture as the operational abstraction',
            'Migration and compatibility questions partners will raise'
          ]
        },
        {
          title: 'Roles, timelocks, and allocator mechanics',
          body: `${snippets.roles} ${snippets.publicAllocator}`,
          docs: [
            'morpho.txt -> Curate -> Roles',
            'morpho.txt -> Curate -> Public Allocator'
          ],
          tips: [
            'Role questions are governance questions disguised as integration questions.',
            'Mention timelocks as safety windows, not just admin delays.'
          ],
          talkingPoints: [
            'Who can do what and why that matters',
            'Timelock safety versus operational responsiveness',
            'Allocator-driven liquidity routing in practice'
          ]
        },
        {
          title: 'Addresses and deployment surfaces',
          body: 'Know where factories, registries, and chain-specific deployments live so you can answer practical integrator questions quickly.',
          docs: [
            'morpho.txt -> Get Started -> Addresses',
            'morpho.txt -> Get Started -> Resources'
          ],
          tips: [
            'Be able to say where to verify addresses, not just that addresses exist.',
            'Chain-specific deployment details are low glamour and high interview value.'
          ],
          talkingPoints: [
            'What partners ask first when they go from docs to code',
            'How chain-specific differences shape implementation',
            'How to reduce address-confusion incidents'
          ]
        },
        {
          title: 'Why Morpho in the market',
          body: 'Tie architecture back to product positioning, explosive growth, and why teams choose Morpho for better terms and flexible integration patterns.',
          docs: [
            'morpho.txt -> Get Started -> Products',
            'docs/role-brief.md'
          ],
          tips: [
            'Keep this grounded in product and architecture, not brand slogans.',
            'The strongest answer links growth, product differentiation, and your ability to help partners ship.'
          ],
          talkingPoints: [
            'Explain Morpho to BD, PM, and CTO personas',
            'Link product positioning to technical choices',
            'Show conviction without sounding scripted'
          ]
        }
      ]
    },
    {
      slug: 'integration-patterns',
      title: 'Module 3: Integration Patterns',
      durationHours: 3,
      category: 'expert',
      summary: 'Vault integrations, Bundler3-style multicalls, slippage controls, version differences, and debugging production scenarios.',
      objective: 'Write and review partner-ready TypeScript integrations without needing hints.',
      format: 'Scenario -> implement -> run tests -> optimize -> explain tradeoffs.',
      lessons: [
        {
          title: 'Vault integration playbook',
          body: 'Work from stakeholder request to implementation spec to TypeScript code, including approvals, decimals, slippage, and fallbacks.',
          docs: [
            'morpho.txt -> Build -> Morpho Vaults for Earn products',
            'morpho.txt -> Tools -> SDKs'
          ],
          tips: [
            'Write the integration checklist before you write implementation code.',
            'Ask about approvals, decimals, and simulation before chasing obscure bugs.'
          ],
          talkingPoints: [
            'What a production-ready integration checklist looks like',
            'How to scope a proof-of-concept fast',
            'What logs and health checks should exist before launch'
          ]
        },
        {
          title: 'Atomic bundles and failure analysis',
          body: 'Train on multicall flow design, transaction ordering, simulation assumptions, and revert triage.',
          docs: [
            'morpho.txt -> Build -> Bundler tutorials',
            'morpho.txt -> Tools -> SDKs -> bundler'
          ],
          tips: [
            'Order matters. If the flow depends on supplied collateral, do not borrow first.',
            'When a bundle fails, isolate the first failing assumption instead of rereading the whole stack trace.'
          ],
          talkingPoints: [
            'How to explain bundle construction on partner calls',
            'Where slippage assumptions fail',
            'How to reduce implementation risk before mainnet execution'
          ]
        },
        {
          title: 'Version diff interview drills',
          body: 'Spot integration bugs introduced by V1.1 versus V2 assumptions and defend your diagnosis with clear language.',
          docs: [
            'morpho.txt -> Learn -> Morpho Vault V2',
            'morpho.txt -> Curate -> V1 & V2 tutorials'
          ],
          tips: [
            'State the version surface explicitly before diagnosing the bug.',
            'Many integration mistakes are actually version-assumption mistakes.'
          ],
          talkingPoints: [
            'Common migration misunderstandings',
            'How to recognize adapter-specific pitfalls',
            'How to communicate remediation under time pressure'
          ]
        },
        {
          title: 'PublicAllocator and liquidity assumptions',
          body: 'Understand how liquidity moves, when PublicAllocator matters, and why integrators must not hard-code simplistic availability assumptions.',
          docs: [
            'morpho.txt -> Curate -> Public Allocator',
            'morpho.txt -> Tools -> liquidity SDK'
          ],
          tips: [
            'Available liquidity is an observed state, not a permanent guarantee.',
            'If a partner reports execution failures, check liquidity assumptions early.'
          ],
          talkingPoints: [
            'How to reason about available liquidity',
            'What assumptions fail during volatile periods',
            'What to log before escalating'
          ]
        },
        {
          title: 'Support-channel debugging',
          body: 'Practice answering real-time Slack and Telegram style questions with technical depth and operational clarity.',
          docs: [
            'docs/role-brief.md',
            'morpho.txt -> Build -> Integrator flows'
          ],
          tips: [
            'Ask for chain, tx hash, exact action, expected behavior, and actual behavior.',
            'A short clear triage response beats a long speculative one.'
          ],
          talkingPoints: [
            'Fast triage questions',
            'How to ask for the right evidence',
            'When to escalate internally'
          ]
        }
      ]
    },
    {
      slug: 'solution-architect',
      title: 'Module 4: Solution Architect Mindset',
      durationHours: 2,
      category: 'expert',
      summary: 'Partner calls, emergency debugging, technical writing, technical sales communication, and role-specific interview pressure drills.',
      objective: 'Operate like a partner-facing technical architect, not just a protocol user.',
      format: 'Case study -> written answer -> code artifact -> hotseat simulation.',
      lessons: [
        {
          title: 'Partner call hotseat',
          body: `This role exists to accelerate partner integrations across the Americas. ${snippets.roleMission}`,
          docs: [
            'docs/role-brief.md'
          ],
          tips: [
            'Answer with mechanism, risk, and next step.',
            'Never bluff when a partner could act on the answer immediately.'
          ],
          talkingPoints: [
            'How to build trust fast on joint BD + technical calls',
            'How to separate known facts from assumptions',
            'How to turn vague asks into an integration plan'
          ]
        },
        {
          title: 'Debug under pressure',
          body: 'You are paged because funds are stuck or a partner cannot complete a flow. Investigate, narrow the blast radius, and communicate next steps.',
          docs: [
            'docs/role-brief.md',
            'morpho.txt -> Build -> Troubleshooting-relevant integration sections'
          ],
          tips: [
            'First isolate severity, blast radius, and reproducibility.',
            'Your calm written update is part of the technical work.'
          ],
          talkingPoints: [
            'Emergency triage sequence',
            'What evidence to gather first',
            'How to give a calm but technically credible status update'
          ]
        },
        {
          title: 'Documentation and stakeholder translation',
          body: 'Write technical docs and explain the same architecture to a developer, a PM, and a skeptical CTO without losing precision.',
          docs: [
            'docs/role-brief.md',
            'morpho.txt -> relevant product pages for the topic you are documenting'
          ],
          tips: [
            'Good docs explain prerequisites, exact flow, failure modes, and next actions.',
            'If the same explanation cannot survive three audiences, it is not sharp enough yet.'
          ],
          talkingPoints: [
            'What great integration docs include',
            'How to adapt tone without reducing technical rigor',
            'How to turn repeated support pain into reusable documentation'
          ]
        },
        {
          title: 'Proof-of-concept acceleration',
          body: 'Translate vague partner asks into a scoped PoC, choose the right SDK layer, and ship something that removes uncertainty fast.',
          docs: [
            'morpho.txt -> Tools -> SDKs',
            'docs/role-brief.md'
          ],
          tips: [
            'A PoC should remove the highest-risk unknown first.',
            'Choose the smallest credible demo that proves integration viability.'
          ],
          talkingPoints: [
            'How to define a minimum convincing PoC',
            'What to build versus what to explain',
            'How to close the loop after a demo'
          ]
        },
        {
          title: 'Role-fit and execution narrative',
          body: 'Prepare the interview story that ties your experience to Morpho’s needs across partner support, TypeScript execution, writing, and cross-functional trust.',
          docs: [
            'docs/role-brief.md'
          ],
          tips: [
            'Speak like someone already operating in the role, not someone hoping to grow into it someday.',
            'Anchor your story to autonomy, partner trust, and shipped technical outcomes.'
          ],
          talkingPoints: [
            'How you become autonomous by month six',
            'How you measure partner impact',
            'How to speak as someone already doing the job'
          ]
        }
      ]
    }
  ];
}

function baseChallenges() {
  return [
    {
      title: 'Calculate Utilization for a Morpho Market',
      difficulty: 'fundamental',
      starterCode: `export function calculateUtilization(supply: bigint, borrow: bigint): number {\n  // Handle the zero-supply edge case.\n  // Return a normalized number between 0 and 1.\n  return 0;\n}\n`,
      solutionCode: `export function calculateUtilization(supply: bigint, borrow: bigint): number {\n  if (supply === 0n) return 0;\n  const wad = 10n ** 18n;\n  return Number((borrow * wad) / supply) / 1e18;\n}\n`,
      testCases: [
        {
          title: 'half utilized',
          expression: 'calculateUtilization(1000n, 500n)',
          expected: 0.5
        },
        {
          title: 'zero supply',
          expression: 'calculateUtilization(0n, 100n)',
          expected: 0
        }
      ],
      conceptsCovered: ['LLTV math', 'BigInt precision', 'utilization'],
      docs: [
        'morpho.txt -> Learn -> Morpho Market V1',
        'morpho.txt -> Learn -> Liquidation'
      ],
      tips: [
        'Guard zero supply first.',
        'Scale bigint math before converting to number.'
      ]
    },
    {
      title: 'Build a Bundler Sequence',
      difficulty: 'intermediate',
      starterCode: `type BundleStep = { to: string; data: string };\n\nexport function buildBundle(morpho: string, supplyCollateralData: string, borrowData: string): BundleStep[] {\n  return [];\n}\n`,
      solutionCode: `type BundleStep = { to: string; data: string };\n\nexport function buildBundle(morpho: string, supplyCollateralData: string, borrowData: string): BundleStep[] {\n  return [\n    { to: morpho, data: supplyCollateralData },\n    { to: morpho, data: borrowData }\n  ];\n}\n`,
      testCases: [
        {
          title: 'returns ordered multicall',
          expression: `JSON.stringify(buildBundle('0xMorpho', '0xsupply', '0xborrow'))`,
          expected: JSON.stringify([
            { to: '0xMorpho', data: '0xsupply' },
            { to: '0xMorpho', data: '0xborrow' }
          ])
        }
      ],
      conceptsCovered: ['Bundler3', 'atomic transactions', 'multicall ordering'],
      docs: [
        'morpho.txt -> Build -> Bundler tutorials'
      ],
      tips: [
        'Atomic flows are about ordering and assumptions.',
        'Name each step by intent before implementing.'
      ]
    },
    {
      title: 'Translate a Type Error into English',
      difficulty: 'expert',
      starterCode: `type IntegrationError = {\n  message: string;\n  human: string;\n};\n\nexport function explainTypeError(raw: string): IntegrationError {\n  return {\n    message: raw,\n    human: ''\n  };\n}\n`,
      solutionCode: `type IntegrationError = {\n  message: string;\n  human: string;\n};\n\nexport function explainTypeError(raw: string): IntegrationError {\n  const human = raw.includes(\"Type 'string' is not assignable to type 'bigint'\")\n    ? 'You passed a string where a bigint is required. Convert the value with BigInt(...) before using it in protocol math.'\n    : 'Read the type mismatch carefully, inspect the expected signature, and align your values before submitting.';\n\n  return {\n    message: raw,\n    human\n  };\n}\n`,
      testCases: [
        {
          title: 'bigint explanation',
          expression: `explainTypeError("Type 'string' is not assignable to type 'bigint'").human.includes('BigInt')`,
          expected: true
        }
      ],
      conceptsCovered: ['TypeScript gym', 'error translation', 'partner support communication'],
      docs: [
        'morpho.txt -> Tools -> SDKs -> @morpho-org/blue-sdk'
      ],
      tips: [
        'Translate compiler errors into action language.',
        'Answer as if you are unblocking a partner in Slack.'
      ]
    },
    {
      title: 'Compute Borrow Capacity from LLTV',
      difficulty: 'fundamental',
      starterCode: `export function computeBorrowCapacity(collateralValue: bigint, lltvBps: bigint): bigint {\n  return 0n;\n}\n`,
      solutionCode: `export function computeBorrowCapacity(collateralValue: bigint, lltvBps: bigint): bigint {\n  return (collateralValue * lltvBps) / 10000n;\n}\n`,
      testCases: [
        {
          title: '80% LLTV',
          expression: 'computeBorrowCapacity(1000n, 8000n)',
          expected: 800n
        }
      ],
      conceptsCovered: ['LLTV', 'basis points', 'borrow power'],
      docs: [
        'morpho.txt -> Learn -> Liquidation'
      ],
      tips: [
        'Basis points are out of 10,000.',
        'Say the financial meaning after you compute the value.'
      ]
    },
    {
      title: 'Normalize Token Decimals',
      difficulty: 'fundamental',
      starterCode: `export function toWad(amount: bigint, decimals: bigint): bigint {\n  return 0n;\n}\n`,
      solutionCode: `export function toWad(amount: bigint, decimals: bigint): bigint {\n  const scale = 18n - decimals;\n  return scale >= 0n ? amount * (10n ** scale) : amount / (10n ** (-scale));\n}\n`,
      testCases: [
        {
          title: '6 decimals to wad',
          expression: 'toWad(1_000_000n, 6n)',
          expected: 1000000000000000000n
        }
      ],
      conceptsCovered: ['decimals', 'wad math', 'oracle hygiene'],
      docs: [
        'morpho.txt -> Learn -> Oracles'
      ],
      tips: [
        'Never assume 18 decimals.',
        'Normalize before cross-asset math.'
      ]
    },
    {
      title: 'Build a Timelock Window Summary',
      difficulty: 'intermediate',
      starterCode: `export function describeTimelock(delayHours: number): string {\n  return '';\n}\n`,
      solutionCode: `export function describeTimelock(delayHours: number): string {\n  return delayHours >= 24\n    ? 'Long-delay governance window for partner review and reaction.'\n    : 'Short-delay operational window; monitor closely for changes.';\n}\n`,
      testCases: [
        {
          title: 'long delay message',
          expression: "describeTimelock(48).includes('partner review')",
          expected: true
        }
      ],
      conceptsCovered: ['timelock', 'governance', 'stakeholder communication'],
      docs: [
        'morpho.txt -> Curate -> Roles',
        'morpho.txt -> Curate -> timelock sections'
      ],
      tips: [
        'Translate governance to operational effect.',
        'State why the delay exists.'
      ]
    },
    {
      title: 'Guard Slippage Tolerance',
      difficulty: 'intermediate',
      starterCode: `export function applySlippage(amountOut: bigint, toleranceBps: bigint): bigint {\n  return 0n;\n}\n`,
      solutionCode: `export function applySlippage(amountOut: bigint, toleranceBps: bigint): bigint {\n  return amountOut - (amountOut * toleranceBps) / 10000n;\n}\n`,
      testCases: [
        {
          title: '1 percent haircut',
          expression: 'applySlippage(10000n, 100n)',
          expected: 9900n
        }
      ],
      conceptsCovered: ['slippage', 'basis points', 'execution risk'],
      docs: [
        'morpho.txt -> Build -> Bundler tutorials'
      ],
      tips: [
        'Treat tolerance as a risk control, not a magic number.',
        'Be explicit about units.'
      ]
    },
    {
      title: 'Summarize Vault Positioning for a CTO',
      difficulty: 'intermediate',
      starterCode: `export function pitchVault(): string {\n  return '';\n}\n`,
      solutionCode: `export function pitchVault(): string {\n  return 'Morpho vaults provide ERC4626-compatible access to managed lending strategies while preserving a clear technical trust model.';\n}\n`,
      testCases: [
        {
          title: 'mentions ERC4626',
          expression: "pitchVault().includes('ERC4626')",
          expected: true
        }
      ],
      conceptsCovered: ['vaults', 'stakeholder explanation', 'technical sales'],
      docs: [
        'morpho.txt -> Learn -> Morpho Vault V2',
        'morpho.txt -> Build -> Morpho Vaults for Earn products'
      ],
      tips: [
        'Use one sentence for what it is and one sentence for why a partner cares.',
        'Do not drift into generic DeFi marketing.'
      ]
    },
    {
      title: 'Detect Idle Session Threshold',
      difficulty: 'expert',
      starterCode: `export function isIdle(millisecondsSinceInput: number): boolean {\n  return false;\n}\n`,
      solutionCode: `export function isIdle(millisecondsSinceInput: number): boolean {\n  return millisecondsSinceInput >= 5 * 60 * 1000;\n}\n`,
      testCases: [
        {
          title: 'idle at 5 minutes',
          expression: 'isIdle(300000)',
          expected: true
        }
      ],
      conceptsCovered: ['focus metrics', 'idle detection', 'deep work'],
      docs: [
        'Internal platform metric'
      ],
      tips: [
        'Threshold checks should be explicit and boring.',
        'Do not overcomplicate session telemetry logic.'
      ]
    },
    {
      title: 'Classify Partner Severity',
      difficulty: 'expert',
      starterCode: `export function classifySeverity(blockedFunds: boolean, production: boolean): 'low' | 'medium' | 'high' {\n  return 'low';\n}\n`,
      solutionCode: `export function classifySeverity(blockedFunds: boolean, production: boolean): 'low' | 'medium' | 'high' {\n  if (blockedFunds && production) return 'high';\n  if (blockedFunds || production) return 'medium';\n  return 'low';\n}\n`,
      testCases: [
        {
          title: 'prod stuck funds is high',
          expression: "classifySeverity(true, true)",
          expected: 'high'
        }
      ],
      conceptsCovered: ['incident response', 'support operations', 'partner trust'],
      docs: [
        'docs/role-brief.md'
      ],
      tips: [
        'Severity classification should help humans act.',
        'Production plus blocked funds should immediately feel high-severity.'
      ]
    },
    {
      title: 'Write a Clear Escalation Summary',
      difficulty: 'expert',
      starterCode: `export function buildEscalation(partner: string, issue: string): string {\n  return '';\n}\n`,
      solutionCode: `export function buildEscalation(partner: string, issue: string): string {\n  return \`\${partner}: issue detected -> \${issue}. Current status: triaging evidence, isolating root cause, and preparing next steps.\`;\n}\n`,
      testCases: [
        {
          title: 'includes partner and triage',
          expression: "buildEscalation('WalletCo', 'withdrawals reverting').includes('triaging evidence')",
          expected: true
        }
      ],
      conceptsCovered: ['communication', 'escalation', 'partner support'],
      docs: [
        'docs/role-brief.md'
      ],
      tips: [
        'Short updates win during incidents.',
        'Status, evidence, and next step are the minimum.'
      ]
    }
  ];
}

function baseQuizBank() {
  const conceptSets = [
    {
      moduleSlug: 'defi-primitives',
      category: 'fundamentals',
      concepts: [
        ['isolated lending', 'each market has isolated risk parameters and collateral relationships', 'explain how isolated design contains risk and changes integration assumptions'],
        ['pooled lending', 'liquidity and risk are shared across a broader pool design', 'contrast pooled designs with market-specific control'],
        ['LLTV', 'borrow capacity depends on collateral value and loan-to-value thresholds', 'link LLTV to product constraints and liquidation risk'],
        ['oracle hygiene', 'price freshness, decimals, and assumptions drive safe integration behavior', 'ask about stale data, decimals, and fallback behavior'],
        ['ERC4626', 'vault interactions use the deposit/mint/withdraw/redeem interface surface', 'explain shares versus assets cleanly'],
        ['utilization', 'borrowed assets divided by supplied assets informs market stress and rates', 'tie utilization directly to rate movement'],
        ['interest rate models', 'rate curves react to utilization and influence supply and borrow economics', 'translate rate volatility without jargon'],
        ['liquidation', 'collateral is sold or seized when a position breaches safety thresholds', 'describe what liquidation protects and what it does not'],
        ['bigint math', 'integer arithmetic truncates and requires explicit scaling for precision', 'call out truncation risks immediately'],
        ['decimals normalization', 'token decimals must be normalized before cross-asset math', 'never assume every token uses 18 decimals']
      ]
    },
    {
      moduleSlug: 'morpho-architecture',
      category: 'architecture',
      concepts: [
        ['Morpho Blue', 'the immutable market layer is the core trust anchor for lending interactions', 'separate immutable market logic from operational layers'],
        ['MetaMorpho V1.1', 'managed vault mechanics sit on top of market primitives for curated strategies', 'explain why a vault is not just a market wrapper'],
        ['adapter architecture', 'adapters provide the abstraction layer that connects vault flows to underlying primitives', 'highlight why adapters matter operationally'],
        ['4-role system', 'owner, curator, allocator, and guardian permissions split responsibilities', 'show that governance design is part of the product'],
        ['timelocks', 'time delays create safety windows before sensitive operational changes take effect', 'tie timelocks to trust and operational tempo'],
        ['registries', 'registries help integrators discover supported deployments and components', 'know where factories and registries live'],
        ['factory deployments', 'factories standardize deployment flows across supported chains', 'speak concretely about chain-specific addresses'],
        ['public allocator', 'liquidity routing can change availability and assumptions at runtime', 'warn against naive liquidity assumptions'],
        ['oracles in Morpho', 'oracle factories and feed assumptions are part of deployment architecture', 'link oracle selection to integration risk'],
        ['market IDs', 'market identity is fundamental to fetching and interacting with the right primitives', 'show how IDs shape backend and frontend design']
      ]
    },
    {
      moduleSlug: 'integration-patterns',
      category: 'integration',
      concepts: [
        ['vault integration', 'partners need a clear flow from approvals to deposits to monitoring', 'give an implementation checklist, not a vague overview'],
        ['bundler transactions', 'multiple actions can be executed atomically to reduce user friction and failure gaps', 'order bundle steps explicitly'],
        ['slippage protection', 'execution tolerances protect users from state changes between simulation and execution', 'name the tolerance and why it exists'],
        ['version differences', 'V1.1 and V2 assumptions differ and can break integrations if mixed carelessly', 'state which surface you are integrating'],
        ['simulation', 'simulate complex flows before broadcasting transactions to catch obvious failures', 'say what simulation cannot guarantee'],
        ['allowances', 'token approvals are still a common practical failure point', 'ask about approvals early in triage'],
        ['liquidity checks', 'available liquidity may differ from naive assumptions in dynamic systems', 'verify liquidity before escalation'],
        ['error translation', 'raw TypeScript or revert errors must become clear operational guidance', 'answer like a support engineer with technical depth'],
        ['support triage', 'fast evidence gathering shortens time to resolution for partners', 'ask for tx hash, chain, market, and exact flow'],
        ['documentation feedback loop', 'recurring partner pain should become better docs and playbooks', 'show you improve the system, not just tickets']
      ]
    },
    {
      moduleSlug: 'solution-architect',
      category: 'role-fit',
      concepts: [
        ['partner calls', 'technical credibility is built by clear answers and scoped next steps', 'speak with precision and calm'],
        ['proof of concept', 'a good PoC reduces uncertainty for a partner quickly', 'optimize for time-to-conviction'],
        ['technical writing', 'great docs accelerate every future integration and reduce support load', 'write for the reader under deadline'],
        ['stakeholder translation', 'the same architecture must be explainable to devs, PMs, and CTOs', 'adapt the framing, not the facts'],
        ['support ownership', 'real-time partner support is part of the job, not an interruption to it', 'show comfort with urgency'],
        ['feedback loops', 'field issues should feed product and engineering improvements', 'demonstrate systems thinking'],
        ['autonomy at month six', 'success means handling routine partner questions without pulling others in', 'frame yourself as low-drag and reliable'],
        ['Americas timezone coverage', 'responsiveness in partner timezone is part of the operating model', 'show why timing matters for trust'],
        ['why Morpho', 'growth, product differentiation, and technical quality all matter in the interview', 'connect conviction to specifics'],
        ['interview narrative', 'your story should map directly to Morpho’s stated success profile', 'anchor your answers to the role expectations']
      ]
    }
  ];

  const questions = [];

  conceptSets.forEach((set) => {
    set.concepts.forEach((concept, index) => {
      const [name, definition, tip] = concept;
      const baseId = `${set.moduleSlug}-${index + 1}`;
      questions.push({
        questionId: `${baseId}-a`,
        moduleSlug: set.moduleSlug,
        prompt: `Which statement best captures ${name} in the Morpho interview context?`,
        choices: [
          definition,
          `It means you can skip implementation details once the UI is done for ${name}.`,
          `It is mostly a legal/compliance concept rather than a technical one.`,
          `It only matters for internal protocol contributors and not for partners.`
        ],
        correctIndex: 0,
        explanation: `${name} matters because ${definition}.`,
        category: set.category,
        difficulty: 1 + (index % 3),
        interviewTip: tip
      });
      questions.push({
        questionId: `${baseId}-b`,
        moduleSlug: set.moduleSlug,
        prompt: `A partner asks about ${name}. What is the strongest response pattern?`,
        choices: [
          `Dismiss the concern and tell them the docs are enough.`,
          `Describe the key mechanic, the operational risk, and the next implementation step tied to ${name}.`,
          `Avoid specifics until after the integration is live.`,
          `Switch immediately into unrelated product positioning.`
        ],
        correctIndex: 1,
        explanation: `Strong partner-facing answers combine mechanism, risk, and concrete next steps.`,
        category: set.category,
        difficulty: 2 + (index % 2),
        interviewTip: `For ${name}, give mechanism -> risk -> action in that order.`
      });
      questions.push({
        questionId: `${baseId}-c`,
        moduleSlug: set.moduleSlug,
        prompt: `What is the most common interview failure mode when discussing ${name}?`,
        choices: [
          'Answering too concretely and tying the answer to implementation detail.',
          'Giving a vague summary without addressing how it affects a real integration or partner decision.',
          'Mentioning operational risk at all.',
          'Translating the topic differently for different stakeholders.'
        ],
        correctIndex: 1,
        explanation: 'Morpho will care whether you can operationalize the concept, not just define it.',
        category: set.category,
        difficulty: 3,
        interviewTip: `Always connect ${name} to a real partner implementation or support outcome.`
      });
    });
  });

  questions.push(
    {
      questionId: 'role-anchor-1',
      moduleSlug: 'solution-architect',
      prompt: 'What makes this Morpho role distinct from pure internal protocol engineering?',
      choices: [
        'It avoids writing code and focuses only on sales.',
        'It centers on partner-facing technical execution: calls, PoCs, support, docs, and feedback loops.',
        'It owns only smart contract audits.',
        'It is mostly recruiting and hiring.'
      ],
      correctIndex: 1,
      explanation: 'The role is partner-facing technical architecture and enablement, not isolated protocol development.',
      category: 'role-fit',
      difficulty: 1,
      interviewTip: 'Tie your answer to proof-of-concepts, support loops, and stakeholder translation.'
    },
    {
      questionId: 'arch-anchor-1',
      moduleSlug: 'morpho-architecture',
      prompt: 'Why does Morpho Blue’s immutable market design matter when a partner asks about upgrade risk?',
      choices: [
        'It removes all need for monitoring after launch.',
        'It reduces moving governance surfaces for core market logic and clarifies the trust model.',
        'It means market parameters can be changed instantly by any curator.',
        'It guarantees liquidity depth in every market.'
      ],
      correctIndex: 1,
      explanation: 'Immutable market logic narrows upgrade risk and makes the integration trust model easier to explain, but it does not remove operational risk.',
      category: 'architecture',
      difficulty: 3,
      interviewTip: 'Contrast immutability with operational layers like vault allocation and monitoring.'
    },
    {
      questionId: 'integration-anchor-1',
      moduleSlug: 'integration-patterns',
      prompt: 'A partner’s bigint math returns zero for a non-zero utilization calculation. What is the first technical explanation?',
      choices: [
        'The market is paused.',
        'BigInt division truncates, so precision handling is missing.',
        'JavaScript cannot divide integers.',
        'The ERC4626 vault uses floating point internally.'
      ],
      correctIndex: 1,
      explanation: 'BigInt division truncates toward zero. You usually scale by WAD precision before converting to number or formatted output.',
      category: 'typescript',
      difficulty: 2,
      interviewTip: 'Explain the bug and the remediation in one breath.'
    }
  );

  return questions;
}

function lessonLinkedQuiz(modules) {
  const questions = [];

  modules.forEach((module) => {
    module.lessons.forEach((lesson, index) => {
      const key = `${module.slug}-lesson-${index + 1}`;
      const lessonHint = (lesson.tips && lesson.tips[0]) || 'Tie your answer back to implementation detail.';
      const primaryFact = lesson.whatYouMustKnow?.[0]
        || lesson.talkingPoints?.[0]
        || `${lesson.title} should be explainable from memory.`;

      questions.push({
        questionId: `${key}-fact`,
        moduleSlug: module.slug,
        prompt: `What should you be able to do after studying "${lesson.title}"?`,
        choices: [
          primaryFact,
          `Treat ${lesson.title} as optional reference material with no implementation consequence.`,
          `Skip ${lesson.title} unless a partner explicitly pastes that exact page.`,
          `Assume ${lesson.title} matters only for smart contract auditors.`
        ],
        correctIndex: 0,
        explanation: `"${lesson.title}" is in the course because it should change how you explain or implement Morpho.`,
        category: module.category,
        difficulty: 2,
        interviewTip: lessonHint
      });

      questions.push({
        questionId: `${key}-action`,
        moduleSlug: module.slug,
        prompt: `A partner asks why "${lesson.title}" matters. What is the strongest answer pattern?`,
        choices: [
          'Tell them to read the raw docs and come back later.',
          `Explain the mechanism in ${lesson.title}, call out one risk or tradeoff, and give the next implementation check.`,
          `Avoid specifics because details slow the conversation down.`,
          'Stay at a product-marketing level and skip technical consequences.'
        ],
        correctIndex: 1,
        explanation: 'Good Morpho answers connect the mechanism to a concrete risk and a next step.',
        category: module.category,
        difficulty: 2 + (index % 2),
        interviewTip: `For ${lesson.title}, answer in the order: mechanism -> tradeoff -> action.`
      });
    });
  });

  return questions;
}

function baseHotseatScenarios() {
  return [
    {
      slug: 'skeptical-cto',
      title: 'Incoming Call: Skeptical CTO',
      persona: 'Skeptical CTO',
      durationMinutes: 15,
      prompt: 'A major wallet partner wants to integrate Morpho borrow flows on Base, but the CTO is worried about trust assumptions, oracle risk, and time-to-value.',
      questions: [
        'Explain Morpho’s architecture in plain but technical language.',
        'Why would this partner choose Morpho versus a pooled lending primitive?',
        'What integration milestones would you propose for the first two weeks?'
      ]
    },
    {
      slug: 'stuck-funds',
      title: 'Emergency: Partner Funds Stuck',
      persona: 'Panicked Integrator',
      durationMinutes: 10,
      prompt: 'A partner reports that a high-value user cannot complete a withdrawal path. They need an answer on Slack now.',
      questions: [
        'What evidence do you gather first?',
        'How do you isolate whether the issue is allowances, slippage, liquidity, or UI assumptions?',
        'Draft a calm status update for the partner.'
      ]
    }
  ];
}

function resetDatabase(db) {
  db.exec(`
    DROP TABLE IF EXISTS study_sessions;
    DROP TABLE IF EXISTS progress;
    DROP TABLE IF EXISTS quiz_results;
    DROP TABLE IF EXISTS code_challenges;
    DROP TABLE IF EXISTS daily_intensity;
    DROP TABLE IF EXISTS curriculum_modules;
    DROP TABLE IF EXISTS quiz_bank;
    DROP TABLE IF EXISTS hotseat_scenarios;
    DROP TABLE IF EXISTS writing_submissions;
    DROP TABLE IF EXISTS app_config;
  `);
}

function createSchema(db) {
  db.exec(`
    CREATE TABLE study_sessions (
      id INTEGER PRIMARY KEY,
      start_time TIMESTAMP,
      end_time TIMESTAMP,
      total_minutes INTEGER,
      intensity_score INTEGER CHECK(intensity_score BETWEEN 0 AND 100),
      interruptions INTEGER DEFAULT 0,
      code_lines_written INTEGER DEFAULT 0,
      concepts_mastered INTEGER DEFAULT 0,
      current_module TEXT,
      streak_days INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE progress (
      id INTEGER PRIMARY KEY,
      concept_name TEXT UNIQUE,
      mastery_level INTEGER DEFAULT 0,
      times_practiced INTEGER DEFAULT 0,
      last_reviewed TIMESTAMP,
      category TEXT,
      difficulty TEXT CHECK(difficulty IN ('fundamental', 'intermediate', 'expert')),
      time_spent_minutes INTEGER DEFAULT 0
    );

    CREATE TABLE quiz_results (
      id INTEGER PRIMARY KEY,
      question_id TEXT,
      correct BOOLEAN,
      time_taken_seconds INTEGER,
      attempts INTEGER DEFAULT 1,
      difficulty_rating INTEGER,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE code_challenges (
      id INTEGER PRIMARY KEY,
      title TEXT,
      difficulty TEXT,
      starter_code TEXT,
      solution_code TEXT,
      test_cases TEXT,
      hints_used INTEGER DEFAULT 0,
      time_to_solve INTEGER DEFAULT 0,
      completed BOOLEAN DEFAULT 0,
      concepts_covered TEXT,
      docs TEXT,
      tips TEXT
    );

    CREATE TABLE daily_intensity (
      id INTEGER PRIMARY KEY,
      date TEXT UNIQUE,
      target_hours INTEGER DEFAULT 8,
      actual_hours INTEGER DEFAULT 0,
      focus_score INTEGER DEFAULT 0,
      modules_completed INTEGER DEFAULT 0,
      code_challenges_solved INTEGER DEFAULT 0,
      interview_simulations_completed INTEGER DEFAULT 0,
      streak_active BOOLEAN DEFAULT 0
    );

    CREATE TABLE curriculum_modules (
      id INTEGER PRIMARY KEY,
      slug TEXT UNIQUE,
      title TEXT,
      duration_hours INTEGER,
      category TEXT,
      summary TEXT,
      objective TEXT,
      format TEXT,
      lesson_payload TEXT,
      order_index INTEGER
    );

    CREATE TABLE quiz_bank (
      id INTEGER PRIMARY KEY,
      question_id TEXT UNIQUE,
      module_slug TEXT,
      prompt TEXT,
      choices TEXT,
      correct_index INTEGER,
      explanation TEXT,
      category TEXT,
      difficulty_rating INTEGER,
      interview_tip TEXT
    );

    CREATE TABLE hotseat_scenarios (
      id INTEGER PRIMARY KEY,
      slug TEXT UNIQUE,
      title TEXT,
      persona TEXT,
      duration_minutes INTEGER,
      prompt TEXT,
      questions TEXT
    );

    CREATE TABLE writing_submissions (
      id INTEGER PRIMARY KEY,
      mode TEXT,
      title TEXT,
      prompt TEXT,
      content TEXT,
      score INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE app_config (
      id INTEGER PRIMARY KEY,
      config_json TEXT
    );
  `);
}

function seedData(db) {
  const { snippets, morphoDocsPages } = getDocumentContext();
  const modules = expandModulesWithDocs(baseModules(snippets), morphoDocsPages);
  const challenges = baseChallenges();
  const quizBank = baseQuizBank().concat(lessonLinkedQuiz(modules));
  const hotseat = baseHotseatScenarios();

  const insertModule = db.prepare(`
    INSERT INTO curriculum_modules (
      slug, title, duration_hours, category, summary, objective, format, lesson_payload, order_index
    ) VALUES (
      @slug, @title, @durationHours, @category, @summary, @objective, @format, @lessonPayload, @orderIndex
    )
  `);

  const insertProgress = db.prepare(`
    INSERT INTO progress (
      concept_name, mastery_level, times_practiced, last_reviewed, category, difficulty, time_spent_minutes
    ) VALUES (
      @concept_name, @mastery_level, @times_practiced, @last_reviewed, @category, @difficulty, @time_spent_minutes
    )
  `);

  const insertChallenge = db.prepare(`
    INSERT INTO code_challenges (
      title, difficulty, starter_code, solution_code, test_cases, hints_used, time_to_solve, completed, concepts_covered, docs, tips
    ) VALUES (
      @title, @difficulty, @starter_code, @solution_code, @test_cases, 0, 0, 0, @concepts_covered, @docs, @tips
    )
  `);

  const insertQuiz = db.prepare(`
    INSERT INTO quiz_bank (
      question_id, module_slug, prompt, choices, correct_index, explanation, category, difficulty_rating, interview_tip
    ) VALUES (
      @questionId, @moduleSlug, @prompt, @choices, @correctIndex, @explanation, @category, @difficulty, @interviewTip
    )
  `);

  const insertHotseat = db.prepare(`
    INSERT INTO hotseat_scenarios (
      slug, title, persona, duration_minutes, prompt, questions
    ) VALUES (
      @slug, @title, @persona, @durationMinutes, @prompt, @questions
    )
  `);

  modules.forEach((module, index) => {
    insertModule.run({
      ...module,
      lessonPayload: JSON.stringify(module.lessons.map((lesson) => ({
        ...lesson,
        ...buildStudyBlock(lesson.title)
      }))),
      orderIndex: index + 1
    });

    module.lessons.forEach((lesson) => {
      insertProgress.run({
        concept_name: `${module.title} :: ${lesson.title}`,
        mastery_level: 0,
        times_practiced: 0,
        last_reviewed: null,
        category: module.slug,
        difficulty: module.category,
        time_spent_minutes: 0
      });
    });
  });

  challenges.forEach((challenge) => {
    insertChallenge.run({
      title: challenge.title,
      difficulty: challenge.difficulty,
      starter_code: challenge.starterCode,
      solution_code: challenge.solutionCode,
      test_cases: stringifyForStorage(challenge.testCases),
      concepts_covered: stringifyForStorage(challenge.conceptsCovered.concat([])),
      docs: stringifyForStorage(challenge.docs || []),
      tips: stringifyForStorage(challenge.tips || [])
    });
  });

  quizBank.forEach((question) => {
    insertQuiz.run({
      ...question,
      choices: JSON.stringify(question.choices)
    });
  });

  hotseat.forEach((scenario) => {
    insertHotseat.run({
      ...scenario,
      questions: JSON.stringify(scenario.questions)
    });
  });

  db.prepare(`
    INSERT INTO app_config (id, config_json)
    VALUES (1, ?)
  `).run(JSON.stringify({
    openrouter: {
      enabled: false,
      api_key: '',
      model: 'anthropic/claude-3.5-sonnet',
      interview_personality: 'skeptical_cto'
    }
  }, null, 2));
}

function main() {
  ensureDir(DATA_DIR);
  ensureDir(DOCS_DIR);

  const db = new Database(DB_PATH);
  resetDatabase(db);
  createSchema(db);
  seedData(db);
  db.close();

  console.log(`Database initialized at ${DB_PATH}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  DB_PATH,
  DOCS_DIR,
  MORPHO_DOC_PATH,
  MORPHO_PAGES_PATH,
  parseMorphoDocsIndex,
  parseMorphoDocsPages,
  getDocumentContext,
  main
};
