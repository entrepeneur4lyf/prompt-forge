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
    'Code': "This prompt is for a code-related task. Focus on code correctness, efficiency, and best practices.",
    'General': "This prompt is for a general-purpose task. Focus on clarity, conciseness, and relevance to the given context.",
    'Marketing': "This prompt is for a marketing-related task. Focus on persuasiveness, clarity, and engagement. Tailor the message to the target audience and the specific marketing channel.",
    'Education': "This prompt is for an educational context. Focus on clarity, accuracy, and pedagogical effectiveness. Consider the age and knowledge level of the learners.",
    'Creative Writing': "This prompt is for creative writing. Focus on originality, vivid language, and engaging storytelling."
  },
  agents: {
    'Cursor': "This prompt will be used with Cursor. Optimize the prompt for code editing and generation within an IDE environment. Assume the agent has access to the entire codebase.",
    'Replit': "This prompt will be used with Replit. Optimize the prompt for code editing and generation within the Replit online environment.",
    'Claude': "This prompt will be used with Claude. Leverage Claude's strengths in conversational AI and natural language understanding.",
    'DeepSeek': "This prompt will be used with DeepSeek. Leverage DeepSeek's strengths in code understanding, generation, and complex reasoning.",
    'Browser Agent': "This prompt will be used with a browser agent. Optimize the prompt for tasks that involve interacting with web pages."
  },
  models: {
    'GPT-4': "This prompt will be used with GPT-4. Leverage GPT-4's strengths in general-purpose language understanding and generation.",
    'Gemini': "This prompt will be used with Gemini. Leverage Gemini's strengths in reasoning, problem-solving, and code generation.",
    'General': "This prompt will be used with a general-purpose language model. Make the instructions clear and unambiguous."
  },
  roles: {
    'Architect': "This prompt is for a software architect. Focus on high-level design, system architecture, and technical decision-making. Consider scalability, maintainability, and security.",
    'Developer': "This prompt is for a software developer. Focus on implementation details, code structure, algorithms, and data structures. Emphasize code correctness and efficiency.",
    'Tester': "This prompt is for a software tester. Focus on identifying potential bugs, edge cases, and areas for improvement in code quality."
  },
  methodologies: {
    'TDD': "Emphasize the importance of writing tests before implementing code. Encourage the use of unit tests to drive development.",
    'BDD': "Focus on defining behavior from the user's perspective. Use user stories and acceptance criteria to guide development.",
    'Refactoring': "Focus on improving code structure, readability, and maintainability without changing external behavior.",
    'Code Review': "Focus on providing constructive feedback on code quality, identifying potential bugs, and suggesting improvements.",
    'Atomic Design': "Focus on breaking down the UI into small, reusable components (atoms, molecules, organisms, templates, pages).",
    'SOLID Principles': "Adhere to the SOLID principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.",
    'DRY': "Eliminate code duplication by identifying and abstracting common patterns into reusable components or functions."
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
    agentType: AgentType;
    modelType: ModelType;
    roleType: RoleType;
    methodologies: MethodologyType[];
  },
  customInstructions?: string
): string {
  const prompts = getCustomPrompts();
  
  const parts = [
    prompts.domains[template.domain],
    prompts.agents[template.agentType],
    prompts.models[template.modelType],
    prompts.roles[template.roleType],
    ...template.methodologies.map(m => prompts.methodologies[m])
  ];

  const basePrompt = parts.join('\n\n');
  
  if (customInstructions) {
    return `${basePrompt}\n\nAdditional Instructions:\n${customInstructions}`;
  }

  return basePrompt;
}
