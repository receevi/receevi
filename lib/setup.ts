import { randomUUID } from 'crypto';
import { DBCollection } from '../enums/DBCollections';
import clientPromise from './mongodb';
import { User } from '../types/user.db';

export default async function setupApplication() {
    const client = await clientPromise;
    const db = client.db();
    const adminUser = await db.collection(DBCollection.Users).findOne({ username: 'admin' })
    const hashedAdminDefaultPassword = '$2b$10$YO1LElyMrUX.sjRo3CKu2eolFth5FCfKqGn7HAN9U7iCk0sp/gGLS'
    if (!adminUser) {
        const adminUser: User = {
            guid: randomUUID(),
            username: 'admin',
            password: hashedAdminDefaultPassword,
            isInitialPassword: true,
        }
        await db
            .collection(DBCollection.Users)
            .insertOne(adminUser)
    }
    console.log('setup completed');
}
