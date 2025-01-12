const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  registerUser,
  loginUser,
  checkUser,
} = require("../controllers/authController");

const router = express.Router();

router.use(authMiddleware);

router.get("/check", checkUser);
router.post("/login", loginUser);
router.post("/signup", registerUser);

module.exports = router;
