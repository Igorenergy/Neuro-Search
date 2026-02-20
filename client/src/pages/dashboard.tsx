import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "wouter";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CloneRestartModal from "@/components/clone-restart-modal";
import AbortResearchModal from "@/components/abort-research-modal";
import FinishEarlyModal from "@/components/finish-early-modal";
import ResearchDetailsModal from "@/components/research-details-modal";
import rocketIcon from "@assets/image_1771405092616.png";

export default function Dashboard() {
  const [showBanner, setShowBanner] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ id: number; title: string } | null>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [dashStatusFilter, setDashStatusFilter] = useState<"all" | "success" | "in-progress" | "failed" | "canceled">("all");
  const [abortOpen, setAbortOpen] = useState(false);
  const [finishEarlyOpen, setFinishEarlyOpen] = useState(false);
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

  type ResearchStatus = "success" | "in-progress" | "failed" | "canceled";

  const statusConfig: Record<ResearchStatus, { borderColor: string; route: string; tileBg: string; iconBg: string; iconColor: string }> = {
    "success": { borderColor: "border-l-green-500", route: "/research-success", tileBg: "bg-[#E8F5E9]", iconBg: "bg-[#C8E6C9]", iconColor: "text-[#2E7D32]" },
    "in-progress": { borderColor: "border-l-blue-500", route: "/research-in-progress", tileBg: "bg-[#E3F2FD]", iconBg: "bg-[#BBDEFB]", iconColor: "text-[#1565C0]" },
    "failed": { borderColor: "border-l-red-500", route: "/research-failed", tileBg: "bg-[#FFEBEE]", iconBg: "bg-[#FFCDD2]", iconColor: "text-[#C62828]" },
    "canceled": { borderColor: "border-l-orange-400", route: "/research-canceled", tileBg: "bg-[#FFF3E0]", iconBg: "bg-[#FFE0B2]", iconColor: "text-[#E65100]" },
  };

  const tileIcons = [Rocket, DollarSign, TrendingUp, ClipboardList, Zap, FileText];

  const searches: { id: number; title: string; date: string; sources: number; status: ResearchStatus; hasAttachment: boolean; iconIdx: number; query: string; engine: string }[] = [
    { id: 1, title: "Американская Фабрика: Полный анализ и стратегический обзор", date: "5 дек. 2025 г.", sources: 4, status: "success", hasAttachment: true, iconIdx: 0, query: "Провести полный стратегический анализ документального фильма «Американская фабрика», включая экономические и культурные аспекты", engine: "Ultimate" },
    { id: 2, title: "Startup: AI Deep Research — Анализ рынка и конкурентов", date: "2 дек. 2025 г.", sources: 51, status: "success", hasAttachment: true, iconIdx: 1, query: "Анализ рынка AI Deep Research стартапов, ключевые конкуренты, бизнес-модели и инвестиционный потенциал в секторе", engine: "Pro" },
    { id: 3, title: "Research name one", date: "5 дек. 2025 г.", sources: 0, status: "in-progress", hasAttachment: true, iconIdx: 3, query: "Relevant query text for research name one that demonstrates the first 100 symbols of the search task", engine: "Standard" },
    { id: 4, title: "Abacus.AI: Корпоративный анализ и оценка платформы", date: "2 дек. 2025 г.", sources: 61, status: "success", hasAttachment: false, iconIdx: 3, query: "Корпоративный анализ платформы Abacus.AI: технологический стек, рыночная позиция, ключевые продукты и конкурентные преимущества", engine: "Ultimate" },
    { id: 5, title: "Инновации, Капитал и Стратегии Роста в Технологическом Секторе", date: "2 дек. 2025 г.", sources: 25, status: "failed", hasAttachment: true, iconIdx: 2, query: "Исследование инноваций и стратегий роста в технологическом секторе: венчурный капитал, тренды и прогнозы на 2025 год", engine: "Pro" },
    { id: 6, title: "Реестр 492 Компаний: Полный анализ и стратегический обзор", date: "2 дек. 2025 г.", sources: 2, status: "success", hasAttachment: false, iconIdx: 5, query: "Составить реестр 492 компаний с полным анализом финансовых показателей, рыночной капитализации и стратегических позиций", engine: "Ultimate" },
    { id: 7, title: "Research name two", date: "30 нояб. 2025 г.", sources: 0, status: "in-progress", hasAttachment: false, iconIdx: 3, query: "Relevant query text for research name two that demonstrates the first 100 symbols of the search task", engine: "Standard" },
    { id: 8, title: "Потеря $1,8 млн на крипте: уроки и выводы для инвесторов", date: "24 нояб. 2025 г.", sources: 1, status: "canceled", hasAttachment: false, iconIdx: 2, query: "Анализ случая потери $1,8 млн на криптовалютном рынке: причины, ошибки инвестора и практические выводы", engine: "Standard" },
    { id: 9, title: "Мемуары Криптана: Ретродропи, стратегии и анализ", date: "23 нояб. 2025 г.", sources: 1, status: "success", hasAttachment: false, iconIdx: 4, query: "Ретроспективный анализ криптовалютных стратегий: ретродропы, DeFi-протоколы и инвестиционные подходы", engine: "Pro" },
    { id: 10, title: "Искусственный Интеллект и Будущее Технологий", date: "17 нояб. 2025 г.", sources: 24, status: "failed", hasAttachment: false, iconIdx: 5, query: "Обзор перспектив искусственного интеллекта: генеративные модели, AGI, этические вопросы и влияние на рынок труда", engine: "Ultimate" },
    { id: 11, title: "15 Жестоких Правд о Неконкурентных Рынках", date: "16 нояб. 2025 г.", sources: 1, status: "success", hasAttachment: false, iconIdx: 4, query: "Анализ 15 ключевых факторов неконкурентных рынков: барьеры входа, монополии и стратегии выживания", engine: "Standard" },
    { id: 12, title: "Анализ Рынка Электромобилей: Tesla vs BYD vs Rivian — Конкурентный анализ и доля рынка", date: "15 нояб. 2025 г.", sources: 42, status: "success", hasAttachment: false, iconIdx: 1, query: "Сравнительный анализ лидеров рынка электромобилей: финансовые показатели, технологии и стратегии экспансии", engine: "Pro" },
    { id: 13, title: "Кибербезопасность в Эпоху AI: Новые Угрозы и Стратегии Защиты данных", date: "14 нояб. 2025 г.", sources: 12, status: "canceled", hasAttachment: false, iconIdx: 0, query: "Исследование влияния AI на кибербезопасность: новые векторы атак и современные методы защиты корпоративных данных", engine: "Ultimate" },
    { id: 14, title: "Глобальные Цепочки Поставок 2025: Реструктуризация и Геополитические вызовы", date: "12 нояб. 2025 г.", sources: 35, status: "success", hasAttachment: false, iconIdx: 2, query: "Анализ трансформации глобальных логистических цепочек под влиянием геополитики и новых торговых соглашений", engine: "Pro" },
    { id: 15, title: "Метавселенная для Бизнеса: ROI Анализ Корпоративных Внедрений и пользовательского опыта", date: "10 нояб. 2025 г.", sources: 8, status: "failed", hasAttachment: false, iconIdx: 5, query: "Оценка эффективности внедрения метавселенных в корпоративный сектор: кейсы, затраты и возврат инвестиций", engine: "Standard" },
    { id: 16, title: "Зелёная Энергетика: Инвестиционные Возможности в Солнечной и Ветровой энергетике", date: "8 нояб. 2025 г.", sources: 21, status: "success", hasAttachment: false, iconIdx: 4, query: "Обзор инвестиционного ландшафта возобновляемой энергетики: государственные субсидии и технологические прорывы", engine: "Pro" },
    { id: 17, title: "Нейроинтерфейсы и BCI: Медицинские Применения и Этические Вопросы будущего", date: "5 нояб. 2025 г.", sources: 19, status: "success", hasAttachment: false, iconIdx: 3, query: "Анализ достижений в области нейротехнологий: от медицинских протезов до массового использования BCI", engine: "Ultimate" },
    { id: 18, title: "Рынок SaaS B2B: Тренды Консолидации и Стратегии Выхода 2025–2027 годов", date: "3 нояб. 2025 г.", sources: 14, status: "canceled", hasAttachment: false, iconIdx: 1, query: "Прогноз развития рынка B2B SaaS: слияния, поглощения и новые ниши для технологических стартапов", engine: "Pro" },
    { id: 19, title: "Автономное Вождение Level 4: Регуляторные Барьеры и Дорожная Карта развития", date: "1 нояб. 2025 г.", sources: 27, status: "success", hasAttachment: false, iconIdx: 2, query: "Исследование готовности инфраструктуры и законодательства к внедрению полностью автономного транспорта", engine: "Ultimate" },
    { id: 20, title: "Цифровой Рубль и CBDC: Макроэкономический Анализ и Сценарии Внедрения в РФ", date: "28 окт. 2025 г.", sources: 16, status: "failed", hasAttachment: false, iconIdx: 0, query: "Анализ влияния цифровых валют центральных банков на банковскую систему и денежно-кредитную политику", engine: "Standard" },
  ];

  const archivedProjects: { id: number; title: string; date: string; sources: number; status: ResearchStatus }[] = [
    { id: 101, title: "Анализ Глобальных Тенденций в Секторе FinTech 2024", date: "15 окт. 2025 г.", sources: 34, status: "success" },
    { id: 102, title: "Исследование Рынка Нефти: Прогнозы и Стратегии", date: "10 окт. 2025 г.", sources: 18, status: "success" },
    { id: 103, title: "Конкурентный Анализ SaaS-платформ для HR", date: "5 окт. 2025 г.", sources: 42, status: "failed" },
    { id: 104, title: "Обзор Стартапов в Области Квантовых Вычислений", date: "28 сент. 2025 г.", sources: 15, status: "success" },
    { id: 105, title: "Рынок Электронной Коммерции в Азии: Тренды 2024–2025", date: "20 сент. 2025 г.", sources: 27, status: "success" },
    { id: 106, title: "Стратегический Обзор Венчурного Капитала в Европе", date: "15 сент. 2025 г.", sources: 31, status: "canceled" },
    { id: 107, title: "Кибербезопасность: Угрозы для Малого и Среднего Бизнеса", date: "10 сент. 2025 г.", sources: 22, status: "success" },
    { id: 108, title: "Децентрализованные Финансы: Риски и Перспективы", date: "5 сент. 2025 г.", sources: 19, status: "failed" },
    { id: 109, title: "Анализ Логистических Цепочек: Постпандемическая Оптимизация", date: "1 сент. 2025 г.", sources: 38, status: "success" },
    { id: 110, title: "Цифровая Трансформация в Банковском Секторе", date: "25 авг. 2025 г.", sources: 45, status: "success" },
    { id: 111, title: "Рынок Облачных Вычислений: AWS vs Azure vs GCP", date: "20 авг. 2025 г.", sources: 29, status: "success" },
    { id: 112, title: "Искусственный Интеллект в Медицине: Применения и Этика", date: "15 авг. 2025 г.", sources: 33, status: "canceled" },
    { id: 113, title: "Анализ Криптовалютного Рынка: Q3 2025", date: "10 авг. 2025 г.", sources: 16, status: "success" },
    { id: 114, title: "Зеленая Энергетика: Инвестиционный Ландшафт 2025", date: "5 авг. 2025 г.", sources: 21, status: "success" },
    { id: 115, title: "Стратегия Экспансии на Рынки Юго-Восточной Азии", date: "1 авг. 2025 г.", sources: 14, status: "failed" },
    { id: 116, title: "Обзор Рынка Недвижимости: Коммерческий Сегмент", date: "25 июля 2025 г.", sources: 26, status: "success" },
    { id: 117, title: "Анализ Конкуренции в Секторе EdTech", date: "20 июля 2025 г.", sources: 37, status: "success" },
    { id: 118, title: "Роботизация Производства: ROI и Внедрение", date: "15 июля 2025 г.", sources: 20, status: "success" },
    { id: 119, title: "Перспективы Рынка Полупроводников 2025–2030", date: "10 июля 2025 г.", sources: 41, status: "canceled" },
    { id: 120, title: "Маркетинговые Стратегии для B2B SaaS Компаний", date: "5 июля 2025 г.", sources: 12, status: "success" },
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
        <h1 className="font-bold text-gray-900 text-[15px]" data-testid="text-searches-title">Your Searches (20)</h1>

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
                {([
                  { value: "all", label: "All", count: 20, textColor: "text-gray-100" },
                  { value: "success", label: "Success", count: 12, textColor: "text-[#22c55e]" },
                  { value: "in-progress", label: "In Progress", count: 3, textColor: "text-[#3b82f6]" },
                  { value: "failed", label: "Failed", count: 4, textColor: "text-[#ef4444]" },
                  { value: "canceled", label: "Canceled", count: 1, textColor: "text-[#f97316]" },
                ] as const).map((opt) => (
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
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col items-center justify-center min-h-[180px]" data-testid="card-create-research">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3">
            <Plus className="w-5 h-5 text-[#008DA8]" />
          </div>
          <Link href="/smart-search/new">
            <Button variant="ghost" className="h-9 gap-2 text-[#008DA8] hover:bg-[#008DA8]/5 font-bold text-sm px-4" data-testid="button-smart-search">
              Start new search
            </Button>
          </Link>
        </div>

        {/* Research Item Tiles — in-progress first */}
        {[...searches].filter(s => !deletedIds.includes(s.id)).sort((a, b) => {
          if (a.status === "in-progress" && b.status !== "in-progress") return -1;
          if (a.status !== "in-progress" && b.status === "in-progress") return 1;
          return 0;
        }).map((item) => {
          const config = statusConfig[item.status];
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
                          </>
                        ) : (
                          <>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white focus:text-white focus:bg-[#333] cursor-pointer"
                              data-testid={`details-${item.id}`}
                              onClick={() => { setSelectedItem({ id: item.id, title: item.title }); setIsPinned(false); setDetailsOpen(true); }}
                            >
                              <FileText className="w-4 h-4 text-gray-400" />
                              Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-sm text-[#008DA8] hover:text-[#00b0cc] focus:text-[#00b0cc] focus:bg-[#333] cursor-pointer"
                              data-testid={`clone-${item.id}`}
                              onClick={() => { setSelectedItem({ id: item.id, title: item.title }); setCloneOpen(true); }}
                            >
                              <Copy className="w-4 h-4 text-[#008DA8]" />
                              Clone & Restart
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white focus:text-white focus:bg-[#333] cursor-pointer"
                              data-testid={`dash-archive-${item.id}`}
                            >
                              <Archive className="w-4 h-4 text-gray-400" />
                              Archive Project
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white focus:text-white focus:bg-[#333] cursor-pointer"
                              data-testid={`dash-export-${item.id}`}
                            >
                              <Download className="w-4 h-4 text-gray-400" />
                              Export Project
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 focus:text-red-400 focus:bg-[#333] cursor-pointer"
                              data-testid={`delete-${item.id}`}
                              onClick={() => { setSelectedItem({ id: item.id, title: item.title }); setDeleteOpen(true); }}
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
            {showArchived ? "Hide Archived Projects" : "Archived Projects (20)"}
          </span>
          {showArchived ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </Button>
      </div>

      {showArchived && (
        <div ref={archivedSectionRef} className="pb-12">
          <div className="flex items-center gap-2 mb-4">
            <Archive className="w-5 h-5 text-gray-500" />
            <h2 className="font-bold text-gray-700 text-[15px]">Archived Projects</h2>
            <span className="text-xs text-gray-400 ml-1">(20)</span>
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
        </div>
      )}
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
          <Button variant="outline" onClick={() => setDeleteOpen(false)} className="border-gray-300 text-gray-700" data-testid="dash-button-cancel-delete">
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => { if (selectedItem) setDeletedIds(prev => [...prev, selectedItem.id]); setDeleteOpen(false); }} className="bg-red-600 hover:bg-red-700" data-testid="dash-button-confirm-delete">
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
