export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export type StyleOption = {
  id: string;
  label: string;
  description: string;
};

export type GeneratePayload = {
  user_input: string;
  selected_styles: string[];
  tone: string;
  length: string;
  language: 'es' | 'en';
};

export type ScriptureItem = {
  reference: string;
  text: string;
  relevance_note: string;
};

export type GenerateResponse = {
  scripture: ScriptureItem[];
  sermon: string;
  prayer: string;
  retrieval_debug?: Record<string, unknown>;
};

export async function fetchStyles(): Promise<StyleOption[]> {
  const res = await fetch(`${API_BASE_URL}/api/styles`);
  if (!res.ok) throw new Error('Failed to load styles');
  return res.json();
}

export async function generateContent(payload: GeneratePayload): Promise<GenerateResponse> {
  const res = await fetch(`${API_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    let message = 'Generation failed';
    try {
      const json = JSON.parse(text);
      message = json.detail || message;
    } catch {
      message = text || message;
    }
    throw new Error(message);
  }

  return res.json();
}
