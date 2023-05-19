// Define modules
const dotenv = require("dotenv");
const storage = require("./modules/storage");
const app = require("./app");
const moment = require("moment");

// Define credentials
dotenv.config({ path: "./config.env" });

// Define connection test
storage.test();

// Define listeners and ports
const portapi = process.env.PORT || 5000;
const pathapi = `${process.env.ROOT}/api`;
app.listen(portapi, () => console.log(moment().format(), process.env.ENV == "Local" ? `API listening on http://localhost:${portapi}` : `API listening on ${pathapi}`));