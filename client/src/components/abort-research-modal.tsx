import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface AbortResearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
}

export default function AbortResearchModal({ open, onOpenChange, onConfirm }: AbortResearchModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] bg-white border-gray-200 p-0 overflow-hidden">
        <div className="border-b-2 border-red-200 px-6 pt-5 pb-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <DialogTitle className="text-[17px] font-bold text-gray-900">Abort Research</DialogTitle>
        </div>
        <DialogDescription className="sr-only">Confirm aborting the current research</DialogDescription>
        <div className="px-6 py-4 space-y-3">
          <p className="text-sm text-gray-700">Are you sure you want to abort this research?</p>
          <p className="text-sm text-red-600 font-medium">All current progress will be permanently discarded. This action cannot be undone.</p>
        </div>
        <div className="px-6 pb-5 flex items-center justify-between">
          <button
            className="text-sm text-gray-600 underline underline-offset-2 hover:text-gray-900 cursor-pointer"
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel-abort"
          >
            Cancel
          </button>
          <Button
            className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 h-10 rounded-md font-medium"
            onClick={() => { onOpenChange(false); onConfirm?.(); }}
            data-testid="button-confirm-abort"
          >
            Yes, Abort
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
