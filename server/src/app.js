const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Added for cookie parsing
const mainRouter = require('./routes');
require('dotenv').config();
require('./config/database');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
}));
app.use(cookieParser()); // Parse cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', mainRouter);

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;