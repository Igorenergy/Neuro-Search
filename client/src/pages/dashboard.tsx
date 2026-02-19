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

  const statusConfig: Record<ResearchStatus, { borderColor: string; route: string }> = {
    "success": { borderColor: "border-l-green-500", route: "/research-success" },
    "in-progress": { borderColor: "border-l-blue-500", route: "/research-in-progress" },
    "failed": { borderColor: "border-l-red-500", route: "/research-failed" },
    "canceled": { borderColor: "border-l-orange-400", route: "/research-canceled" },
  };

  const searches: { id: number; title: string; date: string; sources: number; status: ResearchStatus; hasAttachment: boolean }[] = [
    { id: 1, title: "Американская Фабрика: Полный анализ и стратегический обзор", date: "5 дек. 2025 г.", sources: 4, status: "success", hasAttachment: true },
    { id: 2, title: "Startup: AI Deep Research — Анализ рынка и конкурентов", date: "2 дек. 2025 г.", sources: 51, status: "success", hasAttachment: true },
    { id: 3, title: "Untitled notebook", date: "5 дек. 2025 г.", sources: 0, status: "in-progress", hasAttachment: true },
    { id: 4, title: "Abacus.AI: Корпоративный анализ и оценка платформы", date: "2 дек. 2025 г.", sources: 61, status: "success", hasAttachment: false },
    { id: 5, title: "Инновации, Капитал и Стратегии Роста в Технологическом Секторе", date: "2 дек. 2025 г.", sources: 25, status: "failed", hasAttachment: true },
    { id: 6, title: "Реестр 492 Компаний: Полный анализ и стратегический обзор", date: "2 дек. 2025 г.", sources: 2, status: "success", hasAttachment: false },
    { id: 7, title: "Untitled notebook", date: "30 нояб. 2025 г.", sources: 0, status: "in-progress", hasAttachment: false },
    { id: 8, title: "Потеря $1,8 млн на крипте: уроки и выводы для инвесторов", date: "24 нояб. 2025 г.", sources: 1, status: "canceled", hasAttachment: false },
    { id: 9, title: "Мемуары Криптана: Ретродропи, стратегии и анализ", date: "23 нояб. 2025 г.", sources: 1, status: "success", hasAttachment: false },
    { id: 10, title: "Искусственный Интеллект и Будущее Технологий", date: "17 нояб. 2025 г.", sources: 24, status: "failed", hasAttachment: false },
    { id: 11, title: "15 Жестоких Правд о Неконкурентных Рынках", date: "16 нояб. 2025 г.", sources: 1, status: "success", hasAttachment: false },
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
        <h1 className="text-xl font-bold text-gray-900" data-testid="text-searches-title">Your Searches (20)</h1>

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

          <Link href="/smart-search/new">
            <Button size="icon" className="h-9 w-9 bg-[#00802b] hover:bg-[#006622] rounded-md shadow-sm border border-[#006622]" data-testid="button-new-search">
              <Search className="w-5 h-5 text-white stroke-[2.5]" />
            </Button>
          </Link>
        </div>
      </div>
      {/* Research List */}
      <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
        {/* Create Research Row */}
        <Link href="/smart-search/new">
          <div className="flex items-center gap-3 p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors border-l-[3px] border-l-transparent" data-testid="card-create-research">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <Plus className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-sm font-bold text-[#008DA8]">Create new research</span>
          </div>
        </Link>

        {/* Research Items */}
        {searches.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-start gap-3 p-3 bg-white hover:bg-gray-50 cursor-pointer group transition-colors border-b border-gray-100 last:border-b-0 border-l-[3px]",
              statusConfig[item.status].borderColor
            )}
            data-testid={`card-research-${item.id}`}
          >
            <Link href={`${statusConfig[item.status].route}/${item.id}`} className="flex items-start gap-3 flex-1 min-w-0">
              <img src={rocketIcon} alt="Rocket" className="w-5 h-5 mt-0.5 shrink-0 opacity-70" />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] leading-tight text-gray-800 line-clamp-2 font-medium">
                  {item.title}
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  {item.date} • {item.sources} источников
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-1 shrink-0 mt-0.5">
              {item.hasAttachment && (
                <Paperclip className="w-3.5 h-3.5 text-gray-400 rotate-45 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                  <button className="p-0 border-0 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity" data-testid={`kebab-menu-${item.id}`}>
                    <MoreVertical className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-700" />
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
        ))}
      </div>
      <div className="flex justify-center pt-8 pb-12">
        <Button className="bg-[#008DA8] hover:bg-[#007A92] text-white px-8 h-10 rounded-sm font-medium">
          Show more (20)
        </Button>
      </div>
    </div>
  );
}
