const { getFirestore, doc, set } = require("firebase-admin/firestore");
const { initializeApp } = require("firebase-admin/app");
const admin = require("firebase-admin");
var serviceAccount = require("../firebase_service_account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const emailDb = getFirestore();

const sendQuote = async (req, res) => {
  const { data } = req.body;
  //console.log(data);

  try {
    const quoteData = {
      email: "ygor.rezende@gmail.com",
      subject: `Quote ${data?.quoteId}`,
      attachment: data?.attachment,
      filename: `Quote${data?.quoteId}.pdf`,
    };

    const response = await emailDb.collection("quotes").add(quoteData);
    return res.json("Email Sent");
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendQuote;
