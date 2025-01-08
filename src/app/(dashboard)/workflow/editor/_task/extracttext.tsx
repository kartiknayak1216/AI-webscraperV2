import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types/task";
import { CodeIcon, LucideProps } from "lucide-react";

export const ExtractTextFromHtml ={
    type:TaskType.EXTRACT_TEXT_FROM_HTML,
    label:"Extract text",
   icon:function(props:LucideProps){
return <CodeIcon {...props}/>
   },
   isEntry:false,
   credit:2,
   inputs:[
      {
         name:"HTML",
         type:TaskParamType.STRING,
         required:true,


      },  {
        name:"Selector",
        type:TaskParamType.STRING,
        required:true,


     }
   ]as const,
 outputs:[
    {
        name:"Extracted text",
        type:TaskParamType.STRING,
        required:true,


    }
 ]as const
} satisfies WorkflowTask