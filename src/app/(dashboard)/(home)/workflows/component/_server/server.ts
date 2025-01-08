"use server"
import { CreateFlowNode } from "@/app/(dashboard)/workflow/editor/[workflowId]/_component/createnode";
import prisma from "@/lib/prisma";
import { AppNode, TaskType } from "@/lib/types/task";
import { currentUser } from "@clerk/nextjs/server";
import { Workflow } from "@prisma/client";
import { Edge } from "@xyflow/react";


interface ApiResponse<T> {
    status: number;
    message: string;
    data?: T;
  }

export async function CreateWorkflowServer(description: string, name: string, status: string):Promise<ApiResponse<Workflow>>{

    try{
        const user = await currentUser();

        if (!user) {
            return { status: 401, message: "Unauthorized: User not logged in." };
          }

          const intial:{
            nodes:AppNode[],edges:Edge[]
          }={
            nodes:[],
            edges:[]
          }
          intial.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER))

          const workflow = await prisma.workflow.create({
            data: {
              userId: user?.id,
              description,
              name,
              status,
              defination:JSON.stringify(intial)
            },
          });
          if (workflow) {
            return { status: 200, message: "Workflow created successfully.",data:workflow };
          } else {
            return { status: 500, message: "Failed to create the workflow." };
          }
    }
    catch(error){
        console.error("Error creating workflow:", error);
        return { status: 500, message: "Failed to create the workflow." };
    }
}
export async function FetchWorkflowServer():Promise<ApiResponse<Workflow[]>>{
    try {
        const user = await currentUser();

      if (!user) {
        return { status: 401, message: "Unauthorized: User not logged in." };
      }
  
      const workflows = await prisma.workflow.findMany({
        where: {
          userId: user.id,
        },
       
      })
  
      return { status: 200,message:"Workflow fetched sucessfully" ,data: workflows };
    } catch (error) {
      console.error("Error fetching workflow:", error);
      return { status: 500, message: "Failed to fetch the workflows." };
    }
  };
  export async function DeleteWorkflowServer (id: string): Promise<ApiResponse<null>>{
    try {
      await prisma.workflow.delete({
        where: { id },
      });
      return { status: 200, message: "Workflow deleted successfully" };
    } catch (error) {
      console.error("Error deleting workflow:", error);
      return { status: 500, message: "Failed to delete the workflow." };
    }
  };
  