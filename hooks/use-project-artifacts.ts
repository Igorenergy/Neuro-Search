import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ArtifactRow } from "@/lib/types";

const MOCK_ARTIFACTS: ArtifactRow[] = [
  { id: 1, projectId: "1", name: "Competitors_Comparison_v1.xlsx", fileType: "xlsx", fileSize: "0.54 Мб", status: "ready", downloadUrl: "/files/competitors-v1.xlsx", createdAt: "2025-05-10", updatedAt: "2025-05-10" },
  { id: 2, projectId: "1", name: "Competitors_Comparison_v1.pdf", fileType: "pdf", fileSize: "0.54 Мб", status: "processing", downloadUrl: null, createdAt: "2025-05-10", updatedAt: "2025-05-10" },
];

function artifactsQueryKey(projectId: string) {
  return ["/api/projects", projectId, "artifacts"] as const;
}

export function useProjectArtifacts(projectId: string) {
  return useQuery<ArtifactRow[]>({
    queryKey: artifactsQueryKey(projectId),
    queryFn: async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/artifacts`);
        if (!res.ok) throw new Error("Failed to fetch artifacts");
        const data = await res.json();
        if (data.length === 0) return MOCK_ARTIFACTS;
        return data;
      } catch {
        return MOCK_ARTIFACTS;
      }
    },
  });
}

export function useCreateArtifact(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<ArtifactRow>) => {
      const res = await apiRequest("POST", `/api/projects/${projectId}/artifacts`, data);
      return res.json();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: artifactsQueryKey(projectId) });
    },
  });
}

export function useDeleteArtifact(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (artifactId: number) => {
      await apiRequest("DELETE", `/api/artifacts/${artifactId}`);
    },
    onMutate: async (artifactId) => {
      await queryClient.cancelQueries({ queryKey: artifactsQueryKey(projectId) });
      const previous = queryClient.getQueryData<ArtifactRow[]>(artifactsQueryKey(projectId));
      queryClient.setQueryData<ArtifactRow[]>(artifactsQueryKey(projectId), (old) =>
        old?.filter((a) => a.id !== artifactId)
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(artifactsQueryKey(projectId), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: artifactsQueryKey(projectId) });
    },
  });
}
