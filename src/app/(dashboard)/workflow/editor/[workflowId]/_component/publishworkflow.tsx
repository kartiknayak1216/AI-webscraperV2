"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Edge, useReactFlow } from "@xyflow/react";
import { useMutation } from "@tanstack/react-query";
import { AppNode } from "@/lib/types/task";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useInvalidContext } from "../context/invalidcontext";
import { executionforPublish } from "../_execution/exeuction";
import { PublishWorkflow } from "../_server/server";

export default function PublishButton({ workflowId }: { workflowId: string }) {
  const { getNodes, getEdges } = useReactFlow();
  const { clearError, setInvalidInput, invalidNodes } = useInvalidContext();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (flowstring: string) => {
      const nodes = getNodes();
      const edges: Edge[] = getEdges();
      const phase = executionforPublish(
        nodes as AppNode[],
        edges,
        clearError,
        setInvalidInput,
        workflowId
      );

      if (!phase) {
        toast.error("Invalid workflow configuration.");
        return false; 
      }

      return await PublishWorkflow(workflowId, phase, flowstring);
    },
    onSuccess: (success) => {
      if (success) {
        toast.success("Workflow executed successfully.");
        router.refresh();
      } else {
        toast.error("Execution failed. Unable to publish workflow.");
      }
    },
    onError: (error) => {
      toast.error("Execution failed. Please check the console for errors.");
      console.error("Execution error:", error);
    },
    onSettled: () => {
      toast.dismiss();
    },
  });

  const handleClick = () => {
    const nodes = getNodes();
    const edges: Edge[] = getEdges();
    const flow = {
      nodes: nodes as AppNode[],
      edges,
    };
    const flowstring = JSON.stringify(flow);

    console.log("Starting execution...");
    mutate(flowstring);
  };

  useEffect(() => {
    if (invalidNodes.length > 0) {
      console.log("Invalid Nodes:", invalidNodes);
      toast.error(
        `Invalid nodes detected: ${invalidNodes.length}. Please review them.`
      );
    }
  }, [invalidNodes]);

  return (
    <div>
      <Button onClick={handleClick} disabled={isPending}>
        {isPending ? "Publishing..." : "Publish"}
      </Button>
    </div>
  );
}
