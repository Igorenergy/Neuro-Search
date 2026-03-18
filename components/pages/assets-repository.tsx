"use client";

import { useState } from "react";
import AddFilesModal from "@/components/add-files-modal";
import { 
  Folder, 
  FileText, 
  MoreVertical, 
  Grid, 
  List, 
  Plus, 
  HardDrive, 
  Clock, 
  Star, 
  Trash2, 
  Cloud,
  ChevronRight,
  ChevronDown,
  Search,
  Users,
  Image as ImageIcon,
  FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function AssetsRepository() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);

  // Mock Data
  const folders = [
    { id: 1, name: "Market Research 2024", count: 12 },
    { id: 2, name: "Competitor Analysis", count: 8 },
    { id: 3, name: "Q3 Financials", count: 5 },
    { id: 4, name: "Startup Due Diligence", count: 24 },
    { id: 5, name: "Raw Datasets", count: 3 },
    { id: 6, name: "Generated Reports", count: 15 },
    { id: 7, name: "Legal Documents", count: 7 },
    { id: 8, name: "Investor Decks", count: 10 },
  ];

  const files = [
    { id: 101, name: "nvidia_annual_report.pdf", type: "pdf", date: "Today, 10:23 AM", size: "4.2 MB" },
    { id: 102, name: "leads_export_v2.csv", type: "csv", date: "Yesterday, 4:15 PM", size: "1.8 MB" },
    { id: 103, name: "project_roadmap.docx", type: "doc", date: "Dec 4, 2025", size: "245 KB" },
    { id: 104, name: "q3_revenue_chart.png", type: "image", date: "Dec 3, 2025", size: "1.2 MB" },
    { id: 105, name: "meeting_notes_dec.txt", type: "txt", date: "Dec 2, 2025", size: "12 KB" },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf": return <FileText className="w-8 h-8 text-red-500" />;
      case "csv": return <FileSpreadsheet className="w-8 h-8 text-green-500" />;
      case "doc": return <FileText className="w-8 h-8 text-blue-500" />;
      case "image": return <ImageIcon className="w-8 h-8 text-purple-500" />;
      default: return <FileText className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] bg-[#F9FAFB] rounded-lg border border-gray-200 overflow-hidden font-sans">
      
      {/* Left Sidebar */}
      <aside className="w-[250px] bg-white border-r border-gray-200 flex flex-col p-4">
        <Button className="w-full justify-start gap-2 bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm h-12 rounded-xl mb-6 font-medium">
          <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
             <Plus className="w-5 h-5 text-primary" />
          </div>
          <span className="text-base">Create New</span>
        </Button>

        <nav className="space-y-1 flex-1">
          <NavItem icon={HardDrive} label="My Drive" active />
          <NavItem icon={Users} label="Shared with me" />
          <NavItem icon={Clock} label="Recent" />
          <NavItem icon={Star} label="Starred" />
          <NavItem icon={Trash2} label="Trash" />
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
            <Cloud className="w-4 h-4" />
            Storage
          </div>
          <Progress value={41} className="h-2 mb-2 bg-gray-100" />
          <p className="text-xs text-gray-500 mb-3">6.18 GB of 15 GB used</p>
          <Button variant="outline" size="sm" className="w-full text-xs h-8 border-primary/20 text-primary hover:bg-primary/5">
            Upgrade Storage
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-white">
        
        {/* Toolbar */}
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <span>My Drive</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-gray-100">
                   <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>New Folder</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsAddFileModalOpen(true)}>Upload File</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-gray-100 p-1 rounded-lg flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("h-7 w-7 p-0 rounded-md", viewMode === "list" && "bg-white shadow-sm")}
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("h-7 w-7 p-0 rounded-md", viewMode === "grid" && "bg-white shadow-sm")}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
              <Info className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          
          {/* Folders Section */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider pl-1">Folders</h3>
            <div className={cn(
              "grid gap-4", 
              viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"
            )}>
              {folders.map((folder) => (
                <div 
                  key={folder.id}
                  className={cn(
                    "group relative border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer bg-white flex items-center gap-3 select-none",
                    selectedItem === folder.id && "border-primary bg-primary/5 ring-1 ring-primary"
                  )}
                  onClick={() => setSelectedItem(folder.id)}
                  onDoubleClick={() => console.log("Open folder:", folder.name)}
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Folder className="w-5 h-5 fill-current" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{folder.name}</p>
                    <p className="text-xs text-gray-500">{folder.count} items</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-900 absolute right-2 top-1/2 -translate-y-1/2">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Files Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider pl-1">Files</h3>
            <div className={cn(
              "grid gap-4", 
              viewMode === "grid" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-1"
            )}>
              {files.map((file) => (
                <div 
                  key={file.id}
                  className={cn(
                    "group relative border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer bg-white select-none",
                    viewMode === "list" ? "flex items-center gap-4" : "flex flex-col gap-3",
                    selectedItem === file.id && "border-primary bg-primary/5 ring-1 ring-primary"
                  )}
                  onClick={() => setSelectedItem(file.id)}
                >
                  <div className={cn(
                    "rounded-lg flex items-center justify-center bg-gray-50",
                    viewMode === "grid" ? "w-full aspect-square mb-2" : "w-10 h-10"
                  )}>
                    {getFileIcon(file.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate text-sm" title={file.name}>{file.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span>{file.size}</span>
                      {viewMode === "list" && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <span>{file.date}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-900 absolute top-2 right-2">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Preview</DropdownMenuItem>
                      <DropdownMenuItem>Download</DropdownMenuItem>
                      <DropdownMenuItem>Rename</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
      <AddFilesModal open={isAddFileModalOpen} onOpenChange={setIsAddFileModalOpen} />
    </div>
  );
}

function NavItem({ icon: Icon, label, active }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={cn(
      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
      active 
        ? "bg-blue-50 text-blue-700" 
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    )}>
      <Icon className={cn("w-4 h-4", active ? "fill-blue-700" : "")} />
      {label}
    </button>
  );
}

function Info({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 16v-4"/>
      <path d="M12 8h.01"/>
    </svg>
  );
}
