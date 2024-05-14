const { initializeApp } = require("firebase-admin/app");
const admin = require("firebase-admin");
var serviceAccount = require("../firebase_service_account.json");
const axios = require("axios");
const nodemailer = require("nodemailer");
const { logger } = require("firebase-functions");
const pool = require("../db");
const QuoteHTML = require("../classes/quoteEmailHtml");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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

const saveDataInDatabase = async (data, attachmentPath, emailType) => {
  await pool.query(
    `CALL create_update_email(
    emailid => $1::TEXT,
    emailaddress => $2::TEXT,
    attachmentpath => $3::TEXT,
    whosent => $4::TEXT,
    emailtype => $5::TEXT)`,
    [data.quoteId, data.email, attachmentPath, data.user, emailType]
  );
};

const sendQuote = async (req, res) => {
  try {
    const { data } = req.body;
    //console.log(data);

    //get data to create attachment
    const parsedData = JSON.parse(data?.attachmentData);
    //console.log(parsedData);

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
    let attachmentAddress = `${process.env.PDFFOLDERPATH}/${response.data}`;
    let attachmentOptions = {
      filename: `Quote${data?.quoteId}.pdf`,
      path: attachmentAddress,
    };

    const mailOptions = {
      from: process.env.SMTPUSER,
      to: data.email,
      subject: `Quote ${data?.quoteId}`,
      html: QuoteHTML(data),
      attachments: [attachmentOptions],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        logger.error(error);
        return res.status(500).json({ message: `Error: ${error}` });
      }

      //console.log(info);
      if (info.accepted?.length > 0) {
        //save data in the db.
        saveDataInDatabase(data, attachmentAddress, "quote");
        return res.status(202).json("Email delivered.");
      } else if (info.rejected?.length > 0)
        return res.status(406).json("Rejected by server.");
      else if (info?.pending?.length > 0)
        return res.status(408).json("Delivery pending.");
      else return res.json(info.response);
    });

    //const response = await emailDb.collection("quotes").add(quoteData);
  } catch (error) {
    console.log(error);
    logger.error(error);
    if (!error.response)
      return res.status(503).json({ message: "No server response" });
    else
      return res
        .status(500)
        .json({ message: `Error: ${err.response.data?.message}` });
  }
};

module.exports = sendQuote;
