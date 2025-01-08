import { AppNode, TaskType } from "@/lib/types/task";

export const CreateFlowNode = (
    nodeType: TaskType,
    position?: { x: number; y: number }
  ) => {
    return {
      id: crypto.randomUUID(),
      type: "Node",
      data: {
        type: nodeType,
        input: {},
      },
      position: position ?? { x: 0, y: 0 },
    };
  };
  