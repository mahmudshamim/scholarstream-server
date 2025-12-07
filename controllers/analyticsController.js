const { getDB } = require('../config/db');

const getUsersStats = async (req, res, next) => {
    try {
        const db = getDB();
        const usersCount = await db.collection('users').countDocuments();
        const scholarshipsCount = await db.collection('scholarships').countDocuments();

        // Calculate total fees (application fees paid)
        // Need to sum applicationFees from APPLICATIONS collection where paymentStatus is 'paid'.
        const payments = await db.collection('applications').aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, totalRevenue: { $sum: '$applicationFees' } } }
        ]).toArray();
        const revenue = payments.length > 0 ? payments[0].totalRevenue : 0;

        // Chart Data: Application counts per Scholarship Category? Or University?
        // Assignment: "A Bar Chart or Pie Chart showing application counts per University or Scholarship Category."
        // Let's do per subjectCategory for variety or scholarshipCategory
        const chartData = await db.collection('applications').aggregate([
            {
                $group: {
                    _id: '$subjectCategory', // or scholarshipCategory
                    count: { $sum: 1 }
                }
            }
        ]).toArray();

        res.send({
            usersCount,
            scholarshipsCount,
            totalRevenue: revenue,
            chartData
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getUsersStats
}
