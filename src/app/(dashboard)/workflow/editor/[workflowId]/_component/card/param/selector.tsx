import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TaskParams } from "@/lib/types/task";
import { cn } from "@/lib/utils";
import React, { useEffect, useId, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ParamProps {
  param: TaskParams  
  value: string | undefined;
  updateNodeParamValue: (data: string) => void;
  isReq: boolean;
}

export default function Selector({
  param,
  value,
  updateNodeParamValue,
  isReq,
}: ParamProps) {
  const { name, helperText, required, options = [] } = param; 
  const id = useId();
  const [internalValue, setInternalValue] = useState(param.options[0]);

  useEffect(() => {
    setInternalValue(value ?? "");
  }, [value]);

  return (
    <div className={cn("space-y-1 p-1 w-full")}>
      <Label htmlFor={id} className="text-xs flex">
        {name}
        {required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Select
        onValueChange={(val) => {
          setInternalValue(val); 
          updateNodeParamValue(val); 
        }}
        value={internalValue}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup >
            <SelectLabel>Options</SelectLabel>
            {param.options.map((opt:any) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {helperText && (
        <p className="text-muted-foreground px-2">{helperText}</p>
      )}
    </div>
  );
}
