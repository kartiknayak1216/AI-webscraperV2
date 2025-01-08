import { AddTextJson } from "../../_task/addjson";
import { EnvironmentExecution, LogLevel } from "./type";

export default async function AppendTextToJson(
  environment: EnvironmentExecution<typeof AddTextJson>
): Promise<boolean> {
  try {
    const jsonInput = environment.getInput("JSON");
    const appendText = environment.getInput("Append Text");
    const appendTextValue = environment.getInput("Append Text Value");

    if (!jsonInput) {
      environment.setLog("JSON input is missing.", LogLevel.ERROR);
      return false;
    }
    if (!appendText) {
      environment.setLog("Append Text key is missing.", LogLevel.ERROR);
      return false;
    }
    if (!appendTextValue) {
      environment.setLog("Append Text Value is missing.", LogLevel.ERROR);
      return false;
    }

    let jsonObject;
    try {
      jsonObject = JSON.parse(jsonInput);
    } catch (error) {
      environment.setLog("Invalid JSON input.", LogLevel.ERROR);
      return false;
    }

    jsonObject[appendText] = appendTextValue;

    const manipulatedJson = JSON.stringify(jsonObject, null, 2);
    environment.setOutput("Manipulated JSON", manipulatedJson);

    environment.setLog("Text successfully appended to JSON.", LogLevel.INFO);
    return true;
  } catch (error) {
    environment.setLog(
      `Error occurred while appending text to JSON`,
      LogLevel.ERROR
    );
    return false;
  }
}
