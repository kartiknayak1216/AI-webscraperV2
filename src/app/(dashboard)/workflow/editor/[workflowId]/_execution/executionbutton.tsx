"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Edge, useReactFlow } from "@xyflow/react";
import { useMutation } from "@tanstack/react-query";
import { AppNode } from "@/lib/types/task";
import { toast } from "sonner";
import { useInvalidContext } from "../context/invalidcontext";
import { useRouter } from "next/navigation";
import { execution } from "./exeuction";
import { RunWorkFlow } from "../_server/server";

interface ExecutionButtonProps {
  worflowId: string;
}

export default function ExecutionButton({ worflowId }: ExecutionButtonProps) {
  const { getNodes, getEdges } = useReactFlow(); 
  const { clearError, setInvalidInput } = useInvalidContext(); 
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const nodes = getNodes();
      const edges: Edge[] = getEdges();

      const executionPhase = execution(
        nodes as AppNode[],
        edges,
        clearError,
        setInvalidInput,
        worflowId,
        "manual"
      );

      if (!executionPhase) {
        toast.error("Invalid execution phase. Please check inputs and workflow setup.");

  return  }

      const result = await RunWorkFlow(worflowId, executionPhase, edges, "manual");
      if (!result?.success) {
        throw new Error(result?.error || "Workflow execution failed.");
      }

      return result;
    },
    onSuccess: (data) => {
      if (data?.success && data.url) {
        toast.success("Workflow executed successfully!");
        router.push(data.url); 
      } else {
        toast.error(data?.error || "Execution failed.");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || error);
      console.error("Execution failed:", error.message || error);
    },
  });

  const handleClick = () => {
    console.log("Starting execution...");
    mutate(); 
  };

  return (
    <div>
      <Button onClick={handleClick} disabled={isPending}>
        {isPending ? "Executing..." : "Execute"}
      </Button>
    </div>
  );
}
