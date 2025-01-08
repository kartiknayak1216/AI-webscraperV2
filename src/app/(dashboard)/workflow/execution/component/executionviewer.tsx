"use client";

import React, { useEffect, useState } from "react";
import {
  ClockIcon,
  CoinsIcon,
  WorkflowIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  Loader,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dateToDuration } from "../helper/helper";
import { GetPhase, GetWorkflowExecutionWithPhase } from "../[workflowsId]/[executionId]/server/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ExecutionLog } from "@prisma/client";
import LogTable from "./logviewer";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ModeToggle } from "@/components/global/moddletoggle";
import { ScrollArea } from "@/components/ui/scroll-area"

type Phase = Awaited<ReturnType<typeof GetPhase>>;
type Execution = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhase>>;

export default function Executionviewer({ execution }: { execution: Execution }) {
  const [phaseCache, setPhaseCache] = useState<Record<string, Phase | null>>({});
  const [currentPhase, setCurrentPhase] = useState<string | null>(null);
  const [loadingPhase, setLoadingPhase] = useState<string | null>(null);
  const [error, setError] = useState<Record<string, string | null>>({});
  const [log, setLog] = useState<ExecutionLog[] | []>([]);

  const cost = execution?.phase.reduce(
    (total: number, data: any) => total + (data.creditCost || 0),
    0
  );

  const fetchPhase = async (phaseId: string) => {
    if (phaseCache[phaseId] || loadingPhase === phaseId) return; 
    setLoadingPhase(phaseId);
    setError((prev) => ({ ...prev, [phaseId]: null }));
    try {
      const data = await GetPhase(phaseId);
      setPhaseCache((prev) => ({ ...prev, [phaseId]: data }));
    } catch (err) {
      console.error(err);
      setError((prev) => ({ ...prev, [phaseId]: "Failed to fetch phase details." }));
    } finally {
      setLoadingPhase(null);
    }
  };

  useEffect(() => {
    if (currentPhase) fetchPhase(currentPhase);
  }, [currentPhase]);

  const phaseDetail = currentPhase ? phaseCache[currentPhase] : null;

  return (
    <div className="flex w-full h-full bg-background text-foreground ">
    {/* Sidebar */}
    <aside className="w-[440px] max-w-[440px] border-r flex flex-col overflow-hidden">
      <div className="flex flex-col py-6 px-6 overflow-y-scroll">
        {/* Title Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="gap-4 flex">
          <WorkflowIcon size={24} className="text-primary" />
        <Link href={"/home"}>
          <div className="flex-row">
              <span className="text-xl bg-gradient-to-r from-primary/80 to-primary/60 text-transparent bg-clip-text">
                SCRAPE
              </span>
              <span className="text-xl">FLOW</span>
            </div></Link></div>
            <ModeToggle/>
        </div>
        <Separator className="my-4" />

        {/* Execution Details */}
        <div className="flex justify-between items-center mb-4 p-4 rounded-md bg-muted/10">
          <div className="flex items-center gap-2">
            <ExecuteStatus status={execution?.status!} />
            <div className="flex items-center gap-1">
              <ClockIcon size={24} className="text-muted-foreground" />
              <span className="text-lg font-semibold">
                {dateToDuration(execution?.startedAt, execution?.completedAt)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <CoinsIcon size={24} className="text-yellow-500"  />
            <span className="text-lg font-semibold">{execution?.creditConsumed} Credits</span>
          </div>
        </div>
  
        <Separator className="my-4" />
  
        {/* Phases */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <WorkflowIcon size={20} className="text-muted-foreground" />
            <span className="font-semibold text-lg">Phases</span>
          </div>
          <div className="flex flex-col gap-3">
            {execution?.phase?.map((phaseItem: any, index: number) => (
              <Button
                key={index}
                onClick={() => setCurrentPhase(phaseItem.id)}
                variant={currentPhase === phaseItem.id ? "secondary" : "outline"}
                className={cn(
                  "flex items-center justify-between gap-4 p-3 rounded-md shadow-sm transition-colors",
                  loadingPhase === phaseItem.id
                    ? "opacity-50 pointer-events-none"
                    : "hover:bg-muted/20"
                )}
                disabled={loadingPhase === phaseItem.id}
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{index + 1}</Badge>
                  <span className="truncate">{phaseItem.name}</span>
                </div>
                <PhaseStatus status={phaseItem.status} />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  
   
  <div className="flex flex-col items-center justify-center overflow-y-scroll flex-1 px-4 ml-[30vh] " >
  {loadingPhase && <div className="text-center text-yellow-500  items-center justify-center ml-[20vh]"><Loader size={40} className="animate-spin"/></div>}
  {currentPhase && error[currentPhase] && (
    <p className="text-red-500">{error[currentPhase]}</p>
  )}
  {phaseDetail ? (
    <div className="flex flex-col items-center gap-6 justify-center w-full  ">
      <Card className="min-w-[600px] max-w-[600px] ">
        <CardHeader>
          <CardTitle className="text-center text-lg">Phase Details</CardTitle>
          <CardDescription className="text-center">
            Details for the selected phase
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <ParameterViewer
            title="Inputs"
            subtitle="Inputs used for this phase"
            paramJson={phaseDetail.inputs}
          />
          <ParameterViewer
            title="Outputs"
            subtitle="Outputs generated for this phase"
            paramJson={phaseDetail.outputs}
          />
        </CardContent>
      </Card>
      {phaseDetail.logs.length > 0 && (
        <div className="w-full max-w-[600px]">
          <LogTable logs={phaseDetail.logs} />
        </div>
      )}
    </div>
  ) : (
    !loadingPhase && (
      <p className="text-center text-muted-foreground  items-center justify-center ml-[20vh]">
        Select a phase to view details.
      </p>
    )
  )}
</div>

    


  </div>
  
  
  );
}

const PhaseStatus = ({ status }: { status: string }) => {
  switch (status) {
    case "PENDING":
      return <ClockIcon size={20} className="text-muted-foreground" />;
    case "RUNNING":
      return <ClockIcon size={20} className="text-blue-500" />;
    case "FAILED":
      return <AlertCircleIcon size={20} className="text-red-500" />;
    case "COMPLETED":
      return <CheckCircleIcon size={20} className="text-green-500" />;
    default:
      return <ClockIcon size={20} className="text-muted-foreground" />;
  }
};

const ParameterViewer = ({ title, subtitle, paramJson }: any) => {
  const params = paramJson ? JSON.parse(paramJson) : undefined;
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {params ? (
          Object.entries(params).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">{key}</p>
              <Input readOnly value={value as string} className="w-full" />
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">
            No parameters available.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

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
  return <Badge className={cn(color,"capitalize")} >{status}</Badge>;
  };