import { EnvironmentExecution } from "./type";
import { LogLevel } from "./type";
import { ExtractTextAi } from "../../_task/extractextai";
import { decrypt } from "@/app/(dashboard)/(home)/credential/server/helper";
import OpenAI from "openai";

export default async function ExtractTextWithAi(
  environment: EnvironmentExecution<typeof ExtractTextAi>
): Promise<boolean> {
  try {
    const credential = environment.getInput("Credentials");
    const prompt = environment.getInput("Prompt");
    const content = environment.getInput("Content");

    if (!credential || !prompt || !content) {
      environment.setLog(
        "Missing input(s): " +
          (credential ? "" : "Credentials, ") +
          (prompt ? "" : "Prompt, ") +
          (content ? "" : "Content"),
        LogLevel.ERROR
      );
      return false;
    }

    const value = decrypt(credential);
    if (!value) {
      environment.setLog("Credential value could not be decrypted.", LogLevel.ERROR);
      return false;
    }

    const openAi = new OpenAI({
      apiKey: value,
    });

    const res = await openAi.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a web scraper helper that extracts data from HTML or text. You will be given a piece of HTML content or text as input and also a prompt specifying the data to extract. The response should always be only the extracted data as a JSON array or object without additional text or content. Analyze the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON array. Work only with the provided content and always output valid JSON without surrounding text.",
        },
        { role: "user", content: content },
        { role: "user", content: prompt },
      ],
      temperature: 1, 
    });

    const result = res.choices[0].message?.content;

    if (!result) {
      environment.setLog("Failed to extract data; empty response.", LogLevel.ERROR);
      return false;
    }

    environment.setOutput("Extracted Data", result);
    return true;
  } catch (error: any) {
    environment.setLog(`Error occurred: ${error.message}`, LogLevel.ERROR);
    return false;
  }
}
