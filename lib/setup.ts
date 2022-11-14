import { randomUUID, randomBytes } from 'crypto';
import { DBCollection } from '../enums/DBCollections';
import clientPromise from './mongodb';
import { User } from '../types/user.db';
import constants from './constants';
import { KeyVal } from '../types/keyval';

export default async function setupApplication() {
    const client = await clientPromise;
    const db = client.db();
    const adminUser = await db.collection<User>(DBCollection.Users).findOne({ username: 'admin' })
    if (!adminUser) {
        const hashedAdminDefaultPassword = '$2b$10$YO1LElyMrUX.sjRo3CKu2eolFth5FCfKqGn7HAN9U7iCk0sp/gGLS'
        const adminUser: User = {
            guid: randomUUID(),
            username: 'admin',
            password: hashedAdminDefaultPassword,
            isInitialPassword: true,
        }
        await db
            .collection<User>(DBCollection.Users)
            .insertOne(adminUser)
    }
    const mongoKeyVal = await db.collection<KeyVal>(DBCollection.KeyVal).findOne({ key: constants.MONGO_KEY_VERIFY_TOKEN })
    if (!mongoKeyVal) {
        const tokenValue = randomBytes(24).toString('hex');
        const verifyToken: KeyVal = {
            key: constants.MONGO_KEY_VERIFY_TOKEN,
            value: tokenValue,
        }
        await db
            .collection<KeyVal>(DBCollection.KeyVal)
            .insertOne(verifyToken)
    }
    console.log('setup completed');
}
