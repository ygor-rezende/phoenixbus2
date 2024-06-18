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
const { onRequest } = require("firebase-functions/v2/https");
const pool = require("./db/db");
const { emailClient, emailAdmin } = require("./emailclient");

//every monday at 12:00
exports.emailReminder = onSchedule("0 12 * * MON", async (event) => {
  const client = await pool.connect();
  try {
    //*** Get data from database with client information ***//

    //start transaction
    await client.query("BEGIN");

    //Get email/client info
    let response = await client.query(
      `SELECT * FROM get_pending_payments_for_email()`
    );
    const emailsData = response?.rows;

    //Get services info for attachment
    response = await client.query(
      `SELECT * FROM services ORDER BY service_date`
    );
    const serviceData = response?.rows;

    //Get transactions info
    response = await client.query(`SELECT * FROM get_amount_due_by_invoice()`);
    const transactionsData = response?.rows;
    //Commit transaction
    await client.query("COMMIT");

    //*** Send email to each client ***//
    let emailResponse = emailsData.map(async (record) => {
      //filter services for this invoice
      const services = serviceData?.filter(
        (service) => service.booking_id === record.invoice
      );
      return await emailClient(record, services, transactionsData);
    });

    //*** Send email to admin with the results of email sent to clients ***//
    const returnPromisse = await Promise.all(emailResponse);
    logger.log("Email sent to clients: ", returnPromisse);
    const adminEmailResponse = await emailAdmin(returnPromisse);
    logger.log("Email sent to admin: ", adminEmailResponse);
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error(err);
  } finally {
    client.release();
    logger.log("Running time: ", event.scheduleTime);
  }
});

//testing
// exports.emailReminder = onRequest(async (req, res) => {
//   const client = await pool.connect();
//   try {
//     //*** Get data from database with client information ***//

//     //start transaction
//     await client.query("BEGIN");

//     //Get email/client info
//     let response = await client.query(
//       `SELECT * FROM get_pending_payments_for_email() LIMIT 2`
//     );
//     const emailsData = response?.rows;

//     //Get services info for attachment
//     response = await client.query(
//       `SELECT * FROM services ORDER BY service_date`
//     );
//     const serviceData = response?.rows;

//     //Get transactions info
//     response = await client.query(`SELECT * FROM get_amount_due_by_invoice()`);
//     const transactionsData = response?.rows;
//     //Commit transaction
//     await client.query("COMMIT");

//     //*** Send email to each client ***//
//     let emailResponse = emailsData.map(async (record) => {
//       //filter services for this invoice
//       const services = serviceData?.filter(
//         (service) => service.booking_id === record.invoice
//       );
//       return await emailClient(record, services, transactionsData);
//     });

//     //*** Send email to admin with the results of email sent to clients ***//
//     const returnPromisse = await Promise.all(emailResponse);
//     logger.log("Email sent to clients: ", returnPromisse);
//     const adminEmailResponse = await emailAdmin(returnPromisse);
//     logger.log("Email sent to admin: ", adminEmailResponse);
//   } catch (err) {
//     await client.query("ROLLBACK");
//     logger.error(err);
//   } finally {
//     client.release();
//     res.send("Testing ends");
//   }
// });
