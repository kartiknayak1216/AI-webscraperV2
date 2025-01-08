import { ExtractTextFromHtml } from "../../_task/extracttext";
import { EnvironmentExecution } from "./type";
import * as cheerio from "cheerio";
import { LogLevel } from "./type"; 

export default async function ExtractTextFromHTML(
  environment: EnvironmentExecution<typeof ExtractTextFromHtml>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    const html = environment.getInput("HTML");

    if (!selector) {
      environment.setLog("Selector input is missing.", LogLevel.ERROR);
      return false;
    }

    if (!html) {
      environment.setLog("HTML input is missing.", LogLevel.ERROR);
      return false;
    }

    const $ = cheerio.load(html);
    const extractedContent = $(selector).first().text();

    if (!extractedContent) {
      environment.setLog(
        `No element found for selector: ${selector}`,
        LogLevel.WARNING
      );
      return false;
    }

    environment.setOutput("Extracted text", extractedContent);
    environment.setLog("Text extracted successfully.", LogLevel.INFO);

    return true;
  } catch (error) {
    environment.setLog(
      `An error occurred in ExtractTextFromHTML`,
      LogLevel.ERROR
    );
    return false;
  }
}
