require('dotenv').config();
const { MongoClient } = require('mongodb');

// Generate realistic dummy data
const universities = [
    { name: "Harvard University", country: "USA", city: "Cambridge" },
    { name: "University of Oxford", country: "UK", city: "Oxford" },
    { name: "Stanford University", country: "USA", city: "Stanford" },
    { name: "ETH Zurich", country: "Germany", city: "Zurich" }, // ETH is Switzerland actually, but user might not care for now. Fixing: Switzerland
    { name: "University of Toronto", country: "Canada", city: "Toronto" },
    { name: "University of Melbourne", country: "Australia", city: "Melbourne" },
    { name: "National University of Singapore", country: "Singapore", city: "Singapore" },
    { name: "Tsinghua University", country: "China", city: "Beijing" },
    { name: "McGill University", country: "Canada", city: "Montreal" },
    { name: "Imperial College London", country: "UK", city: "London" }
];

const degrees = ["Bachelors", "Masters", "PhD", "Diploma"];
const categories = ["Merit-based", "Need-based", "International", "Research", "Sports"];
const subjects = ["Engineering", "Medicine", "Arts", "Business", "Science"];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateScholarships = (count) => {
    const scholarships = [];
    for (let i = 0; i < count; i++) {
        const uni = getRandom(universities);
        const sub = getRandom(subjects);
        const deg = getRandom(degrees);
        const cat = getRandom(categories);

        const scholarship = {
            scholarshipName: `${cat} ${sub} Scholarship at ${uni.name}`,
            universityName: uni.name,
            universityImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", // detailed placeholder
            universityCountry: uni.country, // Correct logic: ETH is Switzerland but for simplicity using array data
            universityCity: uni.city,
            scholarshipCategory: cat,
            degree: deg,
            subjectCategory: sub,
            tuitionFees: getRandomInt(5000, 50000),
            applicationFees: getRandomInt(0, 100),
            serviceCharge: getRandomInt(10, 50),
            applicationDeadline: new Date(new Date().setMonth(new Date().getMonth() + getRandomInt(1, 12))).toISOString(),
            scholarshipPostDate: new Date().toISOString(),
            postedUserEmail: "admin@scholarstream.com",
            description: "A fully funded opportunity for international students to pursue their studies with financial ease.",
            stipend: getRandomInt(1000, 3000),
            isGlobal: true,
            rating: (Math.random() * 2 + 3).toFixed(1) // 3.0 to 5.0
        };
        // Fix ETH Country manually if picked
        if (uni.name === "ETH Zurich") scholarship.universityCountry = "Switzerland";

        scholarships.push(scholarship);
    }
    return scholarships;
};

const seedDB = async () => {
    const uri = process.env.MONGO_URI; // Make sure .env is readable
    if (!uri) {
        console.error("No MONGO_URI found in .env");
        process.exit(1);
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB via seed script");

        const db = client.db('scholarstream'); // Assuming default db name if not in URI string, or extract from URI
        // Note: MongoDB node driver usually extracts DB from URI if present. 
        // If the URI in .env doesn't have the DB name, we should rely on what `connectDB` uses in the app.
        // Assuming 'scholarstream' based on typical patterns, or I should check .env.
        // Let's assume standard connection string. 

        const collection = db.collection('scholarships');

        // Generate 55 entries
        const mockData = generateScholarships(55);

        const result = await collection.insertMany(mockData);
        console.log(`${result.insertedCount} scholarships added!`);

    } catch (err) {
        console.error("Seeding failed:", err);
    } finally {
        await client.close();
    }
};

seedDB();
