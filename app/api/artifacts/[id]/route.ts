import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const artifact = await storage.updateProjectArtifact(id, body);
  if (!artifact) {
    return NextResponse.json({ message: "Artifact not found" }, { status: 404 });
  }
  return NextResponse.json(artifact);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await storage.deleteProjectArtifact(id);
  return NextResponse.json({ success: true });
}
