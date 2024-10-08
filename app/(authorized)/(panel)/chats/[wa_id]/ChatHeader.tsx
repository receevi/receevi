'use client'

import { use, useCallback, useEffect, useState } from 'react'
import MoreIcon from '@/components/icons/MoreIcon'
import BlankUser from '../BlankUser'
import { UPDATE_CURRENT_CONTACT, useContacts, useCurrentContactDispatch } from '../CurrentContactContext'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAgents } from '../AgentContext'
import { useUserRole } from '@/components/supabase-user-provider'
import UserLetterIcon from '@/components/users/UserLetterIcon'
import { useSupabase } from '@/components/supabase-provider'

export default function ChatHeader({ waId }: { waId: string }) {
    const currentContact = useContacts()
    const dispatch = useCurrentContactDispatch()
    const agentState = useAgents()
    const { supabase } = useSupabase()
    const userRole = useUserRole()
    console.log('currentContact?.current?.assigned_to', currentContact?.current?.assigned_to)
    // const [roleAssigned, setRoleAssigned] = useState<string | undefined>(currentContact?.current?.assigned_to || undefined)
    const [roleAssigned, setRoleAssigned] = useState<string | undefined>(currentContact?.current?.assigned_to || undefined)
    console.log('roleAssigned', roleAssigned)
    useEffect(() => {
        setRoleAssigned(currentContact?.current?.assigned_to || undefined)
    }, [currentContact])
    useEffect(() => {
        if (!currentContact?.current && dispatch) {
            dispatch({ type: UPDATE_CURRENT_CONTACT, waId: Number.parseInt(waId) })
        }
    })
    const assignToAgent = useCallback(async (agentId: string) => {
        const { data } = await supabase.from('contacts').update({ assigned_to: agentId }).eq('wa_id', waId)
        console.log('data', data)
        setRoleAssigned(agentId)
        if (currentContact?.current) {
            currentContact.current.assigned_to = agentId
        }
    }, [supabase])
    console.log('agentState.agents', agentState?.agents)
    return (
        <div className="bg-panel-header-background">
            <header className="px-4 py-2 flex flex-row gap-4 items-center">
                <BlankUser className="w-10 h-10" />
                <div className='text-primary-strong flex-grow'>
                    {currentContact?.current?.profile_name}
                </div>
                {(() => {
                    if (userRole == 'admin') {
                        return (<div className='flex flex-row items-center gap-2'>
                            <div>Assign to:</div>
                            <div>
                                <Select value={roleAssigned} onValueChange={(value) => { assignToAgent(value) }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an agent" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {agentState?.agents.map((ag) => {
                                            return (
                                                <SelectItem key={ag.id} value={ag.id}>
                                                    <div className='flex flex-row gap-2 items-center'>
                                                        <UserLetterIcon user={ag} className='' />
                                                        <div className='flex-shrink-0'>
                                                            <div>{ag.firstName + ' ' + ag.lastName}</div>
                                                            <div>{ag.email}</div>
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>)
                    }
                })()}
            </header>
        </div>
    )
}
