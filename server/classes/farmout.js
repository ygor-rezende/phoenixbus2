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
        `CALL create_company(company_id => $1::TEXT, 
        company_name => $2::TEXT, 
        contact => $3::TEXT, 
        address => $4::TEXT, 
        city => $5::TEXT, 
        company_state => $6::TEXT, 
        zip => $7::TEXT, 
        phone => $8::TEXT, 
        email => $9::TEXT, 
        ein => $10::TEXT, 
        dot => $11::TEXT, 
        insurance => $12::TEXT, 
        account => $13::TEXT, 
        routing => $14::TEXT, 
        wire => $15::TEXT, 
        zelle => $16::TEXT,
        change_user => $17::TEXT)
         `,
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
          company.changeUser,
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
        `CALL update_company(companyid => $1::TEXT, 
          companyname => $2::TEXT, 
          contact1 => $3::TEXT, 
          address1 => $4::TEXT, 
          city1 => $5::TEXT, 
          companystate => $6::TEXT, 
          zip1 => $7::TEXT, 
          phone1 => $8::TEXT, 
          email1 => $9::TEXT, 
          ein1 => $10::TEXT, 
          dot1 => $11::TEXT, 
          insurance1 => $12::TEXT, 
          account1 => $13::TEXT, 
          routing1 => $14::TEXT, 
          wire1 => $15::TEXT, 
          zelle1 => $16::TEXT,
          changeuser => $17::TEXT)
          `,
        [
          company.id,
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
          company.changeUser,
        ]
      );
      return res.json(`Company ${company.name} updated`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //updateCompany

  static async deleteCompany(req, res) {
    const client = await pool.connect();

    try {
      let { companyIds, changeUser } = req.params;
      companyIds = JSON.parse(companyIds);
      if (!companyIds)
        return res
          .status(400)
          .json({ message: "Bad request: Missing company id" });

      await client.query("BEGIN");
      const deletedCompanies = await companyIds.map(async (company) => {
        return await client.query(
          `CALL delete_company(companyid => $1::TEXT, changeuser => $2::TEXT)`,
          [company, changeUser]
        );
      });
      const deletedPromise = await Promise.all(deletedCompanies);
      await client.query("COMMIT");
      return res.json(`Number of companies deleted: ${deletedPromise.length}`);
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(err);
      return res.status(500).json({ message: err.message });
    } finally {
      client.release();
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
