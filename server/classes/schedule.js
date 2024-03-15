const pool = require("../db");

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
        s.service_id,
        s.charge,
        s.service_date,
        s.service_code,
        d.detail_id,
        d.spot_time,
        d.start_time,
        d.end_time,
        d.instructions,
        d.payment,
        d.use_farmout,
        d.additional_stop,
        d.additional_stop_info,
        d.additional_stop_detail,
        d.trip_length,
        c.company_id,
        c.company_name,
        e.employee_id,
        e.firstname,
        e.lastname,
        v.vehicle_id,
        v.vehicle_name,
        v.vehicle_color,
        v.vehicle_model,
        v.tag,
        cli.agency,
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
        WHERE s.service_date >= $1 AND s.service_date < $2
        ORDER BY s.service_date, d.start_time`,
        [newDates.startDate, newEndDate]
      );
      console.log(result.rowCount);
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  }

  static async updateSchedule(req, res) {
    try {
      const { service, detail } = req.body;
      if (!service || !detail)
        return res.status(400).json("Bad request: Missing information");

      await pool.query(
        `CALL update_detail(
          spottime=>$1::TEXT,
          starttime=>$2::TEXT,
          endtime=>$3::TEXT,
          instructions1=>$4::TEXT,
          payment1=>$5,          
          employeeid=>$6::TEXT,
          vehicleid=>$7::TEXT,
          fromlocationid=>$8::TEXT,
          tolocationid=>$9::TEXT,
          usefarmout=>$10::BOOLEAN,
          companyid=>$11::TEXT,
          changeuser=>$12::TEXT,
          detailid=>$13,
          charge1=>$14,
          serviceid=>$15)`,
        [
          detail.spotTime,
          detail.startTime,
          detail.endTime,
          detail.instructions,
          detail.payment,
          detail.employeeId,
          detail.vehicleId,
          detail.fromLocationId,
          detail.toLocationId,
          detail.useFarmout,
          detail.companyId,
          detail.changeUser,
          detail.detailId,
          service.charge,
          service.serviceId,
        ]
      );

      return res.json(`Schedule updated successfully`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  }
}

module.exports = { Schedule };
