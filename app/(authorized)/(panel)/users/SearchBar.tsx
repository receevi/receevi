'use client'

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";

// Custom debounce function
function useDebounce(callback: (value: string) => void, delay: number) {
    const timerRef = React.useRef<NodeJS.Timeout | null>(null);

    const debouncedCallback = useCallback((value: string) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            callback(value);
        }, delay);
    }, [callback, delay]);

    return debouncedCallback;
}

export default function SearchBar() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const debouncedSearch = useDebounce((value: string) => {
        const params = new URLSearchParams()
        params.set('search', value)
        router.push('/users?' + params.toString())
    }, 300);

    // Handle input change and trigger debounce
    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleInputChange(event);
        debouncedSearch(event.target.value);
    };

    return (
        <Input
            type="text"
            placeholder="Search users..."
            className="border rounded-full px-2 py-1 flex-grow"
            value={searchTerm}
            onChange={onInputChange}
        />
    );
}