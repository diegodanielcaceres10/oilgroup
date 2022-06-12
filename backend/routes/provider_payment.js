// Define modules
const express = require("express");
const provider_payment = require("../controllers/provider_payment");
const auth = require("../controllers/auth");

// Define route app
const router = express.Router();

router.post("/find/", auth.singleAuth, provider_payment.find);
router.post("/create/", auth.singleAuth, provider_payment.create);
router.post("/cancel/", auth.singleAuth, provider_payment.cancel);

module.exports = router;
