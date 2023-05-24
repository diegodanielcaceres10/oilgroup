// Define modules
const pdfCreator = require("pdf-creator-node");
const dotenv = require("dotenv");
const moment = require("moment");
const fs = require("fs");

// Define credentials
dotenv.config({ path: "./config.env" });

exports.create = (html, user, header = true) => {
    return new Promise((resolve, reject) => {
        try {
            // Read HTML Template
            let htmlbase = fs.readFileSync("./templates/report.html", "utf8");
            html = htmlbase.replace("{{HTML}}", html);
            if (process.env.ENVIRONMENT != "Local") {
                html = html.replace("font-size: 12px;", "font-size: 8px;");
                html = html.replace("font-size: 16px;", "font-size: 12px;");
                html = html.replace("font-size: 11px;", "font-size: 7px;");
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
                border: "5mm",
                header: header && {
                    height: "50px",
                    contents: `<div style="display: block;border-bottom: 1px solid #efefef;${process.env.ENVIRONMENT != "Local" ? "height: 20px;" : "height: 30px;"}text-align: right;"><img style="${process.env.ENVIRONMENT != "Local" ? "height: 15px;" : "height: 25px;"}" alt="Your Logo" src="https://res.cloudinary.com/octo-mode/image/upload/v1681951247/oilgroup/logo_u42sgn.png" /></div>`,
                },
                footer: header && {
                    height: "50px",
                    contents: `<div style="border-top: 1px solid #efefef;color: #444;display: block;${process.env.ENVIRONMENT != "Local" ? "font-size: 5px;padding-top: 10px;" : "font-size: 9px;padding-top: 15px;"}"><span style="height: 25px;">{{page}} de {{pages}} - Generado por ${user} el día ${moment().format("DD/MM/YYYY")} a las ${moment().format("HH:mm")}</span></div>`,
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
