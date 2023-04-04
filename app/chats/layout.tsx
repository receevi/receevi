import ChatContacts from "./ChatContacts";

export default async function ChatsLayout({ children }: {
    children: React.ReactNode;
}) {
    return (
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
    )
}
