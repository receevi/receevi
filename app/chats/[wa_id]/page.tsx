import { DBCollection } from "../../../enums/DBCollections";
import clientPromise from "../../../lib/mongodb";
import { ImageMessage, Message, TextMessage } from "../../../types/Message";
import ReceivedImageMessageUI from "./ReceivedImageMessageUI";
import ReceivedTextMessageUI from "./ReceivedTextMessageUI";

export default async function ContactChat({ params }: {params: {wa_id: string}}) {
    const client = await clientPromise;
    const db = client.db();
    const messages: Message[] = await db
        .collection<Message>(DBCollection.Messages)
        .find({
            from: params.wa_id
        })
        .sort({ timestamp: 1 })
        .toArray();
    return (
        <div className="bg-conversation-panel-background h-full">
            <div className="bg-chat-img h-full">
                <div className="px-16 py-2">
                    {
                        messages.map((message) => {
                            return (
                                <div className="my-2" key={message.id}>
                                    {
                                        (() => {
                                            switch(message.type) {
                                                case "text":
                                                    return <ReceivedTextMessageUI textMessage={message as TextMessage} />
                                                case "image":
                                                    return <ReceivedImageMessageUI imageMessage={message as ImageMessage} />
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