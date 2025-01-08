"use server"
import { revalidateTag ,revalidatePath} from "next/cache";
import { useRouter } from "next/navigation";

export default async function action(url:string) {
 console.log("url",url)
revalidatePath(url)

}