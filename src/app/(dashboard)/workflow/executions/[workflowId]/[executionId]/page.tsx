import { Skeleton } from "@/components/ui/skeleton";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Executionviewerpage({
    params,
  }: {
    params: { executionId: string; workflowId: string };
  }){


    redirect(`/workflow/execution/${params.workflowId}/${params.executionId}`);
    return(
         <div className="flex flex-col h-screen w-full overflow-hidden">
              <section className="flex h-full overflow-auto">
                {/* Main content with skeleton as fallback */}
                <Suspense fallback={<UserWorkflowSkeleton />}>
                 
                </Suspense>
              </section>
            </div>
    )
  }
  function UserWorkflowSkeleton() {
    return (
      <div className="">
        <Skeleton className="w-[440px] max-w-[440px] border-r h-full" />
      </div>
    );
  }