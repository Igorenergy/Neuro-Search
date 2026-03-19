import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function POST() {
  const existingProjects = await storage.getResearchProjects();
  if (existingProjects.length > 0) {
    return NextResponse.json({ message: "Data already seeded", projects: existingProjects });
  }

  const project = await storage.createResearchProject({
    query: "Conduct a detailed analysis of the functionality of the website sepalai.com, focusing on its core operations and user interface. Examine the business model including revenue streams such as subscriptions, commissions, or freemium elements.",
    researchType: "search",
    dataEngine: "ultimate",
    languages: ["en"],
    geoScope: "global",
    showReasoning: true,
    deepCrawlEnabled: false,
    estimatedCostMin: "15.4",
    estimatedCostMax: "18.4",
    status: "plan_ready",
  });

  const planSteps = [
    "(1) Conduct a detailed analysis of the functionality of the website sepalai.com, focusing on its core operations and user interface.",
    "(2) Examine the business model of sepalai.com, including revenue streams such as subscriptions, commissions, or freemium elements.",
    "(3) Highlight the key features of sepalai.com's AI technology specifically designed to connect startups with investors.",
    "(4) Emphasize how sepalai.com's AI facilitates matchmaking, investor recommendations, and deal flow optimization.",
    "(5) Perform a comprehensive search for platforms and tools that offer AI-based matching for startups and investors.",
    "(6) Identify tools providing AI-driven scoring systems to evaluate startup potential and investor compatibility.",
    "(7) Explore solutions that automate the investor search process for startups using artificial intelligence.",
    "(8) From the discovered solutions, filter and identify projects founded by immigrants from Ukraine.",
    "(9) Utilize targeted search queries to uncover additional platforms created by Ukrainian diaspora entrepreneurs.",
    "(10) Verify the biographies of founders from potentially suitable platforms, such as Unicorn Nest and similar analogues.",
    "(11) Confirm the Ukrainian origin of founders through reliable sources like LinkedIn profiles, company about pages, or public records.",
    "(12) For each selected project, gather precise details on their AI component's mechanics, algorithms, data sources, and user benefits, then compare these services with sepalai.com in terms of functionality, AI sophistication, and target audience demographics...",
  ];

  for (let v = 1; v <= 4; v++) {
    await storage.createResearchPlan({
      projectId: project.id,
      version: v,
      steps: planSteps,
      isActive: v === 1,
    });
  }

  const mockFiles = [
    { name: "Market Analysis Q3.pdf", type: "pdf", size: 245000 },
    { name: "Competitor Report 2024.docx", type: "docx", size: 182000 },
    { name: "User Interviews.txt", type: "txt", size: 45000 },
    { name: "Financial Projections.xlsx", type: "xlsx", size: 312000 },
  ];

  for (const file of mockFiles) {
    await storage.createResearchFile({
      projectId: project.id,
      ...file,
    });
  }

  return NextResponse.json({ message: "Seed data created", projectId: project.id }, { status: 201 });
}
