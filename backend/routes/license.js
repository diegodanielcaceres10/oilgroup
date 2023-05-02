// Define modules
const express = require("express");
const license = require("../controllers/license");
const auth = require("../controllers/auth");

// Define route app
const router = express.Router();
router.post("/getAll/", auth.singleAuth, license.getAll);
router.post("/price/", auth.singleAuth, license.price);
router.post("/remove/", auth.singleAuth, license.remove);
router.post("/upload/", auth.singleAuth, license.upload);

module.exports = router;
