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
      const result = await pool.query("Select * FROM service_details");
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return "Query failed";
    }
  } //getAllDetails

  static async getDetails(serviceId) {
    try {
      const result = await pool.query(
        "Select * FROM service_details WHERE service_id = $1",
        [serviceId]
      );
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return "Query failed";
    }
  } //getDetails

  static async updateDetail(detail) {
    try {
      const updatedDetail = await pool.query(
        "UPDATE service_details SET service_id = $1, employee_id = $2, vehicle_id = $3, from_location_id = $4, to_location_id = $5, spot_time = $6, start_time = $7, end_time = $8, base_time = $9, service_type = $10, instructions = $11, gratuity = $12 WHERE detail_id = $13",
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
          detail.detailId,
        ]
      );
      if (updatedDetail.rowCount)
        return `Service detail ${detail.detailId} updated`;
      else return { failed: "Failed to update detail" };
    } catch (err) {
      console.error(err);
      if (err) return { failed: `Error: ${err.message}` };
    }
  } //updateDetail

  static async deleteDetail(detailId) {
    try {
      const deletedDetail = await pool.query(
        "DELETE from service_details WHERE detail_id = $1",
        [detailId]
      );
      console.log(deletedDetail);
      if (deletedDetail) return `Service detail ${detailId} deleted`;
      else return { failed: "Failed to delete detail" };
    } catch (err) {
      console.error(err);
      if (err) return { failed: `Error: ${err.message}` };
    }
  } //deleteDetail
}

module.exports = { ServiceDetail };
