import {
    Dialog,
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
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import ReceivedTemplateMessageUI from "../../app/(authorized)/(panel)/chats/[wa_id]/ReceivedTemplateMessageUI";
import TWLoader from "../TWLoader";
import { Button } from "./button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { Input } from "./input";
import { Label } from "./label";


type MediaParameter = {
    link: string
}

type HeaderParameter = {
    type: 'text' | 'image' | 'video' | 'document'
    key: string
    text?: string
    image?: MediaParameter
    video?: MediaParameter
    document?: MediaParameter
    value: string
}

type TextParameter = {
    type: 'text'
    key: string
    value: string
}

type ButtonParameter = {
    type: 'url' | 'otp'
    index: number
    display_text: string
    url?: string
    value: string
}

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

type BodyArg = z.infer<typeof bodyVariableSchema>[number];
type HeaderArg = z.infer<typeof headerVariableSchema>[number];

type MessageParameters = {
    header?: HeaderArg[]
    body?: BodyArg[]
    buttons?: ButtonParameter[]
}

function getParameterList(messageText: string): TextParameter[] {
    const varRegex = /\{\{\d+\}\}/g
    const allMatches = messageText.matchAll(varRegex)
    const params = []
    for (const match of allMatches) {
        const param: TextParameter = {
            type: 'text',
            key: match[0],
            value: '',
        }
        params.push(param)
    }
    return params;
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
})

export default function TemplateSelection({ children }: { children: React.ReactElement }) {
    const [supabase] = useState(() => createClient())
    const [templates, setTemplates] = useState<MessageTemplate[] | null>(null);
    const [isTemplatesLoading, setTemplatesLoading] = useState<boolean>(false);
    const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | undefined>();
    const [step, setStep] = useState<number>(0);
    const [parameters, setParameters] = useState<MessageParameters | undefined>();
    const [totalSteps, _] = useState(2)
    const [isNextEnabled, setNextEnabled] = useState<boolean>(false);
    const [isPreviousEnabled, setPreviousEnabled] = useState<boolean>(false);

    const fetchMessageTemplates = useCallback(async function () {
        const { data } = await supabase.from('message_template').select('*').eq('status', 'APPROVED').order('id', { ascending: false })
        console.log('templates', data)
        console.log('h', data!![0].components);
        setTemplates(data as (MessageTemplate[] | null))
    }, [supabase, setTemplates])

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
        defaultValues: {
            body: parameters?.body
        },
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

    useEffect(() => {
        if (selectedTemplate?.components) {
            const params: MessageParameters = {}
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
                        const buttonParams: ButtonParameter[] = []
                        for (const [index, button] of component.buttons.entries()) {
                            switch (button.type) {
                                case "URL": {
                                    if (button.url?.endsWith('{{1}}')) {
                                        buttonParams.push({
                                            type: 'url',
                                            display_text: button.text,
                                            index: index,
                                            url: button.url.replace('{{1}}', ''),
                                            value: '',
                                        })
                                    }
                                    break;
                                }
                                case "COPY_CODE": {
                                    buttonParams.push({
                                        type: 'otp',
                                        display_text: button.text,
                                        index: index,
                                        value: '',
                                    })
                                    break;
                                }
                            }
                        }
                        params.buttons = buttonParams
                    }
                }
            }
            setParameters(params)
        } else {
            console.warn('selectedTemplate?.components is falsy', selectedTemplate?.components)
        }
    }, [selectedTemplate, replaceBodyFields, replaceHeaderFields])

    function selectTemplate(template: MessageTemplate) {
        setSelectedTemplate(template)
    }

    const onSubmit = useCallback((values: z.infer<typeof formSchema>) => {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log('form submit', values)
    }, [])

    useEffect(() => {
        console.log('here in effect', step)
        switch (step) {
            case 0: {
                console.log('selectedTemplate from effect', selectedTemplate)
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
    }, [step, setNextEnabled, setPreviousEnabled, selectedTemplate, parameters, form.formState.isValid])

    const onFinish = useCallback(() => {
        form.handleSubmit(onSubmit)()
    }, [form, onSubmit])

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         console.log(form.formState.errors)
    //     }, 1000)
    //     return () => clearInterval(interval)
    // }, [form])

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
                                                    <button className="text-sm bg-white shadow border rounded-lg p-2 text-left w-full" onClick={() => selectTemplate(template)}>
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
                                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                                {(() => {
                                                    if (headerFields.length) {
                                                        return (
                                                            <div>
                                                                <span className="text-lg">Header</span>
                                                                <div className="ml-4 gap-2 flex flex-col">
                                                                    {headerFields.map((headerField, index) => {
                                                                        if (headerField.type === 'text') {
                                                                            return (
                                                                                <FormField key={headerField.id} {...form.register(`header.${index}.text` as const)} render={(({ field }) => {
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
                                                                            return (
                                                                                <FormField key={headerField.id} {...form.register(`header.${index}.link` as const)} render={(({ field }) => {
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
                                                                        return (
                                                                            <FormField key={bodyField.id} {...form.register(`body.${index}.text` as const)} render={(({ field }) => {
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

                                                {/* {(() => {
                                            if (parameters?.buttons?.length) {
                                                return (
                                                    <div>
                                                        <span className="text-lg">Body</span>
                                                        <div className="ml-4 gap-2 flex flex-col">
                                                            {parameters.buttons.map((p) => {
                                                                return (
                                                                    <div key={p.index}>
                                                                        <Label htmlFor="button-variable-1">{p.display_text}</Label>
                                                                        {(() => {
                                                                            if (p.type === 'url') {
                                                                                return (
                                                                                    <div>
                                                                                        <span>{p.url}</span>
                                                                                        &nbsp;&nbsp;
                                                                                        <Input name="button-variable-1" className="w-32 inline-block" value={p.value} onChange={e => {
                                                                                            p.value = e.target.value; setParameters(structuredClone((parameters)))
                                                                                        }} />
                                                                                    </div>
                                                                                )
                                                                            } else {
                                                                                return <Input name="button-variable-1" value={p.value} onChange={e => {
                                                                                    p.value = e.target.value; setParameters(structuredClone((parameters)))
                                                                                }} />
                                                                            }
                                                                        })()}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })()} */}
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
                    <Button disabled={!isNextEnabled} onClick={onNextClick}>{step === totalSteps - 1 ? 'Finish' : 'Next'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
