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

const RETRY_DELAYS = [1000, 3000, 6000];
const REQUEST_TIMEOUT_MS = 115_000;

async function fetchWithRetry(url: string, options: RequestInit): Promise<Response> {
  const maxAttempts = RETRY_DELAYS.length;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        return response;
      }

      if (response.status >= 400 && response.status < 500) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || `Request failed with status ${response.status}`);
      }

      if (attempt < maxAttempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS[attempt]));
        continue;
      }

      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(data?.error || `Server error (${response.status}). Please try again later.`);
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof DOMException && error.name === 'AbortError') {
        if (attempt < maxAttempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS[attempt]));
          continue;
        }
        throw new Error('Request timed out. The server took too long to respond. Please try again.');
      }

      if (error instanceof TypeError) {
        if (attempt < maxAttempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS[attempt]));
          continue;
        }
        throw new Error('Network error. Please check your connection and try again.');
      }

      throw error;
    }
  }

  throw new Error('Request failed after multiple attempts. Please try again.');
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetchWithRetry(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return response.json();
}

export type SlideData = {
  title: string;
  bullets: string[];
};

export async function generateLessonPlan(params: LessonPlanParams) {
  return postJson<{ text: string; imagePrompt: string | null; lessonOverview: string | null; slides: SlideData[] }>('/api/ai/lesson-plan', params);
}

export async function generateImage(prompt: string): Promise<string> {
  const data = await postJson<{ imageBase64: string }>('/api/ai/image', { prompt });
  return data.imageBase64;
}
