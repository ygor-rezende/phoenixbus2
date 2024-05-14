const pool = require("../db");

class Email {
  static async getEmailsSent(req, res) {
    try {
      const response = await pool.query(`
            SELECT * FROM emails`);
      return response.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  }

  static async updateEmailViews(emailId) {
    try {
      if (!emailId) return;
      await pool.query(`CALL update_email_views(emailid => $1::TEXT)`, [
        emailId,
      ]);
      return;
    } catch (err) {
      console.error(err);
      return err.message;
    }
  }
}

module.exports = Email;
