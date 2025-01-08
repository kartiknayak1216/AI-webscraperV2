import { TaskParamType, TaskType, WorkflowTask } from '@/lib/types/task'
import { CodeIcon, LucideProps } from 'lucide-react'
import React from 'react'

export const PageToHtml= {
    type:TaskType.PAGE_TO_HTML,
    label:"Page to HTML",
    icon:(props: LucideProps) => <CodeIcon {...props} />,
   isEntry:false,
   inputs:[{
       name:"Web page",
       type:TaskParamType.BROWSER_INSTANCE,
       required:true,
   }] as const,
   outputs:[{
    name:"Web page",
    type:TaskParamType.BROWSER_INSTANCE,
    required:true,

},{
    name:"HTML",
    type:TaskParamType.STRING,
    required:true,

   }] as const,
   credit:2 
}satisfies WorkflowTask
