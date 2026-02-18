import {
  type User, type InsertUser,
  type ResearchProject, type InsertResearchProject,
  type ResearchPlan, type InsertResearchPlan,
  type ResearchFile, type InsertResearchFile,
  users, researchProjects, researchPlans, researchFiles
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getResearchProjects(): Promise<ResearchProject[]>;
  getResearchProject(id: string): Promise<ResearchProject | undefined>;
  createResearchProject(project: InsertResearchProject): Promise<ResearchProject>;
  updateResearchProject(id: string, data: Partial<InsertResearchProject>): Promise<ResearchProject | undefined>;

  getResearchPlans(projectId: string): Promise<ResearchPlan[]>;
  getResearchPlan(id: string): Promise<ResearchPlan | undefined>;
  createResearchPlan(plan: InsertResearchPlan): Promise<ResearchPlan>;

  getResearchFiles(projectId: string): Promise<ResearchFile[]>;
  createResearchFile(file: InsertResearchFile): Promise<ResearchFile>;
  deleteResearchFile(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getResearchProjects(): Promise<ResearchProject[]> {
    return db.select().from(researchProjects).orderBy(desc(researchProjects.createdAt));
  }

  async getResearchProject(id: string): Promise<ResearchProject | undefined> {
    const [project] = await db.select().from(researchProjects).where(eq(researchProjects.id, id));
    return project;
  }

  async createResearchProject(project: InsertResearchProject): Promise<ResearchProject> {
    const [created] = await db.insert(researchProjects).values(project).returning();
    return created;
  }

  async updateResearchProject(id: string, data: Partial<InsertResearchProject>): Promise<ResearchProject | undefined> {
    const [updated] = await db.update(researchProjects).set(data).where(eq(researchProjects.id, id)).returning();
    return updated;
  }

  async getResearchPlans(projectId: string): Promise<ResearchPlan[]> {
    return db.select().from(researchPlans).where(eq(researchPlans.projectId, projectId)).orderBy(desc(researchPlans.createdAt));
  }

  async getResearchPlan(id: string): Promise<ResearchPlan | undefined> {
    const [plan] = await db.select().from(researchPlans).where(eq(researchPlans.id, id));
    return plan;
  }

  async createResearchPlan(plan: InsertResearchPlan): Promise<ResearchPlan> {
    const [created] = await db.insert(researchPlans).values(plan).returning();
    return created;
  }

  async getResearchFiles(projectId: string): Promise<ResearchFile[]> {
    return db.select().from(researchFiles).where(eq(researchFiles.projectId, projectId)).orderBy(desc(researchFiles.createdAt));
  }

  async createResearchFile(file: InsertResearchFile): Promise<ResearchFile> {
    const [created] = await db.insert(researchFiles).values(file).returning();
    return created;
  }

  async deleteResearchFile(id: string): Promise<void> {
    await db.delete(researchFiles).where(eq(researchFiles.id, id));
  }
}

export const storage = new DatabaseStorage();
