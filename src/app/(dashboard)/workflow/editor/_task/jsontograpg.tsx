import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types/task";
import { LucideProps, MergeIcon } from "lucide-react";
import { GraphHelpers } from "next/dist/compiled/webpack/webpack";

export const MergeJson={
    type:TaskType.MERGE_JSON,
    label:"JSON To Graph",
   icon:function(props:LucideProps){
return <GraphHelpers {...props}/>
   },
   isEntry:false,
   credit:2,

   inputs:[
    {
        name:"JSON1",
        type:TaskParamType.STRING,
        required:true,
    }
   ]as const,
 outputs:[
    {
        name:"JSONGraph",
        type:TaskParamType.STRING,
    } 
 ]as const,
} satisfies WorkflowTask