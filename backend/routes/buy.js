// Define modules
const express = require("express");
const buy = require("../controllers/buy");
const auth = require("../controllers/auth");

// Define route app
const router = express.Router();

router.post("/find/", auth.singleAuth, buy.find);
router.post("/create/", auth.singleAuth, buy.create);
router.post("/cancel/", auth.singleAuth, buy.cancel);

module.exports = router;
