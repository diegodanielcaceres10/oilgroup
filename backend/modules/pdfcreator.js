// Define modules
const pdfCreator = require("pdf-creator-node");
const dotenv = require("dotenv");
const moment = require("moment");
const fs = require("fs");

// Define credentials
dotenv.config({ path: "./config.env" });

exports.create = (html, user) => {
    return new Promise((resolve, reject) => {
        try {
            // Read HTML Template
            let htmlbase = fs.readFileSync("./templates/report.html", "utf8");
            html = htmlbase.replace("{{HTML}}", html);
            if (process.env.ENVIRONMENT != "Local") {
                html = html.replace("font-size: 12px;", "font-size: 8px;");
                html = html.replace("font-size: 18px;", "font-size: 16px;");
                html = html.replace("font-size: 10px;", "font-size: 6px;");
            }

            const filename = "./uploads/output.pdf";
            const document = {
                html,
                data: {},
                path: filename,
                type: "",
            };
            const options = {
                format: "A4",
                orientation: "portrait",
                border: "10mm",
                header: {
                    height: "50px",
                    contents: `<div style="display: block;height: 20px;text-align: right;"><img style="height: 15px;" alt="Your Logo" src="https://res.cloudinary.com/octo-mode/image/upload/v1681951247/oilgroup/logo_u42sgn.png" /></div>`,
                },
                footer: {
                    height: "50px",
                    contents: `<div style="display: block;height: 25px;color: #444;"><span style="margin-top: 10px;">{{page}} de {{pages}} - Generado por ${user} el día ${moment().format("DD/MM/YYYY")} a las ${moment().format("HH:mm")}</span></div>`,
                }
            };
            pdfCreator.create(document, options).then(data => {
                console.log(moment().format(), "pdf create successfully");
                resolve(data.filename);
            }).catch(err => {
                console.error(moment().format(), err);
                reject(err);
            });
        } catch (err) {
            console.error(moment().format(), err);
            reject(err);
        }
    });
};
