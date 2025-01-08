import { WorkflowTask } from "@/lib/types/task"
import {Browser, Page} from "puppeteer"
export enum LogLevel {
    INFO = "info",
    WARNING = "warning",
    ERROR = "error",
    DANGER = "danger",
    SUCESS="sucess"
  }

  type LogEntry = {
    message: string;
    logLevel: LogLevel;
  };
  
  type LogType = LogEntry[];

export type Environment ={
    browser?:Browser
    page?: Page
    phase:Record<string,{
        inputs:Record<string,string>,
        outputs:Record<string,string>
      logs:LogType

    }>
}
export type EnvironmentExecution<T extends WorkflowTask>={
    getInput:(name:T["inputs"][number]["name"])=>string
    setOutput:(name:T["outputs"][number]["name"],value:string)=>string

    setBrowser:(browser:Browser)=>void
    getBrowser:()=>Browser|null|undefined
    setPage:(page:Page)=>void
    getPage:()=>Page|null|undefined
    setLog:(message:string,logLevel:LogLevel)=>void
}