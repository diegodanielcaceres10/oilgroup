// Define modules
const dotenv = require("dotenv");
const storage = require("../modules/storage");
const htmlpdf = require("../modules/htmlpdf");
const moment = require("moment");
const fs = require("fs");

// Define credentials
dotenv.config({ path: "./config.env" });

exports.getPayments = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: report/getPayments |";

        // Define filter
        let filter = await storage.whereObj(req.body.filter || []);
        let metric = await storage.get_data(req, res, session, "select pp.id,datetime,provider,(null)customer,fantasy_name,import,status from provider_payment pp left join provider p on provider=p.id " + filter + "union all select cp.id,datetime,null,customer,fantasy_name,import,status from customer_payment cp left join customer c on customer=c.id " + filter + "order by datetime desc");

        // Define response
        return res.status(200).send({ status: "success", data: metric });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.getActivity = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: report/getActivity |";

        // Define filter
        let filter = await storage.whereObj(req.body.filter || []);
        filter += filter == "" ? "where status!='Inicial'" : "and status!='Inicial'";
        let metric = await storage.get_data(req, res, session, "select b.id,datetime,provider,(null)customer,fantasy_name,total,(null)billing,(null)billing_date,status from buy b left join provider p on provider=p.id " + filter + "union all select s.id,datetime,null,customer,fantasy_name,total,billing,billing_date,status from sale s left join customer c on customer=c.id " + filter + "order by datetime desc");

        // Define response
        return res.status(200).send({ status: "success", data: metric });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.exportPayments = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: report/exportPayments |";

        // Define username
        let username = req.body.username;
        username = username.replace(/'/gi, "");
        let user = await storage.get_row(req, res, session, "select*from user where username='" + username + "'");

        // Define payments
        let filter = await storage.whereObj(req.body.filter || []);
        let from = req.body.filter.find(i => i.name == "from");
        let to = req.body.filter.find(i => i.name == "to");
        let payments = await storage.get_data(req, res, session, "select pp.id,datetime,provider,(null)customer,fantasy_name,method,import,status from provider_payment pp left join provider p on provider=p.id " + filter + "union all select cp.id,datetime,null,customer,fantasy_name,method,import,status from customer_payment cp left join customer c on customer=c.id " + filter + "order by datetime desc");

        // Read HTML Template
        let html = fs.readFileSync("./templates/payments.html", "utf8");
        html = html.replace("{{FROM}}", moment(from.value).format("DD-MM-YYYY"));
        html = html.replace("{{TO}}", moment(to.value).format("DD-MM-YYYY"));
        let itemsHTML = "";
        for (let item of payments) {
            itemsHTML += `<tr style="border-bottom: 1px solid;">
            <td style="white-space: pre;">${moment(item.datetime).format("DD-MM-YYYY, HH:mm")}</td>
            <td>${item.provider ? "Pago" : "Cobro"} N° ${item.id}<br>${item.fantasy_name}</td>
            <td style="text-align: right;">${item.method}</td>
            <td style="text-align: right;">$ ${item.import.toFixed(2)}</td>
            </tr>`;
        }
        if (payments.length == 0) {
            itemsHTML += `<tr style="border-bottom: 1px solid;">
            <td style="white-space: pre;"></td>
            <td>No existen registros en el periodo consultado</td>
            <td style="text-align: right;"></td>
            <td style="text-align: right;"></td>
            <td style="text-align: right;"></td>
            </tr>`;
        }
        html = html.replace("{{ITEMS}}", itemsHTML);
        html = html.replace("{{USER}}", user.lastname + " " + user.firstname);
        html = html.replace("{{DATETIME}}", moment().format("DD-MM-YYYY, HH:mm"));

        // create PDF
        const pdf = await htmlpdf.create(req, res, session, html);

        // Define response
        const data = fs.readFileSync(pdf);

        // Remove file
        fs.unlinkSync(pdf);
        res.contentType("application/pdf");
        res.send(data);
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.exportActivities = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: report/exportActivities |";

        // Define username
        let username = req.body.username;
        username = username.replace(/'/gi, "");
        let user = await storage.get_row(req, res, session, "select*from user where username='" + username + "'");

        // Define activities
        let filter = await storage.whereObj(req.body.filter || []);
        let from = req.body.filter.find(i => i.name == "from");
        let to = req.body.filter.find(i => i.name == "to");
        let activities = await storage.get_data(req, res, session, "select b.id,datetime,provider,(null)customer,fantasy_name,total,status from buy b left join provider p on provider=p.id " + filter + "union all select s.id,datetime,null,customer,fantasy_name,total,status from sale s left join customer c on customer=c.id " + filter + "order by datetime desc");

        // Read HTML Template
        let html = fs.readFileSync("./templates/activities.html", "utf8");
        html = html.replace("{{FROM}}", moment(from.value).format("DD-MM-YYYY"));
        html = html.replace("{{TO}}", moment(to.value).format("DD-MM-YYYY"));
        let itemsHTML = "";
        for (let item of activities) {
            itemsHTML += `<tr style="border-bottom: 1px solid;">
            <td style="white-space: pre;">${moment(item.datetime).format("DD-MM-YYYY, HH:mm")}</td>
            <td>${item.provider ? "Compra" : "Venta"} N° ${item.id}<br>${item.fantasy_name}</td>
            <td style="text-align: right;">$ ${item.total.toFixed(2)}</td>
            </tr>`;
        }
        if (activities.length == 0) {
            itemsHTML += `<tr style="border-bottom: 1px solid;">
            <td style="white-space: pre;"></td>
            <td>No existen registros en el periodo consultado</td>
            <td style="text-align: right;"></td>
            <td style="text-align: right;"></td>
            </tr>`;
        }
        html = html.replace("{{ITEMS}}", itemsHTML);
        html = html.replace("{{USER}}", user.lastname + " " + user.firstname);
        html = html.replace("{{DATETIME}}", moment().format("DD-MM-YYYY, HH:mm"));

        // create PDF
        const pdf = await htmlpdf.create(req, res, session, html);

        // Define response
        const data = fs.readFileSync(pdf);

        // Remove file
        fs.unlinkSync(pdf);
        res.contentType("application/pdf");
        res.send(data);
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};
