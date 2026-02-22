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
  includeWorksheets: boolean;
  includeSlides: boolean;
  studentsContext?: string;
};

type SlideData = {
  title: string;
  bullets: string[];
};

function getGeminiApiKey(): string {
  const key = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!key) {
    throw new Error('Gemini API key is not configured on the server.');
  }
  return key;
}

export async function generateLessonPlanServer(params: LessonPlanParams) {
  const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });

  const hasRoster = Boolean(params.studentsContext);
  const includeWorksheets = params.includeWorksheets;
  const includeSlides = params.includeSlides;

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
${!params.autoGenerate && params.manualObjectives ? `- Teacher-provided Objectives/Topics: ${params.manualObjectives}` : ''}
- Include Worksheet Add-ons: ${includeWorksheets ? 'Yes' : 'No'}
- Include Slide Add-ons: ${includeSlides ? 'Yes' : 'No'}
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
- For fill-in-the-blank, use at least 12 underscores: ____________.
- For multiple choice, options must be on separate lines prefixed with A), B), C), D).

Output requirements:
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
${includeWorksheets ? `  - Worksheets:
    - Provide exactly 3 worksheet sets with these exact headings in this order:
      - ### Worksheet 1: Matching
      - ### Worksheet 2: Fill in the Blank
      - ### Worksheet 3: Multiple Choice
    - For each worksheet, include these exact subheadings in this order:
      - #### Student Copy
      - #### Answer Key
      - #### Differentiation Note
    - Student Copy must begin with: Name: ____________   Date: ____________
    - Matching worksheet format:
      - Include "Terms" list with 6 numbered items.
      - Include "Definitions" list with 6 lettered items (A-F).
    - Fill in the Blank worksheet format:
      - Include 8-10 numbered sentences.
      - Each sentence has exactly one blank with underscores.
    - Multiple Choice worksheet format:
      - Include 8-10 numbered questions.
      - Each question includes exactly 4 options, each on its own line as A), B), C), D).
    - Answer key format:
      - Matching: list answers as 1-A format.
      - Fill in the Blank: list each number with expected answer.
      - Multiple Choice: list number + correct letter + a short rationale (max 1 sentence).
` : ''}${includeSlides ? `  - Presentation Slides:
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
` : ''}` : ''}

3) Tone:
- Professional, classroom-ready, concise but specific.
- Avoid generic fluff.

4) End tags (at the very end of your response, after all lesson content):
- Include a 1-2 sentence overview/blurb summarizing the lesson or unit in:
<LESSON_OVERVIEW>...</LESSON_OVERVIEW>
- Include exactly one image prompt describing a classroom-safe illustration in:
<IMAGE_PROMPT>...</IMAGE_PROMPT>
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: prompt,
    config: {
      temperature: 0.45,
    },
  });

  const text = response.text || '';
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
