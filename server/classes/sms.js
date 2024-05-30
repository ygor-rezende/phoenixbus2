const pool = require("../db");

class SMS {
  static async getSMSInfo() {
    try {
      const result = await pool.query(
        `SELECT * FROM sms order by detail_id, delivery_timestamp desc`
      );
      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  }
}

module.exports = { SMS };
