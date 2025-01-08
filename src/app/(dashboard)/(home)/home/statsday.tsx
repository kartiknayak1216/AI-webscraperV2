"use client"
import React from 'react'
import { getstatsForday } from './server/server'
import { ChartConfig,ChartContainer,ChartLegend,ChartLegendContent,ChartStyle,ChartTooltip,ChartTooltipContent } from '@/components/ui/chart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Layers2 } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

type stats= Awaited<ReturnType<typeof getstatsForday>>
const config ={
    sucess:{
label:"Success",
color:"hsl(var(--chart-2))"
    },
    failed:{
        labe:"Failed",
        color:"hsl(var(--chart-2))"

    }
}
export default function Statsday({stats}:{stats:stats}) {
    const chartData = Object.entries(stats).map(([date, values]) => ({
        date,
        success: values.success,
        failure: values.failure,
      }));
  return (
<Card>
    <CardHeader>
        <CardTitle className='text-2xl font-bold flex items-center gap-2'>
            <Layers2 className='w-6 h-6 text-primary'/>
            Workflow execution status
        </CardTitle>
        <CardDescription>
            Daily workflow execution
        </CardDescription>
    </CardHeader>
    <CardContent>
     <ChartContainer className='max-h-[200px] w-full' config={config}>
     <AreaChart data={chartData} height={200}
     accessibilityLayer margin={{top:20}}>
<CartesianGrid vertical={false}/>
<XAxis dataKey={"date"} 
tickLine={false}
axisLine={false}
tickMargin={8}
minTickGap={32}
tickFormatter={value=>{
  
    const date = new Date(value)
    return date.toLocaleDateString("en-US",{
        month:"short",
        day:"numeric"

    })

}}
/>
<ChartLegend/>
<ChartTooltip/>
<Area dataKey={"success"}
min={0}
fill={"var(--color-sucess)"}
stroke={"var(--color-sucess)"}
fillOpacity={0.6}
type={"bump"}
stackId={"a"}

/>

<Area dataKey={"failure"}

min={0}
fill={"var(--color-failed)"}
stroke={"var(--color-failed)"}
fillOpacity={0.6}
type={"bump"}
stackId={"a"}
/>

        </AreaChart>

        </ChartContainer>   
    </CardContent>
</Card>  
)
}
