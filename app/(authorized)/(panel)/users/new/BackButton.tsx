'use client'

import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
    const router = useRouter()
    return (
        <Button variant="ghost" className="mx-4 my-2 flex flex-row gap-2" onClick={() => { router.back() }}>
            <ArrowLeftIcon/><span>Back</span>
        </Button>
    )
}