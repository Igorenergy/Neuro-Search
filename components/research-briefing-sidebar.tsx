"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Globe,
  FileText,
  Zap,
  Copy,
  ToggleRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { loadLaunchConfig, type LaunchConfig } from "@/lib/launch-config";

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

const defaultAttachedFiles = [
  { name: "Market Analysis Q3.pdf", size: "2.4 MB" },
  { name: "Competitor Report 2024.docx", size: "1.8 MB" },
  { name: "User Interviews.txt", size: "340 KB" },
  { name: "Financial Projections.xlsx", size: "5.1 MB" },
  { name: "Product Roadmap.pdf", size: "3.2 MB" },
];

const defaultPlanText = "(1) Conduct a detailed analysis of the functionality of the website sepalai.com, focusing on its core operations and user interface.\n(2) Examine the business model of sepalai.com, including revenue streams, target market, and competitive positioning.";

export function ResearchBriefingSidebar() {
  const [leftExpanded, setLeftExpanded] = useState(true);
  const [briefingExpanded, setBriefingExpanded] = useState(false);
  const [queryExpanded, setQueryExpanded] = useState(false);
  const config = loadLaunchConfig();

  const queryText = config?.query || "By click show the Generate extended report modal window (show reference)Drawer\"BY Click on each file card to display \"Global File Preview Drawer\"By click show the Generate extended report modal window (show reference)Drawer\"BY Click on each file card to display \"Global File Preview Drawer\"";
  const researchType = config?.researchType === "sheet" ? "Structured Sheet" : "Deep Search";
  const dataEngine = dataEngineLabels[config?.dataEngine || "ultimate"] || "Ultimate";
  const scope = scopeLabels[config?.geoScope || "global"] || "Web (Global)";
  const attachedFiles = config?.attachedFiles?.length ? config.attachedFiles : defaultAttachedFiles;
  const budgetCap = config?.budgetCap ?? true;
  const deepCrawl = config?.deepCrawlEnabled ?? false;
  const showReasoning = config?.showReasoning ?? true;
  const planText = config?.planText || defaultPlanText;
  const planVersion = config?.planVersion || 1;
  const totalVersions = config?.totalVersions || 1;

  return (
    <div
      className={cn(
        "shrink-0 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden relative flex flex-col",
        leftExpanded ? "w-[350px]" : "w-[50px]"
      )}
      data-testid="panel-briefing"
    >
      <button
        className="absolute top-1/2 -translate-y-1/2 right-0 z-10 w-5 h-12 bg-gray-100 border border-gray-200 border-r-0 rounded-l-sm flex items-center justify-center hover:bg-gray-200 transition-colors"
        onClick={() => setLeftExpanded(!leftExpanded)}
        data-testid="button-toggle-briefing-panel"
      >
        {leftExpanded ? (
          <ChevronLeft className="w-3 h-3 text-gray-500" />
        ) : (
          <ChevronRight className="w-3 h-3 text-gray-500" />
        )}
      </button>
      {!leftExpanded && (
        <div className="flex flex-col items-center justify-center h-full bg-[#e4e7eb]">
          <span
            className="text-xs font-bold text-gray-500 tracking-widest"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            RESEARCH BRIEFING
          </span>
        </div>
      )}
      {leftExpanded && (
        <div className="flex flex-col h-full p-4 pr-6 space-y-4 overflow-hidden">
          <h3 className="text-sm font-bold text-gray-800 sticky top-0 py-2 z-10 -mx-4 px-4 border-b border-gray-100 ml-[-10px] mr-[-10px] pl-[1px] pr-[1px] pt-[3px] pb-[3px] mt-[0px] mb-[0px] bg-[#9f9f9f59]">
            Research Briefing
          </h3>

          <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-3 pt-2">
            <div className="relative group/query">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Query</span>
                <button
                  onClick={() => navigator.clipboard.writeText(queryText)}
                  className="opacity-0 group-hover/query:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded-sm"
                  title="Copy query"
                >
                  <Copy className="w-3 h-3 text-gray-400" />
                </button>
              </div>
              <p className="text-xs text-gray-700 mt-1 leading-relaxed" data-testid="text-briefing-query">
                {queryText.length > 2050 && !queryExpanded ? queryText.slice(0, 2050) + "..." : queryText}
              </p>
              {queryText.length > 2050 && (
                <button
                  onClick={() => setQueryExpanded(!queryExpanded)}
                  className="text-[11px] text-[#008DA8] hover:underline font-medium mt-1 flex items-center gap-1"
                >
                  {queryExpanded ? "Show less" : "Show more"}
                  <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", queryExpanded && "rotate-180")} />
                </button>
              )}
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Research Type</span>
              <p className="text-xs text-gray-700 mt-1">{researchType}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Data Engine</span>
              <div className="flex items-center gap-1.5 mt-1">
                <Zap className={cn("w-3 h-3",
                  config?.dataEngine === "ultimate" ? "text-yellow-500 fill-yellow-500" :
                  config?.dataEngine === "pro" ? "text-blue-500 fill-blue-500" :
                  "text-green-500 fill-green-500"
                )} />
                <span className="text-xs font-bold text-gray-700">{dataEngine}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Scope</span>
              <div className="flex items-center gap-1.5 mt-1">
                <Globe className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-700">{scope}</span>
              </div>
            </div>

            {(config?.selectedLanguages?.length ?? 0) > 0 && (
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Languages</span>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {config!.selectedLanguages.map((lang) => (
                    <Badge key={lang} variant="secondary" className="text-[10px] px-1.5 py-0">
                      {lang.toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Attached Files ({attachedFiles.length})</span>
              <div className="space-y-1 mt-1">
                {attachedFiles.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-xs text-gray-600 hover:bg-gray-100 rounded-sm px-1 py-0.5 -mx-1 transition-colors cursor-pointer"
                    data-testid={`card-briefing-file-${i}`}
                  >
                    <FileText className="w-3 h-3 text-gray-400" />
                    <span className="truncate">{"name" in f ? f.name : ""}</span>
                    <span className="text-[10px] text-gray-400 shrink-0">{"size" in f ? f.size : ""}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Budget Cap</span>
              <p className="text-xs text-gray-700 mt-1">{budgetCap ? "Enabled" : "Disabled"}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Options</span>
              <div className="space-y-1 mt-1">
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <ToggleRight className={cn("w-3 h-3", deepCrawl ? "text-green-500" : "text-gray-400")} />
                  <span>Deep Crawl: {deepCrawl ? "On" : "Off"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <ToggleRight className={cn("w-3 h-3", showReasoning ? "text-green-500" : "text-gray-400")} />
                  <span>Show Reasoning: {showReasoning ? "On" : "Off"}</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">
                Research Plan (v{planVersion}/{totalVersions})
              </span>
              <div className="mt-1 bg-gray-50 border border-gray-200 rounded-sm p-2">
                <p className="text-[11px] text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {planText.length > 250 && !briefingExpanded
                    ? planText.slice(0, 250) + "..."
                    : planText}
                </p>
                {planText.length > 250 && (
                  <button
                    onClick={() => setBriefingExpanded(!briefingExpanded)}
                    className="text-[11px] text-[#008DA8] hover:underline font-medium mt-1.5 flex items-center gap-1"
                  >
                    {briefingExpanded ? "Show less" : "Show more"}
                    <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", briefingExpanded && "rotate-180")} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-gray-500">Want to start another one?</span>
              <Link href="/smart-search/new" className="text-xs font-bold text-[#008DA8] hover:underline flex items-center gap-1" data-testid="link-start-new-research">
                Start New Research
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
