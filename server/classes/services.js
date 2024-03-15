const pool = require("../db");

class Service {
  static async newService(req, res) {
    try {
      const { service } = req.body;
      if (!service)
        return res
          .status(400)
          .json({ message: "Bad request: Service information is required" });

      //insert the new Service
      const newService = await pool.query(
        `CALL create_service(booking_id => $1::TEXT, 
          service_name => $2::TEXT, 
          service_code => $3::TEXT, 
          service_date => $4::TEXT, 
          qty => $5, 
          charge => $6, 
          sales_tax => $7, 
          gratuity => $8, 
          change_user => $9::TEXT)
          `,
        [
          service.bookingId,
          service.serviceName,
          service.serviceCode,
          service.serviceDate,
          service.qty,
          service.charge,
          service.salesTax,
          service.gratuity,
          service.changeUser,
        ]
      );
      //send the reponse to booking
      return res.status(201).json(`Service ${service.serviceName} created`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //newService

  static async getAllServices() {
    try {
      const result = await pool.query(
        "Select * FROM services ORDER BY service_id"
      );
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getAllServices

  static async getServices(req, res) {
    const { invoice } = req.params;
    if (!invoice)
      return res
        .status(400)
        .json({ message: "Bad request: Missing invoice information" });
    try {
      const result = await pool.query(
        "Select * FROM services WHERE booking_id = $1 ORDER BY service_id",
        [invoice]
      );
      //console.log(result.rows);
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //getAllServices

  static async updateService(req, res) {
    try {
      const { service } = req.body;
      if (!service)
        return res
          .status(400)
          .json({ message: "Bad request: Service information is required" });

      const updatedService = await pool.query(
        `CALL update_service(serviceid => $1, 
          bookingid => $2::TEXT,
          servicename => $3::TEXT, 
          servicecode => $4::TEXT, 
          servicedate => $5::TEXT, 
          qty1 => $6, 
          charge1 => $7, 
          salestax => $8, 
          gratuity1 => $9, 
          changeuser => $10)`,
        [
          service.serviceId,
          service.bookingId,
          service.serviceName,
          service.serviceCode,
          service.serviceDate,
          service.qty,
          service.charge,
          service.salesTax,
          service.gratuity,
          service.changeUser,
        ]
      );
      return res.json(`Service ${service.serviceName} updated`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //updateService

  static async deleteService(req, res) {
    const client = await pool.connect();

    try {
      const { serviceid, changeUser } = req.params;
      if (!serviceid)
        return res
          .status(400)
          .json({ message: "Bad request: Missing service id" });

      await client.query("BEGIN");
      const deletedService = await client.query(
        "CALL delete_service(serviceid => $1, changeuser => $2::TEXT)",
        [serviceid, changeUser]
      );
      await client.query("COMMIT");
      return res.json(`Service ${serviceid} deleted`);
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(err);
      return res.status(500).json({ message: err.message });
    } finally {
      client.release();
    }
  } //deleteService

  static async deleteSomeServices(req, res) {
    const client = await pool.connect();

    try {
      let { serviceIds, changeUser } = req.params;
      serviceIds = JSON.parse(serviceIds);
      if (!serviceIds)
        return res
          .status(400)
          .json({ message: "Bad request: Missing service id" });

      await client.query("BEGIN");
      const deletedServices = await serviceIds.map(async (service) => {
        return await client.query(
          "CALL delete_service(serviceid => $1, changeuser => $2::TEXT)",
          [service, changeUser]
        );
      });
      const deletedPromise = await Promise.all(deletedServices);
      await client.query("COMMIT");
      return res.json(`Number of services deleted: ${deletedPromise.length}`);
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(err);
      return res.status(500).json({ message: err.message });
    } finally {
      client.release();
    }
  } //deleteSomeServices
}

module.exports = { Service };
