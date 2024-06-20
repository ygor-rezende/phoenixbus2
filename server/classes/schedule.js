const axios = require("axios");
const pool = require("../db");
require("dotenv").config();
const os = require("os");
const logger = require("firebase-functions/logger");

class Schedule {
  static async getSchedule(req, res) {
    try {
      const { dates } = req.params;
      let newDates = JSON.parse(dates);
      if (!newDates || !newDates?.startDate || !newDates?.endDate)
        return res.status(400).json("Bad request: Missing dates");

      let newEndDate = new Date(newDates.endDate);
      newEndDate.setDate(newEndDate.getDate() + 1);
      newEndDate = newEndDate.toISOString().slice(0, 10);
      const result = await pool.query(
        `select 
        b.invoice,
        b.client_comments,
        b.category,
        s.service_id,
        s.charge,
        s.service_date,
        s.service_code,
        d.detail_id,
        d.spot_time,
        d.start_time,
        d.return_time,
        d.end_time,
        d.instructions,
        d.payment,
        d.use_farmout,
        d.additional_stop,
        d.additional_stop_info,
        d.additional_stop_detail,
        d.trip_length,
        d.special_events,
        d.confirmed,
        c.company_id,
        c.company_name,
        e.employee_id,
        e.firstname,
        e.lastname,
        e.phone AS driver_phone,
        v.vehicle_id,
        v.vehicle_name,
        v.vehicle_color,
        v.vehicle_model,
        v.tag,
        cli.agency,
        cli.contact,
        cli.phone,
        lf.location_id as from_location_id,
        lf.location_name as from_location,
        lf.city as from_city,
        lf.address as from_address,
        lf.location_state as from_state,
        lt.location_id as to_location_id,
        lt.location_name as to_location,
        lt.city as to_city,
        lt.address as to_address,
        lt.location_state as to_state,
        lr.location_id as return_location_id,
        lr.location_name as return_location,
        lr.city as return_city,
        lr.address as return_address,
        lr.location_state as return_state
        from bookings b join services s on b.invoice = s.booking_id
        join clients cli on cli.client_id = b.client_id
        join service_details d on d.service_id = s.service_id
        full outer join employees e on e.employee_id = d.employee_id
        full outer join vehicles v on v.vehicle_id = d.vehicle_id
        join locations lf on lf.location_id = d.from_location_id
        join locations lt on lt.location_id = d.to_location_id
        full outer join locations lr on lr.location_id = d.return_location_id
        full outer join companies c on c.company_id = d.company_id
        WHERE b.is_quote = false AND s.service_date >= $1 AND s.service_date < $2 AND status != 'canceled'
        ORDER BY d.start_time`,
        [newDates.startDate, newEndDate]
      );
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  }

  static async getBusesDailySchedule(req, res) {
    try {
      const { serviceDate } = req.params;
      if (!serviceDate)
        return res.status(400).json("Bad request: Missing service date");

      const response = await pool.query(
        `SELECT * FROM get_buses_daily_schedule(servicedate => '${serviceDate}%'::TEXT)`
      );

      return res.json(response.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  }

  static async updateSchedule(req, res) {
    const client = await pool.connect();
    try {
      const { detail, smsData } = req.body;
      if (!detail)
        return res.status(400).json("Bad request: Missing information");

      //Start transaction
      await client.query("BEGIN");

      // //get the confirmed field for later check
      // const response = await client.query(
      //   `SELECT confirmed FROM service_details WHERE detail_id = ${detail.detailId}`
      // );

      // const wasConfirmed = response.rows?.at(0)?.confirmed;

      //Update service details
      await client.query(
        `CALL update_detail(
          spottime=>$1::TEXT,
          starttime=>$2::TEXT,
          endtime=>$3::TEXT,
          returntime=>$4::TEXT,
          instructions1=>$5::TEXT,
          payment1=>$6,          
          employeeid=>$7::TEXT,
          vehicleid=>$8::TEXT,
          fromlocationid=>$9::TEXT,
          tolocationid=>$10::TEXT,
          returnlocationid=>$11::TEXT,
          usefarmout=>$12::BOOLEAN,
          companyid=>$13::TEXT,
          changeuser=>$14::TEXT,
          confirmed1=>$15::BOOLEAN,
          specialevents=>$16::TEXT,
          detailid=>$17
          )`,
        [
          detail.spotTime,
          detail.startTime,
          detail.endTime,
          detail.returnTime,
          detail.instructions,
          detail.payment,
          detail.employeeId,
          detail.vehicleId,
          detail.fromLocationId,
          detail.toLocationId,
          detail.returnLocationId,
          detail.useFarmout,
          detail.companyId,
          detail.changeUser,
          detail.confirmed,
          detail.specialEvents,
          detail.detailId,
        ]
      );

      //Check if SMS was sent before
      const smsResponse = await client.query(
        `SELECT 1 FROM sms WHERE sms_id = '${smsData.id}'`
      );

      //Get data for pdf creation
      const result = await client.query(
        `SELECT * FROM get_driver_pdf_data(detailid => ${detail.detailId})`
      );
      const pdfData = result.rows?.at(0);
      //request driver order pdf creation
      //let pdfResp = await this.createDriverPdf(pdfData, smsData.id);
      //logger.info(pdfResp);

      //send SMS if needed: When never sent before or when user select to resend it
      let smsResp = "";
      if (
        (detail.useFarmout === false &&
          detail.confirmed === true &&
          smsResponse.rowCount < 1) ||
        smsData.resend
      ) {
        logger.log("Sending SMS");
        //smsResp = await this.sendSMS(smsData);
      }

      await client.query("COMMIT");
      return res.json(`Schedule updated successfully. ${smsResp}`);
    } catch (err) {
      await client.query("ROLLBACK");
      logger.error(err);
      return res.status(500).json({ message: err.message });
    } finally {
      client.release();
    }
  } //update schedule

  static async sendSMS(data) {
    //call post method on smsService
    let response;
    if (os.hostname().indexOf("LAPTOP") > -1) {
      response = await axios.post(`${process.env.SMSSERVICE}/sendSMS`, {
        data: data,
      });
    } else {
      response = await axios.post(`${process.env.SMSSERVICEPROD}/sendSMS`, {
        data,
      });
    }
    return response?.data;
  } //sendSMS

  static async createDriverPdf(data, smsId) {
    //call post method on pdfService
    //SMSID is required for the link to confirm the trip
    let response;
    if (os.hostname().indexOf("LAPTOP") > -1) {
      response = await axios.post(
        `${process.env.PDFSERVICETEST}/driverOrder/newfile`,
        {
          data,
          smsId,
        }
      );
    } else {
      response = await axios.post(
        `${process.env.PDFSERVICE}/driverOrder/newfile`,
        {
          data,
          smsId,
        }
      );
    }

    return response?.status;
  } //createDriverPdf
}

module.exports = { Schedule };
