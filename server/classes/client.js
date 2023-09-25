const { v4: uuid } = require("uuid");
const pool = require("../db");

class Client {
  static async newClient(client) {
    try {
      //generate a new id
      const newId = uuid();
      //insert the new vehicle
      const newClient = await pool.query(
        `INSERT INTO clients (client_id, agency, contact, address1, address2, city, client_state, zip, country, phone, fax, email, remark)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          newId,
          client.agency,
          client.contact,
          client.address1,
          client.address2,
          client.city,
          client.state,
          client.zip,
          client.country,
          client.phone,
          client.fax,
          client.email,
          client.remark,
        ]
      );
      console.log(newClient.rowCount);
      //send the reponse to client
      return `Client ${newId} created`;
    } catch (err) {
      console.error(err);
      if (err) return { msg: err.message, detail: err.detail };
    }
  } //newClient

  static async getAllClients() {
    try {
      const result = await pool.query("Select * FROM clients");
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return "Query failed";
    }
  } //getAllClients
}

module.exports = { Client };
