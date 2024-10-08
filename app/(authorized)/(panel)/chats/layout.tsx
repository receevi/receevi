import { DBTables } from "@/lib/enums/Tables";
import { createClient } from "@/utils/supabase-server";
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
            <div className="shadow-lg w-full h-full flex bg-white z-20 p-4">
                <div className="w-72 flex-shrink-0">
                    <ChatContacts />
                </div>
                <div className="flex-grow">
                    {children}
                </div>
            </div>
        </ContactContextProvider>
    )
}
