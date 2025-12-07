const { MongoClient } = require('mongodb');
require('dotenv').config();

const descriptions = [
    "A fully funded opportunity for international students to pursue their studies with financial ease and academic excellence.",
    "An excellent opportunity for students pursuing higher education with comprehensive support and mentorship.",
    "This prestigious scholarship provides financial assistance and academic support to deserving students worldwide.",
    "A competitive scholarship program designed to support talented students in achieving their academic goals.",
    "Join a community of scholars and receive comprehensive funding for your educational journey.",
    "This scholarship offers full tuition coverage and living stipends for exceptional students.",
    "A merit-based scholarship supporting students who demonstrate academic excellence and leadership potential.",
    "Financial support for students committed to making a positive impact in their field of study.",
    "An opportunity to study at a world-class institution with full financial backing.",
    "This program provides comprehensive support including tuition, accommodation, and research funding."
];

const eligibilityOptions = [
    ["International students", "Minimum GPA 3.5", "English proficiency required"],
    ["Undergraduate or graduate students", "Strong academic record", "Leadership experience"],
    ["International students", "High GPA", "Research experience preferred"],
    ["Full-time students", "Academic excellence", "Community involvement"],
    ["Graduate students", "Research proposal required", "Minimum GPA 3.0"],
    ["International applicants", "Bachelor's degree completed", "English language test scores"],
    ["Undergraduate students", "Financial need demonstrated", "Academic merit"],
    ["PhD candidates", "Research experience", "Publications preferred"],
    ["Master's students", "Relevant work experience", "Strong recommendations"],
    ["All nationalities welcome", "Academic achievement", "Extracurricular activities"]
];

const documentsOptions = [
    ["Transcripts", "CV/Resume", "Personal Statement", "Letters of Recommendation"],
    ["Academic transcripts", "Proof of English proficiency", "Research proposal", "CV"],
    ["Transcripts", "Statement of Purpose", "Two recommendation letters", "Passport copy"],
    ["Academic records", "CV", "Motivation letter", "Language certificate"],
    ["Official transcripts", "Resume", "Essay", "Reference letters"],
    ["Degree certificates", "CV", "Personal statement", "IELTS/TOEFL scores"],
    ["Academic transcripts", "Portfolio (if applicable)", "Recommendation letters", "ID proof"],
    ["Transcripts", "Research proposal", "CV", "Two references"],
    ["Academic records", "Statement of purpose", "Letters of recommendation", "Passport"],
    ["Transcripts", "CV", "Cover letter", "English proficiency proof"]
];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const updateScholarships = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error("No MONGO_URI found in .env");
        process.exit(1);
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db('scholarstream');
        const collection = db.collection('scholarships');

        // Get all scholarships
        const scholarships = await collection.find({}).toArray();
        console.log(`Found ${scholarships.length} scholarships to update`);

        let updateCount = 0;

        // Update each scholarship with missing fields
        for (const scholarship of scholarships) {
            const updateDoc = {};

            // Add description if missing
            if (!scholarship.description) {
                updateDoc.description = getRandom(descriptions);
            }

            // Add eligibility if missing
            if (!scholarship.eligibility) {
                updateDoc.eligibility = getRandom(eligibilityOptions);
            }

            // Add documents if missing
            if (!scholarship.documents) {
                updateDoc.documents = getRandom(documentsOptions);
            }

            // Only update if there are fields to add
            if (Object.keys(updateDoc).length > 0) {
                await collection.updateOne(
                    { _id: scholarship._id },
                    { $set: updateDoc }
                );
                updateCount++;
            }
        }

        console.log(`Successfully updated ${updateCount} scholarships with missing fields!`);

    } catch (err) {
        console.error("Update failed:", err);
    } finally {
        await client.close();
    }
};

updateScholarships();
