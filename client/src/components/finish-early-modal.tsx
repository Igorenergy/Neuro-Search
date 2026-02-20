import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface FinishEarlyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
}

export default function FinishEarlyModal({ open, onOpenChange, onConfirm }: FinishEarlyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] bg-white border-gray-200 p-0 overflow-hidden">
        <div className="border-b-2 border-green-200 px-6 pt-5 pb-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <DialogTitle className="text-[17px] font-bold text-gray-900">Finish Early</DialogTitle>
        </div>
        <DialogDescription className="sr-only">Confirm finishing the research early</DialogDescription>
        <div className="px-6 py-4 space-y-3">
          <p className="text-sm text-gray-700">Generate the report now based on current sources?</p>
          <p className="text-sm text-[#0d9488] font-medium">The AI will stop gathering new sources and compile a report from the data collected so far. You will still receive a complete, structured output.</p>
        </div>
        <div className="px-6 pb-5 flex items-center justify-between">
          <button
            className="text-sm text-gray-600 underline underline-offset-2 hover:text-gray-900 cursor-pointer"
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel-finish-early"
          >
            Cancel
          </button>
          <Button
            className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-6 h-10 rounded-md font-medium"
            onClick={() => { onOpenChange(false); onConfirm?.(); }}
            data-testid="button-confirm-finish-early"
          >
            Yes, Generate Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
