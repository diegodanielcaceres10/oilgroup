// Define modules
const express = require("express");
const auth = require("../controllers/auth");

// Define route app
const router = express.Router();
router.post("/login/", auth.login);
router.post("/token/", auth.token);

module.exports = router;
