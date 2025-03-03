// Constants for storage keys
export const PROVIDER_API_KEYS = 'provider-api-keys';
export const SELECTED_PROVIDER = 'selectedProvider';
export const SELECTED_MODEL = 'selectedModel';

export interface StoredApiKeys {
  google?: string;
  anthropic?: string;
  openai?: string;
  deepseek?: string;
  openrouter?: string;
}

export function getApiKeys(): StoredApiKeys {
  const keys = localStorage.getItem(PROVIDER_API_KEYS);
  try {
    return keys ? JSON.parse(keys) : {};
  } catch (e) {
    console.error('Failed to parse stored API keys:', e);
    return {};
  }
}

export function getSelectedProviderApiKey(): string | null {
  const provider = localStorage.getItem(SELECTED_PROVIDER) || 'google';
  const keys = getApiKeys();
  return keys[provider as keyof StoredApiKeys] || null;
}

export function setApiKeys(keys: StoredApiKeys): void {
  localStorage.setItem(PROVIDER_API_KEYS, JSON.stringify(keys));
}

export function clearApiKeys(): void {
  localStorage.removeItem(PROVIDER_API_KEYS);
}