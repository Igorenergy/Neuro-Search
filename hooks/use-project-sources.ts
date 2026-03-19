import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { SourceRow } from "@/lib/types";

const MOCK_SOURCES: SourceRow[] = [
  { id: 1, projectId: "1", title: "Strategic Audit Dashboard-Full Dataset...", domain: "parallelai.tech", favicon: "https://www.google.com/s2/favicons?domain=parallelai.tech&sz=16", url: "https://parallelai.tech/audit", date: "10.05.2025", location: "USA", language: "En", confidenceScore: 95, included: true, type: "web", createdAt: "2025-05-10", updatedAt: "2025-05-10" },
  { id: 2, projectId: "1", title: "Strategic Audit Dashboard-Full Dataset...", domain: "parallel.ai", favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", url: "https://parallel.ai/dataset", date: "10.05.2025", location: "USA", language: "En", confidenceScore: 50, included: true, type: "web", createdAt: "2025-05-10", updatedAt: "2025-05-10" },
  { id: 3, projectId: "1", title: "Strategic Audit Dashboard-Full Dataset...", domain: "medium.com", favicon: "https://www.google.com/s2/favicons?domain=medium.com&sz=16", url: "https://medium.com/audit-article", date: "10.05.2025", location: "USA", language: "En", confidenceScore: 50, included: true, type: "web", createdAt: "2025-05-10", updatedAt: "2025-05-10" },
  { id: 4, projectId: "1", title: "Market Analysis Report 2025: Bioplast...", domain: "mckinsey.com", favicon: "https://www.google.com/s2/favicons?domain=mckinsey.com&sz=16", url: "https://mckinsey.com/reports/bioplast", date: "08.04.2025", location: "Global", language: "En", confidenceScore: 92, included: true, type: "pdf", createdAt: "2025-04-08", updatedAt: "2025-04-08" },
  { id: 5, projectId: "1", title: "Industry Trends & Forecasts Q2 2025...", domain: "reuters.com", favicon: "https://www.google.com/s2/favicons?domain=reuters.com&sz=16", url: "https://reuters.com/trends-q2", date: "15.03.2025", location: "UK", language: "En", confidenceScore: 88, included: false, type: "web", createdAt: "2025-03-15", updatedAt: "2025-03-15" },
  { id: 6, projectId: "1", title: "Competitive Landscape Review: Enterprise...", domain: "gartner.com", favicon: "https://www.google.com/s2/favicons?domain=gartner.com&sz=16", url: "https://gartner.com/landscape", date: "22.04.2025", location: "USA", language: "En", confidenceScore: 85, included: true, type: "web", createdAt: "2025-04-22", updatedAt: "2025-04-22" },
  { id: 7, projectId: "1", title: "Technology Stack Assessment for Growth...", domain: "techcrunch.com", favicon: "https://www.google.com/s2/favicons?domain=techcrunch.com&sz=16", url: "https://techcrunch.com/tech-stack", date: "01.05.2025", location: "USA", language: "En", confidenceScore: 72, included: true, type: "web", createdAt: "2025-05-01", updatedAt: "2025-05-01" },
  { id: 8, projectId: "1", title: "Financial Performance Data & Analytics...", domain: "bloomberg.com", favicon: "https://www.google.com/s2/favicons?domain=bloomberg.com&sz=16", url: "https://bloomberg.com/financial-data", date: "05.05.2025", location: "USA", language: "En", confidenceScore: 91, included: true, type: "web", createdAt: "2025-05-05", updatedAt: "2025-05-05" },
  { id: 9, projectId: "1", title: "Regulatory Framework Update: EU Market...", domain: "ec.europa.eu", favicon: "https://www.google.com/s2/favicons?domain=ec.europa.eu&sz=16", url: "https://ec.europa.eu/regulation", date: "28.03.2025", location: "EU", language: "En", confidenceScore: 78, included: false, type: "pdf", createdAt: "2025-03-28", updatedAt: "2025-03-28" },
  { id: 10, projectId: "1", title: "Consumer Behavior Insights: Digital Tran...", domain: "statista.com", favicon: "https://www.google.com/s2/favicons?domain=statista.com&sz=16", url: "https://statista.com/consumer-insights", date: "12.04.2025", location: "Global", language: "En", confidenceScore: 82, included: true, type: "web", createdAt: "2025-04-12", updatedAt: "2025-04-12" },
  { id: 11, projectId: "1", title: "Supply Chain Risk Assessment Report...", domain: "deloitte.com", favicon: "https://www.google.com/s2/favicons?domain=deloitte.com&sz=16", url: "https://deloitte.com/supply-chain", date: "18.04.2025", location: "USA", language: "En", confidenceScore: 87, included: true, type: "pdf", createdAt: "2025-04-18", updatedAt: "2025-04-18" },
  { id: 12, projectId: "1", title: "Innovation Pipeline: Key Patents & R&D...", domain: "patents.google.com", favicon: "https://www.google.com/s2/favicons?domain=patents.google.com&sz=16", url: "https://patents.google.com/innovation", date: "20.04.2025", location: "Global", language: "En", confidenceScore: 69, included: false, type: "web", createdAt: "2025-04-20", updatedAt: "2025-04-20" },
];

function sourcesQueryKey(projectId: string) {
  return ["/api/projects", projectId, "sources"] as const;
}

export function useProjectSources(projectId: string) {
  return useQuery<SourceRow[]>({
    queryKey: sourcesQueryKey(projectId),
    queryFn: async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/sources`);
        if (!res.ok) throw new Error("Failed to fetch sources");
        const data = await res.json();
        if (data.length === 0) return MOCK_SOURCES;
        return data;
      } catch {
        return MOCK_SOURCES;
      }
    },
  });
}

export function useToggleSourceInclusion(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sourceId, included }: { sourceId: number; included: boolean }) => {
      const res = await apiRequest("PATCH", `/api/sources/${sourceId}`, { included });
      return res.json();
    },
    onMutate: async ({ sourceId, included }) => {
      await queryClient.cancelQueries({ queryKey: sourcesQueryKey(projectId) });
      const previous = queryClient.getQueryData<SourceRow[]>(sourcesQueryKey(projectId));
      queryClient.setQueryData<SourceRow[]>(sourcesQueryKey(projectId), (old) =>
        old?.map((s) => (s.id === sourceId ? { ...s, included } : s))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(sourcesQueryKey(projectId), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: sourcesQueryKey(projectId) });
    },
  });
}

export function useDeleteSource(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sourceId: number) => {
      await apiRequest("DELETE", `/api/sources/${sourceId}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: sourcesQueryKey(projectId) });
    },
  });
}
