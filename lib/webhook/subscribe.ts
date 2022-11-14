import { NextApiRequest, NextApiResponse } from "next";
import { DBCollection } from "../../enums/DBCollections";
import { KeyVal } from "../../types/keyval";
import constants from "../constants";
import clientPromise from "../mongodb";

export default async function subscribeWebhook(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {
    // Parse params from the webhook verification request
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"] as string | null;
    if (mode && token && challenge) {
        const client = await clientPromise;
        const db = client.db();
        const verifyTokenKeyVal = await db.collection<KeyVal>(DBCollection.KeyVal).findOne({ key: constants.MONGO_KEY_VERIFY_TOKEN })
        if (!verifyTokenKeyVal) {
            console.error("Incomplete setup. Please call /setup first");
            res.status(400).send("");
        }
        const verifyToken = verifyTokenKeyVal?.value
        // Check the mode and token sent are correct
        if (mode === "subscribe" && token === verifyToken) {
            // Respond with 200 OK and challenge token from the request
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.status(403).send("");
        }
    } else {
        res.status(400).send("");
    }
}
