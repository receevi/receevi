'use client';

import TWLoader from "@/components/TWLoader";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import TemplateSelection from "@/components/ui/template-selection";
import { TemplateRequest } from "@/types/message-template-request";
import { Image as ImageIcon, File as FileIcon, Paperclip, MessageSquareDashed, XCircle } from "lucide-react";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";

export type FileType = 'image' | 'video' | 'file' | undefined

type SendMessageUIProps = {
    onMessageSend: () => void,
    message: string
    fileType: FileType
    file: File | undefined
    setMessage: Dispatch<SetStateAction<string>>
    setFileType: Dispatch<SetStateAction<FileType | undefined>>
    setFile: Dispatch<SetStateAction<File | undefined>>
    onTemplateMessageSend: (req: TemplateRequest) => Promise<void>
}

export default function SendMessageUI({ message, fileType, file, setMessage, setFile, setFileType, onMessageSend, onTemplateMessageSend }: SendMessageUIProps) {
    const [messageSendInProgress, setMessageSendInProgress] = useState<boolean>(false);
    const [mediaSrcUrl, setMediaSrcUrl] = useState<string | undefined>()
    const [fileName, setFileName] = useState<string | undefined>()
    const messageTemplateOpenerButton = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!file) {
            setMediaSrcUrl(undefined)
            setFileName(undefined)
        }
    }, [file])

    function onFileClick() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'audio/aac, audio/mp4, audio/mpeg, audio/amr, audio/ogg, audio/opus, application/vnd.ms-powerpoint, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/pdf, text/plain, application/vnd.ms-excel, image/jpeg, image/png, image/webp, video/mp4, video/3gpp';
        fileInput.onchange = (e: Event) => {
            const file = (e.target as HTMLInputElement)?.files!![0];
            console.log('file.type', file.type)
            setFileType('file')
            setFileName(file.name)
            setFile(file)
        }
        fileInput.click();
    }

    function onPhotosVideosClick() {
        console.log("photos videos click")
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/jpeg, image/png, image/webp, video/mp4, video/3gpp';
        fileInput.onchange = (e: Event) => {
            const file = (e.target as HTMLInputElement)?.files!![0];
            console.log('file.type', file.type)
            if (file.type.startsWith('image')) {
                setFileType('image')
            } else if (file.type.startsWith('video')) [
                setFileType('video')
            ]
            setFile(file)
            setMediaSrcUrl(URL.createObjectURL(file));
        }
        fileInput.click();
    }

    function removeMedia() {
        setFileType(undefined)
        setMediaSrcUrl(undefined)
        setFileName(undefined)
        setFile(undefined)
    }
    const onTemplateSubmit = useCallback(async (req: TemplateRequest) => {
        setMessageSendInProgress(true)
        try {
            await onTemplateMessageSend(req)
        } finally {
            setMessageSendInProgress(false)
        }
    }, [setMessageSendInProgress, onTemplateMessageSend])

    return (
        <>
            {(typeof fileType !== 'undefined') && <div className="bg-slate-200 p-4">
                <div className="inline-block relative">
                    {fileType === 'image' && mediaSrcUrl && <img className="h-48 w-48 inline-block object-cover rounded-md border border-black" src={mediaSrcUrl} />}
                    {fileType === 'video' && mediaSrcUrl && <video className="h-48 w-48 inline-block object-cover rounded-md border border-black" controls src={mediaSrcUrl} />}
                    {fileType === 'file' && <div className="h-48 w-48 inline-block object-cover rounded-md border border-black p-4">{fileName}</div>}
                    <button disabled={messageSendInProgress} className="absolute top-0 right-0 m-2" onClick={removeMedia}><XCircle className="h-8 w-8 bg-slate-300 rounded-full p-1" /></button>
                </div>
            </div>}
            <form className="bg-rich-text-panel-background px-4 py-2 flex flex-row gap-4" onSubmit={async (event) => {
                event.preventDefault()
                const trimmedMessage = message.trim()
                if (trimmedMessage.length > 0 || file) {
                    setMessageSendInProgress(true)
                    try {
                        await onMessageSend()
                    } finally {
                        setMessageSendInProgress(false)
                    }
                }
            }}>
                <input value={message} onChange={e => setMessage(e.target.value)} className="w-full p-2 rounded-md" placeholder="Type a message" />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button disabled={typeof file !== 'undefined'} variant="outline"><Paperclip className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuItem onClick={onFileClick}>
                            <FileIcon className="mr-2 h-4 w-4" />
                            <span>File</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onPhotosVideosClick}>
                            <ImageIcon className="mr-2 h-4 w-4" />
                            <span>Photos & videos</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => messageTemplateOpenerButton.current?.click()}>
                            <MessageSquareDashed className="mr-2 h-4 w-4" />
                            <span>Template message</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>

                </DropdownMenu>
                <TemplateSelection onTemplateSubmit={onTemplateSubmit}>
                    <Button ref={messageTemplateOpenerButton} className="hidden">Open message template</Button>
                </TemplateSelection>
                <Button type="submit" className="w-32" disabled={messageSendInProgress}>{messageSendInProgress ? <TWLoader className="w-4 h-4" /> : 'Send'}</Button>
            </form>
        </>
    )
}