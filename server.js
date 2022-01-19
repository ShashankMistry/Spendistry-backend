require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {console.log('Connected to MongoDB')});

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

const userRouter = require('./routes/user');
app.use('/user', userRouter);

app.listen (3000, () => {
  console.log('listening on port 3000');
}
);

