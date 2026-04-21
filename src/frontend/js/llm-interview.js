/**
 * LLM Interview Module - Interactive Open-Ended Question Practice
 * Cost-effective local evaluation without API calls
 */

class LLMInterview {
    constructor() {
        this.questions = [];
        this.currentQuestion = null;
        this.answerHistory = [];
        this.isEvaluating = false;
        
        this.init();
    }
    
    async init() {
        await this.loadQuestions();
        this.setupEventListeners();
        this.renderQuestionList();
    }
    
    async loadQuestions() {
        try {
            const res = await fetch('/api/llm/questions');
            const data = await res.json();
            this.questions = data.questions || [];
        } catch (err) {
            console.error('Failed to load LLM questions:', err);
            this.showError('Failed to load questions. Please refresh.');
        }
    }
    
    setupEventListeners() {
        // Answer submission
        const submitBtn = document.getElementById('llm-submit-answer');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitAnswer());
        }
        
        // Textarea auto-resize
        const textarea = document.getElementById('llm-answer-input');
        if (textarea) {
            textarea.addEventListener('input', (e) => {
                this.updateWordCount(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
            });
        }
        
        // Next question
        const nextBtn = document.getElementById('llm-next-question');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }
        
        // Category filter
        const categoryFilter = document.getElementById('llm-category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filterByCategory(e.target.value);
            });
        }
    }
    
    renderQuestionList() {
        const container = document.getElementById('llm-question-list');
        if (!container) return;
        
        const categories = [...new Set(this.questions.map(q => q.category))];
        
        container.innerHTML = `
            <div class="llm-filter-bar">
                <select id="llm-category-filter" class="filter-select">
                    <option value="all">All Categories</option>
                    ${categories.map(c => `<option value="${c}">${this.formatCategory(c)}</option>`).join('')}
                </select>
                <span class="question-count">${this.questions.length} questions</span>
            </div>
            <div class="llm-questions-grid">
                ${this.questions.map(q => this.renderQuestionCard(q)).join('')}
            </div>
        `;
    }
    
    renderQuestionCard(question) {
        const difficultyClass = question.difficulty === 'critical' ? 'critical' : 
                               question.difficulty === 'expert' ? 'expert' :
                               question.difficulty === 'advanced' ? 'advanced' : 'intermediate';
        
        const completed = this.answerHistory.find(h => h.questionId === question.id);
        
        return `
            <div class="llm-question-card ${completed ? 'completed' : ''}" data-id="${question.id}" data-category="${question.category}">
                <div class="card-header">
                    <span class="difficulty-badge ${difficultyClass}">${question.difficulty}</span>
                    <span class="cost-badge">${question.estimatedEvalCost}</span>
                </div>
                <h4>${question.title}</h4>
                <div class="card-meta">
                    <span class="category">${this.formatCategory(question.category)}</span>
                    <span class="word-count">${question.minWords}-${question.maxWords} words</span>
                </div>
                ${completed ? `
                    <div class="card-score">
                        <span class="score-badge ${completed.evaluation.rating}">
                            ${completed.evaluation.score}%
                        </span>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    async loadQuestion(questionId) {
        try {
            const res = await fetch(`/api/llm/questions/${questionId}`);
            this.currentQuestion = await res.json();
            this.renderCurrentQuestion();
        } catch (err) {
            console.error('Failed to load question:', err);
            this.showError('Failed to load question.');
        }
    }
    
    renderCurrentQuestion() {
        const container = document.getElementById('llm-question-container');
        if (!container || !this.currentQuestion) return;
        
        container.innerHTML = `
            <div class="question-header">
                <button class="back-btn" onclick="llmInterview.showQuestionList()">
                    ← Back to Questions
                </button>
                <div class="question-meta">
                    <span class="difficulty-badge ${this.currentQuestion.difficulty}">
                        ${this.currentQuestion.difficulty}
                    </span>
                    <span class="category-badge">
                        ${this.formatCategory(this.currentQuestion.category)}
                    </span>
                </div>
            </div>
            
            <div class="question-content">
                <h2>${this.currentQuestion.title}</h2>
                <div class="question-text">
                    ${this.formatQuestionText(this.currentQuestion.question)}
                </div>
                
                <div class="evaluation-criteria">
                    <h4>What to Include:</h4>
                    <ul>
                        ${this.currentQuestion.evaluationCriteria.mustInclude.map(c => 
                            `<li>${c}</li>`
                        ).join('')}
                    </ul>
                    
                    ${this.currentQuestion.evaluationCriteria.bonusPoints ? `
                        <h4>Bonus Points:</h4>
                        <ul class="bonus-points">
                            ${this.currentQuestion.evaluationCriteria.bonusPoints.map(c => 
                                `<li>${c}</li>`
                            ).join('')}
                        </ul>
                    ` : ''}
                </div>
            </div>
            
            <div class="answer-section">
                <div class="answer-header">
                    <h3>Your Answer</h3>
                    <span class="word-counter" id="word-counter">0 / ${this.currentQuestion.maxWords} words</span>
                </div>
                <textarea 
                    id="llm-answer-input" 
                    class="answer-textarea"
                    placeholder="Type your answer here..."
                    rows="8"
                ></textarea>
                <div class="answer-actions">
                    <button id="llm-submit-answer" class="btn-primary">
                        Submit Answer
                    </button>
                    <button id="llm-save-draft" class="btn-secondary">
                        Save Draft
                    </button>
                </div>
            </div>
            
            <div id="evaluation-result" class="evaluation-result" style="display: none;">
                <!-- Evaluation will be rendered here -->
            </div>
        `;
        
        // Re-attach listeners
        this.setupEventListeners();
        
        // Scroll to top
        container.scrollIntoView({ behavior: 'smooth' });
    }
    
    formatQuestionText(text) {
        // Convert newlines to paragraphs, handle code blocks
        return text
            .split('\n\n')
            .map(para => {
                if (para.startsWith('```')) {
                    return `<pre><code>${para.replace(/```\w*\n?/, '').replace(/```$/, '')}</code></pre>`;
                }
                return `<p>${para}</p>`;
            })
            .join('');
    }
    
    updateWordCount(text) {
        const counter = document.getElementById('word-counter');
        if (!counter || !this.currentQuestion) return;
        
        const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        const min = this.currentQuestion.minWords;
        const max = this.currentQuestion.maxWords;
        
        counter.textContent = `${words} / ${max} words`;
        counter.className = 'word-counter ' + 
            (words < min ? 'under' : words > max ? 'over' : 'good');
    }
    
    async submitAnswer() {
        if (this.isEvaluating) return;
        
        const textarea = document.getElementById('llm-answer-input');
        if (!textarea) return;
        
        const answer = textarea.value.trim();
        if (!answer) {
            this.showError('Please enter an answer before submitting.');
            return;
        }
        
        const wordCount = answer.split(/\s+/).filter(w => w.length > 0).length;
        if (wordCount < 20) {
            this.showError('Answer is too short. Please provide a more detailed response.');
            return;
        }
        
        this.isEvaluating = true;
        this.showLoading(true);
        
        try {
            const res = await fetch('/api/llm/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questionId: this.currentQuestion.id,
                    answer: answer
                })
            });
            
            const data = await res.json();
            
            if (data.success) {
                this.renderEvaluation(data.evaluation);
                this.saveToHistory(this.currentQuestion.id, answer, data.evaluation);
            } else {
                this.showError(data.error || 'Evaluation failed.');
            }
        } catch (err) {
            console.error('Evaluation error:', err);
            this.showError('Failed to evaluate answer. Please try again.');
        } finally {
            this.isEvaluating = false;
            this.showLoading(false);
        }
    }
    
    renderEvaluation(evaluation) {
        const container = document.getElementById('evaluation-result');
        if (!container) return;
        
        const ratingClass = evaluation.rating;
        const ratingText = evaluation.rating === 'excellent' ? 'Excellent!' :
                          evaluation.rating === 'good' ? 'Good Job' :
                          evaluation.rating === 'needs-improvement' ? 'Needs Improvement' : 'Keep Practicing';
        
        container.innerHTML = `
            <div class="evaluation-header">
                <h3>Evaluation Result</h3>
                <span class="eval-cost">${evaluation.estimatedCost}</span>
            </div>
            
            <div class="score-section">
                <div class="score-circle ${ratingClass}">
                    <span class="score-value">${evaluation.score}</span>
                    <span class="score-label">/ 100</span>
                </div>
                <div class="rating-badge ${ratingClass}">${ratingText}</div>
            </div>
            
            <div class="score-breakdown">
                <h4>Score Breakdown</h4>
                ${Object.entries(evaluation.breakdown).map(([key, value]) => `
                    <div class="breakdown-item">
                        <span class="breakdown-label">${this.formatLabel(key)}</span>
                        <div class="breakdown-bar">
                            <div class="breakdown-fill" style="width: ${(value / Math.max(...Object.values(evaluation.breakdown))) * 100}%"></div>
                        </div>
                        <span class="breakdown-value">${value}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="evaluation-summary">
                <h4>Summary</h4>
                <p>${evaluation.summary}</p>
            </div>
            
            ${evaluation.strengths.length > 0 ? `
                <div class="strengths-section">
                    <h4>💪 Strengths</h4>
                    <ul>
                        ${evaluation.strengths.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${evaluation.improvements.length > 0 ? `
                <div class="improvements-section">
                    <h4>🎯 Areas to Improve</h4>
                    <ul>
                        ${evaluation.improvements.map(i => `<li>${i}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${evaluation.coverage?.missing?.length > 0 ? `
                <div class="missing-points">
                    <h4>📚 Missing Concepts</h4>
                    <ul>
                        ${evaluation.coverage.missing.map(m => `<li>${m}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            <div class="evaluation-actions">
                <button id="llm-try-again" class="btn-secondary" onclick="llmInterview.tryAgain()">
                    Try Again
                </button>
                <button id="llm-next-question" class="btn-primary">
                    Next Question →
                </button>
            </div>
        `;
        
        container.style.display = 'block';
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Re-attach next button listener
        const nextBtn = document.getElementById('llm-next-question');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }
    }
    
    tryAgain() {
        const textarea = document.getElementById('llm-answer-input');
        if (textarea) {
            textarea.value = '';
            textarea.focus();
        }
        
        const evalResult = document.getElementById('evaluation-result');
        if (evalResult) {
            evalResult.style.display = 'none';
        }
        
        this.updateWordCount('');
    }
    
    nextQuestion() {
        const currentIndex = this.questions.findIndex(q => q.id === this.currentQuestion?.id);
        const nextIndex = (currentIndex + 1) % this.questions.length;
        const nextQuestion = this.questions[nextIndex];
        
        if (nextQuestion) {
            this.loadQuestion(nextQuestion.id);
        }
    }
    
    showQuestionList() {
        this.currentQuestion = null;
        this.renderQuestionList();
        
        const container = document.getElementById('llm-question-container');
        if (container) {
            container.innerHTML = '';
        }
    }
    
    filterByCategory(category) {
        const cards = document.querySelectorAll('.llm-question-card');
        cards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    saveToHistory(questionId, answer, evaluation) {
        this.answerHistory.push({
            questionId,
            answer,
            evaluation,
            timestamp: new Date().toISOString()
        });
        
        // Update the card to show completion
        const card = document.querySelector(`[data-id="${questionId}"]`);
        if (card) {
            card.classList.add('completed');
            if (!card.querySelector('.card-score')) {
                const scoreDiv = document.createElement('div');
                scoreDiv.className = 'card-score';
                scoreDiv.innerHTML = `
                    <span class="score-badge ${evaluation.rating}">
                        ${evaluation.score}%
                    </span>
                `;
                card.appendChild(scoreDiv);
            }
        }
    }
    
    formatCategory(category) {
        return category
            .split('-')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    }
    
    formatLabel(key) {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
    }
    
    showLoading(show) {
        const btn = document.getElementById('llm-submit-answer');
        if (btn) {
            btn.disabled = show;
            btn.textContent = show ? 'Evaluating...' : 'Submit Answer';
        }
    }
    
    showError(message) {
        // Use app's toast if available, otherwise alert
        if (window.app && window.app.showToast) {
            window.app.showToast(message, 'error');
        } else {
            alert(message);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.llmInterview = new LLMInterview();
});
