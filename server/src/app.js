const express = require('express');
const mainRouter = require('./routes');
const cors = require('cors');
const { errorHandler } = require('./middlewares/errorHandler');

require('./config/database');

const app = express();

// Enable CORS for specific origin
app.use(
    cors({
      origin: 'http://localhost:3000', // Allow requests from your frontend
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Allow specific HTTP methods
      credentials: true, // Allow cookies and authentication headers
    })
  );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', mainRouter);

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;