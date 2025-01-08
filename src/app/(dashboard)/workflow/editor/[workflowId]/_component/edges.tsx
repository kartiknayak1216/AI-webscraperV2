import React, { useCallback } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react';
import { Button } from '@/components/ui/button';

export default function Customedges(selectedge: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath(selectedge);
  const { setEdges } = useReactFlow();

  const onEdgeClick = useCallback(() => {
    setEdges?.((edges) => edges.filter((edge) => edge.id !== selectedge.id));
  }, [selectedge.id, setEdges]);

  

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={selectedge.style || {}}
        markerEnd={selectedge.markerEnd}
        
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position:"absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents:'all'
          }}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={onEdgeClick}
            className="w-5 h-5 border cursor-pointer rounded-full text-xs leading-none hover:shadow-lg"
            aria-label="Delete Edge"
          >
            ×
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
