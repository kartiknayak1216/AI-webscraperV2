import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types/task"
import { LucideProps, MouseIcon,TimerIcon } from "lucide-react"

export const WaitForElement ={
    type:TaskType.WAIT_FOR_ELEMENT,
    label:"Wait For Element",
   icon:function(props:LucideProps){
return <TimerIcon {...props}/>
   },
   isEntry:false,
   credit:2,
   inputs:[
      {
         name:"Web page",
         type:TaskParamType.BROWSER_INSTANCE,
         required:true,
     },
      {
         name:"Selector",
         type:TaskParamType.STRING,
         required:true,
     
     
      }, 
      {
        name:"Visiblity",
        type:TaskParamType.SELECT,
        required:true,
        options:[
            {label:"Vissible",value:"visible"},
            {label:"Hidden",value:"hidden"}
        ]


     }
   ]as const,
 outputs:[
   {
    name:"Web page",
    type:TaskParamType.BROWSER_INSTANCE,
    required:true,

   }
 ]as const
} satisfies WorkflowTask

