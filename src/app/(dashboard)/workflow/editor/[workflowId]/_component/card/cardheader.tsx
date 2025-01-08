"use client"
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CoinsIcon, CopyIcon, GripVerticalIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppNode, TaskType } from "@/lib/types/task";
import { useReactFlow } from "@xyflow/react";
import { TaskRegistery } from "../../../_task";
import { CreateFlowNode } from "../createnode";

export default function Nodeheader({ taskType,nodeId }: { taskType: TaskType ,nodeId:string}) {
  const task = TaskRegistery[taskType];
 const {deleteElements,getNode,addNodes}= useReactFlow()
  return (
    <div className="flex items-center gap-2 p-2">
      <task.icon size={16} />
      <div className="flex justify-between items-center w-full">
        <p className="text-sm font-bold uppercase text-muted-foreground">
          {task.label}
        </p>
        <div className="flex gap-1 items-center">
          {task.isEntry && <Badge>Entry point</Badge>}
         {
          !task.isEntry &&(
            <>
            <Button variant={"ghost"} size={"icon"}
            onClick={()=>{
              deleteElements({
                nodes:[{id:nodeId}]
              })
            }}
            >
              <TrashIcon size={12}/>
            </Button>
             <Button variant={"ghost"} size={"icon"}
              className="drag-handle cursor-grab"
              onClick={() => {
                const node = getNode(nodeId) as AppNode;
                if (node) {
                  const added = CreateFlowNode(node.data.type, {
                    x: node.position.x,
                    y: node.position.y+node.measured?.height!+20,
                  });
                  addNodes([added]);
                }
              }}>
             <CopyIcon size={12}/>
             {task.credit}
           </Button>
</>
          )
         }
          <Badge className="gap-2 flex items-center text-xs">
            <CoinsIcon size={16} />
            TODO
          </Badge>
          <Button>
            <GripVerticalIcon size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
