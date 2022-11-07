"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import TWLoader from "../../components/TWLoader";

export default function LoginClientComponent() {
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");
    const router = useRouter()
    const onLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");
        setLoading(true)
        let routingToNextPage = false;
        try {
            const loginResponse = await fetch('/api/login', {
                method: "POST",
                credentials: 'include',
                body: JSON.stringify({
                    username: username,
                    password: password,
                })
            })
            if (loginResponse.status == 400) {
                const errorBody = await loginResponse.json()
                setErrorMessage(errorBody.message);
            } else if (loginResponse.status == 200) {
                router.push('/chats');
                routingToNextPage = true;
            } else {
                setErrorMessage("Something went wrong");
            }
        } finally {
            if (!routingToNextPage) {
                setLoading(false)
            }
        }
    }
    return (
        <div className="h-screen flex items-center justify-center">
            <form className="flex flex-col gap-4 bg-indigo-100 p-8 rounded-lg w-80" method="POST" onSubmit={onLoginSubmit}>
                <div className="flex flex-col">
                    <label htmlFor="username">Username</label>
                    <input
                        name="username" id="username" placeholder="Username"
                        className="p-2 border rounded"
                        value={username} onChange={(event) => setUsername(event.target.value)}
                        required />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="password">Password</label>
                    <input
                        name="password" id="password" placeholder="Password"
                        type="password" className="p-2 border rounded"
                        value={password} onChange={(event) => setPassword(event.target.value)}
                        required />
                </div>
                <div>
                    <span className="text-red-500">{errorMessage}</span>
                </div>
                <div className="flex justify-center">
                    <button disabled={loading} type="submit" className="p-2 w-24 bg-indigo-500 text-white rounded flex justify-center">
                        {(() => {
                            if (loading) {
                                return <TWLoader className="w-5 h-5 text-white"/>
                            } else {
                                return "Login"
                            }
                        })()}
                    </button>
                </div>
            </form>
        </div>
    );
}