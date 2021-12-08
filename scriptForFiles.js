let fs = require("fs");
const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
});

client.connect();

const testFolder = "/Users/macc/Downloads/tables/";
let fileList = [];

fs.readdir(testFolder, (err, files) => {
  files.map((file) => {
    if (file !== ".DS_Store") {
      fileList.push(file);
      console.log(file);
    }
  });
});

const query = {
  text: `COPY person FROM '/Users/macc/Downloads/tables/$1 DELIMITER ',' CSV HEADER;`,
  values: [fileList],
};

function callFolders() {
  client.query(query, (err, res) => {
    if (!err) {
      console.log(res.rows);
    } else {
      console.error(err.message, " is the err message");
    }
    client.end;
  });
}

callFolders();
