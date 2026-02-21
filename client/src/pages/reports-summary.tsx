import { useState } from "react";
import { useParams, Link } from "wouter";
import {
  MoreVertical,
  Download,
  Share2,
  Archive,
  Target,
  Lightbulb,
  Shield,
  Rocket,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  Globe,
  CheckCircle2,
  Clock,
  FileText,
  FolderOpen,
  Package,
  AlertCircle,
  Copy,
  Trash2,
  Zap,
  Info,
  Link2,
  Upload,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch as ToggleSwitch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { loadLaunchConfig } from "@/lib/launch-config";
import ResearchBriefingPanel from "@/components/research-briefing-panel";
import CloneRestartModal from "@/components/clone-restart-modal";
import AddFilesModal from "@/components/add-files-modal";


interface ThoughtNode {
  id: string;
  type: "thinking" | "sources";
  title?: string;
  content?: string;
  sources?: { favicon: string; domain: string; title: string }[];
}

const archivedThoughtStream: ThoughtNode[] = [
  {
    id: "t1",
    type: "thinking",
    title: "Determining the architecture of Parallel.ai",
    content:
      'I am starting with a detailed study of the Parallel.ai platform to precisely determine what lies behind the term "processors." At this stage, I assume that these are specialized agent structures or modules for data processing, and not physical equipment. I need to understand their internal classification and working principles to match them accurately with the intellectual tools of search.',
  },
  {
    id: "t2",
    type: "thinking",
    title: "Competitive environment analysis",
    content:
      "In parallel, I am synthesizing information about the current capabilities of deep search modes from leading market players such as OpenAI, Perplexity, Google, xAI and Anthropic. This will allow me to identify key metrics for comparison, including the depth of autonomous research, the ability for complex reasoning, and the quality of the final data synthesis, in order to objectively assess the position of Parallel.ai.",
  },
  {
    id: "t3",
    type: "thinking",
    title: "Directions for further search",
    content:
      "My next steps will be aimed at finding specific technical descriptions of processor types within Parallel.ai and their functional differences. I plan to collect detailed characteristics for each type in order to form a complete comparative table structure and clearly display the advantages and limitations of each solution in the context of deep research.",
  },
  {
    id: "s1",
    type: "sources",
    title: "Researching websites",
    sources: [
      { favicon: "https://www.google.com/s2/favicons?domain=parallelai.tech&sz=16", domain: "parallelai.tech", title: "ParallelAI" },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "Parallel | Web Sea..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "The best web sea..." },
      { favicon: "https://www.google.com/s2/favicons?domain=docs.parallel.ai&sz=16", domain: "docs.p...", title: "Processors - Par..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "Introducing the P..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "Introducing the P..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "Introducing the T..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "Building a real-ti..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "Introducing Parall..." },
      { favicon: "https://www.google.com/s2/favicons?domain=reddit.com&sz=16", domain: "reddit...", title: "I compared the r..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "Parallel Task API ..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "How to build a m..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "Parallel Deep Res..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "State of the Art D..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "A new pareto-fro..." },
    ],
  },
  {
    id: "t4",
    type: "thinking",
    title: "Classification of intelligent processors",
    content:
      'I have studied the architecture of Parallel.ai in detail and found that different levels of AI agent power for web research are hidden behind the term "processors." The lineup ranges from lightweight solutions for quickly extracting metadata to ultra-deep systems capable of conducting complex searches of up to 90 minutes. I found that the system divides processors into standard and fast, offering a flexible choice between data relevance and task execution speed.',
  },
  {
    id: "t5",
    type: "thinking",
    title: "Data synthesis and identified contradictions",
    content:
      'Synthesizing the information received, I have recorded ambitious claims by the platform about surpassing human researchers and leading models like GPT-5 and Gemini in specialized tests. However, to create a complete picture, I need to fill in the gaps in the descriptions of specific "deep search" modes from competitors such as Anthropic and xAI, to understand whether they offer comparable agent autonomy or are limited only to an extended search context.',
  },
  {
    id: "t6",
    type: "thinking",
    title: "Next steps for system comparison",
    content:
      "In the near future, I plan to focus on studying the official documentation and tariff plans to correlate the cost and efficiency of each type of processor. In parallel, I will conduct a deep analysis of the Deep Research functionality of the largest market players, including OpenAI and Perplexity. This will allow me to form the final comparative table, where the time of autonomous work, the depth of analysis, and the cost of each solution will be clearly reflected.",
  },
  {
    id: "s2",
    type: "sources",
    title: "Researching websites",
    sources: [
      { favicon: "https://www.google.com/s2/favicons?domain=help.openai.com&sz=16", domain: "help.o...", title: "Apps in ChatGPT ..." },
      { favicon: "https://www.google.com/s2/favicons?domain=platform.openai.com&sz=16", domain: "platform.o...", title: "Changelog | ..." },
      { favicon: "https://www.google.com/s2/favicons?domain=medium.com&sz=16", domain: "mediu...", title: "OpenAI releases ..." },
      { favicon: "https://www.google.com/s2/favicons?domain=openai.com&sz=16", domain: "openr...", title: "o3 Deep Researc..." },
      { favicon: "https://www.google.com/s2/favicons?domain=openai.com&sz=16", domain: "openai...", title: "ChatGPT agent S..." },
      { favicon: "https://www.google.com/s2/favicons?domain=docs.perplexity.ai&sz=16", domain: "docs.pe...", title: "Sonar deep rese..." },
      { favicon: "https://www.google.com/s2/favicons?domain=apidog.com&sz=16", domain: "apidog...", title: "How to Use Perpl..." },
      { favicon: "https://www.google.com/s2/favicons?domain=openai.com&sz=16", domain: "openr...", title: "Sonar Deep Rese..." },
    ],
  },
];

export default function ReportsSummary() {
  const params = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<"summary" | "research-log">("summary");
  const [showExtendedModal, setShowExtendedModal] = useState(false);
  const [nextStepsExpanded, setNextStepsExpanded] = useState(false);
  const [leftExpanded, setLeftExpanded] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [showEnhanceModal, setShowEnhanceModal] = useState(false);
  const [enhanceScope, setEnhanceScope] = useState<"web" | "files">("web");
  const [enhanceEngine, setEnhanceEngine] = useState("ultimate");
  const [enhanceLanguages, setEnhanceLanguages] = useState<string[]>([]);
  const [enhanceFiles, setEnhanceFiles] = useState<{name: string; type: string; size: number}[]>([
    { name: "Competitive_Analysis_2025.pdf", type: "pdf", size: 2400000 },
  ]);
  const [enhanceBudgetCap, setEnhanceBudgetCap] = useState(true);
  const [enhanceCostOpen, setEnhanceCostOpen] = useState(false);
  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);

  const enhanceLanguageOptions = [
    { value: "auto", label: "Auto Detect" },
    { value: "en", label: "English (EN)" },
    { value: "ru", label: "Russian (RU)" },
    { value: "de", label: "German (DE)" },
    { value: "fr", label: "French (FR)" },
    { value: "es", label: "Spanish (ES)" },
    { value: "zh", label: "Chinese (ZH)" },
    { value: "ja", label: "Japanese (JA)" },
    { value: "ko", label: "Korean (KO)" },
  ];

  const getEnhanceEngineDesc = (e: string) => {
    if (e === "ultimate") return "Maximum depth, full multi-agent analysis";
    if (e === "pro") return "Balanced depth and speed";
    return "Quick scan, basic analysis";
  };

  const config = loadLaunchConfig();

  const projectTitle = config?.query
    ? config.query.slice(0, 80) + (config.query.length > 80 ? "..." : "")
    : "Реестр 402 Компаний: Полный анализ и стратегический обзор для инвесторов";

  const sourcesCount = 12;
  const artifactsCount = 3;

  return (
    <div className="-m-6 md:-m-8 flex h-[calc(100vh-64px)] w-[calc(100%+48px)] md:w-[calc(100%+64px)] bg-white" data-testid="reports-summary-page">
      <ResearchBriefingPanel expanded={leftExpanded} onToggle={() => setLeftExpanded(!leftExpanded)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
      {/* Context Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-[#F5F5F7] shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0 bg-green-600">
            <Rocket className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-sm font-bold text-gray-900 truncate max-w-[400px]" data-testid="text-project-title">
            {projectTitle}
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="shrink-0 p-1 hover:bg-gray-200 rounded transition-colors" data-testid="button-project-menu">
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44 bg-[#1a1a1a] border-[#333] shadow-xl">
              <DropdownMenuItem
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white focus:text-white focus:bg-[#333] cursor-pointer"
                onClick={(e) => { e.preventDefault(); setRenameValue(projectTitle); setDetailsOpen(true); }}
                data-testid="menu-details"
              >
                <FileText className="w-4 h-4 text-gray-400" />
                Details
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 text-sm text-[#008DA8] hover:text-[#00b0cc] focus:text-[#00b0cc] focus:bg-[#333] cursor-pointer"
                onClick={(e) => { e.preventDefault(); setCloneOpen(true); }}
                data-testid="menu-clone"
              >
                <Copy className="w-4 h-4 text-[#008DA8]" />
                Clone & Restart
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 focus:text-red-400 focus:bg-[#333] cursor-pointer"
                onClick={(e) => { e.preventDefault(); setDeleteOpen(true); }}
                data-testid="menu-delete"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/research-success/${params.id || "1"}`}>
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

        <div className="flex items-center gap-1.5 shrink-0">
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 bg-white border-green-600 text-green-700 hover:bg-green-50 font-bold px-4" data-testid="button-export">
            Export
          </Button>
          <button className="w-8 h-8 flex items-center justify-center rounded-sm bg-[#0066CC] hover:bg-[#0055AA] transition-colors" data-testid="button-archive">
            <Archive className="w-4 h-4 text-white" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-sm bg-[#CC0000] hover:bg-[#AA0000] transition-colors" data-testid="button-delete">
            <Trash2 className="w-4 h-4 text-white" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-sm bg-[#333333] hover:bg-[#222222] transition-colors" data-testid="button-share">
            <Share2 className="w-4 h-4 text-white" />
          </button>
        </div>
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

        <Button
          variant="outline"
          size="sm"
          className="h-7 text-[11px] font-medium border-[#008DA8] text-[#008DA8] hover:text-white hover:bg-[#008DA8] transition-colors shrink-0 rounded-md px-3"
          onClick={() => setShowExtendedModal(true)}
          data-testid="button-generate-extended"
        >
          Generate full report
        </Button>
      </div>

      {/* Main Content */}
      {activeTab === "summary" ? (
        <div className="flex-1 overflow-y-auto">
          <div className="py-6 px-6 space-y-4">
            {/* Strategic Overview Header */}
            <div className="mb-2">
              <h2 className="text-base font-bold text-gray-900" data-testid="text-overview-title">
                Strategic Overview & Key Insights
              </h2>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Весь текст должен укладываться в 300–450 слов (максимум 2000–2500 знаков). Визуально это должно занимать 1–1.5 экрана на десктопе, чтобы пользователю почти не приходилось скроллить.
              </p>
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
        </div>
      ) : (
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Pinned: What should I do next? */}
            <div className="shrink-0 border-b border-gray-200 bg-white z-20" data-testid="panel-next-steps">
              <button
                className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                onClick={() => setNextStepsExpanded(!nextStepsExpanded)}
                data-testid="button-toggle-next-steps"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">Statistics</span>
                </div>
                {nextStepsExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {!nextStepsExpanded && (
                <div className="px-5 pb-3 flex items-center gap-6 text-xs text-gray-600">
                  <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-gray-400" /> REPORT</span>
                  <span className="flex items-center gap-1.5"><FolderOpen className="w-3.5 h-3.5 text-gray-400" /> SOURCES</span>
                  <span className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5 text-gray-400" /> ARTIFACTS</span>
                  <span className="flex items-center gap-1.5"><Download className="w-3.5 h-3.5 text-gray-400" /> EXPORT</span>
                  <span className="text-gray-300 mx-2">|</span>
                  <span>Total: <span className="font-bold text-gray-800">$4.00</span></span>
                  <span className="text-gray-300 mx-1">|</span>
                  <span>Balance: <span className="font-bold text-gray-800">$124.50</span></span>
                </div>
              )}

              {nextStepsExpanded && (
                <div className="px-5 pb-4">
                  <div className="flex gap-6">
                    <div className="flex-1 space-y-2.5">
                      <div className="flex items-start gap-2.5">
                        <FileText className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-gray-700">
                          <span className="font-bold">REPORT:</span> Project the full text of the report and conclusions in the tab on the right.
                        </p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <FolderOpen className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-gray-700">
                          <span className="font-bold">SOURCES:</span> Check the list of sources and filter out the excess.
                        </p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Package className="w-4 h-4 text-[#D97706] mt-0.5 shrink-0" />
                        <p className="text-sm text-gray-700">
                          <span className="font-bold">ARTIFACTS:</span> Generate a presentation or download the finished files.
                        </p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Download className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-gray-700">
                          <span className="font-bold">EXPORT:</span> Click the "Export" button in the header to download the entire project.
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 w-px bg-gray-200" />

                    <div className="shrink-0 space-y-1.5 min-w-[200px]">
                      <h4 className="text-xs font-bold text-gray-700 mb-2">Cost Breakdown</h4>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex justify-between gap-4">
                          <span>Fixed cost for Core generator:</span>
                          <span className="font-medium text-gray-800">$2.00</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span>Matches cost (10 x $0.15):</span>
                          <span className="font-medium text-gray-800">$1.50</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span>Enrichment Cost:</span>
                          <span className="font-medium text-gray-800">$0.50</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-400">Core2x (10 x $0.050):</span>
                          <span className="font-medium text-gray-800">$0.50</span>
                        </div>
                        <div className="flex justify-between gap-4 text-gray-400 text-[11px]">
                          <span>company_summary</span>
                          <span></span>
                        </div>
                        <div className="flex justify-between gap-4 pt-1.5 border-t border-gray-200 font-bold text-gray-900">
                          <span>Total:</span>
                          <span>$4.00</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 w-px bg-gray-200" />

                    <div className="shrink-0 space-y-2 min-w-[160px]">
                      <h4 className="text-xs font-bold text-gray-700 mb-2">Budget Control</h4>
                      <div className="space-y-1.5 text-xs text-gray-600">
                        <div>
                          <span>Available Balance: </span>
                          <span className="font-bold text-gray-900">$124.50</span>
                        </div>
                        <div>
                          <span>Current research: </span>
                          <span className="font-bold text-gray-900">$15.4 - $18.4</span>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Scrollable Research Log */}
            <div className="p-4 space-y-6">
              <div className="flex items-center gap-2 py-2 -mx-4 px-4">
                <span className="text-xs font-bold text-[#008DA8]" data-testid="text-research-log-header">RESEARCH LOG</span>
                <div className="flex items-center gap-1.5 ml-auto">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-[11px] font-medium text-green-700">Completed</span>
                  <span className="text-[11px] text-gray-400 ml-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    12:34 total
                  </span>
                </div>
              </div>

            <div className="space-y-6" data-testid="archived-thought-stream">
              {archivedThoughtStream.map((node) => (
                <div key={node.id}>
                  {node.type === "thinking" && (
                    <div className="space-y-2" data-testid={`archived-thought-${node.id}`}>
                      <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <span className="text-gray-400">{">"}</span>
                        {node.title}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed pl-4">
                        {node.content}
                      </p>
                    </div>
                  )}

                  {node.type === "sources" && (
                    <div className="space-y-3" data-testid={`archived-source-${node.id}`}>
                      <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        {node.title}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pl-4">
                        {node.sources?.map((source, si) => (
                          <div
                            key={si}
                            className="flex items-center gap-2 bg-white border border-gray-200 rounded-sm px-2.5 py-1.5 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group"
                            data-testid={`archived-source-pill-${node.id}-${si}`}
                          >
                            <img
                              src={source.favicon}
                              alt=""
                              className="w-4 h-4 rounded-sm shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] text-gray-400 truncate">{source.domain}</p>
                              <p className="text-[11px] font-medium text-gray-700 truncate">{source.title}</p>
                            </div>
                            <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-gray-500 shrink-0 invisible group-hover:visible" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex items-center gap-2 text-green-600 py-4 border-t border-gray-100 mt-2">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-medium">Research completed successfully</span>
              </div>
            </div>
            </div>
          </div>
      )}
      </div>
      {/* Modal: Generate Extended Report */}
      <Dialog open={showExtendedModal} onOpenChange={setShowExtendedModal}>
        <DialogContent className="max-w-[500px] p-0 overflow-hidden border-none bg-white rounded-lg shadow-xl">
          <DialogHeader className="p-4 border-b border-gray-100 flex flex-row items-center justify-between space-y-0">
            <DialogTitle className="text-sm font-bold text-gray-900">Generate extended report</DialogTitle>
            <button 
              onClick={() => setShowExtendedModal(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </DialogHeader>

          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox id="executive" defaultChecked disabled className="mt-1 border-gray-300 data-[state=checked]:bg-[#008DA8] data-[state=checked]:border-[#008DA8]" />
                <div className="space-y-1">
                  <label htmlFor="executive" className="text-sm font-bold text-gray-900 cursor-pointer">Executive Summary (Selected by default)</label>
                  <p className="text-xs text-gray-500">Subtitle: "TL;DR version for C-level stakeholders (1-page overview)."</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox id="strategy" defaultChecked className="mt-1 border-gray-300 data-[state=checked]:bg-[#008DA8] data-[state=checked]:border-[#008DA8]" />
                <div className="space-y-1">
                  <label htmlFor="strategy" className="text-sm font-bold text-gray-900 cursor-pointer">Strategy Frameworks</label>
                  <p className="text-xs text-gray-500">Subtitle: "Includes SWOT Analysis, PESTEL, and Porter's 5 Forces."</p>
                  <p className="text-xs text-gray-500 italic">Value: Готовая стратегия.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox id="financial" className="mt-1 border-gray-300 data-[state=checked]:bg-[#008DA8] data-[state=checked]:border-[#008DA8]" />
                <div className="space-y-1">
                  <label htmlFor="financial" className="text-sm font-bold text-gray-900 cursor-pointer">Financial Deep Dive</label>
                  <p className="text-xs text-gray-500">Subtitle: "Extracts revenue tables, funding rounds, and fiscal KPIs."</p>
                  <p className="text-xs text-gray-500 italic">Value: Цифры и таблицы.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox id="risk" className="mt-1 border-gray-300 data-[state=checked]:bg-[#008DA8] data-[state=checked]:border-[#008DA8]" />
                <div className="space-y-1">
                  <label htmlFor="risk" className="text-sm font-bold text-gray-900 cursor-pointer">Risk Assessment</label>
                  <p className="text-xs text-gray-500">Subtitle: "Identifies market volatility, legal threats, and competitor moves."</p>
                  <p className="text-xs text-gray-500 italic">Value: Безопасность.</p>
                </div>
              </div>
            </div>

            <div className="bg-[#E5E5E5] p-4 rounded-sm border border-gray-300">
              <div className="space-y-1 font-mono text-xs text-gray-700">
                <div className="flex justify-between items-center">
                  <span>Base Report:</span>
                  <span>...... $4.99</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Add-on: PPTX:</span>
                  <span>...... $1.50</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>White Label:</span>
                  <span>...... $2.00</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-gray-400 font-bold">
                  <span>Total:</span>
                  <span>$8.49</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button 
                className="bg-[#00802b] hover:bg-[#006622] text-white px-8 font-bold text-sm"
                onClick={() => setShowExtendedModal(false)}
              >
                Pay & Generate
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Research Details</DialogTitle>
            <DialogDescription className="text-gray-500 text-sm">
              Edit the name and pin status for this research item.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label htmlFor="rename-report" className="text-sm font-medium text-gray-700">Rename</Label>
              <Input
                id="rename-report"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="border-gray-300 focus:border-[#008DA8] focus:ring-[#008DA8] text-gray-900"
                data-testid="input-rename-report"
              />
            </div>
            <div className="flex items-center gap-3">
              <ToggleSwitch
                id="pin-toggle-report"
                checked={isPinned}
                onCheckedChange={setIsPinned}
                data-testid="toggle-pin-report"
              />
              <Label htmlFor="pin-toggle-report" className="text-sm font-medium text-gray-700 cursor-pointer">Pin to navigation menu</Label>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDetailsOpen(false)} className="border-gray-300 text-gray-700" data-testid="button-cancel-details-report">
              Cancel
            </Button>
            <Button onClick={() => setDetailsOpen(false)} className="bg-[#008DA8] hover:bg-[#006E7D] text-white" data-testid="button-save-details-report">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
              {projectTitle}
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)} className="border-gray-300 text-gray-700" data-testid="button-cancel-delete-report">
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setDeleteOpen(false)} className="bg-red-600 hover:bg-red-700" data-testid="button-confirm-delete-report">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <CloneRestartModal open={cloneOpen} onOpenChange={setCloneOpen} />

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
                          <ToggleSwitch defaultChecked className="scale-75 data-[state=checked]:bg-[#0097B2]" />
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
                          <span className="text-sm font-medium text-[#274b8a]">Files & Assets: {enhanceFiles.length}/10</span>
                        </div>
                        {enhanceFiles.length > 0 && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>Context window</span>
                            <div className="w-32 h-4 bg-white border border-green-500 rounded-sm relative overflow-hidden">
                              <div className="absolute inset-y-0 left-0 bg-green-500 transition-all" style={{ width: `${Math.round((enhanceFiles.length / 10) * 100)}%` }} />
                              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-gray-700 z-10">Usage: {Math.round((enhanceFiles.length / 10) * 100)}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <div className="space-y-2 mb-3">
                          {enhanceFiles.map((file, i) => (
                            <div
                              key={`${file.name}-${i}`}
                              className="flex items-center justify-between bg-[#008DA8] text-white px-3 py-2 rounded-sm cursor-pointer hover:bg-[#007A92] transition-colors"
                              data-testid={`card-enhance-file-${i}`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="w-4 h-4 text-white/80 shrink-0" strokeWidth={1.5} />
                                <span className="text-[10px] font-medium truncate">{file.name}</span>
                              </div>
                              <XCircle
                                className="w-4 h-4 text-cyan-200 hover:text-white cursor-pointer shrink-0"
                                onClick={(e) => { e.stopPropagation(); setEnhanceFiles(prev => prev.filter((_, idx) => idx !== i)); }}
                              />
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50 h-8 text-xs font-medium" data-testid="button-enhance-upload" onClick={() => setIsAddFileModalOpen(true)}>
                          <Upload className="w-3 h-3 mr-1" /> Upload files
                        </Button>
                      </div>
                      <div className="bg-gray-50 p-2 border-t border-gray-200 flex items-center gap-2">
                        <ToggleSwitch className="scale-75 data-[state=checked]:bg-green-600 bg-[#343a4669]" />
                        <span className="text-xs font-medium flex items-center gap-1 text-[#3564bd]">
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
                            <ToggleSwitch
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
      <AddFilesModal
        open={isAddFileModalOpen}
        onOpenChange={setIsAddFileModalOpen}
        onSave={(files) => setEnhanceFiles(prev => [...prev, ...files.map(f => ({ ...f, size: Number(f.size) || 0 }))])}
      />
    </div>
  );
}
