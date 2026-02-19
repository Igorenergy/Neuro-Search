import { createContext, useContext, useState, useCallback } from "react";

export interface PreviewFile {
  id: string;
  name: string;
  type: string;
  size: string;
  step?: string;
}

interface PreviewState {
  isOpen: boolean;
  files: PreviewFile[];
  activeFileId: string | null;
  context: "input" | "output";
}

interface PreviewActions {
  openPreview: (params: {
    files: PreviewFile[];
    initialFileId?: string;
    context?: "input" | "output";
  }) => void;
  closePreview: () => void;
  setActiveFileId: (id: string) => void;
  deleteFile: (id: string) => void;
}

type PreviewStore = PreviewState & PreviewActions;

const PreviewContext = createContext<PreviewStore | null>(null);

export function PreviewProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PreviewState>({
    isOpen: false,
    files: [],
    activeFileId: null,
    context: "input",
  });

  const openPreview = useCallback(
    ({
      files,
      initialFileId,
      context = "input",
    }: {
      files: PreviewFile[];
      initialFileId?: string;
      context?: "input" | "output";
    }) => {
      setState({
        isOpen: true,
        files,
        activeFileId: initialFileId || files[0]?.id || null,
        context,
      });
    },
    []
  );

  const closePreview = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const setActiveFileId = useCallback((id: string) => {
    setState((prev) => ({ ...prev, activeFileId: id }));
  }, []);

  const deleteFile = useCallback((id: string) => {
    setState((prev) => {
      const newFiles = prev.files.filter((f) => f.id !== id);
      let newActiveId = prev.activeFileId;
      if (prev.activeFileId === id) {
        newActiveId = newFiles[0]?.id || null;
      }
      if (newFiles.length === 0) {
        return { ...prev, isOpen: false, files: [], activeFileId: null };
      }
      return { ...prev, files: newFiles, activeFileId: newActiveId };
    });
  }, []);

  return (
    <PreviewContext.Provider
      value={{ ...state, openPreview, closePreview, setActiveFileId, deleteFile }}
    >
      {children}
    </PreviewContext.Provider>
  );
}

export function usePreviewStore() {
  const ctx = useContext(PreviewContext);
  if (!ctx) throw new Error("usePreviewStore must be used inside PreviewProvider");
  return ctx;
}
