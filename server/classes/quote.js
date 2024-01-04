const { v4: uuid } = require("uuid");
const pool = require("../db");

class Quote {
  static async newQuote(req, res) {
    const { quote } = req.body;
    if (!quote)
      return res
        .status(400)
        .json({ message: "Bad request: Quote information is required" });
    try {
      //generate a new id
      const newId = uuid();
      //insert the new quote
      const newQuote = await pool.query(
        `INSERT INTO quotes (quote_id, client_id, employee_id, pickup_location_id, destination_location_id, return_location_id, responsible_name, responsible_email, responsible_phone, quote_date, category, pax_group, num_people, trip_start_date, trip_end_date, deposit, cost, mco_mca, service_type, pickup_time, return_time, additional_stop, additional_stop_info, additional_stop_detail, trip_length, hours_quote_valid, client_comments, intinerary_details, internal_coments)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29)`,
        [
          newId,
          quote.clientId,
          quote.employeeId,
          quote.pickupLocationId,
          quote.destinationLocationId,
          quote.returnLocationId,
          quote.responsibleName,
          quote.responsibleEmail,
          quote.responsiblePhone,
          quote.quoteDate,
          quote.category,
          quote.paxGroup,
          quote.numPeople,
          quote.tripStartDate,
          quote.tripEndDate,
          quote.deposit,
          quote.quotedCost,
          quote.arrivalProcMCOMCA,
          quote.serviceType,
          quote.pickupTime,
          quote.returnTime,
          quote.addStop,
          quote.addStopInfo,
          quote.addStopDetail,
          quote.tripLength,
          quote.numHoursQuoteValid,
          quote.clientComments,
          quote.intineraryDetails,
          quote.internalComments,
        ]
      );
      console.log(newQuote.rowCount);
      //send the reponse to quote
      return res.status(201).json(`Quote ${newId} created`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //newQuote

  static async getAllQuotes() {
    try {
      const result = await pool.query("Select * FROM quotes");
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getAllQuotes

  static async updateQuote(req, res) {
    const { quote } = req.body;
    if (!quote)
      return res
        .status(400)
        .json({ message: "Bad request: Quote information is required" });
    try {
      const updatedQuote = await pool.query(
        "UPDATE quotes SET client_id = $1, employee_id = $2, pickup_location_id = $3, destination_location_id = $4, return_location_id = $5, responsible_name = $6, responsible_email = $7, responsible_phone = $8, quote_date = $9, category = $10, pax_group = $11, num_people = $12, trip_start_date = $13, trip_end_date = $14, deposit = $15, cost = $16, mco_mca = $17, service_type = $18, pickup_time = $19, return_time = $20, additional_stop = $21, additional_stop_info = $22, additional_stop_detail = $23, trip_length = $24, hours_quote_valid = $25, client_comments = $26, intinerary_details = $27, internal_coments = $28 WHERE quote_id = $29",
        [
          quote.clientId,
          quote.employeeId,
          quote.pickupLocationId,
          quote.destinationLocationId,
          quote.returnLocationId,
          quote.responsibleName,
          quote.responsibleEmail,
          quote.responsiblePhone,
          quote.quoteDate,
          quote.category,
          quote.paxGroup,
          quote.numPeople,
          quote.tripStartDate,
          quote.tripEndDate,
          quote.deposit,
          quote.quotedCost,
          quote.arrivalProcMCOMCA,
          quote.serviceType,
          quote.pickupTime,
          quote.returnTime,
          quote.addStop,
          quote.addStopInfo,
          quote.addStopDetail,
          quote.tripLength,
          quote.numHoursQuoteValid,
          quote.clientComments,
          quote.intineraryDetails,
          quote.internalComments,
          quote.quoteId,
        ]
      );
      if (updatedQuote.rowCount)
        return res.json(`Quote ${quote.quoteId} updated`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //updateQuote

  static async deleteQuote(req, res) {
    let { quoteIds } = req.params;
    quoteIds = JSON.parse(quoteIds);

    if (!quoteIds)
      return res.status(400).json({ message: "Bad request: Missing quote id" });
    try {
      const deletedQuotes = await quoteIds.map(async (quote) => {
        return await pool.query("DELETE from quotes WHERE quote_id = $1", [
          quote,
        ]);
      });
      const deletedPromise = await Promise.all(deletedQuotes);
      console.log(deletedPromise);
      if (deletedPromise[0].rowCount)
        return res.json(`Number of quotes deleted: ${deletedPromise.length}`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //deleteQuote
}

module.exports = { Quote };
