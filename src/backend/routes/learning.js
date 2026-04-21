/**
 * Learning Routes
 */

const express = require('express');
const router = express.Router();

// GET /api/learning/modules - List all modules
router.get('/modules', (req, res) => {
  const db = req.app.locals.db;
  
  const modules = db.prepare(`
    SELECT m.*, 
      COUNT(l.id) as lesson_count,
      (SELECT COUNT(*) FROM quiz_bank WHERE module_slug = m.slug) as quiz_count,
      (SELECT COUNT(*) FROM quick_learning_units qlu WHERE qlu.module_id = m.id AND qlu.active = 1) as quick_learning_total,
      (
        SELECT COUNT(*)
        FROM quick_learning_mastery qlm
        WHERE qlm.module_id = m.id AND qlm.user_id = 1 AND qlm.mastered = 1
      ) as quick_learning_mastered
    FROM curriculum_modules m
    LEFT JOIN lessons l ON m.id = l.module_id
    GROUP BY m.id
    ORDER BY m.sort_order
  `).all();
  
  // Get lessons for each module
  const modulesWithLessons = modules.map(mod => {
    const lessons = db.prepare(`
      SELECT id, title, estimated_minutes, sort_order
      FROM lessons
      WHERE module_id = ?
      ORDER BY sort_order
    `).all(mod.id);
    
    return {
      ...mod,
      quick_learning_progress: mod.quick_learning_total
        ? Math.round((mod.quick_learning_mastered / mod.quick_learning_total) * 100)
        : 0,
      lessons
    };
  });
  
  res.json(modulesWithLessons);
});

// GET /api/learning/modules/:id - Get module detail with lessons
router.get('/modules/:id', (req, res) => {
  const db = req.app.locals.db;
  const moduleId = req.params.id;
  
  const mod = db.prepare(`
    SELECT * FROM curriculum_modules WHERE id = ?
  `).get(moduleId);
  
  if (!mod) {
    return res.status(404).json({ error: 'Module not found' });
  }
  
  const lessons = db.prepare(`
    SELECT * FROM lessons
    WHERE module_id = ?
    ORDER BY sort_order
  `).all(moduleId);
  
  const quizCount = db.prepare(`
    SELECT COUNT(*) as count FROM quiz_bank WHERE module_slug = ?
  `).get(mod.slug);

  const quickLearningStats = db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM quick_learning_units WHERE module_id = ? AND active = 1) AS total,
      (
        SELECT COUNT(*)
        FROM quick_learning_mastery
        WHERE module_id = ? AND user_id = 1 AND mastered = 1
      ) AS mastered
  `).get(mod.id, mod.id);
  
  res.json({
    ...mod,
    lessons,
    quiz_count: quizCount.count,
    quick_learning_total: quickLearningStats.total || 0,
    quick_learning_mastered: quickLearningStats.mastered || 0,
    quick_learning_progress: quickLearningStats.total
      ? Math.round((quickLearningStats.mastered / quickLearningStats.total) * 100)
      : 0
  });
});

// GET /api/learning/progress - Get user progress
router.get('/progress', (req, res) => {
  const db = req.app.locals.db;
  
  // Get overall stats
  const totalModules = db.prepare('SELECT COUNT(*) as count FROM curriculum_modules').get().count;
  const completedModules = db.prepare(`
    SELECT COUNT(DISTINCT module_id) as count 
    FROM progress 
    WHERE user_id = 1 AND completed = 1
  `).get().count;
  
  // Get quiz accuracy
  const quizStats = db.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) as correct
    FROM quiz_results
    WHERE user_id = 1
  `).get();
  
  // Get study time
  const studyTime = db.prepare(`
    SELECT COALESCE(SUM(duration_minutes), 0) as total
    FROM study_sessions
    WHERE user_id = 1
  `).get();
  
  // Get LLM practice count
  const llmCount = db.prepare(`
    SELECT COUNT(*) as count FROM llm_history WHERE user_id = 1
  `).get().count;

  const quickLearning = db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM quick_learning_units WHERE active = 1) AS total,
      (
        SELECT COUNT(*)
        FROM quick_learning_mastery
        WHERE user_id = 1 AND mastered = 1
      ) AS mastered
  `).get();

  const completedLessons = db.prepare(`
    SELECT COUNT(*) as count
    FROM progress
    WHERE user_id = 1 AND completed = 1
  `).get().count;
  
  // Calculate overall progress
  const moduleProgress = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;
  const quizAccuracy = quizStats.total > 0 ? (quizStats.correct / quizStats.total) * 100 : 0;
  const activityCount = completedLessons + quizStats.total + llmCount;
  const overallProgress = activityCount === 0
    ? 0
    : Math.round(
      (moduleProgress * 0.35) +
      (quizAccuracy * 0.25) +
      (Math.min(llmCount / 15, 1) * 100 * 0.15) +
      (((quickLearning.total || 0) ? ((quickLearning.mastered || 0) / quickLearning.total) * 100 : 0) * 0.25)
    );
  
  res.json({
    overallProgress,
    modulesCompleted: completedModules,
    totalModules,
    quizAccuracy,
    quizTotal: quizStats.total,
    quizCorrect: quizStats.correct,
    totalStudyMinutes: studyTime.total,
    llmCompleted: llmCount,
    quickLearningMastered: quickLearning.mastered || 0,
    quickLearningTotal: quickLearning.total || 0
  });
});

router.post('/reset', (req, res) => {
  const db = req.app.locals.db;

  const reset = db.transaction(() => {
    db.prepare('DELETE FROM progress WHERE user_id = 1').run();
    db.prepare('DELETE FROM quiz_results WHERE user_id = 1').run();
    db.prepare('DELETE FROM llm_history WHERE user_id = 1').run();
    db.prepare('DELETE FROM study_sessions WHERE user_id = 1').run();
    db.prepare('DELETE FROM quick_learning_mastery WHERE user_id = 1').run();
    db.prepare('DELETE FROM quick_learning_sessions WHERE user_id = 1').run();
  });

  reset();

  res.json({ success: true });
});

// POST /api/learning/progress - Update progress
router.post('/progress', (req, res) => {
  const db = req.app.locals.db;
  const { moduleId, lessonId, completed } = req.body;
  
  const existing = db.prepare(`
    SELECT * FROM progress WHERE user_id = 1 AND module_id = ? AND lesson_id = ?
  `).get(moduleId, lessonId);
  
  if (existing) {
    db.prepare(`
      UPDATE progress 
      SET completed = ?, completed_at = datetime('now')
      WHERE id = ?
    `).run(completed ? 1 : 0, existing.id);
  } else {
    db.prepare(`
      INSERT INTO progress (user_id, module_id, lesson_id, completed, completed_at)
      VALUES (1, ?, ?, ?, datetime('now'))
    `).run(moduleId, lessonId, completed ? 1 : 0);
  }
  
  res.json({ success: true });
});

module.exports = router;
