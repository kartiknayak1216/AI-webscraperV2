import React, { useEffect, useMemo } from 'react';
import { Controls, Handle, Position, useEdges } from '@xyflow/react';
import { GetColor, TaskParams, TaskParamType } from '@/lib/types/task';
import { cn } from '@/lib/utils';
import NodeParamField from './param/nodeparamfield';
import { useInvalidContext } from '../../context/invalidcontext';

export default function CardinputProvider({ children }: { children: React.ReactNode }) {
  return <div className={cn('flex flex-col divide-y')}>{children}</div>;
}

export function Cardinput({
  input,
  nodeId,
  type,
}: {
  input: TaskParams;
  type: TaskParamType;
  nodeId: string;
}) {

  const edge = useEdges()
  const{invalidNodes}=useInvalidContext()

  const isInvalid = useMemo(
    () => invalidNodes.some((node) => node.nodeId === nodeId && node.input.includes(input.name)),
    [invalidNodes, nodeId, type]
  );


  

  const isConnected = edge.some((edges)=>edges.target===nodeId && edges.targetHandle===input.name)
  return (

<div className={cn('flex justify-start relative p-3 bg-secondary',isInvalid && "bg-destructive/30")}>
<NodeParamField param={input} nodeId={nodeId} disabled={isConnected}  />

      {!input.hideHandle && (
        <Handle
          id={input.name}
          style={{ background: GetColor(input.type) }}
          type="target"
          position={Position.Left}
          className={cn("!w-3 !h-3 !-left-2")}/>
      )}
    </div>
  );
}
