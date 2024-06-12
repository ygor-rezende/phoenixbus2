/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const logger = require("firebase-functions/logger");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const pool = require("./db/db");

//every monday at 12:00
exports.emailReminder = onSchedule("0 12 * * MON", async (event) => {
  try {
    //*** Get data from database with client information ***//
    const client = await pool.connect();

    //start transaction
    await client.query("BEGIN");

    //Commit transaction
    await client.query("COMMIT");

    //*** Send email to each client ***//
    //*** Send email to admin informing that email has been sent ***//
    logger.log("Email sent to clients");
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error(err);
  } finally {
    client.release();
  }
});
