import { DBTables } from "../../enums/Tables";
import { createClient } from "../../utils/supabase-server";
import ChatContactsClient from "./ChatContactsClient";

// hack to bypass typescript (temporarily)
function asyncComponent<T, R>(fn: (arg: T) => Promise<R>): (arg: T) => R {
    return fn as (arg: T) => R;
}

const ChatContacts = asyncComponent(async () => {
    const supabase = createClient();
    const { data: contacts , error } = await supabase
        .from(DBTables.Contacts)
        .select('*')
        .order('last_message_at', { ascending: false })
    if (error) throw error
    return (
        <div className="flex flex-col">
            <ChatContactsClient contacts={contacts} />
        </div>
    )
})

export default ChatContacts;