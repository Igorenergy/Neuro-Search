import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Search, 
  Plus, 
  Settings, 
  Bell, 
  User, 
  Menu,
  ChevronDown,
  ChevronUp,
  Paperclip,
  MoreVertical,
  Zap,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Pin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Trash2, FileText, Copy, Filter, RefreshCw, Archive, Download, StopCircle, FastForward } from "lucide-react";
import rocketIcon from "@assets/image_1771405092616.png";
import moreIcon from "@assets/изображение_1771596463092.png";
import CloneRestartModal from "@/components/clone-restart-modal";
import AbortResearchModal from "@/components/abort-research-modal";
import FinishEarlyModal from "@/components/finish-early-modal";
import ResearchDetailsModal from "@/components/research-details-modal";

type ResearchStatus = "success" | "in-progress" | "failed" | "canceled";

function CollapsedSidebar({
  sidebarVisibleItems,
  visibleResearchItems,
  statusConfig,
  statusFilter,
  setStatusFilter,
  rocketIcon,
  pinnedIds,
  togglePin,
  setSelectedItem,
  setIsPinned,
  setDetailsOpen,
  setCloneOpen,
  setDeleteOpen,
  setAbortItem,
  setAbortOpen,
  setFinishEarlyOpen,
}: {
  sidebarVisibleItems: { id: number; title: string; status: ResearchStatus }[];
  visibleResearchItems: { id: number; title: string; status: ResearchStatus }[];
  statusConfig: Record<ResearchStatus, { hoverBorder: string; dotColor: string; route: string }>;
  statusFilter: "all" | ResearchStatus;
  setStatusFilter: (v: "all" | ResearchStatus) => void;
  rocketIcon: string;
  pinnedIds: number[];
  togglePin: (id: number) => void;
  setSelectedItem: (item: { id: number; title: string } | null) => void;
  setIsPinned: (v: boolean) => void;
  setDetailsOpen: (v: boolean) => void;
  setCloneOpen: (v: boolean) => void;
  setDeleteOpen: (v: boolean) => void;
  setAbortItem: (item: { id: number; title: string } | null) => void;
  setAbortOpen: (v: boolean) => void;
  setFinishEarlyOpen: (v: boolean) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollUp(el.scrollTop > 0);
    setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [checkScroll, sidebarVisibleItems]);

  const scrollBy = (direction: "up" | "down") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ top: direction === "up" ? -100 : 100, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4 h-full">
      <Link href="/smart-search/new">
        <Button size="icon" variant="ghost" className="h-10 w-10 text-[#006E7D] hover:bg-[#006E7D]/10 transition-colors">
          <Plus className="w-[30px] h-[30px]" />
        </Button>
      </Link>
      <Link href="/research/search">
        <Button size="icon" variant="ghost" className="h-10 w-10 text-[#5F8D4E] hover:bg-[#5F8D4E]/10 transition-colors">
          <Search className="w-[30px] h-[30px]" />
        </Button>
      </Link>
      <div className="w-8 h-[1px] bg-gray-300" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "h-7 w-7 flex items-center justify-center rounded border transition-all",
              statusFilter === "all"
                ? "bg-[#f8f9fa] border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-white"
                : statusFilter === "success"
                ? "bg-white border-[#22c55e] text-[#22c55e] shadow-sm"
                : statusFilter === "in-progress"
                ? "bg-white border-[#3b82f6] text-[#3b82f6] shadow-sm"
                : statusFilter === "failed"
                ? "bg-white border-[#ef4444] text-[#ef4444] shadow-sm"
                : "bg-white border-[#f97316] text-[#f97316] shadow-sm",
              "data-[state=open]:bg-white"
            )}
            data-testid="button-collapsed-filter-status"
          >
            <Filter className="w-3.5 h-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="right" className="w-36 bg-[#1a1a1a] border-[#333] shadow-xl p-0.5">
          {([
            { value: "all" as const, label: "All", count: visibleResearchItems.length, textColor: "text-gray-100" },
            { value: "success" as const, label: "Success", count: visibleResearchItems.filter(i => i.status === "success").length, textColor: "text-[#22c55e]" },
            { value: "in-progress" as const, label: "In Progress", count: visibleResearchItems.filter(i => i.status === "in-progress").length, textColor: "text-[#3b82f6]" },
            { value: "failed" as const, label: "Failed", count: visibleResearchItems.filter(i => i.status === "failed").length, textColor: "text-[#ef4444]" },
            { value: "canceled" as const, label: "Canceled", count: visibleResearchItems.filter(i => i.status === "canceled").length, textColor: "text-[#f97316]" },
          ]).map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              className={cn("text-xs cursor-pointer flex justify-between items-center px-2 py-1 hover:text-white focus:text-white focus:bg-[#333]", statusFilter === opt.value ? "font-bold text-[#008DA8] focus:text-[#008DA8]" : opt.textColor)}
              onClick={() => setStatusFilter(opt.value)}
              data-testid={`collapsed-filter-${opt.value}`}
            >
              <span>{opt.label}</span>
              <span className="text-[9px] text-gray-500 ml-2">{opt.count}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <button
        className={cn(
          "w-7 h-5 flex items-center justify-center rounded transition-all",
          canScrollUp ? "text-gray-500 hover:text-gray-800 hover:bg-gray-200 cursor-pointer" : "text-gray-300 cursor-default"
        )}
        onClick={() => scrollBy("up")}
        disabled={!canScrollUp}
        data-testid="button-scroll-up"
      >
        <ChevronUp className="w-4 h-4" />
      </button>
      <div
        ref={scrollRef}
        className="flex-1 w-full px-2 overflow-y-auto scrollbar-none"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex flex-col items-center gap-3 py-1">
          {sidebarVisibleItems.map(item => {
            const config = statusConfig[item.status];
            const isInProgress = item.status === "in-progress";
            const isPinned = pinnedIds.includes(item.id);
            const borderHoverColor =
              item.status === "success" ? "#22c55e" :
              item.status === "in-progress" ? "#3b82f6" :
              item.status === "failed" ? "#ef4444" :
              "#f97316";

            return (
              <div key={item.id} className="relative group flex items-center justify-start pl-1" title={item.title}>
                <Link href={`${config.route}/${item.id}`}>
                  <div className="relative w-[39.6px] h-[39.6px] flex items-center justify-center cursor-pointer transition-transform duration-200 group-hover:scale-[0.88]">
                    <div
                      className={cn(
                        "absolute inset-0 rounded-full border-[2.2px]",
                        isInProgress ? "border-[#3b82f6] border-t-transparent animate-[spin_3s_linear_infinite]" : ""
                      )}
                      style={!isInProgress ? { borderColor: borderHoverColor } : undefined}
                    />
                    <div className="w-[35.2px] h-[35.2px] rounded-full bg-[#E6E1EF] flex items-center justify-center group-hover:bg-white transition-colors">
                      <img src={rocketIcon} alt="Rocket" className="w-[27.5px] h-[27.5px] opacity-70" />
                    </div>
                  </div>
                </Link>
                <div className="absolute left-[34px] top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  {(!isInProgress || sidebarVisibleItems.filter(i => i.status === "in-progress").indexOf(item) >= 2) && (
                    <button
                      className={cn(
                        "w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 transition-colors cursor-pointer",
                        isPinned ? "text-gray-600" : "text-gray-400"
                      )}
                      onClick={(e) => { e.stopPropagation(); togglePin(item.id); }}
                      data-testid={`collapsed-pin-${item.id}`}
                      title={isPinned ? "Unpin" : "Pin"}
                    >
                      <Pin className={cn("w-3 h-3", isPinned ? "rotate-45" : "rotate-45")} />
                    </button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                      <button
                        className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors cursor-pointer"
                        data-testid={`collapsed-kebab-${item.id}`}
                      >
                        <MoreVertical className="w-3 h-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" side="right" className="w-44 bg-[#1a1a1a] border-[#333] shadow-xl">
                      {isInProgress ? (
                        <>
                          <DropdownMenuItem
                            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 focus:text-red-400 focus:bg-[#333] cursor-pointer"
                            onClick={(e) => { e.preventDefault(); setAbortItem(item); setAbortOpen(true); }}
                            data-testid={`collapsed-abort-${item.id}`}
                          >
                            <StopCircle className="w-4 h-4" />
                            Abort Research
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2 text-sm text-[#22c55e] hover:text-[#16a34a] focus:text-[#16a34a] focus:bg-[#333] cursor-pointer"
                            onClick={(e) => { e.preventDefault(); setAbortItem(item); setFinishEarlyOpen(true); }}
                            data-testid={`collapsed-finish-early-${item.id}`}
                          >
                            <FastForward className="w-4 h-4" />
                            Finish Early
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem
                            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white focus:text-white focus:bg-[#333] cursor-pointer"
                            onClick={(e) => { e.preventDefault(); setSelectedItem(item); setIsPinned(isPinned); setDetailsOpen(true); }}
                            data-testid={`collapsed-details-${item.id}`}
                          >
                            <FileText className="w-4 h-4 text-gray-400" />
                            Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2 text-sm text-[#008DA8] hover:text-[#00b0cc] focus:text-[#00b0cc] focus:bg-[#333] cursor-pointer"
                            onClick={(e) => { e.preventDefault(); setCloneOpen(true); }}
                            data-testid={`collapsed-clone-${item.id}`}
                          >
                            <Copy className="w-4 h-4 text-[#008DA8]" />
                            Clone & Restart
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white focus:text-white focus:bg-[#333] cursor-pointer"
                            data-testid={`collapsed-archive-${item.id}`}
                          >
                            <Archive className="w-4 h-4 text-gray-400" />
                            Archive Project
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white focus:text-white focus:bg-[#333] cursor-pointer"
                            data-testid={`collapsed-export-${item.id}`}
                          >
                            <Download className="w-4 h-4 text-gray-400" />
                            Export Project
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 focus:text-red-400 focus:bg-[#333] cursor-pointer"
                            onClick={(e) => { e.preventDefault(); setSelectedItem(item); setDeleteOpen(true); }}
                            data-testid={`collapsed-delete-${item.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <button
        className={cn(
          "w-7 h-5 flex items-center justify-center rounded transition-all",
          canScrollDown ? "text-gray-500 hover:text-gray-800 hover:bg-gray-200 cursor-pointer" : "text-gray-300 cursor-default"
        )}
        onClick={() => scrollBy("down")}
        disabled={!canScrollDown}
        data-testid="button-scroll-down"
      >
        <ChevronDown className="w-4 h-4" />
      </button>
      <div className="pb-2" />
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ id: number; title: string } | null>(null);
  const [isPinned, setIsPinned] = useState(false);


  const statusConfig: Record<ResearchStatus, { hoverBorder: string; dotColor: string; route: string }> = {
    "success": { hoverBorder: "hover:border-green-500", dotColor: "bg-green-500", route: "/research-success" },
    "in-progress": { hoverBorder: "hover:border-blue-500", dotColor: "bg-blue-500", route: "/research-in-progress" },
    "failed": { hoverBorder: "hover:border-red-500", dotColor: "bg-red-500", route: "/research-failed" },
    "canceled": { hoverBorder: "hover:border-orange-400", dotColor: "bg-orange-400", route: "/research-canceled" },
  };

  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [pinnedIds, setPinnedIds] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | ResearchStatus>("all");
  const [abortOpen, setAbortOpen] = useState(false);
  const [finishEarlyOpen, setFinishEarlyOpen] = useState(false);
  const [abortItem, setAbortItem] = useState<{ id: number; title: string } | null>(null);

  const researchItems: { id: number; title: string; status: ResearchStatus }[] = [
    { id: 1, title: "Американская Фабрика: Полный анализ и стратегический обзор", status: "success" },
    { id: 2, title: "Startup: AI Deep Research — Анализ рынка и конкурентов", status: "success" },
    { id: 3, title: "Research name one", status: "in-progress" },
    { id: 4, title: "Abacus.AI: Корпоративный анализ и оценка платформы", status: "success" },
    { id: 5, title: "Инновации, Капитал и Стратегии Роста в Технологическом Секторе", status: "failed" },
    { id: 6, title: "Реестр 492 Компаний: Полный анализ и стратегический обзор", status: "success" },
    { id: 7, title: "Research name two", status: "in-progress" },
    { id: 8, title: "Потеря $1,8 млн на крипте: уроки и выводы для инвесторов", status: "canceled" },
    { id: 9, title: "Мемуары Криптана: Ретродропи, стратегии и анализ", status: "success" },
    { id: 10, title: "Искусственный Интеллект и Будущее Технологий", status: "failed" },
    { id: 11, title: "15 Жестоких Правд о Неконкурентных Рынках", status: "success" },
    { id: 12, title: "Анализ Рынка Электромобилей: Tesla vs BYD vs Rivian — Конкурентный анализ и доля рынка", status: "success" },
    { id: 13, title: "Кибербезопасность в Эпоху AI: Новые Угрозы и Стратегии Защиты данных", status: "canceled" },
    { id: 14, title: "Глобальные Цепочки Поставок 2025: Реструктуризация и Геополитические вызовы", status: "success" },
    { id: 15, title: "Метавселенная для Бизнеса: ROI Анализ Корпоративных Внедрений и пользовательского опыта", status: "failed" },
    { id: 16, title: "Зелёная Энергетика: Инвестиционные Возможности в Солнечной и Ветровой энергетике", status: "success" },
    { id: 17, title: "Нейроинтерфейсы и BCI: Медицинские Применения и Этические Вопросы будущего", status: "success" },
    { id: 18, title: "Рынок SaaS B2B: Тренды Консолидации и Стратегии Выхода 2025–2027 годов", status: "canceled" },
    { id: 19, title: "Автономное Вождение Level 4: Регуляторные Барьеры и Дорожная Карта развития", status: "success" },
    { id: 20, title: "Цифровой Рубль и CBDC: Макроэкономический Анализ и Сценарии Внедрения в РФ", status: "failed" },
  ];

  const visibleResearchItems = researchItems.filter(item => !deletedIds.includes(item.id));
  const filteredItems = statusFilter === "all" ? visibleResearchItems : visibleResearchItems.filter(item => item.status === statusFilter);
  const pinnedItems = filteredItems.filter(item => pinnedIds.includes(item.id)).sort((a, b) => {
    if (a.status === "in-progress" && b.status !== "in-progress") return -1;
    if (a.status !== "in-progress" && b.status === "in-progress") return 1;
    return 0;
  });
  const unpinnedItems = filteredItems.filter(item => !pinnedIds.includes(item.id)).sort((a, b) => {
    if (a.status === "in-progress" && b.status !== "in-progress") return -1;
    if (a.status !== "in-progress" && b.status === "in-progress") return 1;
    return 0;
  });

  const sidebarVisibleItems = [...pinnedItems, ...unpinnedItems].sort((a, b) => {
    if (a.status === "in-progress" && b.status !== "in-progress") return -1;
    if (a.status !== "in-progress" && b.status === "in-progress") return 1;
    return 0;
  });

  const togglePin = (id: number) => {
    setPinnedIds(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]);
  };

  const SidebarContent = ({ collapsed }: { collapsed?: boolean }) => (
    <div className="flex flex-col h-full bg-[#F5F5F7] border-r border-gray-200 text-gray-800 font-sans">
      {/* Header */}
      <div className={cn("flex items-center justify-between px-3 py-2 h-[57px] border-b border-gray-200 bg-[#EBEBEB]", collapsed && "justify-center")}>
        {!collapsed && (
          <div className="flex items-center gap-2 overflow-hidden h-8">
            <div className="w-8 h-8 bg-gray-200 border border-gray-400 flex items-center justify-center rounded-sm shrink-0">
               <span className="text-[10px] font-bold text-gray-500">Logo</span>
            </div>
            <span className="font-bold text-lg text-gray-800 tracking-tight">Neuro-Search</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-12 w-12 text-black hover:bg-black/5 transition-transform flex items-center justify-center"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu className="w-8 h-8 stroke-[3]" />
        </Button>
      </div>

      {!collapsed ? (
        <>
          {/* Actions Bar */}
          <div className="p-2 space-y-2">
            <div className="flex items-center gap-2">
              <Link href="/smart-search/new" className="flex-1">
                <Button variant="outline" className="w-full justify-center bg-white border-gray-400 text-[#006E7D] font-bold hover:bg-gray-50 h-9 rounded-sm gap-1">
                  <Plus className="w-4 h-4 stroke-[3]" /> Start new search
                </Button>
              </Link>
              
              <Link href="/research/search">
                <Button size="icon" className="h-9 w-9 bg-[#5F8D4E] hover:bg-[#4d753e] rounded-sm shrink-0">
                  <Search className="w-5 h-5 text-white stroke-[3]" />
                </Button>
              </Link>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-2 px-1 mt-2">
              <span className="text-sm font-semibold text-black">Latest research</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className={cn(
                      "h-7 w-7 flex items-center justify-center rounded border transition-all",
                      statusFilter === "all"
                        ? "bg-[#f8f9fa] border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-white"
                        : statusFilter === "success"
                        ? "bg-white border-[#22c55e] text-[#22c55e] shadow-sm"
                        : statusFilter === "in-progress"
                        ? "bg-white border-[#3b82f6] text-[#3b82f6] shadow-sm"
                        : statusFilter === "failed"
                        ? "bg-white border-[#ef4444] text-[#ef4444] shadow-sm"
                        : "bg-white border-[#f97316] text-[#f97316] shadow-sm",
                      "data-[state=open]:bg-white"
                    )} 
                    data-testid="button-filter-status"
                  >
                    <Filter className="w-3.5 h-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36 bg-[#1a1a1a] border-[#333] shadow-xl p-0.5">
                  {([
                    { value: "all", label: "All", count: visibleResearchItems.length, textColor: "text-gray-100" },
                    { value: "success", label: "Success", count: visibleResearchItems.filter(i => i.status === "success").length, textColor: "text-[#22c55e]" },
                    { value: "in-progress", label: "In Progress", count: visibleResearchItems.filter(i => i.status === "in-progress").length, textColor: "text-[#3b82f6]" },
                    { value: "failed", label: "Failed", count: visibleResearchItems.filter(i => i.status === "failed").length, textColor: "text-[#ef4444]" },
                    { value: "canceled", label: "Canceled", count: visibleResearchItems.filter(i => i.status === "canceled").length, textColor: "text-[#f97316]" },
                  ] as const).map((opt) => (
                    <DropdownMenuItem
                      key={opt.value}
                      className={cn("text-xs cursor-pointer flex justify-between items-center px-2 py-1 hover:text-white focus:text-white focus:bg-[#333]", statusFilter === opt.value ? "font-bold text-[#008DA8] focus:text-[#008DA8]" : opt.textColor)}
                      onClick={() => setStatusFilter(opt.value)}
                      data-testid={`filter-${opt.value}`}
                    >
                      <span>{opt.label}</span>
                      <span className="text-[9px] text-gray-500 ml-2">{opt.count}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Research List */}
          <div className="flex-1 overflow-hidden bg-[#E6E1EF] mx-2 mb-2 border border-gray-300 rounded-sm">
            <ScrollArea className="h-full">
              {/* Pinned Items */}
              {pinnedItems.length > 0 && (
              <div className="sticky top-0 z-10 bg-[#E6E1EF] divide-y divide-gray-200/50 border-b border-gray-300">
                {pinnedItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-2 p-3 hover:bg-white/50 cursor-pointer group transition-all rounded-sm">
                    <Link href={`${statusConfig[item.status].route}/${item.id}`} className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="relative w-[33px] h-[33px] shrink-0 flex items-center justify-center">
                        <div 
                          className={cn(
                            "absolute inset-0 rounded-full border-[2.2px]",
                            item.status === "in-progress" ? "border-[#3b82f6] border-t-transparent animate-[spin_3s_linear_infinite]" : ""
                          )}
                          style={item.status !== "in-progress" ? { borderColor: item.status === 'success' ? '#22c55e' : item.status === 'failed' ? '#ef4444' : '#f97316' } : undefined}
                        />
                        <div className="w-[27.5px] h-[27.5px] rounded-full bg-[#E6E1EF] flex items-center justify-center">
                          <img src={rocketIcon} alt="Rocket" className="w-[16.5px] h-[16.5px] opacity-70" />
                        </div>
                      </div>
                      <p className="text-[13px] leading-tight text-gray-800 line-clamp-2 font-medium flex-1" title={item.title}>
                        {item.title}
                      </p>
                    </Link>
                    <div className="flex flex-col items-center gap-1 shrink-0 mt-0.5">
                      {item.status === "in-progress" ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                            <button className="p-0 border-0 bg-transparent" data-testid={`kebab-menu-${item.id}`}>
                              <MoreVertical className="w-3.5 h-3.5 text-gray-500 cursor-pointer hover:text-gray-700" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 bg-[#1a1a1a] border-[#333] shadow-xl">
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 focus:text-red-400 focus:bg-[#333] cursor-pointer"
                              onClick={(e) => { e.preventDefault(); setAbortItem(item); setAbortOpen(true); }}
                              data-testid={`abort-${item.id}`}
                            >
                              <StopCircle className="w-4 h-4" />
                              Abort Research
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-sm text-[#22c55e] hover:text-[#16a34a] focus:text-[#16a34a] focus:bg-[#333] cursor-pointer"
                              onClick={(e) => { e.preventDefault(); setAbortItem(item); setFinishEarlyOpen(true); }}
                              data-testid={`finish-early-${item.id}`}
                            >
                              <FastForward className="w-4 h-4" />
                              Finish Early
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <>
                          <Pin
                            className="w-3.5 h-3.5 text-gray-500 rotate-45 cursor-pointer hover:text-gray-700"
                            onClick={(e) => { e.stopPropagation(); togglePin(item.id); }}
                            data-testid={`pin-${item.id}`}
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                              <button className="p-0 border-0 bg-transparent" data-testid={`kebab-menu-${item.id}`}>
                                <MoreVertical className="w-3.5 h-3.5 text-gray-500 cursor-pointer hover:text-gray-700" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44 bg-[#1a1a1a] border-[#333] shadow-xl">
                              <DropdownMenuItem
                                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white focus:text-white focus:bg-[#333] cursor-pointer"
                                onClick={(e) => { e.preventDefault(); setSelectedItem(item); setIsPinned(true); setDetailsOpen(true); }}
                                data-testid={`details-${item.id}`}
                              >
                                <FileText className="w-4 h-4 text-gray-400" />
                                Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-2 text-sm text-[#008DA8] hover:text-[#00b0cc] focus:text-[#00b0cc] focus:bg-[#333] cursor-pointer"
                                onClick={(e) => { e.preventDefault(); setCloneOpen(true); }}
                                data-testid={`clone-${item.id}`}
                              >
                                <Copy className="w-4 h-4 text-[#008DA8]" />
                                Clone & Restart
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 focus:text-red-400 focus:bg-[#333] cursor-pointer"
                                onClick={(e) => { e.preventDefault(); setSelectedItem(item); setDeleteOpen(true); }}
                                data-testid={`delete-${item.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              )}
              {/* Unpinned Items */}
              <div className="divide-y divide-gray-200/50">
                {unpinnedItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-2 p-3 bg-white hover:bg-gray-100 cursor-pointer group transition-all rounded-sm">
                    <Link href={`${statusConfig[item.status].route}/${item.id}`} className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="relative w-[33px] h-[33px] shrink-0 flex items-center justify-center">
                        <div 
                          className={cn(
                            "absolute inset-0 rounded-full border-[2.2px]",
                            item.status === "in-progress" ? "border-[#3b82f6] border-t-transparent animate-[spin_3s_linear_infinite]" : ""
                          )}
                          style={item.status !== "in-progress" ? { borderColor: item.status === 'success' ? '#22c55e' : item.status === 'failed' ? '#ef4444' : '#f97316' } : undefined}
                        />
                        <div className="w-[27.5px] h-[27.5px] rounded-full bg-[#E6E1EF] flex items-center justify-center">
                          <img src={rocketIcon} alt="Rocket" className="w-[16.5px] h-[16.5px] opacity-70" />
                        </div>
                      </div>
                      <p className="text-[13px] leading-tight text-gray-800 line-clamp-2 font-medium flex-1" title={item.title}>
                        {item.title}
                      </p>
                    </Link>
                    <div className="flex flex-col items-center gap-1 shrink-0 mt-0.5">
                      {item.status === "in-progress" ? (
                        <div className="flex flex-col items-center gap-1">
                          {sidebarVisibleItems.filter(i => i.status === "in-progress").indexOf(item) >= 2 && (
                            <Pin
                              className="w-3.5 h-3.5 text-gray-400 rotate-45 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-gray-700"
                              onClick={(e) => { e.stopPropagation(); togglePin(item.id); }}
                              data-testid={`pin-${item.id}`}
                            />
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                              <button className="p-0 border-0 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity" data-testid={`kebab-menu-${item.id}`}>
                                <MoreVertical className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-700" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44 bg-[#1a1a1a] border-[#333] shadow-xl">
                              <DropdownMenuItem
                                className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 focus:text-red-400 focus:bg-[#333] cursor-pointer"
                                onClick={(e) => { e.preventDefault(); setAbortItem(item); setAbortOpen(true); }}
                                data-testid={`abort-${item.id}`}
                              >
                                <StopCircle className="w-4 h-4" />
                                Abort Research
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-2 text-sm text-[#22c55e] hover:text-[#16a34a] focus:text-[#16a34a] focus:bg-[#333] cursor-pointer"
                                onClick={(e) => { e.preventDefault(); setAbortItem(item); setFinishEarlyOpen(true); }}
                                data-testid={`finish-early-${item.id}`}
                              >
                                <FastForward className="w-4 h-4" />
                                Finish Early
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ) : (
                        <>
                          <Pin
                            className="w-3.5 h-3.5 text-gray-400 rotate-45 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-gray-700"
                            onClick={(e) => { e.stopPropagation(); togglePin(item.id); }}
                            data-testid={`pin-${item.id}`}
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                              <button className="p-0 border-0 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity" data-testid={`kebab-menu-${item.id}`}>
                                <MoreVertical className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-700" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44 bg-[#1a1a1a] border-[#333] shadow-xl">
                              <DropdownMenuItem
                                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white focus:text-white focus:bg-[#333] cursor-pointer"
                                onClick={(e) => { e.preventDefault(); setSelectedItem(item); setIsPinned(false); setDetailsOpen(true); }}
                                data-testid={`details-${item.id}`}
                              >
                                <FileText className="w-4 h-4 text-gray-400" />
                                Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-2 text-sm text-[#008DA8] hover:text-[#00b0cc] focus:text-[#00b0cc] focus:bg-[#333] cursor-pointer"
                                onClick={(e) => { e.preventDefault(); setCloneOpen(true); }}
                                data-testid={`clone-${item.id}`}
                              >
                                <Copy className="w-4 h-4 text-[#008DA8]" />
                                Clone & Restart
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white focus:text-white focus:bg-[#333] cursor-pointer"
                                data-testid={`archive-${item.id}`}
                              >
                                <Archive className="w-4 h-4 text-gray-400" />
                                Archive Project
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white focus:text-white focus:bg-[#333] cursor-pointer"
                                data-testid={`export-${item.id}`}
                              >
                                <Download className="w-4 h-4 text-gray-400" />
                                Export Project
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 focus:text-red-400 focus:bg-[#333] cursor-pointer"
                                onClick={(e) => { e.preventDefault(); setSelectedItem(item); setDeleteOpen(true); }}
                                data-testid={`delete-${item.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Footer */}
          <div className="p-2 pt-0 flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full h-8 px-3 text-xs font-semibold text-gray-600 hover:text-black hover:bg-black/5 flex items-center justify-center gap-1.5 rounded-sm cursor-pointer transition-colors" data-testid="button-more-menu">
                  <img src={moreIcon} alt="More" className="w-4 h-4 opacity-60" />
                  <span>More</span>
                  <ChevronRight className="w-3 h-3 ml-auto" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="top" className="w-52 bg-[#1a1a1a] border-[#333] shadow-xl mb-2 animate-in slide-in-from-bottom-2 duration-200">
                <DropdownMenuItem asChild className="flex items-center gap-2 text-sm text-gray-300 hover:text-white focus:text-white focus:bg-[#333] cursor-pointer">
                  <Link href="/assets">
                    <FileText className="w-4 h-4 text-gray-400" />
                    Files & Attachments
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 text-sm text-gray-300 hover:text-white focus:text-white focus:bg-[#333] cursor-pointer" data-testid="menu-archived-projects">
                  <Archive className="w-4 h-4 text-gray-400" />
                  Archived Projects (20)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      ) : (
        /* Collapsed State Icons */
        (<CollapsedSidebar
          sidebarVisibleItems={sidebarVisibleItems}
          visibleResearchItems={visibleResearchItems}
          statusConfig={statusConfig}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          rocketIcon={rocketIcon}
          pinnedIds={pinnedIds}
          togglePin={togglePin}
          setSelectedItem={setSelectedItem}
          setIsPinned={setIsPinned}
          setDetailsOpen={setDetailsOpen}
          setCloneOpen={setCloneOpen}
          setDeleteOpen={setDeleteOpen}
          setAbortItem={setAbortItem}
          setAbortOpen={setAbortOpen}
          setFinishEarlyOpen={setFinishEarlyOpen}
        />)
      )}
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-background text-foreground flex">
        {/* Desktop Sidebar */}
        <aside 
          className={cn(
            "hidden md:block fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out bg-[#F5F5F7] border-r border-gray-200",
            isCollapsed ? "w-[70px]" : "w-[300px]"
          )}
        >
          <SidebarContent collapsed={isCollapsed} />
        </aside>

        {/* Mobile Nav */}
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50 bg-white shadow-sm border border-gray-200">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[300px] bg-[#F5F5F7]">
            <SidebarContent collapsed={false} />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main 
          className={cn(
            "flex-1 min-h-screen flex flex-col transition-all duration-300 ease-in-out",
            isCollapsed ? "md:ml-[70px]" : "md:ml-[300px]"
          )}
        >
          {/* Top Header - Contextual to the page */}
          <header className="h-16 border-b border-gray-300 bg-[#F5F5F7] sticky top-0 z-40 px-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
               <Link href="/research/dashboard">
                 <Button variant="outline" className="h-9 gap-2 bg-white border-gray-400 text-[#006E7D] hover:text-[#005a66] hover:bg-gray-50 px-3 shadow-sm rounded-sm">
                   <LayoutDashboard className="w-4 h-4" />
                   Dashboard
                 </Button>
               </Link>
               
               <h1 className="text-sm font-medium text-gray-800">
                 <span className="font-bold">Smart Search:</span> {
                   location === "/" ? "Dashboard" : 
                   location.includes("dashboard") ? "Overview" :
                   location.includes("assets") ? "Assets Repository" :
                   location.includes("research-failed") ? "Failed" :
                   location.includes("research-canceled") ? "Cancel" :
                   location.includes("in-progress") ? "in progress" :
                   location.includes("research-success") ? "Reports" :
                   location.includes("sources") ? "Sources" :
                   location.includes("search") ? "Launcher" : 
                   location.includes("new") ? "Launcher" : "Page"}
               </h1>
            </div>
            
            <div className="fixed right-4 top-0 h-16 flex items-center gap-3 z-50">
              <div className="relative">
                <Button variant="outline" size="icon" className="h-9 w-12 bg-white border-gray-400 text-gray-600 hover:bg-gray-50 rounded-md gap-1 px-2 w-auto">
                  <Bell className="w-5 h-5 fill-current" />
                  <span className="text-xs font-bold text-[#00802b]">+3</span>
                </Button>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-10 pl-2 pr-3 gap-2 bg-white border-gray-400 hover:bg-gray-50 rounded-md text-left flex items-center">
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col items-start leading-none gap-0.5">
                      <span className="text-xs font-bold text-gray-900">Ivan Petrov</span>
                      <span className="text-[10px] text-gray-500">Company/Team name</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-black ml-1 fill-black" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-0 rounded-md border-gray-300 shadow-xl bg-[#F5F5F7]">
                  <div className="p-3 border-b border-gray-200 bg-white rounded-t-md">
                     <p className="text-xs text-center font-semibold text-gray-500 mb-1">Balance</p>
                     <div className="bg-[#E8F5E9] border border-[#C8E6C9] rounded-md p-2 text-center">
                       <span className="text-[#2E7D32] font-bold text-sm">5.8K available</span>
                       <span className="text-gray-500 text-xs mx-1">[10K]</span>
                       <a href="#" className="text-[#008DA8] text-xs underline font-medium">buy more</a>
                     </div>
                  </div>
                  <div className="p-1 space-y-0.5 bg-[#F5F5F7]">
                    {[
                      { label: "Profile & Settings", icon: User },
                      { label: "Files & Attachments: 123", icon: FileText },
                      { label: "Integrations", icon: Zap },
                      { label: "Billing & Usage", icon: MoreVertical },
                      { label: "Export Hub: 26", icon: Search },
                      { label: "Log out", icon: PanelLeftClose }
                    ].map((item, idx) => (
                      <DropdownMenuItem key={idx} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 focus:bg-gray-200 focus:text-black cursor-pointer rounded-sm">
                        <item.icon className="w-4 h-4 text-gray-500" />
                        {item.label}
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <div className="flex-1 p-6 md:p-8 overflow-auto text-[15px] bg-[#fffffff5]">
            {children}
          </div>
        </main>
      </div>
      <ResearchDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        title={selectedItem?.title ?? ""}
        pinned={isPinned}
      />
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Delete Confirmation</DialogTitle>
            <DialogDescription className="text-gray-500 text-sm">
              Are you sure you want to delete this research? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200 line-clamp-2">
              {selectedItem?.title}
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)} className="border-gray-300 text-gray-700" data-testid="button-cancel-delete">
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => { if (selectedItem) setDeletedIds(prev => [...prev, selectedItem.id]); setDeleteOpen(false); }} className="bg-red-600 hover:bg-red-700" data-testid="button-confirm-delete">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <CloneRestartModal open={cloneOpen} onOpenChange={setCloneOpen} />
      <AbortResearchModal open={abortOpen} onOpenChange={setAbortOpen} />
      <FinishEarlyModal open={finishEarlyOpen} onOpenChange={setFinishEarlyOpen} />
    </>
  );
}
