// Define modules
const express = require("express");
const script = require("../controllers/script");
const auth = require("../controllers/auth");

// Define route app
const router = express.Router();

router.post("/updates/", auth.superAuth, script.updates);

module.exports = router