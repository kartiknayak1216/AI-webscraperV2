import { RunWorkFlow, RunWorkFlowAuto } from "@/app/(dashboard)/workflow/editor/[workflowId]/_server/server"
import prisma from "@/lib/prisma"
import parser from "cron-parser";
import { timingSafeEqual } from "crypto";

const isValid =(secret:string)=>{
const apisecret= process.env.API_SECRET
if(!apisecret) return false
try{


return timingSafeEqual(Buffer.from(secret),Buffer.from(apisecret))
}catch(error){
    return false
}
}

export async function POST(req:Request){
try{
    const authHeader= req.headers.get("authorization")


if(!authHeader || !authHeader.startsWith("Bearer ")){

    return new Response(JSON.stringify({  error: "Unauthorize."  }),{
        status:401,
        headers: { "Content-Type": "application/json" },

    })}
const secret = authHeader?.split(" ")[1];
if(!isValid(secret))
    return new Response(JSON.stringify({  error: "Unauthorize."  }),{
        status:401,
        headers: { "Content-Type": "application/json" },

    })



    const workflows= await prisma.workflow.findMany({
        where:{
            ispublished:true,
            executionFlow:{
                not:null
            },
            status:"AUTO",
            cron:{
                not: null
            },
            nextRunAt:{
                not: null,
                lte:new Date()
            }
        },
       
    })
if(!workflows || workflows.length === 0){
    return new Response(JSON.stringify({  message: "No workflows eligible for execution."  }),{
        status:200,
        headers: { "Content-Type": "application/json" },

    })}

    const execution= await Promise.all(
        workflows.map(async(workflow)=>{
            try{
                const { executionPlan, executionFlow } = workflow
                if (!executionPlan || !executionFlow) {
                    return {
                      id: workflow.id,
                      success: false,
                      message: "Execution plan or flow is missing.",
                    };
                  }

          const {edges} = JSON.parse(executionFlow);
          const executionPhase = JSON.parse(executionPlan);

          await RunWorkFlowAuto(workflow.id, executionPhase, edges, "auto",workflow.userId);

          await prisma.workflow.findUnique({
            where:{
                id:workflow.id
            },
            select:{
                lastRunAt:true
            }
          })

           let interval;
           if(!workflow.cron){
            return { id: workflow.id, success: false, message: "No cron set" };

           }
              try {
                interval = parser.parseExpression(workflow.cron, { utc: true });
              } catch (parseError) {
                return { id: workflow.id, success: false, message: "Invalid Cron Expression." };
            }
            console.log(interval.next().toDate())
          await prisma.workflow.update({
            where:{
                id:workflow.id,
            },
            data:{
               nextRunAt: interval.next().toDate(),
            }
          })
          
          return { id: workflow.id, success: true }; 

            }
            catch(error){
                return {
                    id: workflow.id,
                    success: false,
                    error:  "error occurred.",
                  };     
            }
        })
    )
    return new Response(JSON.stringify({result:execution}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });




}catch(error){
    return new Response(JSON.stringify({ error: "Failed to execute workflows." }),{
        status:500,
        headers: { "Content-Type": "application/json" },

    })   
}

}