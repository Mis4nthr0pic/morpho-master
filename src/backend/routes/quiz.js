/**
 * Quiz Routes
 */

const express = require('express');
const router = express.Router();
const { QUIZ_QUESTIONS } = require('../../content/quiz-questions');
const { rebalanceOptionLengths } = require('../utils/quizOptionBalancer');
const { getQuizExplanation } = require('../services/quizExplanationService');

const LESSON_QUIZ_RULES = {
  'Morpho Blue in One Minute': { categories: ['protocol-knowledge', 'partner-scenario'], keywords: ['morpho', 'blue', 'pooled', 'aave'] },
  'Isolated vs Pooled Lending': { categories: ['protocol-knowledge', 'partner-scenario'], keywords: ['isolated', 'pooled', 'lending', 'risk surface'] },
  'Market IDs, Addresses, and Contract Landmarks': { categories: ['protocol-knowledge'], keywords: ['address', 'bundler3', 'factory', 'registry', '0xbbbbb'] },
  'Collateral, LTV, and Health Factor': { categories: ['math', 'partner-scenario'], keywords: ['health factor', 'ltv', 'collateral', 'liquidation price'] },
  'Liquidation Math, LIF, and Bad Debt': { categories: ['liquidations', 'math', 'partner-scenario'], keywords: ['lif', 'bad debt', 'liquidation', '1 / lif'] },
  'Oracles, Pricing, and Why 1e36 Matters': { categories: ['math', 'integration', 'partner-scenario'], keywords: ['oracle', '1e36', 'price', 'decimal'] },

  'What Vault V2 Actually Is': { categories: ['vault-v2'], keywords: ['vault v2', 'erc4626', 'maxdeposit'] },
  'Roles and Exact Permissions': { categories: ['vault-v2'], keywords: ['owner', 'curator', 'allocator', 'sentinel'] },
  'Timelocks: What Is Immediate vs Timelocked': { categories: ['vault-v2'], keywords: ['timelock', 'addadapter', 'removeadapter', 'increaseabsolutecap'] },
  'Adapters, Factories, and Liquidity Adapter Flow': { categories: ['vault-v2'], keywords: ['adapter', 'liquidity adapter', 'factory', 'marketv1adapterv2'] },
  'Caps System: Absolute, Relative, and Abstract IDs': { categories: ['vault-v2'], keywords: ['cap', 'absolute', 'relative', 'iddata', 'collateraltoken'] },
  'Loss Socialization and Share Price Depreciation': { categories: ['vault-v2'], keywords: ['loss socialization', 'share price', 'realassets', 'depreciation'] },

  'Formula Sheet: Position Math': { categories: ['math'], keywords: ['health factor', 'ltv', 'liquidation price', 'collateral value'] },
  'AdaptiveCurveIRM APY Math': { categories: ['math'], keywords: ['adaptivecurveirm', 'apy', 'utilization', 'supply apy', '90%'] },
  'Liquidation Regimes, Pre-Liquidation, and Incentive Math': { categories: ['math', 'liquidations'], keywords: ['pre-liquidation', 'lif', 'liquidatable', 'bad debt'] },
  'Shares, Assets, Rounding, and UX Safety Buffers': { categories: ['math', 'integration'], keywords: ['share', 'asset', 'rounding', 'buffer', 'dust'] },

  'Choosing the Right Integration Surface': { categories: ['integration', 'partner-scenario'], keywords: ['graphql', 'contracts', 'sdk', 'api'] },
  'Blue SDK and Direct Contract Patterns': { categories: ['integration'], keywords: ['marketparams', 'share', 'asset', 'sdk', 'contract'] },
  'Permits, Approvals, and Shares vs Assets': { categories: ['integration'], keywords: ['permit', 'approval', 'share', 'asset', 'allowance'] },
  'Bundler3 for Atomic Flows': { categories: ['integration', 'partner-scenario'], keywords: ['bundler3', 'atomic', 'leverage', 'revert'] },
  'Morpho API, GraphQL Complexity, and Fallback Design': { categories: ['integration'], keywords: ['graphql', 'api', 'complexity', 'cache', 'fallback'] },
  'Security Checklist for Real Integrations': { categories: ['integration', 'partner-scenario'], keywords: ['oracle', 'fallback', 'production', 'security', 'stale'] },

  'The Merkl + Morpho Recipe Pattern': { categories: ['merkl', 'partner-scenario'], keywords: ['merkl', 'recipe', 'dashboard', 'rewards'] },
  'Exact GraphQL Queries for Vault Lists, APY, and Rewards': { categories: ['merkl'], keywords: ['graphql', 'vaultv2s', 'rewards', 'apy'] },
  'Merkl Rewards, Claim Context, and Combined Yield Display': { categories: ['merkl'], keywords: ['merkl', 'claim', 'combined yield', 'reward apr'] },
  'Frontend Hooks, BigInt Safety, and Error Handling': { categories: ['merkl'], keywords: ['bigint', 'error', 'partial failure', 'frontend'] },
  'How to Use This Pattern in a Partner Demo': { categories: ['merkl', 'partner-scenario'], keywords: ['poc', 'partner demo', 'claim', 'combined yield'] },

  'Translate Tech into Business Value': { categories: ['communication'], keywords: ['business value', 'translate', 'partner'] },
  'Run Better Discovery and Scoping Calls': { categories: ['communication'], keywords: ['scope', 'discovery', 'workflow', 'integrating'] },
  'Answer: Why Morpho over Aave or Compound?': { categories: ['communication', 'partner-scenario'], keywords: ['aave', 'compound', 'why morpho'] },
  'Handle Liquidation and Risk Objections': { categories: ['communication', 'partner-scenario'], keywords: ['liquidation', 'risk', 'objection', 'health factor'] },
  'Timezone Bridging, Escalations, and Closing the Loop': { categories: ['communication'], keywords: ['timezone', 'escalation', 'bug', 'feedback', 'support'] },

  'Fastest High-Value POC Patterns': { categories: ['poc-design', 'partner-scenario'], keywords: ['poc', 'dashboard', 'simulator'] },
  'Dashboard Data Model: Positions, HF, Yield, Rewards': { categories: ['poc-design'], keywords: ['dashboard', 'hf', 'yield', 'rewards', 'positions'] },
  'Public Allocator and Liquidity Monitoring': { categories: ['poc-design'], keywords: ['public allocator', 'liquidity', 'reallocate', 'curator fee'] },

  '60-Second Pitch Library': { categories: ['interview'], keywords: ['60-second', 'pitch', 'protocol answer'] },
  'Mock Partner Call Framework': { categories: ['interview', 'partner-scenario'], keywords: ['partner call', 'scope', 'architecture'] },
  'Technical Whiteboard Drills': { categories: ['interview'], keywords: ['whiteboard', 'dashboard', 'bundler3', 'hf'] },

  'Final Formula and Address Sprint': { categories: ['math', 'protocol-knowledge', 'vault-v2'], keywords: ['formula', 'address', 'bundler3', 'vaultv2factory'] },
  'Documentation and Bug-Forwarding Mindset': { categories: ['review', 'communication'], keywords: ['documentation', 'bug', 'feedback', 'escalation'] }
};

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function shuffleStoredQuestion(question) {
  const options = rebalanceOptionLengths({
    options: JSON.parse(question.options || '[]')
  }).options;
  const indexedOptions = options.map((text, optionIndex) => ({
    text,
    isCorrect: optionIndex === question.correct
  }));

  for (let i = indexedOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexedOptions[i], indexedOptions[j]] = [indexedOptions[j], indexedOptions[i]];
  }

  return {
    ...question,
    options: indexedOptions.map((item) => item.text),
    correct: indexedOptions.findIndex((item) => item.isCorrect)
  };
}

function shuffleSourceQuestion(question) {
  const indexedOptions = question.options.map((text, optionIndex) => ({
    text,
    isCorrect: optionIndex === question.correct
  }));

  for (let i = indexedOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexedOptions[i], indexedOptions[j]] = [indexedOptions[j], indexedOptions[i]];
  }

  return {
    ...question,
    options: indexedOptions.map((item) => item.text),
    correct: indexedOptions.findIndex((item) => item.isCorrect)
  };
}

function normalizeSourceQuestion(question, index) {
  const shuffled = shuffleSourceQuestion(rebalanceOptionLengths(question));

  return {
    id: `source-${index}`,
    question: shuffled.q,
    options: shuffled.options,
    correct: shuffled.correct,
    explanation: shuffled.explanation,
    category: shuffled.category,
    difficulty: shuffled.difficulty,
    interview_tip: shuffled.interviewTip || ''
  };
}

function attachStoredExplanation(db, questionLike, moduleSlug) {
  const explanation = getQuizExplanation(db, questionLike.question, moduleSlug);
  if (!explanation) {
    return {
      ...questionLike,
      expandedExplanation: questionLike.explanation,
      docsSnippets: questionLike.docsSnippets || [],
      docsRefs: questionLike.docsRefs || []
    };
  }

  const docsSnippets = [explanation.doc_excerpt_1, explanation.doc_excerpt_2].filter(Boolean);
  let docsRefs = [];
  try {
    docsRefs = JSON.parse(explanation.source_refs || '[]');
  } catch (error) {
    docsRefs = [];
  }

  return {
    ...questionLike,
    expandedExplanation: explanation.expanded_explanation || questionLike.explanation,
    docsSnippets,
    docsRefs
  };
}

function textForSearch(question) {
  return `${question.q} ${question.explanation} ${question.interviewTip || ''}`.toLowerCase();
}

function getLessonAwareQuestions(db, moduleSlug, lessonTitle, docsRefs, limit) {
  const rule = LESSON_QUIZ_RULES[lessonTitle];
  const normalizedLimit = Number(limit) || 3;

  let candidates = QUIZ_QUESTIONS;

  if (rule?.categories?.length) {
    candidates = candidates.filter((question) => rule.categories.includes(question.category));
  }

  if (rule?.keywords?.length) {
    candidates = candidates.filter((question) => {
      const haystack = textForSearch(question);
      return rule.keywords.some((keyword) => haystack.includes(keyword.toLowerCase()));
    });
  }

  if (candidates.length < normalizedLimit) {
    const sameModule = QUIZ_QUESTIONS.filter((question) => question.module_slug === moduleSlug);
    const existing = new Set(candidates.map((question) => question.q));
    sameModule.forEach((question) => {
      if (!existing.has(question.q)) {
        candidates.push(question);
      }
    });
  }

  if (candidates.length < normalizedLimit) {
    const existing = new Set(candidates.map((question) => question.q));
    QUIZ_QUESTIONS.forEach((question) => {
      if (!existing.has(question.q)) {
        candidates.push(question);
      }
    });
  }

  return shuffle(candidates)
    .slice(0, normalizedLimit)
    .map((question, index) => {
      const normalized = normalizeSourceQuestion(question, index);
      const enriched = attachStoredExplanation(db, normalized, moduleSlug);
      return {
        ...normalized,
        expandedExplanation: enriched.expandedExplanation,
        docsSnippets: enriched.docsSnippets,
        docsRefs: enriched.docsRefs.length ? enriched.docsRefs : docsRefs
      };
    });
}

router.get('/questions', (req, res) => {
  const db = req.app.locals.db;
  const { mode = 'all', limit = 10, moduleId, lessonId } = req.query;

  if (moduleId && lessonId) {
    const db = req.app.locals.db;
    const lesson = db.prepare(`
      SELECT l.title AS lesson_title, l.docs_refs, m.slug AS module_slug
      FROM lessons l
      JOIN curriculum_modules m ON m.id = l.module_id
      WHERE m.id = ? AND l.id = ?
    `).get(moduleId, lessonId);

    if (!lesson) {
      return res.json([]);
    }

    let docsRefs = [];
    try {
      docsRefs = JSON.parse(lesson.docs_refs || '[]');
    } catch (error) {
      docsRefs = [];
    }

    return res.json(getLessonAwareQuestions(db, lesson.module_slug, lesson.lesson_title, docsRefs, limit));
  }

  let questions;

  switch (mode) {
    case 'fundamental':
      questions = db.prepare(`
        SELECT * FROM quiz_bank
        WHERE difficulty = 'fundamental'
        ORDER BY RANDOM()
        LIMIT ?
      `).all(limit);
      break;

    case 'intermediate':
      questions = db.prepare(`
        SELECT * FROM quiz_bank
        WHERE difficulty = 'intermediate'
        ORDER BY RANDOM()
        LIMIT ?
      `).all(limit);
      break;

    case 'weak':
      questions = db.prepare(`
        SELECT qb.* FROM quiz_bank qb
        JOIN quiz_results qr ON qb.id = qr.question_id
        WHERE qr.user_id = 1 AND qr.correct = 0
        ORDER BY RANDOM()
        LIMIT ?
      `).all(limit);

      if (questions.length < limit) {
        const additional = db.prepare(`
          SELECT * FROM quiz_bank
          WHERE id NOT IN (${questions.map((question) => question.id).join(',') || '0'})
          ORDER BY RANDOM()
          LIMIT ?
        `).all(limit - questions.length);
        questions = [...questions, ...additional];
      }
      break;

    default:
      questions = db.prepare(`
        SELECT * FROM quiz_bank
        ORDER BY RANDOM()
        LIMIT ?
      `).all(limit);
  }

  res.json(
    questions.map((question) => {
      const shuffled = shuffleStoredQuestion(question);
      return attachStoredExplanation(db, shuffled, question.module_slug);
    })
  );
});

router.post('/answer', (req, res) => {
  const db = req.app.locals.db;
  const { questionId, correct } = req.body;

  db.prepare(`
    INSERT INTO quiz_results (user_id, question_id, correct, answered_at)
    VALUES (1, ?, ?, datetime('now'))
  `).run(questionId, correct ? 1 : 0);

  res.json({ success: true });
});

router.get('/stats', (req, res) => {
  const db = req.app.locals.db;

  const stats = db.prepare(`
    SELECT
      qb.difficulty AS difficulty,
      COUNT(*) as total,
      SUM(CASE WHEN qr.correct = 1 THEN 1 ELSE 0 END) as correct
    FROM quiz_results qr
    JOIN quiz_bank qb ON qr.question_id = qb.id
    WHERE qr.user_id = 1
    GROUP BY qb.difficulty
  `).all();

  res.json(stats);
});

module.exports = router;
