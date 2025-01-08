import { TaskParamType, TaskType, WorkflowTask } from '@/lib/types/task'
import { LucideProps,GlobeIcon, CodeIcon, MouseIcon } from 'lucide-react'
import React from 'react'

export const ClickElement ={
    type:TaskType.CLICK_ELEMENT,
    label:"Click Element",
   icon:function(props:LucideProps){
return <MouseIcon {...props}/>
   },
   isEntry:false,
   credit:2,
   inputs:[
      {
         name:"Web page",
         type:TaskParamType.BROWSER_INSTANCE,
         required:true,


      },  {
        name:"Selector",
        type:TaskParamType.STRING,
        required:true,


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

