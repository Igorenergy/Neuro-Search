"use client";

import { useState, useRef, useCallback } from "react";
import {
  X,
  ChevronDown,
  Upload,
  Globe,
  FileText,
  Link as LinkIcon,
  Plus,
  Trash2,
  AlertTriangle,
  Info,
  Settings2,
  Database,
  Zap,
  Check,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateProjectModal({ open, onOpenChange }: CreateProjectModalProps) {
  const [step, setStep] = useState(1);

  // Step 1 state
  const [prompt, setPrompt] = useState("");
  const [llmModel, setLlmModel] = useState("auto");

  // Step 2 state (Web Search)
  const [aiAgentEnabled, setAiAgentEnabled] = useState(true);
  const [dataEngine, setDataEngine] = useState("ultimate");
  const [searchLanguage, setSearchLanguage] = useState("auto");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["Ua", "Ru"]);
  const [scrapingEnabled, setScrapingEnabled] = useState(true);
  const [urls, setUrls] = useState<string[]>([""]);
  const [extractionEngine, setExtractionEngine] = useState("deep-extract");
  const [budgetCap, setBudgetCap] = useState(true);

  // Step 3 state (Files)
  const [sourceFilesEnabled, setSourceFilesEnabled] = useState(true);
  const [uploadSource, setUploadSource] = useState<"upload" | "gdrive" | "repo">("upload");
  const [ocrEnabled, setOcrEnabled] = useState(true);
  const [saveToRepo, setSaveToRepo] = useState(true);
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2/3 tab
  const [sourceTab, setSourceTab] = useState<"web" | "files">("web");

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(1);
      setPrompt("");
      setSourceTab("web");
    }, 300);
  };

  const handleSendRequest = () => {
    if (!prompt.trim()) return;
    setStep(2);
  };

  const handleApplyContinue = () => {
    setSourceTab("files");
  };

  const handleAddApply = () => {
    handleClose();
  };

  const addUrl = () => {
    if (urls.length < 50) setUrls([...urls, ""]);
  };

  const removeUrl = (idx: number) => {
    setUrls(urls.filter((_, i) => i !== idx));
  };

  const updateUrl = (idx: number, val: string) => {
    const next = [...urls];
    next[idx] = val;
    setUrls(next);
  };

  const removeLanguage = (lang: string) => {
    setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setDroppedFiles(prev => [...prev, ...files]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDroppedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const isUrlInvalid = (url: string) => {
    if (!url.trim()) return false;
    try {
      new URL(url.startsWith("http") ? url : `https://${url}`);
      return false;
    } catch {
      return !url.includes(".");
    }
  };

  const getDataEngineIcon = (engine: string) => {
    switch (engine) {
      case "fast": return <Zap className="w-3.5 h-3.5" />;
      case "pro": return <Database className="w-3.5 h-3.5" />;
      case "ultimate": return <Settings2 className="w-3.5 h-3.5" />;
      default: return <Settings2 className="w-3.5 h-3.5" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] bg-white border-gray-200 p-0 gap-0 overflow-hidden rounded-lg [&>button]:hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white shrink-0">
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button
                onClick={() => { if (sourceTab === "files") setSourceTab("web"); else setStep(1); }}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-gray-600" />
              </button>
            )}
            <DialogTitle className="text-base font-bold text-gray-900">
              {step === 1 ? "Create New Project" : "Select/Add sources"}
            </DialogTitle>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 flex items-center justify-center bg-black rounded-[2px] hover:bg-gray-800 transition-colors"
          >
            <span className="text-white text-sm font-bold leading-none">&#x2715;</span>
          </button>
        </div>

        {/* Step 1: Prompt */}
        {step === 1 && (
          <div className="p-5 space-y-4 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-gray-700">Prompt</label>
                <span className="text-xs text-gray-400">{prompt.length}/3000</span>
              </div>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value.slice(0, 3000))}
                placeholder="Describe your research task..."
                className="min-h-[180px] resize-none border border-gray-300 focus:border-[#008DA8] rounded-md text-sm bg-white text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">LLM</span>
                <Select value={llmModel} onValueChange={setLlmModel}>
                  <SelectTrigger className="w-[140px] h-8 text-xs border-gray-300 bg-white text-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="auto">
                      <span className="flex items-center gap-1.5">✨ Auto (best)</span>
                    </SelectItem>
                    <SelectItem value="gpt4o">ChatGPT-4o ($$$)</SelectItem>
                    <SelectItem value="gemini">Gemini 3.0 Pro ($$)</SelectItem>
                    <SelectItem value="deepseek">DeepSeek R1 ($)</SelectItem>
                    <SelectItem value="llama">Llama 3 ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>

            <Button
              onClick={handleSendRequest}
              disabled={!prompt.trim()}
              className="w-full bg-[#00802b] hover:bg-[#006622] text-white font-bold h-10 rounded-md disabled:opacity-50"
            >
              Send Request
            </Button>
          </div>
        )}

        {/* Step 2: Select/Add Sources */}
        {step === 2 && (
          <div className="flex flex-col overflow-hidden">
            {/* Prompt preview */}
            <div className="px-5 pt-4 pb-2 shrink-0">
              <div className="flex items-start gap-2">
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 flex-1">
                  {prompt}
                </p>
                <button className="shrink-0 w-6 h-6 rounded-full bg-[#008DA8] flex items-center justify-center">
                  <ChevronDown className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>

            {/* Source tabs */}
            <div className="px-5 pb-3 shrink-0">
              <div className="flex items-center gap-1 text-xs font-semibold">
                <span className="text-gray-500 mr-1">SOURCE</span>
                <button
                  onClick={() => setSourceTab("web")}
                  className={cn(
                    "px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5",
                    sourceTab === "web"
                      ? "bg-[#008DA8] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  <Globe className="w-3 h-3" /> WEB SEARCH
                </button>
                <button
                  onClick={() => setSourceTab("files")}
                  className={cn(
                    "px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5",
                    sourceTab === "files"
                      ? "bg-[#008DA8] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  <FileText className="w-3 h-3" /> FILES
                </button>
              </div>
            </div>

            {/* Web Search content */}
            {sourceTab === "web" && (
              <div className="px-5 pb-5 space-y-4 max-h-[420px] overflow-y-auto">
                {/* AI Autonomous Agent */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch checked={aiAgentEnabled} onCheckedChange={setAiAgentEnabled} className="data-[state=checked]:bg-[#008DA8]" />
                      <span className="text-sm font-bold text-gray-800">AI Autonomous Agent</span>
                      <span className="text-xs text-[#008DA8] font-medium">(Recommended)</span>
                    </div>
                  </div>

                  {aiAgentEnabled && (
                    <div className="pl-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-gray-600">Data Engine</span>
                          <Info className="w-3 h-3 text-gray-400" />
                        </div>
                        <Select value={dataEngine} onValueChange={setDataEngine}>
                          <SelectTrigger className="w-[160px] h-7 text-xs border-gray-300 bg-white text-gray-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="fast">
                              <span className="flex items-center gap-1.5"><Zap className="w-3 h-3" /> Fast</span>
                            </SelectItem>
                            <SelectItem value="pro">
                              <span className="flex items-center gap-1.5"><Database className="w-3 h-3" /> Pro</span>
                            </SelectItem>
                            <SelectItem value="ultimate">
                              <span className="flex items-center gap-1.5"><Settings2 className="w-3 h-3" /> Ultimate</span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-[10px] text-gray-400 leading-tight">
                          Reduces wait time by ~50%. Good for quick insights.
                        </span>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-gray-600">Search Language</span>
                          <Info className="w-3 h-3 text-gray-400" />
                        </div>
                        <Select value={searchLanguage} onValueChange={setSearchLanguage}>
                          <SelectTrigger className="w-[130px] h-7 text-xs border-gray-300 bg-white text-gray-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="auto">Auto Detect</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="ua">Ukrainian</SelectItem>
                            <SelectItem value="ru">Russian</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex items-center gap-1">
                          {selectedLanguages.map(lang => (
                            <Badge key={lang} variant="secondary" className="text-[10px] h-5 px-1.5 gap-0.5 bg-[#008DA8] text-white hover:bg-[#007590]">
                              {lang}
                              <button onClick={() => removeLanguage(lang)}>
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200" />

                {/* Specific Web Pages Scraping */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch checked={scrapingEnabled} onCheckedChange={setScrapingEnabled} className="data-[state=checked]:bg-[#008DA8]" />
                      <span className="text-sm font-bold text-gray-800">Specific Web Pages Scraping</span>
                    </div>
                  </div>

                  {scrapingEnabled && (
                    <div className="pl-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Upload className="w-3 h-3" /> Import
                        </div>
                        <span className="text-[10px] text-gray-400">{urls.filter(u => u.trim()).length} / 50 URLs</span>
                      </div>

                      {urls.map((url, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <input
                            value={url}
                            onChange={(e) => updateUrl(i, e.target.value)}
                            placeholder="nasa.gov/.../article-name"
                            className={cn(
                              "flex-1 h-7 px-2 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-[#008DA8] bg-white text-gray-900 placeholder:text-gray-400",
                              isUrlInvalid(url) ? "border-red-400 bg-red-50" : "border-gray-300"
                            )}
                          />
                          {url.trim() && (
                            <button onClick={() => removeUrl(i)} className="text-red-400 hover:text-red-600">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}

                      {urls.some(u => isUrlInvalid(u)) && (
                        <div className="flex items-center gap-1 text-[10px] text-amber-600">
                          <AlertTriangle className="w-3 h-3" />
                          Invalid URL format detected. Please remove text that isn't a link or domain.
                        </div>
                      )}

                      <div className="flex items-center gap-3 pt-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-gray-600">Extraction Engine</span>
                          <Info className="w-3 h-3 text-gray-400" />
                        </div>
                        <Select value={extractionEngine} onValueChange={setExtractionEngine}>
                          <SelectTrigger className="w-[150px] h-7 text-xs border-gray-300 bg-white text-gray-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="deep-extract">
                              <span className="flex items-center gap-1.5">🔮 Deep Extract</span>
                            </SelectItem>
                            <SelectItem value="basic">Basic</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-[10px] text-gray-400">Full parsing: text, tables, images, metadata</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-gray-800">Total Cost: $12.34</span>
                    <div className="flex items-center gap-1.5">
                      <Switch checked={budgetCap} onCheckedChange={setBudgetCap} className="data-[state=checked]:bg-[#008DA8]" />
                      <span className="text-xs text-gray-600">Strict Budget Cap</span>
                      <Info className="w-3 h-3 text-gray-400" />
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7a6 6 0 1012 0A6 6 0 001 7z" stroke="currentColor" strokeWidth="1.5"/><path d="M10.5 3.5l-7 7M3.5 3.5l7 7" stroke="currentColor" strokeWidth="1.5"/></svg>
                    </button>
                  </div>
                  <Button
                    onClick={handleApplyContinue}
                    className="bg-[#008DA8] hover:bg-[#007590] text-white font-bold h-9 px-5 text-sm rounded-md"
                  >
                    Apply & Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Files content */}
            {sourceTab === "files" && (
              <div className="px-5 pb-5 space-y-4 max-h-[420px] overflow-y-auto">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch checked={sourceFilesEnabled} onCheckedChange={setSourceFilesEnabled} className="data-[state=checked]:bg-[#008DA8]" />
                      <span className="text-sm font-bold text-gray-800">Source Files</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Context capacity</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-[20%] h-full bg-[#008DA8] rounded-full" />
                      </div>
                      <span className="text-[#008DA8] font-medium">Usage: 20%</span>
                    </div>
                  </div>

                  {sourceFilesEnabled && (
                    <div className="space-y-3">
                      {/* Upload source selector */}
                      <div className="flex items-center gap-4 text-xs">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="upload-source"
                            checked={uploadSource === "upload"}
                            onChange={() => setUploadSource("upload")}
                            className="accent-[#008DA8]"
                          />
                          <span className={cn("font-medium", uploadSource === "upload" ? "text-gray-800" : "text-gray-500")}>Upload new</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="upload-source"
                            checked={uploadSource === "gdrive"}
                            onChange={() => setUploadSource("gdrive")}
                            className="accent-[#008DA8]"
                          />
                          <span className={cn("font-medium", uploadSource === "gdrive" ? "text-gray-800" : "text-gray-500")}>
                            From <span className="text-[#008DA8]">G. Drive</span>
                          </span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="upload-source"
                            checked={uploadSource === "repo"}
                            onChange={() => setUploadSource("repo")}
                            className="accent-[#008DA8]"
                          />
                          <span className={cn("font-medium", uploadSource === "repo" ? "text-gray-800" : "text-gray-500")}>
                            From <span className="text-[#008DA8]">Data Repository (100)</span>
                          </span>
                        </label>
                      </div>

                      {/* Drop zone */}
                      <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                          "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors min-h-[140px] bg-white",
                          isDragging ? "border-[#008DA8] bg-[#e6f7fa]" : "border-gray-300 hover:border-gray-400"
                        )}
                      >
                        <Upload className="w-8 h-8 text-gray-300 mb-2" />
                        <p className="text-xs text-gray-500 mb-1">Загрузите источники</p>
                        <p className="text-xs text-[#008DA8]">Выберите файл или перетащите его сюда.</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                        {droppedFiles.length > 0 && (
                          <div className="mt-3 space-y-1 w-full">
                            {droppedFiles.map((f, i) => (
                              <div key={i} className="flex items-center justify-between bg-gray-50 rounded px-2 py-1">
                                <span className="text-xs text-gray-700 truncate">{f.name}</span>
                                <button onClick={(e) => { e.stopPropagation(); setDroppedFiles(prev => prev.filter((_, idx) => idx !== i)); }}>
                                  <X className="w-3 h-3 text-gray-400" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                        Поддерживаемые типы файлов: PDF, txt, Markdown, аудио (например, MP3-файлы),
                        <br />.docx, .avif, .bmp, .gif, .ico, .jp2, .png, .webp, .tif, .tiff, .heic, .heif, .jpeg, .jpg, .jpe.
                      </p>

                      {/* Warnings & toggles */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[10px] text-amber-600">
                          <AlertTriangle className="w-3 h-3" />
                          Warning: Embedded Images Found
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Switch checked={ocrEnabled} onCheckedChange={setOcrEnabled} className="data-[state=checked]:bg-[#008DA8]" />
                          <span className="text-xs text-gray-600">Content Recognition (OCR)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs">
                      <input
                        type="checkbox"
                        checked={saveToRepo}
                        onChange={(e) => setSaveToRepo(e.target.checked)}
                        className="accent-[#008DA8] w-3.5 h-3.5"
                      />
                      <span className="text-gray-600">Save uploaded files to Data Repository</span>
                    </label>
                    <button className="text-xs text-[#008DA8] font-medium hover:underline">CANCEL</button>
                  </div>
                  <Button
                    onClick={handleAddApply}
                    className="bg-[#008DA8] hover:bg-[#007590] text-white font-bold h-9 px-5 text-sm rounded-md"
                  >
                    Add & Apply
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
