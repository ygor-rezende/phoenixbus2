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

module.exports = pool;
