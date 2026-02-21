import { useState } from "react";
import { Archive, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import rocketIcon from "@assets/image_1771405092616.png";

interface RemoveProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onConfirm?: () => void;
  defaultMode?: "archive" | "delete";
}

export default function RemoveProjectModal({ open, onOpenChange, title, onConfirm, defaultMode = "archive" }: RemoveProjectModalProps) {
  const [mode, setMode] = useState<"archive" | "delete">(defaultMode);

  const handleOpenChange = (val: boolean) => {
    if (!val) setMode(defaultMode);
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[460px] bg-white border-gray-200 p-0 gap-0 [&>button]:hidden">
        <DialogHeader className="px-6 pt-5 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-[17px] font-bold text-gray-900">Remove Project</DialogTitle>
            <button
              onClick={() => handleOpenChange(false)}
              className="w-7 h-7 flex items-center justify-center bg-black rounded-[2px] hover:bg-gray-800 transition-colors"
              data-testid="button-close-remove-project"
            >
              <span className="text-white text-sm font-bold leading-none">&#x2715;</span>
            </button>
          </div>
        </DialogHeader>

        <div className="px-6 pt-4 pb-5 space-y-4">
          <div className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-md p-3">
            <img src={rocketIcon} alt="" className="w-6 h-6 mt-0.5 shrink-0" />
            <p className="text-sm text-gray-700 leading-snug line-clamp-2">{title}</p>
          </div>

          <p className="text-[13px] text-[#008DA8] font-medium leading-snug">
            Choose how you want to handle your research data before it's removed from the active dashboard.
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setMode("archive")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded border text-sm font-medium transition-all",
                mode === "archive"
                  ? "bg-[#008DA8]/10 border-[#008DA8] text-[#008DA8] shadow-sm"
                  : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
              )}
              data-testid="button-mode-archive"
            >
              <Archive className="w-4 h-4" />
              Archive
            </button>
            <button
              onClick={() => setMode("delete")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded border text-sm font-medium transition-all",
                mode === "delete"
                  ? "bg-red-50 border-red-400 text-red-600 shadow-sm"
                  : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
              )}
              data-testid="button-mode-delete"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>

          {mode === "archive" ? (
            <div className="space-y-3">
              <p className="text-[13px] text-[#008DA8] leading-relaxed">
                Move to Archive. Keep all research results, reports, and extracted data. The project will be available in Read-only mode.
              </p>
              <div className="text-[12px] text-gray-500 leading-relaxed">
                <p>
                  Total project value: <span className="font-semibold text-gray-700">$[Total]</span>.
                  {" "}Restoration fee: <span className="font-semibold text-gray-700">$[50% of Total]</span> (50% of original price).
                </p>
                <p className="mt-1">
                  It is significantly cheaper to restore this data later than to restart the research from scratch ($[Total]).
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-[13px] text-red-600 leading-relaxed">
                Delete Permanently. All data, including sources and generated reports, will be erased forever. This action cannot be undone.
              </p>
              <p className="text-[12px] text-orange-600 font-semibold flex items-center gap-1.5">
                <span className="text-base leading-none">!</span>
                You will lose $[100% of Total] worth of research data.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="border-gray-300 text-gray-700 px-6"
            data-testid="button-cancel-remove"
          >
            Cancel
          </Button>
          {mode === "archive" ? (
            <Button
              onClick={() => { onConfirm?.(); handleOpenChange(false); }}
              className="bg-[#008DA8] hover:bg-[#006E7D] text-white px-6"
              data-testid="button-confirm-archive"
            >
              Archive Project
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={() => { onConfirm?.(); handleOpenChange(false); }}
              className="bg-red-600 hover:bg-red-700 text-white px-6"
              data-testid="button-confirm-delete-forever"
            >
              Delete Forever
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
