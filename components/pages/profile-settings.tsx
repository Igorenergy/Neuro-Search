"use client";

import { useState, useEffect } from "react";
import { User, Shield, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useProfileSettings, useUpdateProfile } from "@/hooks/use-profile-settings";

export default function ProfileSettings() {
  const { data: profile, isLoading } = useProfileSettings();
  const updateProfile = useUpdateProfile();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [teamName, setTeamName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName);
      setEmail(profile.email);
      setTeamName(profile.teamName);
    }
  }, [profile]);

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-[#008DA8] rounded-full" />
      </div>
    );
  }

  function handleSaveProfile() {
    updateProfile.mutate(
      { fullName, email, teamName },
      {
        onSuccess: () => {
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 2000);
        },
      }
    );
  }

  function handleSavePassword() {
    if (newPassword !== confirmPassword) return;
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile & Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account and security</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-gray-100 border border-gray-200 p-1 mb-6 w-full justify-start gap-1">
          <TabsTrigger value="profile" className="gap-1.5 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <User className="w-3.5 h-3.5" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Shield className="w-3.5 h-3.5" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* ── Profile Tab ──────────────────────────────── */}
        <TabsContent value="profile">
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <button className="absolute bottom-0 right-0 w-7 h-7 bg-[#008DA8] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#007a94] transition-colors">
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{profile.fullName}</p>
                <p className="text-sm text-gray-500">{profile.role}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs font-medium text-gray-600">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium text-gray-600">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="role" className="text-xs font-medium text-gray-600">Role</Label>
                <Input
                  id="role"
                  value={profile.role}
                  disabled
                  className="bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="teamName" className="text-xs font-medium text-gray-600">Team Name</Label>
                <Input
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 flex items-center gap-3">
              <Button
                onClick={handleSaveProfile}
                disabled={updateProfile.isPending}
                className="bg-[#008DA8] hover:bg-[#007a94] text-white text-xs px-6"
              >
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </Button>
              {saveSuccess && (
                <span className="text-xs text-green-600 font-medium animate-in fade-in">Changes saved successfully</span>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ── Security Tab ─────────────────────────────── */}
        <TabsContent value="security">
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
            <h3 className="text-sm font-semibold text-gray-900">Change Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="currentPassword" className="text-xs font-medium text-gray-600">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newPassword" className="text-xs font-medium text-gray-600">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-medium text-gray-600">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
            </div>
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-500">Passwords do not match</p>
            )}
            <Button
              onClick={handleSavePassword}
              disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
              className="bg-[#008DA8] hover:bg-[#007a94] text-white text-xs px-6"
            >
              Update Password
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
