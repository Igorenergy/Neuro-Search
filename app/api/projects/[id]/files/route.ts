import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { insertResearchFileSchema } from "@shared/schema";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const files = await storage.getResearchFiles(id);
  return NextResponse.json(files);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const data = { ...body, projectId: id };
  const parsed = insertResearchFileSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.message }, { status: 400 });
  }
  const file = await storage.createResearchFile(parsed.data);
  return NextResponse.json(file, { status: 201 });
}
