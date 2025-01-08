import { ExecutionStatus } from "@/lib/types/workflow";
import { FillInput } from "../../_task/fillinput";
import { PageToHtml } from "../../_task/pagetohtml";
import { EnvironmentExecution, LogLevel } from "./type";

export default async function FiilInput(
  environment: EnvironmentExecution<typeof FillInput>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    const value = environment.getInput("Value");

    if (!selector || !value) {
      environment.setLog("Selector or Value is missing.", LogLevel.ERROR);
      return false;
    }

    const page = environment.getPage();
    if (!page) {
      environment.setLog("No page found to perform the input action.", LogLevel.ERROR);
      return false;
    }

    await page.type(selector, value);
    environment.setLog("Selector and Value set to page.", LogLevel.INFO);
 
    return true; 
  } catch (error) {
    environment.setLog(
      `Failed to fill input`,
      LogLevel.ERROR
    );
    return false;
  }
}
