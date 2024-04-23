const pool = require("../db");

class ServiceDetail {
  static async newDetail(req, res) {
    try {
      const { detail } = req.body;
      if (!detail)
        return res.status(400).json({
          message: "Bad request: Service detail information is required",
        });

      //insert new
      await pool.query(
        `CALL create_detail(service_id => $1,
        employee_id => $2::TEXT,
        company_id => $3::TEXT,
        vehicle_id => $4::TEXT,
        from_location_id => $5::TEXT,
        to_location_id => $6::TEXT,
        return_location_id => $7::TEXT,
        use_farmout => $8::BOOLEAN,
        spot_time => $9::TEXT,
        start_time => $10::TEXT,
        end_time => $11::TEXT,
        return_time => $12::TEXT,
        instructions => $13::TEXT,
        payment => $14,
        gratuity => $15,
        additional_stop => $16::BOOLEAN,
        additional_stop_info => $17::TEXT,
        additional_stop_detail => $18::TEXT,
        trip_length => $19,
        change_user => $20::TEXT,
        special_events => $21::TEXT)`,
        [
          detail.serviceId,
          detail.employeeId,
          detail.companyId,
          detail.vehicleId,
          detail.fromServiceLocationId,
          detail.toServiceLocationId,
          detail.returnServiceLocationId,
          detail.useFarmout,
          detail.spotTime,
          detail.startTime,
          detail.endTime,
          detail.returnTime,
          detail.instructions,
          detail.payment,
          detail.gratuity,
          detail.additionalStop,
          detail.additionalStopInfo,
          detail.additionalStopDetail,
          detail.tripLength,
          detail.changeUser,
          detail.specialEvents,
        ]
      );
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
    try {
      const { detail } = req.body;
      if (!detail)
        return res.status(400).json({
          message: "Bad request: Service detail information is required",
        });

      await pool.query(
        `CALL update_detail(serviceid=>$1,
          employeeid=>$2::TEXT,
          companyid=>$3::TEXT,
          vehicleid=>$4::TEXT,
          fromlocationid=>$5::TEXT,
          tolocationid=>$6::TEXT,
          returnlocationid=>$7::TEXT,
          usefarmout=>$8::BOOLEAN,
          spottime=>$9::TEXT,
          starttime=>$10::TEXT,
          endtime=>$11::TEXT,
          returntime=>$12::TEXT,
          instructions1=>$13::TEXT,
          payment1=>$14,
          gratuity1=>$15,
          additionalstop=>$16::BOOLEAN,
          additionalstopinfo=>$17::TEXT,
          additionalstopdetail=>$18::TEXT,
          triplength=>$19,
          changeuser=>$20::TEXT,
          specialevents=>$21::TEXT,
          detailid=>$22)`,
        [
          detail.serviceId,
          detail.employeeId,
          detail.companyId,
          detail.vehicleId,
          detail.fromServiceLocationId,
          detail.toServiceLocationId,
          detail.returnServiceLocationId,
          detail.useFarmout,
          detail.spotTime,
          detail.startTime,
          detail.endTime,
          detail.returnTime,
          detail.instructions,
          detail.payment,
          detail.gratuity,
          detail.additionalStop,
          detail.additionalStopInfo,
          detail.additionalStopDetail,
          detail.tripLength,
          detail.changeUser,
          detail.specialEvents,
          detail.detailId,
        ]
      );
      return res.json(`Service detail ${detail.detailId} updated`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //updateDetail

  static async deleteDetail(req, res) {
    try {
      const { detailid, username } = req.params;
      if (!detailid || !username)
        return res.status(400).json({
          message: "Bad request: Missing service detail id or username",
        });

      const deletedDetail = await pool.query(
        `SELECT delete_detail(${detailid}, '${username}')`
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
      let { detailIds, username } = req.params;
      detailIds = JSON.parse(detailIds);
      if (!detailIds || !username)
        return res.status(400).json({
          message: "Bad request: Missing service detail id or username",
        });

      const deletedDetails = await detailIds.map(async (detail) => {
        return await pool.query(
          `SELECT delete_detail(${detail}, '${username}')`
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

      const result = await pool.query(
        "Select * FROM has_driver_trip($1, $2, $3)",
        [detailId, driverId, serviceDate?.substring(0, 10)]
      );

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

      const result = await pool.query(
        "Select * FROM has_vehicle_trip($1, $2, $3)",
        [detailId, vehicleId, serviceDate?.substring(0, 10)]
      );

      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //checkVehicleHasTrip

  static async getLogDetail(req, res) {
    try {
      let { detailid } = req.params;
      if (!detailid)
        return res.status(400).json({
          message: "Bad request: Missing detail id",
        });

      const result = await pool.query(
        "SELECT * from log_service_details WHERE detail_id = $1",
        [detailid]
      );

      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //getLogDetail

  //Duplicates one detail
  static async duplicateDetail(req, res) {
    const client = await pool.connect();
    try {
      let { detailId, changeUser } = req.body;

      if (!detailId || !changeUser)
        return res
          .status(400)
          .json({ message: "Bad request: Missing detail id" });

      //start transaction
      await client.query("BEGIN");
      //get current service detail data
      let response = await client.query(
        `SELECT * FROM service_details WHERE detail_id = ${detailId}`
      );
      const detail = response.rows?.at(0);

      //create a new detail
      await client.query(
        `CALL create_detail(service_id => $1,
      employee_id => $2::TEXT,
      company_id => $3::TEXT,
      vehicle_id => $4::TEXT,
      from_location_id => $5::TEXT,
      to_location_id => $6::TEXT,
      return_location_id => $7::TEXT,
      use_farmout => $8::BOOLEAN,
      spot_time => $9::TEXT,
      start_time => $10::TEXT,
      end_time => $11::TEXT,
      return_time => $12::TEXT,
      instructions => $13::TEXT,
      payment => $14,
      gratuity => $15,
      additional_stop => $16::BOOLEAN,
      additional_stop_info => $17::TEXT,
      additional_stop_detail => $18::TEXT,
      trip_length => $19,
      change_user => $20::TEXT,
      special_events => $21::TEXT)`,
        [
          detail.service_id,
          null,
          null,
          null,
          detail.from_location_id,
          detail.to_location_id,
          detail.return_location_id,
          detail.use_farmout,
          detail.spot_time,
          detail.start_time,
          detail.end_time,
          detail.return_time,
          detail.instructions,
          detail.payment,
          detail.gratuity,
          detail.additional_stop,
          detail.additional_stop_info,
          detail.additional_stop_detail,
          detail.trip_length,
          changeUser,
          detail.specialEvents,
        ]
      );

      //End transaction
      await client.query("COMMIT");
      return res.json(`Details duplicated.`);
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(err);
      return res.status(500).json({ message: err.message });
    } finally {
      client.release();
    }
  } //duplicateDetail
}

module.exports = { ServiceDetail };
