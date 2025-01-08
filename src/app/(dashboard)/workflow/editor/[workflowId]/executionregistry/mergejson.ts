import { EnvironmentExecution } from "./type";
import { LogLevel } from "./type";
import { TextJson } from "../../_task/extracttextjson";
import { MergeJson } from "../../_task/mergejson";

export default async function MergeJsons(
  environment: EnvironmentExecution<typeof MergeJson>
): Promise<boolean> {
  try {
    const json1 = environment.getInput("JSON1");
    const json2 = environment.getInput("JSON2");

    if (!json1) {
      environment.setLog("JSON1 input is missing.", LogLevel.ERROR);
      return false;
    }

    if (!json2) {
      environment.setLog("JSON2 input is missing.", LogLevel.ERROR);
      return false;
    }
    let json1parse:any
    let json2parse:any
try{
    json1parse = JSON.parse(json1);
     json2parse = JSON.parse(json2);
}catch(error){
    environment.setLog(
        "Invalid JSON input: Ensure both inputs are valid JSON strings.",
        LogLevel.ERROR
      );
      return false;
}

let mergeJson:any


if(Array.isArray(json1parse) && Array.isArray(json2parse)){
    mergeJson = json1parse.concat(json2parse);
 
}
else if (
    typeof json1parse === "object" &&
    typeof json2parse === "object"
  ) {
    mergeJson = { ...json1parse, ...json2parse};
  }
  else{
    environment.setLog(
        "Both inputs must be of the same type (either arrays or objects).",
        LogLevel.ERROR
      );
      return false; 
  }

  environment.setOutput("JSON", JSON.stringify(mergeJson));

  environment.setLog(
    "Successfully merged JSON inputs.",
    LogLevel.INFO
  );
    return true;
  }catch(error){
    environment.setLog(
        `An error occurred during JSON merging`,
        LogLevel.ERROR
      );
      return false; 
  }
}
  

