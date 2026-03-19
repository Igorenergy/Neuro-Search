import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProfileSettings } from "@/lib/types";

const MOCK_PROFILE: ProfileSettings = {
  id: "1",
  fullName: "Ivan Petrov",
  email: "ivan.petrov@company.com",
  role: "Research Lead",
  teamName: "Company/Team name",
  avatarUrl: null,
  twoFactorEnabled: false,
  notifications: {
    emailNotifications: true,
    researchCompleted: true,
    researchFailed: true,
    weeklyDigest: false,
    teamMentions: true,
  },
  theme: "light",
  language: "en",
  compactMode: false,
  sessions: [
    {
      id: "s1",
      browser: "Chrome 124",
      os: "macOS 15.3",
      lastActive: "Now",
      isCurrent: true,
    },
    {
      id: "s2",
      browser: "Safari 18",
      os: "iPhone 16",
      lastActive: "2 hours ago",
      isCurrent: false,
    },
    {
      id: "s3",
      browser: "Firefox 130",
      os: "Windows 11",
      lastActive: "3 days ago",
      isCurrent: false,
    },
  ],
};

export function useProfileSettings() {
  return useQuery<ProfileSettings>({
    queryKey: ["/api/profile/settings"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/profile/settings");
        if (!res.ok) throw new Error("Failed");
        return res.json();
      } catch {
        return MOCK_PROFILE;
      }
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<ProfileSettings>) => {
      const res = await fetch("/api/profile/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      return res.json();
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["/api/profile/settings"], updated);
    },
  });
}
