import { NextApiRequest, NextApiResponse } from "next";
import { DBCollection } from "../../enums/DBCollections";
import clientPromise from "../../lib/mongodb";
import { User } from "../../types/user.db";
import bcrypt from "bcrypt";
import constants from "../../lib/constants";
import { PublicUser } from "../../types/public-user";
import { sign } from "../../lib/jwt_sign_verify";

type LoginBody = User;

type LoginResponse = {
    username?: string,
    isInitialPassword?: boolean,
    message?: string,
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<LoginResponse>,
) {
    const client = await clientPromise;
    const db = client.db();
    const loginBody = JSON.parse(req.body) as LoginBody;
    const userFromMongoDB = await db
        .collection(DBCollection.Users)
        .findOne({username: loginBody.username}) as User | null
    if (userFromMongoDB == null) {
        return res.status(400).json({
            message: "Invalid username or password",
        })
    }
    const passwordResult = await bcrypt.compare(loginBody.password, userFromMongoDB.password);
    if (!passwordResult) {
        return res.status(400).json({
            message: "Invalid username or password",
        })
    }
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    const publicUser: PublicUser = {
        username: userFromMongoDB.username,
        guid: userFromMongoDB.guid,
    }
    const token = await sign(JSON.stringify(publicUser), jwtSecretKey);
    res.setHeader("Set-Cookie", `${constants.TOKEN_COOKIE_NAME}=${token}; Path=/; Expires=${constants.COOKIE_MAX_AGE}`)
    res.status(200)
    res.json({
        username: userFromMongoDB.username,
        isInitialPassword: userFromMongoDB.isInitialPassword,
    });
}