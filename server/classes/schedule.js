const pool = require("../db");

class Schedule {
  static async getSchedule(startDate, endDate) {
    try {
      let newEndDate = new Date(endDate);
      newEndDate.setDate(newEndDate.getDate() + 1);
      newEndDate = newEndDate.toISOString().slice(0, 10);
      const result = await pool.query(
        `select 
                b.invoice,
                s.charge,
                d.spot_time,
                d.start_time,
                d.end_time,
                d.service_type,
                d.instructions,
                e.firstname,
                e.lastname,
                v.vehicle_name,
                lf.location_name as from_location,
                lf.city as from_city,
                lt.location_name as to_location,
                lt.city as to_city
                from bookings b join services s on b.invoice = s.booking_id
                join service_details d on d.service_id = s.service_id
                join employees e on e.employee_id = d.employee_id
                join vehicles v on v.vehicle_id = d.vehicle_id
                join locations lf on lf.location_id = d.from_location_id
                join locations lt on lt.location_id = d.to_location_id
                WHERE s.service_date >= $1 AND s.service_date < $2`,
        [startDate, newEndDate]
      );
      console.log(result.rowCount);
      return result.rows;
    } catch (err) {
      console.error(err);
      if (err) return { msg: err.message, detail: err.detail };
    }
  }
}

module.exports = { Schedule };
