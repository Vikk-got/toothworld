const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function run() {
    const uri = process.env.VITE_MONGODB_URI || "mongodb://localhost:27017";
    const dbName = process.env.VITE_DB_NAME || "smile_schedule_db";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(dbName);
        console.log("Connected to", dbName);

        const result = await db.collection('blocked_slots').find({
            dentist_id: { $type: 'string' }
        }).toArray();

        console.log(`Found ${result.length} blocked slots with string dentist_id`);

        for (const doc of result) {
            if (doc.dentist_id && doc.dentist_id.length === 24) {
                try {
                    const newId = new ObjectId(doc.dentist_id);
                    await db.collection('blocked_slots').updateOne(
                        { _id: doc._id },
                        { $set: { dentist_id: newId } }
                    );
                    console.log(`Updated ${doc._id} to ObjectId(${doc.dentist_id})`);
                } catch (e) {
                    console.error(`Skipping invalid ID: ${doc.dentist_id}`);
                }
            }
        }
        console.log("Migration complete");
    } catch (e) {
        console.error("Migration failed", e);
    } finally {
        await client.close();
    }
}

run();
