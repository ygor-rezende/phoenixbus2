const { v4: uuid } = require("uuid");
const pool = require("../db");

class FarmOut {
  static async newCompany(req, res) {
    const { company } = req.body;
    if (!company)
      return res
        .status(400)
        .json({ message: "Bad request: Company information is required" });

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
      return res.status(201).json(`Company ${company.name} created`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //newCompany

  static async getAllCompanies() {
    try {
      const result = await pool.query("Select * FROM companies");
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getAllCompanies

  static async updateCompany(req, res) {
    const { company } = req.body;
    if (!company)
      return res
        .status(400)
        .json({ message: "Bad request: Company information is required" });
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
      if (updatedCompany.rowCount)
        return res.json(`Company ${company.name} updated`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //updateCompany

  static async deleteCompany(req, res) {
    let { companyIds } = req.params;
    companyIds = JSON.parse(companyIds);
    if (!companyIds)
      return res
        .status(400)
        .json({ message: "Bad request: Missing company id" });
    try {
      const deletedCompanies = await companyIds.map(async (company) => {
        return await pool.query("DELETE from companies WHERE company_id = $1", [
          company,
        ]);
      });
      const deletedPromise = await Promise.all(deletedCompanies);
      console.log(deletedPromise);
      if (deletedPromise[0].rowCount)
        return res.json(
          `Number of companies deleted: ${deletedPromise.length}`
        );
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //deleteCompany

  static async getAllCompanyNames() {
    try {
      const result = await pool.query(
        "Select company_id, company_name FROM companies"
      );

      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getAllCompanyNames
}

module.exports = { FarmOut };
