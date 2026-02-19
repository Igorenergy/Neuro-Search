import { useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  FileText,
  Info,
  ArrowRight,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [isSemantic, setIsSemantic] = useState(true);

  // Mock Data matching the image
  const allResults = [
    {
      id: 1,
      title:
        "Реестр 492 Компаний: Полный анализ и стратегический обзор для инвесторов",
      sources: 105,
      artifacts: 6,
      date: "today at 15:48",
    },
    {
      id: 2,
      title:
        "Мемуары Криптана: Ретроспективный анализ криптозимы и стратегии выживания",
      sources: 64,
      artifacts: 4,
      date: "today at 12:18",
    },
    {
      id: 3,
      title:
        "Искусственный Интеллект и Будущее Технологий: Глубокий анализ влияния AI",
      sources: 551,
      artifacts: 5,
      date: "today at 11:11",
    },
    {
      id: 4,
      title:
        "15 Жестоких Правд о Неконкурентных Рынках: Как выжить и преуспеть",
      sources: 41,
      artifacts: 4,
      date: "yesterday at 18:49",
    },
    {
      id: 5,
      title:
        "Блокчейн в Финтехе 2025: Анализ Рисков, Прогноз ROI и Стратегии Внедрения",
      sources: 14,
      artifacts: 4,
      date: "yesterday at 17:12",
    },
    {
      id: 6,
      title:
        "Биотехнологии 2.0: Инвестиции в Геномное Редактирование и Перспективы",
      sources: 35,
      artifacts: 5,
      date: "December 7",
    },
    {
      id: 7,
      title:
        "Стратегический Риск-менеджмент в Трейдинге: Психология, Инструменты",
      sources: 51,
      artifacts: 8,
      date: "December 6",
    },
    {
      id: 8,
      title: "NFT как Инвестиционный Актив: Анализ Волатильности, Ликвидности",
      sources: 17,
      artifacts: 7,
      date: "December 5",
    },
    {
      id: 9,
      title:
        "Фискальная Политика Евросоюза: Анализ Бюджета на 2026 год и Влияние",
      sources: 38,
      artifacts: 3,
      date: "December 5",
    },
    {
      id: 10,
      title: "Гиперинфляция в Латинской Америке: Уроки Истории и Стратегии",
      sources: 41,
      artifacts: 6,
      date: "December 5",
    },
    {
      id: 11,
      title: "Искусственный Интеллект и Будущее Технологий: Глубокий анализ",
      sources: 48,
      artifacts: 6,
      date: "December 5",
    },
    {
      id: 12,
      title: "Ключевые Метрики SaaS Бизнеса: LTV, CAC, Churn Rate и Стратегии",
      sources: 53,
      artifacts: 5,
      date: "December 4",
    },
    {
      id: 13,
      title:
        "Корпоративные Слияния и Поглощения (M&A): Постпандемийный Обзор Рынка",
      sources: 67,
      artifacts: 6,
      date: "December 4",
    },
    {
      id: 14,
      title: "Глобальная Инфляция 2025: Влияние на Фондовые Рынки, Акции",
      sources: 87,
      artifacts: 8,
      date: "December 4",
    },
    {
      id: 15,
      title:
        "Инфляция 2025: Влияние на акции... Инфляция 2025: Влияние на акции",
      sources: 93,
      artifacts: 9,
      date: "December 3",
    },
    {
      id: 16,
      title:
        "Применение Искусственного Интеллекта в Due Diligence: Автоматизация",
      sources: 174,
      artifacts: 14,
      date: "December 3",
    },
  ];

  // Filter logic
  const results =
    query.toLowerCase().includes("void") ||
    query.toLowerCase().includes("empty")
      ? []
      : allResults.filter((r) =>
          r.title.toLowerCase().includes(query.toLowerCase()),
        );

  const isEmpty = results.length === 0 && query.length > 0;

  return (
    <div className="max-w-7xl mx-auto font-sans text-gray-800">
      {/* Header Section */}
      <div className="mb-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-gray-900 text-[16px]">
            Search in researches
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Info className="w-4 h-4" />
            <span>
              Looking for specific documents or media? Search in the{" "}
              <a
                href="#"
                className="text-[#008DA8] underline decoration-[#008DA8] underline-offset-2 font-medium"
              >
                Assets Repository
              </a>
            </span>
          </div>
        </div>

        {/* Search Hero */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
          <label className="text-sm font-semibold text-gray-700 block">
            Search query
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1 bg-[#8BC34A]/20 rounded-sm">
              <Search className="w-5 h-5 text-[#558B2F]" />
            </div>
            <Input
              placeholder="Search for keywords, financial data, or numeric values"
              className="h-12 pl-12 pr-12 text-lg border-gray-300 focus:border-[#008DA8] focus:ring-[#008DA8]/20 rounded-md shadow-inner bg-gray-50/50"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
            >
              <Search className="w-6 h-6 text-black stroke-[3]" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Latest queries:</span>
            {["[Inflation 2025]", "[Crypto Risks]", "[Biotech trends]"].map(
              (tag, i) => (
                <span
                  key={i}
                  className="text-gray-800 font-medium cursor-pointer hover:text-[#008DA8] hover:underline"
                >
                  {tag}
                  {i < 2 ? "," : ""}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
      {/* Results Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
        {isEmpty ? (
          /* No Dead Ends State */
          (<div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No active research found for "{query}"
            </h3>
            <p className="text-gray-500 mb-8 text-center max-w-md">
              However, we found{" "}
              <span className="font-bold text-gray-900">3 matching files</span>{" "}
              in the Assets Repository.
            </p>
            <div className="flex gap-4">
              <Button className="gap-2 bg-[#008DA8] hover:bg-[#007A92] text-white">
                <FolderOpen className="w-4 h-4" />
                Search in Assets & Archives
              </Button>
              <Button
                variant="outline"
                className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ArrowRight className="w-4 h-4" />
                Start New Research
              </Button>
            </div>
          </div>)
        ) : (
          /* Results Table */
          (<div>
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_120px_120px_150px_40px] gap-4 px-6 py-4 border-b border-gray-200 bg-gray-50/50 text-sm font-bold text-gray-900">
              <div className="flex items-center gap-1 cursor-pointer hover:text-[#008DA8]">
                Name <Filter className="w-3 h-3" />
              </div>
              <div className="text-right flex items-center justify-end gap-1 cursor-pointer hover:text-[#008DA8]">
                Sources <Filter className="w-3 h-3" />
              </div>
              <div className="text-right flex items-center justify-end gap-1 cursor-pointer hover:text-[#008DA8]">
                Artifacts <Filter className="w-3 h-3" />
              </div>
              <div className="text-right flex items-center justify-end gap-1 cursor-pointer hover:text-[#008DA8]">
                Created Date <Filter className="w-3 h-3" />
              </div>
              <div></div>
            </div>
            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {results.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1fr_120px_120px_150px_40px] gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="shrink-0 w-8 h-8 bg-gray-200 text-[10px] font-bold text-gray-500 flex items-center justify-center rounded-sm">
                      icon
                    </div>
                    <span
                      className="font-medium text-gray-800 truncate"
                      title={item.title}
                    >
                      {item.title}
                    </span>
                  </div>

                  <div className="text-right text-gray-600 font-medium">
                    {item.sources}
                  </div>

                  <div className="text-right text-gray-600 font-medium">
                    {item.artifacts}
                  </div>

                  <div className="text-right text-gray-600 font-medium">
                    {item.date}
                  </div>

                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-gray-900"
                        >
                          <MoreVertical className="w-4 h-4 stroke-[3]" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Open details</DropdownMenuItem>
                        <DropdownMenuItem>View sources</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>)
        )}
      </div>
      {!isEmpty && (
        <div className="flex justify-center mt-8 pb-12">
          <Button className="bg-[#008DA8] hover:bg-[#007A92] text-white px-8 h-10 rounded-sm font-medium">
            Show more (20)
          </Button>
        </div>
      )}
    </div>
  );
}
