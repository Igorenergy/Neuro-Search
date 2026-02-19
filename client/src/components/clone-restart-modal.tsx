import { useLocation } from "wouter";
import { GitFork } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { loadLaunchConfig, saveCloneDraft, type CloneDraftState } from "@/lib/launch-config";

interface CloneRestartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const engineLabels: Record<string, string> = {
  ultimate: "Ultimate",
  pro: "Advanced",
  fast: "Standard",
};

export default function CloneRestartModal({ open, onOpenChange }: CloneRestartModalProps) {
  const [, navigate] = useLocation();
  const config = loadLaunchConfig();

  const estimatedCost = "$4.00";

  const handleProceed = () => {
    const draft: CloneDraftState = {
      query: config?.query || "",
      engine: config?.dataEngine || "ultimate",
      files: config?.attachedFiles || [],
      deepCrawlEnabled: config?.deepCrawlEnabled || false,
      showReasoning: config?.showReasoning || false,
      geoScope: config?.geoScope || "global",
      selectedLanguages: config?.selectedLanguages || [],
      researchType: config?.researchType || "search",
    };
    saveCloneDraft(draft);
    onOpenChange(false);
    navigate("/smart-search/new");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full p-6 bg-white border-gray-200 rounded-lg shadow-xl">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-[#EBF5FB] flex items-center justify-center mb-4">
            <GitFork className="w-7 h-7 text-[#008DA8]" />
          </div>

          <DialogHeader className="text-center space-y-2">
            <DialogTitle className="text-lg font-semibold text-gray-900 text-center">
              Clone & Restart Research
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 text-center mt-2">
              This action will duplicate your original prompt, selected data engine, and all attached files. You will be redirected to the Launcher page, where you can edit these parameters before starting a new operation.
            </DialogDescription>
          </DialogHeader>

          <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Estimated Cost (Based on previous run):</span>
              <span className="font-mono font-medium text-gray-900">{estimatedCost}</span>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-2 text-center">
            Final cost may vary if you change settings or add new files in the Launcher.
          </p>

          {config && (
            <div className="w-full mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500 px-1">
                <span>Engine:</span>
                <span className="font-medium text-gray-700">{engineLabels[config.dataEngine] || config.dataEngine}</span>
              </div>
              {config.attachedFiles.length > 0 && (
                <div className="flex items-center justify-between text-xs text-gray-500 px-1">
                  <span>Files:</span>
                  <span className="font-medium text-gray-700">{config.attachedFiles.length} attached</span>
                </div>
              )}
            </div>
          )}

          <div className="w-full flex gap-3 mt-6">
            <Button
              variant="outline"
              className="w-full border-gray-300 text-gray-700"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel-clone"
            >
              Cancel
            </Button>
            <Button
              className="w-full bg-black hover:bg-gray-800 text-white"
              onClick={handleProceed}
              data-testid="button-proceed-clone"
            >
              Proceed to Launcher
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
