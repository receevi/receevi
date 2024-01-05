'use server';

import { createClient as createServerClient } from '@/utils/supabase-server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import MessageTemplateServerFactory from '../repositories/message-template/MessageTemplateServerFactory';

const schema = z.object({
    broadcast_name: z.string(),
    message_template: z.string(),
    language: z.string(),
    contact_tags: z.string(),
});

type BulkSendRequest = {
    name: string,
    messageTemplate: string,
    language: string,
    contactTags: string[],
}

export async function getTemplateLanguges(templateName: string): Promise<string[]> {
    const messageTemplateRepo = MessageTemplateServerFactory.getInstance()
    return await messageTemplateRepo.getMessageTemplateLanguages(templateName)
}

export async function bulkSend(prevState: {message: string}, formData: FormData) {
    const parsed = schema.parse({
        broadcast_name: formData.get('broadcast_name'),
        message_template: formData.get('message_template'),
        contact_tags: formData.get('contact_tags'),
        language: formData.get('language'),
    });
    const bulkSendRequest: BulkSendRequest = {
        name: parsed.broadcast_name,
        messageTemplate: parsed.message_template,
        language: parsed.language,
        contactTags: JSON.parse(parsed.contact_tags)
    }
    const supabase = createServerClient()
    const { error } = await supabase.functions.invoke('bulk-send', {
        body: bulkSendRequest
    })
    if (error) {
        console.error('error while initiating bulk send', error)
        return { message: "something went wrong" }
    }
    revalidatePath('/bulk-send', 'page');
    redirect('/bulk-send');
}
