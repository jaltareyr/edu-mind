const express = require("express");
const mainRouter = require("./routes");
const cors = require("cors");
const { errorHandler } = require("./middlewares/errorHandler");

require("./config/database");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://prod-client-edu-mind-14n51ozo4-yashodhan-jaltates-projects.vercel.app",
      "https://prod-client-edu-mind-14n51ozo4-yashodhan-jaltates-projects.vercel.app",
      "https://prod-client-edu-mind.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", mainRouter);

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
