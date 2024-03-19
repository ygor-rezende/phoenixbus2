const { v4: uuid } = require("uuid");
const pool = require("../db");

class Sales {
  static async getSales(req, res) {
    try {
      const { dates } = req.params;
      let newDates = JSON.parse(dates);
      if (!newDates || !newDates?.startDate || !newDates?.endDate)
        return res.status(400).json("Bad request: Missing dates");

      const result = await pool.query(
        `SELECT * FROM get_sales(startdate => '${newDates.startDate}'::TEXT, enddate => '${newDates.endDate}'::TEXT )`
      );
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  }
}

module.exports = { Sales };
