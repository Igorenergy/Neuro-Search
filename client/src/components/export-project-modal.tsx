import { useState, useEffect, useCallback } from "react";
import { Download, Check, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch as ToggleSwitch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import rocketIcon from "@assets/image_1771405092616.png";

type ExportState = "selection" | "generating" | "success";

interface ExportProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  availableBalance?: number;
  sourcesCount?: number;
  artifactsCount?: number;
}

interface ReportOption {
  id: string;
  label: string;
  checked: boolean;
}

interface SourceFilter {
  id: string;
  label: string;
  checked: boolean;
}

interface ArtifactFile {
  id: string;
  label: string;
  checked: boolean;
}

const GENERATION_STEPS = [
  { text: "Generating Final Report (PDF)...", duration: 3000 },
  { text: "Collecting Source Metadata...", duration: 3000 },
  { text: "Compressing Artifacts (Images & Charts)...", duration: 4000 },
  { text: "Finalizing ZIP archive...", duration: 3000 },
];

export default function ExportProjectModal({
  open,
  onOpenChange,
  title,
  availableBalance = 124.50,
  sourcesCount = 159,
  artifactsCount = 16,
}: ExportProjectModalProps) {
  const [exportState, setExportState] = useState<ExportState>("selection");
  const [exportMode, setExportMode] = useState<"full" | "selected">("full");

  const [reports, setReports] = useState<ReportOption[]>([
    { id: "executive", label: "Executive Summary", checked: true },
    { id: "research-log", label: "Research log", checked: true },
    { id: "extended-report", label: "Generated extended report", checked: true },
  ]);

  const [sourcesAll, setSourcesAll] = useState(true);
  const [sourceByActivity, setSourceByActivity] = useState(true);
  const [sourceIncluded, setSourceIncluded] = useState(true);
  const [sourceExcluded, setSourceExcluded] = useState(true);
  const [sourceByType, setSourceByType] = useState(true);
  const [sourceTypes, setSourceTypes] = useState<SourceFilter[]>([
    { id: "html", label: "html/htm", checked: true },
    { id: "doc", label: "doc/docx", checked: true },
    { id: "xls", label: "xls/xlsx", checked: true },
    { id: "pdf", label: "pdf", checked: true },
    { id: "csv", label: "csv", checked: true },
    { id: "md", label: "md (markdown)", checked: true },
    { id: "archives", label: "archives", checked: true },
  ]);
  const [attachDeepData, setAttachDeepData] = useState(true);

  const [artifactsAll, setArtifactsAll] = useState(true);
  const [artifacts, setArtifacts] = useState<ArtifactFile[]>([
    { id: "f1", label: "Document Files Name 1", checked: true },
    { id: "f2", label: "Document Files Name 2", checked: true },
    { id: "f3", label: "Document Files Name 3", checked: true },
    { id: "f4", label: "Document Files Name 4", checked: true },
  ]);

  const [reportsExpanded, setReportsExpanded] = useState(false);
  const [sourcesExpanded, setSourcesExpanded] = useState(false);
  const [artifactsExpanded, setArtifactsExpanded] = useState(false);
  const [premiumInfoOpen, setPremiumInfoOpen] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const reportsSelected = reports.filter(r => r.checked).length;
  const sourcesSelected = sourcesAll ? sourcesCount : (sourceByActivity ? (sourceIncluded ? 1 : 0) + (sourceExcluded ? 1 : 0) : 0) + (sourceByType ? sourceTypes.filter(s => s.checked).length : 0);
  const artifactsSelected = artifactsAll ? artifacts.length : artifacts.filter(a => a.checked).length;

  const exportPrice = 123.54;
  const estimatedSize = "~2.5 MB";

  const isFullMode = exportMode === "full";
  const isInsufficientFunds = exportPrice > availableBalance;

  useEffect(() => {
    if (open) {
      setExportState("selection");
      setGenerationStep(0);
      setProgress(0);
    }
  }, [open]);

  const handleGenerate = useCallback(() => {
    setExportState("generating");
    setGenerationStep(0);
    setProgress(0);

    let currentStep = 0;
    const totalSteps = GENERATION_STEPS.length;
    let elapsed = 0;
    const totalDuration = GENERATION_STEPS.reduce((sum, s) => sum + s.duration, 0);

    const interval = setInterval(() => {
      elapsed += 100;
      const overallProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(overallProgress);

      let accum = 0;
      for (let i = 0; i < totalSteps; i++) {
        accum += GENERATION_STEPS[i].duration;
        if (elapsed < accum) {
          if (i !== currentStep) {
            currentStep = i;
            setGenerationStep(i);
          }
          break;
        }
      }

      if (elapsed >= totalDuration) {
        clearInterval(interval);
        setExportState("success");
        setProgress(100);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const toggleReport = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, checked: !r.checked } : r));
  };

  const toggleSourceType = (id: string) => {
    setSourceTypes(prev => prev.map(s => s.id === id ? { ...s, checked: !s.checked } : s));
  };

  const toggleArtifact = (id: string) => {
    setArtifacts(prev => prev.map(a => a.id === id ? { ...a, checked: !a.checked } : a));
  };

  const handleOpenChange = (val: boolean) => {
    if (exportState === "generating") return;
    onOpenChange(val);
  };

  const SectionHeader = ({ label, count, total, checked, onCheckedChange, color, expanded, onToggle, disabled }: {
    label: string;
    count: number;
    total: number;
    checked: boolean;
    onCheckedChange: (v: boolean) => void;
    color: string;
    expanded: boolean;
    onToggle: () => void;
    disabled?: boolean;
  }) => (
    <div
      className={cn("flex items-center justify-between px-3 py-2 border rounded-sm cursor-pointer select-none", `border-[${color}]`, "bg-white", disabled && "opacity-60")}
      style={{ borderColor: color }}
      onClick={onToggle}
      data-testid={`button-toggle-${label.toLowerCase()}`}
    >
      <div className="flex items-center gap-2">
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={checked}
            onCheckedChange={(v) => onCheckedChange(v === true)}
            disabled={disabled}
            className="border-gray-400 data-[state=checked]:bg-[#008DA8] data-[state=checked]:border-[#008DA8]"
            data-testid={`checkbox-${label.toLowerCase()}-all`}
          />
        </div>
        <span className="text-sm font-bold text-gray-800">{label}: {count} [{total}]</span>
      </div>
      <svg className={cn("w-4 h-4 text-gray-500 transition-transform", expanded && "rotate-180")} viewBox="0 0 16 16" fill="currentColor">
        <path d="M3 6l5 5 5-5H3z"/>
      </svg>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white border-gray-200 p-0 gap-0 [&>button]:hidden max-h-[90vh] flex flex-col">
        <DialogHeader className="px-5 pt-4 pb-0 shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-[17px] font-bold text-gray-900">Export Project Data</DialogTitle>
            <button
              onClick={() => handleOpenChange(false)}
              className="w-7 h-7 flex items-center justify-center bg-black rounded-[2px] hover:bg-gray-800 transition-colors"
              data-testid="button-close-export"
            >
              <span className="text-white text-sm font-bold leading-none">&#x2715;</span>
            </button>
          </div>
        </DialogHeader>

        {exportState === "selection" && (
          <>
            <div className="flex-1 overflow-y-auto px-5 pt-3 pb-4 space-y-4">
              <div className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-md p-3">
                <img src={rocketIcon} alt="" className="w-6 h-6 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-700 leading-snug line-clamp-2">{title}</p>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="export-mode"
                    checked={exportMode === "full"}
                    onChange={() => {
                      setExportMode("full");
                      setReports(prev => prev.map(r => ({ ...r, checked: true })));
                      setSourcesAll(true);
                      setSourceByActivity(true);
                      setSourceIncluded(true);
                      setSourceExcluded(true);
                      setSourceByType(true);
                      setSourceTypes(prev => prev.map(s => ({ ...s, checked: true })));
                      setAttachDeepData(true);
                      setArtifactsAll(true);
                      setArtifacts(prev => prev.map(a => ({ ...a, checked: true })));
                    }}
                    className="accent-[#008DA8]"
                    data-testid="radio-full-archive"
                  />
                  <span className="text-sm text-gray-700">Full data archive <span className="text-[#008DA8] text-xs">(Recommended)</span></span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="export-mode"
                    checked={exportMode === "selected"}
                    onChange={() => setExportMode("selected")}
                    className="accent-[#008DA8]"
                    data-testid="radio-selected-only"
                  />
                  <span className="text-sm font-medium text-gray-900">Selected only</span>
                </label>
              </div>

              <div className="space-y-1">
                <SectionHeader
                  label="Reports"
                  count={reportsSelected}
                  total={5}
                  checked={reports.every(r => r.checked)}
                  onCheckedChange={(v) => setReports(prev => prev.map(r => ({ ...r, checked: v })))}
                  color="#008DA8"
                  expanded={reportsExpanded}
                  onToggle={() => setReportsExpanded(!reportsExpanded)}
                  disabled={isFullMode}
                />
                {reportsExpanded && (
                <div className={cn("pl-4 py-2 space-y-2", isFullMode && "opacity-60 pointer-events-none")}>
                  {reports.map(report => (
                    <label key={report.id} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={report.checked}
                        onCheckedChange={() => toggleReport(report.id)}
                        disabled={isFullMode}
                        className="border-gray-400 data-[state=checked]:bg-[#008DA8] data-[state=checked]:border-[#008DA8]"
                        data-testid={`checkbox-report-${report.id}`}
                      />
                      <span className="text-sm text-gray-700">{report.label}</span>
                    </label>
                  ))}
                </div>
                )}
              </div>

              <div className="space-y-1">
                <SectionHeader
                  label="Sources"
                  count={sourcesSelected}
                  total={sourcesCount}
                  checked={sourcesAll}
                  onCheckedChange={setSourcesAll}
                  color="#D4A017"
                  expanded={sourcesExpanded}
                  onToggle={() => setSourcesExpanded(!sourcesExpanded)}
                  disabled={isFullMode}
                />
                {sourcesExpanded && (
                <div className={cn("pl-4 py-2 space-y-3", isFullMode && "opacity-60 pointer-events-none")}>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={sourceByActivity}
                        onCheckedChange={(v) => setSourceByActivity(v === true)}
                        disabled={isFullMode}
                        className="border-gray-400 data-[state=checked]:bg-[#008DA8] data-[state=checked]:border-[#008DA8]"
                        data-testid="checkbox-by-activity"
                      />
                      <span className="text-sm text-gray-700">By activity</span>
                    </label>
                    {sourceByActivity && (
                      <div className="pl-6 flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={sourceIncluded}
                            onCheckedChange={(v) => setSourceIncluded(v === true)}
                            disabled={isFullMode}
                            className="border-gray-400 data-[state=checked]:bg-[#008DA8] data-[state=checked]:border-[#008DA8]"
                            data-testid="checkbox-included"
                          />
                          <span className="text-sm text-gray-600">Included</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={sourceExcluded}
                            onCheckedChange={(v) => setSourceExcluded(v === true)}
                            disabled={isFullMode}
                            className="border-gray-400 data-[state=checked]:bg-[#008DA8] data-[state=checked]:border-[#008DA8]"
                            data-testid="checkbox-excluded"
                          />
                          <span className="text-sm text-gray-600">Excluded</span>
                        </label>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={sourceByType}
                        onCheckedChange={(v) => setSourceByType(v === true)}
                        disabled={isFullMode}
                        className="border-gray-400 data-[state=checked]:bg-[#008DA8] data-[state=checked]:border-[#008DA8]"
                        data-testid="checkbox-by-type"
                      />
                      <span className="text-sm text-gray-700">By type</span>
                    </label>
                    {sourceByType && (
                      <div className="pl-6 flex flex-wrap gap-x-4 gap-y-2">
                        {sourceTypes.map(st => (
                          <label key={st.id} className="flex items-center gap-1.5 cursor-pointer">
                            <Checkbox
                              checked={st.checked}
                              onCheckedChange={() => toggleSourceType(st.id)}
                              disabled={isFullMode}
                              className="border-gray-400 data-[state=checked]:bg-[#008DA8] data-[state=checked]:border-[#008DA8]"
                              data-testid={`checkbox-source-type-${st.id}`}
                            />
                            <span className="text-xs text-gray-600">{st.label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <ToggleSwitch
                      checked={attachDeepData}
                      onCheckedChange={setAttachDeepData}
                      disabled={isFullMode}
                      className="scale-75 data-[state=checked]:bg-[#008DA8]"
                      data-testid="switch-deep-data"
                    />
                    <span className="text-sm text-[#008DA8] font-medium">Attach Deep extracted data</span>
                  </div>
                </div>
                )}
              </div>

              <div className="space-y-1">
                <SectionHeader
                  label="Artifacts"
                  count={artifactsSelected}
                  total={artifactsCount}
                  checked={artifactsAll}
                  onCheckedChange={(v) => {
                    setArtifactsAll(v);
                    setArtifacts(prev => prev.map(a => ({ ...a, checked: v })));
                  }}
                  color="#CC4400"
                  expanded={artifactsExpanded}
                  onToggle={() => setArtifactsExpanded(!artifactsExpanded)}
                  disabled={isFullMode}
                />
                {artifactsExpanded && (
                <div className={cn("pl-4 py-2", isFullMode && "opacity-60 pointer-events-none")}>
                  <div className="grid grid-cols-2 gap-2">
                    {artifacts.map(artifact => (
                      <label key={artifact.id} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={artifact.checked}
                          onCheckedChange={() => toggleArtifact(artifact.id)}
                          disabled={isFullMode}
                          className="border-gray-400 data-[state=checked]:bg-[#008DA8] data-[state=checked]:border-[#008DA8]"
                          data-testid={`checkbox-artifact-${artifact.id}`}
                        />
                        <span className="text-xs text-gray-600">{artifact.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                )}
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-[#008DA8]">Export price: ${exportPrice.toFixed(2)}</span>
                  <button
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                    onClick={() => setPremiumInfoOpen(!premiumInfoOpen)}
                    data-testid="button-premium-info"
                  >
                    <span className="underline">What's included in Premium Export?</span>
                    <svg className={cn("w-3 h-3 transition-transform", premiumInfoOpen && "rotate-180")} viewBox="0 0 16 16" fill="currentColor">
                      <path d="M3 6l5 5 5-5H3z"/>
                    </svg>
                  </button>
                </div>
                {premiumInfoOpen && (
                  <div className="bg-[#F0F7F9] border border-[#D0E8ED] rounded-sm p-3 space-y-1.5">
                    <p className="text-xs text-gray-600 flex items-start gap-1.5">
                      <span className="text-[#008DA8] shrink-0 mt-0.5">&#x1F4C1;</span>
                      <span><span className="font-semibold">Structured Folders:</span> All files are neatly organized. No manual sorting needed.</span>
                    </p>
                    <p className="text-xs text-gray-600 flex items-start gap-1.5">
                      <span className="text-[#008DA8] shrink-0 mt-0.5">&#x1F4CA;</span>
                      <span><span className="font-semibold">Merged Master File:</span> Instead of dozens of scattered CSVs, get one consolidated Excel workbook.</span>
                    </p>
                    <p className="text-xs text-gray-600 flex items-start gap-1.5">
                      <span className="text-[#008DA8] shrink-0 mt-0.5">&#x1F4D1;</span>
                      <span><span className="font-semibold">Auto-Generated Index:</span> A smart table of contents to instantly navigate your results.</span>
                    </p>
                  </div>
                )}

                {isInsufficientFunds && (
                  <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-sm px-3 py-2">
                    <span className="text-orange-500 text-sm">&#9888;</span>
                    <span className="text-xs text-orange-700">
                      Insufficient balance.{" "}
                      <button className="underline font-medium" data-testid="button-topup">Top up your account</button>{" "}
                      to proceed.
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="shrink-0 px-5 py-3 border-t border-gray-200">
              <Button
                className={cn(
                  "w-full font-bold text-sm",
                  isInsufficientFunds
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300"
                    : "bg-[#008DA8] hover:bg-[#006E7D] text-white"
                )}
                disabled={isInsufficientFunds}
                onClick={handleGenerate}
                data-testid="button-download-zip"
              >
                <Download className="w-4 h-4 mr-2" />
                Download ZIP [{estimatedSize}]
              </Button>
            </div>
          </>
        )}

        {exportState === "generating" && (
          <div className="px-5 py-8 space-y-6">
            <h3 className="text-base font-bold text-gray-900 text-center">Preparing for the download</h3>

            <div className="flex items-center gap-6 px-4">
              <div className="relative w-24 h-24 shrink-0">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                  <circle
                    cx="48" cy="48" r="40" fill="none"
                    stroke="#008DA8"
                    strokeWidth="6"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - progress / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-200"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#008DA8]">
                  {Math.round(progress)}%
                </span>
              </div>

              <div className="flex-1 space-y-2.5">
                {GENERATION_STEPS.map((step, idx) => {
                  const isCompleted = idx < generationStep || (idx === GENERATION_STEPS.length - 1 && progress >= 100);
                  const isCurrent = idx === generationStep && progress < 100;
                  const isPending = idx > generationStep;

                  return (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="shrink-0 mt-0.5">
                        {isCompleted ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : isCurrent ? (
                          <Loader2 className="w-4 h-4 text-[#008DA8] animate-spin" />
                        ) : (
                          <span className="w-4 h-4 block rounded-sm border border-gray-300" />
                        )}
                      </span>
                      <span className={cn(
                        "text-sm leading-snug",
                        isCompleted ? "text-gray-700" : isCurrent ? "text-gray-900 font-medium" : "text-gray-400"
                      )}>
                        {step.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                className="border-[#008DA8] text-[#008DA8] px-6"
                onClick={() => { setExportState("selection"); }}
                data-testid="button-cancel-generation"
              >
                Cancel Download
              </Button>
            </div>
          </div>
        )}

        {exportState === "success" && (
          <div className="px-5 py-8 space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-gray-900">Export complete!</h3>
                <p className="text-sm text-gray-500">Your files are ready for download.</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 px-4">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                data-testid="button-download-files"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Files
              </Button>
              <Button
                variant="outline"
                className="w-full border-gray-300 text-gray-600"
                onClick={() => handleOpenChange(false)}
                data-testid="button-close-success"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
