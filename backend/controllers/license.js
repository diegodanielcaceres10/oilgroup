// Define modules
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const dotenv = require("dotenv");
const storage = require("../modules/storage");
const moment = require("moment");

// Define credentials
dotenv.config({ path: "./config.env" });

exports.getAll = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: license/getAll |";

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

exports.price = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: license/price |";

        // Verify parameters
        if (!req.body.price || typeof req.body.price.id != "number" || typeof req.body.price.coefficient != "number" || typeof req.body.price.coefficient_date != "string") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define price
        let price = req.body.price;
        await storage.exists_row(req, res, session, "select*from license where id=" + price.id + " and current='1'");

        // Update provider
        await storage.run_query(req, res, session, "update license set coefficient='" + price.coefficient + "',coefficient_date='" + price.coefficient_date + "'where id=" + price.id);

        // Define response
        return res.status(200).send({ status: "success" });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.upload = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: license/upload |";

        // Verify parameters
        if (!req.body.id) {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define ticket
        let ticket = req.body;
        await storage.exists_row(req, res, session, "select*from license where id=" + ticket.id + " and status!='Aprobado'and current='1'");

        // Update license
        await storage.run_query(req, res, session, "update license set status='Analisis'where id=" + ticket.id);

        // Create license payment
        let payment = await storage.get_id(req, res, session, "insert into license_payment(license,status)values('" + ticket.id + "','Pendiente')");

        // Define file
        let file = req.files.ticket;
        // Use the mv() method to place the file in upload directory (i.e. "uploads")
        const filename = "./uploads/" + moment().format("YYYY-MM-DD") + "-" + file.name.trim();
        console.log(filename);
        const options = {
            folder: "oilgroup/" + process.env.CLOUDFOLDER + "/",
            use_filename: true,
            unique_filename: true,
        }
        const config = {
            cloud_name: process.env.CLOUDNAME,
            api_key: process.env.CLOUDAPIKEY,
            api_secret: process.env.CLOUDAPISECRET,
        }
        file.mv(filename, err => {
            if (err) {
                console.error(err, "File Upload Error");
                return;
            }
            cloudinary.config(config);
            cloudinary.uploader.upload(filename, options, async (err, result) => {
                setTimeout(() => {
                    fs.unlinkSync(filename);
                }, 1000);
                if (err) {
                    console.error(err, "Cloudinary API Error");
                    return;
                }
                console.log("file upload to cloudinary | url: ", result.secure_url);

                // Update license
                await storage.run_query(req, res, session, "update license_payment set link='" + result.secure_url + "'where id=" + payment);
            });
        });

        // Define response
        return res.status(200).send({ status: "success" });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};
