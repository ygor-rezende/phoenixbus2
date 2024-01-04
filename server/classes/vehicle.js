const { v4: uuid } = require("uuid");
const pool = require("../db");

class Vehicle {
  static async createVehicle(req, res) {
    const { vehicleName, vehicleModel, vehicleYear, vehicleColor } = req.body;
    if (!vehicleColor || !vehicleModel || !vehicleName || !vehicleYear)
      return res
        .status(400)
        .json({ message: "All vehicle information is required." });

    try {
      //generate a new id
      const newId = uuid();
      //insert the new vehicle
      const newVehicle = await pool.query(
        `INSERT INTO vehicles (vehicle_id, vehicle_name, vehicle_model, vehicle_year, vehicle_color) VALUES ($1, $2, $3, $4, $5)`,
        [newId, vehicleName, vehicleModel, vehicleYear, vehicleColor]
      );
      //console.log(newVehicle.rowCount);
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
    let { vehicleIds } = req.params;
    vehicleIds = JSON.parse(vehicleIds);
    if (!vehicleIds)
      return res.status(400).json({ message: "No vehicle was selected" });
    try {
      const deletedVehicles = await vehicleIds.map(async (vehicle) => {
        return await pool.query("DELETE from vehicles WHERE vehicle_id = $1", [
          vehicle,
        ]);
      });
      const deletedPromise = await Promise.all(deletedVehicles);
      if (deletedPromise[0]?.rowCount)
        return res.json(`Number of vehicles deleted: ${deletedPromise.length}`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //deleteVehicle

  static async updateVehicle(req, res) {
    const { vehicle } = req.body;

    if (!vehicle)
      return res
        .status(400)
        .json({ message: "Bad request: No vehicle info provided" });

    try {
      const updatedVehicle = await pool.query(
        "UPDATE vehicles SET vehicle_name = $1, vehicle_model = $2, vehicle_year = $3, vehicle_color = $4 WHERE vehicle_id = $5",
        [vehicle.name, vehicle.model, vehicle.year, vehicle.color, vehicle.id]
      );
      if (updatedVehicle.rowCount)
        return res.json(`Vehicle ${vehicle.name} updated`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //updateVehicle

  static async getAllVehicleNames() {
    try {
      const result = await pool.query(
        "Select vehicle_id, vehicle_name FROM vehicles"
      );
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getAllVehicleNames

  static async getVehicleById(req, res) {
    const { vehicleId } = req.params;
    if (!vehicleId)
      return res
        .status(400)
        .json({ message: "Bad request: Missing vehicle id" });
    try {
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
