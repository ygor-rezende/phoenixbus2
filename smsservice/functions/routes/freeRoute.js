const express = require("express");
const router = express.Router();
const pool = require("../db");
const { logger } = require("firebase-functions");

//This route sends HTML page to driver to confirm or reject trip
router.get("/page/:smsId", (req, res) => {
  try {
    const { smsId } = req.params;

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
      font-size: 16px;
      margin: 4px 4px;
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
      <button class="button button1" type="button" onclick="location.href='${process.env.DRIVERRESPONSETESTADDRESS}?smsId=${smsId}&answer=c'" autofocus>Confirm</button>
      <button class="button button2" type="button" onclick="location.href='${process.env.DRIVERRESPONSETESTADDRESS}?smsId=${smsId}&answer=r'">Reject</button>
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
    await client.query("BEGIN");

    //Check if smsId exists
    const response = await client.query(
      `SELECT sms_id from sms WHERE sms_id = '${smsId}'`
    );

    console.log(response.rowCount);

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
    return res.status(200).send(
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
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    logger.error(err);
    return res
      .status(500)
      .send(
        `<h1 style="text-align:center; position:relative; top:50%">An error ocurred. Please try again.</h1>`
      );
  } finally {
    client.release();
  }
});

module.exports = router;
