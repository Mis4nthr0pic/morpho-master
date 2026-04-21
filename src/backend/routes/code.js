/**
 * Code challenge routes
 */

const express = require('express');
const router = express.Router();
const { CODE_CHALLENGES } = require('../../content/code-challenges');

router.get('/challenges', (req, res) => {
  res.json({
    challenges: CODE_CHALLENGES
  });
});

router.get('/challenges/:id', (req, res) => {
  const challenge = CODE_CHALLENGES.find((item) => item.id === req.params.id);

  if (!challenge) {
    return res.status(404).json({ error: 'Challenge not found' });
  }

  res.json(challenge);
});

module.exports = router;
