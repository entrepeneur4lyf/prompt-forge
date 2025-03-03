import { GeminiResponse, Template, CreateTemplateInput, UpdateTemplateInput } from './types';
import { getApiKeys, SELECTED_PROVIDER, SELECTED_MODEL } from './storage';

const API_BASE = '/api';

export async function getTemplates(): Promise<Template[]> {
  const res = await fetch(`${API_BASE}/templates`);
  if (!res.ok) throw new Error('Failed to fetch templates');
  return res.json();
}

export async function createTemplate(template: CreateTemplateInput): Promise<Template> {
  const res = await fetch(`${API_BASE}/templates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(template)
  });
  if (!res.ok) throw new Error('Failed to create template');
  return res.json();
}

export async function duplicateTemplate(template: Template): Promise<Template> {
  const { id, createdAt, updatedAt, ...rest } = template;
  const newTemplate = {
    ...rest,
    name: `${template.name} (1)` 
  };

  return createTemplate(newTemplate);
}

export async function updateTemplate(template: UpdateTemplateInput): Promise<Template> {
  const res = await fetch(`${API_BASE}/templates/${template.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(template)
  });
  if (!res.ok) throw new Error('Failed to update template');
  return res.json();
}

export async function reorderTemplates(templates: Template[]): Promise<Template[]> {
  const reorderedTemplates = templates.map((template, index) => ({
    id: template.id,
    order: index
  }));

  const res = await fetch(`${API_BASE}/templates/reorder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reorderedTemplates)
  });
  if (!res.ok) throw new Error('Failed to reorder templates');
  return res.json();
}

export async function deleteTemplate(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/templates/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete template');
}

export async function enhancePrompt(prompt: string): Promise<GeminiResponse> {
  const selectedProvider = localStorage.getItem(SELECTED_PROVIDER) || 'google';
  const selectedModel = localStorage.getItem(SELECTED_MODEL);
  const keys = getApiKeys();
  const apiKey = keys[selectedProvider as keyof typeof keys];

  console.log('API Key present:', !!apiKey, 'Provider:', selectedProvider, 'Model:', selectedModel);

  if (!apiKey) {
    throw new Error('API key not found for the selected provider. Please add your API key in settings.');
  }

  try {
    const res = await fetch(`${API_BASE}/enhance`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        'X-Provider': selectedProvider,
      },
      body: JSON.stringify({ 
        prompt,
        model: selectedModel
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Enhancement request failed:', {
        status: res.status,
        statusText: res.statusText,
        errorText
      });
      throw new Error(`Enhancement failed: ${errorText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Enhancement error:', error);
    throw error;
  }
}