"use client"
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

 export type MissingInput={
    nodeId:string,
    input:string[]
}

type InvalidNode={
invalidNodes:MissingInput[];
setInvalidInput:Dispatch<SetStateAction<MissingInput[]>>
clearError:()=>void
}

const InvalidContext = createContext<InvalidNode|null>(null)

export const InvalidContextProvider =({children}:{children:ReactNode})=>{
const[invalidNodes,setInvalidInput]= useState<MissingInput[]>([])
const clearError = () => setInvalidInput([]);
const value: InvalidNode = {
    invalidNodes,
    setInvalidInput,
    clearError,
};
return(
    <InvalidContext.Provider value={value}>
        {children}
    </InvalidContext.Provider>
)

}


export const useInvalidContext = () => {
    const context = useContext(InvalidContext);
    if (!context) {
        throw new Error("useInvalidContext must be used within an InvalidContextProvider");
    }
    return context;
};