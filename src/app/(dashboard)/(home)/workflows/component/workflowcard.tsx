"use client";

import { TooltipWraapper } from "@/components/global/tooltipwrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { WorkflowStatus } from "@/lib/types/workflow";
import { cn } from "@/lib/utils";
import { Workflow } from "@prisma/client";
import { CornerDownRightIcon, FileTextIcon, MoreVerticalIcon, MoveRightIcon, PlayIcon, ShuffleIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import DeleteDialog from "./deletedialog";
import { useState } from "react";
import ExecutionButton from "./executionbutton";
import Scheduledialog from "./scheduledialog";
import { dateToDuration } from "@/app/(dashboard)/workflow/execution/helper/helper";
import { Badge } from "@/components/ui/badge";

export const WorkflowStatusColor = {
    DRAFT: "bg-yellow-100 text-yellow-800", 
    AUTO: "bg-green-100 text-green-800",   
};

export function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;
  const statusColor = WorkflowStatusColor[workflow.status as keyof typeof WorkflowStatusColor];

  return (
    <Card className="border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-md dark:shadow-primary/30">
      <CardContent className="p-4 flex items-center justify-between h-[100px]">
        <div className="flex items-center justify-end space-x-3">
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", statusColor)}>
            {isDraft ? (
              <FileTextIcon className="h-5 w-5" />
            ) : (
              <PlayIcon className="h-5 w-5" />
            )}
          </div>

          <div>
            <h3 className="text-base font-bold text-muted-foreground flex items-center ml-2">
              <Link href={`/workflow/editor/${workflow.id}`} className="flex items-center hover:underline">
                {workflow.name}
              </Link>
              {isDraft && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Draft
                </span>
              )}
              {!isDraft && <ScheduleSelection id={workflow.id} fetchcron={workflow.cron!} />}
            </h3>
           <LastRunStatus workflow={workflow} />
          </div>
         
        </div>
       
        <div className="flex items-center space-x-2">
          <Link
            href={`/workflow/editor/${workflow.id}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex items-center gap-2")}
          >
            Edit
            <ShuffleIcon size={16} />
          </Link>
          <WorkflowAction id={workflow.id} workflowname={workflow.name} />
          {!isDraft && <ExecutionButton workflow={workflow} />}
        </div>
      </CardContent>
    </Card>
  );
}

function WorkflowAction({ id, workflowname }: { id: string, workflowname: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <DeleteDialog open={open} setOpen={setOpen} workflowName={workflowname} id={id} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <TooltipWraapper content="More actions">
              <div className="flex items-center justify-center w-full h-full">
                <MoreVerticalIcon size={18} />
              </div>
            </TooltipWraapper>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive flex items-center gap-2" onSelect={() => setOpen(true)}>
            <TrashIcon size={16} /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

async function ScheduleSelection({ id, fetchcron }: { id: string, fetchcron?: string }) {
  return (
    <div className="flex items-center gap-2">
      <CornerDownRightIcon className="h-4 text-muted-foreground" />
      <Scheduledialog workflowId={id} fetchcron={fetchcron} />
      <MoveRightIcon className="h-4 text-muted-foreground" />
    </div>
  );
}

function LastRunStatus({workflow}:{workflow:Workflow}){
  const lastrun = dateToDuration(workflow.lastRunAt, new Date());

  return(
     <div className="flex flex-col mt-2">
                      <div className="flex gap-2 items-center">
                        {workflow.lastRunStatus &&(<>
                        <ExecuteStatus status={workflow.lastRunStatus!} />
                        <span className="font-semibold text-sm capitalize">
                          {workflow.lastRunStatus}
                        </span>
                        </>)
                        
                        }
                      </div>{lastrun &&(
                      <div className="text-muted-foreground text-xs mx-5 flex flex-row">
                    <div>Last run:</div>
                       {lastrun &&<div>{lastrun}</div>}
                      </div>)}
                    </div>
  )
}
const ExecuteStatus = ({ status }: { status: string }) => {
  const color = (() => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500";
      case "FAILED":
        return "bg-red-500";
      case "RUNNING":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  })();

  return <div className={cn("w-2 h-2 rounded-full", color)} />;
};