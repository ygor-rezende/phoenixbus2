const pool = require("../db");

class Service {
  static async newService(service) {
    try {
      //insert the new Service
      const newService = await pool.query(
        `INSERT INTO services (booking_id, service_name, service_code, service_date, qty, charge, tips, sales_tax, optional)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          service.bookingId,
          service.serviceName,
          service.serviceCode,
          service.serviceDate,
          service.qty,
          service.charge,
          service.tips,
          service.salesTax,
          service.optional,
        ]
      );
      console.log(newService.rowCount);
      //send the reponse to booking
      return `Service ${service.serviceName} created`;
    } catch (err) {
      console.error(err);
      if (err) return { msg: err.message, detail: err.detail };
    }
  } //newService

  static async getAllServices() {
    try {
      const result = await pool.query("Select * FROM services");
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return "Query failed";
    }
  } //getAllServices

  static async getServices(invoice) {
    try {
      const result = await pool.query(
        "Select * FROM services WHERE booking_id = $1",
        [invoice]
      );
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return "Query failed";
    }
  } //getAllServices

  static async updateService(service) {
    try {
      const updatedService = await pool.query(
        "UPDATE services SET booking_id = $1, service_name = $2, service_code = $3, service_date = $4, qty = $5, charge = $6, tips = $7, sales_tax = $8, optional = $9 WHERE service_id = $10",
        [
          service.bookingId,
          service.serviceName,
          service.serviceCode,
          service.serviceDate,
          service.qty,
          service.charge,
          service.tips,
          service.salesTax,
          service.optional,
          service.serviceId,
        ]
      );
      if (updatedService.rowCount)
        return `Service ${service.serviceName} updated`;
      else return { failed: "Failed to update service" };
    } catch (err) {
      console.error(err);
      if (err) return { failed: `Error: ${err.message}` };
    }
  } //updateService

  static async deleteService(serviceId) {
    try {
      const deletedService = await pool.query(
        "DELETE from services WHERE service_id = $1",
        [serviceId]
      );
      console.log(deletedService);
      if (deletedService) return `Service ${serviceId} deleted`;
      else return { failed: "Failed to delete service" };
    } catch (err) {
      console.error(err);
      if (err) return { failed: `Error: ${err.message}` };
    }
  } //deleteService

  static async deleteSomeServices(serviceIds) {
    try {
      const deletedServices = await serviceIds.map(async (service) => {
        return await pool.query("DELETE from services WHERE service_id = $1", [
          service,
        ]);
      });
      const deletedPromise = await Promise.all(deletedServices);
      console.log(deletedPromise);
      if (deletedPromise[0].rowCount)
        return `Number of services deleted: ${deletedPromise.length}`;
      else return { failed: "Failed to delete services" };
    } catch (err) {
      console.error(err);
      if (err) return { failed: `Error: ${err.message}` };
    }
  } //deleteSomeServices
}

module.exports = { Service };
