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
        `INSERT INTO service_details (service_id, employee_id, vehicle_id, from_location_id, to_location_id, return_location_id, spot_time, start_time, end_time, instructions, gratuity, payment, company_id, use_farmout, additional_stop, additional_stop_info, additional_stop_detail, trip_length)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
        [
          detail.serviceId,
          detail.employeeId,
          detail.vehicleId,
          detail.fromServiceLocationId,
          detail.toServiceLocationId,
          detail.returnServiceLocationId,
          detail.spotTime,
          detail.startTime,
          detail.endTime,
          detail.instructions,
          detail.gratuity,
          detail.payment,
          detail.companyId,
          detail.useFarmout,
          detail.additionalStop,
          detail.additionalStopInfo,
          detail.additionalStopDetail,
          detail.tripLength,
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

  //get details for one service
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
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //getDetails

  //get details for 2 or more services
  static async getSomeDetails(req, res) {
    try {
      let { serviceIds } = req.params;
      serviceIds = JSON.parse(serviceIds);
      if (!serviceIds)
        return res.status(400).json({
          message: "Bad request: Missing service ids",
        });

      const details = await serviceIds.map(async (serviceId) => {
        const result = await pool.query(
          "Select * FROM service_details WHERE service_id = $1",
          [serviceId]
        );
        return result.rows;
      });

      const detailsPromise = await Promise.all(details);
      return res.json(detailsPromise);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //getSomeDetails

  static async updateDetail(req, res) {
    const { detail } = req.body;
    if (!detail)
      return res.status(400).json({
        message: "Bad request: Service detail information is required",
      });

    try {
      const updatedDetail = await pool.query(
        "UPDATE service_details SET service_id = $1, employee_id = $2, vehicle_id = $3, from_location_id = $4, to_location_id = $5, spot_time = $6, start_time = $7, end_time = $8, instructions = $9, gratuity = $10, payment = $11, company_id = $12, use_farmout = $13, return_location_id = $14, additional_stop = $15, additional_stop_info = $16, additional_stop_detail = $17, trip_length = $18 WHERE detail_id = $19",
        [
          detail.serviceId,
          detail.employeeId,
          detail.vehicleId,
          detail.fromServiceLocationId,
          detail.toServiceLocationId,
          detail.spotTime,
          detail.startTime,
          detail.endTime,
          detail.instructions,
          detail.gratuity,
          detail.payment,
          detail.companyId,
          detail.useFarmout,
          detail.returnServiceLocationId,
          detail.additionalStop,
          detail.additionalStopInfo,
          detail.additionalStopDetail,
          detail.tripLength,
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
    try {
      let { detailIds } = req.params;
      detailIds = JSON.parse(detailIds);
      if (!detailIds)
        return res.status(400).json({
          message: "Bad request: Missing service detail id",
        });

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

  static async checkDriverHasTrip(req, res) {
    try {
      let { detailId, driverId, serviceDate } = req.params;
      if (!detailId || !driverId || !serviceDate)
        return res.status(400).json({
          message: "Bad request: Missing driver Id or service date",
        });

      const result = await pool.query("Select has_driver_trip($1, $2, $3)", [
        detailId,
        driverId,
        serviceDate,
      ]);

      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //checkDriverHasTrip

  static async checkVehicleHasTrip(req, res) {
    try {
      let { detailId, vehicleId, serviceDate } = req.params;
      if (!detailId || !vehicleId || !serviceDate)
        return res.status(400).json({
          message: "Bad request: Missing vehicle Id or service date",
        });

      const result = await pool.query("Select has_vehicle_trip($1, $2, $3)", [
        detailId,
        vehicleId,
        serviceDate,
      ]);

      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //checkVehicleHasTrip
}

module.exports = { ServiceDetail };
