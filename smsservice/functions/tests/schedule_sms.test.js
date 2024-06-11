const { convertToLocal } = require("../modules/dateconvert");

describe("test date time convertion", () => {
  it("should schedule sms", () => {
    start_time = "2024-06-10T21:00:00Z";

    //call the function
    expect(convertToLocal(start_time)).toBe("06/10/2024 17:00");
  });
});
