const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res, next) => {
    try {
        const { price } = req.body;
        if (!price) {
            return res.status(400).send({ message: 'Price is required' });
        }
        const amount = parseInt(price * 100); // Stripe expects integer cents

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            payment_method_types: ["card"]
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPaymentIntent
};
