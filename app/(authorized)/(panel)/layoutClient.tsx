'use client';

import { Button } from "@/components/ui/button";
import { ContactIcon, MessageCircleIcon, RadioIcon } from "lucide-react";
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function PanelClient({ children }: { children: ReactNode }) {
    const activePath = usePathname();
    return (
        <div className="flex flex-row h-screen">
            <div className="flex-[6] max-w-xs border-e-2 border-e-slate-100 p-4">
                <div className="text-center">Receevi</div>
                <div className="mt-8">
                    <Link href="/chats"><Button variant={activePath?.startsWith('/chats')? "secondary" : "ghost"} className="w-full justify-start"> <MessageCircleIcon/>&nbsp;&nbsp;Chats</Button></Link>
                    <Link href="/contacts"><Button variant={activePath?.startsWith('/contacts') ? "secondary" : "ghost"} className="w-full justify-start"><ContactIcon/>&nbsp;&nbsp;Contacts</Button></Link>
                    <Link href="/bulk-send"><Button variant={activePath?.startsWith('/bulk-send') ? "secondary" : "ghost"} className="w-full justify-start"> <RadioIcon/>&nbsp;&nbsp;Bulk Send</Button></Link>
                </div>
            </div>
            <div className="flex-[20] p-4">
                {children}
            </div>
        </div>
    )
}
