import { GoogleGenAI } from '@google/genai';

export async function generateLessonPlan(params: {
  planType: string;
  gradeLevel: string;
  subject: string;
  duration: string;
  englishProficiency: string[];
  academicLevels: string[];
  autoGenerate: boolean;
  manualObjectives: string;
  studentsContext?: string;
}) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are an expert curriculum designer and master teacher. 
    Create a highly engaging, detailed, and beautifully structured lesson plan with the following parameters:
    
    - Plan Type: ${params.planType}
    - Grade Level: ${params.gradeLevel}
    - Subject: ${params.subject}
    - Lesson Duration: ${params.duration} minutes
    - English Proficiency Levels to accommodate: ${params.englishProficiency.join(', ')}
    - Academic Levels to accommodate: ${params.academicLevels.join(', ')}
    ${params.studentsContext ? `- Detailed Class Roster Context (Use this to highly customize the differentiation and activities):\n${params.studentsContext}` : ''}
    - Auto-Generate Objectives: ${params.autoGenerate ? 'Yes' : 'No'}
    ${!params.autoGenerate && params.manualObjectives ? `- Manual Objectives/Topics provided by teacher: ${params.manualObjectives}` : ''}

    Please structure the lesson plan using Markdown. Include the following sections:
    # [Catchy Lesson Title]
    ## Overview
    ## Learning Objectives
    ## Materials Needed
    ## Procedure (Step-by-step with time allocations)
    ## Differentiation Strategies (Specifically addressing the English Proficiency and Academic Levels provided)
    ## Assessment/Evaluation
    ## Extension Activities

    Make the tone encouraging, professional, and highly practical for a teacher to use immediately.
    
    At the very end of your response, provide a single, highly descriptive prompt for an image generation model to create an illustration for this lesson plan. 
    Wrap this image prompt in a special tag like this: <IMAGE_PROMPT>your prompt here</IMAGE_PROMPT>.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: prompt,
    config: {
      temperature: 0.7,
    }
  });

  const text = response.text || '';
  
  // Extract image prompt
  let imagePrompt = null;
  const match = text.match(/<IMAGE_PROMPT>([\s\S]*?)<\/IMAGE_PROMPT>/);
  if (match && match[1]) {
    imagePrompt = match[1].trim();
  }
  
  // Remove the image prompt from the main text
  const cleanText = text.replace(/<IMAGE_PROMPT>[\s\S]*?<\/IMAGE_PROMPT>/, '').trim();

  return {
    text: cleanText,
    imagePrompt
  };
}

export async function generateImage(prompt: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        {
          text: prompt + " in a beautiful, illustrative, educational style, vibrant colors, suitable for a K-12 classroom.",
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: "1K"
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData && part.inlineData.data) {
      const base64EncodeString: string = part.inlineData.data;
      return `data:image/png;base64,${base64EncodeString}`;
    }
  }

  throw new Error("Failed to generate image.");
}
