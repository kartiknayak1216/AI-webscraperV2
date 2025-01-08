"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { UnpublishWorkflow } from "../_server/server";
import { useRouter } from "next/navigation";

type UnpublishButtonProps = {
  workflowId: string;
};

export default function UnpublishButton({ workflowId }: UnpublishButtonProps) {
    const router = useRouter()

    const { mutate, isPending } = useMutation({    mutationFn: async () => {
      const result = await UnpublishWorkflow(workflowId);
      return result;
    },
    onSuccess: (success) => {
      if (success) {
        toast.success("Workflow unpublished successfully!");
   router.refresh()
    } else {
        toast.error("Failed to unpublish workflow. It may not be published.");
      }
    },
    onError: (error) => {
      toast.error("An error occurred while unpublishing the workflow.");
      console.error("Unpublish error:", error);
    },
    onSettled: () => {
      toast.dismiss();
    },
  });

  const handleClick = () => {
    console.log("Unpublishing workflow...");
    mutate();
  };

  return (
    <Button onClick={handleClick} disabled={isPending}>
      {isPending ? "Unpublishing..." : "Unpublish"}
    </Button>
  );
}
