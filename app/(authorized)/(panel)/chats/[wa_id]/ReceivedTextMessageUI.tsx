import { TextMessage } from "@/types/Message";

export default function ReceivedTextMessageUI(props: { textMessage: TextMessage }) {
    const { textMessage } = props
    return (
        <>
            {textMessage.text.body}
        </>
    )
}