// Define modules
const express = require("express");
const provider = require("../controllers/provider");
const auth = require("../controllers/auth");

// Define route app
const router = express.Router();

router.post("/getAll/", auth.singleAuth, provider.getAll);
router.post("/find/", auth.singleAuth, provider.find);
router.post("/create/", auth.singleAuth, provider.create);
router.post("/update/", auth.singleAuth, provider.update);
router.post("/active/", auth.singleAuth, provider.active);

module.exports = router;
