const dayjs = require("dayjs");
dayjs.extend(require("dayjs/plugin/utc"));
dayjs.extend(require("dayjs/plugin/timezone"));

const localDayjs = (time) => {
  return dayjs(time).tz("America/New_York");
};

module.exports = {
  localDayjs,
};