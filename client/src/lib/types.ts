export interface Template {
  id: number;
  name: string;
  content: string;
  isCore: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateInput {
  name: string;
  content: string;
  isCore: boolean;
}

export interface UpdateTemplateInput extends CreateTemplateInput {
  id: number;
}

export interface DynamicField {
  name: string;
  value: string;
}

export interface GeminiResponse {
  enhancedPrompt: string;
}
