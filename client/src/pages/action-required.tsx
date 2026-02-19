import { useState, useRef } from "react";
import { useParams, Link } from "wouter";
import {
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Shield,
  Eye,
  Upload,
  Download,
  Search,
  FileText,
  Globe,
  Loader2,
  Puzzle,
  Wifi,
  Camera,
  ChevronDown,
  Copy,
  Paperclip,
  MoreVertical,
  X,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const mockBriefingHistory = [
  { id: 1, title: "Реестр 492 Компаний: Полный анализ и стратегический обзор...", icon: Paperclip },
  { id: 2, title: "Мемуары Криптана: Ретроспективный анализ криптозимы...", icon: Paperclip },
  { id: 3, title: "AI Platform Competitive Analysis: Deep Research...", icon: Paperclip },
  { id: 4, title: "FinTech Market Intelligence Report 2025...", icon: MoreVertical },
];

const mockPartialContent = `# Partial Research Report — AI Platform Competitive Analysis

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

export default function ActionRequired() {
  const params = useParams<{ id: string }>();
  const [leftExpanded, setLeftExpanded] = useState(false);
  const [briefingExpanded, setBriefingExpanded] = useState(false);
  const [queryExpanded, setQueryExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 20;
  const [searchQuery, setSearchQuery] = useState("");
  const [extensionInstalled] = useState(false);
  const [proxyLoading, setProxyLoading] = useState(false);
  const [visionLoading, setVisionLoading] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProxyRetry = () => {
    setProxyLoading(true);
    setTimeout(() => setProxyLoading(false), 3000);
  };

  const handleVisionRetry = () => {
    setVisionLoading(true);
    setTimeout(() => setVisionLoading(false), 3000);
  };

  return (
    <div className="-m-6 md:-m-8 flex h-[calc(100vh-64px)] w-[calc(100%+48px)] md:w-[calc(100%+64px)] overflow-hidden bg-gray-50" data-testid="action-required-page">
      {/* Left Panel: Briefing History */}
      <div
        className={cn(
          "shrink-0 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden relative flex flex-col",
          leftExpanded ? "w-[350px]" : "w-[50px]"
        )}
        data-testid="panel-left"
      >
        <button
          className="absolute top-1/2 -translate-y-1/2 right-0 z-10 w-5 h-12 bg-gray-100 border border-gray-200 border-r-0 rounded-l-sm flex items-center justify-center hover:bg-gray-200 transition-colors"
          onClick={() => setLeftExpanded(!leftExpanded)}
          data-testid="button-toggle-left"
        >
          {leftExpanded ? <ChevronLeft className="w-3 h-3 text-gray-500" /> : <ChevronRight className="w-3 h-3 text-gray-500" />}
        </button>

        {leftExpanded && (
          <div className="flex flex-col h-full bg-[#f8f9fa]">
            <div className="p-4 bg-[#E5E7EB] border-b border-gray-200">
              <h2 className="text-base font-bold text-[#1a2b3b]">Research Briefing</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {/* Query Section */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">QUERY</span>
                  <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setQueryExpanded(!queryExpanded)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", queryExpanded && "rotate-180")} />
                    </button>
                  </div>
                </div>
                <div className={cn("relative", !queryExpanded && "max-h-[120px] overflow-hidden")}>
                  <p className="text-[13px] text-gray-700 leading-relaxed font-medium">
                    🚀 Project Name: Acuras Pro — Intelligent Deep Search Agent 1. Project Overview & Core Mission Acuras Pro is a high-end B2B SaaS application designed for Deep Research and Strategic Intelligence. unlike standard search engines, Acuras Pro uses multi-agent AI to conduct comprehensive investigations, verify data sources, and synthesize complex answers from the web and internal repositories.
                  </p>
                  {!queryExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#f8f9fa] to-transparent" />
                  )}
                </div>
              </div>

              {/* Briefing Section */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">BRIEFING</span>
                  <button 
                    onClick={() => setBriefingExpanded(!briefingExpanded)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", briefingExpanded && "rotate-180")} />
                  </button>
                </div>
                <div className={cn("relative space-y-4", !briefingExpanded && "max-h-[300px] overflow-hidden")}>
                  <p className="text-[13px] text-gray-600 leading-relaxed">
                    The core philosophy of the UX is "Evidence Over Noise" and "No Dead Ends." The interface is built to guide the user from a vague query to a verified, data-backed report, ensuring that every search yields a result—either from the live web or the internal archives.
                  </p>
                  <p className="text-[13px] text-gray-600 leading-relaxed">
                    Key Vibe: Precision-focused, data-dense, "Cyber-Corporate," and high-trust. 2. Application Architecture (Page Tree) The application is streamlined into four interconnected search & analysis modules:
                  </p>
                  <p className="text-[13px] text-gray-600 leading-relaxed">
                    Research Mode (Dashboard): The command center for monitoring active agents, viewing the "Research Log," and managing costs/tokens.
                  </p>
                  <p className="text-[13px] text-gray-600 leading-relaxed">
                    Smart Search (The Core Engine): A hybrid search interface (Semantic + Keywords) for launching new operations. It supports "Contextual Injection" via file uploads.
                  </p>
                  {!briefingExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#f8f9fa] to-transparent" />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {!leftExpanded && (
          <div className="flex flex-col items-center justify-center h-full">
            <span
              className="text-xs font-bold text-gray-500 tracking-widest whitespace-nowrap"
              style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
            >
              RESEARCH BRIEFING
            </span>
          </div>
        )}
      </div>

      {/* Right Panel: Main Error Dashboard */}
      <div className="flex-1 min-w-[600px] flex flex-col overflow-hidden" data-testid="panel-right">
        {/* Context Bar */}
        <div className="sticky top-0 z-10 border-b border-gray-200 px-3 py-2 flex items-center gap-3 shrink-0 bg-[#dddddd]">
          <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0 bg-[#dddddd] text-[#191c1c]">
            <Rocket className="w-4 h-4 text-white" />
          </div>
          <p className="text-xs font-medium text-gray-700 flex-1 leading-snug line-clamp-2" data-testid="text-project-title">
            Project Name: Acuras Pro — Intelligent Deep Search Agent 1. Project Overview & Core Mission Acura...
          </p>
          <span className="text-xs font-medium text-orange-500 shrink-0" data-testid="text-status-cancelled">
            Research is cancel
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1100px] mx-auto p-6 space-y-5">

          {/* Error Summary Banner */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3" data-testid="card-error-summary">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-red-800" data-testid="text-error-title">Scraping Blocked — 3 Sources Unreachable</h2>
              <p className="text-xs text-red-600 leading-relaxed">
                The AI agent encountered fatal errors on <span className="font-bold">crunchbase.com</span>, <span className="font-bold">techcrunch.com</span>, and <span className="font-bold">pitchbook.com</span>. 
                Cloudflare bot protection and CAPTCHA challenges blocked automated access. Choose a resolution strategy below to continue your research.
              </p>
            </div>
          </div>

          {/* Resolution Matrix */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-800">Resolution Strategies</h3>

            {/* Tier 1: Pro Way — Browser Extension */}
            <div className="bg-gradient-to-r from-[#008DA8]/5 to-[#0097B2]/5 border border-[#008DA8]/30 rounded-lg p-5" data-testid="card-tier1">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-[#008DA8] text-white text-[9px] font-bold px-2 py-0">RECOMMENDED</Badge>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="space-y-1 flex-1 pr-6">
                  <div className="flex items-center gap-2">
                    <Puzzle className="w-4 h-4 text-[#008DA8]" />
                    <h4 className="text-sm font-bold text-gray-900">Browser Extension Bridge</h4>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Route the request through your local browser to bypass server-side IP bans. The extension acts as a bridge, using your authenticated session and residential IP to access blocked pages seamlessly.
                  </p>
                </div>
                <Button
                  className={cn(
                    "shrink-0 h-9 px-5 text-xs font-bold gap-2",
                    extensionInstalled
                      ? "bg-[#008DA8] hover:bg-[#007A92] text-white"
                      : "bg-white border-2 border-[#008DA8] text-[#008DA8] hover:bg-[#008DA8]/5"
                  )}
                  data-testid="button-extension"
                >
                  {extensionInstalled ? (
                    <>
                      <Globe className="w-3.5 h-3.5" /> Retry via Extension
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" /> Install Extension
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Tier 2: Algorithmic Bypasses — 2 Column Grid */}
            <div className="grid grid-cols-2 gap-4" data-testid="grid-tier2">
              {/* Card A: Premium Routing */}
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
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="text-[9px] border-red-200 text-red-500 py-0">403 Forbidden</Badge>
                      <Badge variant="outline" className="text-[9px] border-orange-200 text-orange-500 py-0">CAPTCHA</Badge>
                      <Badge variant="outline" className="text-[9px] border-red-200 text-red-500 py-0">WAF</Badge>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Use premium residential IPs to simulate real user traffic. Bypasses IP-based blocks and geo-restrictions.
                    </p>
                  </div>
                  <Button
                    className="w-full h-9 text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white gap-2 shadow-sm"
                    onClick={handleProxyRetry}
                    disabled={proxyLoading}
                    data-testid="button-proxy-retry"
                  >
                    {proxyLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Routing through residential network...
                      </>
                    ) : (
                      <>
                        <Shield className="w-3.5 h-3.5" />
                        Upgrade & Retry ($2.40)
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Card B: Visual Extraction */}
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
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="text-[9px] border-purple-200 text-purple-500 py-0">Empty HTML</Badge>
                      <Badge variant="outline" className="text-[9px] border-purple-200 text-purple-500 py-0">JS Render</Badge>
                      <Badge variant="outline" className="text-[9px] border-purple-200 text-purple-500 py-0">Obfuscated</Badge>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Take a screenshot of the page and use Vision AI to read the text like a human. Works on heavily JS-rendered pages.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full h-9 text-xs font-bold border-purple-300 text-purple-600 hover:bg-purple-50 gap-2"
                    onClick={handleVisionRetry}
                    disabled={visionLoading}
                    data-testid="button-vision-retry"
                  >
                    {visionLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Capturing & analyzing pages...
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        Retry with Vision Engine
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Tier 3: Manual Fallback */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50/50 p-5 hover:border-gray-400 hover:bg-gray-100/50 transition-all cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              data-testid="card-manual-upload"
            >
              <input type="file" ref={fileInputRef} className="hidden" multiple accept=".pdf,.html,.txt,.md,.docx" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-700">Provide Data Manually</h4>
                    <p className="text-xs text-gray-500">Upload PDFs or HTML copies of the blocked pages. The system will inject them directly into the agent's context.</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="shrink-0 h-9 px-5 text-xs font-bold border-gray-300 text-gray-600 hover:bg-white gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  data-testid="button-upload-files"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload Files
                </Button>
              </div>
            </div>
          </div>

          {/* Partial Results Viewer */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden" data-testid="card-partial-results">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <Badge className="bg-amber-100 text-amber-700 text-[10px] font-bold border border-amber-200 gap-1">
                  <AlertTriangle className="w-2.5 h-2.5" /> Partial Draft
                </Badge>
                <span className="text-[10px] text-gray-400">35% complete — 12/34 sources scraped</span>
              </div>

              <div className="flex items-center gap-3">
                {/* Pagination */}
                <div className="flex items-center gap-1">
                  <button
                    className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-30"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                    data-testid="button-prev-page"
                  >
                    <ChevronLeft className="w-3 h-3 text-gray-500" />
                  </button>
                  <span className="text-[10px] font-medium text-gray-600 min-w-[40px] text-center" data-testid="text-page-info">{currentPage}/{totalPages}</span>
                  <button
                    className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-30"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage >= totalPages}
                    data-testid="button-next-page"
                  >
                    <ChevronRight className="w-3 h-3 text-gray-500" />
                  </button>
                </div>

                {/* Export Dropdown */}
                <div className="relative">
                  <Button
                    variant="outline"
                    className="h-7 px-3 text-[10px] font-bold border-gray-300 text-gray-600 gap-1"
                    onClick={() => setExportOpen(!exportOpen)}
                    data-testid="button-export"
                  >
                    <Download className="w-3 h-3" /> Export
                    <ChevronDown className="w-2.5 h-2.5" />
                  </Button>
                  {exportOpen && (
                    <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-md shadow-lg border border-gray-200 z-20 py-1">
                      <button className="w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 text-left flex items-center gap-2" data-testid="button-export-txt">
                        <FileText className="w-3 h-3" /> Download as TXT
                      </button>
                      <button className="w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 text-left flex items-center gap-2" data-testid="button-export-md">
                        <Copy className="w-3 h-3" /> Download as Markdown
                      </button>
                    </div>
                  )}
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search in report"
                    className="h-7 w-40 pl-7 pr-2 text-[10px] border border-gray-300 rounded-md bg-white text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#008DA8] focus:border-[#008DA8]"
                    data-testid="input-search-report"
                  />
                </div>
              </div>
            </div>

            {/* Document Canvas */}
            <div className="p-8 prose prose-sm max-w-none select-text" data-testid="text-partial-content">
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-mono">
                {mockPartialContent}
              </div>
            </div>
          </div>

        </div>
        </div>
      </div>
    </div>
  );
}
