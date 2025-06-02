import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all models
  app.get("/api/models", async (_req, res) => {
    try {
      const models = await storage.getAllModels();
      res.json(models);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch models" });
    }
  });

  // Get model by ID
  app.get("/api/models/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const model = await storage.getModel(id);
      if (!model) {
        return res.status(404).json({ message: "Model not found" });
      }
      res.json(model);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch model" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
