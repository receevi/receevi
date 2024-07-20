import { MessageTemplateFromDB } from "@/lib/repositories/message-template/MessageTemplateRepository";
import { MessageTemplate } from "@/types/message-template";

export default function MessageTemplateUI({messageTemplate}: {messageTemplate: MessageTemplate}) {
    return (
        <div>
            <div>
                {messageTemplate.components.map((c) => {
                    switch(c.type) {
                        case "HEADER":
                            return (<div>
                                {c.format}
                            </div>)
                    }
                })}
            </div>
        </div>
    )
}