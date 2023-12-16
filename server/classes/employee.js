const { v4: uuid } = require("uuid");
const pool = require("../db");

class Employee {
  static async newEmployee(employee) {
    try {
      //generate a new id
      const newId = uuid();
      //insert the new employee
      const newEmployee = await pool.query(
        `INSERT INTO employees (employee_id, firstname, lastname, birth, title, hire_date, address, city, state, zip, phone, email, medical_card, i9, drug_free, drive_license_exp_date, it_number, national_reg, experience, cdl_tag, insurance, insurance_exp_date, mc, point_contact, emergency_contact, marital_status, notes)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)`,
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
        ]
      );
      console.log(newEmployee.rowCount);
      //send the reponse
      return `Employee ${newId} created`;
    } catch (err) {
      console.error(err);
      if (err) return { msg: err.message, detail: err.detail };
    }
  } //newEmployee

  static async getAllEmployees() {
    try {
      const result = await pool.query("Select * FROM employees");
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return "Query failed";
    }
  } //getAllEmployees

  static async updateEmployee(employee) {
    try {
      const updatedEmployee = await pool.query(
        "UPDATE employees SET firstname = $1, lastname = $2, birth = $3, title = $4, hire_date = $5, address = $6, city = $7, state = $8, zip = $9, phone = $10, email = $11, medical_card = $12, i9 = $13, drug_free = $14, drive_license_exp_date = $15, it_number = $16, national_reg = $17, experience = $18, cdl_tag = $19, insurance = $20, insurance_exp_date = $21, mc = $22, point_contact = $23, emergency_contact = $24, marital_status = $25, notes = $26  WHERE employee_id = $27",
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
          employee.id,
        ]
      );
      if (updatedEmployee.rowCount) return `Employee ${employee.id} updated`;
      else return { failed: "Failed to update employee" };
    } catch (err) {
      console.error(err);
      if (err) return { failed: `Error: ${err.message}` };
    }
  } //updateEmployee

  static async deleteEmployee(employeeIds) {
    try {
      const deletedEmployees = await employeeIds.map(async (employee) => {
        return await pool.query(
          "DELETE from employees WHERE employee_id = $1",
          [employee]
        );
      });
      const deletedPromise = await Promise.all(deletedEmployees);
      console.log(deletedPromise);
      if (deletedPromise[0].rowCount)
        return `Number of employees deleted: ${deletedPromise.length}`;
      else return { failed: "Failed to delete employee" };
    } catch (err) {
      console.error(err);
      if (err) return { failed: `Error: ${err.message}` };
    }
  } //deleteEmployee

  static async getAllEmployeeNames() {
    try {
      const result = await pool.query(
        "Select employee_id, firstname, lastname FROM employees"
      );
      //console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return "Query failed";
    }
  } //getAllEmployeeNames
}

module.exports = { Employee };
