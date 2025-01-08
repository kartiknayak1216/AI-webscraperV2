import React, { memo } from 'react';
import Cardprovider from './cardprovider';
import { AppNodeData, TaskType } from '@/lib/types/task';
import Nodeheader from './cardheader';
import CardinputProvider, { Cardinput } from './cardinput';
import { TaskRegistery } from '../../../_task';
import CardoutputProvider, { Cardoutput } from './cardoutput';
import { NodeProps } from '@xyflow/react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const NodeCard = memo((props: NodeProps) => {
  const nodeData = props.data as AppNodeData;
  const task = TaskRegistery[nodeData.type];
  const DEV_MODE=process.env.NEXT_PUBLIC_DEV_MODE

  if (!task) {
    console.error(`Task of type ${nodeData.type} not found in registry.`);
    return null;
  }

  return (
    <Cardprovider nodeId={props.id} isSelected={props.selected ?? false}>
         <Nodeheader taskType={task.type} nodeId={props.id} />
      <CardinputProvider>
        {task.inputs.map((input, index) => (
          <Cardinput key={`input-${index}`} input={input} type={input.type} nodeId={props.id} />
        ))}
      </CardinputProvider>
      <CardoutputProvider>
        {task.outputs.map((output, index) => (
          <Cardoutput key={`output-${index}`} input={output} type={output.type} nodeId={props.id} />
        ))}
      </CardoutputProvider>
    </Cardprovider>
  );
});

export default NodeCard;
