import { DBTables } from "@/lib/enums/Tables";
import { createClient } from "../../utils/supabase-server";
import ChatContacts from "./ChatContacts";
import { ContactContextProvider } from "./CurrentContactContext";

export default async function ChatsLayout({ children }: {
    children: React.ReactNode;
}) {
    const supabase = createClient();
    const { data: contacts , error } = await supabase
        .from(DBTables.Contacts)
        .select('*')
        .filter("in_chat", "eq", true)
        .order('last_message_at', { ascending: false })
    if (error) throw error
    return (
        <ContactContextProvider contacts={contacts}>
            <div className="flex items-center justify-center h-screen after:fixed after:h-[127px] after:top-0 after:z-10 after:w-full after:bg-app-background-stripe bg-app-background">
                <div className="shadow-lg max-w-screen-2xl w-[calc(100%-4rem)] h-[calc(100%-4rem)] flex bg-white z-20">
                    <div className="flex-7">
                        <ChatContacts />
                    </div>
                    <div className="flex-17">
                        {children}
                    </div>
                </div>
            </div>
        </ContactContextProvider>
    )
}
