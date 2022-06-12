// Define modules
const express = require("express");
const article = require("../controllers/article");
const auth = require("../controllers/auth");

// Define route app
const router = express.Router();

router.post("/getAll/", auth.singleAuth, article.getAll);
router.post("/getPrices/", auth.singleAuth, article.getPrices);
router.post("/getAllPrices/", auth.singleAuth, article.getAllPrices);
router.post("/find/", auth.singleAuth, article.find);
router.post("/create/", auth.singleAuth, article.create);
router.post("/update/", auth.singleAuth, article.update);
router.post("/active/", auth.singleAuth, article.active);
router.post("/addMeasure/", auth.singleAuth, article.addMeasure);
router.post("/updateMeasure/", auth.singleAuth, article.updateMeasure);
router.post("/deleteMeasure/", auth.singleAuth, article.deleteMeasure);
router.post("/updatePrices/", auth.singleAuth, article.updatePrices);
router.post("/updateStock/", auth.singleAuth, article.updateStock);
router.post("/exportPrices/", auth.singleAuth, article.exportPrices);
router.post("/exportStock/", auth.singleAuth, article.exportStock);

module.exports = router