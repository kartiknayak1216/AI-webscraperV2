"use server";
import { auth, currentUser } from '@clerk/nextjs/server';
import React, { Suspense } from 'react';
import { GetWorkflowExecutionWithPhase } from './server/server';
import Executionviewer from '../../component/executionviewer';
import { Skeleton } from '@/components/ui/skeleton';
import ExecutionViewerWrapperClient from './ExectionViewerWrapper';

export default async function Executionviewerpage({
  params,
}: {
  params: { executionId: string; workflowsId: string };
}) {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <section className="flex h-full overflow-auto">
        {/* Main content with skeleton as fallback */}
        <Suspense fallback={<UserWorkflowSkeleton />}>
          <ExectionViewerWrapper
            executionId={params.executionId}
            workflowId={params.workflowsId}
          />
        </Suspense>
      </section>
    </div>
  );
}

async function ExectionViewerWrapper({
  executionId,
  workflowId,
}: {
  executionId: string;
  workflowId: string;
}) {
  const user = await currentUser();

  if (!user) {
    return 
  }

  const execution = await GetWorkflowExecutionWithPhase(workflowId, executionId)
  if (!execution) {
    return
  }
  console.log("exc----------got-----------------")

  return (
    <div>
      <Executionviewer execution={execution} />
    </div>
  );
}

function UserWorkflowSkeleton() {
  return (
    <div className="">
      <Skeleton className="w-[440px] max-w-[440px] border-r h-full" />
    </div>
  );
}