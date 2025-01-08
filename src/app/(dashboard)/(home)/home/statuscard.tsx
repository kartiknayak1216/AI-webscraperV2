import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { LucideIcon } from 'lucide-react'
import Rectcounup from './reactcount'

type Props={
title:string,
value:number,
icon:LucideIcon
}
export default function Statuscardhed(prop:Props) {
  return (
    <Card className='relative overflow-hidden h-full'>
        <CardHeader className='flex pb-2'>
            <CardTitle>{prop.title}</CardTitle>
            <prop.icon/>
        </CardHeader>
      <CardContent>
      <div className='text-2xl font-bold text-primary'>
        <Rectcounup num={prop.value}/>
        </div >
      </CardContent>
    </Card>
  )
}
