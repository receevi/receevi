import { NextApiRequest, NextApiResponse } from "next";
import { DBCollection } from "../../enums/DBCollections";
import clientPromise from "../../lib/mongodb";
import { User } from "../../types/user.db";
import bcrypt from "bcrypt";
import constants from "../../lib/constants";
import { PublicUser } from "../../types/public-user";
import { sign } from "../../lib/jwt_sign_verify";
import { LoginResponse } from "../../types/login-response";

type LoginBody = User;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<LoginResponse>,
) {
    const client = await clientPromise;
    const db = client.db();
    const loginBody = JSON.parse(req.body) as LoginBody;
    const userFromMongoDB = await db
        .collection<User>(DBCollection.Users)
        .findOne({username: loginBody.username})
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
    const tokenCookie = `${constants.TOKEN_COOKIE_NAME}=${token}; Path=/; Expires=${constants.COOKIE_MAX_AGE}`;
    const noCacheCookie = `${constants.NO_CACHE_COOKIE_NAME}=1; Path=/; Expires=${constants.COOKIE_MAX_AGE}`;
    res.setHeader("Set-Cookie", [tokenCookie, noCacheCookie]);
    res.status(200)
    res.json({
        username: userFromMongoDB.username,
        isInitialPassword: userFromMongoDB.isInitialPassword,
    });
}