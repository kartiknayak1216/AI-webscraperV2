import { AppNode, TaskType } from "@/lib/types/task";
import { Edge } from "@xyflow/react";
import { TaskRegistery } from "../../_task";
import { ExecutionPhase, ExecutionPhaseReturn } from "./type/type";
import { MissingInput } from "../context/invalidcontext";
import { RunWorkFlow } from "../_server/server";
import { redirect } from "next/navigation";


export const execution =  (
  nodes: AppNode[], 
  edges: Edge[], 
  clearError: () => void, 
  setInvalidInput: React.Dispatch<React.SetStateAction<MissingInput[]>>,
  workflowId:string,
  trigger:string
):ExecutionPhase|false=> {
  clearError();
  const entryPoint = nodes.find((node) => {
    const type = node.data.type;
    return type && TaskRegistery[type as TaskType]?.isEntry === true;
  });

  if (!entryPoint) {
    console.error("No entry point found for the workflow.");
    return false; 
  }
  const invalidEntryInputs = validateNodeInputs(entryPoint, edges, nodes);
  if (invalidEntryInputs.length > 0) {
    setInvalidInput([{ nodeId: entryPoint.id, input: invalidEntryInputs }]);
    return false;
  }
  const executedNodes = new Set<string>(); 
  const executionPhase: ExecutionPhase = [];
  let currentPhase = 1;
 let error =0
  executionPhase.push({ phase: currentPhase, nodes: [entryPoint] });
  executedNodes.add(entryPoint.id);

  let invalidNodes: MissingInput[] = [];

  while (executedNodes.size < nodes.length) {
    currentPhase++;
    const phaseNodes: AppNode[] = []; 

    invalidNodes = []; 

    for (const node of nodes) {
      if (executedNodes.has(node.id)) continue;

      const parentNodes = getSourceNodes(node, edges, nodes);
      const allParentsExecuted = parentNodes.every((parent) => executedNodes.has(parent.id));

      if (allParentsExecuted) {
        phaseNodes.push(node);
        const invalidInputs = validateNodeInputs(node, edges, nodes);
        if (invalidInputs.length > 0) {
          invalidNodes.push({ nodeId: node.id, input: invalidInputs });
        }
        executedNodes.add(node.id);
      }
    }

    if (invalidNodes.length > 0) {
      setInvalidInput((prev) => [...prev, ...invalidNodes]);
   error++
    }

    if (phaseNodes.length === 0) {
      return false;
    }

    executionPhase.push({ phase: currentPhase, nodes: phaseNodes });
  }

  if (invalidNodes.length > 0) {
    console.log("Invalid inputs:", invalidNodes);
    return false;
  }

  const unexecutedNodes = nodes.filter((node) => !executedNodes.has(node.id));
  if (unexecutedNodes.length > 0) {
    return false; 
  }
  if(error!==0){
    return false
  } 
  return executionPhase;

};
const getSourceNodes = (currentNode: AppNode, edges: Edge[], nodes: AppNode[]): AppNode[] => {
  const parentIds = edges
    .filter((edge) => edge.target === currentNode.id)
    .map((edge) => edge.source);

  return nodes.filter((node) => parentIds.includes(node.id)); 
};

const validateNodeInputs = (currentNode: AppNode, edges: Edge[], nodes: AppNode[]): string[] => {
 
  console.log("currentnode",currentNode)
  const taskInputs = TaskRegistery[currentNode.data.type]?.inputs || [];
  const invalidInputs: string[] = [];

  for (const input of taskInputs) {



    const currentValue = currentNode.data.inputs?.[input.name];

    

    if (!currentValue || currentValue.length === 0) {

      const connectedEdge = edges.find(
        (edge) => edge.target === currentNode.id && edge.targetHandle === input.name
      );

      if (!connectedEdge) {
        invalidInputs.push(input.name);
      }
    }
  }

  return invalidInputs;
};

export const executionforPublish =  (
  nodes: AppNode[], 
  edges: Edge[], 
  clearError: () => void, 
  setInvalidInput: React.Dispatch<React.SetStateAction<MissingInput[]>>,
  workflowId:string,
) => {
  clearError();
  const entryPoint = nodes.find((node) => {
    const type = node.data.type;
    return type && TaskRegistery[type as TaskType]?.isEntry === true;
  });

  if (!entryPoint) {
    console.error("No entry point found for the workflow.");
    return false; 
  }

  const executedNodes = new Set<string>(); 
  const executionPhase: ExecutionPhase = [];
  let currentPhase = 1;
 let error =0
  executionPhase.push({ phase: currentPhase, nodes: [entryPoint] });
  executedNodes.add(entryPoint.id);

  let invalidNodes: MissingInput[] = [];

  while (executedNodes.size < nodes.length) {
    currentPhase++;
    const phaseNodes: AppNode[] = []; 

    invalidNodes = []; 

    for (const node of nodes) {
      if (executedNodes.has(node.id)) continue;

      const parentNodes = getSourceNodes(node, edges, nodes);
      const allParentsExecuted = parentNodes.every((parent) => executedNodes.has(parent.id));

      if (allParentsExecuted) {
        phaseNodes.push(node);
        const invalidInputs = validateNodeInputs(node, edges, nodes);
        if (invalidInputs.length > 0) {
          invalidNodes.push({ nodeId: node.id, input: invalidInputs });
        }
        executedNodes.add(node.id);
      }
    }

    if (invalidNodes.length > 0) {
      setInvalidInput((prev) => [...prev, ...invalidNodes]);
   error++
    }

    if (phaseNodes.length === 0) {
      return false;
    }

    executionPhase.push({ phase: currentPhase, nodes: phaseNodes });
  }

  if (invalidNodes.length > 0) {
    console.log("Invalid inputs:", invalidNodes);
    return false;
  }

  const unexecutedNodes = nodes.filter((node) => !executedNodes.has(node.id));
  if (unexecutedNodes.length > 0) {
    return false; 
  }
  if(error!==0){
    return false
  }



  return executionPhase;
  ;

};