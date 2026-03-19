"use client";

import { useState } from "react";
import {
  Check,
  ExternalLink,
  Settings,
  Trash2,
  RefreshCw,
  Zap,
  HardDrive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  account?: string;
  lastSync?: string;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "google-drive",
      name: "Google Drive",
      description: "Import files directly from your Google Drive. Access documents, spreadsheets, and presentations for your research.",
      icon: "google-drive",
      connected: false,
    },
  ]);

  const [connecting, setConnecting] = useState<string | null>(null);

  function handleConnect(id: string) {
    setConnecting(id);
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((i) =>
          i.id === id
            ? { ...i, connected: true, account: "user@gmail.com", lastSync: "Just now" }
            : i
        )
      );
      setConnecting(null);
    }, 1500);
  }

  function handleDisconnect(id: string) {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, connected: false, account: undefined, lastSync: undefined }
          : i
      )
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
            <Zap className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
            <p className="text-sm text-gray-500">Connect external services to enhance your research workflow</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className={cn(
              "bg-white border rounded-lg p-5 transition-all",
              integration.connected
                ? "border-green-200 shadow-sm"
                : "border-gray-200"
            )}
          >
            <div className="flex items-start gap-4">
              <GoogleDriveIcon />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-gray-900">{integration.name}</h3>
                  {integration.connected && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3" />
                      Connected
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-3">{integration.description}</p>

                {integration.connected ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-xs text-gray-600 bg-gray-50 rounded-md px-3 py-2">
                      <span className="flex items-center gap-1.5">
                        <span className="font-medium text-gray-500">Account:</span>
                        {integration.account}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="flex items-center gap-1.5">
                        <span className="font-medium text-gray-500">Last sync:</span>
                        {integration.lastSync}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1.5"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Sync now
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1.5"
                      >
                        <Settings className="w-3 h-3" />
                        Settings
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                        onClick={() => handleDisconnect(integration.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                        Disconnect
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleConnect(integration.id)}
                    disabled={connecting === integration.id}
                    className="bg-[#008DA8] hover:bg-[#007a94] text-white text-xs h-9 px-5 gap-2"
                  >
                    {connecting === integration.id ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-3.5 h-3.5" />
                        Connect Google Drive
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Coming soon placeholder */}
        <div className="border border-dashed border-gray-300 rounded-lg p-5 flex items-center gap-4 opacity-60">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600">More integrations coming soon</h3>
            <p className="text-xs text-gray-400 mt-0.5">Notion, Dropbox, OneDrive, Slack and more</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleDriveIcon() {
  return (
    <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
      <svg width="24" height="24" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
        <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
        <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-20.4 35.3c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
        <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
        <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
        <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
        <path d="m73.4 26.5-10.1-17.5c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 23.8h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
      </svg>
    </div>
  );
}
