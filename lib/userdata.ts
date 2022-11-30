import { NextApiRequest } from "next";
import { PublicUser } from "../types/public-user";
import constants from "./constants";
import { verify } from "./jwt_sign_verify";

export async function getUserDataFromRequest(req: NextApiRequest): Promise<PublicUser | null> {
    const tokenFromCookie = req.cookies[constants.TOKEN_COOKIE_NAME]
    let userData: PublicUser | null;
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    if (!tokenFromCookie) {
        return null;
    }
    try {
        const tokenData = await verify(tokenFromCookie, jwtSecretKey);
        return JSON.parse(tokenData['payload'] as string) as PublicUser;
    } catch (error) {
        userData = null;
    }
    return userData;
}
