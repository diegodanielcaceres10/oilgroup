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
        let session = "Username: " + (req.body.username || "undefined") + " | API: sale/getAll |";

        // Define filter
        let filter = await storage.whereObj(req.body.filter || []);

        // Hide off sales
        filter += filter == "" ? "where status!='Cancelada'and status!='Inicial'" : "and status!='Cancelada'and status!='Inicial'";

        // Define sales
        let sales = await storage.get_data(req, res, session, "select s.*,fantasy_name from sale s left join customer c on customer=c.id " + filter + "order by datetime desc");

        // Define response
        return res.status(200).send({ status: "success", data: sales });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.find = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: sale/find |";

        // Verify parameters
        if (!req.body.sale || typeof req.body.sale.id != "number") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define sale
        let sale = req.body.sale;
        sale = await storage.get_row(req, res, session, "select*from sale where id=" + sale.id);
        sale.user = await storage.get_row(req, res, session, "select*from user where username='" + sale.user + "'");
        sale.customer = await storage.get_row(req, res, session, "select*from customer where id=" + sale.customer);
        sale.items = await storage.get_data(req, res, session, "select s.id,article,concept,brand,name,measure,price,quantity,units,stock,subtotal from sale_detail s left join article a on article=a.id where sale=" + sale.id + " and deleted=0 and subtotal");
        if (sale.status == "Pendiente") {
            for (let i in sale.items) {
                sale.items[i].available = await storage.get_value(req, res, session, "select ifnull(sum(s.stock),0)value from article a left join(select article,units,(units)stock,(1)review from buy_detail,buy where buy=id and article and status='Aprobada'union all select article,-units,-stock,review from sale_detail,sale s where sale=s.id and article and review and status!='Cancelada'and status!='Inicial'union all select article,units,units,1 from stock)s on article=id where id=" + sale.items[i].article);
            }
        }

        // Define response
        return res.status(200).send({ status: "success", data: sale });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.create = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: sale/create |";

        // Verify parameters
        if (typeof req.body.username != "string" || req.body.username == "" || !req.body.sale || !req.body.sale.customer || typeof req.body.sale.customer.id != "number" || typeof req.body.sale.total != "number" || ((!req.body.sale.articles || req.body.sale.articles.length == 0) && (!req.body.sale.details || req.body.sale.details.length == 0))) {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define username
        let username = req.body.username;
        username = username.replace(/'/gi, "");
        await storage.exists_row(req, res, session, "select*from user where username='" + username + "'");

        // Define user
        let sale = req.body.sale;

        // Verify customer
        await storage.exists_row(req, res, session, "select*from customer where id=" + sale.customer.id);

        // Create sale
        sale.ticket = sale.ticket ? sale.ticket.replace(/'/gi, "") : "";
        sale.description = sale.description ? sale.description.replace(/'/gi, "") : "";
        sale.document = sale.billing && sale.document == "Factura A" ? "Factura A" : "Factura B";
        sale.status = ["Aprobada", "Lista", "Pendiente"].indexOf(sale.status) > -1 ? sale.status : "Pendiente";
        if (sale.billing) {
            sale.id = await storage.get_id(req, res, session, "insert into sale (user,customer,ticket,description,total,document,billing) values ('" + username + "'," + sale.customer.id + ",'" + sale.ticket + "','" + sale.description + "'," + sale.total + ",'" + sale.document + "',1)");
        } else {
            sale.id = await storage.get_id(req, res, session, "insert into sale (user,customer,ticket,description,total,billing) values ('" + username + "'," + sale.customer.id + ",'" + sale.ticket + "','" + sale.description + "'," + sale.total + ",0)");
        }

        // Define articles
        let articles = sale.articles;
        if (articles.length == 0 && sale.status == "Pendiente") sale.status = "Lista";
        for (let article of articles) {

            // Verify parameters
            if (typeof article.id != "number" || typeof article.measure != "string" || article.measure == "" || typeof article.price != "number" || typeof article.quantity != "number" || typeof article.units != "number" || typeof article.subtotal != "number") {
                console.error(moment().format(), session, "parameters error");
                return res.status(400).send();
            };

            // Verify article
            await storage.exists_row(req, res, session, "select*from article where id=" + article.id);
            if (sale.status == "Pendiente") {

                // Create detail
                await storage.run_query(req, res, session, "insert into sale_detail (sale,article,measure,price,quantity,units,stock,subtotal) values (" + sale.id + "," + article.id + ",'" + article.measure + "'," + article.price + "," + article.quantity + "," + article.units + "," + article.stock + "," + article.subtotal + ")");
            } else {

                // Create detail
                await storage.run_query(req, res, session, "insert into sale_detail (sale,article,measure,price,quantity,units,stock,subtotal,review) values (" + sale.id + "," + article.id + ",'" + article.measure + "'," + article.price + "," + article.quantity + "," + article.units + "," + article.stock + "," + article.subtotal + ",1)");
                if (article.replaces && article.replaces.length > 0) {
                    for (let replace of article.replaces) {

                        // Verify parameters
                        if (typeof replace.id != "number" || typeof replace.stock != "number") {
                            console.error(moment().format(), session, "parameters error");
                            return res.status(400).send();
                        };

                        // Verify article
                        await storage.exists_row(req, res, session, "select*from article where id=" + replace.id);
                        await storage.run_query(req, res, session, "insert into sale_detail (sale,article,stock,review) values (" + sale.id + "," + replace.id + "," + replace.stock + ",1)");
                    }
                }
            };
        };

        // Define details
        let details = sale.details;
        for (let detail of details) {

            // Verify parameters
            if (typeof detail.concept != "string" || detail.concept == "" || typeof detail.subtotal != "number") {
                console.error(moment().format(), session, "parameters error");
                return res.status(400).send();
            };

            // Create detail
            detail.concept = detail.concept.replace(/'/gi, "").toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, m => m.toUpperCase());
            await storage.run_query(req, res, session, "insert into sale_detail (sale,concept,subtotal) values (" + sale.id + ",'" + detail.concept + "'," + detail.subtotal + ")");
        };

        if (sale.payment.status) {

            // Verify parameters
            if (typeof sale.payment.import != "number") {
                console.error(moment().format(), session, "parameters error");
                return res.status(400).send();
            };

            // Create payment
            sale.payment.ticket = sale.payment.ticket ? sale.payment.ticket.replace(/'/gi, "") : "";
            sale.payment.method = sale.payment.method ? sale.payment.method.replace(/'/gi, "").toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, m => m.toUpperCase()) : "";
            await storage.run_query(req, res, session, "insert into customer_payment (user,customer,ticket,method,import) values ('" + username + "'," + sale.customer.id + ",'" + sale.payment.ticket + "','" + sale.payment.method + "'," + sale.payment.import + ")");
        };

        // Update buy
        await storage.run_query(req, res, session, "update sale set status='" + sale.status + "'where id=" + sale.id);

        // Define response
        return res.status(200).send({ status: "success", data: sale.id });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.review = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: sale/review |";

        // Verify parameters
        if (!req.body.sale || typeof req.body.sale.id != "number" || !req.body.sale.articles || req.body.sale.articles.length == 0) {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define sale
        let sale = req.body.sale;
        await storage.exists_row(req, res, session, "select*from sale where id=" + sale.id);
        let articles = sale.articles || [];
        let total = 0;
        for (let item of articles) {

            // Verify parameters
            if (typeof item.id != "number" || typeof item.article != "number") {
                console.error(moment().format(), session, "parameters error");
                return res.status(400).send();
            };

            // Verify article
            await storage.exists_row(req, res, session, "select*from article where id=" + item.article);

            // Update detail
            if (item.deleted) {
                await storage.run_query(req, res, session, "update sale_detail set deleted=1 where id=" + item.id);
            } else {
                await storage.run_query(req, res, session, "update sale_detail set stock=" + item.stock + ",review=1 where id=" + item.id);
                if (item.replaces && item.replaces.length > 0) {
                    for (let replace of item.replaces) {
    
                        // Verify parameters
                        if (typeof replace.id != "number" || typeof replace.stock != "number") {
                            console.error(moment().format(), session, "parameters error");
                            return res.status(400).send();
                        };
    
                        // Verify article
                        await storage.exists_row(req, res, session, "select*from article where id=" + replace.id);
                        await storage.run_query(req, res, session, "insert into sale_detail (sale,article,stock,review) values (" + sale.id + "," + replace.id + "," + replace.stock + ",1)");
                    }
                }
                total += item.subtotal
            }
        };
        let details = sale.details || [];
        for (let item of details) {

            // Update detail
            if (item.deleted) {
                await storage.run_query(req, res, session, "update sale_detail set deleted=1 where id=" + item.id);
            } else {
                total += item.subtotal
            }
        };

        // Update sale
        await storage.run_query(req, res, session, "update sale set status='Lista',total=" + total + " where id=" + sale.id);

        // Define response
        return res.status(200).send({ status: "success" });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.deliver = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: sale/deliver |";

        // Verify parameters
        if (!req.body.sale || typeof req.body.sale.id != "number") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define sale
        let sale = req.body.sale;
        await storage.exists_row(req, res, session, "select*from sale where id=" + sale.id);
        await storage.run_query(req, res, session, "update sale set status='Aprobada'where id=" + sale.id);

        // Define response
        return res.status(200).send({ status: "success" });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.ticket = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: sale/ticket |";

        // Verify parameters
        if (!req.body.sale || typeof req.body.sale.id != "number") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define sale
        let sale = req.body.sale;
        sale = await storage.get_row(req, res, session, "select*from sale where id=" + sale.id);
        sale.customer = await storage.get_row(req, res, session, "select document,name,address,city,c.phone,lastname,firstname,schedule from customer c left join user u on user=username where id=" + sale.customer);
        sale.items = await storage.get_data(req, res, session, "select s.id,code,concept,brand,name,measure,price,quantity,units,subtotal from sale_detail s left join article a on article=a.id where subtotal and deleted=0 and sale=" + sale.id);

        // Read HTML Template
        let html = fs.readFileSync("./templates/ticket.html", "utf8");
        html = html.replace("{{ID}}", sale.id);
        html = html.replace("{{DATE}}", moment(sale.datetime).format("DD-MM-YYYY, HH:mm"));
        html = html.replace("{{CUIT}}", sale.customer.document);
        html = html.replace("{{NAME}}", sale.customer.name);
        html = html.replace("{{ADDRESS}}", sale.customer.address + " " + sale.customer.city);
        html = html.replace("{{SCHEDULE}}", sale.customer.schedule);
        html = html.replace("{{PHONE}}", sale.customer.phone);
        html = html.replace("{{USER}}", sale.customer.lastname + " " + sale.customer.firstname);
        html = html.replace("{{DESCRIPTION}}", sale.description);
        html = html.replace("{{TOTAL}}", sale.total.toFixed(2));
        let itemsHTML = "";
        for (let item of sale.items) {
            if (item.quantity != undefined && item.quantity != null && item.code && item.price) {
                itemsHTML += `<tr style="border-bottom: 1px solid;">
                <td>${item.quantity}</td>
                <td>${item.code}</td>
                <td>${item.brand} ${item.name} ${item.measure} </td>
                <td style="text-align: right;">$ ${item.price.toFixed(2)}</td>
                <td style="text-align: right;">$ ${item.subtotal.toFixed(2)}</td>
    	        </tr>`;
            } else {
                itemsHTML += `<tr style="border-bottom: 1px solid;">
                <td>1</td>
                <td></td>
                <td>${item.concept}</td>
                <td style="text-align: right;">$ ${item.subtotal.toFixed(2)}</td>
                <td style="text-align: right;">$ ${item.subtotal.toFixed(2)}</td>
            	</tr>`;
            }
        }
        html = html.replace("{{ITEMS}}", itemsHTML);
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

exports.billing = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: sale/billing |";

        // Verify parameters
        if (!req.body.sale || typeof req.body.sale.id != "number" || typeof req.body.sale.ticket != "string" || req.body.sale.ticket == "") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define sale
        let sale = req.body.sale;
        await storage.exists_row(req, res, session, "select*from sale where id=" + sale.id + " and billing and billing_date is null");
        sale.ticket = sale.ticket.replace(/'/gi, "");
        await storage.run_query(req, res, session, "update sale set ticket='" + sale.ticket + "',billing_date=current_timestamp() where id=" + sale.id);

        // Define response
        return res.status(200).send({ status: "success" });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.cancel = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: sale/cancel |";

        // Verify parameters
        if (!req.body.sale || typeof req.body.sale.id != "number") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define sale
        let sale = req.body.sale;
        await storage.exists_row(req, res, session, "select*from sale where id=" + sale.id);
        await storage.run_query(req, res, session, "update sale set status='Cancelada'where id=" + sale.id);

        // Define response
        return res.status(200).send({ status: "success" });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};
