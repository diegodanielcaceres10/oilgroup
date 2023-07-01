// Define modules
const storage = require("../modules/storage");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const moment = require("moment");
const infoservice = require("../services/info");

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
        user.license = await storage.get_row(req, res, session, "select month,status from license where current=1");
        if (user.license && (user.license.status == "Aprobado" || moment(user.license.month).format("YYYY-MM-01") >= moment().format("YYYY-MM-01"))) {
            user.license.active = 1;
            if (user.license.status != "Aprobado") {
                const days = moment().add(1, "days").diff(moment(user.license.month).format("YYYY-MM-DD"), "days");
                if (days > 15) {
                    user.license.days = moment(user.license.month).add(1, "month").diff(moment().add(1, "days"), "days");
                    user.license.expired = true;
                } else {
                    user.license.days = 15 - days;
                }
            }
        } else {
            user.license.active = 0;
        }

        // Define user
        const token = jwt.sign({ user: user.username }, process.env.SECRETJWT);

        // Define response
        console.log(moment().format(), session, user.username);
        return res.status(200).send({ status: "success", data: user, token });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.token = async (req, res) => {
    try {
        let session = "API: user/token |";
        let { token } = req.body;

        // Verify parameters
        if (!token) {
            infoservice.error(req.body, "Parameters Error");
            return res.status(400).send({ message: "parameters error" });
        }

        jwt.verify(token, process.env.SECRETJWT, async (err, decoded) => {
            if (err) {
                infoservice.error("Invalid Token", err);
                return res.status(403).send({ message: "invalid token" });
            }
            if (!decoded.user) {
                infoservice.error("Invalid Token");
                return res.status(403).send({ message: "invalid token" });
            }

            // Define user
            const data = await storage.get_row(req, res, session, "select username,lastname,firstname,phone,email,role,type from user where username='" + decoded.user + "'and active");
            data.license = await storage.get_row(req, res, session, "select month,status from license where current=1");
            if (data.license && (data.license.status == "Aprobado" || moment(data.license.month).format("YYYY-MM-01") >= moment().format("YYYY-MM-01"))) {
                data.license.active = 1;
                if (data.license.status != "Aprobado") {
                    const days = moment().add(1, "days").diff(moment(data.license.month).format("YYYY-MM-DD"), "days");
                    if (days > 15) {
                        data.license.days = moment(data.license.month).add(1, "month").diff(moment().add(1, "days"), "days");
                        data.license.expired = true;
                    } else {
                        data.license.days = 15 - days;
                    }
                }
            } else {
                data.license.active = 0;
            }

            // Define response
            return res.status(200).send({ status: "success", data });
        });
    } catch (err) {
        infoservice.error(err);
        return res.status(500).send(err);
    }
}

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
            if (!decoded.user) {
                infoservice.error("Invalid Token");
                return res.status(403).send({ message: "invalid token" });
            }
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
            if (!decoded.user) {
                infoservice.error("Invalid Token");
                return res.status(403).send({ message: "invalid token" });
            }
            return next();
        });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};
