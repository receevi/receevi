'use client'

import { useEffect } from 'react'
import MoreIcon from '@/components/icons/MoreIcon'
import BlankUser from '../BlankUser'
import { UPDATE_CURRENT_CONTACT, useContacts, useCurrentContactDispatch } from '../CurrentContactContext'

export default function ChatHeader({ waId }: { waId: string }) {
    const currentContact = useContacts()
    const dispatch = useCurrentContactDispatch()
    useEffect(() => {
        if (!currentContact?.current && dispatch) {
            dispatch({type: UPDATE_CURRENT_CONTACT, waId: Number.parseInt(waId)})
        }
    })
    return (
        <div className="bg-panel-header-background">
            <header className="px-4 py-2 flex flex-row gap-4 items-center">
                <BlankUser className="w-10 h-10" />
                <div className='text-primary-strong flex-grow'>
                    {currentContact?.current?.profile_name}
                </div>
                <MoreIcon className='text-panel-header-icon' />
            </header>
        </div>
    )
}
