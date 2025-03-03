import { getApiKeys } from './storage';

export interface Model {
  id: string;
  displayName: string;
  provider: 'google' | 'anthropic' | 'openai';
  type: 'chat' | 'completion' | 'other';
}

interface GoogleModel {
  name: string;
  baseModelId: string;
  version: string;
  displayName: string;
  description: string;
  inputTokenLimit: number;
  outputTokenLimit: number;
  supportedGenerationMethods: string[];
}

export async function fetchGoogleModels(): Promise<Model[]> {
  const { google: apiKey } = getApiKeys();
  if (!apiKey) return [];

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Google models: ${response.statusText}`);
    }

    const data = await response.json();
    return (data.models as GoogleModel[]).map(model => ({
      id: model.name,
      displayName: model.displayName || model.name,
      provider: 'google',
      type: model.supportedGenerationMethods.includes('generateContent') ? 'chat' : 'completion',
    }));
  } catch (error) {
    console.error('Error fetching Google models:', error);
    return [];
  }
}

export async function fetchAnthropicModels(): Promise<Model[]> {
  const { anthropic: apiKey } = getApiKeys();
  if (!apiKey) return [];

  // Currently, Anthropic's available models are predefined
  return [
    {
      id: 'claude-3-sonnet-20240229',
      displayName: 'Claude 3 Sonnet',
      provider: 'anthropic',
      type: 'chat',
    },
  ];
}

export async function fetchOpenAIModels(): Promise<Model[]> {
  const { openai: apiKey } = getApiKeys();
  if (!apiKey) return [];

  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch OpenAI models: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data
      .filter((model: any) => model.id.startsWith('gpt-'))
      .map((model: any) => ({
        id: model.id,
        displayName: model.id,
        provider: 'openai',
        type: 'chat',
      }));
  } catch (error) {
    console.error('Error fetching OpenAI models:', error);
    return [];
  }
}

export async function fetchAllModels(): Promise<Model[]> {
  const [googleModels, anthropicModels, openaiModels] = await Promise.all([
    fetchGoogleModels(),
    fetchAnthropicModels(),
    fetchOpenAIModels(),
  ]);

  return [...googleModels, ...anthropicModels, ...openaiModels];
}
