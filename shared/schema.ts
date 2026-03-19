import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const researchProjects = pgTable("research_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  query: text("query").notNull(),
  researchType: text("research_type").notNull().default("search"),
  dataEngine: text("data_engine").notNull().default("ultimate"),
  languages: text("languages").array().default(sql`'{}'::text[]`),
  geoScope: text("geo_scope").notNull().default("global"),
  showReasoning: boolean("show_reasoning").notNull().default(true),
  deepCrawlEnabled: boolean("deep_crawl_enabled").notNull().default(false),
  estimatedCostMin: text("estimated_cost_min").default("0.45"),
  estimatedCostMax: text("estimated_cost_max").default("0.54"),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const researchPlans = pgTable("research_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull(),
  version: integer("version").notNull().default(1),
  steps: jsonb("steps").notNull().default(sql`'[]'::jsonb`),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projectSources = pgTable("project_sources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull(),
  title: text("title").notNull(),
  domain: text("domain").notNull().default(""),
  favicon: text("favicon").default(""),
  url: text("url").default(""),
  date: text("date").default(""),
  location: text("location").default(""),
  language: text("language").default("En"),
  confidenceScore: integer("confidence_score").default(0),
  included: boolean("included").notNull().default(true),
  type: text("type").notNull().default("web"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projectArtifacts = pgTable("project_artifacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull(),
  name: text("name").notNull(),
  fileType: text("file_type").notNull().default("pdf"),
  fileSize: text("file_size").default("0"),
  status: text("status").notNull().default("processing"),
  downloadUrl: text("download_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const researchFiles = pgTable("research_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  size: integer("size").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertResearchProjectSchema = createInsertSchema(researchProjects).omit({
  id: true,
  createdAt: true,
});

export const insertResearchPlanSchema = createInsertSchema(researchPlans).omit({
  id: true,
  createdAt: true,
});

export const insertResearchFileSchema = createInsertSchema(researchFiles).omit({
  id: true,
  createdAt: true,
});

export const insertProjectSourceSchema = createInsertSchema(projectSources).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectArtifactSchema = createInsertSchema(projectArtifacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertResearchProject = z.infer<typeof insertResearchProjectSchema>;
export type ResearchProject = typeof researchProjects.$inferSelect;
export type InsertResearchPlan = z.infer<typeof insertResearchPlanSchema>;
export type ResearchPlan = typeof researchPlans.$inferSelect;
export type InsertResearchFile = z.infer<typeof insertResearchFileSchema>;
export type ResearchFile = typeof researchFiles.$inferSelect;
export type InsertProjectSource = z.infer<typeof insertProjectSourceSchema>;
export type ProjectSource = typeof projectSources.$inferSelect;
export type InsertProjectArtifact = z.infer<typeof insertProjectArtifactSchema>;
export type ProjectArtifact = typeof projectArtifacts.$inferSelect;
