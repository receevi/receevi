import LoginClientComponent from "./LoginClientComponent";
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";
import constants from "../../lib/constants";
import { verify } from "../../lib/jwt_sign_verify";

export default async function LoginServerComponent() {
    const clientCookies = cookies();
    const token = clientCookies.get(constants.TOKEN_COOKIE_NAME)?.value
    if (token) {
        try {
            await verify(token, process.env.JWT_SECRET_KEY);
            redirect('/chats')
        } catch (error) {
        }
    }
    return <LoginClientComponent/>
}
