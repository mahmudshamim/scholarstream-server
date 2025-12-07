const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const USERS_COLLECTION = 'users';

// Create User (or update on Social Login) & Issue Token
const createOrUpdateUser = async (req, res, next) => {
    try {
        const db = getDB();
        const user = req.body;
        const query = { email: user.email };

        // Check if user exists
        const existingUser = await db.collection(USERS_COLLECTION).findOne(query);

        if (existingUser) {
            // Just return token for existing user
            // Optionally update user data if needed, but for now we just return token
            return res.send({ message: 'user already exists', insertedId: null });
        }

        // Default role is 'student' if not specified (though front-end handles default mostly, backend should enforce)
        // The instructions say "Default Role: ... Student".
        // We'll trust the body but ensure role exists, else default to student.
        // Actually, safest is to force it here for new users unless admin overrides, 
        // but for social login, it's safer to just set it to student if missing.
        if (!user.role) {
            user.role = 'student';
        }

        const result = await db.collection(USERS_COLLECTION).insertOne(user);
        res.send(result);
    } catch (error) {
        next(error);
    }
};

const createToken = async (req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.send({ token });
}


const getAllUsers = async (req, res, next) => {
    try {
        const db = getDB();
        // Filter by role if query param exists (for admin dashboard filtering)
        const filter = {};
        if (req.query.role) {
            filter.role = req.query.role;
        }
        const users = await db.collection(USERS_COLLECTION).find(filter).toArray();
        res.send(users);
    } catch (error) {
        next(error);
    }
};

const getUserByEmail = async (req, res, next) => {
    try {
        const db = getDB();
        const email = req.params.email;
        if (email !== req.decoded.email) {
            return res.status(403).send({ message: 'forbidden access' });
        }
        const query = { email: email };
        const user = await db.collection(USERS_COLLECTION).findOne(query);
        let isAdmin = false;
        let isModerator = false;
        if (user) {
            isAdmin = user?.role === 'admin';
            isModerator = user?.role === 'moderator';
        }
        res.send({ ...user, admin: isAdmin, moderator: isModerator });
    } catch (error) {
        next(error);
    }
}

// Check admin status (Optimization for frontend hooks)
const getAdminStatus = async (req, res, next) => {
    try {
        const db = getDB();
        const email = req.params.email;
        if (email !== req.decoded.email) {
            return res.status(403).send({ message: 'forbidden access' });
        }
        const query = { email: email };
        const user = await db.collection(USERS_COLLECTION).findOne(query);
        let isAdmin = false;
        if (user) {
            isAdmin = user?.role === 'admin';
        }
        res.send({ admin: isAdmin });
    } catch (error) {
        next(error);
    }

}
const getModeratorStatus = async (req, res, next) => {
    try {
        const db = getDB();
        const email = req.params.email;
        if (email !== req.decoded.email) {
            return res.status(403).send({ message: 'forbidden access' });
        }
        const query = { email: email };
        const user = await db.collection(USERS_COLLECTION).findOne(query);
        let isModerator = false;
        if (user) {
            isModerator = user?.role === 'moderator';
        }
        res.send({ moderator: isModerator });
    } catch (error) {
        next(error);
    }
}


const updateUserRole = async (req, res, next) => {
    try {
        const db = getDB();
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updatedDoc = {
            $set: {
                role: req.body.role // 'admin', 'moderator', 'student'
            }
        };
        const result = await db.collection(USERS_COLLECTION).updateOne(filter, updatedDoc);
        res.send(result);
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const db = getDB();
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await db.collection(USERS_COLLECTION).deleteOne(query);
        res.send(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrUpdateUser,
    createToken,
    getAllUsers,
    getUserByEmail,
    getAdminStatus,
    getModeratorStatus,
    updateUserRole,
    deleteUser
};
