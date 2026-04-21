/**
 * Morpho Interview Trainer - Main Application
 */

// Skeleton loading placeholder helper
function skeletonCards(n = 3) {
  return Array.from({length: n}, () => `
    <div class="skeleton-card">
      <div class="skeleton-line title"></div>
      <div class="skeleton-line full"></div>
      <div class="skeleton-line medium"></div>
      <div class="skeleton-line short"></div>
    </div>`).join('');
}

// Global state
const App = {
  currentPage: 'dashboard',
  theme: 'dark',
  sidebarCollapsed: false,
  settings: null,
  studyTimer: {
    running: false,
    startTime: null,
    elapsed: 0,
    interval: null
  },
  user: {
    name: 'Alex',
    progress: {}
  }
};

const TIMER_STORAGE_KEY = 'studyTimerState';
const UI_SETTINGS_STORAGE_KEY = 'morphoUiSettings';
const DEFAULT_UI_SETTINGS = {
  motivatorEnabled: true,
  menuVisibility: {
    dashboard: true,
    learn: true,
    'base-knowledge': true,
    review: true,
    quiz: true,
    practice: true,
    code: true,
    progress: true
  }
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  initUISettings();
  initTheme();
  initNavigation();
  initSidebar();
  initTimer();
  updateReviewBadge();
  
  // Check initial hash
  const hash = window.location.hash.slice(1) || 'dashboard';
  if (hash.startsWith('lesson/')) {
    navigateTo('lesson');
  } else if (hash.startsWith('base-knowledge/')) {
    navigateTo('base-knowledge');
  } else if (hash.startsWith('quick-learning/')) {
    navigateTo('quick-learning');
  } else {
    navigateTo(hash.split('/')[0]);
  }
});

function readUISettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(UI_SETTINGS_STORAGE_KEY) || 'null');
    return {
      motivatorEnabled: saved?.motivatorEnabled !== false,
      menuVisibility: {
        ...DEFAULT_UI_SETTINGS.menuVisibility,
        ...(saved?.menuVisibility || {})
      }
    };
  } catch {
    return {
      motivatorEnabled: true,
      menuVisibility: { ...DEFAULT_UI_SETTINGS.menuVisibility }
    };
  }
}

function persistUISettings() {
  localStorage.setItem(UI_SETTINGS_STORAGE_KEY, JSON.stringify(App.settings));
  window.dispatchEvent(new CustomEvent('ui-settings-change', { detail: App.settings }));
}

function applyUISettings() {
  if (!App.settings) return;

  document.querySelectorAll('.nav-link[data-page]').forEach((link) => {
    const page = link.dataset.page;
    if (page === 'settings') return;
    const visible = App.settings.menuVisibility[page] !== false;
    const listItem = link.closest('li');
    if (listItem) listItem.hidden = !visible;
  });

  document.body.classList.toggle('motivator-disabled', App.settings.motivatorEnabled === false);
}

function initUISettings() {
  App.settings = readUISettings();
  applyUISettings();
}

function initTheme() {
  const savedTheme = localStorage.getItem('uiTheme') || 'dark';
  const themePills = document.querySelectorAll('.theme-pill');

  applyTheme(savedTheme);

  themePills.forEach((pill) => {
    pill.addEventListener('click', () => applyTheme(pill.dataset.theme));
  });
}

function applyTheme(theme) {
  const nextTheme = ['dark', 'pastel', 'white'].includes(theme) ? theme : 'dark';
  document.body.dataset.theme = nextTheme;
  localStorage.setItem('uiTheme', nextTheme);
  App.theme = nextTheme;
  document.querySelectorAll('.theme-pill').forEach((pill) => {
    pill.classList.toggle('active', pill.dataset.theme === nextTheme);
  });
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: nextTheme } }));
}

function initSidebar() {
  const savedCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
  const toggleBtn = document.getElementById('sidebar-toggle');
  const collapseBtn = document.getElementById('sidebar-collapse-btn');

  setSidebarState(savedCollapsed);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        document.body.classList.toggle('sidebar-open');
        return;
      }

      setSidebarState(!App.sidebarCollapsed);
    });
  }

  if (collapseBtn) {
    collapseBtn.addEventListener('click', () => {
      setSidebarState(!App.sidebarCollapsed);
    });
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      document.body.classList.remove('sidebar-open');
    }
  });
}

function setSidebarState(collapsed) {
  App.sidebarCollapsed = !!collapsed;
  document.body.classList.toggle('sidebar-collapsed', App.sidebarCollapsed);
  localStorage.setItem('sidebarCollapsed', String(App.sidebarCollapsed));
}

function updateReviewBadge() {
  const ratings = JSON.parse(localStorage.getItem('lessonRatings') || '{}');
  const now = Date.now();
  let dueCount = 0;
  
  Object.values(ratings).forEach(data => {
    if (data.nextReview && data.nextReview <= now) {
      dueCount++;
    }
  });
  
  const badge = document.getElementById('review-badge');
  const stat = document.getElementById('stat-review');
  if (badge) {
    badge.textContent = dueCount;
    badge.style.display = dueCount > 0 ? '' : 'none';
  }
  if (stat) stat.textContent = dueCount;
}

// Navigation
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      if (window.innerWidth <= 1024) {
        document.body.classList.remove('sidebar-open');
      }
      navigateTo(page);
    });
  });
  
  // Handle browser back/forward
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1) || 'dashboard';
    // Handle lesson paths like lesson/1/2
    if (hash.startsWith('lesson/')) {
      navigateTo('lesson', false);
    } else if (hash.startsWith('base-knowledge/')) {
      navigateTo('base-knowledge', false);
    } else if (hash.startsWith('quick-learning/')) {
      navigateTo('quick-learning', false);
    } else {
      navigateTo(hash.split('/')[0], false);
    }
  });
}

function navigateTo(page, updateHash = true) {
  if (page !== 'settings' && App.settings?.menuVisibility?.[page] === false) {
    page = 'settings';
  }

  window.scrollTo({ top: 0, behavior: 'auto' });

  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  
  // Show target page
  const targetPage = document.getElementById(page);
  if (targetPage) {
    targetPage.classList.add('active');
    App.currentPage = page;
  }
  
  // Update nav active state
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });
  
  // Update hash
  if (updateHash) {
    window.location.hash = page;
  }
  
  // Page-specific loading
  if (page === 'dashboard') loadDashboard();
  if (page === 'learn') loadModules();
  if (page === 'base-knowledge' && window.loadBaseKnowledgeFromHash) window.loadBaseKnowledgeFromHash();
  if (page === 'review' && window.loadReviewQueue) window.loadReviewQueue();
  if (page === 'lesson') {
    const parts = window.location.hash.split('/');
    if (parts.length >= 3) {
      loadLesson(parts[1], parseInt(parts[2]) || 0);
    }
  }
  if (page === 'quiz') initQuiz();
  if (page === 'practice') loadInterviewDrills();
  if (page === 'code') initCodeLab();
  if (page === 'quick-learning' && window.loadQuickLearningFromHash) window.loadQuickLearningFromHash();
  if (page === 'progress') loadProgress();
  if (page === 'settings') loadSettings();
}

// Study Timer
function initTimer() {
  const startBtn = document.getElementById('timer-start');
  const pauseBtn = document.getElementById('timer-pause');
  const stopBtn = document.getElementById('timer-stop');
  const display = document.getElementById('timer-display');
  
  function updateDisplay() {
    const totalSeconds = Math.floor(App.studyTimer.elapsed / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    display.textContent = 
      String(hours).padStart(2, '0') + ':' +
      String(minutes).padStart(2, '0') + ':' +
      String(seconds).padStart(2, '0');
  }

  function persistTimerState() {
    localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify({
      running: App.studyTimer.running,
      startTime: App.studyTimer.startTime,
      elapsed: App.studyTimer.elapsed,
      page: App.currentPage
    }));
  }

  function syncRunningTimer() {
    if (!App.studyTimer.running || !App.studyTimer.startTime) return;
    App.studyTimer.elapsed = Date.now() - App.studyTimer.startTime;
    updateDisplay();
    persistTimerState();
  }

  try {
    const saved = JSON.parse(localStorage.getItem(TIMER_STORAGE_KEY) || 'null');
    if (saved) {
      App.studyTimer.running = !!saved.running;
      App.studyTimer.startTime = saved.startTime || null;
      App.studyTimer.elapsed = Number(saved.elapsed) || 0;
      updateDisplay();

      if (App.studyTimer.running && App.studyTimer.startTime) {
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';
        stopBtn.style.display = 'inline-block';
        App.studyTimer.interval = setInterval(syncRunningTimer, 1000);
        syncRunningTimer();
      } else if (App.studyTimer.elapsed > 0) {
        startBtn.style.display = 'inline-block';
        pauseBtn.style.display = 'none';
        stopBtn.style.display = 'inline-block';
      }
    }
  } catch {
    localStorage.removeItem(TIMER_STORAGE_KEY);
  }
  
  startBtn.addEventListener('click', () => {
    App.studyTimer.running = true;
    App.studyTimer.startTime = Date.now() - App.studyTimer.elapsed;
    App.studyTimer.interval = setInterval(() => {
      App.studyTimer.elapsed = Date.now() - App.studyTimer.startTime;
      updateDisplay();
      persistTimerState();
    }, 1000);
    
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
    stopBtn.style.display = 'inline-block';
    persistTimerState();
    
    // Record session start
    fetch('/api/session/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        activity_type: App.currentPage,
        module_slug: null
      })
    });
  });
  
  pauseBtn.addEventListener('click', () => {
    App.studyTimer.running = false;
    clearInterval(App.studyTimer.interval);
    
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    stopBtn.style.display = 'inline-block';
    persistTimerState();
  });
  
  stopBtn.addEventListener('click', () => {
    App.studyTimer.running = false;
    clearInterval(App.studyTimer.interval);
    
    // Record session end
    fetch('/api/session/end', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ duration_seconds: Math.floor(App.studyTimer.elapsed / 1000) })
    }).catch(() => {});
    
    App.studyTimer.elapsed = 0;
    App.studyTimer.startTime = null;
    updateDisplay();
    localStorage.removeItem(TIMER_STORAGE_KEY);
    
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    stopBtn.style.display = 'none';
  });
}

// Load Dashboard Data
async function loadDashboard() {
  try {
    const response = await fetch('/api/learning/progress');
    const data = await response.json();
    const weakConcepts = window.trainingAnalytics?.getWeakConcepts(5) || [];
    const readiness = window.trainingAnalytics?.getReadinessChecklist() || [];
    const actions = window.trainingAnalytics?.getRecommendedActions() || [];
    
    // Update progress ring
    const progress = data.overallProgress || 0;
    const circle = document.getElementById('overall-progress');
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (progress / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    document.getElementById('progress-percent').textContent = progress + '%';
    const readinessLabel = document.getElementById('readiness-label');
    if (readinessLabel) {
      readinessLabel.textContent =
        progress >= 80 ? 'Interview-ready shape' :
        progress >= 55 ? 'Building real momentum' :
        progress >= 25 ? 'Early traction' :
        'Fresh start';
    }
    
    // Update stats
    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    setText('stat-modules', `${data.modulesCompleted || 0}/${data.totalModules || 0}`);
    setText('stat-quiz', `${Math.round(data.quizAccuracy || 0)}%`);
    setText('dashboard-modules', `${data.modulesCompleted || 0}/${data.totalModules || 0}`);
    setText('dashboard-quiz', `${Math.round(data.quizAccuracy || 0)}%`);
    setText('dashboard-time', `${Math.round((data.totalStudyMinutes || 0) / 60 * 10) / 10}h`);
    setText('dashboard-llm', `${data.llmCompleted || 0}`);
    
    // Load continue learning items
    loadContinueItems();
    loadTodayFocus(actions);
    renderWeakConcepts(weakConcepts);
    renderJobReadiness(readiness);
    
  } catch (error) {
    console.error('Failed to load dashboard:', error);
  }
}

function loadTodayFocus(actions) {
  const container = document.getElementById('today-focus');
  if (!container) return;
  if (!actions.length) {
    container.innerHTML = `<div class="zero-state">
      <div class="zero-state-icon">🎯</div>
      <div class="zero-state-title">Nothing scheduled yet</div>
      <div class="zero-state-body">Start a module to build your daily focus list.</div>
    </div>`;
    return;
  }
  container.innerHTML = actions.map((item) => `<div class="focus-item">${item}</div>`).join('');
}

function renderWeakConcepts(items) {
  const container = document.getElementById('weak-concepts');
  if (!container) return;
  if (!items.length) {
    container.innerHTML = `<div class="zero-state">
      <div class="zero-state-icon">💪</div>
      <div class="zero-state-title">Looking strong</div>
      <div class="zero-state-body">No weak concepts detected yet. Answer some quizzes and drills to see gaps here.</div>
    </div>`;
    return;
  }
  container.innerHTML = items.map((item) => `
    <div class="chip-card weak">
      <strong>${item.term}</strong>
      <span>score ${item.score} • misses ${item.misses} • low confidence ${item.lowConfidence}</span>
    </div>
  `).join('');
}

function renderJobReadiness(items) {
  const container = document.getElementById('job-readiness');
  if (!container) return;
  container.innerHTML = items.map((item) => `
    <div class="readiness-row">
      <div class="readiness-copy">
        <strong>${item.label}</strong>
        <span>${item.progress}%</span>
      </div>
      <div class="readiness-bar">
        <div class="readiness-bar-fill ${item.status}" style="width:${item.progress}%"></div>
      </div>
    </div>
  `).join('');
}

async function loadContinueItems() {
  const container = document.getElementById('continue-lessons');
  
  // Sample continue items
  const items = [
    { icon: '📘', title: 'Module 1: Protocol Foundations', meta: '3 lessons remaining' },
    { icon: '❓', title: 'Quiz: Fundamentals', meta: 'Average: 75%' },
    { icon: '💬', title: 'LLM Practice', meta: '5 questions completed' }
  ];
  
  container.innerHTML = items.map(item => `
    <div class="continue-item" onclick="navigateTo('learn')">
      <div class="continue-icon">${item.icon}</div>
      <div class="continue-info">
        <div class="continue-title">${item.title}</div>
        <div class="continue-meta">${item.meta}</div>
      </div>
    </div>
  `).join('');
}

// Load Learning Modules
async function loadModules() {
  const container = document.getElementById('modules-container');
  if (!container) return;
  
  try {
    const response = await fetch('/api/learning/modules');
    const modules = await response.json();
    const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '{}');
    const totalLessons = modules.reduce((sum, mod) => sum + (mod.lesson_count || mod.lessons?.length || 0), 0);
    const totalHours = modules.reduce((sum, mod) => sum + (mod.duration_hours || 0), 0);
    const subtitle = document.querySelector('#learn .subtitle');

    if (subtitle) {
      subtitle.textContent = `${modules.length} modules • ${totalLessons} lessons • ~${totalHours} hours of content`;
    }
    
    container.innerHTML = modules.map((mod, idx) => {
      const lessons = mod.lessons || [];
      const completedCount = lessons.filter((lesson) => completedLessons[`${mod.id}-${lesson.id}`]).length;
      const progress = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;

      return `
      <div class="module-card module-card--actionable" onclick="window.location.hash='#lesson/${mod.id}/0'">
        <div class="module-header">
          <span class="module-number">Module ${idx + 1}</span>
          <h3 class="module-title">${mod.title}</h3>
          <div class="module-duration">⏱ ${mod.duration_hours} hours</div>
        </div>
        <div class="module-body">
          <p class="module-summary">${mod.summary}</p>
          <div class="module-quick-progress">
            <span class="module-quick-label">Quick Learning</span>
            <div class="module-quick-track">
              <div class="module-quick-fill" style="width:${mod.quick_learning_progress || 0}%"></div>
            </div>
            <span class="module-quick-value">${mod.quick_learning_progress || 0}% mastery</span>
          </div>
          <ul class="module-lessons">
            ${lessons.slice(0, 4).map(l => `
              <li class="module-lesson">
                <span class="lesson-check">${completedLessons[`${mod.id}-${l.id}`] ? '✓' : ''}</span>
                ${l.title}
              </li>
            `).join('')}
          </ul>
        </div>
        <div class="module-footer">
          <span class="module-progress">${progress}% complete</span>
          <div class="module-footer-actions">
            <button class="module-btn module-btn-secondary" onclick="event.stopPropagation(); startQuickLearning(${mod.id})">⚡ Quick Learning</button>
            <button class="module-btn">Start Lesson 1 →</button>
          </div>
        </div>
      </div>
    `;}).join('');
    
  } catch (error) {
    container.innerHTML = '<p>Error loading modules. Please refresh.</p>';
  }
}

// Show Module Detail
async function showModuleDetail(moduleId) {
  navigateTo('module-detail');
  
  const container = document.getElementById('module-content');
  container.innerHTML = skeletonCards(2);
  
  try {
    const response = await fetch(`/api/learning/modules/${moduleId}`);
    const mod = await response.json();
    
    container.innerHTML = `
      <div class="module-detail-header">
        <div class="module-breadcrumb">
          <a href="#learn" onclick="navigateTo('learn')">Learn</a>
          <span>/</span>
          <span>${mod.title}</span>
        </div>
        <h1 class="module-detail-title">${mod.title}</h1>
        <div class="module-meta">
          <span class="module-meta-item">⏱ ${mod.duration_hours} hours</span>
          <span class="module-meta-item">📚 ${mod.lessons?.length || 0} lessons</span>
          <span class="module-meta-item">📝 ${mod.quiz_count || 0} quiz questions</span>
        </div>
      </div>
      
      <div class="lesson-container">
        ${mod.lessons ? mod.lessons.map((lesson, idx) => `
          <div class="lesson-section" id="lesson-${idx}">
            <h2 class="lesson-section-title">
              <span>Lesson ${idx + 1}</span>
              ${lesson.title}
            </h2>
            <div class="lesson-content">
              ${renderLessonContent(lesson)}
            </div>
          </div>
        `).join('') : '<p>No lessons available.</p>'}
        
        <div class="lesson-nav">
          <button class="nav-btn" onclick="navigateTo('learn')">
            ← Back to Modules
          </button>
          <button class="nav-btn" onclick="navigateTo('quiz')">
            Take Quiz →
          </button>
        </div>
      </div>
    `;
    
  } catch (error) {
    container.innerHTML = '<p>Error loading module. Please try again.</p>';
  }
}

function renderLessonContent(lesson) {
  let html = '';
  
  if (lesson.what_you_must_know) {
    const points = lesson.what_you_must_know.split('\n').filter(p => p.trim());
    html += `
      <div class="key-points-box memorize-box" style="margin-bottom: 24px;">
        <h4>🎯 What You Must Memorize</h4>
        <ul class="key-points-list">
          ${points.map(p => `<li>${p.replace(/^-\s*/, '')}</li>`).join('')}
        </ul>
      </div>
    `;
  }
  
  if (lesson.body) {
    html += `<p>${lesson.body}</p>`;
  }
  
  if (lesson.formulas) {
    html += `
      <div class="formula-box" style="margin: 24px 0;">
        <code>${lesson.formulas}</code>
        <div class="formula-desc">Key formula to memorize</div>
      </div>
    `;
  }
  
  if (lesson.why_it_matters) {
    html += `
      <div class="key-points-box" style="margin-top: 24px;">
        <h4>💡 Why This Matters</h4>
        <p style="font-size: 14px; color: var(--text-secondary);">${lesson.why_it_matters}</p>
      </div>
    `;
  }
  
  if (lesson.interview_drill) {
    html += `
      <div class="drill-box" style="margin-top: 24px;">
        <h4>🎤 Interview Drill (60 seconds)</h4>
        <div class="drill-prompt">${lesson.interview_drill}</div>
        <button class="btn btn-primary" onclick="startDrillTimer(this)">Start Timer</button>
        <div class="drill-timer" style="display:none">1:00</div>
      </div>
    `;
  }
  
  return html;
}

function startDrillTimer(btn) {
  const timer = btn.nextElementSibling;
  btn.style.display = 'none';
  timer.style.display = 'block';
  
  let seconds = 60;
  const interval = setInterval(() => {
    seconds--;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timer.textContent = `${mins}:${String(secs).padStart(2, '0')}`;
    
    if (seconds <= 0) {
      clearInterval(interval);
      timer.textContent = 'Time\'s up!';
      timer.style.color = 'var(--color-success)';
    }
  }, 1000);
}

// Initialize Quiz
function initQuiz() {
  const setup = document.getElementById('quiz-setup');
  const game = document.getElementById('quiz-game');
  
  // Reset to setup
  setup.style.display = 'block';
  game.style.display = 'none';
  renderQuizAnalytics();
  
  // Bind mode buttons
  document.querySelectorAll('.quiz-mode-btn').forEach(btn => {
    btn.onclick = () => startQuiz(btn.dataset.mode);
  });
}

function renderQuizAnalytics() {
  const container = document.getElementById('quiz-analytics');
  if (!container) return;

  const analytics = window.trainingAnalytics;
  if (!analytics) {
    container.innerHTML = `
      <h3>Quiz Analytics</h3>
      <p class="subtitle">Analytics are unavailable in this session.</p>
    `;
    return;
  }

  const summary = analytics.getPracticeSummary() || {};
  const categories = analytics.categoryScoreboard() || [];
  const weakConcepts = analytics.getWeakConcepts(5) || [];
  const confidenceHistory = analytics.getConfidenceHistory ? analytics.getConfidenceHistory() : [];
  const guessedCount = confidenceHistory.filter((entry) => entry.source === 'main-quiz' && entry.confidence === 'guessed').length;
  const callReadyCount = confidenceHistory.filter((entry) => entry.source === 'main-quiz' && entry.confidence === 'call-ready').length;
  const attempts = summary.quizAttempts || 0;
  const totalCorrect = categories.reduce((sum, item) => sum + (item.correct || 0), 0);
  const totalQuestions = categories.reduce((sum, item) => sum + (item.total || 0), 0);
  const accuracy = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  container.innerHTML = `
    <h3>Quiz Analytics</h3>
    <p class="subtitle">Live from your quiz history. Weak Areas mode now uses these saved results.</p>
    <div class="quiz-analytics-stats">
      <div class="quiz-analytics-stat">
        <strong>${attempts}</strong>
        <span>Answers logged</span>
      </div>
      <div class="quiz-analytics-stat">
        <strong>${accuracy}%</strong>
        <span>Accuracy</span>
      </div>
      <div class="quiz-analytics-stat">
        <strong>${guessedCount}</strong>
        <span>Guessed</span>
      </div>
      <div class="quiz-analytics-stat">
        <strong>${callReadyCount}</strong>
        <span>Call-ready</span>
      </div>
    </div>
    <div class="quiz-analytics-section">
      <h4>Category Accuracy</h4>
      ${categories.length ? categories.slice(0, 6).map((item) => `
        <div class="quiz-analytics-row">
          <div class="quiz-analytics-row-top">
            <span>${item.label || item.category}</span>
            <span>${item.correct}/${item.total} · ${item.accuracy}%</span>
          </div>
          <div class="quiz-analytics-bar">
            <div class="quiz-analytics-bar-fill" style="width:${item.accuracy}%;"></div>
          </div>
        </div>
      `).join('') : '<p class="quiz-analytics-empty">Answer a few quiz questions to populate category performance.</p>'}
    </div>
    <div class="quiz-analytics-section">
      <h4>Weak Concepts</h4>
      <div class="chips-list">
        ${weakConcepts.length ? weakConcepts.map((item) => `<div class="chip-card weak"><strong>${item.term}</strong><span>score ${item.score}</span></div>`).join('') : '<p class="quiz-analytics-empty">No weak concepts yet.</p>'}
      </div>
    </div>
  `;
}

async function startQuiz(mode) {
  document.getElementById('quiz-setup').style.display = 'none';
  document.getElementById('quiz-game').style.display = 'block';
  
  const container = document.getElementById('quiz-game');
  container.innerHTML = skeletonCards(2);
  
  try {
    const response = await fetch(`/api/quiz/questions?mode=${mode}&limit=10`);
    const questions = await response.json();
    
    window.currentQuiz = {
      questions,
      currentIdx: 0,
      score: 0,
      answers: []
    };
    
    showQuestion();
    
  } catch (error) {
    container.innerHTML = '<p>Error loading quiz. Please try again.</p>';
  }
}

function showQuestion() {
  const quiz = window.currentQuiz;
  const q = quiz.questions[quiz.currentIdx];
  const container = document.getElementById('quiz-game');
  const glossaryHtml = window.renderGlossaryHtmlFromTexts
    ? window.renderGlossaryHtmlFromTexts([q.question, ...(q.options || []), q.explanation, q.interview_tip])
    : '';
  
  container.innerHTML = `
    <div class="quiz-header">
      <span class="quiz-progress">Question ${quiz.currentIdx + 1} of ${quiz.questions.length}</span>
      <span class="quiz-score">Score: ${quiz.score}</span>
    </div>
    <div class="quiz-question">${q.question}</div>
    <div class="quiz-options">
      ${q.options.map((opt, idx) => `
        <button class="quiz-option" onclick="selectAnswer(${idx})">
          ${opt}
        </button>
      `).join('')}
    </div>
    ${glossaryHtml}
  `;
}

function selectAnswer(idx) {
  const quiz = window.currentQuiz;
  const q = quiz.questions[quiz.currentIdx];
  const options = document.querySelectorAll('.quiz-option');
  
  // Disable all buttons
  options.forEach(btn => btn.disabled = true);
  
  // Show correct/incorrect
  options[q.correct].classList.add('correct');
  if (idx !== q.correct) {
    options[idx].classList.add('wrong');
  } else {
    quiz.score++;
  }
  
  // Show explanation
  const container = document.getElementById('quiz-game');
  const explanation = document.createElement('div');
  explanation.className = `quiz-explanation ${idx === q.correct ? 'correct' : 'wrong'}`;
  const expandedExplanation = q.expandedExplanation || q.explanation;
  explanation.innerHTML = `
    <strong>${idx === q.correct ? '✓ Correct!' : '✗ Incorrect'}</strong>
    <p><strong>Answer:</strong> ${q.options[q.correct]}</p>
    <div><strong>Why:</strong> ${window.formatLessonBody ? window.formatLessonBody(expandedExplanation) : expandedExplanation}</div>
    ${q.interview_tip ? `<p style="margin-top:12px;color:var(--color-warning)">💡 ${q.interview_tip}</p>` : ''}
    <div class="confidence-inline">
      <span>Confidence check</span>
      <div class="confidence-buttons">
        <button class="btn btn-secondary" onclick="recordQuizConfidence('guessed')">I guessed</button>
        <button class="btn btn-secondary" onclick="recordQuizConfidence('knew')">I knew it</button>
        <button class="btn btn-secondary" onclick="recordQuizConfidence('call-ready')">I can explain it on a call</button>
      </div>
    </div>
  `;
  container.appendChild(explanation);

  if (window.trainingAnalytics) {
    const concepts = window.trainingAnalytics.extractConcepts([q.question, ...(q.options || []), q.explanation, q.interview_tip]);
    window.trainingAnalytics.recordQuizResult({
      source: 'main-quiz',
      question: q.question,
      correct: idx === q.correct,
      category: q.category || 'uncategorized',
      module_slug: q.module_slug || '',
      difficulty: q.difficulty || 'intermediate',
      concepts
    });
    window.pendingQuizConfidence = { question: q.question, concepts };
    renderQuizAnalytics();
  }

  const numericQuestionId = Number(q.id);
  if (Number.isInteger(numericQuestionId) && numericQuestionId > 0) {
    fetch('/api/quiz/answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        questionId: numericQuestionId,
        correct: idx === q.correct
      })
    }).catch((error) => {
      console.error('Failed to persist quiz answer:', error);
    });
  }
  
  // Next button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn btn-primary';
  nextBtn.style.marginTop = '20px';
  nextBtn.textContent = quiz.currentIdx < quiz.questions.length - 1 ? 'Next Question →' : 'See Results';
  nextBtn.onclick = () => {
    if (quiz.currentIdx < quiz.questions.length - 1) {
      quiz.currentIdx++;
      showQuestion();
    } else {
      showQuizResults();
    }
  };
  container.appendChild(nextBtn);
}

function recordQuizConfidence(confidence) {
  if (!window.trainingAnalytics || !window.pendingQuizConfidence) return;
  window.trainingAnalytics.recordConfidence({
    source: 'main-quiz',
    confidence,
    ...window.pendingQuizConfidence
  });
  const wrap = document.querySelector('#quiz-game .confidence-inline');
  if (wrap) {
    wrap.innerHTML = `<strong>Saved:</strong> ${confidence === 'guessed' ? 'guessed' : confidence === 'knew' ? 'knew it' : 'call-ready'}`;
  }
  renderQuizAnalytics();
}

function showQuizResults() {
  const quiz = window.currentQuiz;
  const container = document.getElementById('quiz-game');
  const percent = Math.round((quiz.score / quiz.questions.length) * 100);
  
  container.innerHTML = `
    <div style="text-align:center;padding:40px 0;">
      <div style="font-size:64px;margin-bottom:20px;">${percent >= 70 ? '🎉' : percent >= 50 ? '👍' : '💪'}</div>
      <h2 style="font-size:28px;margin-bottom:16px;">Quiz Complete!</h2>
      <div style="font-size:48px;font-weight:700;color:var(--color-primary);margin-bottom:8px;">${percent}%</div>
      <p style="color:var(--text-secondary);margin-bottom:32px;">
        You got ${quiz.score} out of ${quiz.questions.length} correct
      </p>
      <button class="btn btn-primary" onclick="initQuiz()">Try Again</button>
      <button class="btn btn-secondary" onclick="navigateTo('dashboard')" style="margin-left:12px;">
        Back to Dashboard
      </button>
    </div>
  `;
}

// Load LLM Questions
async function loadLLMQuestions() {
  const container = document.getElementById('llm-container');
  if (!container) return;
  
  try {
    const response = await fetch('/api/llm/questions');
    const questions = await response.json();
    
    if (questions.length === 0) {
      container.innerHTML = '<p>No practice questions available.</p>';
      return;
    }
    
    // Show first question
    showLLMQuestion(questions[0], 1, questions.length);
    
  } catch (error) {
    container.innerHTML = '<p>Error loading questions. Please try again.</p>';
  }
}

function showLLMQuestion(q, current, total) {
  const container = document.getElementById('llm-container');
  
  container.innerHTML = `
    <div class="llm-question-card">
      <div class="llm-question-header">
        <span class="llm-difficulty ${q.difficulty}">${q.difficulty}</span>
        <span class="llm-category">${q.category} • Question ${current} of ${total}</span>
      </div>
      <div class="llm-question">${q.question}</div>
      
      <div class="llm-rubric">
        <h4>What to Include</h4>
        <ul>
          ${q.rubric.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>
      
      <div class="llm-answer-area">
        <textarea id="llm-answer" placeholder="Type your answer here... Practice speaking out loud for interview simulation."></textarea>
      </div>
      
      <button id="llm-submit-btn" class="llm-submit-btn" onclick="submitLLMAnswer(${q.id})">
        Submit for Evaluation
      </button>
      
      <div id="llm-result" style="display:none"></div>
    </div>
  `;
}

function renderLLMLoadingState(message = 'Evaluating with interview rubric...') {
  return `
    <div class="llm-loading-state">
      <div class="llm-loading-spinner" aria-hidden="true"></div>
      <div class="llm-loading-copy">${message}</div>
    </div>
  `;
}

function setLoadingButtonState(button, loadingText) {
  if (!button) return;
  if (!button.dataset.originalText) {
    button.dataset.originalText = button.innerHTML;
  }
  button.disabled = true;
  button.innerHTML = `<span class="llm-inline-spinner" aria-hidden="true"></span>${loadingText}`;
}

function resetLoadingButtonState(button) {
  if (!button) return;
  button.disabled = false;
  button.innerHTML = button.dataset.originalText || button.innerHTML;
}

async function submitLLMAnswer(questionId) {
  const answerEl = document.getElementById('llm-answer');
  const submitBtn = document.getElementById('llm-submit-btn');
  const answer = answerEl?.value.trim();
  if (!answer) {
    alert('Please enter an answer first.');
    return;
  }
  
  const resultDiv = document.getElementById('llm-result');
  if (answerEl) answerEl.disabled = true;
  setLoadingButtonState(submitBtn, 'Evaluating...');
  resultDiv.style.display = 'block';
  resultDiv.innerHTML = renderLLMLoadingState();
  
  try {
    const { evaluation, promptPackage } = await requestLLMEvaluation(questionId, answer);
    let scoreClass = 'needs-work';
    if (evaluation.score >= 85) scoreClass = 'excellent';
    else if (evaluation.score >= 70) scoreClass = 'good';
    
    resultDiv.innerHTML = `
      <div class="llm-result">
        <div class="llm-score-display">
          <div class="llm-score-circle ${scoreClass}">${evaluation.score}%</div>
          <div>
            <div style="font-weight:600;margin-bottom:4px;">${scoreClass === 'excellent' ? 'Excellent!' : scoreClass === 'good' ? 'Good Job' : 'Keep Practicing'}</div>
            <div class="llm-score-label">${evaluation.rating.replace(/-/g, ' ')} • rubric-based scoring</div>
          </div>
        </div>
        <div class="llm-feedback">
          ${evaluation.summary}
        </div>
        ${(evaluation.improvements || []).length > 0 ? `
          <div style="margin-top:16px;padding:16px;background:rgba(239,68,68,0.1);border-radius:8px;">
            <strong style="color:var(--color-danger);">Missed Points:</strong>
            <ul style="margin-top:8px;margin-left:20px;font-size:13px;">
              ${evaluation.improvements.map(p => `<li>${p}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        ${renderPromptInspector(`llm-${questionId}`, answer, promptPackage)}
      </div>
    `;
    
  } catch (error) {
    resultDiv.innerHTML = `<p style="color:var(--color-danger);">${error.message || 'Evaluation failed. Please try again.'}</p>`;
  } finally {
    if (answerEl) answerEl.disabled = false;
    resetLoadingButtonState(submitBtn);
  }
}

// Load Code Challenges
async function loadCodeChallenges() {
  const container = document.getElementById('code-container');
  if (!container) return;
  
  // Sample challenges
  const challenges = [
    {
      title: 'Calculate Health Factor',
      difficulty: 'easy',
      description: 'Implement a function to calculate the health factor for a Morpho position.',
      hints: ['Health Factor = (Collateral Value × LLTV) / Borrowed', 'Use BigInt for precision']
    },
    {
      title: 'Liquidation Price',
      difficulty: 'medium',
      description: 'Calculate the liquidation price given collateral amount, borrowed amount, and LLTV.',
      hints: ['Liquidation occurs when HF < 1', 'Work backwards from HF = 1']
    },
    {
      title: 'Bundler Bundle Builder',
      difficulty: 'hard',
      description: 'Construct a multi-action bundle using the Bundler3 contract.',
      hints: ['Use bundle() to start', 'Chain actions with then()']
    }
  ];
  
  container.innerHTML = challenges.map((c, idx) => `
    <div class="challenge-card">
      <div class="challenge-header">
        <span class="challenge-title">${c.title}</span>
        <span class="challenge-difficulty ${c.difficulty}">${c.difficulty}</span>
      </div>
      <div class="challenge-body">
        <p class="challenge-desc">${c.description}</p>
        <div class="challenge-hints">
          <h4>Hints</h4>
          <ul>
            ${c.hints.map(h => `<li>• ${h}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
  `).join('');
}

// Load Progress Page
async function loadProgress() {
  const container = document.getElementById('progress-content');
  if (!container) return;
  const readiness = window.trainingAnalytics?.getReadinessChecklist() || [];
  const weak = window.trainingAnalytics?.getWeakConcepts(8) || [];
  const strong = window.trainingAnalytics?.getStrongConcepts(5) || [];
  const weakCategories = window.trainingAnalytics?.getWeakCategories(8) || [];
  const allCategories = window.trainingAnalytics?.categoryScoreboard() || [];
  const summary = window.trainingAnalytics?.getPracticeSummary() || {};
  let quickLearningHistory = [];

  try {
    const response = await fetch('/api/quick-learning/history');
    const data = await response.json();
    if (response.ok) {
      quickLearningHistory = data.history || [];
    }
  } catch (error) {
    console.error('Failed to load quick learning history:', error);
  }
  
  container.innerHTML = `
    <div class="progress-overview">
      <div class="progress-stat-card">
        <div class="progress-stat-value">${summary.quizAttempts || 0}</div>
        <div class="progress-stat-label">Quiz Attempts</div>
      </div>
      <div class="progress-stat-card">
        <div class="progress-stat-value">${summary.drillAttempts || 0}</div>
        <div class="progress-stat-label">Drill Attempts</div>
      </div>
      <div class="progress-stat-card">
        <div class="progress-stat-value">${summary.codeTouches || 0}</div>
        <div class="progress-stat-label">Code Touches</div>
      </div>
      <div class="progress-stat-card">
        <div class="progress-stat-value">${summary.mockAttempts || 0}</div>
        <div class="progress-stat-label">Mock Interviews</div>
      </div>
    </div>
    
    <div class="dashboard-card">
      <h3>Role Readiness</h3>
      <div style="margin-top:20px;">
        ${readiness.map((item) => `
          <div class="readiness-row">
            <div class="readiness-copy">
              <strong>${item.label}</strong>
              <span>${item.progress}%</span>
            </div>
            <div class="readiness-bar">
              <div class="readiness-bar-fill ${item.status}" style="width:${item.progress}%"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="dashboard-card">
      <h3>Weak Concepts To Attack</h3>
      <div class="chips-list">
        ${weak.map((item) => `<div class="chip-card weak"><strong>${item.term}</strong><span>score ${item.score}</span></div>`).join('') || '<div class="zero-state"><div class="zero-state-icon">💪</div><div class="zero-state-title">No weak spots yet</div><div class="zero-state-body">Answer quizzes to see gaps here.</div></div>'}
      </div>
    </div>

    ${allCategories.length > 0 ? `
    <div class="dashboard-card">
      <h3>Quiz Accuracy by Category</h3>
      <p class="subtitle" style="margin-bottom:16px;">Based on ${summary.quizAttempts || 0} quiz answers. Categories below 70% accuracy need the most work.</p>
      <div style="display:flex;flex-direction:column;gap:10px;">
        ${allCategories.map((item) => {
          const barColor = item.accuracy >= 80 ? 'var(--color-success, #4CAF50)' : item.accuracy >= 60 ? 'var(--color-warning, #FF9800)' : 'var(--color-error, #F44336)';
          const statusLabel = item.accuracy >= 80 ? 'strong' : item.accuracy >= 60 ? 'developing' : 'weak';
          return `
          <div class="readiness-row">
            <div class="readiness-copy">
              <strong>${item.label}</strong>
              <span style="color:${barColor}">${item.accuracy}% (${item.correct}/${item.total})</span>
            </div>
            <div class="readiness-bar">
              <div class="readiness-bar-fill ${statusLabel}" style="width:${item.accuracy}%;background:${barColor}"></div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>
    ` : ''}

    <div class="dashboard-card">
      <h3>Strong Concepts</h3>
      <div class="chips-list">
        ${strong.map((item) => `<div class="chip-card strong"><strong>${item.term}</strong><span>score ${item.score}</span></div>`).join('') || '<div class="zero-state"><div class="zero-state-icon">🌱</div><div class="zero-state-title">Building strength</div><div class="zero-state-body">Your best concepts will appear here as you practice.</div></div>'}
      </div>
    </div>

    <div class="dashboard-card">
      <h3>Quick Learning Medals</h3>
      <div class="quick-learning-history-list">
        ${quickLearningHistory.map((item) => `
          <div class="quick-learning-history-item">
            <div class="quick-learning-history-head">
              <span class="quick-learning-complete-badge quick-learning-complete-badge--${item.medal_tone}">${item.medal_label}</span>
              ${item.pressure_mode ? '<span class="source-badge">Pressure</span>' : ''}
            </div>
            <div class="quick-learning-history-title">${item.module_title}</div>
            <div class="quick-learning-history-meta">
              <span>${item.accuracy_percent}% accuracy</span>
              <span>${((item.avg_response_ms || 0) / 1000).toFixed(1)}s avg pace</span>
              <span>best streak ${item.best_streak}</span>
              <span>${new Date(item.completed_at).toLocaleString()}</span>
            </div>
          </div>
        `).join('') || '<p class="empty-state">Finish a Quick Learning run to earn your first medal.</p>'}
      </div>
    </div>

    <div class="dashboard-card">
      <h3>Settings</h3>
      <p class="subtitle">Reset all study progress, quiz history, interview history, review spacing, and local analytics back to a clean starting state.</p>
      <button class="btn btn-danger" onclick="resetStudyState()">Reset Study State</button>
    </div>
  `;
}


async function loadInterviewDrills() {
  const container = document.getElementById('drills-container');
  if (!container) return;

  container.innerHTML = skeletonCards(4);

  try {
    const response = await fetch('/api/llm/questions');
    const data = await response.json();
    const drills = data.questions || [];
    const drillRecords = getDrillRecords();
    const subtitle = document.querySelector('#practice .subtitle');

    if (subtitle) {
      subtitle.textContent = `${drills.length} role-specific use cases with rubric-based feedback`;
    }

    renderPracticeModes(drills);

    container.innerHTML = `
      <div id="active-drill-panel" class="active-drill-panel"></div>
      <div class="drills-list">
        ${drills
          .slice()
          .sort((a, b) => {
            const aDone = Boolean(drillRecords[`practice-${a.id}`]?.answeredAt);
            const bDone = Boolean(drillRecords[`practice-${b.id}`]?.answeredAt);
            if (aDone !== bDone) return aDone ? 1 : -1;
            return a.id - b.id;
          })
          .map((drill) => {
            const record = drillRecords[`practice-${drill.id}`];
            const answered = Boolean(record?.answeredAt);
            const scoreLabel = typeof record?.evaluation?.score === 'number' ? `${record.evaluation.score}%` : 'Pending';
            return `
          <article class="drill-card ${answered ? 'answered' : ''}">
            <div class="drill-card-topline">
              <span class="difficulty-badge ${drill.difficulty}">${drill.difficulty}</span>
              <span class="category-badge">${drill.category}</span>
              ${answered ? `<span class="answered-badge">Answered${scoreLabel ? ` • ${scoreLabel}` : ''}</span>` : ''}
            </div>
            <h3>${drill.title}</h3>
            <p>${drill.question}</p>
            <ul class="drill-rubric-list">
              ${(drill.rubric || []).slice(0, 4).map((point) => `<li>${point}</li>`).join('')}
            </ul>
            ${drill.followUp ? `<p class="drill-follow-up"><strong>Follow-up:</strong> ${drill.followUp}</p>` : ''}
            <button class="btn btn-primary" onclick="startPracticeDrill(${drill.id})">${answered ? 'Reopen Drill' : 'Open Drill'}</button>
          </article>
        `;}).join('')}
      </div>
    `;
  } catch (error) {
    container.innerHTML = '<p>Error loading use cases. Please refresh.</p>';
  }
}

async function startPracticeDrill(questionId) {
  const panel = document.getElementById('active-drill-panel');
  if (!panel) return;

  panel.innerHTML = '<div class="dashboard-card"><p>Loading selected drill...</p></div>';

  try {
    const response = await fetch(`/api/llm/questions/${questionId}`);
    const drill = await response.json();
    const record = getDrillRecords()[`practice-${questionId}`];
    const previousAnswer = record?.answer || '';
    const previousScore = typeof record?.evaluation?.score === 'number'
      ? `<p class="drill-follow-up"><strong>Last score:</strong> ${record.evaluation.score}%</p>`
      : '';

    panel.innerHTML = `
      <div class="dashboard-card drill-workspace-card">
        <div class="drill-card-topline">
          <span class="difficulty-badge ${drill.difficulty}">${drill.difficulty}</span>
          <span class="category-badge">${drill.category}</span>
        </div>
        <h2>${drill.title}</h2>
        <p class="drill-workspace-question">${drill.question}</p>
        <div class="llm-rubric">
          <h4>What to include</h4>
          <ul>
            ${(drill.rubric || []).map((point) => `<li>${point}</li>`).join('')}
          </ul>
        </div>
        ${previousScore}
        ${drill.followUp ? `<p class="drill-follow-up"><strong>Follow-up to rehearse:</strong> ${drill.followUp}</p>` : ''}
        <textarea id="practice-drill-answer" class="practice-drill-answer" rows="8" placeholder="Draft the answer you would say on a partner call. Keep it clear, exact, and business-aware.">${escapePromptHtml(previousAnswer)}</textarea>
        <div class="drill-workspace-actions">
          <button id="practice-drill-submit" class="btn btn-primary" onclick="submitPracticeDrill(${drill.id})">Evaluate Answer</button>
        </div>
        <div id="practice-drill-result"></div>
      </div>
    `;

    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    panel.innerHTML = '<div class="dashboard-card"><p>Failed to load the selected drill.</p></div>';
  }
}

async function submitPracticeDrill(questionId) {
  const answerEl = document.getElementById('practice-drill-answer');
  const resultEl = document.getElementById('practice-drill-result');
  const submitBtn = document.getElementById('practice-drill-submit');

  if (!answerEl || !resultEl) return;

  const answer = answerEl.value.trim();
  if (!answer) {
    resultEl.innerHTML = '<p style="color:var(--color-danger);margin-top:12px;">Write an answer first.</p>';
    return;
  }

  saveDrillRecord({
    scope: 'practice',
    questionId,
    answer,
    evaluation: { score: 0, summary: 'Submitted for evaluation.' },
    promptPackage: null,
    pending: true
  });

  resultEl.innerHTML = '<div class="dashboard-card" style="margin-top:16px;"><p>Evaluating...</p></div>';
  answerEl.disabled = true;
  setLoadingButtonState(submitBtn, 'Evaluating...');
  resultEl.innerHTML = renderLLMLoadingState('Scoring your drill answer...');

  try {
    const { evaluation, promptPackage } = await requestLLMEvaluation(questionId, answer);

    const concepts = window.trainingAnalytics?.extractConcepts([answer, questionId.toString()]) || [];
    window.trainingAnalytics?.recordDrill({
      source: 'practice-drill',
      questionId,
      score: evaluation.score,
      concepts
    });
    saveDrillRecord({ scope: 'practice', questionId, answer, evaluation, promptPackage });
    refreshDrillAnsweredState(questionId, evaluation.score);

    resultEl.innerHTML = `
      <div class="dashboard-card drill-evaluation-card" style="margin-top:16px;">
        <div class="llm-score-display">
          <div class="llm-score-circle ${evaluation.score >= 85 ? 'excellent' : evaluation.score >= 70 ? 'good' : 'needs-work'}">${evaluation.score}%</div>
          <div>
            <div style="font-weight:600;margin-bottom:4px;">${evaluation.summary}</div>
            <div class="llm-score-label">Protocol accuracy, clarity, empathy, objection handling, and POC readiness</div>
          </div>
        </div>
        <div class="llm-feedback">
          <strong>Strengths</strong>
          <ul>
            ${(evaluation.strengths || []).map((item) => `<li>${item}</li>`).join('') || '<li>No strong coverage detected yet.</li>'}
          </ul>
          <strong>Needs tightening</strong>
          <ul>
            ${(evaluation.improvements || []).map((item) => `<li>${item}</li>`).join('') || '<li>No major misses flagged.</li>'}
          </ul>
        </div>
        <div class="drill-result-actions">
          <button class="btn btn-secondary" onclick="focusDrillAnswer('practice-drill-answer')">Answer Again</button>
          <button class="btn btn-secondary" onclick="togglePromptInspector('practice-${questionId}')">Prompt</button>
        </div>
        ${renderPromptInspector(`practice-${questionId}`, answer, promptPackage)}
      </div>
    `;
  } catch (error) {
    resultEl.innerHTML = `<p style="color:var(--color-danger);margin-top:12px;">${error.message || 'Evaluation failed. Try again.'}</p>`;
  } finally {
    answerEl.disabled = false;
    resetLoadingButtonState(submitBtn);
  }
}

function renderPracticeModes(drills) {
  const container = document.getElementById('practice-modes');
  if (!container) return;

  container.innerHTML = `
    <div class="dashboard-card">
      <h3>Formula Trainer</h3>
      <p>Run rapid-fire reps on LLTV, HF, LTV, liquidation price, oracle scaling, and LIF.</p>
      <button class="btn btn-secondary" onclick="startFormulaTrainer()">Start Formula Reps</button>
    </div>
    <div class="dashboard-card">
      <h3>Scenario Simulator</h3>
      <p>Practice partner objections, support incidents, and scoping calls instead of raw trivia.</p>
      <button class="btn btn-secondary" onclick="startScenarioSimulator()">Start Scenarios</button>
    </div>
    <div class="dashboard-card">
      <h3>Mock Interview</h3>
      <p>Run a structured five-question loop across fundamentals, integrations, objections, and POC readiness.</p>
      <button class="btn btn-primary" onclick="startMockInterview()">Start Mock Interview</button>
    </div>
  `;
}

function loadSettings() {
  const menuList = document.getElementById('settings-menu-list');
  const motivatorToggle = document.getElementById('toggle-motivator');
  if (!menuList || !motivatorToggle || !App.settings) return;

  const labels = {
    dashboard: 'Dashboard',
    learn: 'Learn',
    'base-knowledge': 'Base Knowledge',
    review: 'Review',
    quiz: 'Quiz',
    practice: 'Use Cases',
    code: 'Code Lab',
    progress: 'Progress'
  };

  menuList.innerHTML = Object.entries(labels).map(([page, label]) => `
    <label class="settings-toggle">
      <div>
        <strong>${label}</strong>
        <p>Show this menu item in the sidebar.</p>
      </div>
      <input type="checkbox" data-menu-toggle="${page}" ${App.settings.menuVisibility[page] !== false ? 'checked' : ''}>
    </label>
  `).join('');

  menuList.querySelectorAll('[data-menu-toggle]').forEach((input) => {
    input.addEventListener('change', () => {
      const page = input.dataset.menuToggle;
      App.settings.menuVisibility[page] = input.checked;
      persistUISettings();
      applyUISettings();
    });
  });

  motivatorToggle.checked = App.settings.motivatorEnabled !== false;
  motivatorToggle.onchange = () => {
    App.settings.motivatorEnabled = motivatorToggle.checked;
    persistUISettings();
    applyUISettings();
  };
}

async function startFormulaTrainer() {
  const container = document.getElementById('active-drill-panel');
  if (!container) return;
  const prompts = [
    {
      q: 'Define LLTV and say what happens when LTV exceeds it.',
      formula: 'Healthy if LTV <= LLTV',
      a: 'LLTV is the liquidation threshold. If LTV rises above it, the position becomes liquidatable.'
    },
    {
      q: 'What does HF around 1 mean?',
      formula: 'Health Factor = Max Borrow / borrowAssets',
      a: 'Health Factor around 1 means the position is at or near liquidation threshold.'
    },
    {
      q: 'What is the practical meaning of 1e36 oracle scaling?',
      formula: 'Collateral Value = collateralAssets * oraclePrice / 1e36',
      a: 'It is the precision scale used to combine prices and token decimals safely in Morpho math.'
    },
    {
      q: 'What does LIF control?',
      formula: 'LIF = min(1.15, 1 / (0.3 * LLTV + 0.7))',
      a: 'LIF controls the liquidation incentive, meaning how much extra collateral a liquidator can receive.'
    },
    {
      q: 'Why leave borrow buffer below LLTV?',
      formula: 'LTV = borrowAssets / collateralValue',
      a: 'Because price movement, interest accrual, and rounding can push a position into liquidation.'
    },
    {
      q: 'How do you compute collateral value in loan-token terms?',
      formula: 'Collateral Value = collateralAssets * oraclePrice / 1e36',
      a: 'Multiply collateral assets by the oracle price and divide by 1e36. The result is denominated in loan-token units.'
    },
    {
      q: 'How do you compute max borrow from collateral value and LLTV?',
      formula: 'Max Borrow = collateralValue * LLTV',
      a: 'Max borrow is collateral value multiplied by the LLTV threshold. In product language, that is the debt ceiling implied by the current collateral value.'
    },
    {
      q: 'What is the direct formula for LTV?',
      formula: 'LTV = borrowAssets / collateralValue',
      a: 'LTV is current debt divided by current collateral value.'
    },
    {
      q: 'What is the direct formula for liquidation price?',
      formula: 'Liquidation Price = borrowAssets * 1e36 * 1e18 / (collateralAssets * LLTV)',
      a: 'Liquidation price is the price point where the position reaches HF = 1, assuming the rest of the state is unchanged.'
    },
    {
      q: 'What does HF > 1 versus HF <= 1 mean operationally?',
      formula: 'HF > 1 = healthy; HF <= 1 = liquidatable',
      a: 'HF above 1 means the position is still inside the safety boundary. HF at or below 1 means liquidation is allowed.'
    },
    {
      q: 'When does a position enter bad debt territory?',
      formula: 'Bad debt zone if LTV > 1 / LIF',
      a: 'Bad debt starts once collateral can no longer fully cover debt even after liquidation incentive mechanics are applied.'
    },
    {
      q: 'How do supply APY, borrow APY, utilization, and fee connect?',
      formula: 'supplyApy = borrowApy * (1 - fee) * utilization',
      a: 'Supply APY is driven by borrower demand, reduced by protocol fee, and scaled by utilization because idle liquidity is not earning borrow-side yield.'
    },
    {
      q: 'What is the AdaptiveCurveIRM target utilization to remember?',
      formula: 'AdaptiveCurveIRM target utilization = 90%',
      a: 'The key mental model is that the IRM is trying to keep utilization near 90%, adjusting rates around that target.'
    },
    {
      q: 'How do you describe the liquidation regimes cleanly?',
      formula: 'Healthy: LTV <= LLTV | Liquidatable: LLTV < LTV <= 1 / LIF | Bad debt: LTV > 1 / LIF',
      a: 'There are three states to memorize: healthy, liquidatable, and bad debt. The transitions are defined by LLTV first and then 1 / LIF.'
    }
  ];
  const prompt = prompts[Math.floor(Math.random() * prompts.length)];
  container.innerHTML = `
    <div class="dashboard-card drill-workspace-card">
      <div class="drill-card-topline">
        <span class="category-badge">formula-trainer</span>
        <span>${prompts.length} formula reps loaded</span>
      </div>
      <h2>${prompt.q}</h2>
      <p>Answer out loud first. Then use the formula and target explanation to check yourself.</p>
      <div class="review-formula-box" style="margin-top:16px;">
        <strong>Formula</strong>
        <pre>${prompt.formula}</pre>
      </div>
      <div class="drill-workspace-actions">
        <button class="btn btn-secondary" onclick="this.closest('.drill-workspace-card').querySelector('.glossary-box').style.display='block'">Show Target Answer</button>
        <button class="btn btn-primary" onclick="startFormulaTrainer()">Next Formula</button>
      </div>
      <div style="display:none;margin-top:16px;" class="glossary-box">
        <h4>Target Explanation</h4>
        <p>${prompt.a}</p>
      </div>
    </div>
  `;
}

async function startScenarioSimulator() {
  const response = await fetch('/api/llm/questions');
  const data = await response.json();
  const drills = (data.questions || []).filter((item) => /partner|communication|scenario|integration/i.test(`${item.category} ${item.question}`));
  const chosen = drills[Math.floor(Math.random() * drills.length)] || data.questions?.[0];
  if (chosen) startPracticeDrill(chosen.id);
}

async function startMockInterview() {
  const response = await fetch('/api/llm/questions');
  const data = await response.json();
  const questions = (data.questions || []).slice(0, 12);
  const chosen = [];
  const categorySeen = new Set();

  for (const question of questions) {
    if (!categorySeen.has(question.category) || chosen.length < 5) {
      chosen.push(question);
      categorySeen.add(question.category);
    }
    if (chosen.length >= 5) break;
  }

  window.mockInterviewState = {
    questions: chosen,
    index: 0,
    scores: [],
    evaluations: {},
    answers: {},
    startedAt: Date.now()
  };

  renderMockInterviewQuestion();
}

function selectMockInterviewQuestion(index) {
  const state = window.mockInterviewState;
  if (!state) return;
  state.index = index;
  renderMockInterviewQuestion();
}

function renderMockInterviewQuestion() {
  const state = window.mockInterviewState;
  const container = document.getElementById('active-drill-panel');
  if (!state || !container) return;
  const question = state.questions[state.index];
  if (!question) return;
  const existingEvaluation = state.evaluations[question.id];
  const existingAnswer = state.answers[question.id] || '';

  container.innerHTML = `
    <div class="dashboard-card drill-workspace-card">
      <div class="drill-card-topline">
        <span class="category-badge">mock interview</span>
        <span>Question ${state.index + 1} of ${state.questions.length}</span>
      </div>
      <div class="mock-interview-progress">
        ${state.questions.map((item, idx) => `
          <button class="mock-step ${idx === state.index ? 'active' : ''} ${state.evaluations[item.id] ? 'done' : ''}" type="button" onclick="selectMockInterviewQuestion(${idx})">${idx + 1}</button>
        `).join('')}
      </div>
      <div class="mock-interview-picker">
        ${state.questions.map((item, idx) => `
          <button class="mock-question-chip ${idx === state.index ? 'active' : ''} ${state.evaluations[item.id] ? 'done' : ''}" type="button" onclick="selectMockInterviewQuestion(${idx})">
            <strong>${idx + 1}. ${item.title}</strong>
            <span>${item.category}</span>
          </button>
        `).join('')}
      </div>
      <h2>${question.title}</h2>
      <p class="drill-workspace-question">${question.question}</p>
      <details class="llm-rubric mock-hints-card" open>
        <summary>Hints and What This Question Is Testing</summary>
        <div>
          ${question.followUp ? `<p class="drill-follow-up"><strong>Follow-up to anticipate:</strong> ${question.followUp}</p>` : ''}
          <ul>
            ${(question.rubric || []).slice(0, 4).map((item) => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      </details>
      <div class="llm-rubric">
        <h4>What this question is testing</h4>
        <ul>
          ${(question.rubric || []).slice(0, 4).map((item) => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      <textarea id="mock-answer" class="practice-drill-answer" rows="8" placeholder="Answer like you are already on the Morpho interview.">${escapePromptHtml(existingAnswer)}</textarea>
      <div class="drill-workspace-actions">
        <button id="mock-submit-btn" class="btn btn-primary" onclick="submitMockInterviewAnswer()">Evaluate This Question</button>
        ${state.index < state.questions.length - 1 ? `<button class="btn btn-secondary" onclick="selectMockInterviewQuestion(${state.index + 1})">Next Question</button>` : ''}
      </div>
      <div id="mock-result">${existingEvaluation ? renderMockInterviewResult(question, existingAnswer, existingEvaluation.evaluation, existingEvaluation.promptPackage, state, false) : ''}</div>
    </div>
  `;
}

function renderMockInterviewResult(question, answer, evaluation, promptPackage, state, includeNextButton = true) {
  const nextLabel = state.index < state.questions.length - 1 ? 'Next Mock Question' : 'Finish Mock Interview';
  return `
    <div class="dashboard-card drill-evaluation-card" style="margin-top:16px;">
      <strong>${evaluation.score}%</strong>
      <p>${evaluation.summary}</p>
      <div class="drill-result-actions">
        <button class="btn btn-secondary" onclick="focusDrillAnswer('mock-answer')">Answer Again</button>
        <button class="btn btn-secondary" onclick="togglePromptInspector('mock-${question.id}')">Prompt</button>
      </div>
      ${renderPromptInspector(`mock-${question.id}`, answer, promptPackage)}
    </div>
    ${includeNextButton ? `<button class="btn btn-primary" style="margin-top:16px;" onclick="advanceMockInterview()">${nextLabel}</button>` : ''}
  `;
}

async function submitMockInterviewAnswer() {
  const state = window.mockInterviewState;
  const answerEl = document.getElementById('mock-answer');
  const resultEl = document.getElementById('mock-result');
  const submitBtn = document.getElementById('mock-submit-btn');
  if (!state || !answerEl || !resultEl) return;
  const question = state.questions[state.index];
  const answer = answerEl.value.trim();
  if (!answer) return;
  state.answers[question.id] = answer;

  saveDrillRecord({
    scope: 'mock',
    questionId: question.id,
    answer,
    evaluation: { score: 0, summary: 'Submitted for evaluation.' },
    promptPackage: null,
    pending: true
  });

  try {
    answerEl.disabled = true;
    setLoadingButtonState(submitBtn, 'Evaluating...');
    resultEl.innerHTML = renderLLMLoadingState('Running mock interview evaluation...');
    const { evaluation, promptPackage } = await requestLLMEvaluation(question.id, answer);
    state.evaluations[question.id] = { evaluation, promptPackage };
    state.scores = Object.values(state.evaluations).map((item) => item.evaluation.score);
    saveDrillRecord({ scope: 'mock', questionId: question.id, answer, evaluation, promptPackage });

    resultEl.innerHTML = renderMockInterviewResult(question, answer, evaluation, promptPackage, state);

    if (window.trainingAnalytics) {
      window.trainingAnalytics.recordMock({
        questionId: question.id,
        score: evaluation.score,
        concepts: window.trainingAnalytics.extractConcepts([question.question, answer])
      });
    }

  } catch (error) {
    resultEl.innerHTML = `<p style="color:var(--color-danger);margin-top:12px;">${error.message || 'Evaluation failed. Try again.'}</p>`;
  } finally {
    answerEl.disabled = false;
    resetLoadingButtonState(submitBtn);
  }
}

function advanceMockInterview() {
  const state = window.mockInterviewState;
  if (!state) return;
  if (state.index < state.questions.length - 1) {
    state.index += 1;
    renderMockInterviewQuestion();
    return;
  }
  const avg = Math.round(state.scores.reduce((a, b) => a + b, 0) / Math.max(state.scores.length, 1));
  const durationMin = Math.max(1, Math.round((Date.now() - state.startedAt) / 60000));
  document.getElementById('active-drill-panel').innerHTML = `
    <div class="dashboard-card drill-workspace-card">
      <h2>Mock Interview Complete</h2>
      <p>Average score: <strong>${avg}%</strong></p>
      <p>Time spent: <strong>${durationMin} min</strong></p>
      <p>Questions answered: <strong>${state.scores.length}/${state.questions.length}</strong></p>
      <p>${avg >= 80 ? 'You sound close to interview-ready. Tighten the weakest concepts and run it again.' : 'Useful signal. Review the weak concepts, then rerun the mock under more pressure.'}</p>
    </div>
  `;
}

function openCodeChallenge(challengeId) {
  localStorage.setItem('preferredCodeChallenge', challengeId);
  navigateTo('code');
}

async function requestLLMEvaluation(questionId, answer) {
  const response = await fetch('/api/llm/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionId, answer })
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.error || `Evaluation failed (${response.status})`);
  }

  const evaluation = payload?.evaluation;
  if (!evaluation) {
    throw new Error('Missing evaluation payload');
  }

  return {
    evaluation,
    promptPackage: payload?.promptPackage || null
  };
}

function getDrillRecords() {
  try {
    return JSON.parse(localStorage.getItem('drillPromptRecords') || '{}');
  } catch {
    return {};
  }
}

function saveDrillRecord({ scope, questionId, answer, evaluation, promptPackage, pending = false }) {
  const key = 'drillPromptRecords';
  const records = getDrillRecords();
  const storageKey = `${scope}-${questionId}`;
  records[`${scope}-${questionId}`] = {
    ...(records[storageKey] || {}),
    answer,
    evaluation,
    promptPackage,
    savedAt: Date.now(),
    answeredAt: records[storageKey]?.answeredAt || Date.now(),
    pending
  };
  localStorage.setItem(key, JSON.stringify(records));
}

function refreshDrillAnsweredState(questionId, score) {
  const cards = document.querySelectorAll('.drill-card');
  cards.forEach((card) => {
    const button = card.querySelector('button[onclick*="startPracticeDrill(' + questionId + ')"]');
    if (!button) return;
    card.classList.add('answered');
    let badge = card.querySelector('.answered-badge');
    if (!badge) {
      const topline = card.querySelector('.drill-card-topline');
      badge = document.createElement('span');
      badge.className = 'answered-badge';
      topline?.appendChild(badge);
    }
    badge.textContent = `Answered • ${typeof score === 'number' ? `${score}%` : 'Pending'}`;
    button.textContent = 'Reopen Drill';
  });
}

function renderPromptInspector(key, answer, promptPackage) {
  const systemPrompt = promptPackage?.systemPrompt || 'Unavailable';
  const userPrompt = promptPackage?.userPrompt || 'Unavailable';
  const model = promptPackage?.model || 'Unknown';

  return `
    <div id="prompt-box-${key}" class="prompt-inspector" style="display:none;">
      <div class="prompt-inspector-tabs">
        <button class="btn btn-secondary" onclick="setPromptTab('${key}', 'answer')">Answer</button>
        <button class="btn btn-secondary" onclick="setPromptTab('${key}', 'prompt')">Prompt</button>
      </div>
      <div id="prompt-panel-${key}" class="prompt-panel">
        <div class="prompt-panel-section">
          <div class="prompt-panel-label">Submitted answer</div>
          <pre><code>${escapePromptHtml(answer)}</code></pre>
        </div>
      </div>
      <template id="prompt-template-answer-${key}">
        <div class="prompt-panel-section">
          <div class="prompt-panel-label">Submitted answer</div>
          <pre><code>${escapePromptHtml(answer)}</code></pre>
        </div>
      </template>
      <template id="prompt-template-prompt-${key}">
        <div class="prompt-panel-section">
          <div class="prompt-panel-label">Model</div>
          <p>${escapePromptHtml(model)}</p>
        </div>
        <div class="prompt-panel-section">
          <div class="prompt-panel-label">System prompt</div>
          <pre><code>${escapePromptHtml(systemPrompt)}</code></pre>
        </div>
        <div class="prompt-panel-section">
          <div class="prompt-panel-label">User prompt</div>
          <pre><code>${escapePromptHtml(userPrompt)}</code></pre>
        </div>
      </template>
    </div>
  `;
}

function togglePromptInspector(key) {
  const box = document.getElementById(`prompt-box-${key}`);
  if (!box) return;
  const opening = box.style.display === 'none' || !box.style.display;
  box.style.display = opening ? 'block' : 'none';
  if (opening) {
    setPromptTab(key, 'prompt');
  }
}

function setPromptTab(key, tab) {
  const panel = document.getElementById(`prompt-panel-${key}`);
  const template = document.getElementById(`prompt-template-${tab}-${key}`);
  if (!panel || !template) return;
  panel.innerHTML = template.innerHTML;
}

function focusDrillAnswer(elementId) {
  const answerEl = document.getElementById(elementId);
  if (!answerEl) return;
  answerEl.focus();
  answerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function escapePromptHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function resetStudyState() {
  const confirmed = confirm('Reset the app to a fresh study state? This clears progress, quiz history, LLM history, review spacing, and local analytics.');
  if (!confirmed) return;

  try {
    const response = await fetch('/api/learning/reset', { method: 'POST' });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok || !payload.success) {
      throw new Error(payload.error || 'Reset failed');
    }

    window.trainingAnalytics?.resetAll();
    [
      'lessonRatings',
      'completedLessons',
      'preferredCodeChallenge'
    ].forEach((key) => localStorage.removeItem(key));

    updateReviewBadge();
    await loadDashboard();
    if (App.currentPage === 'progress') {
      loadProgress();
    }
    if (App.currentPage === 'review' && window.loadReviewQueue) {
      window.loadReviewQueue();
    }

    alert('Study state reset.');
  } catch (error) {
    alert(error.message || 'Reset failed.');
  }
}

window.recordQuizConfidence = recordQuizConfidence;
window.startPracticeDrill = startPracticeDrill;
window.submitPracticeDrill = submitPracticeDrill;
window.startFormulaTrainer = startFormulaTrainer;
window.startScenarioSimulator = startScenarioSimulator;
window.startMockInterview = startMockInterview;
window.submitMockInterviewAnswer = submitMockInterviewAnswer;
window.advanceMockInterview = advanceMockInterview;
window.openCodeChallenge = openCodeChallenge;
window.resetStudyState = resetStudyState;
window.togglePromptInspector = togglePromptInspector;
window.setPromptTab = setPromptTab;
window.focusDrillAnswer = focusDrillAnswer;

function initCodeLab() {
  // Code lab is initialized in code-lab.js
  console.log('Code lab initialized');
}
