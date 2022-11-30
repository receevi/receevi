import { NextApiRequest, NextApiResponse } from "next";
import { DBCollection } from "../../enums/DBCollections";
import clientPromise from "../../lib/mongodb";
import { User } from "../../types/user.db";
import bcrypt from "bcrypt";
import { getUserDataFromRequest } from "../../lib/userdata";

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
    const userData = await getUserDataFromRequest(req);
    if (!userData) {
        return res.status(401).send("")
    }

    const userFromMongoDB = await db
        .collection<User>(DBCollection.Users)
        .findOne({guid: userData.guid})
    console.log('userFromMongoDB', userFromMongoDB);
    if (userFromMongoDB == null) {
        return res.status(400).json({
            message: "Something went wrong",
        })
    }
    const passwordChangeBody = JSON.parse(req.body) as PassWordChangeBody;
    const passwordResult = await bcrypt.compare(passwordChangeBody.currentPassword, userFromMongoDB.password);
    if (!passwordResult) {
        return res.status(400).json({
            message: "Current password is incorrect",
        })
    }
    const hashedNewPassword = await bcrypt.hash(passwordChangeBody.newPassword, 10);
    await db
        .collection<User>(DBCollection.Users)
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