import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, Link } from "wouter";
import {
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Info,
  Globe,
  Search,
  FileText,
  Zap,
  Clock,
  Database,
  Settings2,
  ExternalLink,
  AlertTriangle,
  Loader2,
  ToggleRight,
  ChevronDown,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { loadLaunchConfig, type LaunchConfig } from "@/lib/launch-config";
import { usePreviewStore } from "@/lib/preview-store";

interface ThoughtNode {
  id: string;
  type: "thinking" | "sources";
  title?: string;
  content?: string;
  sources?: { favicon: string; domain: string; title: string }[];
}

const mockThoughtStream: ThoughtNode[] = [
  {
    id: "t1",
    type: "thinking",
    title: "Determining the architecture of Parallel.ai",
    content:
      'I am starting with a detailed study of the Parallel.ai platform to precisely determine what lies behind the term "processors." At this stage, I assume that these are specialized agent structures or modules for data processing, and not physical equipment. I need to understand their internal classification and working principles to match them accurately with the intellectual tools of search.',
  },
  {
    id: "t2",
    type: "thinking",
    title: "Competitive environment analysis",
    content:
      "In parallel, I am synthesizing information about the current capabilities of deep search modes from leading market players such as OpenAI, Perplexity, Google, xAI and Anthropic. This will allow me to identify key metrics for comparison, including the depth of autonomous research, the ability for complex reasoning, and the quality of the final data synthesis, in order to objectively assess the position of Parallel.ai.",
  },
  {
    id: "t3",
    type: "thinking",
    title: "Directions for further search",
    content:
      "My next steps will be aimed at finding specific technical descriptions of processor types within Parallel.ai and their functional differences. I plan to collect detailed characteristics for each type in order to form a complete comparative table structure and clearly display the advantages and limitations of each solution in the context of deep research.",
  },
  {
    id: "s1",
    type: "sources",
    title: "Researching websites",
    sources: [
      { favicon: "https://www.google.com/s2/favicons?domain=parallelai.tech&sz=16", domain: "parallelai.tech", title: "ParallelAI" },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "Parallel | Web Sea..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "The best web sea..." },
      { favicon: "https://www.google.com/s2/favicons?domain=docs.parallel.ai&sz=16", domain: "docs.p...", title: "Processors - Par..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "Introducing the P..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "Introducing the P..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "Introducing the T..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "Building a real-ti..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "Introducing Parall..." },
      { favicon: "https://www.google.com/s2/favicons?domain=reddit.com&sz=16", domain: "reddit...", title: "I compared the r..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "Parallel Task API ..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "How to build a m..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "Parallel Deep Res..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "State of the Art D..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "A new pareto-fro..." },
    ],
  },
  {
    id: "t4",
    type: "thinking",
    title: "Classification of intelligent processors",
    content:
      'I have studied the architecture of Parallel.ai in detail and found that different levels of AI agent power for web research are hidden behind the term "processors." The lineup ranges from lightweight solutions for quickly extracting metadata to ultra-deep systems capable of conducting complex searches of up to 90 minutes. I found that the system divides processors into standard and fast, offering a flexible choice between data relevance and task execution speed.',
  },
  {
    id: "t5",
    type: "thinking",
    title: "Data synthesis and identified contradictions",
    content:
      'Synthesizing the information received, I have recorded ambitious claims by the platform about surpassing human researchers and leading models like GPT-5 and Gemini in specialized tests. However, to create a complete picture, I need to fill in the gaps in the descriptions of specific "deep search" modes from competitors such as Anthropic and xAI, to understand whether they offer comparable agent autonomy or are limited only to an extended search context.',
  },
  {
    id: "t6",
    type: "thinking",
    title: "Next steps for system comparison",
    content:
      "In the near future, I plan to focus on studying the official documentation and tariff plans to correlate the cost and efficiency of each type of processor. In parallel, I will conduct a deep analysis of the Deep Research functionality of the largest market players, including OpenAI and Perplexity. This will allow me to form the final comparative table, where the time of autonomous work, the depth of analysis, and the cost of each solution will be clearly reflected.",
  },
  {
    id: "s2",
    type: "sources",
    title: "Researching websites",
    sources: [
      { favicon: "https://www.google.com/s2/favicons?domain=help.openai.com&sz=16", domain: "help.o...", title: "Apps in ChatGPT ..." },
      { favicon: "https://www.google.com/s2/favicons?domain=platform.openai.com&sz=16", domain: "platform.o...", title: "Changelog | ..." },
      { favicon: "https://www.google.com/s2/favicons?domain=medium.com&sz=16", domain: "mediu...", title: "OpenAI releases ..." },
      { favicon: "https://www.google.com/s2/favicons?domain=openai.com&sz=16", domain: "openr...", title: "o3 Deep Researc..." },
      { favicon: "https://www.google.com/s2/favicons?domain=openai.com&sz=16", domain: "openai...", title: "ChatGPT agent S..." },
      { favicon: "https://www.google.com/s2/favicons?domain=docs.perplexity.ai&sz=16", domain: "docs.pe...", title: "Sonar deep rese..." },
      { favicon: "https://www.google.com/s2/favicons?domain=apidog.com&sz=16", domain: "apidog...", title: "How to Use Perpl..." },
      { favicon: "https://www.google.com/s2/favicons?domain=openai.com&sz=16", domain: "openr...", title: "Sonar Deep Rese..." },
    ],
  },
];

const dataEngineLabels: Record<string, string> = {
  ultimate: "Ultimate",
  pro: "Advanced",
  fast: "Standard",
};

const scopeLabels: Record<string, string> = {
  global: "Web (Global)",
  us: "Web (US)",
  eu: "Web (EU)",
  local: "Local Only",
};

export default function SmartSearchInProgress() {
  const params = useParams<{ id: string }>();
  const [leftExpanded, setLeftExpanded] = useState(true);
  const [showAbortModal, setShowAbortModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(45);
  const [autoScroll, setAutoScroll] = useState(true);
  const streamRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<LaunchConfig | null>(null);

  const [hudExpanded, setHudExpanded] = useState(true);
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const [briefingExpanded, setBriefingExpanded] = useState(false);
  const [queryExpanded, setQueryExpanded] = useState(false);
  const { openPreview } = usePreviewStore();

  useEffect(() => {
    const loaded = loadLaunchConfig();
    if (loaded) setConfig(loaded);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (autoScroll && streamRef.current) {
      streamRef.current.scrollTop = streamRef.current.scrollHeight;
    }
  }, [autoScroll, elapsedSeconds]);

  const handleStreamScroll = useCallback(() => {
    if (!streamRef.current) return;
    const el = streamRef.current;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    setAutoScroll(isNearBottom);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="-m-6 md:-m-8 flex h-[calc(100vh-64px)] w-[calc(100%+48px)] md:w-[calc(100%+64px)] overflow-hidden bg-gray-50" data-testid="in-progress-page">
      {/* Left Panel: Research Briefing */}
      <div
        className={cn(
          "shrink-0 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden relative flex flex-col",
          leftExpanded ? "w-[350px]" : "w-[50px]"
        )}
        data-testid="panel-left"
      >
        {/* Toggle Button */}
        <button
          className="absolute top-1/2 -translate-y-1/2 right-0 z-10 w-5 h-12 bg-gray-100 border border-gray-200 border-r-0 rounded-l-sm flex items-center justify-center hover:bg-gray-200 transition-colors"
          onClick={() => setLeftExpanded(!leftExpanded)}
          data-testid="button-toggle-left-panel"
        >
          {leftExpanded ? (
            <ChevronLeft className="w-3 h-3 text-gray-500" />
          ) : (
            <ChevronRight className="w-3 h-3 text-gray-500" />
          )}
        </button>

        {/* Collapsed State */}
        {!leftExpanded && (
          <div className="flex flex-col items-center justify-center h-full">
            <span
              className="text-xs font-bold text-gray-500 tracking-widest"
              style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
            >
              RESEARCH BRIEFING
            </span>
          </div>
        )}

        {/* Expanded Content */}
        {leftExpanded && (
          <div className="flex flex-col h-full p-4 pr-6 space-y-4 overflow-hidden">
            <h3 className="text-sm font-bold text-gray-800 sticky top-0 py-2 z-10 -mx-4 px-4 border-b border-gray-100 ml-[-10px] mr-[-10px] pl-[1px] pr-[1px] pt-[3px] pb-[3px] mt-[0px] mb-[0px] bg-[#9f9f9f59]">Research Briefing</h3>

            <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-3 pt-2">
              <div className="relative group/query">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Query</span>
                  <button
                    onClick={() => {
                      if (config?.query) {
                        navigator.clipboard.writeText(config.query);
                      }
                    }}
                    className="opacity-0 group-hover/query:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded-sm"
                    title="Copy query"
                  >
                    <Copy className="w-3 h-3 text-gray-400" />
                  </button>
                </div>
                <p className="text-xs text-gray-700 mt-1 leading-relaxed" data-testid="text-briefing-query">
                  {(() => {
                    const queryText = config?.query || "No query specified";
                    const shouldTrim = queryText.length > 2050;
                    return shouldTrim && !queryExpanded ? queryText.slice(0, 2050) + "..." : queryText;
                  })()}
                </p>
                {config?.query && config.query.length > 2050 && (
                  <button
                    onClick={() => setQueryExpanded(!queryExpanded)}
                    className="text-[11px] text-[#008DA8] hover:underline font-medium mt-1 flex items-center gap-1"
                    data-testid="button-toggle-query-text"
                  >
                    {queryExpanded ? "Show less" : "Show more"}
                    <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", queryExpanded && "rotate-180")} />
                  </button>
                )}
              </div>

              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Research Type</span>
                <p className="text-xs text-gray-700 mt-1" data-testid="text-briefing-type">
                  {config?.researchType === "sheet" ? "Structured Sheet" : "Deep Search"}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Data Engine</span>
                <div className="flex items-center gap-1.5 mt-1" data-testid="text-briefing-engine">
                  <Zap className={cn("w-3 h-3", 
                    config?.dataEngine === "ultimate" ? "text-yellow-500 fill-yellow-500" :
                    config?.dataEngine === "pro" ? "text-blue-500 fill-blue-500" :
                    "text-green-500 fill-green-500"
                  )} />
                  <span className="text-xs font-bold text-gray-700">
                    {dataEngineLabels[config?.dataEngine || "ultimate"] || "Ultimate"}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Scope</span>
                <div className="flex items-center gap-1.5 mt-1" data-testid="text-briefing-scope">
                  <Globe className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-700">
                    {scopeLabels[config?.geoScope || "global"] || "Web (Global)"}
                  </span>
                </div>
              </div>

              {(config?.selectedLanguages?.length ?? 0) > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Languages</span>
                  <div className="flex gap-1 mt-1 flex-wrap" data-testid="text-briefing-languages">
                    {config!.selectedLanguages.map((lang) => (
                      <Badge key={lang} variant="secondary" className="text-[10px] px-1.5 py-0">
                        {lang.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {(config?.attachedFiles?.length ?? 0) > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Attached Files ({config!.attachedFiles.length})</span>
                  <div className="space-y-1 mt-1" data-testid="text-briefing-files">
                    {config!.attachedFiles.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:bg-gray-100 rounded-sm px-1 py-0.5 -mx-1 transition-colors"
                        data-testid={`card-briefing-file-${i}`}
                        onClick={() => {
                          const previewFiles = config!.attachedFiles.map((af, idx) => ({
                            id: `briefing-file-${idx}`,
                            name: af.name,
                            type: af.name.split(".").pop()?.toUpperCase() || "FILE",
                            size: af.size,
                          }));
                          openPreview({
                            files: previewFiles,
                            initialFileId: `briefing-file-${i}`,
                            context: "input",
                          });
                        }}
                      >
                        <FileText className="w-3 h-3 text-gray-400" />
                        <span className="truncate">{f.name}</span>
                        <span className="text-[10px] text-gray-400 shrink-0">{f.size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Budget Cap</span>
                <p className="text-xs text-gray-700 mt-1" data-testid="text-briefing-budget">
                  {config?.budgetCap ? "Enabled" : "Disabled"}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Options</span>
                <div className="space-y-1 mt-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <ToggleRight className={cn("w-3 h-3", config?.deepCrawlEnabled ? "text-green-500" : "text-gray-400")} />
                    <span>Deep Crawl: {config?.deepCrawlEnabled ? "On" : "Off"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <ToggleRight className={cn("w-3 h-3", config?.showReasoning ? "text-green-500" : "text-gray-400")} />
                    <span>Show Reasoning: {config?.showReasoning ? "On" : "Off"}</span>
                  </div>
                </div>
              </div>

              {config?.planText && (
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    Research Plan (v{config.planVersion}/{config.totalVersions})
                  </span>
                  <div className="mt-1 bg-gray-50 border border-gray-200 rounded-sm p-2" data-testid="text-briefing-plan">
                    <p className="text-[11px] text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {config.planText.length > 250 && !briefingExpanded
                        ? config.planText.slice(0, 250) + "..."
                        : config.planText}
                    </p>
                    {config.planText.length > 250 && (
                      <button
                        onClick={() => setBriefingExpanded(!briefingExpanded)}
                        className="text-[11px] text-[#008DA8] hover:underline font-medium mt-1.5 flex items-center gap-1"
                        data-testid="button-toggle-plan-text"
                      >
                        {briefingExpanded ? "Show less" : "Show more"}
                        <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", briefingExpanded && "rotate-180")} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-auto pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-gray-500">Want to start another one?</span>
                <Link href="/smart-search/new">
                  <a className="text-xs font-bold text-[#008DA8] hover:underline flex items-center gap-1" data-testid="link-start-new-research">
                    Start New Research
                  </a>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Right Panel: Main Content */}
      <div
        className="flex-1 min-w-[600px] flex flex-col overflow-hidden"
        data-testid="panel-right"
      >
        {/* Context Header */}
        <div className="sticky top-0 z-10 border-b border-gray-200 px-3 py-2 flex items-center gap-3 shrink-0 bg-[#dddddd]">
          <div className="w-8 h-8 bg-gray-800 rounded-sm flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <p className="text-xs font-medium text-gray-700 flex-1 leading-snug line-clamp-2" data-testid="text-project-title">
            {(() => {
              const text = config?.query || "Research in progress";
              return text.length > 100 ? text.slice(0, 100) + "..." : text;
            })()}
          </p>
          <span className="text-xs font-medium text-green-600 shrink-0" data-testid="text-status-in-progress">
            Research is in progress
          </span>
        </div>

        {/* HUD Dashboard - pinned below context header */}
        <div className="shrink-0 px-4 pt-3 pb-2 bg-white border-b border-gray-200 z-20">
          <Card className="p-0 overflow-hidden border-gray-200 shadow-md" data-testid="card-hud">
            {/* Collapsed Strip - always visible as the accordion header */}
            <div
              className="px-3 py-2 bg-[#edd8d8] flex items-center justify-between gap-2 cursor-pointer select-none"
              onClick={() => setHudExpanded(!hudExpanded)}
              data-testid="button-toggle-hud"
            >
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-200 rounded-sm flex items-center justify-center">
                    <Settings2 className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                  <span className="text-xs font-bold text-gray-700">
                    {dataEngineLabels[config?.dataEngine || "ultimate"] || "Ultimate"} Engine
                  </span>
                </div>
                <div className="h-4 w-px bg-gray-300" />
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTime(13 * 60 + 48 - elapsedSeconds % (13 * 60 + 48))}</span>
                </div>
                <div className="h-4 w-px bg-gray-300" />
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Database className="w-3.5 h-3.5 text-gray-500" />
                  <span><strong>12</strong> Sources</span>
                </div>
                <div className="h-4 w-px bg-gray-300" />
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Zap className="w-3.5 h-3.5 text-gray-500" />
                  <span><strong>15K</strong> tokens</span>
                </div>
                <div className="h-4 w-px bg-gray-300" />
                <Progress value={30} className="h-1.5 w-16 [&>div]:bg-green-500" />
              </div>
              <div
                className="shrink-0 w-7 h-7 rounded-sm flex items-center justify-center bg-gray-700/10 hover:bg-gray-700/20 transition-colors cursor-pointer"
                onClick={(e) => { e.stopPropagation(); setHudExpanded(!hudExpanded); }}
                data-testid="button-expand-hud"
              >
                <ChevronDown className={cn("w-4 h-4 text-gray-600 transition-transform duration-200", hudExpanded && "rotate-180")} />
              </div>
            </div>

            {/* Expanded Content - accordion body */}
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-in-out"
              style={{ gridTemplateRows: hudExpanded ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="p-4 pt-2 space-y-4 bg-[#edd8d8] border-t border-[#e0c5c5]">
                  {/* Stats + Progress */}
                  <div className="flex items-start gap-6">
                    <div className="space-y-2 shrink-0">
                      <div className="bg-gray-50 border border-gray-200 rounded-sm p-3 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-gray-700">
                          <Database className="w-3.5 h-3.5 text-gray-500" />
                          <span><strong>12</strong> Sources</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-700">
                          <Clock className="w-3.5 h-3.5 text-gray-500" />
                          <span><strong>{elapsedSeconds}</strong> sec</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-700">
                          <Zap className="w-3.5 h-3.5 text-gray-500" />
                          <span><strong>15K</strong> tokens</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="text-xs text-gray-600 leading-relaxed">
                        <p>
                          {(() => {
                            const fullText = "Search Results: 3 key competitors in the US market have been identified. The risk of overlapping functionality with the X platform has been identified. A table of tariffs and Go-to-market strategies has been created.";
                            const shouldTrim = fullText.length > 250;
                            return shouldTrim && !isTextExpanded ? fullText.slice(0, 250) + "..." : fullText;
                          })()}
                        </p>
                        {250 < 251 && ( // Using literal for "Search Results..." length which is ~230, but request asked for 250 trim. 
                          <button
                            onClick={() => setIsTextExpanded(!isTextExpanded)}
                            className="text-[#008DA8] hover:underline font-medium mt-1 block"
                            data-testid="button-toggle-text-trim"
                          >
                            {isTextExpanded ? "Show less" : "Show more"}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 space-y-3 min-w-[200px]">
                      <div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase">INPUTS</span>
                        <div className="space-y-1.5 mt-1">
                          <div className="flex items-center gap-2">
                            <Globe className="w-3 h-3 text-gray-400" />
                            <span className="text-[10px] text-gray-500 w-4">[K]</span>
                            <Progress value={85} className="h-2 flex-1 [&>div]:bg-[#008DA8]" />
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-3 h-3 text-gray-400" />
                            <span className="text-[10px] text-gray-500 w-4">[d]</span>
                            <Progress value={100} className="h-2 flex-1 [&>div]:bg-[#008DA8]" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase">OUTPUT</span>
                        <div className="mt-1">
                          <Progress value={30} className="h-2 [&>div]:bg-green-500" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-center gap-3 pt-1">
                    <button
                      className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-sm"
                      onClick={() => setShowAbortModal(true)}
                      data-testid="button-abort-research"
                    >
                      <X className="w-5 h-5 text-white" strokeWidth={3} />
                    </button>
                    <button
                      className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors shadow-sm"
                      onClick={() => setShowFinishModal(true)}
                      data-testid="button-finish-early"
                    >
                      <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Scrollable Content - Thought Stream only */}
        <div
          ref={streamRef}
          className="flex-1 overflow-y-auto"
          onScroll={handleStreamScroll}
        >
          <div className="p-4 space-y-6 max-w-5xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#008DA8]" data-testid="text-research-log">RESEARCH LOG</span>
            </div>
            {/* Thought Stream */}
            <div className="space-y-6" data-testid="thought-stream">
              {mockThoughtStream.map((node) => (
                <div key={node.id}>
                  {node.type === "thinking" && (
                    <div className="space-y-2" data-testid={`thought-node-${node.id}`}>
                      <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <span className="text-gray-400">{">"}</span>
                        {node.title}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed pl-4">
                        {node.content}
                      </p>
                    </div>
                  )}

                  {node.type === "sources" && (
                    <div className="space-y-3" data-testid={`source-node-${node.id}`}>
                      <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        {node.title}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pl-4">
                        {node.sources?.map((source, si) => (
                          <div
                            key={si}
                            className="flex items-center gap-2 bg-white border border-gray-200 rounded-sm px-2.5 py-1.5 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group"
                            data-testid={`source-pill-${node.id}-${si}`}
                          >
                            <img
                              src={source.favicon}
                              alt=""
                              className="w-4 h-4 rounded-sm shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] text-gray-400 truncate">{source.domain}</p>
                              <p className="text-[11px] font-medium text-gray-700 truncate">{source.title}</p>
                            </div>
                            <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-gray-500 shrink-0 invisible group-hover:visible" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Loading indicator */}
              <div className="flex items-center gap-2 text-gray-400 py-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs">AI is analyzing data...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Abort Research Modal */}
      <Dialog open={showAbortModal} onOpenChange={setShowAbortModal}>
        <DialogContent className="max-w-[420px] p-0 gap-0 bg-white overflow-hidden border border-gray-200 shadow-xl rounded-md">
          <div className="flex items-center gap-2 p-3 border-b border-gray-100 bg-red-50">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="text-base font-bold text-gray-900">Abort Research</h2>
          </div>
          <div className="p-5 space-y-4">
            <p className="text-sm font-medium text-gray-800">
              Are you sure you want to abort this research?
            </p>
            <p className="text-sm text-red-500 font-medium leading-relaxed">
              All current progress will be permanently discarded. This action cannot be undone.
            </p>
            <div className="flex items-center justify-between pt-4">
              <button
                className="text-xs font-medium text-gray-900 underline hover:text-gray-700"
                onClick={() => setShowAbortModal(false)}
                data-testid="button-cancel-abort"
              >
                Cancel
              </button>
              <Button
                variant="outline"
                className="border-red-400 text-red-500 hover:bg-red-50 hover:text-red-600 h-9 px-6 text-xs font-bold bg-white"
                onClick={() => setShowAbortModal(false)}
                data-testid="button-confirm-abort"
              >
                Yes, Abort
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Finish Early Modal */}
      <Dialog open={showFinishModal} onOpenChange={setShowFinishModal}>
        <DialogContent className="max-w-[420px] p-0 gap-0 bg-white overflow-hidden border border-gray-200 shadow-xl rounded-md">
          <div className="flex items-center gap-2 p-3 border-b border-gray-100 bg-green-50">
            <Check className="w-5 h-5 text-green-600" />
            <h2 className="text-base font-bold text-gray-900">Finish Early</h2>
          </div>
          <div className="p-5 space-y-4">
            <p className="text-sm font-medium text-gray-800">
              Generate the report now based on current sources?
            </p>
            <p className="text-sm text-[#0097B2] font-medium leading-relaxed">
              The AI will stop gathering new sources and compile a report from the data collected so far. You will still receive a complete, structured output.
            </p>
            <div className="flex items-center justify-between pt-4">
              <button
                className="text-xs font-medium text-gray-900 underline hover:text-gray-700"
                onClick={() => setShowFinishModal(false)}
                data-testid="button-cancel-finish"
              >
                Cancel
              </button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white h-9 px-6 text-xs font-bold"
                onClick={() => setShowFinishModal(false)}
                data-testid="button-confirm-finish"
              >
                Yes, Generate Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
