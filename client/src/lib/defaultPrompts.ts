import { TemplateDomain, AgentType, ModelType, RoleType, MethodologyType } from './types';

type PromptConfig = {
  domains: Record<TemplateDomain, string>;
  agents: Record<AgentType, string>;
  models: Record<ModelType, string>;
  roles: Record<RoleType, string>;
  methodologies: Record<MethodologyType, string>;
};

export const defaultPrompts: PromptConfig = {
  domains: {
    'Code': "Focus on code correctness, efficiency, and best practices.",
    'General': "Focus on clarity, conciseness, and relevance to the given context.",
    'Marketing': "Focus on persuasiveness, clarity, and engagement. Tailor the message to the target audience and the specific marketing channel.",
    'Education': "Focus on clarity, accuracy, and pedagogical effectiveness. Consider the age and knowledge level of the learners.",
    'Creative Writing': "Focus on originality, vivid language, and engaging storytelling.",
    'Meta': "Focus on creating clear, effective instructions for generating prompts. Ensure the meta-prompt provides sufficient context and structure for generating high-quality prompts. Consider aspects like variable placeholders, output format, and desired characteristics of generated prompts."
  },
  agents: {
    'Cursor': "Optimize the prompt for code editing and generation within an IDE environment. Assume the agent has access to the entire codebase.",
    'Replit': "Optimize the prompt for code editing and generation within the Replit online environment.",
    'Claude': "Leverage Claude's strengths in conversational AI and natural language understanding.",
    'DeepSeek': "Leverage DeepSeek's strengths in code understanding, generation, and complex reasoning.",
    'Browser Agent': "Optimize the prompt for tasks that involve interacting with web pages."
  },
  models: {
    'GPT-4': "Leverage GPT-4's strengths in general-purpose language understanding and generation.",
    'Gemini': "Leverage Gemini's strengths in reasoning, problem-solving, and code generation.",
    'General': "Make the instructions clear and unambiguous."
  },
  roles: {
    'Architect': "Focus on high-level design, system architecture, and technical decision-making. Consider scalability, maintainability, and security.",
    'Developer': "Focus on implementation details, code structure, algorithms, and data structures. Emphasize code correctness and efficiency.",
    'Tester': "Focus on identifying potential bugs, edge cases, and areas for improvement in code quality."
  },
  methodologies: {
    'TDD': "Emphasize writing tests before implementing code. Encourage unit tests to drive development.",
    'BDD': "Focus on defining behavior from the user's perspective. Use user stories and acceptance criteria.",
    'Refactoring': "Focus on improving code structure, readability, and maintainability without changing external behavior.",
    'Code Review': "Focus on providing constructive feedback on code quality and identifying potential bugs.",
    'Atomic Design': "Focus on breaking down the UI into small, reusable components.",
    'SOLID Principles': "Follow Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion principles.",
    'DRY': "Eliminate code duplication by identifying and abstracting common patterns into reusable components."
  }
};

// Key to store customized prompts in localStorage
const CUSTOM_PROMPTS_KEY = 'custom-enhancement-prompts';

// Get custom prompts from localStorage or return defaults
export function getCustomPrompts(): PromptConfig {
  const stored = localStorage.getItem(CUSTOM_PROMPTS_KEY);
  return stored ? JSON.parse(stored) : defaultPrompts;
}

// Save custom prompts to localStorage
export function saveCustomPrompts(prompts: PromptConfig): void {
  localStorage.setItem(CUSTOM_PROMPTS_KEY, JSON.stringify(prompts));
}

// Reset custom prompts to defaults
export function resetToDefaultPrompts(): void {
  localStorage.removeItem(CUSTOM_PROMPTS_KEY);
}

// Generate a combined enhancement prompt based on template settings
export function generateEnhancementPrompt(
  template: {
    domain: TemplateDomain;
    agentEnhanced: boolean;
    agentType: AgentType | null;
    modelType: ModelType;
    roleType: RoleType;
    methodologies: MethodologyType[];
  },
  customInstructions?: string
): string {
  const prompts = getCustomPrompts();

  const parts = [
    prompts.domains[template.domain],
    template.agentEnhanced && template.agentType ? prompts.agents[template.agentType] : null,
    prompts.models[template.modelType],
    prompts.roles[template.roleType],
    ...template.methodologies.map(m => prompts.methodologies[m])
  ].filter(Boolean);

  const basePrompt = parts.join('\n\n');

  let finalPrompt = basePrompt;

  if (customInstructions) {
    finalPrompt += `\n\nAdditional Instructions:\n${customInstructions}`;
  }

  // Add instruction to prevent commentary and formatting
  finalPrompt += '\n\nIMPORTANT: Return only the enhanced prompt without any headers, sections, formatting markers, or additional commentary. Do not include phrases like "Enhanced Prompt" or explanatory notes.';

  return finalPrompt;
}