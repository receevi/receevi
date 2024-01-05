'use client'

import { bulkSend } from "@/lib/bulk-send"
import { useFormState } from "react-dom"

const initialState = {
    message: '',
}

export default function NewBroadcastPageForm({ children }: { children: React.ReactNode }) {
    const [state, formAction] = useFormState(bulkSend, initialState);
    return (
        <form className="space-y-4" action={formAction} >
            {children}
            {state.message && <p className="text-red-500">{state.message}</p>}
        </form >
    )
}
