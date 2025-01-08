"use server";

import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Page() {
  const user = await currentUser();

  if (!user) {
    return (
      <div>
        <h1>Unauthorized</h1>
        <p>User not logged in.</p>
      </div>
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { userId: user.id },
  });

  if (!existingUser) {
    try {
      await prisma.user.create({
        data: {
          userId: user.id,
          balance: 100,
        },
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return (
        <div>
          <h1>Error</h1>
          <p>Could not create user. Please try again later.</p>
        </div>
      );
    }
  }

  redirect("/workflows");
  
  return null;
}
