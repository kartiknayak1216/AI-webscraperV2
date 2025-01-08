import { Workflow, WorkflowExecution } from '@prisma/client';
import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import FlowEditor from './floweditor';
import { ModeToggle } from '@/components/global/moddletoggle';
import { Separator } from '@/components/ui/separator';
import Savebutton from './savebutton';
import { InvalidContextProvider } from '../context/invalidcontext';
import Executionbutton from '../_execution/executionbutton';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import Execution from './execution';
import { ShareButton } from './sharebutton';
import PublishButton from './publishworkflow';
import UnpublishButton from './unpuplish';

export default function Editor({ workflow, execution }: { workflow: Workflow, execution: WorkflowExecution[] }) {
  return (
    <InvalidContextProvider>
      <ReactFlowProvider>
        <Tabs defaultValue="editor" className="h-screen flex flex-col min-w-full max-w-full">
          {/* Header */}
          <header className="sticky top-0  flex items-center justify-between  px-8 py-3">
            <div className="flex items-center gap-4">
              <Savebutton workflowId={workflow.id} />
              <Executionbutton worflowId={workflow.id} />
            </div>
            <TabsList className="flex gap-4">
              <TabsTrigger value="editor" className="px-4 py-2 font-medium text-sm rounded-md hover:bg-gray-200 data-[state=active]:bg-blue-200 data-[state=active]:text-blue-600">
                Editor
              </TabsTrigger>
              <TabsTrigger value="execution" className="px-4 py-2 font-medium text-sm rounded-md hover:bg-gray-200 data-[state=active]:bg-blue-200 data-[state=active]:text-blue-600">
                Executions
              </TabsTrigger>
            </TabsList>
            <ShareButton excId={workflow.id}/>
            {workflow.ispublished ?
            <UnpublishButton workflowId={workflow.id}/>
           : <PublishButton workflowId={workflow.id}/>}
            <ModeToggle />
          </header>

          {/* Content */}
          <Separator className="border-t" />
          <div className="flex-1 overflow-hidden">
            <TabsContent value="editor" className="h-full ">
              <FlowEditor workflow={workflow} />
            </TabsContent>
            <TabsContent value="execution" className="h-full p-4">
              <Execution execution={execution} />
            </TabsContent>
          </div>
        </Tabs>
      </ReactFlowProvider>
    </InvalidContextProvider>
  );
}
