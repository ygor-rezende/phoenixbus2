const Pool = require("pg").Pool;
require("dotenv").config();
const os = require("os");

const pool = new Pool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.DBPORT,
  database:
    os.hostname().indexOf("LAPTOP") > -1
      ? process.env.DBTESTING
      : process.env.DBPRODUCTION,
});

// const pool = new Pool({
//   user: process.env.LOCALUSER,
//   password: process.env.LOCALPASSWORD,
//   host: process.env.HOST,
//   port: process.env.LOCALDBPORT,
//   database: process.env.LOCALDBNAME,
// });

// const query = async () => {
//   try {
//     const result = await pool.query("SELECT * FROM testusers");
//     console.log(result.rows);
//   } catch (err) {
//     console.error(err);
//   }
// };

// query();

module.exports = pool;
