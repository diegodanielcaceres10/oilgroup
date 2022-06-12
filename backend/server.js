// Define modules
const dotenv = require("dotenv");
const storage = require("./modules/storage");
const app = require("./app");
const moment = require("moment");

// Define credentials
dotenv.config({ path: "./config.env" });

// Define connection test
storage.test();

// Define port
const port = process.env.PORT || 7000;
app.listen(port, () => console.log(moment().format(), `API listening on port ${port}`));
