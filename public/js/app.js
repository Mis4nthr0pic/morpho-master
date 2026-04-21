class MorphoCourseApp {
  constructor() {
    this.state = {
      modules: [],
      quiz: [],
      challenges: [],
      hotseat: [],
      progress: [],
      analytics: null,
      activeModuleIndex: 0,
      activeLessonIndex: 0,
      practiceMode: 'quiz',
      activeQuizIndex: 0,
      selectedQuizAnswer: null,
      quizFeedback: null,
      activeChallengeIndex: 0,
      writingCaseIndex: 0,
      llmFeedback: null,
      writingFeedback: null,
      session: null,
      sessionStartedAt: null,
      timerHandle: null,
      flowState: false,
      keystrokes: 0,
      lineCount: 0,
      hintsUsed: 0
    };
    this.lessonZoom = this.loadLessonZoom();

    this.writingCases = [
      {
        title: 'Partner Integration Brief',
        scenario: 'A wallet partner wants to add Morpho borrow flows on Base within two weeks.',
        audience: 'Frontend engineers and PM',
        task: 'Write a short integration brief explaining Morpho Blue, the borrow flow, UI assumptions, and a week-1 implementation plan.'
      },
      {
        title: 'Withdrawal Incident Runbook',
        scenario: 'A partner reports a blocked withdrawal and wants a runbook before escalating.',
        audience: 'Support engineer',
        task: 'Write a troubleshooting guide covering evidence gathering, root-cause isolation, and an escalation threshold.'
      }
    ];

    this.editor = null;
    this.editorLib = null;
    this.lastSnapshot = '';
  }

  getChallengeCase(challenge) {
    const cases = {
      'Calculate Utilization for a Morpho Market': {
        scenario: 'A partner PM asks why a market suddenly became unattractive for new lenders. You need to compute utilization correctly and explain what it means operationally.',
        deliverable: 'Implement the utilization function and be able to explain the result in one sentence to a non-protocol teammate.',
        pitfalls: [
          'Forgetting the zero-supply edge case.',
          'Losing precision with bigint arithmetic.',
          'Giving a number without explaining what it means.'
        ]
      },
      'Build a Bundler Sequence': {
        scenario: 'A wallet integrator wants to combine collateral supply and borrow into one clean user action. You need to show the atomic sequence in the correct order.',
        deliverable: 'Build the bundle and explain why the step ordering matters for execution safety.',
        pitfalls: [
          'Wrong multicall ordering.',
          'Explaining the bundle mechanically without tying it to user experience.',
          'Ignoring failure assumptions between steps.'
        ]
      },
      'Translate a Type Error into English': {
        scenario: 'A partner engineer drops a TypeScript error in Slack and wants help now. They do not need compiler jargon, they need an actionable explanation.',
        deliverable: 'Convert the raw error into a short human explanation and a next-step fix.',
        pitfalls: [
          'Repeating the compiler message without translation.',
          'Giving a fix without naming the mismatch.',
          'Failing to explain bigint conversion clearly.'
        ]
      }
    };

    return cases[challenge.title] || {
      scenario: 'A Morpho integration partner needs a technically correct answer under time pressure.',
      deliverable: 'Implement the function and be ready to explain the business consequence of the result.',
      pitfalls: [
        'Solving the code but not the communication problem.',
        'Ignoring units, assumptions, or edge cases.',
        'Treating the task like isolated trivia instead of integration work.'
      ]
    };
  }

  async init() {
    this.applySavedTheme();
    await this.loadBootstrap();
    this.bindUI();
    await this.initEditor();
    this.render();
  }

  async loadBootstrap() {
    const response = await fetch('/api/bootstrap');
    const data = await response.json();
    this.state.modules = data.modules;
    this.state.quiz = data.quiz;
    this.state.challenges = data.challenges;
    this.state.hotseat = data.hotseat;
    this.state.progress = data.progress;
    this.state.analytics = data.analytics;
    this.state.session = data.activeSession;
    this.state.sessionStartedAt = data.activeSession ? new Date(data.activeSession.start_time).getTime() : null;
  }

  bindUI() {
    document.querySelectorAll('.practice-tab').forEach((button) => {
      button.addEventListener('click', () => {
        this.state.practiceMode = button.dataset.practice;
        document.querySelectorAll('.practice-tab').forEach((item) => item.classList.toggle('active', item === button));
        this.renderPractice();
      });
    });

    document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
    document.getElementById('start-session').addEventListener('click', () => this.startSession());
    document.getElementById('stop-session').addEventListener('click', () => this.stopSession());
    document.getElementById('prev-lesson').addEventListener('click', () => this.stepLesson(-1));
    document.getElementById('next-lesson').addEventListener('click', () => this.stepLesson(1));
    document.getElementById('lesson-zoom-out').addEventListener('click', () => this.adjustLessonZoom(-10));
    document.getElementById('lesson-zoom-in').addEventListener('click', () => this.adjustLessonZoom(10));
    document.getElementById('lesson-zoom-reset').addEventListener('click', () => this.setLessonZoom(100));
    document.getElementById('run-code').addEventListener('click', () => this.runCode());
    document.getElementById('show-hint').addEventListener('click', () => this.showHint());
    document.getElementById('show-solution').addEventListener('click', () => this.showSolution());
    document.getElementById('close-code').addEventListener('click', () => this.closeCode());
    this.applyLessonZoom();
  }

  loadLessonZoom() {
    const saved = Number(localStorage.getItem('morpho-lesson-zoom'));
    if (Number.isFinite(saved)) {
      return Math.min(150, Math.max(90, saved));
    }
    return 100;
  }

  adjustLessonZoom(delta) {
    this.setLessonZoom(this.lessonZoom + delta);
  }

  setLessonZoom(value) {
    this.lessonZoom = Math.min(150, Math.max(90, value));
    localStorage.setItem('morpho-lesson-zoom', String(this.lessonZoom));
    this.applyLessonZoom();
  }

  applyLessonZoom() {
    const lessonContent = document.getElementById('lesson-content');
    const zoomValue = document.getElementById('lesson-zoom-value');
    const zoomOut = document.getElementById('lesson-zoom-out');
    const zoomIn = document.getElementById('lesson-zoom-in');

    if (lessonContent) {
      lessonContent.style.setProperty('--lesson-zoom', `${this.lessonZoom}%`);
    }
    if (zoomValue) {
      zoomValue.textContent = `${this.lessonZoom}%`;
    }
    if (zoomOut) {
      zoomOut.disabled = this.lessonZoom <= 90;
    }
    if (zoomIn) {
      zoomIn.disabled = this.lessonZoom >= 150;
    }
  }

  async initEditor() {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/monaco/vs/loader.js';
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });

    window.require.config({ paths: { vs: '/monaco/vs' } });
    await new Promise((resolve) => window.require(['vs/editor/editor.main'], resolve));
    this.editorLib = window.monaco;

    this.editorLib.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: this.editorLib.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: this.editorLib.languages.typescript.ModuleResolutionKind.NodeJs,
      module: this.editorLib.languages.typescript.ModuleKind.ESNext,
      strict: true,
      noEmit: true,
      esModuleInterop: true
    });

    this.editor = this.editorLib.editor.create(document.getElementById('editor'), {
      value: this.state.challenges[0]?.starter_code || '// Loading...',
      language: 'typescript',
      theme: 'vs-dark',
      fontSize: 14,
      fontFamily: 'JetBrains Mono, monospace',
      minimap: { enabled: true },
      automaticLayout: true
    });

    this.lastSnapshot = this.editor.getValue();
    this.editor.onDidChangeModelContent(() => this.captureActivity());
    document.getElementById('editor-status').textContent = 'TypeScript editor ready.';
  }

  render() {
    this.renderHeader();
    this.renderSyllabus();
    this.renderLesson();
    this.renderPractice();
  }

  renderHeader() {
    const analytics = this.state.analytics;
    const module = this.currentModule();
    document.getElementById('today-hours').textContent = `${analytics.todayHours.toFixed(1)}h`;
    document.getElementById('streak-display').textContent = `${analytics.currentStreak} day${analytics.currentStreak === 1 ? '' : 's'}`;
    document.getElementById('readiness-display').textContent = `${analytics.readiness}%`;
    document.getElementById('module-title').textContent = module?.title || 'Morpho Specialist Course';
    document.getElementById('flow-indicator').textContent = this.state.flowState ? 'Flow State' : 'Cold Start';
    document.getElementById('war-mode-chip').textContent = analytics.warMode ? 'War Mode Active' : 'War Mode Offline';
    document.getElementById('war-mode-chip').classList.toggle('war', analytics.warMode);
    this.startTimer();
  }

  renderSyllabus() {
    const preferredOrder = [
      'Introduction',
      'Learn',
      'Earn - Morpho Vaults V2 & V1',
      'Borrow - Morpho Markets V1',
      'Rewards',
      'Get Started',
      'Curate',
      'Tools',
      'Get Started'
    ];

    const lessonEntries = this.state.modules.flatMap((module, moduleIndex) =>
      module.lessons.map((lesson, lessonIndex) => ({
        module,
        moduleIndex,
        lesson,
        lessonIndex,
        track: lesson.productTrack || this.trackFromModule(module.slug),
        stage: this.normalizeStageLabel(lesson.docStage || 'overview')
      }))
    ).filter((entry) => this.isSyllabusLesson(entry.lesson));

    const groups = new Map();
    lessonEntries.forEach((entry) => {
      const track = entry.track;
      const stage = entry.stage;
      if (!groups.has(track)) groups.set(track, new Map());
      if (!groups.get(track).has(stage)) groups.get(track).set(stage, []);
      groups.get(track).get(stage).push(entry);
    });

    const orderedTracks = [...groups.keys()].sort((a, b) => {
      const aIndex = preferredOrder.indexOf(a);
      const bIndex = preferredOrder.indexOf(b);
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

    const html = orderedTracks.map((track) => {
      const stageMap = groups.get(track);
      const orderedStages = [...stageMap.keys()].sort((a, b) => this.stageRank(a) - this.stageRank(b) || a.localeCompare(b));

      return `
        <div class="syllabus-group">
          <div class="syllabus-group-title">${this.escapeHtml(track)}</div>
          ${orderedStages.map((stage) => `
            <div class="syllabus-subgroup">
              <div class="syllabus-subtitle">${this.escapeHtml(stage)}</div>
              <div class="syllabus-list">
                ${stageMap.get(stage).map((entry) => `
                  <button class="syllabus-item ${entry.moduleIndex === this.state.activeModuleIndex && entry.lessonIndex === this.state.activeLessonIndex ? 'active' : ''}"
                    data-module-index="${entry.moduleIndex}" data-lesson-index="${entry.lessonIndex}">
                    <strong>${this.escapeHtml(entry.lesson.title)}</strong>
                    <small>${this.escapeHtml(entry.module.title)}</small>
                  </button>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }).join('');

    document.getElementById('syllabus-content').innerHTML = html;
    document.querySelectorAll('.syllabus-item').forEach((button) => {
      button.addEventListener('click', () => {
        this.state.activeModuleIndex = Number(button.dataset.moduleIndex);
        this.state.activeLessonIndex = Number(button.dataset.lessonIndex);
        this.resetLessonPracticeState();
        this.render();
      });
    });
  }

  isSyllabusLesson(lesson) {
    if (!lesson || !Array.isArray(lesson.docs) || lesson.docs.length === 0) return true;
    if (!lesson.productTrack || !lesson.docStage) return true;
    const primaryDoc = lesson.docs[0];
    if (!primaryDoc || !primaryDoc.title) return true;
    return lesson.title === primaryDoc.title || lesson.title === `${primaryDoc.title} [${primaryDoc.section}]`;
  }

  trackFromModule(slug) {
    if (slug === 'defi-primitives') return 'Introduction';
    if (slug === 'morpho-architecture') return 'Introduction';
    if (slug === 'integration-patterns') return 'Tools';
    return 'Interview';
  }

  normalizeStageLabel(value) {
    const normalized = String(value || 'overview').toLowerCase().trim();
    const map = {
      overview: 'Introduction',
      'get started': 'Get Started',
      concepts: 'Concepts',
      tutorials: 'Tutorials',
      guides: 'Guides',
      resources: 'Resources'
    };
    return map[normalized] || normalized.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  stageRank(stage) {
    const order = ['Introduction', 'Get Started', 'Concepts', 'Tutorials', 'Guides', 'Resources'];
    const index = order.indexOf(stage);
    return index === -1 ? 99 : index;
  }

  renderLesson() {
    const lesson = this.currentLesson();
    const module = this.currentModule();
    const conceptName = `${module.title} :: ${lesson.title}`;
    const progressRow = this.state.progress.find((row) => row.concept_name === conceptName);
    const completed = Boolean(progressRow && progressRow.times_practiced > 0);
    document.getElementById('lesson-title').textContent = lesson.title;

    document.getElementById('lesson-content').innerHTML = `
      <article class="reader-card">
        <div class="eyebrow">Lesson Summary</div>
        <div class="markdown">${this.renderMarkdown(lesson.body)}</div>
      </article>
      <article class="reader-card">
        <div class="eyebrow">What You Must Know</div>
        ${this.renderList(lesson.whatYouMustKnow)}
        <div class="eyebrow">Why It Matters</div>
        ${this.renderList(lesson.whyItMatters)}
        <div class="eyebrow">Implementation Checks</div>
        ${this.renderList(lesson.implementationChecks)}
      </article>
      <article class="reader-card">
        <div class="eyebrow">Source Material</div>
        <div class="resource-stack">
          ${(lesson.docs || []).map((doc) => {
            const preview = doc.excerpt || doc.content || '';
            const examples = Array.isArray(doc.codeExamples) ? doc.codeExamples.slice(0, 2) : [];
            return `
              <div class="resource-link">
                <strong>${doc.title}</strong>
                <div class="eyebrow">${doc.section}</div>
                <div class="markdown">${this.renderMarkdown(preview)}</div>
                ${examples.length ? `
                  <div class="eyebrow">Code Examples</div>
                  ${examples.map((example) => `
                    <details class="doc-example">
                      <summary>${this.escapeHtml(example.title)}</summary>
                      <pre class="code-example"><code>${this.escapeHtml(example.code)}</code></pre>
                    </details>
                  `).join('')}
                ` : ''}
                ${doc.url ? `<div class="practice-actions"><a class="ghost-button" href="${doc.url}" target="_blank" rel="noreferrer">Open original page</a></div>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </article>
      <article class="reader-card">
        <div class="eyebrow">Study Tips</div>
        ${this.renderList(lesson.tips)}
        <div class="eyebrow">Interview Drill</div>
        <div class="markdown">${this.renderMarkdown(lesson.interviewDrill || '')}</div>
        <div class="practice-actions">
          <button id="mark-progress" class="primary-button" type="button" ${completed ? 'disabled' : ''}>
            ${completed ? 'Lesson Completed' : 'Mark Lesson Complete'}
          </button>
          <button id="resume-later" class="ghost-button" type="button">Save For Return</button>
        </div>
      </article>
    `;

    document.getElementById('mark-progress').addEventListener('click', async () => {
      if (completed) return;
      const response = await fetch('/api/progress/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conceptName,
          minutes: 20
        })
      });
      await response.json();
      await this.loadBootstrap();
      this.render();
    });

    document.getElementById('resume-later').addEventListener('click', () => {
      localStorage.setItem('morpho-resume-lesson', JSON.stringify({
        moduleIndex: this.state.activeModuleIndex,
        lessonIndex: this.state.activeLessonIndex
      }));
      this.renderPracticeInfo([
        'Lesson saved for return.',
        `${this.currentModule().title} / ${lesson.title}`
      ]);
    });
  }

  renderPractice() {
    if (this.state.practiceMode === 'quiz') return this.renderQuiz();
    if (this.state.practiceMode === 'code') return this.renderCode();
    if (this.state.practiceMode === 'llm') return this.renderLlm();
    return this.renderWriting();
  }

  renderQuiz() {
    const question = this.quizForCurrentLesson();
    const selectedAnswer = this.state.selectedQuizAnswer;
    document.getElementById('practice-content').innerHTML = `
      <article class="practice-card">
        <div class="eyebrow">Lesson Quiz</div>
        <h3>${question.prompt}</h3>
        <p class="subtext">Check whether you actually understood the current lesson.</p>
        <div class="option-grid">
          ${question.choices.map((choice, index) => {
            const answered = this.state.quizFeedback !== null;
            const isCorrect = index === question.correct_index;
            const isSelected = selectedAnswer === index;
            const classes = ['option-button'];
            if (answered && isCorrect) classes.push('correct');
            if (answered && isSelected && !isCorrect) classes.push('wrong');
            if (answered) classes.push('disabled');
            return `<button class="${classes.join(' ')}" data-answer="${index}" ${answered ? 'disabled' : ''}>${choice}</button>`;
          }).join('')}
        </div>
      </article>
      ${this.state.quizFeedback ? `
        <article class="practice-card ${this.state.quizFeedback.correct ? 'success' : 'error'}">
          <div class="eyebrow">${this.state.quizFeedback.correct ? 'Correct' : 'Wrong'}</div>
          <h3>${this.state.quizFeedback.correct ? 'Good answer' : 'Review this point'}</h3>
          <p>${this.state.quizFeedback.explanation}</p>
          <p><strong>Tip:</strong> ${this.state.quizFeedback.interviewTip}</p>
          <div class="practice-actions">
            <button id="next-question" class="primary-button">Next Question</button>
          </div>
        </article>
      ` : ''}
    `;

    document.querySelectorAll('[data-answer]').forEach((button) => {
      button.addEventListener('click', async () => {
        const response = await fetch('/api/quiz/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionId: question.question_id,
            answerIndex: Number(button.dataset.answer),
            timeTakenSeconds: 20
          })
        });
        const result = await response.json();
        this.state.selectedQuizAnswer = Number(button.dataset.answer);
        this.state.quizFeedback = {
          correct: result.correct,
          explanation: result.explanation,
          interviewTip: result.interviewTip
        };
        await this.loadBootstrap();
        this.renderHeader();
        this.renderQuiz();
      });
    });

    const nextButton = document.getElementById('next-question');
    if (nextButton) {
      nextButton.addEventListener('click', () => {
        this.state.quizFeedback = null;
        this.state.selectedQuizAnswer = null;
        this.state.activeQuizIndex = (this.state.activeQuizIndex + 1) % Math.max(1, this.filteredQuiz().length);
        this.renderQuiz();
      });
    }
  }

  renderCode() {
    const challenge = this.challengeForCurrentLesson();
    const interviewCase = this.getChallengeCase(challenge);
    document.getElementById('practice-content').innerHTML = `
      <article class="practice-card">
        <div class="eyebrow">Lesson Code Lab</div>
        <h3>${challenge.title}</h3>
        <p class="subtext">${interviewCase.scenario}</p>
        <p><strong>Deliverable:</strong> ${interviewCase.deliverable}</p>
        <div class="eyebrow">Concepts</div>
        ${this.renderList(challenge.concepts_covered)}
        <div class="eyebrow">Pitfalls</div>
        ${this.renderList(interviewCase.pitfalls)}
        <div class="eyebrow">Docs And Examples</div>
        <div class="resource-stack">
          ${(challenge.docs || []).map((doc) => this.renderDocReference(doc)).join('')}
        </div>
        <div class="practice-actions">
          <button id="open-code" class="primary-button">Open Code Lab</button>
        </div>
      </article>
    `;

    document.getElementById('open-code').addEventListener('click', () => {
      this.state.activeChallengeIndex = this.state.challenges.findIndex((item) => item.id === challenge.id);
      this.openCode();
    });
  }

  renderLlm() {
    const scenario = this.currentHotseat();
    document.getElementById('practice-content').innerHTML = `
      <article class="practice-card">
        <div class="eyebrow">LLM / Open-Ended Prompt</div>
        <h3>${scenario.title}</h3>
        <p>${scenario.prompt}</p>
        ${this.renderList(scenario.questions)}
        <textarea id="llm-box" class="writing-box" placeholder="Answer like you are on a partner call."></textarea>
        <div class="practice-actions">
          <button id="submit-llm" class="primary-button">Evaluate Answer</button>
        </div>
      </article>
      ${this.state.llmFeedback ? `
        <article class="practice-card ${this.state.llmFeedback.score >= 70 ? 'success' : 'error'}">
          <div class="eyebrow">LLM Evaluation</div>
          <h3>${this.state.llmFeedback.score}/100</h3>
          ${this.renderList(this.state.llmFeedback.feedback)}
        </article>
      ` : ''}
    `;

    document.getElementById('submit-llm').addEventListener('click', async () => {
      const content = document.getElementById('llm-box').value;
      const response = await fetch('/api/llm/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: scenario.title, prompt: scenario.prompt, content })
      });
      this.state.llmFeedback = await response.json();
      this.renderLlm();
    });
  }

  renderWriting() {
    const currentCase = this.writingCases[this.state.activeLessonIndex % this.writingCases.length];
    document.getElementById('practice-content').innerHTML = `
      <article class="practice-card">
        <div class="eyebrow">Writing Drill</div>
        <h3>${currentCase.title}</h3>
        <p>${currentCase.scenario}</p>
        <p><strong>Audience:</strong> ${currentCase.audience}</p>
        <p><strong>Task:</strong> ${currentCase.task}</p>
        <textarea id="writing-box" class="writing-box" placeholder="Write your answer here."></textarea>
        <div class="practice-actions">
          <button id="submit-writing" class="primary-button">Score Writing</button>
        </div>
      </article>
      ${this.state.writingFeedback ? `
        <article class="practice-card ${this.state.writingFeedback.score >= 70 ? 'success' : 'error'}">
          <div class="eyebrow">Writing Evaluation</div>
          <h3>${this.state.writingFeedback.score}/100</h3>
          ${this.renderList(this.state.writingFeedback.feedback)}
        </article>
      ` : ''}
    `;

    document.getElementById('submit-writing').addEventListener('click', async () => {
      const content = document.getElementById('writing-box').value;
      const response = await fetch('/api/writing/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: currentCase.title, prompt: currentCase.task, content })
      });
      this.state.writingFeedback = await response.json();
      this.renderWriting();
    });
  }

  renderPracticeInfo(lines) {
    document.getElementById('practice-content').innerHTML = `
      <article class="practice-card">
        ${lines.map((line) => `<p>${this.escapeHtml(line)}</p>`).join('')}
      </article>
    `;
  }

  openCode() {
    const challenge = this.currentChallenge();
    const interviewCase = this.getChallengeCase(challenge);
    document.getElementById('code-modal').classList.remove('hidden');
    document.getElementById('challenge-title').textContent = challenge.title;
    document.getElementById('code-side').innerHTML = `
      <div class="eyebrow">Interview Case</div>
      <p>${interviewCase.scenario}</p>
      <div class="eyebrow">Deliverable</div>
      <p>${interviewCase.deliverable}</p>
      <div class="eyebrow">Pitfalls</div>
      ${this.renderList(interviewCase.pitfalls)}
      <div class="eyebrow">Challenge Notes</div>
      ${this.renderList(challenge.concepts_covered)}
      <div class="eyebrow">Docs Covering This Subject</div>
      <div class="resource-stack">
        ${(challenge.docs || []).map((doc) => this.renderDocReference(doc, true)).join('')}
      </div>
      <div class="eyebrow">Hints</div>
      ${this.renderList(challenge.tips)}
    `;
    if (this.editor) {
      this.editor.setValue(challenge.starter_code);
      this.lastSnapshot = challenge.starter_code;
    }
    this.renderCodeOutput([
      challenge.title,
      ...challenge.test_cases.map((testCase) => `Test: ${testCase.title} -> expect ${JSON.stringify(testCase.expected)}`)
    ]);
  }

  closeCode() {
    document.getElementById('code-modal').classList.add('hidden');
  }

  renderCodeOutput(lines) {
    document.getElementById('code-output-pane').innerHTML = lines
      .map((line) => `<div class="output-line">${this.escapeHtml(String(line))}</div>`)
      .join('');
  }

  async runCode() {
    const challenge = this.currentChallenge();
    const response = await fetch(`/api/challenges/${challenge.id}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: this.editor ? this.editor.getValue() : challenge.starter_code,
        hintsUsed: this.state.hintsUsed
      })
    });
    const result = await response.json();
    await this.loadBootstrap();
    this.renderHeader();
    this.renderCodeOutput([
      result.passed ? 'All tests passed.' : 'Tests failed.',
      ...result.diagnostics.map((item) => `${item.severity.toUpperCase()}: ${item.message}`),
      ...result.results.map((item) => `${item.passed ? 'PASS' : 'FAIL'} ${item.title} | expected ${JSON.stringify(item.expected)} | got ${JSON.stringify(item.actual)}`)
    ]);
  }

  showHint() {
    const challenge = this.currentChallenge();
    this.state.hintsUsed += 1;
    this.renderCodeOutput([
      `Hint used (${this.state.hintsUsed})`,
      ...(challenge.tips || [])
    ]);
  }

  showSolution() {
    const challenge = this.currentChallenge();
    if (this.editor) this.editor.setValue(challenge.solution_code);
    this.renderCodeOutput(['Canonical solution loaded into the editor.']);
  }

  async startSession() {
    const response = await fetch('/api/session/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentModule: this.currentModule().slug })
    });
    this.state.session = await response.json();
    this.state.sessionStartedAt = new Date(this.state.session.start_time).getTime();
    this.startTimer();
  }

  async stopSession() {
    if (!this.state.session) return;
    await fetch('/api/session/stop', { method: 'POST' });
    this.state.session = null;
    this.state.sessionStartedAt = null;
    document.getElementById('timer-display').textContent = '00:00:00';
  }

  captureActivity() {
    if (!this.editor || !this.state.session) return;
    const currentValue = this.editor.getValue();
    this.state.keystrokes += Math.max(0, currentValue.length - this.lastSnapshot.length);
    this.state.lineCount = currentValue.split('\n').length;
    this.lastSnapshot = currentValue;
  }

  startTimer() {
    clearInterval(this.state.timerHandle);
    this.state.timerHandle = setInterval(() => {
      if (!this.state.sessionStartedAt) return;
      const seconds = Math.floor((Date.now() - this.state.sessionStartedAt) / 1000);
      document.getElementById('timer-display').textContent = this.formatTime(seconds);
      this.state.flowState = seconds >= 1800;
      document.getElementById('flow-indicator').textContent = this.state.flowState ? 'Flow State' : 'Cold Start';
    }, 1000);
  }

  stepLesson(direction) {
    const module = this.currentModule();
    const nextLesson = this.state.activeLessonIndex + direction;

    if (nextLesson >= 0 && nextLesson < module.lessons.length) {
      this.state.activeLessonIndex = nextLesson;
      this.resetLessonPracticeState();
      this.render();
      return;
    }

    const nextModule = this.state.activeModuleIndex + direction;
    if (nextModule >= 0 && nextModule < this.state.modules.length) {
      this.state.activeModuleIndex = nextModule;
      this.state.activeLessonIndex = direction > 0 ? 0 : this.state.modules[nextModule].lessons.length - 1;
      this.resetLessonPracticeState();
      this.render();
    }
  }

  currentModule() {
    return this.state.modules[this.state.activeModuleIndex];
  }

  currentLesson() {
    return this.currentModule().lessons[this.state.activeLessonIndex];
  }

  filteredQuiz() {
    return this.state.quiz.filter((question) => question.module_slug === this.currentModule().slug);
  }

  quizForCurrentLesson() {
    const questions = this.filteredQuiz();
    if (!questions.length) return this.state.quiz[0];
    const index = (this.state.activeLessonIndex + this.state.activeQuizIndex) % questions.length;
    return questions[index];
  }

  challengeForCurrentLesson() {
    const index = ((this.state.activeModuleIndex * 5) + this.state.activeLessonIndex) % this.state.challenges.length;
    return this.state.challenges[index];
  }

  currentChallenge() {
    return this.state.challenges[this.state.activeChallengeIndex];
  }

  renderList(items = []) {
    return `<ul>${items.map((item) => `<li>${this.escapeHtml(String(item))}</li>`).join('')}</ul>`;
  }

  renderDocReference(doc, includeExamples = false) {
    const normalized = typeof doc === 'string'
      ? { title: doc, section: '', url: '', content: '', codeExamples: [] }
      : doc;

    return `
      <div class="resource-link">
        <strong>${this.escapeHtml(normalized.title || normalized.label || 'Source')}</strong>
        ${normalized.section ? `<div class="eyebrow">${this.escapeHtml(normalized.section)}</div>` : ''}
        ${normalized.excerpt ? `<p>${this.escapeHtml(normalized.excerpt)}</p>` : ''}
        ${includeExamples && normalized.codeExamples && normalized.codeExamples.length ? `
          <div class="eyebrow">Code Examples In Docs</div>
          ${normalized.codeExamples.map((example) => `
            <pre class="code-example"><code>${this.escapeHtml(example.code)}</code></pre>
          `).join('')}
        ` : ''}
        ${normalized.url ? `<div class="practice-actions"><a class="ghost-button" href="${normalized.url}" target="_blank" rel="noreferrer">Open original page</a></div>` : ''}
      </div>
    `;
  }

  currentHotseat() {
    return this.state.hotseat[(this.state.activeModuleIndex + this.state.activeLessonIndex) % this.state.hotseat.length];
  }

  resetLessonPracticeState() {
    this.state.activeQuizIndex = 0;
    this.state.selectedQuizAnswer = null;
    this.state.quizFeedback = null;
    this.state.llmFeedback = null;
    this.state.writingFeedback = null;
  }

  renderMarkdown(text = '') {
    const lines = String(text).replace(/\r/g, '').split('\n');
    const html = [];
    let inList = false;
    let inTable = false;
    let tableRows = [];

    const inline = (value) => {
      let html = this.escapeHtml(value);
      html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
      html = html.replace(/`(.+?)`/g, '<code>$1</code>');
      html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
      return html;
    };

    const flushList = () => {
      if (inList) {
        html.push('</ul>');
        inList = false;
      }
    };

    const flushTable = () => {
      if (!inTable) return;
        const rows = tableRows.map((row, index) => {
        const tag = index === 0 ? 'th' : 'td';
        return `<tr>${row.map((cell) => `<${tag}>${inline(cell.trim())}</${tag}>`).join('')}</tr>`;
      }).join('');
      html.push(`<table>${rows}</table>`);
      inTable = false;
      tableRows = [];
    };

    for (const rawLine of lines) {
      const line = rawLine.trim();

      if (!line) {
        flushList();
        flushTable();
        continue;
      }

      if (/^\|.+\|$/.test(line)) {
        flushList();
        inTable = true;
        const cells = line.split('|').slice(1, -1);
        if (!cells.every((cell) => /^:?-{2,}:?$/.test(cell.trim()))) {
          tableRows.push(cells);
        }
        continue;
      }

      flushTable();

      if (line.startsWith('### ')) {
        flushList();
        html.push(`<h3>${inline(line.slice(4))}</h3>`);
        continue;
      }

      if (line.startsWith('## ')) {
        flushList();
        html.push(`<h2>${inline(line.slice(3))}</h2>`);
        continue;
      }

      if (line.startsWith('# ')) {
        flushList();
        html.push(`<h1>${inline(line.slice(2))}</h1>`);
        continue;
      }

      if (line.startsWith('> ')) {
        flushList();
        html.push(`<blockquote>${inline(line.slice(2))}</blockquote>`);
        continue;
      }

      if (/^[-*] /.test(line)) {
        if (!inList) {
          html.push('<ul>');
          inList = true;
        }
        html.push(`<li>${inline(line.slice(2))}</li>`);
        continue;
      }

      flushList();
      html.push(`<p>${inline(line)}</p>`);
    }

    flushList();
    flushTable();
    return html.join('');
  }

  applySavedTheme() {
    if (localStorage.getItem('morpho-theme') === 'dark') {
      document.body.classList.add('dark');
    }
    this.updateThemeButton();
  }

  toggleTheme() {
    document.body.classList.toggle('dark');
    localStorage.setItem('morpho-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    this.updateThemeButton();
  }

  updateThemeButton() {
    document.getElementById('theme-toggle').textContent = document.body.classList.contains('dark') ? 'Light Mode' : 'Dark Mode';
  }

  formatTime(seconds) {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${secs}`;
  }

  escapeHtml(value) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  const app = new MorphoCourseApp();
  await app.init();
  const saved = localStorage.getItem('morpho-resume-lesson');
  if (saved) {
    try {
      const resume = JSON.parse(saved);
      if (typeof resume.moduleIndex === 'number' && typeof resume.lessonIndex === 'number') {
        app.state.activeModuleIndex = Math.min(resume.moduleIndex, app.state.modules.length - 1);
        app.state.activeLessonIndex = Math.min(resume.lessonIndex, app.currentModule().lessons.length - 1);
        app.render();
      }
    } catch {}
  }
  window.app = app;
});
