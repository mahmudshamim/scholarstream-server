const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

const REVIEWS_COLLECTION = 'reviews';

const addReview = async (req, res, next) => {
    try {
        const db = getDB();
        const review = req.body;
        review.reviewDate = new Date();
        // Validate that user has applied and status is completed is optional but good practice.
        // For now assuming frontend restricts.
        const result = await db.collection(REVIEWS_COLLECTION).insertOne(review);
        res.send(result);
    } catch (error) {
        next(error);
    }
};

const getReviewsByScholarshipId = async (req, res, next) => {
    try {
        const db = getDB();
        const id = req.params.scholarshipId;
        const result = await db.collection(REVIEWS_COLLECTION).find({ scholarshipId: id }).toArray();
        res.send(result);
    } catch (error) {
        next(error);
    }
};

// Student's own reviews
const getReviewsByEmail = async (req, res, next) => {
    try {
        const db = getDB();
        const email = req.params.email;
        if (req.decoded.email !== email) {
            return res.status(403).send({ message: 'forbidden access' });
        }
        const result = await db.collection(REVIEWS_COLLECTION).find({ userEmail: email }).toArray();
        res.send(result);
    } catch (error) {
        next(error);
    }
}

const getAllReviews = async (req, res, next) => {
    try {
        const db = getDB();
        // For moderator
        const result = await db.collection(REVIEWS_COLLECTION).find().toArray();
        res.send(result);
    } catch (error) {
        next(error);
    }
}


const deleteReview = async (req, res, next) => {
    try {
        const db = getDB();
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await db.collection(REVIEWS_COLLECTION).deleteOne(query);
        res.send(result);
    } catch (error) {
        next(error);
    }
};

const updateReview = async (req, res, next) => {
    try {
        const db = getDB();
        const id = req.params.id;
        const updateData = req.body;
        delete updateData._id;
        const filter = { _id: new ObjectId(id) };
        const result = await db.collection(REVIEWS_COLLECTION).updateOne(filter, { $set: updateData });
        res.send(result);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    addReview,
    getReviewsByScholarshipId,
    getReviewsByEmail,
    getAllReviews,
    deleteReview,
    updateReview
};
