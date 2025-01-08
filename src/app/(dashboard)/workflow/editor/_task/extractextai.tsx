import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types/task";
import { BrainIcon, CodeIcon, LucideProps } from "lucide-react";

export const ExtractTextAi ={
    type:TaskType.EXTRACT_DATA_WITH_AI,
    label:"Extract data ",
   icon:function(props:LucideProps){
return <BrainIcon {...props}/>
   },
   isEntry:false,
   credit:2,
   inputs:[
      {
         name:"Content",
         type:TaskParamType.STRING,
         required:true,


      },  {
        name:"Credentials",
        type:TaskParamType.CREDENTIAL,
        required:true,


     },
     {
        name:"Prompt",
        type:TaskParamType.STRING,
        required:true,
     variant:"textarea"

     }
   ]as const,
 outputs:[
    {
        name:"Extracted Data",
        type:TaskParamType.STRING,
        required:true,


    }
 ]as const
} satisfies WorkflowTask