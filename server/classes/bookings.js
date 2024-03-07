const { v4: uuid } = require("uuid");
const pool = require("../db");

class Booking {
  static async createInvoice(isQuote) {
    //get current year
    const year = new Date().getFullYear();

    //get the last invoice saved
    const lastInvoice = await pool.query(
      "SELECT invoice from invoices ORDER BY invoice DESC LIMIT 1"
    );

    //strip the sequential part (last 5 digits)
    let digits = lastInvoice.rows[0]?.invoice.substring(5, 10);
    digits = parseInt(digits) + 1;

    //find the number of digits and add zeros before until length = 5
    const length = digits.toString().length;
    const numOfZeros = 5 - length;
    for (let i = 0; i < numOfZeros; i++) digits = "0" + digits;

    //new invoice
    let newInvoice = year.toString() + "-" + digits;
    if (isQuote) newInvoice = newInvoice + "Q";

    //insert invoice into invoices table
    const result = await pool.query(`INSERT INTO invoices VALUES ($1)`, [
      newInvoice,
    ]);

    return newInvoice;
  }

  static async newBooking(req, res) {
    try {
      const { booking } = req.body;
      if (!booking)
        return res
          .status(400)
          .json({ message: "Bad request: Booking information is required" });

      let invoice = "";
      //check if invoice is empty
      if (!booking.invoice) {
        //generate the id
        invoice = await Booking.createInvoice(booking.isQuote);
      } else invoice = booking.invoice;

      //insert the new Booking
      const newBooking = await pool.query(
        `INSERT INTO bookings (invoice, is_quote, client_id, employee_id, responsible_name, responsible_email, responsible_phone, quote_date, booking_date, category, num_people, trip_start_date, trip_end_date, deposit, cost, hours_quote_valid, client_comments, intinerary_details, internal_coments)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
        [
          invoice,
          booking.isQuote,
          booking.clientId,
          booking.employeeId,
          booking.responsibleName,
          booking.responsibleEmail,
          booking.responsiblePhone,
          booking.quoteDate,
          booking.bookingDate,
          booking.category,
          booking.numPeople,
          booking.tripStartDate,
          booking.tripEndDate,
          booking.deposit,
          booking.quotedCost,
          booking.numHoursQuoteValid,
          booking.clientComments,
          booking.intineraryDetails,
          booking.internalComments,
        ]
      );
      console.log(newBooking.rowCount);
      //send the reponse to booking
      return res.status(201).json(`Booking/Quote ${invoice} created`);
    } catch (err) {
      console.error(err);
      if (err.code === "23505")
        return res.status(409).json({
          message: `Invoice # or Quote ID already exists.`,
        });

      return res.status(500).json({ message: err.message });
    }
  } //newBooking

  static async getAllBookings() {
    try {
      const result = await pool.query(
        "Select * FROM bookings WHERE is_quote IS false ORDER BY invoice"
      );
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getAllBookings

  static async getAllQuotes() {
    try {
      const result = await pool.query(
        "Select * FROM bookings WHERE is_quote IS true ORDER BY invoice"
      );
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getAllQuotes

  static async updateBooking(req, res) {
    const { booking } = req.body;
    if (!booking)
      return res
        .status(400)
        .json({ message: "Bad request: Booking information is required" });
    try {
      const updatedBooking = await pool.query(
        "UPDATE bookings SET client_id = $1, employee_id = $2, quote_date = $3, category = $4, num_people = $5, trip_start_date = $6, trip_end_date = $7, deposit = $8, cost = $9, hours_quote_valid = $10, client_comments = $11, intinerary_details = $12, internal_coments = $13, is_quote = $14, booking_date = $15, responsible_name = $16, responsible_email = $17, responsible_phone = $18 WHERE invoice = $19",
        [
          booking.clientId,
          booking.employeeId,
          booking.quoteDate,
          booking.category,
          booking.numPeople,
          booking.tripStartDate,
          booking.tripEndDate,
          booking.deposit,
          booking.quotedCost,
          booking.numHoursQuoteValid,
          booking.clientComments,
          booking.intineraryDetails,
          booking.internalComments,
          booking.isQuote,
          booking.bookingDate,
          booking.responsibleName,
          booking.responsibleEmail,
          booking.responsiblePhone,
          booking.invoice,
        ]
      );
      if (updatedBooking.rowCount)
        return res.json(`Booking/Quote ${booking.invoice} updated`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //updateBooking

  static async deleteBooking(req, res) {
    let { bookingIds } = req.params;
    bookingIds = JSON.parse(bookingIds);
    if (!bookingIds)
      return res
        .status(400)
        .json({ message: "Bad request: Missing invoice information" });
    try {
      const deletedBookings = await bookingIds.map(async (booking) => {
        return await pool.query("DELETE from bookings WHERE invoice = $1", [
          booking,
        ]);
      });
      const deletedPromise = await Promise.all(deletedBookings);
      console.log(deletedPromise);
      if (deletedPromise[0]?.rowCount)
        return res.json(`Number of items deleted: ${deletedPromise.length}`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //deleteBooking

  static async getBookingsByClient(req, res) {
    try {
      let { clientId } = req.params;

      if (!clientId)
        return res
          .status(400)
          .json({ message: "Bad request: Missing client id information" });

      const result = await pool.query(
        `Select * FROM get_bookings_by_client('${clientId}')`
      );
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getBookingsByClient
}

module.exports = { Booking };
