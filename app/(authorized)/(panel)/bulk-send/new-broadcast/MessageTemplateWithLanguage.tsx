'use client';

import React, { useMemo, useState } from 'react'
import { SelectOption, SingleSelectDropdown, emptyOption } from './SingleSelectDropdown'
import { Label } from '@radix-ui/react-label'
import { getTemplateLanguges } from '@/lib/bulk-send';

export default function MessageTemplateWithLanguage({ messageTemplates: messageTemplatesOptions }: { messageTemplates: SelectOption[] }) {
    const [languages, setLanguages] = useState<SelectOption[]>([])
    const [messageTemplate, setMessageTemplate] = React.useState<SelectOption>(emptyOption)
    const [language, setLanguage] = React.useState<SelectOption>(emptyOption)
    async function onMessageTemplateChange(messageTemplate: SelectOption) {
        setMessageTemplate(messageTemplate)
        console.log('messageTemplate', messageTemplate.value)
        const languagesFromServer = await getTemplateLanguges(messageTemplate.value)
        setLanguages(languagesFromServer.map(item => {
            return {
                value: item,
                label: item
            }
        }))
        setLanguage(emptyOption)
    }
    return (
        <>
            <div className="grid gap-1.5">
                <Label htmlFor="message_template">Message Template</Label>
                <SingleSelectDropdown name="message_template" displayName="message template"
                    className="w-[20rem]" options={messageTemplatesOptions}
                    value={messageTemplate} onChange={onMessageTemplateChange} />
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="language">Language</Label>
                <SingleSelectDropdown name="language" displayName="language"
                    className="w-[20rem]" options={languages}
                    value={language} onChange={(value) => setLanguage(value)} />
            </div>
        </>
    )
}
