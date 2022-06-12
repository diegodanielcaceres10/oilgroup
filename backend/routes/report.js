// Define modules
const express = require("express");
const report = require("../controllers/report");
const auth = require("../controllers/auth");

// Define route app
const router = express.Router();
router.post("/getPayments/", auth.singleAuth, report.getPayments);
router.post("/getActivity/", auth.singleAuth, report.getActivity);
router.post("/exportPayments/", auth.singleAuth, report.exportPayments);
router.post("/exportActivities/", auth.singleAuth, report.exportActivities);

module.exports = router;
