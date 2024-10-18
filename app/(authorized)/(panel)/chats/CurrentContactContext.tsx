'use client'

import { createContext, Dispatch, ReactElement, Reducer, useContext, useReducer } from "react";
import { Contact } from "@/types/contact";

type ContactState = {
    current?: Contact,
}

type Action = {
    type: string,
    contact: Contact,
}

export const UPDATE_CURRENT_CONTACT = 'UPDATE_CURRENT_CONTACT'

const reducer: Reducer<ContactState, Action> = (state, action) => {
    switch (action.type) {
        case UPDATE_CURRENT_CONTACT:
            return { current: action.contact }
        default:
            return state;
    }
}

export const CurrentContactContext = createContext<ContactState | null>(null)
export const CurrentContactDispatchContext = createContext<Dispatch<Action> | null>(null)

export function ContactContextProvider({ children }: { children: ReactElement }) {
    const [state, dispatch] = useReducer(reducer, { });
    return (
        <CurrentContactContext.Provider value={state}>
            <CurrentContactDispatchContext.Provider value={dispatch}>
                {children}
            </CurrentContactDispatchContext.Provider>
        </CurrentContactContext.Provider>
    )
}

export function useCurrentContact() {
    return useContext(CurrentContactContext)
}

export function useCurrentContactDispatch() {
    return useContext(CurrentContactDispatchContext)
}
