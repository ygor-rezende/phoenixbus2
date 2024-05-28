const pool = require("../db");

class FarmoutPayments {
  static async getUpdatedAccounts() {
    try {
      const result = await pool.query(
        `SELECT * FROM calculate_farmout_balance()`
      );
      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getUpdatedAccounts

  static async processFarmoutPayment(req, res) {
    try {
      const { payment } = req.body;
      if (!payment || !payment.accountId)
        return res
          .status(400)
          .json({ message: "Bad request: Payment information is required" });

      await pool.query(
        `CALL record_farmout_payment(
        accountid => $1::INTEGER,
        amount => $2::NUMERIC,
        transaction_date => $3::TEXT,
        payment_type => $4::TEXT,
        doc_number => $5::TEXT
        )`,
        [
          payment.accountId,
          payment.amount,
          payment.transactionDate,
          payment.paymentType,
          payment.docNumber,
        ]
      );

      //send the reponse to client
      return res.status(201).json(`Payment processed`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //processFarmoutPayment

  static async getPendingFarmoutPayments() {
    try {
      const result = await pool.query(
        `SELECT * FROM get_pending_farmout_payments()`
      );
      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getPendingFarmoutPayments

  static async getFarmoutTransactions() {
    try {
      const result = await pool.query(`SELECT * FROM farmout_transactions`);
      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getFarmoutTransactions
}

module.exports = { FarmoutPayments };
