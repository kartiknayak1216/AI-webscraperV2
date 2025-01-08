"use server"
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { ExecutionPhase as ExecutionPhases } from "../_execution/type/type";
import { TaskRegistery } from "../../_task";
import { ExecutionPhase, WorkflowExecution } from "@prisma/client";
import { ExecutionStatus } from "@/lib/types/workflow";
import { AppNode, TaskParamType } from "@/lib/types/task";
import { ExecutionRegistry } from "../executionregistry";
import { Environment, EnvironmentExecution, LogLevel } from "../executionregistry/type";
import { Browser, Page } from "puppeteer";
import { Edge } from "@xyflow/react";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import action from "./action";




export const findWorkflowById = async (id: string) => {
  try {
    const user = await currentUser();

    if (!user) {
      return { status: false, data: null, error: "User not authenticated" };
    }

    const workflow = await prisma.workflow.findUnique({
      where: {
        id,
        userId: user.id,
        
      },
      include:{
        executions: {
          orderBy:{
            createdAt:'desc'
          }
        }
      }
    });

    if (!workflow) {
      return { status: false, data: null, error: "Workflow not found or does not belong to the user" };
    }

    return { status: true, data: workflow, error: null };
  } catch (error) {
    console.error("Error fetching workflow:", error);
    return { status: false, data: null, error: "An unexpected error occurred" };
  }
};

export const updateWorkflow = async (id: string, definition: string) => {
  try {
    const user = await currentUser();

    if (!user) {
      return { status: false, data: null, error: "User not authenticated" };
    }

    const workflow = await prisma.workflow.findUnique({
      where: { id, userId: user.id },
    });

    if (!workflow) {
      return { status: false, data: null, error: "No workflow found" };
    }

    await prisma.workflow.update({
      where: { id },
      data: { defination:definition },
    });

    return { status: true, error: null };
  } catch (error) {
    console.error("Error updating workflow:", error);
    return { status: false, error: "An unexpected error occurred" };
  }
};

export const RunWorkFlow = async (
  workflowId: string,
  executionPhase: ExecutionPhases,
  edge: Edge[],
  trigger: string
) => {
  const user = await currentUser();
  const environment = { phase: {} };
  if (!user) {
    return { success: false, error: "User not authenticated." };
  }

  if (!workflowId) {
    return { success: false, error: "Workflow ID is missing." };
  }

  const workflow = await prisma.workflow.findUnique({
    where: { userId: user.id, id: workflowId },
  });

  if (!workflow) {
    return { success: false, error: "Workflow not found for the user." };
  }

  const cost = executionPhase.reduce((totalCost, phase) => {
    const phaseCost = phase.nodes.reduce((nodeCost, node) => {
      const task = TaskRegistery[node.data.type];
      return nodeCost + (task?.credit || 0);
    }, 0);
    return totalCost + phaseCost;
  }, 0);

  console.log("Calculated cost:", cost);

  const userAccount = await prisma.user.findUnique({
    where: { userId: user.id },
    select: { balance: true },
  });
  console.log("cost",userAccount)

  if (!userAccount || userAccount.balance===null) {
    return { success: false, error: "Failed to fetch user account details." };
  }

  if (userAccount.balance < cost) {
    return { success: false, error: "Insufficient balance to execute the workflow." };
  }

  await prisma.user.update({
    where: { userId: user.id },
    data: {
      balance: {
        decrement: cost,
      },
    },
  });

  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId: user.id,
      status: ExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger,
      creditConsumed: cost,
      phase: {
        create: executionPhase.flatMap((phase) =>
          phase.nodes.map((node) => ({
            userId: user.id,
            status: ExecutionStatus.PENDING,
            number: phase.phase,
            name: TaskRegistery[node.data.type]?.label || "Unknown Task",
            node: JSON.stringify(node),
          }))
        ),
      },
    },
    select: { id: true, phase: true },
  });

  if (!execution) {
    return { success: false, error: "Failed to create workflow execution." };
  }

  ExecutionAsyncOperation(execution.id, workflowId, edge, environment);

  return { success: true, url: `/workflow/execution/${workflowId}/${execution.id}` };
};

const initializeWorkflowExecution = async (executionId: string, workflowId: string) => {
  await prisma.$transaction([
    prisma.workflowExecution.update({
      where: { id: executionId },
      data: { startedAt: new Date(), status: ExecutionStatus.RUNNING },
    }),
    prisma.workflow.update({
      where: { id: workflowId },
      data: { lastRunAt: new Date(), lastRunStatus: ExecutionStatus.RUNNING, lastRunId: executionId },
    }),
  ]);
};

const initialPhaseStatus = async (phase: ExecutionPhase[]) => {
  await prisma.executionPhase.updateMany({
    where: { id: { in: phase.map((phase) => phase.id) } },
    data: { status: ExecutionStatus.PENDING },
  });
};

const finalPhaseStatus = async (
  phase: ExecutionPhase,
  status: boolean,
  environment: Environment
) => {
  const isComplete = status ? ExecutionStatus.COMPLETED : ExecutionStatus.FAILED;
  const node = JSON.parse(phase.node) as AppNode;

  const logs = environment.phase[node.id].logs.map((log) => ({
    logLevel: log.logLevel,
    message: log.message,
    executionPhaseId: phase.id,
  }));

  
    await prisma.$transaction([
      prisma.executionPhase.update({
        where: {
          id: phase.id,
        },
        data: {
          status:isComplete,
          completedAt: new Date(),
          outputs: JSON.stringify(environment.phase[node.id].outputs),
        },
      }),

      prisma.executionLog.createMany({
        data: logs,
      }),
    ]);
   
  
};



const finalizeWorkflowExecution = async (executionId: string, workflowId: string,status:boolean) => {
let result=  status===true?ExecutionStatus.COMPLETED:ExecutionStatus.FAILED
  await prisma.$transaction([
    prisma.workflowExecution.update({
      where: { id: executionId },
      data: { completedAt: new Date(), status: result},
    }),
    prisma.workflow.update({
      where: { id: workflowId },
      data: { lastRunStatus:result, updatedAt: new Date() },
    }),
  ]);
  console.log("completed")

};

async function executionPhaseexecutor(phase:ExecutionPhase,environment:Environment,edge:Edge[]):Promise<boolean>{

  const node = JSON.parse(phase.node) as AppNode
  const environmentExecution = createExecutionEnvironment(environment,node)
  console.log("edge",edge)
await setupEnvironmentPhase(environment,node,edge)
await prisma.executionPhase.update({
  where:{
    id:phase.id
  },
  data:{
status:ExecutionStatus.RUNNING,
startedAt:new Date(),
inputs:JSON.stringify(environment.phase[node.id].inputs)

  }
})

const registry = ExecutionRegistry(environmentExecution);

const runFn = registry[node.data.type];
  if(!runFn){
    return false
  }




  return await runFn(environmentExecution)
}
const setupEnvironmentPhase = async (environment: Environment, node: AppNode, edge: Edge[]) => {
  environment.phase[node.id] = {
    inputs: {},
    outputs: {},
    logs: [],
  };

  const inputsDefinition = TaskRegistery[node.data.type]?.inputs || [];
  const outputsDefinition = TaskRegistery[node.data.type]?.outputs || [];

  for (const input of inputsDefinition) {
    if (input.type === TaskParamType.BROWSER_INSTANCE) {
      continue;
    }
    let name = input.name;
    let data = node.data.inputs?.[input.name];

    if (data) {
      environment.phase[node.id].inputs[name] = data;
    } else {
      if (!Array.isArray(edge)) {
        console.error("Edge data is undefined or not an array.");
        continue;
      }

      let connectedEdge = edge.find(
        (edge) => edge.target === node.id && edge.targetHandle === input.name
      );

      if (!connectedEdge) {
        console.error("Missing input for node:", node.id, "input:", input.name);
        continue;
      }

      const outputValue =
        environment.phase[connectedEdge.source]?.outputs?.[connectedEdge.sourceHandle!];

      if (outputValue === undefined) {
        console.error(
          "Missing output value for source node:",
          connectedEdge.source,
          "source handle:",
          connectedEdge.sourceHandle
        );
        continue;
      }

      environment.phase[node.id].inputs[input.name] = outputValue;
    }
  }
};


const createExecutionEnvironment = (environment: Environment, node: AppNode): EnvironmentExecution<any> => {
  const getInput = (name: string) => {
    return environment.phase[node.id]?.inputs[name] || "";
  };
  const setOutput=(name: string,value:string)=>{
    return environment.phase[node.id].outputs[name] = value;

  }
  const setBrowser=(browser:Browser)=>{
(environment.browser=browser)
  }
  const getBrowser =()=>{
    return environment.browser
  }
  const setPage=(page:Page)=>environment.page=page
  const getPage=()=>{return environment.page}
  const setLog = (message: string, logLevel: LogLevel) => {
    if (!environment.phase[node.id]?.logs) {
      environment.phase[node.id].logs = [];
    }

    environment.phase[node.id].logs.push({ message, logLevel });
  };



  return {
    getInput,setBrowser,getBrowser,setPage,getPage,setOutput,setLog
  };
}

const ExecutionAsyncOperation = async (
  executionId: string,
  workflowId: string,
  edge: Edge[],
  environment: Environment
) => {
  try {
    const user = await currentUser();
    if (!user) {
      console.error("User Not Found.");
      return;
    }

    const execute = await prisma.workflowExecution.findUnique({
      where: { id: executionId, userId: user.id },
      include: { workflow: true, phase: true },
    });

    if (!execute) {
      console.error("Execution not found for async operation.");
      return;
    }

    // Initialize workflow execution
    await initializeWorkflowExecution(execute.id, workflowId);

    await initialPhaseStatus(execute.phase);

    let completeExecution = true;
    for (const phase of execute.phase) {
      const executionPhaseResult = await executionPhaseexecutor(phase, environment, edge);
      if (!executionPhaseResult) {
        completeExecution = false;
        await finalPhaseStatus(phase, executionPhaseResult, environment);
        break;
      } else {
        await finalPhaseStatus(phase, executionPhaseResult, environment);
      }
      await action(`/workflow/execution`)

    }

    await finalizeWorkflowExecution(execute.id, workflowId, completeExecution);
    await cleanUpEnvironment(environment);
await action(`/workflow/execution`)

  } catch (error) {
    console.error("Error during execution:", error);
  }
};

async function cleanUpEnvironment(environment:Environment){
  if(environment.browser){
      await environment.browser.close().catch((err)=>console.error("cannot close browser",err))
  }
}


export async function PublishWorkflow(workflowId: string, result: ExecutionPhases,flow:string): Promise<boolean> {
  const user = await currentUser();

  if (!user) {
    return false; 
  }

  try {
    const workflow = await prisma.workflow.findUnique({
      where: {
        id: workflowId,
      },
    });

    if (!workflow || workflow.userId !== user.id) {
      return false; 
    }

    if(workflow.ispublished){
      return false; 

    }
    await prisma.workflow.update({
      where: {
        id: workflowId,
      },
      data: {
        ispublished: true,
        executionPlan: JSON.stringify(result),
        executionFlow:flow,
        status:"AUTO" 

      },
    });

    return true; 
  } catch (error) {
    console.error("Error publishing workflow:", error);
    return false; 
  }
}

export async function UnpublishWorkflow(workflowId: string): Promise<boolean> {
  const user = await currentUser();

  if (!user) {
    return false;
  }

  try {
    const workflow = await prisma.workflow.findUnique({
      where: {
        id: workflowId,
      },
    });

    if (!workflow || workflow.userId !== user.id || !workflow.ispublished) {
      return false; 
    }

    await prisma.workflow.update({
      where: {
        id: workflowId,
      },
      data: {
        ispublished: false,
        executionPlan: null, 
        executionFlow:null,
        cron:null,
        nextRunAt:null,
       status:"DRAFT" 
      },
    });

    return true;
  } catch (error) {
    console.error("Error unpublishing workflow:", error);
    return false;
  }
}
export const RunWorkFlowAuto = async (workflowId: string, executionPhase: ExecutionPhases, edge: Edge[],trigger:string,
  userID:string
) => {
  console.log("started")
  console.log(trigger)
    const environment = { phase: {} };
   

    if (!workflowId) {
      return { success: false, error: "Workflow ID is missing." };
    }

    const workflow = await prisma.workflow.findUnique({
      where: { userId: userID, id: workflowId },
    });

    if (!workflow) {
      return { success: false, error: "Workflow not found for the user." };
    }
   

    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId,
        userId:userID,
        status: ExecutionStatus.PENDING,
        startedAt: new Date(),
        trigger: trigger,
        phase: {
          create: executionPhase.flatMap((phase) =>
            phase.nodes.map((node) => ({
              userId: userID,
              status: ExecutionStatus.PENDING,
              number: phase.phase,
              name: TaskRegistery[node.data.type].label,
              node: JSON.stringify(node),
            }))
          ),
        },
      },
      select: { id: true, phase: true },
    });

    if (!execution) {
      return { success: false, error: "Execution not created." };
    }

  ExecutionAsyncOperationAuto(execution.id, workflowId, edge, environment,userID);

     return { success: true, error: "Execution created." };

  
};
const ExecutionAsyncOperationAuto = async (
  executionId: string,
  workflowId: string,
  edge: Edge[],
  environment: Environment,
  userId:string
) => {
  
 
    const execute = await prisma.workflowExecution.findUnique({
      where: { id: executionId, userId:userId},
      include: { workflow: true, phase: true },
    });

    if (!execute) {
      console.error("Execution not found for async operation.");
      return;
    }

    await initializeWorkflowExecution(execute.id, workflowId);
    await initialPhaseStatus(execute.phase);

    let completeExecution= true
    for (const phase of execute.phase) {
      const executionPhaseResult = await executionPhaseexecutor(phase, environment, edge);
      if(!executionPhaseResult){
        completeExecution=false
        await finalPhaseStatus(phase, executionPhaseResult, environment);
        break
      }
      else{
        await finalPhaseStatus(phase, executionPhaseResult, environment);
 
      }
    }
    await finalizeWorkflowExecution(execute.id, workflowId,completeExecution);
    await cleanUpEnvironment(environment)

};