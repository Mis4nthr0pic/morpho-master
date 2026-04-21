/**
 * Database Seeding
 * Refreshes content tables while preserving user progress/history tables.
 */

const { CURRICULUM_MODULES } = require('../../content/curriculum-data');
const { QUIZ_QUESTIONS } = require('../../content/quiz-questions');
const { CODE_CHALLENGES } = require('../../content/code-challenges');
const { OPEN_ENDED_QUESTIONS } = require('../services/llmService');
const { rebalanceOptionLengths } = require('../utils/quizOptionBalancer');
const { seedQuickLearningUnits } = require('../services/quickLearningService');
const { seedDocSnippets } = require('../services/docSnippetService');
const { seedQuizExplanations } = require('../services/quizExplanationService');

function seedDatabase(db) {
  console.log('🌱 Refreshing content tables...');

  db.pragma('foreign_keys = OFF');

  try {
    const refresh = db.transaction(() => {
      db.prepare('DELETE FROM lessons').run();
      db.prepare('DELETE FROM curriculum_modules').run();
      db.prepare('DELETE FROM quiz_bank').run();
      db.prepare('DELETE FROM code_challenges').run();
      db.prepare('DELETE FROM llm_evaluations').run();
      db.prepare('DELETE FROM quiz_explanations').run();
      db.prepare('DELETE FROM doc_snippets').run();
      db.prepare('DELETE FROM quick_learning_units').run();
      db.prepare("UPDATE quick_learning_sessions SET status = 'abandoned', updated_at = datetime('now') WHERE status = 'active'").run();

      // Reset autoincrement ids so module ids and question ids stay predictable after refresh.
      db.prepare("DELETE FROM sqlite_sequence WHERE name IN ('lessons', 'curriculum_modules', 'quiz_bank', 'code_challenges', 'llm_evaluations', 'quiz_explanations', 'doc_snippets', 'quick_learning_units')").run();

      const maps = seedCurriculum(db);
      seedQuizBank(db);
      seedCodeChallenges(db);
      seedLLMQuestions(db);
      seedDocSnippets(db);
      seedQuizExplanations(db);
      seedQuickLearningUnits(db, maps);
    });

    refresh();
  } finally {
    db.pragma('foreign_keys = ON');
  }

  console.log('✓ Content tables refreshed successfully');
}

function seedCurriculum(db) {
  const insertModule = db.prepare(`
    INSERT INTO curriculum_modules (slug, title, duration_hours, category, summary, objective, format, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertLesson = db.prepare(`
    INSERT INTO lessons (
      module_id,
      title,
      body,
      estimated_minutes,
      sort_order,
      docs_refs,
      tips,
      talking_points,
      what_you_must_know,
      why_it_matters,
      implementation_checks,
      interview_drill,
      formulas
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const moduleIdBySlug = {};
  const lessonIdByKey = {};

  CURRICULUM_MODULES.forEach((module, moduleIndex) => {
    const moduleResult = insertModule.run(
      module.slug,
      module.title,
      module.durationHours || 1,
      module.category || 'core',
      module.summary || '',
      module.objective || '',
      module.format || 'read-drill-test',
      moduleIndex
    );

    const moduleId = moduleResult.lastInsertRowid;
    moduleIdBySlug[module.slug] = moduleId;

    (module.lessons || []).forEach((lesson, lessonIndex) => {
      const lessonResult = insertLesson.run(
        moduleId,
        lesson.title,
        lesson.body || '',
        lesson.estimatedMinutes || 20,
        lessonIndex,
        JSON.stringify(lesson.docsRefs || []),
        lesson.tips || '',
        lesson.talkingPoints || '',
        (lesson.whatYouMustKnow || lesson.mustMemorize || []).join('\n'),
        lesson.whyItMatters || '',
        lesson.implementationChecks || '',
        lesson.interviewDrill || '',
        lesson.formulas || ''
      );
      lessonIdByKey[`${module.slug}:${lessonIndex}`] = lessonResult.lastInsertRowid;
    });
  });

  console.log(`  ✓ Seeded ${CURRICULUM_MODULES.length} modules`);
  return { moduleIdBySlug, lessonIdByKey };
}

function seedQuizBank(db) {
  const insert = db.prepare(`
    INSERT INTO quiz_bank (
      question,
      options,
      correct,
      explanation,
      category,
      difficulty,
      interview_tip,
      module_slug
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const shuffleOptions = (question) => {
    const indexed = question.options.map((text, index) => ({
      text,
      isCorrect: index === question.correct
    }));

    for (let i = indexed.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
    }

    return {
      ...question,
      options: indexed.map((item) => item.text),
      correct: indexed.findIndex((item) => item.isCorrect)
    };
  };

  QUIZ_QUESTIONS.forEach((question) => {
    const balanced = rebalanceOptionLengths(question);
    const shuffled = shuffleOptions(balanced);
    insert.run(
      shuffled.q,
      JSON.stringify(shuffled.options),
      shuffled.correct,
      shuffled.explanation,
      shuffled.category,
      shuffled.difficulty,
      shuffled.interviewTip || shuffled.explanation,
      shuffled.module_slug
    );
  });

  console.log(`  ✓ Seeded ${QUIZ_QUESTIONS.length} quiz questions`);
}

function seedCodeChallenges(db) {
  const insert = db.prepare(`
    INSERT INTO code_challenges (slug, title, difficulty, description, starter_code, solution, test_cases, hints)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  CODE_CHALLENGES.forEach((challenge) => {
    insert.run(
      challenge.id,
      challenge.title,
      challenge.difficulty,
      challenge.description,
      challenge.starterCode,
      challenge.solution,
      JSON.stringify(challenge.testCases || []),
      JSON.stringify(challenge.hints || [])
    );
  });

  console.log(`  ✓ Seeded ${CODE_CHALLENGES.length} code challenges`);
}

function seedLLMQuestions(db) {
  const insert = db.prepare(`
    INSERT INTO llm_evaluations (question, category, difficulty, rubric, follow_up)
    VALUES (?, ?, ?, ?, ?)
  `);

  OPEN_ENDED_QUESTIONS.forEach((question) => {
    insert.run(
      question.question,
      question.category,
      question.difficulty,
      JSON.stringify(question.rubric),
      question.followUp || ''
    );
  });

  console.log(`  ✓ Seeded ${OPEN_ENDED_QUESTIONS.length} LLM questions`);
}

module.exports = { seedDatabase };
