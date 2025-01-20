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
    'DeepSeek': "Leverage DeepSeek's strengths in code understanding and complex reasoning.",
    'Browser Agent': "Optimize the prompt for tasks that involve interacting with web pages."
  },
  models: {
    'GPT-3.5-Turbo': "Optimize for GPT-3.5 Turbo's strengths in general-purpose tasks while being mindful of its limitations.",
    'GPT-4': "Leverage GPT-4's advanced reasoning and deeper context understanding capabilities.",
    'GPT-4-Turbo': "Utilize GPT-4-Turbo's enhanced speed and up-to-date knowledge while maintaining high accuracy.",
    'Claude-Sonnet': "Optimize for Claude Sonnet's nuanced understanding and creative capabilities.",
    'Claude-Haiku': "Focus on concise, efficient responses suited for Claude Haiku's quick processing.",
    'Claude-Opus': "Leverage Claude Opus's advanced reasoning and extended context capabilities.",
    'Replit-Code': "Optimize for Replit Code's specialized code generation and completion features.",
    'Replit-Chat': "Utilize Replit Chat's conversational abilities within the development context.",
    'Deepseek-Coder': "Leverage Deepseek Coder's specialized code understanding and generation capabilities.",
    'Gemini-Pro': "Optimize for Gemini Pro's strong reasoning and problem-solving capabilities.",
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
  originalPrompt: string,
  customInstructions?: string
): string {
  const prompts = defaultPrompts;

  const parts = [
    "Please enhance the following prompt while maintaining its core intent and purpose:",
    `Original Prompt: ${originalPrompt}`,
    "",
    "Enhancement Instructions:",
    prompts.domains[template.domain],
    template.agentEnhanced && template.agentType ? 
      `This prompt will be used with ${template.agentType}. ${prompts.agents[template.agentType]}` : null,
    prompts.models[template.modelType],
    prompts.roles[template.roleType],
    ...template.methodologies.map(m => prompts.methodologies[m])
  ].filter(Boolean);

  let finalPrompt = parts.join('\n\n');

  if (customInstructions) {
    finalPrompt += `\n\nAdditional Instructions:\n${customInstructions}`;
  }

  // Add instruction to prevent commentary and formatting
  finalPrompt += '\n\nIMPORTANT: Return only the enhanced version of the prompt. Do not include any commentary, explanations, or formatting markers. Do not prefix with phrases like "Enhanced Prompt:" or add any other labels.';

  return finalPrompt;
}