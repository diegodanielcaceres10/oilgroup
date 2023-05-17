// Define modules
const moment = require("moment");
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const dotenv = require("dotenv");
const fs = require("fs");

// Define credentials
dotenv.config({ path: "./config.env" });

let config = {
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.MAIL_USER,
        clientId: process.env.MAIL_CLIENT_ID,
        clientSecret: process.env.MAIL_CLIENT_SECRET,
        refreshToken: process.env.MAIL_REFRESH_TOKEN,
    },
}

createMail = html => {
    try {
        html = html.replace("{{ENVIRONMENT}}", process.env.ENVIRONMENT ? `<div style="width: 100%; text-align: center; padding: 10px 0;"><span style="padding: 5px 15px; background-color: lightgray; border-radius: 5px; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">Ambiente: ${process.env.ENVIRONMENT}</span></div>` : "");
        const OAuth2Client = new google.auth.OAuth2(
            process.env.MAIL_CLIENT_ID,
            process.env.MAIL_CLIENT_SECRET,
            "https://developers.google.com/oauthplayground",
        );
        OAuth2Client.setCredentials({
            refresh_token: process.env.MAIL_REFRESH_TOKEN,
            tls: {
                rejectUnauthorized: false,
            },
        });
        // Generate the token
        OAuth2Client.getAccessToken((err, token) => {
            if (err) {
                logservice.error(err, "Mailer API Error");
            }
            config.accessToken = token;

            // Create the email envelope (transport)
            const transport = nodemailer.createTransport(config);

            // Create the email options and body 
            const mailOptions = {
                from: process.env.MAIL_SENDER,
                to: process.env.MAIL_RECEIVER,
                subject: "Comprobante de pago",
                html: html,
            }

            // Set up the email options and delivering it
            transport.sendMail(mailOptions);
            console.log(moment().format(), "Notification sended");
        });
    } catch (error) {
        console.error(moment().format(), err);
    }
}

exports.notification = async (data) => {
    try {
        // Read HTML Template
        let html = fs.readFileSync("./templates/email/payment.html", "utf8");

        // Complete html
        html = html.replace("{{PAYMENT-MONTH}}", data.month);
        html = html.replace("{{PAYMENT-IMAGE}}", data.image);

        // Send notification
        return await createMail(html);
    } catch (err) {
        throw err;
    }
}
