"use client"
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WorkflowExecution } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { dateToDuration } from "../../../execution/helper/helper";
import { cn } from "@/lib/utils";
import { CoinsIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import Filterdrop from "./filterdrop";

export enum FilterType{
  All="all",
  MANUAL="manual",
  AUTO="auto"
}

export default function Execution({
  execution,
}: {
  execution: WorkflowExecution[];
}) {
  const [filter,setfilter]= useState< WorkflowExecution[]>(execution)
const[type,settype]= useState<FilterType>(FilterType.All)
  const router = useRouter()


useEffect(()=>{
  console.log("clicked")
  if(type===FilterType.All){
    setfilter(execution)
  }
  else {

    setfilter(
      execution.filter((exc) => exc.trigger.toLowerCase() === type)
    );
  }
},[type,execution])

  return (
    <div className="flex flex-col">
      <div className="flex items-end ">
      <Filterdrop params={{
          type: type,
          settype:settype
        }} />
      </div>
    
    <div className="border rounded-lg shadow-md mt-1 ">
<div className="overflow-y-scroll max-h-[calc(100vh-60px)]"> 
<Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="w-[250px]">ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Consumed</TableHead>
            <TableHead className="text-right text-xs text-muted-foreground">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="gap-2 h-full overflow-auto">
          {filter.map((exc) => (
            <TableRow key={exc.id}
            className="cursor-pointer" onClick={()=>{
              router.push(`/workflow/execution/${exc.workflowId}/${exc.id}`)
            }}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {exc.id}
                  </span>
                  <div className="text-muted-foreground text-xs gap-x-2">
                    <span>Triggered via</span>
                    <Badge variant={"outline"}>{exc.trigger}</Badge>
                  </div>
                </div>           
              </TableCell>

              <TableCell>
                <div className="flex flex-col">
                  <div className="flex gap-2 items-center">
                    <ExecuteStatus status={exc.status} />
                    <span className="font-semibold capitalize">
                      {exc.status}
                    </span>
                  </div>
                  <div className="text-muted-foreground text-xs mx-5">
                    {dateToDuration(exc.startedAt, exc.completedAt)}
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex flex-col">
                  <div className="flex gap-2 items-center">
                    <CoinsIcon size={16} className="text-primary" />
                    <span className="font-semibold capitalize">
                      {exc.creditConsumed}
                    </span>
                  </div>
                  <div className="text-muted-foreground text-xs mx-5">
                    Credits
                  </div>
                </div>
              </TableCell>


              <TableCell className="text-right text-muted-foreground">
              {
                exc.startedAt && formatDistanceToNow(exc.startedAt,{
                  addSuffix:true
                })
              }
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4 text-gray-600">
              {execution.length === 0 ? "No executions found." : "End of list."}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table></div>
    </div></div>
  );
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
