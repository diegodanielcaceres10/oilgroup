// Define modules
const express = require("express");
const license = require("../controllers/license");
const auth = require("../controllers/auth");

// Define route app
const router = express.Router();
router.post("/getAll/", auth.singleAuth, license.getAll);

module.exports = router;
