const { v4: uuid } = require("uuid");
const pool = require("../db");

class FarmOut {
  static async newCompany(company) {
    try {
      //generate a new id
      const newId = uuid();
      //insert the new company
      const newCompany = await pool.query(
        `INSERT INTO companies (company_id, company_name, contact, address, city, company_state, zip, phone, email, ein, dot, insurance, account, routing, wire, zelle)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [
          newId,
          company.name,
          company.contact,
          company.address,
          company.city,
          company.state,
          company.zip,
          company.phone,
          company.email,
          company.ein,
          company.dot,
          company.insurance,
          company.account,
          company.routing,
          company.wire,
          company.zelle,
        ]
      );
      console.log(newCompany.rowCount);
      //send the reponse to company
      return `Company ${newId} created`;
    } catch (err) {
      console.error(err);
      if (err) return { msg: err.message, detail: err.detail };
    }
  } //newCompany

  static async getAllCompanies() {
    try {
      const result = await pool.query("Select * FROM companies");
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return "Query failed";
    }
  } //getAllCompanies

  static async updateCompany(company) {
    try {
      const updatedCompany = await pool.query(
        "UPDATE companies SET company_name = $1, contact = $2, address = $3, city = $4, company_state = $5, zip = $6, phone = $7, email = $8, ein = $9, dot = $10, insurance = $11, account = $12, routing = $13, wire = $14, zelle = $15 WHERE company_id = $16",
        [
          company.name,
          company.contact,
          company.address,
          company.city,
          company.state,
          company.zip,
          company.phone,
          company.email,
          company.ein,
          company.dot,
          company.insurance,
          company.account,
          company.routing,
          company.wire,
          company.zelle,
          company.id,
        ]
      );
      if (updatedCompany.rowCount) return `Company ${company.name} updated`;
      else return { failed: "Failed to update company" };
    } catch (err) {
      console.error(err);
      if (err) return { failed: `Error: ${err.message}` };
    }
  } //updateCompany

  static async deleteCompany(companyIds) {
    try {
      const deletedCompanies = await companyIds.map(async (company) => {
        return await pool.query("DELETE from companies WHERE company_id = $1", [
          company,
        ]);
      });
      const deletedPromise = await Promise.all(deletedCompanies);
      console.log(deletedPromise);
      if (deletedPromise[0].rowCount)
        return `Number of companies deleted: ${deletedPromise.length}`;
      else return { failed: "Failed to delete company" };
    } catch (err) {
      console.error(err);
      if (err) return { failed: `Error: ${err.message}` };
    }
  } //deleteCompany
}

module.exports = { FarmOut };
