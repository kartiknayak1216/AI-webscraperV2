import { TaskType, WorkflowTask } from "@/lib/types/task"
import { LaunchBrowser } from "./launchbrowser"
import { PageToHtml } from "./pagetohtml"
import { ExtractTextFromHtml } from "./extracttext"
import { FillInput } from "./fillinput"
import { ClickElement } from "./clickelement"
import { WaitForElement } from "./waitforelement"
import { WebHookDel } from "./webhook"
import { TextJson } from "./extracttextjson"
import { AddTextJson } from "./addjson"
import { MergeJson } from "./mergejson"
import { ExtractTextAi } from "./extractextai"

type registry={
    [k in TaskType]:WorkflowTask & {type:k}
}

export const TaskRegistery:registry={
LAUNCH_BROWSER:LaunchBrowser,
PAGE_TO_HTML:PageToHtml,
EXTRACT_TEXT_FROM_HTML:ExtractTextFromHtml,
FILL_INPUT:FillInput,
CLICK_ELEMENT:ClickElement,
WAIT_FOR_ELEMENT:WaitForElement,
EXTRACT_TEXT_JSON:TextJson,
ADD_TEXT_JSON:AddTextJson,
MERGE_JSON:MergeJson,
DELIVER_WEBHOOK:WebHookDel,
EXTRACT_DATA_WITH_AI:ExtractTextAi
}