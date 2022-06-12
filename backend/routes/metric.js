// Define modules
const express = require("express");
const metric = require("../controllers/metric");
const auth = require("../controllers/auth");

// Define route app
const router = express.Router();
router.post("/getAll/", auth.singleAuth, metric.getAll);
router.post("/getAllExtend/", auth.singleAuth, metric.getAllExtend);

module.exports = router;
