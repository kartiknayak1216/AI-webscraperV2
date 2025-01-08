import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const getBalance=async()=>{
    
      const user = await currentUser();
    
      if (!user) {
        return ;
      }

      const userAccount = await prisma.user.findUnique({
        where: { userId: user.id },
        select: { balance: true },
      });
    
      return userAccount}
     
