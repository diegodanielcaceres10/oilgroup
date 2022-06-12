// Define modules
const express = require("express");
const bodyParser = require("body-parser");
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
const script = require("./routes/script");

// Define app
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
const environment = process.env.ROOT_ENV || "";
app.use(`/${environment}api/oilgroup`, (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,x-access-token");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    next();
});

// Limit requests from same API
const limiter = rateLimit({
    max: 1000,
    windowMs: 5 * 60 * 1000,
});
app.use("/", limiter);

// Define routes
app.use(`/${environment}api/oilgroup/user/`, user);
app.use(`/${environment}api/oilgroup/article/`, article);
app.use(`/${environment}api/oilgroup/brand/`, brand);
app.use(`/${environment}api/oilgroup/category/`, category);
app.use(`/${environment}api/oilgroup/provider/`, provider);
app.use(`/${environment}api/oilgroup/buy/`, buy);
app.use(`/${environment}api/oilgroup/customer/`, customer);
app.use(`/${environment}api/oilgroup/sale/`, sale);
app.use(`/${environment}api/oilgroup/provider_payment/`, provider_payment);
app.use(`/${environment}api/oilgroup/customer_payment/`, customer_payment);
app.use(`/${environment}api/oilgroup/report/`, report);
app.use(`/${environment}api/oilgroup/metric/`, metric);
app.use(`/${environment}api/oilgroup/script/`, script);

module.exports = app;
