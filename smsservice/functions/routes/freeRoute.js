const express = require("express");
const router = express.Router();

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
