import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from 'zod';

export const templateDomains = ['Code', 'General', 'Marketing', 'Education', 'Creative Writing'] as const;
export const agentTypes = ['Cursor', 'Replit', 'Claude', 'DeepSeek', 'Browser Agent'] as const;
export const modelTypes = ['GPT-4', 'Gemini', 'General'] as const;
export const roleTypes = ['Architect', 'Developer', 'Tester'] as const;

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  isCore: boolean("is_core").default(false).notNull(),
  domain: text("domain", { enum: templateDomains }).default('Code').notNull(),
  agentEnhanced: boolean("agent_enhanced").default(false).notNull(),
  agentType: text("agent_type", { enum: agentTypes }).default('Replit'),
  modelType: text("model_type", { enum: modelTypes }).default('Gemini').notNull(),
  roleType: text("role_type", { enum: roleTypes }).default('Developer').notNull(),
  methodologies: text("methodologies").array().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

const methodologySchema = z.array(z.enum(['TDD', 'BDD', 'Refactoring', 'Code Review', 'Atomic Design', 'SOLID Principles', 'DRY']));

export const insertTemplateSchema = createInsertSchema(templates, {
  methodologies: methodologySchema
});
export const selectTemplateSchema = createSelectSchema(templates, {
  methodologies: methodologySchema
});
export type InsertTemplate = typeof templates.$inferInsert;
export type SelectTemplate = typeof templates.$inferSelect;