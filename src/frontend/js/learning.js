/**
 * Learning Module - Individual Lesson Navigation
 */

let currentModule = null;
let currentLessonIndex = 0;
let currentLessonQuestions = [];
let currentLessonQuestionIndex = 0;
const COMPLETED_LESSONS_KEY = 'completedLessons';
const LESSON_ZOOM_KEY = 'lessonZoom';
const MIN_LESSON_ZOOM = 90;
const MAX_LESSON_ZOOM = 150;
const DEFAULT_LESSON_ZOOM = 100;

function getCompletedLessons() {
  return JSON.parse(localStorage.getItem(COMPLETED_LESSONS_KEY) || '{}');
}

function isLessonCompleted(moduleId, lessonId) {
  return !!getCompletedLessons()[`${moduleId}-${lessonId}`];
}

function getLessonZoom() {
  const saved = Number(localStorage.getItem(LESSON_ZOOM_KEY));
  if (!Number.isFinite(saved)) return DEFAULT_LESSON_ZOOM;
  return Math.min(MAX_LESSON_ZOOM, Math.max(MIN_LESSON_ZOOM, saved));
}

function setLessonZoom(value) {
  const zoom = Math.min(MAX_LESSON_ZOOM, Math.max(MIN_LESSON_ZOOM, value));
  localStorage.setItem(LESSON_ZOOM_KEY, String(zoom));
  applyLessonZoom(zoom);
}

function applyLessonZoom(zoom) {
  const lessonBody = document.getElementById('lesson-body');
  const lessonContentArea = document.querySelector('.lesson-content-area');
  const zoomValue = document.getElementById('lesson-zoom-value');
  const zoomOut = document.getElementById('lesson-zoom-out');
  const zoomIn = document.getElementById('lesson-zoom-in');
  const scale = zoom / 100;

  if (lessonBody) {
    lessonBody.style.setProperty('--lesson-zoom-scale', scale.toFixed(2));
  }
  if (lessonContentArea) {
    lessonContentArea.style.setProperty('--lesson-zoom-scale', scale.toFixed(2));
  }
  if (zoomValue) {
    zoomValue.textContent = `${zoom}%`;
  }
  if (zoomOut) {
    zoomOut.disabled = zoom <= MIN_LESSON_ZOOM;
  }
  if (zoomIn) {
    zoomIn.disabled = zoom >= MAX_LESSON_ZOOM;
  }
}

function bindLessonZoomControls() {
  document.getElementById('lesson-zoom-out')?.addEventListener('click', () => {
    setLessonZoom(getLessonZoom() - 10);
  });
  document.getElementById('lesson-zoom-in')?.addEventListener('click', () => {
    setLessonZoom(getLessonZoom() + 10);
  });
  document.getElementById('lesson-zoom-reset')?.addEventListener('click', () => {
    setLessonZoom(DEFAULT_LESSON_ZOOM);
  });
}

// Initialize learning page
document.addEventListener('DOMContentLoaded', () => {
  bindLessonZoomControls();
  applyLessonZoom(getLessonZoom());
  syncLessonFromHash();
});

window.addEventListener('hashchange', () => {
  syncLessonFromHash();
});

function syncLessonFromHash() {
  if (!window.location.hash.startsWith('#lesson/')) return;
  const parts = window.location.hash.split('/');
  if (parts.length >= 3) {
    const moduleId = parts[1];
    const lessonIdx = parseInt(parts[2], 10) || 0;
    loadLesson(moduleId, lessonIdx);
  }
}

// Load a specific lesson
async function loadLesson(moduleId, lessonIndex) {
  try {
    window.scrollTo({ top: 0, behavior: 'auto' });
    const response = await fetch(`/api/learning/modules/${moduleId}`);
    currentModule = await response.json();
    currentLessonIndex = lessonIndex;
    
    const lesson = currentModule.lessons[lessonIndex];
    if (!lesson) {
      document.getElementById('lesson-body').innerHTML = '<p>Lesson not found</p>';
      return;
    }
    
    // Update sidebar navigation
    renderLessonNav();
    
    // Update header
    document.getElementById('lesson-module-title').textContent = currentModule.title;
    document.getElementById('lesson-number').textContent = `Lesson ${lessonIndex + 1} of ${currentModule.lessons.length}`;
    document.getElementById('lesson-duration').textContent = `⏱ ${lesson.estimated_minutes || 20} min`;
    document.getElementById('lesson-title').textContent = lesson.title;
    document.getElementById('lesson-objective').textContent = lesson.objective || `Learn about ${lesson.title}`;
    
    // Update body content
    document.getElementById('lesson-body').innerHTML = renderLessonBody(lesson);
    applyLessonZoom(getLessonZoom());
    appendVisibleLessonGlossary();
    
    // Update quiz section
    renderLessonQuiz(moduleId, lesson.id);
    
    renderLessonLens(lesson);
    renderLessonNextReps(lesson);
    
    // Update navigation buttons
    updateLessonNavButtons();
    
    // Check if lesson is already rated
    loadLessonRating(moduleId, lesson.id);
    
  } catch (error) {
    console.error('Failed to load lesson:', error);
    document.getElementById('lesson-body').innerHTML = '<p>Error loading lesson. Please try again.</p>';
  }
}

// Render lesson sidebar navigation
function renderLessonNav() {
  const navList = document.getElementById('lesson-nav-list');
  if (!navList || !currentModule) return;
  navList.innerHTML = currentModule.lessons.map((lesson, idx) => `
    <div class="lesson-nav-item ${idx === currentLessonIndex ? 'active' : ''}" 
         onclick="window.location.hash='#lesson/${currentModule.id}/${idx}'">
      <span class="lesson-nav-num">${idx + 1}</span>
      <span class="lesson-nav-title">${lesson.title}</span>
      <span class="lesson-nav-status" id="status-${lesson.id}">${isLessonCompleted(currentModule.id, lesson.id) ? '✓' : ''}</span>
    </div>
  `).join('');
}

// Render lesson body content
function renderLessonBody(lesson) {
  let html = '';
  
  // Must memorize box
  if (lesson.what_you_must_know) {
    const points = lesson.what_you_must_know.split('\n').filter(p => p.trim());
    html += `
      <div class="memorize-box">
        <h4>🎯 What You Must Memorize</h4>
        <ul class="key-points-list">
          ${points.map(p => `<li>${p.replace(/^-\s*/, '')}</li>`).join('')}
        </ul>
      </div>
    `;
  }
  
  // Main body content
  if (lesson.body) {
    html += `<div class="lesson-text">${formatLessonBody(lesson.body)}</div>`;
  }
  
  // Formulas
  if (lesson.formulas) {
    html += `
      <div class="formula-box">
        <h4>📐 Key Formulas</h4>
        <pre><code>${lesson.formulas}</code></pre>
      </div>
    `;
  }
  
  // Why it matters
  if (lesson.why_it_matters) {
    html += `
      <div class="key-points-box">
        <h4>💡 Why This Matters</h4>
        <p>${lesson.why_it_matters}</p>
      </div>
    `;
  }
  
  // Documentation links
  if (lesson.docs_refs && lesson.docs_refs !== '[]') {
    try {
      const refs = JSON.parse(lesson.docs_refs);
      if (refs.length > 0) {
        html += `
          <div class="docs-links">
            <h4>📚 Documentation</h4>
            <ul>
              ${refs.map(ref => `
                <li><a href="${ref.url}" target="_blank">${ref.title} ↗</a></li>
              `).join('')}
            </ul>
          </div>
        `;
      }
    } catch (e) {}
  }

  return html;
}

function appendVisibleLessonGlossary() {
  const lessonBody = document.getElementById('lesson-body');
  if (!lessonBody || !window.renderGlossaryHtmlFromTexts) return;

  lessonBody.querySelector('.auto-glossary')?.remove();

  const visibleText = Array.from(
    lessonBody.querySelectorAll('.memorize-box, .lesson-text, .formula-box, .key-points-box')
  )
    .map((node) => node.textContent || '')
    .join(' ');

  lessonBody.insertAdjacentHTML('beforeend', window.renderGlossaryHtmlFromTexts([visibleText]));
}

function renderLessonLens(lesson) {
  const section = document.getElementById('lesson-lens');
  if (!section) return;

  const technical = lesson.what_you_must_know || lesson.body || lesson.title;
  const business = lesson.why_it_matters || lesson.objective || 'Translate the protocol detail into implementation speed, risk clarity, or partner trust.';
  const partner = lesson.interview_drill || `Explain ${lesson.title} in a way that is technically exact and commercially useful.`;

  section.innerHTML = `
    <div class="dashboard-card">
      <h3>Study Lens</h3>
      <div class="lens-grid">
        <div class="lens-card">
          <div class="lens-label">Technical</div>
          <p>${technical.split('\n').filter(Boolean).slice(0, 3).join(' ')}</p>
        </div>
        <div class="lens-card">
          <div class="lens-label">Partner Call</div>
          <p>${partner}</p>
        </div>
        <div class="lens-card">
          <div class="lens-label">Business Value</div>
          <p>${business}</p>
        </div>
      </div>
    </div>
  `;
}

async function renderLessonNextReps(lesson) {
  const section = document.getElementById('lesson-next-reps');
  if (!section) return;

  const concepts = window.trainingAnalytics?.extractConcepts([
    lesson.title,
    lesson.what_you_must_know,
    lesson.body,
    lesson.formulas
  ]) || [];

  try {
    const response = await fetch('/api/code/challenges');
    const data = await response.json();
    const challenges = data.challenges || [];
    const matchedChallenge = challenges.find((challenge) => {
      const text = `${challenge.title} ${challenge.description} ${challenge.category}`.toLowerCase();
      return concepts.some((concept) => text.includes(concept.toLowerCase())) || lesson.title.toLowerCase().includes(challenge.category.toLowerCase());
    }) || challenges[0];

    section.innerHTML = `
      <div class="dashboard-card">
        <h3>Next Best Reps</h3>
        <div class="next-reps-grid">
          <div class="next-rep-card">
            <div class="lens-label">Lesson Quiz</div>
            <p>Use the lesson check below to pressure-test recall before moving on.</p>
          </div>
          <div class="next-rep-card">
            <div class="lens-label">Interview Drill</div>
            <p>${lesson.interview_drill || `Explain ${lesson.title} clearly in 60 seconds.`}</p>
          </div>
          <div class="next-rep-card">
            <div class="lens-label">Code Challenge</div>
            <p>${matchedChallenge ? matchedChallenge.title : 'No matching challenge found.'}</p>
            ${matchedChallenge ? `<button class="btn btn-secondary" onclick="openCodeChallenge('${matchedChallenge.id}')">Open in Code Lab</button>` : ''}
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    section.innerHTML = '';
  }
}

// Format lesson body (convert markdown to HTML)
function formatLessonBody(body) {
  if (!body) return '';
  
  // Process content line by line for better control
  const lines = body.split('\n');
  const result = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    
    // Check for table start
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      // Collect all table lines
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      result.push(renderTable(tableLines));
      continue;
    }
    
    // Headers
    if (line.startsWith('## ')) {
      result.push(`<h2>${escapeHtml(line.slice(3))}</h2>`);
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      result.push(`<h3>${escapeHtml(line.slice(4))}</h3>`);
      i++;
      continue;
    }
    if (line.startsWith('#### ')) {
      result.push(`<h4>${escapeHtml(line.slice(5))}</h4>`);
      i++;
      continue;
    }
    
    // Code blocks
    if (line.startsWith('```')) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      result.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
      i++; // Skip closing ```
      continue;
    }
    
    // Empty line (paragraph break)
    if (line.trim() === '') {
      result.push('');
      i++;
      continue;
    }
    
    // Regular line with inline formatting
    let formatted = line
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // List item
    if (line.startsWith('- ')) {
      result.push(`<li>${formatted.slice(2)}</li>`);
    } else {
      result.push(`<p>${formatted}</p>`);
    }
    
    i++;
  }
  
  return result.join('\n');
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderTable(lines) {
  if (lines.length < 2) return lines.join('<br>');
  
  let html = '<table class="markdown-table">\n<thead>\n<tr>';
  
  // First line is header
  const headerCells = lines[0].split('|').filter(c => c.trim()).map(c => c.trim());
  headerCells.forEach(cell => {
    html += `<th>${escapeHtml(cell)}</th>`;
  });
  html += '</tr>\n</thead>\n<tbody>\n';
  
  // Process data rows (skip separator line with ---)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('---')) continue; // Skip separator
    
    html += '<tr>';
    const cells = line.split('|').filter(c => c.trim() !== '').map(c => c.trim());
    cells.forEach(cell => {
      html += `<td>${escapeHtml(cell)}</td>`;
    });
    html += '</tr>\n';
  }
  
  html += '</tbody>\n</table>';
  return html;
}

window.formatLessonBody = formatLessonBody;

function formatDocSnippet(snippet) {
  if (!snippet) return '';

  let normalized = String(snippet).trim();
  normalized = normalized.replace(/^#{1,6}\s+/gm, '');
  normalized = normalized.replace(/\s-\s(?=(\*\*|\[|[A-Z0-9]))/g, '\n- ');
  normalized = normalized.replace(/\.\s-\s(?=(\*\*|\[|[A-Z0-9]))/g, '.\n- ');

  return formatLessonBody(normalized);
}

// Render lesson-specific quiz
async function renderLessonQuiz(moduleId, lessonId) {
  const quizSection = document.getElementById('lesson-quiz');
  const quizContent = document.getElementById('lesson-quiz-content');
  
  try {
    // Get questions for this lesson's topics
    const response = await fetch(`/api/quiz/questions?moduleId=${moduleId}&lessonId=${lessonId}&limit=3`);
    const questions = await response.json();
    currentLessonQuestions = questions;
    currentLessonQuestionIndex = 0;
    
    if (questions.length === 0) {
      quizSection.style.display = 'none';
      return;
    }
    
    quizSection.style.display = 'block';
    
    // Show first question
    showLessonQuestion(currentLessonQuestions[currentLessonQuestionIndex], currentLessonQuestionIndex, currentLessonQuestions.length);
    
  } catch (error) {
    quizSection.style.display = 'none';
  }
}

function showLessonQuestion(question, idx, total) {
  const container = document.getElementById('lesson-quiz-content');
  
  container.innerHTML = `
    <div class="lesson-quiz-progress">Question ${idx + 1} of ${total}</div>
    <div class="lesson-quiz-question">${question.question}</div>
    <div class="lesson-quiz-options">
      ${question.options.map((opt, i) => `
        <button class="quiz-option" type="button" data-index="${i}">
          ${opt}
        </button>
      `).join('')}
    </div>
    <div id="lesson-quiz-feedback" class="lesson-quiz-feedback" style="display:none;"></div>
  `;

  container.querySelectorAll('.lesson-quiz-options .quiz-option').forEach((button) => {
    button.addEventListener('click', () => {
      const selected = Number(button.dataset.index);
      selectLessonAnswer(button, selected, question.correct, question.explanation);
    });
  });
}

function getCurrentLessonForQuizFeedback() {
  return currentModule?.lessons?.[currentLessonIndex] || null;
}

function parseLessonDocsRefs(lesson) {
  if (!lesson?.docs_refs || lesson.docs_refs === '[]') return [];
  try {
    const refs = JSON.parse(lesson.docs_refs);
    return Array.isArray(refs) ? refs : [];
  } catch (error) {
    return [];
  }
}

function buildLessonQuizExplanation(question, lesson, selected, correct, explanation) {
  const effectiveExplanation = question?.expandedExplanation || explanation;
  const correctAnswer = question.options?.[correct] || '';
  const selectedAnswer = selected >= 0 ? (question.options?.[selected] || '') : '';
  const docsRefs = Array.isArray(question?.docsRefs) && question.docsRefs.length
    ? question.docsRefs.slice(0, 3)
    : parseLessonDocsRefs(lesson).slice(0, 3);
  const docsSnippets = Array.isArray(question?.docsSnippets) ? question.docsSnippets.filter(Boolean).slice(0, 3) : [];

  const whyThisIsCorrect = effectiveExplanation && effectiveExplanation.trim()
    ? effectiveExplanation.trim()
    : `The correct answer is "${correctAnswer}" because it is the option that matches the lesson’s actual protocol behavior and partner-facing framing.`;

  const whyOthersFail = selected === correct
    ? ''
    : `You picked "${selectedAnswer}". That answer misses the key point the lesson is testing. The lesson expects you to anchor on "${correctAnswer}" because that is the precise Morpho-specific statement, not a nearby generic idea.`;

  const docsHtml = docsRefs.length
    ? `
      <div class="lesson-quiz-docs-list">
        ${docsRefs.map((ref) => `
          <div class="lesson-quiz-doc-ref">
            <strong>morpho.txt reference:</strong> ${ref.title}
          </div>
        `).join('')}
      </div>
    `
    : `<p class="lesson-quiz-docs-empty">No direct lesson doc reference was attached here, so use the lesson notes and formulas above as the source of truth.</p>`;

  const snippetHtml = docsSnippets.length
    ? `
      <div class="lesson-quiz-snippets">
        ${docsSnippets.map((snippet, index) => `
          <details class="lesson-quiz-details" ${index === 0 ? 'open' : ''}>
            <summary>morpho.txt excerpt ${index + 1}</summary>
            <div class="lesson-quiz-details-body">
              <div class="lesson-quiz-snippet">${formatDocSnippet(snippet)}</div>
            </div>
          </details>
        `).join('')}
      </div>
    `
    : '';

  const docsSection = docsSnippets.length ? `
    <details class="lesson-quiz-details">
      <summary>Review Anchors</summary>
      <div class="lesson-quiz-details-body">
        <p>Use these local Morpho references to reinforce this exact concept without leaving the page:</p>
        ${docsHtml}
        ${snippetHtml}
      </div>
    </details>
  ` : '';

  return `
    <details class="lesson-quiz-details" open>
      <summary>Expanded Explanation</summary>
      <div class="lesson-quiz-details-body">
        <p><strong>Correct answer:</strong> ${correctAnswer}</p>
        <div><strong>Why this is correct:</strong><div class="lesson-quiz-long-explanation">${formatLessonBody(whyThisIsCorrect)}</div></div>
        ${whyOthersFail ? `<p><strong>Why your choice missed:</strong> ${whyOthersFail}</p>` : ''}
      </div>
    </details>
    ${docsSection}
  `;
}

function selectLessonAnswer(btn, selected, correct, explanation) {
  const buttons = document.querySelectorAll('.lesson-quiz-options .quiz-option');
  const question = currentLessonQuestions[currentLessonQuestionIndex];
  const lesson = getCurrentLessonForQuizFeedback();
  buttons.forEach((b, i) => {
    b.disabled = true;
    if (i === correct) b.classList.add('correct');
    if (i === selected && i !== correct) b.classList.add('wrong');
  });
  
  const feedback = document.getElementById('lesson-quiz-feedback');
  feedback.style.display = 'block';
  feedback.innerHTML = `
    <strong>${selected === correct ? '✓ Correct!' : '✗ Incorrect'}</strong>
    ${buildLessonQuizExplanation(question, lesson, selected, correct, explanation)}
  `;
  feedback.className = `lesson-quiz-feedback ${selected === correct ? 'correct' : 'wrong'}`;

  if (window.trainingAnalytics && question) {
    const concepts = window.trainingAnalytics.extractConcepts([question.question, ...(question.options || []), explanation]);
    window.trainingAnalytics.recordQuizResult({
      source: 'lesson-quiz',
      question: question.question,
      correct: selected === correct,
      concepts
    });
  }

  const controls = document.createElement('div');
  controls.className = 'lesson-quiz-actions';
  controls.innerHTML = `
    <button class="btn btn-primary" type="button">
      ${currentLessonQuestionIndex < currentLessonQuestions.length - 1 ? 'Next Lesson Check →' : 'Finish Lesson Check'}
    </button>
  `;
  controls.querySelector('button').addEventListener('click', () => {
    if (currentLessonQuestionIndex < currentLessonQuestions.length - 1) {
      currentLessonQuestionIndex += 1;
      showLessonQuestion(
        currentLessonQuestions[currentLessonQuestionIndex],
        currentLessonQuestionIndex,
        currentLessonQuestions.length
      );
    } else {
      const wrap = document.getElementById('lesson-quiz-content');
      wrap.innerHTML = `
        <div class="dashboard-card">
          <h4>Lesson Check Complete</h4>
          <p>You finished all ${currentLessonQuestions.length} lesson-linked questions.</p>
        </div>
      `;
    }
  });
  feedback.appendChild(controls);
}

// Update lesson navigation buttons
function updateLessonNavButtons() {
  const prevBtn = document.getElementById('lesson-prev-btn');
  const nextBtn = document.getElementById('lesson-next-btn');
  
  if (prevBtn) {
    prevBtn.disabled = currentLessonIndex === 0;
    prevBtn.onclick = () => {
      if (currentLessonIndex > 0) {
        window.location.hash = `#lesson/${currentModule.id}/${currentLessonIndex - 1}`;
      }
    };
  }
  
  if (nextBtn) {
    const isLast = currentLessonIndex >= currentModule.lessons.length - 1;
    nextBtn.textContent = isLast ? 'Complete Module →' : 'Next Lesson →';
    nextBtn.onclick = async () => {
      await markCurrentLessonComplete();
      if (isLast) {
        window.scrollTo({ top: 0, behavior: 'auto' });
        navigateTo('quiz');
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' });
        window.location.hash = `#lesson/${currentModule.id}/${currentLessonIndex + 1}`;
      }
    };
  }
}

async function markCurrentLessonComplete() {
  const lesson = currentModule?.lessons?.[currentLessonIndex];
  if (!lesson || !currentModule?.id) return;

  const completedLessons = getCompletedLessons();
  completedLessons[`${currentModule.id}-${lesson.id}`] = true;
  localStorage.setItem(COMPLETED_LESSONS_KEY, JSON.stringify(completedLessons));
  const statusNode = document.getElementById(`status-${lesson.id}`);
  if (statusNode) {
    statusNode.textContent = '✓';
  }

  try {
    await fetch('/api/learning/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        moduleId: currentModule.id,
        lessonId: lesson.id,
        completed: true
      })
    });
  } catch (error) {
    console.error('Failed to persist lesson completion:', error);
  }
}

// Handle lesson rating (Anki-style)
function loadLessonRating(moduleId, lessonId) {
  const ratingSection = document.getElementById('lesson-rating');
  if (!ratingSection) return;
  
  // Check if already rated
  const ratings = JSON.parse(localStorage.getItem('lessonRatings') || '{}');
  const key = `${moduleId}-${lessonId}`;
  
  if (ratings[key] && ratingSection.dataset.editing !== 'true') {
    showRatingComplete(ratings[key], moduleId, lessonId);
    return;
  }

  renderLessonRatingButtons(moduleId, lessonId);
}

function renderLessonRatingButtons(moduleId, lessonId) {
  const ratingSection = document.getElementById('lesson-rating');
  if (!ratingSection) return;

  ratingSection.dataset.editing = 'true';
  ratingSection.innerHTML = `
    <h3>Rate This Lesson</h3>
    <p>Set how soon you want to see this lesson again.</p>
    <div class="rating-buttons">
      <button class="rating-btn again" data-rating="1">Again</button>
      <button class="rating-btn hard" data-rating="2">Hard</button>
      <button class="rating-btn good" data-rating="3">Good</button>
      <button class="rating-btn easy" data-rating="4">Easy</button>
    </div>
  `;

  ratingSection.querySelectorAll('.rating-btn').forEach(btn => {
    btn.onclick = () => {
      const rating = parseInt(btn.dataset.rating);
      const entry = saveLessonRating(moduleId, lessonId, rating);
      ratingSection.dataset.editing = '';
      showRatingComplete(entry, moduleId, lessonId);
    };
  });
}

function saveLessonRating(moduleId, lessonId, rating) {
  const ratings = JSON.parse(localStorage.getItem('lessonRatings') || '{}');
  const key = `${moduleId}-${lessonId}`;
  
  const intervals = {
    1: 60 * 1000,        // Again: 1 minute
    2: 2 * 24 * 60 * 60 * 1000,  // Hard: 2 days
    3: 4 * 24 * 60 * 60 * 1000,  // Good: 4 days
    4: 7 * 24 * 60 * 60 * 1000   // Easy: 7 days
  };
  
  const entry = {
    rating,
    timestamp: Date.now(),
    nextReview: Date.now() + intervals[rating]
  };
  ratings[key] = entry;
  
  localStorage.setItem('lessonRatings', JSON.stringify(ratings));
  
  // Update review badge
  if (window.updateReviewBadge) {
    window.updateReviewBadge();
  }

  return entry;
}

function calculateNextReview(rating) {
  const now = Date.now();
  const intervals = {
    1: 60 * 1000,        // Again: 1 minute
    2: 2 * 24 * 60 * 60 * 1000,  // Hard: 2 days
    3: 4 * 24 * 60 * 60 * 1000,  // Good: 4 days
    4: 7 * 24 * 60 * 60 * 1000   // Easy: 7 days
  };
  return now + intervals[rating];
}

function showRatingComplete(entry, moduleId, lessonId) {
  const section = document.getElementById('lesson-rating');
  if (!section || !entry) return;
  section.dataset.editing = '';
  const ratingNum = parseInt(entry.rating);
  const labels = { 1: 'Again', 2: 'Hard', 3: 'Good', 4: 'Easy' };
  const label = labels[ratingNum] || 'Rated';
  const nextReviewText = entry.nextReview
    ? new Date(entry.nextReview).toLocaleString()
    : 'Not scheduled';
  section.innerHTML = `
    <div class="rating-complete">
      <h3>✓ Rated: ${label}</h3>
      <p>Next review: ${nextReviewText}</p>
      <button class="btn btn-secondary" id="change-lesson-rating">Change rating</button>
    </div>
  `;

  document.getElementById('change-lesson-rating')?.addEventListener('click', () => {
    renderLessonRatingButtons(moduleId, lessonId);
  });
}

// Interview Drill Timer
let drillTimer = null;
let drillSeconds = 60;

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('drill-start-btn');
  const stopBtn = document.getElementById('drill-stop-btn');
  
  if (startBtn) {
    startBtn.addEventListener('click', startDrillTimer);
  }
  if (stopBtn) {
    stopBtn.addEventListener('click', stopDrillTimer);
  }
  
  document.getElementById('drill-submit-btn')?.addEventListener('click', submitDrillAnswer);
});

function startDrillTimer() {
  drillSeconds = 60;
  document.getElementById('drill-start-btn').style.display = 'none';
  document.getElementById('drill-stop-btn').style.display = 'inline-block';
  document.getElementById('drill-recording-status').style.display = 'flex';
  document.getElementById('drill-result').style.display = 'none';
  
  drillTimer = setInterval(() => {
    drillSeconds--;
    const mins = Math.floor(drillSeconds / 60);
    const secs = drillSeconds % 60;
    document.getElementById('drill-timer-display').textContent = 
      `${mins}:${secs.toString().padStart(2, '0')}`;
    
    if (drillSeconds <= 0) {
      stopDrillTimer();
    }
  }, 1000);
}

function stopDrillTimer() {
  clearInterval(drillTimer);
  document.getElementById('drill-start-btn').style.display = 'inline-block';
  document.getElementById('drill-stop-btn').style.display = 'none';
  document.getElementById('drill-recording-status').style.display = 'none';
  document.getElementById('drill-result').style.display = 'block';
}

async function submitDrillAnswer() {
  const answer = document.getElementById('drill-answer').value;
  const prompt = document.getElementById('drill-prompt').textContent;
  
  if (!answer.trim()) {
    alert('Please enter your answer first');
    return;
  }
  
  const evalDiv = document.getElementById('drill-evaluation');
  evalDiv.innerHTML = '<p>⏳ Evaluating with AI (this may take a few seconds)...</p>';
  evalDiv.style.display = 'block';
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
    
    const response = await fetch('/api/llm/evaluate-drill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, answer }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    
    const result = await response.json();
    const concepts = window.trainingAnalytics?.extractConcepts([prompt, answer]) || [];
    window.trainingAnalytics?.recordDrill({
      source: 'lesson-drill',
      prompt,
      score: result.score,
      concepts
    });
    
    const gradeColors = {
      'excellent': 'color: #10b981',
      'good': 'color: #3b82f6',
      'acceptable': 'color: #f59e0b',
      'needs-work': 'color: #ef4444',
      'insufficient': 'color: #dc2626'
    };
    
    evalDiv.innerHTML = `
      <div class="evaluation-result" style="margin-top: 20px; padding: 20px; background: rgba(36, 112, 255, 0.1); border-radius: 8px;">
        <div style="font-size: 36px; font-weight: 700; ${gradeColors[result.grade] || ''}; margin-bottom: 12px;">
          ${result.score}/100
          <span style="font-size: 16px; color: var(--text-muted); margin-left: 8px;">(${result.grade})</span>
        </div>
        <div style="margin-bottom: 16px;">
          <strong>💬 Feedback:</strong>
          <p style="margin-top: 8px; color: var(--text-secondary);">${result.feedback}</p>
        </div>
        ${result.improvements ? `
          <div style="margin-bottom: 16px;">
            <strong>📈 Improvements:</strong>
            <p style="margin-top: 8px; color: var(--text-secondary);">${result.improvements}</p>
          </div>
        ` : ''}
        ${result.missedPoints && result.missedPoints.length > 0 ? `
          <div>
            <strong>📝 Points to Include:</strong>
            <ul style="margin-top: 8px; margin-left: 20px; color: var(--text-secondary);">
              ${result.missedPoints.map(p => `<li>${p}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        ${result.source === 'fallback' ? '<p style="font-size: 12px; color: var(--text-muted); margin-top: 12px;">⚠️ Using fallback evaluation (API unavailable)</p>' : ''}
      </div>
    `;
  } catch (error) {
    console.error('Evaluation error:', error);
    evalDiv.innerHTML = `
      <div class="evaluation-error" style="margin-top: 20px; padding: 16px; background: rgba(239, 68, 68, 0.1); border-radius: 8px; color: var(--text-secondary);">
        <strong>⚠️ Evaluation Failed</strong>
        <p style="margin-top: 8px;">${error.name === 'AbortError' ? 'Request timed out. Please try again.' : error.message || 'Please try again later.'}</p>
        <button onclick="submitDrillAnswer()" style="margin-top: 12px;" class="btn btn-primary">Retry</button>
      </div>
    `;
  }
}
