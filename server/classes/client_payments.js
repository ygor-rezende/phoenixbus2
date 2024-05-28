const pool = require("../db");

class Payments {
  static async getInvoices() {
    try {
      const result = await pool.query(`SELECT * FROM get_invoices_to_pay()`);
      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getInvoices

  static async processPayment(req, res) {
    try {
      const { payment } = req.body;
      if (!payment || !payment.accountId)
        return res
          .status(400)
          .json({ message: "Bad request: Payment information is required" });

      await pool.query(
        `CALL create_payment_transaction(
        invoice => $1::TEXT,
        accountid => $2::INTEGER,
        amount => $3::NUMERIC,
        transaction_date => $4::TEXT,
        transaction_type => $5::character,
        payment_type => $6::TEXT,
        doc_number => $7::TEXT
        )`,
        [
          payment.invoice,
          payment.accountId,
          payment.amount,
          payment.transactionDate,
          payment.transactionType,
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
  } //processPayment

  static async getPendingPayments() {
    try {
      const result = await pool.query(`SELECT * FROM get_pending_payments()`);
      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getPendingPayments

  static async getAmountDueByInvoice() {
    try {
      const result = await pool.query(
        `SELECT * FROM get_amount_due_by_invoice()`
      );
      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getAmountDueByInvoice
}

module.exports = { Payments };
