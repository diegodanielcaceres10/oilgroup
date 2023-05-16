// Define modules
const pdfCreator = require("pdf-creator-node");
const moment = require("moment");
const fs = require("fs");

exports.create = (html, user) => {
    return new Promise((resolve, reject) => {
        try {
            // Read HTML Template
            let htmlbase = fs.readFileSync("./templates/report.html", "utf8");
            html = htmlbase.replace("{{HTML}}", html);
            html = html.replace("font-size: 18px;", "font-size: 16px;");
            html = html.replace("font-size: 12px;", "font-size: 8px;");
            html = html.replace("font-size: 10px;", "font-size: 6px;");

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
                    contents: `<div style="display: block;height: 30px;text-align: right;"><img style="border 1px solid blue;height: 25px;" alt="Your Logo" src="https://res.cloudinary.com/octo-mode/image/upload/v1681951247/oilgroup/logo_u42sgn.png" /></div>`,
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
