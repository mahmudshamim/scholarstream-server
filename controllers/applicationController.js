const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

const APPLICATIONS_COLLECTION = 'applications';

const submitApplication = async (req, res, next) => {
    try {
        const db = getDB();
        const application = req.body;
        application.applicationDate = new Date(); // Enforce date
        // applicationStatus default is pending if not sent, but frontend usually sends it or we default here
        if (!application.applicationStatus) application.applicationStatus = 'pending';

        const result = await db.collection(APPLICATIONS_COLLECTION).insertOne(application);
        res.send(result);
    } catch (error) {
        next(error);
    }
};

const getApplicationsByEmail = async (req, res, next) => {
    try {
        const db = getDB();
        const email = req.params.email;
        if (req.decoded.email !== email) {
            return res.status(403).send({ message: 'forbidden access' });
        }
        const query = { userEmail: email };
        const result = await db.collection(APPLICATIONS_COLLECTION).find(query).toArray();
        res.send(result);
    } catch (error) {
        next(error);
    }
};

// For moderators/admins
const getAllApplications = async (req, res, next) => {
    try {
        const db = getDB();
        const result = await db.collection(APPLICATIONS_COLLECTION).find().toArray();
        res.send(result);
    } catch (error) {
        next(error);
    }
};

const getApplicationById = async (req, res, next) => {
    try {
        const db = getDB();
        const id = req.params.id;
        const result = await db.collection(APPLICATIONS_COLLECTION).findOne({ _id: new ObjectId(id) });
        res.send(result);
    } catch (error) {
        next(error);
    }
}

const updateApplicationStatus = async (req, res, next) => {
    try {
        const db = getDB();
        const id = req.params.id;
        const { status } = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
            $set: {
                applicationStatus: status
            }
        };
        const result = await db.collection(APPLICATIONS_COLLECTION).updateOne(filter, updateDoc);
        res.send(result);
    } catch (error) {
        next(error);
    }
};

const addFeedback = async (req, res, next) => {
    try {
        const db = getDB();
        const id = req.params.id;
        const { feedback } = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
            $set: {
                feedback: feedback
            }
        };
        const result = await db.collection(APPLICATIONS_COLLECTION).updateOne(filter, updateDoc);
        res.send(result);
    } catch (error) {
        next(error);
    }
};

// Student can delete pending application (or maybe cancel it)
const deleteApplication = async (req, res, next) => {
    try {
        const db = getDB();
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await db.collection(APPLICATIONS_COLLECTION).deleteOne(query);
        res.send(result);
    } catch (error) {
        next(error);
    }
};

// Edit application (only if pending)
const updateApplication = async (req, res, next) => {
    try {
        const db = getDB();
        const id = req.params.id;
        const updateData = req.body;
        delete updateData._id;
        const filter = { _id: new ObjectId(id) };
        const result = await db.collection(APPLICATIONS_COLLECTION).updateOne(filter, { $set: updateData });
        res.send(result);
    } catch (error) {
        next(error);
    }
}


module.exports = {
    submitApplication,
    getApplicationsByEmail,
    getAllApplications,
    getApplicationById,
    updateApplicationStatus,
    addFeedback,
    deleteApplication,
    updateApplication
};
