"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  AlertTriangle,
  Shield,
  Eye,
  Upload,
  Download,
  Search,
  FileText,
  Globe,
  Loader2,
  Wifi,
  Camera,
  Copy,
  Check,
  X,
  Rocket,
  RefreshCw,
  SkipForward,
  Layers,
  Terminal,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import ResearchBriefingPanel from "@/components/research-briefing-panel";

type ErrorScenario = "waf_blocked" | "timeout" | "empty_extraction" | "token_limit";

interface SourceItem {
  url: string;
  domain: string;
  status: "success" | "failed";
  tokens: number;
  error?: string;
}

const mockSources: SourceItem[] = [
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

const mockErrorLog = `{
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

const errorScenarios: Record<ErrorScenario, {
  severity: "critical" | "warning" | "caution";
  title: string;
  subtitle: string;
  code: string;
}> = {
  waf_blocked: {
    severity: "critical",
    title: "Research Blocked by Anti-Bot Protection",
    subtitle: "Cloudflare WAF and CAPTCHA challenges prevented automated access to 3 target sources.",
    code: "err_waf_blocked",
  },
  timeout: {
    severity: "warning",
    title: "Network Timeout — Servers Unreachable",
    subtitle: "Target servers took too long to respond or are currently offline. 3 sources could not be fetched.",
    code: "err_timeout",
  },
  empty_extraction: {
    severity: "warning",
    title: "Content Extraction Failed",
    subtitle: "We accessed the pages successfully (HTTP 200) but couldn't read the content — likely hidden behind complex JavaScript or a login wall.",
    code: "err_empty_extraction",
  },
  token_limit: {
    severity: "caution",
    title: "Context Limit Exceeded",
    subtitle: "The gathered data is too large to analyze in a single pass. Token usage has exceeded the model's context window.",
    code: "err_token_limit_exceeded",
  },
};

const severityStyles = {
  critical: { bg: "bg-red-50", border: "border-red-200", iconBg: "bg-red-100", iconColor: "text-red-500", titleColor: "text-red-800", textColor: "text-red-600" },
  warning: { bg: "bg-orange-50", border: "border-orange-200", iconBg: "bg-orange-100", iconColor: "text-orange-500", titleColor: "text-orange-800", textColor: "text-orange-600" },
  caution: { bg: "bg-yellow-50", border: "border-yellow-200", iconBg: "bg-yellow-100", iconColor: "text-yellow-600", titleColor: "text-yellow-800", textColor: "text-yellow-700" },
};

export default function SmartSearchFailed() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const [leftExpanded, setLeftExpanded] = useState(false);
  const [activeScenario, setActiveScenario] = useState<ErrorScenario>("waf_blocked");
  const [showDevConsole, setShowDevConsole] = useState(false);
  const [retryLoading, setRetryLoading] = useState(false);
  const [visionLoading, setVisionLoading] = useState(false);
  const [summarizeLoading, setSummarizeLoading] = useState(false);
  const [logsCopied, setLogsCopied] = useState(false);
  const [excludedSources, setExcludedSources] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scenario = errorScenarios[activeScenario];
  const styles = severityStyles[scenario.severity];
  const successfulSources = mockSources.filter(s => s.status === "success");
  const failedSources = mockSources.filter(s => s.status === "failed");
  const totalTokens = successfulSources.reduce((sum, s) => sum + s.tokens, 0);

  const handleRetry = () => {
    setRetryLoading(true);
    setTimeout(() => setRetryLoading(false), 3000);
  };

  const handleVision = () => {
    setVisionLoading(true);
    setTimeout(() => setVisionLoading(false), 3000);
  };

  const handleSummarize = () => {
    setSummarizeLoading(true);
    setTimeout(() => setSummarizeLoading(false), 3000);
  };

  const copyLogs = () => {
    navigator.clipboard.writeText(mockErrorLog);
    setLogsCopied(true);
    setTimeout(() => setLogsCopied(false), 2000);
  };

  return (
    <div className="-m-6 md:-m-8 flex h-[calc(100vh-64px)] w-[calc(100%+48px)] md:w-[calc(100%+64px)] overflow-hidden bg-gray-50" data-testid="failed-page">
      <ResearchBriefingPanel expanded={leftExpanded} onToggle={() => setLeftExpanded(!leftExpanded)} />

      <div className="flex-1 min-w-[600px] flex flex-col overflow-hidden" data-testid="panel-right">
        <div className="sticky top-0 z-10 border-b border-gray-200 px-3 py-2 flex items-center gap-3 shrink-0 bg-[#dddddd]">
          <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0 bg-[#dddddd] text-[#191c1c]">
            <Rocket className="w-4 h-4 text-white" />
          </div>
          <p className="text-xs font-medium text-gray-700 flex-1 leading-snug line-clamp-2" data-testid="text-project-title">
            Project Name: Acuras Pro — Intelligent Deep Search Agent 1. Project Overview & Core Mission Acura...
          </p>
          <span className="text-xs font-medium text-red-500 shrink-0" data-testid="text-status-failed">
            Research Failed
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1100px] mx-auto p-6 space-y-5">

            {/* Error Scenario Tabs */}
            <div className="flex items-center gap-2 flex-wrap" data-testid="tabs-error-scenarios">
              {(Object.keys(errorScenarios) as ErrorScenario[]).map((key) => {
                const s = errorScenarios[key];
                const sev = severityStyles[s.severity];
                return (
                  <button
                    key={key}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-[10px] font-bold border transition-all",
                      activeScenario === key
                        ? `${sev.bg} ${sev.border} ${sev.titleColor}`
                        : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                    )}
                    onClick={() => setActiveScenario(key)}
                    data-testid={`tab-scenario-${key}`}
                  >
                    {s.severity === "critical" ? "🔴" : s.severity === "warning" ? "🟠" : "🟡"} {s.code}
                  </button>
                );
              })}
            </div>

            {/* Top Banner */}
            <div className={cn(styles.bg, "border", styles.border, "rounded-lg p-4 flex items-start gap-3")} data-testid="card-error-banner">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5", styles.iconBg)}>
                <AlertTriangle className={cn("w-4 h-4", styles.iconColor)} />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h2 className={cn("text-sm font-bold", styles.titleColor)} data-testid="text-error-title">{scenario.title}</h2>
                  <Badge variant="outline" className={cn("text-[9px] font-mono", styles.border, styles.textColor)}>{scenario.code}</Badge>
                </div>
                <p className={cn("text-xs leading-relaxed", styles.textColor)}>{scenario.subtitle}</p>
              </div>
            </div>

            {/* Scenario-Specific Resolution Cards */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-800">Recovery Options</h3>

              {activeScenario === "waf_blocked" && (
                <div className="grid grid-cols-2 gap-4" data-testid="grid-waf-cards">
                  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow" data-testid="card-proxy">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                          <Wifi className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">Premium Routing</h4>
                          <p className="text-[10px] text-gray-400">Residential Proxies</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[9px] border-red-200 text-red-500 py-0">403 Forbidden</Badge>
                        <Badge variant="outline" className="text-[9px] border-orange-200 text-orange-500 py-0">CAPTCHA</Badge>
                        <Badge variant="outline" className="text-[9px] border-red-200 text-red-500 py-0">WAF</Badge>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">Use premium residential IPs to simulate real user traffic. Bypasses IP-based blocks and geo-restrictions.</p>
                      <Button className="w-full h-9 text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white gap-2 shadow-sm" onClick={handleRetry} disabled={retryLoading} data-testid="button-proxy-retry">
                        {retryLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Routing through residential network...</> : <><Shield className="w-3.5 h-3.5" /> Upgrade & Retry ($2.40)</>}
                      </Button>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow" data-testid="card-vision">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                          <Camera className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">Visual Extraction</h4>
                          <p className="text-[10px] text-gray-400">Vision Engine</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[9px] border-purple-200 text-purple-500 py-0">Empty HTML</Badge>
                        <Badge variant="outline" className="text-[9px] border-purple-200 text-purple-500 py-0">JS Render</Badge>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">Take a screenshot of the page and use Vision AI to read the text like a human.</p>
                      <Button variant="outline" className="w-full h-9 text-xs font-bold border-purple-300 text-purple-600 hover:bg-purple-50 gap-2" onClick={handleVision} disabled={visionLoading} data-testid="button-vision-retry">
                        {visionLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Capturing & analyzing...</> : <><Eye className="w-3.5 h-3.5" /> Retry with Vision Engine</>}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeScenario === "timeout" && (
                <div className="grid grid-cols-2 gap-4" data-testid="grid-timeout-cards">
                  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow" data-testid="card-retry-timeout">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <RefreshCw className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">Retry Failed Sources</h4>
                          <p className="text-[10px] text-gray-400">Extended Timeout</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">Re-attempt fetching the failed sources with extended timeout settings (60s instead of 30s). Servers may have recovered.</p>
                      <Button className="w-full h-9 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white gap-2" onClick={handleRetry} disabled={retryLoading} data-testid="button-retry-sources">
                        {retryLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Retrying with extended timeout...</> : <><RefreshCw className="w-3.5 h-3.5" /> Retry Failed Sources</>}
                      </Button>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow" data-testid="card-skip-offline">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                          <SkipForward className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">Skip Offline Sources</h4>
                          <p className="text-[10px] text-gray-400">Proceed with available data</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">Abort the failed links and proceed to report generation with the remaining {successfulSources.length} valid data sources.</p>
                      <Button variant="outline" className="w-full h-9 text-xs font-bold border-gray-300 text-gray-700 hover:bg-gray-50 gap-2" onClick={() => navigate(`/research-success/${params.id || "1"}`)} data-testid="button-skip-sources">
                        <SkipForward className="w-3.5 h-3.5" /> Skip & Generate Report
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeScenario === "empty_extraction" && (
                <div className="grid grid-cols-2 gap-4" data-testid="grid-extraction-cards">
                  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow" data-testid="card-switch-vision">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                          <Camera className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">Switch to Vision Engine</h4>
                          <p className="text-[10px] text-gray-400">Screenshot + OCR</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">Take a headless screenshot of each page and use Vision AI (OCR) to extract text content that standard parsing missed.</p>
                      <Button className="w-full h-9 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white gap-2" onClick={handleVision} disabled={visionLoading} data-testid="button-vision-switch">
                        {visionLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing with Vision AI...</> : <><Eye className="w-3.5 h-3.5" /> Switch to Vision Engine</>}
                      </Button>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow" data-testid="card-manual-upload">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Upload className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">Manual Upload</h4>
                          <p className="text-[10px] text-gray-400">PDF / HTML copies</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">Upload PDF or HTML copies of the blocked pages. The system will inject them directly into the agent's context.</p>
                      <input type="file" ref={fileInputRef} className="hidden" multiple accept=".pdf,.html,.txt,.md,.docx" />
                      <Button variant="outline" className="w-full h-9 text-xs font-bold border-gray-300 text-gray-700 hover:bg-gray-50 gap-2" onClick={() => fileInputRef.current?.click()} data-testid="button-upload">
                        <Upload className="w-3.5 h-3.5" /> Upload Files
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeScenario === "token_limit" && (
                <div className="space-y-4" data-testid="grid-token-cards">
                  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm" data-testid="card-token-usage">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                            <Layers className="w-4 h-4 text-red-500" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-900">Token Usage</h4>
                            <p className="text-[10px] text-gray-400">Context window capacity</p>
                          </div>
                        </div>
                        <Badge className="bg-red-100 text-red-600 text-[10px] font-bold border border-red-200">120% — Over Limit</Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-gray-500">
                          <span>Token usage: 156,000 / 128,000</span>
                          <span className="text-red-500 font-bold">+28,000 over</span>
                        </div>
                        <Progress value={100} className="h-2 [&>div]:bg-red-500" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow" data-testid="card-auto-summarize">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Layers className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-900">Auto-Summarize Sources</h4>
                            <p className="text-[10px] text-gray-400">Map-Reduce Compression</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">Run an intermediate summarization step to compress raw data before final synthesis. Preserves key insights while reducing token count.</p>
                        <Button className="w-full h-9 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white gap-2" onClick={handleSummarize} disabled={summarizeLoading} data-testid="button-auto-summarize">
                          {summarizeLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Summarizing sources...</> : <><Layers className="w-3.5 h-3.5" /> Auto-Summarize Sources</>}
                        </Button>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm" data-testid="card-exclude-sources">
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-gray-900">Exclude Heavy Sources</h4>
                        <p className="text-xs text-gray-500">Uncheck sources to reduce token count manually:</p>
                        <div className="space-y-1 max-h-[150px] overflow-y-auto">
                          {successfulSources.map((s, i) => (
                            <label key={i} className="flex items-center gap-2 text-xs text-gray-600 p-1 hover:bg-gray-50 rounded cursor-pointer" data-testid={`checkbox-source-${i}`}>
                              <div
                                className={cn("w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer",
                                  excludedSources.includes(i) ? "border-gray-300 bg-gray-100" : "bg-green-600 border-green-600"
                                )}
                                onClick={() => setExcludedSources(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
                              >
                                {!excludedSources.includes(i) && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <span className={cn("flex-1 truncate", excludedSources.includes(i) && "line-through text-gray-400")}>{s.domain}</span>
                              <span className="text-[10px] text-gray-400 shrink-0">{s.tokens.toLocaleString()} tokens</span>
                            </label>
                          ))}
                        </div>
                        {excludedSources.length > 0 && (
                          <p className="text-[10px] text-green-600 font-medium">
                            Saved: {excludedSources.reduce((sum, i) => sum + (successfulSources[i]?.tokens || 0), 0).toLocaleString()} tokens
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Developer Console */}
            <div className="border border-gray-200 rounded-lg overflow-hidden" data-testid="card-dev-console">
              <button
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => setShowDevConsole(!showDevConsole)}
                data-testid="button-toggle-dev-console"
              >
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-bold text-gray-700">View Technical Logs</span>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-gray-500 transition-transform duration-200", showDevConsole && "rotate-180")} />
              </button>
              {showDevConsole && (
                <div className="relative">
                  <button
                    className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-green-400 text-[10px] font-bold transition-colors z-10"
                    onClick={copyLogs}
                    data-testid="button-copy-logs"
                  >
                    {logsCopied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy Logs</>}
                  </button>
                  <pre className="bg-slate-900 text-green-400 font-mono text-[11px] p-4 overflow-x-auto leading-relaxed max-h-[300px] overflow-y-auto" data-testid="text-error-logs">
                    {mockErrorLog}
                  </pre>
                </div>
              )}
            </div>

            {/* Recovered Context — Source Grid */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden" data-testid="card-recovered-context">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-gray-700">Recovered Context</h3>
                  <Badge className="bg-green-100 text-green-700 text-[10px] font-bold border border-green-200 gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" /> {successfulSources.length} of {mockSources.length} sources
                  </Badge>
                  <span className="text-[10px] text-gray-400">{totalTokens.toLocaleString()} tokens collected</span>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {mockSources.map((source, i) => (
                  <div
                    key={i}
                    className={cn("flex items-center gap-3 px-4 py-2.5 text-xs", source.status === "failed" && "bg-red-50/50")}
                    data-testid={`row-source-${i}`}
                  >
                    {source.status === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <span className={cn("font-medium truncate block", source.status === "failed" ? "text-red-600" : "text-gray-700")}>
                        {source.domain}
                      </span>
                      <span className="text-[10px] text-gray-400 truncate block">{source.url}</span>
                    </div>
                    {source.status === "success" ? (
                      <span className="text-[10px] text-gray-400 shrink-0">{source.tokens.toLocaleString()} tokens</span>
                    ) : (
                      <span className="text-[10px] text-red-400 shrink-0">{source.error}</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-end">
                <Button
                  className="bg-[#00802b] hover:bg-[#006622] text-white h-9 px-6 text-xs font-bold gap-2"
                  onClick={() => navigate(`/research-success/${params.id || "1"}`)}
                  data-testid="button-proceed-partial"
                >
                  <ArrowRight className="w-3.5 h-3.5" /> Proceed with Partial Data
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
