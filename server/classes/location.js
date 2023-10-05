const { v4: uuid } = require("uuid");
const pool = require("../db");

class Location {
  static async newLocation(location) {
    try {
      //generate a new id
      const newId = uuid();
      //insert the new location
      const newLocation = await pool.query(
        `INSERT INTO locations (location_id, location_name, address, city, location_state, zip, phone, fax)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          newId,
          location.name,
          location.address,
          location.city,
          location.state,
          location.zip,
          location.phone,
          location.fax,
        ]
      );
      console.log(newLocation.rowCount);
      //send the reponse to location
      return `Location ${newId} created`;
    } catch (err) {
      console.error(err);
      if (err) return { msg: err.message, detail: err.detail };
    }
  } //newLocation

  static async getLocations() {
    try {
      const result = await pool.query("Select * FROM locations");
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return "Query failed";
    }
  } //getLocations

  static async updateLocation(location) {
    try {
      const updatedLocation = await pool.query(
        "UPDATE locations SET location_name = $1, address = $2, city = $3, location_state = $4, zip = $5, phone = $6, fax = $7 WHERE location_id = $8",
        [
          location.name,
          location.address,
          location.city,
          location.state,
          location.zip,
          location.phone,
          location.fax,
          location.id,
        ]
      );
      if (updatedLocation.rowCount) return `Location ${location.name} updated`;
      else return { failed: "Failed to update location" };
    } catch (err) {
      console.error(err);
      if (err) return { failed: `Error: ${err.message}` };
    }
  } //updateLocation

  static async deleteLocation(locationIds) {
    try {
      const deletedLocations = await locationIds.map(async (location) => {
        return await pool.query(
          "DELETE from locations WHERE location_id = $1",
          [location]
        );
      });
      const deletedPromise = await Promise.all(deletedLocations);
      console.log(deletedPromise);
      if (deletedPromise[0].rowCount)
        return `Number of location(s) deleted: ${deletedPromise.length}`;
      else return { failed: "Failed to delete location" };
    } catch (err) {
      console.error(err);
      if (err) return { failed: `Error: ${err.message}` };
    }
  } //deleteLocation
}

module.exports = { Location };
