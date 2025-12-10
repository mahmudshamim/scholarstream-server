require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

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

async function verifyUsers() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas");

        const db = client.db('scholarstream');
        const usersCollection = db.collection('users');

        // Fetch all users
        const users = await usersCollection.find({}).toArray();

        console.log(`\n📊 Total users in database: ${users.length}\n`);

        if (users.length > 0) {
            console.log("Users details:");
            users.forEach((user, index) => {
                console.log(`\n${index + 1}. User Details:`);
                console.log(`   Name: ${user.name}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Role: ${user.role}`);
                console.log(`   Photo URL: ${user.photoURL}`);
                console.log(`   ID: ${user._id}`);
            });

            console.log("\n✅ Users are ready for login!");
            console.log("\nYou can now use these credentials:");
            console.log("- Admin: admin@scholarstream.com");
            console.log("- Moderator: moderator@scholarstream.com");
        } else {
            console.log("❌ No users found in database.");
        }

        await client.close();
    } catch (error) {
        console.error("Error verifying users:", error);
        await client.close();
        process.exit(1);
    }
}

verifyUsers();
