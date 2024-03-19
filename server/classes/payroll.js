const { v4: uuid } = require("uuid");
const pool = require("../db");

class Payroll {
  static async getDriverPayroll(req, res) {
    try {
      const { dates } = req.params;
      let newDates = JSON.parse(dates);
      console.log(newDates);
      if (!newDates || !newDates?.startDate || !newDates?.endDate)
        return res.status(400).json("Bad request: Missing dates");

      const result = await pool.query(
        `SELECT * FROM get_driver_payment(startdate => '${newDates.startDate}'::TEXT, enddate => '${newDates.endDate}'::TEXT )`
      );
      console.log(result.rows);
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  }
}

module.exports = { Payroll };
