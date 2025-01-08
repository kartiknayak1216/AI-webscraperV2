import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import React from 'react'

interface Props{
    title?:string;
    subTitle?:string
    icon?:LucideIcon
    iconClass?:string
    titleClass?:string
    subClass?:string


}
export default function CustomDialogheader(props:Props) {
  return (
<DialogHeader className='py-6'>
<DialogTitle asChild>
    <div className='flex flex-col items-center gap-2 mb-2'>
{props.icon &&<props.icon size={30} className={cn("stroke-primary",props.iconClass)}/>
}
{props.title  && <p className={cn("text-xl text-primary",props.titleClass)}>
  {props.title}  </p>}
    {props.subTitle  && <p className={cn("text-sm text-muted-foreground",props.subClass)}>
  {props.subTitle}  </p>}
    </div>
</DialogTitle>
</DialogHeader>  )
}
