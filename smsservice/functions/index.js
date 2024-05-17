/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

require("dotenv").config();

const { onRequest } = require("firebase-functions/v1/https");
const express = require("express");
const router = require("./routes/routes");

const app = express();

app.use(express.json());

app.use("/", router);

exports.smsService = onRequest(app);
