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
