'use client';

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import ContactsClient from './pageClient'

const queryClient = new QueryClient()

export default function Contacts() {
    return (
        <QueryClientProvider client={queryClient}>
            <ContactsClient />
        </QueryClientProvider>
    )
}
