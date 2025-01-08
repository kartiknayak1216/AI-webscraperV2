"use server"
import prisma from "@/lib/prisma";
import { ExecutionStatus } from "@/lib/types/workflow";
import { currentUser } from "@clerk/nextjs/server";
import { endOfMonth, startOfMonth } from "date-fns";



export type Period = {
    month: number; 
    year: number;
  };

export async function GetPeriod(): Promise<Period[] | undefined> {
    const user = await currentUser();
  
    if (!user) {
      return;
    }
  
    const years = await prisma.workflowExecution.aggregate({
      where: {
        userId: user.id,
      },
      _min: {
        startedAt: true,
      },
    });
  
    const currentYear = new Date().getFullYear();
    const minYear = years._min.startedAt ? years._min.startedAt.getFullYear() : currentYear;
  
    const period: Period[] = [];
  
    for (let year = minYear; year <= currentYear; year++) {
      for (let month = 1; month <= 12; month++) { 
        period.push({
          month, 
          year,
        });
      }
    }
  
    return period;
  }
  const cache = new Map<string, { data: any, timestamp: number }>();

  const CACHE_TTL = 10 * 60 * 1000;
  
  export async function GetStat(period: Period) {
    const user = await currentUser();
  
    if (!user) {
      console.error("No user is logged in.");
      return { workflowexc: 0, credit: 0, phase: 0 };
    }
  
    const { startdate, enddate } = getStartAndEndDate(period);
    const cacheKey = `${user.id}:${startdate.toISOString()}-${enddate.toISOString()}`;
  
    const cacheEntry = cache.get(cacheKey);
  
    if (cacheEntry && Date.now() - cacheEntry.timestamp < CACHE_TTL) {
      return cacheEntry.data;
    }
  
    try {
      const result = await prisma.workflowExecution.findMany({
        where: {
          userId: user.id,
          startedAt: { gte: startdate, lte: enddate },
          status: { in: [ExecutionStatus.COMPLETED, ExecutionStatus.FAILED] },
        },
        select: {
          creditConsumed: true,
          phase: true, 
        },
      });
  
      const status = result.reduce(
        (acc, exec) => {
          acc.workflowexc += 1;
          acc.credit += exec.creditConsumed || 0;
          acc.phase += exec.phase.length || 0;
          return acc;
        },
        { workflowexc: 0, credit: 0, phase: 0 }
      );
  
      cache.set(cacheKey, { data: status, timestamp: Date.now() });
  
      return status;
    } catch (error) {
      console.error("Error fetching workflow statistics:", error);
      return { workflowexc: 0, credit: 0, phase: 0 };
    }
  }
  
  
  
  const getStartAndEndDate = (period: Period) => {
    const startdate = startOfMonth(new Date(period.year, period.month -1)); 
    const enddate = endOfMonth(new Date(period.year, period.month - 1)); 
    return { startdate, enddate };
  };
  function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  
  function getDates(startDate: Date, stopDate: Date): Date[] {
    const dateArray = [];
    let currentDate = new Date(startDate);
  
    while (currentDate <= stopDate) {
      dateArray.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
  
    return dateArray;
  }


  export const getstatsForday= async(period:Period)=>{

    const user = await currentUser();
  
    if (!user) {
      console.error("No user is logged in.");
      return {};
    }

const {startdate,enddate}= getStartAndEndDate(period)
const range= getDates(startdate,enddate)


try {
    const executions = await prisma.workflowExecution.findMany({
      where: {
        userId: user.id,
        startedAt: {
            gte: startdate, 
            lte: enddate,         },
        status: {
          in: [ExecutionStatus.COMPLETED, ExecutionStatus.FAILED],
        },
      },
      select: {
        startedAt:true,
      status:true,
      creditConsumed:true
      },
    });

    const dailyStats: Record<string, { success: number; failure: number,creditConsumed: number }> = {};

    range.forEach((date) => {
        const key = date.toISOString().split("T")[0]; 
        dailyStats[key] = { success: 0, failure: 0,creditConsumed:0 };
      });

      executions.forEach((execution) => {
       if(execution.startedAt){
        const key = execution.startedAt.toISOString().split("T")[0];
        if (dailyStats[key]) {
          if (execution.status === ExecutionStatus.COMPLETED) {
            dailyStats[key].success++;
          } else if (execution.status === ExecutionStatus.FAILED) {
            dailyStats[key].failure++;
          }
          dailyStats[key].creditConsumed += execution.creditConsumed || 0
        }
       }
      });
  
    return dailyStats;
  } catch (error) {
    console.error("Error fetching workflow statistics:", error);
    return {};
  }

  }