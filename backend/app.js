// Define modules
const express = require("express");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");

// Define env
dotenv.config({ path: "./config.env" });

const user = require("./routes/user");
const article = require("./routes/article");
const brand = require("./routes/brand");
const category = require("./routes/category");
const provider = require("./routes/provider");
const buy = require("./routes/buy");
const customer = require("./routes/customer");
const sale = require("./routes/sale");
const provider_payment = require("./routes/provider_payment");
const customer_payment = require("./routes/customer_payment");
const metric = require("./routes/metric");
const report = require("./routes/report");
const license = require("./routes/license");
const script = require("./routes/script");

// Define app
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
const environment = `${process.env.ENV}/api`;
app.use(`${environment}`, (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST");
    next();
});

// Limit requests from same API
const limiter = rateLimit({
    max: 10000,
    windowMs: 60 * 60 * 1000,
});
app.use("/", limiter);

// Define routes
app.use(`${environment}/user/`, user);
app.use(`${environment}/article/`, article);
app.use(`${environment}/brand/`, brand);
app.use(`${environment}/category/`, category);
app.use(`${environment}/provider/`, provider);
app.use(`${environment}/buy/`, buy);
app.use(`${environment}/customer/`, customer);
app.use(`${environment}/sale/`, sale);
app.use(`${environment}/provider_payment/`, provider_payment);
app.use(`${environment}/customer_payment/`, customer_payment);
app.use(`${environment}/report/`, report);
app.use(`${environment}/metric/`, metric);
app.use(`${environment}/license/`, license);
app.use(`${environment}/script/`, script);

module.exports = app;
