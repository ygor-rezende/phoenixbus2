const { v4: uuid } = require("uuid");
const pool = require("../db");

class Vehicle {
  static async createVehicle(req, res) {
    try {
      const {
        vehicleName,
        vehicleModel,
        vehicleYear,
        vehicleColor,
        vin,
        capacity,
        tag,
        maintenance,
        ada,
      } = req.body;

      if (!vehicleColor || !vehicleModel || !vehicleName || !vehicleYear)
        return res
          .status(400)
          .json({ message: "Missing required vehicle information." });

      //generate a new id
      const newId = uuid();
      //insert the new vehicle
      await pool.query(
        `CALL create_vehicle(vehicle_id => '${newId}'::TEXT, vehicle_name => '${vehicleName}'::TEXT, vehicle_model => '${vehicleModel}'::TEXT, vehicle_year => ${vehicleYear}, vehicle_color => '${vehicleColor}'::TEXT, vin => '${vin}'::TEXT, capacity => ${capacity}, tag => '${tag}'::TEXT, maintenance => ${maintenance}, ada => ${ada})`
      );

      //send the reponse to client
      return res.status(201).json(`Vehicle ${vehicleName} created`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //createVehicle

  static async getAllVehicles() {
    try {
      const result = await pool.query("Select * FROM vehicles");
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getAllVehicles

  static async deleteVehicle(req, res) {
    const client = await pool.connect();

    try {
      let { vehicleIds } = req.params;
      vehicleIds = JSON.parse(vehicleIds);

      if (!vehicleIds)
        return res.status(400).json({ message: "No vehicle was selected" });

      await client.query("BEGIN");
      const deletedVehicles = await vehicleIds.map(async (vehicle) => {
        await client.query(
          `CALL delete_vehicle(vehicleId=> '${vehicle}'::TEXT)`
        );
        return 1;
      });
      const deletedPromise = await Promise.all(deletedVehicles);
      await client.query("COMMIT");
      return res.json(`Number of vehicles deleted: ${deletedPromise.length}`);
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(err);
      return res.status(500).json({ message: err.message });
    } finally {
      client.release();
    }
  } //deleteVehicle

  static async updateVehicle(req, res) {
    try {
      const { vehicle } = req.body;

      if (!vehicle)
        return res
          .status(400)
          .json({ message: "Bad request: No vehicle info provided" });

      await pool.query(
        `CALL update_vehicle(vehicleId => '${vehicle.id}'::TEXT, vehicleName => '${vehicle.name}'::TEXT, vehicleModel => '${vehicle.model}'::TEXT, vehicleYear => ${vehicle.year}, vehicleColor => '${vehicle.color}'::TEXT, vin1 => '${vehicle.vin}'::TEXT, capacity1 => ${vehicle.capacity}, tag1 => '${vehicle.tag}'::TEXT, maintenance1 => ${vehicle.maintenance}, ada1 => ${vehicle.ada})`
      );

      return res.json(`Vehicle ${vehicle.name} updated`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //updateVehicle

  static async getAllVehicleNames() {
    try {
      const result = await pool.query(
        "Select vehicle_id, vehicle_name FROM vehicles WHERE maintenance = false"
      );
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getAllVehicleNames

  static async getVehicleById(req, res) {
    try {
      const { vehicleId } = req.params;
      if (!vehicleId)
        return res
          .status(400)
          .json({ message: "Bad request: Missing vehicle id" });

      const result = await pool.query(
        "Select * from vehicles WHERE vehicle_id = $1",
        [vehicleId]
      );
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  }
}

module.exports = { Vehicle };
