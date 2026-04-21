const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function normalizeChunk(text = '') {
  return String(text)
    .replace(/\s+/g, ' ')
    .trim();
}

function extractMetadata(chunk) {
  const lines = String(chunk).split('\n').map((line) => line.trim()).filter(Boolean);
  const firstLine = lines[0] || '';
  const titleMatch = firstLine.match(/^#+\s+(.*)$/) || firstLine.match(/^\*\*(.*?)\*\*$/);
  const linkMatch = String(chunk).match(/\((https?:\/\/[^)\s]+)\)/);

  return {
    title: titleMatch ? titleMatch[1] : '',
    url: linkMatch ? linkMatch[1] : ''
  };
}

function inferSection(sourceFile, chunk) {
  const lower = chunk.toLowerCase();
  if (lower.includes('## learn') || lower.includes('/learn/')) return 'Learn';
  if (lower.includes('## tools') || lower.includes('/tools/')) return 'Tools';
  if (lower.includes('## build') || lower.includes('/build/')) return 'Build';
  if (lower.includes('## curate') || lower.includes('/curate/')) return 'Curate';
  if (lower.includes('## get started') || lower.includes('/get-started/')) return 'Get Started';
  if (sourceFile.includes('complementary')) return 'Complementary';
  return 'General';
}

function deriveKeywords(text) {
  const lower = text.toLowerCase();
  const keywords = [];
  const candidates = [
    'graphql complexity',
    'morpho api',
    'health factor',
    'liquidation',
    'lltv',
    'vault v2',
    'morpho market v1',
    'oracle',
    '1e36',
    'bundler3',
    'curator',
    'allocator',
    'sentinel',
    'owner',
    'adaptivecurveirm',
    'rewards',
    'merkl',
    'public allocator',
    'timelock'
  ];

  candidates.forEach((term) => {
    if (lower.includes(term)) keywords.push(term);
  });

  return Array.from(new Set(keywords));
}

function getDocSourceFiles() {
  return [
    path.join(__dirname, '../../../morpho.txt'),
    path.join(__dirname, '../../../docs/morpho-source.txt'),
    path.join(__dirname, '../../../morpho-complementary.txt')
  ];
}

function deriveDocSnippets() {
  const snippets = [];
  const seenHashes = new Set();

  getDocSourceFiles().forEach((filePath) => {
    if (!fs.existsSync(filePath)) return;
    const sourceFile = path.basename(filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    const chunks = content
      .split(/\n\s*\n+/)
      .map((chunk) => chunk.trim())
      .filter((chunk) => chunk.length >= 90);

    chunks.forEach((rawChunk, index) => {
      const normalized = normalizeChunk(rawChunk);
      const metadata = extractMetadata(rawChunk);
      const contentHash = crypto.createHash('sha1').update(normalized).digest('hex');
      if (seenHashes.has(contentHash)) return;
      seenHashes.add(contentHash);
      snippets.push({
        sourceFile,
        section: inferSection(sourceFile, rawChunk),
        title: metadata.title || null,
        url: metadata.url || null,
        content: normalized,
        contentHash,
        keywords: deriveKeywords(normalized),
        sortOrder: index
      });
    });
  });

  return snippets;
}

function seedDocSnippets(db) {
  const insert = db.prepare(`
    INSERT INTO doc_snippets (
      source_file, section, title, url, content, content_hash, keywords, sort_order
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const snippets = deriveDocSnippets();
  snippets.forEach((snippet) => {
    insert.run(
      snippet.sourceFile,
      snippet.section,
      snippet.title,
      snippet.url,
      snippet.content,
      snippet.contentHash,
      JSON.stringify(snippet.keywords),
      snippet.sortOrder
    );
  });

  console.log(`  ✓ Seeded ${snippets.length} doc snippets`);
}

function buildDocTerms({ lessonTitle, question, docsRefs = [] }) {
  const docsText = docsRefs.map((ref) => `${ref.title || ''} ${ref.url || ''}`).join(' ');
  const raw = `${lessonTitle} ${question.q || question.question || ''} ${question.explanation || ''} ${question.interviewTip || question.interview_tip || ''} ${docsText}`.toLowerCase();
  const forcedTerms = [];

  if (/graphql|complexity|api/.test(raw)) forcedTerms.push('graphql complexity', 'morpho api', 'trim the selection set', 'split queries');
  if (/health factor|hf|ltv|liquidation/.test(raw)) forcedTerms.push('health factor', 'liquidation', 'ltv', 'lltv');
  if (/market v1|morpho blue|isolated/.test(raw)) forcedTerms.push('morpho market v1', 'isolated lending');
  if (/vault v2|curator|allocator|sentinel|owner/.test(raw)) forcedTerms.push('vault v2', 'curator', 'allocator', 'sentinel', 'owner');
  if (/oracle|1e36|chainlink/.test(raw)) forcedTerms.push('oracle', '1e36', 'chainlink');
  if (/bundler3|atomic/.test(raw)) forcedTerms.push('bundler3', 'atomic');

  const tokenTerms = raw
    .replace(/[^a-z0-9\s/-]/g, ' ')
    .split(/\s+/)
    .filter((term) => term.length >= 4)
    .filter((term) => !['which', 'what', 'when', 'where', 'lesson', 'question', 'correct', 'explanation', 'partner', 'module'].includes(term));

  return Array.from(new Set([...forcedTerms, ...tokenTerms]));
}

function countMatches(text, pattern) {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}

function scoreDocSnippet(row, terms, docsRefs = []) {
  const lower = row.content.toLowerCase();
  let score = terms.reduce((sum, term) => {
    if (!lower.includes(term)) return sum;
    return sum + (term.includes(' ') ? 8 : 2);
  }, 0);

  const titleLower = (row.title || '').toLowerCase();
  const urlLower = (row.url || '').toLowerCase();
  let refMatched = false;

  docsRefs.forEach((ref) => {
    const refTitle = (ref.title || '').toLowerCase();
    const refUrl = (ref.url || '').toLowerCase();
    if (refTitle && titleLower && titleLower.includes(refTitle)) {
      score += 18;
      refMatched = true;
    }
    if (refTitle && lower.includes(refTitle)) {
      score += 10;
      refMatched = true;
    }
    if (refUrl && urlLower && urlLower.includes(refUrl)) {
      score += 22;
      refMatched = true;
    }
  });

  const markdownLinkCount = countMatches(row.content, /\[[^\]]+\]\((https?:\/\/[^)\s]+|\/[^)\s]+)\)/g);
  const bulletCount = countMatches(row.content, /(?:^|\s)-\s/g);
  const sentenceCount = countMatches(row.content, /[.!?](?:\s|$)/g);

  if (/^##\s+tools\b/i.test(row.content) || /^##\s+learn\b/i.test(row.content) || /^##\s+build\b/i.test(row.content)) {
    score -= 18;
  }
  if (markdownLinkCount >= 4 && sentenceCount <= 2) {
    score -= 22;
  }
  if (bulletCount >= 4 && sentenceCount <= 2) {
    score -= 16;
  }
  if (/developer hub|comprehensive api documentation|practical integration tutorials|select the query you are interested in/i.test(lower)) {
    score -= 10;
  }
  if (/how to query|best practices|maximum complexity|rate limiting|health factor =|liquidation price =|a complexity score is associated/i.test(lower)) {
    score += 12;
  }

  return { score, refMatched };
}

function isLowSignalDocChunk(row) {
  const text = row.content.trim();
  const lower = text.toLowerCase();
  const markdownLinkCount = countMatches(text, /\[[^\]]+\]\((https?:\/\/[^)\s]+|\/[^)\s]+)\)/g);
  const bulletCount = countMatches(text, /(?:^|\s)-\s/g);
  const sentenceCount = countMatches(text, /[.!?](?:\s|$)/g);
  const headingCount = countMatches(text, /#{1,6}\s+/g);
  const placeholderAddressCount = countMatches(text, /\b[a-z_]+=0x\.\.\.|\b0x\.\.\./gi);

  if (/^##\s+(tools|learn|build|curate|get started)\b/i.test(text)) return true;
  if (/^-\s+\*\*morpho api \(recommended\)\*\*/i.test(text)) return true;
  if (/comprehensive api documentation|practical integration tutorials|select the query you are interested in|developer hub for morpho tools/i.test(lower)) return true;
  if (/^#\s+deployed contract addresses\b/i.test(text)) return true;
  if (/approve the \[morpho contract\]/i.test(lower) && placeholderAddressCount > 0) return true;
  if (headingCount >= 3 && sentenceCount <= 1) return true;
  if (placeholderAddressCount >= 1 && sentenceCount <= 1) return true;
  if (markdownLinkCount >= 4 && sentenceCount <= 1) return true;
  if (bulletCount >= 4 && sentenceCount <= 1) return true;
  return false;
}

function findRelevantDocSnippets(db, { lessonTitle, question, docsRefs = [] }, limit = 2) {
  const terms = buildDocTerms({ lessonTitle, question, docsRefs });
  const rows = db.prepare(`
    SELECT source_file, section, title, url, content, keywords
    FROM doc_snippets
    ORDER BY sort_order ASC
  `).all();

  return rows
    .map((row) => {
      const { score, refMatched } = scoreDocSnippet(row, terms, docsRefs);
      return { ...row, score, refMatched };
    })
    .filter((row) => row.score >= 10)
    .filter((row) => !isLowSignalDocChunk(row))
    .filter((row) => (docsRefs.length ? row.refMatched : true))
    .sort((a, b) => b.score - a.score || a.content.length - b.content.length)
    .filter((row, index, array) =>
      array.findIndex((candidate) => candidate.content.slice(0, 180) === row.content.slice(0, 180)) === index
    )
    .slice(0, limit)
    .map((row) => ({
      sourceFile: row.source_file,
      section: row.section,
      title: row.title,
      url: row.url,
      content: row.content.slice(0, 420)
    }));
}

module.exports = {
  seedDocSnippets,
  findRelevantDocSnippets
};
