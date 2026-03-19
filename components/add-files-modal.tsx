"use client";

import { useState, useRef } from "react";
import {
  Upload,
  FileText,
  Globe,
  Play,
  Database,
  Link as LinkIcon,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface AddFilesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (files: { name: string; type: string; size: string }[]) => void;
}

const repoFiles = [
  "Annual Report 2024.pdf",
  "Board Meeting Notes.docx",
  "Customer Survey Results.xlsx",
  "Product Roadmap Q3.pdf",
  "Marketing Strategy.pptx",
  "Employee Handbook.pdf",
  "Budget Forecast 2025.xlsx",
  "Competitor Analysis.pdf",
  "Sales Pipeline Report.csv",
  "Technical Architecture.docx",
];

export default function AddFilesModal({ open, onOpenChange, onSave }: AddFilesModalProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "repository">("upload");
  const [selectedRepoFiles, setSelectedRepoFiles] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setUploadedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleRepoFile = (file: string) => {
    setSelectedRepoFiles(prev =>
      prev.includes(file) ? prev.filter(f => f !== file) : [...prev, file]
    );
  };

  const handleSave = () => {
    const result: { name: string; type: string; size: string }[] = [];
    if (activeTab === "upload" && uploadedFiles.length > 0) {
      uploadedFiles.forEach(f => {
        const ext = f.name.split(".").pop()?.toUpperCase() || "FILE";
        const size = f.size >= 1048576 ? `${(f.size / 1048576).toFixed(1)} MB` : `${(f.size / 1024).toFixed(1)} KB`;
        result.push({ name: f.name, type: ext, size });
      });
      setUploadedFiles([]);
    }
    if (activeTab === "repository" && selectedRepoFiles.length > 0) {
      selectedRepoFiles.forEach(name => {
        const ext = name.split(".").pop()?.toUpperCase() || "FILE";
        result.push({ name, type: ext, size: "—" });
      });
      setSelectedRepoFiles([]);
    }
    onSave?.(result);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 gap-0 bg-[#F8F9FA] overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <DialogHeader className="p-0 space-y-0">
              <DialogTitle className="text-base font-bold text-gray-900">Add Files</DialogTitle>
            </DialogHeader>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="text-orange-400">
                <FileText className="w-3.5 h-3.5 inline" />
              </span>
              <div className="group relative">
                <span className="cursor-help border-b border-dotted border-gray-400">Context window</span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max max-w-[200px] bg-gray-900 text-white text-[10px] p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center">
                  Available space in context window
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                </div>
              </div>
              <div className="w-32 h-4 bg-white border border-green-500 rounded-sm relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-green-500 w-[20%]" />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-gray-700 z-10">Usage: 20%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center gap-4 text-xs font-medium">
            <label className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab("upload")}>
              <div className={cn("w-3 h-3 rounded-full border bg-white flex items-center justify-center", activeTab === "upload" ? "border-[4px] border-gray-500 ring-1 ring-gray-500" : "border-gray-300")} />
              <span className={cn(activeTab === "upload" ? "text-gray-900 font-bold" : "text-gray-500")}>Upload new</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab("repository")}>
              <div className={cn("w-3 h-3 rounded-full border bg-white flex items-center justify-center", activeTab === "repository" ? "border-[4px] border-gray-500 ring-1 ring-gray-500" : "border-gray-300")} />
              <span className={cn(activeTab === "repository" ? "text-gray-900 font-bold" : "text-gray-500")}>Select From <span className="text-blue-700">Assets Repository (100)</span></span>
            </label>
          </div>

          {activeTab === "upload" ? (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm flex flex-col gap-2 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all" data-testid="card-google-workspace">
                  <div className="flex items-center gap-2 text-gray-700 font-medium text-xs">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" className="w-4 h-4" alt="Google" />
                    <span>Google Workspace</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-sm text-[10px] font-bold border border-blue-100 flex items-center gap-1">
                      <Database className="w-2.5 h-2.5" /> Google Disk
                    </span>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm flex flex-col gap-2 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all" data-testid="card-add-link">
                  <div className="flex items-center gap-2 text-gray-700 font-medium text-xs">
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Add link</span>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-sm text-[10px] font-bold border border-blue-100 flex items-center gap-1">
                      <Globe className="w-2.5 h-2.5" /> Site
                    </span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-sm text-[10px] font-bold border border-blue-100 flex items-center gap-1">
                      <Play className="w-2.5 h-2.5" /> YouTube
                    </span>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm flex flex-col gap-2 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all" data-testid="card-paste-text">
                  <div className="flex items-center gap-2 text-gray-700 font-medium text-xs">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Paste text</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-sm text-[10px] font-bold border border-blue-100 flex items-center gap-1">
                      <FileText className="w-2.5 h-2.5" /> Copied text
                    </span>
                  </div>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.txt,.md,.mp3,.docx,.avif,.bmp,.gif,.ico,.jp2,.png,.webp,.tif,.tiff,.heic,.heif,.jpeg,.jpg,.jpe"
                className="hidden"
                onChange={handleFileSelect}
                data-testid="input-file-upload"
              />
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 h-40 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-colors"
                data-testid="area-upload-drop"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                  <Upload className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-center space-y-0.5">
                  <h3 className="text-sm font-bold text-gray-800">Upload sources</h3>
                  <p className="text-xs text-blue-600 font-medium">Select file <span className="text-gray-500 font-normal">or drag here.</span></p>
                </div>
                <p className="text-[9px] text-gray-400 max-w-sm text-center leading-relaxed px-4">
                  Supported file types: PDF, txt, Markdown, audio (e.g. MP3 files), docx, avif, .bmp, .gif, .ico, .jp2, .png, .webp, .tif, .tiff, .heic, .heif, .jpeg, .jpg, .jpe.
                </p>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-gray-600">{uploadedFiles.length} file{uploadedFiles.length > 1 ? "s" : ""} selected</span>
                  <div className="space-y-1 max-h-28 overflow-y-auto">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-2.5 py-1.5 text-xs" data-testid={`uploaded-file-${index}`}>
                        <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="text-gray-700 truncate flex-1">{file.name}</span>
                        <span className="text-gray-400 shrink-0">{(file.size / 1024).toFixed(1)} KB</span>
                        <button onClick={(e) => { e.stopPropagation(); removeUploadedFile(index); }} className="text-gray-400 hover:text-red-500 transition-colors shrink-0" data-testid={`button-remove-file-${index}`}>
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="border rounded-md bg-white p-2 h-[260px] overflow-y-auto">
              <div className="space-y-1">
                {repoFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-sm cursor-pointer border-b border-gray-100 last:border-0" onClick={() => toggleRepoFile(file)} data-testid={`row-repo-file-${index}`}>
                    <div className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                      selectedRepoFiles.includes(file) ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white"
                    )}>
                      {selectedRepoFiles.includes(file) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{file}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col items-center gap-4 pt-2">
            {activeTab === "upload" && (
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                <span className="text-xs font-medium text-black">Save 5 files to <span className="text-blue-800">Assets Repository (100)</span></span>
              </label>
            )}
            <div className="flex items-center justify-center gap-6 w-full">
              <Button variant="ghost" size="sm" className="text-[#008DA8] hover:text-[#007A92] hover:bg-transparent font-bold underline h-8 text-xs" onClick={handleCancel} data-testid="button-addfiles-cancel">
                CANCEL
              </Button>
              <Button size="sm" className="bg-[#00802b] hover:bg-[#006622] text-white font-bold px-6 h-8 text-xs" onClick={handleSave} data-testid="button-addfiles-save">
                Save & Add
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
