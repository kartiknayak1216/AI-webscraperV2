"use client";
import { Button } from "@/components/ui/button";
import { useReactFlow } from "@xyflow/react";
import { updateWorkflow } from "../_server/server";
import { toast } from "sonner";
import { useState } from "react";

export default function SaveButton({ workflowId }: { workflowId: string }) {
  const { toObject } = useReactFlow();
  const [isLoading, setIsLoading] = useState(false);

  const saveWorkflow = async (id: string, data: string) => {
    setIsLoading(true); 
    try {
      const result = await updateWorkflow(id, data);
      if (result.status && !result.error) {
        setIsLoading(false)
        toast.success("Workflow saved successfully");
      } else if (result.error) {
        setIsLoading(false)
        toast.error(result.error);


      }
    } catch (error) {
      console.error("Error saving workflow:", error);
      setIsLoading(false)
      toast.error("An error occurred while saving the workflow.");
    } 
  };

  return (
    <Button
      onClick={() => {
        const workflowDefination = JSON.stringify(toObject());
        saveWorkflow(workflowId, workflowDefination);
      }}
      disabled={isLoading} 
    >
      {isLoading ? "Saving..." : "Save Workflow"}
    </Button>
  );
}
