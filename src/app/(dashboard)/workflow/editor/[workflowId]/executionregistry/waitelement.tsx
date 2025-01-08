import { EnvironmentExecution, LogLevel } from "./type";
import { WaitForElement } from "../../_task/waitforelement";

export default async function WaitForElements(
  environment: EnvironmentExecution<typeof WaitForElement>
): Promise<boolean> {
  try {
    const visibility = environment.getInput("Visiblity");
    const selector = environment.getInput("Selector");

    if (!selector) {
      environment.setLog("Selector is missing.", LogLevel.ERROR);
      return false;
    }

    if (!visibility || (visibility !== "visible" && visibility !== "hidden")) {
      environment.setLog(
        "Invalid visibility input. Must be 'visible' or 'hidden'.",
        LogLevel.ERROR
      );
      return false;
    }

    const page = environment.getPage();
    if (!page) {
      environment.setLog("No page found to wait for the element.", LogLevel.ERROR);
      return false;
    }

    await page
      .waitForSelector(selector, {
        visible: visibility === "visible",
        hidden: visibility === "hidden",
      })
      .then(() => {
        environment.setLog(
          `Successfully waited for the element "${selector}" to become ${visibility}.`,
          LogLevel.INFO
        );
      })
      .catch((error) => {
        environment.setLog(
          `Failed to wait for the element "${selector}". Error: ${error.message}`,
          LogLevel.ERROR
        );
        return false;
      });

    return true;
  } catch (error) {
    environment.setLog(
      `WaitForElements encountered an error`,
      LogLevel.ERROR
    );
    return false;
  }
}
