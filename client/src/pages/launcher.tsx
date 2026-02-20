import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { usePreviewStore } from "@/lib/preview-store";
import { saveLaunchConfig, loadCloneDraft, clearCloneDraft } from "@/lib/launch-config";
import AddFilesModal from "@/components/add-files-modal";
import { 
  Upload, 
  FileText, 
  Globe, 
  Database, 
  Mic, 
  ChevronDown,
  ChevronUp, 
  Settings2, 
  Zap, 
  Info,
  Link as LinkIcon,
  Check,
  X,
  Plus,
  ArrowRight,
  Play,
  RotateCw,
  XCircle,
  ToggleRight,
  ArrowLeft,
  Lightbulb,
  Clock,
  Edit3,
  Trash2,
  GripVertical,
  History,
  RefreshCw,
  Search,
  Hourglass,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function Launcher() {
  const [, setLocation] = useLocation();
  const { openPreview } = usePreviewStore();
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"web" | "assets" | "hybrid">("web");
  const [files, setFiles] = useState<File[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [deepLinksFound, setDeepLinksFound] = useState(false);
  const [deepCrawlEnabled, setDeepCrawlEnabled] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [researchType, setResearchType] = useState<"search" | "sheet">("search");
  const [language, setLanguage] = useState("auto");
  const [showReasoning, setShowReasoning] = useState(true);
  
  // Step State
  const [questionAnswer, setQuestionAnswer] = useState("");
  const [geoScope, setGeoScope] = useState("global");
  const [visibleQuestions, setVisibleQuestions] = useState(1);
  const [questionAnswers, setQuestionAnswers] = useState<Record<number, string>>({});

  const questionsData = [
    {
      id: 1,
      title: "Geographic Scope.",
      text: "Should we focus only on founders in Ukraine or include the diaspora abroad?",
      chips: [
        { key: "global", label: "Global", icon: true },
        { key: "ukraine", label: "UA Ukraine Only" },
        { key: "eu", label: "EU" },
      ],
    },
    {
      id: 2,
      title: "Time Period.",
      text: "What time range should we consider for the research data?",
      chips: [
        { key: "last-year", label: "Last 12 months" },
        { key: "last-3-years", label: "Last 3 years" },
        { key: "all-time", label: "All time" },
      ],
    },
    {
      id: 3,
      title: "Industry Focus.",
      text: "Should we narrow the research to specific industries or keep it broad?",
      chips: [
        { key: "tech", label: "Tech & SaaS" },
        { key: "fintech", label: "FinTech" },
        { key: "all", label: "All Industries" },
      ],
    },
    {
      id: 4,
      title: "Funding Stage.",
      text: "Which funding stages are most relevant for this research?",
      chips: [
        { key: "pre-seed", label: "Pre-Seed / Seed" },
        { key: "series-a", label: "Series A+" },
        { key: "any", label: "Any Stage" },
      ],
    },
    {
      id: 5,
      title: "Output Format.",
      text: "How would you like the final research to be structured?",
      chips: [
        { key: "detailed", label: "Detailed Report" },
        { key: "summary", label: "Executive Summary" },
        { key: "data-table", label: "Data Table / CSV" },
      ],
    },
  ];

  const totalQuestions = questionsData.length;
  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
  const [confirmExitStep, setConfirmExitStep] = useState<string | null>(null);
  const [visibleStep, setVisibleStep] = useState(3);
  const [step1Files, setStep1Files] = useState<number[]>([1, 2, 3]); // Mock files for step 1
  const [isDragging, setIsDragging] = useState(false);
  const [step2Files, setStep2Files] = useState<File[]>([]);
  const [dataEngine, setDataEngine] = useState("ultimate");
  const [modalFiles, setModalFiles] = useState<{name: string; type: string; size: string}[]>([]);
  const [step2ModalFiles, setStep2ModalFiles] = useState<{name: string; type: string; size: string}[]>([]);
  const [addFileContext, setAddFileContext] = useState<"launcher" | "step2">("launcher");

  const [planVersion, setPlanVersion] = useState(1);
  const [planText, setPlanText] = useState(
`(1) Conduct a detailed analysis of the functionality of the website sepalai.com, focusing on its core operations and user interface.
(2) Examine the business model of sepalai.com, including revenue streams such as subscriptions, commissions, or freemium elements.
(3) Highlight the key features of sepalai.com's AI technology specifically designed to connect startups with investors.
(4) Emphasize how sepalai.com's AI facilitates matchmaking, investor recommendations, and deal flow optimization.
(5) Perform a comprehensive search for platforms and tools that offer AI-based matching for startups and investors.
(6) Identify tools providing AI-driven scoring systems to evaluate startup potential and investor compatibility.
(7) Explore solutions that automate the investor search process for startups using artificial intelligence.
(8) From the discovered solutions, filter and identify projects founded by immigrants from Ukraine.
(9) Utilize targeted search queries to uncover additional platforms created by Ukrainian diaspora entrepreneurs.
(10) Verify the biographies of founders from potentially suitable platforms, such as Unicorn Nest and similar analogues.
(11) Confirm the Ukrainian origin of founders through reliable sources like LinkedIn profiles, company about pages, or public records.
(12) For each selected project, gather precise details on their AI component's mechanics, algorithms, data sources, and user benefits, then compare these services with sepalai.com in terms of functionality, AI sophistication, and target audience demographics...`
  );
  const [isPlanCollapsed, setIsPlanCollapsed] = useState(false);
  const [showRefinePlan, setShowRefinePlan] = useState(false);
  const [refinePrompt, setRefinePrompt] = useState("");
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showAttachedFiles, setShowAttachedFiles] = useState(false);
  const [confirmDeleteFile, setConfirmDeleteFile] = useState<{ type: "all" } | { type: "single"; index: number } | null>(null);
  const [showCancelQueueModal, setShowCancelQueueModal] = useState(false);
  const [confirmDeleteVersion, setConfirmDeleteVersion] = useState(false);
  const [fileFilter, setFileFilter] = useState<"all" | "step1" | "step2">("all");
  const maxVersions = 5;
  const [totalVersions, setTotalVersions] = useState(1);
  const planStepCount = planText.split('\n').filter(l => l.trim()).length;

  const getDataEngineDescription = (engine: string) => {
    switch(engine) {
      case "fast":
        return "Optimized for speed. Best for quick fact-checking and surface scans.";
      case "pro":
        return "Balanced depth. Ideal for comprehensive market research and reports.";
      case "ultimate":
        return "Deepest analysis. Uncovers hidden patterns using multi-step reasoning.";
      default:
        return "Deepest analysis. Uncovers hidden patterns using multi-step reasoning.";
    }
  };

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [showCostBreakdown, setShowCostBreakdown] = useState(false);
  const [showStep3CostBreakdown, setShowStep3CostBreakdown] = useState(false);
  const [budgetCap, setBudgetCap] = useState(true);

  const languages = [
    { value: "auto", label: "Auto Detect" },
    { value: "en", label: "English (En)" },
    { value: "ge", label: "Germany (Ge)" },
    { value: "es", label: "Spanish (Es)" },
    { value: "zh", label: "Chinese (Zh)" },
    { value: "hi", label: "Hindi (Hi)" },
    { value: "ar", label: "Arabic (Ar)" },
    { value: "pt", label: "Portuguese (Pt)" },
    { value: "bn", label: "Bengali (Bn)" },
    { value: "ru", label: "Russian (Ru)" },
    { value: "ja", label: "Japanese (Ja)" },
    { value: "fr", label: "French (Fr)" },
    { value: "ua", label: "Ukrainian (Ua)" },
  ];

  const handleLanguageSelect = (value: string) => {
    if (value === "auto") {
        // If auto is selected, maybe clear others? Or just set as auto? 
        // For now, let's assume 'auto' clears specific selections or is just a reset.
        // But the UI shows chips next to "Auto Detect".
        // If "Auto Detect" is the *value* of the select box, and chips are separate.
        // Let's just add the language if it's not 'auto', or if 'auto' is treated as a language.
        // However, 'auto' usually means "don't filter". 
        // If the user selects a language, we add it. 
        if (!selectedLanguages.includes(value)) {
            setSelectedLanguages([...selectedLanguages, value]);
        }
    } else {
        if (!selectedLanguages.includes(value)) {
            setSelectedLanguages([...selectedLanguages, value]);
        }
    }
  };

  const removeLanguage = (lang: string) => {
    setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
  };


  const [attachedFiles, setAttachedFiles] = useState([
    { name: "Market Analysis Q3.pdf", type: "PDF", size: "2.4 MB", step: "step1" as const },
    { name: "Competitor Report 2024.docx", type: "DOCX", size: "1.8 MB", step: "step1" as const },
    { name: "User Interviews.txt", type: "TXT", size: "340 KB", step: "step1" as const },
    { name: "Financial Projections.xlsx", type: "XLSX", size: "5.1 MB", step: "step2" as const },
    { name: "Product Roadmap.pdf", type: "PDF", size: "3.2 MB", step: "step2" as const },
  ]);
  const filteredAttachedFiles = fileFilter === "all"
    ? attachedFiles
    : attachedFiles.filter(f => f.step === fileFilter);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setStep2Files(prev => [...prev, ...newFiles]);
    }
  };

  const handleStep2FileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setStep2Files(prev => [...prev, ...newFiles]);
      setIsAddFileModalOpen(false);
    }
  };
  const baseCost = 0.45;
  const deepCrawlCost = deepCrawlEnabled ? 0.50 : 0;
  const totalCost = baseCost + deepCrawlCost;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      
      // Simulate scanning for the first file uploaded
      if (!deepLinksFound) {
        setIsScanning(true);
        setTimeout(() => {
          setIsScanning(false);
          setDeepLinksFound(true); // Mock finding links
        }, 1500);
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (files.length <= 1) {
      setDeepLinksFound(false);
      setDeepCrawlEnabled(false);
    }
  };

  const handleLaunch = () => {
    if (!query) return;
    setIsLaunching(true);
    saveLaunchConfig({
      query,
      researchType,
      dataEngine,
      geoScope,
      selectedLanguages,
      attachedFiles,
      planText,
      planVersion,
      totalVersions,
      budgetCap,
      deepCrawlEnabled,
      showReasoning,
    });
    setTimeout(() => {
      setLocation("/research-in-progress/new");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 animate-in fade-in duration-500">
      <div className="max-w-[1000px] mx-auto py-6 px-4 space-y-6">
      
      {/* Header & Type Selection */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="font-bold text-sm tracking-wide text-gray-800">RESEARCH TYPE</span>
          <div className="flex items-center border border-gray-400 rounded-sm overflow-hidden shadow-sm">
            <button 
              className={cn(
                "text-sm font-medium px-6 py-1.5 transition-colors", 
                researchType === "search" ? "bg-[#00A0D1] text-white" : "bg-white text-gray-700 hover:bg-gray-50"
              )}
              onClick={() => setResearchType("search")}
            >
              Smart Search
            </button>
            <div className="w-px h-full bg-gray-300"></div>
            <button 
              className={cn(
                "text-sm font-medium px-6 py-1.5 transition-colors", 
                researchType === "sheet" ? "bg-[#00A0D1] text-white" : "bg-white text-gray-700 hover:bg-gray-50"
              )}
              onClick={() => setResearchType("sheet")}
            >
              Smart Sheet
            </button>
          </div>
        </div>
      </div>

      {/* Main Input Card */}
      <div className="bg-[#A0A0A0] rounded-xl shadow-md overflow-hidden p-1">
        {/* Card Header */}
        <div className="flex justify-between items-center px-3 py-1 min-h-[28px]">
          {/* Left Side: Context Window Indicator */}
          <div className="flex items-center">
            {query.length > 200 && (
                <div className="flex items-center gap-2 text-xs text-gray-600 animate-in fade-in slide-in-from-bottom-1 duration-300">
                  <span className="text-orange-400">📂</span>
                  <span>Context window</span>
                  <div className="w-32 h-4 bg-white border border-green-500 rounded-sm relative overflow-hidden">
                      <div className="absolute inset-y-0 left-0 bg-green-500 w-[20%]"></div>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-gray-700 z-10">Usage: 20%</span>
                  </div>
                </div>
            )}
          </div>

          {/* Right Side: Account Balance */}
          <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
            <span className="opacity-70">💳</span> Account Balance: $1,250.00
          </div>
        </div>

        {/* Inner White Container */}
        <div className="bg-white rounded-lg m-1 mt-0 p-1">
          
          {/* Omni-Input Area */}
          <div className="relative">
             <Textarea 
               placeholder="Enter text prompt" 
               className={cn(
                 "min-h-[160px] text-lg p-4 resize-none bg-white border-2 rounded-md shadow-sm placeholder:text-gray-400 w-full mb-0 transition-colors duration-300",
                 query.length > 200 ? "border-green-500 focus-visible:border-green-600 focus-visible:ring-green-600" : "border-yellow-400 focus-visible:ring-0 focus-visible:border-yellow-500",
                 !query && isLaunching && "animate-shake"
               )}
               value={query}
               onChange={(e) => setQuery(e.target.value)}
             />
             
             {query.length > 200 && (
                 <div className="absolute bottom-4 right-4 animate-in fade-in zoom-in duration-300">
                    <Button 
                        size="sm" 
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-1 h-7 flex items-center gap-1 shadow-sm"
                    >
                        <Zap className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                    </Button>
                 </div>
             )}
          </div>

          {/* File Previews Row - Moved outside Textarea container */}
          {(files.length > 0 || isScanning) && (
            <div className="flex flex-wrap gap-2 mt-2 px-1">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-[#008DA8] text-white px-3 py-1.5 rounded-sm shadow-sm relative overflow-hidden group min-w-[200px] max-w-[240px] cursor-pointer"
                  onClick={() => {
                    const previewFiles = files.map((f, idx) => ({
                      id: `launcher-${idx}`,
                      name: f.name,
                      type: f.name.split(".").pop()?.toUpperCase() || "FILE",
                      size: `${(f.size / 1024).toFixed(1)} KB`,
                    }));
                    openPreview({
                      files: previewFiles,
                      initialFileId: `launcher-${i}`,
                      context: "input",
                    });
                  }}
                  data-testid={`card-launcher-file-${i}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-5 h-5 text-white/80 shrink-0" strokeWidth={1.5} />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-medium leading-tight truncate">{file.name}</span>
                      <span className="text-[10px] font-medium leading-tight truncate opacity-80">{(file.size / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(i);
                    }}
                    className="text-cyan-200 hover:text-white ml-2 shrink-0"
                  >
                    <XCircle className="w-5 h-5 stroke-[1.5]" />
                  </button>
                </div>
              ))}
              
              {/* Mock previews to match image if no files uploaded yet for demo */}
              {files.length === 0 && (
                <>
                  {[1, 2, 3, 4].map((mockId) => (
                    <div
                      key={mockId}
                      className="flex items-center justify-between bg-[#008DA8] text-white px-3 py-1.5 rounded-sm shadow-sm relative overflow-hidden group min-w-[200px] max-w-[240px] cursor-pointer"
                      onClick={() => {
                        const mockPreviewFiles = [1, 2, 3, 4].map((mId) => ({
                          id: `mock-launcher-${mId}`,
                          name: `File Preview ${mId}.pdf`,
                          type: "PDF",
                          size: "120.0 KB",
                        }));
                        openPreview({
                          files: mockPreviewFiles,
                          initialFileId: `mock-launcher-${mockId}`,
                          context: "input",
                        });
                      }}
                      data-testid={`card-mock-launcher-file-${mockId}`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-5 h-5 text-white/80 shrink-0" strokeWidth={1.5} />
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] font-medium leading-tight truncate">File Preview (name,</span>
                          <span className="text-[10px] font-medium leading-tight truncate opacity-80">type, etc.)</span>
                        </div>
                      </div>
                      <button className="text-cyan-200 hover:text-white ml-2 shrink-0">
                        <XCircle className="w-5 h-5 stroke-[1.5]" />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* Modal-selected File Cards */}
          {modalFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 px-1">
              {modalFiles.map((file, i) => (
                <div
                  key={`modal-${i}`}
                  className="flex items-center justify-between bg-[#008DA8] text-white px-3 py-1.5 rounded-sm shadow-sm relative overflow-hidden group min-w-[200px] max-w-[240px] cursor-pointer"
                  onClick={() => {
                    const previewFiles = modalFiles.map((f, idx) => ({
                      id: `modal-${idx}`,
                      name: f.name,
                      type: f.type,
                      size: f.size,
                    }));
                    openPreview({
                      files: previewFiles,
                      initialFileId: `modal-${i}`,
                      context: "input",
                    });
                  }}
                  data-testid={`card-modal-file-${i}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-5 h-5 text-white/80 shrink-0" strokeWidth={1.5} />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-medium leading-tight truncate">{file.name}</span>
                      <span className="text-[10px] font-medium leading-tight truncate opacity-80">{file.size}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalFiles(prev => prev.filter((_, idx) => idx !== i));
                    }}
                    className="text-cyan-200 hover:text-white ml-2 shrink-0"
                  >
                    <XCircle className="w-5 h-5 stroke-[1.5]" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Controls Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-4 px-2 pb-2 relative">
             
             <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-black">Add files</span>
                <input 
                  type="file" 
                  multiple 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                
                <button 
                  className="bg-white border border-green-600 rounded-md px-4 py-1 text-sm font-medium shadow-sm hover:bg-gray-50 flex items-center justify-center min-w-[100px]"
                  onClick={() => { setAddFileContext("launcher"); setIsAddFileModalOpen(true); }}
                >
                  selected: {files.length + modalFiles.length}
                </button>

                <button 
                  className={cn(
                    "text-red-600 hover:text-red-700 relative ml-1 transition-opacity",
                    (files.length + modalFiles.length) === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
                  )}
                  onClick={() => {
                    setFiles([]);
                    setModalFiles([]);
                    setDeepLinksFound(false);
                    setDeepCrawlEnabled(false);
                  }}
                >
                  <XCircle className="w-6 h-6 fill-white" />
                  <span className="absolute -top-1.5 -right-1 bg-yellow-400 text-black text-[9px] font-bold px-1 rounded-sm border border-white shadow-sm leading-tight min-w-[14px] text-center">
                    {files.length + modalFiles.length}
                  </span>
                </button>
             </div>

             <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
               <Switch 
                 checked={showReasoning} 
                 onCheckedChange={setShowReasoning}
                 className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
               />
               <span className="text-xs font-bold text-black">Show Steps' Reasoning</span>
               <Info className="w-4 h-4 text-black fill-black" />
             </div>
             
             <Button 
               className={cn(
                 "text-black border border-gray-400 font-medium px-8 h-9 shadow-sm transition-colors duration-300",
                 query.length > 200 
                    ? "bg-[#00802b] hover:bg-[#006622] text-white border-green-600" 
                    : "bg-[#D0D0D0] hover:bg-[#C0C0C0]"
               )}
             >
               Send Request
             </Button>

          </div>

        </div>
      </div>

      {/* Step 1: Questionnaire (Dark Header Theme) */}
      {visibleStep >= 1 && (
      <div className="w-full bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden font-sans">
        {/* Step Header */}
        <div className="flex border-b border-gray-200 bg-[#5A6B7C] min-h-[34px]">
          <button 
            className="flex items-center gap-1 px-4 py-2 hover:bg-[#4a5b6c] transition-colors text-xs font-bold border-r border-gray-300 bg-[#546c7c] text-[#ffffff]"
            onClick={() => setConfirmExitStep("Launcher")}
          >
            <ArrowLeft className="w-3 h-3" /> Prev. step
          </button>
          <div className="px-6 py-2 bg-[#0097B2] text-white text-xs font-bold flex items-center justify-center">
            STEP #1
          </div>
          <div className="px-6 py-2 bg-[#F0F2F5] text-[#5A6B7C] text-xs font-bold flex items-center justify-center border-r border-gray-300">
            REASONING
          </div>
          <div className="flex-1 bg-[#5A6B7C]"></div>
        </div>

        <div className="p-4 space-y-4">
          {/* Tip */}
          <div className="bg-blue-50 text-blue-700 flex items-center gap-2 text-sm font-medium px-1 rounded-sm py-1">
            <Lightbulb className="w-4 h-4" />
            <span>Just a few questions to make your research perfect</span>
          </div>

          {/* Questions */}
          <div className="space-y-3">
            {questionsData.slice(0, visibleQuestions).map((q) => {
              const answer = q.id === 1 ? questionAnswer : (questionAnswers[q.id] || "");
              const setAnswer = q.id === 1
                ? (val: string) => setQuestionAnswer(val)
                : (val: string) => setQuestionAnswers(prev => ({ ...prev, [q.id]: val }));
              const remainingChips = q.chips.filter(chip => !answer.includes(chip.label));

              return (
                <div key={q.id} className="space-y-3">
                  {q.id > 1 && <div className="border-t border-gray-100 pt-3" />}
                  <div className="flex gap-2">
                    <div className="bg-[#008DA8] text-white w-6 h-6 flex items-center justify-center rounded-sm text-xs font-bold shrink-0 mt-0.5">{q.id}</div>
                    <p className="text-sm font-medium text-gray-800">
                      <span className="font-bold">{q.title}</span> {q.text}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-gray-600 px-1">
                      <span>Your answers</span>
                      <span>{answer.length}/500</span>
                    </div>
                    <Textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Answers to the question"
                      className="bg-white border-gray-300 placeholder:text-gray-400 text-gray-800 min-h-[60px] resize-none focus-visible:ring-[#008DA8]"
                      data-testid={`input-question-${q.id}`}
                    />
                  </div>

                  {remainingChips.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {remainingChips.map(chip => (
                        <button
                          key={chip.key}
                          className="px-3 py-1 text-xs font-medium border rounded-sm flex items-center gap-1 transition-colors bg-gray-50 border-gray-200 text-gray-600 hover:bg-blue-100 hover:border-blue-200 hover:text-blue-800"
                          onClick={() => {
                            setAnswer(answer ? `${answer}\n${chip.label}` : chip.label);
                            if (q.id === 1) setGeoScope(chip.key);
                          }}
                          data-testid={`chip-q${q.id}-${chip.key}`}
                        >
                          {(chip as any).icon && <Globe className="w-3 h-3" />}
                          {(chip as any).icon ? chip.label : `[ ${chip.label} ]`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              {visibleQuestions < totalQuestions ? (
                <Button 
                  variant="outline" 
                  className="bg-white text-[#008DA8] border-[#008DA8] hover:bg-blue-50 h-8 text-xs font-bold px-6"
                  onClick={() => setVisibleQuestions(prev => Math.min(prev + 1, totalQuestions))}
                  data-testid="button-next-question"
                >
                  Next Question ({visibleQuestions + 1}/{totalQuestions})
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="bg-white text-green-700 border-green-600 hover:bg-green-50 h-8 text-xs font-bold px-6"
                  onClick={() => setVisibleStep(prev => Math.max(prev, 2))}
                  data-testid="button-finish-questions"
                >
                  Finish Questions
                </Button>
              )}
              
              <Button 
                className="bg-gray-500 hover:bg-gray-600 text-white h-8 text-xs font-bold px-8 shadow-sm"
              >
                Skip & Continue
              </Button>
            </div>

            {/* Footer Text */}
            <p className="text-[10px] text-gray-500 italic leading-tight pt-1">
              Proceed with AI defaults. The system will use its best judgment to define the research scope, though results may be less tailored to your specific needs.
            </p>
          </div>
        </div>
      </div>
      )}
      
      {/* Configuration Accordion - Now Step 2 (Dark Header Theme) */}
      {visibleStep >= 2 && (
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div>
          <div className="px-0 py-0 bg-white">
            <div className="w-full flex border-b border-gray-200 font-sans bg-[#5A6B7C] min-h-[34px]">
              <button 
                className="flex items-center gap-1 px-4 py-2 hover:bg-[#4a5b6c] transition-colors text-xs font-bold border-r border-gray-300 bg-[#546c7c] text-[#ffffff]"
                onClick={() => setConfirmExitStep("Step #1")}
              >
                <ArrowLeft className="w-3 h-3" /> Prev. step
              </button>
              <div className="px-6 py-2 bg-[#0097B2] text-white text-xs font-bold flex items-center justify-center">
                STEP #2
              </div>
              <div className="px-6 py-2 bg-[#F0F2F5] text-[#5A6B7C] text-xs font-bold flex items-center justify-center border-r border-gray-300">
                REASONING
              </div>
              <div className="flex-1 bg-[#5A6B7C]"></div>
            </div>
          </div>
          <div className="px-6 pb-6 pt-6">
            <div className="space-y-6">
              <p className="text-sm text-gray-500">
                At this stage, you choose the depth of analysis and data sources. This will help the system to optimize your budget and ensure maximum accuracy of research for a specific task.
              </p>
              
              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-sm font-medium text-gray-700 border-b border-gray-200">
                    <span className="py-2">SOURCES</span>
                    <div className="flex items-center">
                       <button 
                         className={cn(
                           "h-9 text-xs font-medium px-4 border-b-2 transition-colors",
                           scope !== "assets" ? "border-green-500 text-green-700 bg-green-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                         )}
                         onClick={() => setScope("web")}
                       >
                         Web
                       </button>
                       <button 
                         className={cn(
                           "h-9 text-xs font-medium px-4 border-b-2 transition-colors",
                           scope === "assets" ? "border-green-500 text-green-700 bg-green-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                         )}
                         onClick={() => setScope("assets")}
                       >
                         Files
                       </button>
                    </div>
                 </div>
                 
                 {scope === "web" ? (
                   <div className="border-2 border-[#0097B2] rounded-sm p-4 bg-white space-y-4 shadow-sm relative">
                      <div className="flex items-center justify-between mb-2">
                         <div className="flex items-center gap-2">
                            <Switch defaultChecked className="scale-75 data-[state=checked]:bg-[#0097B2]" />
                            <span className="text-sm text-gray-700">Web Pages & Websites: <span className="font-mono">∞</span></span>
                         </div>
                      </div>
                      
                      <div className="space-y-4">
                         
                         <div className="flex items-center gap-2">
                             <div className="flex items-center gap-1">
                                <span className="text-sm font-medium text-gray-700">Search Language</span>
                                <Info className="w-4 h-4 text-[#0097B2]" />
                             </div>
                             
                             <Select value="auto" onValueChange={handleLanguageSelect}>
                                <SelectTrigger className="h-8 w-[140px] bg-white border-gray-300 text-xs">
                                   <SelectValue placeholder="Auto Detect" />
                                </SelectTrigger>
                                <SelectContent>
                                   {languages.filter(lang => lang.value === "auto" || !selectedLanguages.includes(lang.value)).map((lang) => (
                                      <SelectItem key={lang.value} value={lang.value}>
                                        {lang.label}
                                      </SelectItem>
                                   ))}
                                </SelectContent>
                             </Select>

                             <div className="flex items-center gap-2 flex-wrap">
                                {selectedLanguages.filter(l => l !== 'auto').map(langCode => {
                                    const lang = languages.find(l => l.value === langCode);
                                    // Extract just the code from the label "Language (Code)" -> "Code"
                                    // Or just use the code from value? The mockup shows "Ua", "Ru". 
                                    // If label is "Ukrainian (Ua)", we want "Ua".
                                    // Let's parse it or use a mapping. 
                                    // For simplicity and matching the exact string "Ua", "Ru" from the label parenthesis:
                                    const label = lang?.label || langCode;
                                    const match = label.match(/\(([^)]+)\)/);
                                    const shortCode = match ? match[1] : langCode;
                                    
                                    return (
                                        <div key={langCode} className="bg-[#A0A0A0] text-black text-xs font-bold px-2 py-1 rounded-sm flex items-center gap-1">
                                           {shortCode} <X className="w-3 h-3 text-red-600 cursor-pointer" onClick={() => removeLanguage(langCode)} />
                                        </div>
                                    );
                                })}
                             </div>
                         </div>
                      </div>
                   </div>
                 ) : (
                   <div className="border border-green-600 rounded-sm p-0 bg-white shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between p-2 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                           <FileText className="w-5 h-5" strokeWidth={1.5} />
                           <span className="text-sm font-medium">Files & Assets: 3/10</span>
                        </div>
                        <div className="flex items-center gap-2 w-auto">
                           <div className="flex items-center gap-2 text-xs text-gray-600">
                              <span className="text-orange-400">📂</span>
                              <span>Context window</span>
                              <div className="w-32 h-4 bg-white border border-green-500 rounded-sm relative overflow-hidden">
                                 <div className="absolute inset-y-0 left-0 bg-green-500 w-[20%]"></div>
                                 <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-gray-700 z-10">Usage: 20%</span>
                              </div>
                           </div>
                        </div>
                      </div>

                      <div className="p-3 bg-white">
                         <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                               <span className="text-xs font-bold">
                                 Added at Step2: {step1Files.length} 
                                 {step1Files.length > 0 && (
                                   <span className="text-red-600 underline cursor-pointer ml-1 font-normal" onClick={() => setStep1Files([])}>remove all</span>
                                 )}
                               </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                               {step1Files.map((id, i) => (
                                  <div
                                    key={id}
                                    className="flex items-center justify-between bg-[#008DA8] text-white px-3 py-2 rounded-sm relative overflow-hidden group cursor-pointer"
                                    onClick={() => {
                                      const previewFiles = step1Files.map((fId) => ({
                                        id: `step1-${fId}`,
                                        name: `Mock File ${fId}.pdf`,
                                        type: "PDF",
                                        size: "150.5 KB",
                                        step: "step2",
                                      }));
                                      openPreview({
                                        files: previewFiles,
                                        initialFileId: `step1-${id}`,
                                        context: "input",
                                      });
                                    }}
                                    data-testid={`card-step1-file-${id}`}
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <FileText className="w-5 h-5 text-white/80 shrink-0" strokeWidth={1.5} />
                                      <div className="flex flex-col min-w-0">
                                        <span className="text-[10px] font-medium leading-tight truncate">Mock File {id}.pdf</span>
                                        <span className="text-[10px] font-medium leading-tight opacity-80">150.5 KB</span>
                                      </div>
                                    </div>
                                    <button 
                                      className="text-cyan-200 hover:text-white ml-1 shrink-0"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setStep1Files(prev => prev.filter(item => item !== id));
                                      }}
                                    >
                                      <XCircle className="w-5 h-5 stroke-[1.5]" />
                                    </button>
                                  </div>
                               ))}
                            </div>
                         </div>

                         <div>
                            <div className="flex items-center justify-between mb-2">
                               <span className="text-xs font-bold">
                                 Added at this step: {step2Files.length + step2ModalFiles.length}
                                 {(step2Files.length + step2ModalFiles.length) > 0 && (
                                   <span className="text-red-600 underline cursor-pointer ml-1 font-normal" onClick={() => { setStep2Files([]); setStep2ModalFiles([]); }}>remove all</span>
                                 )}
                               </span>
                            </div>
                            
                            {/* Display added files for step 2 */}
                            {step2Files.length > 0 && (
                               <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                                  {step2Files.map((file, i) => (
                                     <div
                                       key={i}
                                       className="flex items-center justify-between bg-[#008DA8] text-white px-3 py-2 rounded-sm relative overflow-hidden group cursor-pointer"
                                       onClick={() => {
                                         const ext = file.name.split(".").pop()?.toUpperCase() || "FILE";
                                         const previewFiles = step2Files.map((f, idx) => ({
                                           id: `step2-${idx}`,
                                           name: f.name,
                                           type: f.name.split(".").pop()?.toUpperCase() || "FILE",
                                           size: `${(f.size / 1024).toFixed(1)} KB`,
                                           step: "step2",
                                         }));
                                         openPreview({
                                           files: previewFiles,
                                           initialFileId: `step2-${i}`,
                                           context: "input",
                                         });
                                       }}
                                       data-testid={`card-step2-file-${i}`}
                                     >
                                       <div className="flex items-center gap-2 min-w-0">
                                         <FileText className="w-5 h-5 text-white/80 shrink-0" strokeWidth={1.5} />
                                         <div className="flex flex-col min-w-0">
                                           <span className="text-[10px] font-medium leading-tight truncate">{file.name}</span>
                                           <span className="text-[10px] font-medium leading-tight opacity-80">{(file.size / 1024).toFixed(1)} KB</span>
                                         </div>
                                       </div>
                                       <button 
                                         className="text-cyan-200 hover:text-white ml-1 shrink-0"
                                         onClick={(e) => {
                                           e.preventDefault();
                                           e.stopPropagation();
                                           setStep2Files(prev => prev.filter((_, idx) => idx !== i));
                                         }}
                                       >
                                         <XCircle className="w-5 h-5 stroke-[1.5]" />
                                       </button>
                                     </div>
                                  ))}
                               </div>
                            )}

                            {step2ModalFiles.length > 0 && (
                               <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                                  {step2ModalFiles.map((file, i) => (
                                     <div
                                       key={`s2m-${i}`}
                                       className="flex items-center justify-between bg-[#008DA8] text-white px-3 py-2 rounded-sm relative overflow-hidden group cursor-pointer"
                                       onClick={() => {
                                         const previewFiles = step2ModalFiles.map((f, idx) => ({
                                           id: `step2modal-${idx}`,
                                           name: f.name,
                                           type: f.type,
                                           size: f.size,
                                         }));
                                         openPreview({
                                           files: previewFiles,
                                           initialFileId: `step2modal-${i}`,
                                           context: "input",
                                         });
                                       }}
                                       data-testid={`card-step2-modal-file-${i}`}
                                     >
                                       <div className="flex items-center gap-2 min-w-0">
                                         <FileText className="w-5 h-5 text-white/80 shrink-0" strokeWidth={1.5} />
                                         <div className="flex flex-col min-w-0">
                                           <span className="text-[10px] font-medium leading-tight truncate">{file.name}</span>
                                           <span className="text-[10px] font-medium leading-tight opacity-80">{file.size}</span>
                                         </div>
                                       </div>
                                       <button
                                         className="text-cyan-200 hover:text-white ml-1 shrink-0"
                                         onClick={(e) => {
                                           e.preventDefault();
                                           e.stopPropagation();
                                           setStep2ModalFiles(prev => prev.filter((_, idx) => idx !== i));
                                         }}
                                       >
                                         <XCircle className="w-5 h-5 stroke-[1.5]" />
                                       </button>
                                     </div>
                                  ))}
                               </div>
                            )}

                            <div className="flex gap-4">
                               <div className="w-40 flex flex-col justify-center items-center gap-2">
                                  <input 
                                    type="file" 
                                    multiple 
                                    className="hidden" 
                                    ref={fileInputRef}
                                    onChange={handleStep2FileUpload}
                                  />
                                  <Button 
                                    variant="outline" 
                                    className="w-full border-green-600 text-green-700 hover:bg-green-50 h-8 text-xs font-medium"
                                    onClick={() => { setAddFileContext("step2"); setIsAddFileModalOpen(true); }}
                                  >
                                    Upload files
                                  </Button>
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="bg-gray-50 p-2 border-t border-gray-200 flex items-center gap-2">
                         <Switch className="scale-75 data-[state=checked]:bg-green-600" />
                         <span className="text-xs font-medium flex items-center gap-1">
                           <LinkIcon className="w-3 h-3" /> Extract & Research Embedded URLs <Info className="w-3 h-3 text-[#0097B2]" />
                         </span>
                      </div>
                   </div>
                 )}

                 <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-bold text-gray-700">Data Engine</span>
                       <Info className="w-3.5 h-3.5 text-gray-400" />
                       <Select value={dataEngine} onValueChange={setDataEngine}>
                          <SelectTrigger className="h-8 w-[140px] bg-white border-gray-300 text-xs font-bold">
                             <div className="flex items-center gap-1.5">
                                {dataEngine === "ultimate" && <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                                {dataEngine === "pro" && <Zap className="w-3 h-3 text-blue-500 fill-blue-500" />}
                                {dataEngine === "fast" && <Zap className="w-3 h-3 text-green-500 fill-green-500" />}
                                <span className="capitalize">{dataEngine === 'fast' ? 'Standard' : dataEngine === 'pro' ? 'Advanced' : dataEngine}</span>
                             </div>
                          </SelectTrigger>
                          <SelectContent>
                             <SelectItem value="ultimate">Ultimate</SelectItem>
                             <SelectItem value="pro">Advanced</SelectItem>
                             <SelectItem value="fast">Standard</SelectItem>
                          </SelectContent>
                       </Select>
                       <span className="text-xs text-[#008DA8] ml-2">{getDataEngineDescription(dataEngine)}</span>
                    </div>
                 </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
                 <div className="flex items-center gap-4">
                    <div className="text-left relative">
                       <span className="text-xs text-gray-500 font-medium mr-2">Estimated Cost:</span>
                       <span 
                         className="text-sm font-bold text-[#008DA8] border-b border-[#008DA8] border-dashed cursor-pointer"
                         onClick={() => setShowCostBreakdown(!showCostBreakdown)}
                       >
                         ${totalCost.toFixed(2)} - ${(totalCost * 1.2).toFixed(2)}
                       </span>
                       
                       <AnimatePresence>
                         {showCostBreakdown && (
                           <motion.div 
                             initial={{ opacity: 0, y: 10, scale: 0.95 }}
                             animate={{ opacity: 1, y: 0, scale: 1 }}
                             exit={{ opacity: 0, y: 10, scale: 0.95 }}
                             transition={{ duration: 0.2 }}
                             className="absolute bottom-full left-0 mb-2 w-[580px] bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden text-left"
                           >
                             <div className="flex">
                             {/* Left Column: Breakdown */}
                             <div className="flex-1 p-4 border-r border-gray-100">
                               <h4 className="text-xs font-bold text-gray-900 mb-3">Cost Breakdown</h4>
                               <div className="space-y-2 text-xs">
                                 <div className="flex justify-between text-gray-600">
                                   <span>Fixed cost for Core generator:</span>
                                   <span>$2.00</span>
                                 </div>
                                 <div className="flex justify-between text-gray-600">
                                   <span>Matches cost (10 × $0.15):</span>
                                   <span>$1.50</span>
                                 </div>
                                 <div className="space-y-1">
                                   <div className="flex justify-between text-gray-600">
                                     <span>Enrichment Cost:</span>
                                     <span>$0.50</span>
                                   </div>
                                   <div className="flex justify-between text-gray-400 pl-2 text-[10px]">
                                     <span>Core2x (10 × $0.050):</span>
                                     <span>$0.50</span>
                                   </div>
                                   <div className="text-gray-300 pl-2 text-[10px]">
                                     company_summary
                                   </div>
                                 </div>
                                 <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                                   <span>Total:</span>
                                   <span>$4.00</span>
                                 </div>
                               </div>
                             </div>

                             {/* Right Column: Budget Control */}
                             <div className="w-[240px] p-4 bg-gray-50">
                               <div className="flex justify-between items-start mb-2">
                                 <h4 className="text-xs font-bold text-gray-900">Budget Control</h4>
                                 <button onClick={() => setShowCostBreakdown(false)} className="text-gray-400 hover:text-gray-600">
                                   <X className="w-4 h-4" />
                                 </button>
                               </div>
                               
                               <div className="space-y-3 text-xs">
                                 <div>
                                   <div className="text-gray-600 mb-1">Available Balance: <span className="font-bold text-black">$124.50</span></div>
                                 </div>
                                 <div>
                                   <div className="text-gray-600 mb-2">Current research: <span className="font-bold text-black">$15.4 - $18.4</span></div>
                                 </div>
                                 
                                 <div className="flex items-center gap-2">
                                   <Switch 
                                     checked={budgetCap} 
                                     onCheckedChange={setBudgetCap}
                                     className="scale-75 data-[state=checked]:bg-green-600" 
                                   />
                                   <span className="text-orange-400 font-medium">Strict Budget Cap</span>
                                   <Info className="w-3 h-3 text-orange-400" />
                                 </div>
                               </div>
                             </div>
                           </div>
                           </motion.div>
                         )}
                       </AnimatePresence>
                    </div>
                 </div>
                 <Button className="bg-[#008DA8] hover:bg-[#007A92] text-white font-bold px-6 shadow-md">
                    Create a plan
                 </Button>
              </div>

            </div>
          </div>
        </div>
      </div>
      )}

      {/* Step 3: Research Plan */}
      {visibleStep >= 3 && (
      <div className="w-full bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden font-sans">
        <div className="flex border-b border-gray-200 bg-[#5A6B7C] min-h-[34px]">
          <button 
            className="flex items-center gap-1 px-4 py-2 hover:bg-[#4a5b6c] transition-colors text-xs font-bold border-r border-gray-300 bg-[#546c7c] text-[#ffffff]"
            onClick={() => setConfirmExitStep("Step #2")}
            data-testid="button-prev-step3"
          >
            <ArrowLeft className="w-3 h-3" /> Prev. step
          </button>
          <div className="px-6 py-2 bg-[#0097B2] text-white text-xs font-bold flex items-center justify-center">STEP #4</div>
          <div className="px-6 py-2 bg-[#F0F2F5] text-[#5A6B7C] text-xs font-bold flex items-center justify-center border-r border-gray-300">REASONING</div>
          <div className="flex-1 bg-[#5A6B7C] flex items-center justify-end px-4">
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-1 text-xs text-white/80 hover:text-white transition-colors"
                onClick={() => setShowVersionHistory(!showVersionHistory)}
                data-testid="button-version-history"
              >
                <History className="w-3.5 h-3.5" />
                <span>v{planVersion}/{totalVersions}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-bold text-gray-800" data-testid="text-plan-title">Research Plan</h3>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalVersions }, (_, i) => i + 1).map((v) => (
                  <button
                    key={v}
                    className={cn(
                      "w-7 h-7 text-xs font-bold rounded-sm transition-colors",
                      v === planVersion
                        ? "bg-[#008DA8] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                    onClick={() => setPlanVersion(v)}
                    data-testid={`button-version-tab-${v}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <button
              className="border border-[#008DA8] rounded-sm px-3 py-1 text-xs font-medium text-[#008DA8] hover:bg-blue-50 transition-colors flex items-center gap-1.5"
              onClick={() => setShowAttachedFiles(!showAttachedFiles)}
              data-testid="button-attached-files"
            >
              Attached files: {attachedFiles.length}
              <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", showAttachedFiles && "rotate-180")} />
            </button>
          </div>

          <AnimatePresence>
            {showAttachedFiles && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-gray-600">Attached Files: {attachedFiles.length}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Added at</span>
                        <Select value={fileFilter} onValueChange={(v: "all" | "step1" | "step2") => setFileFilter(v)}>
                          <SelectTrigger className="h-6 w-[80px] text-[10px] border-gray-300 bg-white" data-testid="select-file-filter">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any</SelectItem>
                            <SelectItem value="step1">Step1</SelectItem>
                            <SelectItem value="step2">Step2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {attachedFiles.length > 0 && (
                      <button
                        className="text-xs text-red-500 font-medium hover:text-red-700 hover:underline transition-colors"
                        onClick={() => setConfirmDeleteFile({ type: "all" })}
                        data-testid="button-delete-all-files"
                      >
                        delete all
                      </button>
                    )}
                  </div>
                  <div className="p-3 space-y-2">
                    {filteredAttachedFiles.map((file, index) => {
                      const realIndex = attachedFiles.indexOf(file);
                      return (
                        <div
                          key={realIndex}
                          className="group flex items-center justify-between px-3 py-2 rounded-sm border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                          data-testid={`card-attached-file-${realIndex}`}
                          onClick={() => {
                            const previewFiles = attachedFiles.map((f, i) => ({
                              id: `file-${i}`,
                              name: f.name,
                              type: f.type,
                              size: f.size,
                              step: f.step,
                            }));
                            openPreview({
                              files: previewFiles,
                              initialFileId: `file-${realIndex}`,
                              context: "input",
                            });
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-medium text-gray-700">{file.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-sm">{file.type}</span>
                            <span className="text-[10px] text-gray-400">{file.size}</span>
                            <Trash2
                              className="w-3.5 h-3.5 text-red-400 hover:text-red-600 cursor-pointer invisible group-hover:visible transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDeleteFile({ type: "single", index: realIndex });
                              }}
                              data-testid={`button-delete-file-${realIndex}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="border border-gray-200 rounded-md overflow-hidden">
            <button 
              className="w-full bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setIsPlanCollapsed(!isPlanCollapsed)}
              data-testid="button-toggle-plan"
            >
              <span className="text-xs font-bold text-gray-600">Details: {planStepCount} Steps</span>
              <div className="flex items-center gap-7">
                {planVersion !== 1 && (
                  <Trash2
                    className="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDeleteVersion(true);
                    }}
                    data-testid="button-delete-version"
                  />
                )}
                <ChevronDown className={cn("w-4 h-4 text-gray-500 transition-transform duration-200", !isPlanCollapsed && "rotate-180")} />
              </div>
            </button>

            {!isPlanCollapsed && (
              <div className="p-4" data-testid="text-plan-content">
                <p className="text-xs text-gray-700 leading-[1.8] whitespace-pre-line">{planText}</p>
              </div>
            )}
          </div>

          {showRefinePlan && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-medium text-green-700">Refinements used: {totalVersions - 1}/{maxVersions - 1}</span>

              {totalVersions >= maxVersions ? (
                <div className="border-2 border-orange-400 rounded-md p-4 bg-orange-50" data-testid="text-max-refinements">
                  <p className="text-sm font-medium text-orange-700 text-center">You have reached the maximum number of Refinements</p>
                </div>
              ) : (
                <div className="border-2 border-green-600 rounded-md overflow-hidden" data-testid="refine-plan-input">
                  <div className="relative">
                    <Textarea
                      value={refinePrompt}
                      onChange={(e) => {
                        if (e.target.value.length <= 500) {
                          setRefinePrompt(e.target.value);
                        }
                      }}
                      placeholder="Enter text prompt"
                      className="min-h-[80px] text-sm p-3 pr-16 pb-6 resize-none bg-white border-0 rounded-none placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                      maxLength={500}
                      data-testid="input-refine-prompt"
                    />
                    <span className="absolute bottom-2 right-14 text-[10px] text-gray-400" data-testid="text-refine-char-count">{refinePrompt.length}/500</span>
                    {refinePrompt.length > 10 && (
                    <button
                      className="absolute bottom-3 right-3 flex flex-col items-center gap-0.5"
                      onClick={() => {
                        if (refinePrompt.trim() && totalVersions < maxVersions) {
                          const newVersion = totalVersions + 1;
                          setTotalVersions(newVersion);
                          setPlanVersion(newVersion);
                          setRefinePrompt("");
                        }
                      }}
                      data-testid="button-send-refinement"
                    >
                      <Zap className="w-5 h-5 text-yellow-500 fill-yellow-400" />
                      <span className="text-[10px] font-bold text-[#008DA8]">send</span>
                    </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs text-gray-600 relative">
              <span className="text-xs text-gray-500 font-medium">Estimated Cost:</span>
              <span 
                className="text-sm font-bold text-[#008DA8] border-b border-[#008DA8] border-dashed cursor-pointer"
                onClick={() => setShowStep3CostBreakdown(!showStep3CostBreakdown)}
                data-testid="text-step3-cost"
              >
                $15.4 - $18.4
              </span>

              <AnimatePresence>
                {showStep3CostBreakdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-full left-0 mb-2 w-[580px] bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden text-left"
                  >
                    <div className="flex">
                      <div className="flex-1 p-4 border-r border-gray-100">
                        <h4 className="text-xs font-bold text-gray-900 mb-3">Cost Breakdown</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between text-gray-600">
                            <span>Fixed cost for Core generator:</span>
                            <span>$2.00</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Matches cost (10 × $0.15):</span>
                            <span>$1.50</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-gray-600">
                              <span>Enrichment Cost:</span>
                              <span>$0.50</span>
                            </div>
                            <div className="flex justify-between text-gray-400 pl-2 text-[10px]">
                              <span>Core2x (10 × $0.050):</span>
                              <span>$0.50</span>
                            </div>
                            <div className="text-gray-300 pl-2 text-[10px]">
                              company_summary
                            </div>
                          </div>
                          <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                            <span>Total:</span>
                            <span>$4.00</span>
                          </div>
                        </div>
                      </div>

                      <div className="w-[240px] p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-xs font-bold text-gray-900">Budget Control</h4>
                          <button onClick={() => setShowStep3CostBreakdown(false)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-3 text-xs">
                          <div>
                            <div className="text-gray-600 mb-1">Available Balance: <span className="font-bold text-black">$124.50</span></div>
                          </div>
                          <div>
                            <div className="text-gray-600 mb-2">Current research: <span className="font-bold text-black">$15.4 - $18.4</span></div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={budgetCap} 
                              onCheckedChange={setBudgetCap}
                              className="scale-75 data-[state=checked]:bg-green-600" 
                            />
                            <span className="text-orange-400 font-medium">Strict Budget Cap</span>
                            <Info className="w-3 h-3 text-orange-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className={cn(
                  "border-green-600 text-green-700 hover:bg-green-50 h-8 text-xs font-bold px-6 gap-1.5",
                  showRefinePlan && "bg-green-50"
                )}
                onClick={() => setShowRefinePlan(!showRefinePlan)}
                data-testid="button-refine-plan"
              >
                Refine Plan
                <ChevronUp className={cn("w-3.5 h-3.5 transition-transform duration-200", showRefinePlan && "rotate-180")} />
              </Button>
              <Button 
                className="bg-[#00802b] hover:bg-[#006622] text-white h-8 text-xs font-bold px-6 shadow-sm gap-1.5"
                onClick={handleLaunch}
                data-testid="button-start-research"
              >
                <Search className="w-3.5 h-3.5" /> Launch Research
              </Button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Version History Panel */}
      <AnimatePresence>
        {showVersionHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="w-full bg-white border border-gray-200 rounded-md shadow-sm p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-800">Plan Version History</h4>
                <button onClick={() => setShowVersionHistory(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {Array.from({ length: totalVersions }, (_, i) => i + 1).reverse().map((v) => (
                  <div 
                    key={v}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-sm border cursor-pointer transition-colors",
                      v === planVersion 
                        ? "border-[#008DA8] bg-blue-50/50" 
                        : "border-gray-100 hover:bg-gray-50"
                    )}
                    onClick={() => {
                      setPlanVersion(v);
                      setShowVersionHistory(false);
                    }}
                    data-testid={`card-version-${v}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "text-xs font-bold",
                        v === planVersion ? "text-[#008DA8]" : "text-gray-600"
                      )}>
                        Version {v}
                      </span>
                      {v === planVersion && (
                        <span className="text-[10px] font-medium text-[#008DA8] bg-blue-100 px-1.5 py-0.5 rounded-sm">Current</span>
                      )}
                      {v === 1 && (
                        <span className="text-[10px] font-medium text-green-700 bg-green-100 px-1.5 py-0.5 rounded-sm">Active</span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400">12 steps</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Queue Status Block */}
      <Card className="p-0 border-gray-200 shadow-sm" data-testid="card-queue-status">
        <div className="p-5 space-y-4 bg-[#a19999b8]">
          <div className="flex items-center gap-2">
            <Hourglass className="w-5 h-5 text-orange-500" />
            <h4 className="text-sm font-bold text-gray-800">The task is in the queue</h4>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <p className="text-orange-500 font-medium text-[20px]">Reason: High load on Smart Search engine.</p>
              <p className="text-xs text-gray-600">
                Queue Position: <strong>#4</strong>
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[15px] text-[#a82d52]">Est. Wait<br />Time:</span>
              <div className="w-16 h-16 rounded-full border-2 border-[#008DA8] flex items-center justify-center bg-[#fc3535e3]">
                <div className="text-center">
                  <span className="text-xs font-bold text-[#008DA8] leading-tight block">1 min.</span>
                  <span className="text-xs font-bold text-[#008DA8] leading-tight block">25 sec.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center pt-1">
            <button
              className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-sm"
              onClick={() => setShowCancelQueueModal(true)}
              data-testid="button-cancel-queue"
            >
              <X className="w-5 h-5 text-white" strokeWidth={3} />
            </button>
          </div>
        </div>
      </Card>

      {/* Cancel Queue Modal */}
      <Dialog open={showCancelQueueModal} onOpenChange={setShowCancelQueueModal}>
        <DialogContent className="max-w-[420px] p-0 gap-0 bg-white overflow-hidden border border-gray-200 shadow-xl rounded-md">
          <div className="flex items-center gap-2 p-3 border-b border-gray-100 bg-red-50">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="text-base font-bold text-gray-900">Cancel Research</h2>
          </div>
          <div className="p-5 space-y-4">
            <p className="text-sm font-medium text-gray-800">
              Are you sure you want to cancel this research task?
            </p>
            <p className="text-sm text-red-500 font-medium leading-relaxed">
              The task will be removed from the queue and all progress will be permanently discarded. This action cannot be undone.
            </p>
            <div className="flex items-center justify-between pt-4">
              <button
                className="text-xs font-medium text-gray-900 underline hover:text-gray-700"
                onClick={() => setShowCancelQueueModal(false)}
                data-testid="button-cancel-queue-dismiss"
              >
                Cancel
              </button>
              <Button
                variant="outline"
                className="border-red-400 text-red-500 hover:bg-red-50 hover:text-red-600 h-9 px-6 text-xs font-bold bg-white"
                onClick={() => {
                  setShowCancelQueueModal(false);
                  setLocation("/research-canceled/1");
                }}
                data-testid="button-confirm-cancel-queue"
              >
                Yes, Cancel Research
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Files Modal */}
      <AddFilesModal open={isAddFileModalOpen} onOpenChange={setIsAddFileModalOpen} onSave={(newFiles) => {
        if (addFileContext === "step2") {
          setStep2ModalFiles(prev => [...prev, ...newFiles]);
        } else {
          setModalFiles(prev => [...prev, ...newFiles]);
        }
      }} />

      {/* Confirm Exit Modal */}
      <Dialog open={!!confirmExitStep} onOpenChange={(open) => !open && setConfirmExitStep(null)}>
        <DialogContent className="max-w-[400px] p-0 gap-0 bg-white overflow-hidden border border-gray-200 shadow-xl rounded-md data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-1/2 data-[state=open]:zoom-in-90 duration-300">
          <div className="flex items-center justify-between p-3 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">Confirm</h2>
          </div>
          
          <div className="p-5 space-y-4">
            <p className="text-sm font-medium text-gray-800">
              Return to step "{confirmExitStep}"?
            </p>
            
            <p className="text-sm text-[#0097B2] font-medium leading-relaxed">
              Your progress on the current step (e.g., your Research Plan and all 5 versions) will be lost. You will need to generate it again.
            </p>
            
            <div className="flex items-center justify-between pt-4">
              <button 
                className="text-xs font-medium text-gray-900 underline hover:text-gray-700"
                onClick={() => setConfirmExitStep(null)}
              >
                Cancel (Stay here)
              </button>
              
              <Button 
                variant="outline"
                className="border-[#D4A373] text-[#D4A373] hover:bg-[#FFF8F0] hover:text-[#C59262] h-9 px-6 text-xs font-bold bg-white"
                onClick={() => {
                   const stepMap: Record<string, number> = {
                     "Launcher": 0,
                     "Step #1": 1,
                     "Step #2": 2,
                   };
                   const targetStep = confirmExitStep ? stepMap[confirmExitStep] ?? 0 : 0;
                   setVisibleStep(targetStep);
                   setConfirmExitStep(null);
                }}
              >
                Yes, Go Back
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Version Modal */}
      <Dialog open={confirmDeleteVersion} onOpenChange={(open) => !open && setConfirmDeleteVersion(false)}>
        <DialogContent className="max-w-[400px] p-0 gap-0 bg-white overflow-hidden border border-gray-200 shadow-xl rounded-md">
          <div className="flex items-center justify-between p-3 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">Confirm Deletion</h2>
          </div>
          
          <div className="p-5 space-y-4">
            <p className="text-sm font-medium text-gray-800">
              Are you sure you want to delete Version {planVersion}?
            </p>
            
            <p className="text-sm text-[#0097B2] font-medium leading-relaxed">
              This version of the research plan will be permanently removed. This action cannot be undone.
            </p>
            
            <div className="flex items-center justify-between pt-4">
              <button 
                className="text-xs font-medium text-gray-900 underline hover:text-gray-700"
                onClick={() => setConfirmDeleteVersion(false)}
                data-testid="button-cancel-delete-version"
              >
                Cancel
              </button>
              
              <Button 
                variant="outline"
                className="border-red-400 text-red-500 hover:bg-red-50 hover:text-red-600 h-9 px-6 text-xs font-bold bg-white"
                onClick={() => {
                  const newTotal = totalVersions - 1;
                  setTotalVersions(newTotal);
                  if (planVersion > newTotal) {
                    setPlanVersion(newTotal);
                  }
                  setConfirmDeleteVersion(false);
                }}
                data-testid="button-confirm-delete-version"
              >
                Yes, Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete File Modal */}
      <Dialog open={!!confirmDeleteFile} onOpenChange={(open) => !open && setConfirmDeleteFile(null)}>
        <DialogContent className="max-w-[400px] p-0 gap-0 bg-white overflow-hidden border border-gray-200 shadow-xl rounded-md">
          <div className="flex items-center justify-between p-3 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">Confirm Deletion</h2>
          </div>
          
          <div className="p-5 space-y-4">
            <p className="text-sm font-medium text-gray-800">
              {confirmDeleteFile?.type === "all"
                ? "Are you sure you want to delete all attached files?"
                : `Are you sure you want to delete "${confirmDeleteFile?.type === "single" && attachedFiles[confirmDeleteFile.index]?.name}"?`}
            </p>
            
            <p className="text-sm text-[#0097B2] font-medium leading-relaxed">
              {confirmDeleteFile?.type === "all"
                ? "This will remove all files from this research project. This action cannot be undone."
                : "This file will be removed from the research project. This action cannot be undone."}
            </p>
            
            <div className="flex items-center justify-between pt-4">
              <button 
                className="text-xs font-medium text-gray-900 underline hover:text-gray-700"
                onClick={() => setConfirmDeleteFile(null)}
                data-testid="button-cancel-delete"
              >
                Cancel
              </button>
              
              <Button 
                variant="outline"
                className="border-red-400 text-red-500 hover:bg-red-50 hover:text-red-600 h-9 px-6 text-xs font-bold bg-white"
                onClick={() => {
                  if (confirmDeleteFile?.type === "all") {
                    setAttachedFiles([]);
                  } else if (confirmDeleteFile?.type === "single") {
                    const idx = confirmDeleteFile.index;
                    setAttachedFiles(prev => prev.filter((_, i) => i !== idx));
                  }
                  setConfirmDeleteFile(null);
                }}
                data-testid="button-confirm-delete"
              >
                Yes, Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
    </div>
  );
}
