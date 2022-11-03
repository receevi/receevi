import ChatContacts from "./ChatContacts";

export default async function ChatsLayout({ children }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="shadow-lg max-w-screen-2xl w-[calc(100%-4rem)] h-[calc(100%-4rem)] flex">
                <div className="flex-7">
                    <ChatContacts />
                </div>
                <div className="flex-17">
                    {children}
                </div>
            </div>
        </div>
    )
}
