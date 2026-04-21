/**
 * Morpho Interview Trainer - Backend Server
 */

const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');
const { seedDatabase } = require('./database/seed');
const { CURRICULUM_MODULES } = require('../content/curriculum-data');
const { QUIZ_QUESTIONS } = require('../content/quiz-questions');
const { CODE_CHALLENGES } = require('../content/code-challenges');
const { OPEN_ENDED_QUESTIONS } = require('./services/llmService');

// Import routes
const learningRoutes = require('./routes/learning');
const quizRoutes = require('./routes/quiz');
const llmRoutes = require('./routes/llm');
const codeRoutes = require('./routes/code');
const quickLearningRoutes = require('./routes/quick-learning');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, '../../data');
const DB_PATH = path.join(DATA_DIR, 'morpho_trainer.db');

// Ensure data directory exists
const fs = require('fs');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize database
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

// Create schema
const schemaPath = path.join(__dirname, 'database/schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);

function ensureColumn(table, column, definition) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all();
  if (!columns.some((item) => item.name === column)) {
    db.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`).run();
  }
}

ensureColumn('quick_learning_sessions', 'answered_count', 'INTEGER DEFAULT 0');
ensureColumn('quick_learning_sessions', 'total_response_ms', 'INTEGER DEFAULT 0');
ensureColumn('quick_learning_sessions', 'pressure_mode', 'BOOLEAN DEFAULT 0');
ensureColumn('quick_learning_units', 'answer_format', "TEXT DEFAULT 'multiple_choice'");
ensureColumn('quick_learning_units', 'correct_indexes', "TEXT DEFAULT '[]'");
ensureColumn('quick_learning_units', 'accepted_answers', "TEXT DEFAULT '[]'");
ensureColumn('quick_learning_units', 'title', 'TEXT');

// Ensure the single-user local app always has a valid default account.
db.prepare(`
  INSERT OR IGNORE INTO users (id, username)
  VALUES (1, 'Alex')
`).run();

// Seed with content
seedDatabase(db);

// Make db available to routes
app.locals.db = db;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/learning', learningRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/llm', llmRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/quick-learning', quickLearningRoutes);

// User routes
app.get('/api/user', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = 1').get();
  res.json(user || { username: 'Alex' });
});

// Session tracking
app.post('/api/session/start', (req, res) => {
  const result = db.prepare(`
    INSERT INTO study_sessions (user_id, start_time, activity_type, module_slug)
    VALUES (1, datetime('now'), ?, ?)
  `).run(req.body.activity_type || 'reading', req.body.module_slug || null);
  
  res.json({ 
    session_id: result.lastInsertRowid,
    started_at: new Date().toISOString()
  });
});

// Catch-all for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  const lessonCount = CURRICULUM_MODULES.reduce((count, module) => count + module.lessons.length, 0);
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  🦋 Moprho Integrator Tool                                 ║
║                                                            ║
║  Server running on http://localhost:${PORT}                  ║
║                                                            ║
║  Content loaded:                                           ║
║  • ${String(CURRICULUM_MODULES.length).padEnd(2)} Learning Modules / ${String(lessonCount).padEnd(2)} Lessons                 ║
║  • ${String(QUIZ_QUESTIONS.length).padEnd(3)} Quiz Questions                                      ║
║  • ${String(OPEN_ENDED_QUESTIONS.length).padEnd(3)} LLM Practice Questions                               ║
║  • ${String(CODE_CHALLENGES.length).padEnd(3)} Code Challenges                                      ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
