import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const artifacts = await storage.getProjectArtifacts(id);
  return NextResponse.json(artifacts);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const artifact = await storage.createProjectArtifact({ ...body, projectId: id });
  return NextResponse.json(artifact, { status: 201 });
}
