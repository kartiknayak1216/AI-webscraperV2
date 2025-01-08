import { AppNode, TaskParams, TaskParamType } from "@/lib/types/task";
import StringParam from "./stringparam";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import BrowserInstance from "./browserinstance";
import Selector from "./selector";
import Credentialparam from "./credentialparam";

export default function NodeParamField({ param,nodeId,disabled}: { param: TaskParams,nodeId:string,disabled:boolean}) {
const{updateNodeData,getNode} = useReactFlow()
const node = getNode(nodeId) as AppNode

const Update = useCallback(
  (data: string) => {
    console.log('Before update:', JSON.stringify(node?.data.inputs, null, 2));

    const updatedInputs = {
      ...node?.data.inputs,
      [param.name]: data,
    };

    updateNodeData(nodeId, {
      inputs: updatedInputs,
    });

    console.log('After update:', JSON.stringify(updatedInputs, null, 2));
  },
  [nodeId, param.name, node?.data.inputs]
);

  
    const value= node.data.inputs?.[param.name]
console.log("type",param.type)

switch(param.type){
   case TaskParamType.STRING:
return <StringParam param={param} value={value} updateNodeParamValue={Update} isRreq={disabled} />
   
   case TaskParamType.BROWSER_INSTANCE:
    return <BrowserInstance param={param}/>
   
    case TaskParamType.SELECT:
      return <Selector param={param} value={value} updateNodeParamValue={Update} isReq={disabled}/>
  
  case TaskParamType.CREDENTIAL:
    return <Credentialparam param={param} value={value} updateNodeParamValue={Update} isReq={disabled}/>
  
      default:
   return(
    <div className="w-full">
        <p className='text-xs text-muted-foreground'>
            Not implemented
        </p>
      </div>
   ) 
   
}

}