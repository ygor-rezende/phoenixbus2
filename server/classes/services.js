const pool = require("../db");

class Service {
  static async newService(req, res) {
    try {
      const { service } = req.body;
      if (!service)
        return res
          .status(400)
          .json({ message: "Bad request: Service information is required" });

      //insert the new Service
      const newService = await pool.query(
        `CALL create_service(booking_id => $1::TEXT, 
          service_name => $2::TEXT, 
          service_code => $3::TEXT, 
          service_date => $4::TEXT, 
          qty => $5, 
          charge => $6, 
          sales_tax => $7, 
          gratuity => $8, 
          change_user => $9::TEXT)
          `,
        [
          service.bookingId,
          service.serviceName,
          service.service_code,
          service.service_date,
          service.qty,
          service.charge,
          service.salesTax,
          service.gratuity,
          service.changeUser,
        ]
      );

      //get the latest id created
      const response = await pool.query(
        `SELECT service_id FROM services ORDER BY service_id DESC LIMIT 1`
      );

      let lastServiceId = response.rows?.at(0);
      //send the reponse to booking
      return res.status(201).json(lastServiceId.service_id);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //newService

  static async getAllServices() {
    try {
      const result = await pool.query(
        "Select * FROM services ORDER BY service_id ORDER BY service_date"
      );
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getAllServices

  static async getServices(req, res) {
    const { invoice } = req.params;
    if (!invoice)
      return res
        .status(400)
        .json({ message: "Bad request: Missing invoice information" });
    try {
      const result = await pool.query(
        "Select * FROM services WHERE booking_id = $1 ORDER BY service_date",
        [invoice]
      );
      //console.log(result.rows);
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //getAllServices

  static async updateService(req, res) {
    try {
      const { service } = req.body;
      if (!service)
        return res
          .status(400)
          .json({ message: "Bad request: Service information is required" });

      const updatedService = await pool.query(
        `CALL update_service(serviceid => $1, 
          bookingid => $2::TEXT,
          servicename => $3::TEXT, 
          servicecode => $4::TEXT, 
          servicedate => $5::TEXT, 
          qty1 => $6, 
          charge1 => $7, 
          salestax => $8, 
          gratuity1 => $9, 
          changeuser => $10)`,
        [
          service.serviceId,
          service.bookingId,
          service.serviceName,
          service.serviceCode,
          service.serviceDate,
          service.qty,
          service.charge,
          service.salesTax,
          service.gratuity,
          service.changeUser,
        ]
      );
      return res.json(`Service ${service.serviceName} updated`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //updateService

  static async deleteService(req, res) {
    const client = await pool.connect();

    try {
      const { serviceid, changeUser } = req.params;
      if (!serviceid)
        return res
          .status(400)
          .json({ message: "Bad request: Missing service id" });

      await client.query("BEGIN");
      const deletedService = await client.query(
        "CALL delete_service(serviceid => $1, changeuser => $2::TEXT)",
        [serviceid, changeUser]
      );
      await client.query("COMMIT");
      return res.json(`Service ${serviceid} deleted`);
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(err);
      return res.status(500).json({ message: err.message });
    } finally {
      client.release();
    }
  } //deleteService

  static async deleteSomeServices(req, res) {
    const client = await pool.connect();

    try {
      let { serviceIds, changeUser } = req.params;
      serviceIds = JSON.parse(serviceIds);
      if (!serviceIds)
        return res
          .status(400)
          .json({ message: "Bad request: Missing service id" });

      await client.query("BEGIN");
      const deletedServices = await serviceIds.map(async (service) => {
        return await client.query(
          "CALL delete_service(serviceid => $1, changeuser => $2::TEXT)",
          [service, changeUser]
        );
      });
      const deletedPromise = await Promise.all(deletedServices);
      await client.query("COMMIT");
      return res.json(`Number of services deleted: ${deletedPromise.length}`);
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(err);
      return res.status(500).json({ message: err.message });
    } finally {
      client.release();
    }
  } //deleteSomeServices

  static async duplicateService(req, res) {
    const client = await pool.connect();
    try {
      let { serviceId, dates, changeUser } = req.body;
      dates = JSON.parse(dates);

      if (!serviceId || !dates || !changeUser)
        return res
          .status(400)
          .json({ message: "Bad request: Missing service id" });

      //start transaction
      await client.query("BEGIN");
      //find details for the service
      let response = await client.query(
        `SELECT * FROM service_details WHERE service_id = '${serviceId}'`
      );
      const details = response.rows;

      //get current service data
      response = await client.query(
        `SELECT * FROM services WHERE service_id = '${serviceId}'`
      );
      const service = response.rows?.at(0);

      //create service and details for each service date requested
      let counter = 1;
      for (let date of dates) {
        counter += 1;
        //create service
        await client.query(
          `CALL create_service(booking_id => $1::TEXT, 
            service_name => $2::TEXT, 
            service_code => $3::TEXT, 
            service_date => $4::TEXT, 
            qty => $5, 
            charge => $6, 
            sales_tax => $7, 
            gratuity => $8, 
            change_user => $9::TEXT)
            `,
          [
            service.booking_id,
            service.service_name + " Day " + counter,
            service.service_code,
            date,
            service.qty,
            service.charge,
            service.sales_tax,
            service.gratuity,
            changeUser,
          ]
        );

        if (details.length > 0) {
          //read the service Id that was created
          response = await client.query(
            "SELECT service_id FROM services ORDER BY service_id DESC LIMIT 1"
          );
          let lastServiceId = response.rows?.at(0);

          //Get the date portion to new details
          const datePart = date?.substring(0, 10);

          //create details for the new service
          for (let detail of details) {
            //Get the time portion to set spot, start, end and return time
            const spot = detail.spot_time?.substring(11) || "";
            const start = detail.start_time?.substring(11) || "";
            const end = detail.end_time?.substring(11) || "";
            const returnTime = detail.end_time?.substring(11) || "";

            //Join date and time
            const newSpot = datePart.concat("T", spot);
            const newStart = datePart.concat("T", start);
            const newEnd = end ? datePart.concat("T", end) : null;
            const newReturn = returnTime
              ? datePart.concat("T", returnTime)
              : null;

            //create the detail
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
            change_user => $20::TEXT)`,
              [
                lastServiceId.service_id,
                detail.employee_id,
                detail.company_id,
                detail.vehicle_id,
                detail.from_location_id,
                detail.to_location_id,
                detail.return_location_id,
                detail.use_farmout,
                newSpot,
                newStart,
                newEnd,
                newReturn,
                detail.instructions,
                detail.payment,
                detail.gratuity,
                detail.additional_stop,
                detail.additional_stop_info,
                detail.additional_stop_detail,
                detail.trip_length,
                changeUser,
              ]
            );
          }
        }
      }
      //End transaction
      await client.query("COMMIT");
      return res.json(`Service ${service.service_name} duplicated.`);
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(err);
      return res.status(500).json({ message: err.message });
    } finally {
      client.release();
    }
  } //duplicateService
}

module.exports = { Service };
