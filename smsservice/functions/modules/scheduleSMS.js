const dayjs = require("dayjs");
dayjs.extend(require("dayjs/plugin/utc"));
dayjs.extend(require("dayjs/plugin/timezone"));
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio = require("twilio"); // Import the Twilio module

// Create a Twilio client instance
const client = twilio(accountSid, authToken);

const scheduleSMS = async (data) => {
  const startTime = dayjs(data.start_time)
    .tz("America/New_York")
    .format("MM/DD/YYYY HH:mm");
  const yardTime = dayjs(data.yard_time)
    .tz("America/New_York")
    .format("MM/DD/YYYY HH:mm");
  const sendingTime = dayjs(data.yard_time).subtract(1, "hours").toISOString();
  console.log(startTime, yardTime, sendingTime);
  // await client.messages
  //   .create({
  //     body: `Hi ${data.firstname}. This is a reminder for your upcoming trip at ${startTime}.\n
  //     Trip Details:
  //     Yard Time: ${yardTime}
  //     Bus: ${data.vehicle_name}\n
  //     Phoenix Bus Orlando.`,
  //     messagingServiceSid: process.env.TWILIO_SERVICE_SID,
  //     sendAt: sendingTime,
  //     scheduleType: "fixed",
  //     to: data.phone,
  //   })
  //   .then((message) => console.log(message.sid))
  //   .catch((err) => console.error(err));
};

module.exports = scheduleSMS;
