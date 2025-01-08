import { EnvironmentExecution } from "./type";
import { LogLevel } from "./type";
import { TextJson } from "../../_task/extracttextjson";

export default async function ExtractTextFromJson(
  environment: EnvironmentExecution<typeof TextJson>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Targeted Text");
    const jsonInput = environment.getInput("JSON");

    if (!selector) {
      environment.setLog("Selector input is missing.", LogLevel.ERROR);
      return false;
    }

    if (!jsonInput) {
      environment.setLog("JSON input is missing.", LogLevel.ERROR);
      return false;
    }

    let jsonObject: any;
    try {
      jsonObject = typeof jsonInput === "string" ? JSON.parse(jsonInput) : jsonInput;
    } catch (error) {
      environment.setLog("Invalid JSON input provided.", LogLevel.ERROR);
      return false;
    }

    const result = jsonObject[selector];
    if (result === undefined||null) {
      environment.setLog(
        `No data found for selector "${selector}".`,
        LogLevel.ERROR
      );
      return false;
    }

    environment.setLog(
      `Successfully extracted data`,
      LogLevel.INFO
    );
    environment.setOutput("Targeted Text",selector)
    environment.setOutput("Extracted Text",result)
    environment.setOutput("JSON",JSON.stringify(jsonObject))

    return true;
  } catch (error: any) {
    environment.setLog(
      `An error occurred during JSON extraction`,
      LogLevel.ERROR
    );
    return false;
  }
}
