import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ContactTagServerFactory from "@/lib/repositories/contact-tag/ContactTagServerFactory"
import MessageTemplateServerFactory from "@/lib/repositories/message-template/MessageTemplateServerFactory"
import MessageTemplateWithLanguage from "./MessageTemplateWithLanguage"
import { MultiSelectDropdown } from "./MultiSelectDropdown"
import NewBroadcastPageForm from "./NewBroadcastPageForm"
import { SubmitButton } from "./SubmitButton"

function convertToOptions(value: string) {
    return {
        value: value,
        label: value,
    }
}

export default async function NewBroadcastPage() {
    const messageTemplateRepo = MessageTemplateServerFactory.getInstance()
    const contactTagRepo = ContactTagServerFactory.getInstance()
    const messageTemplates = (await messageTemplateRepo.getMessageTemplateUniqueNames()).map(convertToOptions)
    const contactTags = (await contactTagRepo.getContactTags()).map(convertToOptions)
    return (
        <NewBroadcastPageForm>
            <div className="grid gap-1.5">
                <Label htmlFor="broadcast_name">Name</Label>
                <Input className="w-[20rem]" name="broadcast_name" />
            </div>
            <MessageTemplateWithLanguage messageTemplates={messageTemplates} />
            <div className="grid gap-1.5">
                <Label htmlFor="contact_tags">Contact Tags</Label>
                <MultiSelectDropdown name="contact_tags" displayName="tag" className="w-[20rem]" options={contactTags} />
            </div>
            <SubmitButton/>
        </NewBroadcastPageForm>
    )
}