import { Skeleton } from '@/components/ui/skeleton';
import React, { Suspense } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, InboxIcon } from 'lucide-react';
import { FetchCredentialServer } from './server/server';
import Credentialdialog from './credentialdialog';
import Credentialcard from './credentialcard';

export default function Page() {
  return (
    <div className="flex-1 flex flex-col max-h-screen px-6 py-4">
      <header className="flex justify-between items-center pb-4 border-b border-muted">
        <div>
          <h1 className="text-3xl font-bold leading-tight">Credentials</h1>
          <p className="text-muted-foreground mt-1">Manage your credential efficiently</p>
        </div>
        < Credentialdialog />
      </header>
      <main className="flex-1 py-6 overflow-auto">
        <Suspense fallback={<UserWorkflowSkeleton />}>
          <UserWorkflows />
        </Suspense>
      </main>
    </div>
  );
}

function UserWorkflowSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton className="h-32 w-full rounded-lg" key={i} />
      ))}
    </div>
  );
}

async function UserWorkflows() {
  try {
    const workflow = await FetchCredentialServer();

    if (!workflow.data || workflow.data.length === 0) {
      return (
        <div className="flex flex-col gap-4 h-full items-center justify-center text-center">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <InboxIcon size={40} className="stroke-primary" />
          </div>
          <h2 className="font-bold text-lg">No credential created yet</h2>
          <p className="text-sm text-muted-foreground">
            Click the button below to create your first credential.
          </p>
          < Credentialdialog triggerText="Create your first credential" />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-y-2">
        {workflow.data.map((workflow, index) => (
        <div key={index}>
            <Credentialcard credential={workflow}/>
        </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error fetching workflows:", error);
    return (
      <div className="py-6">
        <Alert variant="destructive" className="flex items-start gap-4">
          <AlertCircle className="w-5 h-5 mt-1 text-destructive" />
          <div>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Something went wrong. Please try again later.
            </AlertDescription>
          </div>
        </Alert>
      </div>
    );
  }
}