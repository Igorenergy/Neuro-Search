import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  Upload, 
  FileText, 
  Globe, 
  Database, 
  Mic, 
  ChevronDown, 
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
  Lightbulb
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
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function Launcher() {
  const [, setLocation] = useLocation();
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

  // Cost calculation
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
    setTimeout(() => {
      setLocation("/research/dashboard");
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
        <div className="flex justify-end px-3 py-1">
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
                 "min-h-[160px] text-lg p-4 resize-none bg-white border-2 border-yellow-400 focus-visible:ring-0 focus-visible:border-yellow-500 rounded-md shadow-sm placeholder:text-gray-400 w-full",
                 !query && isLaunching && "animate-shake"
               )}
               value={query}
               onChange={(e) => setQuery(e.target.value)}
             />
          </div>

          {/* File Previews Row */}
          {(files.length > 0 || isScanning) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 px-1">
              {files.map((file, i) => (
                <div key={i} className="flex items-center justify-between bg-[#9E9E9E] text-white px-3 py-2 rounded-md shadow-sm relative overflow-hidden group">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-5 h-5 text-white shrink-0" strokeWidth={1.5} />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-medium leading-tight">File Preview (name,</span>
                      <span className="text-[10px] font-medium leading-tight">type, etc.)</span>
                    </div>
                  </div>
                  <button onClick={() => removeFile(i)} className="text-red-600 hover:text-red-700 ml-1 shrink-0">
                    <X className="w-6 h-6 stroke-[3]" />
                  </button>
                </div>
              ))}
              
              {/* Mock previews to match image if no files uploaded yet for demo */}
              {files.length === 0 && (
                <>
                  {[1, 2, 3, 4].map((_, i) => (
                    <div key={i} className="flex items-center justify-between bg-[#9E9E9E] text-white px-3 py-2 rounded-md shadow-sm relative overflow-hidden">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-5 h-5 text-white shrink-0" strokeWidth={1.5} />
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] font-medium leading-tight">File Preview (name,</span>
                          <span className="text-[10px] font-medium leading-tight">type, etc.)</span>
                        </div>
                      </div>
                      <button className="text-red-600 hover:text-red-700 ml-1 shrink-0">
                        <X className="w-6 h-6 stroke-[3]" />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* Controls Footer */}
          <div className="flex flex-wrap items-center gap-4 mt-4 px-2 pb-2">
             
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
                  onClick={() => fileInputRef.current?.click()}
                >
                  selected: {files.length > 0 ? files.length : 4}
                </button>
                <button className="text-red-600 hover:text-red-700">
                  <XCircle className="w-6 h-6 fill-white" />
                </button>
             </div>

             <button className="text-green-600 hover:text-green-700 mx-2">
               <RotateCw className="w-6 h-6 stroke-[2.5]" />
             </button>
             
             <Button 
               className="bg-[#D0D0D0] hover:bg-[#C0C0C0] text-black border border-gray-400 font-medium px-8 h-9 shadow-sm mx-auto"
             >
               Send Request
             </Button>

             <div className="flex items-center gap-2 ml-auto">
               <Switch 
                 checked={showReasoning} 
                 onCheckedChange={setShowReasoning}
                 className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
               />
               <span className="text-xs font-bold text-black">Show Steps' Reasoning</span>
               <Info className="w-4 h-4 text-black fill-black" />
             </div>

          </div>

        </div>
      </div>

      {/* Step 1: Questionnaire (Dark Header Theme) */}
      <div className="w-full bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden font-sans">
        {/* Step Header */}
        <div className="flex border-b border-gray-200 bg-[#5A6B7C] min-h-[34px]">
          <button className="flex items-center gap-1 px-4 py-2 bg-[#F0F2F5] text-[#5A6B7C] hover:bg-white text-xs font-bold border-r border-gray-300">
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

          {/* Question */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="bg-[#008DA8] text-white w-6 h-6 flex items-center justify-center rounded-sm text-xs font-bold shrink-0 mt-0.5">1</div>
              <p className="text-sm font-medium text-gray-800">
                <span className="font-bold">Geographic Scope.</span> Should we focus only on founders in Ukraine or include the diaspora abroad?
              </p>
            </div>

            {/* Answer Input */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-gray-600 px-1">
                <span>Your answers</span>
                <span>{questionAnswer.length}/500</span>
              </div>
              <Textarea 
                value={questionAnswer}
                onChange={(e) => setQuestionAnswer(e.target.value)}
                placeholder="Answers to the question"
                className="bg-white border-gray-300 placeholder:text-gray-400 text-gray-800 min-h-[60px] resize-none focus-visible:ring-[#008DA8]"
              />
            </div>

            {/* Selection Pills */}
            <div className="flex flex-wrap gap-2">
              <button 
                className={cn(
                  "px-3 py-1 text-xs font-medium border rounded-sm flex items-center gap-1 transition-colors",
                  geoScope === "global" 
                    ? "bg-blue-100 border-blue-200 text-blue-800 shadow-inner" 
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                )}
                onClick={() => setGeoScope("global")}
              >
                <Globe className="w-3 h-3" /> Global
              </button>
              <button 
                className={cn(
                  "px-3 py-1 text-xs font-medium border rounded-sm transition-colors",
                  geoScope === "ukraine" 
                    ? "bg-blue-100 border-blue-200 text-blue-800 shadow-inner" 
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                )}
                onClick={() => setGeoScope("ukraine")}
              >
                [ UA Ukraine Only ]
              </button>
              <button 
                className={cn(
                  "px-3 py-1 text-xs font-medium border rounded-sm transition-colors",
                  geoScope === "eu" 
                    ? "bg-blue-100 border-blue-200 text-blue-800 shadow-inner" 
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                )}
                onClick={() => setGeoScope("eu")}
              >
                [ EU EU ]
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <Button 
                variant="outline" 
                className="bg-white text-[#008DA8] border-[#008DA8] hover:bg-blue-50 h-8 text-xs font-bold px-6"
              >
                Next Question (2/5)
              </Button>
              
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
      
      {/* Configuration Accordion - Now Step 2 (Dark Header Theme) */}
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div>
          <div className="px-0 py-0 bg-white">
            <div className="w-full flex border-b border-gray-200 font-sans bg-[#5A6B7C] min-h-[34px]">
              <div className="flex items-center gap-1 px-4 py-2 bg-[#F0F2F5] text-[#5A6B7C] hover:bg-white text-xs font-bold border-r border-gray-300">
                <ArrowLeft className="w-3 h-3" /> Prev. step
              </div>
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
                 <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    SOURCES:
                    <div className="flex items-center bg-gray-100 rounded-md p-1 ml-2">
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         className={cn(
                           "h-6 text-xs px-3 rounded-sm",
                           scope !== "assets" ? "bg-white text-[#008DA8] shadow-sm" : "text-gray-500 hover:text-gray-900"
                         )}
                         onClick={() => setScope("web")}
                       >
                         Web Network
                       </Button>
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         className={cn(
                           "h-6 text-xs px-3 rounded-sm",
                           scope === "assets" ? "bg-white text-[#008DA8] shadow-sm" : "text-gray-500 hover:text-gray-900"
                         )}
                         onClick={() => setScope("assets")}
                       >
                         Local Documents
                       </Button>
                    </div>
                 </div>
                 
                 <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/30 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                       <Globe className="w-4 h-4 text-gray-500" />
                       <span className="text-sm font-bold text-gray-800">Web Pages & Websites: <span className="text-gray-400 font-normal">All</span></span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                            Search Language <Info className="w-3 h-3 text-gray-400" />
                          </label>
                          <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger className="h-9 bg-white border-gray-300">
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="auto">Auto Detect</SelectItem>
                              <SelectItem value="en">English (US)</SelectItem>
                              <SelectItem value="ru">Russian</SelectItem>
                              <SelectItem value="uk">Ukrainian</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex gap-2 mt-2">
                             <Badge variant="secondary" className="bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-sm font-normal text-xs gap-1 pr-1">
                               Ua <X className="w-3 h-3" />
                             </Badge>
                             <Badge variant="secondary" className="bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-sm font-normal text-xs gap-1 pr-1">
                               Ru <X className="w-3 h-3" />
                             </Badge>
                          </div>
                       </div>
                       
                       <div className="space-y-2 relative">
                          <div className="absolute inset-0 bg-gray-50/50 backdrop-blur-[1px] flex items-center justify-center border border-gray-200 border-dashed rounded-md">
                             <span className="text-xs text-gray-400 font-medium">OTHER SETTINGS</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-bold text-gray-700">Data Engine</span>
                       <Info className="w-3.5 h-3.5 text-gray-400" />
                       <Select defaultValue="ultimate">
                          <SelectTrigger className="h-8 w-[140px] bg-white border-gray-300 text-xs font-bold">
                             <div className="flex items-center gap-1.5">
                                <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                <span>Ultimate</span>
                             </div>
                          </SelectTrigger>
                          <SelectContent>
                             <SelectItem value="ultimate">Ultimate</SelectItem>
                             <SelectItem value="pro">Pro</SelectItem>
                             <SelectItem value="fast">Fast</SelectItem>
                          </SelectContent>
                       </Select>
                       <span className="text-xs text-[#008DA8] ml-2">Reduces wait time by ~50%. Good for quick insights.</span>
                    </div>
                 </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
                 <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-900">
                    <ArrowRight className="w-5 h-5 rotate-180" />
                 </Button>
                 
                 <div className="flex items-center gap-4">
                    <div className="text-right">
                       <span className="text-xs text-gray-500 font-medium mr-2">Estimated Cost:</span>
                       <span className="text-sm font-bold text-[#008DA8]">${totalCost.toFixed(2)} - ${(totalCost * 1.2).toFixed(2)}</span>
                    </div>
                    <Button className="bg-[#008DA8] hover:bg-[#007A92] text-white font-bold px-6 shadow-md">
                       Create a plan
                    </Button>
                 </div>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
    </div>
  );
}
