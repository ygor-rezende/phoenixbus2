const dayjs = require("dayjs");

const convertToLocal = (datetime) => {
  return dayjs(datetime).tz("America/New_York").format("MM/DD/YYYY HH:mm");
};

module.exports = {
  convertToLocal,
};
