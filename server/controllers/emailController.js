require("dotenv").config();
const nodemailer = require("nodemailer");
const functions = require("firebase-functions");
const { error } = require("firebase-functions/logger");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTPUSER,
    pass: process.env.SMTPPASS,
  },
});

exports.sendEmail = functions.firestore
  .document("quotes/{quoteId}")
  .onCreate((snap, context) => {
    const mailOptions = {
      from: process.env.SMTPUSER,
      to: snap.data().email,
      subject: "New quote",
      html: `<h1>Quote</h1>
                <p>
                <b>Email: </b> ${snap.data().email}</p>`,
    };

    return transporter.sendMail(mailOptions, (error, data) => {
      if (error) {
        console.log(error);
        return;
      }
      console.log("Sent!");
    });
  });
