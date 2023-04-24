// Define modules
const dotenv = require("dotenv");
const storage = require("../modules/storage");
const moment = require("moment");

// Define credentials
dotenv.config({ path: "./config.env" });

exports.getAll = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: user/getAll |";

        // Define filter
        let filter = await storage.whereObj(req.body.filter || []);

        // Hide native users
        filter += (filter == "" ? "where " : "and ") + "month<curdate()";

        // Define license
        let license = await storage.get_data(req, res, session, "select*from license " + filter + "order by month desc");

        // Define response
        return res.status(200).send({ status: "success", data: license });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};
