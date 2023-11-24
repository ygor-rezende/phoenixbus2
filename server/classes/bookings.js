const { v4: uuid } = require("uuid");
const pool = require("../db");

class Booking {
  static async newBooking(booking) {
    try {
      //generate a new id
      const newId = uuid();
      //insert the new Booking
      const newBooking = await pool.query(
        `INSERT INTO bookings (invoice, quote_id, client_id, employee_id, quote_date, booking_date, category, pax_group, num_adults, num_child, trip_start_date, trip_end_date, deposit, cost, mco_mca, hours_quote_valid, client_comments, intinerary_details, internal_coments)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
        [
          newId,
          booking.quoteId,
          booking.clientId,
          booking.employeeId,
          booking.quoteDate,
          booking.bookingDate,
          booking.category,
          booking.paxGroup,
          booking.numAdults,
          booking.numChild,
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
      return `Booking ${newId} created`;
    } catch (err) {
      console.error(err);
      if (err) return { msg: err.message, detail: err.detail };
    }
  } //newBooking

  static async getAllBookings() {
    try {
      const result = await pool.query("Select * FROM bookings");
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return "Query failed";
    }
  } //getAllBookings

  static async updateBooking(booking) {
    try {
      const updatedBooking = await pool.query(
        "UPDATE bookings SET client_id = $1, employee_id = $2, quote_date = $3, category = $4, pax_group = $5, num_adults = $6, num_child = $7, trip_start_date = $8, trip_end_date = $9, deposit = $10, cost = $11, mco_mca = $12, hours_quote_valid = $13, client_comments = $14, intinerary_details = $15, internal_coments = $16, quote_id = $17, booking_date = $18 WHERE invoice = $19",
        [
          booking.clientId,
          booking.employeeId,
          booking.quoteDate,
          booking.category,
          booking.paxGroup,
          booking.numAdults,
          booking.numChild,
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
          booking.invoice,
        ]
      );
      if (updatedBooking.rowCount) return `Booking ${booking.invoice} updated`;
      else return { failed: "Failed to update booking" };
    } catch (err) {
      console.error(err);
      if (err) return { failed: `Error: ${err.message}` };
    }
  } //updateBooking

  static async deleteBooking(bookingIds) {
    try {
      const deletedBookings = await bookingIds.map(async (booking) => {
        return await pool.query("DELETE from bookings WHERE invoice = $1", [
          booking,
        ]);
      });
      const deletedPromise = await Promise.all(deletedBookings);
      console.log(deletedPromise);
      if (deletedPromise[0].rowCount)
        return `Number of bookings deleted: ${deletedPromise.length}`;
      else return { failed: "Failed to delete booking" };
    } catch (err) {
      console.error(err);
      if (err) return { failed: `Error: ${err.message}` };
    }
  } //deleteBooking
}

module.exports = { Booking };