import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types/task";
import { LucideProps, MergeIcon } from "lucide-react";

export const MergeJson={
    type:TaskType.MERGE_JSON,
    label:"Merge JSON",
   icon:function(props:LucideProps){
return <MergeIcon {...props}/>
   },
   isEntry:false,
   credit:2,
   inputs:[
    {
        name:"JSON1",
        type:TaskParamType.STRING,
        required:true,
    },
    {
        name:"JSON2",
        type:TaskParamType.STRING,
        required:true,
    }
   ]as const,
 outputs:[
    {
        name:"JSON",
        type:TaskParamType.STRING,
        required:true,

    }
 ]as const
} satisfies WorkflowTask