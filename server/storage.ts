import { models, type Model, type InsertModel } from "@shared/schema";

export interface IStorage {
  getModel(id: number): Promise<Model | undefined>;
  getAllModels(): Promise<Model[]>;
  createModel(model: InsertModel): Promise<Model>;
}

export class MemStorage implements IStorage {
  private models: Map<number, Model>;
  private currentId: number;

  constructor() {
    this.models = new Map();
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
    const seedModels: InsertModel[] = [
      {
        title: "Vintage Camera",
        description: "A beautifully detailed vintage camera model showcasing intricate mechanical components and classic design aesthetics.",
        type: "model",
        category: "Electronics",
        color: "#8B5CF6",
        imageUrl: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        isActive: true,
      },
      {
        title: "Space Explorer",
        description: "Futuristic spacecraft with detailed hull and advanced propulsion systems.",
        type: "model",
        category: "Vehicle",
        color: "#06B6D4",
        imageUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        isActive: true,
      },
      {
        title: "VR Headset Pro",
        description: "Next-generation VR device with haptic feedback and ultra-high resolution displays.",
        type: "model",
        category: "Technology",
        color: "#6366F1",
        imageUrl: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        isActive: true,
      },
      {
        title: "Museum Gallery",
        description: "Interactive virtual museum experience with detailed architectural elements.",
        type: "tour",
        category: "Architecture",
        color: "#F59E0B",
        imageUrl: "https://images.unsplash.com/photo-1554072675-66db59dba46f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        isActive: true,
      },
    ];

    seedModels.forEach(model => {
      this.createModel(model);
    });
  }

  async getModel(id: number): Promise<Model | undefined> {
    return this.models.get(id);
  }

  async getAllModels(): Promise<Model[]> {
    return Array.from(this.models.values()).filter(model => model.isActive);
  }

  async createModel(insertModel: InsertModel): Promise<Model> {
    const id = this.currentId++;
    const model: Model = { ...insertModel, id };
    this.models.set(id, model);
    return model;
  }
}

export const storage = new MemStorage();
