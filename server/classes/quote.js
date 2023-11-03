const { v4: uuid } = require("uuid");
const pool = require("../db");

class Quote {
  static async newQuote(quote) {
    try {
      //generate a new id
      const newId = uuid();
      //insert the new quote
      const newQuote = await pool.query(
        `INSERT INTO quotes (quote_id, client_id, employee_id, quote_date, category, pax_group, num_adults, num_child, trip_start_date, trip_end_date, deposit, cost, mco_mca, hours_quote_valid, client_comments, intinerary_details, internal_coments)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
        [
          newId,
          quote.clientId,
          quote.employeeId,
          quote.quoteDate,
          quote.category,
          quote.paxGroup,
          quote.numAdults,
          quote.numChild,
          quote.tripStartDate,
          quote.tripEndDate,
          quote.deposit,
          quote.quotedCost,
          quote.arrivalProcMCOMCA,
          quote.numHoursQuoteValid,
          quote.clientComments,
          quote.intineraryDetails,
          quote.internalComments,
        ]
      );
      console.log(newQuote.rowCount);
      //send the reponse to quote
      return `Quote ${newId} created`;
    } catch (err) {
      console.error(err);
      if (err) return { msg: err.message, detail: err.detail };
    }
  } //newQuote

  static async getAllQuotes() {
    try {
      const result = await pool.query("Select * FROM quotes");
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return "Query failed";
    }
  } //getAllQuotes

  static async updateQuote(quote) {
    try {
      const updatedQuote = await pool.query(
        "UPDATE quotes SET client_id = $1, employee_id = $2, quote_date = $3, category = $4, pax_group = $5, num_adults = $6, num_child = $7, trip_start_date = $8, trip_end_date = $9, deposit = $10, cost = $11, mco_mca = $12, hours_quote_valid = $13, client_comments = $14, intinerary_details = $15, internal_coments = $16 WHERE quote_id = $17",
        [
          quote.clientId,
          quote.employeeId,
          quote.quoteDate,
          quote.category,
          quote.paxGroup,
          quote.numAdults,
          quote.numChild,
          quote.tripStartDate,
          quote.tripEndDate,
          quote.deposit,
          quote.quotedCost,
          quote.arrivalProcMCOMCA,
          quote.numHoursQuoteValid,
          quote.clientComments,
          quote.intineraryDetails,
          quote.internalComments,
          quote.quoteId,
        ]
      );
      if (updatedQuote.rowCount) return `Quote ${quote.quoteId} updated`;
      else return { failed: "Failed to update quote" };
    } catch (err) {
      console.error(err);
      if (err) return { failed: `Error: ${err.message}` };
    }
  } //updateQuote

  static async deleteQuote(quoteIds) {
    try {
      const deletedQuotes = await quoteIds.map(async (quote) => {
        return await pool.query("DELETE from quotes WHERE quote_id = $1", [
          quote,
        ]);
      });
      const deletedPromise = await Promise.all(deletedQuotes);
      console.log(deletedPromise);
      if (deletedPromise[0].rowCount)
        return `Number of quotes deleted: ${deletedPromise.length}`;
      else return { failed: "Failed to delete quote" };
    } catch (err) {
      console.error(err);
      if (err) return { failed: `Error: ${err.message}` };
    }
  } //deleteQuote
}

module.exports = { Quote };
