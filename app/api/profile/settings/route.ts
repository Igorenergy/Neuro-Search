import { NextResponse } from "next/server";
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

export async function GET() {
  return NextResponse.json(MOCK_PROFILE);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const updated = { ...MOCK_PROFILE, ...body };
  return NextResponse.json(updated);
}
