const { v4: uuid } = require("uuid");
const pool = require("../db");

class Client {
  static async newClient(req, res) {
    const { client } = req.body;
    if (!client)
      return res
        .status(400)
        .json({ message: "Bad request: Client information is required" });
    try {
      //generate a new id
      const newId = uuid();
      //insert the new client
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
      //console.log(newClient.rowCount);
      //send the reponse to client
      return res.status(201).json(`Client ${client.agency} created`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //newClient

  static async getAllClients() {
    try {
      const result = await pool.query("Select * FROM clients");
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getAllClients

  static async updateClient(req, res) {
    const { client } = req.body;
    if (!client)
      return res
        .status(400)
        .json({ message: "Bad request: No client information is required" });
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
      if (updatedClient.rowCount)
        return res.json(`Client ${client.agency} updated`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //updateClient

  static async deleteClient(req, res) {
    try {
      let { clientIds } = req.params;
      clientIds = JSON.parse(clientIds);

      if (!clientIds)
        return res
          .status(400)
          .json({ message: "Bad request: Missing client id" });

      const deletedClients = await clientIds.map(async (client) => {
        return await pool.query("DELETE from clients WHERE client_id = $1", [
          client,
        ]);
      });

      const deletedPromise = await Promise.all(deletedClients);
      console.log(deletedPromise);

      if (deletedPromise[0].rowCount)
        return res.json(
          `Number of client(s) deleted: ${deletedPromise.length}`
        );
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //deleteClient
}

module.exports = { Client };
