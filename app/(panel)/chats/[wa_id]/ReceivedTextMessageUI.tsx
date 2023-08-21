import { TextMessage } from "../../../../types/Message";
import TailIn from "../../TailIn";

export default function ReceivedTextMessageUI(props: { textMessage: TextMessage }) {
    const { textMessage } = props
    return (
        <>
            {textMessage.text.body}
        </>
    )
}