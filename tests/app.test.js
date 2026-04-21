const test = require('node:test');
const assert = require('node:assert');
const Database = require('better-sqlite3');
const path = require('path');
const {
  main: initDatabase,
  getDocumentContext,
  parseMorphoDocsIndex
} = require('../src/backend/database/init');

const DB_PATH = path.join(__dirname, '../data/morpho_trainer.db');

initDatabase();

function getDB() {
  return new Database(DB_PATH, { readonly: true });
}

test('schema includes required hardcore tables', () => {
  const db = getDB();
  const expected = [
    'study_sessions',
    'progress',
    'quiz_results',
    'code_challenges',
    'daily_intensity',
    'curriculum_modules',
    'quiz_bank',
    'hotseat_scenarios',
    'writing_submissions',
    'app_config'
  ];

  const tables = db.prepare(`SELECT name FROM sqlite_master WHERE type = 'table'`).all().map((row) => row.name);
  expected.forEach((table) => assert.ok(tables.includes(table), `${table} should exist`));
  db.close();
});

test('study_sessions columns match the requested tracking model', () => {
  const db = getDB();
  const columns = db.prepare(`PRAGMA table_info(study_sessions)`).all().map((column) => column.name);
  [
    'start_time',
    'end_time',
    'total_minutes',
    'intensity_score',
    'interruptions',
    'code_lines_written',
    'concepts_mastered',
    'current_module',
    'streak_days'
  ].forEach((name) => assert.ok(columns.includes(name), `${name} column missing`));
  db.close();
});

test('curriculum keeps the four core tracks and expands into a large docs-driven syllabus', () => {
  const db = getDB();
  const modules = db.prepare(`SELECT slug, title, duration_hours, lesson_payload FROM curriculum_modules ORDER BY order_index`).all();
  assert.equal(modules.length, 4);
  assert.deepEqual(modules.map((module) => module.slug), [
    'defi-primitives',
    'morpho-architecture',
    'integration-patterns',
    'solution-architect'
  ]);
  const totalLessons = modules.reduce((sum, module) => sum + JSON.parse(module.lesson_payload).length, 0);
  assert.ok(totalLessons >= 600, `expected the full docs corpus to generate 600+ lessons, got ${totalLessons}`);
  db.close();
});

test('docs source resolves the full Morpho corpus from structured exports', () => {
  const { morphoDocsPages } = getDocumentContext();
  const pages = parseMorphoDocsIndex(morphoDocsPages);

  assert.equal(pages.length, 117, `expected 117 Morpho docs pages, got ${pages.length}`);
  assert.ok(pages.some((page) => page.title === 'Morpho API' && page.section === 'Tools'));
  assert.ok(pages.some((page) => page.title === 'Morpho Vault V2' && page.section === 'Learn'));
});

test('challenge bank contains TypeScript interview drills', () => {
  const db = getDB();
  const challenges = db.prepare(`SELECT title, starter_code, test_cases FROM code_challenges ORDER BY id`).all();
  assert.ok(challenges.length >= 3);
  assert.ok(challenges.some((challenge) => challenge.title.includes('Utilization')));
  assert.ok(challenges.every((challenge) => challenge.starter_code.includes('export')));
  assert.ok(challenges.every((challenge) => JSON.parse(challenge.test_cases).length >= 1));
  db.close();
});

test('quiz and hotseat content target architecture and partner-facing work', () => {
  const db = getDB();
  const quizRows = db.prepare(`SELECT question_id, module_slug, interview_tip FROM quiz_bank`).all();
  const hotseatRows = db.prepare(`SELECT slug, persona, questions FROM hotseat_scenarios`).all();

  assert.ok(quizRows.some((row) => row.module_slug === 'solution-architect'));
  assert.ok(quizRows.every((row) => row.interview_tip.length > 10));
  assert.ok(quizRows.length >= 250, `expected large quiz bank, got ${quizRows.length}`);
  assert.ok(hotseatRows.length >= 2);
  assert.ok(hotseatRows.some((row) => row.persona.includes('CTO')));
  assert.ok(hotseatRows.every((row) => JSON.parse(row.questions).length >= 3));
  db.close();
});
