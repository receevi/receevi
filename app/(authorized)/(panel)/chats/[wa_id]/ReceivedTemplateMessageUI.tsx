import { TemplateMessage } from "@/types/Message";
import { MessageTemplateBody, MessageTemplateButtons, MessageTemplateFooter, MessageTemplateHeader } from "@/types/message-template";

function MessageTemplateHeaderComp(props: { component: MessageTemplateHeader }) {
    return (
        <div className="font-medium pb-2">{props.component.text}</div>
    )
}

function MessageTemplateBodyComp(props: { component: MessageTemplateBody }) {
    return (
        <div>{props.component.text}</div>
    )
}

function MessageTemplateFooterComp(props: { component: MessageTemplateFooter }) {
    return (
        <span className="text-gray-500 pt-2">{props.component.text}</span>
    )
}

function MessageTemplateButtonsComp(props: { component: MessageTemplateButtons }) {
    if (props.component.buttons.length > 0) {
        return (
            <>
                <div>
                    {(() => {
                        return props.component.buttons.map((button, index) => {
                            return (
                                <div key={index}>
                                    <div className="border-t border-b-0 my-1 border-slate-300"></div>
                                    {(() => {
                                        if (button.type === "URL") {
                                            return <a className="text-blue-500 w-full block text-center" target="_blank" rel="noopener noreferrer" href={button.url}>{button.text}</a>
                                        } else {
                                            return <button className="text-blue-500 w-full">{button.text}</button>
                                        }
                                    })()}
                                </div>
                            )
                        })
                    })()}
                </div>
            </>
        )
    }
}

export default function ReceivedTemplateMessageUI(props: { message: TemplateMessage }) {
    return props.message.template.components.map((component, index) => {
        switch(component.type) {
            case 'HEADER':
                return <MessageTemplateHeaderComp key={index} component={component}/>
            case 'BODY':
                return <MessageTemplateBodyComp key={index} component={component}/>
            case 'FOOTER':
                return <MessageTemplateFooterComp key={index} component={component}/>
            case 'BUTTONS':
                return <MessageTemplateButtonsComp key={index} component={component}/>
        }
        return (
            <div key={index}>hello</div>
        )
    })
}