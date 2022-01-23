require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {console.log('Connected to MongoDB')});

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

const userRouter = require('./routes/user');
app.use('/user', userRouter);

const vendorRouter = require('./routes/vendor');
app.use('/vendor', vendorRouter);

const invoiceRouter = require('./routes/invoice');
app.use('/invoice', invoiceRouter);

const reportRouter = require('./routes/report');
app.use('/report', reportRouter);

app.listen (PORT, () => {
  console.log('listening on port', PORT);
}
);

