const nodemailer = require("nodemailer");
const logger = require("firebase-functions/logger");

const transporter = nodemailer.createTransport({
  host: process.env.SMTPHOST,
  port: process.env.SMTPPORT,
  secure: true,
  auth: {
    user: process.env.SMTPUSER,
    pass: process.env.SMTPPASS,
  },
  tls: { rejectUnauthorized: false, ciphers: "SSLv3" },
});

const sendMail = (mailOptions) => {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error(error);
    } else {
      logger.log("Email response: " + info.response);
    }
  });
};

module.exports = {transporter, sendMail};
