import prisma from '@/lib/prisma';
import { ExecutionStatus } from '@/lib/types/workflow';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

type Params = {
  params: {
    workflowId: string;
  };
};

export default async function Page({ params }: Params) {
  const user = await currentUser();
  if (!user || !params.workflowId) {
    return (
      <div className="flex items-center justify-center h-screen">
        Invalid user or workflow
      </div>
    );
  }

  const workflowDetail = await prisma.workflow.findUnique({
    where: {
      id: params.workflowId,
    },
    select: {
      userId: true,
      description: true,
      name: true,
      defination: true,
    },
  });

  if (!workflowDetail) {
    return (
      <div className="flex items-center justify-center h-screen">
        Workflow not found
      </div>
    );
  }

  const isUserItself = workflowDetail.userId === user.id;

  if (isUserItself) {
    redirect(`/workflow/editor/${params.workflowId}`);
  }

  const createWorkflow = await prisma.workflow.create({
    data: {
      userId: user.id,
      name: workflowDetail.name,
      description: workflowDetail.description,
      defination: workflowDetail.defination,
      status: ExecutionStatus.CREATED,
    },
    select: {
      id: true,
    },
  });

  if (createWorkflow) {
    redirect(`/workflow/editor/${createWorkflow.id}`);
  }

  redirect(`/home`);


  return (
    <div className="flex items-center justify-center h-screen">
      Failed to clone workflow
    </div>
  );
}
