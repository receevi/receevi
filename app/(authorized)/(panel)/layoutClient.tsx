'use client';

import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function PanelClient({ children }: { children: ReactNode }) {
    const activePath = usePathname();
    return (
        <div className="flex flex-row h-screen">
            <div className="flex-[6] border-e-2 border-e-slate-100 p-4">
                <div className="text-center">Receevi</div>
                <div className="mt-8">
                    <Link href="/chats"><Button variant={activePath?.startsWith('/chats')? "default" : "ghost"} className="w-full justify-start">Chats</Button></Link>
                    <Link href="/contacts"><Button variant={activePath?.startsWith('/contacts') ? "default" : "ghost"} className="w-full justify-start">Contacts</Button></Link>
                    <Link href="/bulk-send"><Button variant={activePath?.startsWith('/bulk-send') ? "default" : "ghost"} className="w-full justify-start">Bulk Send</Button></Link>
                </div>
            </div>
            <div className="flex-[20] p-4">
                {children}
            </div>
        </div>
    )
}
