import { useState } from "react";
import { Link } from "wouter";
import {
  Plus,
  MoreVertical,
  Paperclip,
  FileText,
  X,
  ChevronDown,
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
import rocketIcon from "@assets/image_1771405092616.png";

export default function Dashboard() {
  const [showBanner, setShowBanner] = useState(true);

  type ResearchStatus = "success" | "in-progress" | "failed" | "canceled";

  const statusConfig: Record<ResearchStatus, { borderColor: string; route: string; tileBg: string; iconBg: string; iconColor: string }> = {
    "success": { borderColor: "border-l-green-500", route: "/research-success", tileBg: "bg-[#E0F7FA]", iconBg: "bg-[#B2EBF2]", iconColor: "text-[#00838F]" },
    "in-progress": { borderColor: "border-l-blue-500", route: "/research-in-progress", tileBg: "bg-[#E8F5E9]", iconBg: "bg-[#C8E6C9]", iconColor: "text-[#2E7D32]" },
    "failed": { borderColor: "border-l-red-500", route: "/research-failed", tileBg: "bg-[#FCE4EC]", iconBg: "bg-[#F8BBD0]", iconColor: "text-[#C62828]" },
    "canceled": { borderColor: "border-l-orange-400", route: "/research-canceled", tileBg: "bg-[#FFF3E0]", iconBg: "bg-[#FFE0B2]", iconColor: "text-[#E65100]" },
  };

  const tileIcons = [Rocket, DollarSign, TrendingUp, ClipboardList, Zap, FileText];

  const searches: { id: number; title: string; date: string; sources: number; status: ResearchStatus; hasAttachment: boolean; iconIdx: number }[] = [
    { id: 1, title: "Американская Фабрика: Полный анализ и стратегический обзор", date: "5 дек. 2025 г.", sources: 4, status: "success", hasAttachment: true, iconIdx: 0 },
    { id: 2, title: "Startup: AI Deep Research — Анализ рынка и конкурентов", date: "2 дек. 2025 г.", sources: 51, status: "success", hasAttachment: true, iconIdx: 1 },
    { id: 3, title: "Untitled notebook", date: "5 дек. 2025 г.", sources: 0, status: "in-progress", hasAttachment: true, iconIdx: 3 },
    { id: 4, title: "Abacus.AI: Корпоративный анализ и оценка платформы", date: "2 дек. 2025 г.", sources: 61, status: "success", hasAttachment: false, iconIdx: 3 },
    { id: 5, title: "Инновации, Капитал и Стратегии Роста в Технологическом Секторе", date: "2 дек. 2025 г.", sources: 25, status: "failed", hasAttachment: true, iconIdx: 2 },
    { id: 6, title: "Реестр 492 Компаний: Полный анализ и стратегический обзор", date: "2 дек. 2025 г.", sources: 2, status: "success", hasAttachment: false, iconIdx: 5 },
    { id: 7, title: "Untitled notebook", date: "30 нояб. 2025 г.", sources: 0, status: "in-progress", hasAttachment: false, iconIdx: 3 },
    { id: 8, title: "Потеря $1,8 млн на крипте: уроки и выводы для инвесторов", date: "24 нояб. 2025 г.", sources: 1, status: "canceled", hasAttachment: false, iconIdx: 2 },
    { id: 9, title: "Мемуары Криптана: Ретродропи, стратегии и анализ", date: "23 нояб. 2025 г.", sources: 1, status: "success", hasAttachment: false, iconIdx: 4 },
    { id: 10, title: "Искусственный Интеллект и Будущее Технологий", date: "17 нояб. 2025 г.", sources: 24, status: "failed", hasAttachment: false, iconIdx: 5 },
    { id: 11, title: "15 Жестоких Правд о Неконкурентных Рынках", date: "16 нояб. 2025 г.", sources: 1, status: "success", hasAttachment: false, iconIdx: 4 },
  ];

  return (
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
        <h1 className="font-bold text-gray-900 text-[15px]" data-testid="text-searches-title">Your Searches (20)</h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-800">Status</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "h-8 w-8 flex items-center justify-center rounded border transition-all",
                    "bg-[#f8f9fa] border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-white",
                    "data-[state=open]:border-black data-[state=open]:bg-white data-[state=open]:text-black"
                  )}
                  data-testid="button-status-filter"
                >
                  <Filter className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 bg-[#1a1a1a] border-[#333] shadow-xl p-0.5">
                {[
                  { label: "All", count: 20, textColor: "text-gray-300" },
                  { label: "Success", count: 12, textColor: "text-green-500" },
                  { label: "In Progress", count: 3, textColor: "text-blue-500" },
                  { label: "Failed", count: 4, textColor: "text-red-500" },
                  { label: "Canceled", count: 1, textColor: "text-orange-500" },
                ].map((opt) => (
                  <DropdownMenuItem
                    key={opt.label}
                    className={cn(
                      "text-xs cursor-pointer flex justify-between items-center px-2 py-1.5 hover:text-white focus:text-white focus:bg-[#333]",
                      opt.textColor
                    )}
                    data-testid={`filter-${opt.label.toLowerCase().replace(" ", "-")}`}
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Create Research Tile */}
        <Link href="/smart-search/new">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col items-center justify-center min-h-[180px] hover:shadow-md transition-shadow cursor-pointer" data-testid="card-create-research">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3">
              <Plus className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-sm font-bold text-gray-800">Create research</span>
            <div className="mt-2 space-y-1 text-center">
              <span className="block text-[11px] font-bold text-[#008DA8] uppercase tracking-wide">Smart Search</span>
              <span className="block text-[11px] font-bold text-[#008DA8] uppercase tracking-wide">Smart Sheet</span>
            </div>
          </div>
        </Link>

        {/* Research Item Tiles — in-progress first */}
        {[...searches].sort((a, b) => {
          if (a.status === "in-progress" && b.status !== "in-progress") return -1;
          if (a.status !== "in-progress" && b.status === "in-progress") return 1;
          return 0;
        }).map((item) => {
          const config = statusConfig[item.status];
          const IconComponent = tileIcons[item.iconIdx % tileIcons.length];
          return (
            <div
              key={item.id}
              className={cn(
                "rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col min-h-[180px] group relative hover:shadow-md transition-shadow",
                config.tileBg
              )}
              data-testid={`card-research-${item.id}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", config.iconBg)}>
                  <IconComponent className={cn("w-5 h-5", config.iconColor)} />
                </div>
                <div className="flex items-center gap-1">
                  {item.status === "in-progress" && (
                    <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-[spin_10s_linear_infinite]" />
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                      <button className="p-0.5 border-0 bg-transparent opacity-60 hover:opacity-100 transition-opacity" data-testid={`kebab-menu-${item.id}`}>
                        <MoreVertical className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44 bg-[#1a1a1a] border-[#333] shadow-xl">
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-sm text-gray-300 hover:text-white focus:text-white focus:bg-[#333] cursor-pointer"
                        data-testid={`details-${item.id}`}
                      >
                        <FileText className="w-4 h-4 text-gray-400" />
                        Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-sm text-[#008DA8] hover:text-[#00b0cc] focus:text-[#00b0cc] focus:bg-[#333] cursor-pointer"
                        data-testid={`clone-${item.id}`}
                      >
                        <Copy className="w-4 h-4 text-[#008DA8]" />
                        Clone & Restart
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 focus:text-red-400 focus:bg-[#333] cursor-pointer"
                        data-testid={`delete-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <Link href={`${config.route}/${item.id}`} className="flex flex-col flex-1 min-w-0">
                <p className="text-[13px] leading-snug text-gray-800 font-semibold line-clamp-2 mb-auto">
                  {item.title}
                </p>
                <p className="text-[11px] text-gray-500 mt-2">
                  {item.date} • {item.sources} источников
                </p>
              </Link>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center pt-8 pb-12">
        <Button className="bg-[#008DA8] hover:bg-[#007A92] text-white px-8 h-10 rounded-sm font-medium">
          Show more (20)
        </Button>
      </div>
    </div>
  );
}
