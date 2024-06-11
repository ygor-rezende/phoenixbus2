const dayjs = require("dayjs");
dayjs.extend(require("dayjs/plugin/utc"));
dayjs.extend(require("dayjs/plugin/timezone"));
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio = require("twilio"); // Import the Twilio module
// Create a Twilio client instance
const client = twilio(accountSid, authToken);
const logger = require("firebase-functions/logger");

const scheduleSMS = async (data) => {
  const startTime = dayjs(data.start_time)
    .tz("America/New_York")
    .format("MM/DD/YYYY HH:mm");
  const yardTime = dayjs(data.yard_time)
    .tz("America/New_York")
    .format("MM/DD/YYYY HH:mm");
  const sendingTime = dayjs(data.yard_time).subtract(1, "hours").toISOString();
  console.log(startTime, yardTime, sendingTime);

  const message = await client.messages.create({
    body: `Hi ${data.firstname}. This is a reminder for your upcoming trip at ${startTime}.\n
      Trip Details:
      Yard Time: ${yardTime}
      Bus: ${data.vehicle_name}\n
      Phoenix Bus Orlando.`,
    messagingServiceSid: process.env.TWILIO_SERVICE_SID,
    sendAt: sendingTime,
    scheduleType: "fixed",
    to: data.phone,
  });

  if (message?.errorCode) {
    console.error(message?.errorCode);
    logger.error(message?.errorCode);
    return "Error";
  } else {
    console.log("Scheduled message Id: ", message?.sid);
    logger.info("Scheduled message Id: ", message?.sid);
    return message.sid;
  }
};

module.exports = scheduleSMS;
