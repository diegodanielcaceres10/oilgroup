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
        let session = "Username: " + (req.body.username || "undefined") + " | API: article/getAll |";

        // Define filter
        let filter = await storage.whereObj(req.body.filter || []);

        // Get articles
        let articles = await storage.get_data(req, res, session, "select a.id,provider,fantasy_name,brand,category,code,a.name,size,variety,ifnull(sum(s.units),0)stock,a.active from article a left join provider p on provider=p.id left join(select article,units from buy_detail,buy where buy=id and article and status='Aprobada'union all select article,-stock from sale_detail,sale s where sale=s.id and article and review and status!='Cancelada'and status!='Inicial'union all select article,units from stock)s on s.article=a.id " + filter + "group by id order by brand,a.name,description");

        // Define response
        return res.status(200).send({ status: "success", data: articles });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.getPrices = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: article/getPrices |";

        // Get articles
        let articles = await storage.get_data(req, res, session, "select a.id,fantasy_name,brand,code,a.name,size,variety,measure,p.units,price_list,price_offer,ifnull(sum(s.units),0)stock from price p left join article a on p.article=a.id left join provider pr on provider=pr.id left join(select article,units from buy_detail,buy where buy=id and article and status='Aprobada'union all select article,-stock from sale_detail,sale s where sale=s.id and article and review and status!='Cancelada'and status!='Inicial'union all select article,units from stock)s on s.article=a.id where price_list or price_offer and a.active and pr.active group by concat(a.id,measure)order by brand,a.name,units");

        // Define response
        return res.status(200).send({ status: "success", data: articles });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.getAllPrices = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: article/getAllPrices |";

        // Define filter
        let filter = await storage.whereObj(req.body.filter || []);
        filter += filter == "" ? "where a.active and p.active " : "and a.active and p.active ";

        // Get articles
        let articles = await storage.get_data(req, res, session, "select pr.id,article,provider,fantasy_name,code,brand,a.name,cost,size,variety,measure,units,price_list,price_offer from price pr left join article a on article=a.id left join provider p on provider=p.id " + filter + "order by brand,a.name,units");

        // Define response
        return res.status(200).send({ status: "success", data: articles });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.find = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: article/find |";

        // Verify parameters
        if (!req.body.article || typeof req.body.article.id != "number") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Get article
        let article = req.body.article;
        article = await storage.get_row(req, res, session, "select a.*,ifnull(sum(s.units),0)required,ifnull(sum(s.stock),0)stock from article a left join(select article,units,(units)stock,(1)review from buy_detail,buy where buy=id and article and status='Aprobada'union all select article,-units,-stock,review from sale_detail,sale s where sale=s.id and article and review and status!='Cancelada'and status!='Inicial'union all select article,0,units,1 from stock)s on article=id where id=" + article.id);
        article.provider = await storage.get_row(req, res, session, "select*from provider where id=" + article.provider);
        article.prices = await storage.get_data(req, res, session, "select*from price where article=" + article.id + " order by units");
        article.history = await storage.get_data(req, res, session, "select('Ajuste')typeof,description,datetime,units from stock where article=" + article.id + " union all select'Compra',null,datetime,units from buy_detail,buy b where buy=b.id and article=" + article.id + " and status='Aprobada'union all select 'Venta',null,datetime,-stock from sale_detail,sale s where sale=s.id and article=" + article.id + " and review and stock > 0 and status!='Cancelada'and status!='Inicial'order by datetime desc");
        article.sales = await storage.get_data(req, res, session, "select sale,datetime,quantity,measure,price,subtotal,fantasy_name from sale_detail,sale s,customer c where sale=s.id and customer=c.id and article=" + article.id + " and status!='Cancelada'and status!='Inicial'and subtotal > 0 order by datetime desc");
        await storage.run_query(req, res, session, "SET lc_time_names = 'es_ES'");
        article.profitability = await storage.get_data(req, res, session, "select m.item,(ifnull(s.total,0)-ifnull(b.total,0))total from(select date_format(curdate(), '%Y-%m')month,date_format(curdate(), '%M')item union select date_format(curdate()-interval 1 month, '%Y-%m'),date_format(curdate()-interval 1 month, '%M') union select date_format(curdate()-interval 2 month, '%Y-%m'),date_format(curdate()-interval 2 month, '%M'))m left join(select date_format(datetime, '%Y-%m')item,ifnull(sum(subtotal),0)total from sale_detail,sale s where article=" + article.id + " and sale=s.id and deleted=0 and status!='Pendiente'and status!='Cancelada'and status!='Inicial'and(month(datetime)=month(curdate())or month(datetime)=month(curdate()-interval 1 month)or month(datetime)=month(curdate()-interval 2 month))group by item)s on month=s.item left join(select date_format(datetime, '%Y-%m')item,ifnull(sum(subtotal),0)total from buy_detail,buy b where article=" + article.id + " and buy=b.id and status!='Cancelada'and(month(datetime)=month(curdate())or month(datetime)=month(curdate()-interval 1 month)or month(datetime)=month(curdate()-interval 2 month))group by item)b on month=b.item");

        // Define response
        return res.status(200).send({ status: "success", data: article });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.create = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: article/create |";

        // Verify parameters
        if (!req.body.article || typeof req.body.article.provider != "number" || typeof req.body.article.brand != "string" || req.body.article.brand == "" || typeof req.body.article.category != "string" || req.body.article.category == "" || typeof req.body.article.code != "string" || req.body.article.code == "" || typeof req.body.article.name != "string" || req.body.article.name == "" || typeof req.body.article.stock_code != "string" || req.body.article.stock_code == "") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define article
        let article = req.body.article;

        // Verify provider
        await storage.exists_row(req, res, session, "select*from provider where id=" + article.provider);

        // Verify article
        article.brand = article.brand.replace(/'/gi, "").toUpperCase();
        article.category = article.category.replace(/'/gi, "").toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, m => m.toUpperCase());
        article.code = article.code.replace(/'/gi, "");
        article.name = article.name.replace(/'/gi, "");
        await storage.empty_row(req, res, session, "select*from article where brand='" + article.brand + "'and category='" + article.category + "'and code='" + article.code + "'and name='" + article.name + "'");

        // Verify brand
        if (!await storage.valid_row(req, res, session, "select*from brand where name='" + article.brand + "'")) {

            // Create brand
            await storage.run_query(req, res, session, "insert into brand (name) values ('" + article.brand + "')");
        };

        // Verify category
        if (!await storage.valid_row(req, res, session, "select*from category where name='" + article.category + "'")) {

            // Create category
            await storage.run_query(req, res, session, "insert into category (name) values ('" + article.category + "')");
        };

        // Create article
        article.cost = typeof article.cost == "number" ? parseFloat(article.cost) : "null";
        article.size = article.size ? article.size.replace(/'/gi, "") : "";
        article.variety = article.variety ? article.variety.replace(/'/gi, "") : "";
        article.stock_code = article.stock_code.replace(/'/gi, "");
        article.description = article.description ? article.description.replace(/'/gi, "") : "";
        article.id = await storage.get_id(req, res, session, "insert into article (provider,brand,category,code,name,size,variety,stock_code,cost,description) values (" + article.provider + ",'" + article.brand + "','" + article.category + "','" + article.code + "','" + article.name + "','" + article.size + "','" + article.variety + "','" + article.stock_code + "'," + article.cost + ",'" + article.description + "')");

        // Create price default measure: units
        await storage.run_query(req, res, session, "insert into price (article,measure) values (" + article.id + ",'Unidad')");

        // Define response
        return res.status(200).send({ status: "success", data: article.id });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.update = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: article/update |";

        // Verify parameters
        if (!req.body.article || typeof req.body.article.id != "number" || typeof req.body.article.provider != "number" || typeof req.body.article.brand != "string" || req.body.article.brand == "" || typeof req.body.article.category != "string" || req.body.article.category == "" || typeof req.body.article.code != "string" || req.body.article.code == "" || typeof req.body.article.name != "string" || req.body.article.name == "" || typeof req.body.article.stock_code != "string" || req.body.article.stock_code == "") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define article
        let article = req.body.article;
        await storage.exists_row(req, res, session, "select*from article where id=" + article.id);

        // Verify provider
        await storage.exists_row(req, res, session, "select*from provider where id=" + article.provider);

        // Verify article
        article.brand = article.brand.replace(/'/gi, "").toUpperCase();
        article.category = article.category.replace(/'/gi, "").toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, m => m.toUpperCase());
        article.code = article.code.replace(/'/gi, "");
        article.name = article.name.replace(/'/gi, "");
        await storage.empty_row(req, res, session, "select*from article where brand='" + article.brand + "'and category='" + article.category + "'and code='" + article.code + "'and name='" + article.name + "'and id!=" + article.id);

        // Verify brand
        if (!await storage.valid_row(req, res, session, "select*from brand where name='" + article.brand + "'")) {

            // Create brand
            await storage.run_query(req, res, session, "insert into brand (name) values ('" + article.brand + "')");
        };

        // Verify category
        if (!await storage.valid_row(req, res, session, "select*from category where name='" + article.category + "'")) {

            // Create category
            await storage.run_query(req, res, session, "insert into category (name) values ('" + article.category + "')");
        };

        // Create article
        article.cost = typeof article.cost == "number" ? parseFloat(article.cost) : "null";
        article.size = article.size ? article.size.replace(/'/gi, "") : "";
        article.variety = article.variety ? article.variety.replace(/'/gi, "") : "";
        article.stock_code = article.stock_code.replace(/'/gi, "");
        article.description = article.description ? article.description.replace(/'/gi, "") : "";
        await storage.run_query(req, res, session, "update article set provider=" + article.provider + ",brand='" + article.brand + "',category='" + article.category + "',code='" + article.code + "',name='" + article.name + "',size='" + article.size + "',variety='" + article.variety + "',stock_code='" + article.stock_code + "',cost=" + article.cost + ",description='" + article.description + "'where id=" + article.id);

        // Define response
        return res.status(200).send({ status: "success" });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.active = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: article/active |";

        // Verify parameters
        if (!req.body.article || typeof req.body.article.id != "number") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define article
        let article = req.body.article;
        await storage.exists_row(req, res, session, "select*from article where id=" + article.id);

        // Update user
        await storage.run_query(req, res, session, "update article set active=!active where id=" + article.id);

        // Define response
        return res.status(200).send({ status: "success" });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.addMeasure = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: article/addMeasure |";

        // Verify parameters
        if (!req.body.price || typeof req.body.price.article != "number" || typeof req.body.price.measure != "string" || req.body.price.measure == "" || typeof req.body.price.units != "number") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define price
        let price = req.body.price;
        await storage.exists_row(req, res, session, "select*from article where id=" + price.article);
        price.measure = price.measure.replace(/'/gi, "").toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, m => m.toUpperCase());
        await storage.empty_row(req, res, session, "select*from price where measure='" + price.measure + "'and article=" + price.article);
        await storage.run_query(req, res, session, "insert into price (article,units,measure) values (" + price.article + "," + price.units + ",'" + price.measure + "')");

        // Define response
        return res.status(200).send({ status: "success" });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.updateMeasure = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: article/updateMeasure |";

        // Verify parameters
        if (!req.body.price || typeof req.body.price.id != "number" || typeof req.body.price.article != "number" || typeof req.body.price.measure != "string" || req.body.price.measure == "") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define price
        let price = req.body.price;
        await storage.exists_row(req, res, session, "select*from price where id=" + price.id);
        price.measure = price.measure.replace(/'/gi, "").toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, m => m.toUpperCase());
        await storage.empty_row(req, res, session, "select*from price where measure='" + price.measure + "'and article=" + price.article + " and id!=" + price.id);
        await storage.run_query(req, res, session, "update price set measure='" + price.measure + "',units=" + price.units + " where id=" + price.id);

        // Define response
        return res.status(200).send({ status: "success" });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.deleteMeasure = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: article/deleteMeasure |";

        // Verify parameters
        if (!req.body.price || typeof req.body.price.id != "number") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define price
        let price = req.body.price;
        await storage.exists_row(req, res, session, "select*from price where id=" + price.id);
        await storage.run_query(req, res, session, "delete from price where id=" + price.id);

        // Define response
        return res.status(200).send({ status: "success" });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.updatePrices = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: article/updatePrices |";

        // Verify parameters
        if (!req.body.price || typeof req.body.price.id != "number") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define price
        let price = req.body.price;
        await storage.exists_row(req, res, session, "select*from price where id=" + price.id);
        price.price_list = typeof price.price_list == "number" ? parseFloat(price.price_list) : "null";
        price.price_offer = typeof price.price_offer == "number" ? parseFloat(price.price_offer) : "null";
        await storage.run_query(req, res, session, "update price set price_list=" + price.price_list + ",price_offer=" + price.price_offer + " where id=" + price.id);

        // Define response
        return res.status(200).send({ status: "success" });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.updateStock = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: article/updateStock |";

        // Verify parameters
        if (typeof req.body.username != "string" || req.body.username == "" || !req.body.article || typeof req.body.article.id != "number" || typeof req.body.article.units != "number" || typeof req.body.article.description != "string" || req.body.article.description == "") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define username
        let username = req.body.username;
        username = username.replace(/'/gi, "");
        await storage.exists_row(req, res, session, "select*from user where username='" + username + "'");

        // Define article
        let article = req.body.article;
        await storage.exists_row(req, res, session, "select*from article where id=" + article.id);
        article.description = article.description ? article.description.replace(/'/gi, "") : "";
        await storage.run_query(req, res, session, "insert into stock (user,article,units,description) values ('" + username + "'," + article.id + "," + article.units + ",'" + article.description + "')");

        // Define response
        return res.status(200).send({ status: "success" });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.exportPrices = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: customer/exportPrices |";

        // Define username
        let username = req.body.username;
        username = username.replace(/'/gi, "");
        let user = await storage.get_row(req, res, session, "select*from user where username='" + username + "'");

        // Get articles
        let articles = await storage.get_data(req, res, session, "select pr.id,article,provider,fantasy_name,code,brand,a.name,size,variety,measure,units,price_list,price_offer from price pr left join article a on article=a.id left join provider p on provider=p.id where a.active and p.active order by brand,a.name,units");

        // Read HTML Template
        let html = fs.readFileSync("./templates/report.html", "utf8");
        let bodyHTML = fs.readFileSync("./templates/reports/prices.html", "utf8");
        html = html.replace("{{HTML}}", bodyHTML);

        // Complete Template
        let itemsHTML = "";
        if (articles.length == 0) {
            itemsHTML += `
            <tr>
                <td colspan="4">No existen registros</td>
            </tr>`;
        } else {
            for (let item of articles) {
                itemsHTML += `
                <tr>
                    <td>${item.code}</td>
                    <td>${item.brand} ${item.name} ${item.size} ${item.variety}<br>${item.measure} x ${item.units}</td>
                    <td style="text-align: right;">$ ${item.price_list ? item.price_list.toFixed(2) : "-"}</td>
                    <td style="text-align: right;">$ ${item.price_offer ? item.price_offer.toFixed(2) : "-"}</td>
                </tr>`;
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

exports.exportStock = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: customer/exportStock |";

        // Define username
        let username = req.body.username;
        username = username.replace(/'/gi, "");
        let user = await storage.get_row(req, res, session, "select*from user where username='" + username + "'");

        // Get articles
        let articles = await storage.get_data(req, res, session, "select a.id,provider,fantasy_name,brand,category,code,a.name,size,variety,ifnull(sum(s.units),0)stock,a.active from article a left join provider p on provider=p.id left join(select article,units from buy_detail,buy where buy=id and article and status='Aprobada'union all select article,-stock from sale_detail,sale s where sale=s.id and article and review and status!='Cancelada'and status!='Inicial'union all select article,units from stock)s on s.article=a.id group by id order by brand,a.name,description");

        // Read HTML Template
        let html = fs.readFileSync("./templates/report.html", "utf8");
        let bodyHTML = fs.readFileSync("./templates/reports/stock.html", "utf8");
        html = html.replace("{{HTML}}", bodyHTML);

        // Complete Template
        let itemsHTML = "";
        if (articles.length == 0) {
            itemsHTML += `
            <tr>
                <td colspan="3">No existen registros</td>
            </tr>`;
        } else {
            for (let item of articles) {
                itemsHTML += `
                <tr>
                    <td>${item.code}</td>
                    <td>${item.brand} ${item.name} ${item.size} ${item.variety}</td>
                    <td style="text-align: right;">${item.stock}</td>
                </tr>`;
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

exports.exportSales = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: customer/exportSales |";

        // Define username
        let username = req.body.username;
        username = username.replace(/'/gi, "");
        let user = await storage.get_row(req, res, session, "select*from user where username='" + username + "'");

        // Get article
        let article = req.body.article;
        article = await storage.get_row(req, res, session, "select*from article where id=" + article.id);
        article.sales = await storage.get_data(req, res, session, "select sale,datetime,quantity,measure,price,subtotal,fantasy_name from sale_detail,sale s,customer c where sale=s.id and customer=c.id and article=" + article.id + " and status!='Cancelada'and status!='Inicial'and subtotal > 0 order by datetime desc");

        // Read HTML Template
        let html = fs.readFileSync("./templates/report.html", "utf8");
        let bodyHTML = fs.readFileSync("./templates/reports/sales.html", "utf8");
        html = html.replace("{{HTML}}", bodyHTML);

        // Complete Template
        html = html.replace("{{ID}}", article.id);
        html = html.replace("{{BRAND}}", article.brand);
        html = html.replace("{{CATEGORY}}", article.category);
        html = html.replace("{{NAME}}", article.name);
        html = html.replace("{{CODE}}", article.code);
        let itemsHTML = "";
        if (!article.sales || article.sales.length == 0) {
            itemsHTML += `
            <tr>
                <td colspan="4">No existen registros</td>
            </tr>`;
        } else {
            for (let item of article.sales) {
                itemsHTML += `
                <tr>
                    <td>${moment(item.datetime).format("DD-MM-YYYY")}<br>${moment(item.datetime).format("HH:mm")}</td>
                    <td>${item.fantasy_name}</td>
                    <td>${item.quantity} ${item.measure} x $ ${item.price ? (item.price.toFixed(2)) : "-"}</td>
                    <td style="text-align: right;">$ ${item.subtotal ? (item.subtotal.toFixed(2)) : "-"}</td>
                </tr>`;
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
