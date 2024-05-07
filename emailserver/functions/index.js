/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

require("dotenv").config();
const logger = require("firebase-functions/logger");
const nodemailer = require("nodemailer");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fs = require("fs");
const reactPdf = require("@react-pdf/renderer");
const parse = require("html-react-parser").default;

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

let htmlpage = null;
fs.readFile(
  "./email_templates/quote_email_template.html",
  "utf-8",
  (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    htmlpage = data;
  }
);

exports.sendEmail = functions.firestore
  .document("quotes/{quoteId}")
  .onCreate(async (snap, context) => {
    //parse the attachment (string) to a react element
    //const reactObject = parse(snap.data().attachment);
    //transform it into a reactPdf buffer
    //const buffer = await reactPdf.renderToBuffer(reactObject);

    const attachmentOptions = {
      filename: snap.data().filename,
      content: snap.data().attachment,
      contentType: "application/pdf",
    };

    const mailOptions = {
      from: process.env.SMTPUSER,
      to: snap.data().email,
      subject: snap.data().subject,
      html: htmlpage,
      attachments: [attachmentOptions],
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
