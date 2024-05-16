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
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./firebase_service_account.json");
const { onRequest } = require("firebase-functions/v1/https");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = getFirestore();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Hello!");
});

app.post("/sms", bodyParser.json(), async (req, res) => {
  try {
    const { data } = req.body;
    console.log(data);

    if (!data || !data?.to || !data?.id) {
      res.status(400).json({ message: "Bad request: Missing request data." });
      return;
    }

    //build object to save in database
    const smsInfo = {
      to: data.to,
      body: `Hello ${data.name}.\n
             This is a friendly reminder. You have a trip schedule for ${data.tripDate} at ${data.spotTime} (in the ${data.spotTimeOfDay}).\n
             Trip Details:
             Date: ${data.tripDate}
             Yard Time: ${data.yardTime} (in the ${data.yardTimeOfDay})
             Spot Time: ${data.spotTime} (in the ${data.spotTimeOfDay})
             Start Time: ${data.startTime} (in the ${data.startTimeOfDay})
             Pickup Location: ${data.fromLocation}\n           
             Please follow the instructions in the Driver Order.
             Have a good trip,\n
             Phoenix Bus Orlando.            
             `,
    };

    //add a document to trigger sms
    const response = await db.collection("messages").doc(data.id).set(smsInfo);
    console.log(response);

    //listen to document changes to check if the message was delivered
    const doc = db.collection("messages").doc(data.id);
    let docInstance = await doc.get();
    if (docInstance.exists) {
      while (true) {
        if (docInstance.data().delivery?.state === "SUCCESS")
          return res.status(202).json("SMS delivered");
        else if (docInstance.data().delivery?.state === "ERROR")
          return res.status(406).json({ message: "Error sending SMS" });
        else {
          docInstance = await doc.get();
          console.log(docInstance.data().delivery?.state);
        }
      } //while
    } //if doc exists
  } catch (err) {
    console.error(err);
    logger.error(err);
  }
});

exports.smsService = onRequest(app);
