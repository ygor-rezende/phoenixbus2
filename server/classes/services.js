const pool = require("../db");

class Service {
  static async newService(req, res) {
    const { service } = req.body;
    if (!service)
      return res
        .status(400)
        .json({ message: "Bad request: Service information is required" });
    try {
      //insert the new Service
      const newService = await pool.query(
        `INSERT INTO services (booking_id, service_name, service_code, service_date, qty, charge, sales_tax)
               VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          service.bookingId,
          service.serviceName,
          service.serviceCode,
          service.serviceDate,
          service.qty,
          service.charge,
          service.salesTax,
        ]
      );
      console.log(newService.rowCount);
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
    const { service } = req.body;
    if (!service)
      return res
        .status(400)
        .json({ message: "Bad request: Service information is required" });

    try {
      const updatedService = await pool.query(
        "UPDATE services SET booking_id = $1, service_name = $2, service_code = $3, service_date = $4, qty = $5, charge = $6, sales_tax = $7 WHERE service_id = $8",
        [
          service.bookingId,
          service.serviceName,
          service.serviceCode,
          service.serviceDate,
          service.qty,
          service.charge,
          service.salesTax,
          service.serviceId,
        ]
      );
      if (updatedService.rowCount)
        return res.json(`Service ${service.serviceName} updated`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //updateService

  static async deleteService(req, res) {
    const { serviceid } = req.params;
    if (!serviceid)
      return res
        .status(400)
        .json({ message: "Bad request: Missing service id" });

    try {
      const deletedService = await pool.query(
        "DELETE from services WHERE service_id = $1",
        [serviceid]
      );
      console.log(deletedService);
      if (deletedService) return res.json(`Service ${serviceid} deleted`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //deleteService

  static async deleteSomeServices(req, res) {
    let { serviceIds } = req.params;
    serviceIds = JSON.parse(serviceIds);
    if (!serviceIds)
      return res
        .status(400)
        .json({ message: "Bad request: Missing service id" });

    try {
      const deletedServices = await serviceIds.map(async (service) => {
        return await pool.query("DELETE from services WHERE service_id = $1", [
          service,
        ]);
      });
      const deletedPromise = await Promise.all(deletedServices);
      console.log(deletedPromise);
      if (deletedPromise[0].rowCount)
        return res.json(`Number of services deleted: ${deletedPromise.length}`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //deleteSomeServices
}

module.exports = { Service };
