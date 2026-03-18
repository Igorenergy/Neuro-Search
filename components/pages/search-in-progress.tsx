"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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
  Loader2,
  ToggleRight,
  ChevronDown,
  Copy,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { loadLaunchConfig, type LaunchConfig } from "@/lib/launch-config";
import { usePreviewStore } from "@/lib/preview-store";
import ResearchBriefingPanel from "@/components/research-briefing-panel";
import AbortResearchModal from "@/components/abort-research-modal";
import FinishEarlyModal from "@/components/finish-early-modal";
import { useResearchProgress } from "@/hooks/use-research-progress";
import type { ThoughtNode } from "@/lib/types";

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
  const { data: progress } = useResearchProgress(params.id || "1");
  const thoughtStream = progress?.thoughtStream ?? [];
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const [leftExpanded, setLeftExpanded] = useState(true);
  const [showAbortModal, setShowAbortModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(progress?.elapsedSeconds ?? 45);
  const [autoScroll, setAutoScroll] = useState(true);
  const streamRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<LaunchConfig | null>(null);

  const [hudExpanded, setHudExpanded] = useState(true);
  const [isTextExpanded, setIsTextExpanded] = useState(false);
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
      <ResearchBriefingPanel expanded={leftExpanded} onToggle={() => setLeftExpanded(!leftExpanded)} />
      {/* Right Panel: Main Content */}
      <div
        className="flex-1 min-w-[600px] flex flex-col overflow-hidden"
        data-testid="panel-right"
      >
        {/* Context Header */}
        <div className="sticky top-0 z-10 border-b border-gray-200 px-3 py-2 flex items-center gap-3 shrink-0 bg-[#dddddd]">
          <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0 bg-[#dddddd] text-[#191c1c]">
            <Rocket className="w-4 h-4 text-white" />
          </div>
          <p className="text-xs font-medium text-gray-700 flex-1 leading-snug line-clamp-2" data-testid="text-project-title">
            {(() => {
              const text = config?.query && !config.query.includes("research-") 
                ? config.query 
                : "Startup: AI Deep Research — Анализ рынка и конкурентов";
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
                          (<button
                            onClick={() => setIsTextExpanded(!isTextExpanded)}
                            className="text-[#008DA8] hover:underline font-medium mt-1 block"
                            data-testid="button-toggle-text-trim"
                          >
                            {isTextExpanded ? "Show less" : "Show more"}
                          </button>)
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
          <div className="p-4 space-y-6 max-w-5xl relative">
            <div className="flex items-center gap-2 sticky top-0 bg-gray-50/80 backdrop-blur-sm py-2 z-10 -mx-4 px-4">
              <span className="text-xs font-bold text-[#008DA8]" data-testid="text-research-log">RESEARCH LOG</span>
            </div>
            {/* Thought Stream */}
            <div className="space-y-6" data-testid="thought-stream">
              {thoughtStream.map((node) => (
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
      <AbortResearchModal
        open={showAbortModal}
        onOpenChange={setShowAbortModal}
        onConfirm={() => navigate("/research-canceled/1")}
      />
      <FinishEarlyModal
        open={showFinishModal}
        onOpenChange={setShowFinishModal}
        onConfirm={() => navigate(`/sources/${params.id || "new"}`)}
      />
    </div>
  );
}
