const crypto = require('crypto');
const { CURRICULUM_MODULES } = require('../../content/curriculum-data');
const { QUIZ_QUESTIONS } = require('../../content/quiz-questions');
const { findRelevantDocSnippets } = require('./docSnippetService');

function normalizeText(text = '') {
  return String(text).replace(/\s+/g, ' ').trim();
}

function hashQuestion(moduleSlug, questionText) {
  return crypto.createHash('sha1').update(`${moduleSlug}::${questionText}`).digest('hex');
}

function tokenize(text = '') {
  return normalizeText(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s/-]/g, ' ')
    .split(/\s+/)
    .filter((term) => term.length >= 4)
    .filter((term) => !['which', 'what', 'when', 'where', 'that', 'this', 'with', 'from', 'into', 'under', 'your', 'their', 'because', 'about', 'would', 'could', 'should'].includes(term));
}

function buildLessonMatchMap() {
  const map = new Map();

  CURRICULUM_MODULES.forEach((module) => {
    const lessons = (module.lessons || []).map((lesson) => {
      const corpus = [
        lesson.title,
        ...(lesson.mustMemorize || lesson.whatYouMustKnow || []),
        lesson.whyItMatters,
        lesson.interviewDrill,
        lesson.formulas
      ].filter(Boolean).join(' ');

      return {
        title: lesson.title,
        docsRefs: lesson.docsRefs || [],
        corpus,
        tokens: tokenize(corpus)
      };
    });

    map.set(module.slug, lessons);
  });

  return map;
}

const LESSON_MATCH_MAP = buildLessonMatchMap();

function selectBestDocsRefs(question) {
  const lessons = LESSON_MATCH_MAP.get(question.module_slug) || [];
  const qTokens = tokenize(`${question.q} ${question.explanation} ${question.interviewTip || ''}`);

  let best = null;
  let bestScore = -1;

  lessons.forEach((lesson) => {
    const score = qTokens.reduce((sum, token) => sum + (lesson.tokens.includes(token) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      best = lesson;
    }
  });

  if (best && best.docsRefs?.length) return best.docsRefs;
  return lessons.flatMap((lesson) => lesson.docsRefs || []).slice(0, 3);
}

function summarizeSnippet(snippet, question) {
  if (!snippet?.content) return '';
  const text = normalizeText(snippet.content);
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  const terms = tokenize(`${question.q} ${question.explanation} ${question.interviewTip || ''}`);

  const ranked = sentences
    .map((sentence) => ({
      sentence,
      score: terms.reduce((sum, term) => sum + (sentence.toLowerCase().includes(term) ? 2 : 0), 0)
    }))
    .sort((a, b) => b.score - a.score || a.sentence.length - b.sentence.length)
    .slice(0, 2)
    .map((item) => item.sentence);

  const summary = ranked.join(' ');
  return summary || text.slice(0, 320);
}

function isUsefulExcerptSummary(summary = '') {
  const text = normalizeText(summary);
  const lower = text.toLowerCase();
  if (!text) return false;
  if (text.length < 70) return false;
  if (countWeakSignals(text) >= 2) return false;
  if (/0x\.\.\.|asset=0x|vault_v2_factory|adapter_registry|morpho registry address/i.test(text)) return false;
  if (/^#|^####/.test(text)) return false;
  if (/developer hub for morpho tools|comprehensive data about markets|quick navigation/i.test(lower)) return false;
  if (/approve the\s+\[?morpho contract\]?/i.test(text)) return false;
  return true;
}

function countWeakSignals(text = '') {
  let count = 0;
  if (/\[[^\]]+\]\((https?:\/\/[^)\s]+|\/[^)\s]+)\)/.test(text)) count += 1;
  if ((text.match(/https?:\/\//g) || []).length >= 1) count += 1;
  if ((text.match(/#{1,6}\s+/g) || []).length >= 1) count += 1;
  if ((text.match(/\b[A-Z_]{4,}\b/g) || []).length >= 3) count += 1;
  return count;
}

function buildSourceAreaGuidance(docsRefs = []) {
  if (!docsRefs.length) return '';
  const labels = docsRefs
    .map((ref) => ref.title)
    .filter(Boolean)
    .slice(0, 3);

  if (!labels.length) return '';
  return `Best docs to review for this concept: ${labels.join(', ')}.`;
}

function selectUsefulDocSnippets(question, docSnippets = []) {
  return docSnippets.filter((snippet) => {
    const summary = summarizeSnippet(snippet, question);
    return isUsefulExcerptSummary(summary);
  });
}

function buildSpecificTeachingNote(question) {
  const q = question.q.toLowerCase();
  const answer = question.options[question.correct];

  if (q.includes('five values define a morpho market')) {
    return 'Those five parameters are the market identity itself. If any one of them changes, you are no longer talking about the same market. That is why Morpho market identity is discussed as immutable configuration rather than a pool that governance can reshape later.';
  }
  if (q.includes('isolated lending')) {
    return 'The key contrast with pooled lending is blast radius. In Morpho Blue, a market-level failure does not automatically spread across unrelated collateral and borrowers in a shared pool.';
  }
  if (q.includes('canonical morpho blue contract address')) {
    return 'This is a recall question, but the important operating habit is not just memorization. You should know the canonical address and still verify chain-specific supporting contracts like Bundler3, factories, and registries on the official addresses page.';
  }
  if (q.includes('1e36')) {
    return 'The 1e36 scaling matters because Morpho oracles quote collateral in units of the loan asset with high precision. If an integration gets this scale wrong, collateral value, LTV, Health Factor, and liquidation-price calculations all drift.';
  }
  if (q.includes('liquidatable when') || q.includes('health factor')) {
    return 'HF is best treated as a safety buffer, not just a ratio. Once it reaches 1 or below, the position is in the liquidation zone. Good product surfaces warn users well before that threshold.';
  }
  if (q.includes('liquidated at roughly 85% ltv')) {
    return 'This is a timing-and-math question. Partners should be reminded that UI snapshots are approximate, while onchain liquidation uses the live oracle price, accrued debt, and exact execution-time state.';
  }
  if (q.includes('lifecycle') || q.includes('lif')) {
    return 'LIF controls how much collateral a liquidator can seize for repaying debt. As LLTV rises, Morpho compresses LIF to avoid excessive liquidation incentives on already riskier markets.';
  }
  if (q.includes('vault v2 governance and operations') || q.includes('roles is correct')) {
    return 'Vault V2 security relies on separation of powers. Owner, Curator, Allocator, and Sentinel are intentionally distinct so no single operational role automatically inherits the whole control surface.';
  }
  if (q.includes('minimum timelock for addadapter') || q.includes('minimum timelock for removeadapter')) {
    return 'The design principle is delayed risk increase and immediate risk reduction. That is the partner-facing way to explain why timelocks are asymmetric instead of uniform.';
  }
  if (q.includes('cap layers') || q.includes('iddata encoding')) {
    return 'Vault V2 caps are layered because the curator may want to limit exposure by adapter, by collateral family, and by exact market at the same time. The encoded ids make that abstraction possible without rewriting vault logic.';
  }
  if (q.includes('socialize losses')) {
    return 'Losses are socialized through share-price depreciation, not by burning specific user shares. That matters for dashboards, because a depositor can see asset value decline even if no withdrawal happened.';
  }
  if (q.includes('adaptivecurveirm targets')) {
    return 'The 90% utilization target is central to the rate model. Below target, rates are gentler; above target, they steepen sharply to pull utilization back toward a healthier liquidity posture.';
  }
  if (q.includes('supply apy')) {
    return 'Supply APY is downstream of borrow APY, fees, and utilization. That is why a dashboard should never imply lenders automatically earn the same rate borrowers pay.';
  }
  if (q.includes('liquidation price')) {
    return 'Liquidation price is a user-facing translation of the HF threshold. It tells the user which collateral price would push the position right to HF = 1.';
  }
  if (q.includes('rounding dust')) {
    return 'Tiny residual balances after deallocate often come from share-to-asset rounding, not a protocol failure. That distinction is important when triaging partner “bug” reports.';
  }
  if (q.includes('main graphql endpoint')) {
    return 'This is simple recall, but the higher-value takeaway is that the API is an indexed read layer. You use it for dashboards and analytics, not as execution truth.';
  }
  if (q.includes('rate limit')) {
    return 'The rate limit matters operationally because it forces good query hygiene. Teams that ignore it tend to build fragile polling behavior and then blame the API when the real problem is architecture.';
  }
  if (q.includes('production posture for morpho api usage') || q.includes('separate contracts, sdks, and api')) {
    return 'Contracts, SDKs, and API should each do the job they are best at: contracts for execution truth, SDKs for ergonomics and offchain computation, and the API for indexed read paths. Mixing those responsibilities loosely is how dashboards drift from protocol reality.';
  }
  if (q.includes('graphql complexity')) {
    return 'The important practical lesson is not just the number. Partners should keep selection sets narrow, reduce fan-out, and split heavy queries instead of trying to brute-force everything through one enormous request.';
  }
  if (q.includes('bundler3')) {
    return 'Bundler3 matters when multi-step flows are state-dependent. If a leverage, refinance, or borrow-swap-resupply flow partially completes, the user can end up in a worse or riskier state. Atomic execution avoids that.';
  }
  if (q.includes('execution state in production')) {
    return 'A mature partner answer separates read convenience from execution truth. Indexed APIs and SDK views are helpful, but settlement and final state live onchain.';
  }

  return answer.length < 140
    ? `The learning goal here is not just memorizing **${answer}**. You should be able to explain the mechanism behind it in partner-safe language and connect it to product behavior or implementation risk.`
    : '';
}

function buildExpandedExplanation(question, docSnippets) {
  const correctAnswer = question.options[question.correct];
  const core = normalizeText(question.explanation);
  const interviewTip = normalizeText(question.interviewTip || '');
  const usefulSnippets = selectUsefulDocSnippets(question, docSnippets);
  const excerptSummaries = usefulSnippets
    .map((snippet) => summarizeSnippet(snippet, question))
    .filter(isUsefulExcerptSummary);
  const teachingNote = buildSpecificTeachingNote(question);
  const sourceGuidance = buildSourceAreaGuidance(selectBestDocsRefs(question));

  const parts = [
    `The correct answer is **${correctAnswer}**.`,
    core ? `This is right because ${core.charAt(0).toLowerCase()}${core.slice(1)}` : '',
    teachingNote,
    excerptSummaries[0] ? `From the Morpho docs context: ${excerptSummaries[0]}` : '',
    excerptSummaries[1] ? `Additional Morpho context: ${excerptSummaries[1]}` : '',
    !excerptSummaries.length && sourceGuidance ? sourceGuidance : '',
    interviewTip ? `Interview angle: ${interviewTip}` : ''
  ].filter(Boolean);

  return parts.join('\n\n');
}

function seedQuizExplanations(db) {
  const insert = db.prepare(`
    INSERT INTO quiz_explanations (
      quiz_bank_id, module_slug, question_text, expanded_explanation,
      doc_excerpt_1, doc_excerpt_2, source_refs, question_hash
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const bankRows = db.prepare(`
    SELECT id, question, module_slug
    FROM quiz_bank
    ORDER BY id ASC
  `).all();

  QUIZ_QUESTIONS.forEach((question) => {
    const docsRefs = selectBestDocsRefs(question);
    const docSnippets = findRelevantDocSnippets(db, {
      lessonTitle: question.q,
      question,
      docsRefs
    }, 2);
    const usefulSnippets = selectUsefulDocSnippets(question, docSnippets);
    const expandedExplanation = buildExpandedExplanation(question, docSnippets);
    const bankRow = bankRows.find((row) => row.question === question.q && row.module_slug === question.module_slug);

    insert.run(
      bankRow?.id || null,
      question.module_slug,
      question.q,
      expandedExplanation,
      usefulSnippets[0]?.content || null,
      usefulSnippets[1]?.content || null,
      JSON.stringify(docsRefs),
      hashQuestion(question.module_slug, question.q)
    );
  });

  console.log(`  ✓ Seeded ${QUIZ_QUESTIONS.length} quiz explanations`);
}

function getQuizExplanation(db, questionText, moduleSlug = '') {
  return db.prepare(`
    SELECT *
    FROM quiz_explanations
    WHERE question_text = ? AND module_slug = ?
    LIMIT 1
  `).get(questionText, moduleSlug);
}

module.exports = {
  seedQuizExplanations,
  getQuizExplanation
};
