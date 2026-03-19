import { useQuery } from "@tanstack/react-query";
import type { CurrentUser } from "@/lib/types";

const MOCK_USER: CurrentUser = {
  id: "1",
  name: "Ivan Petrov",
  teamName: "Company/Team name",
  balanceFormatted: "5.8K available",
};

export function useCurrentUser() {
  return useQuery<CurrentUser>({
    queryKey: ["/api/user/me"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/user/me");
        if (!res.ok) throw new Error("Failed");
        return res.json();
      } catch {
        return MOCK_USER;
      }
    },
  });
}
