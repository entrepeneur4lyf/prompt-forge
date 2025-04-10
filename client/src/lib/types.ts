export const templateDomains = ['Code', 'General', 'Marketing', 'Education', 'Creative Writing', 'Meta'] as const;
export const modelTypes = [
  'Claude-Sonnet-3.5',
  'GPT-3.5-Turbo',
  'GPT-4',
  'GPT-4-Turbo',
  'Claude-Sonnet',
  'Claude-Haiku',
  'Claude-Opus',
  'Replit-Code',
  'Replit-Chat',
  'Deepseek-Coder',
  'Gemini-Pro'
] as const;
export const roleTypes = ['None', 'Architect', 'Developer', 'Tester'] as const;
export const methodologyTypes = [
  'TDD',
  'BDD',
  'Refactoring',
  'Code Review',
  'Atomic Design',
  'SOLID Principles',
  'DRY'
] as const;

export const providerTypes = ['OpenAI', 'Anthropic', 'Replit', 'Deepseek', 'Gemini'] as const;

export type TemplateDomain = typeof templateDomains[number];
export type ModelType = typeof modelTypes[number];
export type RoleType = typeof roleTypes[number];
export type MethodologyType = typeof methodologyTypes[number];
export type ProviderType = typeof providerTypes[number];

export interface Template {
  id: number;
  name: string;
  content: string;
  isCore: boolean;
  domain: TemplateDomain;
  providerType: ProviderType;
  modelType: ModelType;
  agentEnhanced: boolean;
  agentType: RoleType;
  methodologies: MethodologyType[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateInput {
  name: string;
  content: string;
  isCore: boolean;
  domain: TemplateDomain;
  providerType: ProviderType;
  modelType: ModelType;
  agentEnhanced: boolean;
  agentType: RoleType;
  methodologies: MethodologyType[];
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