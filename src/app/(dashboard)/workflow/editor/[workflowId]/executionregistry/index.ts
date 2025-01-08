import { TaskType } from "@/lib/types/task";
import LaunchbrowserExecution from "./launchbrowser";
import { Environment, EnvironmentExecution } from "./type";
import { TaskRegistery } from "../../_task";
import Pagetohtml from "./pagetohtml";
import ExtractTextFromHTML from "./extracttext";
import FiilInput from "./fillinput";
import ClickExecute from "./click";
import WaitForElements from "./waitelement";
import ExtractTextFromJson from "./extacttextjson";
import AppendTextToJson from "./addjson";
import MergeJsons from "./mergejson";
import WebhookExecution from "./webhook";
import ExtractTextWithai from "./extractai";

type regis={
    [k in TaskType]: (environment:EnvironmentExecution<typeof TaskRegistery[k]>)=>Promise<boolean>
}

export  const ExecutionRegistry=(environment:EnvironmentExecution<any>):regis=>( {
    LAUNCH_BROWSER: LaunchbrowserExecution,
    PAGE_TO_HTML:Pagetohtml,
    EXTRACT_TEXT_FROM_HTML:ExtractTextFromHTML,
    CLICK_ELEMENT:ClickExecute,
    FILL_INPUT:FiilInput,
    WAIT_FOR_ELEMENT:WaitForElements,
EXTRACT_TEXT_JSON:ExtractTextFromJson,
ADD_TEXT_JSON:AppendTextToJson,
MERGE_JSON:MergeJsons,
DELIVER_WEBHOOK:WebhookExecution,
EXTRACT_DATA_WITH_AI:ExtractTextWithai
})
