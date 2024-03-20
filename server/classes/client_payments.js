const pool = require("../db");

class Payments {
  static async getInvoices() {
    try {
      const result = await pool.query(
        `SELECT
          b.invoice,
          b.client_id,
          ac.balance
          FROM bookings b JOIN accounts ac ON ac.client_id = b.client_id
          WHERE is_quote = false`
      );
      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getInvoices

  static async processPayment(req, res) {
    try {
      const { payment } = req.body;
      if (!payment || !payment.clientId)
        return res
          .status(400)
          .json({ message: "Bad request: Payment information is required" });

      await pool.query(
        `CALL create_payment_transaction(
        invoice => $1::TEXT,
        client_id => $2::TEXT,
	    amount => $3,
	    transaction_date => $4::TEXT,
	    transaction_type => $5::character,
	    payment_type => $6::TEXT,
	    doc_number => $7::TEXT
       )`,
        [
          payment.invoice,
          payment.clientId,
          payment.amount,
          payment.transactionDate,
          payment.transactionType,
          payment.paymentType,
          payment.docNumber,
        ]
      );

      //send the reponse to booking
      return res.status(201).json(`Payment processed`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //processPayment
}

module.exports = { Payments };
