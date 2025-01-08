import { LucideProps } from "lucide-react";
import { Node } from "@xyflow/react";

export enum TaskType{
    LAUNCH_BROWSER="LAUNCH_BROWSER",
    PAGE_TO_HTML="PAGE_TO_HTML",
    EXTRACT_TEXT_FROM_HTML="EXTRACT_TEXT_FROM_HTML",
    FILL_INPUT="FILL_INPUT",
    CLICK_ELEMENT="CLICK_ELEMENT",
    WAIT_FOR_ELEMENT="WAIT_FOR_ELEMENT",
    EXTRACT_TEXT_JSON="EXTRACT_TEXT_JSON",
    ADD_TEXT_JSON="ADD_TEXT_JSON",
    MERGE_JSON="MERGE_JSON",
  DELIVER_WEBHOOK="DELIVER_WEBHOOK",
  EXTRACT_DATA_WITH_AI="EXTRACT_DATA_WITH_AI"
  }

export interface  AppNodeData{
    type:TaskType;
    input:Record<string, string>
    [key: string]: any; 

}
export type WorkflowTask={
    label:string,
    icon:React.FC<LucideProps>,
    type:TaskType
    isEntry:boolean
    inputs:TaskParams[]
    outputs:TaskParams[]
    credit:number
}

export enum TaskParamType{
    STRING="STRING",
    BROWSER_INSTANCE="BROWSER_INSTANCE",
    SELECT="SELECT",
    CREDENTIAL="CREDENTIAL"
}
export interface TaskParams{
    name:string,
    type:TaskParamType,
    helperText?:string,
    required?:boolean
    hideHandle?:boolean
    [key:string]:any

}


export enum Fieldname{

}


export interface AppNode extends Node{
    data:AppNodeData

}
export interface ParamProps {
    param:TaskParams,
    value:string,
    updateNodeValue:(data:string)=>void
}
export const GetColor = (name: TaskParamType): string => {
    switch (name) {
      case "STRING": {
        return "blue"; 
      }
      case "BROWSER_INSTANCE": {
        return "green"; 
      }
      case "SELECT": {
        return "yellow"; 
      }
      default: {
        return "gray"; 
      }
    }
  };
  