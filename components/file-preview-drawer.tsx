"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Trash2, Download, FileText, FileSpreadsheet, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { usePreviewStore, type PreviewFile } from "@/lib/preview-store";
import { AnimatePresence, motion } from "framer-motion";

const WIDTH_KEY = "user_drawer_width";

type DrawerWidth = "auto" | "50" | "80" | "100";

function getAutoWidth(fileType: string): string {
  const t = fileType.toLowerCase();
  if (["xlsx", "csv", "xls"].includes(t)) return "80%";
  if (["pdf"].includes(t)) return "60%";
  return "50%";
}

function resolveWidth(setting: DrawerWidth, fileType: string): string {
  if (setting === "auto") return getAutoWidth(fileType);
  return `${setting}%`;
}

function getFileIcon(type: string) {
  const t = type.toLowerCase();
  if (["xlsx", "csv", "xls"].includes(t)) return FileSpreadsheet;
  if (["pdf", "doc", "docx", "txt"].includes(t)) return FileText;
  return File;
}

function MockSpreadsheet({ file }: { file: PreviewFile }) {
  const rows = [
    ["#", "Company Name", "Industry", "Revenue ($M)", "Employees", "Founded", "Status"],
    ["1", "Acme Corp", "Technology", "142.5", "850", "2015", "Active"],
    ["2", "Beta Industries", "Manufacturing", "89.3", "420", "2008", "Active"],
    ["3", "Gamma Solutions", "Consulting", "56.7", "210", "2018", "Active"],
    ["4", "Delta Systems", "Healthcare", "203.1", "1,200", "2010", "Active"],
    ["5", "Epsilon Labs", "Biotech", "78.9", "340", "2019", "Pending"],
    ["6", "Zeta Analytics", "Data Science", "45.2", "180", "2020", "Active"],
    ["7", "Eta Ventures", "Finance", "312.4", "890", "2005", "Active"],
    ["8", "Theta Group", "Real Estate", "167.8", "560", "2012", "Active"],
    ["9", "Iota Digital", "Marketing", "34.6", "150", "2021", "New"],
    ["10", "Kappa Networks", "Telecom", "98.5", "410", "2016", "Active"],
  ];
  return (
    <div className="overflow-auto h-full">
      <table className="w-full text-xs border-collapse">
        <thead className="sticky top-0 z-10">
          <tr>
            {rows[0].map((h, i) => (
              <th
                key={i}
                className="bg-gray-100 border border-gray-300 px-3 py-2 text-left font-bold text-gray-700 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(1).map((row, ri) => (
            <tr key={ri} className="hover:bg-blue-50/50">
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="border border-gray-200 px-3 py-1.5 text-gray-700 whitespace-nowrap"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MockPdfViewer({ file }: { file: PreviewFile }) {
  return (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <div className="text-center space-y-4 max-w-md">
        <FileText className="w-16 h-16 text-gray-300 mx-auto" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-gray-700">{file.name}</p>
          <p className="text-xs text-gray-500">{file.size}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-md p-6 text-left space-y-3">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-[90%]" />
          <div className="h-3 bg-gray-200 rounded w-[95%]" />
          <div className="h-3 bg-gray-100 rounded w-[60%]" />
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-[85%]" />
          <div className="h-3 bg-gray-100 rounded w-[70%]" />
          <div className="h-3 bg-gray-200 rounded w-[92%]" />
        </div>
      </div>
    </div>
  );
}

function MockTextViewer({ file }: { file: PreviewFile }) {
  return (
    <div className="p-6 h-full overflow-auto bg-white">
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-lg font-bold text-gray-800">{file.name}</h2>
        <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
          <p>
            This document contains detailed analysis and findings from the research conducted
            during the initial phase of the project. The methodology employed combines
            quantitative data analysis with qualitative assessment of market trends.
          </p>
          <p>
            Key findings indicate significant growth potential in the target market segments,
            with an estimated compound annual growth rate of 12.5% over the next five years.
            The competitive landscape remains fragmented, presenting opportunities for
            strategic positioning.
          </p>
          <p>
            Recommendations include focused investment in technology infrastructure,
            strategic partnerships with established players, and phased market entry
            to minimize risk exposure while maximizing early-mover advantage.
          </p>
        </div>
      </div>
    </div>
  );
}

function FileContentViewer({ file }: { file: PreviewFile }) {
  const ext = file.type.toLowerCase();
  if (["xlsx", "csv", "xls"].includes(ext)) return <MockSpreadsheet file={file} />;
  if (["pdf"].includes(ext)) return <MockPdfViewer file={file} />;
  return <MockTextViewer file={file} />;
}

export default function FilePreviewDrawer() {
  const {
    isOpen,
    files,
    activeFileId,
    context,
    closePreview,
    setActiveFileId,
    deleteFile,
  } = usePreviewStore();

  const [widthSetting, setWidthSetting] = useState<DrawerWidth>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(WIDTH_KEY) as DrawerWidth) || "auto";
    }
    return "auto";
  });

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(WIDTH_KEY, widthSetting);
  }, [widthSetting]);

  const activeFile = useMemo(
    () => files.find((f) => f.id === activeFileId) || files[0] || null,
    [files, activeFileId]
  );

  const computedWidth = activeFile
    ? resolveWidth(widthSetting, activeFile.type)
    : "50%";

  const widthLabel =
    widthSetting === "auto"
      ? "Auto"
      : widthSetting === "50"
      ? "50%"
      : widthSetting === "80"
      ? "80%"
      : "100%";

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={closePreview}
              data-testid="preview-overlay"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 right-0 h-screen z-50 bg-white shadow-2xl flex flex-col border-l border-gray-200"
              style={{ width: computedWidth }}
              data-testid="file-preview-drawer"
            >
              {/* A. Top Header (System Bar) */}
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between shrink-0">
                <span className="text-xs font-bold text-gray-600">
                  {context === "input"
                    ? `Attached files (${files.length})`
                    : `Generated Artifacts (${files.length})`}
                </span>
                <div className="flex items-center gap-3">
                  <Select
                    value={widthSetting}
                    onValueChange={(v: DrawerWidth) => setWidthSetting(v)}
                  >
                    <SelectTrigger
                      className="h-7 w-[130px] text-[11px] border-gray-300 bg-white"
                      data-testid="select-drawer-width"
                    >
                      <SelectValue placeholder="Window width" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="50">50%</SelectItem>
                      <SelectItem value="80">80%</SelectItem>
                      <SelectItem value="100">100%</SelectItem>
                    </SelectContent>
                  </Select>
                  <button
                    className="w-7 h-7 bg-black rounded-sm flex items-center justify-center hover:bg-gray-800 transition-colors"
                    onClick={closePreview}
                    data-testid="button-close-preview"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* B. Action Toolbar */}
              <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between gap-3 shrink-0">
                <Select
                  value={activeFileId || ""}
                  onValueChange={(v) => setActiveFileId(v)}
                >
                  <SelectTrigger
                    className="flex-1 h-9 text-xs border-gray-300 bg-white"
                    data-testid="select-preview-file"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {activeFile && (
                        <>
                          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-sm shrink-0">
                            {activeFile.type}
                          </span>
                          <span className="truncate">{activeFile.name}</span>
                        </>
                      )}
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {files.map((f) => {
                      const Icon = getFileIcon(f.type);
                      return (
                        <SelectItem key={f.id} value={f.id}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1 py-0.5 rounded-sm shrink-0">
                              {f.type}
                            </span>
                            <span className="truncate">{f.name}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2 shrink-0">
                  {context === "input" && activeFile && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setConfirmDeleteId(activeFile.id)}
                      data-testid="button-preview-delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-[#008DA8] hover:text-[#006E7D] hover:bg-blue-50"
                    data-testid="button-preview-download"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* C. Main Content Viewer */}
              <div className="flex-1 overflow-hidden bg-gray-50">
                {activeFile ? (
                  <FileContentViewer file={activeFile} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-gray-400">No file selected</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirm Delete Modal */}
      <Dialog
        open={!!confirmDeleteId}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
      >
        <DialogContent className="max-w-[400px] p-0 gap-0 bg-white overflow-hidden border border-gray-200 shadow-xl rounded-md">
          <div className="flex items-center justify-between p-3 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">Confirm Deletion</h2>
          </div>
          <div className="p-5 space-y-4">
            <p className="text-sm font-medium text-gray-800">
              Are you sure you want to delete "
              {files.find((f) => f.id === confirmDeleteId)?.name}"?
            </p>
            <p className="text-sm text-[#0097B2] font-medium leading-relaxed">
              This file will be removed from the research project. This action cannot
              be undone.
            </p>
            <div className="flex items-center justify-between pt-4">
              <button
                className="text-xs font-medium text-gray-900 underline hover:text-gray-700"
                onClick={() => setConfirmDeleteId(null)}
                data-testid="button-cancel-preview-delete"
              >
                Cancel
              </button>
              <Button
                variant="outline"
                className="border-red-400 text-red-500 hover:bg-red-50 hover:text-red-600 h-9 px-6 text-xs font-bold bg-white"
                onClick={() => {
                  if (confirmDeleteId) {
                    deleteFile(confirmDeleteId);
                    setConfirmDeleteId(null);
                  }
                }}
                data-testid="button-confirm-preview-delete"
              >
                Yes, Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
