/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const logger = require("firebase-functions/logger");
require("dotenv").config();
const nodemailer = require("nodemailer");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: process.env.SMTPPORT,
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
      subject: snap.data().subject,
      html: `<h1>Quote</h1>
                <p>
                <b>Email: </b> ${snap.data().email}</p>`,
    };

    return transporter.sendMail(mailOptions, (error, data) => {
      if (error) {
        console.log(error);
        logger.info(error);
        return;
      }
      console.log("Email Sent!");
      logger.info("Email Sent!");
    });
  });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
