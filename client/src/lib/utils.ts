import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions for handling template placeholders
export function encodePlaceholders(text: string): string {
  return text.replace(/\{\{([^}]+)\}\}/g, '<span class="text-primary">{{$1}}</span>');
}

export function decodePlaceholders(text: string): string {
  return text.replace(/<span class="text-primary">\{\{([^}]+)\}\}<\/span>/g, '{{$1}}');
}

export function extractPlaceholders(text: string): string[] {
  const matches = text.matchAll(/\{\{([^}]+)\}\}/g);
  return Array.from(matches, m => m[1]);
}

export function preservePlaceholders(enhanced: string, original: string): string {
  const originalPlaceholders = extractPlaceholders(original);
  let result = enhanced;

  // Replace any transformed placeholders with their original form
  originalPlaceholders.forEach(placeholder => {
    const regex = new RegExp(`\\{\\{\\s*${placeholder}\\s*\\}\\}|\\[${placeholder}\\]|<${placeholder}>`, 'gi');
    result = result.replace(regex, `{{${placeholder}}}`);
  });

  return result;
}