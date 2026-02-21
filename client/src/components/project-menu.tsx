import {
  FileText,
  Copy,
  Archive,
  Download,
  Trash2,
  StopCircle,
  FastForward,
  Unlock,
} from "lucide-react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const itemBase = "flex items-center gap-2 text-sm cursor-pointer";
const defaultItem = `${itemBase} text-gray-300 hover:text-white focus:text-white focus:bg-[#333]`;
const cloneItem = `${itemBase} text-[#008DA8] hover:text-[#00b0cc] focus:text-[#00b0cc] focus:bg-[#333]`;
const dangerItem = `${itemBase} text-red-500 hover:text-red-400 focus:text-red-400 focus:bg-[#333]`;
const successItem = `${itemBase} text-[#22c55e] hover:text-[#16a34a] focus:text-[#16a34a] focus:bg-[#333]`;

interface ProjectMenuContentProps {
  itemId: string;
  status?: string;
  align?: "start" | "end";
  side?: "top" | "right" | "bottom" | "left";
  prefix?: string;
  showArchive?: boolean;
  showExport?: boolean;
  onDetails?: () => void;
  onClone?: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
  onExport?: () => void;
  onAbort?: () => void;
  onFinishEarly?: () => void;
  onUnarchive?: () => void;
}

export function ProjectMenuContent({
  itemId,
  status,
  align = "end",
  side,
  prefix = "",
  showArchive = false,
  showExport = false,
  onDetails,
  onClone,
  onDelete,
  onArchive,
  onExport,
  onAbort,
  onFinishEarly,
  onUnarchive,
}: ProjectMenuContentProps) {
  const pre = prefix ? `${prefix}-` : "";

  if (status === "archived") {
    return (
      <DropdownMenuContent align={align} side={side} className="w-48 bg-[#1a1a1a] border-[#333] shadow-xl">
        {onUnarchive && (
          <DropdownMenuItem
            className={cloneItem}
            onSelect={onUnarchive}
            data-testid={`${pre}unarchive-${itemId}`}
          >
            <Unlock className="w-4 h-4" />
            Unarchive / Restore
          </DropdownMenuItem>
        )}
        {onClone && (
          <DropdownMenuItem
            className={cloneItem}
            onSelect={onClone}
            data-testid={`${pre}clone-${itemId}`}
          >
            <Copy className="w-4 h-4 text-[#008DA8]" />
            Clone & Restart
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem
            className={dangerItem}
            onSelect={onDelete}
            data-testid={`${pre}delete-${itemId}`}
          >
            <Trash2 className="w-4 h-4" />
            Delete Permanently
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    );
  }

  if (status === "in-progress") {
    return (
      <DropdownMenuContent align={align} side={side} className="w-44 bg-[#1a1a1a] border-[#333] shadow-xl">
        {onAbort && (
          <DropdownMenuItem
            className={dangerItem}
            onSelect={onAbort}
            data-testid={`${pre}abort-${itemId}`}
          >
            <StopCircle className="w-4 h-4" />
            Abort Research
          </DropdownMenuItem>
        )}
        {onFinishEarly && (
          <DropdownMenuItem
            className={successItem}
            onSelect={onFinishEarly}
            data-testid={`${pre}finish-early-${itemId}`}
          >
            <FastForward className="w-4 h-4" />
            Finish Early
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    );
  }

  return (
    <DropdownMenuContent align={align} side={side} className="w-44 bg-[#1a1a1a] border-[#333] shadow-xl">
      {onDetails && (
        <DropdownMenuItem
          className={defaultItem}
          onSelect={onDetails}
          data-testid={`${pre}details-${itemId}`}
        >
          <FileText className="w-4 h-4 text-gray-400" />
          Details
        </DropdownMenuItem>
      )}
      {onClone && (
        <DropdownMenuItem
          className={cloneItem}
          onSelect={onClone}
          data-testid={`${pre}clone-${itemId}`}
        >
          <Copy className="w-4 h-4 text-[#008DA8]" />
          Clone & Restart
        </DropdownMenuItem>
      )}
      {showArchive && (
        <DropdownMenuItem
          className={defaultItem}
          onSelect={onArchive}
          data-testid={`${pre}archive-${itemId}`}
        >
          <Archive className="w-4 h-4 text-gray-400" />
          Archive Project
        </DropdownMenuItem>
      )}
      {showExport && (
        <DropdownMenuItem
          className={defaultItem}
          onSelect={onExport}
          data-testid={`${pre}export-${itemId}`}
        >
          <Download className="w-4 h-4 text-gray-400" />
          Export Project
        </DropdownMenuItem>
      )}
      {onDelete && (
        <DropdownMenuItem
          className={dangerItem}
          onSelect={onDelete}
          data-testid={`${pre}delete-${itemId}`}
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </DropdownMenuItem>
      )}
    </DropdownMenuContent>
  );
}
