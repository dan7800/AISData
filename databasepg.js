const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
});

client.connect();

client.query(`Select count(*) from february.feb`, (err, res) => {
  if (!err) {
    console.log(res.rows);
  } else {
    console.error(err.message, " is the err message");
  }
  client.end;
});
