// ─── Common ──────────────────────────────────────────
export type ResearchStatus = "success" | "in-progress" | "failed" | "canceled";

// ─── Projects (Dashboard, Layout sidebar, Search) ────
export interface ProjectListItem {
  id: number;
  title: string;
  date: string;
  sources: number;
  status: ResearchStatus;
  hasAttachment: boolean;
  iconIdx: number;
  query: string;
  engine: string;
}

export interface ArchivedProject {
  id: number;
  title: string;
  date: string;
  sources: number;
  status: ResearchStatus;
}

export interface SidebarProject {
  id: number;
  title: string;
  status: ResearchStatus;
}

export interface SearchResultItem {
  id: number;
  title: string;
  sources: number;
  artifacts: number;
  date: string;
}

// ─── Sources ─────────────────────────────────────────
export type SourceType = "web" | "pdf" | "doc" | "csv" | "image";

export interface SourceRow {
  id: number;
  projectId: string;
  title: string;
  domain: string;
  favicon: string;
  url: string;
  date: string;
  location: string;
  language: string;
  confidenceScore: number;
  included: boolean;
  type: SourceType;
  createdAt: string;
  updatedAt: string;
}

// ─── Artifacts ───────────────────────────────────────
export type ArtifactStatus = "ready" | "processing" | "failed";
export type ArtifactFileType = "xlsx" | "pdf" | "docx" | "csv" | "pptx" | "json" | "txt";

export interface ArtifactRow {
  id: number;
  projectId: string;
  name: string;
  fileType: ArtifactFileType;
  fileSize: string;
  status: ArtifactStatus;
  downloadUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Research Progress (In-Progress page) ────────────
export interface ThoughtNode {
  id: string;
  type: "thinking" | "sources";
  title?: string;
  content?: string;
  sources?: { favicon: string; domain: string; title: string }[];
}

export interface ResearchProgress {
  projectId: string;
  elapsedSeconds: number;
  thoughtStream: ThoughtNode[];
  status: "running" | "completed" | "failed" | "canceled";
}

// ─── Research Errors (Failed page) ───────────────────
export interface FailedSourceItem {
  url: string;
  domain: string;
  status: "success" | "failed";
  tokens: number;
  error?: string;
}

export type ErrorScenario = "waf_blocked" | "timeout" | "empty_extraction" | "token_limit";

export interface ResearchErrorData {
  projectId: string;
  sources: FailedSourceItem[];
  errorLog: string;
  activeScenario: ErrorScenario;
}

// ─── Action Required ─────────────────────────────────
export interface ActionRequiredData {
  projectId: string;
  partialContent: string;
  totalPages: number;
  completionPercent: number;
}

// ─── Data Repository (Assets page) ───────────────────
export interface RepoFolder {
  id: number;
  name: string;
  count: number;
}

export interface RepoFile {
  id: number;
  name: string;
  type: string;
  date: string;
  size: string;
}

export interface StorageStats {
  usedGb: number;
  totalGb: number;
  usedPercent: number;
}

export interface DataRepositoryData {
  folders: RepoFolder[];
  files: RepoFile[];
  storage: StorageStats;
}

// ─── User / Auth ─────────────────────────────────────
export interface CurrentUser {
  id: string;
  name: string;
  teamName: string;
  balanceFormatted: string;
}

// ─── Launcher ────────────────────────────────────────
export interface AttachedFile {
  name: string;
  type: string;
  size: string;
  step: "step1" | "step2";
}

// ─── Profile & Settings ─────────────────────────────
export interface NotificationPreferences {
  emailNotifications: boolean;
  researchCompleted: boolean;
  researchFailed: boolean;
  weeklyDigest: boolean;
  teamMentions: boolean;
}

export interface ActiveSession {
  id: string;
  browser: string;
  os: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface ProfileSettings {
  id: string;
  fullName: string;
  email: string;
  role: string;
  teamName: string;
  avatarUrl: string | null;
  twoFactorEnabled: boolean;
  notifications: NotificationPreferences;
  theme: "light" | "dark" | "system";
  language: string;
  compactMode: boolean;
  sessions: ActiveSession[];
}

// ─── Project Detail ──────────────────────────────────
export interface ProjectDetail {
  id: string;
  query: string;
  status: string;
  sourcesCount: number;
  artifactsCount: number;
  progress: number;
  progressLabel: string;
  createdAt: string;
}
