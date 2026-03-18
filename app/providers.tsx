"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PreviewProvider } from "@/lib/preview-store";
import { Toaster } from "@/components/ui/toaster";
import FilePreviewDrawer from "@/components/file-preview-drawer";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PreviewProvider>
          <Toaster />
          {children}
          <FilePreviewDrawer />
        </PreviewProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
