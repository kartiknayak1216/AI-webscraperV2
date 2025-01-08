import { AppNode } from "@/lib/types/task"

export type ExecutionPhase={
    phase:number,
    nodes:AppNode[]
}[]

export type ExecutionPhaseReturn={
    executionphase:ExecutionPhase,
    executionId:string
}