import { useQuery } from "@tanstack/react-query";
import type { FailedSourceItem, ResearchErrorData } from "@/lib/types";

const MOCK_SOURCES: FailedSourceItem[] = [
  { url: "https://openai.com/research", domain: "openai.com", status: "success", tokens: 4200 },
  { url: "https://anthropic.com/claude", domain: "anthropic.com", status: "success", tokens: 3800 },
  { url: "https://deepmind.google/technologies", domain: "deepmind.google", status: "success", tokens: 5100 },
  { url: "https://platform.openai.com/docs", domain: "platform.openai.com", status: "success", tokens: 2900 },
  { url: "https://docs.perplexity.ai/guides", domain: "docs.perplexity.ai", status: "success", tokens: 3400 },
  { url: "https://huggingface.co/blog", domain: "huggingface.co", status: "success", tokens: 4600 },
  { url: "https://arxiv.org/abs/2401.12345", domain: "arxiv.org", status: "success", tokens: 6200 },
  { url: "https://techcrunch.com/2025/ai-market", domain: "techcrunch.com", status: "failed", tokens: 0, error: "HTTP 403 — Cloudflare WAF" },
  { url: "https://crunchbase.com/organization/openai", domain: "crunchbase.com", status: "failed", tokens: 0, error: "CAPTCHA challenge detected" },
  { url: "https://pitchbook.com/profiles/anthropic", domain: "pitchbook.com", status: "failed", tokens: 0, error: "HTTP 504 — Gateway Timeout" },
];

const MOCK_ERROR_LOG = `{
  "error_code": "err_waf_blocked",
  "step": "fetch_url",
  "failed_sources": [
    {
      "url": "https://techcrunch.com/2025/ai-market",
      "status": 403,
      "error": "Cloudflare WAF block detected",
      "headers": {
        "cf-ray": "8a1b2c3d4e5f6g7h",
        "server": "cloudflare",
        "cf-mitigated": "challenge"
      },
      "retry_count": 3,
      "last_attempt": "2025-02-19T14:32:18Z"
    },
    {
      "url": "https://crunchbase.com/organization/openai",
      "status": 403,
      "error": "CAPTCHA challenge required",
      "headers": {
        "x-captcha-required": "true",
        "cf-ray": "9b2c3d4e5f6g7h8i"
      },
      "retry_count": 2,
      "last_attempt": "2025-02-19T14:32:22Z"
    },
    {
      "url": "https://pitchbook.com/profiles/anthropic",
      "status": 504,
      "error": "Gateway timeout after 30000ms",
      "retry_count": 3,
      "last_attempt": "2025-02-19T14:33:01Z"
    }
  ],
  "successful_sources": 7,
  "total_tokens_collected": 30200,
  "agent_session_id": "sess_a1b2c3d4e5f6",
  "timestamp": "2025-02-19T14:33:05Z"
}`;

export function useResearchErrors(projectId: string) {
  return useQuery<ResearchErrorData>({
    queryKey: ["/api/projects", projectId, "errors"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/errors`);
        if (!res.ok) throw new Error("Failed");
        return res.json();
      } catch {
        return {
          projectId,
          sources: MOCK_SOURCES,
          errorLog: MOCK_ERROR_LOG,
          activeScenario: "waf_blocked" as const,
        };
      }
    },
  });
}
