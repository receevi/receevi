'use client'

import { createContext, Dispatch, ReactElement, Reducer, useContext, useReducer } from "react";
import { Contact } from "@/types/contact";

type ContactState = {
    contacts: Contact[],
    current?: Contact,
}

type Action = {
    type: string,
    waId: number,
}

export const UPDATE_CURRENT_CONTACT = 'UPDATE_CURRENT_CONTACT'

const reducer: Reducer<ContactState, Action> = (state, action) => {
    switch (action.type) {
        case UPDATE_CURRENT_CONTACT:
            let current;
            state.contacts.forEach(contact => {
                contact.is_current = contact.wa_id == action.waId
                if (contact.is_current) {
                    current = contact
                }
            })
            return { contacts: state.contacts, current }
        default:
            return state;
    }
}

export const ContactsContext = createContext<ContactState | null>(null)
export const CurrentContactDispatchContext = createContext<Dispatch<Action> | null>(null)

export function ContactContextProvider({ children, contacts }: { children: ReactElement, contacts: Contact[] }) {
    const [state, dispatch] = useReducer(reducer, { contacts });
    return (
        <ContactsContext.Provider value={state}>
            <CurrentContactDispatchContext.Provider value={dispatch}>
                {children}
            </CurrentContactDispatchContext.Provider>
        </ContactsContext.Provider>
    )
}

export function useContacts() {
    return useContext(ContactsContext)
}

export function useCurrentContactDispatch() {
    return useContext(CurrentContactDispatchContext)
}
