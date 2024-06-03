'use client'

import { Button } from "@/components/ui/button"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

export default function PaginationButton({ children, pagesToAdd }: { children: React.ReactNode, pagesToAdd: number }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const action = useCallback(() => {
        const page = searchParams?.get('page')
        const parsedPage = page ? parseInt(page) : 1
        let nextPage = parsedPage + pagesToAdd
        if (nextPage < 1) {
            nextPage = 1
        }

        const params = new URLSearchParams(searchParams?.toString())

        params.set('page', nextPage.toString())

        router.push(`${pathname}?${params}`)
    }, [router, pathname, searchParams, pagesToAdd])
    return (
        <Button variant={"outline"} onClick={action}>
            {children}
        </Button>
    )
}