import type { AttachedFile } from "@/lib/types";

export interface LaunchConfig {
  query: string;
  researchType: "search" | "sheet";
  dataEngine: string;
  geoScope: string;
  selectedLanguages: string[];
  attachedFiles: AttachedFile[];
  planText: string;
  planVersion: number;
  totalVersions: number;
  budgetCap: boolean;
  deepCrawlEnabled: boolean;
  showReasoning: boolean;
}

const STORAGE_KEY = "acuras_launch_config";
const CLONE_DRAFT_KEY = "acuras_clone_draft";

const isBrowser = typeof window !== "undefined";

export function saveLaunchConfig(config: LaunchConfig) {
  if (!isBrowser) return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function loadLaunchConfig(): LaunchConfig | null {
  if (!isBrowser) return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LaunchConfig;
  } catch {
    return null;
  }
}

export interface CloneDraftState {
  query: string;
  engine: string;
  files: AttachedFile[];
  deepCrawlEnabled: boolean;
  showReasoning: boolean;
  geoScope: string;
  selectedLanguages: string[];
  researchType: "search" | "sheet";
}

export function saveCloneDraft(draft: CloneDraftState) {
  if (!isBrowser) return;
  sessionStorage.setItem(CLONE_DRAFT_KEY, JSON.stringify(draft));
}

export function loadCloneDraft(): CloneDraftState | null {
  if (!isBrowser) return null;
  const raw = sessionStorage.getItem(CLONE_DRAFT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CloneDraftState;
  } catch {
    return null;
  }
}

export function clearCloneDraft() {
  if (!isBrowser) return;
  sessionStorage.removeItem(CLONE_DRAFT_KEY);
}
