import { useState, useRef } from "react";
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
  Check
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

  // Cost calculation
  const baseCost = 0.45;
  const deepCrawlCost = deepCrawlEnabled ? 0.50 : 0;
  const totalCost = baseCost + deepCrawlCost;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles([file]);
      
      // Simulate scanning
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
        setDeepLinksFound(true); // Mock finding links
      }, 1500);
    }
  };

  const handleLaunch = () => {
    if (!query) return;
    setIsLaunching(true);
    setTimeout(() => {
      setLocation("/research/dashboard");
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">New Smart Search Operation</h1>
        <p className="text-muted-foreground">Define your research parameters and let the agent swarm execute.</p>
      </div>

      {/* Main Input Card */}
      <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-0">
          
          {/* Omni-Input */}
          <div className="p-6 space-y-4">
            <div className="relative">
              <Textarea 
                placeholder="Describe your research goal (e.g., 'Find all Series A SaaS startups in Berlin focusing on AI')..." 
                className={cn(
                  "min-h-[120px] text-lg p-4 resize-none bg-transparent border-border focus:border-primary/50 focus:ring-primary/20 transition-all",
                  !query && isLaunching && "animate-shake border-destructive"
                )}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute bottom-3 right-3 text-muted-foreground hover:text-primary"
              >
                <Mic className="w-5 h-5" />
              </Button>
            </div>

            {/* Scope Toggles */}
            <div className="flex flex-wrap gap-2">
              <ScopeToggle 
                active={scope === "web"} 
                onClick={() => setScope("web")} 
                icon={Globe} 
                label="Global Web" 
              />
              <ScopeToggle 
                active={scope === "assets"} 
                onClick={() => setScope("assets")} 
                icon={Database} 
                label="Assets Repository" 
              />
              <ScopeToggle 
                active={scope === "hybrid"} 
                onClick={() => setScope("hybrid")} 
                icon={Zap} 
                label="Hybrid Mode" 
              />
            </div>
          </div>

          {/* Contextual File Uploader */}
          <div className="border-t border-border/50 bg-muted/20 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <h3 className="text-sm font-medium flex items-center gap-2">
                   <FileText className="w-4 h-4 text-primary" />
                   Context Files
                 </h3>
                 <span className="text-xs text-muted-foreground">Optional</span>
              </div>
              
              {!files.length ? (
                <div className="border-2 border-dashed border-border/60 rounded-lg p-8 text-center hover:bg-muted/30 transition-colors relative">
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={handleFileUpload}
                  />
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Upload className="w-8 h-8 opacity-50" />
                    <p className="text-sm">Drop files here to ground the AI in your specific context.</p>
                    <p className="text-xs opacity-50">PDF, DOCX, TXT</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-background border border-border rounded-md">
                    <div className="p-2 bg-primary/10 text-primary rounded">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{files[0].name}</p>
                      <p className="text-xs text-muted-foreground">{(files[0].size / 1024).toFixed(0)} KB</p>
                    </div>
                    {isScanning ? (
                      <div className="flex items-center gap-2 text-xs text-primary animate-pulse">
                        Scanning...
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => { setFiles([]); setDeepLinksFound(false); }}>
                        Remove
                      </Button>
                    )}
                  </div>

                  {/* Deep Link Reveal */}
                  <AnimatePresence>
                    {deepLinksFound && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="bg-primary/5 border border-primary/20 rounded-md p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h4 className="text-sm font-medium text-primary flex items-center gap-2">
                              <LinkIcon className="w-4 h-4" />
                              Deep Linked Research
                            </h4>
                            <p className="text-xs text-muted-foreground max-w-[80%]">
                              We found <span className="font-bold text-foreground">12 external sources</span> in your document. 
                              Enable deep crawling to include these in the analysis?
                            </p>
                          </div>
                          <Switch checked={deepCrawlEnabled} onCheckedChange={setDeepCrawlEnabled} />
                        </div>
                        {deepCrawlEnabled && (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                            + $0.50 estimated cost
                          </Badge>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Advanced Config */}
          <div className="border-t border-border/50 bg-background/50">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="advanced" className="border-b-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/10">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Settings2 className="w-4 h-4" />
                    Advanced Parameters
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <label>Research Depth</label>
                        <span className="text-muted-foreground">Comprehensive</span>
                      </div>
                      <Slider defaultValue={[75]} max={100} step={1} className="w-full" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Fast (Surface)</span>
                        <span>Deep (Reasoning)</span>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

        </CardContent>
      </Card>

      {/* Sticky Footer */}
      <div className="sticky bottom-4 z-10">
        <div className="bg-background/80 backdrop-blur-xl border border-border rounded-xl p-4 shadow-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 px-2">
            <div>
               <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Est. Time</p>
               <p className="font-mono font-medium">2-4 min</p>
            </div>
            <div className="h-8 w-px bg-border"></div>
            <div>
               <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Est. Cost</p>
               <div className="flex items-baseline gap-1">
                 <p className="font-mono font-medium text-lg">${totalCost.toFixed(2)}</p>
                 {deepCrawlEnabled && <span className="text-xs text-primary animate-pulse">(Adjusted)</span>}
               </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" disabled={isLaunching}>Save Draft</Button>
            <Button 
              size="lg" 
              className={cn(
                "min-w-[160px] bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow-lg shadow-primary/20 transition-all",
                isLaunching && "opacity-90 cursor-wait"
              )}
              onClick={handleLaunch}
              disabled={isLaunching}
            >
              {isLaunching ? "Initializing..." : "Launch Operation"}
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
}

function ScopeToggle({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border",
        active 
          ? "bg-primary/10 border-primary text-primary shadow-sm" 
          : "bg-transparent border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
