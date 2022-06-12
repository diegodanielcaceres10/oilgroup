// Define modules
const express = require("express");
const category = require("../controllers/category");
const auth = require("../controllers/auth");

// Define route app
const router = express.Router();
router.post("/getAll/", auth.singleAuth, category.getAll);
router.post("/update/", auth.singleAuth, category.update);

module.exports = router;
