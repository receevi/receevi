import { DBTables } from "@/lib/enums/Tables";
import { createClient } from "@/utils/supabase-server";
import ChatContacts from "./ChatContacts";
import { ContactContextProvider } from "./CurrentContactContext";
import { AgantContextProvider, AgentsContext } from "./AgentContext";
import { FEUser } from "@/types/user";
import ChatContactsClient from "./ChatContactsClient";

export default async function ChatsLayout({ children }: {
    children: React.ReactNode;
}) {
    const supabase = createClient();

    const {data: allAgentsId} = await supabase.from('user_roles').select('user_id').eq('role', 'agent')
    const agentUserIds = allAgentsId?.map((ag) => ag.user_id)
    let agents: FEUser[] = []
    if (agentUserIds) {
        const { data: agentsFromDB } = await supabase.from('profiles').select('*').in('id', agentUserIds)
        agents = agentsFromDB?.map(ag => {
            return {
                id: ag.id,
                email: ag.email,
                firstName: ag.first_name,
                lastName: ag.last_name,
                role: 'agent'
            }
        }) || []
    }

    return (
        <ContactContextProvider contacts={[]}>
            <AgantContextProvider agents={agents}>
                <div className="shadow-lg z-20 m-4 flex bg-white rounded-xl">
                    {/* <div className=""> */}
                        <div className="w-72 flex-shrink-0">
                            <ChatContactsClient />
                        </div>
                        <div className="flex-grow">
                            {children}
                        </div>
                    {/* </div> */}
                </div>
            </AgantContextProvider>
        </ContactContextProvider>
    )
}
