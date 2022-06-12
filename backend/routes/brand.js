// Define modules
const express = require("express");
const brand = require("../controllers/brand");
const auth = require("../controllers/auth");

// Define route app
const router = express.Router();
router.post("/getAll/", auth.singleAuth, brand.getAll);
router.post("/update/", auth.singleAuth, brand.update);

module.exports = router;
