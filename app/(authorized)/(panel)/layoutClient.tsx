'use client';

import { useSupabase } from "@/components/supabase-provider";
import { useSupabaseUser, useUserRole } from "@/components/supabase-user-provider";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import UserLetterIcon from "@/components/users/UserLetterIcon";
import { CircleUserRound, ContactIcon, LogOut, MessageCircleIcon, RadioIcon, UserRound, UsersIcon } from "lucide-react";
import Link from 'next/link';
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect } from "react";

export default function PanelClient({ children }: { children: ReactNode }) {
    const activePath = usePathname();
    const { user } = useSupabaseUser();
    const userRole = useUserRole()
    const supabase = useSupabase()
    const router = useRouter()
    const logout = useCallback(() => {
        supabase.supabase.auth.signOut().then(() => {
            console.log("logout successful")
            router.push('/login')
        }).catch(console.error);
    }, [router, supabase])
    useEffect(() => {
        supabase.supabase.auth.getSession().then(res => {
            if (res.data.session?.access_token) {
                supabase.supabase.realtime.setAuth(res.data.session?.access_token)
            }
        })
    }, [supabase])

    return (
        <div className="flex flex-col h-screen">
            <div className="h-16 flex flex-row justify-between px-4 flex-shrink-0">
                <div className="flex flex-row">
                    <div className="flex flex-row gap-2 items-center">
                        <img src="/assets/img/icon.svg" className="w-8 h-8" />
                        <div className="text-lg">Receevi</div>
                    </div>
                </div>
                {/* <div className="flex flex-row"> */}
                <div className="flex flex-row items-center">
                    <Link href="/chats"><Button variant={activePath?.startsWith('/chats') ? "secondary" : "ghost"} className="px-4 justify-start"> <MessageCircleIcon />&nbsp;&nbsp;Chats</Button></Link>
                    <Link href="/contacts"><Button variant={activePath?.startsWith('/contacts') ? "secondary" : "ghost"} className="px-4 justify-start ml-2"><ContactIcon />&nbsp;&nbsp;Contacts</Button></Link>
                    {(() => {
                        if (userRole === 'admin') {
                            return (
                                <>
                                    <Link href="/bulk-send"><Button variant={activePath?.startsWith('/bulk-send') ? "secondary" : "ghost"} className="px-4 justify-start ml-2"> <RadioIcon />&nbsp;&nbsp;Bulk Send</Button></Link>
                                    <Link href="/users"><Button variant={activePath?.startsWith('/users') ? "secondary" : "ghost"} className="px-4 justify-start ml-2"> <UsersIcon />&nbsp;&nbsp;Users</Button></Link>
                                </>
                            )
                        }
                    })()}
                </div>
                <div className="flex flex-row items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            {/* <CircleUserRound size={32} className="cursor-pointer" /> */}
                            <button>
                                <UserLetterIcon user={{ firstName: user?.user_metadata.first_name, lastName: user?.user_metadata.last_name }} className="cursor-pointer h-10 w-10" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user?.user_metadata.first_name} {user?.user_metadata.last_name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                                </div>
                            </DropdownMenuLabel>
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
                {/* </div> */}
            </div>
            {/* <div className="flex-[6] max-w-xs border-e-2 border-e-slate-100 p-4">
                <div className="text-center">Receevi</div>
                <div className="mt-8">
                </div>
            </div> */}
            <div className="h-full overflow-y-auto bg-gray-100 flex-grow">
                {children}
            </div>
        </div>
    )
}
