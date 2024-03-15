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
        `CALL create_booking(invoice => $1::TEXT, 
          client_id => $2::TEXT, 
          employee_id => $3::TEXT, 
          responsible_name => $4::TEXT, 
          responsible_email => $5::TEXT, 
          responsible_phone => $6::TEXT, 
          quote_date => $7::TEXT, 
          booking_date => $8::TEXT, 
          category => $9::TEXT, 
          num_people => $10, 
          trip_start_date => $11::TEXT, 
          trip_end_date => $12::TEXT, 
          deposit => $13, 
          cost => $14, 
          hours_quote_valid => $15, 
          client_comments => $16::TEXT, 
          intinerary_details => $17::TEXT, 
          internal_coments => $18::TEXT, 
          is_quote => $19::BOOLEAN, 
          change_user => $20::TEXT)
          `,
        [
          invoice,
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
          booking.isQuote,
          booking.changeUser,
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
    try {
      const { booking } = req.body;
      if (!booking)
        return res
          .status(400)
          .json({ message: "Bad request: Booking information is required" });

      const updatedBooking = await pool.query(
        `CALL update_booking(clientid => $1::TEXT, 
          employeeId => $2::TEXT, 
          responsiblename => $3::TEXT, 
          responsibleemail => $4::TEXT, 
          responsiblephone => $5::TEXT, 
          quotedate => $6::TEXT, 
          bookingdate => $7::TEXT, 
          category1 => $8::TEXT, 
          numpeople => $9, 
          tripstartdate => $10::TEXT, 
          tripenddate => $11::TEXT, 
          deposit1 => $12, 
          cost1 => $13, 
          hoursquotevalid => $14, 
          clientcomments => $15::TEXT, 
          intinerarydetails => $16::TEXT, 
          internalcoments => $17::TEXT, 
          isquote => $18::BOOLEAN,
          changeuser => $19::TEXT,
          invoice1 => $20::TEXT)`,
        [
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
          booking.isQuote,
          booking.changeUser,
          booking.invoice,
        ]
      );
      return res.json(`Booking/Quote ${booking.invoice} updated`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //updateBooking

  static async deleteBooking(req, res) {
    const client = await pool.connect();

    try {
      let { bookingIds, changeUser } = req.params;
      bookingIds = JSON.parse(bookingIds);
      if (!bookingIds)
        return res
          .status(400)
          .json({ message: "Bad request: Missing invoice information" });

      await client.query("BEGIN");
      const deletedBookings = await bookingIds.map(async (booking) => {
        return await client.query(
          `CALL delete_booking(bookingid => $1::TEXT, changeuser => $2::TEXT)`,
          [booking, changeUser]
        );
      });
      const deletedPromise = await Promise.all(deletedBookings);
      await client.query("COMMIT");
      return res.json(`Number of items deleted: ${deletedPromise.length}`);
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(err);
      return res.status(500).json({ message: err.message });
    } finally {
      client.release();
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
