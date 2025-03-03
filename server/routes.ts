import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { templates } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // Templates CRUD
  app.get("/api/templates", async (_req, res) => {
    console.log("GET /api/templates - Starting request");
    try {
      console.log("Executing Drizzle query to fetch templates...");
      const allTemplates = await db.select().from(templates).orderBy(templates.order);
      console.log("Query successful, found", allTemplates.length, "templates");
      res.json(allTemplates);
    } catch (error) {
      console.error("Error in /api/templates:", error);
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
      res.status(500).json({ 
        message: "Failed to fetch templates",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.post("/api/templates", async (req, res) => {
    try {
      // Get max order and add new template at the end
      const maxOrder = await db.select({ order: templates.order })
        .from(templates)
        .orderBy(templates.order)
        .limit(1);

      const order = maxOrder.length > 0 ? maxOrder[0].order + 1 : 0;

      const [template] = await db
        .insert(templates)
        .values({ ...req.body, order })
        .returning();
      res.json(template);
    } catch (error) {
      console.error("Error creating template:", error);
      res.status(500).json({ 
        message: "Failed to create template",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.put("/api/templates/:id", async (req, res) => {
    try {
      const [template] = await db
        .update(templates)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(templates.id, parseInt(req.params.id)))
        .returning();
      res.json(template);
    } catch (error) {
      console.error("Error updating template:", error);
      res.status(500).json({ 
        message: "Failed to update template",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.post("/api/templates/reorder", async (req, res) => {
    try {
      const orderedTemplates = req.body as { id: number; order: number }[];

      // Update each template's order in a transaction
      await db.transaction(async (tx) => {
        for (const { id, order } of orderedTemplates) {
          await tx.update(templates)
            .set({ order, updatedAt: new Date() })
            .where(eq(templates.id, id));
        }
      });

      const updatedTemplates = await db.select()
        .from(templates)
        .orderBy(templates.order);

      res.json(updatedTemplates);
    } catch (error) {
      console.error("Error reordering templates:", error);
      res.status(500).json({
        message: "Failed to reorder templates",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.delete("/api/templates/:id", async (req, res) => {
    try {
      await db
        .delete(templates)
        .where(eq(templates.id, parseInt(req.params.id)));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting template:", error);
      res.status(500).json({ 
        message: "Failed to delete template",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Gemini API Integration and OpenRouter support
  app.post("/api/enhance", async (req, res) => {
    try {
      const apiKey = req.headers["x-api-key"];
      const provider = req.body.provider || 'google';
      console.log("Enhance request received. Provider:", provider, "API key present:", !!apiKey);

      if (!apiKey) {
        return res.status(401).json({ message: "API key is required" });
      }

      let response;

      switch (provider) {
        case 'google':
          const url = new URL("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent");
          url.searchParams.append("key", apiKey.toString());

          console.log("Making request to Gemini API...");
          response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: req.body.prompt,
                }],
              }],
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
              },
            }),
          });
          break;

        case 'openrouter':
          console.log("Making request to OpenRouter API...");
          response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'HTTP-Referer': req.headers.origin || 'http://localhost:5000',
              'X-Title': 'Prompt Template Manager',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: "anthropic/claude-3-haiku",  // Default to a reliable model
              messages: [{
                role: "user",
                content: req.body.prompt
              }],
              temperature: 0.7,
              max_tokens: 1024,
            })
          });
          break;

        // Add other providers here as needed
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }

      console.log("API response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`${provider} API error:`, errorText);
        throw new Error(`${provider} API error: ${errorText}`);
      }

      const data = await response.json();
      console.log(`${provider} API response data:`, JSON.stringify(data, null, 2));

      let enhancedPrompt;

      // Extract the response based on provider
      switch (provider) {
        case 'google':
          if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error("Unexpected response format from Gemini API");
          }
          enhancedPrompt = data.candidates[0].content.parts[0].text;
          break;

        case 'openrouter':
          if (!data.choices?.[0]?.message?.content) {
            throw new Error("Unexpected response format from OpenRouter API");
          }
          enhancedPrompt = data.choices[0].message.content;
          break;

        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }

      res.json({ enhancedPrompt });
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
      res.status(500).json({ 
        message: "Failed to enhance prompt",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}