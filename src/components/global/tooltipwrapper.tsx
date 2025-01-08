import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ReactNode } from "react"

interface Props{
    children:ReactNode;
    content:ReactNode;
    side?:"top"|"bottom"|"left"|"right"
}

export function TooltipWraapper(props:Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
         {props.children}
        </TooltipTrigger>
        <TooltipContent side={props.side}>
{
    props.content
}        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
