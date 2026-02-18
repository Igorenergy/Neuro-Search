import { useState } from "react";
import { 
  Search, 
  Filter, 
  Calendar, 
  MoreHorizontal,
  ExternalLink,
  Archive,
  Copy,
  FolderOpen,
  ArrowRight,
  Shield,
  Clock,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [isSemantic, setIsSemantic] = useState(true);

  // Mock Data
  const allResults = [
    {
      id: 1,
      title: "Global Logistics Trends 2024",
      snippet: "Analysis of supply chain disruptions affecting major shipping routes. Includes data on fuel costs and geopolitical risk factors.",
      date: "Oct 12, 2023",
      status: "Completed",
      confidence: 92,
      tags: ["Logistics", "Macro"]
    },
    {
      id: 2,
      title: "SaaS Valuation Multiples Q3",
      snippet: "Comparative study of public SaaS companies vs. private market valuations. Focus on ARR multiples and NRR benchmarks.",
      date: "Sep 28, 2023",
      status: "Archived",
      confidence: 88,
      tags: ["Finance", "SaaS"]
    },
    {
      id: 3,
      title: "Generative AI in Healthcare",
      snippet: "Regulatory landscape for medical AI applications in the EU and US markets. Compliance requirements for large language models.",
      date: "Nov 05, 2023",
      status: "In Progress",
      confidence: 0,
      tags: ["AI", "Healthcare"]
    },
    {
      id: 4,
      title: "Renewable Energy Subsidies 2025",
      snippet: "Projected changes in government incentives for solar and wind projects across G7 nations.",
      date: "Aug 15, 2023",
      status: "Completed",
      confidence: 65, // Low confidence example
      tags: ["Energy", "Policy"]
    }
  ];

  // Filter logic
  const results = query.toLowerCase().includes("void") || query.toLowerCase().includes("empty") 
    ? [] 
    : allResults.filter(r => r.title.toLowerCase().includes(query.toLowerCase()) || r.snippet.toLowerCase().includes(query.toLowerCase()));

  const isEmpty = results.length === 0 && query.length > 0;

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      
      {/* Filters Sidebar */}
      <aside className="w-64 border-r border-border bg-card/20 p-4 hidden lg:block overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
           <h3 className="font-medium flex items-center gap-2">
             <Filter className="w-4 h-4" /> Refine
           </h3>
           <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground">Reset</Button>
        </div>

        <Accordion type="multiple" defaultValue={["status", "timeframe"]} className="w-full">
          <AccordionItem value="status" className="border-b-0 mb-4">
            <AccordionTrigger className="py-2 hover:no-underline text-sm">Status</AccordionTrigger>
            <AccordionContent className="pt-2">
              <div className="space-y-2">
                {["Completed", "In Progress", "Draft", "Failed"].map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox id={`status-${status}`} />
                    <label htmlFor={`status-${status}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground">
                      {status}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="timeframe" className="border-b-0">
            <AccordionTrigger className="py-2 hover:no-underline text-sm">Timeframe</AccordionTrigger>
            <AccordionContent className="pt-2">
              <div className="space-y-2">
                {["Last 7 Days", "Last Month", "This Year"].map((time) => (
                   <div key={time} className="flex items-center space-x-2">
                    <Checkbox id={`time-${time}`} />
                    <label htmlFor={`time-${time}`} className="text-sm font-medium leading-none text-muted-foreground">
                      {time}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Search Hero Header */}
        <div className="border-b border-border bg-background p-8 pb-12">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Search projects, logs, or definitions..." 
                  className="h-14 pl-12 pr-32 text-lg bg-background/80 backdrop-blur border-primary/20 focus:border-primary shadow-lg rounded-xl"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                
                <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-muted/50 p-1 rounded-lg flex items-center gap-1">
                   <button 
                     onClick={() => setIsSemantic(false)}
                     className={cn("px-2 py-1 text-xs font-medium rounded transition-colors", !isSemantic ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground")}
                   >
                     Exact
                   </button>
                   <button 
                     onClick={() => setIsSemantic(true)}
                     className={cn("px-2 py-1 text-xs font-medium rounded transition-colors", isSemantic ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground")}
                   >
                     AI Smart
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 p-8 overflow-y-auto bg-muted/5">
          <div className="max-w-4xl mx-auto">
            
            {isEmpty ? (
              /* No Dead Ends State */
              <div className="max-w-lg mx-auto mt-12 text-center animate-in zoom-in-95 duration-300">
                <div className="bg-card border border-border rounded-xl p-8 shadow-xl">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                    <Search className="w-6 h-6 opacity-50" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No active research found for "{query}"
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    However, we found <span className="font-semibold text-foreground">3 matching files</span> in the Assets Repository.
                  </p>
                  
                  <div className="space-y-3">
                    <Button className="w-full gap-2" size="lg">
                      <FolderOpen className="w-4 h-4" />
                      Search in Assets & Archives
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
                      <ArrowRight className="w-4 h-4" />
                      Start New Research
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* Results Grid */
              <div className="grid grid-cols-1 gap-4">
                <p className="text-sm text-muted-foreground mb-2">{results.length} results found</p>
                {results.map((result) => (
                  <div key={result.id} className="group bg-card border border-border hover:border-primary/50 rounded-lg p-5 transition-all hover:shadow-md flex items-start gap-4">
                    <div className="mt-1 p-2 rounded bg-primary/5 text-primary">
                      <FileText className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer">
                            {result.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            <span className="bg-yellow-500/10 text-yellow-500 rounded px-0.5">Disruptions</span> {result.snippet}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><ExternalLink className="w-4 h-4 mr-2" /> Open</DropdownMenuItem>
                            <DropdownMenuItem><Copy className="w-4 h-4 mr-2" /> Clone Config</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive"><Archive className="w-4 h-4 mr-2" /> Archive</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" /> {result.date}
                        </span>
                        <StatusBadge status={result.status} />
                        {result.confidence > 0 && (
                          <span className={cn(
                            "flex items-center gap-1 font-mono",
                            result.confidence > 80 ? "text-green-500" : "text-yellow-500"
                          )}>
                            <Shield className="w-3.5 h-3.5" />
                            {result.confidence}% Verified
                          </span>
                        )}
                        <div className="flex gap-2 ml-auto">
                          {result.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-[10px] h-5 px-1.5 font-normal">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    "Completed": "bg-green-500/10 text-green-500 border-green-500/20",
    "In Progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "Archived": "bg-muted text-muted-foreground border-border",
    "Failed": "bg-red-500/10 text-red-500 border-red-500/20",
  };
  
  return (
    <Badge variant="outline" className={cn("font-medium", styles[status as keyof typeof styles])}>
      {status}
    </Badge>
  );
}
