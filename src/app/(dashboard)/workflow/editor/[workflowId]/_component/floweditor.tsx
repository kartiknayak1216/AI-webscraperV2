"use client";

import { Workflow } from "@prisma/client";
import React, { useCallback, useEffect } from "react";
import {
  addEdge,
  Background,
  BackgroundVariant,
  BaseEdge,
  Connection,
  Controls,
  Edge,
  FitViewOptions,
  getOutgoers,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { AppNode, AppNodeData, TaskType, WorkflowTask } from "@/lib/types/task";
import { CreateFlowNode } from "./createnode";
import { TaskRegistery } from "../../_task";
import Customedges from "./edges";
import NodeCard from "./card";


export default function FlowEditor({ workflow }: { workflow: Workflow }) {

  const nodeType = {
    Node: NodeCard,
  };
  
const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
const[edges,setEdges,onEdgesChange]= useEdgesState<Edge>([])
const fitViewOptions = { padding: 2 };
const snapGrid: [number, number] = [50, 50];
const{screenToFlowPosition,setViewport,updateNodeData} =useReactFlow();




const onConnect = useCallback(
  (connection: Connection) => {
    // Add the new edge to the state with animation
    setEdges((eds) => addEdge({ ...connection, animated: true }, eds));

    if (!connection.targetHandle) return; // Exit if no target handle is provided

    // Find the target node
    const targetNode = nodes.find((node) => node.id === connection.target);
    if (!targetNode) return; // Exit if target node doesn't exist

    // Update the target node's input data
    const updatedInputs = {
      ...(targetNode.data?.inputs || {}), // Ensure input exists
      [connection.targetHandle]: "", // Set the new input to an empty string
    };

    updateNodeData(targetNode.id, {
      ...targetNode.data, // Keep existing data
      inputs: updatedInputs, // Update the input field
    });

    // Debugging log
    console.log(
      "Updated Node:",
      nodes.find((node) => node.id === connection.target)
    );
  },
  [setEdges, updateNodeData, nodes]
);

const onDrops = useCallback((event: React.DragEvent) => {
  event.stopPropagation();
  event.preventDefault();
console.log("drop")
const task = event.dataTransfer.getData("NODEDATA")
if(!task)
  {console.log("no Nodedata")
     return}

const position =screenToFlowPosition({
  x:event.clientX,
  y:event.clientY
})

const nodecreate = CreateFlowNode(task as TaskType,position)
setNodes((pre)=>[...pre,nodecreate])

},[setNodes])

const onDragEnd = useCallback((event:React.DragEvent)=>{
 event.preventDefault()
  event.dataTransfer.effectAllowed = "move"; // Allow move behavior

},[])

useEffect(()=>{
try{
const flow = JSON.parse(workflow.defination)
if (!flow) return;
console.log("flow data",flow.nodes)
setNodes(flow.nodes || []);
setEdges(flow.edges || []);
if (!flow.viewport) return;
const { x = 0, y = 0, zoom = 1 } = flow.viewport;
setViewport({ x, y, zoom });
}catch (error) {
      console.log(error);
    }
},[workflow,setNodes,setEdges,setViewport])


const isValidConnection = useCallback((connection: Edge | Connection) => {
  console.log("Validating connection:", connection);

  if (connection.source === connection.target) {
    console.error("Source and target are the same:", connection);
    return false;
  }

  const source = nodes.find((node) => node.id === connection.source);
  const target = nodes.find((node) => node.id === connection.target);

  if (!source || !target) {
    console.error("Source or target node not found:", { source, target, connection });
    return false;
  }

  console.log("Source and target nodes:", { source, target });

  const sourceTask = TaskRegistery[source.data.type];
  const targetTask = TaskRegistery[target.data.type];

  if (!sourceTask || !targetTask) {
    console.error("Source or target task not found in TaskRegistery:", { sourceTask, targetTask, connection });
    return false;
  }

  console.log("Source and target tasks:", { sourceTask, targetTask });

  const output = sourceTask.outputs.find((e) => e.name === connection.sourceHandle);
  const input = targetTask.inputs.find((e) => e.name === connection.targetHandle);

  if (!output || !input) {
    console.error("Output or input handle not found:", { output, input, connection });
    return false;
  }

  console.log("Output and input handles:", { output, input });

  if (input.type !== output.type) {
    console.error("Type mismatch between input and output:", { input, output });
    return false;
  }

  console.log("Input and output types match");

  const hasCycle = (node: AppNode, visited = new Set()) => {
    if (visited.has(node.id)) {
      console.error("Cycle detected during traversal:", { node, visited });
      return false; // If the node has been visited, no cycle
    }

    visited.add(node.id);

    // Iterate through outgoers and check for cycles
    for (const outgoer of getOutgoers(node, nodes, edges)) {
      if (outgoer.id === connection.source) {
        console.error("Cycle detected in connection:", { cycleNodeId: outgoer.id, connection });
        return true;
      }
      if (hasCycle(outgoer, visited)) return true;
    }
    return false;
  };

  const detect = hasCycle(target);

  if (detect) {
    console.error("Cycle detected. Connection is invalid:", { connection });
    return false;
  }

  console.log("Connection is valid:", connection);
  return true;
}, [nodes, edges, TaskRegistery]);



const customedge={
  default: Customedges
}
  return (
    <main className="h-screen w-full overflow-hidden">
      <ReactFlow
      style={{ height: '90%', width: '100%' }}
      nodes={nodes}
      edges={edges}
      fitViewOptions={fitViewOptions}
      onEdgesChange={onEdgesChange}
      onNodesChange={onNodesChange}
      snapGrid={snapGrid}
      onConnect={onConnect}
      isValidConnection={isValidConnection}
      onDragOver={onDragEnd}
      onDrop={onDrops}
      edgeTypes={customedge}
      nodeTypes={nodeType}
      >
    
     
      <Controls
  position="top-right"
  className="!text-black !border-black font-black"
/>


        <MiniMap
  position="bottom-left"
  className="!bg-white  dark:!bg-background  border border-gray-400 dark:border-gray-700 dark:!text-black shadow-md rounded-lg" 
  zoomable
  pannable
  nodeColor={() => (document.documentElement.classList.contains('dark') ? "#d1d5db" : "#4b5563")} // Balanced contrast for nodes
  nodeStrokeWidth={1.8}
/>



        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
        />
      </ReactFlow>
    </main>
  );
}
