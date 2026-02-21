import { useState, useCallback } from "react";
import { Copy, Check, Lock, Globe, FileText, Database, BarChart3 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch as ToggleSwitch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import rocketIcon from "@assets/image_1771405092616.png";

interface ShareProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  projectId?: string;
}

export default function ShareProjectModal({
  open,
  onOpenChange,
  title,
  projectId = "req_8f72k",
}: ShareProjectModalProps) {
  const [reportsVisible, setReportsVisible] = useState(true);
  const [sourcesVisible, setSourcesVisible] = useState(true);
  const [artifactsVisible, setArtifactsVisible] = useState(true);

  const [accessLevel, setAccessLevel] = useState("restricted");
  const [permissions, setPermissions] = useState("view");

  const [copied, setCopied] = useState(false);

  const shareUrl = `app.yoursite.com/share/${projectId}...`;

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(shareUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shareUrl]);

  const handleSaveAndCopy = useCallback(() => {
    navigator.clipboard.writeText(shareUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onOpenChange(false);
    }, 1500);
  }, [shareUrl, onOpenChange]);

  const handleOpenChange = (val: boolean) => {
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-white border-gray-200 p-0 gap-0 [&>button]:hidden max-h-[90vh] flex flex-col">
        <DialogHeader className="px-5 pt-4 pb-0 shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-[17px] font-bold text-gray-900">Share Project</DialogTitle>
            <button
              onClick={() => handleOpenChange(false)}
              className="w-7 h-7 flex items-center justify-center bg-black rounded-[2px] hover:bg-gray-800 transition-colors"
              data-testid="button-close-share"
            >
              <span className="text-white text-sm font-bold leading-none">&#x2715;</span>
            </button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-5 pt-3 pb-4 space-y-5">
          <div className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-md p-3">
            <img src={rocketIcon} alt="" className="w-6 h-6 mt-0.5 shrink-0" />
            <p className="text-sm text-gray-700 leading-snug line-clamp-2">{title}</p>
          </div>

          <p className="text-sm text-[#008DA8] leading-snug">
            Create a public link to share your research. Choose exactly what data tabs will be visible to the viewers.
          </p>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900">Visible Tabs</h4>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ToggleSwitch
                    checked={reportsVisible}
                    onCheckedChange={setReportsVisible}
                    className="data-[state=checked]:bg-[#008DA8]"
                    data-testid="switch-reports-visible"
                  />
                  <FileText className="w-4 h-4 text-[#008DA8]" />
                  <span className="text-sm text-gray-700">Reports (Executive summaries & analysis)</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ToggleSwitch
                    checked={sourcesVisible}
                    onCheckedChange={setSourcesVisible}
                    className="data-[state=checked]:bg-[#008DA8]"
                    data-testid="switch-sources-visible"
                  />
                  <Database className="w-4 h-4 text-[#D4A017]" />
                  <span className="text-sm text-gray-700">Sources (Raw extracted data & links)</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ToggleSwitch
                    checked={artifactsVisible}
                    onCheckedChange={setArtifactsVisible}
                    className="data-[state=checked]:bg-[#008DA8]"
                    data-testid="switch-artifacts-visible"
                  />
                  <BarChart3 className="w-4 h-4 text-[#CC4400]" />
                  <span className="text-sm text-gray-700">Artifacts (Generated tables, charts & files)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900">Link & Access Control</h4>

            <div className="space-y-2.5">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 w-[110px] shrink-0">Who has access</span>
                <Select value={accessLevel} onValueChange={setAccessLevel}>
                  <SelectTrigger
                    className="flex-1 h-9 bg-white border-gray-300 text-sm"
                    data-testid="select-access-level"
                  >
                    <div className="flex items-center gap-1.5">
                      {accessLevel === "restricted" ? (
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                      ) : (
                        <Globe className="w-3.5 h-3.5 text-green-600" />
                      )}
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restricted">Restricted (Only you)</SelectItem>
                    <SelectItem value="anyone">Anyone with the link</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 w-[110px] shrink-0">Permissions</span>
                <Select value={permissions} onValueChange={setPermissions}>
                  <SelectTrigger
                    className="flex-1 h-9 bg-white border-gray-300 text-sm"
                    data-testid="select-permissions"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view">Only view</SelectItem>
                    <SelectItem value="comment">Can comment</SelectItem>
                    <SelectItem value="edit">Can edit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 border border-gray-300 rounded-sm px-3 py-2">
            <span className="flex-1 text-sm text-gray-500 truncate" data-testid="text-share-url">
              {shareUrl}
            </span>
            <button
              onClick={handleCopyLink}
              className="shrink-0 text-gray-500 hover:text-gray-700 transition-colors"
              data-testid="button-copy-link"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="shrink-0 px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            className="px-6 border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={() => handleOpenChange(false)}
            data-testid="button-cancel-share"
          >
            Cancel
          </Button>
          <Button
            className="px-6 bg-[#008DA8] hover:bg-[#006E7D] text-white font-bold"
            onClick={handleSaveAndCopy}
            data-testid="button-save-copy-link"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              "Save & Copy Link"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
