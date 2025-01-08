import { WebHookDel } from "../../_task/webhook";
import { EnvironmentExecution, LogLevel } from "./type";

export default async function WebhookExecution(
  environment: EnvironmentExecution<typeof WebHookDel>
): Promise<boolean> {
  try {
    const url = environment.getInput("Target Url");
    const payload = environment.getInput("Payload");

    if (!url) {
      environment.setLog("Target Url input is missing.", LogLevel.ERROR);
      return false;
    }

    if (!payload) {
      environment.setLog("Payload input is missing.", LogLevel.ERROR);
      return false;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const status = response.status;
    if (status !== 200) {
      environment.setLog(`Webhook Delivery failed with status ${status}`, LogLevel.ERROR);
      return false;
    }
const responseBody = await response.json()
    environment.setLog("Webhook Delivery Success", LogLevel.INFO);
    environment.setOutput("Status",JSON.stringify(responseBody))
    return true; 
  } catch (error) {
    environment.setLog(`Error occurred: ${error instanceof Error ? error.message : error}`, LogLevel.ERROR);
    return false; 
  }
}
