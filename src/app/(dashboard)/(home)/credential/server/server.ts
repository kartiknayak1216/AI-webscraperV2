"use server"

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import crypto from 'crypto'
export async function CreateCredentialServer(name: string, value: string) {
  try {
    const user = await currentUser();

    if (!user) {
      return { status: 401, message: "Unauthorized: User not logged in." };
    }

    const encryptedValue = encrypt(value);
    if (encryptedValue ===false) {
      return { status: 500, message:"Error generating Credential"};
    }


    const credential = await prisma.credential.create({
      data: {
        userId: user.id,
        name: name,
        value: encryptedValue,
       
      },
    });

    if (credential) {
      return { status: 200, message: "Credential created successfully.", data: credential };
    } else {
      return { status: 500, message: "Failed to create the Credential." };
    }
  } catch (error) {
    console.error("Error creating Credential:", error);
    return { status: 500, message: "Failed to create the Credential." };
  }
}



export async function FetchCredentialServer(){
    try {
        const user = await currentUser();

      if (!user) {
        return { status: 401, message: "Unauthorized: User not logged in." };
      }
  
      const workflows = await prisma.credential.findMany({
        where: {
          userId: user.id,
        },
       
      })
  
      return { status: 200,message:"Credential fetched sucessfully" ,data: workflows };
    } catch (error) {
      console.error("Error fetching credential:", error);
      return { status: 500, message: "Failed to fetch the credentials." };
    }
  };

  export async function DeleteCredentialServer (id: string){
    try {
      await prisma.credential.delete({
        where: { id },
      });
      return { status: 200, message: "Credential deleted successfully" };
    } catch (error) {
      console.error("Error deleting Credential:", error);
      return { status: 500, message: "Failed to delete the credential." };
    }
  };

  const algorithm = 'aes-256-cbc'

  function encrypt(text: string): string | false{
    const key = process.env.SECRET_KEY
    if(!key){
      return false
    }
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key,"hex"), iv);
 let enc = cipher.update(text)
 enc= Buffer.concat([enc,cipher.final()])
 return iv.toString("hex") +":"+enc.toString("hex")

  }
