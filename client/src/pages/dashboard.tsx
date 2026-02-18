import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  ArrowRight, 
  Activity, 
  Globe, 
  Search, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  MoreVertical,
  Zap,
  FileText,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [bannerVisible, setBannerVisible] = useState(true);

  // Mock Data
  const recentResearch = [
    {
      id: "R-1024",
      name: "Global Logistics Trends 2024",
      date: "2 hours ago",
      status: "Completed",
      confidence: 92,
      cost: 1.20,
    },
    {
      id: "R-1025",
      name: "Competitor Analysis: Acme Corp",
      date: "Active now",
      status: "In Progress",
      confidence: 0,
      cost: 0.45,
    },
    {
      id: "R-1023",
      name: "Q3 Financial Reports - Tech Sector",
      date: "Yesterday",
      status: "Failed",
      confidence: 0,
      cost: 0.10,
    },
    {
      id: "R-1022",
      name: "AI Regulation Frameworks EU",
      date: "2 days ago",
      status: "Completed",
      confidence: 88,
      cost: 2.50,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* Latest News Banner */}
      {bannerVisible && (
        <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-background border border-primary/20 rounded-lg p-4 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
          <div className="flex items-center gap-3 relative z-10">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">New</Badge>
            <p className="text-sm font-medium text-foreground">
              Deep Extract Model v2.1 is now live! <span className="text-muted-foreground ml-1">+25% faster parsing.</span>
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground relative z-10"
            onClick={() => setBannerVisible(false)}
          >
            ×
          </Button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Active Ops & Quick Launch) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Launch */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors cursor-pointer group" onClick={() => setLocation("/smart-search/new")}>
              <CardContent className="p-6 flex flex-col items-start justify-between h-40">
                <div className="p-3 rounded-full bg-primary/20 text-primary mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Start New Deep Research</h3>
                  <p className="text-sm text-muted-foreground mt-1">Launch a multi-agent investigation</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:bg-accent/5 transition-colors cursor-pointer group" onClick={() => setLocation("/research/search")}>
              <CardContent className="p-6 flex flex-col items-start justify-between h-40">
                <div className="p-3 rounded-full bg-secondary text-secondary-foreground mb-4 group-hover:scale-110 transition-transform">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Smart Search Repository</h3>
                  <p className="text-sm text-muted-foreground mt-1">Find existing assets & reports</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Operations */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg font-medium">Active Operations</CardTitle>
                <CardDescription>Live tasks running on the agent swarm</CardDescription>
              </div>
              <Badge variant="outline" className="animate-pulse bg-green-500/10 text-green-500 border-green-500/20">
                1 Active
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-border rounded-lg bg-background/50 relative overflow-hidden group">
                {/* Progress Bar Background */}
                <div className="absolute bottom-0 left-0 h-1 bg-primary/20 w-full">
                  <div className="h-full bg-primary w-[45%] animate-[pulse_2s_ease-in-out_infinite]" />
                </div>
                
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-primary/10 text-primary">
                      <Activity className="w-4 h-4 animate-spin-slow" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Competitor Analysis: Acme Corp</h4>
                      <p className="text-xs text-primary font-mono mt-0.5">Hydrating Contacts...</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8">
                    Abort
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Research Log */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
             <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Recent Research Log</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead>Project Name</TableHead>
                    <TableHead className="w-[120px]">Date</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[100px] text-right">Confidence</TableHead>
                    <TableHead className="w-[80px] text-right">Cost</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentResearch.map((item) => (
                    <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50 border-border/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          {item.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{item.date}</TableCell>
                      <TableCell>
                        <StatusBadge status={item.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        {item.confidence > 0 ? (
                           <div className="flex items-center justify-end gap-1.5 text-xs font-mono text-muted-foreground" title="AI Confidence Score">
                             <ShieldCheck className={cn("w-3.5 h-3.5", item.confidence > 90 ? "text-green-500" : "text-yellow-500")} />
                             {item.confidence}%
                           </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs text-muted-foreground">
                        ${item.cost.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (System Health) */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-sidebar border-sidebar-border shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Budget & System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-mono font-light text-foreground">$124.00</span>
                  <Badge variant="outline" className="mb-1.5 border-primary/20 text-primary">Pro Plan</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Token Usage (24h)</span>
                  <span>1.2M / 2.0M</span>
                </div>
                <Progress value={60} className="h-2 bg-muted/50" />
                <div className="flex justify-between text-[10px] text-muted-foreground/50 font-mono">
                  <span>00:00</span>
                  <span>12:00</span>
                  <span>23:59</span>
                </div>
              </div>

              <Separator className="bg-border/50" />

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Zap className="w-4 h-4" /> System Status
                  </span>
                  <span className="flex items-center gap-1.5 text-green-500 text-xs font-medium">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="w-4 h-4" /> Proxy Network
                  </span>
                  <span className="text-xs text-muted-foreground">98% Success Rate</span>
                </div>
              </div>

              <Button className="w-full mt-4" variant="outline">Manage Subscription</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "Completed") {
    return (
      <Badge variant="outline" className="bg-green-500/5 text-green-500 border-green-500/20 hover:bg-green-500/10">
        <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
      </Badge>
    );
  }
  if (status === "In Progress") {
    return (
      <Badge variant="outline" className="bg-blue-500/5 text-blue-500 border-blue-500/20 hover:bg-blue-500/10 animate-pulse">
        <Activity className="w-3 h-3 mr-1" /> Processing
      </Badge>
    );
  }
  if (status === "Failed") {
    return (
      <Badge variant="outline" className="bg-red-500/5 text-red-500 border-red-500/20 hover:bg-red-500/10">
        <AlertCircle className="w-3 h-3 mr-1" /> Failed
      </Badge>
    );
  }
  return <Badge variant="secondary">{status}</Badge>;
}
