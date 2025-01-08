"use client";

import { Workflow } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RunWorkFlow } from "@/app/(dashboard)/workflow/editor/[workflowId]/_server/server";
import { ExecutionPhase } from "@/app/(dashboard)/workflow/editor/[workflowId]/_execution/type/type";
import { PlayIcon } from "lucide-react";

export default function ExecutionButton({ workflow }: { workflow: Workflow }) {
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!workflow.executionFlow) {
        toast.error("No execution flow defined for this workflow.");
        return;
      }
      if (!workflow.executionPlan) {
        toast.error("No execution plan defined for this workflow.");
        return;
      }

      const { edges } = JSON.parse(workflow.executionFlow);
      const executionPhase = JSON.parse(workflow.executionPlan) as ExecutionPhase;

      return await RunWorkFlow(workflow.id, executionPhase, edges,"manual");
    },
    onSuccess: (data) => {
      if (data?.success === false) {
        toast.error("Execution failed.");
        return;
      }

      toast.success("Workflow executed successfully.");
    },
    onError: (error) => {
      console.error("Execution error:", error);
      toast.error("Execution failed.");
    },
  });

  const handleClick = () => {
    mutate();
  };

  return (
    <Button onClick={handleClick} disabled={isPending} variant={"outline"} size={"sm"} className="flex items-center gap-2">
        <PlayIcon size={16}/>
        <div>
      {isPending ? <div>Running...</div> : <div>Run</div>}</div>
    </Button>
  );
}
