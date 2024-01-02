const pool = require("../db");

class ServiceDetail {
  static async newDetail(req, res) {
    const { detail } = req.body;
    if (!detail)
      return res.status(400).json({
        message: "Bad request: Service detail information is required",
      });

    try {
      //insert new
      const newDetail = await pool.query(
        `INSERT INTO service_details (service_id, employee_id, vehicle_id, from_location_id, to_location_id, spot_time, start_time, end_time, base_time, service_type, instructions, gratuity, released_time, payment, perdiem)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
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
          detail.releasedTime,
          detail.payment,
          detail.perdiem,
        ]
      );
      console.log(newDetail.rowCount);
      //send reponse
      return res.status(201).json(`Service detail created`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //newDetail

  static async getAllDetails() {
    try {
      const result = await pool.query("Select * FROM service_details");
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getAllDetails

  static async getDetails(req, res) {
    const { serviceId } = req.params;
    if (!serviceId)
      return res.status(400).json({
        message: "Bad request: Missing service id",
      });

    try {
      const result = await pool.query(
        "Select * FROM service_details WHERE service_id = $1",
        [serviceId]
      );
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //getDetails

  static async updateDetail(req, res) {
    const { detail } = req.body;
    if (!detail)
      return res.status(400).json({
        message: "Bad request: Service detail information is required",
      });

    try {
      const updatedDetail = await pool.query(
        "UPDATE service_details SET service_id = $1, employee_id = $2, vehicle_id = $3, from_location_id = $4, to_location_id = $5, spot_time = $6, start_time = $7, end_time = $8, base_time = $9, service_type = $10, instructions = $11, gratuity = $12, released_time = $13, payment = $14, perdiem = $15 WHERE detail_id = $16",
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
          detail.releasedTime,
          detail.payment,
          detail.perdiem,
          detail.detailId,
        ]
      );
      if (updatedDetail.rowCount)
        return res.json(`Service detail ${detail.detailId} updated`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //updateDetail

  static async deleteDetail(req, res) {
    const { detailid } = req.params;
    if (!detailid)
      return res.status(400).json({
        message: "Bad request: Missing service detail id",
      });

    try {
      const deletedDetail = await pool.query(
        "DELETE from service_details WHERE detail_id = $1",
        [detailid]
      );
      console.log(deletedDetail);
      if (deletedDetail) return res.json(`Service detail ${detailid} deleted`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //deleteDetail

  static async deleteSomeDetails(req, res) {
    const { detailIds } = req.body;
    if (!detailIds)
      return res.status(400).json({
        message: "Bad request: Missing service detail id",
      });

    try {
      const deletedDetails = await detailIds.map(async (detail) => {
        return await pool.query(
          "DELETE from service_details WHERE detail_id = $1",
          [detail]
        );
      });
      const deletedPromise = await Promise.all(deletedDetails);
      console.log(deletedPromise);
      if (deletedPromise[0].rowCount)
        return res.json(`Number of details deleted: ${deletedPromise.length}`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //deleteSomeDetails
}

module.exports = { ServiceDetail };
