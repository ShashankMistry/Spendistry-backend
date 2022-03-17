require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {console.log('Connected to MongoDB')});


app.use(express.json());
app.use(cors());
// app.use(cors({
//   methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
// origin: '*'
// }));
// app.options('*', cors());
// app.use(express.urlencoded({ extended: true }));

const userRouter = require('./routes/user');
app.use('/user', userRouter);

const vendorRouter = require('./routes/vendor');
app.use('/vendor', vendorRouter);

const invoiceRouter = require('./routes/invoice');
app.use('/invoice', invoiceRouter);

const reportRouter = require('./routes/report');
app.use('/report', reportRouter);

const returnRouter = require('./routes/return');
app.use('/return', returnRouter);

const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

const authBusinessRouter = require('./routes/authBusiness');
app.use('/authBusiness', authBusinessRouter);

const itemsPricesRouter = require('./routes/ItemPricesList');
app.use('/itemsPrices', itemsPricesRouter);

app.use('/vendorProfile', express.static('upload/images'));

const mvd = require('./routes/mvd');
app.use('/mvd', mvd);

const otpRouter = require('./routes/otp');
app.use('/otp', otpRouter);

app.listen (PORT, () => {
  console.log('listening on port', PORT);
}



);

