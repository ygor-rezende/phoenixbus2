const dayjs = require("dayjs");
dayjs.extend(require("dayjs/plugin/utc"));
dayjs.extend(require("dayjs/plugin/timezone"));

export const localDayjs = (time) => {
  return dayjs(time).tz("America/New_York");
};
