// Define modules
const express = require("express");
const customer_payment = require("../controllers/customer_payment");
const auth = require("../controllers/auth");

// Define route app
const router = express.Router();

router.post("/find/", auth.singleAuth, customer_payment.find);
router.post("/create/", auth.singleAuth, customer_payment.create);
router.post("/cancel/", auth.singleAuth, customer_payment.cancel);

module.exports = router;
