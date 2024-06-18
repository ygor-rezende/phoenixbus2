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

const sendMail = async (mailOptions) => {
  try {
    let response = await transporter.sendMail(mailOptions);
    return response.accepted.join() + " - OK";
  } catch (err) {
    logger.error(err.message);
    return err.message;
  }
};

module.exports = { transporter, sendMail };
