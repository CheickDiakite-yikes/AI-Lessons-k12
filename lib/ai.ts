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

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export type SlideData = {
  title: string;
  bullets: string[];
};

export async function generateLessonPlan(params: LessonPlanParams) {
  return postJson<{ text: string; imagePrompt: string | null; slides: SlideData[] }>('/api/ai/lesson-plan', params);
}

export async function generateImage(prompt: string): Promise<string> {
  const data = await postJson<{ imageBase64: string }>('/api/ai/image', { prompt });
  return data.imageBase64;
}
