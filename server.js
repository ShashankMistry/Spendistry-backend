require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

// define port
const PORT = process.env.PORT || 3000;

// connect to mongoDB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {console.log('Connected to MongoDB')});


// Middleware
app.use(express.json());
app.use(cors());


// Routes

const userRouter = require('./routes/user');
app.use('/user', userRouter); // user details

const vendorRouter = require('./routes/vendor');
app.use('/vendor', vendorRouter); // vendor details

const invoiceRouter = require('./routes/invoice');
app.use('/invoice', invoiceRouter); // all successful invoices 

const reportRouter = require('./routes/report');
app.use('/report', reportRouter); // reported invoices

const returnRouter = require('./routes/return');
app.use('/return', returnRouter); // returned invoices

const authRouter = require('./routes/auth');
app.use('/auth', authRouter); // user login

const authBusinessRouter = require('./routes/authBusiness');
app.use('/authBusiness', authBusinessRouter); // business login

const itemsPricesRouter = require('./routes/ItemPricesList');
app.use('/itemsPrices', itemsPricesRouter);

app.use('/vendorProfile', express.static('upload/images')); // vendor profile image

app.use('/userProfile', express.static('upload/userImages')); // user profile image

const mvd = require('./routes/mvd');
app.use('/mvd', mvd); // mobile vendor dashboard

const otpRouter = require('./routes/otp');
app.use('/otp', otpRouter); // otp verification

const loggedInVerifyRouter = require('./routes/loggedInVerify');
app.use('/loggedInVerify', loggedInVerifyRouter); // verify user is logged in by jwt token

const pdf = require('./routes/pdf');
app.use('/pdf', pdf); // generate pdf

const mud = require('./routes/mud');
app.use('/mud', mud); // mobile user dashboard

// Start server
app.listen (PORT, () => {
  console.log('listening on port', PORT);
}



);

