import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const models = pgTable("models", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // "model" or "tour"
  category: text("category").notNull(),
  color: text("color").notNull(),
  imageUrl: text("image_url").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const insertModelSchema = createInsertSchema(models).omit({
  id: true,
});

export type InsertModel = z.infer<typeof insertModelSchema>;
export type Model = typeof models.$inferSelect;
