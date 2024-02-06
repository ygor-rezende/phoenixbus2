const { v4: uuid } = require("uuid");
const pool = require("../db");

class Location {
  static async newLocation(req, res) {
    try {
      const { location } = req.body;
      if (!location)
        return res
          .status(400)
          .json({ message: "Bad request: Location information is required" });

      //generate a new id
      const newId = uuid();
      //insert the new location
      await pool.query(
        `CALL create_location(location_id => '${newId}'::TEXT, location_name => '${location.name}'::TEXT, address => '${location.address}'::TEXT, city => '${location.city}'::TEXT, location_state => '${location.state}'::TEXT, zip => '${location.zip}'::TEXT, phone => '${location.phone}'::TEXT, fax => '${location.fax}'::TEXT)`
      );

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
    try {
      const { location } = req.body;
      if (!location)
        return res
          .status(400)
          .json({ message: "Bad request: Location information is required" });

      await pool.query(
        `CALL update_location(locationId => '${location.id}'::TEXT, locationName => '${location.name}'::TEXT, address1 => '${location.address}'::TEXT, city1 => '${location.city}'::TEXT, locationState => '${location.state}'::TEXT, zip1 => '${location.zip}'::TEXT, phone1 => '${location.phone}'::TEXT, fax1 => '${location.fax}'::TEXT)`
      );

      return res.json(`Location ${location.name} updated`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //updateLocation

  static async deleteLocation(req, res) {
    const client = await pool.connect();

    try {
      let { locationIds } = req.params;
      locationIds = JSON.parse(locationIds);
      if (!locationIds)
        return res
          .status(400)
          .json({ message: "Bad request: Missing location id" });

      await client.query("BEGIN");
      const deletedLocations = await locationIds.map(async (location) => {
        await client.query(
          `CALL delete_location(locationId => '${location}'::TEXT)`
        );
        return 1;
      });
      const deletedPromise = await Promise.all(deletedLocations);
      await client.query("COMMIT");
      return res.json(
        `Number of location(s) deleted: ${deletedPromise.length}`
      );
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(err);
      return res.status(500).json({ message: err.message });
    } finally {
      client.release();
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
    try {
      const { locationId } = req.params;
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
