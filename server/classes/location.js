const { v4: uuid } = require("uuid");
const pool = require("../db");

class Location {
  static async newLocation(req, res) {
    const { location } = req.body;
    if (!location)
      return res
        .status(400)
        .json({ message: "Bad request: Location information is required" });

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
      return res.status(201).json(`Location ${location.name} created`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //newLocation

  static async getLocations() {
    try {
      const result = await pool.query("Select * FROM locations");
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getLocations

  static async updateLocation(req, res) {
    const { location } = req.body;
    if (!location)
      return res
        .status(400)
        .json({ message: "Bad request: Location information is required" });
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
      if (updatedLocation.rowCount)
        return res.json(`Location ${location.name} updated`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //updateLocation

  static async deleteLocation(req, res) {
    let { locationIds } = req.params;
    locationIds = JSON.parse(locationIds);
    if (!locationIds)
      return res
        .status(400)
        .json({ message: "Bad request: Missing location id" });
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
        return res.json(
          `Number of location(s) deleted: ${deletedPromise.length}`
        );
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //deleteLocation

  static async getAllLocationNames() {
    try {
      const result = await pool.query(
        "Select location_id, location_name FROM locations"
      );
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getAllLocationNames

  static async getLocationById(req, res) {
    const { locationId } = req.params;
    try {
      const result = await pool.query(
        "Select * from locations WHERE location_id = $1",
        [locationId]
      );
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  }
}

module.exports = { Location };
