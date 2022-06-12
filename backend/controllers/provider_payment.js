// Define modules
const storage = require("../modules/storage");
const moment = require("moment");

exports.find = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: payment/find |";

        // Verify parameters
        if (!req.body.payment || typeof req.body.payment.id != "number") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define payment
        let payment = req.body.payment;

        // Define payment
        payment = await storage.get_row(req, res, session, "select*from provider_payment where id=" + payment.id);
        payment.provider = await storage.get_row(req, res, session, "select*from provider where id=" + payment.provider);

        // Define response
        return res.status(200).send({ status: "success", data: payment });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.create = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: payment/create |";

        // Verify parameters
        if (!req.body.payment || typeof req.body.payment.provider != "number" || typeof req.body.payment.import != "number" || typeof req.body.payment.method != "string" || req.body.payment.method == "") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define user
        let payment = req.body.payment;

        // Verify provider
        await storage.exists_row(req, res, session, "select*from provider where id=" + payment.provider);
        payment.ticket = payment.ticket ? payment.ticket.replace(/'/gi, "") : "";
        payment.id = await storage.get_id(req, res, session, "insert into provider_payment (provider,ticket,method,import) values (" + payment.provider + ",'" + payment.ticket + "','" + payment.method + "'," + payment.import + ")");

        // Define response
        return res.status(200).send({ status: "success", data: payment.id });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.cancel = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: payment/cancel |";

        // Verify parameters
        if (!req.body.payment || typeof req.body.payment.id != "number") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define payment
        let payment = req.body.payment;
        await storage.exists_row(req, res, session, "select*from provider_payment where id=" + payment.id);
        await storage.run_query(req, res, session, "update provider_payment set status='Cancelado'where id=" + payment.id);

        // Define response
        return res.status(200).send({ status: "success" });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};
