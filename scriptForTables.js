// require pg and what not to create client.query...
// grab the file and table
// use the copy x demiliter command to copy the file into the table...

const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
});

client.connect();
let name = "Node";
// This does the copying direclty from my machine, so how do we automate the process now ?
client.query(
  `COPY person FROM '/Users/macc/Downloads/person3.csv' DELIMITER ',' CSV HEADER;`,
  (err, res) => {
    if (!err) {
      console.log(res.rows);
    } else {
      console.error(err.message, " is the err message");
    }
    client.end;
  }
);

client.query(
  `SELECT * FROM person WHERE first_name = $1`,
  [name],
  (err, res) => {
    if (!err) {
      console.log(res.rows);
    } else {
      console.error(err.message, " is the err message");
    }
    client.end;
  }
);
