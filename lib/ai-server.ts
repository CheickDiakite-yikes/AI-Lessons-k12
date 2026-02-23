import { GoogleGenAI } from '@google/genai';
import { normalizeLessonMarkdown } from '@/lib/lesson-markdown';

type LessonPlanParams = {
  planLength: string;
  gradeLevel: string;
  subject: string;
  duration: string;
  englishProficiency: string[];
  academicLevels: string[];
  autoGenerate: boolean;
  manualObjectives: string;
  worksheetTypes: string[];
  includeSlides: boolean;
  studentsContext?: string;
};

type SlideData = {
  title: string;
  bullets: string[];
};

type WorksheetBlock = {
  startLine: number;
  endLine: number;
  content: string;
};

function getLessonDayCount(planLength: string): number {
  const normalized = planLength.trim().toLowerCase();

  if (normalized === 'single lesson') return 1;
  if (normalized === 'one week') return 5;
  if (normalized === 'two weeks') return 10;
  if (normalized === 'three weeks') return 15;
  if (normalized === 'four weeks') return 20;
  if (normalized === 'one quarter') return 45;
  if (normalized === 'one semester') return 90;

  return 1;
}

function buildPedagogicalFramework(dayCount: number): string {
  if (dayCount <= 5) {
    const guidedEnd = Math.max(2, dayCount - 2);
    const guidedRange = guidedEnd > 2 ? `Days 2-${guidedEnd}` : 'Day 2';
    return `
- Pedagogical Arc (follow this progression across all ${dayCount} days):
  - Day 1: **Introduce & Activate** (Bloom's: Remember/Understand) — Activate prior knowledge, introduce core vocabulary, model key concepts. Heavy teacher modeling.
  - ${guidedRange}: **Guided Practice & Explore** (Bloom's: Understand/Apply) — Guided practice with gradual release. Students work with teacher support, then in pairs/groups. Each day builds directly on the prior day's skill.
  - Day ${dayCount - 1}: **Independent Practice & Apply** (Bloom's: Apply/Analyze) — Students demonstrate skills independently. Deepen understanding through application tasks.
  - Day ${dayCount}: **Assess & Reflect** (Bloom's: Evaluate/Create) — Summative check or culminating project. Students reflect on learning and show mastery.
- Spiral Review: Starting from Day 3, each day must open with a 3-5 minute warm-up that reviews a concept from a previous day.
- Vocabulary Threading: Introduce 3-5 new terms on Day 1, add 2-3 new terms each subsequent day, and review prior terms daily. By the final day, students should have a cumulative word wall of all unit vocabulary.`;
  }

  if (dayCount <= 20) {
    const weeksCount = Math.ceil(dayCount / 5);
    const phases: string[] = [];
    for (let w = 1; w <= weeksCount; w++) {
      const startDay = (w - 1) * 5 + 1;
      const endDay = Math.min(w * 5, dayCount);
      if (w === 1) {
        phases.push(`  - **Phase ${w} (Days ${startDay}-${endDay}): Foundation & Introduction** — Introduce core concepts, build vocabulary, activate prior knowledge. Bloom's focus: Remember/Understand.`);
      } else if (w === weeksCount) {
        phases.push(`  - **Phase ${w} (Days ${startDay}-${endDay}): Mastery & Assessment** — Independent application, culminating project or assessment, reflection. Bloom's focus: Evaluate/Create.`);
      } else if (w <= Math.ceil(weeksCount / 2)) {
        phases.push(`  - **Phase ${w} (Days ${startDay}-${endDay}): Guided Practice & Skill Building** — Deepen understanding through guided practice, collaborative work, and scaffolded tasks. Bloom's focus: Understand/Apply.`);
      } else {
        phases.push(`  - **Phase ${w} (Days ${startDay}-${endDay}): Application & Analysis** — Apply skills to new contexts, analyze patterns, work more independently. Bloom's focus: Apply/Analyze.`);
      }
    }
    return `
- Pedagogical Phasing (organize the ${dayCount} days into ${weeksCount} weekly phases):
${phases.join('\n')}
- Within Each Phase:
  - Day 1 of each phase: Introduce new sub-topic or skill. Connect to prior phase.
  - Days 2-3: Guided and collaborative practice with gradual release of responsibility.
  - Day 4: Independent practice or application task.
  - Day 5: Review/formative assessment day — quick quiz, peer assessment, or portfolio check.
- Spiral Review: Every day must begin with a **Connection to Prior Learning** warm-up (3-5 min) that references a concept from a previous day or phase. Every 5th day is a dedicated review and formative check day.
- Vocabulary Threading: Introduce 4-6 key terms per phase. Each day's warm-up should include 1-2 vocabulary review items. Maintain a cumulative vocabulary list that grows across phases.
- Skill Progression: Each day's objective must explicitly build on the prior day. Use language like "Building on yesterday's work with X, today students will Y."`;
  }

  const unitCount = dayCount <= 45 ? Math.ceil(dayCount / 10) : Math.ceil(dayCount / 15);
  const daysPerUnit = Math.ceil(dayCount / unitCount);
  const units: string[] = [];
  for (let u = 1; u <= unitCount; u++) {
    const startDay = (u - 1) * daysPerUnit + 1;
    const endDay = Math.min(u * daysPerUnit, dayCount);
    units.push(`  - **Unit ${u} (Days ${startDay}-${endDay}):** [Thematic Sub-Unit Title] — Each unit follows its own introduce → practice → apply → assess arc.`);
  }
  const guidedStart = 3;
  const guidedEnd = Math.max(guidedStart, Math.floor(daysPerUnit * 0.6));
  const applyStart = guidedEnd + 1;
  const applyEnd = Math.max(applyStart, daysPerUnit - 1);
  return `
- Long-Range Curriculum Structure (organize the ${dayCount} days into ${unitCount} thematic sub-units):
${units.join('\n')}
- Each Sub-Unit Must Include (day numbers are relative within the sub-unit):
  - Days 1-2: Introduction and foundational skill building (Bloom's: Remember/Understand).
  - Days ${guidedStart}-${guidedEnd}: Guided practice, collaborative tasks, deepening understanding (Bloom's: Understand/Apply).
  - Days ${applyStart}-${applyEnd}: Independent application and analysis (Bloom's: Apply/Analyze).
  - Final day of each sub-unit: Assessment day — formative or summative check, student reflection, and preview of next unit.
- Cross-Unit Progression:
  - Each sub-unit builds on the skills and knowledge from the previous one.
  - The first day of each new sub-unit must include a **Bridge Activity** connecting the previous unit's content to the new topic.
  - Final sub-unit should be a culminating review and mastery demonstration.
- Spiral Review: Every 5th day must include a structured review activity covering concepts from earlier days/units. Use varied review formats (games, partner quizzes, sorting activities, quick writes).
- Vocabulary Threading: Introduce 5-8 key terms per sub-unit. Maintain a cumulative vocabulary tracker. Each day's warm-up must revisit 2-3 prior vocabulary words. By the end, students should have mastered all vocabulary across all sub-units.
- Skill Progression: Follow Bloom's taxonomy across the full plan — early units emphasize remembering and understanding, middle units focus on applying and analyzing, final units push toward evaluating and creating.
- Assessment Rhythm: Quick formative checks every 3-5 days. Sub-unit summative assessment at the end of each sub-unit. Cumulative mid-point assessment halfway through the plan.`;
}

function buildScopeSequenceInstructions(dayCount: number): string {
  if (dayCount <= 5) {
    return `- Scope and Sequence:
  - Provide exactly ${dayCount} numbered entries (Day 1 through Day ${dayCount}).
  - For each entry include: **Bloom's Level** (Remember/Understand/Apply/Analyze/Evaluate/Create), **focus skill**, **daily objective**, **how it builds on the previous day**, and **assessment idea**.
  - Show a clear progression from introduction (Day 1) through mastery/assessment (Day ${dayCount}).`;
  }

  if (dayCount <= 20) {
    const weeksCount = Math.ceil(dayCount / 5);
    return `- Scope and Sequence:
  - Organize into ${weeksCount} weekly phases. For each phase, provide a **Phase Title** and **Phase Goal**.
  - Within each phase, list each day with: **Bloom's Level**, **focus skill**, **daily objective**, **connection to prior day**, and **assessment idea**.
  - Mark every 5th day as a **Review & Check** day.
  - Show clear skill escalation across phases — each phase should tackle higher-order thinking than the last.`;
  }

  const unitCount = dayCount <= 45 ? Math.ceil(dayCount / 10) : Math.ceil(dayCount / 15);
  return `- Scope and Sequence:
  - Organize into ${unitCount} thematic sub-units. For each sub-unit, provide a **Unit Title**, **Unit Essential Question**, and **Unit Goal**.
  - Within each sub-unit, list each day with: **Bloom's Level**, **focus skill**, **daily objective**, **connection to prior day**, and **assessment type**.
  - Mark assessment days, review days, and bridge/transition days explicitly.
  - Show how sub-units connect and build toward a culminating outcome by the final days.`;
}

function getGeminiApiKey(): string {
  const key =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!key) {
    throw new Error('Gemini API key is not configured on the server.');
  }
  return key;
}

const DEFAULT_LESSON_MODEL_CANDIDATES = [
  'gemini-3.0-flash',
  'gemini-3-flash-preview',
  'gemini-2.5-flash',
];

function parseModelList(value: string): string[] {
  return Array.from(
    new Set(
      value
        .split(',')
        .map((model) => model.trim())
        .filter(Boolean),
    ),
  );
}

function getLessonModelCandidates(): string[] {
  const configured =
    process.env.GEMINI_LESSON_MODEL || process.env.GEMINI_TEXT_MODEL || process.env.GEMINI_MODEL;

  if (configured && configured.trim()) {
    const parsed = parseModelList(configured);
    if (parsed.length > 0) return parsed;
  }

  return DEFAULT_LESSON_MODEL_CANDIDATES;
}

function shouldRetryWithDifferentModel(error: unknown): boolean {
  const message = error instanceof Error ? error.message.toLowerCase() : '';
  if (!message) return false;

  return (
    message.includes('model') ||
    message.includes('not found') ||
    message.includes('unsupported') ||
    message.includes('permission') ||
    message.includes('access denied') ||
    message.includes('403') ||
    message.includes('404')
  );
}

const WORKSHEET_PLACEHOLDER_PATTERNS: RegExp[] = [
  /\((?:\s)*(?:picture|image|photo|illustration)\s+of[^)]*\)/i,
  /\b(?:picture|image|photo|illustration)\s+of\b/i,
  /\bsee\s+(?:the\s+)?(?:picture|image|diagram|chart|graphic)\b/i,
  /\buse\s+(?:the\s+)?(?:picture|image|diagram)\b/i,
  /\[insert[^\]]*(?:picture|image|diagram)[^\]]*\]/i,
];

function worksheetHasPlaceholder(content: string): boolean {
  return WORKSHEET_PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(content));
}

function extractWorksheetBlocks(markdown: string): WorksheetBlock[] {
  if (!markdown.trim()) return [];

  const lines = markdown.split('\n');
  const startIndexes: number[] = [];

  lines.forEach((line, index) => {
    if (/^###\s+Worksheet\b/i.test(line.trim())) {
      startIndexes.push(index);
    }
  });

  return startIndexes.map((startLine) => {
    let endLine = lines.length;
    for (let i = startLine + 1; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (/^#{1,3}\s+/.test(trimmed)) {
        endLine = i;
        break;
      }
    }

    return {
      startLine,
      endLine,
      content: lines.slice(startLine, endLine).join('\n').trim(),
    };
  });
}

function buildWorksheetRewritePrompt(blocks: WorksheetBlock[], params: LessonPlanParams): string {
  const serializedBlocks = blocks
    .map(
      (block, index) => `<WORKSHEET_BLOCK index="${index}">
${block.content}
</WORKSHEET_BLOCK>`,
    )
    .join('\n\n');

  return `
You are a K-6 worksheet quality editor.

Revise the worksheet blocks below so they are teacher-usable and fully printable.

Context:
- Grade Level: ${params.gradeLevel}
- Subject: ${params.subject}
- Plan Length: ${params.planLength}
- Lesson Duration: ${params.duration} minutes

Hard requirements:
- Return ONLY <WORKSHEET_BLOCK index="N">...</WORKSHEET_BLOCK> blocks for the same indices provided.
- Keep the heading line that starts each block (### Worksheet...) unchanged.
- Keep this exact subsection order in every block:
  - #### Student Copy
  - #### Answer Key
  - #### Differentiation Note
- Student Copy must include:
  - Name: ____________   Date: ____________
  - **Standard Alignment:** ...
  - **Directions:** ...
  - **Total Points:** ...
- Every question/task must be answerable using text only on paper.
- Do NOT reference pictures, images, diagrams, screenshots, or external visuals.
- Replace placeholders like "(Picture of Apple)" with concrete text-based prompts.
- Keep language age-appropriate but specific.
- Keep markdown clean (no tables, no HTML, no code fences).

Worksheet blocks to revise:
${serializedBlocks}
  `;
}

function parseRewrittenWorksheetBlocks(raw: string): Map<number, string> {
  const rewritten = new Map<number, string>();
  const regex = /<WORKSHEET_BLOCK\s+index="(\d+)">([\s\S]*?)<\/WORKSHEET_BLOCK>/g;
  let match;

  while ((match = regex.exec(raw)) !== null) {
    const index = Number(match[1]);
    const content = match[2]?.trim();
    if (Number.isFinite(index) && content) {
      rewritten.set(index, content);
    }
  }

  return rewritten;
}

function applyRewrittenWorksheetBlocks(
  originalMarkdown: string,
  worksheetBlocks: WorksheetBlock[],
  rewrittenByIndex: Map<number, string>,
): string {
  if (!worksheetBlocks.length || !rewrittenByIndex.size) return originalMarkdown;

  const lines = originalMarkdown.split('\n');
  const out: string[] = [];
  let cursor = 0;

  worksheetBlocks.forEach((block, index) => {
    out.push(...lines.slice(cursor, block.startLine));
    const rewritten = rewrittenByIndex.get(index);
    if (rewritten) {
      out.push(...rewritten.split('\n'));
    } else {
      out.push(...lines.slice(block.startLine, block.endLine));
    }
    cursor = block.endLine;
  });

  out.push(...lines.slice(cursor));
  return out.join('\n').trim();
}

export async function generateLessonPlanServer(params: LessonPlanParams) {
  const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });

  const hasRoster = Boolean(params.studentsContext);
  const includeWorksheets = params.worksheetTypes.length > 0;
  const includeSlides = params.includeSlides;
  const lessonDayCount = getLessonDayCount(params.planLength);
  const isMultiDayPlan = lessonDayCount > 1;

  const WORKSHEET_TYPES: Record<string, string> = {
    'Matching': `### Worksheet: Matching
Format rules:
- Create a "Terms" column with 6-8 numbered items on the left
- Create a "Definitions" column with the same number of lettered items (A, B, C, etc.) on the right, shuffled
- Students draw lines or write the matching letter next to each number
- Keep terms and definitions concise (one line each)`,

    'Fill in the Blank': `### Worksheet: Fill in the Blank
Format rules:
- Include a **Word Bank** at the top with all answer words listed
- Provide 8-10 numbered sentences
- Each sentence has exactly one blank shown as ____________ (12+ underscores)
- Blanks should test key vocabulary or concepts from the lesson
- Sentences should provide enough context clues for students`,

    'Multiple Choice': `### Worksheet: Multiple Choice
Format rules:
- Include 8-10 numbered questions
- Each question has exactly 4 options, each on its own line as A), B), C), D)
- Only one correct answer per question
- Include plausible distractors that test understanding, not tricks`,

    'Short Answer': `### Worksheet: Short Answer
Format rules:
- Include 5-6 numbered questions requiring 1-3 sentence responses
- After each question, include 3 blank response lines: ____________
- Questions should progress from recall to application/analysis
- Include point values in parentheses after each question`,

    'True or False': `### Worksheet: True or False
Format rules:
- Include 8-10 numbered statements
- After each statement, write: **True / False**
- For false statements, include a line: "If false, correct the statement: ____________"
- Mix true and false statements roughly evenly
- Statements should test key facts and common misconceptions`,

    'Sorting / Categorizing': `### Worksheet: Sorting / Categorizing
Format rules:
- Define 2-3 category labels clearly at the top as bold headings
- Provide 10-15 items in a mixed list below
- Students sort each item into the correct category by writing it under the heading
- Include blank lines under each category heading for student responses
- Items should clearly belong to one category`,
  };

  const selectedTypes = params.worksheetTypes;
  const worksheetGuidance = selectedTypes.length > 0
    ? (isMultiDayPlan
      ? `- Daily Worksheets:
    - Every day section must include one worksheet using this exact heading format:
      - ### Worksheet (Day X)
    - Rotate through these worksheet types across days: ${selectedTypes.join(', ')}
    - Each worksheet must include these exact subheadings in this order:
      - #### Student Copy
      - #### Answer Key
      - #### Differentiation Note
    - Student Copy must begin with: Name: ____________   Date: ____________
    - In Student Copy, include these bold labels before the questions:
      - **Standard Alignment:** [brief standard/skill focus]
      - **Directions:** [clear student-facing directions]
      - **Total Points:** [reasonable point total]
    - Student Copy should include 6-8 questions/tasks that directly practice that day's objective.
    - Every worksheet question/task must be fully text-based and answerable on paper without external visuals.
    - NEVER use placeholders such as "(Picture of ...)", "[Insert image]", "see image", or "use the picture".
    - Use school-ready, formal worksheet language and clear spacing between numbered items.
    - Keep question formatting simple and readable in plain markdown.
${selectedTypes.map(type => `    - When creating a "${type}" worksheet:\n${WORKSHEET_TYPES[type]?.split('\n').slice(1).map(l => `      ${l}`).join('\n') || ''}`).join('\n')}
`
      : `- Worksheets:
    - Generate exactly ${selectedTypes.length} worksheet(s) using these exact types in this order:
${selectedTypes.map((type, i) => `      - ${WORKSHEET_TYPES[type] || `### Worksheet ${i+1}: ${type}`}`).join('\n')}
    - For EVERY worksheet, include these exact subheadings in this order:
      - #### Student Copy
      - #### Answer Key
      - #### Differentiation Note
    - Student Copy must begin with: Name: ____________   Date: ____________
    - In Student Copy, include these bold labels before the questions:
      - **Standard Alignment:** [brief standard/skill focus]
      - **Directions:** [clear student-facing directions]
      - **Total Points:** [reasonable point total]
    - Every worksheet question/task must be fully text-based and answerable on paper without external visuals.
    - NEVER use placeholders such as "(Picture of ...)", "[Insert image]", "see image", or "use the picture".
    - Use school-ready, formal worksheet language and clear spacing between numbered items.
    - Keep question formatting simple and readable in plain markdown.
`)
    : '';
  const slidesGuidance = includeSlides
    ? `- Presentation Slides:
    - Create one unit-level presentation outline, even when this is a multi-day plan.
    - Provide a 6-8 slide outline.
    - For each slide, use this exact format:
      <SLIDE>
      Title: [Slide title here]
      Bullet: [First bullet point]
      Bullet: [Second bullet point]
      Bullet: [Third bullet point]
      </SLIDE>
    - Each slide must have a title and 3-5 bullet points.
    - Make slides engaging, age-appropriate for ${params.gradeLevel}, and visually descriptive.
    - Do NOT include visual prompts in the slides - just the title and bullet points.
`
    : '';
  const pedagogicalFramework = buildPedagogicalFramework(lessonDayCount);
  const scopeSequenceInstructions = buildScopeSequenceInstructions(lessonDayCount);

  const sectionStructure = isMultiDayPlan
    ? `
1) Use this exact major section structure:
- # [Creative Unit Title]
- ## Unit Overview
- ## Unit Goals and Standards
- ## Curriculum Progression Framework
- ## Scope and Sequence
- Then include exactly ${lessonDayCount} day sections, each with this exact day heading pattern:
  - ## Day X: [Daily Lesson Title]
  - X must be consecutive from 1 to ${lessonDayCount}.
${includeWorksheets || includeSlides ? '- ## Optional Generated Add-ons' : ''}

2) Section details:
- Unit Overview:
  - Grade Level and Subject
  - Duration per lesson
  - Brief unit snapshot (2-3 sentences)
  - **Unit Arc:** One sentence describing the learning journey from Day 1 to Day ${lessonDayCount} (e.g., "Students progress from basic identification of X to independently analyzing and creating Y.")

- Unit Goals and Standards:
  - Learning Objectives:
    - 4-6 unit-level measurable objectives arranged in order of complexity (lower-order to higher-order thinking).
  - Relevant Standards (Massachusetts DESE):
    - Include 2-4 standards with code and full description text when possible.
    - Prefer official MA codes (for example: MA.3.MD.A.1).
    - If exact official text is uncertain, write "Verify official DESE wording" after that standard.
  - Key Questions:
    - 3-5 essential questions that span the unit and grow in depth.
  - Cumulative Vocabulary List:
    - List ALL key vocabulary for the entire unit, organized by the day they are introduced.
    - Format: **Day X:** term1, term2, term3

- Curriculum Progression Framework:
${pedagogicalFramework}

${scopeSequenceInstructions}

- Each day section (## Day X: ...):
  - ### Connection to Prior Learning
    - For Day 1: Brief activating prior knowledge activity (what students already know about this topic).
    - For Day 2+: A specific 3-5 minute warm-up that directly references what was learned the previous day. Use language like "Yesterday we learned X. Today we build on that by Y."
    - ${lessonDayCount >= 10 ? 'Every 5th day: Include a **Spiral Review** activity (5-7 min) that revisits concepts from earlier in the unit, not just the previous day.' : 'On the final day: Include a brief cumulative review of all prior days.'}
  - ### Core Lesson Details
    - **Bloom's Level:** State the primary Bloom's taxonomy level for this day (Remember/Understand/Apply/Analyze/Evaluate/Create).
    - Daily objective(s) and success criteria.
    - **Builds On:** One sentence explaining how this day's learning connects to and advances from the previous day.
  - ### Preparation and Materials
    - Practical materials list and setup notes.
    - **Vocabulary Focus:** List new terms introduced today AND 2-3 review terms from prior days.
  - ### Instruction and Activities
    - Step-by-step flow with **[X min]** timing.
    - Include teacher moves and expected student actions.
    - Activities should increase in cognitive demand compared to the previous day.
    - Include one extension for early finishers that previews or connects to the next day's content.
    - Keep each day concise and classroom-ready.
  - ### Evaluation and Support
    - In-lesson formative check and end-of-lesson check.
    - **Exit Ticket:** A quick check question or task that assesses the day's specific objective.
    - Differentiation:
${hasRoster ? '      - Hyper-personalize by named students from the roster and provide actionable modifications per student.' : '      - Provide actionable differentiation by WIDA levels and by academic level.'}
    - **Preview:** One sentence teasing what comes next: "Tomorrow, we will build on today's work by..."
${includeWorksheets ? '  - Include the daily worksheet block for that day in the same day section using the exact worksheet heading format above.' : ''}

${includeWorksheets || includeSlides ? `- Optional Generated Add-ons:
${worksheetGuidance}${slidesGuidance}` : ''}

CRITICAL COHESION RULES (multi-day plans):
- Each day MUST explicitly reference and build upon the previous day's content. No day should feel like a standalone lesson.
- Skills must escalate in complexity across days following Bloom's taxonomy. Do NOT repeat the same cognitive level across consecutive days without justification.
- Vocabulary must accumulate — never drop previously introduced terms. Each day's activities should use both new and prior vocabulary.
- Assessment tasks must reflect the cumulative learning, not just isolated daily objectives.
- For plans longer than 1 week, include designated review/assessment checkpoint days as specified in the Curriculum Progression Framework.
- The final day must be a culminating experience that synthesizes ALL prior learning, not just the most recent day's content.
`
    : `
1) Use this exact major section structure:
- # [Creative Lesson Title]
- ## Core Lesson Details
- ## Goals and Standards
- ## Preparation and Materials
- ## Instruction and Activities
- ## Evaluation and Support
${includeWorksheets || includeSlides ? '- ## Optional Generated Add-ons' : ''}

2) Section details:
- Core Lesson Details:
  - Grade Level and Subject
  - Duration
  - Brief lesson snapshot (2-3 sentences)

- Goals and Standards:
  - Learning Objectives:
    - 3-5 measurable objectives (student-facing "I can..." + teacher-facing measurable statement)
  - Relevant Standards (Massachusetts DESE):
    - Include 1-2 standards with code and full description text when possible.
    - Prefer official MA codes (for example: MA.3.MD.A.1).
    - If exact official text is uncertain, write "Verify official DESE wording" after that standard.
  - Key Questions:
    - 2-3 essential questions.

- Preparation and Materials:
  - Required Materials (bulleted checklist)
  - Key Vocabulary:
    - Provide 6-10 entries using this repeated format:
      - **Term:** ...
      - **Student-Friendly Definition:** ...
      - **Child-Friendly Illustration Prompt:** ...

- Instruction and Activities:
  - Lesson Procedure:
    - Step-by-step flow with estimated minutes for each phase.
    - Include teacher moves and expected student actions.
  - Differentiated Activities:
${hasRoster ? '    - Hyper-personalize by named students from the roster and provide actionable modifications per student.' : '    - Provide actionable differentiation by WIDA levels (Entering/Emerging/Developing/Expanding/Bridging) and by academic level.'}
  - Extension Activity:
    - Optional, engaging extension for early finishers.

- Evaluation and Support:
  - Assessment:
    - Include in-lesson formative checks and a quick end-of-lesson check.
  - Teacher Notes:
    - 2-3 practical tips including likely misconceptions and management moves.

${includeWorksheets || includeSlides ? `- Optional Generated Add-ons:
${worksheetGuidance}${slidesGuidance}` : ''}
`;

  const prompt = `
You are an expert Massachusetts elementary curriculum designer and master teacher.

Generate a complete, highly practical K-6 lesson package in Markdown.
Output must render cleanly in plain CommonMark.

Context:
- Plan Length: ${params.planLength}
- Grade Level: ${params.gradeLevel}
- Subject: ${params.subject}
- Lesson Duration: ${params.duration} minutes
- English Proficiency Levels: ${params.englishProficiency.length ? params.englishProficiency.join(', ') : 'Not specified'}
- Academic Levels: ${params.academicLevels.length ? params.academicLevels.join(', ') : 'Not specified'}
- Auto-Generate Objectives: ${params.autoGenerate ? 'Yes' : 'No'}
${!params.autoGenerate && params.manualObjectives ? `- Teacher-provided Objectives/Topics (IMPORTANT — you MUST base the entire lesson around these specific objectives and topics): ${params.manualObjectives}` : ''}
- Include Worksheet Add-ons: ${includeWorksheets ? 'Yes' : 'No'}
- Include Slide Add-ons: ${includeSlides ? 'Yes' : 'No'}
${isMultiDayPlan ? `- This is a multi-day unit. You must produce exactly ${lessonDayCount} daily lesson sections.\n- CRITICAL: Each day must build on and explicitly reference the previous day's learning. This is a cohesive unit, NOT ${lessonDayCount} independent lessons.` : '- This is a single-day lesson.'}
${params.studentsContext ? `- Class Roster Context (use names for personalization):\n${params.studentsContext}` : ''}

Formatting rules (strict):
- Use ATX headings only (#, ##, ###, ####).
- Do NOT use markdown tables, pipe characters, HTML tags, code fences, or horizontal rules.
- Use bullet lists (-) and numbered lists extensively. Never write dense paragraphs.
- Use **bold** for key terms, labels, and vocabulary words.
- Use *italics* for teacher actions, student responses, and instructional cues.
- Use sub-bullets (indented -) for details under main bullets.
- Every section should use structured lists, not prose paragraphs.
- Label items clearly: start bullets with a **Bold Label:** followed by content.
- For timing in procedures, format as: **[X min]** at the start of each step.
- Keep worksheet questions on separate lines.
- Worksheets must be self-contained and printable with text only.
- Do NOT reference external visuals or use placeholders like "(Picture of ...)".
- For fill-in-the-blank, use at least 12 underscores: ____________.
- For multiple choice, options must be on separate lines prefixed with A), B), C), D).

Output requirements:
${sectionStructure}

3) Tone:
- Professional, classroom-ready, concise but specific.
- Avoid generic fluff.

4) End tags (at the very end of your response, after all lesson content):
- Include a 1-2 sentence overview/blurb summarizing the lesson or unit in:
<LESSON_OVERVIEW>...</LESSON_OVERVIEW>
- Include exactly one image prompt describing a classroom-safe illustration in:
<IMAGE_PROMPT>...</IMAGE_PROMPT>
  `;

  const modelCandidates = getLessonModelCandidates();
  const generateWithModel = async (model: string, contents: string, temperature = 0.45) =>
    ai.models.generateContent({
      model,
      contents,
      config: {
        temperature,
      },
    });

  const generateWithFallback = async (
    contents: string,
    opts?: { temperature?: number; preferredModel?: string },
  ) => {
    const orderedModels = opts?.preferredModel
      ? [opts.preferredModel, ...modelCandidates.filter((model) => model !== opts.preferredModel)]
      : modelCandidates;

    let response: Awaited<ReturnType<typeof generateWithModel>> | null = null;
    let lastError: unknown;

    for (const model of orderedModels) {
      try {
        response = await generateWithModel(model, contents, opts?.temperature ?? 0.45);
        break;
      } catch (error) {
        lastError = error;
        const hasNextModel = model !== orderedModels[orderedModels.length - 1];
        if (hasNextModel && shouldRetryWithDifferentModel(error)) {
          console.warn(`Lesson model "${model}" failed. Trying the next configured model.`);
          continue;
        }
        throw error;
      }
    }

    if (!response) {
      if (lastError instanceof Error) throw lastError;
      throw new Error('Failed to generate lesson plan.');
    }

    return response;
  };

  const response = await generateWithFallback(prompt, { temperature: 0.45 });
  let text = response.text || '';

  if (includeWorksheets && text.trim()) {
    const worksheetBlocks = extractWorksheetBlocks(text);
    const hasWorksheetPlaceholders = worksheetBlocks.some((block) => worksheetHasPlaceholder(block.content));

    if (worksheetBlocks.length > 0 && hasWorksheetPlaceholders) {
      console.warn('Detected worksheet placeholders. Running worksheet quality rewrite.');
      const rewritePrompt = buildWorksheetRewritePrompt(worksheetBlocks, params);

      try {
        const rewrittenResponse = await generateWithFallback(rewritePrompt, { temperature: 0.2 });
        const rewrittenBlocks = parseRewrittenWorksheetBlocks(rewrittenResponse.text || '');
        if (rewrittenBlocks.size > 0) {
          text = applyRewrittenWorksheetBlocks(text, worksheetBlocks, rewrittenBlocks);
        } else {
          console.warn('Worksheet rewrite response could not be parsed. Keeping original worksheet content.');
        }
      } catch (error) {
        console.warn('Worksheet rewrite failed. Keeping original worksheet content.', error);
      }
    }
  }
  let imagePrompt: string | null = null;
  const match = text.match(/<IMAGE_PROMPT>([\s\S]*?)<\/IMAGE_PROMPT>/);
  if (match && match[1]) {
    imagePrompt = match[1].trim();
  }

  let lessonOverview: string | null = null;
  const overviewMatch = text.match(/<LESSON_OVERVIEW>([\s\S]*?)<\/LESSON_OVERVIEW>/);
  if (overviewMatch && overviewMatch[1]) {
    lessonOverview = overviewMatch[1].trim();
  }

  const slides: SlideData[] = [];
  const slideRegex = /<SLIDE>([\s\S]*?)<\/SLIDE>/g;
  let slideMatch;
  while ((slideMatch = slideRegex.exec(text)) !== null) {
    const slideContent = slideMatch[1].trim();
    const titleMatch = slideContent.match(/Title:\s*(.+)/);
    const bulletMatches = slideContent.match(/Bullet:\s*(.+)/g);
    if (titleMatch) {
      slides.push({
        title: titleMatch[1].trim(),
        bullets: (bulletMatches || []).map(b => b.replace(/^Bullet:\s*/, '').trim()),
      });
    }
  }

  let cleanText = text
    .replace(/<IMAGE_PROMPT>[\s\S]*?<\/IMAGE_PROMPT>/g, '')
    .replace(/<LESSON_OVERVIEW>[\s\S]*?<\/LESSON_OVERVIEW>/g, '')
    .replace(/<SLIDE>[\s\S]*?<\/SLIDE>/g, '')
    .trim();

  if (slides.length > 0) {
    cleanText = cleanText.replace(/###?\s*Presentation Slides[^\n]*\n?/, '').trim();
  }

  cleanText = normalizeLessonMarkdown(cleanText);

  return {
    text: cleanText,
    imagePrompt,
    lessonOverview,
    slides,
  };
}

export async function generateImageServer(prompt: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        {
          text: `${prompt} in a beautiful, illustrative, educational style, vibrant colors, suitable for a K-12 classroom.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: '16:9',
        imageSize: '1K',
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData && part.inlineData.data) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error('Failed to generate image.');
}
