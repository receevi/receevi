import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { MessageTemplate } from "@/types/message-template";
import { createClient } from "@/utils/supabase-browser";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, useCallback, useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import ReceivedTemplateMessageUI from "../../app/(authorized)/(panel)/chats/[wa_id]/ReceivedTemplateMessageUI";
import TWLoader from "../TWLoader";
import { Button } from "./button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { Input } from "./input";
import { Label } from "./label";
import { ButtonParameter, TemplateRequest, HeaderParameter, TextParameter, RequestComponent } from "@/types/message-template-request";

const bodyVariableSchema = z.array(
    z.object({
        argId: z.string(),
        text: z.string().min(1, { message: "Variable text is required" })
    })
);
const headerVariableSchema = z.array(
    z.object({ argId: z.string() }).and(
        z.object({
            type: z.enum(['text']),
            text: z.string().min(1, { message: 'Variable text is required' }),
        }).or(z.object({
            type: z.enum(['image', 'video', 'document']),
            link: z.string().url({ message: 'Variable must be link' }),
        }))
    )
)

const buttonVariableSchema = z.array(
    z.object({
        index: z.number(),
        payload: z.string().min(1, { message: 'Payload text is required' }),
        buttonText: z.string(),
    }).and(
        z.object({
            sub_type: z.enum(['url']),
            url: z.string(),
        }).or(z.object({
            sub_type: z.enum(['quick_reply', 'copy_code']),
        }))
    )
)

type BodyArg = z.infer<typeof bodyVariableSchema>[number];
type HeaderArg = z.infer<typeof headerVariableSchema>[number];
type ButtonPayload = z.infer<typeof buttonVariableSchema>[number];

type MessageParameters = {
    header?: HeaderArg[]
    body?: BodyArg[]
    buttons?: ButtonParameter[]
}

function getVars(messageText: string) {
    const varRegex = /\{\{\d+\}\}/g
    const allMatches = messageText.matchAll(varRegex)
    const params = []
    for (const match of allMatches) {
        const param: BodyArg = {
            argId: match[0],
            text: '',
        }
        params.push(param)
    }
    return params;
}

const formSchema = z.object({
    body: bodyVariableSchema,
    header: headerVariableSchema,
    button: buttonVariableSchema,
})

export default function TemplateSelection({ children, onTemplateSubmit }: { children: React.ReactElement, onTemplateSubmit: Dispatch<TemplateRequest> }) {
    const [supabase] = useState(() => createClient())
    const [templates, setTemplates] = useState<MessageTemplate[] | null>(null);
    const [isTemplatesLoading, setTemplatesLoading] = useState<boolean>(false);
    const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | undefined>();
    const [step, setStep] = useState<number>(0);
    const [totalSteps, _] = useState(2)
    const [isNextEnabled, setNextEnabled] = useState<boolean>(false);
    const [isPreviousEnabled, setPreviousEnabled] = useState<boolean>(false);
    const variableForm = useRef<HTMLFormElement | null>(null);
    const formSubmitted = useRef<boolean>(false);

    const fetchMessageTemplates = useCallback(async function () {
        const { data } = await supabase.from('message_template').select('*').eq('status', 'APPROVED').order('id', { ascending: false })
        setTemplates(data as (MessageTemplate[] | null))
    }, [supabase, setTemplates])

    // useEffect(() => {
    //     formSubmitted.current = false
    // }, [parameters])

    useEffect(() => {
        const asyncFunc = async () => {
            await fetchMessageTemplates()
        }
        asyncFunc().then().catch(e => console.error(e))
    }, [fetchMessageTemplates])

    async function syncTemplates() {
        try {
            setTemplatesLoading(true)
            await supabase.functions.invoke('sync-message-templates')
            await fetchMessageTemplates();
            console.log('finished');
        } finally {
            setTemplatesLoading(false)
        }
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: 'onChange'
    })

    const { fields: headerFields, replace: replaceHeaderFields } = useFieldArray({
        name: 'header',
        control: form.control
    })

    const { fields: bodyFields, replace: replaceBodyFields } = useFieldArray({
        name: 'body',
        control: form.control
    })

    const { fields: buttonFields, replace: replaceButtonFields } = useFieldArray({
        name: 'button',
        control: form.control
    })

    useEffect(() => {
        formSubmitted.current = false
        if (selectedTemplate?.components) {
            replaceHeaderFields([])
            replaceBodyFields([])
            replaceButtonFields([])
            for (const component of selectedTemplate?.components) {
                switch (component.type) {
                    case "HEADER": {
                        let headerVars: HeaderArg[] = []
                        switch (component.format) {
                            case "IMAGE": {
                                headerVars.push({
                                    argId: '{{1}}',
                                    type: 'image',
                                    link: '',
                                })
                                break;
                            }
                            case "VIDEO": {
                                headerVars.push({
                                    argId: '{{1}}',
                                    type: 'video',
                                    link: '',
                                })
                                break;
                            }
                            case "DOCUMENT": {
                                headerVars.push({
                                    argId: '{{1}}',
                                    type: 'document',
                                    link: '',
                                })
                                break;
                            }
                            case "TEXT": {
                                const varList = getVars(component.text)
                                headerVars = varList.map(v => {
                                    return {
                                        ...v,
                                        type: 'text'
                                    }
                                })
                                break;
                            }
                        }
                        replaceHeaderFields(headerVars)
                        break;
                    }
                    case "BODY": {
                        const bodyParams = getVars(component.text)
                        replaceBodyFields(bodyParams)
                        break;
                    }
                    case "BUTTONS": {
                        const buttonPayloads: ButtonPayload[] = []
                        for (const [index, button] of component.buttons.entries()) {
                            switch (button.type) {
                                case "URL": {
                                    if (button.url?.endsWith('{{1}}')) {
                                        buttonPayloads.push({
                                            sub_type: 'url',
                                            url: button.url.replace('{{1}}', ''),
                                            index: index,
                                            payload: '',
                                            buttonText: button.text,
                                        })
                                    }
                                    break;
                                };
                                case "COPY_CODE": {
                                    buttonPayloads.push({
                                        sub_type: 'copy_code',
                                        index: index,
                                        buttonText: button.text,
                                        payload: '',
                                    })
                                    break;
                                };
                                case "QUICK_REPLY": {
                                    buttonPayloads.push({
                                        sub_type: 'quick_reply',
                                        index: index,
                                        buttonText: button.text,
                                        payload: '',
                                    })
                                    break;
                                };
                            }
                        }
                        replaceButtonFields(buttonPayloads)
                    }
                }
            }
        }
    }, [selectedTemplate, replaceBodyFields, replaceHeaderFields, replaceButtonFields])

    const resetTemplatePopup = useCallback(() => {
        setSelectedTemplate(undefined)
        setStep(0)
    }, [setSelectedTemplate, setStep])

    const onSubmit = useCallback((values: z.infer<typeof formSchema>) => {
        const request: TemplateRequest = {
            name: selectedTemplate?.name!!,
            language: {
                code: selectedTemplate?.language!!
            },
            components: []
        }
        const headerArgs: HeaderParameter[] = values.header.map(h => {
            if (h.type === 'text') {
                return {
                    type: 'text',
                    text: h.text
                }
            } else if (h.type === 'image') {
                return {
                    type: 'image',
                    image: { link: h.link }
                }
            } else if (h.type === 'video') {
                return {
                    type: 'video',
                    video: { link: h.link }
                }
            } else if (h.type === 'document') {
                return {
                    type: 'document',
                    document: { link: h.link }
                }
            }
        }) as any
        request.components.push({
            type: "header",
            parameters: headerArgs
        })
        const bodyArgs: TextParameter[] = values.body.map((b) => {
            return {
                type: 'text',
                text: b.text
            }
        })
        request.components.push({
            type: "body",
            parameters: bodyArgs
        })
        const buttonPayloads: RequestComponent[] = values.button.map(b => {
            return {
                type: 'button',
                sub_type: b.sub_type,
                index: b.index.toString(),
                parameters: [
                    {
                        type: 'payload',
                        payload: b.payload
                    }
                ]
            }
        })
        request.components.push(...buttonPayloads)
        onTemplateSubmit(request)
        resetTemplatePopup()
        console.log('request', request)
    }, [selectedTemplate, onTemplateSubmit, resetTemplatePopup])

    useEffect(() => {
        switch (step) {
            case 0: {
                setNextEnabled(!!selectedTemplate)
                setPreviousEnabled(false)
                break;
            }
            case 1: {
                console.log('form.formState.isValid', form.formState.isValid)
                setNextEnabled(form.formState.isValid)
                setPreviousEnabled(true)
                break;
            }
        }
    }, [step, setNextEnabled, setPreviousEnabled, selectedTemplate, form.formState.isValid])

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         console.log('form', form)
    //         console.log('form.formState.isValid', form.formState.isValid)
    //     }, 2000)
    //     return () => clearInterval(interval)
    // }, [])

    const onFinish = useCallback(() => {
        if (!formSubmitted.current) {
            variableForm.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
            formSubmitted.current = true;
        }
    }, [variableForm, formSubmitted])

    const onNextClick = useCallback(() => {
        setStep(s => {
            if (s >= totalSteps - 1) {
                onFinish()
                return s;
            } else {
                return s + 1
            }
        })
    }, [totalSteps, setStep, onFinish])

    const onPreviousClick = useCallback(() => {
        setStep(s => {
            if (s > 0) {
                return s - 1;
            }
            return s;
        })
    }, [setStep])

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px]">
                <DialogHeader>
                    <DialogTitle>Select Message Template</DialogTitle>
                    <DialogDescription>
                        Select a template that matches your message&apos;s purpose and personalize it as needed.
                    </DialogDescription>
                </DialogHeader>
                {(() => {
                    if (step === 0) {
                        return (
                            <div>
                                <div className="pb-4 flex flex-row gap-4">
                                    <p className="text-sm">If your message template is not visible in the list below, click the &quot;Sync Templates&quot; button to fetch the latest templates from your WhatsApp account. This will update your library with any new or modified templates, ensuring you have all your templates available for use.</p>
                                    <Button className={"min-w-fit w-48"} onClick={syncTemplates} disabled={isTemplatesLoading}>
                                        {(() => {
                                            if (isTemplatesLoading) {
                                                return <TWLoader className="w-4 h-4" />
                                            }
                                        })()}
                                        &nbsp;&nbsp;<span>Sync Templates</span>
                                    </Button>
                                </div>
                                <div className="bg-conversation-panel-background relative rounded-md">
                                    <div className="bg-chat-img h-full w-full absolute bg-[length:412.5px_749.25px] opacity-40"></div>
                                    <div className="grid gap-4 py-4 grid-cols-3 w-full p-4 relative h-[50vh] overflow-y-auto">
                                        {templates?.map(template => {
                                            return (
                                                <div key={template.id} className={cn("flex items-center border-2 border-transparent rounded-lg", selectedTemplate?.id == template.id ? 'border-black' : '')}>
                                                    <button className="text-sm bg-white shadow border rounded-lg p-2 text-left w-full" onClick={() => setSelectedTemplate(template)}>
                                                        <ReceivedTemplateMessageUI message={{ template: template, id: template.id, timestamp: '', type: 'template' }} />
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        )
                    } else if (step === 1 && selectedTemplate) {
                        return (
                            <div className="w-full flex flex-row justify-around gap-8 h-[60vh]">
                                <div className="flex items-center">
                                    <div className="text-sm bg-white shadow border rounded-lg p-2 text-left w-64">
                                        <ReceivedTemplateMessageUI message={{ template: selectedTemplate, id: selectedTemplate.id, timestamp: '', type: 'template' }} />
                                    </div>
                                </div>
                                <div className="w-96 flex flex-col gap-2">
                                    <div>
                                        <span className="text-xl">Parameters</span>
                                    </div>
                                    <div className="flex flex-col gap-4 flex-auto overflow-y-auto">
                                        <Form {...form}>
                                            <form ref={variableForm} onSubmit={form.handleSubmit(onSubmit)}>
                                                {(() => {
                                                    if (headerFields.length) {
                                                        return (
                                                            <div>
                                                                <span className="text-lg">Header</span>
                                                                <div className="ml-4 gap-2 flex flex-col">
                                                                    {headerFields.map((headerField, index) => {
                                                                        if (headerField.type === 'text') {
                                                                            const { ref, ...formFieldProps } = form.register(`header.${index}.text` as const)
                                                                            return (
                                                                                <FormField key={headerField.id} {...formFieldProps} render={(({ field }) => {
                                                                                    return (
                                                                                        <FormItem>
                                                                                            <FormLabel>Variable *</FormLabel>
                                                                                            <FormControl>
                                                                                                <Input {...field} />
                                                                                            </FormControl>
                                                                                            <FormMessage />
                                                                                        </FormItem>
                                                                                    )
                                                                                })} />
                                                                            )
                                                                        } else if (headerField.type === 'image' || headerField.type === 'video' || headerField.type === 'document') {
                                                                            const { ref, ...formFieldProps } = form.register(`header.${index}.link` as const)
                                                                            return (
                                                                                <FormField key={headerField.id} {...formFieldProps} render={(({ field }) => {
                                                                                    return (
                                                                                        <FormItem>
                                                                                            <FormLabel>Link to media *</FormLabel>
                                                                                            <FormControl>
                                                                                                <Input {...field} />
                                                                                            </FormControl>
                                                                                            <FormMessage />
                                                                                        </FormItem>
                                                                                    )
                                                                                })} />
                                                                            )
                                                                        }
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                })()}

                                                {(() => {
                                                    if (bodyFields.length) {
                                                        return (
                                                            <div>
                                                                <span className="text-lg">Body</span>
                                                                <div className="ml-4 gap-2 flex flex-col">
                                                                    {bodyFields.map((bodyField, index) => {
                                                                        const { ref, ...formFieldProps } = form.register(`body.${index}.text` as const)
                                                                        return (
                                                                            <FormField key={bodyField.id} {...formFieldProps} render={(({ field }) => {
                                                                                return (
                                                                                    <FormItem>
                                                                                        <FormLabel>Variable {bodyField.argId} *</FormLabel>
                                                                                        <FormControl>
                                                                                            <Input required {...field} />
                                                                                        </FormControl>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                )
                                                                            })} />
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                })()}

                                                {(() => {
                                                    if (buttonFields.length) {
                                                        return (
                                                            <div>
                                                                <span className="text-lg">Button</span>
                                                                <div className="ml-4 gap-2 flex flex-col">
                                                                    {buttonFields.map((buttonField, index) => {
                                                                        const { ref, ...formFieldProps } = form.register(`button.${index}.payload` as const)
                                                                        return (
                                                                            <FormField key={buttonField.id} {...formFieldProps} render={(({ field }) => {
                                                                                if (buttonField.sub_type === 'url') {
                                                                                    return (
                                                                                        <FormItem>
                                                                                            <FormLabel>{buttonField.buttonText} payload *</FormLabel>
                                                                                            <div>
                                                                                                <span>{buttonField.url}</span>
                                                                                                &nbsp;&nbsp;
                                                                                                <FormControl>
                                                                                                    <Input className="inline-block w-40" required {...field} />
                                                                                                </FormControl>
                                                                                            </div>
                                                                                            <FormMessage />
                                                                                        </FormItem>
                                                                                    )
                                                                                }
                                                                                return (
                                                                                    <FormItem>
                                                                                        <FormLabel>{buttonField.buttonText} payload *</FormLabel>
                                                                                        <FormControl>
                                                                                            <Input required {...field} />
                                                                                        </FormControl>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                )
                                                                            })} />
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                })()}
                                            </form>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                })()}
                <DialogFooter>
                    <Button disabled={!isPreviousEnabled} onClick={onPreviousClick}>Previous</Button>
                    {step === totalSteps - 1 ?
                        <DialogClose asChild>
                            <Button disabled={!isNextEnabled} onClick={onNextClick}>Finish</Button>
                        </DialogClose>
                        :
                        <Button disabled={!isNextEnabled} onClick={onNextClick}>Next</Button>
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
