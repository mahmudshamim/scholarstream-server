require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

// Import Routes
const userRoutes = require('./routes/userRoutes');
const scholarshipRoutes = require('./routes/scholarshipRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const analyticsReviewRoutes = require('./routes/analyticsReviewRoutes');

const app = express();
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://scholarstream.web.app",
        "https://scholarstream.firebaseapp.com",
        "https://scholarstream-29f72.web.app"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// Mount Routes
app.use(userRoutes);
app.use(scholarshipRoutes);
app.use(applicationRoutes);
app.use(analyticsReviewRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('ScholarStream API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Connect to DB and start server
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
