import { GoogleGenAI } from '@google/genai';

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
    - Markdown table with columns:
      - Term
      - Student-Friendly Definition
      - Child-Friendly Illustration Prompt

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
${includeWorksheets ? '  - Worksheets:\n    - Provide 3 printable worksheet sets: Matching, Fill in the Blank, and Multiple Choice.\n    - Align with lesson vocabulary/objectives.\n    - Include answer keys and differentiation notes.\n' : ''}${includeSlides ? '  - Presentation Slides:\n    - Provide a 5-10 slide outline.\n    - For each slide include: slide title, 3-5 bullet points, and a 16:9 visual prompt that is relevant to the topic and age group (not limited to cartoon style).\n' : ''}` : ''}

3) Tone:
- Professional, classroom-ready, concise but specific.
- Avoid generic fluff.

4) End tag for hero image:
- At the very end, include exactly one image prompt wrapped in:
<IMAGE_PROMPT>...</IMAGE_PROMPT>
- This prompt should describe a single classroom-safe illustration representing the lesson.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: prompt,
    config: {
      temperature: 0.7,
    },
  });

  const text = response.text || '';
  let imagePrompt: string | null = null;
  const match = text.match(/<IMAGE_PROMPT>([\s\S]*?)<\/IMAGE_PROMPT>/);
  if (match && match[1]) {
    imagePrompt = match[1].trim();
  }

  const cleanText = text.replace(/<IMAGE_PROMPT>[\s\S]*?<\/IMAGE_PROMPT>/, '').trim();

  return {
    text: cleanText,
    imagePrompt,
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
