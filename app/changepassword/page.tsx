"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import TWLoader from "../../components/TWLoader";

export default function ChangePasswordClientComponent() {
    const [ currentPassword, setCurrentPassword ] = useState("");
    const [ newPassword, setNewPassword ] = useState("");
    const [ repeatPassword, setRepeatPassword ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");
    const router = useRouter()
    const onChangePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");
        setLoading(true)
        let routingToNextPage = false;
        try {
            const loginResponse = await fetch('/api/changepassword', {
                method: "POST",
                credentials: 'include',
                body: JSON.stringify({
                    currentPassword: currentPassword,
                    newPassword: newPassword,
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
            <form className="flex flex-col gap-4 bg-indigo-100 p-8 rounded-lg w-80" method="POST" onSubmit={onChangePasswordSubmit}>
                <h2 className="text-lg text-center">Change password</h2>
                <div className="flex flex-col">
                    <label htmlFor="currentPassword">Current password</label>
                    <input
                        name="currentPassword" id="currentPassword" placeholder="Current password"
                        type="password" className="p-2 border rounded"
                        value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)}
                        required />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="newPassword">New password</label>
                    <input
                        name="newPassword" id="newPassword" placeholder="New password"
                        type="password" className="p-2 border rounded"
                        value={newPassword} onChange={(event) => setNewPassword(event.target.value)}
                        required />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="repeatPassword">Repeat password</label>
                    <input
                        name="repeatPassword" id="repeatPassword" placeholder="Repeat password"
                        type="password" className="p-2 border rounded"
                        value={repeatPassword} onChange={(event) => setRepeatPassword(event.target.value)}
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
                                return "Change"
                            }
                        })()}
                    </button>
                </div>
            </form>
        </div>
    );
}
