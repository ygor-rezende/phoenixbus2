const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/:smsId", async (req, res) => {
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
      return res
        .status(404)
        .send(
          `<h1 style="text-align:center; position:relative; top:50%">Page Not Found</h1>`
        );
    }

    //save confirmation on database
    await client.query(`CALL confirm_sms(smsid => '${smsId}'::TEXT)`);

    //send response for driver
    await client.query("COMMIT");
    return res
      .status(200)
      .send(
        `<h1 style="text-align:center; position:relative; top:50%">Trip confirmed successfully!</h1>`
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
