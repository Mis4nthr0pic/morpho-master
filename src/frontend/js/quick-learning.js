const QuickLearning = {
  sessionId: null,
  module: null,
  question: null,
  stats: null,
  completion: null,
  timerInterval: null,
  timeLeftMs: 0,
  questionStartedAt: null,
  awaitingNext: false,
  selectedIndices: []
};

const QUICK_LEARNING_PRESSURE_KEY = 'quickLearningPressureMode';
const QUICK_LEARNING_CORRECT_DELAY_MS = 2400;
const QUICK_LEARNING_WRONG_DELAY_MS = 4200;

function getQuickLearningHashModuleId() {
  const hash = window.location.hash.replace(/^#/, '');
  const parts = hash.split('/');
  if (parts[0] !== 'quick-learning') return null;
  return Number(parts[1]) || null;
}

function clearQuickLearningTimer() {
  if (QuickLearning.timerInterval) {
    clearInterval(QuickLearning.timerInterval);
    QuickLearning.timerInterval = null;
  }
}

function startQuickLearning(moduleId) {
  window.location.hash = `quick-learning/${moduleId}`;
}

function sanitizeQuickLearningText(text) {
  return String(text || '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function resolveQuickLearningTitle(question) {
  const title = String(question.title || '').trim();
  const prompt = String(question.prompt || '').trim();
  const lessonTitle = String(question.lessonTitle || '').trim();
  const sourceType = String(question.sourceType || '').trim().replace(/-/g, ' ');

  const normalizedTitle = sanitizeQuickLearningText(title);
  const normalizedPrompt = sanitizeQuickLearningText(prompt);
  const choiceMatches = Array.isArray(question.choices)
    ? question.choices.some((choice) => sanitizeQuickLearningText(choice) === normalizedTitle)
    : false;

  if (!title || normalizedTitle === normalizedPrompt || choiceMatches) {
    return lessonTitle || sourceType || 'Quick Learning';
  }

  return title;
}

async function loadQuickLearningFromHash() {
  const moduleId = getQuickLearningHashModuleId();
  if (!moduleId) return;
  await bootQuickLearning(moduleId);
}

async function bootQuickLearning(moduleId) {
  clearQuickLearningTimer();
  QuickLearning.awaitingNext = false;

  const shell = document.getElementById('quick-learning-shell');
  if (shell) {
    shell.innerHTML = '<div class="quick-learning-loading">Preparing rapid-fire mastery session...</div>';
  }

  try {
    const response = await fetch(`/api/quick-learning/modules/${moduleId}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pressureMode: getPressureMode() })
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to start Quick Learning');
    }

    QuickLearning.sessionId = data.sessionId;
    QuickLearning.module = data.module;
    QuickLearning.question = data.question;
    QuickLearning.stats = data.stats;
    QuickLearning.completion = data.completion || null;

    renderQuickLearningShell();
    if (QuickLearning.question) {
      renderQuickLearningQuestion(QuickLearning.question);
      startQuickLearningTimer(QuickLearning.question.timingSeconds);
    } else {
      renderQuickLearningComplete();
    }
  } catch (error) {
    if (shell) {
      shell.innerHTML = `<div class="quick-learning-error">${error.message}</div>`;
    }
  }
}

function renderQuickLearningShell() {
  const shell = document.getElementById('quick-learning-shell');
  const title = document.getElementById('quick-learning-title');
  const subtitle = document.getElementById('quick-learning-subtitle');
  if (!shell || !title || !subtitle) return;

  title.textContent = `Quick Learning: ${QuickLearning.module.title}`;
  subtitle.textContent = 'Fast timed recall. Wrong concepts loop back until the module is fully mastered.';

  shell.innerHTML = `
    <div class="quick-learning-topbar">
      <div class="quick-learning-mastery">
        <div class="quick-learning-mastery-label">Module Mastery</div>
        <div class="quick-learning-mastery-value" id="ql-mastery-value">${QuickLearning.stats.masteryPercent}%</div>
      </div>
      <div class="quick-learning-timer-card">
        <div class="quick-learning-timer-label">Time Left</div>
        <div class="quick-learning-timer-value" id="ql-timer-value">00:00</div>
        <label class="quick-learning-pressure-toggle">
          <input id="ql-pressure-toggle" type="checkbox" ${getPressureMode() ? 'checked' : ''}>
          <span>Pressure Mode</span>
        </label>
      </div>
    </div>

    <div class="quick-learning-progress-card">
      <div class="quick-learning-progress-meta">
        <span id="ql-remaining">${QuickLearning.stats.questionsRemainingForMastery} for mastery</span>
        <span id="ql-streak">Streak ${QuickLearning.stats.streak}</span>
      </div>
      <div class="quick-learning-progress-track">
        <div id="ql-progress-fill" class="quick-learning-progress-fill" style="width:${QuickLearning.stats.masteryPercent}%"></div>
      </div>
      <div class="quick-learning-stat-grid">
        <div class="quick-learning-stat"><span class="label">Correct</span><strong id="ql-correct">${QuickLearning.stats.correct}</strong></div>
        <div class="quick-learning-stat"><span class="label">Incorrect</span><strong id="ql-incorrect">${QuickLearning.stats.incorrect}</strong></div>
        <div class="quick-learning-stat"><span class="label">Remaining</span><strong id="ql-remaining-stat">${QuickLearning.stats.questionsRemainingForMastery}</strong></div>
        <div class="quick-learning-stat"><span class="label">Best streak</span><strong id="ql-best-streak">${QuickLearning.stats.bestStreak}</strong></div>
        <div class="quick-learning-stat"><span class="label">Avg pace</span><strong id="ql-avg-pace">${formatAvgPace(QuickLearning.stats.avgResponseMs)}</strong></div>
      </div>
    </div>

    <div id="quick-learning-card" class="quick-learning-card"></div>
  `;

  const pressureToggle = document.getElementById('ql-pressure-toggle');
  if (pressureToggle) {
    pressureToggle.addEventListener('change', async () => {
      localStorage.setItem(QUICK_LEARNING_PRESSURE_KEY, pressureToggle.checked ? '1' : '0');
      await resetQuickLearningModule(QuickLearning.module.id, true);
    });
  }
}

function renderQuickLearningQuestion(question) {
  const card = document.getElementById('quick-learning-card');
  if (!card) return;
  QuickLearning.selectedIndices = [];

  card.className = 'quick-learning-card';
  card.innerHTML = `
    <div class="quick-learning-question-meta">
      <span class="difficulty difficulty-${question.difficulty}">${question.difficulty}</span>
      <span class="source-badge">${question.sourceType.replace(/-/g, ' ')}</span>
      ${question.lessonTitle ? `<span class="lesson-badge">${question.lessonTitle}</span>` : ''}
      ${question.answerFormat === 'multi_select' ? `<span class="source-badge">Select all that apply</span>` : ''}
    </div>
    <div class="quick-learning-question-title">${resolveQuickLearningTitle(question)}</div>
    <div class="quick-learning-question-text">${question.prompt}</div>
    ${question.answerFormat === 'typed' ? `
      <div class="quick-learning-typed">
        <input id="quick-learning-typed-input" class="quick-learning-typed-input" type="text" placeholder="Type your answer fast">
        <button id="quick-learning-typed-submit" class="btn btn-primary" type="button">Submit Recall</button>
      </div>
    ` : question.answerFormat === 'multi_select' ? `
      <div class="quick-learning-options">
        ${question.choices.map((choice, index) => `
          <button class="quick-learning-option quick-learning-option--multi" type="button" data-index="${index}">
            <span class="quick-learning-option-key">${index + 1}</span>
            <span>${choice}</span>
          </button>
        `).join('')}
      </div>
      <div class="quick-learning-multi-actions">
        <button id="quick-learning-multi-submit" class="btn btn-primary" type="button" disabled>Confirm Selection</button>
      </div>
    ` : `
      <div class="quick-learning-options">
        ${question.choices.map((choice, index) => `
          <button class="quick-learning-option" type="button" data-index="${index}">
            <span class="quick-learning-option-key">${String.fromCharCode(65 + index)}</span>
            <span>${choice}</span>
          </button>
        `).join('')}
      </div>
    `}
    <div id="quick-learning-feedback" class="quick-learning-feedback"></div>
  `;

  if (question.answerFormat === 'typed') {
    const input = document.getElementById('quick-learning-typed-input');
    const submit = document.getElementById('quick-learning-typed-submit');
    if (submit && input) {
      submit.addEventListener('click', () => {
        if (QuickLearning.awaitingNext) return;
        submitQuickLearningAnswer(null, false, input.value);
      });
      input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          submit.click();
        }
      });
      input.focus();
    }
  } else if (question.answerFormat === 'multi_select') {
    const multiButtons = Array.from(card.querySelectorAll('.quick-learning-option--multi'));
    const submit = document.getElementById('quick-learning-multi-submit');
    const syncMultiState = () => {
      multiButtons.forEach((button) => {
        const index = Number(button.dataset.index);
        button.classList.toggle('selected', QuickLearning.selectedIndices.includes(index));
      });
      if (submit) submit.disabled = QuickLearning.selectedIndices.length === 0;
    };

    multiButtons.forEach((button) => {
      button.addEventListener('click', () => {
        if (QuickLearning.awaitingNext) return;
        const index = Number(button.dataset.index);
        if (QuickLearning.selectedIndices.includes(index)) {
          QuickLearning.selectedIndices = QuickLearning.selectedIndices.filter((value) => value !== index);
        } else {
          QuickLearning.selectedIndices = [...QuickLearning.selectedIndices, index].sort((a, b) => a - b);
        }
        syncMultiState();
      });
    });

    if (submit) {
      submit.addEventListener('click', () => {
        if (QuickLearning.awaitingNext || !QuickLearning.selectedIndices.length) return;
        submitQuickLearningAnswer(null, false, '', QuickLearning.selectedIndices);
      });
    }
    syncMultiState();
  } else {
    card.querySelectorAll('.quick-learning-option').forEach((button) => {
      button.addEventListener('click', () => {
        if (QuickLearning.awaitingNext) return;
        const selectedIndex = Number(button.dataset.index);
        submitQuickLearningAnswer(selectedIndex, false, '', []);
      });
    });
  }

  syncQuickLearningStats();
}

function syncQuickLearningStats() {
  const stats = QuickLearning.stats;
  if (!stats) return;

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText('ql-mastery-value', `${stats.masteryPercent}%`);
  setText('ql-remaining', `${stats.questionsRemainingForMastery} for mastery`);
  setText('ql-streak', `Streak ${stats.streak}`);
  setText('ql-correct', stats.correct);
  setText('ql-incorrect', stats.incorrect);
  setText('ql-remaining-stat', stats.questionsRemainingForMastery);
  setText('ql-best-streak', stats.bestStreak);
  setText('ql-avg-pace', formatAvgPace(stats.avgResponseMs));

  const fill = document.getElementById('ql-progress-fill');
  if (fill) fill.style.width = `${stats.masteryPercent}%`;
}

function formatAvgPace(avgResponseMs) {
  if (!avgResponseMs) return '0.0s';
  return `${(avgResponseMs / 1000).toFixed(1)}s`;
}

function startQuickLearningTimer(seconds) {
  clearQuickLearningTimer();

  const effectiveSeconds = getPressureMode()
    ? Math.max(16, Math.round(seconds * 0.84))
    : seconds;

  QuickLearning.timeLeftMs = effectiveSeconds * 1000;
  QuickLearning.questionStartedAt = Date.now();
  renderQuickLearningTimer();

  QuickLearning.timerInterval = setInterval(() => {
    const elapsed = Date.now() - QuickLearning.questionStartedAt;
    QuickLearning.timeLeftMs = Math.max(0, effectiveSeconds * 1000 - elapsed);
    renderQuickLearningTimer();

    if (QuickLearning.timeLeftMs <= 0) {
      clearQuickLearningTimer();
      if (!QuickLearning.awaitingNext) {
        submitQuickLearningAnswer(null, true, '');
      }
    }
  }, 100);
}

function renderQuickLearningTimer() {
  const timerEl = document.getElementById('ql-timer-value');
  if (!timerEl) return;

  const seconds = Math.ceil(QuickLearning.timeLeftMs / 1000);
  timerEl.textContent = `00:${String(seconds).padStart(2, '0')}`;
  timerEl.classList.toggle('danger', seconds <= 3);
}

function getPressureMode() {
  return localStorage.getItem(QUICK_LEARNING_PRESSURE_KEY) === '1';
}

async function submitQuickLearningAnswer(selectedIndex, timedOut, typedAnswer = '', selectedIndices = []) {
  if (!QuickLearning.sessionId || QuickLearning.awaitingNext) return;
  QuickLearning.awaitingNext = true;
  clearQuickLearningTimer();

  const card = document.getElementById('quick-learning-card');
  const feedback = document.getElementById('quick-learning-feedback');
  const optionButtons = Array.from(document.querySelectorAll('.quick-learning-option'));
  optionButtons.forEach((button) => (button.disabled = true));
  const typedInput = document.getElementById('quick-learning-typed-input');
  const typedSubmit = document.getElementById('quick-learning-typed-submit');
  const multiSubmit = document.getElementById('quick-learning-multi-submit');
  if (typedInput) typedInput.disabled = true;
  if (typedSubmit) typedSubmit.disabled = true;
  if (multiSubmit) multiSubmit.disabled = true;

  const responseTimeMs = QuickLearning.questionStartedAt ? Date.now() - QuickLearning.questionStartedAt : 0;

  try {
    const response = await fetch(`/api/quick-learning/sessions/${QuickLearning.sessionId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedIndex, selectedIndices, timedOut, responseTimeMs, typedAnswer })
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Answer submission failed');
    }

    const chosenIndex = timedOut ? -1 : Number(selectedIndex);
    const correctIndexes = Array.isArray(data.correctIndexes) && data.correctIndexes.length ? data.correctIndexes : [data.correctIndex];
    optionButtons.forEach((button) => {
      const idx = Number(button.dataset.index);
      if (correctIndexes.includes(idx)) button.classList.add('correct');
      if (
        !timedOut &&
        (
          (QuickLearning.question.answerFormat === 'multi_select' && selectedIndices.includes(idx) && !correctIndexes.includes(idx)) ||
          (QuickLearning.question.answerFormat !== 'multi_select' && idx === chosenIndex && !correctIndexes.includes(idx))
        )
      ) {
        button.classList.add('wrong');
      }
    });

    QuickLearning.stats = data.stats;
    QuickLearning.completion = data.completion || null;
    syncQuickLearningStats();

    if (card) {
      card.classList.add(data.correct ? 'quick-learning-success' : 'quick-learning-fail');
    }

    if (feedback) {
      feedback.className = `quick-learning-feedback ${data.correct ? 'correct' : 'wrong'}`;
      feedback.innerHTML = data.correct
        ? `<strong>Locked in.</strong> ${data.explanation || 'Correct.'}`
        : `<strong>${timedOut ? 'Time ran out.' : 'Not quite.'}</strong>${data.correctAnswer ? ` <span class="quick-learning-correct-answer">Correct answer: ${data.correctAnswer}</span>` : ''}${typedAnswer ? `<span class="quick-learning-explanation">You typed: ${typedAnswer}</span>` : ''}${data.explanation ? `<span class="quick-learning-explanation">${data.explanation}</span>` : ''}`;
    }

    const nextDelay = data.correct
      ? QUICK_LEARNING_CORRECT_DELAY_MS
      : QUICK_LEARNING_WRONG_DELAY_MS;

    setTimeout(() => {
      QuickLearning.awaitingNext = false;
      if (data.status === 'completed' || !data.nextQuestion) {
        QuickLearning.question = null;
        renderQuickLearningComplete();
        return;
      }

      QuickLearning.question = data.nextQuestion;
      renderQuickLearningQuestion(data.nextQuestion);
      startQuickLearningTimer(data.nextQuestion.timingSeconds);
    }, nextDelay);
  } catch (error) {
    QuickLearning.awaitingNext = false;
    if (feedback) {
      feedback.className = 'quick-learning-feedback wrong';
      feedback.textContent = error.message;
    }
    optionButtons.forEach((button) => (button.disabled = false));
    if (typedInput) typedInput.disabled = false;
    if (typedSubmit) typedSubmit.disabled = false;
    if (multiSubmit) multiSubmit.disabled = false;
    startQuickLearningTimer(QuickLearning.question.timingSeconds);
  }
}

function renderQuickLearningComplete() {
  const card = document.getElementById('quick-learning-card');
  if (!card) return;

  syncQuickLearningStats();
  const completion = QuickLearning.completion || {
    rating: { label: 'Locked In', tone: 'elite' },
    accuracyPercent: 100,
    avgResponseSeconds: '0.0'
  };
  card.className = 'quick-learning-card quick-learning-complete-card';
  card.innerHTML = `
    <div class="quick-learning-complete-badge quick-learning-complete-badge--${completion.rating.tone}">${completion.rating.label}</div>
    <h2>Module mastered in Quick Learning Mode</h2>
    <p>You cleared every required question unit at least once. This module is now fully marked for Quick Learning mastery.</p>
    <div class="quick-learning-complete-stats">
      <div><span>Correct</span><strong>${QuickLearning.stats.correct}</strong></div>
      <div><span>Incorrect</span><strong>${QuickLearning.stats.incorrect}</strong></div>
      <div><span>Best streak</span><strong>${QuickLearning.stats.bestStreak}</strong></div>
      <div><span>Accuracy</span><strong>${completion.accuracyPercent}%</strong></div>
      <div><span>Avg pace</span><strong>${completion.avgResponseSeconds}s</strong></div>
    </div>
    <div class="quick-learning-complete-actions">
      <button class="btn btn-secondary" type="button" onclick="resetQuickLearningModule(${QuickLearning.module.id})">Reset module mastery</button>
      <button class="btn btn-primary" type="button" onclick="navigateTo('learn')">Back to modules</button>
    </div>
  `;
}

async function resetQuickLearningModule(moduleId, restart = false) {
  await fetch(`/api/quick-learning/modules/${moduleId}/reset`, { method: 'POST' });
  if (restart) {
    await bootQuickLearning(moduleId);
  } else {
    await bootQuickLearning(moduleId);
  }
}

window.startQuickLearning = startQuickLearning;
window.loadQuickLearningFromHash = loadQuickLearningFromHash;
window.resetQuickLearningModule = resetQuickLearningModule;
