"use client"
import React from 'react'
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import FormGenerator from '@/components/form/formgenerator';
import useWorkflow from '../hooks/useworkflow';

export default function Workflowform() {
    const {
        addWorkflow,
        loading,
        register,
        handleSubmit,
        errors,
      } = useWorkflow();

    return (
        <form onSubmit={handleSubmit(addWorkflow)}  className="flex flex-col gap-3"
>
 <FormGenerator
                error={errors}
                register={register}
                name="name"
                type="text"
                inputType="input"
                label="Choose a unique name for Workflow"
            
              />
               <FormGenerator
                error={errors}
                register={register}
                name="description"
                type="text"
                inputType="textarea"
                label="Gave a short valuable description of your workflow"
              />

<Button  type='submit'>{loading?<Loader2 className='animate-spin'/>:<div>Create Workflow</div>}</Button>
</form>
  )
}
