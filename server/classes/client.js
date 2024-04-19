const { v4: uuid } = require("uuid");
const pool = require("../db");

class Client {
  static async newClient(req, res) {
    try {
      const { client } = req.body;
      if (!client)
        return res
          .status(400)
          .json({ message: "Bad request: Client information is required" });

      //generate a new id
      const newId = uuid();
      //insert the new client
      await pool.query(
        `CALL create_client(
          client_id => '${newId}'::TEXT,
          agency => '${client.agency}'::TEXT,
          contact => '${client.contact}'::TEXT,
          address1 => '${client.address1}'::TEXT,
          address2 => '${client.address2}'::TEXT,
          city => '${client.city}'::TEXT,
          client_state => '${client.state}'::TEXT,
          zip => '${client.zip}'::TEXT,
          country => '${client.country}'::TEXT,
          phone => '${client.phone}'::TEXT,
          fax => '${client.fax}'::TEXT,
          email => '${client.email}'::TEXT,
          remark => '${client.remark}'::TEXT,
          change_user => '${client.changeUser}'::TEXT
        );
        `
      );

      //send the reponse to client
      return res.status(201).json(`Client ${client.agency} created`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //newClient

  static async getAllClients() {
    try {
      const result = await pool.query("Select * FROM clients ORDER BY agency");
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getAllClients

  static async updateClient(req, res) {
    try {
      const { client } = req.body;
      if (!client)
        return res
          .status(400)
          .json({ message: "Bad request: No client information is required" });

      await pool.query(
        `CALL update_client(
          clientId => '${client.id}'::TEXT,
          agency1 => '${client.agency}'::TEXT,
          contact1 => '${client.contact}'::TEXT,
          address11 => '${client.address1}'::TEXT,
          address21 => '${client.address2}'::TEXT,
          city1 => '${client.city}'::TEXT,
          clientState => '${client.state}'::TEXT,
          zip1 => '${client.zip}'::TEXT,
          country1 => '${client.country}'::TEXT,
          phone1 => '${client.phone}'::TEXT,
          fax1 => '${client.fax}'::TEXT,
          email1 => '${client.email}'::TEXT,
          remark1=> '${client.remark}'::TEXT,
          changeUser => '${client.changeUser}'::TEXT
        );
        `
      );

      return res.json(`Client ${client.agency} updated`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //updateClient

  static async deleteClient(req, res) {
    const dbClient = await pool.connect();

    try {
      let { clientIds, changeUser } = req.params;
      clientIds = JSON.parse(clientIds);

      if (!clientIds)
        return res
          .status(400)
          .json({ message: "Bad request: Missing client id" });

      await dbClient.query("BEGIN");
      const deletedClients = await clientIds.map(async (client) => {
        await dbClient.query(
          `CALL delete_client(clientId=> '${client}'::TEXT, changeUser => '${changeUser}'::TEXT)`
        );
        return 1;
      });

      const deletedPromise = await Promise.all(deletedClients);

      await dbClient.query("COMMIT");
      return res.json(`Number of client(s) deleted: ${deletedPromise.length}`);
    } catch (err) {
      await dbClient.query("ROLLBACK");
      console.error(err);
      return res.status(500).json({ message: err.message });
    } finally {
      dbClient.release();
    }
  } //deleteClient
}

module.exports = { Client };
