// require pg and what not to create client.query...
// grab the file and table
// use the copy x demiliter command to copy the file into the table...

/**
 * TODO
 * use env to encrypt all credentials...
 */

const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
});

async function connectDB() {
  try {
    await client.connect();
  } catch (error) {
    console.log("db not connected");
  }
}

async function copyDataToDB(tablename, file) {
  try {
    await createTableifNotInExistence(tablename);
    await client.query(
      `COPY ${tablename} FROM '/Users/macc/Downloads/${file}.csv' DELIMITER ',' CSV HEADER;`
    );
  } catch (error) {
    console.error("data not copied");
  }
}

async function createTableifNotInExistence(tableName) {
  try {
    await client.query(
      `create table ${tableName}(
    id bigserial primary key,
    first_name       varchar(50) not null,
    last_name        varchar(50) not null,
    email            varchar(150),
    gender           varchar(50) not null,
    date_of_birth    date        not null,
    country_of_birth varchar(50) not null
);
      `
    );
  } catch (error) {
    console.error(error);
    console.error("table not created");
  }
}

async function doAll() {
  try {
    await connectDB();
    await copyDataToDB("january_2020", "2020_01");
  } catch (error) {
    console.error("e no do");
  }
}

doAll()
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.log(err);
  });

// function getData
// let name = "Node";
// client.query(
//   `SELECT * FROM person WHERE first_name = $1`,
//   [name],
//   (err, res) => {
//     if (!err) {
//       console.log(res.rows);
//     } else {
//       console.error(err.message, " is the err message");
//     }
//     client.end;
//   }
// );
