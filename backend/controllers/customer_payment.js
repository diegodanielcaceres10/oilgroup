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
        payment = await storage.get_row(req, res, session, "select*from customer_payment where id=" + payment.id);
        payment.customer = await storage.get_row(req, res, session, "select*from customer where id=" + payment.customer);

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
        if (!req.body.payment || typeof req.body.payment.customer != "number" || typeof req.body.payment.import != "number" || typeof req.body.payment.method != "string" || req.body.payment.method == "") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define username
        let username = req.body.username;
        username = username.replace(/'/gi, "");
        await storage.exists_row(req, res, session, "select*from user where username='" + username + "'");

        // Define payment
        let payment = req.body.payment;

        // Verify customer
        await storage.exists_row(req, res, session, "select*from customer where id=" + payment.customer);
        payment.ticket = payment.ticket ? payment.ticket.replace(/'/gi, "") : "";
        payment.account_name = payment.account_name ? payment.account_name.replace(/'/gi, "").toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, m => m.toUpperCase()) : "";
        payment.account_bank = payment.account_bank ? payment.account_bank.replace(/'/gi, "").toUpperCase() : "";
        payment.number = payment.number ? payment.number.replace(/'/gi, "") : "";
        if (payment.method == "Cheque" && moment(payment.cashing_date).isValid()) {
            payment.id = await storage.get_id(req, res, session, "insert into customer_payment (user,customer,ticket,method,import,account_name,account_bank,number,cashing_date) values ('" + username + "'," + payment.customer + ",'" + payment.ticket + "','" + payment.method + "'," + payment.import + ",'" + payment.account_name + "','" + payment.account_bank + "','" + payment.number + "','" + payment.cashing_date + "')");
        } else {
            payment.id = await storage.get_id(req, res, session, "insert into customer_payment (user,customer,ticket,method,import,account_name,account_bank,number) values ('" + username + "'," + payment.customer + ",'" + payment.ticket + "','" + payment.method + "'," + payment.import + ",'" + payment.account_name + "','" + payment.account_bank + "','" + payment.number + "')");
        }

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
        await storage.exists_row(req, res, session, "select*from customer_payment where id=" + payment.id);
        await storage.run_query(req, res, session, "update customer_payment set status='Cancelado'where id=" + payment.id);

        // Define response
        return res.status(200).send({ status: "success" });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};
