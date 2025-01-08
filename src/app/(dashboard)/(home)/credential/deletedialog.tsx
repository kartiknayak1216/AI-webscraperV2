"use client"
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { DeleteCredentialServer } from './server/server';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  workflowName: string;
  id: string;
}

export default function DeleteDialog({ open, setOpen, workflowName, id }: Props) {
  const [confirmText, setConfirmText] = useState("");
const router= useRouter()
  const deleteMutation = useMutation({
    mutationFn: DeleteCredentialServer,
    onSuccess: () => {
      toast.success("Workflow deleted successfully", { id });
      setConfirmText("");
      setOpen(false); 
    router.refresh()
    },
    onError: () => {
      toast.error("Failed to delete workflow", { id });
      setConfirmText("");
    },
    onSettled: () => {
      toast.dismiss(); 
    },
  });

  const handleDelete = () => {
     if(confirmText !==workflowName){
          toast.error("Invalid text ")
          return
        }
    toast.loading("Deleting workflow...");
    deleteMutation.mutate(id);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            If you delete this credential, you will not be able to recover it.
            <div className="flex flex-col py-4 gap-2">
              <p>
                To confirm, type: <b>{workflowName}</b>
              </p>
              <Input
                value={confirmText}
                placeholder="Enter credential name"
                onChange={(e) => setConfirmText(e.target.value)}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={ deleteMutation.isPending||confirmText !==workflowName}
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
