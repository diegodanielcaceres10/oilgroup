// Define modules
const dotenv = require("dotenv");
const storage = require("../modules/storage");
const htmlpdf = require("../modules/htmlpdf");
const moment = require("moment");
const fs = require("fs");

// Define credentials
dotenv.config({ path: "./config.env" });

exports.getAll = async (req, res) => {
    try {

        let session = "Username: " + (req.body.username || "undefined") + " | API: customer/getAll |";

        // Define filter
        let filter = await storage.whereObj(req.body.filter || []);

        // Define customers
        let customers = await storage.get_data(req, res, session, "select id,fantasy_name,name,lastname,firstname,c.active,sum(case when s.status!='Aprobado'then total else 0 end)sale,sum(case when s.status='Aprobada'then total else 0 end)success,sum(case when billing then total else 0 end)billing,sum(case when s.status='Aprobado'then -(total) else 0 end)payment,ifnull(sum(total),0)pending from customer c left join user on user=username left join(select customer,total,billing,status from sale where status!='Cancelada'and status!='Inicial'union all select customer,-(import),0,status from customer_payment where status='Aprobado')s on customer=id " + filter + "group by id order by fantasy_name");

        // Define response
        return res.status(200).send({ status: "success", data: customers });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.find = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: customer/find |";

        // Verify parameters
        if (!req.body.customer || typeof req.body.customer.id != "number") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define customer
        let customer = req.body.customer;
        customer = await storage.get_row(req, res, session, "select*,sum(case when s.status!='Aprobado'then total else 0 end)sale,sum(case when s.status='Aprobada'then total else 0 end)success,sum(case when billing then total else 0 end)billing,sum(case when s.status='Aprobado'then -(total) else 0 end)payment,ifnull(sum(total),0)pending from customer left join(select customer,total,billing,status from sale where status!='Cancelada'and status!='Inicial'union all select customer,-(import),0,status from customer_payment where status='Aprobado')s on customer=id where id=" + customer.id);
        if (customer.user) customer.user = await storage.get_row(req, res, session, "select*from user where username='" + customer.user + "'");
        customer.sales = await storage.get_data(req, res, session, "select id,('sale')typeof,datetime,total,billing,billing_date,status from sale where customer=" + customer.id + " and status!='Inicial'union all select id,'payment',datetime,import,0,null,status from customer_payment where customer=" + customer.id + " order by datetime desc,typeof");

        // Define response
        return res.status(200).send({ status: "success", data: customer });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.create = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: customer/create |";

        // Verify parameters
        if (!req.body.customer || typeof req.body.customer.user != "string" || req.body.customer.user == "" || typeof req.body.customer.fantasy_name != "string" || req.body.customer.fantasy_name == "" || typeof req.body.customer.name != "string" || req.body.customer.name == "" || typeof req.body.customer.tax_condition != "string" || req.body.customer.tax_condition == "") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define customer
        let customer = req.body.customer;
        customer.user = customer.user.replace(/'/gi, "");
        await storage.exists_row(req, res, session, "select*from user where username='" + customer.user + "'");
        customer.fantasy_name = customer.fantasy_name.replace(/'/gi, "").toUpperCase();
        await storage.empty_row(req, res, session, "select*from customer where fantasy_name='" + customer.fantasy_name + "'");

        // Create customer
        customer.document = customer.document ? customer.document.replace(/'/gi, "") : "";
        customer.name = customer.name.replace(/'/gi, "");
        customer.phone = customer.phone ? customer.phone.replace(/'/gi, "") : "";
        customer.email = customer.email ? customer.email.replace(/'/gi, "") : "";
        customer.tax_condition = customer.tax_condition.replace(/'/gi, "");
        customer.address = customer.address ? customer.address.replace(/'/gi, "").toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, m => m.toUpperCase()) : "";
        customer.city = customer.city ? customer.city.replace(/'/gi, "").toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, m => m.toUpperCase()) : "";
        customer.schedule = customer.schedule ? customer.schedule.replace(/'/gi, "") : "";
        customer.id = await storage.get_id(req, res, session, "insert into customer(user,fantasy_name,document,name,phone,email,tax_condition,address,city,schedule)values('" + customer.user + "','" + customer.fantasy_name + "','" + customer.document + "','" + customer.name + "','" + customer.phone + "','" + customer.email + "','" + customer.tax_condition + "','" + customer.address + "','" + customer.city + "','" + customer.schedule + "')");

        // Define response
        return res.status(200).send({ status: "success", data: customer.id });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.update = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: customer/update |";

        // Verify parameters
        if (!req.body.customer || typeof req.body.customer.id != "number" || typeof req.body.customer.user != "string" || req.body.customer.user == "" || typeof req.body.customer.fantasy_name != "string" || req.body.customer.fantasy_name == "" || typeof req.body.customer.name != "string" || req.body.customer.name == "" || typeof req.body.customer.tax_condition != "string" || req.body.customer.tax_condition == "") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define customer
        let customer = req.body.customer;
        await storage.exists_row(req, res, session, "select*from customer where id=" + customer.id);

        // Verify customer
        customer.user = customer.user.replace(/'/gi, "");
        await storage.exists_row(req, res, session, "select*from user where username='" + customer.user + "'");
        customer.fantasy_name = customer.fantasy_name.replace(/'/gi, "").toUpperCase();
        await storage.empty_row(req, res, session, "select*from customer where fantasy_name='" + customer.fantasy_name + "'and id!=" + customer.id);

        // Update customer
        customer.document = customer.document ? customer.document.replace(/'/gi, "") : "";
        customer.name = customer.name.replace(/'/gi, "");
        customer.phone = customer.phone ? customer.phone.replace(/'/gi, "") : "";
        customer.email = customer.email ? customer.email.replace(/'/gi, "") : "";
        customer.tax_condition = customer.tax_condition.replace(/'/gi, "");
        customer.address = customer.address ? customer.address.replace(/'/gi, "").toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, m => m.toUpperCase()) : "";
        customer.city = customer.city ? customer.city.replace(/'/gi, "").toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, m => m.toUpperCase()) : "";
        customer.schedule = customer.schedule ? customer.schedule.replace(/'/gi, "") : "";
        await storage.run_query(req, res, session, "update customer set user='" + customer.user + "',fantasy_name='" + customer.fantasy_name + "',document='" + customer.document + "',name='" + customer.name + "',phone='" + customer.phone + "',email='" + customer.email + "',tax_condition='" + customer.tax_condition + "',address='" + customer.address + "',city='" + customer.city + "',schedule='" + customer.schedule + "'where id=" + customer.id);

        // Define response
        return res.status(200).send({ status: "success" });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.active = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: customer/active |";

        // Verify parameters
        if (!req.body.customer || typeof req.body.customer.id != "number") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define customer
        let customer = req.body.customer;
        await storage.exists_row(req, res, session, "select*from customer where id=" + customer.id);

        // Update user
        await storage.run_query(req, res, session, "update customer set active=!active where id=" + customer.id);

        // Define response
        return res.status(200).send({ status: "success" });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.summary = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: customer/summary |";

        // Verify parameters
        if (!req.body.customer || typeof req.body.customer.id != "number") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define username
        let username = req.body.username;
        username = username.replace(/'/gi, "");
        let user = await storage.get_row(req, res, session, "select*from user where username='" + username + "'");

        // Define customer
        let customer = req.body.customer;
        customer = await storage.get_row(req, res, session, "select*,ifnull(sum(total),0)pending from customer left join(select customer,total,billing,status from sale where status!='Inicial'union all select customer,-(import),0,status from customer_payment where status='Aprobado')s on customer=id where id=" + customer.id);
        customer.sales = await storage.get_data(req, res, session, "select id,('sale')typeof,datetime,total,status from sale where customer=" + customer.id + " and status!='Cancelada'and status!='Inicial'union all select id,'payment',datetime,import,status from customer_payment where customer=" + customer.id + " and status!='Cancelado'order by datetime desc,typeof");

        // Read HTML Template
        let html = fs.readFileSync("./templates/report.html", "utf8");
        let bodyHTML = fs.readFileSync("./templates/reports/summary.html", "utf8");
        html = html.replace("{{HTML}}", bodyHTML);

        // Complete Template
        let summary = customer.pending;
        html = html.replace("{{CUIT}}", customer.document);
        html = html.replace("{{NAME}}", customer.name);
        html = html.replace("{{ADDRESS}}", customer.address + " " + customer.city);
        html = html.replace("{{SCHEDULE}}", customer.schedule);
        html = html.replace("{{PHONE}}", customer.phone);
        html = html.replace("{{SUMMARY}}", "$ " + customer.pending.toFixed(2));
        let itemsHTML = "";
        let pending = summary;
        if (customer.sales.length == 0) {
            itemsHTML += `
            <tr>
                <td colspan="6">No existen registros</td>
            </tr>`;
        } else {;
            for (let item of customer.sales) {
                if (item.typeof == "sale") {
                    let expired = "";
                    let description = "Remito N° " + item.id;
                    let color = "";
                    if (item.status == "Aprobada" && pending > 0) {
                        description += " - Pendiente";
                        if (item.total > pending) {
                            description += " parcial ($ " + pending.toFixed(2) + ")";
                        } else {
                            description += " total";
                        }
                        color = ` style="color: red;"`;
                        if (moment() > moment(item.datetime).add(1, "months")) {
                            expired = "Si";
                        }
                        pending -= item.total;
                    }
                    itemsHTML += `
                    <tr${color}>
                        <td>${moment(item.datetime).format("DD-MM-YYYY")}<br>${moment(item.datetime).format("HH:mm")}</td>
                        <td>${description}</td>
                        <td style="text-align: right;">$ ${item.total.toFixed(2)}</td>
                        <td style="text-align: right;">-</td>
                        <td style="text-align: right;">$ ${summary.toFixed(2)}</td>
                        <td style="text-align: center;">${expired}</td>
                    </tr>`;
                    summary -= item.total;
                } else {
                    itemsHTML += `
                    <tr>
                        <td>${moment(item.datetime).format("DD-MM-YYYY")}<br>${moment(item.datetime).format("HH:mm")}</td>
                        <td>Recibo N° ${item.id}</td>
                        <td style="text-align: right;">-</td>
                        <td style="text-align: right;">$ ${item.total.toFixed(2)}</td>
                        <td style="text-align: right;">$ ${summary.toFixed(2)}</td>
                        <td></td>
                    </tr>`;
                    summary += item.total;
                }
            }
        }
        html = html.replace("{{ITEMS}}", itemsHTML);

        // create PDF
        const pdf = await htmlpdf.create(html, user.lastname + " " + user.firstname);

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
