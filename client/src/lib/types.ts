export interface SourceRow {
  id: number;
  title: string;
  domain: string;
  favicon: string;
  date: string;
  location: string;
  language: string;
  confidenceScore: number;
  included: boolean;
  type: "web" | "pdf" | "doc";
}
