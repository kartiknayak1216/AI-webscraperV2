import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { GetColor, TaskParams, TaskParamType } from '@/lib/types/task';
import { cn } from '@/lib/utils';
import NodeParamField from './param/nodeparamfield';
import { TaskRegistery } from '../../../_task';

export  default function CardoutputProvider({ children }: { children: React.ReactNode }) {
  return <div className={cn('flex flex-col divide-y ')}>{children}</div>;
}

export function Cardoutput({
  input,
  nodeId,
  type,isGraph
}: {
  input: TaskParams;
  type: TaskParamType;
  nodeId: string;
  isGraph?:boolean
}) {
  return (
    <div className='flex justify-end relative p-3 bg-secondary'>
    <p className='text-xs text-muted-foreground'>{input.name}</p>

  <Handle id={input.name} type='source' position={Position.Right} className={cn("!w-3 !h-3 !-right-2")}
    style={{background:GetColor(input.type)}}/></div>
  );
}
