// Define modules
const pdf = require("html-pdf");
const moment = require("moment");

exports.create = (req, res, session, html) => {
    return new Promise((resolve, reject) => {

        const options = {
            "format": "Letter",
            "border": {
                "top": "1cm",
                "right": "1cm",
                "bottom": "2cm",
                "left": "1cm"
            },
        };
        pdf.create(html, options).toFile("./ticket.pdf", function (err, data) {
            if (err) {
                console.error(moment().format(), session, err);
                return res.status(500).send({ status: err });
            };
            console.log(moment().format(), session, "pdf create successfully");
            return resolve(data.filename);
        });
    });
};
