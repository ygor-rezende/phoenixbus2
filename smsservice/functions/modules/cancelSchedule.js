const twilio = require("twilio"); // Import the Twilio module
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const logger = require("firebase-functions/logger");

const cancelSMSSchedule = async (messageSID) => {
  await client
    .messages(messageSID)
    .update({ status: "canceled" })
    .then((message) => {
      console.log("Cancel sms response status: ", message.status);
      logger.info("Cancel sms response status: ", message.status);
      return message.status;
    })
    .catch((err) => {
      console.log("Error canceling sms: ", err);
      logger.error("Error canceling sms: ", err);
      return "Error";
    });
};

module.exports = cancelSMSSchedule;
