// Define modules
const storage = require("../modules/storage");
const moment = require("moment");

exports.getAll = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: brand/getAll |";

        // Define filter
        let filter = await storage.whereObj(req.body.filter || []);

        // Get brands
        let brands = await storage.get_data(req, res, session, "select b.name,count(id)count from brand b left join article on b.name=brand " + filter + "group by b.name order by name");

        // Define response
        return res.status(200).send({ status: "success", data: brands });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.update = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: brand/update |";

        // Verify parameters
        if (!req.body.brand || typeof req.body.brand.name != "string" || req.body.brand.name == "" || typeof req.body.brand.value != "string" || req.body.brand.value == "") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define brand
        let brand = req.body.brand;
        brand.name = brand.name.replace(/'/gi, "").toUpperCase();
        await storage.exists_row(req, res, session, "select*from brand where name='" + brand.name + "'");
        brand.value = brand.value.replace(/'/gi, "").toUpperCase();
        await storage.empty_row(req, res, session, "select*from brand where name='" + brand.value + "'and name!='" + brand.name + "'");
        await storage.run_query(req, res, session, "update brand set name='" + brand.value + "'where name='" + brand.name + "'");

        // Define response
        return res.status(200).send({ status: "success" });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};
