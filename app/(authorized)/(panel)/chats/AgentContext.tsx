'use client'
import { FEUser } from "@/types/user";
import { createContext, ReactElement, useContext, useState } from "react";
type AgentState = {
    agents: FEUser[],
}

export const AgentsContext = createContext<AgentState | null>(null)
export function AgantContextProvider({ children, agents }: { children: ReactElement, agents: FEUser[] }) {
    const [state, _] = useState({ agents });
    return (
        <AgentsContext.Provider value={state}>
            {children}
        </AgentsContext.Provider>
    )
}
export function useAgents() {
    return useContext(AgentsContext)
}
