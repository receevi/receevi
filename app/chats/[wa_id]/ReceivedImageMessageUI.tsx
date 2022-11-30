import { ImageMessage } from "../../../types/Message";
import TailIn from "../TailIn";

export default function ReceivedImageMessageUI(props: { imageMessage: ImageMessage }) {
    const { imageMessage } = props
    return (
        <div>
            <div className="inline-block">
                <div className="inline-block h-full text-incoming-background float-left">
                    <TailIn/>
                </div>
                <div className="bg-incoming-background inline-block p-2 rounded-b-lg rounded-tr-lg shadow-message">
                    <img className="max-w-md" src={`/api/media?mediaId=${imageMessage.image.id}`}/>
                </div>
            </div>
        </div>
    )
}