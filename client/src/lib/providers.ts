import { getApiKeys } from './storage';

export interface Model {
  id: string;
  displayName: string;
  provider: 'google' | 'anthropic' | 'openai' | 'deepseek' | 'openrouter';
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

  // The newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
  return [
    {
      id: 'claude-3-7-sonnet-20250219',
      displayName: 'Claude 3.7 Sonnet',
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

export async function fetchDeepseekModels(): Promise<Model[]> {
  const { deepseek: apiKey } = getApiKeys();
  if (!apiKey) return [];

  // Return predefined Deepseek models
  return [
    {
      id: 'deepseek-chat',
      displayName: 'Deepseek Chat',
      provider: 'deepseek',
      type: 'chat',
    },
    {
      id: 'deepseek-coder',
      displayName: 'Deepseek Coder',
      provider: 'deepseek',
      type: 'chat',
    },
  ];
}

export async function fetchOpenRouterModels(): Promise<Model[]> {
  const { openrouter: apiKey } = getApiKeys();
  if (!apiKey) return [];

  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch OpenRouter models: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.map((model: any) => ({
      id: model.id,
      displayName: model.name || model.id,
      provider: 'openrouter',
      type: 'chat',
    }));
  } catch (error) {
    console.error('Error fetching OpenRouter models:', error);
    return [];
  }
}

export async function fetchAllModels(): Promise<Model[]> {
  const [googleModels, anthropicModels, openaiModels, deepseekModels, openrouterModels] = await Promise.all([
    fetchGoogleModels(),
    fetchAnthropicModels(),
    fetchOpenAIModels(),
    fetchDeepseekModels(),
    fetchOpenRouterModels(),
  ]);

  return [
    ...googleModels,
    ...anthropicModels,
    ...openaiModels,
    ...deepseekModels,
    ...openrouterModels,
  ];
}