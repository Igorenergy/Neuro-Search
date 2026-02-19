import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Globe,
  FileText,
  Zap,
  Copy,
  ToggleRight,
  GitFork,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { loadLaunchConfig, type LaunchConfig } from "@/lib/launch-config";
import { usePreviewStore } from "@/lib/preview-store";
import CloneRestartModal from "@/components/clone-restart-modal";

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

interface ResearchBriefingPanelProps {
  expanded: boolean;
  onToggle: () => void;
}

export default function ResearchBriefingPanel({ expanded, onToggle }: ResearchBriefingPanelProps) {
  const [config, setConfig] = useState<LaunchConfig | null>(null);
  const [briefingExpanded, setBriefingExpanded] = useState(false);
  const [queryExpanded, setQueryExpanded] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const { openPreview } = usePreviewStore();

  useEffect(() => {
    const loaded = loadLaunchConfig();
    if (loaded) setConfig(loaded);
  }, []);

  return (
    <div
      className={cn(
        "shrink-0 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden relative flex flex-col",
        expanded ? "w-[350px]" : "w-[50px]"
      )}
      data-testid="panel-left"
    >
      <button
        className="absolute top-1/2 -translate-y-1/2 right-0 z-10 w-5 h-12 bg-gray-100 border border-gray-200 border-r-0 rounded-l-sm flex items-center justify-center hover:bg-gray-200 transition-colors"
        onClick={onToggle}
        data-testid="button-toggle-left-panel"
      >
        {expanded ? (
          <ChevronLeft className="w-3 h-3 text-gray-500" />
        ) : (
          <ChevronRight className="w-3 h-3 text-gray-500" />
        )}
      </button>
      {!expanded && (
        <div className="flex flex-col items-center justify-center h-full bg-[#00000026]">
          <span
            className="text-xs font-bold text-gray-500 tracking-widest"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            RESEARCH BRIEFING
          </span>
        </div>
      )}
      {expanded && (
        <div className="flex flex-col h-full p-4 pr-6 space-y-4 overflow-hidden">
          <div className="flex items-center justify-between sticky top-0 py-2 z-10 -mx-4 px-4 border-b border-gray-100 pl-[1px] pr-[1px] pt-[3px] pb-[3px] mt-[0px] mb-[0px] bg-[#9f9f9f59] ml-[0px] mr-[0px]">
            <h3 className="text-sm font-bold text-gray-800">Research Briefing</h3>
            <button
              title="Clone & Restart"
              className="p-1 hover:bg-gray-200 rounded-sm transition-colors"
              onClick={() => setCloneOpen(true)}
              data-testid="button-clone-restart-briefing"
            >
              <GitFork className="w-3.5 h-3.5 text-[#008DA8]" />
            </button>
          </div>

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
      <CloneRestartModal open={cloneOpen} onOpenChange={setCloneOpen} />
    </div>
  );
}
