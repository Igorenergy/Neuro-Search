"use client";

import { useState } from "react";
import {
  Download,
  Search,
  RefreshCw,
  Trash2,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  FileText,
  FileSpreadsheet,
  Archive,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useExports } from "@/hooks/use-exports";
import type { ExportItem, ExportFormat, ExportStatus } from "@/lib/types";

type SortField = "name" | "exportedAt" | "expiresAt" | "fileSize";
type SortDir = "asc" | "desc";

const FORMAT_CONFIG: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; label: string }> = {
  pdf: { icon: FileText, color: "text-red-600 bg-red-50", label: "PDF" },
  xlsx: { icon: FileSpreadsheet, color: "text-green-700 bg-green-50", label: "XLS" },
  csv: { icon: FileSpreadsheet, color: "text-green-600 bg-green-50", label: "CSV" },
  docx: { icon: FileText, color: "text-blue-600 bg-blue-50", label: "DOC" },
  json: { icon: FileText, color: "text-gray-600 bg-gray-100", label: "JSON" },
  zip: { icon: Archive, color: "text-amber-700 bg-amber-50", label: "ZIP" },
};

const STATUS_CONFIG: Record<ExportStatus, { icon: React.ComponentType<{ className?: string }>; color: string; label: string }> = {
  ready: { icon: CheckCircle, color: "text-green-600", label: "Ready" },
  processing: { icon: RefreshCw, color: "text-[#008DA8]", label: "Processing" },
  expired: { icon: AlertTriangle, color: "text-amber-500", label: "Expired" },
  failed: { icon: XCircle, color: "text-red-500", label: "Failed" },
};

export default function ExportHub() {
  const { data: exports = [], isLoading } = useExports();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("exportedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<ExportStatus | "all">("all");

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  const filtered = exports
    .filter((e) => {
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return e.name.toLowerCase().includes(q) || e.projectName.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortField === "name") return dir * a.name.localeCompare(b.name);
      if (sortField === "exportedAt") return dir * a.exportedAt.localeCompare(b.exportedAt);
      if (sortField === "expiresAt") return dir * a.expiresAt.localeCompare(b.expiresAt);
      if (sortField === "fileSize") return dir * a.fileSize.localeCompare(b.fileSize);
      return 0;
    });

  const readyCount = exports.filter((e) => e.status === "ready").length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
            <Package className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Exports</h1>
            <p className="text-sm text-gray-500">{exports.length} exports &middot; {readyCount} ready to download</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search exports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm bg-transparent outline-none w-48 placeholder:text-gray-400"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs gap-1.5 h-8">
                <ArrowUpDown className="w-3 h-3" />
                {statusFilter === "all" ? "All statuses" : STATUS_CONFIG[statusFilter].label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>All statuses</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter("ready")}>Ready</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("processing")}>Processing</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("expired")}>Expired</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("failed")}>Failed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_200px_140px_140px_100px_80px] gap-2 px-4 py-2.5 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <SortHeader label="Name" field="name" current={sortField} dir={sortDir} onSort={toggleSort} />
          <span>Project</span>
          <SortHeader label="Exported at" field="exportedAt" current={sortField} dir={sortDir} onSort={toggleSort} />
          <SortHeader label="Expires at" field="expiresAt" current={sortField} dir={sortDir} onSort={toggleSort} />
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Table body */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-sm text-gray-400">
            <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Loading exports...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-sm text-gray-400">
            <Package className="w-10 h-10 mb-3 text-gray-300" />
            {searchQuery || statusFilter !== "all"
              ? "No exports match your filters."
              : "You don't have any exports yet."}
          </div>
        ) : (
          filtered.map((item) => (
            <ExportRow key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
}

function ExportRow({ item }: { item: ExportItem }) {
  const fmt = FORMAT_CONFIG[item.format] ?? FORMAT_CONFIG.pdf;
  const FormatIcon = fmt.icon;
  const status = STATUS_CONFIG[item.status];
  const StatusIcon = status.icon;

  return (
    <div className="grid grid-cols-[1fr_200px_140px_140px_100px_80px] gap-2 px-4 py-3 border-b border-gray-100 hover:bg-gray-50/50 transition-colors items-center group">
      {/* Name + format */}
      <div className="flex items-center gap-3 min-w-0">
        <div className={cn("w-8 h-8 rounded-md flex items-center justify-center shrink-0", fmt.color.split(" ")[1])}>
          <span className={cn("text-[9px] font-bold", fmt.color.split(" ")[0])}>{fmt.label}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
          <p className="text-xs text-gray-400">{item.fileSize}</p>
        </div>
      </div>

      {/* Project */}
      <p className="text-xs text-gray-500 truncate" title={item.projectName}>{item.projectName}</p>

      {/* Exported at */}
      <p className="text-xs text-gray-600">{item.exportedAt}</p>

      {/* Expires at */}
      <p className={cn("text-xs", item.status === "expired" ? "text-amber-500 font-medium" : "text-gray-600")}>
        {item.expiresAt}
      </p>

      {/* Status */}
      <div className="flex items-center gap-1.5">
        <StatusIcon className={cn("w-3.5 h-3.5", status.color, item.status === "processing" && "animate-spin")} />
        <span className={cn("text-xs font-medium", status.color)}>{status.label}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1">
        {item.status === "ready" && item.downloadUrl && (
          <a
            href={item.downloadUrl}
            className="p-1.5 rounded-md hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100"
            title="Download"
          >
            <Download className="w-3.5 h-3.5 text-gray-600" />
          </a>
        )}
        {item.status === "expired" && (
          <button
            className="p-1.5 rounded-md hover:bg-[#E0F4F7] transition-colors opacity-0 group-hover:opacity-100"
            title="Re-export"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#008DA8]" />
          </button>
        )}
        {item.status === "failed" && (
          <button
            className="p-1.5 rounded-md hover:bg-[#E0F4F7] transition-colors opacity-0 group-hover:opacity-100"
            title="Retry"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#008DA8]" />
          </button>
        )}
        <button
          className="p-1.5 rounded-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
        </button>
      </div>
    </div>
  );
}

function SortHeader({
  label,
  field,
  current,
  dir,
  onSort,
}: {
  label: string;
  field: SortField;
  current: SortField;
  dir: SortDir;
  onSort: (f: SortField) => void;
}) {
  const active = current === field;
  return (
    <button
      className="flex items-center gap-1 hover:text-gray-800 transition-colors text-left"
      onClick={() => onSort(field)}
    >
      {label}
      {active ? (
        dir === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
      ) : (
        <ArrowUpDown className="w-2.5 h-2.5 opacity-40" />
      )}
    </button>
  );
}
