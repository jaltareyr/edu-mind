const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Middleware to verify JWT
const authMiddleware = async (req, res, next) => {
  // Extract the token from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization header is missing or invalid" });
  }

  publicKey = process.env.PEM_KEY;

  const token = authHeader.split("Bearer ")[1]; // Get the token after 'Bearer'

  try {
    // Verify the token using the PEM public key
    const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });

    // Validate token claims: expiration and not-before
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime || decoded.nbf > currentTime) {
      throw new Error("Token is expired or not yet valid");
    }

    // Validate the azp (authorized party) claim for CSRF protection
    const permittedOrigins = [
      "http://localhost:3000",
      "https://prod-server-edu-mind.onrender.com",
      "https://prod-client-edu-mind-14n51ozo4-yashodhan-jaltates-projects.vercel.app",
      "https://prod-client-edu-mind-14n51ozo4-yashodhan-jaltates-projects.vercel.app",
      "https://prod-client-edu-mind.vercel.app",
    ];
    if (decoded.azp && !permittedOrigins.includes(decoded.azp)) {
      throw new Error("Invalid 'azp' claim");
    }

    const MongoDBUser = await User.findOne({ clerkid: decoded.userid });
    req.user = MongoDBUser;
    req.auth = decoded;

    next(); // Proceed to the next middleware
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

module.exports = authMiddleware;
