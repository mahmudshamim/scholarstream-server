
const { MongoClient } = require("mongodb");
require("dotenv").config(); // defaults to .env in cwd
const scholarships = require("../data/scholarships.json");
const users = require("../data/users.json");

const uri = process.env.MONGO_URI;

if (!uri) {
    console.error("MONGO_URI is undefined. Check your .env file.");
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
        console.log("Connected to MongoDB for seeding...");

        const db = client.db(); // Use db from connection string
        const scholarshipCollection = db.collection("scholarships");
        const userCollection = db.collection("users");

        // Clear existing data (Be careful in production!)
        await scholarshipCollection.deleteMany({});
        await userCollection.deleteMany({});
        console.log("Cleared existing collections.");

        // Insert new data
        // Add createdAt/updatedAt dummy if needed, but for now simple insert
        if (scholarships.length > 0) {
            await scholarshipCollection.insertMany(scholarships);
            console.log(`Inserted ${scholarships.length} scholarships.`);
        }

        if (users.length > 0) {
            await userCollection.insertMany(users);
            console.log(`Inserted ${users.length} users.`);
        }

        console.log("Seeding completed successfully! 🌱");

    } catch (error) {
        console.error("Seeding failed:", error);
    } finally {
        await client.close();
    }
}

run();
