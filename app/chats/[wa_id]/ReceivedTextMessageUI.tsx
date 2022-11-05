import { TextMessage } from "../../../types/Message";
import TailIn from "../TailIn";

export default function ReceivedTextMessageUI(props: { textMessage: TextMessage }) {
    const { textMessage } = props
    return (
        <div>
            <div className="inline-block">
                <div className="inline-block h-full text-incoming-background float-left">
                    <TailIn/>
                </div>
                <div className="bg-incoming-background inline-block p-2 rounded-b-lg rounded-tr-lg shadow-message">
                    {textMessage.text.body}
                </div>
            </div>
        </div>
    )
}