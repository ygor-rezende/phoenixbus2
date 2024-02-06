const newVehicle = await pool.query(
 `INSERT INTO vehicles (vehicle_id, vehicle_name, vehicle_model, vehicle_year, vehicle_color) VALUES ($1, $2, $3, $4, $5)`,
    [newId, vehicleName, vehicleModel, vehicleYear, vehicleColor]);