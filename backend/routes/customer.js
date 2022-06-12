// Define modules
const express = require("express");
const customer = require("../controllers/customer");
const auth = require("../controllers/auth");

// Define route app
const router = express.Router();

router.post("/getAll/", auth.singleAuth, customer.getAll);
router.post("/find/", auth.singleAuth, customer.find);
router.post("/create/", auth.singleAuth, customer.create);
router.post("/update/", auth.singleAuth, customer.update);
router.post("/active/", auth.singleAuth, customer.active);
router.post("/summary/", auth.singleAuth, customer.summary);

module.exports = router;
