require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');
const path = require('path');

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

async function seedUsers() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log("Connected to MongoDB Atlas");

        const db = client.db('scholarstream');
        const usersCollection = db.collection('users');

        // Read users from JSON file
        const usersFilePath = path.join(__dirname, 'data', 'users.json');
        const usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));

        // Check if users already exist
        const existingUsersCount = await usersCollection.countDocuments();

        if (existingUsersCount > 0) {
            console.log(`Found ${existingUsersCount} existing users in the database.`);
            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });

            readline.question('Do you want to clear existing users and re-import? (yes/no): ', async (answer) => {
                if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
                    await usersCollection.deleteMany({});
                    console.log("Cleared existing users.");
                    await insertUsers(usersCollection, usersData);
                } else {
                    console.log("Skipping import. Existing users retained.");
                }
                readline.close();
                await client.close();
            });
        } else {
            await insertUsers(usersCollection, usersData);
            await client.close();
        }

    } catch (error) {
        console.error("Error seeding users:", error);
        await client.close();
        process.exit(1);
    }
}

async function insertUsers(collection, users) {
    try {
        // Insert users into MongoDB
        const result = await collection.insertMany(users);
        console.log(` Successfully inserted ${result.insertedCount} users into MongoDB`);

        // Display inserted users
        console.log("\nInserted users:");
        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
        });

        console.log("\n🎉 Users are now ready for login!");
    } catch (error) {
        console.error("Error inserting users:", error);
        throw error;
    }
}

// Run the seed function
seedUsers();
