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
        let session = "Username: " + (req.body.username || "undefined") + " | API: user/getAll |";

        // Define filter
        let filter = await storage.whereObj(req.body.filter || []);

        // Hide native users
        filter += filter == "" ? "where role!='Super Administrador'and username!='admin'and username!='supervisor'and username!='operator'" : "and role!='Super Administrador'and username!='admin'and username!='supervisor'and username!='operator'";
        let users = await storage.get_data(req, res, session, "select username,lastname,firstname,phone,email,role,type,active from user " + filter + "order by lastname,firstname,username");

        // Define response
        return res.status(200).send({ status: "success", data: users });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.find = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: user/find |";

        // Verify parameters
        if (!req.body.user || typeof req.body.user.username != "string" || req.body.user.username == "") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define user
        let user = req.body.user;
        user.username = user.username.replace(/'/gi, "").toLowerCase();
        user = await storage.get_row(req, res, session, "select username,lastname,firstname,phone,email,role,type,active from user where username='" + user.username + "'and username!='admin'and username!='supervisor'and username!='operator'");
        user.sales = await storage.get_data(req, res, session, "select s.id,datetime,fantasy_name,total,status from sale s left join customer c on customer=c.id where s.user='" + user.username + "'and status!='Inicial'order by datetime desc");

        // Define response
        return res.status(200).send({ status: "success", data: user });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.create = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: user/create |";

        // Verify parameters
        if (!req.body.user || typeof req.body.user.lastname != "string" || req.body.user.lastname == "" || typeof req.body.user.firstname != "string" || req.body.user.firstname == "" || ["Administrador", "Vendedor"].indexOf(req.body.user.role) == -1) {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define user
        let user = req.body.user;
        user.username = user.firstname.replace(/'| /gi, "").toLowerCase() + user.lastname.replace(/'| /gi, "").toLowerCase();
        await storage.empty_row(req, res, session, "select*from user where username='" + user.username + "'");
        user.pass = "";
        let letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (let i = 0; i < 8; i++) {
            user.pass += letters[Math.floor(Math.random() * 62)];
        };
        user.lastname = user.lastname.replace(/'/gi, "").toUpperCase();
        user.firstname = user.firstname.replace(/'/gi, "").toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, m => m.toUpperCase());
        user.phone = user.phone ? user.phone.replace(/'/gi, "") : "";
        user.email = user.email ? user.email.replace(/'/gi, "") : "";
        user.id = await storage.run_query(req, res, session, "insert into user(username,pass,lastname,firstname,phone,email,role)values('" + user.username + "',sha1('" + user.pass + "'),'" + user.lastname + "','" + user.firstname + "','" + user.phone + "','" + user.email + "','" + user.role + "')");

        // Define response
        return res.status(200).send({ status: "success", data: user.pass });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.update = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: user/update |";

        // Verify parameters
        if (!req.body.user || typeof req.body.user.username != "string" || req.body.user.username == "" || typeof req.body.user.lastname != "string" || req.body.user.lastname == "" || typeof req.body.user.firstname != "string" || req.body.user.firstname == "" || ["Administrador", "Vendedor"].indexOf(req.body.user.role) == -1) {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define user
        let user = req.body.user;
        user.username = user.username.replace(/'/gi, "").toLowerCase();
        await storage.exists_row(req, res, session, "select*from user where username='" + user.username + "'and username!='admin'and username!='supervisor'and username!='operator'");

        // Update user
        user.lastname = user.lastname.replace(/'/gi, "").toUpperCase();
        user.firstname = user.firstname.replace(/'/gi, "").toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, m => m.toUpperCase());
        user.phone = user.phone ? user.phone.replace(/'/gi, "") : "";
        user.email = user.email ? user.email.replace(/'/gi, "") : "";
        await storage.run_query(req, res, session, "update user set lastname='" + user.lastname + "',firstname='" + user.firstname + "',firstname='" + user.firstname + "',phone='" + user.phone + "',email='" + user.email + "',role='" + user.role + "'where username='" + user.username + "'");

        // Define response
        return res.status(200).send({ status: "success" });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.reset = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: user/reset |";

        // Verify parameters
        if (!req.body.user || typeof req.body.user.username != "string" || req.body.user.username == "") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define user
        let user = req.body.user;
        user.username = user.username.replace(/'/gi, "").toLowerCase();
        await storage.exists_row(req, res, session, "select*from user where username='" + user.username + "'and username!='admin'and username!='supervisor'and username!='operator'");

        // Update user
        user.pass = "";
        let letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (let i = 0; i < 8; i++) {
            user.pass += letters[Math.floor(Math.random() * 62)];
        };
        await storage.run_query(req, res, session, "update user set pass=sha1('" + user.pass + "')where username='" + user.username + "'");

        // Define response
        return res.status(200).send({ status: "success", data: user.pass });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.active = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: user/active |";

        // Verify parameters
        if (!req.body.user || typeof req.body.user.username != "string" || req.body.user.username == "") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define user
        let user = req.body.user;
        user.username = user.username.replace(/'/gi, "").toLowerCase();
        await storage.exists_row(req, res, session, "select*from user where username='" + user.username + "'and username!='admin'and username!='supervisor'and username!='operator'");

        // Update user
        await storage.run_query(req, res, session, "update user set active=!active where username='" + user.username + "'");

        // Define response
        return res.status(200).send({ status: "success" });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.edit = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: user/edit |";

        // Verify parameters
        if (!req.body.user || typeof req.body.user.username != "string" || req.body.user.username == "" || typeof req.body.user.phone != "string" || req.body.user.phone == "" || typeof req.body.user.email != "string" || req.body.user.email == "") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define user
        let user = req.body.user;
        user.username = user.username.replace(/'/gi, "").toLowerCase();
        await storage.exists_row(req, res, session, "select*from user where username='" + user.username + "'and username!='admin'and username!='supervisor'and username!='operator'");

        // Update user
        user.phone = user.phone.replace(/'/gi, "");
        user.email = user.email.replace(/'/gi, "");
        await storage.run_query(req, res, session, "update user set phone='" + user.phone + "',email='" + user.email + "'where username='" + user.username + "'");

        // Define response
        return res.status(200).send({ status: "success" });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.editPassword = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: user/editPassword |";

        // Verify parameters
        if (!req.body.user || typeof req.body.user.username != "string" || req.body.user.username == "" || typeof req.body.user.pass != "string" || req.body.user.pass == "" || typeof req.body.user.value != "string" || req.body.user.value == "") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define user
        let user = req.body.user;
        user.username = user.username.replace(/'/gi, "").toLowerCase();
        user.pass = user.pass.replace(/'/gi, "");
        await storage.exists_row(req, res, session, "select*from user where username='" + user.username + "'and username!='admin'and username!='supervisor'and username!='operator'and pass=sha1('" + user.pass + "')and active");

        // Update user
        user.value = user.value.replace(/'/gi, "");
        await storage.run_query(req, res, session, "update user set pass=sha1('" + user.value + "')where username='" + user.username + "'");

        // Define response
        return res.status(200).send({ status: "success" });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.summary = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: user/summary |";

        // Verify parameters
        if (!req.body.user || typeof req.body.user.username != "string" || req.body.user.username == "") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define username
        let username = req.body.username;
        username = username.replace(/'/gi, "");
        let curretnUser = await storage.get_row(req, res, session, "select*from user where username='" + username + "'");

        // Define user
        let user = req.body.user;
        user.username = user.username.replace(/'/gi, "").toLowerCase();
        user = await storage.get_row(req, res, session, "select username,lastname,firstname,phone,email,role,type,active from user where username='" + user.username + "'and username!='admin'and username!='supervisor'and username!='operator'");
        user.customers = await storage.get_data(req, res, session, "select id,fantasy_name,document,name,address,city,sum(case when s.status!='Aprobado'then total else 0 end)sale,sum(case when s.status='Aprobada'then total else 0 end)success,sum(case when billing then total else 0 end)billing,sum(case when s.status='Aprobado'then -(total) else 0 end)payment,ifnull(sum(total),0)pending from customer c left join user on user=username left join(select customer,total,billing,status from sale where status!='Cancelada'and status!='Inicial'union all select customer,-(import),0,status from customer_payment where status='Aprobado')s on customer=id where user='" + user.username + "'group by id order by fantasy_name");

        // Read HTML Template
        let html = fs.readFileSync("./templates/summarys.html", "utf8");
        html = html.replace("{{USERNAME}}", user.username);
        html = html.replace("{{NAME}}", user.lastname + " " + user.firstname);
        let itemsHTML = "";
        for (let item of user.customers) {
            itemsHTML += `<tr style="border-bottom: 1px solid;">
            <td style="white-space: pre;">${item.document}</td>
            <td><b>${item.fantasy_name}</b><br>${item.name}</b><br>${item.address}${item.address && item.city ? (" - " + item.city) : ""}</td>
            <td style="text-align: right;">$ ${item.pending.toFixed(2)}</td>
            </tr>`;
        }
        if (user.customers.length == 0) {
            itemsHTML += `<tr style="border-bottom: 1px solid;">
            <td style="white-space: pre;"></td>
            <td>No existen registros</td>
            <td style="text-align: right;"></td>
            </tr>`;
        }
        html = html.replace("{{ITEMS}}", itemsHTML);
        html = html.replace("{{USER}}", curretnUser.lastname + " " + curretnUser.firstname);
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
