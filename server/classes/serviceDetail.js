const pool = require("../db");

class ServiceDetail {
  static async newDetail(detail) {
    try {
      //insert new
      const newDetail = await pool.query(
        `INSERT INTO service_details (service_id, employee_id, vehicle_id, from_location_id, to_location_id, spot_time, start_time, end_time, base_time, service_type, instructions, gratuity)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          detail.serviceId,
          detail.employeeId,
          detail.vehicleId,
          detail.fromServiceLocationId,
          detail.toServiceLocationId,
          detail.spotTime,
          detail.startTime,
          detail.endTime,
          detail.baseTime,
          detail.type,
          detail.instructions,
          detail.gratuity,
        ]
      );
      console.log(newDetail.rowCount);
      //send reponse
      return `Service detail created`;
    } catch (err) {
      console.error(err);
      if (err) return { msg: err.message, detail: err.detail };
    }
  } //newDetail

  static async getAllDetails() {
    try {
      const result = await pool.query("Select * FROM services");
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return "Query failed";
    }
  } //getAllServices

  static async getDetails(invoice) {
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

  static async updateDetail(service) {
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

  static async deleteDetail(serviceId) {
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
}

module.exports = { ServiceDetail };
