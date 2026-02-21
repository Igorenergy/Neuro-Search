import { useState } from "react";
import {
  MoreVertical,
  FileText,
  Copy,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch as ToggleSwitch } from "@/components/ui/switch";
import CloneRestartModal from "@/components/clone-restart-modal";
import RemoveProjectModal from "@/components/remove-project-modal";

interface ProjectContextMenuProps {
  projectTitle: string;
  align?: "start" | "end";
}

export function ProjectContextMenu({ projectTitle, align = "start" }: ProjectContextMenuProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [isPinned, setIsPinned] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="shrink-0 p-1 hover:bg-gray-200 rounded transition-colors" data-testid="button-project-menu">
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align} className="w-44 bg-[#1a1a1a] border-[#333] shadow-xl">
          <DropdownMenuItem
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white focus:text-white focus:bg-[#333] cursor-pointer"
            onClick={(e) => { e.preventDefault(); setRenameValue(projectTitle); setDetailsOpen(true); }}
            data-testid="menu-details"
          >
            <FileText className="w-4 h-4 text-gray-400" />
            Details
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2 text-sm text-[#008DA8] hover:text-[#00b0cc] focus:text-[#00b0cc] focus:bg-[#333] cursor-pointer"
            onClick={(e) => { e.preventDefault(); setCloneOpen(true); }}
            data-testid="menu-clone"
          >
            <Copy className="w-4 h-4 text-[#008DA8]" />
            Clone & Restart
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 focus:text-red-400 focus:bg-[#333] cursor-pointer"
            onClick={(e) => { e.preventDefault(); setDeleteOpen(true); }}
            data-testid="menu-delete"
          >
            <Trash2 className="w-4 h-4" />
            Delete Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Research Details</DialogTitle>
            <DialogDescription className="text-gray-500 text-sm">
              Edit the name and pin status for this research item.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label htmlFor="rename-report" className="text-sm font-medium text-gray-700">Rename</Label>
              <Input
                id="rename-report"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="border-gray-300 focus:border-[#008DA8] focus:ring-[#008DA8] text-gray-900"
                data-testid="input-rename-report"
              />
            </div>
            <div className="flex items-center gap-3">
              <ToggleSwitch
                id="pin-toggle-report"
                checked={isPinned}
                onCheckedChange={setIsPinned}
                data-testid="toggle-pin-report"
              />
              <Label htmlFor="pin-toggle-report" className="text-sm font-medium text-gray-700 cursor-pointer">Pin to navigation menu</Label>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDetailsOpen(false)} className="border-gray-300 text-gray-700" data-testid="button-cancel-details-report">
              Cancel
            </Button>
            <Button onClick={() => setDetailsOpen(false)} className="bg-[#008DA8] hover:bg-[#006E7D] text-white" data-testid="button-save-details-report">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <RemoveProjectModal open={deleteOpen} onOpenChange={setDeleteOpen} title={projectTitle} />

      <CloneRestartModal open={cloneOpen} onOpenChange={setCloneOpen} />
    </>
  );
}
