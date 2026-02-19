import { useState } from "react";
import { useParams, Link } from "wouter";
import {
  MoreVertical,
  Download,
  Share2,
  Search,
  Filter,
  ChevronDown,
  ExternalLink,
  LayoutGrid,
  List,
  CheckSquare,
  Square,
  Settings,
  Globe,
  Zap,
  Shield,
  FileText,
  X,
  RefreshCw,
  Circle,
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
  Link2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { loadLaunchConfig } from "@/lib/launch-config";
import { usePreviewStore } from "@/lib/preview-store";
import { ResearchBriefingSidebar } from "@/components/research-briefing-sidebar";
import { SourceDetailsDrawer } from "@/components/source-details-drawer";


import type { SourceRow } from "@/lib/types";

const mockSources: SourceRow[] = [
  { id: 1, title: "Strategic Audit Dashboard-Full Dataset...", domain: "parallelai.tech", favicon: "https://www.google.com/s2/favicons?domain=parallelai.tech&sz=16", date: "10.05.2025", location: "USA", language: "En", confidenceScore: 95, included: true, type: "web" },
  { id: 2, title: "Strategic Audit Dashboard-Full Dataset...", domain: "parallel.ai", favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", date: "10.05.2025", location: "USA", language: "En", confidenceScore: 50, included: true, type: "web" },
  { id: 3, title: "Strategic Audit Dashboard-Full Dataset...", domain: "medium.com", favicon: "https://www.google.com/s2/favicons?domain=medium.com&sz=16", date: "10.05.2025", location: "USA", language: "En", confidenceScore: 50, included: true, type: "web" },
  { id: 4, title: "Market Analysis Report 2025: Bioplast...", domain: "mckinsey.com", favicon: "https://www.google.com/s2/favicons?domain=mckinsey.com&sz=16", date: "08.04.2025", location: "Global", language: "En", confidenceScore: 92, included: true, type: "pdf" },
  { id: 5, title: "Industry Trends & Forecasts Q2 2025...", domain: "reuters.com", favicon: "https://www.google.com/s2/favicons?domain=reuters.com&sz=16", date: "15.03.2025", location: "UK", language: "En", confidenceScore: 88, included: false, type: "web" },
  { id: 6, title: "Competitive Landscape Review: Enterprise...", domain: "gartner.com", favicon: "https://www.google.com/s2/favicons?domain=gartner.com&sz=16", date: "22.04.2025", location: "USA", language: "En", confidenceScore: 85, included: true, type: "web" },
  { id: 7, title: "Technology Stack Assessment for Growth...", domain: "techcrunch.com", favicon: "https://www.google.com/s2/favicons?domain=techcrunch.com&sz=16", date: "01.05.2025", location: "USA", language: "En", confidenceScore: 72, included: true, type: "web" },
  { id: 8, title: "Financial Performance Data & Analytics...", domain: "bloomberg.com", favicon: "https://www.google.com/s2/favicons?domain=bloomberg.com&sz=16", date: "05.05.2025", location: "USA", language: "En", confidenceScore: 91, included: true, type: "web" },
  { id: 9, title: "Regulatory Framework Update: EU Market...", domain: "ec.europa.eu", favicon: "https://www.google.com/s2/favicons?domain=ec.europa.eu&sz=16", date: "28.03.2025", location: "EU", language: "En", confidenceScore: 78, included: false, type: "pdf" },
  { id: 10, title: "Consumer Behavior Insights: Digital Tran...", domain: "statista.com", favicon: "https://www.google.com/s2/favicons?domain=statista.com&sz=16", date: "12.04.2025", location: "Global", language: "En", confidenceScore: 82, included: true, type: "web" },
  { id: 11, title: "Supply Chain Risk Assessment Report...", domain: "deloitte.com", favicon: "https://www.google.com/s2/favicons?domain=deloitte.com&sz=16", date: "18.04.2025", location: "USA", language: "En", confidenceScore: 87, included: true, type: "pdf" },
  { id: 12, title: "Innovation Pipeline: Key Patents & R&D...", domain: "patents.google.com", favicon: "https://www.google.com/s2/favicons?domain=patents.google.com&sz=16", date: "20.04.2025", location: "Global", language: "En", confidenceScore: 69, included: false, type: "web" },
];

function ConfidenceRing({ score, size = 28 }: { score: number; size?: number }) {
  const radius = (size - 4) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#00802b" : score >= 50 ? "#D4A373" : "#ef4444";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth="2.5" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="text-[10px] font-bold text-gray-700 z-10">{score}</span>
    </div>
  );
}

export default function SourcesPage() {
  const params = useParams<{ id: string }>();
  const [sources, setSources] = useState(mockSources);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState("confidence");
  const [filtersActive, setFiltersActive] = useState(3);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState("include");
  const [drawerSource, setDrawerSource] = useState<SourceRow | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showDeepExtractModal, setShowDeepExtractModal] = useState(false);
  const [showConfidenceModal, setShowConfidenceModal] = useState(false);
  const [showEnhanceModal, setShowEnhanceModal] = useState(false);
  const { openPreview } = usePreviewStore();
  const [enhanceScope, setEnhanceScope] = useState<"web" | "files">("web");
  const [enhanceEngine, setEnhanceEngine] = useState("ultimate");
  const [enhanceLanguages, setEnhanceLanguages] = useState<string[]>([]);
  const [enhanceBudgetCap, setEnhanceBudgetCap] = useState(true);
  const [enhanceCostOpen, setEnhanceCostOpen] = useState(false);

  const enhanceLanguageOptions = [
    { value: "auto", label: "Auto Detect" },
    { value: "en", label: "English (En)" },
    { value: "de", label: "Germany (De)" },
    { value: "es", label: "Spanish (Es)" },
    { value: "zh", label: "Chinese (Zh)" },
    { value: "ru", label: "Russian (Ru)" },
    { value: "ja", label: "Japanese (Ja)" },
    { value: "fr", label: "French (Fr)" },
    { value: "ar", label: "Arabic (Ar)" },
  ];

  const getEnhanceEngineDesc = (e: string) => {
    if (e === "ultimate") return "Maximum depth, full multi-agent analysis";
    if (e === "pro") return "Deep analysis with optimized costs";
    return "Fast scan, basic enrichment";
  };

  const config = loadLaunchConfig();
  const projectTitle = config?.query
    ? config.query.slice(0, 80) + (config.query.length > 80 ? "..." : "")
    : "Реестр 402 Компаний: Полный анализ и стратегический обзор для инвесторов";

  const sourcesCount = sources.length;
  const includedCount = sources.filter(s => s.included).length;
  const totalCount = sources.length;

  const filteredSources = sources.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredSources.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredSources.map(s => s.id)));
    }
  };

  const allSelected = selectedIds.size === filteredSources.length && filteredSources.length > 0;

  return (
    <div className="-m-6 md:-m-8 flex h-[calc(100vh-64px)] w-[calc(100%+48px)] md:w-[calc(100%+64px)] bg-white" data-testid="sources-page">
      <ResearchBriefingSidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
      {/* Context Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-[#F5F5F7] shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-sm font-bold text-gray-900 truncate max-w-[400px]" data-testid="text-project-title">
            {projectTitle}
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="shrink-0 p-1 hover:bg-gray-200 rounded transition-colors" data-testid="button-project-menu">
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/reports/summary/${params.id || "1"}`}>
            <button
              className="px-4 py-1.5 text-xs font-bold rounded-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              data-testid="button-tab-reports"
            >
              Reports
            </button>
          </Link>
          <Link href={`/sources/${params.id || "1"}`}>
            <button
              className="px-4 py-1.5 text-xs font-bold rounded-sm bg-[#00802b] text-white"
              data-testid="button-tab-sources"
            >
              Sources: {sourcesCount}
            </button>
          </Link>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 bg-white border-gray-300" data-testid="button-export">
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 bg-white border-gray-300" data-testid="button-share">
            <Share2 className="w-3.5 h-3.5" /> Share
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-200 bg-[#F0F8F0] shrink-0 flex-wrap">
        <button
          className="flex items-center gap-1.5 text-xs"
          onClick={toggleSelectAll}
          data-testid="button-select-all"
        >
          {allSelected ? (
            <CheckSquare className="w-4 h-4 text-[#008DA8]" />
          ) : (
            <Square className="w-4 h-4 text-gray-400" />
          )}
          <span className="font-medium text-gray-600">selected: {selectedIds.size}</span>
        </button>

        <div className="w-px h-5 bg-gray-300" />

        <div className="flex items-center gap-1.5">
          {selectedIds.size > 0 && [
            { icon: Globe, color: "text-gray-500", hoverBg: "hover:bg-green-100", hoverColor: "group-hover/btn:text-green-600", onClick: () => setShowActionModal(true) },
            { icon: Settings, color: "text-gray-500", hoverBg: "hover:bg-blue-100", hoverColor: "group-hover/btn:text-blue-600", onClick: () => setShowDeepExtractModal(true) },
            { icon: Shield, color: "text-gray-500", hoverBg: "hover:bg-orange-100", hoverColor: "group-hover/btn:text-orange-600", onClick: () => setShowConfidenceModal(true) },
          ].map((item, i) => (
            <button 
              key={i} 
              className={cn("group/btn w-6 h-6 rounded-sm flex items-center justify-center transition-all hover:scale-110 hover:shadow-sm bg-gray-100", item.hoverBg)}
              onClick={item.onClick}
              data-testid={`button-toolbar-action-${i}`}
            >
              <item.icon className={cn("w-3.5 h-3.5 transition-colors", item.color, item.hoverColor)} />
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-gray-300" />

        <span className="text-xs font-bold text-gray-700">
          INCLUDED: {includedCount} [{totalCount}]
        </span>

        <div className="flex-1" />

        <button className="flex items-center gap-1.5 text-xs font-bold text-[#008DA8]" data-testid="button-filters">
          <Filter className="w-3.5 h-3.5" />
          Filters: {filtersActive} active
        </button>

        <div className="w-px h-5 bg-gray-300" />

        <button className="flex items-center gap-1.5 text-xs font-medium text-gray-600" data-testid="button-sort">
          <ChevronDown className="w-3.5 h-3.5" />
          Sort by: C. Score
        </button>

        <div className="w-px h-5 bg-gray-300" />

        <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-sm px-2 py-1">
          <Search className="w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="search query"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs bg-transparent outline-none w-28 placeholder:text-gray-400"
            data-testid="input-search-sources"
          />
        </div>

        <div className="w-px h-5 bg-gray-300" />

        <span className="text-xs text-gray-500">View</span>
        <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden">
          <button
            className={cn("p-1", viewMode === "list" ? "bg-[#008DA8] text-white" : "bg-white text-gray-500 hover:bg-gray-100")}
            onClick={() => setViewMode("list")}
            data-testid="button-view-list"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            className={cn("p-1", viewMode === "grid" ? "bg-[#008DA8] text-white" : "bg-white text-gray-500 hover:bg-gray-100")}
            onClick={() => setViewMode("grid")}
            data-testid="button-view-grid"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>

        <button
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          title="Download all sources"
          data-testid="button-download-sources"
        >
          <Download className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Enhance Research + Progress */}
      <div className="flex items-center gap-4 px-4 py-2 border-b border-gray-200 bg-white shrink-0">
        <Button variant="outline" size="sm" className="h-7 text-xs font-bold text-[#008DA8] border-[#008DA8] hover:bg-[#008DA8]/5 px-3" data-testid="button-enhance-research" onClick={() => setShowEnhanceModal(true)}>
          Enhance Research
        </Button>
        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#008DA8] rounded-full" style={{ width: "35%" }} />
          </div>
        </div>
        <span className="text-xs text-gray-500 shrink-0 flex items-center gap-1">
          <Zap className="w-3 h-3 text-[#008DA8]" />
          Step 1: Identifying knowledge gaps in current sources...
        </span>
      </div>

      {/* Data Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className={cn(
          "p-3",
          viewMode === "list" ? "flex flex-col gap-2" : "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
        )}>
          {filteredSources.map((source) => (
            viewMode === "list" ? (
              <div
                key={source.id}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 bg-white border rounded-md transition-all group hover:shadow-md hover:border-gray-300",
                  source.included
                    ? "border-l-[3px] border-l-green-500 border-t-gray-200 border-r-gray-200 border-b-gray-200"
                    : "border-l-[3px] border-l-orange-400 border-t-gray-200 border-r-gray-200 border-b-gray-200",
                  selectedIds.has(source.id) && "bg-blue-50/40"
                )}
                data-testid={`row-source-${source.id}`}
                onClick={() => { setDrawerSource(source); setDrawerOpen(true); }}
                style={{ cursor: "pointer" }}
              >
                <button onClick={(e) => { e.stopPropagation(); toggleSelect(source.id); }} className="shrink-0">
                  {selectedIds.has(source.id) ? (
                    <CheckSquare className="w-4 h-4 text-[#008DA8]" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-300" />
                  )}
                </button>

                <div className="flex items-center gap-1 shrink-0">
                  {source.included ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-[#00802b]" />
                      <span className="text-[11px] font-medium text-[#00802b]">Include</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-orange-400" />
                      <span className="text-[11px] font-medium text-orange-400">Exclude</span>
                    </>
                  )}
                </div>

                <span className="text-sm font-medium text-gray-800 truncate flex-1 min-w-0 max-w-[360px]" data-testid={`text-source-title-${source.id}`}>
                  {source.title}
                </span>

                <div className="flex items-center flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 flex-1 min-w-0">
                    <FileText className="w-3 h-3 shrink-0" />
                    {source.date}
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 flex-1 min-w-0">
                    <Globe className="w-3 h-3 shrink-0" />
                    Location: {source.location}
                  </div>

                  <div className="flex items-center text-[11px] text-gray-500 flex-1 min-w-0">
                    Language: {source.language}
                  </div>

                  <div className="flex items-center flex-1 min-w-0">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div data-testid={`confidence-ring-${source.id}`}>
                          <ConfidenceRing score={source.confidenceScore} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[220px] text-center">
                        <p className="text-xs">Confidence Score is an AI-driven credibility metric that separates verified facts from digital noise.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      data-testid={`button-open-source-${source.id}`}
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-gray-200 rounded transition-colors" data-testid={`button-source-menu-${source.id}`}>
                          <MoreVertical className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2" onClick={() => setShowDeepExtractModal(true)}>
                          <Settings className="w-4 h-4" /> Deep Extract
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2" onClick={() => setShowConfidenceModal(true)}>
                          <Shield className="w-4 h-4" /> Confidence Score
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          {source.included ? (
                            <><XCircle className="w-4 h-4 text-orange-400" /> Exclude</>
                          ) : (
                            <><CheckCircle className="w-4 h-4 text-[#00802b]" /> Include</>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ) : (
              <div
                key={source.id}
                className={cn(
                  "flex flex-col bg-white border rounded-md transition-all group cursor-pointer hover:shadow-md hover:border-gray-300",
                  source.included
                    ? "border-t-[3px] border-t-green-500 border-l-gray-200 border-r-gray-200 border-b-gray-200"
                    : "border-t-[3px] border-t-orange-400 border-l-gray-200 border-r-gray-200 border-b-gray-200",
                  selectedIds.has(source.id) && "bg-blue-50/40"
                )}
                data-testid={`tile-source-${source.id}`}
                onClick={() => { setDrawerSource(source); setDrawerOpen(true); }}
              >
                <div className="flex items-center justify-between px-3 pt-3 pb-1 relative border-b border-gray-100">
                  <div className="flex items-center gap-3 text-[10px] text-gray-500">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {source.date}
                    </span>
                    <span>{source.location}</span>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="absolute top-2 right-3 z-10" data-testid={`confidence-tile-${source.id}`}>
                        <ConfidenceRing score={source.confidenceScore} size={24} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[220px] text-center">
                      <p className="text-xs">Confidence Score is an AI-driven credibility metric that separates verified facts from digital noise.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="px-3 pb-2">
                  <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight mt-[5px] mb-[5px]" data-testid={`text-tile-title-${source.id}`}>
                    {source.title}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1 truncate">{source.domain}</p>
                </div>

                <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 mt-auto">
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); toggleSelect(source.id); }} className="shrink-0">
                      {selectedIds.has(source.id) ? (
                        <CheckSquare className="w-4 h-4 text-[#008DA8]" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-300" />
                      )}
                    </button>
                    <div className="flex items-center gap-1">
                      {source.included ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-[#00802b]" />
                          <span className="text-[10px] font-medium text-[#00802b]">Include</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-orange-400" />
                          <span className="text-[10px] font-medium text-orange-400">Exclude</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button className="p-1 hover:bg-gray-200 rounded transition-colors" data-testid={`button-tile-footer-open-${source.id}`}>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-gray-200 rounded transition-colors" data-testid={`button-tile-footer-menu-${source.id}`}>
                          <MoreVertical className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2" onClick={() => setShowDeepExtractModal(true)}>
                          <Settings className="w-4 h-4" /> Deep Extract
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2" onClick={() => setShowConfidenceModal(true)}>
                          <Shield className="w-4 h-4" /> Confidence Score
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          {source.included ? (
                            <><XCircle className="w-4 h-4 text-orange-400" /> Exclude</>
                          ) : (
                            <><CheckCircle className="w-4 h-4 text-[#00802b]" /> Include</>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      </div>
      {/* Modal: Select Action */}
      <Dialog open={showActionModal} onOpenChange={setShowActionModal}>
        <DialogContent className="max-w-[320px] p-0 overflow-hidden border-none bg-white rounded-lg shadow-xl">
          <DialogHeader className="p-4 flex flex-row items-center justify-between space-y-0">
            <DialogTitle className="text-base font-bold text-gray-900">Select action</DialogTitle>
            <button 
              onClick={() => setShowActionModal(false)}
              className="p-1 hover:bg-gray-100 rounded-sm transition-colors"
            >
              <X className="w-4 h-4 text-white bg-black rounded-[2px]" />
            </button>
          </DialogHeader>

          <div className="px-6 pb-6 space-y-6">
            <p className="text-sm text-[#008DA8] italic leading-tight">
              You have selected rows with different statuses. Therefore, choose one of the actions
            </p>

            <RadioGroup value={selectedAction} onValueChange={setSelectedAction} className="gap-4">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="include" id="include" className="border-gray-400 text-gray-600" />
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#00802b]" />
                  <label htmlFor="include" className="text-sm font-medium text-gray-900 cursor-pointer">
                    Included all [{selectedIds.size}]
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <RadioGroupItem value="exclude" id="exclude" className="border-gray-400 text-gray-600" />
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-orange-400" />
                  <label htmlFor="exclude" className="text-sm font-medium text-gray-900 cursor-pointer">
                    Excluded all [{selectedIds.size}]
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <RadioGroupItem value="reverse" id="reverse" className="border-gray-400 text-gray-600" />
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-black" />
                  <label htmlFor="reverse" className="text-sm font-medium text-gray-900 cursor-pointer">
                    Reverse Status
                  </label>
                </div>
              </div>
            </RadioGroup>

            <div className="flex justify-center">
              <Button 
                className="bg-[#00802b] hover:bg-[#006622] text-white px-10 h-9 font-bold text-sm rounded-md"
                onClick={() => setShowActionModal(false)}
              >
                Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <SourceDetailsDrawer
        source={drawerSource}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <Dialog open={showDeepExtractModal} onOpenChange={setShowDeepExtractModal}>
        <DialogContent className="max-w-[400px] p-0 overflow-hidden border-none bg-white rounded-lg shadow-2xl">
          <DialogHeader className="px-4 py-2.5 flex flex-row items-center justify-between space-y-0 border-b">
            <DialogTitle className="text-base font-bold text-gray-900">Deep Extract Data</DialogTitle>
            <button 
              onClick={() => setShowDeepExtractModal(false)}
              className="p-1 hover:bg-gray-100 rounded-sm transition-colors"
            >
              <X className="w-5 h-5 text-white bg-black rounded-[2px]" />
            </button>
          </DialogHeader>

          <div className="px-4 py-3 space-y-3">
            <p className="text-xs text-gray-600">
              Use AI to extract complex tables, charts, and preserve of HTML structure.
            </p>

            <div className="relative h-16 w-full rounded-md overflow-hidden flex">
              <div className="flex-1 bg-[#0095FF] relative group cursor-pointer">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                  <span className="text-[10px] text-white font-medium uppercase tracking-wider">Semantic Analysis</span>
                </div>
              </div>
              <div className="flex-1 bg-[#9B66FF] relative group cursor-pointer">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                  <span className="text-[10px] text-white font-medium uppercase tracking-wider">Visual Context</span>
                </div>
              </div>
              <div className="flex-1 bg-[#1A2B3B] relative group cursor-pointer">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                  <span className="text-[10px] text-white font-medium uppercase tracking-wider">Pattern Recognition</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-[15%] -mb-1 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-[#008DA8]"></div>
            </div>
            
            <p className="text-[11px] text-[#008DA8] font-medium leading-tight">
              Semantic Context Analysis. Evaluates how well the article answers your specific question using vector search.
            </p>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-gray-900">Extract & analyze from {selectedIds.size || filteredSources.length} sources:</h3>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch id="web-content" defaultChecked className="data-[state=checked]:bg-[#00802b]" />
                    <label htmlFor="web-content" className="text-xs font-medium text-gray-700">Web Content & Text</label>
                    <Info className="w-3.5 h-3.5 text-[#008DA8] cursor-help" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch id="visual-assets" className="data-[state=checked]:bg-[#00802b]" />
                    <label htmlFor="visual-assets" className="text-xs font-medium text-gray-700">Visual Assets</label>
                    <Info className="w-3.5 h-3.5 text-[#008DA8] cursor-help" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch id="tables" defaultChecked className="data-[state=checked]:bg-[#00802b]" />
                    <label htmlFor="tables" className="text-xs font-medium text-gray-700">Tables & Datasets</label>
                    <Info className="w-3.5 h-3.5 text-[#008DA8] cursor-help" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch id="structured" className="data-[state=checked]:bg-[#00802b]" />
                    <label htmlFor="structured" className="text-xs font-medium text-gray-700">Structured Data & Archives</label>
                    <Info className="w-3.5 h-3.5 text-[#008DA8] cursor-help" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch id="embedded" className="data-[state=checked]:bg-[#00802b]" />
                    <label htmlFor="embedded" className="text-xs font-medium text-gray-700">Embedded Documents</label>
                    <Info className="w-3.5 h-3.5 text-[#008DA8] cursor-help" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-orange-500 bg-orange-50/50 px-2 py-1.5 rounded-sm border border-orange-100">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <p className="text-[10px] font-medium">High volume selection. Processing may take 2-5 mins.</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <div className="bg-gray-100 px-3 py-1.5 rounded text-xs font-bold text-gray-700">
                Total Cost: $12.34
              </div>
              <Button 
                className="bg-[#00802b] hover:bg-[#006622] text-white px-6 h-8 font-bold text-xs rounded-md"
                onClick={() => setShowDeepExtractModal(false)}
              >
                Apply & Launch
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfidenceModal} onOpenChange={setShowConfidenceModal}>
        <DialogContent className="w-[500px] max-w-[500px] h-[250px] p-0 overflow-hidden border-none bg-white rounded-lg shadow-2xl">
          <DialogHeader className="px-4 py-2.5 flex flex-row items-center justify-between space-y-0 border-b">
            <DialogTitle className="text-base font-bold text-gray-900">Confidence Score</DialogTitle>
            <button 
              onClick={() => setShowConfidenceModal(false)}
              className="p-1 hover:bg-gray-100 rounded-sm transition-colors"
            >
              <X className="w-5 h-5 text-white bg-black rounded-[2px]" />
            </button>
          </DialogHeader>

          <div className="flex flex-1 px-4 pb-4 gap-6 items-center">
            <div className="relative flex items-center justify-center shrink-0" style={{ width: 140, height: 140 }}>
              <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
                <circle cx="70" cy="70" r="58" fill="none" stroke="#1a2030" strokeWidth="12" />
                <circle cx="70" cy="70" r="58" fill="none" stroke="#333850" strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 58}`}
                  strokeDashoffset={`${2 * Math.PI * 58 * (1 - 0.7)}`}
                  strokeLinecap="round"
                />
                <circle cx="70" cy="70" r="58" fill="none" stroke="url(#confidenceGrad)" strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 58}`}
                  strokeDashoffset={`${2 * Math.PI * 58 * (1 - 0.7)}`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="confidenceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00802b" />
                    <stop offset="100%" stopColor="#9B66FF" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">70%</span>
                <span className="text-[10px] text-gray-500">Confidence</span>
                <span className="text-[9px] text-green-500 font-medium mt-0.5">+26% Boost</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 flex-1 min-w-0">
              <p className="text-xs text-gray-500 leading-relaxed">
                Confidence Score is an AI-driven credibility metric that separates verified facts from digital noise.
              </p>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-900">Apply Calculation To:</h4>
                <div className="flex items-center gap-2">
                  <Switch id="conf-included" defaultChecked className="data-[state=checked]:bg-[#00802b]" />
                  <label htmlFor="conf-included" className="text-xs font-medium text-gray-700">Included sources: {includedCount}</label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="conf-excluded" className="data-[state=checked]:bg-[#00802b]" />
                  <label htmlFor="conf-excluded" className="text-xs font-medium text-gray-700">Excluded sources: {totalCount - includedCount}</label>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t mt-auto">
                <div className="bg-gray-100 px-3 py-1.5 rounded text-xs font-bold text-gray-700">
                  Total Cost: $12.34
                </div>
                <Button 
                  className="bg-[#00802b] hover:bg-[#006622] text-white px-5 h-8 font-bold text-xs rounded-md"
                  onClick={() => setShowConfidenceModal(false)}
                >
                  Apply & Launch
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showEnhanceModal && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-300"
            onClick={() => setShowEnhanceModal(false)}
            data-testid="overlay-enhance-drawer"
          />
          <div
            className="fixed top-0 right-0 z-50 h-full w-[480px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
          >
            <div className="flex border-b border-gray-200 bg-[#5A6B7C] min-h-[34px] shrink-0">
              <div className="px-6 py-2 bg-[#0097B2] text-white text-xs font-bold flex items-center justify-center">
                ENHANCE RESEARCH
              </div>
              <div className="flex-1 bg-[#5A6B7C]" />
              <button
                onClick={() => setShowEnhanceModal(false)}
                className="px-3 py-2 hover:bg-[#4a5b6c] transition-colors"
                data-testid="button-enhance-close"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="space-y-5">
                <p className="text-sm text-gray-500">
                  Adjust the depth of analysis and data sources to enhance your current research. This will optimize your budget and ensure maximum accuracy.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 border-b border-gray-200">
                    <span className="py-2">SOURCES</span>
                    <div className="flex items-center">
                      <button
                        className={cn(
                          "h-9 text-xs font-medium px-4 border-b-2 transition-colors",
                          enhanceScope === "web" ? "border-green-500 text-green-700 bg-green-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                        )}
                        onClick={() => setEnhanceScope("web")}
                        data-testid="button-enhance-scope-web"
                      >
                        Web
                      </button>
                      <button
                        className={cn(
                          "h-9 text-xs font-medium px-4 border-b-2 transition-colors",
                          enhanceScope === "files" ? "border-green-500 text-green-700 bg-green-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                        )}
                        onClick={() => setEnhanceScope("files")}
                        data-testid="button-enhance-scope-files"
                      >
                        Files
                      </button>
                    </div>
                  </div>

                  {enhanceScope === "web" ? (
                    <div className="border-2 border-[#0097B2] rounded-sm p-4 bg-white space-y-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Switch defaultChecked className="scale-75 data-[state=checked]:bg-[#0097B2]" />
                          <span className="text-sm text-gray-700">Web Pages & Websites: <span className="font-mono">{"\u221E"}</span></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-gray-700">Search Language</span>
                          <Info className="w-4 h-4 text-[#0097B2]" />
                        </div>
                        <Select
                          value="auto"
                          onValueChange={(val) => {
                            if (val !== "auto" && !enhanceLanguages.includes(val)) {
                              setEnhanceLanguages(prev => [...prev, val]);
                            }
                          }}
                        >
                          <SelectTrigger className="h-8 w-[140px] bg-white border-gray-300 text-xs" data-testid="select-enhance-language">
                            <SelectValue placeholder="Auto Detect" />
                          </SelectTrigger>
                          <SelectContent>
                            {enhanceLanguageOptions.filter(l => l.value === "auto" || !enhanceLanguages.includes(l.value)).map(l => (
                              <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {enhanceLanguages.map(code => {
                          const lang = enhanceLanguageOptions.find(l => l.value === code);
                          const label = lang?.label || code;
                          const match = label.match(/\(([^)]+)\)/);
                          const short = match ? match[1] : code;
                          return (
                            <div key={code} className="bg-[#A0A0A0] text-black text-xs font-bold px-2 py-1 rounded-sm flex items-center gap-1">
                              {short}
                              <X className="w-3 h-3 text-red-600 cursor-pointer" onClick={() => setEnhanceLanguages(prev => prev.filter(l => l !== code))} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="border border-green-600 rounded-sm bg-white shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between p-2 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5" strokeWidth={1.5} />
                          <span className="text-sm font-medium">Files & Assets: 3/10</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span>Context window</span>
                          <div className="w-32 h-4 bg-white border border-green-500 rounded-sm relative overflow-hidden">
                            <div className="absolute inset-y-0 left-0 bg-green-500 w-[20%]" />
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-gray-700 z-10">Usage: 20%</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="space-y-2 mb-3">
                          {[
                            { name: "Market Analysis Q3.pdf", type: "PDF", size: "2.4 MB" },
                            { name: "Competitor Report.docx", type: "DOCX", size: "1.8 MB" },
                            { name: "Financial Projections.xlsx", type: "XLSX", size: "5.1 MB" },
                          ].map((file, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between bg-[#008DA8] text-white px-3 py-2 rounded-sm cursor-pointer hover:bg-[#007A92] transition-colors"
                              onClick={() => {
                                const previewFiles = [
                                  { id: "enhance-0", name: "Market Analysis Q3.pdf", type: "PDF", size: "2.4 MB" },
                                  { id: "enhance-1", name: "Competitor Report.docx", type: "DOCX", size: "1.8 MB" },
                                  { id: "enhance-2", name: "Financial Projections.xlsx", type: "XLSX", size: "5.1 MB" },
                                ];
                                openPreview({
                                  files: previewFiles,
                                  initialFileId: `enhance-${i}`,
                                  context: "input",
                                });
                              }}
                              data-testid={`card-enhance-file-${i}`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="w-4 h-4 text-white/80 shrink-0" strokeWidth={1.5} />
                                <span className="text-[10px] font-medium truncate">{file.name}</span>
                              </div>
                              <XCircle
                                className="w-4 h-4 text-cyan-200 hover:text-white cursor-pointer shrink-0"
                                onClick={(e) => { e.stopPropagation(); }}
                              />
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50 h-8 text-xs font-medium" data-testid="button-enhance-upload">
                          <Upload className="w-3 h-3 mr-1" /> Upload files
                        </Button>
                      </div>
                      <div className="bg-gray-50 p-2 border-t border-gray-200 flex items-center gap-2">
                        <Switch className="scale-75 data-[state=checked]:bg-green-600" />
                        <span className="text-xs font-medium flex items-center gap-1">
                          <Link2 className="w-3 h-3" /> Extract & Research Embedded URLs <Info className="w-3 h-3 text-[#0097B2]" />
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 flex-wrap pt-2">
                    <span className="text-sm font-bold text-gray-700">Data Engine</span>
                    <Info className="w-3.5 h-3.5 text-gray-400" />
                    <Select value={enhanceEngine} onValueChange={setEnhanceEngine}>
                      <SelectTrigger className="h-8 w-[140px] bg-white border-gray-300 text-xs font-bold" data-testid="select-enhance-engine">
                        <div className="flex items-center gap-1.5">
                          {enhanceEngine === "ultimate" && <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                          {enhanceEngine === "pro" && <Zap className="w-3 h-3 text-blue-500 fill-blue-500" />}
                          {enhanceEngine === "fast" && <Zap className="w-3 h-3 text-green-500 fill-green-500" />}
                          <span className="capitalize">{enhanceEngine === "fast" ? "Standard" : enhanceEngine === "pro" ? "Advanced" : "Ultimate"}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ultimate">Ultimate</SelectItem>
                        <SelectItem value="pro">Advanced</SelectItem>
                        <SelectItem value="fast">Standard</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-xs text-[#008DA8]">{getEnhanceEngineDesc(enhanceEngine)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 px-5 py-3 border-t border-gray-100 space-y-3">
              <div className="text-left relative">
                <span className="text-xs text-gray-500 font-medium mr-2">Estimated Cost:</span>
                <span
                  className="text-sm font-bold text-[#008DA8] border-b border-[#008DA8] border-dashed cursor-pointer"
                  onClick={() => setEnhanceCostOpen(!enhanceCostOpen)}
                  data-testid="text-enhance-cost"
                >
                  $15.40 - $18.40
                </span>

                {enhanceCostOpen && (
                  <div className="absolute bottom-full left-0 mb-2 w-[440px] bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden text-left">
                    <div className="flex">
                      <div className="flex-1 p-4 border-r border-gray-100">
                        <h4 className="text-xs font-bold text-gray-900 mb-3">Cost Breakdown</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between text-gray-600">
                            <span>Fixed cost for Core generator:</span>
                            <span>$2.00</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Matches cost (10 x $0.15):</span>
                            <span>$1.50</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-gray-600">
                              <span>Enrichment Cost:</span>
                              <span>$0.50</span>
                            </div>
                            <div className="flex justify-between text-gray-400 pl-2 text-[10px]">
                              <span>Core2x (10 x $0.050):</span>
                              <span>$0.50</span>
                            </div>
                            <div className="text-gray-300 pl-2 text-[10px]">company_summary</div>
                          </div>
                          <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                            <span>Total:</span>
                            <span>$4.00</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-[200px] p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-xs font-bold text-gray-900">Budget Control</h4>
                          <button onClick={() => setEnhanceCostOpen(false)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-3 text-xs">
                          <div className="text-gray-600 mb-1">Available Balance: <span className="font-bold text-black">$124.50</span></div>
                          <div className="text-gray-600 mb-2">Current research: <span className="font-bold text-black">$15.4 - $18.4</span></div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={enhanceBudgetCap}
                              onCheckedChange={setEnhanceBudgetCap}
                              className="scale-75 data-[state=checked]:bg-green-600"
                            />
                            <span className="text-orange-400 font-medium">Strict Budget Cap</span>
                            <Info className="w-3 h-3 text-orange-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Button
                className="w-full bg-[#008DA8] hover:bg-[#007A92] text-white font-bold px-6 shadow-md"
                onClick={() => setShowEnhanceModal(false)}
                data-testid="button-enhance-launch"
              >
                Launch Enhanced Research
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
