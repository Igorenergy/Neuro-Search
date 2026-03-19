import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { insertResearchProjectSchema } from "@shared/schema";

export async function GET() {
  const projects = await storage.getResearchProjects();
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = insertResearchProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.message }, { status: 400 });
  }
  const project = await storage.createResearchProject(parsed.data);
  return NextResponse.json(project, { status: 201 });
}
