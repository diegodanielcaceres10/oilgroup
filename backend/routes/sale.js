// Define modules
const express = require("express");
const sale = require("../controllers/sale");
const auth = require("../controllers/auth");

// Define route app
const router = express.Router();

router.post("/getAll/", auth.singleAuth, sale.getAll);
router.post("/find/", auth.singleAuth, sale.find);
router.post("/create/", auth.singleAuth, sale.create);
router.post("/review/", auth.singleAuth, sale.review);
router.post("/deliver/", auth.singleAuth, sale.deliver);
router.post("/billing/", auth.singleAuth, sale.billing);
router.post("/cancel/", auth.singleAuth, sale.cancel);
router.post("/ticket/", auth.singleAuth, sale.ticket);

module.exports = router;
