import { NextApiRequest, NextApiResponse } from "next";
import { DBCollection } from "../../enums/DBCollections";
import clientPromise from "../../lib/mongodb";
import { User } from "../../types/user.db";
import bcrypt from "bcrypt";
import constants from "../../lib/constants";
import { PublicUser } from "../../types/public-user";
import { verify } from "../../lib/jwt_sign_verify";

type PassWordChangeBody = {
    currentPassword: string,
    newPassword: string,
};

type LoginResponse = {
    username?: string,
    isInitialPassword?: boolean,
    message?: string,
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<LoginResponse | "">,
) {
    const client = await clientPromise;
    const db = client.db();
    const tokenFromCookie = req.cookies[constants.TOKEN_COOKIE_NAME]
    let userData: PublicUser | null;
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    if (!tokenFromCookie) {
        return res.status(401).send("")
    }
    try {
        const tokenData = await verify(tokenFromCookie, jwtSecretKey);
        userData = JSON.parse(tokenData['payload'] as string);
    } catch (error) {
        userData = null;
    }
    if (!userData) {
        return res.status(401).send("")
    }

    const passwordChangeBody = JSON.parse(req.body) as PassWordChangeBody;
    const userFromMongoDB = await db
        .collection(DBCollection.Users)
        .findOne({guid: userData.guid}) as User | null
    console.log('userFromMongoDB', userFromMongoDB);
    if (userFromMongoDB == null) {
        return res.status(400).json({
            message: "Something went wrong",
        })
    }
    const passwordResult = await bcrypt.compare(passwordChangeBody.currentPassword, userFromMongoDB.password);
    if (!passwordResult) {
        return res.status(400).json({
            message: "Current password is incorrect",
        })
    }
    const hashedNewPassword = await bcrypt.hash(passwordChangeBody.newPassword, 10);
    await db
        .collection(DBCollection.Users)
        .updateOne(
            { username: userData.username },
            {
                $set: {
                    password: hashedNewPassword,
                    isInitialPassword: false,
                }
            }
        )
    res.status(200).json({
        message: "Password changed successfully",
        isInitialPassword: userFromMongoDB.isInitialPassword,
    });
}