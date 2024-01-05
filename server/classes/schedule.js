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
                s.charge,
                d.spot_time,
                d.start_time,
                d.end_time,
                d.service_type,
                d.instructions,
                d.payment,
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
        [newDates.startDate, newEndDate]
      );
      console.log(result.rowCount);
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  }
}

module.exports = { Schedule };
