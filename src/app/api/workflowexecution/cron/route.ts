import prisma from "@/lib/prisma"

export async function GET(req:Request){

try{

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
    console.log("sucess")
    return new Response(JSON.stringify(workflows), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
}catch(error){
    return new Response(JSON.stringify({ error: "Failed to fetch workflows." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
    });

}
}