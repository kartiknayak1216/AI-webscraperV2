import { cn } from '@/lib/utils';
import { useReactFlow } from '@xyflow/react';
import React, { ReactNode } from 'react';

interface NodeCardProps {
  nodeId: string;
  children: ReactNode;
  isSelected: boolean;
}

export default function Cardprovider({ nodeId, children, isSelected }: NodeCardProps) {
  const { getNode, setCenter } = useReactFlow();

  return (
    <div
      className={cn(
        'w-[420px] bg-background border-2 flex flex-col rounded-lg shadow-lg transition-all duration-200',
        isSelected && 'border-primary ring-2 ring-primary/50'
      )}
      onClick={() => {
        const node = getNode(nodeId);
        if (!node) return;
        const { position, measured } = node;
        if (!position || !measured) return;

        const { width, height } = measured;
        const x = position.x + width! / 2;
        const y = position.y + height! / 2;
        if (x === undefined || y === undefined) return;

        setCenter(x, y, {
          zoom: 1,
          duration: 500,
        });
      }}
    >
      {children}
    </div>
  );
}
