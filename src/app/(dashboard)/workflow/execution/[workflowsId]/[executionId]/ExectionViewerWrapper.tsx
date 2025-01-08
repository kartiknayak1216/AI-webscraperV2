"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import Executionviewer from "../../component/executionviewer";
import { GetWorkflowExecutionWithPhase } from "./server/server";

interface ExecutionViewerWrapperProps {
  executionId: string;
  workflowId: string;
}

export default function ExecutionViewerWrapperClient({
  executionId,
  workflowId,
}: ExecutionViewerWrapperProps) {
  const [execution, setExecution] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const POLLING_INTERVAL = 30000; 
  const MAX_POLLING_DURATION = 120000

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let startTime = Date.now();

    const pollExecutionStatus = async () => {
    console.log("polling")
      try {
        const result = await GetWorkflowExecutionWithPhase(workflowId, executionId);

        if (!result) {
          setError("Execution not found.");
          setLoading(false);
          return;
        }

        setExecution(result);

        if (result.status === "COMPLETED" || result.status === "Failed") {
          setLoading(false);
          if (result.status === "Failed") {
            toast.error("Execution failed.");
          } else {
            toast.success("Execution completed successfully.");
          }
          return;
        }

        if (Date.now() - startTime >= MAX_POLLING_DURATION) {
          setError("Polling timeout: Execution status not updated.");
          setLoading(false);
          return;
        }

        timeoutId = setTimeout(pollExecutionStatus, POLLING_INTERVAL);
      } catch (err: any) {
        setError(err.message || "An error occurred while polling.");
        setLoading(false);
      }
    };

    pollExecutionStatus();

    return () => clearTimeout(timeoutId); 
  }, [executionId, workflowId]);





  return (
    <div>
      <Executionviewer execution={execution} />
    </div>
  );
}
