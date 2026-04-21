/**
 * Spaced Repetition Review System (Anki-style)
 */

let reviewQueue = [];
let currentReviewIndex = 0;

// Initialize review page
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash === '#review') {
    loadReviewQueue();
  }
});

function loadReviewQueue() {
  // Get all rated lessons from localStorage
  const ratings = JSON.parse(localStorage.getItem('lessonRatings') || '{}');
  const now = Date.now();
  
  reviewQueue = [];
  currentReviewIndex = 0;
  
  Object.entries(ratings).forEach(([key, data]) => {
    if (data.nextReview && data.nextReview <= now) {
      const [moduleId, lessonId] = key.split('-');
      reviewQueue.push({
        key,
        moduleId,
        lessonId,
        rating: data.rating,
        ...data
      });
    }
  });
  
  // Sort by rating (harder = higher priority)
  reviewQueue.sort((a, b) => a.rating - b.rating);
  
  updateReviewBadge();
  renderReviewSummary();
  showCurrentReview();
}

function renderReviewSummary() {
  const container = document.getElementById('review-summary');
  if (!container) return;
  const weak = window.trainingAnalytics?.getWeakConcepts(4) || [];

  container.innerHTML = `
    <h3>Review Priorities</h3>
    <div class="chips-list">
      <div class="chip-card">
        <strong>Due cards</strong>
        <span>${reviewQueue.length}</span>
      </div>
      <div class="chip-card">
        <strong>Mode</strong>
        <span>Recall first, explanation second</span>
      </div>
      ${weak.map((item) => `
        <div class="chip-card weak">
          <strong>${item.term}</strong>
          <span>score ${item.score}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function updateReviewBadge() {
  const badge = document.getElementById('review-badge');
  const stat = document.getElementById('stat-review');
  const ratings = JSON.parse(localStorage.getItem('lessonRatings') || '{}');
  const now = Date.now();
  const dueCount = Object.values(ratings).filter((item) => item.nextReview && item.nextReview <= now).length;
  if (badge) badge.textContent = dueCount;
  if (stat) stat.textContent = dueCount;
}

async function showCurrentReview() {
  const emptyDiv = document.getElementById('review-empty');
  const cardDiv = document.getElementById('review-card');
  
  if (reviewQueue.length === 0 || currentReviewIndex >= reviewQueue.length) {
    if (emptyDiv) emptyDiv.style.display = 'block';
    if (cardDiv) cardDiv.style.display = 'none';
    return;
  }
  
  if (emptyDiv) emptyDiv.style.display = 'none';
  if (cardDiv) cardDiv.style.display = 'block';
  
  const current = reviewQueue[currentReviewIndex];
  
  // Fetch lesson details
  try {
    const response = await fetch(`/api/learning/modules/${current.moduleId}`);
    const module = await response.json();
    const lesson = module.lessons.find(l => l.id == current.lessonId);
    
    if (!lesson) {
      nextReview();
      return;
    }
    
    document.getElementById('review-module').textContent = module.title;
    document.getElementById('review-lesson-title').innerHTML = `
      <span>${lesson.title}</span>
      <button class="btn btn-secondary review-open-btn" id="review-open-lesson">Open Lesson</button>
    `;
    
    const points = (lesson.what_you_must_know || '').split('\n').filter(p => p.trim());
    const preview = buildReviewPreview(lesson);
    document.getElementById('review-question').innerHTML = `
      <div class="review-panel">
        <div class="review-panel-label">Recall Prompt</div>
        <h3>What should you be able to say from memory?</h3>
        <ul id="review-points" class="review-points">
          ${points.map(p => `<li>${p.replace(/^-\s*/, '')}</li>`).join('')}
        </ul>
      </div>
      <div class="review-preview-grid">
        <div class="review-mini-card">
          <div class="review-mini-label">Core idea</div>
          <p>${preview.core}</p>
        </div>
        <div class="review-mini-card">
          <div class="review-mini-label">Interview use</div>
          <p>${preview.interview}</p>
        </div>
      </div>
    `;
    
    // Reset answer display
    document.getElementById('review-answer').style.display = 'none';
    document.getElementById('review-show-answer').style.display = 'block';
    document.getElementById('review-rating').style.display = 'none';
    
    // Store current for rating
    window.currentReviewItem = current;
    window.currentReviewLesson = lesson;
    document.getElementById('review-open-lesson')?.addEventListener('click', () => {
      window.location.hash = `#lesson/${module.id}/${module.lessons.findIndex((item) => item.id == lesson.id)}`;
    });
    
  } catch (error) {
    console.error('Failed to load review:', error);
    nextReview();
  }
}

function showReviewAnswer() {
  document.getElementById('review-answer').style.display = 'block';
  document.getElementById('review-show-answer').style.display = 'none';
  document.getElementById('review-rating').style.display = 'block';
  
  const lesson = window.currentReviewLesson;
  if (lesson) {
    const sections = splitReviewBody(lesson.body || '');
    const formulas = (lesson.formulas || '').trim();
    document.getElementById('review-body').innerHTML = `
      <div class="review-answer-grid">
        <section class="review-answer-card">
          <div class="review-panel-label">Core Explanation</div>
          <div class="review-rich-text">
            ${sections.length ? sections.map((section) => `<p>${section}</p>`).join('') : '<p>No additional lesson body saved.</p>'}
          </div>
        </section>
        <section class="review-answer-card">
          <div class="review-panel-label">Why it matters</div>
          <p>${lesson.why_it_matters || 'Tie this lesson back to partner confidence, implementation safety, or clearer communication.'}</p>
          ${formulas ? `
            <div class="review-formula-box">
              <div class="review-mini-label">Formula / exact text</div>
              <pre><code>${escapeReviewHtml(formulas)}</code></pre>
            </div>
          ` : ''}
        </section>
      </div>
    `;
    document.getElementById('review-explanation').innerHTML = `
      <div class="review-takeaway">
        <div class="review-panel-label">Call-ready takeaway</div>
        <p>${lesson.interview_drill || `Explain ${lesson.title} clearly without reopening the docs.`}</p>
      </div>
    `;
  }
}

function buildReviewPreview(lesson) {
  const body = (lesson.body || '').replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ').trim();
  const points = (lesson.what_you_must_know || '').split('\n').map((p) => p.replace(/^-\s*/, '').trim()).filter(Boolean);
  return {
    core: points[0] || body.slice(0, 160) || 'Summarize the core concept in one clean sentence.',
    interview: lesson.interview_drill || lesson.why_it_matters || 'Turn the concept into a clear partner-facing explanation.'
  };
}

function splitReviewBody(body) {
  return body
    .split('\n')
    .map((line) => line.replace(/^[-#*`>\s]+/, '').trim())
    .filter(Boolean)
    .slice(0, 6);
}

function escapeReviewHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function rateReview(rating) {
  const item = window.currentReviewItem;
  if (!item) return;
  
  // Update rating
  const ratings = JSON.parse(localStorage.getItem('lessonRatings') || '{}');
  const intervals = {
    1: 60 * 1000,        // Again: 1 minute
    2: 2 * 24 * 60 * 60 * 1000,  // Hard: 2 days
    3: 4 * 24 * 60 * 60 * 1000,  // Good: 4 days
    4: 7 * 24 * 60 * 60 * 1000   // Easy: 7 days
  };
  
  ratings[item.key] = {
    ...ratings[item.key],
    rating,
    timestamp: Date.now(),
    nextReview: Date.now() + intervals[rating],
    reviewCount: (ratings[item.key].reviewCount || 0) + 1
  };
  
  localStorage.setItem('lessonRatings', JSON.stringify(ratings));
  
  loadReviewQueue();
}

function nextReview() {
  currentReviewIndex++;
  showCurrentReview();
  updateReviewBadge();
}

// Bind buttons when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('review-show-answer')?.addEventListener('click', showReviewAnswer);
  
  document.querySelectorAll('#review-rating .rating-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const rating = parseInt(btn.dataset.rating);
      rateReview(rating);
    });
  });
});

// Export for use in other files
window.loadReviewQueue = loadReviewQueue;
window.updateReviewBadge = updateReviewBadge;
