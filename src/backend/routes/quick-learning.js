const express = require('express');
const router = express.Router();
const {
  getModuleQuickLearningSnapshot,
  getOrCreateQuickLearningSession,
  getQuickLearningSession,
  answerQuickLearning,
  resetQuickLearningModule,
  getQuickLearningHistory
} = require('../services/quickLearningService');

router.get('/modules/:moduleId/overview', (req, res) => {
  const db = req.app.locals.db;
  const moduleId = Number(req.params.moduleId);
  const module = db.prepare(`SELECT id, slug, title FROM curriculum_modules WHERE id = ?`).get(moduleId);

  if (!module) {
    return res.status(404).json({ error: 'Module not found' });
  }

  const stats = getModuleQuickLearningSnapshot(db, moduleId, 1);
  res.json({ module, stats });
});

router.post('/modules/:moduleId/start', (req, res) => {
  const db = req.app.locals.db;
  const moduleId = Number(req.params.moduleId);
  const pressureMode = Boolean(req.body?.pressureMode);

  try {
    const payload = getOrCreateQuickLearningSession(db, moduleId, 1, pressureMode);
    res.json({ success: true, ...payload });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.get('/sessions/:sessionId', (req, res) => {
  const db = req.app.locals.db;
  const sessionId = Number(req.params.sessionId);

  try {
    const payload = getQuickLearningSession(db, sessionId, 1);
    res.json({ success: true, ...payload });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post('/sessions/:sessionId/answer', (req, res) => {
  const db = req.app.locals.db;
  const sessionId = Number(req.params.sessionId);
  const { selectedIndex, selectedIndices = [], timedOut = false, responseTimeMs = 0, typedAnswer = '' } = req.body;

  try {
    const result = answerQuickLearning(db, sessionId, selectedIndex, !!timedOut, Number(responseTimeMs) || 0, 1, typedAnswer, selectedIndices);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/history', (req, res) => {
  const db = req.app.locals.db;
  res.json({ history: getQuickLearningHistory(db, 1, 18) });
});

router.post('/modules/:moduleId/reset', (req, res) => {
  const db = req.app.locals.db;
  const moduleId = Number(req.params.moduleId);
  resetQuickLearningModule(db, moduleId, 1);
  res.json({ success: true });
});

module.exports = router;
