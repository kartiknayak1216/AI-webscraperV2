import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types/task";
import { CodeIcon, LucideProps,Webhook } from "lucide-react";

export const WebHookDel={
    type:TaskType.DELIVER_WEBHOOK,
    label:"Webhook Delivery",
   icon:function(props:LucideProps){
return <Webhook {...props}/>
   },
   isEntry:false,
   credit:2,
   inputs:[
    {
        name:"Target Url",
        type:TaskParamType.STRING,
        helperText:"eg: https://chatgpt.com",
        required:true,
    },
    {
        name:"Payload",
        type:TaskParamType.STRING,
        required:true,
    }
   ]as const,
 outputs:[
    {
        name:"Status",
        type:TaskParamType.STRING,
        required:true,

    }
 ]as const
} satisfies WorkflowTask