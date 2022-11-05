import clientPromise from "../../../lib/mongodb";
import { Message, TextMessage } from "../../../types/Message";
import ReceivedTextMessageUI from "./ReceivedTextMessageUI";

export default async function ContactChat({ params }: {params: {wa_id: string}}) {
    const client = await clientPromise;
    const db = client.db("wawebhook");
    const messages: Message[] = await db
        .collection("messages")
        .find({
            from: params.wa_id
        })
        .toArray();
    return (
        <div className="bg-conversation-panel-background h-full">
            <div className="bg-chat-img h-full">
                <div className="px-16 py-2">
                    {
                        messages.map((message) => {
                            return (
                                <div className="my-2">
                                    {
                                        (() => {
                                            switch(message.type) {
                                                case "text":
                                                    return <ReceivedTextMessageUI textMessage={message as TextMessage} />
                                                default:
                                                    return <div>Unsupported message</div>
                                            }
                                        })()
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}