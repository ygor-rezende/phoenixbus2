const { Client } = require("pg");
const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "mydatabasesqlpass",
  database: "postgres",
});

await client.connect();

client.query("Select * from testusers", (res, err) => {
  if (!err) {
    console.log(res.rows);
  } else {
    console.log(err.message);
  }
  client.end;
});
