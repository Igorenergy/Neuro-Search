import { useQuery } from "@tanstack/react-query";
import type { DataRepositoryData } from "@/lib/types";

const MOCK_DATA: DataRepositoryData = {
  folders: [
    { id: 1, name: "Market Research 2024", count: 12 },
    { id: 2, name: "Competitor Analysis", count: 8 },
    { id: 3, name: "Q3 Financials", count: 5 },
    { id: 4, name: "Startup Due Diligence", count: 24 },
    { id: 5, name: "Raw Datasets", count: 3 },
    { id: 6, name: "Generated Reports", count: 15 },
    { id: 7, name: "Legal Documents", count: 7 },
    { id: 8, name: "Investor Decks", count: 10 },
    { id: 9, name: "Growth Analysis", count: 6 },
    { id: 10, name: "Job Pilot", count: 4 },
    { id: 11, name: "NS Platform", count: 9 },
    { id: 12, name: "White Papers", count: 11 },
    { id: 13, name: "LinkedIn Posts", count: 18 },
    { id: 14, name: "Profi Group", count: 3 },
    { id: 15, name: "Shared Projects", count: 7 },
    { id: 16, name: "Trading & Investing", count: 14 },
  ],
  files: [
    { id: 101, name: "nvidia_annual_report.pdf", type: "pdf", date: "Today, 10:23 AM", size: "4.2 MB" },
    { id: 102, name: "leads_export_v2.csv", type: "csv", date: "Yesterday, 4:15 PM", size: "1.8 MB" },
    { id: 103, name: "project_roadmap.docx", type: "doc", date: "Dec 4, 2025", size: "245 KB" },
    { id: 104, name: "q3_revenue_chart.png", type: "image", date: "Dec 3, 2025", size: "1.2 MB" },
    { id: 105, name: "meeting_notes_dec.txt", type: "txt", date: "Dec 2, 2025", size: "12 KB" },
  ],
  storage: { usedGb: 6.18, totalGb: 15, usedPercent: 41 },
};

export function useDataRepository() {
  return useQuery<DataRepositoryData>({
    queryKey: ["/api/data-repository"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/data-repository");
        if (!res.ok) throw new Error("Failed");
        return res.json();
      } catch {
        return MOCK_DATA;
      }
    },
  });
}
