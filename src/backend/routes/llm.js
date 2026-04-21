/**
 * LLM Practice Routes
 */

const express = require('express');
const router = express.Router();
const { evaluateInterviewAnswer } = require('../services/openRouterService');
const {
  OPEN_ENDED_QUESTIONS,
  getQuestionEvaluationContext,
  getDocsReferenceSnippets,
  getQuestionIntent,
  getExpectedAnswerBlueprint
} = require('../services/llmService');

function mapQuestionRow(row) {
  const rubric = JSON.parse(row.rubric || '[]');
  const title = row.question.length > 72 ? `${row.question.slice(0, 69)}...` : row.question;
  const sourceQuestion = OPEN_ENDED_QUESTIONS.find((entry) => Number(entry.id) === Number(row.id)) || {
    question: row.question,
    category: row.category,
    difficulty: row.difficulty,
    rubric,
    followUp: row.follow_up || '',
    goldAnswer: '',
    goldFollowUpAnswer: '',
    goldAnswerSources: []
  };

  return {
    id: row.id,
    title,
    question: row.question,
    category: row.category,
    difficulty: row.difficulty,
    rubric,
    followUp: row.follow_up || '',
    minWords: 70,
    maxWords: 220,
    estimatedEvalCost: 'OpenRouter',
    evaluatorContext: {
      intent: getQuestionIntent(sourceQuestion),
      notes: getQuestionEvaluationContext(sourceQuestion),
      docsSnippets: getDocsReferenceSnippets(sourceQuestion, 3),
      expectedAnswer: getExpectedAnswerBlueprint(sourceQuestion),
      goldAnswer: sourceQuestion.goldAnswer || '',
      goldFollowUpAnswer: sourceQuestion.goldFollowUpAnswer || '',
      goldAnswerSources: sourceQuestion.goldAnswerSources || []
    },
    evaluationCriteria: {
      mustInclude: rubric,
      bonusPoints: row.follow_up ? [`Be ready for follow-up: ${row.follow_up}`] : []
    }
  };
}

function normalizeOpenRouterEvaluation(result) {
  const gradeToRating = {
    excellent: 'excellent',
    good: 'good',
    acceptable: 'needs-improvement',
    'needs-work': 'needs-improvement',
    insufficient: 'keep-practicing'
  };

  const normalizedImprovements = []
    .concat(
      result.improvements
        ? String(result.improvements)
            .split('\n')
            .map((line) => line.replace(/^[-*]\s*/, '').trim())
            .filter(Boolean)
        : []
    )
    .concat(result.missedPoints || [])
    .filter((item, index, array) => array.indexOf(item) === index);

  const normalizedStrengths = result.feedback
    ? String(result.feedback)
        .split(/[.!?]\s+/)
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 3)
    : [];

  return {
    score: result.score,
    rating: gradeToRating[result.grade] || 'needs-improvement',
    estimatedCost: result.source === 'openrouter' ? 'OpenRouter' : 'OpenRouter fallback',
    breakdown: null,
    summary: result.feedback || 'Evaluation completed.',
    strengths: normalizedStrengths,
    improvements: normalizedImprovements.slice(0, 5),
    coverage: {
      hit: normalizedStrengths,
      missing: normalizedImprovements.slice(0, 5)
    },
    source: result.source || 'openrouter'
  };
}

router.get('/questions', (req, res) => {
  const db = req.app.locals.db;

  const questions = db.prepare(`
    SELECT id, question, category, difficulty, rubric, follow_up
    FROM llm_evaluations
    ORDER BY id
  `).all();

  res.json({
    questions: questions.map(mapQuestionRow)
  });
});

router.get('/questions/:id', (req, res) => {
  const db = req.app.locals.db;
  const row = db.prepare(`
    SELECT id, question, category, difficulty, rubric, follow_up
    FROM llm_evaluations
    WHERE id = ?
  `).get(req.params.id);

  if (!row) {
    return res.status(404).json({ error: 'Question not found' });
  }

  res.json(mapQuestionRow(row));
});

router.post('/evaluate', async (req, res) => {
  const db = req.app.locals.db;
  const { questionId, answer } = req.body;
  const normalizedQuestionId = Number(questionId);

  if (!normalizedQuestionId || !answer) {
    return res.status(400).json({ error: 'Question ID and answer required' });
  }

  const row = db.prepare('SELECT * FROM llm_evaluations WHERE id = ?').get(normalizedQuestionId);
  if (!row) {
    return res.status(404).json({ error: 'Question not found' });
  }

  const rubric = JSON.parse(row.rubric || '[]');
  const sourceQuestion = OPEN_ENDED_QUESTIONS.find((entry) => Number(entry.id) === normalizedQuestionId) || {
    question: row.question,
    category: row.category,
    difficulty: row.difficulty,
    rubric,
    followUp: row.follow_up || '',
    goldAnswer: '',
    goldFollowUpAnswer: '',
    goldAnswerSources: []
  };
  const context = [
    row.category ? `Category: ${row.category}` : '',
    row.difficulty ? `Difficulty: ${row.difficulty}` : ''
  ].filter(Boolean).join('\n');

  try {
    const openRouterResult = await evaluateInterviewAnswer(row.question, answer, {
      context,
      rubric,
      followUp: row.follow_up || '',
      category: row.category || '',
      difficulty: row.difficulty || '',
      questionIntent: getQuestionIntent(sourceQuestion),
      referenceNotes: getQuestionEvaluationContext(sourceQuestion),
      docsSnippets: getDocsReferenceSnippets(sourceQuestion, 4),
      expectedAnswer: getExpectedAnswerBlueprint(sourceQuestion),
      goldAnswerSources: sourceQuestion.goldAnswerSources || []
    });
    const evaluation = normalizeOpenRouterEvaluation(openRouterResult);

    db.prepare(`
      INSERT INTO llm_history (user_id, question_id, answer, score, feedback)
      VALUES (1, ?, ?, ?, ?)
    `).run(row.id, answer, evaluation.score, evaluation.summary);

    res.json({
      success: true,
      evaluation,
      promptPackage: openRouterResult.promptPackage || null
    });
  } catch (error) {
    console.error('Evaluation error:', error);
    res.status(500).json({ error: 'Evaluation failed' });
  }
});

router.post('/evaluate-drill', async (req, res) => {
  const db = req.app.locals.db;
  const { prompt, answer, questionId } = req.body;

  if (!prompt || !answer) {
    return res.status(400).json({ error: 'Prompt and answer required' });
  }

  try {
    const normalizedQuestionId = Number(questionId);
    let row = null;
    let sourceQuestion = {
      question: prompt,
      category: '',
      difficulty: '',
      rubric: [],
      followUp: '',
      goldAnswer: '',
      goldFollowUpAnswer: '',
      goldAnswerSources: []
    };
    if (normalizedQuestionId) {
      row = db.prepare(`
        SELECT id, question, category, difficulty, rubric, follow_up
        FROM llm_evaluations
        WHERE id = ?
      `).get(normalizedQuestionId);
      if (row) {
        sourceQuestion = OPEN_ENDED_QUESTIONS.find((entry) => Number(entry.id) === normalizedQuestionId) || {
          question: row.question,
          category: row.category,
          difficulty: row.difficulty,
          rubric: JSON.parse(row.rubric || '[]'),
          followUp: row.follow_up || '',
          goldAnswer: '',
          goldFollowUpAnswer: '',
          goldAnswerSources: []
        };
      }
    }

    const evaluation = await evaluateInterviewAnswer(prompt, answer, {
      rubric: row ? JSON.parse(row.rubric || '[]') : sourceQuestion.rubric || [],
      followUp: row?.follow_up || sourceQuestion.followUp || '',
      category: row?.category || sourceQuestion.category || '',
      difficulty: row?.difficulty || sourceQuestion.difficulty || '',
      context: row ? `Category: ${row.category}\nDifficulty: ${row.difficulty}` : '',
      questionIntent: getQuestionIntent(sourceQuestion),
      referenceNotes: getQuestionEvaluationContext(sourceQuestion),
      docsSnippets: getDocsReferenceSnippets(sourceQuestion, 4),
      expectedAnswer: getExpectedAnswerBlueprint(sourceQuestion),
      goldAnswerSources: sourceQuestion.goldAnswerSources || []
    });

    if (normalizedQuestionId) {
      if (row) {
        db.prepare(`
          INSERT INTO llm_history (user_id, question_id, answer, score, feedback)
          VALUES (1, ?, ?, ?, ?)
        `).run(row.id, answer, evaluation.score, evaluation.feedback || evaluation.improvements || '');
      }
    }

    res.json({
      success: true,
      evaluation: normalizeOpenRouterEvaluation(evaluation),
      promptPackage: evaluation.promptPackage || null
    });
  } catch (error) {
    console.error('Evaluation error:', error);
    res.status(500).json({ error: 'Evaluation failed' });
  }
});

router.get('/history', (req, res) => {
  const db = req.app.locals.db;

  const history = db.prepare(`
    SELECT h.*, le.question, le.category
    FROM llm_history h
    JOIN llm_evaluations le ON h.question_id = le.id
    WHERE h.user_id = 1
    ORDER BY h.submitted_at DESC
    LIMIT 20
  `).all();

  res.json(history);
});

module.exports = router;
