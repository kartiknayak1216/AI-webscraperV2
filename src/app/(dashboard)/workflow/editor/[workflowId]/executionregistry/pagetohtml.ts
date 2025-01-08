import { PageToHtml } from "../../_task/pagetohtml";
import { EnvironmentExecution } from "./type";
import { LogLevel } from "./type"; 

export default async function Pagetohtml(
  environment: EnvironmentExecution<typeof PageToHtml>
): Promise<boolean> {
  try {
    environment.setLog("Started page-to-HTML execution.", LogLevel.INFO);

    const page = environment.getPage();
    if (!page) {
      environment.setLog("No page instance available in the environment.", LogLevel.ERROR);
      return false;
    }

    if (page.isClosed()) {
      environment.setLog("Page instance is already closed.", LogLevel.ERROR);
      return false;
    }

    const html = await page.content();
    if (!html) {
      environment.setLog("Failed to retrieve HTML content from the page.", LogLevel.ERROR);
      return false;
    }

    environment.setOutput("HTML", html);
    environment.setLog("Successfully retrieved HTML content from the page.", LogLevel.INFO);

    return true;
  } catch (error) {
    environment.setLog(
      `An error occurred in Pagetohtml`,
      LogLevel.ERROR
    );
    return false;
  }
}
