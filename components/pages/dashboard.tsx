"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  MoreVertical,
  Paperclip,
  FileText,
  X,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Copy,
  Trash2,
  Rocket,
  DollarSign,
  TrendingUp,
  Zap,
  ClipboardList,
  RefreshCw,
  Archive,
  Package,
  Unlock,
  Download,
  Share2,
  StopCircle,
  FastForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CloneRestartModal from "@/components/clone-restart-modal";
import AbortResearchModal from "@/components/abort-research-modal";
import FinishEarlyModal from "@/components/finish-early-modal";
import ResearchDetailsModal from "@/components/research-details-modal";
import RemoveProjectModal from "@/components/remove-project-modal";
import ExportProjectModal from "@/components/export-project-modal";
import ShareProjectModal from "@/components/share-project-modal";
import CreateProjectModal from "@/components/create-project-modal";
import { useProjects, useArchivedProjects } from "@/hooks/use-projects";
import type { ResearchStatus } from "@/lib/types";

const rocketIcon = "/images/image_1771405092616.png";

export default function Dashboard() {
  const [showBanner, setShowBanner] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [removeDefaultMode, setRemoveDefaultMode] = useState<"archive" | "delete">("archive");
  const [cloneOpen, setCloneOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ id: number; title: string } | null>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [dashStatusFilter, setDashStatusFilter] = useState<"all" | "success" | "in-progress" | "failed" | "canceled">("all");
  const [abortOpen, setAbortOpen] = useState(false);
  const [finishEarlyOpen, setFinishEarlyOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [abortItem, setAbortItem] = useState<{ id: number; title: string } | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const archivedSectionRef = useRef<HTMLDivElement>(null);
  const activeGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === "#archived" && !showArchived) {
        setShowArchived(true);
        setTimeout(() => {
          archivedSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
        window.history.replaceState(null, "", window.location.pathname);
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, [showArchived]);

  const toggleArchived = useCallback(() => {
    if (!showArchived) {
      setShowArchived(true);
      setTimeout(() => {
        archivedSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } else {
      setShowArchived(false);
      setTimeout(() => {
        activeGridRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 50);
    }
  }, [showArchived]);

  const { data: searches = [], isLoading: projectsLoading } = useProjects();
  const { data: archivedProjects = [], isLoading: archivedLoading } = useArchivedProjects();

  const defaultDashboardStatus = { borderColor: "border-l-gray-400", route: "/sources", tileBg: "bg-gray-50", iconBg: "bg-gray-200", iconColor: "text-gray-600" };
  const statusConfig: Record<string, { borderColor: string; route: string; tileBg: string; iconBg: string; iconColor: string }> = {
    "success": { borderColor: "border-l-green-500", route: "/sources", tileBg: "bg-[#E8F5E9]", iconBg: "bg-[#C8E6C9]", iconColor: "text-[#2E7D32]" },
    "in-progress": { borderColor: "border-l-blue-500", route: "/sources", tileBg: "bg-[#E3F2FD]", iconBg: "bg-[#BBDEFB]", iconColor: "text-[#1565C0]" },
    "failed": { borderColor: "border-l-red-500", route: "/sources", tileBg: "bg-[#FFEBEE]", iconBg: "bg-[#FFCDD2]", iconColor: "text-[#C62828]" },
    "canceled": { borderColor: "border-l-orange-400", route: "/sources", tileBg: "bg-[#FFF3E0]", iconBg: "bg-[#FFE0B2]", iconColor: "text-[#E65100]" },
  };

  const tileIcons = [Rocket, DollarSign, TrendingUp, ClipboardList, Zap, FileText];

  const visibleSearches = searches.filter(s => !deletedIds.includes(s.id));
  const statusFilterOptions = [
    { value: "all" as const, label: "All", count: visibleSearches.length, textColor: "text-gray-100" },
    { value: "success" as const, label: "Success", count: visibleSearches.filter(s => s.status === "success").length, textColor: "text-[#22c55e]" },
    { value: "in-progress" as const, label: "In Progress", count: visibleSearches.filter(s => s.status === "in-progress").length, textColor: "text-[#3b82f6]" },
    { value: "failed" as const, label: "Failed", count: visibleSearches.filter(s => s.status === "failed").length, textColor: "text-[#ef4444]" },
    { value: "canceled" as const, label: "Canceled", count: visibleSearches.filter(s => s.status === "canceled").length, textColor: "text-[#f97316]" },
  ];

  return (
    <>
    <div className="max-w-[1600px] mx-auto space-y-6 font-sans">
      {/* Latest News Banner */}
      {showBanner && (
        <div className="bg-[#EBEBEB] border border-gray-300 rounded-sm relative overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-[#E0E0E0]">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-700" />
              <h2 className="font-bold text-gray-800 text-sm">
                Our Latest News
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-xs border-gray-400 text-[#006E7D] bg-white hover:bg-gray-50"
              >
                See all
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-[#006E7D] hover:bg-transparent"
                onClick={() => setShowBanner(false)}
              >
                <X className="w-5 h-5 stroke-[3]" />
              </Button>
            </div>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 bg-[#EBEBEB]">
            <div>
              <a
                href="#"
                className="block text-sm font-medium text-gray-800 hover:underline decoration-gray-400 underline-offset-2 mb-0.5"
              >
                Introducing research models with Basis for the Parallel Chat API
              </a>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">
                PRODUCT UPDATE • 4 DAYS AGO
              </p>
            </div>
            <div>
              <a
                href="#"
                className="block text-sm font-medium text-gray-800 hover:underline decoration-gray-400 underline-offset-2 mb-0.5"
              >
                How Amp's coding agents build better software with ...
              </a>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">
                PRODUCT UPDATE • 4 DAYS AGO
              </p>
            </div>
            <div>
              <a
                href="#"
                className="block text-sm font-medium text-gray-800 hover:underline decoration-gray-400 underline-offset-2 mb-0.5"
              >
                Build a real-time fact checker with Acuras Proand Cerebras
              </a>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">
                PRODUCT UPDATE • 4 DAYS AGO
              </p>
            </div>
            <div>
              <a
                href="#"
                className="block text-sm font-medium text-gray-800 hover:underline decoration-gray-400 underline-offset-2 mb-0.5"
              >
                Latency improvements on the Acuras ProTask API
              </a>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">
                PRODUCT UPDATE • 4 DAYS AGO
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Main Content Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px]">
        <h1 className="font-bold text-gray-900 text-[15px]" data-testid="text-searches-title">Your Searches ({searches.length})</h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-800">Status</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "h-8 w-8 flex items-center justify-center rounded border transition-all",
                    dashStatusFilter === "all"
                      ? "bg-[#f8f9fa] border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-white"
                      : dashStatusFilter === "success"
                      ? "bg-white border-[#22c55e] text-[#22c55e] shadow-sm"
                      : dashStatusFilter === "in-progress"
                      ? "bg-white border-[#3b82f6] text-[#3b82f6] shadow-sm"
                      : dashStatusFilter === "failed"
                      ? "bg-white border-[#ef4444] text-[#ef4444] shadow-sm"
                      : "bg-white border-[#f97316] text-[#f97316] shadow-sm",
                    "data-[state=open]:bg-white"
                  )}
                  data-testid="button-status-filter"
                >
                  <Filter className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 bg-[#1a1a1a] border-[#333] shadow-xl p-0.5">
                {statusFilterOptions.map((opt) => (
                  <DropdownMenuItem
                    key={opt.value}
                    className={cn(
                      "text-xs cursor-pointer flex justify-between items-center px-2 py-1.5 hover:text-white focus:text-white focus:bg-[#333]",
                      dashStatusFilter === opt.value ? "font-bold text-[#008DA8] focus:text-[#008DA8]" : opt.textColor
                    )}
                    onClick={() => setDashStatusFilter(opt.value)}
                    data-testid={`filter-${opt.value}`}
                  >
                    <span>{opt.label}</span>
                    <span className="text-[10px] text-gray-500 ml-2">{opt.count}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Link href="/research/search">
            <Button size="icon" className="h-9 w-9 bg-[#00802b] hover:bg-[#006622] rounded-md shadow-sm border border-[#006622]" data-testid="button-new-search">
              <Search className="w-5 h-5 text-white stroke-[2.5]" />
            </Button>
          </Link>
        </div>
      </div>
      {/* Research Tiles Grid */}
      <div ref={activeGridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Create Research Tile */}
        <div
          className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col items-center justify-center min-h-[180px] cursor-pointer hover:shadow-md transition-shadow"
          data-testid="card-create-research"
          onClick={() => setCreateOpen(true)}
        >
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3">
            <Plus className="w-5 h-5 text-[#008DA8]" />
          </div>
          <Button variant="ghost" className="h-9 gap-2 text-[#008DA8] hover:bg-[#008DA8]/5 font-bold text-sm px-4" data-testid="button-smart-search">
            Start new search
          </Button>
        </div>

        {/* Research Item Tiles — in-progress first */}
        {[...visibleSearches].sort((a, b) => {
          if (a.status === "in-progress" && b.status !== "in-progress") return -1;
          if (a.status !== "in-progress" && b.status === "in-progress") return 1;
          return 0;
        }).map((item) => {
          const config = statusConfig[item.status] || defaultDashboardStatus;
          return (
            <div
              key={item.id}
              className={cn(
                "rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col min-h-[180px] group relative hover:shadow-md transition-shadow bg-[#D7D7D7]/75"
              )}
              data-testid={`card-research-${item.id}`}
            >
              <div className="flex items-center justify-between mb-3 gap-3">
                <Link href={`${config.route}/${item.id}`} className="flex items-center gap-3 flex-1 min-w-0 group-hover:opacity-80 transition-opacity">
                  <div className="relative w-[36px] h-[36px] shrink-0 flex items-center justify-center">
                    <div 
                      className={cn(
                        "absolute inset-0 rounded-full border-2",
                        item.status === "in-progress" ? "border-[#3b82f6] border-t-transparent animate-[spin_3s_linear_infinite]" : ""
                      )}
                      style={item.status !== "in-progress" ? { borderColor: item.status === 'success' ? '#22c55e' : item.status === 'failed' ? '#ef4444' : '#f97316' } : undefined}
                    />
                    <div className="w-[30px] h-[30px] rounded-full bg-white/80 flex items-center justify-center">
                      <img src={rocketIcon} alt="Rocket" className="w-[18px] h-[18px] opacity-70" />
                    </div>
                  </div>
                  <p className="text-[13px] leading-snug text-gray-800 font-semibold line-clamp-1" title={item.title}>
                    {item.title}
                  </p>
                </Link>
              </div>
              <Link href={`${config.route}/${item.id}`} className="flex flex-col flex-1 min-w-0 relative">
                <div className="flex-1 space-y-2">
                  {item.query && (
                    <p className="text-[11px] leading-relaxed text-gray-600" data-testid={`text-query-${item.id}`}>
                      <span className="font-bold text-gray-700">Query: </span>
                      {item.query.slice(0, 100)}{item.query.length > 100 ? "..." : ""}
                    </p>
                  )}
                  <div className="flex items-center gap-2" data-testid={`text-engine-${item.id}`}>
                    <span className="text-[11px] font-bold text-gray-700">Data Engine</span>
                    <span className="text-[10px] font-semibold text-gray-600 border border-gray-300 rounded px-1.5 py-0.5 bg-white/60 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {item.engine}
                    </span>
                  </div>
                </div>
                <div className="flex items-end justify-between mt-2">
                  <p className="text-[11px] text-gray-500">
                    {item.date} • {item.sources} источников
                  </p>
                  <div className="shrink-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                        <button className="p-0.5 border-0 bg-transparent opacity-60 hover:opacity-100 transition-opacity" data-testid={`kebab-menu-${item.id}`}>
                          <MoreVertical className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 bg-[#1a1a1a] border-[#333] shadow-xl">
                        {item.status === "in-progress" ? (
                          <>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 focus:text-red-400 focus:bg-[#333] cursor-pointer"
                              data-testid={`abort-${item.id}`}
                              onClick={(e) => { e.stopPropagation(); setAbortItem({ id: item.id, title: item.title }); setTimeout(() => setAbortOpen(true), 0); }}
                            >
                              <StopCircle className="w-4 h-4" />
                              Abort Research
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-sm text-[#22c55e] hover:text-[#16a34a] focus:text-[#16a34a] focus:bg-[#333] cursor-pointer"
                              data-testid={`finish-early-${item.id}`}
                              onClick={(e) => { e.stopPropagation(); setAbortItem({ id: item.id, title: item.title }); setTimeout(() => setFinishEarlyOpen(true), 0); }}
                            >
                              <FastForward className="w-4 h-4" />
                              Finish Early
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white focus:text-white focus:bg-[#333] cursor-pointer"
                              data-testid={`dash-archive-inprogress-${item.id}`}
                              onClick={(e) => { e.stopPropagation(); setSelectedItem({ id: item.id, title: item.title }); setRemoveDefaultMode("archive"); setTimeout(() => setDeleteOpen(true), 0); }}
                            >
                              <Archive className="w-4 h-4 text-gray-400" />
                              Archive Project
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 focus:text-red-400 focus:bg-[#333] cursor-pointer"
                              data-testid={`delete-inprogress-${item.id}`}
                              onClick={(e) => { e.stopPropagation(); setSelectedItem({ id: item.id, title: item.title }); setRemoveDefaultMode("delete"); setTimeout(() => setDeleteOpen(true), 0); }}
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete Project
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white focus:text-white focus:bg-[#333] cursor-pointer"
                              data-testid={`details-${item.id}`}
                              onClick={(e) => { e.stopPropagation(); setSelectedItem({ id: item.id, title: item.title }); setIsPinned(false); setTimeout(() => setDetailsOpen(true), 0); }}
                            >
                              <FileText className="w-4 h-4 text-gray-400" />
                              Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-sm text-[#008DA8] hover:text-[#00b0cc] focus:text-[#00b0cc] focus:bg-[#333] cursor-pointer"
                              data-testid={`clone-${item.id}`}
                              onClick={(e) => { e.stopPropagation(); setSelectedItem({ id: item.id, title: item.title }); setTimeout(() => setCloneOpen(true), 0); }}
                            >
                              <Copy className="w-4 h-4 text-[#008DA8]" />
                              Clone & Restart
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white focus:text-white focus:bg-[#333] cursor-pointer"
                              data-testid={`dash-archive-${item.id}`}
                              onClick={(e) => { e.stopPropagation(); setSelectedItem({ id: item.id, title: item.title }); setRemoveDefaultMode("archive"); setTimeout(() => setDeleteOpen(true), 0); }}
                            >
                              <Archive className="w-4 h-4 text-gray-400" />
                              Archive Project
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white focus:text-white focus:bg-[#333] cursor-pointer"
                              data-testid={`dash-export-${item.id}`}
                              onClick={(e) => { e.stopPropagation(); setSelectedItem({ id: item.id, title: item.title }); setTimeout(() => setExportOpen(true), 0); }}
                            >
                              <Download className="w-4 h-4 text-gray-400" />
                              Export Project
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white focus:text-white focus:bg-[#333] cursor-pointer"
                              data-testid={`dash-share-${item.id}`}
                              onClick={(e) => { e.stopPropagation(); setSelectedItem({ id: item.id, title: item.title }); setTimeout(() => setShareOpen(true), 0); }}
                            >
                              <Share2 className="w-4 h-4 text-gray-400" />
                              Share Project
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 focus:text-red-400 focus:bg-[#333] cursor-pointer"
                              data-testid={`delete-${item.id}`}
                              onClick={(e) => { e.stopPropagation(); setSelectedItem({ id: item.id, title: item.title }); setRemoveDefaultMode("delete"); setTimeout(() => setDeleteOpen(true), 0); }}
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete Project
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
      <div className="flex justify-start pt-8 pb-4">
        <Button
          variant="outline"
          className="border-[#008DA8] text-[#008DA8] hover:bg-[#008DA8]/5 px-6 h-9 rounded-sm font-medium gap-2 bg-transparent"
          onClick={toggleArchived}
          data-testid="button-toggle-archived"
        >
          <Archive className="w-3.5 h-3.5" />
          <span className="text-[13px]">
            {showArchived ? "Hide Archived Projects" : `Archived Projects (${archivedProjects.length})`}
          </span>
          {showArchived ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </Button>
      </div>

      {showArchived && (
        <div ref={archivedSectionRef} className="pb-12">
          <div className="flex items-center gap-2 mb-4">
            <Archive className="w-5 h-5 text-gray-500" />
            <h2 className="font-bold text-gray-700 text-[15px]">Archived Projects</h2>
            <span className="text-xs text-gray-400 ml-1">({archivedProjects.length})</span>
          </div>
          <div className="flex flex-col gap-3">
            {archivedProjects.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-lg px-5 py-4 opacity-75 hover:opacity-100 transition-opacity group"
                data-testid={`card-archived-${item.id}`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img src={rocketIcon} alt="Rocket" className="w-5 h-5 opacity-60 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-semibold text-gray-700 truncate" title={item.title}>{item.title}</p>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 bg-gray-200 text-gray-500 font-medium shrink-0 gap-1">
                        <Package className="w-3 h-3" />
                        Archived
                      </Badge>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">{item.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <span className="text-[11px] text-gray-400">{item.sources} sources</span>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                      <button className="p-1 bg-transparent opacity-60 hover:opacity-100 transition-opacity" data-testid={`archived-kebab-${item.id}`}>
                        <MoreVertical className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-[#1a1a1a] border-[#333] shadow-xl">
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-sm text-[#008DA8] hover:text-[#00b0cc] focus:text-[#00b0cc] focus:bg-[#333] cursor-pointer"
                        data-testid={`unarchive-${item.id}`}
                      >
                        <Unlock className="w-4 h-4" />
                        Unarchive / Restore
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-sm text-gray-300 hover:text-white focus:text-white focus:bg-[#333] cursor-pointer"
                        data-testid={`archived-details-${item.id}`}
                      >
                        <FileText className="w-4 h-4 text-gray-400" />
                        Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 focus:text-red-400 focus:bg-[#333] cursor-pointer"
                        data-testid={`archived-delete-${item.id}`}
                        onClick={() => { setSelectedItem({ id: item.id, title: item.title }); setRemoveDefaultMode("delete"); setDeleteOpen(true); }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    <ResearchDetailsModal
      open={detailsOpen}
      onOpenChange={setDetailsOpen}
      title={selectedItem?.title ?? ""}
      pinned={isPinned}
    />

    <RemoveProjectModal
      open={deleteOpen}
      onOpenChange={setDeleteOpen}
      title={selectedItem?.title ?? ""}
      defaultMode={removeDefaultMode}
      onConfirm={() => { if (selectedItem) setDeletedIds(prev => [...prev, selectedItem.id]); }}
    />

    <CloneRestartModal open={cloneOpen} onOpenChange={setCloneOpen} />

    <AbortResearchModal open={abortOpen} onOpenChange={setAbortOpen} />
    <FinishEarlyModal open={finishEarlyOpen} onOpenChange={setFinishEarlyOpen} />

    <ExportProjectModal
      open={exportOpen}
      onOpenChange={setExportOpen}
      title={selectedItem?.title ?? ""}
    />

    <ShareProjectModal
      open={shareOpen}
      onOpenChange={setShareOpen}
      title={selectedItem?.title ?? ""}
    />

    <CreateProjectModal
      open={createOpen}
      onOpenChange={setCreateOpen}
    />
  </>
  );
}
