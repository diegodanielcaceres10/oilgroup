// Define modules
const storage = require("../modules/storage");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const moment = require("moment");

// Define credentials
dotenv.config({ path: "./config.env" });

exports.login = async (req, res) => {
    try {
        let session = "API: user/login |";

        // Verify parameters
        if (typeof req.body.username != "string" || req.body.username == "" || typeof req.body.pass != "string" || req.body.pass == "") {
            console.error(moment().format(), "login parameters error");
            return res.status(200).send({ status: "login parameters error" });
        };

        // Define user
        let user = req.body;
        user.username = user.username.replace(/'/gi, "").toLowerCase();
        user.pass = user.pass.replace(/'/gi, "");
        user = await storage.get_row(req, res, session, "select username,lastname,firstname,phone,email,role,type from user where username='" + user.username + "'and pass=sha1('" + user.pass + "')and active");

        // Define user
        const token = jwt.sign({ user: user }, process.env.SECRETJWT);
        user.token = token;

        // Define response
        console.log(moment().format(), session, user.username);
        return res.status(200).send({ status: "success", data: user });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.singleAuth = async (req, res, next) => {
    try {

        // Verify authorization
        if (!req.headers || !req.headers.authorization || req.headers.authorization == "") {
            console.log(moment().format(), "single auth parameters error");
            return res.status(200).send({ status: "single auth parameters error" });
        };

        // Define token
        let token = req.headers.authorization.replace("Bearer ", "");
        jwt.verify(token, process.env.SECRETJWT, (err, decoded) => {
            if (err) {
                console.log(moment().format(), "single auth token error");
                return res.status(200).send({ status: "single auth token error" });
            };
            if (!decoded || !decoded.user || !decoded.user.username || decoded.user.username == "" || !decoded.user.type || ["admin", "supervisor", "operator"].indexOf(decoded.user.type) == -1) {
                console.log(moment().format(), "single auth permission denied");
                return res.status(200).send({ status: "single auth permission denied" });
            };
            return next();
        });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.superAuth = async (req, res, next) => {
    try {

        // Verify authorization
        if (!req.headers || !req.headers.authorization || req.headers.authorization == "") {
            console.log(moment().format(), "super auth parameters error");
            return res.status(200).send({ status: "super auth parameters error" });
        };

        // Define token
        let token = req.headers.authorization.replace("Bearer ", "");
        jwt.verify(token, process.env.SECRETJWT, (err, decoded) => {
            if (err) {
                console.log(moment().format(), "super auth token error");
                return res.status(200).send({ status: "super auth token error" });
            };
            if (!decoded || !decoded.user || !decoded.user.username || decoded.user.username == "" || !decoded.user.type || ["admin", "supervisor"].indexOf(decoded.user.type) == -1) {
                console.log(moment().format(), "super auth permission denied");
                return res.status(200).send({ status: "super auth permission denied" });
            };
            return next();
        });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.adminAuth = async (req, res, next) => {
    try {

        // Verify authorization
        if (!req.headers || !req.headers.authorization || req.headers.authorization == "") {
            console.log(moment().format(), "admin auth parameters error");
            return res.status(200).send({ status: "admin auth parameters error" });
        };

        // Define token
        let token = req.headers.authorization.replace("Bearer ", "");
        jwt.verify(token, process.env.SECRETJWT, (err, decoded) => {
            if (err) {
                console.log(moment().format(), "admin auth token error");
                return res.status(200).send({ status: "admin auth token error" });
            };
            if (!decoded || !decoded.user || !decoded.user.username || decoded.user.username == "" || !decoded.user.type || ["admin"].indexOf(decoded.user.type) == -1) {
                console.log(moment().format(), "admin auth permission denied");
                return res.status(200).send({ status: "admin auth permission denied" });
            };
            return next();
        });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};
