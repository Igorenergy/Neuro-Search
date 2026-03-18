import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const source = await storage.updateProjectSource(id, body);
  if (!source) {
    return NextResponse.json({ message: "Source not found" }, { status: 404 });
  }
  return NextResponse.json(source);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await storage.deleteProjectSource(id);
  return NextResponse.json({ success: true });
}
