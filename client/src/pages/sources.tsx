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
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { loadLaunchConfig } from "@/lib/launch-config";
import { ResearchBriefingSidebar } from "@/components/research-briefing-sidebar";


interface SourceRow {
  id: number;
  title: string;
  domain: string;
  favicon: string;
  date: string;
  location: string;
  language: string;
  confidenceScore: number;
  included: boolean;
  type: "web" | "pdf" | "doc";
}

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
            { icon: Globe, color: "text-green-600", bg: "bg-green-100", onClick: () => setShowActionModal(true) },
            { icon: Settings, color: "text-blue-600", bg: "bg-blue-100", onClick: () => {} },
            { icon: Shield, color: "text-orange-600", bg: "bg-orange-100", onClick: () => {} },
          ].map((item, i) => (
            <button 
              key={i} 
              className={cn("w-6 h-6 rounded-sm flex items-center justify-center hover:opacity-80 transition-opacity", item.bg)}
              onClick={item.onClick}
              data-testid={`button-toolbar-action-${i}`}
            >
              <item.icon className={cn("w-3.5 h-3.5", item.color)} />
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-gray-300" />

        <span className="text-xs font-bold text-gray-700">
          INCLUDED: {includedCount} [{totalCount}]
        </span>

        <div className="w-px h-5 bg-gray-300" />

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
      </div>

      {/* Enhance Research + Progress */}
      <div className="flex items-center gap-4 px-4 py-2 border-b border-gray-200 bg-white shrink-0">
        <Button variant="outline" size="sm" className="h-7 text-xs font-bold text-[#008DA8] border-[#008DA8] hover:bg-[#008DA8]/5 px-3" data-testid="button-enhance-research">
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
        <div className="flex flex-col gap-2 p-3">
          {filteredSources.map((source) => (
            <div
              key={source.id}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 bg-white border rounded-md transition-colors group",
                source.included
                  ? "border-l-[3px] border-l-green-500 border-t-gray-200 border-r-gray-200 border-b-gray-200"
                  : "border-l-[3px] border-l-orange-400 border-t-gray-200 border-r-gray-200 border-b-gray-200",
                selectedIds.has(source.id) && "bg-blue-50/40"
              )}
              data-testid={`row-source-${source.id}`}
            >
              <button onClick={() => toggleSelect(source.id)} className="shrink-0">
                {selectedIds.has(source.id) ? (
                  <CheckSquare className="w-4 h-4 text-[#008DA8]" />
                ) : (
                  <Square className="w-4 h-4 text-gray-300" />
                )}
              </button>

              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                source.included ? "bg-[#00802b]" : "border-2 border-orange-400"
              )}>
                {source.included ? (
                  <CheckSquare className="w-3 h-3 text-white" />
                ) : (
                  <Circle className="w-2 h-2 fill-orange-400 text-orange-400" />
                )}
              </div>

              <div className={cn(
                "px-2 py-0.5 rounded-sm text-[10px] font-bold shrink-0 uppercase",
                source.included ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-600"
              )}>
                {source.included ? "icon" : "icon"}
              </div>

              <span className="text-sm font-medium text-gray-800 truncate flex-1 min-w-0" data-testid={`text-source-title-${source.id}`}>
                {source.title}
              </span>

              <div className="flex items-center gap-1 text-[11px] text-gray-500 shrink-0 mr-auto">
                <FileText className="w-3 h-3" />
                {source.date}
              </div>

              <div className="flex items-center gap-1 text-[11px] text-gray-500 shrink-0">
                <Globe className="w-3 h-3" />
                Location:{source.location}
              </div>

              <span className="text-[11px] text-gray-500 shrink-0">
                Language: {source.language}
              </span>

              <div className="shrink-0 flex items-center gap-1">
                <Settings className="w-3.5 h-3.5 text-blue-500" />
              </div>

              <div className="shrink-0">
                <ConfidenceRing score={source.confidenceScore} />
              </div>

              <div className="flex items-center gap-1 shrink-0">
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
                    <DropdownMenuItem>Deep Extract</DropdownMenuItem>
                    <DropdownMenuItem>Open Original</DropdownMenuItem>
                    <DropdownMenuItem>{source.included ? "Exclude" : "Include"}</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
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
                  <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                    <CheckSquare className="w-3 h-3 text-white" />
                  </div>
                  <label htmlFor="include" className="text-sm font-medium text-gray-900 cursor-pointer">
                    Included all [{selectedIds.size}]
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <RadioGroupItem value="exclude" id="exclude" className="border-gray-400 text-gray-600" />
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-orange-400 rounded-full flex items-center justify-center">
                    <Circle className="w-2 h-2 fill-orange-400 text-orange-400" />
                  </div>
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
    </div>
  );
}
