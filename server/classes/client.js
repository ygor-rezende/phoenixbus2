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

  static async updateClient(client) {
    try {
      const updatedClient = await pool.query(
        "UPDATE clients SET agency = $1, contact = $2, address1 = $3, address2 = $4, city = $5, client_state = $6, zip = $7, country = $8, phone = $9, fax = $10, email = $11, remark = $12 WHERE client_id = $13",
        [
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
          client.id,
        ]
      );
      if (updatedClient.rowCount) return `Client ${client.agency} updated`;
      else return { failed: "Failed to update client" };
    } catch (err) {
      console.error(err);
      if (err) return { failed: `Error: ${err.message}` };
    }
  } //updateClient

  static async deleteClient(clientIds) {
    try {
      const deletedClients = [];
      clientIds.forEach(async (client) => {
        const deletedClient = await pool.query(
          "DELETE from clients WHERE client_id = $1",
          [client]
        );
        console.log(deletedClient);
        deletedClients.push(deletedClient);
      });
      if (deletedClients[0].rowCount) return "Client(s) deleted";
      else return { failed: "Failed to delete client" };
    } catch (err) {
      console.error(err);
      if (err) return { failed: `Error: ${err.message}` };
    }
  } //deleteClient
}

module.exports = { Client };
