"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import parser from "cron-parser";

export async function UpdateWorkflowCron(id: string, cron: string) {
  try {
    const user = await currentUser();

    if (!user) {
      return { status: 401, message: "Unauthorized: User not logged in." };
    }

    let interval;
    try {
      interval = parser.parseExpression(cron, { utc: true });
    } catch (parseError) {
      return { status: 400, message: "Invalid Cron Expression." };
    }

    await prisma.workflow.update({
      where: {
        id: id,
      },
      data: {
        cron: cron,
        nextRunAt: interval.next().toDate(),
      },
    });

    return { status: 200, message: "Workflow updated successfully." };
  } catch (error) {
    console.error("Error updating workflow cron:", error);

    return {
      status: 500,
      message: "An unexpected error occurred while updating the workflow.",
    };
  }
}
