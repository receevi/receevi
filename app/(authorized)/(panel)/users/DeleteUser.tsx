'use client'

import { Button } from "@/components/ui/button"
import { useCallback, useState } from "react"
import { deleteUser } from "./actions"
import { useRouter } from "next/navigation"

export default function DeleteUser({ userId }: {userId: string}) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()
    const handleUserDelete = useCallback(async () => {
        setIsDeleting(true)
        try {
            await deleteUser(userId)
            router.refresh()

        } finally {
            setIsDeleting(false)
        }
    }, [userId, router])
    return (
        <Button variant="ghost" className="text-red-500 hover:text-red-500" onClick={handleUserDelete}>{isDeleting ? 'Deleting...' : 'Delete'}</Button>
    )
}