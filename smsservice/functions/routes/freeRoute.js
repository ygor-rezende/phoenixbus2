const express = require("express");
const router = express.Router();
const pool = require("../db");
const { logger } = require("firebase-functions");
const scheduleSMS = require("../modules/scheduleSMS");
const cancelSMSSchedule = require("../modules/cancelSchedule");

//This route sends HTML page to driver to confirm or reject trip
router.get("/page/:smsId", async (req, res) => {
  try {
    const { smsId } = req.params;

    //check if driver has responded this before
    let response = await pool.query(
      `SELECT 1 FROM sms WHERE sms_id = '${smsId}' AND confirmed_rejected IS NULL`
    );
    if (response.rowCount < 1)
      return res.send(`<!DOCTYPE html>
    <html>
    <head>
    <style>
    
    .div {text-align: center; position:relative; top:50%;}
    html, body {height: 100%;}
    </style>
    </head>
    <body>
    
    <div class="div">
      <h1>You have responded to this trip already.</h1>
      <h1>If you want to change your response, please contact dispatch.</h1>
     
    </div>
    
    </body>
    </html>`);

    //send Page to driver
    return res.send(`<!DOCTYPE html>
    <html>
    <head>
    <style>
    .button {
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 40px;
      margin: 4px 40px;
      cursor: pointer;
    }
    
    .button1 {background-color: #04AA6D;} /* Green */
    .button2 {background-color: #9a0000;} /* Blue */
    
    .div {text-align: center; position:relative; top:50%;}
    html, body {height: 100%;}
    </style>
    </head>
    <body>
    
    <div class="div">
      <h1>Please confirm or reject this trip.</h1>
      <button class="button button1" type="button" onclick="location.href='${process.env.DRIVERRESPONSEPRODADDRESS}?smsId=${smsId}&answer=c'" autofocus>Confirm</button>
      <button class="button button2" type="button" onclick="location.href='${process.env.DRIVERRESPONSEPRODADDRESS}?smsId=${smsId}&answer=r'">Reject</button>
    </div>
    
    </body>
    </html>`);
  } catch (err) {
    console.error(err);
    logger.error(err);
    return res
      .status(500)
      .send(
        `<h1 style="text-align:center; position:relative; top:50%">An error ocurred. Please try again.</h1>`
      );
  }
});

//This route saves confirmation from driver
router.get("/response", async (req, res) => {
  const client = await pool.connect();
  try {
    const { smsId, answer } = req.query;
    console.log(smsId, answer);

    if (!smsId || !answer || (answer !== "r" && answer !== "c"))
      return res
        .status(400)
        .send(
          `<h1 style="text-align:center; position:relative; top:50%">Bad request: Status 400.</h1>`
        );

    await client.query("BEGIN");

    //Check if smsId exists
    let response = await client.query(
      `SELECT sms_id, detail_id from sms WHERE sms_id = '${smsId}'`
    );
    //console.log(response.rowCount);
    const smsData = response.rows[0];

    if (response.rowCount < 1) {
      await client.query("COMMIT");
      return res
        .status(404)
        .send(
          `<h1 style="text-align:center; position:relative; top:50%">Page Not Found</h1>`
        );
    }

    //save confirmation on database
    await client.query(
      `CALL confirm_sms(smsid => '${smsId}'::TEXT, answer => '${answer}'::CHARACTER)`
    );

    //send response for driver
    await client.query("COMMIT");
    res.status(200).send(
      `${
        answer == "c"
          ? `<h1 style="text-align:center; position:relative; top:50%">
              Trip confirmed successfully!
            </h1>`
          : `<h1 style="text-align:center; position:relative; top:50%">
              Trip rejected successfully!
            </h1>`
      }`
    );

    //Schedule reminder sms if driver confirmed trip
    if (smsData?.detail_id && answer == "c") {
      //Begin another transaction for reminder sms
      await client.query("BEGIN");
      //Get details data
      response = await client.query(
        `SELECT * FROM get_details_for_sms(${smsData?.detail_id}::SMALLINT)`
      );

      const data = response.rows[0];
      let scheduleResponse = await scheduleSMS(data);

      if (scheduleResponse !== "Error") {
        //save message SID on database
        await client.query(
          `UPDATE sms SET schedule_message_sid = '${scheduleResponse}' WHERE sms_id = '${smsId}'`
        );
      }

      //Check if there is another sms scheduled for this trip and cancel it
      response = await client.query(
        `SELECT schedule_message_sid FROM sms WHERE detail_id = ${smsData?.detail_id} AND sms_id != '${smsId}'`
      );
      const scheduleMessageSid = response.rows[0]?.schedule_message_sid;
      if (scheduleMessageSid) {
        const cancelResponse = await cancelSMSSchedule(scheduleMessageSid);
      }
      await client.query("COMMIT");
    }
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error(err);
    if (!res.headersSent)
      return res
        .status(500)
        .send(
          `<h1 style="text-align:center; position:relative; top:50%">An error ocurred. Please try again.</h1>`
        );
  } finally {
    client.release();
  }
});

router.get("/test", async (req, res) => {
  //call the function
  const messages = [
    "SMd74e1f5b8d82b73ca81a5e3c909bd1cb",
    "SMf88934574cd7e5af11993f699c36b102",
    "SM55f2e7f6e1c76f8ec940eedbfdfa387e",
    "SM37c68b9532fb7c9ae26b6f6c1d98bd69",
    "SM85707670b1ffa891af02e87baf07bf53",
    "SM6ff79be20251731045b4237ecdfe33a1",
    "SM8cb2a6842dc70c1f4f0b93d5cc4f6601",
    "SM91b925ce31712649c70db1dd60f50e25",
    "SM15cfb5bc40e86a025059e1536c443b08",
    "SMa160af8a4e012efde43c4544f24393cc",
    "SMd9d841786b5eff35d1ca65e5c9806e29",
  ];

  messages.forEach(async (message) => {
    await cancelSMSSchedule(message);
  });

  res.json(`SMS canceled successfully!`);
});

module.exports = router;
