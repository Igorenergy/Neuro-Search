export interface LaunchConfig {
  query: string;
  researchType: "search" | "sheet";
  dataEngine: string;
  geoScope: string;
  selectedLanguages: string[];
  attachedFiles: { name: string; type: string; size: string; step: "step1" | "step2" }[];
  planText: string;
  planVersion: number;
  totalVersions: number;
  budgetCap: boolean;
  deepCrawlEnabled: boolean;
  showReasoning: boolean;
}

const STORAGE_KEY = "acuras_launch_config";
const CLONE_DRAFT_KEY = "acuras_clone_draft";

export function saveLaunchConfig(config: LaunchConfig) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function loadLaunchConfig(): LaunchConfig | null {
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
  files: { name: string; type: string; size: string; step: "step1" | "step2" }[];
  deepCrawlEnabled: boolean;
  showReasoning: boolean;
  geoScope: string;
  selectedLanguages: string[];
  researchType: "search" | "sheet";
}

export function saveCloneDraft(draft: CloneDraftState) {
  sessionStorage.setItem(CLONE_DRAFT_KEY, JSON.stringify(draft));
}

export function loadCloneDraft(): CloneDraftState | null {
  const raw = sessionStorage.getItem(CLONE_DRAFT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CloneDraftState;
  } catch {
    return null;
  }
}

export function clearCloneDraft() {
  sessionStorage.removeItem(CLONE_DRAFT_KEY);
}
