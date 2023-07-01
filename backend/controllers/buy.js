// Define modules
const storage = require("../modules/storage");
const moment = require("moment");

exports.find = async (req, res) => {
    try {
        let session = "Username: " + (req.headers.username || "undefined") + " | API: buy/find |";

        // Verify parameters
        if (!req.body.buy || typeof req.body.buy.id != "number") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define buy
        let buy = req.body.buy;
        buy = await storage.get_row(req, res, session, "select*from buy where id=" + buy.id);
        buy.provider = await storage.get_row(req, res, session, "select*from provider where id=" + buy.provider);
        buy.items = await storage.get_data(req, res, session, "select*from buy_detail left join article on article=id where buy=" + buy.id);

        // Define response
        return res.status(200).send({ status: "success", data: buy });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.create = async (req, res) => {
    try {
        let session = "Username: " + (req.headers.username || "undefined") + " | API: buy/create |";

        // Verify parameters
        if (!req.body.buy || !req.body.buy.provider || typeof req.body.buy.provider.id != "number" || typeof req.body.buy.total != "number" || ((!req.body.buy.articles || req.body.buy.articles.length == 0) && (!req.body.buy.details || req.body.buy.details.length == 0))) {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define buy
        let buy = req.body.buy;

        // Verify provider
        await storage.exists_row(req, res, session, "select*from provider where id=" + buy.provider.id);

        // Create buy
        buy.ticket = buy.ticket ? buy.ticket.replace(/'/gi, "") : "";
        buy.description = buy.description ? buy.description.replace(/'/gi, "") : "";
        buy.id = await storage.get_id(req, res, session, "insert into buy (provider,ticket,description,total) values (" + buy.provider.id + ",'" + buy.ticket + "','" + buy.description + "'," + buy.total + ")");

        // Define articles
        let articles = buy.articles;
        for (let article of articles) {

            // Verify parameters
            if (typeof article.id != "number" || typeof article.cost != "number" || typeof article.quantity != "number" || typeof article.units != "number" || typeof article.subtotal != "number") {
                console.error(moment().format(), session, "parameters error");
                return res.status(400).send();
            };

            // Verify article
            await storage.exists_row(req, res, session, "select*from article where id=" + article.id);

            // Create detail
            await storage.run_query(req, res, session, "insert into buy_detail (buy,article,cost,quantity,units,subtotal) values (" + buy.id + "," + article.id + "," + article.cost + "," + article.quantity + "," + article.units + "," + article.subtotal + ")");
        };

        // Define details
        let details = buy.details;
        for (let detail of details) {

            // Verify parameters
            if (typeof detail.concept != "string" || detail.concept == "" || typeof detail.subtotal != "number") {
                console.error(moment().format(), session, "parameters error");
                return res.status(400).send();
            };

            // Create detail
            detail.concept = detail.concept.replace(/'/gi, "").toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, m => m.toUpperCase());
            await storage.run_query(req, res, session, "insert into buy_detail (buy,concept,subtotal) values (" + buy.id + ",'" + detail.concept + "'," + detail.subtotal + ")");
        };

        if (buy.payment.status) {

            // Verify parameters
            if (typeof buy.payment.import != "number") {
                console.error(moment().format(), session, "parameters error");
                return res.status(400).send();
            };

            // Create payment
            buy.payment.ticket = buy.payment.ticket ? buy.payment.ticket.replace(/'/gi, "") : "";
            buy.payment.method = buy.payment.method ? buy.payment.method.replace(/'/gi, "").toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, m => m.toUpperCase()) : "";
            await storage.run_query(req, res, session, "insert into provider_payment (provider,ticket,method,import) values (" + buy.provider.id + ",'" + buy.payment.ticket + "','" + buy.payment.method + "'," + buy.payment.import + ")");
        };

        // Update buy
        await storage.run_query(req, res, session, "update buy set status='Aprobada'where id=" + buy.id);

        // Define response
        return res.status(200).send({ status: "success", data: buy.id });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.cancel = async (req, res) => {
    try {
        let session = "Username: " + (req.headers.username || "undefined") + " | API: buy/cancel |";

        // Verify parameters
        if (!req.body.buy || typeof req.body.buy.id != "number") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define buy
        let buy = req.body.buy;
        buy = await storage.get_row(req, res, session, "select*from buy where id=" + buy.id);

        // Update buy
        await storage.run_query(req, res, session, "update buy set status='Cancelada'where id=" + buy.id);

        // Define response
        return res.status(200).send({ status: "success" });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};
