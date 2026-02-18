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
  Play
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
    <div className="max-w-[900px] mx-auto py-6 px-4 space-y-6 font-sans text-gray-800 animate-in fade-in duration-500">
      
      {/* Header & Type Selection */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-md w-fit">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "text-sm font-medium rounded-sm px-4 h-8", 
              researchType === "search" ? "bg-white text-[#008DA8] shadow-sm" : "text-gray-500 hover:text-gray-900"
            )}
            onClick={() => setResearchType("search")}
          >
            Smart Search
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "text-sm font-medium rounded-sm px-4 h-8", 
              researchType === "sheet" ? "bg-white text-[#008DA8] shadow-sm" : "text-gray-500 hover:text-gray-900"
            )}
            onClick={() => setResearchType("sheet")}
          >
            Smart Sheet
          </Button>
        </div>
        
        {/* <div className="bg-[#E8F5E9] border border-[#C8E6C9] rounded-md px-3 py-1.5 text-center flex items-center gap-2">
           <span className="text-gray-500 text-xs">Account Balance:</span>
           <span className="text-[#2E7D32] font-bold text-sm">$5,250.00</span>
        </div> */}
      </div>

      {/* Main Input Card */}
      <Card className="border-gray-200 shadow-sm bg-white overflow-hidden rounded-xl">
        <CardContent className="p-0">
          
          {/* Omni-Input Area */}
          <div className="p-1">
             <div className="relative bg-[#F9FAFB] border border-gray-200 rounded-lg m-4 transition-all focus-within:ring-2 focus-within:ring-[#008DA8]/20 focus-within:border-[#008DA8]">
                <div className="absolute top-2 right-2 text-xs font-medium text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-100 shadow-sm">
                   Account Balance: <span className="text-gray-700">$5,250.00</span>
                </div>
                
                <Textarea 
                  placeholder="Describe your research goal (e.g., 'Find all Series A SaaS startups in Berlin focusing on AI')..." 
                  className={cn(
                    "min-h-[160px] text-lg p-4 resize-none bg-transparent border-none focus-visible:ring-0 shadow-none placeholder:text-gray-400",
                    !query && isLaunching && "animate-shake"
                  )}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />

                {/* File Chips */}
                {files.length > 0 && (
                  <div className="px-4 pb-2 flex flex-wrap gap-2">
                    {files.map((file, i) => (
                      <div key={i} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-xs px-2 py-1.5 rounded-md shadow-sm">
                        <div className="bg-red-50 p-1 rounded text-red-500">
                          <FileText className="w-3 h-3" />
                        </div>
                        <span className="max-w-[120px] truncate" title={file.name}>{file.name}</span>
                        <button onClick={() => removeFile(i)} className="text-gray-400 hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {isScanning && (
                       <div className="flex items-center gap-2 text-xs text-[#008DA8] animate-pulse px-2 py-1.5">
                         <span className="w-2 h-2 rounded-full bg-[#008DA8] animate-ping" />
                         Scanning files...
                       </div>
                    )}
                  </div>
                )}
                
                {/* Input Actions Bar */}
                <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 bg-white rounded-b-lg">
                   <div className="flex items-center gap-2">
                      <input 
                        type="file" 
                        multiple 
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-100 gap-1.5"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add files
                        {files.length > 0 && <Badge variant="secondary" className="ml-1 h-4 px-1 text-[9px] min-w-[16px] justify-center">{files.length}</Badge>}
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="h-8 text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-100 gap-1.5">
                        <Mic className="w-3.5 h-3.5" />
                      </Button>
                   </div>
                   
                   <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Switch id="reasoning" className="h-4 w-7" />
                        <label htmlFor="reasoning" className="text-xs font-medium text-gray-600 cursor-pointer select-none">Show Steps / Reasoning</label>
                      </div>
                      <Button 
                        size="sm" 
                        className="h-8 bg-[#E0E0E0] text-gray-400 hover:bg-[#E0E0E0] hover:text-gray-500 cursor-not-allowed font-medium text-xs px-4"
                      >
                        Send Request
                      </Button>
                   </div>
                </div>
             </div>
          </div>

          {/* Deep Link Contextual Reveal */}
          <AnimatePresence>
            {deepLinksFound && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 pb-4"
              >
                <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600 mt-0.5">
                      <LinkIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Deep Linked Research Available</h4>
                      <p className="text-xs text-gray-600 mt-1 max-w-md">
                        We detected <span className="font-bold">12 external links</span> in your uploaded files. 
                        Enable deep crawling to verify these sources?
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                       <span className="block text-xs font-bold text-gray-900">Include Links</span>
                       <span className="block text-[10px] text-gray-500">+${deepCrawlCost.toFixed(2)} est.</span>
                    </div>
                    <Switch 
                      checked={deepCrawlEnabled} 
                      onCheckedChange={setDeepCrawlEnabled}
                      className="data-[state=checked]:bg-[#008DA8]"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </CardContent>
      </Card>
      
      {/* Configuration Accordion */}
      <Accordion type="single" collapsible defaultValue="options" className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <AccordionItem value="options" className="border-b-0">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <div className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">STEP #1</div>
              <span className="text-sm font-bold text-gray-800">Research Options</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-2">
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Launch Footer (Sticky) */}
      <div className="sticky bottom-6 z-10">
        <div className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-xl p-4 shadow-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 px-2">
            <div>
               <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Est. Time</p>
               <p className="font-mono font-bold text-gray-800 text-sm">2-4 min</p>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div>
               <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Est. Cost</p>
               <div className="flex items-baseline gap-1">
                 <p className="font-mono font-bold text-gray-800 text-sm">${totalCost.toFixed(2)}</p>
                 {deepCrawlEnabled && <span className="text-[10px] text-[#008DA8] font-medium">(Adjusted)</span>}
               </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-gray-500 font-medium" disabled={isLaunching}>Save Draft</Button>
            <Button 
              size="lg" 
              className={cn(
                "min-w-[180px] bg-gradient-to-r from-[#008DA8] to-[#006E7D] hover:from-[#007A92] hover:to-[#005a66] text-white shadow-lg shadow-cyan-900/10 transition-all font-bold",
                isLaunching && "opacity-90 cursor-wait"
              )}
              onClick={handleLaunch}
              disabled={isLaunching || !query}
            >
              {isLaunching ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Initializing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  Launch Operation
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
}
