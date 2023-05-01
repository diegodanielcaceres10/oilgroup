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

        // Define licenses
        let licenses = await storage.get_data(req, res, session, "select l.*, sum(p.total)payments from license l left join license_payment p on l.id=license and p.status='Aprobado'" + filter + "group by month order by month desc");
        let current = this.licenses && this.licenses.find(i => i.current);
        if (current) {
            if (current.coefficient_validate) {
                let timezone = process.env.TIMEZONE || 0;
                let validatetime = current.coefficient_validate && moment(current.coefficient_validate).add(timezone, "hours").add(-1, "minutes").format("YYYY-MM-DD, HH:mm:ss");
                if (validatetime < moment().format("YYYY-MM-DD, HH:mm:ss")) {
                    current.coefficient = undefined;
                    current.coefficient_date = undefined;
                    current.coefficient_validate = undefined;
                    await storage.run_query(req, res, session, "update license set coefficient_validate=null where id=" + item.id);
                }
            }
        }

        // Define response
        return res.status(200).send({ status: "success", data: licenses });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.price = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: license/price |";

        // Verify parameters
        if (!req.body.license || typeof req.body.license.id != "number" || typeof req.body.license.coefficient != "number" || typeof req.body.license.coefficient_date != "string" || typeof req.body.license.coefficient_validate != "string") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define license
        let license = req.body.license;
        await storage.exists_row(req, res, session, "select*from license where id=" + license.id + " and current='1'");

        // Update license
        license.coefficient_date = moment(license.coefficient_date).format("YYYY-MM-DD HH:mm:ss");
        license.coefficient_validate = moment(license.coefficient_validate).format("YYYY-MM-DD HH:mm:ss");
        await storage.run_query(req, res, session, "update license set coefficient='" + license.coefficient + "',coefficient_date='" + license.coefficient_date + "',coefficient_validate='" + license.coefficient_validate + "'where id=" + license.id);

        // Define response
        return res.status(200).send({ status: "success" });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.remove = async (req, res) => {
    try {
        let session = "Username: " + (req.body.username || "undefined") + " | API: license/remove |";

        // Verify parameters
        if (!req.body.license || typeof req.body.license.id != "number") {
            console.error(moment().format(), session, "parameters error");
            console.log(req.body);
            return res.status(400).send();
        };

        // Define license
        let license = req.body.license;
        let currentcoefficient = await storage.get_row(req, res, session, "select*from license where id=" + license.id + " and current='1'and status='Pendiente'");
        let timezone = process.env.TIMEZONE || 0;
        let validatetime = currentcoefficient.coefficient_validate && moment(currentcoefficient.coefficient_validate).add(timezone, "hours").format("YYYY-MM-DD, HH:mm:ss");
        if (validatetime < moment().format("YYYY-MM-DD, HH:mm:ss")) {
            await storage.run_query(req, res, session, "update license set coefficient=null,coefficient_date=null,coefficient_validate=null where id=" + license.id);

            // Define response
            return res.status(200).send({ status: "success", remove: true });
        } else {
            
            // Define response
            return res.status(200).send({ status: "success" });
        }
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
