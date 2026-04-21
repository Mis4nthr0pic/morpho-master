/**
 * OpenRouter Service - LLM Evaluation for Interview Drills
 */

const https = require('https');

const OPENROUTER_API_KEY = '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';

const CORE_MORPHO_FACTS = [
  'Morpho Blue is an isolated, immutable, permissionless lending primitive.',
  'A Morpho Blue market is defined by five immutable parameters: loan token, collateral token, oracle, IRM, and LLTV.',
  'Isolation means risk is contained at the market level instead of pooled across unrelated assets.',
  'Liquidations are permissionless and depend on external actors repaying debt for collateral plus incentive.',
  'Health Factor around 1 or below means liquidation risk is near or active.',
  'Morpho market math often relies on oracle pricing scaled to 1e36.',
  'Vaults are curated allocation layers on top of markets; Vault V2 uses Owner, Curator, Allocator, and Sentinel roles.',
  'Bundler3 is for atomic multi-step execution; Merkl is the rewards distribution layer used for newer reward programs.'
];

const CATEGORY_FACTS = {
  'partner-communication': [
    'Strong answers translate protocol design into partner value, implementation tradeoffs, and risk clarity.',
    'Do not reward salesy or vague answers if they miss the actual mechanism.'
  ],
  'protocol-accuracy': [
    'Reward exact explanations of isolated markets, LLTV, HF, liquidation mechanics, and market parameters.',
    'Penalize claims that confuse pooled lending assumptions with Morpho Blue mechanics.'
  ],
  'vault-v2': [
    'Vault V2 roles are Owner, Curator, Allocator, and Sentinel; roles do not inherit permissions.',
    'Vault V2 supports timelocked risk-increasing actions and immediate risk-reducing actions such as cap decreases by Sentinel.'
  ],
  'integration-judgment': [
    'Good answers distinguish between read paths, write paths, caching, fallback behavior, and onchain source of truth.',
    'Do not reward answers that rely blindly on APIs when the question is about critical risk or settlement.'
  ],
  'poc-readiness': [
    'Strong POC answers should mention dashboards, GraphQL or API reads, onchain execution, rewards, HF, LTV, and pragmatic scope.',
    'Reward answers that show what to build first, not just protocol trivia.'
  ],
  'objection-handling': [
    'Good answers acknowledge the concern, explain the actual mechanism, and avoid overpromising guarantees.',
    'Reward empathy plus exactness.'
  ],
  'partner-empathy': [
    'A strong response should sound calm, credible, and helpful under partner pressure.',
    'Do not reward technically correct but dismissive answers.'
  ],
  'scoping': [
    'Good scoping answers clarify whether the partner wants earn, borrow, or both, what user workflow is required, and what chains/assets matter.',
    'Reward answers that turn ambiguity into a concrete next-step plan.'
  ],
  'operational-excellence': [
    'Strong operational answers include repro quality, expected vs actual behavior, impact, escalation path, and communication loop closure.',
    'Reward answers that improve support quality, not only protocol accuracy.'
  ]
};

function buildReferenceContext(meta = {}) {
  const rubric = Array.isArray(meta.rubric) ? meta.rubric : [];
  const categoryFacts = CATEGORY_FACTS[meta.category] || [];
  const referenceNotes = Array.isArray(meta.referenceNotes) ? meta.referenceNotes : [];
  const docsSnippets = Array.isArray(meta.docsSnippets) ? meta.docsSnippets : [];
  const expectedAnswerMain = Array.isArray(meta.expectedAnswer?.main) ? meta.expectedAnswer.main : [];
  const expectedAnswerFollowUp = Array.isArray(meta.expectedAnswer?.followUp) ? meta.expectedAnswer.followUp : [];
  const goldAnswerSources = Array.isArray(meta.goldAnswerSources) ? meta.goldAnswerSources : [];
  const extraContext = typeof meta.context === 'string' ? meta.context.trim() : '';
  const questionIntent = typeof meta.questionIntent === 'string' ? meta.questionIntent.trim() : '';

  return [
    'Canonical Morpho reference facts for scoring:',
    ...CORE_MORPHO_FACTS.map((item) => `- ${item}`),
    questionIntent ? `\nQuestion intent:\n- ${questionIntent}` : '',
    categoryFacts.length ? '\nCategory-specific scoring facts:' : '',
    ...categoryFacts.map((item) => `- ${item}`),
    referenceNotes.length ? '\nQuestion-specific scoring facts:' : '',
    ...referenceNotes.map((item) => `- ${item}`),
    expectedAnswerMain.length ? '\nExpected strong answer should include:' : '',
    ...expectedAnswerMain.map((item) => `- ${item}`),
    rubric.length ? '\nQuestion rubric to score against:' : '',
    ...rubric.map((item) => `- ${item}`),
    meta.followUp ? `\nFollow-up the candidate should be ready for:\n- ${meta.followUp}` : '',
    expectedAnswerFollowUp.length ? '\nFollow-up evaluation guidance:' : '',
    ...expectedAnswerFollowUp.map((item) => `- ${item}`),
    goldAnswerSources.length ? '\nGrounding sources for this drill:' : '',
    ...goldAnswerSources.map((item) => `- ${item}`),
    meta.difficulty ? `\nDifficulty: ${meta.difficulty}` : '',
    docsSnippets.length ? '\nDocs-derived reference snippets for this exact question:' : '',
    ...docsSnippets.map((item, index) => `- Snippet ${index + 1}: ${item}`),
    extraContext ? `\nAdditional notes:\n${extraContext}` : ''
  ].filter(Boolean).join('\n');
}

async function evaluateInterviewAnswer(prompt, answer, meta = {}) {
  const normalizedMeta = typeof meta === 'string' ? { context: meta } : (meta || {});
  const referenceContext = buildReferenceContext(normalizedMeta);

  const systemPrompt = `You are an expert interviewer evaluating a candidate for a Partner Engineer role at Morpho, a DeFi lending protocol.

Use the Morpho reference facts below as the canonical basis for judging correctness. Do not rely on generic DeFi assumptions when they conflict with the supplied Morpho facts.

${referenceContext}

Evaluate the candidate's answer to the interview question. Be thorough but fair.

Important scoring rules:
- Reward technical correctness first, then clarity, empathy, and partner usefulness.
- Penalize answers that sound polished but omit the core mechanism.
- Penalize factual claims that contradict the Morpho reference facts.
- If the answer is incomplete, list the missing mechanism explicitly.
- Do not give credit for generic DeFi language unless it maps correctly to Morpho.

Scoring criteria:
- 90-100: Exceptional - Clear, accurate, well-structured, demonstrates deep understanding
- 80-89: Good - Accurate with minor gaps or could be more concise  
- 70-79: Acceptable - Gets main points but misses details or has minor inaccuracies
- 60-69: Needs work - Understands basics but significant gaps
- Below 60: Insufficient - Major misunderstandings or incomplete

Provide your evaluation in this exact format:

SCORE: [number]/100

GRADE: [excellent/good/acceptable/needs-work/insufficient]

FEEDBACK:
[2-3 sentences on what was good]

IMPROVEMENTS:
[2-3 specific suggestions for improvement]

MISSING_POINTS:
-[bullet point of anything important missed]
-[another if applicable]`;

  const userPrompt = `Interview Question: ${prompt}

Candidate's Answer: ${answer}

${normalizedMeta.context ? `Additional Context: ${normalizedMeta.context}` : ''}

Please evaluate this answer.`;

  const promptPackage = {
    model: 'deepseek/deepseek-v3.2',
    systemPrompt,
    userPrompt,
    context: normalizedMeta.context || '',
    referenceContext,
    questionIntent: normalizedMeta.questionIntent || '',
    category: normalizedMeta.category || '',
    rubric: normalizedMeta.rubric || [],
    followUp: normalizedMeta.followUp || '',
    expectedAnswer: normalizedMeta.expectedAnswer || null,
    goldAnswerSources: normalizedMeta.goldAnswerSources || [],
    question: prompt,
    answer
  };

  try {
    const response = await makeOpenRouterRequest(systemPrompt, userPrompt);
    return {
      ...parseEvaluationResponse(response),
      promptPackage
    };
  } catch (error) {
    console.error('OpenRouter API error:', error.message);
    return fallbackEvaluation(prompt, answer, promptPackage);
  }
}

function makeOpenRouterRequest(systemPrompt, userPrompt) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: 'deepseek/deepseek-v3.2',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const options = {
      hostname: 'openrouter.ai',
      port: 443,
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Morpho Interview Trainer',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 20000
    };

    console.log('Calling OpenRouter API...');

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log('OpenRouter status:', res.statusCode);
        
        if (res.statusCode !== 200) {
          console.error('OpenRouter error response:', data);
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          return;
        }

        try {
          const parsed = JSON.parse(data);
          if (parsed.choices && parsed.choices[0] && parsed.choices[0].message) {
            resolve(parsed.choices[0].message.content);
          } else {
            reject(new Error('Invalid response structure'));
          }
        } catch (err) {
          reject(new Error('Failed to parse response: ' + err.message));
        }
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error);
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(postData);
    req.end();
  });
}

function parseEvaluationResponse(response) {
  const scoreMatch = response.match(/SCORE:\s*(\d+)/i);
  const gradeMatch = response.match(/GRADE:\s*(\w+)/i);
  
  const score = scoreMatch ? parseInt(scoreMatch[1]) : 70;
  const grade = gradeMatch ? gradeMatch[1].toLowerCase() : 'acceptable';
  
  const feedbackMatch = response.match(/FEEDBACK:([\s\S]*?)(?=IMPROVEMENTS:|MISSING_POINTS:|$)/i);
  const improvementsMatch = response.match(/IMPROVEMENTS:([\s\S]*?)(?=MISSING_POINTS:|$)/i);
  const missingMatch = response.match(/MISSING_POINTS:([\s\S]*?)$/i);
  
  const feedback = feedbackMatch ? feedbackMatch[1].trim() : 'Good attempt.';
  const improvements = improvementsMatch ? improvementsMatch[1].trim() : '';
  
  let missedPoints = [];
  if (missingMatch) {
    missedPoints = missingMatch[1]
      .split('\n')
      .map(line => line.replace(/^-\s*/, '').trim())
      .filter(line => line.length > 0 && !line.toLowerCase().includes('missing_points'));
  }

  return {
    score,
    grade,
    feedback,
    improvements,
    missedPoints,
    rawResponse: response,
    source: 'openrouter'
  };
}

function fallbackEvaluation(prompt, answer, promptPackage = null) {
  const keywords = ['morpho', 'lending', 'isolated', 'blue', 'vaults', 'lltv', 'health factor', 'liquidation'];
  const answerLower = answer.toLowerCase();
  
  let matches = 0;
  keywords.forEach(kw => {
    if (answerLower.includes(kw)) matches++;
  });
  
  const score = Math.min(60 + (matches * 8), 85);
  
  return {
    score,
    grade: score >= 80 ? 'good' : score >= 70 ? 'acceptable' : 'needs-work',
    feedback: 'Basic keyword analysis performed. For detailed AI feedback, check your network connection.',
    improvements: 'Ensure you mention: Morpho Blue, isolated markets, MetaMorpho vaults, LLTV, and Health Factor calculations.',
    missedPoints: ['Detailed AI evaluation unavailable - network error'],
    source: 'fallback',
    promptPackage
  };
}

module.exports = { evaluateInterviewAnswer };
