const express = require("express");
const bodyParser = require("body-parser");
const logger = require("firebase-functions/logger");
const { getFirestore } = require("firebase-admin/firestore");
const pool = require("../db");
require("dotenv").config();

const db = getFirestore();

const router = express.Router();
router.post("/", bodyParser.json(), async (req, res) => {
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
      You have a trip on ${data.tripDate} at ${data.startTime} (in the ${data.startTimeOfDay}).\n
      Please confirm this trip by clicking here: ${process.env.CONFIRMTRIPPRODADDRESS}/${data.id}
      \nTrip Details:
      Yard Time: ${data.yardTime} (in the ${data.yardTimeOfDay})
      Bus: ${data.bus}\n
      Please refer to the Driver Order for more details.
      Phoenix Bus Orlando.`,
    };

    //add a document to trigger sms
    const response = await db.collection("messages").doc(data.id).set(smsInfo);
    //console.log(response);

    //get the document reference that was saved
    const doc = db.collection("messages").doc(data.id);
    let docInstance = await doc.get();

    //Wait for state of success or error to send response to client
    if (docInstance.exists) {
      let status = 500;
      let response = "";
      while (true) {
        if (docInstance.data().delivery?.state === "SUCCESS") {
          status = 202;
          response = "SMS sent to driver.";
          break;
        } else if (docInstance.data().delivery?.state === "ERROR") {
          status = 500;
          response = "Error delivering SMS.";
          break;
        } else {
          docInstance = await doc.get();
          //console.log(docInstance.data().delivery?.state);
        }
      } //while

      //Save result on database
      await pool.query(`CALL create_sms(
        sms_id => '${data.id}'::TEXT,
        detail_id => ${data.detailId}::SMALLINT,
        to_phone => '${data.to}'::TEXT,
        delivery_status => '${docInstance.data().delivery?.state}'::TEXT
      );`);

      //send response to client
      return res.status(status).json(response);
    } //if doc exists
  } catch (err) {
    console.error(err);
    logger.error(err);
    return res.status(500).json(err.message);
  }
});

module.exports = router;
