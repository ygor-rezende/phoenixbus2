const { v4: uuid } = require("uuid");
const pool = require("../db");

class Employee {
  static async newEmployee(req, res) {
    try {
      const { employee } = req.body;
      if (!employee)
        return res
          .status(400)
          .json({ message: "Bad request: Employee information is required" });

      //generate a new id
      const newId = uuid();
      //insert the new employee
      const newEmployee = await pool.query(
        `CALL create_employee(employee_id => $1::TEXT, 
          firstname => $2::TEXT, 
          lastname => $3::TEXT, 
          birth => $4::TEXT, 
          title => $5::TEXT, 
          hire_date => $6::TEXT, 
          address => $7::TEXT, 
          city => $8::TEXT, 
          state => $9::TEXT, 
          zip => $10::TEXT, 
          phone => $11::TEXT, 
          email => $12::TEXT, 
          medical_card => $13::BOOLEAN, 
          i9 => $14::BOOLEAN, 
          drug_free => $15::BOOLEAN, 
          drive_license_exp_date => $16::TEXT, 
          it_number => $17::TEXT, 
          national_reg => $18::TEXT, 
          experience => $19::TEXT, 
          cdl_tag => $20::TEXT, 
          insurance => $21::TEXT, 
          insurance_exp_date => $22::TEXT, 
          mc => $23::TEXT, 
          point_contact => $24::TEXT, 
          emergency_contact => $25::TEXT, 
          marital_status => $26::TEXT, 
          notes => $27::TEXT, 
          user_id => $28::TEXT,
          change_user => $29::TEXT)
          `,
        [
          newId,
          employee.firstname,
          employee.lastname,
          employee.birth,
          employee.title,
          employee.hireDate,
          employee.address,
          employee.city,
          employee.state,
          employee.zip,
          employee.phone,
          employee.email,
          employee.medicalCard,
          employee.i9,
          employee.drugFree,
          employee.driverLicenceExpDate,
          employee.it,
          employee.nationalReg,
          employee.experience,
          employee.cldTag,
          employee.insurance,
          employee.insuranceExpDate,
          employee.mc,
          employee.pointOfContact,
          employee.emergencyContact,
          employee.maritalStatus,
          employee.notes,
          employee.username,
          employee.changeUser,
        ]
      );
      //send the reponse
      return res.status(201).json(`Employee ${employee.firstname} created`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //newEmployee

  static async getAllEmployees() {
    try {
      const result = await pool.query(
        "Select * FROM employees ORDER BY firstname, lastname"
      );
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getAllEmployees

  static async updateEmployee(req, res) {
    const { employee } = req.body;
    if (!employee)
      return res
        .status(400)
        .json({ message: "Bad request: Employee information is required" });
    try {
      const updatedEmployee = await pool.query(
        `CALL update_employee(
          firstname1 => $1::TEXT,
          lastname1 => $2::TEXT,
          birth1 => $3::TEXT,
          title1 => $4::TEXT,
          hiredate => $5::TEXT,
          address1 => $6::TEXT,
          city1 => $7::TEXT,
          state1 => $8::TEXT,
          zip1 => $9::TEXT,
          phone1 => $10::TEXT,
          email1 => $11::TEXT,
          medicalcard => $12,
          i91 => $13,
          drugfree => $14,
          drivelicenseexpdate => $15::TEXT,
          itnumber => $16::TEXT,
          nationalreg => $17::TEXT,
          experience1 => $18::TEXT,
          cdltag => $19::TEXT,
          insurance1 => $20::TEXT,
          insuranceexpdate => $21::TEXT,
          mc1 => $22::TEXT,
          pointcontact => $23::TEXT,
          emergencycontact => $24::TEXT,
          maritalstatus => $25::TEXT,
          notes1 => $26::TEXT,
          userid => $27::TEXT,
          changeuser => $28::TEXT,
          employeeid => $29::TEXT)
          `,
        [
          employee.firstname,
          employee.lastname,
          employee.birth,
          employee.title,
          employee.hireDate,
          employee.address,
          employee.city,
          employee.state,
          employee.zip,
          employee.phone,
          employee.email,
          employee.medicalCard,
          employee.i9,
          employee.drugFree,
          employee.driverLicenceExpDate,
          employee.it,
          employee.nationalReg,
          employee.experience,
          employee.cldTag,
          employee.insurance,
          employee.insuranceExpDate,
          employee.mc,
          employee.pointOfContact,
          employee.emergencyContact,
          employee.maritalStatus,
          employee.notes,
          employee.username,
          employee.changeUser,
          employee.id,
        ]
      );
      return res.json(`Employee ${employee.firstname} updated`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //updateEmployee

  static async deleteEmployee(req, res) {
    const client = await pool.connect();

    try {
      let { employeeIds, changeUser } = req.params;
      employeeIds = JSON.parse(employeeIds);
      if (!employeeIds)
        return res
          .status(400)
          .json({ message: "Bad request: Missing employee id" });

      await client.query("BEGIN");

      const deletedEmployees = await employeeIds.map(async (employee) => {
        return await client.query(
          "CALL delete_employee(employeeId => $1::TEXT, changeuser => $2::TEXT)",
          [employee, changeUser]
        );
      });

      const deletedPromise = await Promise.all(deletedEmployees);
      await client.query("COMMIT");
      return res.json(`Number of employees deleted: ${deletedPromise.length}`);
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(err);
      return res.status(500).json({ message: err.message });
    } finally {
      client.release();
    }
  } //deleteEmployee

  static async getAllEmployeeNames() {
    try {
      const result = await pool.query(
        "Select employee_id, firstname, lastname FROM employees ORDER BY firstname, lastname"
      );
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getAllEmployeeNames

  static async getSalesPeople() {
    try {
      const result = await pool.query(
        "Select employee_id, firstname || ' ' || lastname as fullname FROM employees WHERE title = 'Sales' ORDER BY firstname, lastname"
      );
      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getSalesPeople

  static async getDrivers() {
    try {
      const result = await pool.query(
        "Select employee_id, firstname || ' ' || lastname as fullname FROM employees WHERE title = 'Driver' ORDER BY firstname, lastname"
      );
      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getDrivers

  static async getEmployeeById(req, res) {
    const { employeeId } = req.params;
    if (!employeeId)
      return res
        .status(400)
        .json({ message: "Bad request: Missing employee id" });
    try {
      const result = await pool.query(
        "Select * from employees WHERE employee_id = $1",
        [employeeId]
      );
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  }
}

module.exports = { Employee };
