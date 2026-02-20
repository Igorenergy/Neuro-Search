import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch as ToggleSwitch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface ResearchDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  pinned?: boolean;
  onSave?: (name: string, pinned: boolean) => void;
}

export default function ResearchDetailsModal({
  open,
  onOpenChange,
  title = "",
  pinned = false,
  onSave,
}: ResearchDetailsModalProps) {
  const [renameValue, setRenameValue] = useState(title);
  const [isPinned, setIsPinned] = useState(pinned);

  useEffect(() => {
    if (open) {
      setRenameValue(title);
      setIsPinned(pinned);
    }
  }, [open, title, pinned]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Research Details</DialogTitle>
          <DialogDescription className="text-gray-500 text-sm">
            Edit the name and pin status for this research item.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label htmlFor="details-rename" className="text-sm font-medium text-gray-700">Rename</Label>
            <Input
              id="details-rename"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="border-gray-300 focus:border-[#008DA8] focus:ring-[#008DA8] text-gray-900"
              data-testid="input-rename"
            />
          </div>
          <div className="flex items-center gap-3">
            <ToggleSwitch
              id="details-pin-toggle"
              checked={isPinned}
              onCheckedChange={setIsPinned}
              data-testid="toggle-pin"
            />
            <Label htmlFor="details-pin-toggle" className="text-sm font-medium text-gray-700 cursor-pointer">Pin to navigation menu</Label>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-300 text-gray-700"
            data-testid="button-cancel-details"
          >
            Cancel
          </Button>
          <Button
            onClick={() => { onSave?.(renameValue, isPinned); onOpenChange(false); }}
            className="bg-[#008DA8] hover:bg-[#006E7D] text-white"
            data-testid="button-save-details"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
