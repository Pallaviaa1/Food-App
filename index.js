require('dotenv').config();
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
require('./config/database');
const path = require('path');

/* STRIPE_SECRET_KEY */
// var STRIPE_SECRET_KEY="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"
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

var PORT = process.env.PORT || 6000

const visitorRoute = require('./routes/visitorRoute.js');
const hostRoute = require('./routes/hostRoute');
const adminRoute = require('./routes/adminRoute');
const commonRoute = require('./routes/commonRoute');


var cors = require('cors');
const { log } = require('util');
app.use(cors({
  origin: '*'
}));

app.use(bodyparser.json());
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/api', visitorRoute);
app.use('/api', hostRoute);
app.use('/api', adminRoute);
app.use('/api', commonRoute);


// stripe payment with 3D secure

app.get('/pay', (req, res) => {
  const { email, amount, user_id, host_id, hosting_id, booking_date, booking_time, adult, child, pets, document_name, promo_code, discount_amount, paymentId, payment_method } = req.query;
  // console.log(booking_details);
  if (!email || !amount || !user_id) {
    return res.status(400).send({
      success: false,
      message: "Please provide email or amount or user_id"
    })
  }

  // console.log(booking_details);
  const numericAmount = parseFloat(amount);
  const data = {
    email: email,
    amount: numericAmount,
    user_id: user_id,
    host_id: host_id,
    hosting_id: hosting_id,
    booking_date: booking_date,
    booking_time: booking_time,
    adult: adult,
    child: child,
    pets: pets,
    document_name: document_name,
    amount: amount,
    promo_code: promo_code,
    discount_amount: discount_amount,
    paymentId: paymentId,
    payment_method: payment_method
  };
  stripe.paymentIntents.create({
    amount: numericAmount * 100,
    currency: 'USD',
    metadata: { integration_check: 'accept_a_payment' }
  }).then(paymentIntent => {
    data.client_secret = paymentIntent.client_secret;
    res.render('stripe', { data });
  });
});

app.get('/success', (req, res) => {
  const paymentIntent = req.query.paymentIntent;
  // console.log(paymentIntent); // Add this line for debugging
  res.render('success', { paymentIntent });
});

app.get('/failure', (req, res) => {
  const errorMessage = req.query.message || 'Payment failed for an unknown reason.';
  res.render('failure', { errorMessage });
});

app.get('/wallet-pay', (req, res) => {
  const { email, amount, user_id, payment_method } = req.query;
  // console.log(booking_details);
  if (!email || !amount || !user_id || !payment_method) {
    return res.status(400).send({
      success: false,
      message: "Please provide email or amount or user_id or payment_method"
    })
  }

  // console.log(booking_details);
  const numericAmount = parseFloat(amount);
  const data = {
    email: email,
    amount: numericAmount,
    user_id: user_id,
    payment_method: payment_method
  };
  stripe.paymentIntents.create({
    amount: numericAmount * 100,
    currency: 'USD',
    metadata: { integration_check: 'accept_a_payment' }
  }).then(paymentIntent => {
    data.client_secret = paymentIntent.client_secret;
    res.render('wallet_stripe', { data });
  });
});

app.get('/wallet-success', (req, res) => {
  const paymentIntent = req.query.paymentIntent;
  // console.log(paymentIntent); // Add this line for debugging
  res.render('wallet_success', { paymentIntent });
});

app.get('/wallet-failure', (req, res) => {
  const errorMessage = req.query.message || 'Payment failed for an unknown reason.';
  res.render('wallet_failure', { errorMessage });
});

/* app.post('/process-payment', async (req, res) => {
  try {
    const { token, amount, currency } = req.body; // Token, amount, currency received from frontend

    // Process payment using Stripe
    const charge = await stripe.charges.create({
      amount: amount,
      currency: currency,
      source: token, // Payment token from frontend
      description: 'Payment description' // Optional description
    });

    // Handle payment result
    if (charge.status === 'succeeded') {
      res.status(200).json({ success: true, message: 'Payment successful' });
    } else {
      res.status(400).json({ success: false, message: 'Payment failed', error: charge.failure_message });
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}); 
 */

app.listen(PORT, (err) => {
  if (err) throw err;
  else {
    console.log('server listing on port:', PORT);
  }
})