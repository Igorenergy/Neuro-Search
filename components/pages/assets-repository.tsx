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
  Trash2,
  Cloud,
  ChevronDown,
  Image as ImageIcon,
  FileSpreadsheet,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useDataRepository } from "@/hooks/use-data-repository";

type SidebarSection = "my-disk" | "recent" | "trash";

export default function AssetsRepository() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeSection, setActiveSection] = useState<SidebarSection>("my-disk");
  const [openFolder, setOpenFolder] = useState<{ id: number; name: string } | null>(null);
  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);

  const { data: repoData } = useDataRepository();
  const folders = repoData?.folders ?? [];
  const files = repoData?.files ?? [];
  const storageStats = repoData?.storage ?? { usedGb: 0, totalGb: 15, usedPercent: 0 };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf": return <FileText className="w-8 h-8 text-red-500" />;
      case "csv": return <FileSpreadsheet className="w-8 h-8 text-green-500" />;
      case "doc": return <FileText className="w-8 h-8 text-blue-500" />;
      case "image": return <ImageIcon className="w-8 h-8 text-purple-500" />;
      default: return <FileText className="w-8 h-8 text-gray-500" />;
    }
  };

  const sectionLabel: Record<SidebarSection, string> = {
    "my-disk": "My Disk",
    "recent": "Recent",
    "trash": "Trash",
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] bg-[#F9FAFB] rounded-lg border border-gray-200 overflow-hidden font-sans">

      {/* Left Sidebar */}
      <aside className="w-[240px] bg-white border-r border-gray-200 flex flex-col p-4 shrink-0">
        <Button
          onClick={() => setIsAddFileModalOpen(true)}
          className="w-full justify-start gap-2 bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm h-11 rounded-xl mb-5 font-medium"
        >
          <Plus className="w-5 h-5 text-[#008DA8]" />
          <span className="text-sm">Create</span>
        </Button>

        <nav className="space-y-0.5 flex-1">
          <NavItem icon={HardDrive} label="My Disk" active={activeSection === "my-disk"} onClick={() => setActiveSection("my-disk")} />
          <NavItem icon={Clock} label="Recent" active={activeSection === "recent"} onClick={() => setActiveSection("recent")} />
          <NavItem icon={Trash2} label="Trash" active={activeSection === "trash"} onClick={() => setActiveSection("trash")} />
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
            <Cloud className="w-4 h-4" />
            Storage
          </div>
          <Progress value={storageStats.usedPercent} className="h-1.5 mb-2 bg-gray-100" />
          <p className="text-xs text-gray-500 mb-3">
            {storageStats.usedGb} GB of {storageStats.totalGb} GB used
          </p>
          <Button variant="outline" size="sm" className="w-full text-xs h-8 border-[#008DA8]/20 text-[#008DA8] hover:bg-[#008DA8]/5">
            Upgrade Storage
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-white min-w-0">

        {/* Toolbar */}
        <header className="h-14 border-b border-gray-200 flex items-center justify-between px-5 bg-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-base font-semibold text-gray-800">
              {openFolder ? (
                <>
                  <button onClick={() => setOpenFolder(null)} className="text-gray-500 hover:text-gray-800 transition-colors">
                    {sectionLabel[activeSection]}
                  </button>
                  <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90" />
                  <span>{openFolder.name}</span>
                </>
              ) : (
                <span>{sectionLabel[activeSection]}</span>
              )}
            </div>

            <div className="flex items-center gap-2 ml-2">
              <FilterChip label="Type" />
              <FilterChip label="People" />
              <FilterChip label="Modified" />
              <FilterChip label="Source" />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="bg-gray-100 p-0.5 rounded-md flex items-center">
              <button
                className={cn("h-7 w-7 flex items-center justify-center rounded-sm transition-colors", viewMode === "list" && "bg-white shadow-sm")}
                onClick={() => setViewMode("list")}
              >
                <List className="w-3.5 h-3.5 text-gray-600" />
              </button>
              <button
                className={cn("h-7 w-7 flex items-center justify-center rounded-sm transition-colors", viewMode === "grid" && "bg-white shadow-sm")}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-3.5 h-3.5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Sort bar */}
        <div className="h-9 border-b border-gray-100 flex items-center px-5 bg-gray-50/50">
          <button className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900">
            <ArrowUpDown className="w-3 h-3" />
            Name
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 bg-white">

          {/* Folders (only when no folder is open) */}
          {!openFolder && folders.length > 0 && (
            <div className={cn(
              "grid gap-2",
              viewMode === "grid" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"
            )}>
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  onClick={() => setOpenFolder({ id: folder.id, name: folder.name })}
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer select-none"
                >
                  <Folder className="w-5 h-5 text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-800 truncate flex-1">{folder.name}</span>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5" onClick={(e) => e.stopPropagation()}>
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Files (always show when folder is open, or below folders on root) */}
          {(openFolder || files.length > 0) && (
            <div className={openFolder ? "" : "mt-6"}>
              {!openFolder && <h3 className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">Files</h3>}
              <div className={cn(
                "grid gap-2",
                viewMode === "grid" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-1"
              )}>
                {files.map((file) => (
                  <div
                    key={file.id}
                    className={cn(
                      "group relative border border-gray-200 rounded-lg hover:shadow-sm hover:border-gray-300 transition-all cursor-pointer bg-white select-none",
                      viewMode === "list" ? "flex items-center gap-4 px-3 py-2.5" : "p-3 flex flex-col gap-2"
                    )}
                  >
                    <div className={cn(
                      "rounded-md flex items-center justify-center bg-gray-50",
                      viewMode === "grid" ? "w-full aspect-[4/3]" : "w-9 h-9 shrink-0"
                    )}>
                      {getFileIcon(file.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
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
                        <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-900 absolute top-2 right-2 p-0.5">
                          <MoreVertical className="w-4 h-4" />
                        </button>
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
          )}
        </div>
      </main>
      <AddFilesModal open={isAddFileModalOpen} onOpenChange={setIsAddFileModalOpen} />
    </div>
  );
}

function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
  indent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  onClick?: () => void;
  indent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        indent && "pl-8",
        active
          ? "bg-[#E0F4F7] text-[#008DA8]"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      )}
    >
      <Icon className={cn("w-4 h-4", active && "text-[#008DA8]")} />
      {label}
    </button>
  );
}

function FilterChip({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors border border-transparent hover:border-gray-300">
      {label}
      <ChevronDown className="w-3 h-3" />
    </button>
  );
}
