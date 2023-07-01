// Define modules
const moment = require("moment");
const dotenv = require("dotenv");

// Define env
dotenv.config({ path: "./config.env" });

exports.print = (text) => {
    try {
        console.log(moment().format("YYYY-MM-DD HH:mm:ss"), process.env.ENV == "local" ? "\x1b[34m" + text + "\x1b[0m" : text);
    } catch (err) {
        throw err;
    }
}

exports.success = (text) => {
    try {
        console.log(moment().format("YYYY-MM-DD HH:mm:ss"), process.env.ENV == "local" ? "\x1b[92m" + text + "\x1b[0m" : text);
    } catch (err) {
        throw err;
    }
}

exports.error = (err, text) => {
    try {
        if (typeof err == "string") console.error(moment().format("YYYY-MM-DD HH:mm:ss"), process.env.ENV == "local" ? "\x1b[91m" + err + "\x1b[0m" : err);
        else {
            console.error(moment().format("YYYY-MM-DD HH:mm:ss"), process.env.ENV == "local" ? "\x1b[91m" + (text || "Error:") + "\x1b[0m" : (text || "Error:"));
            console.error(err);
        }
    } catch (err) {
        throw err;
    }
}
