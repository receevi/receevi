'use client'

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoaderCircleIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import ContactUI from "./ContactUI";
import { useContactList } from "./useContactList";

export default function ChatContactsClient() {
    const [active, setActive] = useState<boolean>(true)
    const [contacts, loadMore, isLoading] = useContactList('', active)
    const chatListRef = useRef<HTMLDivElement>(null);
    const onDivScroll = useCallback(async (event: React.UIEvent<HTMLDivElement>) => {
        const current = chatListRef.current;
        if (current) {
            const isAtBottom = (current.scrollHeight - current.scrollTop) - 500 <= current.clientHeight;

            if (isAtBottom) {
                await loadMore();
            }
        }
    }, [loadMore, chatListRef]);

    const onTabChange = useCallback((value: string) => {
        setActive(value === 'active')
    }, [setActive])

    return (
        <div className="h-full flex flex-col gap-2">
            <Tabs defaultValue="active" className="px-2 pt-2" onValueChange={onTabChange}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="inactive">Inactive</TabsTrigger>
                </TabsList>
            </Tabs>
            <div className="flex flex-col h-full overflow-y-auto" ref={chatListRef} onScroll={onDivScroll}>
                {contacts.length > 0 && contacts.map(contact => {
                    return <ContactUI key={contact.wa_id} contact={contact} />
                })}
                {contacts.length === 0 && (
                    <div className="p-4 text-center">
                        {(() => {
                            if (active) {
                                return <>
                                    No active chats at the moment. You&apos;ll see contacts here with an open chat window.
                                </>
                            } else {
                                return <>
                                    No inactive chats. Contacts whose chat window has expired will appear here.
                                </>
                            }
                        })()}
                    </div>
                )}
                {isLoading && (
                    <div className="w-full flex justify-center items-center py-4">
                        <LoaderCircleIcon className="animate-spin" />
                    </div>
                )}
            </div>
        </div>
    )
}
