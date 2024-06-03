import TWLoader from "@/components/TWLoader"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import {
    Form,
    FormControl, FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createClient } from "@/utils/supabase-browser"
import { zodResolver } from "@hookform/resolvers/zod"
import { ReactNode, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ["text/csv"];

const FormSchema1 = z.object({
    file: z
        .any()
        .refine((file) => file?.length > 0, "CSV file is required.")
        // .refine((file) => file?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            "Only .csv files are accepted."
        ),
})

const FormSchema = z.object({
    bulkfile: typeof window === 'undefined' ? z.any() : z.instanceof(FileList).refine((file) => file?.length == 1, 'File is required.')
});

export function AddBulkContactsDialog({ children, onSuccessfulAdd }: { children: ReactNode, onSuccessfulAdd: () => void }) {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [supabase] = useState(() => createClient())
    const [isLoading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        /*defaultValues: {
            file: "",
        }*/
    })

    const fileRef = form.register("bulkfile");

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        // console.log('data', data)
        setLoading(true)
        setErrorMessage('')
        const bulkfile = data.bulkfile && data.bulkfile[0]
        // console.log('bulkfile', bulkfile)
        const csvData = await bulkfile.text()
        const dataToSend = {
            csvData: csvData
        };
        const res = await supabase.functions.invoke("insert-bulk-contacts", {
            body: csvData,
        });
        setLoading(false)
        if (res.error) {
            console.error('Error while sending bulk csv', res.error)
            setErrorMessage("Something went wrong")
            return;
        }
        console.log('inserting bulk contacts done')
        setDialogOpen(false)
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Bulk Contacts via CSV</DialogTitle>
                    <DialogDescription>
                        Upload CSV file containing contacts to add. <a className="text-blue-500" href="/assets/example-bulk-contacts.csv" target="_blank" rel="noopener noreferrer">Click here</a> to download sample CSV file.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="bulkfile"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>CSV file</FormLabel>
                                    <FormControl>
                                        <Input type="file" {...fileRef} accept="text/csv" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {(() => {
                            if (errorMessage) {
                                return (
                                    <span className="text-red-500 text-sm">{errorMessage}</span>
                                )
                            }
                        })()}
                        <DialogFooter>
                            {isLoading && <TWLoader className="w-10 h-10"/>}
                            {!isLoading && <Button type="submit">Submit</Button>}
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
