"use client";

import { useEffect, useState } from "react";
import { GetWorkflowExecutionWithPhase } from "./[executionId]/server/server"; 
import Executionviewer from "../component/executionviewer";

export default function ExecutionViewerWrapperClient({
  executionId,
  workflowId,
}: {
  executionId: string;
  workflowId: string;
}) {
  type Execution = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhase>>;

  const [execution, setExecution] = useState<Execution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollingCount, setPollingCount] = useState(0);

  const MAX_POLLING_ATTEMPTS = 10; 
  const POLLING_INTERVAL = 5000; 

  useEffect(() => {
    const fetchExecutionData = async () => {
      try {
        const executionData = await GetWorkflowExecutionWithPhase(
          workflowId,
          executionId
        );

        if (!executionData) {
          setError("Execution data not found.");
          return;
        }

        setExecution(executionData);}

      
    catch(error){
     console.log(error)   
    }
    }


    fetchExecutionData();
 
  },[executionId, workflowId, pollingCount]);

  if (!execution) return null;

  return <Executionviewer execution={execution} />;
}
