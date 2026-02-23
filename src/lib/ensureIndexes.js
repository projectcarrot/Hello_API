import { getClientPromise } from "@/lib/mongodb";
export async function ensureIndexes() {

 const DB_NAME = process.env.DB_NAME;
 const client = await getClientPromise();
 const db = client.db(DB_NAME);
 const userCollection = db.collection("user");
 await userCollection.createIndex({ username: 1 }, { unique: true });
 await userCollection.createIndex({ email: 1 }, { unique: true });
} 