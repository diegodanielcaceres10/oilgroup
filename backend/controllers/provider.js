// Define modules
const storage = require("../modules/storage");
const moment = require("moment");

exports.getAll = async (req, res) => {
    try {
        let session = "Username: " + (req.headers.username || "undefined") + " | API: provider/getAll |";

        // Define filter
        let filter = await storage.whereObj(req.body.filter || []);

        // Define providers
        let providers = await storage.get_data(req, res, session, "select*,sum(case when status!='Aprobado'then total else 0 end)buy,sum(case when status='Aprobado'then -(total) else 0 end)payment,ifnull(sum(total),0)pending from provider p left join(select provider,total,status from buy where status!='Cancelada'and status!='Inicial'union all select provider,-(import),status from provider_payment where status='Aprobado')b on provider=id " + filter + "group by id order by fantasy_name");

        // Define response
        return res.status(200).send({ status: "success", data: providers });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.find = async (req, res) => {
    try {
        let session = "Username: " + (req.headers.username || "undefined") + " | API: provider/find |";

        // Verify parameters
        if (!req.body.provider || typeof req.body.provider.id != "number") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define provider
        let provider = req.body.provider;
        provider = await storage.get_row(req, res, session, "select*,sum(case when status!='Aprobado'then total else 0 end)buy,sum(case when status='Aprobado'then -(total) else 0 end)payment,ifnull(sum(total),0)pending from provider left join(select provider,total,status from buy where status!='Cancelada'and status!='Inicial'union all select provider,-(import),status from provider_payment where status='Aprobado')b on provider=id where id=" + provider.id);
        provider.articles = await storage.get_data(req, res, session, "select*from article where provider=" + provider.id);
        provider.buys = await storage.get_data(req, res, session, "select id,('buy')typeof,datetime,total,status from buy where provider=" + provider.id + " and status!='Inicial'union all select id,'payment',datetime,import,status from provider_payment where provider=" + provider.id + " order by datetime desc,typeof");

        // Define response
        return res.status(200).send({ status: "success", data: provider });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.create = async (req, res) => {
    try {
        let session = "Username: " + (req.headers.username || "undefined") + " | API: provider/create |";

        // Verify parameters
        if (!req.body.provider || typeof req.body.provider.fantasy_name != "string" || req.body.provider.fantasy_name == "" || typeof req.body.provider.name != "string" || req.body.provider.name == "" || typeof req.body.provider.tax_condition != "string" || req.body.provider.tax_condition == "") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define provider
        let provider = req.body.provider;
        provider.fantasy_name = provider.fantasy_name.replace(/'/gi, "").toUpperCase();
        await storage.empty_row(req, res, session, "select*from provider where fantasy_name='" + provider.fantasy_name + "'");

        // Create provider
        provider.document = provider.document ? provider.document.replace(/'/gi, "") : "";
        provider.name = provider.name.replace(/'/gi, "");
        provider.phone = provider.phone ? provider.phone.replace(/'/gi, "") : "";
        provider.email = provider.email ? provider.email.replace(/'/gi, "") : "";
        provider.tax_condition = provider.tax_condition.replace(/'/gi, "");
        provider.id = await storage.get_id(req, res, session, "insert into provider(fantasy_name,document,name,phone,email,tax_condition)values('" + provider.fantasy_name + "','" + provider.document + "','" + provider.name + "','" + provider.phone + "','" + provider.email + "','" + provider.tax_condition + "')");

        // Define response
        return res.status(200).send({ status: "success", data: provider.id });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.update = async (req, res) => {
    try {
        let session = "Username: " + (req.headers.username || "undefined") + " | API: provider/update |";

        // Verify parameters
        if (!req.body.provider || typeof req.body.provider.id != "number" || typeof req.body.provider.fantasy_name != "string" || req.body.provider.fantasy_name == "" || typeof req.body.provider.name != "string" || req.body.provider.name == "" || typeof req.body.provider.tax_condition != "string" || req.body.provider.tax_condition == "") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define provider
        let provider = req.body.provider;
        await storage.exists_row(req, res, session, "select*from provider where id=" + provider.id);

        // Verify provider
        provider.fantasy_name = provider.fantasy_name.replace(/'/gi, "").toUpperCase();
        await storage.empty_row(req, res, session, "select*from provider where fantasy_name='" + provider.fantasy_name + "'and id!=" + provider.id);

        // Update provider
        provider.document = provider.document ? provider.document.replace(/'/gi, "") : "";
        provider.name = provider.name.replace(/'/gi, "");
        provider.phone = provider.phone ? provider.phone.replace(/'/gi, "") : "";
        provider.email = provider.email ? provider.email.replace(/'/gi, "") : "";
        provider.tax_condition = provider.tax_condition.replace(/'/gi, "");
        await storage.run_query(req, res, session, "update provider set fantasy_name='" + provider.fantasy_name + "',document='" + provider.document + "',name='" + provider.name + "',phone='" + provider.phone + "',email='" + provider.email + "',tax_condition='" + provider.tax_condition + "'where id=" + provider.id);

        // Define response
        return res.status(200).send({ status: "success" });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.active = async (req, res) => {
    try {
        let session = "Username: " + (req.headers.username || "undefined") + " | API: provider/active |";

        // Verify parameters
        if (!req.body.provider || typeof req.body.provider.id != "number") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define provider
        let provider = req.body.provider;
        await storage.exists_row(req, res, session, "select*from provider where id=" + provider.id);

        // Update user
        await storage.run_query(req, res, session, "update provider set active=!active where id=" + provider.id);

        // Define response
        return res.status(200).send({ status: "success" });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};
