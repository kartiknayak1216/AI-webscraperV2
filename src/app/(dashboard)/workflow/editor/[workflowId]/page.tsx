import React from 'react';
import { findWorkflowById } from './_server/server';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Taskmenu from './_component/taskmenu';
import Editor from './_component/editor';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Execution from './_component/execution';

type WorkflowProps = {
  params: {
    workflowId: string;
  };
};

export default async function Page({ params }: WorkflowProps) {
  const { workflowId } = params;

  if (!workflowId) return;

  const result = await findWorkflowById(workflowId);

  if (!result.status) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert className="max-w-lg">
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>
            {result.error || 'An unknown error occurred'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const workflow = result.data;
  if (!workflow) return;




  return (
    <div className="flex flex-row min-h-screen max-h-screen w-full">
  <Editor workflow={workflow} execution={workflow.executions}/>
  </div>
   
  );
}
