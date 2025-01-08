import { ClickElement } from "../../_task/clickelement";
import { EnvironmentExecution, LogLevel } from "./type";

export default async function ClickExecute(
  environment: EnvironmentExecution<typeof ClickElement>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");

    if (!selector) {
      environment.setLog("Selector is missing.", LogLevel.ERROR);
      return false;
    }

    const page = environment.getPage();
    if (!page) {
      environment.setLog(
        "No page found to perform the click action.",
        LogLevel.ERROR
      );
      return false;
    }

    await page.click(selector);
    environment.setLog("Selector clicked successfully.", LogLevel.INFO);
    return true;
  } catch (error) {
    environment.setLog(
      `ClickExecute failed`,
      LogLevel.ERROR
    );
    return false;
  }
}
