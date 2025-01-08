"use client"
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarRangeIcon, ClockIcon, TriangleAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CustomDialogheader from "./CustomDialogheader";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { UpdateWorkflowCron } from "./_server/cron";
import { toast } from "sonner";
import cronstrue from 'cronstrue';
import cronParser from "cron-parser"
import { isValid } from "date-fns";
export default function Scheduledialog({ workflowId,fetchcron}: { workflowId: string,fetchcron?:string}) {
  const [cron, setCron] = useState<string|null>(fetchcron!);
  const [readable, setredable] = useState<string>("");

const[validcron,setvalidcron]= useState<boolean>(true)
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ id, cron }: { id: string; cron: string }) => {
      return await UpdateWorkflowCron(id, cron);
    },
    onSuccess: (data) => {
      if (data.status !== 200) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
    },
    onError: (error) => {
      console.error("Execution error:", error);
      toast.error("Execution failed.");
    },
  });

  const handleClick = () => {
    if(!cron){
        toast.error("Please enter a cron expression.");
        return
    }
    if(!validcron){
        toast.error("Invalid cron expression")
        return
    }
    mutate({ id: workflowId, cron });
  };

  useEffect(()=>{
    if(!cron){
        setredable("");
        setvalidcron(true)
        return
    }
    try { cronParser.parseExpression(cron) 
        setvalidcron(true);
        const readableText = cronstrue.toString(cron);
        setredable(readableText);
        
    } catch(e) { setvalidcron(false)
        setvalidcron(false);
        setredable("");

     }  


},[cron])


  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant={"link"}
          size={"sm"}
          className={cn("text-sm p-0 h-auto")}
        >
{
  validcron && cron    ? (<div className="flex items-center text-sm  text-muted-foreground">
        <ClockIcon/>
        <div className="text-sm  text-muted-foreground">{readable}</div>
    </div>):
    (
        <div className="flex items-center gap-1">
        <TriangleAlertIcon className="h-3 w-3" />
<div className="text-sm  text-muted-foreground">            Set Schedule
</div>          </div>
    )
}

     
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogheader
          title="Schedule workflow execution"
          icon={CalendarRangeIcon}
        />
        <div className="p-6 space-y-4">
          <p className="text-muted-foreground text-sm">
            Specify a cron expression to schedule periodic workflow execution.
            All times are in UTC.
          </p>
          <Input
            placeholder="e.g., * * * * *"
            value={cron||""}
            onChange={(e) => setCron(e.target.value)}
          />
         {cron ? (
            validcron ? (
              <div className="text-sm">{readable}</div>
            ) : (
              <div className="text-destructive text-sm">
                Invalid Cron expression
              </div>
            )
          ) : (
            <div className="text-muted text-sm">Enter a cron expression</div>
          )}
        </div>
        <DialogFooter>
        <DialogClose asChild>
          <Button className="w-full" variant={"secondary"}>
            Cancel
          </Button>
        </DialogClose>
        <Button
          className="w-full"
          onClick={handleClick}
          disabled={isPending || !validcron}
        >
          {isPending ? "Saving..." : "Save"}
        </Button>
      </DialogFooter>
      </DialogContent>
    
    </Dialog>
  );
}
