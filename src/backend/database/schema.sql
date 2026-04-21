-- Morpho Interview Trainer Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Study sessions for time tracking
CREATE TABLE IF NOT EXISTS study_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  end_time DATETIME,
  duration_minutes INTEGER DEFAULT 0,
  activity_type TEXT,
  module_slug TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Learning progress
CREATE TABLE IF NOT EXISTS progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  module_id INTEGER,
  lesson_id INTEGER,
  completed BOOLEAN DEFAULT 0,
  completed_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Quiz results
CREATE TABLE IF NOT EXISTS quiz_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  question_id INTEGER,
  correct BOOLEAN,
  answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Code challenges
CREATE TABLE IF NOT EXISTS code_challenges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE,
  title TEXT,
  difficulty TEXT,
  description TEXT,
  starter_code TEXT,
  solution TEXT,
  test_cases TEXT,
  hints TEXT
);

-- Curriculum modules
CREATE TABLE IF NOT EXISTS curriculum_modules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE,
  title TEXT,
  duration_hours INTEGER,
  category TEXT,
  summary TEXT,
  objective TEXT,
  format TEXT,
  sort_order INTEGER
);

-- Lessons within modules
CREATE TABLE IF NOT EXISTS lessons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  module_id INTEGER,
  title TEXT,
  body TEXT,
  estimated_minutes INTEGER,
  sort_order INTEGER,
  docs_refs TEXT,
  tips TEXT,
  talking_points TEXT,
  what_you_must_know TEXT,
  why_it_matters TEXT,
  implementation_checks TEXT,
  interview_drill TEXT,
  formulas TEXT,
  FOREIGN KEY (module_id) REFERENCES curriculum_modules(id)
);

-- Quiz bank
CREATE TABLE IF NOT EXISTS quiz_bank (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT,
  options TEXT,
  correct INTEGER,
  explanation TEXT,
  category TEXT,
  difficulty TEXT,
  interview_tip TEXT,
  module_slug TEXT
);

-- LLM evaluation questions
CREATE TABLE IF NOT EXISTS llm_evaluations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT,
  category TEXT,
  difficulty TEXT,
  rubric TEXT,
  follow_up TEXT
);

-- LLM practice history
CREATE TABLE IF NOT EXISTS llm_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  question_id INTEGER,
  answer TEXT,
  score INTEGER,
  feedback TEXT,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (question_id) REFERENCES llm_evaluations(id)
);

CREATE TABLE IF NOT EXISTS quiz_explanations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quiz_bank_id INTEGER,
  module_slug TEXT NOT NULL,
  question_text TEXT NOT NULL,
  expanded_explanation TEXT NOT NULL,
  doc_excerpt_1 TEXT,
  doc_excerpt_2 TEXT,
  source_refs TEXT DEFAULT '[]',
  question_hash TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quiz_bank_id) REFERENCES quiz_bank(id)
);

CREATE TABLE IF NOT EXISTS doc_snippets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_file TEXT NOT NULL,
  section TEXT,
  title TEXT,
  url TEXT,
  content TEXT NOT NULL,
  content_hash TEXT UNIQUE NOT NULL,
  keywords TEXT DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Quick Learning generated mastery units
CREATE TABLE IF NOT EXISTS quick_learning_units (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  unit_key TEXT UNIQUE NOT NULL,
  module_id INTEGER NOT NULL,
  lesson_id INTEGER,
  module_slug TEXT NOT NULL,
  lesson_title TEXT,
  source_type TEXT NOT NULL,
  source_ref TEXT,
  title TEXT,
  prompt TEXT NOT NULL,
  choices TEXT NOT NULL,
  correct_index INTEGER NOT NULL,
  correct_indexes TEXT DEFAULT '[]',
  answer_format TEXT DEFAULT 'multiple_choice',
  accepted_answers TEXT DEFAULT '[]',
  explanation TEXT,
  difficulty TEXT NOT NULL,
  timing_seconds INTEGER NOT NULL,
  concept_key TEXT,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT 1,
  FOREIGN KEY (module_id) REFERENCES curriculum_modules(id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

-- Per-user mastery progress for Quick Learning
CREATE TABLE IF NOT EXISTS quick_learning_mastery (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  module_id INTEGER NOT NULL,
  unit_key TEXT NOT NULL,
  times_seen INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  times_wrong INTEGER DEFAULT 0,
  mastered BOOLEAN DEFAULT 0,
  last_result TEXT,
  last_seen_at DATETIME,
  mastered_at DATETIME,
  UNIQUE(user_id, module_id, unit_key),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (module_id) REFERENCES curriculum_modules(id),
  FOREIGN KEY (unit_key) REFERENCES quick_learning_units(unit_key)
);

-- Persistent Quick Learning sessions
CREATE TABLE IF NOT EXISTS quick_learning_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  module_id INTEGER NOT NULL,
  status TEXT DEFAULT 'active',
  queue_state TEXT NOT NULL,
  asked_order TEXT DEFAULT '[]',
  current_unit_key TEXT,
  correct_count INTEGER DEFAULT 0,
  wrong_count INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  answered_count INTEGER DEFAULT 0,
  total_response_ms INTEGER DEFAULT 0,
  pressure_mode BOOLEAN DEFAULT 0,
  mastery_percent INTEGER DEFAULT 0,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  ended_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (module_id) REFERENCES curriculum_modules(id),
  FOREIGN KEY (current_unit_key) REFERENCES quick_learning_units(unit_key)
);

CREATE TABLE IF NOT EXISTS quick_learning_completions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  module_id INTEGER NOT NULL,
  session_id INTEGER,
  medal_label TEXT NOT NULL,
  medal_tone TEXT NOT NULL,
  accuracy_percent INTEGER DEFAULT 0,
  avg_response_ms INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  total_wrong INTEGER DEFAULT 0,
  pressure_mode BOOLEAN DEFAULT 0,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (module_id) REFERENCES curriculum_modules(id),
  FOREIGN KEY (session_id) REFERENCES quick_learning_sessions(id)
);
