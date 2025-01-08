"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Share } from "lucide-react"
import { toast } from "sonner"

export function ShareButton({ excId }: { excId: string }) {
  const handleCopyClick = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success('URL copied to clipboard!')
    }).catch(() => {
      toast.error('Failed to copy URL')
    });
  };

  const shareUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/workflow/clone/${excId}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2 p-2 hover:bg-muted">
          <Share size={16} />
          <span>Share</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Share Workflow</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Share your Workflow with others to replicate it.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="name" className="text-right">
              Share URL
            </Label>
           <div className="flex gap-x-2">
           <Input
              className="col-span-3"
              value={shareUrl}
              readOnly
            />
            <Button
              variant="outline"
              className="flex items-center justify-center p-2 hover:bg-muted"
              onClick={() => handleCopyClick(shareUrl)}
            >
              <Copy size={16} />
              <span className="ml-2">Copy</span>
            </Button>
           </div>
          </div>
        </div>
       
      </DialogContent>
    </Dialog>
  );
}
