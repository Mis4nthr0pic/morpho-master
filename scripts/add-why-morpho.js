/**
 * Add "Why Morpho?" content throughout the training system
 * Based on job posting, Glassdoor insights, and company values
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/morpho_trainer.db');

// Why Morpho - comprehensive content
const WHY_MORPHO_MODULE = {
  id: 'why-morpho',
  title: 'Why Morpho?',
  category: 'career',
  difficulty: 1,
  lessons: [
    {
      title: 'Why I Want to Work at Morpho',
      content: `## Why Morpho? Crafting Your Answer

This is THE question. You'll hear it in every interview. Here's how to answer with authenticity and impact.

### The Three Pillars of Your Answer

#### 1. The Mission: Building the Future of Finance

**Why it matters:**
Morpho isn't just another DeFi protocol. It's building infrastructure for a new internet-native financial system.

**Key points to hit:**
- Morpho has $10B+ in deposits - it's working at scale
- It's establishing itself as the new standard for DeFi lending
- The vision goes beyond DeFi to a complete financial system rebuild
- I want to be part of building that future, not just observing it

**Your framing:**
"I've been watching DeFi evolve, and Morpho stands out as the protocol that's actually solving the hard problems. While others iterate on the same pooled lending model, Morpho reimagined the architecture with isolated markets. I want to contribute to that kind of innovation."

#### 2. The Role: Perfect Match for Your Skills

**From the job posting:**
- Technical guidance to crypto-native partners
- Building proof-of-concepts and code snippets
- Providing hands-on support through Telegram/Slack
- Improving documentation based on feedback

**Why this resonates with you:**
- You enjoy the intersection of technical depth and human connection
- You love unblocking people and seeing them succeed
- You're excited by fast-paced, high-impact work
- You want to be the person partners trust

**Your framing:**
"This role sits at the perfect intersection of what I love: deep technical work with smart contracts, but also direct impact on partners building real products. I'm not just writing code—I'm enabling an ecosystem. The Integration Engineer role is the bridge between Morpho's technology and the builders using it, and that's exactly where I want to be."

#### 3. The Team and Culture

**What Glassdoor and public info reveals:**
- Top-tier backing: a16z, Coinbase Ventures, Pantera, Ribbit Capital ($70M raised)
- Remote-first culture with smart, driven people
- High autonomy and ownership
- Technical excellence is valued

**Why this matters to you:**
- You want to work with the best in the industry
- You thrive in high-autonomy environments
- You value technical rigor and thoughtful design
- Remote work gives you focus and flexibility

**Your framing:**
"The quality of Morpho's backers and the caliber of the team tells me this is a place where I'll be challenged and grow. I want to work somewhere that technical excellence isn't just encouraged—it's the baseline. The remote-first culture also shows trust in employees, which is something I value."

### The Complete Answer Template

**Structure (2-3 minutes):**

1. **Hook** (10 seconds): "Morpho represents what I believe the future of finance should look like."

2. **The Mission** (45 seconds): 
   - Scale and traction ($10B+ deposits)
   - Technical innovation (isolated markets, higher LTVs)
   - Long-term vision (cornerstone of internet-native finance)
   - Your desire to contribute to meaningful innovation

3. **The Role Fit** (60 seconds):
   - Specific aspects of the Integration Engineer role
   - How it matches your skills and interests
   - Examples: "I love that this role combines..."
   - The impact: helping partners ship faster

4. **Why You Specifically** (30 seconds):
   - Your background in integrations/DevRel
   - Your technical depth in DeFi
   - Your communication skills
   - Examples of similar work you've done

5. **Closing** (10 seconds): "That's why I'm excited about Morpho specifically—not just any DeFi role, but this one, at this company, right now."

### Variations for Different Interviewers

**With a Technical Interviewer:**
Emphasize the technical architecture, the challenge of integrating with various partners, and the opportunity to work on cutting-edge DeFi primitives.

**With a Business/BD Interviewer:**
Emphasize the partner-facing aspect, your ability to translate technical concepts, and how you help close deals by unblocking technical concerns.

**With a Founder/Leadership:**
Emphasize the mission, the scale of impact, and your long-term interest in the space. Show you've done your homework on Morpho's vision.

### Questions to Prepare

**They might ask:**
- "What do you know about Morpho?" → Deep technical + business understanding
- "Why Integration Engineer specifically?" → Connect to your career path
- "Why leave your current role?" → Growth, mission alignment, specific interest in Morpho
- "Where do you see yourself in 2 years?" → Growing with Morpho, deeper expertise

### Red Flags to Avoid

❌ "I just want to work in DeFi" → Too generic
❌ "The salary is good" → Even if true, don't lead with this
❌ "I heard it's a good company" → Shows lack of research
❌ "I want to get rich on tokens" → Wrong motivation

✅ Show genuine interest in the technology
✅ Demonstrate knowledge of Morpho's unique approach
✅ Connect your personal values to Morpho's mission
✅ Be specific about why THIS role at THIS company

### Practice Your Answer

Record yourself. Time it. Refine it.

Your answer should feel:
- Conversational, not rehearsed
- Enthusiastic but genuine
- Specific to Morpho, not generic DeFi
- Balanced between technical and mission

Remember: They want to hire people who WANT to be here. Show that desire authentically.`,
      estimated_minutes: 25
    },
    {
      title: 'Company Research: Morpho Deep Dive',
      content: `## Morpho Research for Interviews

### Company Fundamentals

**Founded:** 2021
**Headquarters:** Paris, France (Morpho Association)
**Funding:** $70M total raised
**TVL:** $10B+ (as of job posting)
**Team Size:** ~50-100 (estimated)
**Website:** morpho.org

### Key Investors (Show You've Done Research)

**Tier 1 Backers:**
- a16z crypto (Andreessen Horowitz)
- Ribbit Capital
- Coinbase Ventures
- Variant
- Brevan Howard
- Pantera Capital
- Blocktower

**Why mention this:** Shows you know Morpho is well-funded and backed by the best. These aren't just names—they're validators of the vision.

### Products and Technology

**Morpho Blue (Core Protocol):**
- Immutable lending primitive
- Isolated markets (key differentiator)
- Permissionless market creation
- IRM-agnostic (currently AdaptiveCurveIRM)

**MetaMorpho (Vault Layer):**
- ERC-4626 vaults
- Professional curation
- V2 adds universal adapters

**Key Technical Innovations:**
1. **Isolation**: Risk containment per market
2. **Higher LTVs**: No rehypothecation enables better capital efficiency
3. **Permissionless**: Anyone can create markets
4. **Immutability**: No admin keys, no upgrades

### Ecosystem and Integrations

**Types of Integrators:**
- Wallets (for native yield)
- Yield aggregators
- Trading platforms (for leverage)
- DeFi protocols (for composability)

**Competitive Position:**
- Often compared to Aave and Compound
- Differentiated by isolation model
- Complementary rather than competitive (many use both)

### Recent Developments (Check Before Interview)

Before your interview, check:
- Morpho's Twitter/X (@MorphoLabs)
- Recent blog posts on morpho.org/blog
- Governance proposals
- New chain deployments
- Major partnerships announced

### Culture Signals

**From Job Posting:**
- "Accelerate Morpho's expansion" → High growth, high impact
- "Provide technical guidance" → Trusted expert role
- "Bridge timezone gaps" → Global team, async communication
- "Shadow calls... start answering questions" → Learn by doing

**What This Tells Us:**
- Fast-paced environment
- Autonomy and trust
- Direct impact on company success
- Technical excellence expected
- Remote-first, written communication

### Questions to Ask Them

**About the Role:**
- "What does success look like in the first 90 days?"
- "What's the most challenging part of this role?"
- "How do you measure impact for Integration Engineers?"

**About the Team:**
- "How is the Integration team structured?"
- "What's the culture like on the team?"
- "How do you handle knowledge sharing?"

**About Morpho:**
- "What's the most exciting thing on the roadmap?"
- "How do you see the competitive landscape evolving?"
- "What's the biggest challenge Morpho faces right now?"

### Your Research Checklist

Before the interview, you should know:
- [ ] Current TVL and key metrics
- [ ] How Morpho Blue works (isolated markets)
- [ ] How MetaMorpho vaults work
- [ ] Recent news/developments
- [ ] Key competitors and differentiators
- [ ] The investor list
- [ ] Morpho's vision/mission
- [ ] Specifics of the Integration Engineer role

### Authentic Enthusiasm

The best way to show you want to work at Morpho:

1. **Use the product**: Actually interact with app.morpho.org
2. **Read the docs**: Go through docs.morpho.org
3. **Follow the discussion**: Check governance forums, Twitter
4. **Understand the tech**: Be able to explain isolated markets
5. **Have opinions**: What would you improve? What excites you?

Your enthusiasm should come from genuine interest, not forced excitement. Do the work to build that interest authentically.`,
      estimated_minutes: 20
    }
  ]
};

// Additional quiz questions about Why Morpho
const WHY_MORPHO_QUIZZES = [
  {
    question_id: 'qwm001',
    question: 'What is Morpho\'s total value locked (TVL) according to the job posting?',
    options: JSON.stringify(['$1 billion', '$5 billion', '$10 billion+', '$50 billion']),
    correct_answer: 2,
    explanation: 'The job posting states Morpho has "over $10 billion in deposits on the network."',
    difficulty: 1,
    category: 'career',
    tags: 'morpho,tvl,company-knowledge'
  },
  {
    question_id: 'qwm002',
    question: 'Which of these is NOT mentioned as an investor in Morpho?',
    options: JSON.stringify(['a16z crypto', 'Coinbase Ventures', 'Sequoia Capital', 'Pantera']),
    correct_answer: 2,
    explanation: 'The job posting lists Ribbit Capital, a16z crypto, Coinbase Ventures, Variant, Brevan Howard, Pantera, Blocktower, and others. Sequoia is not mentioned.',
    difficulty: 1,
    category: 'career',
    tags: 'investors,funding,company-knowledge'
  },
  {
    question_id: 'qwm003',
    question: 'What is the key technical differentiator of Morpho compared to Aave/Compound?',
    options: JSON.stringify([
      'Lower fees',
      'Isolated markets instead of shared pools',
      'More chains supported',
      'Better mobile app'
    ]),
    correct_answer: 1,
    explanation: 'Morpho\'s core innovation is isolated markets—each market operates independently, so risk in one doesn\'t affect others.',
    difficulty: 1,
    category: 'career',
    tags: 'differentiation,competition,protocol'
  },
  {
    question_id: 'qwm004',
    question: 'In the Integration Engineer role, what is expected by Month 4-6?',
    options: JSON.stringify([
      'Complete training and shadowing',
      'Fully autonomous on technical questions',
      'Managing a team of engineers',
      'Speaking at conferences'
    ]),
    correct_answer: 1,
    explanation: 'According to the job posting, by Month 4-6 you should be "fully autonomous on technical questions from partners and no longer need to pull in other integration engineers for routine support."',
    difficulty: 2,
    category: 'career',
    tags: 'role-expectations,success-metrics'
  },
  {
    question_id: 'qwm005',
    question: 'What is the mission of the Integration Engineer role according to the job posting?',
    options: JSON.stringify([
      'Write smart contracts',
      'Accelerate Morpho\'s expansion across the Americas by providing technical guidance',
      'Manage the Discord community',
      'Audit partner code'
    ]),
    correct_answer: 1,
    explanation: 'The job posting states: "The mission of this role is to accelerate Morpho\'s expansion across the Americas by providing technical guidance and support to crypto-native partners and integrators."',
    difficulty: 1,
    category: 'career',
    tags: 'mission,role-purpose,job-posting'
  }
];

// Interview scenario specifically for "Why Morpho"
const WHY_MORPHO_SCENARIO = {
  scenario_id: 'int_why_morpho',
  type: 'motivational',
  title: 'Why Do You Want to Work at Morpho?',
  description: 'This is the most important question. The interviewer asks directly: "Why Morpho? You could work at any DeFi protocol. Why this one?"',
  questions: JSON.stringify([
    'What specifically attracts you to Morpho?',
    'How does this role fit your career path?',
    'What do you know about Morpho\'s technology and traction?',
    'Why now? What excites you about this moment for Morpho?'
  ]),
  difficulty: 2,
  category: 'career'
};

async function addWhyMorpho() {
  const db = new sqlite3.Database(DB_PATH);
  
  console.log('🎯 Adding "Why Morpho?" content...\n');
  
  // Add Why Morpho module lessons
  console.log('📚 Adding Why Morpho lessons...');
  for (let i = 0; i < WHY_MORPHO_MODULE.lessons.length; i++) {
    const lesson = WHY_MORPHO_MODULE.lessons[i];
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT OR REPLACE INTO lessons (module_id, lesson_order, title, content, difficulty, category, estimated_minutes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [WHY_MORPHO_MODULE.id, i, lesson.title, lesson.content, WHY_MORPHO_MODULE.difficulty, WHY_MORPHO_MODULE.category, lesson.estimated_minutes],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }
  console.log(`✅ Added ${WHY_MORPHO_MODULE.lessons.length} "Why Morpho" lessons\n`);
  
  // Add Why Morpho quiz questions
  console.log('❓ Adding Why Morpho quiz questions...');
  for (const q of WHY_MORPHO_QUIZZES) {
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT OR REPLACE INTO quiz_questions (question_id, question, options, correct_answer, explanation, difficulty, category, tags)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [q.question_id, q.question, q.options, q.correct_answer, q.explanation, q.difficulty, q.category, q.tags],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }
  console.log(`✅ Added ${WHY_MORPHO_QUIZZES.length} "Why Morpho" quiz questions\n`);
  
  // Add Why Morpho interview scenario
  console.log('🎤 Adding "Why Morpho?" interview scenario...');
  await new Promise((resolve, reject) => {
    db.run(
      `INSERT OR REPLACE INTO interview_scenarios (scenario_id, type, title, description, questions, difficulty, category)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [WHY_MORPHO_SCENARIO.scenario_id, WHY_MORPHO_SCENARIO.type, WHY_MORPHO_SCENARIO.title, 
       WHY_MORPHO_SCENARIO.description, WHY_MORPHO_SCENARIO.questions, WHY_MORPHO_SCENARIO.difficulty, 
       WHY_MORPHO_SCENARIO.category],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
  console.log('✅ Added "Why Morpho?" interview scenario\n');
  
  // Repeat "Why Morpho" questions in different formats throughout quizzes
  console.log('🔄 Adding additional "Why Morpho" variations...');
  const variations = [
    {
      question_id: 'qwm006',
      question: 'In your first 30 days, what is expected according to the job posting?',
      options: JSON.stringify([
        'Fully autonomous partner support',
        'Immerse in codebase, shadow calls, start answering questions',
        'Launch a new product feature',
        'Manage the integration team'
      ]),
      correct_answer: 1,
      explanation: 'The job posting states: "You\'ll immerse yourself in Morpho\'s codebase, products, and documentation. You\'ll shadow calls with the Growth team, meet key integration partners, and start answering technical questions."',
      difficulty: 1,
      category: 'career',
      tags: 'onboarding,first-30-days'
    },
    {
      question_id: 'qwm007',
      question: 'What timezone is the Integration Engineer (Americas) role focused on?',
      options: JSON.stringify(['GMT +0', 'GMT -4/-5', 'GMT +8', 'GMT +9']),
      correct_answer: 1,
      explanation: 'The job posting specifies "Remote Americas (GMT -4/-5)" as the location.',
      difficulty: 1,
      category: 'career',
      tags: 'location,timezone,remote'
    }
  ];
  
  for (const q of variations) {
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT OR REPLACE INTO quiz_questions (question_id, question, options, correct_answer, explanation, difficulty, category, tags)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [q.question_id, q.question, q.options, q.correct_answer, q.explanation, q.difficulty, q.category, q.tags],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }
  
  db.close();
  console.log('🎉 "Why Morpho?" content added successfully!');
  console.log('\n💡 This question will appear in:');
  console.log('   - Dedicated "Why Morpho?" lesson module');
  console.log('   - Multiple quiz questions');
  console.log('   - Interview simulation scenarios');
  console.log('   - Throughout the training system');
}

addWhyMorpho().catch(console.error);
