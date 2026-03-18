import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sources = await storage.getProjectSources(id);
  return NextResponse.json(sources);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const source = await storage.createProjectSource({ ...body, projectId: id });
  return NextResponse.json(source, { status: 201 });
}
