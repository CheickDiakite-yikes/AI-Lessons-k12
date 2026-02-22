async function fetchApi<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
}

export const api = {
  users: {
    get: () => fetchApi('/api/users/sync'),
  },

  images: {
    upload: (imageBase64: string, identifier?: string) =>
      fetchApi<{ imageKey: string }>('/api/images/upload', {
        method: 'POST',
        body: JSON.stringify({ imageBase64, identifier }),
      }),
  },

  classRosters: {
    list: () => fetchApi<any[]>('/api/class-rosters'),
    create: (name: string) =>
      fetchApi('/api/class-rosters', { method: 'POST', body: JSON.stringify({ name }) }),
    update: (id: string, name: string) =>
      fetchApi(`/api/class-rosters/${id}`, { method: 'PUT', body: JSON.stringify({ name }) }),
    delete: (id: string) =>
      fetchApi(`/api/class-rosters/${id}`, { method: 'DELETE' }),
  },

  students: {
    create: (rosterId: string, data: any) =>
      fetchApi(`/api/class-rosters/${rosterId}/students`, { method: 'POST', body: JSON.stringify(data) }),
    update: (rosterId: string, studentId: string, data: any) =>
      fetchApi(`/api/class-rosters/${rosterId}/students`, {
        method: 'PUT',
        body: JSON.stringify({ studentId, ...data }),
      }),
    delete: (rosterId: string, studentId: string) =>
      fetchApi(`/api/class-rosters/${rosterId}/students?studentId=${studentId}`, { method: 'DELETE' }),
  },

  lessonPlans: {
    list: () => fetchApi<any[]>('/api/lesson-plans'),
    get: (id: string) => fetchApi(`/api/lesson-plans/${id}`),
    create: (data: {
      title?: string;
      content: string;
      imagePrompt?: string;
      lessonOverview?: string;
      imageBase64?: string;
      planLength?: string;
      gradeLevel?: string;
      subject?: string;
      duration?: string;
      startDate?: string;
      classRosterId?: string;
      parameters?: any;
    }) => fetchApi('/api/lesson-plans', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      fetchApi(`/api/lesson-plans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      fetchApi(`/api/lesson-plans/${id}`, { method: 'DELETE' }),
  },

  getImageUrl: (imageKey: string) => `/api/images/${encodeURIComponent(imageKey)}`,

  fetchImageAsDataUrl: async (imageKey: string): Promise<string> => {
    const response = await fetch(`/api/images/${encodeURIComponent(imageKey)}`);
    if (!response.ok) throw new Error('Failed to fetch image');
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  },
};
