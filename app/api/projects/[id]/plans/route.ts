import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { insertResearchPlanSchema } from "@shared/schema";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const plans = await storage.getResearchPlans(id);
  return NextResponse.json(plans);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const data = { ...body, projectId: id };
  const parsed = insertResearchPlanSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.message }, { status: 400 });
  }
  const plan = await storage.createResearchPlan(parsed.data);
  return NextResponse.json(plan, { status: 201 });
}
