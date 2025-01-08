import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TaskParams } from '@/lib/types/task';
import { cn } from '@/lib/utils';
import React, { useEffect, useId, useState } from 'react';

export interface ParamProps{
  param:TaskParams;
  value:string|undefined;
  updateNodeParamValue:(data:string)=>void
   isRreq:boolean,
}

export default function StringParam({ param,value,updateNodeParamValue,isRreq, }: ParamProps) {
  const { name, helperText, required, hideHandle, ...otherProps } = param;
  const id = useId()
const [internalvalue,setInternalvalue] = useState(value)



useEffect(()=>{
  setInternalvalue(value ?? "")},[value])

return (
 <div className={cn('space-y-1 p-1 w-full')}>
    <Label htmlFor={id} className='text-xs flex'>
        {param.name}
        {param.required && <p className='text-red-400 px-2'>*</p>}
    </Label>
    <Input id={id} disabled={isRreq}
    onBlur={(e)=>updateNodeParamValue(e.target.value)} value={internalvalue} placeholder={"Enter value here"} onChange={(e)=>setInternalvalue(e.target.value)} />
    {param.helperText && (
        <p className='text-muted-foreground px-2'>
            {
                param.helperText
            }
        </p>
    )}
 </div>
  );
}
