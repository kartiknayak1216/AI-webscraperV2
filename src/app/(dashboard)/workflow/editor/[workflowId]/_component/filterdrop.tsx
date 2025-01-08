"use client"
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { ChevronDown, MoreHorizontal } from 'lucide-react'
import { FilterType } from './execution'
type Params={
type:FilterType,
settype:React.Dispatch<React.SetStateAction<FilterType>>
}

export default function Filterdrop({params}:{params:Params}) {
    const { type, settype } = params;
    return (

    <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="ml-auto">
        {type.toUpperCase()} <ChevronDown />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
    <DropdownMenuItem
          onClick={() => settype(FilterType.All)}
          className={type === FilterType.All ? "font-bold" : ""}
        >
          All
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => settype(FilterType.AUTO)}
          className={type === FilterType.AUTO ? "font-bold" : ""}
        >
          Auto
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => settype(FilterType.MANUAL)}
          className={type === FilterType.MANUAL ? "font-bold" : ""}
        >
          Manual
        </DropdownMenuItem>
      </DropdownMenuContent>
    
  </DropdownMenu>
  )
    
}
