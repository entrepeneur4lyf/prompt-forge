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
      const allTemplates = await db.select().from(templates);
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
      const [template] = await db
        .insert(templates)
        .values(req.body)
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

  // Gemini API Integration
  app.post("/api/enhance", async (req, res) => {
    try {
      const apiKey = req.headers["x-api-key"];
      console.log("Enhance request received. API key present:", !!apiKey);

      if (!apiKey) {
        return res.status(401).json({ message: "API key is required" });
      }

      console.log("Making request to Gemini API...");
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: req.body.prompt,
              }],
            }],
          }),
        }
      );

      console.log("Gemini API response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API error:", errorText);
        throw new Error(`Gemini API error: ${errorText}`);
      }

      const data = await response.json();
      console.log("Gemini API response data:", JSON.stringify(data, null, 2));

      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("Unexpected response format from Gemini API");
      }

      const enhancedPrompt = data.candidates[0].content.parts[0].text;
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