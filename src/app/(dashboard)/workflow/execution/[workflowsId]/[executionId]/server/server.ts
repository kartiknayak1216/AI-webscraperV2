"use server"

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const  GetWorkflowExecutionWithPhase=async(workflowId:string,executionId:string)=>{
    const user = await currentUser();
    if(!user){
        return
    }

    return prisma.workflowExecution.findUnique({
        where:{
            id:executionId,userId:user.id,
            workflowId:workflowId
        },
        include:{
            phase:{
                orderBy:{
                    startedAt:"asc"
                },
              
                
            }
        }
    })
}

export const  GetPhase=async(phaseId:string)=>{
    const user = await currentUser();
    
    if(!user){
        return
    }

    return prisma.executionPhase.findUnique({
    where:{
        id:phaseId,
        execution:{
            userId:user.id
        }
    },
    include:{
        logs:true
    }
    })

}

export const CreateLogForExecution = async (
    logLevel: string,
    message: string,
    executionPhaseId: string
  ): Promise<boolean> => {
    try {
      if (!logLevel || !message || !executionPhaseId) {
        console.error("Missing required parameters for creating log.");
        return false;
      }
  
      await prisma.executionLog.create({
        data: {
          logLevel: logLevel,
          message: message,
          executionPhaseId: executionPhaseId,
        },
      });
  
      return true;
    } catch (error) {
      console.error("Error creating log:", error);
      return false; 
    }
  };
  