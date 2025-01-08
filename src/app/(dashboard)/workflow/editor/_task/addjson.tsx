import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types/task";
import { CodeIcon, FileJson2Icon, LucideProps,Webhook } from "lucide-react";

export const AddTextJson={
    type:TaskType.ADD_TEXT_JSON,
    label:"Add  Text to Json",
   icon:function(props:LucideProps){
return <FileJson2Icon {...props}/>
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
        name:"Append Text",
        type:TaskParamType.STRING,
        required:true,

    },
    {
        name:"Append Text Value",
        type:TaskParamType.STRING,
        required:true,

    }
   ]as const,
 outputs:[
    {
        name:"Manipulated JSON",
        type:TaskParamType.STRING,
        required:true,

    }
 ]as const
} satisfies WorkflowTask