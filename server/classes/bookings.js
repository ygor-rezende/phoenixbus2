const { v4: uuid } = require("uuid");
const pool = require("../db");

class Booking {
  static async newBooking(req, res) {
    const { booking } = req.body;
    if (!booking)
      return res
        .status(400)
        .json({ message: "Bad request: Booking information is required" });
    try {
      //generate a new id
      let newId = uuid();

      //extract the first 8 digits to be the invoice number
      newId = newId.substring(0, 8);

      //insert the new Booking
      const newBooking = await pool.query(
        `INSERT INTO bookings (invoice, quote_id, client_id, employee_id, responsible_name, responsible_email, responsible_phone, quote_date, booking_date, category, pax_group, num_people, trip_start_date, trip_end_date, deposit, cost, mco_mca, hours_quote_valid, client_comments, intinerary_details, internal_coments)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)`,
        [
          newId,
          booking.quoteId,
          booking.clientId,
          booking.employeeId,
          booking.responsibleName,
          booking.responsibleEmail,
          booking.responsiblePhone,
          booking.quoteDate,
          booking.bookingDate,
          booking.category,
          booking.paxGroup,
          booking.numPeople,
          booking.tripStartDate,
          booking.tripEndDate,
          booking.deposit,
          booking.quotedCost,
          booking.arrivalProcMCOMCA,
          booking.numHoursQuoteValid,
          booking.clientComments,
          booking.intineraryDetails,
          booking.internalComments,
        ]
      );
      console.log(newBooking.rowCount);
      //send the reponse to booking
      return res.status(201).json(`Booking ${newId} created`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //newBooking

  static async getAllBookings() {
    try {
      const result = await pool.query("Select * FROM bookings");
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getAllBookings

  static async updateBooking(req, res) {
    const { booking } = req.body;
    if (!booking)
      return res
        .status(400)
        .json({ message: "Bad request: Booking information is required" });
    try {
      const updatedBooking = await pool.query(
        "UPDATE bookings SET client_id = $1, employee_id = $2, quote_date = $3, category = $4, pax_group = $5, num_people = $6, trip_start_date = $7, trip_end_date = $8, deposit = $9, cost = $10, mco_mca = $11, hours_quote_valid = $12, client_comments = $13, intinerary_details = $14, internal_coments = $15, quote_id = $16, booking_date = $17, responsible_name = $18, responsible_email = $19, responsible_phone = $20 WHERE invoice = $21",
        [
          booking.clientId,
          booking.employeeId,
          booking.quoteDate,
          booking.category,
          booking.paxGroup,
          booking.numPeople,
          booking.tripStartDate,
          booking.tripEndDate,
          booking.deposit,
          booking.quotedCost,
          booking.arrivalProcMCOMCA,
          booking.numHoursQuoteValid,
          booking.clientComments,
          booking.intineraryDetails,
          booking.internalComments,
          booking.quoteId,
          booking.bookingDate,
          booking.responsibleName,
          booking.responsibleEmail,
          booking.responsiblePhone,
          booking.invoice,
        ]
      );
      if (updatedBooking.rowCount)
        return res.json(`Booking ${booking.invoice} updated`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //updateBooking

  static async deleteBooking(req, res) {
    const { bookingIds } = req.body;
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
        return res.json(`Number of bookings deleted: ${deletedPromise.length}`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //deleteBooking
}

module.exports = { Booking };
