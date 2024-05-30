'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { DBTables } from "@/lib/enums/Tables";
import { AppSetup } from "@/lib/repositories/setup/SetupRepository";
import { createClient } from "@/utils/supabase-browser";
import { Circle } from 'lucide-react';
import { useEffect, useState } from "react";
import { Loader } from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';
import Link from "next/link";
import constants from "@/lib/constants";

export default function SetupFrontendClient({ pendingItems }: { pendingItems: AppSetup[] }) {
    const [supabase] = useState(() => createClient())
    const [pendingItemsState, setPendingItems] = useState(pendingItems);
    const [isSetupCompleted, setSetupCompleted] = useState(pendingItems.length == 0)
    const [errorMessage, setErrorMessage] = useState<string>('');

    async function onSetupClick() {
        setErrorMessage('');
        const supabaseClient = createClient()
        const setupResponse = await supabaseClient.functions.invoke('setup')
        console.log('setupResponse', setupResponse)
        if (setupResponse.error) {
            console.error(setupResponse.error);
            setErrorMessage('Something went wrong');
        }
    }

    useEffect(() => {
        const channel = supabase
            .channel('any')
            .on<AppSetup>('postgres_changes', { event: '*', schema: 'public', table: DBTables.Setup }, payload => {
                switch (payload.eventType) {
                    case "UPDATE":
                        const indexOfItem = pendingItemsState.findIndex((setupItem: AppSetup) => setupItem.id == payload.old.id)
                        if (indexOfItem !== -1) {
                            pendingItemsState[indexOfItem] = payload.new
                            setPendingItems([...pendingItemsState])
                        } else {
                            console.warn(`Could not find setup item to update contact for id: ${payload.old.id}`)
                        }
                        break;
                }
            })
            .subscribe()
        return () => { supabase.removeChannel(channel) }
    }, [])
    useEffect(() => {
        let isAllCompleted = true
        for (const pendingItem of pendingItemsState) {
            const isCurrentCompleted = pendingItem.done_at != null
            if (!isCurrentCompleted) {
                isAllCompleted = false
                break
            }
        }
        setSetupCompleted(isAllCompleted)
    }, [pendingItemsState])
    return (
        <div className="flex items-center justify-center h-screen">
            <Card className="rounded-2xl w-96">
                <CardHeader>
                    <CardTitle>Setup</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 items-end">
                    {pendingItemsState.length > 0 && <Table>
                        <TableBody>
                            {pendingItemsState.map((pendingItem: AppSetup) => {
                                return (
                                    <TableRow key={pendingItem.id}>
                                        <TableCell>
                                            {pendingItem.display_text}
                                        </TableCell>
                                        <TableCell>
                                            {(() => {
                                                if (pendingItem.in_progress) {
                                                    return (
                                                        <Loader className="animate-spin" />
                                                    )
                                                } else if (pendingItem.done_at != null) {
                                                    return (
                                                        <CheckCircle2 />
                                                    )
                                                }
                                                return (
                                                    <Circle />
                                                )
                                            })()}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>}
                    {errorMessage && <span className="text-red-500 text-sm w-full">{errorMessage}</span>}
                    {pendingItemsState.length == 0 && <div className="w-full">You are done with setup</div>}
                    {!isSetupCompleted && <Button onClick={onSetupClick}>Complete setup</Button>}
                    {isSetupCompleted && <Link href={constants.DEFAULT_ROUTE}><Button>Take me home</Button></Link>}
                </CardContent>
            </Card>
        </div>
    )
}
