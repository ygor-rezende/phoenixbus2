const pool = require("../db");

class Driver {
  static async getTripsByDriver(req, res) {
    try {
      const { driverId } = req.params;

      if (!driverId)
        return res.status(400).json("Bad request: Missing driver id");

      const result = await pool.query(
        `SELECT * FROM get_trips_by_driver('${driverId}')`
      );

      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  }
}

module.exports = { Driver };
