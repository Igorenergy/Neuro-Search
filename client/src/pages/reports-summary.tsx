import { useState } from "react";
import { useParams, Link } from "wouter";
import {
  MoreVertical,
  Download,
  Share2,
  Target,
  Lightbulb,
  Shield,
  Rocket,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { loadLaunchConfig } from "@/lib/launch-config";
import rocketIcon from "@assets/image_1771405092616.png";

export default function ReportsSummary() {
  const params = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<"summary" | "research-log">("summary");
  const config = loadLaunchConfig();

  const projectTitle = config?.query
    ? config.query.slice(0, 80) + (config.query.length > 80 ? "..." : "")
    : "Реестр 402 Компаний: Полный анализ и стратегический обзор для инвесторов";

  const sourcesCount = 12;
  const artifactsCount = 3;

  return (
    <div className="-m-6 md:-m-8 flex flex-col h-[calc(100vh-64px)] w-[calc(100%+48px)] md:w-[calc(100%+64px)] bg-white" data-testid="reports-summary-page">
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
              className="px-4 py-1.5 text-xs font-bold rounded-sm bg-[#00802b] text-white"
              data-testid="button-tab-reports"
            >
              Reports
            </button>
          </Link>
          <Link href={`/sources/${params.id || "1"}`}>
            <button
              className="px-4 py-1.5 text-xs font-bold rounded-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
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

      {/* Sub Navigation */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center gap-6">
          <button
            className={cn(
              "text-xs font-bold pb-1 border-b-2 transition-colors",
              activeTab === "summary"
                ? "text-[#008DA8] border-[#008DA8]"
                : "text-gray-500 border-transparent hover:text-gray-700"
            )}
            onClick={() => setActiveTab("summary")}
            data-testid="button-tab-summary"
          >
            SUMMARY
          </button>
          <button
            className={cn(
              "text-xs font-bold pb-1 border-b-2 transition-colors",
              activeTab === "research-log"
                ? "text-[#008DA8] border-[#008DA8]"
                : "text-gray-500 border-transparent hover:text-gray-700"
            )}
            onClick={() => setActiveTab("research-log")}
            data-testid="button-tab-research-log"
          >
            RESEARCH LOG
          </button>
        </div>

      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "summary" ? (
          <div className="max-w-[900px] mx-auto py-6 px-6 space-y-4">
            {/* Strategic Overview Header */}
            <div className="mb-2 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-gray-900" data-testid="text-overview-title">
                  Strategic Overview & Key Insights
                </h2>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-[700px]">
                  Весь текст должен укладываться в 300–450 слов (максимум 2000–2500 знаков). Визуально это должно занимать 1–1.5 экрана на десктопе, чтобы пользователю почти не приходилось скроллить.
                </p>
              </div>
              <button
                className="text-xs font-bold text-[#008DA8] hover:text-[#006E7D] transition-colors underline underline-offset-2 shrink-0"
                data-testid="button-generate-extended"
              >
                GENERATE EXTENDED REPORT
              </button>
            </div>

            {/* Card 1: The Verdict */}
            <Card className="p-0 border-gray-200" data-testid="card-verdict">
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-red-500" />
                  <h3 className="text-sm font-bold text-gray-800">The Verdict (Вердикт / Прямой ответ)</h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Пример: "Рынок биопластика вырастет на 15% к 2026 году. Вход для вашей компании рекомендован через M&A, так как органический рост слишком медленный."
                </p>
              </div>
            </Card>

            {/* Card 2: Key Takeaways */}
            <Card className="p-0 border-gray-200" data-testid="card-key-takeaways">
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  <h3 className="text-sm font-bold text-gray-800">Key Takeaways (Ключевые Инсайты)</h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Список из 3–5 самых важных фактов. Это то, что босс перешлет в Slack команде.
                </p>
                <p className="text-sm text-gray-700 leading-relaxed mt-1">
                  Формат: Жирный заголовок + 1 предложение пояснения.
                </p>
              </div>
            </Card>

            {/* Card 3: Trust & Scope Indicators */}
            <Card className="p-0 border-gray-200" data-testid="card-trust-scope">
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-red-500" />
                  <h3 className="text-sm font-bold text-gray-800">Trust & Scope Indicators (Индикаторы доверия)</h3>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  Визуальная полоса (справа или сверху), показывающая, на чем основан вывод.
                  Элементы: Confidence Score (Уверенность ИИ), Количество проверенных источников, Охват дат.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-100">
                    <div className="relative w-14 h-14">
                      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                        <circle cx="28" cy="28" r="24" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                        <circle cx="28" cy="28" r="24" fill="none" stroke="#00802b" strokeWidth="4" strokeDasharray={2 * Math.PI * 24} strokeDashoffset={2 * Math.PI * 24 * (1 - 0.87)} strokeLinecap="round" />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-800">87%</span>
                    </div>
                    <span className="text-[11px] font-medium text-gray-600 text-center">Confidence Score</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-100">
                    <span className="text-2xl font-bold text-[#008DA8]">{sourcesCount}</span>
                    <span className="text-[11px] font-medium text-gray-600 text-center">Verified Sources</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-100">
                    <span className="text-sm font-bold text-gray-800 text-center leading-tight">Mar 2025<br />– May 2025</span>
                    <span className="text-[11px] font-medium text-gray-600 text-center">Date Coverage</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Card 4: Strategic Recommendations */}
            <Card className="p-0 border-gray-200" data-testid="card-strategic-recommendations">
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Rocket className="w-4 h-4 text-blue-500" />
                  <h3 className="text-sm font-bold text-gray-800">Strategic Recommendations (Стратегические рекомендации)</h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Actionable next steps based on the findings. Concrete recommendations the user can immediately act on, with supporting evidence from the research.
                </p>
              </div>
            </Card>
          </div>
        ) : (
          <div className="max-w-[900px] mx-auto py-6 px-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">Research Log</h2>
            <p className="text-sm text-gray-500">The step-by-step thinking and actions taken by the AI agent during this research operation.</p>
          </div>
        )}
      </div>
    </div>
  );
}
