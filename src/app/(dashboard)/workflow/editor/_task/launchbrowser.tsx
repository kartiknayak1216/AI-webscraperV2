import { TaskParamType, TaskType, WorkflowTask } from '@/lib/types/task'
import { LucideProps,GlobeIcon } from 'lucide-react'
import React from 'react'

export const LaunchBrowser= {
 type:TaskType.LAUNCH_BROWSER,
 label:"Launch Browser",
 icon: (props: LucideProps) => <GlobeIcon {...props} />,
isEntry:true,
inputs:[{
    name:"Website Url",
    type:TaskParamType.STRING,
    helperText:"eg: https://chatgpt.com",
    required:true,
    hideHandle:true
}] as const,
outputs:[{
    name:"Web page",
    type:TaskParamType.BROWSER_INSTANCE,
    required:true,

}] as const,
credit:2 
}satisfies WorkflowTask
