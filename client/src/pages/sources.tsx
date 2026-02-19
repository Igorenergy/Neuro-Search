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
  Settings2,
  Globe,
  Zap,
  Shield,
  FileText,
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
import { cn } from "@/lib/utils";
import { loadLaunchConfig } from "@/lib/launch-config";
import rocketIcon from "@assets/image_1771405092616.png";

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
    <div className="relative flex items-center gap-1.5">
      <svg width={size} height={size} className="shrink-0">
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
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="text-xs font-bold text-gray-700">{score}%</span>
    </div>
  );
}

export default function SourcesPage() {
  const params = useParams<{ id: string }>();
  const [sources, setSources] = useState(mockSources);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set([1]));
  const [sortBy, setSortBy] = useState("confidence");
  const [filtersActive, setFiltersActive] = useState(3);

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
    <div className="-m-6 md:-m-8 flex flex-col h-[calc(100vh-64px)] w-[calc(100%+48px)] md:w-[calc(100%+64px)] bg-white" data-testid="sources-page">
      {/* Context Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-[#F5F5F7] shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <img src={rocketIcon} alt="" className="w-5 h-5 shrink-0 opacity-80" />
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
            { icon: Globe, color: "text-green-600", bg: "bg-green-100" },
            { icon: Settings2, color: "text-blue-600", bg: "bg-blue-100" },
            { icon: Shield, color: "text-orange-600", bg: "bg-orange-100" },
          ].map((item, i) => (
            <div key={i} className={cn("w-6 h-6 rounded-sm flex items-center justify-center", item.bg)}>
              <item.icon className={cn("w-3.5 h-3.5", item.color)} />
            </div>
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
        <div className="divide-y divide-gray-100">
          {filteredSources.map((source) => (
            <div
              key={source.id}
              className={cn(
                "flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors group",
                selectedIds.has(source.id) && "bg-blue-50/30"
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
                "w-6 h-6 rounded-sm flex items-center justify-center shrink-0 text-[10px] font-bold",
                source.included ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              )}>
                {source.included ? "N" : ""}
              </div>

              <img src={source.favicon} alt="" className="w-4 h-4 shrink-0" />

              <span className="text-xs text-gray-500 shrink-0 w-10">icon</span>

              <span className="text-sm font-medium text-gray-800 truncate flex-1 min-w-0" data-testid={`text-source-title-${source.id}`}>
                {source.title}
              </span>

              <div className="flex items-center gap-1 text-[11px] text-gray-500 shrink-0">
                <FileText className="w-3 h-3" />
                {source.date}
              </div>

              <span className="text-[11px] text-gray-500 shrink-0 w-24">
                Location:{source.location}
              </span>

              <span className="text-[11px] text-gray-500 shrink-0 w-24">
                Language: {source.language}
              </span>

              <div className="shrink-0 flex items-center gap-1">
                <Settings2 className="w-3.5 h-3.5 text-blue-500" />
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
  );
}
