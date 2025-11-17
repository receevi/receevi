import { ButtonMessage } from "@/types/Message";

export default function ReceivedButtonMessageUI(props: { buttonMessage: ButtonMessage }) {
    const { buttonMessage } = props
    return (
        <div className="flex flex-col gap-1">
            <div className="text-sm text-gray-600">Button Reply:</div>
            <div>{buttonMessage.button.text}</div>
        </div>
    )
}
