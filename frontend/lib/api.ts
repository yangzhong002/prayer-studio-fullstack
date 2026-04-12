// Browser uses NEXT_PUBLIC_API_BASE_URL; server-side (SSR inside the container)
// uses INTERNAL_API_BASE_URL so it can reach the backend via the compose network.
export const API_BASE_URL =
  (typeof window === 'undefined'
    ? process.env.INTERNAL_API_BASE_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL) ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://localhost:8000';

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
  language: 'zh' | 'en';
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
  const res = await fetch(`${API_BASE_URL}/api/styles`, { cache: 'no-store' });
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
    const detail = await res.text();
    throw new Error(detail || 'Generation failed');
  }

  return res.json();
}
