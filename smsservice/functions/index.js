const { onRequest } = require("firebase-functions/v1/https");
const express = require("express");
const credentials = require("./middleware/credentials");
const admin = require("firebase-admin");
const serviceAccount = require("./firebase_service_account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

app.use(express.json());

app.use("/", require("./routes/freeRoute"));

app.use(credentials);

app.use("/sendSMS", require("./routes/protectedRoute"));

exports.smsService = onRequest(app);
