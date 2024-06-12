const logger = require("firebase-functions/logger");
const { sendMail } = require("./controllers/emailController");

const emailClient = (data) => {
  const mailOptions = {
    from: process.env.SMTPUSER,
    to: data.email,
    subject: `Pending payment`,
    html: ``,
  };

  sendMail(mailOptions);
};

module.exports = emailClient;
