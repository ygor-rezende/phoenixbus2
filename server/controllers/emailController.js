const { getFirestore, doc, set } = require("firebase-admin/firestore");
const { initializeApp } = require("firebase-admin/app");
const admin = require("firebase-admin");
var serviceAccount = require("../firebase_service_account.json");
const axios = require("axios");
const nodemailer = require("nodemailer");
const fs = require("fs");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const emailDb = getFirestore();

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

const sendQuote = async (req, res) => {
  try {
    const { data } = req.body;
    //console.log(data);

    //get data to create attachment
    const parsedData = JSON.parse(data?.attachmentData);
    console.log(parsedData);

    //request to create the pdf
    let response = await axios.post(`${process.env.PDFSERVICE}/quote/newfile`, {
      data: parsedData,
    });

    // let response = await axios.post(
    //   `http://localhost:8080/api/getpdf/quote/newfile`,
    //   {
    //     data: parsedData,
    //   }
    // );

    let attachmentOptions = null;
    console.log(response.data);
    if (response?.data) {
      attachmentOptions = {
        filename: `Quote${data?.quoteId}.pdf`,
        path: `${process.env.PDFFOLDERPATH}/${response.data}`,
      };
    }

    const mailOptions = {
      from: process.env.SMTPUSER,
      to: data.email,
      subject: `Quote ${data?.quoteId}`,
      html: "<div><h1>Quote</h1></div>",
      attachments: [attachmentOptions],
    };

    // const quoteData = {
    //   email: "ygor.rezende@gmail.com",
    //   subject: `Quote ${data?.quoteId}`,
    //   attachment: data?.attachmentData,
    //   filename: `Quote${data?.quoteId}.pdf`,
    //   timestamp: data?.timestamp,
    //   user: data?.user,
    // };

    transporter.sendMail(mailOptions, (error, data) => {
      if (error) {
        console.log(error);
        return;
      }
      console.log("Email Sent!");
    });

    //const response = await emailDb.collection("quotes").add(quoteData);
    return res.json("Email Sent");
  } catch (error) {
    console.log(error);
    return res.json("Error sending email");
  }
};

module.exports = sendQuote;
