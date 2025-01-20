export const templateDomains = ['Code', 'General', 'Marketing', 'Education', 'Creative Writing', 'Meta'] as const;
export const agentTypes = ['Cursor', 'Replit', 'Claude', 'DeepSeek', 'Browser Agent'] as const;
export const modelTypes = ['GPT-4', 'Gemini', 'General'] as const;
export const roleTypes = ['Architect', 'Developer', 'Tester'] as const;
export const methodologyTypes = [
  'TDD',
  'BDD',
  'Refactoring',
  'Code Review',
  'Atomic Design',
  'SOLID Principles',
  'DRY'
] as const;

export type TemplateDomain = typeof templateDomains[number];
export type AgentType = typeof agentTypes[number];
export type ModelType = typeof modelTypes[number];
export type RoleType = typeof roleTypes[number];
export type MethodologyType = typeof methodologyTypes[number];

export interface Template {
  id: number;
  name: string;
  content: string;
  isCore: boolean;
  domain: TemplateDomain;
  agentEnhanced: boolean;
  agentType: AgentType | null;
  modelType: ModelType;
  roleType: RoleType;
  methodologies: MethodologyType[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateInput {
  name: string;
  content: string;
  isCore: boolean;
  domain: TemplateDomain;
  agentEnhanced: boolean;
  agentType: AgentType | null;
  modelType: ModelType;
  roleType: RoleType;
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