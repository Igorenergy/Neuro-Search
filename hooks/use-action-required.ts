import { useQuery } from "@tanstack/react-query";
import type { ActionRequiredData } from "@/lib/types";

const MOCK_PARTIAL_CONTENT = `# Partial Research Report — AI Platform Competitive Analysis

## Executive Summary (Incomplete)

The AI platform market has undergone significant transformation in Q1 2025. Our analysis identified **47 active competitors** across three primary segments: enterprise automation, developer tools, and consumer AI assistants.

### Key Findings (Before Interruption)

1. **Market Size**: The global AI platform market reached approximately $52.4B in annual recurring revenue as of January 2025, representing a 34% year-over-year increase.

2. **Top Players by Revenue**:
   | Rank | Company | Est. ARR | Growth |
   |------|---------|----------|--------|
   | 1 | OpenAI | $11.6B | +128% |
   | 2 | Google DeepMind | $8.2B | +45% |
   | 3 | Anthropic | $4.1B | +210% |
   | 4 | Microsoft (Copilot) | $3.8B | +67% |

3. **Emerging Trends**:
   - Agent-based architectures are replacing simple chatbot interfaces
   - Multi-modal capabilities (text + vision + audio) becoming table stakes
   - On-premise deployment options growing in demand from regulated industries

## Competitive Landscape (Section 2 of 8)

### Segment A: Enterprise Automation Platforms

Enterprise automation platforms focus on workflow optimization and process intelligence. Key differentiators include:

- **Integration depth**: Number of native connectors to enterprise systems (SAP, Salesforce, etc.)
- **Compliance certifications**: SOC2, HIPAA, FedRAMP readiness
- **Customization**: Ability to fine-tune models on proprietary data

> ⚠️ **Data collection interrupted at this point.**
> The scraper was blocked by Cloudflare's bot protection on 3 target websites.
> Pages affected: crunchbase.com/organization/*, techcrunch.com/2025/*, pitchbook.com/profiles/*

---

*Report generation: 35% complete. 12 of 34 data sources successfully scraped before interruption.*`;

export function useActionRequired(projectId: string) {
  return useQuery<ActionRequiredData>({
    queryKey: ["/api/projects", projectId, "action-required"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/action-required`);
        if (!res.ok) throw new Error("Failed");
        return res.json();
      } catch {
        return {
          projectId,
          partialContent: MOCK_PARTIAL_CONTENT,
          totalPages: 20,
          completionPercent: 35,
        };
      }
    },
  });
}
