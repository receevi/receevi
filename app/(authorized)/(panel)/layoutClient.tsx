'use client';

import { useSupabase } from "@/components/supabase-provider";
import { useSupabaseUser } from "@/components/supabase-user-provider";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CircleUserRound, ContactIcon, LogOut, MessageCircleIcon, RadioIcon } from "lucide-react";
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { ReactNode, useCallback } from "react";

export default function PanelClient({ children }: { children: ReactNode }) {
    const activePath = usePathname();
    const { user } = useSupabaseUser();
    const supabase = useSupabase()
    const logout = useCallback(() => {
        supabase.supabase.auth.signOut().then(() => {
            console.log("logout successful")
        }).catch(console.error);
    }, [])
    return (
        <div className="flex flex-col h-screen">
            <div className="h-16 flex flex-row justify-between px-4 border-b-2">
                <div className="flex flex-row">
                    <div className="flex flex-row gap-2 items-center">
                        <img src="/assets/img/icon.svg" className="w-8 h-8" />
                        <div className="text-lg">Receevi</div>
                    </div>
                </div>
                <div className="flex flex-row">
                    <div className="flex flex-row items-center">
                        <Link href="/chats"><Button variant={activePath?.startsWith('/chats') ? "secondary" : "ghost"} className="w-48 justify-start"> <MessageCircleIcon />&nbsp;&nbsp;Chats</Button></Link>
                        <Link href="/contacts"><Button variant={activePath?.startsWith('/contacts') ? "secondary" : "ghost"} className="w-48 justify-start ml-2"><ContactIcon />&nbsp;&nbsp;Contacts</Button></Link>
                        {(() => {
                            if ((user as any)?.user_role === 'admin') {
                                return <Link href="/bulk-send"><Button variant={activePath?.startsWith('/bulk-send') ? "secondary" : "ghost"} className="w-48 justify-start ml-2"> <RadioIcon />&nbsp;&nbsp;Bulk Send</Button></Link>
                            }
                        })()}
                    </div>
                    <div className="flex flex-row items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <CircleUserRound size={32} className="cursor-pointer" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={logout}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {/* <div>photo</div> */}
                        {/* <div> */}
                        {/* <div>{user?.user_metadata.full_name}</div> */}
                        {/* <div>{user?.email}</div> */}
                        {/* </div> */}
                    </div>
                </div>
            </div>
            {/* <div className="flex-[6] max-w-xs border-e-2 border-e-slate-100 p-4">
                <div className="text-center">Receevi</div>
                <div className="mt-8">
                </div>
            </div> */}
            <div className="h-[calc(100vh-4rem)] overflow-y-scroll">
                {children}
            </div>
        </div>
    )
}
