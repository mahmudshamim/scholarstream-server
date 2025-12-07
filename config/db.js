const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;

if (!uri) {
    console.error("Error: MONGO_URI environment variable is not defined.");
    process.exit(1);
}

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let db;

async function connectDB() {
    try {
        await client.connect();
        // Verify connection
        await client.db("admin").command({ ping: 1 });
        // Select the database. If the URI has the db name, client.db() uses it.
        // Otherwise it uses 'test' by default or we can pass a name.
        // For now we assume the URI includes the DB name or we use the default.
        db = client.db('scholarstream');
        console.log("Connected to MongoDB Atlas successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}

function getDB() {
    if (!db) {
        throw new Error("Database not initialized. Call connectDB first.");
    }
    return db;
}

module.exports = { connectDB, getDB, client };
