import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from 'zod';

export const templateDomains = ['Code', 'General', 'Marketing', 'Education', 'Creative Writing', 'Meta'] as const;
export const providerTypes = ['OpenAI', 'Anthropic', 'Replit', 'Deepseek', 'Gemini'] as const;
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

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  isCore: boolean("is_core").default(false).notNull(),
  domain: text("domain", { enum: templateDomains }).default('Code').notNull(),
  providerType: text("provider_type", { enum: providerTypes }).default('Anthropic').notNull(),
  modelType: text("model_type", { enum: modelTypes }).default('Claude-Sonnet-3.5').notNull(),
  roleType: text("role_type", { enum: roleTypes }).default('None').notNull(),
  methodologies: text("methodologies").array().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

const methodologySchema = z.array(z.enum(methodologyTypes));

export const insertTemplateSchema = createInsertSchema(templates, {
  methodologies: methodologySchema
});
export const selectTemplateSchema = createSelectSchema(templates, {
  methodologies: methodologySchema
});

export type InsertTemplate = typeof templates.$inferInsert;
export type SelectTemplate = typeof templates.$inferSelect;