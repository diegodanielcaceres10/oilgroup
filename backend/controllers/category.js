// Define modules
const storage = require("../modules/storage");
const moment = require("moment");

exports.getAll = async (req, res) => {
    try {
        let session = "Username: " + (req.headers.username || "undefined") + " | API: category/getAll |";

        // Define filter
        let filter = await storage.whereObj(req.body.filter || []);

        // Get categories
        let categories = await storage.get_data(req, res, session, "select c.name,count(id)count from category c left join article on c.name=category " + filter + "group by c.name order by name");

        // Define response
        return res.status(200).send({ status: "success", data: categories });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.update = async (req, res) => {
    try {
        let session = "Username: " + (req.headers.username || "undefined") + " | API: category/update |";

        // Verify parameters
        if (!req.body.category || typeof req.body.category.name != "string" || req.body.category.name == "" || typeof req.body.category.value != "string" || req.body.category.value == "") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define category
        let category = req.body.category;
        category.name = category.name.replace(/'/gi, "").toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, m => m.toUpperCase());
        await storage.exists_row(req, res, session, "select*from category where name='" + category.name + "'");
        category.value = category.value.replace(/'/gi, "").toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, m => m.toUpperCase());
        await storage.empty_row(req, res, session, "select*from category where name='" + category.value + "'and name!='" + category.name + "'");
        await storage.run_query(req, res, session, "update category set name='" + category.value + "'where name='" + category.name + "'");

        // Define response
        return res.status(200).send({ status: "success" });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};
