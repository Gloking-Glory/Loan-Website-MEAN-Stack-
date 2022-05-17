const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();

const PORT = process.env.PORT;
const URI = process.env.MONGO_URI;

mongoose.connect(URI);
mongoose.PROMISE = global.PROMISE;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cors());
app.options('*', cors());

const userRoutes = require('./routes/userLoanRoutes');
const adminRoutes = require('./routes/adminLoanRoutes');
const verifyToken = require('./middlewares/authMiddleware');

app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/user/getProfile', verifyToken, userRoutes);

app.listen(PORT, ()=> {
    console.log("Server Connected");
})