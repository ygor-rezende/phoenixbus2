const express = require("express");
const bodyParser = require("body-parser");
const logger = require("firebase-functions/logger");
const { getFirestore } = require("firebase-admin/firestore");
const pool = require("../db");
const admin = require("firebase-admin");
const serviceAccount = require("../firebase_service_account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = getFirestore();

const router = express.Router();
router.post("/sendSMS", bodyParser.json(), async (req, res) => {
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
                 You have a trip on ${data.tripDate} at ${data.spotTime} (in the ${data.spotTimeOfDay}).\n
                 Please confirm this trip by clicking here: http://127.0.0.1:5001/phoenixintranet-8d6e8/us-central1/smsService/confirmTrip/${data.id}
                 Trip Details:             
                 Yard Time: ${data.yardTime} (in the ${data.yardTimeOfDay})
                 Bus: ${data.bus}\n           
                 Please refer to the Driver Order for more details.
                 Have a good trip,\n
                 Phoenix Bus Orlando.            
                 `,
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
          response = "SMS delivered";
          break;
        } else if (docInstance.data().delivery?.state === "ERROR") {
          status = 202;
          response = { message: "Error delivering SMS" };
          break;
        } else {
          docInstance = await doc.get();
          //console.log(docInstance.data().delivery?.state);
        }
      } //while

      //Save result on database
      await pool.query(`CALL create_sms(
        sms_id => '${data.id}'::TEXT,
        to_phone => '${data.to}'::TEXT,
        delivery_status => '${docInstance.data().delivery?.state}'::TEXT
      );`);

      //send response to client
      return res.status(status).json(response);
    } //if doc exists
  } catch (err) {
    console.error(err);
    logger.error(err);
    return res.status(500).json({ message: err.message });
  }
});

router.get("/confirmTrip/:smsId", async (req, res) => {
  const client = await pool.connect();
  try {
    const { smsId } = req.params;

    await client.query("BEGIN");

    //Check if smsId exists
    const response = await client.query(
      `SELECT sms_id from sms WHERE sms_id = '${smsId}'`
    );

    if (response.rowCount < 1) {
      await client.query("COMMIT");
      return res.status(404).send(`<h2>Page not found.</h2>`);
    }

    //save confirmation on database
    await client.query(`CALL confirm_sms(smsid => '${smsId}'::TEXT)`);

    //send response for driver
    await client.query("COMMIT");
    return res.status(200).send(`<h2>Trip confirmed successfully!</h2>`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    logger.error(err);
    return res.status(500).send(`<h2>An error ocurred. Please try again.</h2>`);
  } finally {
    client.release();
  }
});

module.exports = router;
