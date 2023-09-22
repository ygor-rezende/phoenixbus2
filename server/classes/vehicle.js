const { v4: uuid } = require("uuid");
const pool = require("../db");

class Vehicle {
  static async createVehicle(
    vehicleName,
    vehicleModel,
    vehicleYear,
    vehicleColor
  ) {
    try {
      //generate a new id
      const newId = uuid();
      //insert the new vehicle
      const newVehicle = await pool.query(
        `INSERT INTO vehicles (vehicle_id, vehicle_name, vehicle_model, vehicle_year, vehicle_color) VALUES ($1, $2, $3, $4, $5)`,
        [newId, vehicleName, vehicleModel, vehicleYear, vehicleColor]
      );
      console.log(newVehicle.rowCount);
      //send the reponse to client
      return `Vehicle ${vehicleName} created`;
    } catch (err) {
      console.error(err);
      if (err) return { detail: err.detail };
    }
  } //createVehicle

  static async getAllVehicles() {
    try {
      const result = await pool.query("Select * FROM vehicles");
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return "Query failed";
    }
  } //getAllVehicles

  static async deleteVehicle(vehicleIds) {
    try {
      const deletedVehicles = [];
      vehicleIds.forEach(async (vehicle) => {
        const deletedVehicle = await pool.query(
          "DELETE from vehicles WHERE vehicle_id = $1",
          [vehicle]
        );
        deletedVehicles.push(deletedVehicle);
      });
      return "Vechicle(s) deleted";
    } catch (err) {
      console.error(err);
      if (err) return { detail: err.detail };
    }
  } //deleteVehicle

  static async updateVehicle(vehicle) {
    try {
      const updatedVehicle = await pool.query(
        "UPDATE vehicles SET vehicle_name = $1, vehicle_model = $2, vehicle_year = $3, vehicle_color = $4 WHERE vehicle_id = $5",
        [vehicle.name, vehicle.model, vehicle.year, vehicle.color, vehicle.id]
      );
      if (updatedVehicle.rowCount >= 0)
        return `Updated: ${updatedVehicle.rows}`;
    } catch (err) {
      console.error(err);
      if (err) return { detail: err.detail };
    }
  } //updateVehicle
}

module.exports = { Vehicle };
