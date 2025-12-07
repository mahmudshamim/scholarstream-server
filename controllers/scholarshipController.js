const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

const SCHOLARSHIPS_COLLECTION = 'scholarships';

const addScholarship = async (req, res, next) => {
    try {
        const db = getDB();
        const scholarship = req.body;
        scholarship.scholarshipPostDate = new Date(); // Enforce post date
        const result = await db.collection(SCHOLARSHIPS_COLLECTION).insertOne(scholarship);
        res.send(result);
    } catch (error) {
        next(error);
    }
};

const getAllScholarships = async (req, res, next) => {
    try {
        const db = getDB();
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = {};

        // Search by Scholarship Name, University Name, or Degree
        if (req.query.search) {
            const searchRegex = { $regex: req.query.search, $options: 'i' };
            query.$or = [
                { scholarshipName: searchRegex },
                { universityName: searchRegex },
                { degree: searchRegex }
            ];
            // Note: universityCountry or universityCity searches? assignment says "Search by Scholarship Name, University Name, or Degree"
        }

        // Filter by Country or Category
        // assignment says "Filter ... by Scholarship Category, Subject Category, or Location"
        // Location usually implies country or city.
        if (req.query.scholarshipCategory) {
            query.scholarshipCategory = req.query.scholarshipCategory;
        }
        if (req.query.subjectCategory) {
            query.subjectCategory = req.query.subjectCategory;
        }
        if (req.query.universityCountry) {
            // Exact match or contains? Let's do exact for filter usually, or case insensitive
            query.universityCountry = { $regex: new RegExp(`^${req.query.universityCountry}$`, 'i') };
        }

        // Sort
        const sortOptions = {};
        // assignment: "Sort by Application Fees (Ascending/Descending) or Post Date"
        if (req.query.sortBy) {
            if (req.query.sortBy === 'feesAsc') {
                sortOptions.applicationFees = 1;
            } else if (req.query.sortBy === 'feesDesc') {
                sortOptions.applicationFees = -1;
            } else if (req.query.sortBy === 'dateDesc') {
                sortOptions.scholarshipPostDate = -1;
            } else if (req.query.sortBy === 'dateAsc') {
                sortOptions.scholarshipPostDate = 1;
            }
        } else {
            // Default sort by newest
            sortOptions.scholarshipPostDate = -1;
        }

        const scholarships = await db.collection(SCHOLARSHIPS_COLLECTION)
            .find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .toArray();

        const total = await db.collection(SCHOLARSHIPS_COLLECTION).countDocuments(query);

        res.send({
            scholarships,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalItems: total
        });
    } catch (error) {
        next(error);
    }
};

const getScholarshipById = async (req, res, next) => {
    try {
        const db = getDB();
        const id = req.params.id;
        if (!ObjectId.isValid(id)) return res.status(400).send({ message: 'Invalid ID' });

        const scholarship = await db.collection(SCHOLARSHIPS_COLLECTION).findOne({ _id: new ObjectId(id) });
        if (!scholarship) return res.status(404).send({ message: 'Scholarship not found' });

        res.send(scholarship);
    } catch (error) {
        next(error);
    }
}

const updateScholarship = async (req, res, next) => {
    try {
        const db = getDB();
        const id = req.params.id;
        const updateData = req.body;
        delete updateData._id; // prevent updating _id

        const filter = { _id: new ObjectId(id) };
        const result = await db.collection(SCHOLARSHIPS_COLLECTION).updateOne(filter, { $set: updateData });
        res.send(result);
    } catch (error) {
        next(error);
    }
};

const deleteScholarship = async (req, res, next) => {
    try {
        const db = getDB();
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await db.collection(SCHOLARSHIPS_COLLECTION).deleteOne(query);
        res.send(result);
    } catch (error) {
        next(error);
    }
};

// Top Scholarships (Dynamic) for Home Page
// e.g. lowest application fees or most recent
const getTopScholarships = async (req, res, next) => {
    try {
        const db = getDB();
        const scholarships = await db.collection(SCHOLARSHIPS_COLLECTION)
            .find({})
            .sort({ applicationFees: 1, scholarshipPostDate: -1 })
            .limit(6)
            .toArray();
        res.send(scholarships);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    addScholarship,
    getAllScholarships,
    getScholarshipById,
    updateScholarship,
    deleteScholarship,
    getTopScholarships
};
