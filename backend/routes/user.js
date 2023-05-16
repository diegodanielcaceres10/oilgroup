// Define modules
const express = require("express");
const user = require("../controllers/user");
const auth = require("../controllers/auth");

// Define route app
const router = express.Router();
router.post("/login/", auth.login);

router.post("/getAll/", auth.singleAuth, user.getAll);
router.post("/find/", auth.superAuth, user.find);
router.post("/create/", auth.superAuth, user.create);
router.post("/update/", auth.superAuth, user.update);
router.post("/reset/", auth.superAuth, user.reset);
router.post("/active/", auth.superAuth, user.active);
router.post("/summary/", auth.superAuth, user.summary);
router.post("/pending/", auth.superAuth, user.pending);

router.post("/edit/", auth.singleAuth, user.edit);
router.post("/editPassword/", auth.singleAuth, user.editPassword);

module.exports = router;
