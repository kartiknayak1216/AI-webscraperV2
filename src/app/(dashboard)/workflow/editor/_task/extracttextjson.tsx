import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types/task";
import { CodeIcon, FileJson2, LucideProps,Webhook } from "lucide-react";

export const TextJson={
    type:TaskType.EXTRACT_TEXT_JSON,
    label:"Extract Text From Json",
   icon:function(props:LucideProps){
return <FileJson2 {...props}/>
   },
   isEntry:false,
   credit:2,
   inputs:[
    {
        name:"JSON",
        type:TaskParamType.STRING,
        required:true,
    },
    {
        name:"Targeted Text",
        type:TaskParamType.STRING,
        required:true,

    }
   ]as const,
 outputs:[
    {
        name:"Targeted Text",
        type:TaskParamType.STRING,
        required:true,


    },
    {
        name:"Extracted Text",
        type:TaskParamType.STRING,
        required:true,


    },
    {
        name:"JSON",
        type:TaskParamType.STRING,
        required:true,

    }
 ]as const
} satisfies WorkflowTask