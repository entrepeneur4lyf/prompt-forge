import {
  TemplateDomain,
  ModelType,
  RoleType,
  MethodologyType,
  ProviderType,
  Template
} from "./types";

type PromptConfig = {
  domains: Record<TemplateDomain, string>;
  providers: Record<ProviderType, string>;
  models: Record<ModelType, string>;
  roles: Record<RoleType, string>;
  methodologies: Record<MethodologyType, string>;
};

export const defaultPrompts: PromptConfig = {
  domains: {
    'Code': "This prompt is related to code. Focus on improving the prompt's ability to elicit correct, efficient, and maintainable code from an AI. Consider aspects like code structure, best practices, and testability when refining the prompt.",
    'General': "This prompt is for a general-purpose task. Improve the prompt's clarity, conciseness, and relevance to its intended context. Ensure the prompt is well-structured and effectively guides the AI towards the desired outcome.",
    'Marketing': "This prompt is for marketing. Improve the prompt's ability to elicit persuasive, clear, and engaging marketing content from an AI. Tailor the prompt to the specific marketing channel and target audience.",
    'Education': "This prompt is for education. Improve the prompt's ability to elicit clear, accurate, and pedagogically effective educational content from an AI. Tailor the prompt to the specific age group and knowledge level of the learners.",
    'Creative Writing': "This prompt is for creative writing. Improve the prompt's ability to elicit original, vivid, and engaging creative writing from an AI. Focus on aspects like narrative structure, character development, and style.",
    'Meta': "This prompt is a meta-prompt, designed to generate other prompts. Improve the clarity, structure, and effectiveness of this meta-prompt. Ensure it provides sufficient context and instructions to generate high-quality prompts for the intended purpose."
  },
  providers: {
    'OpenAI': "This prompt will be used with OpenAI models. Consider the model's capabilities when refining the prompt.",
    'Anthropic': "This prompt will be used with Anthropic Claude models. Consider the model's conversational abilities and focus on natural language.",
    'Replit': "This prompt is for Replit models. Consider the Replit environment and focus on code-related instructions.",
    'Deepseek': "This prompt is for Deepseek models. Focus on code-related instructions and leverage its ability to understand and generate code.",
    'Gemini': "This prompt will be used with Google Gemini models. Consider the model's strengths in reasoning and problem-solving."
  },
  models: {
    'Claude-Sonnet-3.5': "Leverage Claude Sonnet 3.5's advanced capabilities in contextual understanding, creative writing, and complex reasoning.",
    'GPT-3.5-Turbo': "Optimize for GPT-3.5 Turbo's strengths in general-purpose tasks while being mindful of its limitations.",
    'GPT-4': "Leverage GPT-4's advanced reasoning and deeper context understanding capabilities.",
    'GPT-4-Turbo': "Utilize GPT-4-Turbo's enhanced speed and up-to-date knowledge while maintaining high accuracy.",
    'Claude-Sonnet': "Optimize for Claude Sonnet's nuanced understanding and creative capabilities.",
    'Claude-Haiku': "Focus on concise, efficient responses suited for Claude Haiku's quick processing.",
    'Claude-Opus': "Leverage Claude Opus's advanced reasoning and extended context capabilities.",
    'Replit-Code': "Optimize for Replit Code's specialized code generation and completion features.",
    'Replit-Chat': "Utilize Replit Chat's conversational abilities within the development context.",
    'Deepseek-Coder': "Leverage Deepseek Coder's specialized code understanding and generation capabilities.",
    'Gemini-Pro': "Optimize for Gemini Pro's strong reasoning and problem-solving capabilities."
  },
  roles: {
    'Architect': "Focus on improving the prompt's effectiveness for eliciting high-level design, architecture, and technical decision-making guidance.",
    'Developer': "Focus on improving the prompt's effectiveness for eliciting implementation details, code structure, algorithms, and data structures.",
    'Tester': "Focus on improving the prompt's effectiveness for eliciting information related to testing strategies and identifying potential issues."
  },
  methodologies: {
    'TDD': "Refine the prompt to elicit a focus on writing tests before implementing code.",
    'BDD': "Refine the prompt to elicit a focus on defining behavior from the user's perspective.",
    'Refactoring': "Refine the prompt to elicit a focus on improving code structure and maintainability.",
    'Code Review': "Refine the prompt to elicit constructive feedback on code quality.",
    'Atomic Design': "Refine the prompt to elicit a focus on breaking down the UI into small, reusable components.",
    'SOLID Principles': "Refine the prompt to elicit adherence to SOLID principles of object-oriented design.",
    'DRY': "Refine the prompt to elicit a focus on eliminating code duplication."
  }
};

// Generate a combined enhancement prompt based on template settings
export function generateEnhancementPrompt(
  template: Template,
  originalPrompt: string,
  customInstructions?: string,
): string {
  const prompts = defaultPrompts;

  const parts = [
    "Please enhance the following prompt while maintaining its core intent and purpose:",
    `Original Prompt: ${originalPrompt}`,
    "",
    "Enhancement Instructions:",
    prompts.domains[template.domain],
    prompts.providers[template.providerType],
    prompts.models[template.modelType],
    template.roleType !== 'None' ? prompts.roles[template.roleType] : null,
    ...template.methodologies.map(m => prompts.methodologies[m])
  ].filter(Boolean);

  const basePrompt = parts.join(" ");

  let finalPrompt = basePrompt;

  if (customInstructions) {
    finalPrompt += ` ${customInstructions}`;
  }

  // Add instruction to prevent commentary and formatting
  finalPrompt += '\n\nIMPORTANT: Return only the enhanced version of the prompt. Do not include any commentary, explanations, or formatting markers. Do not prefix with phrases like "Enhanced Prompt:" or add any other labels.';

  return finalPrompt;
}

// Key to store customized prompts in localStorage
const CUSTOM_PROMPTS_KEY = "custom-enhancement-prompts";

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