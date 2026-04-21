/**
 * Frontend-only training analytics and readiness helpers.
 */

(function () {
  const STORAGE_KEYS = {
    quiz: 'trainingQuizHistory',
    drill: 'trainingDrillHistory',
    mock: 'trainingMockHistory',
    confidence: 'trainingConfidenceHistory',
    code: 'trainingCodeHistory'
  };

  const READINESS_GOALS = [
    { id: 'blue-explainer', label: 'Can explain Morpho Blue clearly', concepts: ['LLTV', 'IRM', 'Market parameters', 'Permissionless', 'Immutable'] },
    { id: 'liquidation-answer', label: 'Can answer liquidation questions', concepts: ['LTV', 'HF', 'LIF', 'Liquidation', 'Bad debt'] },
    { id: 'vault-v2-roles', label: 'Can discuss Vault V2 roles', concepts: ['Curator', 'Allocator', 'Sentinel', 'Owner'] },
    { id: 'earn-integration', label: 'Can scope an earn integration', concepts: ['APY', 'APR', 'Merkl', 'ERC4626', 'API'] },
    { id: 'poc-readiness', label: 'Can present a POC or dashboard path', concepts: ['Bundler3', 'SDK', 'API', 'POC', 'Public Allocator'] }
  ];

  function read(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function append(key, payload) {
    const current = read(key);
    current.push({
      ...payload,
      timestamp: Date.now()
    });
    write(key, current.slice(-300));
  }

  function extractConcepts(texts) {
    if (!window.getGlossaryEntries) return [];
    return window.getGlossaryEntries(texts).map((entry) => entry.term);
  }

  function conceptScoreboard() {
    const conceptMap = new Map();
    const quizHistory = read(STORAGE_KEYS.quiz);
    const drillHistory = read(STORAGE_KEYS.drill);
    const confidenceHistory = read(STORAGE_KEYS.confidence);
    const codeHistory = read(STORAGE_KEYS.code);

    function ensure(term) {
      if (!conceptMap.has(term)) {
        conceptMap.set(term, {
          term,
          score: 0,
          misses: 0,
          hits: 0,
          lowConfidence: 0,
          examples: 0
        });
      }
      return conceptMap.get(term);
    }

    quizHistory.forEach((entry) => {
      (entry.concepts || []).forEach((term) => {
        const item = ensure(term);
        item.examples += 1;
        item.score += entry.correct ? 2 : -3;
        item.hits += entry.correct ? 1 : 0;
        item.misses += entry.correct ? 0 : 1;
      });
    });

    drillHistory.forEach((entry) => {
      (entry.concepts || []).forEach((term) => {
        const item = ensure(term);
        item.examples += 1;
        item.score += (entry.score || 0) >= 80 ? 2 : (entry.score || 0) >= 65 ? 0 : -2;
      });
    });

    codeHistory.forEach((entry) => {
      (entry.concepts || []).forEach((term) => {
        const item = ensure(term);
        item.examples += 1;
        item.score += entry.completed ? 2 : -1;
      });
    });

    confidenceHistory.forEach((entry) => {
      (entry.concepts || []).forEach((term) => {
        const item = ensure(term);
        item.examples += 1;
        if (entry.confidence === 'guessed') {
          item.lowConfidence += 1;
          item.score -= 2;
        } else if (entry.confidence === 'knew') {
          item.score += 1;
        } else if (entry.confidence === 'call-ready') {
          item.score += 2;
        }
      });
    });

    return Array.from(conceptMap.values()).sort((a, b) => a.score - b.score);
  }

  function getWeakConcepts(limit = 6) {
    return conceptScoreboard()
      .filter((item) => item.examples > 0)
      .slice(0, limit);
  }

  function getStrongConcepts(limit = 5) {
    return conceptScoreboard()
      .filter((item) => item.examples > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  function getReadinessChecklist() {
    const board = conceptScoreboard();
    const conceptLookup = new Map(board.map((item) => [item.term, item]));

    return READINESS_GOALS.map((goal) => {
      const covered = goal.concepts.filter((term) => (conceptLookup.get(term)?.score || 0) > 0).length;
      const total = goal.concepts.length;
      const progress = Math.round((covered / total) * 100);
      return {
        ...goal,
        progress,
        status: progress >= 80 ? 'ready' : progress >= 45 ? 'developing' : 'needs-work'
      };
    });
  }

  const CATEGORY_LABELS = {
    'protocol-knowledge': 'Protocol Knowledge',
    'vault-v2': 'Vault V2',
    'math': 'Math & Formulas',
    'liquidations': 'Liquidations',
    'partner-scenario': 'Partner Scenarios',
    'integration': 'Integration & SDKs',
    'merkl': 'Merkl & Rewards',
    'communication': 'Partner Communication',
    'poc-design': 'POC & Dashboards',
    'interview': 'Interview Tactics',
    'review': 'Final Review',
    'faq-general': 'FAQ / General',
    'earn': 'Earn Products'
  };

  function categoryScoreboard() {
    const categoryMap = new Map();
    const quizHistory = read(STORAGE_KEYS.quiz);

    function ensure(cat) {
      if (!categoryMap.has(cat)) {
        categoryMap.set(cat, {
          category: cat,
          label: CATEGORY_LABELS[cat] || cat,
          correct: 0,
          total: 0,
          score: 0
        });
      }
      return categoryMap.get(cat);
    }

    quizHistory.forEach((entry) => {
      if (!entry.category) return;
      const item = ensure(entry.category);
      item.total += 1;
      if (entry.correct) {
        item.correct += 1;
        item.score += 2;
      } else {
        item.score -= 3;
      }
    });

    return Array.from(categoryMap.values())
      .filter((item) => item.total > 0)
      .map((item) => ({
        ...item,
        accuracy: item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0
      }))
      .sort((a, b) => a.accuracy - b.accuracy);
  }

  function getWeakCategories(limit = 5) {
    return categoryScoreboard().slice(0, limit);
  }

  function getRecommendedActions() {
    const weak = getWeakConcepts(3);
    const checklist = getReadinessChecklist();
    const actions = [];

    weak.forEach((item) => {
      actions.push(`Revisit ${item.term}: misses ${item.misses}, low-confidence reps ${item.lowConfidence}.`);
    });

    checklist
      .filter((item) => item.status !== 'ready')
      .slice(0, 2)
      .forEach((item) => {
        actions.push(`Move "${item.label}" forward. Current readiness: ${item.progress}%.`);
      });

    if (!actions.length) {
      actions.push('Run a mock interview block and pressure-test your strongest answers.');
    }

    return actions.slice(0, 5);
  }

  function recordQuizResult(payload) {
    append(STORAGE_KEYS.quiz, payload);
  }

  function recordConfidence(payload) {
    append(STORAGE_KEYS.confidence, payload);
  }

  function recordDrill(payload) {
    append(STORAGE_KEYS.drill, payload);
  }

  function recordMock(payload) {
    append(STORAGE_KEYS.mock, payload);
  }

  function recordCode(payload) {
    append(STORAGE_KEYS.code, payload);
  }

  function getPracticeSummary() {
    return {
      quizAttempts: read(STORAGE_KEYS.quiz).length,
      drillAttempts: read(STORAGE_KEYS.drill).length,
      mockAttempts: read(STORAGE_KEYS.mock).length,
      codeTouches: read(STORAGE_KEYS.code).length
    };
  }

  function getMockHistory() {
    return read(STORAGE_KEYS.mock);
  }

  function getDrillHistory() {
    return read(STORAGE_KEYS.drill);
  }

  function getConfidenceHistory() {
    return read(STORAGE_KEYS.confidence);
  }

  function resetAll() {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  }

  window.trainingAnalytics = {
    extractConcepts,
    getWeakConcepts,
    getStrongConcepts,
    getReadinessChecklist,
    getRecommendedActions,
    getPracticeSummary,
    getMockHistory,
    getDrillHistory,
    getConfidenceHistory,
    categoryScoreboard,
    getWeakCategories,
    resetAll,
    recordQuizResult,
    recordConfidence,
    recordDrill,
    recordMock,
    recordCode
  };
})();
