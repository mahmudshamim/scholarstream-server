
const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI;

if (!uri) {
    console.error("MONGO_URI is undefined.");
    process.exit(1);
}

const client = new MongoClient(uri, {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB...");
        const db = client.db('scholarstream'); // Explicitly selecting the app DB
        const users = db.collection("users");

        const adminEmail = "admin@scholarstream.com";

        // Check before
        const before = await users.findOne({ email: adminEmail });
        console.log("Before update:", before);

        // Force Update
        const result = await users.updateOne(
            { email: adminEmail },
            { $set: { role: "admin" } } // ensuring lowercase 'admin'
        );
        console.log("Update result:", result.modifiedCount);

        // Check after
        const after = await users.findOne({ email: adminEmail });
        console.log("After update:", after);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await client.close();
    }
}

run();
