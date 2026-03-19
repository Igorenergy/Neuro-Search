import { useQuery } from "@tanstack/react-query";
import type { ExportItem } from "@/lib/types";

const MOCK_EXPORTS: ExportItem[] = [
  { id: "e1", name: "Competitors_Comparison_v1.xlsx", projectName: "Реестр 402 Компаний: Полный анализ и стратегический обзор", format: "xlsx", fileSize: "0.54 MB", status: "ready", exportedAt: "2025-05-10 14:32", expiresAt: "2025-06-10", downloadUrl: "/files/competitors-v1.xlsx" },
  { id: "e2", name: "Competitors_Comparison_v1.pdf", projectName: "Реестр 402 Компаний: Полный анализ и стратегический обзор", format: "pdf", fileSize: "1.2 MB", status: "ready", exportedAt: "2025-05-10 14:33", expiresAt: "2025-06-10", downloadUrl: "/files/competitors-v1.pdf" },
  { id: "e3", name: "Market_Research_2024_Full.zip", projectName: "Market Research 2024", format: "zip", fileSize: "24.8 MB", status: "ready", exportedAt: "2025-05-08 09:15", expiresAt: "2025-06-08", downloadUrl: "/files/market-research-2024.zip" },
  { id: "e4", name: "Q3_Financials_Summary.pdf", projectName: "Q3 Financials", format: "pdf", fileSize: "3.1 MB", status: "ready", exportedAt: "2025-05-07 16:45", expiresAt: "2025-06-07", downloadUrl: "/files/q3-summary.pdf" },
  { id: "e5", name: "Startup_Due_Diligence_Report.docx", projectName: "Startup Due Diligence", format: "docx", fileSize: "2.7 MB", status: "ready", exportedAt: "2025-05-05 11:20", expiresAt: "2025-06-05", downloadUrl: "/files/due-diligence.docx" },
  { id: "e6", name: "Sources_Export_Raw.csv", projectName: "Реестр 402 Компаний: Полный анализ и стратегический обзор", format: "csv", fileSize: "890 KB", status: "ready", exportedAt: "2025-05-04 10:00", expiresAt: "2025-06-04", downloadUrl: "/files/sources-raw.csv" },
  { id: "e7", name: "Investment_Analysis_Full.zip", projectName: "Trading & Investing", format: "zip", fileSize: "18.3 MB", status: "processing", exportedAt: "2025-05-03 08:30", expiresAt: "—", downloadUrl: null },
  { id: "e8", name: "NFT_Market_Overview.pdf", projectName: "NFT как Инвестиционный Актив", format: "pdf", fileSize: "5.4 MB", status: "expired", exportedAt: "2025-03-15 12:00", expiresAt: "2025-04-15", downloadUrl: null },
  { id: "e9", name: "Crypto_Analysis_Data.json", projectName: "Мемуары Криптана: Ретроспективный анализ", format: "json", fileSize: "1.8 MB", status: "ready", exportedAt: "2025-05-02 19:10", expiresAt: "2025-06-02", downloadUrl: "/files/crypto-data.json" },
  { id: "e10", name: "AI_Startups_Landscape.xlsx", projectName: "Искусственный Интеллект и Будущее Технологий", format: "xlsx", fileSize: "4.2 MB", status: "ready", exportedAt: "2025-05-01 15:45", expiresAt: "2025-06-01", downloadUrl: "/files/ai-startups.xlsx" },
];

export function useExports() {
  return useQuery<ExportItem[]>({
    queryKey: ["/api/exports"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/exports");
        if (!res.ok) throw new Error("Failed");
        return res.json();
      } catch {
        return MOCK_EXPORTS;
      }
    },
  });
}
